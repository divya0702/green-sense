const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const metricRoutes = require('./routes/metricRoutes');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const Goal = require('./models/Goal');


const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.send('Server is up and running! Welcome to the homepage.');
});


app.use(cors());
app.use(bodyParser.json());
app.use('/api/metrics', metricRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  try {
    const goals = await Goal.find({ userId });
    const formattedGoals = goals.map((goal) => {
      const milestones = goal.milestones
        .map((milestone) => `- ${milestone.description} (Completed: ${milestone.completed})`)
        .join("\n");
      return `Goal: ${goal.title}\nProgress: ${goal.progress}%\nMilestones:\n${milestones}`;
    }).join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
    You are Gaia, an ESG and sustainability assistant designed to help users reduce their carbon footprint, set eco goals, and track sustainability progress.

    Here are the user's current goals:
    ${formattedGoals}

    User message: "${message}"

    Respond in a helpful, friendly, and motivational tone.
    If the user asks for suggestions, give clear action steps. If they ask about their goals or progress, be insightful.
    If the user sounds confused or unmotivated, encourage them!

    Always keep your advice simple, human, and aligned with environmental awareness.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Response:", response);
    const text = response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to GreenPulse ESG Tracker API!');
});

module.exports = app;
