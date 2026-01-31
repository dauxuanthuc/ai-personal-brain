#!/bin/bash
# Tạo JWT_SECRET an toàn cho production

echo "🔐 Tạo JWT_SECRET mới (32 bytes = 256 bits)..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo "✅ JWT_SECRET mới đã được tạo:"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "📝 Cập nhật vào .env file:"
echo "  Thêm dòng sau vào server/.env"
echo "  JWT_SECRET=$JWT_SECRET"
echo ""
