# Frontend (React + Vite)

Tài liệu này hướng dẫn chạy phần frontend của dự án.

## Yêu cầu
- Node.js 18+
- npm 9+

## Cài đặt & chạy
```bash
# Vào thư mục client
cd client

# Cài dependencies
npm install

# Tạo file môi trường
cp .env.example .env

# Chạy dev server
npm run dev
# Frontend: http://localhost:5173
```

## Biến môi trường

```env
VITE_GOOGLE_CLIENT_ID=
```

## Ghi chú
- Nếu thay đổi biến môi trường, hãy khởi động lại dev server.
- Cấu hình CORS của backend cần trùng với URL frontend.
