"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
    _id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    subcategory: string;
    client?: string;
    isFreelance: boolean;
    coverImage: string;
    techStack: string[];
    tools: string[];
    liveUrl?: string;
    repoUrl?: string;
    featured: boolean;
}

type AspectRatio = 'portrait' | 'square' | 'landscape';

interface ProjectWithRatio extends Project {
    aspectRatio?: AspectRatio;
    imageHeight?: number;
}

export default function WorkPage() {
    const [projects, setProjects] = useState<ProjectWithRatio[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
    const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());
    const projectRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

    useEffect(() => {
        async function fetchProjects() {
            try {
                const params = new URLSearchParams();
                if (activeCategory !== "all") params.set("category", activeCategory);
                if (activeSubcategory !== "all") params.set("subcategory", activeSubcategory);

                const res = await fetch(`/api/projects?${params}`);
                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, [activeCategory, activeSubcategory]);

    const getAspectRatio = useCallback((width: number, height: number): AspectRatio => {
        const ratio = width / height;
        if (ratio < 0.9) return 'portrait';
        if (ratio > 1.1) return 'landscape';
        return 'square';
    }, []);

    const handleImageLoad = useCallback((projectId: string, width: number, height: number) => {
        const ratio = getAspectRatio(width, height);
        setProjects(prev => prev.map(p => 
            p._id === projectId ? { ...p, aspectRatio: ratio, imageHeight: height } : p
        ));
    }, [getAspectRatio]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const projectId = entry.target.getAttribute('data-project-id');
                        if (projectId) {
                            setVisibleProjects(prev => new Set([...prev, projectId]));
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        projectRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [projects]);

    const getHeightClass = (aspectRatio?: AspectRatio) => {
        switch (aspectRatio) {
            case 'portrait': return 'h-80';
            case 'square': return 'h-64';
            case 'landscape': return 'h-48';
            default: return 'h-64';
        }
    };

    const categories = [
        { id: "all", label: "All Projects" },
        { id: "graphic-design", label: "Graphic Design" },
        { id: "web-development", label: "Web Development" },
    ];

    const subcategories = {
        "graphic-design": [
            { id: "all", label: "All" },
            { id: "logo-design", label: "Logo Design" },
            { id: "branding", label: "Branding" },
            { id: "marketing-materials", label: "Marketing" },
            { id: "social-media", label: "Social Media" },
            { id: "illustration", label: "Illustration" },
            { id: "print-design", label: "Print Design" },
        ],
        "web-development": [
            { id: "all", label: "All" },
            { id: "web-app", label: "Web App" },
            { id: "e-commerce", label: "E-Commerce" },
            { id: "portfolio", label: "Portfolio" },
            { id: "landing-page", label: "Landing Page" },
            { id: "full-stack", label: "Full-Stack" },
            { id: "frontend", label: "Frontend" },
        ],
    };

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-16 animate-slide-in-left">
                <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
                    My <span className="text-primary">Work</span>
                </h1>
                <p className="text-xl text-on-surface-variant max-w-2xl">
                    A collection of projects spanning graphic design and web development. Each piece represents a unique challenge and creative solution.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-12 space-y-6">
                {/* Category Filter */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <Filter size={20} />
                        <span className="font-medium">Category:</span>
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setActiveSubcategory("all");
                            }}
                            className={cn(
                                "px-6 py-2 rounded-full transition-all",
                                activeCategory === cat.id
                                    ? "bg-primary text-on-primary font-bold shadow-lg"
                                    : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Subcategory Filter */}
                {activeCategory !== "all" && (
                    <div className="flex items-center gap-4 flex-wrap animate-fade-in">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="font-medium">Filter:</span>
                        </div>
                        {subcategories[activeCategory as keyof typeof subcategories]?.map((subcat) => (
                            <button
                                key={subcat.id}
                                onClick={() => setActiveSubcategory(subcat.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm transition-all",
                                    activeSubcategory === subcat.id
                                        ? "bg-primary/20 text-primary border-2 border-primary font-medium"
                                        : "bg-surface border border-outline/20 text-on-surface-variant hover:border-primary/50"
                                )}
                            >
                                {subcat.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Masonry Grid */}
            {loading ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-surface-variant/20 rounded-3xl h-64 animate-pulse break-inside-avoid" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-2xl text-on-surface-variant">No projects found in this category.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {projects.map((project, index) => (
                        <Link
                            key={project._id}
                            href={`/work/${project.slug}`}
                            ref={(el) => {
                                if (el) projectRefs.current.set(project._id, el);
                            }}
                            data-project-id={project._id}
                            className={cn(
                                "group relative rounded-3xl overflow-hidden bg-surface border border-outline/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 break-inside-avoid block",
                                visibleProjects.has(project._id) && "animate-scale-in"
                            )}
                            style={{ 
                                animationDelay: `${(index % 6) * 0.1}s`,
                            }}
                        >
                            {/* Cover Image */}
                            <div className={cn("relative overflow-hidden bg-surface-variant/20", getHeightClass(project.aspectRatio))}>
                                <Image
                                    src={project.coverImage}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    onLoad={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        handleImageLoad(project._id, img.naturalWidth, img.naturalHeight);
                                    }}
                                />
                                {project.featured && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full z-10">
                                        Featured
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    {project.isFreelance && (
                                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full whitespace-nowrap">
                                            Freelance
                                        </span>
                                    )}
                                </div>

                                {project.client && (
                                    <p className="text-xs text-on-surface-variant mb-2">Client: {project.client}</p>
                                )}

                                <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{project.description}</p>

                                {/* Tech Stack / Tools */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {(project.category === "web-development"
                                        ? project.techStack.slice(0, 2)
                                        : project.tools.slice(0, 2)
                                    ).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-0.5 bg-surface-variant/50 text-xs rounded-md text-on-surface-variant"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex items-center gap-3 text-xs">
                                    {project.liveUrl && (
                                        <span className="flex items-center gap-1 text-primary">
                                            <ExternalLink size={12} /> Live
                                        </span>
                                    )}
                                    {project.repoUrl && (
                                        <span className="flex items-center gap-1 text-on-surface-variant">
                                            <Github size={12} /> GitHub
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
