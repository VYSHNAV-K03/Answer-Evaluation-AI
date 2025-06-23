import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const QAEvaluator = () => {
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluateAnswer = async () => {
    if (!question || !userAnswer) return;

    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const response = await axios.post(
        "http://localhost:7000/evaluate-answer",
        {
          question,
          userAnswer,
        }
      );

      setEvaluation(response.data);
    } catch (err) {
      setError("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4">
            <h2 className="text-center">📝 Question Answer Evaluator</h2>

            <label className="form-label">❓ Enter Question:</label>
            <input
              type="text"
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <label className="form-label mt-3">✍️ Enter Your Answer:</label>
            <input
              type="text"
              className="form-control"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={evaluateAnswer}
              disabled={loading}
            >
              {loading ? "Evaluating..." : "Check Answer"}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {evaluation && (
              <div className="mt-4">
                <h3 className="text-center">📊 Evaluation Result</h3>
                <div className="card p-3 bg-light">
                  <p>
                    <strong>✅ Correct Answer:</strong>{" "}
                    {evaluation.correctAnswer}
                  </p>
                  <p>
                    <strong>🔍 Your Answer is:</strong>{" "}
                    {evaluation.isCorrect ? "Correct ✅" : "Incorrect ❌"}
                  </p>
                  <p>
                    <strong>📖 Context Used:</strong> {evaluation.context}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAEvaluator;
