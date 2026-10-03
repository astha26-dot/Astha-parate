import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Cloud sync store (persisted in memory and backed to a json file)
const SYNC_DATA_FILE = path.join(__dirname, '.sync_store.json');
let syncStore: Record<string, any> = {};

try {
  if (fs.existsSync(SYNC_DATA_FILE)) {
    const raw = fs.readFileSync(SYNC_DATA_FILE, 'utf-8');
    syncStore = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not read existing sync store file, starting fresh', e);
}

function persistSyncStore() {
  try {
    fs.writeFileSync(SYNC_DATA_FILE, JSON.stringify(syncStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist sync store file:', err);
  }
}

// Initialize Gemini SDK safely
let geminiAI: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    geminiAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key:', err);
  }
} else {
  // If GEMINI_API_KEY is not defined, we can try default constructor
  try {
    geminiAI = new GoogleGenAI();
  } catch (err) {
    console.warn('GoogleGenAI initialized without API key (offline/fallback mode ready)');
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString()
  });
});

// Cloud Sync Save
app.post('/api/sync/save', (req, res) => {
  const { syncCode, data } = req.body;
  if (!syncCode || !data) {
    return res.status(400).json({ error: 'Missing syncCode or data' });
  }
  syncStore[syncCode] = {
    data,
    updatedAt: new Date().toISOString(),
  };
  persistSyncStore();
  return res.json({ success: true, syncCode, savedAt: syncStore[syncCode].updatedAt });
});

// Cloud Sync Load
app.get('/api/sync/load/:syncCode', (req, res) => {
  const { syncCode } = req.params;
  const record = syncStore[syncCode];
  if (!record) {
    return res.status(404).json({ error: 'Sync profile not found for code ' + syncCode });
  }
  return res.json({ success: true, ...record });
});

// AI Evaluate Interview Answer
app.post('/api/ai/evaluate-answer', async (req, res) => {
  const { question, answer, backgroundTrack, difficulty } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  // Attempt using Gemini if available
  if (geminiAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
You are an expert English language coach, linguistic evaluator, and interview mentor specializing in student development (especially students with backgrounds in ${backgroundTrack || 'Indian Knowledge Systems & Modern Studies'}).
The user answered the following interview question:
Question: "${question}"
Candidate's spoken/typed response: "${answer}"
Target Difficulty: ${difficulty || 'intermediate'}

Evaluate this response objectively and constructively. Return ONLY a valid JSON object matching this schema (no markdown, no backticks, no wrap text):
{
  "vocabularyScore": <number from 30 to 100>,
  "fluencyScore": <number from 30 to 100>,
  "clarityScore": <number from 30 to 100>,
  "overallScore": <number from 30 to 100>,
  "fillerWordsDetected": [<array of filler words found like "um", "like", "basically", "actually", "you know">],
  "elevatedVocabSuggestions": [
    {
      "originalWord": "<simple word or phrase used by candidate>",
      "betterAlternative": "<impressive, precise vocabulary word>",
      "explanation": "<brief rationale why this sounds more professional/persuasive>"
    }
  ],
  "grammarAndPunctuationNotes": "<constructive feedback on sentence flow, grammar, or phrasing>",
  "culturalOrConceptualInsight": "<insight or analogy relating to the chosen background or effective rhetoric, e.g. Nyaya epistemology / clear argumentation or structured communication>",
  "exemplaryRewrite": "<an articulate, impressive 3-5 sentence sample answer using elevated vocabulary following the STAR method or clear persuasive structure>"
}
`;

      const response = await geminiAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, evaluation: parsed, source: 'gemini' });
      }
    } catch (aiErr) {
      console.warn('Gemini evaluation failed, falling back to rule-based engine:', aiErr);
    }
  }

  // Fallback intelligent evaluation engine (works completely offline or when API key is pending)
  const words = answer.trim().split(/\s+/);
  const wordCount = words.length;
  const fillersList = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of'];
  const lowerAnswer = answer.toLowerCase();
  const detectedFillers = fillersList.filter(f => lowerAnswer.includes(f));

  // Check vocabulary sophistication
  const vocabUpgradesMap: Record<string, { better: string; why: string }> = {
    'good': { better: 'exemplary / commendable', why: 'Demonstrates precise appreciation rather than generic praise.' },
    'bad': { better: 'suboptimal / detrimental', why: 'More objective and analytical in interview settings.' },
    'help': { better: 'facilitate / bolster', why: 'Shows active collaboration and leadership capability.' },
    'hard': { better: 'arduous / intricate', why: 'Signifies depth of challenge and intellectual rigor.' },
    'big': { better: 'substantial / pivotal', why: 'Communicates strategic scale and impact.' },
    'think': { better: 'opine / deduce / postulate', why: 'Highlights structured reasoning and critical analysis.' },
    'make': { better: 'synthesize / architect / formulate', why: 'Implies deliberate craft and engineering.' },
    'show': { better: 'exemplify / elucidate', why: 'Shows clarity of articulation and evidence.' },
    'start': { better: 'commence / initiate', why: 'More formal and decisive tone for interviews.' },
    'problem': { better: 'impediment / predicament', why: 'Frames challenges constructively and professionally.' }
  };

  const suggestions: Array<{ originalWord: string; betterAlternative: string; explanation: string }> = [];
  for (const [key, val] of Object.entries(vocabUpgradesMap)) {
    const reg = new RegExp(`\\b${key}\\b`, 'i');
    if (reg.test(lowerAnswer)) {
      suggestions.push({
        originalWord: key,
        betterAlternative: val.better,
        explanation: val.why
      });
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      originalWord: 'important',
      betterAlternative: 'paramount / consequential',
      explanation: 'Elevates basic emphasis to executive clarity.'
    });
  }

  const baseScore = Math.min(94, Math.max(55, Math.round(50 + (wordCount * 1.2) - (detectedFillers.length * 6))));

  res.json({
    success: true,
    source: 'local-evaluator',
    evaluation: {
      vocabularyScore: baseScore,
      fluencyScore: Math.min(95, baseScore + 4),
      clarityScore: Math.min(92, baseScore - 2),
      overallScore: Math.min(95, baseScore + 1),
      fillerWordsDetected: detectedFillers,
      elevatedVocabSuggestions: suggestions.slice(0, 4),
      grammarAndPunctuationNotes: wordCount < 20 
        ? "Your answer is concise; consider elaborating with a specific situational example (Situation, Task, Action, Result)."
        : "Good rhythm. Structure your thoughts using transition markers like 'Furthermore', 'Consequently', and 'In summary'.",
      culturalOrConceptualInsight: "In Indian philosophical debate (Vāda-vidyā), articulating a claim requires 'Pratijñā' (the thesis), followed by 'Hetu' (the rationale) and 'Udāharaṇa' (the illustrative example). This timeless structure makes your interview answers compelling.",
      exemplaryRewrite: `In addressing this challenge, my primary objective was to ensure meticulous execution while fostering cross-functional alignment. By deconstructing the problem into actionable milestones, I facilitated proactive resolution and achieved tangible, sustainable outcomes.`
    }
  });
});

// AI Generate Dynamic Quiz Questions
app.post('/api/ai/generate-quiz', async (req, res) => {
  const { backgroundTrack, difficulty, topic } = req.body;

  if (geminiAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
Create 3 high-yield English vocabulary quiz questions tailored for a student interested in: "${backgroundTrack || 'Indian Knowledge Systems & Academic Studies'}"
Difficulty: ${difficulty || 'intermediate'}
Topic: ${topic || 'Professional & Classical Vocabulary'}

Each question must test rich contextual English vocabulary (with connections to roots, etymology, or field concepts).
Return ONLY a valid JSON array of 3 items with this schema:
[
  {
    "id": "gen-1",
    "word": "<the target vocabulary word, e.g. Epistemic, Sagacious, Tenacious, Equanimity>",
    "question": "<the challenge question, e.g. fill in the blank or scenario definition>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "correctIndex": <0, 1, 2, or 3>,
    "phonetic": "<phonetic pronunciation>",
    "definition": "<clear concise definition>",
    "etymology": "<root origin, e.g. Latin/Greek or Sanskrit cognate insight>",
    "exampleSentence": "<inspirational sentence in context>",
    "iksConnection": "<brief note connecting this concept to Indian Knowledge Systems or ethical leadership>"
  }
]
`;
      const response = await geminiAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, questions: parsed });
      }
    } catch (err) {
      console.warn('Gemini quiz generation failed, using fallback quiz bank:', err);
    }
  }

  // Fallback response with curated high-yield questions
  res.json({
    success: true,
    questions: [
      {
        id: "cur-1",
        word: "Equanimity",
        question: "During a high-stakes technical interview, retaining ________ allows a candidate to think methodically under pressure.",
        options: ["equanimity", "impetuosity", "trepidation", "lethargy"],
        correctIndex: 0,
        phonetic: "/ˌek.wəˈnɪm.ə.t̬i/",
        definition: "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
        etymology: "From Latin aequus ('even') + animus ('mind, spirit'); cognate concept to 'Samatvam' in the Gita.",
        exampleSentence: "She handled the interviewer's counter-arguments with remarkable equanimity.",
        iksConnection: "Echoes the Vedic principle of 'Samatvam Yoga Uchyate'—maintaining unwavering poise across success and failure."
      },
      {
        id: "cur-2",
        word: "Perspicacious",
        question: "A ________ analyst readily discerned the underlying flaws in the algorithm before deployment.",
        options: ["perspicacious", "vacillating", "complacent", "truculent"],
        correctIndex: 0,
        phonetic: "/ˌpɝː.spəˈkeɪ.ʃəs/",
        definition: "Having a ready insight into and understanding of things; acutely perceptive.",
        etymology: "From Latin perspicere ('to look through, see clearly').",
        exampleSentence: "Her perspicacious inquiry revealed the root cause of the team's coordination bottleneck.",
        iksConnection: "Parallels the concept of 'Prajñā' (discerning intellect) celebrated in classical Indian epistemological texts."
      }
    ]
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VaniLingo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
