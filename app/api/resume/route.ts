import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Resume } from "@/models/Resume";

const defaultResumeData = {
    name: "Muḥammed Navār",
    email: "NavarMP@gmail.com",
    phone: "+91 9746 902268",
    location: "Kerala, India",
    summary: "Multidisciplinary creative professional with 7+ years of graphic design experience and 5+ years of full-stack development expertise. Specialized in bridging the gap between visual design and functional technology to deliver comprehensive digital solutions.",
    experience: [
        {
            title: "Freelance Graphic Designer & Full-Stack Developer",
            company: "Self-Employed",
            period: "2019 - Present",
            description: "Providing end-to-end design and development services to clients worldwide. Specialized in brand identity, web applications, and digital marketing solutions.",
            achievements: [
                "Delivered 50+ successful projects across graphic design and web development",
                "Maintained 100% client satisfaction rate with repeat business",
                "Built scalable web applications using Next.js, React, and MongoDB",
            ],
            order: 0,
        },
        {
            title: "Graphic Designer",
            company: "Various Agencies",
            period: "2017 - 2019",
            description: "Worked with multiple design studios creating visual content for brands, print media, and digital campaigns.",
            achievements: [
                "Designed brand identities for 20+ businesses",
                "Created marketing materials reaching 100K+ audience",
                "Mastered Adobe Creative Suite (Illustrator, Photoshop, InDesign)",
            ],
            order: 1,
        },
    ],
    education: [
        {
            degree: "Bachelor of Computer Applications (BCA)",
            institution: "University of Calicut",
            year: "2023 - 2026",
            description: "Focused on software development, database management, and web technologies.",
            order: 0,
        },
        {
            degree: "Higher Secondary Education",
            institution: "CHMHSS Pookolathur",
            year: "2021 - 2023",
            description: "Computer Science",
            order: 1,
        },
    ],
    skills: {
        design: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Figma", "Canva"],
        development: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
        tools: ["VS Code", "Git & GitHub", "Cloudinary", "Vercel", "GSAP"],
    },
    achievements: [
        {
            title: "50+ Successful Projects",
            description: "Delivered diverse projects across graphic design and web development",
            icon: "🏆",
        },
        {
            title: "100% Client Satisfaction",
            description: "Maintained perfect satisfaction rate with high repeat business",
            icon: "⭐",
        },
        {
            title: "Open Source Contributor",
            description: "Active contributor to web development community and open-source projects",
            icon: "🚀",
        },
    ],
};

export async function GET() {
    try {
        await connectDB();
        let resume = await Resume.findOne().lean();

        if (!resume) {
            // Create with default data
            const newResume = await Resume.create(defaultResumeData);
            return NextResponse.json(newResume);
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        let resume = await Resume.findOne();
        
        if (!resume) {
            // Create new resume with provided data or defaults
            resume = await Resume.create({
                ...defaultResumeData,
                ...body,
            });
        } else {
            // Update existing resume - merge all fields properly
            if (body.basicInfo) {
                resume.name = body.basicInfo.name ?? resume.name;
                resume.email = body.basicInfo.email ?? resume.email;
                resume.phone = body.basicInfo.phone ?? resume.phone;
                resume.location = body.basicInfo.location ?? resume.location;
                resume.summary = body.basicInfo.summary ?? resume.summary;
            }
            
            if (body.experience !== undefined) {
                resume.experience = body.experience;
            }
            
            if (body.education !== undefined) {
                resume.education = body.education;
            }
            
            if (body.skills) {
                if (body.skills.design) resume.skills.design = body.skills.design;
                if (body.skills.development) resume.skills.development = body.skills.development;
                if (body.skills.tools) resume.skills.tools = body.skills.tools;
            }
            
            if (body.achievements !== undefined) {
                resume.achievements = body.achievements;
            }
            
            await resume.save();
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error("Error updating resume:", error);
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
    }
}

// Reset resume to defaults (useful for testing)
export async function DELETE() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        await Resume.deleteMany({});
        
        // Recreate with defaults
        const newResume = await Resume.create(defaultResumeData);
        return NextResponse.json(newResume);
    } catch (error) {
        console.error("Error resetting resume:", error);
        return NextResponse.json({ error: "Failed to reset resume" }, { status: 500 });
    }
}
