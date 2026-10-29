# Placement Intelligence & Career Readiness Platform

A futuristic, AI-powered career readiness and placement intelligence platform built for modern engineering campuses. The platform maps student profiles, tracks algorithmic proficiency, analyzes company compatibility, and provides predictive placement insights.

---

## 🚀 Key Features

- **Dynamic Track Mastery System**: Live tracking of programming proficiencies (Python, Data Structures I & II, DBMS) with animated micro-level progression indicators.
- **AI-Powered Placement Probability**: Real-time compatibility index calculation against 150+ top product, fintech, and service companies (Amazon, Zoho, Microsoft, etc.).
- **Interactive Analytics Dashboard**: Cinematic glassmorphism aesthetics, dynamic skill radar comparisons, historical trend projection, and recruiter shortlist compatibility weights.
- **OCR Credential Verification**: Scans and parses verified certificates and internships to dynamically boost ATS scores.
- **Role & Skill Gap Analysis**: Detects missing technical competencies with targeted upskilling recommendations.
- **Role-Based Access Control**: Tailored workflows and views for **Students**, **Faculty/HODs**, and **System Administrators**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS, Framer Motion (page transitions, micro-interactions, spotlight glow)
- **Visuals**: Recharts (radar charts, area curves), Lucide React Icons

### Backend
- **Server**: Node.js & Express.js
- **Database**: PostgreSQL (Structured student profiles, academic metrics, and track levels)
- **OCR Engine**: Tesseract.js

---

## 📦 Project Structure

```
Placement_Predict/
├── frontend/             # React + Vite client dashboard
│   ├── src/
│   │   ├── components/   # Layout, UI components, data tables
│   │   ├── pages/        # Dashboard, Profile, Company matches, AI tools
│   │   └── contexts/     # Auth and user session states
│   └── package.json
│
├── backend/              # Node.js + Express API server
│   ├── server.js         # API routes & PostgreSQL connection pool
│   ├── seed.js           # Database seeding & track level initialization
│   └── package.json
│
├── csv_data_studio/      # CSV dataset ingestion & analytics studio
│
├── db_setup.sql          # PostgreSQL schema and table definitions
└── README.md
```

---

## 🚦 Getting Started

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432`:
```bash
psql -U postgres -d postgres -f db_setup.sql
```
*(Or run `node backend/seed.js` to seed sample student benchmarks and track levels).*

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

---

## 👥 Default Demo Credentials
- **Student ID**: `24111001` | **Password**: `123`
- **Faculty ID**: `FACULTY01` | **Password**: `faculty123`
- **Admin ID**: `ADMIN01` | **Password**: `admin123`
