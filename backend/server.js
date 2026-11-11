const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");

dotenv.config();
require("dotenv").config({ path: path.join(__dirname, ".env") });
const seedDatabase = async () => {
  try {
    const totalUsers = await User.countDocuments();
    if (totalUsers > 0) return;

    const createdUsers = await User.create([
      {
        name: "Aisha Khan",
        email: "aisha@signal.local",
        phone: "+1 415 324 3001",
        password: "123456",
        pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Daniel Moore",
        email: "daniel@signal.local",
        phone: "+1 415 324 3002",
        password: "123456",
        pic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Priya Shah",
        email: "priya@signal.local",
        phone: "+1 415 324 3003",
        password: "123456",
        pic: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Mason Lee",
        email: "mason@signal.local",
        phone: "+1 415 324 3004",
        password: "123456",
        pic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      },
    ]);

    const [aisha, daniel, priya, mason] = createdUsers;

    const directChat = await Chat.create({
      chatName: "Aisha",
      isGroupChat: false,
      users: [aisha._id, daniel._id],
    });

    const groupChat = await Chat.create({
      chatName: "Product team",
      isGroupChat: true,
      users: [aisha._id, daniel._id, priya._id],
      groupAdmin: aisha._id,
    });

    const directMessages = await Message.create([
      {
        sender: aisha._id,
        content: "Morning! Can you review the latest launch notes?",
        chat: directChat._id,
      },
      {
        sender: daniel._id,
        content: "Yep, I am on it. We are good to ship.",
        chat: directChat._id,
      },
      {
        sender: aisha._id,
        content: "Perfect. I will share the final QA summary in a bit.",
        chat: directChat._id,
      },
    ]);

    const groupMessages = await Message.create([
      {
        sender: aisha._id,
        content: "The design review is at 3 PM today.",
        chat: groupChat._id,
      },
      {
        sender: priya._id,
        content: "Great, I will join from the studio.",
        chat: groupChat._id,
      },
      {
        sender: daniel._id,
        content: "I have already synced the launch checklist.",
        chat: groupChat._id,
      },
      {
        sender: aisha._id,
        content: "Thanks everyone, looks good.",
        chat: groupChat._id,
      },
    ]);

    await Chat.findByIdAndUpdate(directChat._id, { latestMessage: directMessages[2]._id });
    await Chat.findByIdAndUpdate(groupChat._id, { latestMessage: groupMessages[groupMessages.length - 1]._id });

    console.log("Sample Signal data inserted".green.bold);
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

connectDB().then(seedDatabase);

const app = express();

app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
