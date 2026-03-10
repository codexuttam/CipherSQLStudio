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
   - set environment variables: DATABASE_URL (Postgres), MONGODB_URI (MongoDB), GOOGLE_API_KEY (optional for Gemini hints)
   - node scripts/seed.js # to generate standard database schema assignments
   - npm run dev

2. Frontend
   - cd ciphersqlstudio/frontend
   - npm install
   - npm start

Architecture & Stack:
- **MongoDB** (`MONGODB_URI`): Operates as the permanent "Persistence Database" in this system. It strictly stores the definitions of the assignments, their expected answers, the user progress, and the meta description required to construct the frontend application's catalog.
- **PostgreSQL** (`DATABASE_URL`): Operates exclusively as an isolated "Sandbox". It holds ZERO permanent records. When a user requests to run a query, the backend spins up a temporary virtual schema folder securely, dynamically populates temporary tables with the constraints defined inside MongoDB, executes the student's attempt, gathers the result, and deletes the entire schema via a `ROLLBACK`.
