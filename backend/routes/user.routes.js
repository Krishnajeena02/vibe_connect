
 import { Router } from "express";
 
 import { register,login,uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile,  sendConnectionRequest, getConnectionRequests, whatAreMyConnection, acceptConnectionRequest, getUserProfileAndUserBasedOnUserName} from "../controllers/user.controller.js";
 import multer from 'multer'
import  { storage } from "../config/cloudinary.js";
 
 const router = Router();


 

const upload = multer({storage});



 
 router.post("/update/profile_picture", upload.single("profile_picture"), uploadProfilePicture);

 router.route("/register").post(register);
 router.route("/login").post(login);
 router.route("/user_update").post(updateUserProfile);
 router.route("/get_user_and_profile").get(getUserAndProfile);
 router.route("/update_profile_data").post(updateProfileData);
 router.route("/user/get_all_user").get(getAllUserProfile);
 router.route("/user/send_connection_request").post(sendConnectionRequest)
 router.route("/user/getConnectionRequest").get(getConnectionRequests)
 router.route("/user/user_connection_request").get(whatAreMyConnection)
 router.route("/user/accept_connection_request").post(acceptConnectionRequest)
 router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUserName);
 export default router;
 