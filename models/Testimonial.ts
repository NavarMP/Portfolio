import mongoose, { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
    {
        clientName: {
            type: String,
            required: [true, "Client name is required"],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true, // e.g., "CEO", "Marketing Manager"
        },
        testimonial: {
            type: String,
            required: [true, "Testimonial text is required"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },
        avatar: {
            type: String, // Local storage URL or placeholder
        },
        projectRef: {
            type: Schema.Types.ObjectId,
            ref: "Project", // Optional reference to related project
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0, // For manual sorting in carousel
        },
    },
    {
        timestamps: true,
    }
);

TestimonialSchema.index({ isVisible: 1, order: 1 });

export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
