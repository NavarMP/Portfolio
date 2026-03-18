import { loadEnvConfig } from "@next/env";
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import bcrypt from "bcryptjs";

async function seed() {
    try {
        // Dynamic imports to ensure env vars are loaded first
        const { default: connectDB } = await import("@/lib/mongodb");
        const { User } = await import("@/models/User");
        const { Project } = await import("@/models/Project");
        const { Testimonial } = await import("@/models/Testimonial");
        const { Status } = await import("@/models/Status");

        await connectDB();
        console.log("🔗 Connected to MongoDB");

        // Clear existing data (optional - comment out if you want to preserve data)
        await Promise.all([
            User.deleteMany({}),
            Project.deleteMany({}),
            Testimonial.deleteMany({}),
            Status.deleteMany({}),
        ]);
        console.log("🗑️  Cleared existing data");

        // 1. Create Admin User
        const hashedPassword = await bcrypt.hash("admin123", 12);
        const adminEmail = process.env.ADMIN_EMAIL || "NavarMP@gmail.com";
        const admin = await User.create({
            name: "Muḥammed Navār",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });
        console.log("👤 Admin user created");

        // 2. Set Status
        await Status.create({
            availableForFreelance: true,
            openForHire: true,
            statusMessage: "Currently open for new freelance projects and full-time opportunities!",
        });
        console.log("✅ Status set");

        // 3. Sample Projects
        const projects = await Project.insertMany([
            {
                title: "EcoTech Brand Identity",
                slug: "ecotech-brand-identity",
                description: "Complete visual identity system for a sustainable technology startup, including logo, color palette, typography, and brand guidelines.",
                category: "graphic-design",
                subcategory: "branding",
                client: "EcoTech Solutions",
                isFreelance: true,
                coverImage: "https://via.placeholder.com/800x600/4ade80/ffffff?text=EcoTech+Branding",
                media: [
                    { type: 'image', url: "https://via.placeholder.com/800x600/4ade80/ffffff?text=Logo" },
                    { type: 'image', url: "https://via.placeholder.com/800x600/4ade80/ffffff?text=Brand+Guide" },
                ],
                tools: ["Illustrator", "Photoshop", "Figma"],
                featured: true,
                order: 1,
            },
            {
                title: "Portfolio Website 2024",
                slug: "portfolio-website-2024",
                description: "Modern portfolio website built with Next.js 15, featuring dynamic theming, custom animations, and MongoDB integration.",
                category: "web-development",
                subcategory: "portfolio",
                isFreelance: false,
                coverImage: "https://via.placeholder.com/800x600/6366f1/ffffff?text=Portfolio+2024",
                media: [
                    { type: 'image', url: "https://via.placeholder.com/800x600/6366f1/ffffff?text=Hero" },
                    { type: 'image', url: "https://via.placeholder.com/800x600/6366f1/ffffff?text=Projects" },
                ],
                techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB"],
                liveUrl: "https://navarmp.com",
                repoUrl: "https://github.com/navarmp/portfolio",
                featured: true,
                order: 2,
            },
            {
                title: "Social Media Campaign",
                slug: "social-media-campaign",
                description: "Social media graphics and marketing materials for a product launch campaign across Instagram, Facebook, and LinkedIn.",
                category: "graphic-design",
                subcategory: "social-media",
                client: "TechFlow Inc",
                isFreelance: true,
                coverImage: "https://via.placeholder.com/800x600/ec4899/ffffff?text=Social+Campaign",
                media: [{ type: 'image', url: "https://via.placeholder.com/800x600/ec4899/ffffff?text=Instagram+Post" }],
                tools: ["Photoshop", "Illustrator", "Canva"],
                featured: false,
                order: 3,
            },
            {
                title: "E-Commerce Platform",
                slug: "ecommerce-platform",
                description: "Full-stack e-commerce platform with shopping cart, payment integration, and admin dashboard.",
                category: "web-development",
                subcategory: "e-commerce",
                client: "Urban Wear",
                isFreelance: true,
                coverImage: "https://via.placeholder.com/800x600/f59e0b/ffffff?text=E-Commerce",
                media: [{ type: 'image', url: "https://via.placeholder.com/800x600/f59e0b/ffffff?text=Shop" }],
                techStack: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
                liveUrl: "https://urbanwear-demo.com",
                featured: false,
                order: 4,
            },
        ]);
        console.log(`📦 ${projects.length} projects created`);

        // 4. Sample Testimonials
        const testimonials = await Testimonial.insertMany([
            {
                clientName: "Sarah Johnson",
                company: "EcoTech Solutions",
                role: "CEO",
                testimonial: "Navār's branding work exceeded our expectations. The visual identity perfectly captures our mission and values. Highly professional!",
                rating: 5,
                projectRef: projects[0]._id,
                order: 1,
            },
            {
                clientName: "Michael Chen",
                company: "TechFlow Inc",
                role: "Marketing Director",
                testimonial: "The social media campaign graphics were stunning. Engagement rates increased by 300% after launching the new visuals.",
                rating: 5,
                projectRef: projects[2]._id,
                order: 2,
            },
            {
                clientName: "Emma Rodriguez",
                company: "Urban Wear",
                role: "Founder",
                testimonial: "Our e-commerce platform is not just functional—it's beautiful. Navār delivered a seamless shopping experience for our customers.",
                rating: 5,
                projectRef: projects[3]._id,
                order: 3,
            },
        ]);
        console.log(`💬 ${testimonials.length} testimonials created`);

        console.log("\n✨ Seed data created successfully!\n");
        console.log("📋 Summary:");
        console.log(`   - Admin: ${admin.email} / admin123`);
        console.log(`   - Projects: ${projects.length}`);
        console.log(`   - Testimonials: ${testimonials.length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();
