// import fs from "fs";
// import path from "path";
// import Resume from "../models/resumeModel.js";
// import upload from "../middleware/uploadMiddleware.js";
// import { error } from "console";

// export const  uploadResumeImages= async (req, res)=>{
//     try {
//         upload.fields([{name: "thumbnail"}, {name: "profileImage"}])
//             (req, res, async(err)=>{
//                 if(err){
//                     return res.status(400).json({message: "File upload failed", error: err.message});
//                 }
//                 const resumeId= req.params.id;
//                 const resume= await Resume.findOne({_id: resumeId, userId: req.user._id});

//                 //not found
//                 if(!resume){
//                     return res.status(404).json({message: "Resume not found or unauthorized"});   
//                 }

//                 const uploadFolder= path.join(process.cwd(), "uploads");
//                 const baseUrl= `${req.protocol}://${req.get("host")}`;     //https://abc.com  -->protocol and then host
//                 const newThumbnail= req.files?.thumbnail?.[0];  //if array of thumbnail exits take the first else null
//                 const newProfileImage= req.files.profileImage?.[0];

//                 if(newThumbnail){
//                     //if exists then delete
//                     if(resume.thumbnailLink){
//                         const oldThumbnail= path.join(uploadFolder, path.basename(resume.thumbnailLink));
//                         if(fs.existsSync(oldThumbnail)){
//                             fs.unlinkSync(oldThumbnail);
//                         }
//                     }
//                     //update/assign new thumbnailLink
//                     resume.thumbnailLink= `${baseUrl}/uploads/${newThumbnail.filename}`;
//                 }
//                 if(newProfileImage){
//                     //if exists then delete
//                     if(resume.thumbnailLink){
//                         const oldProfile= path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
//                         if(fs.existsSync(oldProfile)){
//                             fs.unlinkSync(oldProfile);
//                         }
//                     }
//                     //update/assign new thumbnailLink
//                     resume.profileInfo.profilePreviewUrl= `${baseUrl}/uploads/${newProfileImage.filename}`;
//                 }
//                 await resume.save();
//                 res.status(200).json({
//                     message: "Image uploaded successfully",
//                     thumbnailLink: resume.thumbnailLink,
//                     profilePreviewUrl: resume.profileInfo.profilePreviewUrl
//                 })
//             })
//     }   
//     catch (error) {
//         console.error("Error uploading images: ", error);
//         res.status(500).json({
//             message: "Failed to upload images",
//             error: error.message
//         });
//     }
// }




import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = async (req, res) => {
    try {
        // Multer middleware execution
        upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "File upload failed", error: err.message });
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

            if (!resume) {
                return res.status(404).json({ message: "Resume not found or unauthorized" });
            }

            const uploadFolder = path.join(process.cwd(), "uploads");
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            
            // FIX 1: Add optional chaining (?.) to req.files in BOTH lines
            const newThumbnail = req.files?.thumbnail?.[0]; 
            const newProfileImage = req.files?.profileImage?.[0];

            // Handle Thumbnail Update
            if (newThumbnail) {
                if (resume.thumbnailLink) {
                    const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
                    if (fs.existsSync(oldThumbnail)) {
                        fs.unlinkSync(oldThumbnail);
                    }
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            // Handle Profile Image Update
            if (newProfileImage) {
                // FIX 2: Check profilePreviewUrl, NOT thumbnailLink
                // FIX 3: Ensure profilePreviewUrl exists before using path.basename
                if (resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if (fs.existsSync(oldProfile)) {
                        fs.unlinkSync(oldProfile);
                    }
                }
                // Ensure profileInfo object exists before assigning
                if(!resume.profileInfo) resume.profileInfo = {}; 
                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();
            
            res.status(200).json({
                message: "Image uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo?.profilePreviewUrl
            });
        });
    } catch (error) {
        console.error("Error uploading images: ", error);
        res.status(500).json({
            message: "Failed to upload images",
            error: error.message
        });
    }
};