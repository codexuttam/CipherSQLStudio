# CipherSQLStudio — Minimal SQL Practice Platform

This repository contains a minimal MVP for a SQL practice platform (LeetCode-style).

Structure:

ciphersqlstudio/
  frontend/   (React + SCSS)
  backend/    (Node + Express)
  README.md
  data-flow-diagram.jpg  (placeholder — replace with your hand-drawn photo)

Quick start (development):

1. Backend
   - cd ciphersqlstudio/backend
   - npm install
   - set environment variables: DATABASE_URL (Postgres), OPENAI_API_KEY (optional for hints)
   - npm run dev

2. Frontend
   - cd ciphersqlstudio/frontend
   - npm install
   - npm start

Notes:
- The backend includes a simple SQL validator allowing only SELECT/ WITH statements. Use caution when connecting a real DB.
- Replace `data-flow-diagram.jpg` with your photo of the hand-drawn diagram.

Next steps:
- Replace mock assignments or connect MongoDB for assignment storage.
- Add user/auth and attempts saving if desired.
