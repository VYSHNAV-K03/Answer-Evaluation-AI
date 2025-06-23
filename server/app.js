const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const user = require("./models/userModel");
const path = require("path");
const upload = require("./config/multerConfig");
const app = express();
const axios = require("axios");
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");
const { OpenAI } = require("openai");

dotenv.config();

// Middleware for parsing JSON

// Enable CORS for cross-origin requests
app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
// Hardcoded admin registration

const createAdmin = async () => {
  try {
    const existingAdmin = await user.findOne({
      username: "admin",
      role: "admin",
    });
    if (!existingAdmin) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10); // Generate a salt
      const hashedPassword = await bcrypt.hash("1234", salt); // Hash the password

      const admin = new user({
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword, // Save the hashed password
        phone: "1234567890",
        isVerified: true,
        isAdmin: true,
        role: "admin",
      });
      await admin.save();
      console.log("Hardcoded admin created.");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin();
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running on port 6000");
});

app.use("/", require("./routes/aiRoutes"));
app.use("/", require("./routes/studentRoutes"));

app.use("/api", require("./routes/auth"));
// app.use('/api/reports', require('./routes/reportUpload'));
app.use("/api/admin", require("./routes/adminRoutes"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
