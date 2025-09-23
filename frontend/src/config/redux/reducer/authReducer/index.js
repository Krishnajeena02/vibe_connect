import { getAboutUser, getAllUser, getConnectionRequest, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    isToken:false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users :[],
    all_profiles_fetched : false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setisToken:(state)=>{
            state.isToken = true;
        },
         
        setisNotToken:(state)=>{
            state.isToken = false;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.message = "knocking the door"
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "login succesfully";


            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;

                state.isError = true;
                state.isError = true;
                state.message =

                    typeof action.payload === "string"
                        ? action.payload
                        : action.payload?.message || action.payload?.error || "Registration failed";
            })

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "registering you"
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                // state.loggedIn= true;
                state.message = "registration is succesfully please login "



            })

            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message =

                    typeof action.payload === "string"
                        ? action.payload
                        : action.payload?.message || action.payload?.error || "Registration failed";


            })
          

            .addCase(getAboutUser.fulfilled,(state,action)=>{
                state.isLoading = false
                state.isError= false
                state.profileFetched = true
                state.user=action.payload.profile

            })
               .addCase(getAllUser.fulfilled,(state,action)=>{
                state.isLoading = false
                state.isError = false
                state.all_profiles_fetched = true
                state.all_users = action.payload.profiles                                                                                                                                                                                                                                                                                                                                         
            } )
            .addCase(getConnectionRequest.fulfilled,(state, action)=>{
                state.connections = action.payload
            })
            .addCase(getConnectionRequest.rejected,(state,action)=>{
                state.message = action.payload
            })
            .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
                state.connectionRequest = action.payload
                // console.log(state.connectionRequest)
            })
            .addCase(getMyConnectionRequests.rejected,(state,action)=>{
             state.message = action.payload
            })

           
    }
})
export const { reset, emptyMessage , setisToken, setisNotToken } = authSlice.actions
export default authSlice.reducer;