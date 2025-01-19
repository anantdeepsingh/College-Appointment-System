import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null, // Optional: Set default to null if not required
    },
    time: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > Date.now(); // Ensure the time is in the future
            },
            message: "Appointment time must be in the future",
        },
    },
    status: {
        type: String,
        enum: ["available", "booked", "cancelled"],
        default: "available",
    },
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
