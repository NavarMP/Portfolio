import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const subcategory = searchParams.get("subcategory");
        const featured = searchParams.get("featured");

        const query: any = {};
        if (category && category !== "all") query.category = category;
        if (subcategory && subcategory !== "all") query.subcategory = subcategory;
        if (featured === "true") query.featured = true;

        const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Basic server validation
        if (!body.slug || !body.category) {
            return NextResponse.json({ error: "Missing required fields (slug, category)" }, { status: 400 });
        }

        const project = await Project.create(body);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
