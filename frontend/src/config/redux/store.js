import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/authReducer"
import postReducer from './reducer/postReducer'
import chatReducer from "./reducer/chatReducer";

export const store = configureStore({
reducer:{
    auth:authReducer,
    post:postReducer,
    chat:chatReducer,

}
})