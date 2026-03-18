import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToLocal, deleteFromLocal } from "@/lib/localUpload";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "navarmp-portfolio";

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        const result = await uploadToLocal(file, folder);

        return NextResponse.json({ url: result.url });
    } catch (error) {
        console.error("[UPLOAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { url, folder } = await req.json();
        if (!url) {
            return new NextResponse("No URL provided", { status: 400 });
        }

        const folderName = folder || 'navarmp-portfolio';
        const success = deleteFromLocal(url, folderName);
        if (success) {
            return NextResponse.json({ message: "Deleted successfully" });
        }
        return new NextResponse("Failed to delete local file", { status: 400 });
    } catch (error) {
        console.error("[UPLOAD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
