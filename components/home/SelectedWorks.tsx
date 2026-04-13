"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Project {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    category: string;
    techStack: string[];
    tools: string[];
}

export function SelectedWorks() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeaturedProjects() {
            try {
                const res = await fetch("/api/projects?featured=true");
                const data = await res.json();
                // Limit to 2 projects for the homepage section if not already limited by API logic
                setProjects(data.slice(0, 2));
            } catch (error) {
                console.error("Failed to fetch featured projects:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedProjects();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface-variant/20 rounded-3xl h-64 animate-pulse" />
                <div className="bg-surface-variant/20 rounded-3xl h-64 animate-pulse" />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 bg-surface-variant/10 rounded-3xl border border-outline/10">
                <p className="text-on-surface-variant">No featured projects yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
                <Link
                    key={project._id}
                    href={`/work/${project.slug}`}
                    className="group rounded-3xl overflow-hidden bg-surface border border-outline/10 hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
                >
                    <div className="h-64 relative overflow-hidden bg-surface-variant/20">
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold mb-2 font-display group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-on-surface-variant mb-4 line-clamp-2">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(project.category === "web-development"
                                ? project.techStack
                                : project.tools
                            )?.slice(0, 3).map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 bg-surface-variant rounded-full text-xs font-medium text-on-surface-variant"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
