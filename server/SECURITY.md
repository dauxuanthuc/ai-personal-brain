# Hướng dẫn bảo mật

## Bí mật (Secrets)
Tất cả bí mật phải nằm trong biến môi trường.

Bắt buộc:
- JWT_SECRET
- GOOGLE_API_KEY
- GROQ_API_KEY
- HF_ACCESS_TOKEN

## Tạo JWT_SECRET (từng bước)
1. Mở terminal tại thư mục dự án.
2. Chạy lệnh sau để tạo chuỗi bí mật:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
3. Sao chép kết quả và dán vào file `.env`:
```env
JWT_SECRET=<dán_chuỗi_vào_đây>
```

## Vệ sinh Git
- .env đã bị chặn bởi .gitignore
- Dùng .env.example làm mẫu cấu hình
