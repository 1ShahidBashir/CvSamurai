import multer from "multer";
//for file uploads

const storage= multer.diskStorage({
    //desination: request, fileinfo, callback
    destination: (req, file, cb)=>{
        cb(null, "/uploads");  //no error, path
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`); //will store file like 1678886400000-document.png first part epoch time, filename
    }
});

//file filter 
const fileFilter= (req, file, cb)=>{
    const allowedTypes= ["image/jpg", "image/jpeg", "image/png"]; //mime type {multipurpose internet mail extensions}
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("Only .jpg, .jpeg, .png are allowed formats"), false);
    }
}

const upload= multer({storage, fileFilter});
export default upload;