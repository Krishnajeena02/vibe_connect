import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';                                            
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/posts.routes.js'
import http from "http";
import { Server } from 'socket.io';
import  Message from "./models/messages.model.js"
dotenv.config();
import session from'express-session';
import passport from 'passport';
import'./config/passport.js'; // load strategy
import authRoutes from'./routes/auth.routes.js';


const app = express();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

app.use(userRoutes);
app.use(postRoutes);
app.use(express.static("uploads"))


const start = async () => {
    const connectDB = await mongoose.connect(process.env.MONGODB_URL)
console.log("mongodb connected")
}


server.listen(9090, ()=>{
    console.log("app is running")
})

start();