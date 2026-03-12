"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, X, Plus, Image as ImageIcon, Video, Link as LinkIcon, Info } from "lucide-react";

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
    media: Array<{ type: 'image' | 'video', url: string }>;
}

export default function ProjectForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

        try {
            // Convert comma-separated strings to arrays
            const payload = {
                ...formData,
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show loading state/preview if needed
        const button = e.target.parentElement;
        if (button) button.style.opacity = "0.5";

        const formDataVal = new FormData();
        formDataVal.append("file", file);
        formDataVal.append("folder", "navarmp-projects");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataVal,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    coverImage: data.url
                }));
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            if (button) button.style.opacity = "1";
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
                        <label className="block text-sm font-medium mb-2 text-on-surface">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-on-surface">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-on-surface">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
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

                <div>
                    <label className="block text-sm font-medium mb-3 text-on-surface">Cover Image *</label>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative order-2 md:order-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    required
                                    placeholder="Paste URL or upload file"
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none pr-32 transition-colors"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 cursor-pointer">
                                        <span>Upload</span>
                                    </div>
                                </div>
                            </div>
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
                    <label className="block text-sm font-medium mb-3 text-on-surface">Project Gallery</label>
                    <p className="text-sm text-on-surface-variant mb-4">Add images and videos to showcase the project on its details page.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formData.media.map((item: { type: string, url: string }, index: number) => (
                            <div key={index} className="relative aspect-video bg-surface-variant/20 rounded-2xl overflow-hidden group border border-outline/10 shadow-sm">
                                {item.type === 'video' ? (
                                    <div className="relative w-full h-full">
                                        <video src={item.url} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-md text-white rounded-lg">
                                            <Video size={14} />
                                        </div>
                                    </div>
                                ) : (
                                    <img src={item.url} alt={`Media ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
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

                        <div className="relative aspect-video bg-surface-variant/5 rounded-2xl border-2 border-dashed border-outline/20 hover:border-primary/50 hover:bg-surface-variant/10 transition-all flex flex-col items-center justify-center text-on-surface-variant cursor-pointer group">
                            <input
                                type="file"
                                multiple
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files?.length) return;

                                    const container = e.target.parentElement;
                                    if (container) container.style.opacity = "0.5";

                                    for (let i = 0; i < files.length; i++) {
                                        const file = files[i];
                                        const formDataVal = new FormData();
                                        formDataVal.append("file", file);
                                        formDataVal.append("folder", "navarmp-project-media");

                                        try {
                                            const res = await fetch("/api/upload", {
                                                method: "POST",
                                                body: formDataVal,
                                            });

                                            if (res.ok) {
                                                const data = await res.json();
                                                const type = file.type.startsWith('video/') ? 'video' : 'image';
                                                setFormData(prev => ({
                                                    ...prev,
                                                    media: [...prev.media, { type, url: data.url }]
                                                }));
                                            }
                                        } catch (error) {
                                            console.error("Error uploading media:", error);
                                        }
                                    }
                                    if (container) container.style.opacity = "1";
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-12 h-12 rounded-full bg-surface shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm font-medium">Add Media Files</span>
                            <span className="text-xs mt-1 opacity-70">Images or Videos</span>
                        </div>
                    </div>
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
