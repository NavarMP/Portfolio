import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Resume } from "@/models/Resume";

interface SearchResult {
    type: "project" | "resume" | "skill";
    title: string;
    subtitle?: string;
    href: string;
    icon?: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const searchLower = query.toLowerCase();
        const results: SearchResult[] = [];

        // Search Projects
        await connectDB();
        const projects = await Project.find({
            isArchived: { $ne: true },
            $or: [
                { title: { $regex: searchLower, $options: "i" } },
                { description: { $regex: searchLower, $options: "i" } },
                { techStack: { $regex: searchLower, $options: "i" } },
                { tools: { $regex: searchLower, $options: "i" } },
                { category: { $regex: searchLower, $options: "i" } },
                { subcategory: { $regex: searchLower, $options: "i" } },
            ],
        }).limit(5);

        projects.forEach((project) => {
            results.push({
                type: "project",
                title: project.title,
                subtitle: project.category === "web-development" 
                    ? project.techStack.slice(0, 3).join(", ")
                    : project.tools.slice(0, 3).join(", "),
                href: `/work/${project.slug}`,
            });
        });

        // Search Resume (skills, experience titles)
        const resume = await Resume.findOne();
        if (resume) {
            // Search skills
            const allSkills = [
                ...(resume.skills?.design || []),
                ...(resume.skills?.development || []),
                ...(resume.skills?.tools || []),
            ];
            
            allSkills.forEach((skill) => {
                if (skill.toLowerCase().includes(searchLower)) {
                    results.push({
                        type: "skill",
                        title: skill,
                        subtitle: "Resume Skill",
                        href: "/resume",
                    });
                }
            });

            // Search experience titles
            resume.experience?.forEach((exp: any) => {
                if (exp.title.toLowerCase().includes(searchLower) || exp.company.toLowerCase().includes(searchLower)) {
                    results.push({
                        type: "resume",
                        title: exp.title,
                        subtitle: exp.company,
                        href: "/resume",
                    });
                }
            });

            // Search achievements
            resume.achievements?.forEach((ach: any) => {
                if (ach.title.toLowerCase().includes(searchLower)) {
                    results.push({
                        type: "skill",
                        title: ach.title,
                        subtitle: "Achievement",
                        href: "/resume",
                    });
                }
            });
        }

        // Deduplicate results
        const uniqueResults = results.filter((result, index, self) =>
            index === self.findIndex((r) => r.title === result.title && r.type === result.type)
        ).slice(0, 10);

        return NextResponse.json({ results: uniqueResults });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
