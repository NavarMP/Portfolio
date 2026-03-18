"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";

export const dynamic = 'force-dynamic';

interface Experience {
    _id?: string;
    title: string;
    company: string;
    period: string;
    description: string;
    achievements: string[];
}

interface Education {
    _id?: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
}

interface Skills {
    design: string[];
    development: string[];
    tools: string[];
}

interface Achievement {
    _id?: string;
    title: string;
    description: string;
    icon: string;
}

interface ResumeData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skills;
    achievements: Achievement[];
}

export default function AdminResumePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resume, setResume] = useState<ResumeData | null>(null);

    // Expanded sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        basicInfo: true,
        experience: true,
        education: true,
        skills: true,
        achievements: true,
    });

    // Form states
    const [basicInfo, setBasicInfo] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
    });

    const [experience, setExperience] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [skills, setSkills] = useState<Skills>({ design: [], development: [], tools: [] });
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    // New item states
    const [newExperience, setNewExperience] = useState<Experience>({ title: "", company: "", period: "", description: "", achievements: [] });
    const [newEducation, setNewEducation] = useState<Education>({ degree: "", institution: "", year: "", description: "" });
    const [newAchievement, setNewAchievement] = useState<Achievement>({ title: "", description: "", icon: "" });
    const [newSkill, setNewSkill] = useState({ category: "design" as keyof Skills, value: "" });

    useEffect(() => {
        async function fetchResume() {
            try {
                const res = await fetch("/api/resume");
                const data = await res.json();
                setResume(data);
                setBasicInfo({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    summary: data.summary || "",
                });
                setExperience(data.experience || []);
                setEducation(data.education || []);
                setSkills(data.skills || { design: [], development: [], tools: [] });
                setAchievements(data.achievements || []);
            } catch (error) {
                console.error("Failed to fetch resume:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchResume();
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/resume", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    basicInfo,
                    experience,
                    education,
                    skills,
                    achievements,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save resume:", error);
        } finally {
            setSaving(false);
        }
    };

    // Experience handlers
    const addExperience = () => {
        if (!newExperience.title || !newExperience.company) return;
        setExperience([...experience, { ...newExperience, _id: `temp-${Date.now()}` }]);
        setNewExperience({ title: "", company: "", period: "", description: "", achievements: [] });
    };

    const removeExperience = (index: number) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    // Education handlers
    const addEducation = () => {
        if (!newEducation.degree || !newEducation.institution) return;
        setEducation([...education, { ...newEducation, _id: `temp-${Date.now()}` }]);
        setNewEducation({ degree: "", institution: "", year: "", description: "" });
    };

    const removeEducation = (index: number) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    // Skills handlers
    const addSkill = () => {
        if (!newSkill.value.trim()) return;
        setSkills(prev => ({
            ...prev,
            [newSkill.category]: [...prev[newSkill.category], newSkill.value.trim()],
        }));
        setNewSkill({ ...newSkill, value: "" });
    };

    const removeSkill = (category: keyof Skills, index: number) => {
        setSkills(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index),
        }));
    };

    // Achievement handlers
    const addAchievement = () => {
        if (!newAchievement.title) return;
        setAchievements([...achievements, { ...newAchievement, _id: `temp-${Date.now()}` }]);
        setNewAchievement({ title: "", description: "", icon: "" });
    };

    const removeAchievement = (index: number) => {
        setAchievements(achievements.filter((_, i) => i !== index));
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
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-display">
                        Resume <span className="text-primary">Manager</span>
                    </h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 text-green-600 rounded-xl text-center font-medium">
                        ✓ Resume saved successfully!
                    </div>
                )}

                <div className="space-y-4">
                    {/* Basic Info Section */}
                    <div className="bg-surface rounded-3xl border border-outline/10 overflow-hidden">
                        <button
                            onClick={() => toggleSection("basicInfo")}
                            className="w-full p-6 flex items-center justify-between hover:bg-surface-variant/30 transition-colors"
                        >
                            <h2 className="text-xl font-bold font-display">Basic Information</h2>
                            {expandedSections.basicInfo ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedSections.basicInfo && (
                            <div className="px-6 pb-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={basicInfo.name}
                                            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={basicInfo.email}
                                            onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone</label>
                                        <input
                                            type="text"
                                            value={basicInfo.phone}
                                            onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={basicInfo.location}
                                            onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Professional Summary</label>
                                    <textarea
                                        value={basicInfo.summary}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, summary: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Experience Section */}
                    <div className="bg-surface rounded-3xl border border-outline/10 overflow-hidden">
                        <button
                            onClick={() => toggleSection("experience")}
                            className="w-full p-6 flex items-center justify-between hover:bg-surface-variant/30 transition-colors"
                        >
                            <h2 className="text-xl font-bold font-display">Experience</h2>
                            {expandedSections.experience ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedSections.experience && (
                            <div className="px-6 pb-6 space-y-4">
                                {experience.map((exp, index) => (
                                    <div key={index} className="p-4 bg-surface-variant/20 rounded-xl flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="font-bold">{exp.title}</p>
                                            <p className="text-sm text-primary">{exp.company} • {exp.period}</p>
                                            <p className="text-sm text-on-surface-variant mt-1">{exp.description}</p>
                                        </div>
                                        <button onClick={() => removeExperience(index)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <div className="p-4 bg-surface-variant/10 rounded-xl space-y-3">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Job Title"
                                            value={newExperience.title}
                                            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Company"
                                            value={newExperience.company}
                                            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Period (e.g., 2020 - Present)"
                                            value={newExperience.period}
                                            onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        value={newExperience.description}
                                        onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none resize-none"
                                    />
                                    <button
                                        onClick={addExperience}
                                        disabled={!newExperience.title || !newExperience.company}
                                        className="w-full py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> Add Experience
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className="bg-surface rounded-3xl border border-outline/10 overflow-hidden">
                        <button
                            onClick={() => toggleSection("education")}
                            className="w-full p-6 flex items-center justify-between hover:bg-surface-variant/30 transition-colors"
                        >
                            <h2 className="text-xl font-bold font-display">Education</h2>
                            {expandedSections.education ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedSections.education && (
                            <div className="px-6 pb-6 space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="p-4 bg-surface-variant/20 rounded-xl flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="font-bold">{edu.degree}</p>
                                            <p className="text-sm text-secondary">{edu.institution} • {edu.year}</p>
                                        </div>
                                        <button onClick={() => removeEducation(index)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <div className="p-4 bg-surface-variant/10 rounded-xl space-y-3">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Degree"
                                            value={newEducation.degree}
                                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Institution"
                                            value={newEducation.institution}
                                            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Year"
                                            value={newEducation.year}
                                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                                            className="px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={addEducation}
                                        disabled={!newEducation.degree || !newEducation.institution}
                                        className="w-full py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> Add Education
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className="bg-surface rounded-3xl border border-outline/10 overflow-hidden">
                        <button
                            onClick={() => toggleSection("skills")}
                            className="w-full p-6 flex items-center justify-between hover:bg-surface-variant/30 transition-colors"
                        >
                            <h2 className="text-xl font-bold font-display">Skills</h2>
                            {expandedSections.skills ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedSections.skills && (
                            <div className="px-6 pb-6 space-y-4">
                                {(["design", "development", "tools"] as const).map((category) => (
                                    <div key={category}>
                                        <label className="block text-sm font-medium mb-2 capitalize">{category} Skills</label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {skills[category].map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                                    {skill}
                                                    <button onClick={() => removeSkill(category, index)} className="hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Add ${category} skill`}
                                                value={category === newSkill.category ? newSkill.value : ""}
                                                onChange={(e) => setNewSkill({ ...newSkill, value: e.target.value })}
                                                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                                className="flex-1 px-4 py-2 rounded-lg bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                            />
                                            <select
                                                value={newSkill.category}
                                                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as keyof Skills })}
                                                className="px-3 py-2 rounded-lg bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none"
                                            >
                                                <option value="design">Design</option>
                                                <option value="development">Development</option>
                                                <option value="tools">Tools</option>
                                            </select>
                                            <button
                                                onClick={addSkill}
                                                disabled={!newSkill.value.trim()}
                                                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-surface rounded-3xl border border-outline/10 overflow-hidden">
                        <button
                            onClick={() => toggleSection("achievements")}
                            className="w-full p-6 flex items-center justify-between hover:bg-surface-variant/30 transition-colors"
                        >
                            <h2 className="text-xl font-bold font-display">Achievements</h2>
                            {expandedSections.achievements ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {expandedSections.achievements && (
                            <div className="px-6 pb-6 space-y-4">
                                {achievements.map((achievement, index) => (
                                    <div key={index} className="p-4 bg-surface-variant/20 rounded-xl flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className="font-bold">{achievement.title}</p>
                                            <p className="text-sm text-on-surface-variant">{achievement.description}</p>
                                        </div>
                                        <button onClick={() => removeAchievement(index)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <div className="p-4 bg-surface-variant/10 rounded-xl space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Achievement Title"
                                        value={newAchievement.title}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newAchievement.description}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg bg-surface border border-outline/20 focus:border-primary outline-none resize-none"
                                    />
                                    <button
                                        onClick={addAchievement}
                                        disabled={!newAchievement.title}
                                        className="w-full py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> Add Achievement
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Resume
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
