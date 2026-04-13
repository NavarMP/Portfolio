import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: ["graphic-design", "web-development"],
            required: [true, "Category is required"],
        },
        subcategory: {
            type: String,
            required: false,
        },
        client: {
            type: String,
            trim: true,
        },
        isFreelance: {
            type: Boolean,
            default: false,
        },
        coverImage: {
            type: String, // Local storage URL (e.g., /api/media/projects/...)
        },
        media: [
            {
                type: { type: String, enum: ['image', 'video', 'document'] }, // Explicitly define inner 'type'
                url: String,
            },
        ],
        techStack: [
            {
                type: String, // e.g., "Next.js", "React", "Tailwind", "Figma", "Illustrator"
            },
        ],
        tools: [
            {
                type: String, // e.g., "Photoshop", "InDesign", "VS Code"
            },
        ],
        liveUrl: {
            type: String,
            trim: true,
        },
        repoUrl: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        likes: {
            type: Number,
            default: 0,
        },
        externalLinks: [
            {
                platform: { type: String, trim: true }, // e.g., 'Instagram', 'Behance'
                url: { type: String, trim: true },
            }
        ],
        order: {
            type: Number,
            default: 0, // For manual sorting
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ProjectSchema.index({ category: 1, featured: -1, order: 1 });

export const Project = models.Project || model("Project", ProjectSchema);
