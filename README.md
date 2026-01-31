# AI Personal Digital Brain 🧠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0--beta.1-blue.svg)](https://github.com/xuanthuc/ai-personal-brain/releases)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Nền tảng **"Bộ não số cá nhân"** hỗ trợ học tập và quản lý tri thức. Tích hợp Knowledge Graph, NLP nhẹ, và Gemini AI.

> 🎯 Cuộc thi **Website & AI Innovation Contest 2026** - Bảng B.

## 📋 Nội dung
- [Tính năng](#tính-năng) | [Công nghệ](#công-nghệ) | [Cài đặt nhanh](#cài-đặt-nhanh) | [Cấu trúc](#cấu-trúc-dự-án) | [API](#api-documentation) | [Giấy phép](#giấy-phép)

## ✨ Tính năng
- ✅ Upload & quản lý PDF
- ✅ Trích xuất khái niệm tự động
- ✅ Knowledge Graph trực quan
- ✅ Hỏi đáp AI dựa trên tri thức cá nhân
- ✅ NLP nhẹ + Knowledge Graph match
- ✅ Giảm 50% API calls
- ✅ JWT authentication
- ✅ Dashboard statistics

## 🚀 Công nghệ
**Frontend:** React 19, Vite, TailwindCSS, D3.js  
**Backend:** Node.js 18+, Express 5, Prisma ORM, SQLite/PostgreSQL  
**AI:** Google Gemini 2.5, Groq Llama 3.1, NLP nhẹ  
**Auth:** JWT + bcryptjs  
**File:** multer + pdf-data-parser  

## ⚡ Cài đặt nhanh (5 phút)
```bash
git clone https://github.com/xuanthuc/ai-personal-brain.git
cd ai-personal-brain

# Backend
cd server && npm install && cp .env.example .env
npx prisma migrate dev && npm start

# Frontend (new terminal)
cd client && npm install && npm run dev
```
Server: http://localhost:5000 | Frontend: http://localhost:5173

📖 **Chi tiết:** [SETUP.md](server/SETUP.md)

## 📁 Cấu trúc dự án
```
ai-personal-brain/
├── server/          - Backend (Node.js + Express + Prisma)
│   ├── src/controllers/  - Auth, Documents, Subjects
│   ├── src/services/     - AI + NLP service
│   ├── prisma/schema.prisma
│   └── SECURITY.md   - Environment variables guide
├── client/          - Frontend (React + Vite)
│   └── src/          - App, Dashboard, AuthPage
├── README.md        - Documentation
├── CHANGELOG.md     - Version history
└── LICENSE          - MIT License
```

## 🔌 API Documentation
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /subjects` - Danh sách môn
- `POST /subjects/:id/ask` - Hỏi AI
- `POST /documents/upload` - Upload PDF

📄 Chi tiết: [SETUP.md#API](server/SETUP.md)

## 📝 Thư viện & Phụ thuộc
Xem: [server/package.json](server/package.json), [client/package.json](client/package.json)

**Chính:** Express, Prisma, React, Vite, Gemini SDK, Groq SDK

## 📜 Giấy phép
MIT License - Mã nguồn mở được chấp nhận bởi OSI  
Xem: [LICENSE](LICENSE)

## 📋 Changelog
Xem: [CHANGELOG.md](CHANGELOG.md)

---
Made with ❤️ | ⭐ Star if you like it!