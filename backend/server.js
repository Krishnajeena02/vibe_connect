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


// Socket.IO setup
const io = new Server(server, {
   cors: {
    origin: process.env.FRONTEND_URL, // use actual frontend origin
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId); // Join room by user ID
  });

  socket.on("sendMessage", async ({ sender, receiver, content }) => {
    const message = new Message({ sender, receiver, content });
    await message.save();

    // Emit to receiver room
    io.to(receiver).emit("receiveMessage", message);
    io.to(sender).emit("receiveMessage", message); // Optional: also emit to sender
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.post('/chat/sendMessage', async (req, res) => {
    console.log("Route hit");  // << Add this
  const { sender, receiver, content } = req.body;
  console.log("Request Body:", req.body); //

  if (!sender || !receiver || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Message save error:", err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
// Message fetching route
app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
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