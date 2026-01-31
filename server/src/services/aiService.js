const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HfInference } = require("@huggingface/inference");
const Groq = require("groq-sdk");
require('dotenv').config();

// --- 1. CẤU HÌNH ---
// Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// Sử dụng model gemini-2.5-flash cho tốc độ nhanh và ổn định hơn
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Hugging Face
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// --- 2. HÀM XỬ LÝ ---

async function askGemini(prompt) {
    console.log("🤖 Đang gọi Gemini (2.5 Flash)...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

async function askGroq(prompt) {
    console.log("⚡ Đang gọi Groq (Llama3)...");
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant", 
    });
    return chatCompletion.choices[0]?.message?.content || "";
}

async function askSmartAI(prompt) {
    try {
        return await askGemini(prompt);
    } catch (error) {
        console.error("⚠️ Gemini lỗi:", error.message); // In lỗi ra để debug
        console.log("🔄 Chuyển sang Groq...");
        
        try {
            return await askGroq(prompt);
        } catch (groqError) {
            console.error("❌ Groq cũng lỗi:", groqError.message); // In lỗi ra để debug
            return "Hệ thống đang quá tải hoặc sai API Key. Vui lòng kiểm tra Terminal.";
        }
    }
}

async function extractWithHF(text) {
    try {
        // Đổi sang model 'google/flan-t5-small' hoặc tắt tạm nếu chưa cần thiết
        // Vì model bart-large-cnn chỉ hỗ trợ tiếng Anh tốt
        return "Tính năng tóm tắt đang bảo trì để tối ưu tiếng Việt."; 
    } catch (error) {
        return null;
    }
}

module.exports = { askSmartAI, extractWithHF };