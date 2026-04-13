import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/admin/login");
    }

    const { id } = await params;

    await connectDB();
    const project = await Project.findById(id).lean();

    if (!project) {
        notFound();
    }

    const serializedProject = JSON.parse(JSON.stringify(project));

    return (
        <div className="min-h-screen bg-surface/50 pt-24 pb-24">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/admin/projects"
                        className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold font-display">
                        Edit <span className="text-primary">Project</span>
                    </h1>
                </div>

                <div className="mt-8">
                    <ProjectForm initialData={serializedProject} />
                </div>
            </div>
        </div>
    );
}
