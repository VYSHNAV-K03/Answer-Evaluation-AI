const express = require("express");
const User = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const Evaluation = require("../models/evaluationModel");

const router = express.Router();

// Route to get all unverified event organizers
router.get("/organisers", authMiddleware, async (req, res) => {
  console.log("getAllOrganisers");

  try {
    // Fetch all users who are not admins
    const organisers = await User.find({ role: { $ne: "admin" } });
    res.json(organisers);
  } catch (err) {
    console.error("Error fetching organisers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to verify an event organizer by ID
router.patch("/organisers/:id/verify", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const organiser = await User.findById(id);
    if (!organiser) {
      return res.status(404).json({ error: "Organiser not found" });
    }

    // Toggle the isVerified field
    organiser.isVerified = !organiser.isVerified;
    await organiser.save();

    res.json({
      message: `Organiser ${
        organiser.isVerified ? "verified" : "unverified"
      } successfully`,
    });
  } catch (err) {
    console.error("Error verifying organiser:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/uploadstudent", async (req, res) => {
  const { name, rollno, totalScore, date, qaList } = req.body;

  console.log(req.body);

  if (!name || !rollno || !totalScore || !date || !Array.isArray(qaList)) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const student = await User.findOne({ rno: rollno, username: name });
    console.log(student);

    if (!student) {
      return res.status(404).json({ error: "Can't find the student." });
    }

    const evaluation = new Evaluation({
      name,
      rollno,
      totalScore,
      date,
      qaList,
    });

    await evaluation.save();
    res.status(200).json({ message: "Details uploaded successfully." });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// GET /evaluations?rollno=1234&name=John Doe
router.get("/evaluations", async (req, res) => {
  const { rollno, name } = req.query;
  if (!rollno || !name) {
    return res.status(400).json({ error: "Missing rollno or name" });
  }

  try {
    const evaluations = await Evaluation.find({ rollno, name }).sort({
      date: -1,
    });
    res.status(200).json(evaluations);
  } catch (err) {
    console.error("Evaluation Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch evaluations" });
  }
});

// Get latest exam data for all students
router.get("/latest-performance", async (req, res) => {
  try {
    const latestEvaluations = await Evaluation.aggregate([
      {
        $sort: { date: -1 }, // Sort by latest date first
      },
      {
        $group: {
          _id: "$rollno",
          rollno: { $first: "$rollno" },
          name: { $first: "$name" },
          totalScore: { $first: "$totalScore" },
          date: { $first: "$date" },
        },
      },
      {
        $sort: { name: 1 }, // Optional: sort alphabetically by name
      },
    ]);

    res.json(latestEvaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
