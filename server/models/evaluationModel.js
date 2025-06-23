const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  rollno: String,
  name: String,
  totalScore: Number,
  date: Date,
  qaList: [
    {
      question: String,
      answer: String,
      score: Number,
    },
  ],
});
const Evaluation = mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;
