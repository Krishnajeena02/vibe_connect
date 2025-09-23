import { clientServer } from "@/config";
import {  createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk (
    "posts/getAllPosts", async(_, thunkAPI)=>{
        try{
            
            const response =  await clientServer.get("/posts")

            return thunkAPI.fulfillWithValue(response.data)
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data)

        }
    }
)    

export const createPost  = createAsyncThunk(
    "post/createPost",async(userData, thunkAPI)=>{
        const {file, body} = userData
        try{
            const formData = new FormData()
            formData.append('token', localStorage.getItem('token')) 
            formData.append('body',body)
            formData.append('media', file)

            const response = await clientServer.post("/post", formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }

            });
            if(response.status==200){
                return thunkAPI.fulfillWithValue("post uploaded")
            }
            else{
                return thunkAPI.fulfillWithValue("post not uploded")
            }

        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",async(post_id, thunkAPI)=>{
        try{

        
        const response = await clientServer.delete("/delete_post",{
            data:{
                token:localStorage.getItem('token'),
                post_id:post_id.post_id
            }
        })
        return thunkAPI.fulfillWithValue(response.data)
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.message)
    }
    }
)

export const increamentLike = createAsyncThunk(
    "post/increament_like" , async(post, thunkAPI)=>{
        try{
            const response  = await clientServer.post("/increament_post_like",{
                post_id:post.post_id
            })
 const { post_id } = response.data;

      return thunkAPI.fulfillWithValue({ post_id });
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)

export const getComments = createAsyncThunk(
    "post/getComments", async(postData ,thunkAPI)=>{

        try{

        
        const response = await clientServer.get("/get_comments",{
            params:{
                post_id:postData.post_id
            }

        })
        return thunkAPI.fulfillWithValue({
            comments:response.data,
            post_id:postData.post_id
        })
        }
        catch(error){
            return thunkAPI.rejectWithValue(response.error.message)
        }
    }
)

export const postComments = createAsyncThunk(
    "post/postComment", async(commentData, thunkAPI)=>{
        try{
            const response = await clientServer.post("/comment",{
                token:localStorage.getItem('token'),
                post_id:commentData.post_id,
                commentBody:commentData.body
            })

            return thunkAPI.fulfillWithValue(response.data)

        }
        catch(error){
            return  thunkAPI.rejectWithValue(response.error.message)
        }
    }
)

export const deleteComment = createAsyncThunk(
    "comment/deleteComment",async(comment_id,thunkAPI)=>{
        try{
            const response = await clientServer.delete("/delete_comment",{
                data:{
               token: localStorage.getItem("token"),
        comment_id: comment_id.comment_id
                }
            })
            return thunkAPI.fulfillWithValue(response.data)

        }
        catch(error){
            return thunkAPI.rejectWithValue(response.error.message)
        }
    }
)