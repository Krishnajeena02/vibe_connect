import { clientServer } from "@/config/index.jsx";
import { createAsyncThunk } from "@reduxjs/toolkit"
export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {

        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {

                localStorage.setItem("token", response.data.token);
            }

            else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                })

            }
            return thunkAPI.fulfillWithValue(response.data.token)


        }

        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)

        }


    }
)


export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name


            })
            return thunkAPI.fulfillWithValue(response.data);

        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)

        }
    }
)


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser", async(user, thunkAPI)=>{
        try{
            // console.log(user)
            const response = await clientServer.get("/get_user_and_profile",
              
                {params:{
                    token:user.token}
                })
            return thunkAPI.fulfillWithValue(response.data)

        }

        catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
export const getAllUser = createAsyncThunk(
    "user/getAllUser", async(_, thunkAPI)=>{

        try{

            const response  = await clientServer.get("/user/get_all_user")

            return thunkAPI.fulfillWithValue(response.data)
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token:user.token,
                connectionId:user.connectionId            })

                thunkAPI.dispatch(getConnectionRequest({token:user.token})
                )
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)

export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequest", async(user, thunkAPI)=>{
        try{

            const response  = await clientServer.get("/user/getConnectionRequest",{
                params:{
                    token:user.token
                }
            })
            return  thunkAPI.fulfillWithValue(response.data.connections)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)


export const getMyConnectionRequests = createAsyncThunk(
    "user/getMyConnectionRequest", async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/user_connection_request",{
                params:{
                    token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)

export const acceptConnectionRequest = createAsyncThunk(
    "user/acceptConnectionRequest", async(user,thunkAPI)=>{
        try{
            const response =  await clientServer.post("/user/accept_connection_request",{
                token:user.token,
               requestId:user.requestId,
                action_type:user.action_type
            })
            thunkAPI.dispatch(getConnectionRequest({token:user.token}))
            thunkAPI.dispatch(getMyConnectionRequests({token:user.token}))
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.message)
        }
    }
)


