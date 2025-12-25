import express from "express";
import {getUserProfile, loginUser, registerUser} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const userRoutes= express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

//use midware so only people with valid token can see
userRoutes.get("/profile", protect, getUserProfile);

export default userRoutes;