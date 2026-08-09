# MediLens AI — AI-Powered Medical Image Analysis & Health Intelligence Platform

**MediLens AI** is an interview-ready, high-performance web application designed for radiology decision support, explainable neural heatmaps, automated clinical reports, and pharmaceutical OCR scanning.

---

## 🌟 Key Features

1. **Explainable AI Workspace (`/analysis/[id]`)**:
   - Interactive Canvas Viewer with native pan, drag, zoom (0.5x–3.0x), brightness/contrast adjustment, and fullscreen mode.
   - Grad-CAM heatmap overlay with real-time opacity slider (0%–100%) and bounding box highlights.
   - Confidence scoring distributions, severity badges (Normal, Low, Moderate, High, Critical), and explainability breakdowns.

2. **4-Step Scan Analysis Wizard (`/analysis/new`)**:
   - Drag & drop file uploader supporting JPG, PNG, WEBP, and DICOM presets.
   - Modality selection (Chest X-Ray, Brain MRI, Knee MRI, Thyroid Ultrasound).
   - Animated multi-stage AI progress pipeline (Uploading -> Pre-processing -> Neural Inference -> Grad-CAM Heatmaps).

3. **Standardized Clinical Reports (`/reports` & `/reports/[id]`)**:
   - Diagnostic summary generation, radiologist impression, structured anatomic observations, and recommendations.
   - Printable & downloadable PDF formatted layout with electronic signature block and non-diagnostic disclaimer.

4. **AI Medical Assistant (`/assistant`)**:
   - Conversational AI medical knowledge companion trained on clinical radiology guidelines.
   - Suggested prompts, source citations, response copy, regeneration, and feedback controls.

5. **Pharmaceutical Label Scanner (`/drug-scanner`)**:
   - Simulated OCR optical character extraction for medicine packaging.
   - Dosage guidelines, primary clinical indications, black-box warnings, and drug-drug interaction matrix.

6. **Admin Management Console (`/admin/*`)**:
   - Real-time GPU inference telemetry, request load charts (Recharts), model accuracy, AUROC metrics, and user permission management.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router), React 19+, TypeScript
- **Styling**: Tailwind CSS v4, CSS Variables, `next-themes` (Dark/Light mode)
- **Animations**: Framer Motion
- **Form & Validation**: React Hook Form, Zod
- **Data Fetching & State**: TanStack Query (React Query v5), Zustand
- **Visualization**: Recharts
- **Icons & UI**: Lucide React, Sonner Toasters

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (marketing)/page.tsx          # Marketing Landing Page
│   ├── (auth)/                       # Login, Register, Forgot Password, Verify Email
│   ├── (app)/                        # Authenticated App Shell
│   │   ├── dashboard/                # SaaS Overview Dashboard
│   │   ├── analysis/                 # New Scan Wizard & Interactive Workspace
│   │   ├── reports/                  # Reports List & Printable PDF Viewer
│   │   ├── history/                  # Scan History Timeline
│   │   ├── assistant/                # AI Chatbot Workspace
│   │   ├── drug-scanner/             # Pill OCR Scanner
│   │   ├── profile/                  # User Profile & Affiliation
│   │   └── settings/                 # Theme & Security Settings
│   └── admin/                        # Admin Console & AI Model Registry
├── components/
│   ├── ui font/                      # Button, Card, Badge, Skeleton, Dialog primitives
│   ├── layout/                       # Navbar, LandingFooter, AppSidebar, AppHeader, MobileNav
│   └── providers.tsx                 # QueryClient & Theme Providers
├── lib/
│   ├── api/                          # Mock API Client Layer (services.ts)
│   ├── mocks/                        # High-resolution SVG Scans & Synthetic Datasets
│   ├── hooks/                        # TanStack Query Hooks & Zustand Stores
│   └── utils.ts                      # Class merging & Date utilities
└── types/                            # Domain TypeScript Interfaces
```

---

## 🛠️ Local Development & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials

You can click **"Click to Auto-fill Demo Credentials"** on the `/login` screen or use:

- **Email**: `dr.elena@medilens.ai`
- **Password**: `DemoRadiologist2026!`

---

## 🔄 Replacing Mock API with a FastAPI Backend

The frontend architecture cleanly decouples UI components from data fetching via `src/lib/api/services.ts` and TanStack Query hooks in `src/lib/hooks/use-api.ts`.

To connect to a live FastAPI / PyTorch backend:
1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.medilens.ai
   ```
2. In `src/lib/api/services.ts`, swap `delay()` synthetic returns with `fetch()` or `axios`:
   ```ts
   async getAnalysisById(id: string): Promise<AnalysisItem> {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/analyses/${id}`);
     return res.json();
   }
   ```
