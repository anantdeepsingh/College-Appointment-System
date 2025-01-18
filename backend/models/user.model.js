import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','professor'],
        required:true,
    },
},{timestamps:true});

// password ko hash kar rha hoon
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});

// hashed password ko jo password user type kar rha hai usse match kar rha hoon
userSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
};


module.exports=mongoose.model("User",userSchema);

