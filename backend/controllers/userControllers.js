const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const normalizeIdentifier = (email, phone) => {
  if (email) return email.trim();
  if (phone) return phone.trim();
  return "";
};

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, pic } = req.body;
  const identifier = normalizeIdentifier(email, phone);

  if (!name || !identifier || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const emailValue = email || `${identifier.replace(/\D/g, "") || "signal-user"}@signal.local`;
  const phoneValue = phone || identifier;

  const userExists = await User.findOne({
    $or: [{ email: emailValue }, { phone: phoneValue }],
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: emailValue,
    phone: phoneValue,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, phone, identifier, password } = req.body;
  const lookupValue = normalizeIdentifier(email || identifier, phone);

  if (!lookupValue || !password) {
    res.status(400);
    throw new Error("Please enter a valid phone number or email and password");
  }

  const user = await User.findOne({
    $or: [{ email: lookupValue }, { phone: lookupValue }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email/phone or password");
  }
});

module.exports = { allUsers, registerUser, authUser };
