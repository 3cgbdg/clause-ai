# 📄 ClauseAI — Contract Analysis in Plain English

**Understand any contract in 10 seconds.**  
Stop signing blind. ClauseAI uses AI to instantly summarize complex legal documents, highlighting hidden red flags and calculating a risk score so you can sign with confidence.

---

## ⚡ Features (MVP)
- **Instant Plain-English Summary:** Get the "too long; didn't read" of any contract.
- **Risk Scoring (1–10):** A calibrated score indicating how much attention the document needs.
- **Red Flag Detection:** Automatically identifies auto-renewals, hidden fees, and unfair non-competes.
- **Real-time Streaming:** Results stream in live as the AI reads, ensuring perceived speed < 3 seconds.
- **Multi-Format Support:** Paste raw text or upload clean PDF documents.

---

## 🛠️ The Tech Stack

### Backend
- **FastAPI (Python 3.11+):** High-performance asynchronous API.
- **OpenAI (gpt-4o-mini):** Optimized two-call architecture for concurrent JSON + Streaming text.
- **pdfplumber:** Robust PDF text extraction.
- **SlowAPI:** IP-based rate limiting to prevent abuse.

### Frontend
- **React 18 + Vite:** Ultra-fast modern frontend.
- **Tailwind CSS v4:** Cutting-edge styling with glassmorphism and custom animations.
- **TypeScript:** Type safety across the whole application.
- **Lucide React:** Premium iconography.

---

## 🏗️ Monorepo Structure
```text
backend/       → FastAPI Python API
frontend/      → React SPA + Vite
.husky/        → Git hooks for quality control
.lintstagedrc  → Pre-commit linting & formatting logic
```

---

## 🚀 Quick Start (Local)

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # Add your OPENAI_API_KEY
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 Quality Control
This project uses **Husky** and **lint-staged** to ensure high code quality:
- **Pre-commit:** Auto-formats and lints (Ruff for Python, Prettier/ESLint for TS).
- **Pre-push:** Runs all tests (pytest + vitest).

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.