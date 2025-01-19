import {Appointment} from "../models/appointment.model.js";


export const viewAvailableSlots= async (req,res) =>{
    const {professorId}=req.params;
    if(req.user.role!="student"){
        res.status(403);
        throw new Error("Only students can see the available slot");
    }

    const availableSlots= await Appointment.find({
        professor:professorId,
        status:"available",
    })

    if(!availableSlots || availableSlots.length()==0){
        res.status(404);
        throw new Error("No slots available with particular id");
    }

    res.status(200).json(availableSlots);
}


export const bookAppointments= async (req,res)=>{
    const {slotId} =req.body;

    if(req.user.role!='student'){
        res.status(403);
        throw new Error("Only students can book the available slot");
    }

    const appointment= await Appointment.findById(slotId);
    if(!appointment){
        res.status(404);
        throw new Error("Appointment slot not found");
    }

    if(appointment.status=='booked'){
        res.status(400);
        throw new Error("This slot is already booked");
    }

    appointment.student=req.user.id;
    appointment.status="booked";
    res.status(200).json({
        message: "Appointment booked successfully",
        appointment: updatedAppointment,
    });
}


export const viewBookedAppointments =async (req,res)=>{
    if(req.user.role!='student'){
        res.status(403);
        throw new Error("Only students can view the booked slot");
    }

    const bookings = await Appointment.find({
        student:req.user.id,
        status:'booked',
    }).populate("professor","name email");


    if(!bookings|| bookings.length()==0){
        res.status(404);
        throw new Error("NO booked slot till now");
    }

    res.status(200).json(bookings);
}


export const cancelAppointment=async (req,res) =>{
    const {appointmentId}= req.params;
    if (req.user.role !== "student") {
        res.status(403); // Forbidden
        throw new Error("Only students can cancel appointments");
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    if (appointment.student.toString() !== req.user.id) {
        res.status(403);
        throw new Error("You cannot cancel appointments that do not belong to you");
    }

    appointment.status="available";
    appointment.student=null;

    const updatedAppointment=await appointment.save();
    res.status(200).json({
        message: "Appointment successfully cancelled",
        appointment: updatedAppointment,
    });
}