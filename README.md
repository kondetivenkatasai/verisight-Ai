# Verisight AI — Decision Intelligence Platform

> **See the Truth. Decide with Confidence.**

Verisight AI is an enterprise-grade multi-agent Decision Intelligence platform that analyzes complex cases, evaluates operational risks, verifies evidence, and generates explainable AI-powered recommendations using Google Gemini, React, Node.js/Express, and Supabase.

---

## 📌 1. Problem Statement

In modern operational, medical, environmental, and financial environments, critical decision-making is often slow, fragmented, and vulnerable to human oversight. When high-priority emergency incidents, hazmat leaks, hospital power failures, or financial fraud cases occur, decision-makers are overwhelmed by massive unstructured reports, unverified data points, and competing priorities.

**Key Challenges Addressed:**
- **High Latency in Incident Response**: Manual cross-referencing across departments delays critical containment within the golden hour.
- **Unstructured Data Overload**: Critical evidence hidden inside raw text descriptions and attachments goes unnoticed.
- **Lack of Decision Auditability**: Traditional decision-making processes lack clear confidence scoring, logical chain tracking, and explainability.

---

## 💡 2. Solution Description

Verisight AI solves this by deploying a coordinated **Multi-Agent AI Intelligence Engine** powered by Google Gemini. Rather than relying on a single prompt response, Verisight AI decomposes complex cases across 6 specialized autonomous AI agents acting in sequence:

```
Case Input ➔ PlanningAgent ➔ ResearchAgent ➔ ReasoningAgent
           ➔ DecisionAgent ➔ VerificationAgent ➔ ReportAgent ➔ Executive Report
```

### Key Features & AI Capabilities

1. **Autonomous Multi-Agent Pipeline**:
   - **Planning Agent**: Deconstructs case scope, key questions, and analytical strategy.
   - **Research Agent**: Extracts core operational facts, evidence indicators, and domain context.
   - **Reasoning Agent**: Synthesizes evidence, identifies trade-offs, and calculates dynamic risk scores.
   - **Decision Agent**: Selects an actionable recommendation (`approved`, `rejected`, `escalate`, `needs_review`).
   - **Verification Agent**: Validates logic consistency, checks constraints, and verifies reliability.
   - **Report Agent**: Compiles an executive report with immediate, short-term, and long-term action roadmaps.
2. **Interactive Real-Time Workflow**: Live status tracking per agent with neon hover highlights and percentage metrics.
3. **Executive Intelligence Reports**: Complete decision rationale, risk matrix breakdown, evidence summaries, and downloadable PDF/JSON exports.
4. **Resilient Local & Cloud Architecture**: In-memory database fallbacks ensure 100% uptime even during network outages.

---

## 🔗 3. GitHub Repository & Deployed Links

- **GitHub Repository**: [https://github.com/kondetivenkatasai/verisight-Ai.git](https://github.com/kondetivenkatasai/verisight-Ai.git)
- **Deployed Frontend (Vercel)**: [https://verisight-ai.vercel.app](https://verisight-ai.vercel.app)
- **Deployed Backend API (Render)**: [https://verisight-ai-backend.onrender.com/api](https://verisight-ai-backend.onrender.com/api)

---

## 🛠️ 4. Tech Stack

### Frontend
- **Framework**: React 18, Vite 5
- **Styling**: Vanilla CSS tokens + Tailwind CSS (Obsidian Cyan & Indigo theme)
- **State & Animations**: Framer Motion, GSAP, Recharts, Lucide Icons

### Backend
- **Server**: Node.js, Express.js
- **AI Engine**: `@google/generative-ai` (Google Gemini Pro & Flash models)
- **Database & Storage**: Supabase PostgreSQL + Local Memory Fallback Layer
- **Security**: JWT Authentication, bcrypt password hashing, Helmet, Rate Limiting

---

## 🚀 5. Getting Started & Execution Steps

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kondetivenkatasai/verisight-Ai.git
cd verisight-Ai

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Install Frontend Dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Terminal 1 — Start Backend Server (Port 5000)
cd backend
npm run dev

# Terminal 2 — Start Frontend Application (Port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📄 6. License

Licensed under the [MIT License](LICENSE).

