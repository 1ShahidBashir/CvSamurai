import User from "../models/userModel.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const genToken= (userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '4d'});
}
//signup
export const registerUser= async (req, res)=>{
    try{
        const {name, email, password}= req.body;
        
        const exists= await User.findOne({email});
        if(exists){
            return res.status(400).json({message: "User already exists"});
        }

        if(password.length<8){
            return res.status(400).json({success: false, message: "Password should be atleast 8 characters long"});
        }

        //hashing
        const salt= await bcrypt.genSalt(10); //here the cost of work is 10 so more hashing rounds and less chance of bruteforce attack
        const hashedPassword= await bcrypt.hash(password, salt);

        //main creation
        const user= await User.create({
            name,
            email, 
            password: hashedPassword
        });
        res.status(201).json({
            _id: user._id, 
            name: user.name,
            email: user.email, 
            password: hashedPassword, 
            token: genToken(user.id)
        });
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

//login
export const loginUser= async(req, res)=>{
    try{
        const {email, password}= req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(500).json({message: "Invalid Email or Password"});
        }
        //now user is found
        const validUser= await bcrypt.compare(password, user.password);
        if(!validUser){
            return res.status(500).json({message: "Invalid Email or Password"});
        }
        //now user found and is valid
        res.status(201).json({
            _id: user._id, 
            name: user.name,
            email: user.email, 
            token: genToken(user.id)
        });
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}

//get user
export const getUserProfile= async(req, res)=>{
    try{
        const user= await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}