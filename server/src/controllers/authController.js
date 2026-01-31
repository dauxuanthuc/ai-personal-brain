const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this_in_production';

// 1. Đăng ký
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Kiểm tra email trùng
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email này đã được sử dụng!" });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        res.json({ message: "Đăng ký thành công! Hãy đăng nhập." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server khi đăng ký." });
    }
};

// 2. Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "Email hoặc mật khẩu không đúng." });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Email hoặc mật khẩu không đúng." });

        // Tạo Token (Vé vào cửa)
        const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            message: "Đăng nhập thành công!", 
            token, 
            user: { id: user.id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server khi đăng nhập." });
    }
};

module.exports = { register, login };