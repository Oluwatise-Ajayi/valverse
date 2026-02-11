# ValenVerse 💘

A romantic, interactive narrative web application designed as a unique Valentine's Day gift. Players navigate through a universe of mini-games to unlock cherished memories and media.

## ✨ Features

- **Immersive 3D & 2D Mini-Games:**
    - 🌸 **Bouquet Builder:** 3D interactive flower collection (Three.js).
    - 🎮 **Catch Hearts:** Arcade-style heart catcher (Phaser).
    - 🎫 **Scratch Card:** Reveal hidden messages.
    - 📖 **Love Story RPG:** Branching narrative visual novel.
    - 💌 **Compliment Generator:** Daily affirmations.
- **🔐 Media Vault:** Secure gallery to view unlocked photos and videos.
- **🌍 Game Hub:** Central navigation map.
- **📱 PWA Support:** Installable on mobile devices for a native app feel.
- **💾 Progress Sync:** Cross-device progress tracking via secure backend.

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Framer Motion
- **Graphics:** React Three Fiber (R3F), Phaser.js
- **State Management:** Zustand
- **PWA:** `next-pwa`

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma 7 (Rust-free, Driver Adapter)
- **Authentication:** JWT (Passport)
- **Media:** Cloudinary Integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account (for media)

### 1. Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd valentine-app

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `.env` in `backend/`:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/valenverse?schema=public"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRATION="7d"

# Cloudinary (Required for Media Vault)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Server Configuration
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Database Initialization

```bash
cd backend
# Generate Prisma Client (v7)
npx prisma generate

# Push Schema to Database
npx prisma db push
```

### 4. Running the App

**Start Backend (Port 4000):**
```bash
cd backend
npm run start:dev
```

**Start Frontend (Port 3000):**
```bash
# In a new terminal
cd frontend
npm run dev
```

Visit `http://localhost:3000` to start the journey!

## 📱 PWA Installation
1. Open the app in your mobile browser.
2. Tap "Share" (iOS) or "Menu" (Android).
3. Select "Add to Home Screen".
4. Launch from your home screen for the full fullscreen experience.

## 📂 Project Structure

```
valentine-app/
├── backend/            # NestJS API & Database
│   ├── prisma/         # Schema & Migrations
│   ├── src/            # Source code (Auth, Users, Progress, Media)
│   └── test/           # E2E Tests
└── frontend/           # Next.js Application
    ├── app/            # App Router & Pages
    ├── components/     # UI & Game Components
    ├── lib/            # API Client & Utils
    └── stores/         # Zustand State Management
```

## 📄 License
Private / Personal Use Only.
