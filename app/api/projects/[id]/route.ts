import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        await connectDB();
        const project = await Project.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectDB();
        
        // Find the project first to get media URLs
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Delete local files
        const { deleteFromLocal } = await import("@/lib/localUpload");
        const urlsToDelete = [];
        
        if (project.coverImage) urlsToDelete.push(project.coverImage);
        if (project.media && Array.isArray(project.media)) {
            project.media.forEach((m: any) => {
                if (m.url) urlsToDelete.push(m.url);
            });
        }

        // Extract folder and delete each file
        for (const url of urlsToDelete) {
            const parts = url.split('/');
            if (parts.length >= 4) {
                const folder = parts[3]; // Extract folder from /api/media/{folder}/filename
                const success = deleteFromLocal(url, folder);
                if (!success) {
                    console.warn(`Failed to delete local file: ${url}`);
                }
            }
        }

        // Delete from MongoDB
        await Project.findByIdAndDelete(id);

        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
