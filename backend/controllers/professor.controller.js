import { Appointment } from "../models/appointment.model.js";

export const addAvailability = async (req, res) => {
    try {
        const { time } = req.body;

        if (!time) {
            return res.status(400).json({ message: "Please provide a valid time slot" });
        }

        // Ensure that the user is a professor
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Only professors can add availability" });
        }

        // Create the availability slot with the logged-in professor's ID
        const appointment = await Appointment.create({
            professor: req.user.id, // Get the professor from the authenticated user
            time,
        });

        if (appointment) {
            res.status(201).json({
                message: "Availability slot created successfully",
                id: appointment._id,
                professor: appointment.professor,
                time: appointment.time,
                status: appointment.status,
            });
        } else {
            res.status(400).json({ message: "Failed to create availability slot" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAvailability = async (req, res) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Only professors can view their availability" });
        }

        const availability = await Appointment.find({ professor: req.user.id }); // Filter by the professor's ID
        res.status(200).json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const viewBookings = async (req, res) => {
    try {
        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Only professors can view their bookings" });
        }

        const bookings = await Appointment.find({
            professor: req.user.id,
            status: "booked",
        }).populate("student", "name email"); // Populate student details for the booked appointments

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Only professors can cancel bookings" });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.professor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot cancel appointments that do not belong to you",
            });
        }

        appointment.status = "available";
        appointment.student = null;

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            message: "Appointment successfully cancelled",
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { slotId } = req.params;

        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Only professors can delete appointments" });
        }

        const slot = await Appointment.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: "Availability slot not found" });
        }

        if (slot.professor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot delete slots that do not belong to you",
            });
        }

        await slot.deleteOne(); // Delete the appointment slot

        res.status(200).json({ message: "Availability slot deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
