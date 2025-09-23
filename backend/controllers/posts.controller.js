import User from "../models/user.model.js";
import Post from  "../models/posts.model.js"
import Comment from "../models/comments.model.js";
import Profile from '../models/profile.model.js'

 export   const activeCheck = async (req, res)=>{
        return res.status(200).json({message:"RUNNING"});
    }


    export const createPost = async (req,res)=>{
        const {token} = req.body;

        try{

            const user = await  User.findOne({token:token});

            if(!user){
              return  res.status(404).json({message:"user not  found"})
            }

            const post =  new Post({
                userId:user._id,
               body:req.body.body,
               media:req.file!=  undefined ? req.file.filename: "",
               fileType:req.file!= undefined ? req.file.mimetype.split("/")[1]:"",

            })

            await post.save();

            return res.status(200).json({message:"post created"})

        }

        catch(error){
            return res.status(500).json({error:error.message})
        }
    }

    export const getAllPosts = async (req,res)=>{
        try{


            const posts = await Post.find({active:true}).populate("userId", "name username email profilePicture")
            .sort({createdAt:-1})
            // console.log(posts)
            return res.json({posts:posts});
        }
        catch(error){
            res.status(500).json({error:error.message});
        }
    }

    export const deletePost =  async (req,res)=>{
        const {token , post_id}  = req.body;

        try{
            const user = await User.findOne({token:token})
            .select("_id");

            if(!user){
                return res.status(404).json({message:"user not found"})
            }


            const post = await Post.findOne({_id:post_id});
            if(!post){
                return res.status(404).json({message:"post not found"});

            }

            if(post.userId.toString()!== user._id.toString()){
                return res.status(401).json({message:"unathorized"})
            }

            post.active = false;
            await post.save();

            return res.json({massage:"post deleted"})

        }
        catch(error){
            res.status(500).json({error:error.message})
        }
    }

    export const commentPost = async (req,res)=>{
        const {token, post_id, commentBody} = req.body;
        
        try{

            const user  = await User.findOne({token:token}).select("_id");

            if(!user){
                return res.status(404).json({message:"user not found"})
            }

            const post = await  Post.findOne({"_id":post_id});

            if(!post){
                return res.status(404).json({message:"post not found"})
            }

            const comment =  new Comment({
                userId:user._id,
                postId:post_id,
                comment:commentBody


            })

            await comment.save();
            return res.status(200).json({message:"comment added"})

        }
        catch(error){
          return res.status(500).json({error:error.message});
        }
    }
 
    export const get_comments_by_post =  async (req,res)=>{
        const {post_id} = req.query;
        try{

            const post = await Post.findOne({_id:post_id});

            if(!post){
                return res.status(404).json({message:"post not found"});
            }

            
            const comments = await  Comment.find({postId:post_id}).populate("userId", " username name profilePicture")
            return res.json(comments);

        }
        catch(error){
            res.status(500).json({error:error.message});
        }
    }


    export const delete_comment_of_user = async (req,res)=>{
        const {token, comment_id} = req.body;

        try{

            const user =  await User.findOne({token:token}).select("_id");

            if(!user){
                return res.status(404).json({message:"user not found"});

            }

            const comment = await Comment.findOne({"_id":comment_id});

            if(!comment){
                return  res.status(404).json({message:"comment not found"});
            }

            if(comment.userId.toString()!= user._id.toString()){
                return res.status(401).json({message:"unathorized"})
            }

            await comment.deleteOne({"_id":comment_id})

            return res.json({message:"comment deleted"})

        }
        catch(error){
            return  res.status(500).json({error:error.message});
        }
    }


    export const increament_like = async (req,res)=>{

        const {post_id} = req.body;
        try{

            const post = await Post.findOne({_id:post_id});


            if(!post){
                return res.status(404).json({message:"post not found"})
            }

            post.likes+=1;

            await post.save();
            return res.json({message:"like increamented",post_id: post._id})
            
        }
        catch(error){
            return res.status(500).json({error:error.message});
        }
    }


