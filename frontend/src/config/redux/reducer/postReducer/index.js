import { createSlice } from "@reduxjs/toolkit"
// import { reset } from "../authReducer"
import { getAllPosts, increamentLike, getComments } from "../../action/postAction"


const initialState = {
     posts: [],
    isError: false,
    postFetched:false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments:[],
   postId:"",
}


const postSlice  = createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        },
        
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading = true
            state.message = "feching all the posts..."


        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading= false
            state.isError=false
            state.postFetched = true
            state.posts = action.payload.posts
        })    
        
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.message = action.payload
        })
        .addCase(increamentLike.fulfilled, (state, action) => {
  const { post_id } = action.payload;

  const post = state.posts.find(p => p._id === post_id);

  if (post) {
    post.likes += 1;
  }
})
.addCase(getComments.fulfilled,(state, action)=>{
    state.postId= action.payload.post_id
    state.comments = action.payload.comments
})
        
        
    }                                                            
})
  export const {resetPostId} = postSlice.actions
export default postSlice.reducer;