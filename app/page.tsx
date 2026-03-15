"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Download,
    Send,
    Palette,
    Code,
    Globe,
    Mail
} from "lucide-react";
import {
    SiGithub,
    SiBehance
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Availability } from "@/components/providers/Availability";
import { SelectedWorks } from "@/components/home/SelectedWorks";

// Ticker Component (Updated)
function ServiceTicker() {
    const services = [
        "Graphic Design", "Web Development", "UI/UX Design", "Branding",
        "Motion Graphics", "Frontend Architecture", "Full-Stack Development"
    ];

    return (
        <div className="w-full bg-surface-variant/30 border-y border-outline/10 overflow-hidden py-4 backdrop-blur-sm">
            <div className="flex animate-ticker whitespace-nowrap">
                {[...services, ...services, ...services].map((service, i) => (
                    <span key={i} className="mx-8 text-lg font-medium text-on-surface-variant/80 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary mx-4"></span>
                        {service}
                    </span>
                ))}
            </div>
        </div>
    );
}

// Section Header Component
function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-primary">{title}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl">{subtitle}</p>
        </div>
    );
}

// Card Component
function Card({ title, description, icon: Icon, href }: { title: string, description: string, icon: any, href: string }) {
    return (
        <Link href={href} className="group relative p-8 rounded-3xl bg-surface border border-outline/20 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Icon size={120} />
            </div>
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">{description}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight size={16} className="ml-1" />
                </span>
            </div>
        </Link>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Hero Content (Left) */}
                    <div className="flex flex-col space-y-8 animate-slide-in-left z-10 order-2 lg:order-1">
                        <div className="space-y-4">
                            {/* Logo Component */}
                            <div className="w-48 md:w-64 mb-6">
                                <Logo className="w-full text-primary drop-shadow-lg" />
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight">
                                <span className="text-on-surface">Digital</span>{" "}
                                <span className="text-primary">Artisan</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-on-surface-variant max-w-lg leading-relaxed">
                                Graphic Designer & Full-Stack Developer crafting pixel-perfect experiences.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/work"
                                className="px-8 py-4 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center"
                            >
                                View Works <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 rounded-full bg-surface border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all active:scale-95 flex items-center"
                            >
                                Hire Me
                            </Link>
                            <Link
                                href="/contact?type=freelance"
                                className="px-8 py-4 rounded-full bg-surface-variant text-on-surface-variant font-medium hover:bg-surface-variant/80 transition-all active:scale-95 text-sm md:text-base"
                            >
                                Get Freelance Works
                            </Link>
                            <a
                                href="/resume"
                                className="px-6 py-4 rounded-full flex items-center text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <Download className="mr-2 w-5 h-5" /> Resume
                            </a>
                        </div>

                        {/* Social Proof / Tiny details */}
                        <div className="pt-4 flex items-center gap-6 text-on-surface-variant/60">
                            <a href="https://Github.com/NavarMP" className="hover:text-primary transition-colors"><SiGithub size={20} /></a>
                            <a href="https://LinkedIn.com/in/NavarMP" className="hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
                            <a href="https://Behance.net/NavarMP" className="hover:text-primary transition-colors"><SiBehance size={20} /></a>
                            <span className="h-1 w-1 rounded-full bg-current"></span>

                            {/* Availability Status */}
                            <Availability />
                        </div>
                    </div>

                    {/* Hero Image (Right) */}
                    <div className="relative animate-scale-in order-1 lg:order-2 flex justify-center">
                        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                            {/* Abstract decorative shapes */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>

                            {/* Portrait container */}
                            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-surface-variant/30 backdrop-blur-sm shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
                                style={{ backgroundColor: 'var(--md-sys-color-surface)' }}
                            >
                                <Image
                                    src="/assets/Portrait.png"
                                    alt="Muḥammed Navār Portrait"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -bottom-8 -left-8 p-4 bg-surface rounded-2xl shadow-xl border border-outline/10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Code size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Full-Stack</div>
                                        <div className="text-xs text-on-surface-variant">Developer</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-4 p-4 bg-surface rounded-2xl shadow-xl border border-outline/10 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                        <Palette size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Graphic</div>
                                        <div className="text-xs text-on-surface-variant">Designer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceTicker />

            {/* Intro Sections */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-32">

                {/* About Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="About Me" subtitle="Bridging the gap between design and technology." />
                        <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                            I am a multidisciplinary creator with a passion for building beautiful, functional, and scalable digital solutions.
                            My journey started with graphic design, evolving into full-stack development to bring my visual concepts to life interactively.
                        </p>
                        <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                            Whether it's pixel-perfect UI design, robust backend architecture, or compelling branding, I thrive at the intersection of creativity and logic.
                        </p>
                        <Link href="/about" className="text-primary font-bold hover:underline underline-offset-4">
                            Read full biography &rarr;
                        </Link>
                    </div>
                    <div className="relative h-[400px] bg-surface-variant/20 rounded-3xl overflow-hidden border border-outline/10 flex items-center justify-center group">
                        {/* Placeholder for About Image or Visualization */}
                        <div className="text-center p-8">
                            <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform duration-300">🚀</span>
                            <p className="text-xl font-display">Creative Thinker. Problem Solver.</p>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section>
                    <SectionHeader title="My Services" subtitle="Specialized solutions for your digital needs." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card
                            title="Graphic Design"
                            description="Logo design, branding, marketing materials, and visual identity systems that leave a lasting impression."
                            icon={Palette}
                            href="/services/graphic-design"
                        />
                        <Card
                            title="Web Development"
                            description="Responsive websites, web applications, and e-commerce platforms built with modern technologies like Next.js."
                            icon={Globe}
                            href="/services/web-development"
                        />
                        <Card
                            title="Digital Marketing"
                            description="Strategic SEO, social media marketing, and content strategies to grow your online presence."
                            icon={Send}
                            href="/services/digital-marketing"
                        />
                    </div>
                </section>

                {/* Works Section Preview */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <SectionHeader title="Selected Works" subtitle="A curation of my best projects." />
                        <Link href="/work" className="mb-8 px-6 py-3 rounded-full border border-outline hover:bg-surface-variant transition-colors">
                            View All Projects
                        </Link>
                    </div>

                    {/* Dynamic Project Grid */}
                    <SelectedWorks />
                </section>

                {/* Contact CTA */}
                <section className="rounded-[3rem] bg-primary text-on-primary overflow-hidden relative p-12 md:p-24 text-center">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display">Ready to start your next project?</h2>
                        <p className="text-xl md:text-2xl mb-12 opacity-90">
                            Let's collaborate to build something impactful. I'm available for freelance and full-time opportunities.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-10 py-5 rounded-full bg-surface text-primary font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-2xl"
                        >
                            Get in Touch <Mail className="ml-3" />
                        </Link>
                    </div>

                    {/* Decorative background circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                </section>

            </div>
        </div>
    );
}
