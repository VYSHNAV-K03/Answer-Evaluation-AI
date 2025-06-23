import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentPanel = () => {
  const [user, setUser] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  console.log("user:", user);

  const handleCheckScore = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:7000/evaluations", {
        params: { rollno: user.rno, name: user.username },
      });
      setEvaluations(res.data);
    } catch (err) {
      console.error("Error fetching evaluations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow bg-light">
        <h2 className="mb-3">Welcome to the Student Panel</h2>
        {user && (
          <>
            <p>
              <strong>Name:</strong> {user.username}
            </p>
            <p>
              <strong>Roll No:</strong> {user.rno}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <button
              className="btn btn-primary"
              onClick={handleCheckScore}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Score"}
            </button>
          </>
        )}

        <hr />

        {evaluations.length > 0 && (
          <div className="mt-4">
            <h4>Evaluation History</h4>
            {evaluations.map((evalItem, idx) => (
              <div key={idx} className="card mt-3 p-3">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(evalItem.date).toLocaleString()}
                </p>
                <p>
                  <strong>Total Score:</strong> {evalItem.totalScore}
                </p>
                <hr />
                {evalItem.qaList.map((qa, qIdx) => (
                  <div key={qIdx} className="mb-2">
                    <p>
                      <strong>Q{qIdx + 1}:</strong> {qa.question}
                    </p>
                    <p>
                      <strong>Ans:</strong> {qa.answer}
                    </p>
                    <p>
                      <strong>Score:</strong> {qa.score}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;
