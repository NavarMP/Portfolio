import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import DeleteButton from "@/components/admin/DeleteButton";
import ArchiveButton from "@/components/admin/ArchiveButton";

export default async function AdminProjectsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/admin/login");
    }

    await connectDB();
    const projects = await Project.find()
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .lean();

    return (
        <div className="min-h-screen bg-surface/50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold font-display">
                            Manage <span className="text-primary">Projects</span>
                        </h1>
                    </div>
                    <Link
                        href="/admin/projects/new"
                        className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Project
                    </Link>
                </div>

                {/* Projects List */}
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project: any) => (
                        <div
                            key={project._id.toString()}
                            className="flex flex-col md:flex-row items-center gap-6 p-6 bg-surface rounded-3xl border border-outline/10 hover:border-primary/30 transition-all group"
                        >
                            {/* Image */}
                            <div className="relative w-full md:w-48 rounded-xl overflow-hidden bg-surface-variant/20 flex-shrink-0">
                                <img
                                    src={project.coverImage}
                                    alt={project.title}
                                    className="w-full h-auto object-contain"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{project.title}</h3>
                                    {project.featured && (
                                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                            Featured
                                        </span>
                                    )}
                                    {project.isArchived && (
                                        <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full">
                                            Archived
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-surface-variant text-on-surface-variant text-xs font-medium rounded-full">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-on-surface-variant text-sm line-clamp-2 md:line-clamp-1">
                                    {project.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <ArchiveButton
                                    id={project._id.toString()}
                                    isArchived={project.isArchived}
                                />
                                <Link
                                    href={`/admin/projects/${project._id.toString()}/edit`}
                                    className="p-3 rounded-xl bg-surface-variant/30 text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                                >
                                    <Pencil size={20} />
                                </Link>
                                {/* Delete button usually needs a client component or server action handling */}
                                <DeleteButton
                                    id={project._id.toString()}
                                    endpoint="/api/projects"
                                    confirmMessage={`Are you sure you want to delete "${project.title}"?`}
                                />
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="text-center py-24 bg-surface rounded-3xl border border-outline/10">
                            <p className="text-xl text-on-surface-variant">No projects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
