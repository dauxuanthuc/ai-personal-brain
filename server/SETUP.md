# Hướng dẫn cài đặt Backend - v1.0.0

## Yêu cầu hệ thống
- **Node.js**: 18.0.0 trở lên
- **npm**: 9.0.0 trở lên
- **Hệ điều hành**: Windows, macOS hoặc Linux
- **RAM**: Khuyến nghị tối thiểu 2GB
- **Cơ sở dữ liệu**: SQLite (dev) hoặc PostgreSQL (prod)

## 🚀 Bắt đầu nhanh (5 phút)

### 1. Clone repository
```bash
git clone https://github.com/xuanthuc/ai-personal-brain.git
cd ai-personal-brain/server
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
```bash
cp .env.example .env
# Sửa .env với giá trị của bạn (xem mục Biến môi trường bên dưới)
```

### 4. Khởi tạo cơ sở dữ liệu
```bash
npx prisma migrate dev --name init_supabase
# Lệnh này sẽ tạo SQLite database ở môi trường dev
```

### 5. Chạy server
```bash
npm start
# Server chạy tại http://localhost:5000
```

### 6. Thiết lập client (frontend)
```bash
# Mở terminal mới
cd ../client
npm install
cp .env.example .env
npm run dev
# Frontend chạy tại http://localhost:5173
```

---

## 📦 Các bước cài đặt

### Bước 1: Kiểm tra prerequisites
```bash
node --version   # Phải >= v18.0.0
npm --version    # Phải >= 9.0.0
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# Cài tất cả packages từ package.json
```

### Bước 3: Cấu hình môi trường
```bash
cp .env.example .env
```

Sửa file `.env` theo cấu hình của bạn:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"  # SQLite cho dev
# DATABASE_URL="postgresql://user:password@localhost:5432/ai-brain"  # PostgreSQL

# JWT Authentication
JWT_SECRET=<generate_using_SECURITY.md>
JWT_EXPIRY=7d

# AI Services (bắt buộc)
GOOGLE_API_KEY=<your_google_api_key>
GROQ_API_KEY=<your_groq_api_key>
HF_ACCESS_TOKEN=<your_huggingface_token>

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (tuỳ chọn)
EMAIL_SERVICE=gmail
EMAIL_USER=<your_email>
EMAIL_PASS=<your_app_password>
```

**Xem [SECURITY.md](./SECURITY.md) để tạo secret an toàn.**

### Bước 4: Thiết lập database
```bash
# Tạo database và chạy migration
npx prisma migrate dev --name init_supabase

# Xem database trong Prisma Studio
npx prisma studio
```

### Bước 5: Chạy server
```bash
# Production mode
npm start

# Development mode (tự reload)
npm run dev
```

**Kiểm tra**: Server chạy tại `http://localhost:5000`

### Bước 6: Thiết lập client (frontend)
```bash
# Mở terminal mới
cd ../client
npm install
cp .env.example .env
npm run dev
```

**Kiểm tra**: Frontend chạy tại `http://localhost:5173`

---

## 🏗️ Tổng quan kiến trúc

### Design patterns
- **Factory Pattern**: `AIProviderFactory` - quản lý Gemini/Groq
- **Repository Pattern**: `BaseRepository`, `ConceptRepository`, `DocumentRepository`
- **Service Layer**: business logic tập trung (aiService, authService, ...)
- **Dependency Injection**: `DIContainer` giúp loose coupling

### Cấu trúc thư mục
```
server/
├── src/
│   ├── config/          # Cấu hình (database, DIContainer)
│   ├── controllers/     # Request handlers
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── factories/       # AI provider factory
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── exceptions/      # Custom exceptions
│   ├── utils/           # Utility functions
│   └── index.js         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Prisma migrations
├── package.json         # Dependencies (v1.0.0)
├── SETUP.md            # File này
├── SECURITY.md         # Cấu hình bảo mật
└── .env.example        # Mẫu cấu hình môi trường
```

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký người dùng
- `POST /auth/login` - Đăng nhập
- `GET /auth/verify/:token` - Xác thực email

### Subjects
- `GET /subjects` - Lấy tất cả môn học
- `GET /subjects/:id` - Chi tiết môn học
- `POST /subjects` - Tạo môn học
- `POST /subjects/:id/ask` - Hỏi AI về môn học

### Documents
- `POST /documents/upload` - Upload PDF
- `GET /documents` - Danh sách tài liệu
- `GET /documents/:id` - Chi tiết tài liệu

### Concepts
- `GET /concepts` - Danh sách khái niệm
- `POST /concepts/:id/relations` - Quan hệ khái niệm

### Knowledge Graph
- `GET /graph` - Lấy đồ thị tri thức (nodes & edges)

---

## 🐛 Xử lý sự cố

### Lỗi: `npm install` thất bại
**Cách khắc phục:**
```bash
# Xoá cache npm
npm cache clean --force

# Xoá node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

### Lỗi: Migration database thất bại
**Cách khắc phục:**
```bash
# Kiểm tra DATABASE_URL trong .env
echo $DATABASE_URL

# Reset database (chỉ dev)
rm dev.db  # SQLite
# Chạy lại migration nếu dùng Sqlite
npx prisma migrate dev
# Chạy lại migration nếu dùng supabase
npx prisma migrate dev --name init_supabase 
```

### Lỗi: Port 5000 đang được sử dụng
**Cách khắc phục:**
```bash
# Đổi PORT trong .env
PORT=5001

# Hoặc tắt tiến trình đang chiếm port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### Lỗi: CORS khi gọi từ frontend
**Cách khắc phục:**
```env
# Cập nhật .env với đúng URL frontend
CORS_ORIGIN=http://localhost:5173
```

### Lỗi: API keys AI không hoạt động
**Cách khắc phục:**
1. Kiểm tra keys trong `.env`
2. Kiểm tra quota trên dashboard của provider
3. Test key:
   ```bash
   curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
   ```

---

## 📊 Dependencies (v1.0.0)

### Core Framework
- `express@^5.2.1` - Web framework
- `@prisma/client@^5.10.0` - ORM database

### Authentication & Security
- `jsonwebtoken@^9.0.3` - JWT token generation
- `bcryptjs@^3.0.3` - Password hashing
- `dotenv@^17.2.3` - Environment variables

### AI & NLP
- `@google/generative-ai@^0.24.1` - Google Gemini API
- `groq-sdk@^0.37.0` - Groq Llama API
- `@huggingface/inference@^4.13.11` - Hugging Face models

### File Handling
- `multer@^2.0.2` - File upload
- `pdf-data-parser@^1.2.20` - PDF parsing
- `cloudinary@^2.5.0` - Cloud storage

### Communication
- `nodemailer@^6.9.15` - Email service
- `cors@^2.8.6` - CORS middleware

### Development
- `nodemon@^3.1.11` - Auto-reload
- `prisma@^5.10.0` - Prisma CLI

---

## 🧪 Kiểm thử

### Test API endpoints
```bash
# Đăng ký người dùng
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Đăng nhập
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Lấy subjects (cần token)
curl -X GET http://localhost:5000/subjects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Ví dụ file môi trường

Xem [.env.example](./.env.example) để biết mẫu đầy đủ.

---

## 🔐 Bảo mật

**Quản lý secrets: xem [SECURITY.md](./SECURITY.md)**

- Không commit file `.env`
- Dùng `.env.example` làm mẫu cấu hình
- Tạo `JWT_SECRET` an toàn theo SECURITY.md
- Dùng biến môi trường cho tất cả dữ liệu nhạy cảm

---

## 📚 Tài nguyên

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Groq API](https://console.groq.com/)
- [JWT Authentication](https://jwt.io/)

---

## 📞 Hỗ trợ

Khi gặp vấn đề:
1. Xem mục [Xử lý sự cố](#-xử-lý-sự-cố)
2. Xem [SECURITY.md](./SECURITY.md)
3. Kiểm tra log: `npm run dev`
4. Tạo issue tại: https://github.com/xuanthuc/ai-personal-brain/issues

---

**Version**: 1.0.0 | **Release Date**: March 13, 2026 | **License**: MIT
