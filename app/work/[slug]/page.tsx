// @ts-nocheck - Mongoose lean() typing issues with Next.js 15
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft, Calendar } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    await connectDB();
    const project = await Project.findOne({ slug }).lean();

    if (!project) {
        return {
            title: "Project Not Found - Muḥammed Navār",
        };
    }

    return {
        title: `${(project as any).title} - Muḥammed Navār`,
        description: (project as any).description,
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { slug } = await params;
    await connectDB();

    const projectData = await Project.findOne({ slug }).lean();

    if (!projectData) {
        notFound();
    }

    // Cast to any to avoid Mongoose typing issues
    const project = projectData as any;

    // Fetch related projects (same category, exclude current)
    const relatedProjects = await Project.find({
        category: project.category,
        _id: { $ne: projectData._id },
    })
        .limit(3)
        .lean();

    return (
        <div className="min-h-screen pt-24 pb-24">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
                <Link
                    href="/work"
                    className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Projects
                </Link>
            </div>

            {/* Hero Section with Cover Image */}
            <div className="relative h-[60vh] max-h-[600px] w-full overflow-hidden mb-16 bg-surface-variant/20">
                <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/50 via-background/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Project Header */}
                <div className="mb-16 animate-slide-in-left">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold font-display">{project.title}</h1>
                        {project.featured && (
                            <span className="px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-full">
                                Featured
                            </span>
                        )}
                        {project.isFreelance && (
                            <span className="px-4 py-2 bg-secondary/20 text-secondary text-sm font-medium rounded-full">
                                Freelance Project
                            </span>
                        )}
                    </div>

                    {project.client && (
                        <p className="text-xl text-on-surface-variant mb-4">
                            <span className="font-medium">Client:</span> {project.client}
                        </p>
                    )}

                    <p className="text-xl text-on-surface-variant leading-relaxed max-w-4xl">
                        {project.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                <ExternalLink size={20} />
                                View Live Site
                            </a>
                        )}
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-full bg-surface border-2 border-outline text-on-surface font-medium hover:border-primary transition-all flex items-center gap-2"
                            >
                                <Github size={20} />
                                View Repository
                            </a>
                        )}
                    </div>
                </div>

                {/* Tech Stack / Tools */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {project.category === "web-development" && project.techStack.length > 0 && (
                        <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                            <h3 className="text-2xl font-bold font-display mb-6">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.techStack.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.tools && project.tools.length > 0 && (
                        <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                            <h3 className="text-2xl font-bold font-display mb-6">Tools Used</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.tools.map((tool: string) => (
                                    <span
                                        key={tool}
                                        className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl font-medium"
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Media Gallery */}
                {project.media && project.media.length > 0 && (
                    <div className="mb-16 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-3xl font-bold font-display mb-8">Project Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.media.map((item: { type: string, url: string }, index: number) => (
                                <div
                                    key={index}
                                    className="relative aspect-video rounded-3xl overflow-hidden bg-surface-variant/20 border border-outline/10 group shadow-lg"
                                >
                                    {item.type === 'video' ? (
                                        <video
                                            src={item.url}
                                            controls
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={item.url}
                                            alt={`${project.title} - Gallery item ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                    <div>
                        <h3 className="text-3xl font-bold font-display mb-8">Related Projects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((related: any) => (
                                <Link
                                    key={related._id.toString()}
                                    href={`/work/${related.slug}`}
                                    className="group relative rounded-3xl overflow-hidden bg-surface border border-outline/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl"
                                >
                                    <div className="relative h-48 overflow-hidden bg-surface-variant/20">
                                        <Image
                                            src={related.coverImage}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold font-display group-hover:text-primary transition-colors">
                                            {related.title}
                                        </h4>
                                        <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">{related.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
