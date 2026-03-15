import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json().catch(() => ({}));
        const action = body.action || 'like'; // default to like if none provided

        await connectDB();

        let incValue = 1;
        if (action === 'unlike') {
            incValue = -1;
        }

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Prevent likes from dropping below zero
        if (action === 'unlike' && project.likes <= 0) {
            return NextResponse.json({ success: true, likes: project.likes });
        }

        project.likes += incValue;
        await project.save();

        return NextResponse.json({
            success: true,
            likes: project.likes,
        });
    } catch (error) {
        console.error("Error updating likes:", error);
        return NextResponse.json(
            { error: "Failed to update likes" },
            { status: 500 }
        );
    }
}
