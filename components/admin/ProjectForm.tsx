"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, X, Image as ImageIcon, Video, Link as LinkIcon, Info, ImagePlus } from "lucide-react";
import MediaViewer from "./MediaViewer";
import MediaUploader from "./MediaUploader";

interface ProjectFormData {
    title: string;
    slug: string;
    description: string;
    category: string;
    subcategory: string;
    client: string;
    isFreelance: boolean;
    coverImage: string;
    liveUrl: string;
    repoUrl: string;
    featured: boolean;
    techStack: string;
    tools: string;
    media: Array<{ type: 'image' | 'video' | 'document', url: string }>;
}

export default function ProjectForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [compressMedia, setCompressMedia] = useState(true);

    // Basic state for form fields
    const [formData, setFormData] = useState<ProjectFormData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        category: initialData?.category || "graphic-design",
        subcategory: initialData?.subcategory || "",
        client: initialData?.client || "",
        isFreelance: initialData?.isFreelance || false,
        coverImage: initialData?.coverImage || "",
        liveUrl: initialData?.liveUrl || "",
        repoUrl: initialData?.repoUrl || "",
        featured: initialData?.featured || false,
        techStack: initialData?.techStack?.join(", ") || "",
        tools: initialData?.tools?.join(", ") || "",
        media: initialData?.media || [],
    });

    // Category Data
    const CATEGORIES = {
        "graphic-design": {
            label: "Graphic Design",
            subcategories: [
                { value: "logo-design", label: "Logo Design" },
                { value: "branding", label: "Branding" },
                { value: "marketing-materials", label: "Marketing Materials" },
                { value: "social-media", label: "Social Media" },
                { value: "illustration", label: "Illustration" },
                { value: "print-design", label: "Print Design" },
            ]
        },
        "web-development": {
            label: "Web Development",
            subcategories: [
                { value: "web-app", label: "Web Application" },
                { value: "e-commerce", label: "E-Commerce" },
                { value: "portfolio", label: "Portfolio" },
                { value: "landing-page", label: "Landing Page" },
                { value: "full-stack", label: "Full Stack" },
                { value: "frontend", label: "Frontend" },
            ]
        },
        "app-development": {
            label: "App Development",
            subcategories: [
                { value: "ios", label: "iOS App" },
                { value: "android", label: "Android App" },
                { value: "cross-platform", label: "Cross Platform" },
                { value: "ui-ux", label: "UI/UX Design" },
            ]
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            category: e.target.value,
            subcategory: "" // Reset subcategory when category changes
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Auto-generate slug if missing
        let finalSlug = formData.slug;
        if (!finalSlug) {
            finalSlug = formData.title 
                ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                : `project-${Date.now().toString(36)}`;
        }

        // Auto-select cover from gallery if missing
        let finalCover = formData.coverImage;
        if (!finalCover && formData.media.length > 0) {
            const firstImage = formData.media.find(m => m.type === 'image');
            if (firstImage) {
                finalCover = firstImage.url;
            }
        }

        try {
            // Convert comma-separated strings to arrays
            const payload = {
                ...formData,
                slug: finalSlug,
                coverImage: finalCover,
                techStack: formData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
                tools: formData.tools.split(",").map((s: string) => s.trim()).filter(Boolean),
                media: formData.media,
            };

            const url = initialData
                ? `/api/projects/${initialData._id}`
                : "/api/projects";

            const method = initialData ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/projects");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to save project:", error);
        } finally {
            setLoading(false);
        }
    };


    const isWebOrApp = ["web-development", "app-development"].includes(formData.category);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-surface-variant/5 p-6 md:p-8 rounded-3xl border border-outline/10 space-y-6">
                <div className="border-b border-outline/10 pb-4 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Info size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display text-on-surface">Basic Information</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Core details about the project.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Awesome Project"
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="Auto-generated if left empty"
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-on-surface">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Write a brief overview of the project..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none resize-none transition-colors"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        >
                            {Object.entries(CATEGORIES).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Subcategory</label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        >
                            <option value="">Select Subcategory</option>
                            {CATEGORIES[formData.category as keyof typeof CATEGORIES]?.subcategories.map((sub) => (
                                <option key={sub.value} value={sub.value}>{sub.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Client</label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-6 md:mt-8">
                        <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 rounded-xl border border-outline/20 bg-surface-variant/10 hover:bg-surface-variant/30 transition-colors flex-1">
                            <input
                                type="checkbox"
                                name="isFreelance"
                                checked={formData.isFreelance}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-primary focus:ring-primary"
                            />
                            <span className="font-medium text-sm">Freelance</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 md:p-4 rounded-xl border border-outline/20 bg-surface-variant/10 hover:bg-surface-variant/30 transition-colors flex-1">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-5 h-5 rounded text-primary focus:ring-primary"
                            />
                            <span className="font-medium text-sm">Featured</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Media Section */}
            <div className="bg-surface-variant/5 p-6 md:p-8 rounded-3xl border border-outline/10 space-y-8">
                <div className="border-b border-outline/10 pb-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <ImageIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display text-on-surface">Project Media</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Cover image and display gallery content.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl border border-outline/20 bg-surface-variant/10">
                    <input
                        type="checkbox"
                        id="compressOption"
                        checked={compressMedia}
                        onChange={(e) => setCompressMedia(e.target.checked)}
                        className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer border-outline/30"
                    />
                    <div>
                        <label htmlFor="compressOption" className="font-medium text-sm text-on-surface cursor-pointer">
                            Compress Images & Convert to WebP
                        </label>
                        <p className="text-xs text-on-surface-variant">Reduces size for faster loading. Best quality is maintained.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-3 text-on-surface">Cover Image</label>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 order-2 md:order-1">
                            <MediaUploader 
                                multiple={false}
                                compressMedia={compressMedia}
                                title="Upload Cover Image"
                                description="Drag & drop your hero image here"
                                onUploadComplete={(res) => setFormData(prev => ({ ...prev, coverImage: res[0].url }))}
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            {formData.coverImage ? (
                                <div className="aspect-video w-full md:w-64 rounded-xl overflow-hidden border border-outline/20 relative shadow-md group">
                                    <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="aspect-video w-full md:w-64 rounded-xl border border-dashed border-outline/20 bg-surface-variant/10 flex flex-col items-center justify-center text-on-surface-variant">
                                    <ImageIcon size={24} className="mb-2 opacity-50" />
                                    <span className="text-xs">No cover image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-outline/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Project Gallery</label>
                            <p className="text-sm text-on-surface-variant">Add images, videos, and PDFs to showcase the project.</p>
                        </div>
                        <div className="text-xs text-on-surface-variant px-3 py-1.5 bg-surface-variant/10 rounded-lg inline-block border border-outline/10 h-fit">
                            <b>Formats:</b> Images, Videos, PDFs
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <MediaUploader 
                            multiple={true}
                            compressMedia={compressMedia}
                            title="Add Media to Gallery"
                            description="Drag & drop files or provide direct links"
                            onUploadComplete={(res) => setFormData(prev => ({ ...prev, media: [...prev.media, ...res] }))}
                        />
                    </div>
                    
                    {formData.media.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {formData.media.map((item: { type: string, url: string }, index: number) => (
                                <div key={index} className="relative aspect-video bg-surface-variant/20 rounded-2xl overflow-hidden group border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                                    <MediaViewer type={item.type} url={item.url} className="w-full h-full object-cover" />
                                    
                                    {item.type === 'video' && (
                                        <div className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-md text-white rounded-lg pointer-events-none">
                                            <Video size={14} />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        {item.type === 'image' && (
                                            <button
                                                type="button"
                                                title="Set as Cover"
                                                onClick={() => setFormData(prev => ({ ...prev, coverImage: item.url }))}
                                                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors transform hover:scale-110 shadow-lg"
                                            >
                                                <ImagePlus size={18} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            title="Remove Media"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    media: prev.media.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors transform hover:scale-110 shadow-lg"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tech Stack & Links */}
            <div className="bg-surface-variant/5 p-6 md:p-8 rounded-3xl border border-outline/10 space-y-6">
                <div className="border-b border-outline/10 pb-4 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <LinkIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display text-on-surface">Tech Stack & Links</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Tools used and external URLs.</p>
                    </div>
                </div>

                {isWebOrApp ? (
                    <>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Tech Stack (comma separated)</label>
                                <input
                                    type="text"
                                    name="techStack"
                                    value={formData.techStack}
                                    onChange={handleChange}
                                    placeholder="React, Next.js, Tailwind"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Tools (comma separated)</label>
                                <input
                                    type="text"
                                    name="tools"
                                    value={formData.tools}
                                    onChange={handleChange}
                                    placeholder="VS Code, Postman"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Live URL</label>
                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Repository URL</label>
                                <input
                                    type="url"
                                    name="repoUrl"
                                    value={formData.repoUrl}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-on-surface">Tools / Software (comma separated)</label>
                            <input
                                type="text"
                                name="tools"
                                value={formData.tools}
                                onChange={handleChange}
                                placeholder="Photoshop, Illustrator, Figma"
                                className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                            />
                        </div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-5 rounded-2xl bg-primary text-on-primary font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:bg-primary/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-8"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={24} />
                        Saving Project...
                    </>
                ) : (
                    <>
                        <Save size={24} />
                        Save Project
                    </>
                )}
            </button>
        </form>
    );
}
