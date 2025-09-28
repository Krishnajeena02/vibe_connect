import { Router } from "express";
 import multer from 'multer'

import { storage } from "../config/cloudinary.js";
import { activeCheck, createPost, getAllPosts,deletePost, commentPost, get_comments_by_post, delete_comment_of_user, increament_like } from "../controllers/posts.controller.js";

const router = Router();


const upload = multer({storage});



router.route("/").get(activeCheck);
router.route("/post").post( upload.single("media"),createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increament_post_like").post(increament_like);



export default router;
