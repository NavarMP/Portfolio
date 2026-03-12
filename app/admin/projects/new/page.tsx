import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/admin/login");
    }

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
                        Add New <span className="text-primary">Project</span>
                    </h1>
                </div>

                <div className="mt-8">
                    <ProjectForm />
                </div>
            </div>
        </div>
    );
}
