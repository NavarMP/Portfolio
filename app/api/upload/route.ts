import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToLocal, deleteFromLocal, getFileType } from "@/lib/localUpload";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "content-type": "application/json" } }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "general";

        if (!file) {
            return new NextResponse(
                JSON.stringify({ error: "No file provided" }),
                { status: 400, headers: { "content-type": "application/json" } }
            );
        }

        // Validate file type before processing
        try {
            getFileType(file.type);
        } catch (error: any) {
            return new NextResponse(
                JSON.stringify({ error: error.message }),
                { status: 400, headers: { "content-type": "application/json" } }
            );
        }

        const result = await uploadToLocal(file, folder);

        return NextResponse.json({ 
            url: result.url,
            filename: result.filename,
            type: result.type
        });
    } catch (error: any) {
        console.error("[UPLOAD_POST]", error);
        
        const errorMessage = error.message || "Failed to upload file";
        return new NextResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "content-type": "application/json" } }
            );
        }

        const { url, folder } = await req.json();
        if (!url) {
            return new NextResponse(
                JSON.stringify({ error: "No URL provided" }),
                { status: 400, headers: { "content-type": "application/json" } }
            );
        }

        const folderName = folder || "general";
        const success = deleteFromLocal(url, folderName);
        
        if (success) {
            return NextResponse.json({ message: "File deleted successfully" });
        }
        
        return new NextResponse(
            JSON.stringify({ error: "File not found or failed to delete" }),
            { status: 404, headers: { "content-type": "application/json" } }
        );
    } catch (error: any) {
        console.error("[UPLOAD_DELETE]", error);
        
        const errorMessage = error.message || "Failed to delete file";
        return new NextResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}
