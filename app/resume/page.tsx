import { Download, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Status } from "@/models/Status";
import { Resume } from "@/models/Resume";
import Image from "next/image";

export const metadata = {
    title: "Resume - Muḥammed Navār",
    description: "Professional resume of Muḥammed Navār - Graphic Designer & Full-Stack Developer",
};

const socialIconMap: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    behance: Globe,
    dribbble: Globe,
};

async function getStatus() {
    await connectDB();
    const status = await Status.findOne().lean();
    return status as any;
}

async function getResume() {
    await connectDB();
    const resume = await Resume.findOne().lean();
    return resume as any;
}

export default async function ResumePage() {
    const [status, resume] = await Promise.all([getStatus(), getResume()]);
    
    // Get profile data from Status model
    const resumeUrl = status?.resumeUrl || "/assets/NavarMP_resume.pdf";
    const photo = status?.photo || null;
    const jobTitle = status?.jobTitle || "Graphic Designer & Full-Stack Developer";
    const socialLinks = status?.socialLinks || [];

    // Get resume data from Resume model - use database values or empty defaults
    const name = resume?.name || "Your Name";
    const email = resume?.email || "your@email.com";
    const phone = resume?.phone || "+91 XXXX XXXX XX";
    const location = resume?.location || "Your Location";
    const summary = resume?.summary || "Add your professional summary in the admin panel.";
    
    const experience = resume?.experience || [];
    const education = resume?.education || [];
    const skills = resume?.skills || { design: [], development: [], tools: [] };
    const achievements = resume?.achievements || [];

    const getSocialIcon = (platform: string) => {
        const key = platform.toLowerCase();
        const Icon = socialIconMap[key] || Globe;
        return Icon;
    };

    return (
        <div className="min-h-screen pt-24 pb-24 bg-surface/50">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 mb-12 border border-primary/20">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex items-start gap-6">
                            {photo ? (
                                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl shrink-0">
                                    <Image
                                        src={photo}
                                        alt="Profile Photo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-3xl bg-primary/20 border-4 border-white shadow-xl flex items-center justify-center shrink-0">
                                    <span className="text-4xl font-bold text-primary">{name.charAt(0) || "N"}</span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">{name}</h1>
                                <p className="text-xl text-primary font-medium mb-4">{jobTitle}</p>

                                <div className="space-y-2 text-on-surface-variant">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} />
                                        <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                                            {email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                                            {phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a
                            href={resumeUrl}
                            download="Resume.pdf"
                            className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0"
                        >
                            <Download size={20} />
                            Download PDF
                        </a>
                    </div>

                    {/* Social Links */}
                    {socialLinks.length > 0 && (
                        <div className="flex gap-3 mt-8 pt-6 border-t border-outline/20 flex-wrap">
                            {socialLinks.map((link: any, index: number) => {
                                const Icon = getSocialIcon(link.platform);
                                return (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl hover:bg-primary hover:text-on-primary transition-colors"
                                    >
                                        <Icon size={18} />
                                        {link.platform}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold font-display mb-6 text-primary">Professional Summary</h2>
                    <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                        <p className="text-lg leading-relaxed text-on-surface-variant">
                            {summary}
                        </p>
                    </div>
                </section>

                {/* Experience */}
                {experience.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold font-display mb-6 text-primary">Professional Experience</h2>
                        <div className="space-y-6">
                            {experience.map((job: any, index: number) => (
                                <div key={index} className="p-8 bg-surface rounded-3xl border border-outline/10 relative overflow-hidden group hover:border-primary/30 transition-all">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                                    <div className="relative">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold font-display">{job.title}</h3>
                                                <p className="text-primary font-medium">{job.company}</p>
                                            </div>
                                            <span className="text-on-surface-variant font-medium">{job.period}</span>
                                        </div>
                                        {job.description && <p className="text-on-surface-variant mb-4">{job.description}</p>}
                                        {job.achievements?.length > 0 && (
                                            <ul className="space-y-2">
                                                {job.achievements.map((achievement: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-on-surface-variant">
                                                        <span className="text-primary mt-1">•</span>
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold font-display mb-6 text-primary">Education</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {education.map((edu: any, index: number) => (
                                <div key={index} className="p-8 bg-surface rounded-3xl border border-outline/10 hover:border-secondary/30 transition-all">
                                    <h3 className="text-xl font-bold font-display mb-2">{edu.degree}</h3>
                                    <p className="text-secondary font-medium mb-2">{edu.institution}</p>
                                    <p className="text-sm text-on-surface-variant mb-3">{edu.year}</p>
                                    {edu.description && <p className="text-on-surface-variant">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {(skills.design?.length > 0 || skills.development?.length > 0 || skills.tools?.length > 0) && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold font-display mb-6 text-primary">Technical Skills</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {skills.design?.length > 0 && (
                                <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20">
                                    <h3 className="text-xl font-bold font-display mb-4 text-primary">Design Tools</h3>
                                    <div className="space-y-2">
                                        {skills.design.map((skill: string) => (
                                            <div key={skill} className="px-3 py-2 bg-surface/80 rounded-lg text-sm">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills.development?.length > 0 && (
                                <div className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-3xl border border-secondary/20">
                                    <h3 className="text-xl font-bold font-display mb-4 text-secondary">Development</h3>
                                    <div className="space-y-2">
                                        {skills.development.map((skill: string) => (
                                            <div key={skill} className="px-3 py-2 bg-surface/80 rounded-lg text-sm">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills.tools?.length > 0 && (
                                <div className="p-8 bg-gradient-to-br from-tertiary/10 to-tertiary/5 rounded-3xl border border-tertiary/20">
                                    <h3 className="text-xl font-bold font-display mb-4 text-tertiary">Tools & Platforms</h3>
                                    <div className="space-y-2">
                                        {skills.tools.map((skill: string) => (
                                            <div key={skill} className="px-3 py-2 bg-surface/80 rounded-lg text-sm">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {achievements.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold font-display mb-6 text-primary">Key Achievements</h2>
                        <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                            <ul className="space-y-4">
                                {achievements.map((achievement: any, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-2xl">{achievement.icon || "🏆"}</span>
                                        <div>
                                            <strong>{achievement.title}</strong>
                                            <p className="text-on-surface-variant">{achievement.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Empty State - Show message if no data */}
                {experience.length === 0 && education.length === 0 && 
                 skills.design?.length === 0 && skills.development?.length === 0 && 
                 skills.tools?.length === 0 && achievements.length === 0 && (
                    <section className="text-center py-12">
                        <div className="p-8 bg-surface rounded-3xl border border-outline/10">
                            <p className="text-xl text-on-surface-variant mb-4">
                                No resume data yet. Go to the admin panel to add your resume content.
                            </p>
                            <a
                                href="/admin/resume"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
                            >
                                Go to Resume Manager
                            </a>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
