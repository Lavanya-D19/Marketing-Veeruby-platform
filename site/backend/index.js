import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory store for demo
const users = [];
const progress = {};
const evidence = [];
const feedback = [];

// User registration
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ username, password, role });
  res.json({ success: true });
});

// User login (demo, no JWT yet)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user });
});

// Progress tracking
app.post('/api/progress', (req, res) => {
  const { username, module, status } = req.body;
  if (!progress[username]) progress[username] = {};
  progress[username][module] = status;
  res.json({ success: true });
});

app.get('/api/progress/:username', (req, res) => {
  res.json(progress[req.params.username] || {});
});

// Evidence submission
app.post('/api/evidence', (req, res) => {
  evidence.push(req.body);
  res.json({ success: true });
});

app.get('/api/evidence', (req, res) => {
  res.json(evidence);
});

// Feedback
app.post('/api/feedback', (req, res) => {
  feedback.push(req.body);
  res.json({ success: true });
});

app.get('/api/feedback', (req, res) => {
  res.json(feedback);
});

app.listen(4000, () => {
  console.log('LMS backend running on http://localhost:4000');
});
