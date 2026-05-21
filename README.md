# ⚡ ResumeAI — AI-Powered ATS Resume Analyzer

> Upload your resume → Get an ATS score, keyword analysis, and AI suggestions in seconds.

---

## ✨ Features

- 📄 **PDF Upload** — Drag-and-drop PDF resumes (max 5MB)
- 🔍 **Resume Parsing** — Extracts text using `pdf-parse`
- 🎯 **ATS Scoring** — 0–100 score: keywords, action verbs, soft skills, formatting
- 🔑 **Keyword Matching** — Role-specific keyword databases (SE, DS, PM, FE, DevOps)
- 🤖 **AI Suggestions** — Strengths, improvements, missing keywords, rewritten bullets
- 💼 **Job Role Targeting** — Tuned analysis per target job role
- ⚡ **Dual AI Fallback** — GPT-4o-mini → Gemini 1.5 Flash → Demo mode

---

## 🗂 Project Structure

```
ai-resume-analyzer/
├── client/                        # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── UploadSection.jsx  # Drag-drop + job role selector
│       │   ├── ResultsDashboard.jsx
│       │   ├── ScoreRing.jsx      # Animated SVG ring
│       │   ├── ScoreBar.jsx
│       │   └── LoadingState.jsx
│       └── utils/api.js
├── server/                        # Express.js API
│   ├── controllers/resumeController.js
│   ├── routes/resume.js
│   └── utils/
│       ├── pdfParser.js           # pdf-parse wrapper
│       ├── atsScorer.js           # ATS keyword engine
│       └── aiAnalyzer.js          # OpenAI + Gemini
├── vercel.json
└── .env.example
```

---

## 🚀 Local Setup

### 1. Install dependencies

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
npm run install:all
```

### 2. Configure env

```bash
cp .env.example server/.env
# Edit server/.env with your API keys
```

```env
OPENAI_API_KEY=sk-...        # platform.openai.com
GEMINI_API_KEY=AIza...        # aistudio.google.com
PORT=5000
CLIENT_URL=http://localhost:5173
```

> At least ONE AI key required. The app falls back gracefully.

### 3. Run

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## ☁️ Deploy to Vercel

### Option A: CLI

```bash
npm i -g vercel
vercel login
vercel
```

### Option B: Dashboard

1. Push repo to GitHub
2. Import at **vercel.com/new**
3. Add environment variables:

| Key | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-...` |
| `GEMINI_API_KEY` | `AIza...` |
| `CLIENT_URL` | `https://your-app.vercel.app` |

4. Deploy ✅

---

## 🔌 API

### `POST /api/resume/analyze`

**Body:** `multipart/form-data`
- `resume` (PDF file, required)
- `jobRole` (string: `software-engineer` | `data-scientist` | `product-manager` | `frontend-developer` | `devops-engineer` | `general`)
- `jobDescription` (string, optional)

**Response:**
```json
{
  "success": true,
  "metadata": { "fileName": "...", "pages": 1, "wordCount": 423 },
  "atsScore": { "overall": 72, "technical": 65, "foundKeywords": [...], "missingKeywords": [...] },
  "analysis": { "summary": "...", "strengths": [...], "improvements": [...], "suggestedBullets": [...] }
}
```

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, Multer |
| AI | OpenAI GPT-4o-mini + Google Gemini 1.5 Flash |
| PDF | pdf-parse |
| Deploy | Vercel |

---

## ⚙️ ATS Score Weights

| Category | Weight |
|---|---|
| Technical Keywords | 40% |
| Action Verbs | 20% |
| Soft Skills | 15% |
| Formatting & Structure | 25% |

---

MIT License
