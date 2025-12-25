import express from "express";
import cors from "cors";
import "dotenv/config";
import {connectDB} from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
const app = express();
const PORT= 4000;

//db
connectDB();

app.use(cors({
    origin: ["http://localhost:5173","https://cvsamurai-frontend.onrender.com"], // Must match your frontend URL exactly
    credentials: true,               // Required if sending cookies/headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] // Allowed methods
}));

app.use(express.json());
//will use /api/auth/{route} for the routes of userRoutes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use('/uploads', express.static(path.join(__dirname, "uploads"),{
    setHeaders: (res, _path)=>{
        res.set("Access-Control-Allow-Origin", "https://cvsamurai-frontend.onrender.com")
    }
}
));

app.listen(PORT);