import mongoose from "mongoose";
// import bcrypt from "bcrypt";


const appointmentSchema =new mongoose.Schema({
    professor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false,
    },
    time:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:["available","booked","cancelled"],
        default:"available"
    },

},{timestamps:true});
module.exports=mongoose.model("Appointments",appointmentSchema);