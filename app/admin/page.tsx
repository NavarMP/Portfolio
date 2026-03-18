import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import Link from "next/link";
import {
    LayoutDashboard,
    FolderKanban,
    MessageSquare,
    Star,
    LogOut,
    Settings,
    BarChart3,
    File
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Inquiry } from "@/models/Inquiry";
import { Testimonial } from "@/models/Testimonial";
import { Status } from "@/models/Status";

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
        redirect("/admin/login");
    }

    // Fetch dashboard stats
    await connectDB();
    const [projectsCount, inquiriesCount, testimonialsCount, statusDoc] = await Promise.all([
        Project.countDocuments(),
        Inquiry.countDocuments({ status: "new" }),
        Testimonial.countDocuments(),
        Status.findOne().lean(),
    ]);

    return (
        <div className="min-h-screen bg-surface/50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">
                            Admin <span className="text-primary">Dashboard</span>
                        </h1>
                        <p className="text-on-surface-variant">Welcome back, {session.user.name}!</p>
                    </div>

                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/admin/login" });
                        }}
                    >
                        <button className="mt-4 md:mt-0 px-6 py-3 rounded-full bg-surface border border-outline/20 text-on-surface-variant hover:border-red-500/50 hover:text-red-500 transition-all flex items-center gap-2">
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <FolderKanban size={24} />
                            </div>
                            <span className="text-sm text-on-surface-variant">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold font-display mb-1">{projectsCount}</h3>
                        <p className="text-on-surface-variant">Projects</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-3xl border border-secondary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                <MessageSquare size={24} />
                            </div>
                            <span className="text-sm px-2 py-1 bg-red-500 text-white rounded-full font-bold">New</span>
                        </div>
                        <h3 className="text-3xl font-bold font-display mb-1">{inquiriesCount}</h3>
                        <p className="text-on-surface-variant">New Inquiries</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-tertiary/10 to-tertiary/5 rounded-3xl border border-tertiary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center text-tertiary">
                                <Star size={24} />
                            </div>
                            <span className="text-sm text-on-surface-variant">Active</span>
                        </div>
                        <h3 className="text-3xl font-bold font-display mb-1">{testimonialsCount}</h3>
                        <p className="text-on-surface-variant">Testimonials</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                <BarChart3 size={24} />
                            </div>
                            <div
                                className={`w-3 h-3 rounded-full ${(statusDoc as any)?.availableForFreelance ? "bg-green-500" : "bg-red-500"
                                    } animate-pulse`}
                            />
                        </div>
                        <h3 className="text-lg font-bold font-display mb-1">
                            {(statusDoc as any)?.availableForFreelance ? "Available" : "Busy"}
                        </h3>
                        <p className="text-on-surface-variant text-sm">Current Status</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold font-display mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/admin/projects"
                            className="group p-8 bg-surface rounded-3xl border border-outline/10 hover:border-primary/50 transition-all hover:shadow-xl"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                <FolderKanban size={28} />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                                Manage Projects
                            </h3>
                            <p className="text-on-surface-variant">Create, edit, and delete portfolio projects</p>
                        </Link>

                        <Link
                            href="/admin/inbox"
                            className="group p-8 bg-surface rounded-3xl border border-outline/10 hover:border-secondary/50 transition-all hover:shadow-xl relative"
                        >
                            {inquiriesCount > 0 && (
                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                    {inquiriesCount}
                                </div>
                            )}
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2 group-hover:text-secondary transition-colors">
                                View Inquiries
                            </h3>
                            <p className="text-on-surface-variant">Review and respond to contact form submissions</p>
                        </Link>

                        <Link
                            href="/admin/resume"
                            className="group p-8 bg-surface rounded-3xl border border-outline/10 hover:border-primary/50 transition-all hover:shadow-xl"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                <File size={28} />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                                Edit Resume
                            </h3>
                            <p className="text-on-surface-variant">Manage your resume content</p>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="group p-8 bg-surface rounded-3xl border border-outline/10 hover:border-tertiary/50 transition-all hover:shadow-xl"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-4 group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                                <Settings size={28} />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2 group-hover:text-tertiary transition-colors">
                                Settings
                            </h3>
                            <p className="text-on-surface-variant">Manage availability status and testimonials</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
