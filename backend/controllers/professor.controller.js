import {Appointment} from "../models/appointment.model.js";



export const addAvailability =async (req,res) =>{
    const {time} =req.body;

    if(!time){
        res.status(400);
        throw new Error("Please provide a valid time slot");
    }

    if(req.user.role!="professor"){
        res.status(403); 
        throw new Error("Only professors can add availability");
    }

    const appointment = await Appointment.create({
        professor:req.user.id,
        time,
    })

    if(appointment){
        res.status(201).json({
            message:"Availability slot created successfully",
            id:appointment._id,
            professor:appointment.professor,
            time:appointment.time,
            status:appointment.status,
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create availability slot");
    }
};


export const getAvailability= async (req,res)=>{
    if(req.user.role!='professor'){
        res.status(403); 
        throw new Error("Only professors can view their availability");
    }


    const availability=await Appointment.find({professor:req.user.id});

    res.status(200).json(availability);
};

export const viewBookings =async (req,res)=>{
    if(req.user.role!='professor'){
        res.status(403); // Forbidden
        throw new Error("Only professors can view their bookings");
    }

    const bookings=await Appointment.find({
        professor:req.user.id,
        status:"booked",
    }).populate("student","name email");

    res.status(200).json(bookings);


};

export const cancelAppointment =async (req,res)=>{
    const {appointmentId}=req.params;
    if(req.user.role!='professor'){
        res.status(403); // Forbidden
        throw new Error("Only professors can cancel the bookings");
    }

    const appointment= await Appointment.findById(appointmentId);
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    if(appointment.professor.toString()!=req.user.id){
        res.status(403);
        throw new Error("You can not cancel appoint ments it does not belong to you");
    }

    appointment.status="available";
    appointment.student=null;



    const updatedAppointment = await appointment.save();

    res.status(200).json({
        message: "Appointment successfully cancelled",
        appointment: updatedAppointment,
    });
};

export const deleteAppointment= async (req,res) =>{
    const {slotId} = req.params;

    if(req.user.role!='professor'){
        res.status(403); // Forbidden
        throw new Error("Only professors can delete the appointments");
    }


    const slot = await Appointment.findById(slotId);

    if(!slot){
        res.status(404);
        throw new Error("Availability slot not found");
    }


    if(slot.professor.toString()!=req.user.id){
        res.status(403);
        throw new Error("You cannot delete slots that do not belong to you");
    }


    await slot.deleteOne();


    res.status(200).json({
        message: "Availability slot deleted successfully",
    });

};
