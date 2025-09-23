
 import { Router } from "express";
 import multer from 'multer'
 import { register,login,uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getConnectionRequests, whatAreMyConnection, acceptConnectionRequest, getUserProfileAndUserBasedOnUserName} from "../controllers/user.controller.js";
 
 
 const router = Router();

 const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    },


 })

 const upload = multer({storage:storage});
 
 router.post("/update/profile_picture", upload.single("profile_picture"), uploadProfilePicture);

 router.route("/register").post(register);
 router.route("/login").post(login);
 router.route("/user_update").post(updateUserProfile);
 router.route("/get_user_and_profile").get(getUserAndProfile);
 router.route("/update_profile_data").post(updateProfileData);
 router.route("/user/get_all_user").get(getAllUserProfile);
 router.route("/user/download_resume").get(downloadProfile);
 router.route("/user/send_connection_request").post(sendConnectionRequest)
 router.route("/user/getConnectionRequest").get(getConnectionRequests)
 router.route("/user/user_connection_request").get(whatAreMyConnection)
 router.route("/user/accept_connection_request").post(acceptConnectionRequest)
 router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUserName);
 export default router;
 