import mongoose, { Schema, model, models } from "mongoose";

const AchievementSchema = new Schema({
    title: { type: String, trim: true },
    description: { type: String },
    icon: { type: String },
}, { _id: true });

const ExperienceSchema = new Schema({
    title: { type: String, trim: true, required: true },
    company: { type: String, trim: true, required: true },
    period: { type: String, trim: true },
    description: { type: String },
    achievements: [{ type: String }],
    order: { type: Number, default: 0 },
}, { _id: true });

const EducationSchema = new Schema({
    degree: { type: String, trim: true, required: true },
    institution: { type: String, trim: true, required: true },
    year: { type: String, trim: true },
    description: { type: String },
    order: { type: Number, default: 0 },
}, { _id: true });

const SkillsSchema = new Schema({
    design: [{ type: String }],
    development: [{ type: String }],
    tools: [{ type: String }],
}, { _id: false });

const ResumeSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "Muḥammed Navār",
        },
        email: {
            type: String,
            trim: true,
            default: "NavarMP@gmail.com",
        },
        phone: {
            type: String,
            trim: true,
            default: "+91 9746 902268",
        },
        location: {
            type: String,
            trim: true,
            default: "Kerala, India",
        },
        summary: {
            type: String,
        },
        experience: [ExperienceSchema],
        education: [EducationSchema],
        skills: SkillsSchema,
        achievements: [AchievementSchema],
    },
    {
        timestamps: true,
    }
);

ResumeSchema.statics.getSingleton = async function () {
    let resume = await this.findOne();
    if (!resume) {
        resume = await this.create({
            name: "Muḥammed Navār",
            email: "NavarMP@gmail.com",
            phone: "+91 9746 902268",
            location: "Kerala, India",
            summary: "Multidisciplinary creative professional with 7+ years of graphic design experience and 5+ years of full-stack development expertise.",
            experience: [],
            education: [],
            skills: {
                design: [],
                development: [],
                tools: [],
            },
            achievements: [],
        });
    }
    return resume;
};

export const Resume = models.Resume || model("Resume", ResumeSchema);
