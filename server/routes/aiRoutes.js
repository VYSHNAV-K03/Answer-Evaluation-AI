const express = require("express");
const router = express.Router();
const axios = require("axios");
const stringSimilarity = require("string-similarity");

const COHERE_API_KEY = "7Dbjk8G3UCx4QSkXxuApvNpPH4AFKaW1aOy743z3"; // Replace with actual key

// Get ideal answer using Cohere API
const getIdealAnswerFromCohere = async (question) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: `Generate a highly detailed, structured, and well-explained answer for the following question. 
            Your response should be **at least 500 words** and must include:
            1. **Definition and Introduction**  
            2. **In-Depth Explanation of Key Concepts**  
            3. **Step-by-Step Breakdown (if applicable)**  
            4. **Real-World Examples and Use Cases**  
            5. **Common Mistakes and Misconceptions**  
            6. **Comparison with Similar Concepts (if applicable)**  
            7. **Conclusion and Summary**  
            
            Use **paragraphs, bullet points, and numbering** to structure the answer.

            **Question:** ${question}  

            **Detailed Answer:**`,
        max_tokens: 800, // Forces a long and complete response
        temperature: 0.6, // Ensures accuracy while allowing variety
        stop_sequences: ["\n\n\n"], // Ensures clean paragraph separation
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.generations && response.data.generations.length > 0) {
      return (
        response.data.generations[0].text.trim() || "No detailed answer found."
      );
    } else {
      return "No detailed answer found.";
    }
  } catch (error) {
    console.error("Cohere API Error:", error.message);
    return "No detailed answer found.";
  }
};

// Get similarity score using Cohere Embed API
const getSimilarityScore = async (userAnswer, correctAnswer) => {
  try {
    console.log("hello");

    const response = await axios.post(
      "https://api.cohere.ai/v1/embed",
      {
        texts: [userAnswer, correctAnswer],
        model: "embed-english-v2.0",
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const [userEmbedding, correctEmbedding] = response.data.embeddings;
    const dotProduct = userEmbedding.reduce(
      (sum, val, i) => sum + val * correctEmbedding[i],
      0
    );
    const magnitudeA = Math.sqrt(
      userEmbedding.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitudeB = Math.sqrt(
      correctEmbedding.reduce((sum, val) => sum + val * val, 0)
    );
    return dotProduct / (magnitudeA * magnitudeB);
  } catch (error) {
    console.error("Cohere Similarity Error:", error.message);
    return 0;
  }
};

// Evaluate answers
router.post("/evaluate", async (req, res) => {
  const { name, rollno, qaList } = req.body;
  try {
    let finalScore = 0;
    const results = await Promise.all(
      qaList.map(async (item) => {
        const { question, answer: userAnswer, maxScore } = item;
        const correctAnswer = await getIdealAnswerFromCohere(question);
        const similarity = await getSimilarityScore(userAnswer, correctAnswer);

        const awardedScore = similarity * maxScore;
        finalScore += awardedScore;

        return {
          question,
          userAnswer,
          correctAnswer,
          similarity: (similarity * 100).toFixed(2) + "%",
          awardedScore: awardedScore.toFixed(2),
          maxScore,
        };
      })
    );

    res.json({
      name,
      rollno,
      totalScore: finalScore.toFixed(2),
      breakdown: results,
    });
  } catch (error) {
    console.error("Evaluation Error:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Error evaluating answers" });
  }
});

module.exports = router;
