# Signal Clone Assignment

This project is a Signal-inspired messaging application built to match the assignment brief: a privacy-focused chat platform with conversations, contacts, group chats, sessions, and real-time message delivery.

## Tech Stack
- Frontend: React + Chakra UI
- Backend: Node.js + Express + Socket.io
- Database: MongoDB with Mongoose
- Authentication: JWT + bcrypt

## Features Included
- Mocked authentication and registration flow
- Phone number / email login support
- Display name and avatar support
- Contact listing and convo search
- One-on-one and group chat flows
- Real-time typing and new-message updates
- Message previews and unread-style notifications
- Settings placeholders and conversation layout closely aligned to Signal UX
- Seed data for immediate usability

## Architecture Overview
- `backend/` handles API routes, auth, data models, and Socket.io real-time events
- `frontend/` contains the Signal-style application shell and chat UI
- MongoDB stores users, chats, and messages; messages persist for reloads and history

## Database Schema
The project uses MongoDB collections for:
- `users`: name, email, phone, password, profile picture, admin flag
- `chats`: chat name, participants, group flags, admin, and latest message reference
- `messages`: sender, content, chat reference, timestamps, and read state metadata

## Setup Instructions
1. Install root dependencies:
   npm install
2. Install frontend dependencies:
   npm install --legacy-peer-deps --prefix frontend
3. Create a `.env` file in the project root with:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/signal-clone
   JWT_SECRET=your_secret_key
   NODE_ENV=development
4. Start backend:
   npm run server
5. Start frontend:
   npm start --prefix frontend
6. Open the app at `http://localhost:3000`

## Notes
- This implementation keeps the functionality aligned with the assignment brief and the Signal-inspired experience while preserving a working MERN project structure.
- Dummy/seed users are included so the app is usable immediately.
- Live messaging uses Socket.io for real-time delivery behavior.

# 🔄 Real-Time Communication Flow

1. User logs in using JWT authentication.
2. Socket.io establishes a persistent connection.
3. Users can send and receive messages instantly.
4. Group messages are broadcast to all members.
5. Typing indicators update in real time.
6. Notifications alert users to new messages.

---

# 📚 Concepts Practiced

* MERN Stack Development
* REST API Design
* MongoDB Data Modeling
* Authentication & Authorization
* JWT Security
* Password Hashing
* Socket.io Integration
* WebSocket Communication
* Real-Time Event Handling
* State Management
* Responsive UI Design
* Client-Server Architecture

---

# 🔮 Future Improvements

* Online / Offline Status
* Read Receipts
* File & Image Sharing
* Voice Messages
* Video Calling
* End-to-End Encryption
* Message Reactions
* Message Editing & Deletion
* Chat Themes & Personalization

---

# 👨‍💻 Author

**Parth Girdhar**

* MERN Stack Developer
* Full Stack Web Developer
* Real-Time Application Developer

LinkedIn:
https://www.linkedin.com/in/parth-girdhar0811/

---

# 📜 License

This project is licensed under the MIT License.