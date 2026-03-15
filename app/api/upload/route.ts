import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

        // Validate file type (optional but recommended)
        // const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        // if (!validTypes.includes(file.type)) {
        //     return new NextResponse("Invalid file type", { status: 400 });
        // }

        const url = await uploadToCloudinary(file, folder);

        return NextResponse.json({ url });
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

        const { url } = await req.json();
        if (!url) {
            return new NextResponse("No URL provided", { status: 400 });
        }

        // We need to import the new utilities from lib/cloudinary
        const { extractPublicId, deleteFromCloudinary } = await import("@/lib/cloudinary");
        const publicId = extractPublicId(url);
        
        if (publicId) {
            const success = await deleteFromCloudinary(publicId);
            if (success) {
                return NextResponse.json({ message: "Deleted successfully" });
            }
        }

        return new NextResponse("Failed to delete from Cloudinary", { status: 400 });
    } catch (error) {
        console.error("[UPLOAD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
