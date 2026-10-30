import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getTransitAndLocationGuide, getExamAlertsAndStudyUpdates } from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.post('/api/gemini/transit-guide', async (req, res) => {
  try {
    const { origin, lat, lng } = req.body;
    const result = await getTransitAndLocationGuide(origin, lat, lng);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Transit guide failed' });
  }
});

app.post('/api/gemini/exam-updates', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await getExamAlertsAndStudyUpdates(query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Exam updates failed' });
  }
});

// Serve static build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
