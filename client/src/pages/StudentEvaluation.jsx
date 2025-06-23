import React, { useState } from "react";
import axios from "axios";

const StudentForm = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    rollno: "",
    totalScore: "",
    qaList: [{ question: "", answer: "", maxScore: "" }],
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [evaluatedDate, setEvaluatedDate] = useState(null);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (field === "qaList" && index !== null) {
      const updatedQaList = [...studentData.qaList];
      updatedQaList[index][name] = value;
      setStudentData((prev) => ({ ...prev, qaList: updatedQaList }));
    } else {
      setStudentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addQuestionAnswer = () => {
    setStudentData((prev) => ({
      ...prev,
      qaList: [...prev.qaList, { question: "", answer: "", maxScore: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:7000/evaluate",
        studentData
      );
      setResult(res.data);
      setEvaluatedDate(new Date().toISOString());
    } catch (err) {
      console.error("Error in submission:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStudent = async () => {
    if (!result || !result.breakdown) return;
    const evaluationData = result.breakdown.map((item) => ({
      question: item.question,
      answer: item.userAnswer,
      score: Math.round(item.awardedScore),
    }));

    const payload = {
      name: studentData.name,
      rollno: studentData.rollno,
      totalScore: evaluationData.reduce((sum, item) => sum + item.score, 0),
      date: evaluatedDate,
      qaList: evaluationData,
    };

    console.log("Payload:", payload);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:7000/uploadstudent",
        payload
      );
      console.log(res);

      alert("Student details uploaded successfully.");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response.data.error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <a href="/performance" className="btn btn-primary">
        Performance
      </a>
      <h2 className="mb-4 text-center">Student Answer Evaluation</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 shadow rounded bg-light"
      >
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            className="form-control"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Roll No:</label>
          <input
            className="form-control"
            name="rollno"
            value={studentData.rollno}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Total Exam Score:</label>
          <input
            type="number"
            className="form-control"
            name="totalScore"
            value={studentData.totalScore}
            onChange={handleChange}
            required
          />
        </div>

        {studentData.qaList.map((qa, idx) => (
          <div key={idx} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Question {idx + 1}</h5>
              <div className="mb-2">
                <label className="form-label">Question:</label>
                <input
                  type="text"
                  name="question"
                  className="form-control"
                  value={qa.question}
                  onChange={(e) => handleChange(e, idx, "qaList")}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Answer:</label>
                <textarea
                  name="answer"
                  className="form-control"
                  value={qa.answer}
                  onChange={(e) => handleChange(e, idx, "qaList")}
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  Max Score for this Question:
                </label>
                <input
                  type="number"
                  name="maxScore"
                  className="form-control"
                  value={qa.maxScore}
                  onChange={(e) => handleChange(e, idx, "qaList")}
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button
            type="button"
            onClick={addQuestionAnswer}
            className="btn btn-secondary me-2"
          >
            Add Another Question
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Evaluating..." : "Evaluate"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 p-4 border bg-white shadow rounded">
          <h3 className="mb-3">Evaluation Result</h3>
          <p>
            <strong>Total Score:</strong>{" "}
            {result.breakdown
              ? result.breakdown.reduce(
                  (sum, item) => sum + Math.round(item.awardedScore),
                  0
                )
              : 0}
          </p>

          <hr />
          {result.breakdown &&
            result.breakdown.map((item, idx) => (
              <div key={idx} className="mb-3">
                <h5>
                  Question {idx + 1}: {item.question}
                </h5>
                <p>
                  <strong>Similarity:</strong> {item.similarity}
                </p>
                <p>
                  <strong>Awarded Score:</strong>{" "}
                  {Math.round(item.awardedScore)} / {item.maxScore}
                </p>
                <p>
                  <strong>User Answer:</strong> {item.userAnswer}
                </p>
                <p>
                  <strong>Ideal Answer:</strong> {item.correctAnswer}
                </p>
                <hr />
              </div>
            ))}
          <button
            className="btn btn-success"
            onClick={handleUploadStudent}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Student Details"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
