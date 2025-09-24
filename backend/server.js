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
const allowedOrigins = [
  "http://localhost:3000", // local
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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


// In user.routes.js
app.get('/user/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await User.findById(id); // or User.findOne({_id: id})
    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

server.listen(9090, ()=>{
    console.log("app is running")
})

start();