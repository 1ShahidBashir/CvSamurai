import mongoose from "mongoose";
export async function connectDB(){
    await mongoose.connect("mongodb+srv://sam:RXLVrf39V0r6iJBc@samcluster.ctx4uya.mongodb.net/CVSAMURAI");
    console.log("Connected to db");
}