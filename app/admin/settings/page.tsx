"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Link as LinkIcon, User, Briefcase, UploadCloud } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
}

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Status fields
    const [availableForFreelance, setAvailableForFreelance] = useState(true);
    const [openForHire, setOpenForHire] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [uploadingResume, setUploadingResume] = useState(false);
    
    // Profile fields
    const [photo, setPhoto] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    
    // Social links
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [newPlatform, setNewPlatform] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const platformPresets = [
        "GitHub", "LinkedIn", "Twitter", "Instagram", "Behance", 
        "Dribbble", "Facebook", "YouTube", "Medium", "Dev.to",
        "Stack Overflow", "CodePen", "Telegram", "WhatsApp", "Other"
    ];

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch("/api/status");
                const data = await res.json();
                setAvailableForFreelance(data.availableForFreelance);
                setOpenForHire(data.openForHire);
                setStatusMessage(data.statusMessage || "");
                setResumeUrl(data.resumeUrl || "");
                setPhoto(data.photo || "");
                setJobTitle(data.jobTitle || "");
                setSocialLinks(data.socialLinks || []);
            } catch (error) {
                console.error("Failed to fetch status:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "resume") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === "resume") {
            setUploadingResume(true);
        } else {
            setUploadingPhoto(true);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", type === "resume" ? "resume" : "profile");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                if (type === "resume") {
                    setResumeUrl(data.url);
                } else {
                    setPhoto(data.url);
                }
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            if (type === "resume") {
                setUploadingResume(false);
            } else {
                setUploadingPhoto(false);
            }
        }
    };

    const handleAddSocialLink = () => {
        if (!newPlatform || !newUrl) return;
        setSocialLinks([...socialLinks, { platform: newPlatform, url: newUrl }]);
        setNewPlatform("");
        setNewUrl("");
    };

    const handleRemoveSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    availableForFreelance,
                    openForHire,
                    statusMessage,
                    resumeUrl,
                    photo,
                    jobTitle,
                    socialLinks,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface/50 pt-24 pb-24">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-12">
                    Admin <span className="text-primary">Settings</span>
                </h1>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold font-display">Profile Info</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-3 text-on-surface">Profile Photo</label>
                                <div className="flex items-center gap-6">
                                    {photo ? (
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30">
                                            <Image
                                                src={photo}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl bg-surface-variant/30 border-2 border-dashed border-outline/30 flex items-center justify-center">
                                            <User className="text-on-surface-variant/50" size={32} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, "photo")}
                                            disabled={uploadingPhoto}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl cursor-pointer hover:bg-primary/20 transition-colors disabled:opacity-50"
                                        >
                                            {uploadingPhoto ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <UploadCloud size={18} />
                                            )}
                                            {photo ? "Change Photo" : "Upload Photo"}
                                        </label>
                                        {photo && (
                                            <button
                                                onClick={() => setPhoto("")}
                                                className="ml-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Job Title</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                                    placeholder="e.g., Graphic Designer & Full-Stack Developer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                <LinkIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-bold font-display">Social Links</h2>
                        </div>

                        {/* Existing Links */}
                        <div className="space-y-3 mb-6">
                            {socialLinks.map((link, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-surface-variant/20 rounded-xl"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-on-surface">{link.platform}</p>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline truncate block"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveSocialLink(index)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Link */}
                        <div className="flex gap-3">
                            <select
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none text-on-surface flex-1"
                            >
                                <option value="">Select Platform</option>
                                {platformPresets.map((preset) => (
                                    <option key={preset} value={preset}>{preset}</option>
                                ))}
                            </select>
                            <input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://..."
                                className="px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none text-on-surface flex-[2]"
                            />
                            <button
                                onClick={handleAddSocialLink}
                                disabled={!newPlatform || !newUrl}
                                className="px-4 py-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Availability Toggles */}
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <h2 className="text-2xl font-bold font-display mb-6">Availability Status</h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-surface-variant/20 rounded-2xl">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Available for Freelance</h3>
                                    <p className="text-sm text-on-surface-variant">
                                        Show that you&apos;re accepting new freelance projects
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAvailableForFreelance(!availableForFreelance)}
                                    className={`relative w-16 h-8 rounded-full transition-colors ${availableForFreelance ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${availableForFreelance ? "right-1" : "left-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-surface-variant/20 rounded-2xl">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Open for Hiring</h3>
                                    <p className="text-sm text-on-surface-variant">
                                        Show that you&apos;re open to full-time opportunities
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOpenForHire(!openForHire)}
                                    className={`relative w-16 h-8 rounded-full transition-colors ${openForHire ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${openForHire ? "right-1" : "left-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <h2 className="text-2xl font-bold font-display mb-6">Status Message</h2>
                        <textarea
                            value={statusMessage}
                            onChange={(e) => setStatusMessage(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface resize-none"
                            placeholder="e.g., Available for new projects, Currently booked until March..."
                        />
                    </div>

                    {/* Resume Upload */}
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-2xl font-bold font-display">Resume / CV</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-on-surface">Upload New PDF</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileUpload(e, "resume")}
                                        disabled={uploadingResume}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-sm text-on-surface-variant cursor-pointer"
                                    />
                                    {uploadingResume && <Loader2 className="animate-spin text-primary" size={20} />}
                                </div>
                            </div>

                            {resumeUrl && (
                                <div className="p-4 bg-surface-variant/20 rounded-xl flex items-center justify-between">
                                    <div className="truncate flex-1 mr-4">
                                        <p className="text-sm font-medium text-on-surface">Current Resume Link</p>
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
                                            {resumeUrl}
                                        </a>
                                    </div>
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-surface text-xs font-medium rounded-lg border border-outline/20 hover:bg-surface-variant/50 transition-colors"
                                    >
                                        View
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>

                        {success && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                                ✓ Settings saved successfully
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
