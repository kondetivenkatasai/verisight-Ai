## ✨ Features

- 🤖 Multi-Agent Decision Intelligence powered by Google Gemini
- 🧠 Autonomous AI Agent Pipeline (Planning → Research → Reasoning → Decision → Verification → Report)
- 📊 Dynamic Risk Assessment with Confidence Scoring
- 📄 Explainable AI Reports with Executive Summary and Actionable Recommendations
- 📷 Image Upload & AI-Assisted Visual Analysis
- 🔐 Secure JWT Authentication with bcrypt Password Hashing
- 👥 Role-Based Dashboard with Investigation Management
- 📂 Case Management with Search, Filtering, and History
- 📈 Interactive Analytics Dashboard
- 🗄️ Supabase PostgreSQL Database with Secure Storage
- 📥 Export Reports as PDF and JSON
- 🌙 Dark & Light Theme Support
- 📱 Fully Responsive Enterprise-Grade User Interface
- 🚀 Production-Ready Architecture with React, Express.js, and Supabase















# Verisight AI

> See the Truth. Decide with Confidence.

Verisight AI is an enterprise-grade multi-agent Decision Intelligence platform that analyzes complex cases, evaluates risks, verifies evidence, and generates explainable AI-powered recommendations using Google Gemini and Supabase PostgreSQL.

---

## Architecture

```
Verisight-AI/
├── frontend/          React + Vite + Tailwind CSS
├── backend/           Express.js + Supabase + Gemini AI
├── README.md
└── .gitignore
```

### Multi-Agent Pipeline

```
Case Input → PlanningAgent → ResearchAgent → ReasoningAgent
           → DecisionAgent → VerificationAgent → ReportAgent
```

All agents are orchestrated by the **MasterOrchestrator** which coordinates execution, tracks status, and aggregates results.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite 5 | Build Tool |
| Tailwind CSS 3 | Styling |
| React Router v6 | Routing |
| Framer Motion | Animations |
| React Three Fiber | 3D Visuals |
| GSAP + Lenis | Scroll Animations |
| Recharts | Data Visualization |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API Server |
| JWT + bcrypt | Authentication |
| Zod | Validation |
| Multer | File Uploads |
| Helmet + Rate Limit | Security |
| @supabase/supabase-js | Database Client |
| @google/generative-ai | AI Engine |

### Database
| Technology | Purpose |
|---|---|
| Supabase PostgreSQL | Primary Database |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Supabase account
- Google Gemini API key

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Environment Variables

**Backend** — `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

**Frontend** — `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:
```bash
# Located at: backend/src/database/schema.sql
```

### 4. Start Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## License

MIT
