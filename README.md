Live:https://vibe-connect-roan.vercel.app/

🌐 Vibe Connect

Vibe Connect is a social media web application built using the MERN stack.
It allows users to connect, share posts with media, interact with others through likes and comments, and manage their profile — all in a modern, responsive UI.

✨ Features

🔐 Authentication

User signup & login with JWT authentication

Google OAuth login support

📝 Posts

Create posts with text & media

View all posts in a feed

Like & comment on posts

Delete your posts

👤 Profile

View and edit user profile

Upload profile picture

⚡ Real-time Updates

Redux-powered state management

Optimized API calls with async actions

🎨 UI

Built with Next.js + React

Responsive & modern design

🛠️ Tech Stack
Frontend

Next.js / React

Redux Toolkit for state management

CSS Modules / Tailwind for styling (depending on your setup)

Backend

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Multer / Cloudinary (if file upload is included)

📂 Project Structure
Vibe-Connect/
├── backend/         # Express.js API
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── controllers/ # Business logic
│   └── server.js    # Entry point
│
├── frontend/        # Next.js app
│   ├── components/  # UI components
│   ├── pages/       # Next.js pages
│   ├── redux/       # Redux actions & reducers
│   └── styles/      # CSS modules / Tailwind
│
└── README.md

🚀 Getting Started
1️⃣ Clone the repo
git clone https://github.com/your-username/vibe-connect.git
cd vibe-connect

2️⃣ Setup Backend
cd backend
npm install


Create a .env file in backend/:

PORT=9090
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:9090


Start the backend:

npm run dev

3️⃣ Setup Frontend
cd frontend
npm install
npm run dev


Frontend runs at http://localhost:3000

Backend runs at http://localhost:9090

🧑‍💻 Author

Krishna Singh Jeena
Full Stack (MERN) Developer | Java | DSA

🌟 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

📜 License

This project is licensed under the MIT License.
