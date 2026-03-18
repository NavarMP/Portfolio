import mongoose, { Schema, model, models } from "mongoose";

const SocialLinkSchema = new Schema({
    platform: {
        type: String,
        trim: true,
        required: true,
    },
    url: {
        type: String,
        trim: true,
        required: true,
    },
    icon: {
        type: String,
        trim: true,
    },
}, { _id: false });

const StatusSchema = new Schema(
    {
        availableForFreelance: {
            type: Boolean,
            default: true,
        },
        openForHire: {
            type: Boolean,
            default: true,
        },
        statusMessage: {
            type: String,
            trim: true,
            default: "Available for new projects",
        },
        resumeUrl: {
            type: String,
            trim: true,
            default: "/assets/NavarMP_resume.pdf",
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        photo: {
            type: String,
            trim: true,
        },
        jobTitle: {
            type: String,
            trim: true,
            default: "Graphic Designer & Full-Stack Developer",
        },
        socialLinks: [SocialLinkSchema],
    },
    {
        timestamps: true,
    }
);

StatusSchema.statics.getSingleton = async function () {
    let status = await this.findOne();
    if (!status) {
        status = await this.create({
            availableForFreelance: true,
            openForHire: true,
        });
    }
    return status;
};

export const Status = models.Status || model("Status", StatusSchema);
