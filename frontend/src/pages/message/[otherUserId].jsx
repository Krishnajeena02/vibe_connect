import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import axios from "axios";
import styles from "./index.module.css"; // Optional for styling

const socket = io("http://localhost:3000");

const ChatPage = () => {
  const { receiverId } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messageRef = useRef(null);

  const senderId = authUser?._id;

  // Scroll to bottom on new message
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join socket room and listen for messages
  useEffect(() => {
    if (!senderId || !receiverId) return;

    socket.emit("joinRoom", { userId: senderId });

    socket.on("receiveMessage", (message) => {
      if (
        (message.sender === senderId && message.receiver === receiverId) ||
        (message.sender === receiverId && message.receiver === senderId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [senderId, receiverId]);

  // Fetch messages and receiver data
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const msgRes = await axios.get(`http://localhost:9090/messages/${senderId}/${receiverId}`);
        setMessages(msgRes.data);

        const profileRes = await axios.get(`http://localhost:9090/user/profile/${receiverId}`);
        setReceiver(profileRes.data.profile); // Adjust based on your API response
      } catch (err) {
        console.error("Fetch chat error:", err);
      }
    };

    if (senderId && receiverId) fetchChat();
  }, [senderId, receiverId]);

  // Send message
  const handleSend = async () => {
    if (!content.trim()) return;

    const newMessage = {
      sender: senderId,
      receiver: receiverId,
      content,
    };

    socket.emit("sendMessage", newMessage);
    setContent("");
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header with receiver info */}
      <div className={styles.chatHeader}>
        <strong>{receiver?.name}</strong>
        <span>@{receiver?.username}</span>
      </div>

      {/* Messages Area */}
      <div className={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === senderId ? styles.myMessage : styles.theirMessage}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messageRef} />
      </div>

      {/* Input Area */}
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
