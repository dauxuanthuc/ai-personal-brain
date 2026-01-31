const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { extractConceptsFromQuestion, askSmartAI, normalizeText } = require('../services/aiService');
const prisma = new PrismaClient();

// 1. Lấy danh sách môn học của User
const getSubjects = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy từ Token
        const subjects = await prisma.subject.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { documents: true } } } // Đếm số file
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy danh sách môn." });
    }
};

// 2. Tạo môn học mới
const createSubject = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name } = req.body;
        
        const newSubject = await prisma.subject.create({
            data: { name, userId }
        });
        res.json(newSubject);
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo môn học." });
    }
};

// 3. [QUAN TRỌNG] Lấy Graph tổng hợp của 1 môn
const getSubjectGraph = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Lấy tất cả Concept thuộc về môn học này (thông qua Document)
        const concepts = await prisma.concept.findMany({
            where: {
                document: {
                    subjectId: subjectId
                }
            },
            include: {
                document: {
                    select: { title: true, id: true } // Để biết khái niệm này từ file nào
                }
            }
        });

        // Xử lý dữ liệu để vẽ Graph
        // Gộp các khái niệm trùng tên (normalize để so sánh)
        const nodes = [];
        const links = [];
        const conceptMap = new Map(); // Map để gộp các concept cùng tên

        // Tạo Node trung tâm cho từng File
        const docs = await prisma.document.findMany({ where: { subjectId } });
        const docMap = {};
        
        docs.forEach(doc => {
            docMap[`FILE_${doc.id}`] = {
                id: doc.id,
                title: doc.title,
                filePath: doc.filePath
            };
            nodes.push({
                id: `FILE_${doc.id}`,
                name: doc.title,
                val: 30,
                color: '#ef4444',
                type: 'Source'
            });
        });

        // Gộp các concept cùng tên (normalize để tránh case-sensitive)
        concepts.forEach(concept => {
            const normalizedTerm = concept.term.toLowerCase().trim();
            
            if (!conceptMap.has(normalizedTerm)) {
                conceptMap.set(normalizedTerm, {
                    term: concept.term, // Lưu tên gốc
                    definition: concept.definition,
                    pages: [concept.pageNumber],
                    documentIds: [concept.documentId],
                    occurrences: 1
                });
            } else {
                // Khái niệm đã tồn tại - cập nhật thông tin
                const existing = conceptMap.get(normalizedTerm);
                existing.occurrences++;
                if (!existing.pages.includes(concept.pageNumber)) {
                    existing.pages.push(concept.pageNumber);
                }
                if (!existing.documentIds.includes(concept.documentId)) {
                    existing.documentIds.push(concept.documentId);
                }
            }
        });

        // Tạo nodes từ conceptMap
        for (const [normalizedTerm, conceptData] of conceptMap.entries()) {
            nodes.push({
                id: normalizedTerm, // ID dùng normalized để gộp
                name: conceptData.term, // Hiển thị tên gốc
                definition: conceptData.definition,
                page: conceptData.pages[0], // Trang đầu tiên xuất hiện
                documentId: conceptData.documentIds[0], // Document đầu tiên
                val: 10 + (conceptData.occurrences * 2), // Kích thước tăng theo số lần xuất hiện
                color: conceptData.occurrences > 1 ? '#f59e0b' : '#3b82f6', // Màu cam nếu xuất hiện nhiều lần
                type: 'Concept',
                occurrences: conceptData.occurrences,
                allPages: conceptData.pages,
                allDocumentIds: conceptData.documentIds
            });
        }

        // Tạo links từ File -> Khái niệm (unique links)
        const linkSet = new Set();
        concepts.forEach(concept => {
            const normalizedTerm = concept.term.toLowerCase().trim();
            const linkKey = `FILE_${concept.documentId}|${normalizedTerm}`;
            if (!linkSet.has(linkKey)) {
                links.push({
                    source: `FILE_${concept.documentId}`,
                    target: normalizedTerm
                });
                linkSet.add(linkKey);
            }
        });

        res.json({ nodes, links, documents: docs });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi lấy dữ liệu não bộ." });
    }
};

// 4. Xóa môn học
const deleteSubject = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subjectId } = req.params;

        // Kiểm tra quyền: Chỉ có chủ sở hữu mới xóa được
        const subject = await prisma.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject || subject.userId !== userId) {
            return res.status(403).json({ error: "Bạn không có quyền xóa môn học này" });
        }

        // Lấy tất cả documents của subject
        const documents = await prisma.document.findMany({
            where: { subjectId: subjectId }
        });

        // Xóa tất cả Concept và Relation liên quan
        for (const doc of documents) {
            const concepts = await prisma.concept.findMany({ where: { documentId: doc.id } });
            
            for (const concept of concepts) {
                await prisma.relation.deleteMany({
                    where: {
                        OR: [
                            { sourceId: concept.id },
                            { targetId: concept.id }
                        ]
                    }
                });
            }
            
            await prisma.concept.deleteMany({ where: { documentId: doc.id } });
        }

        // Xóa tất cả Document
        await prisma.document.deleteMany({ where: { subjectId: subjectId } });

        // Xóa Subject
        await prisma.subject.delete({ where: { id: subjectId } });

        res.json({ message: "Xóa môn học thành công!" });
    } catch (error) {
        console.error("❌ Lỗi xóa:", error);
        res.status(500).json({ error: "Lỗi xóa môn học." });
    }
};

// 5. Lấy danh sách tài liệu của một môn học
const getDocuments = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const documents = await prisma.document.findMany({
            where: { subjectId: subjectId },
            select: {
                id: true,
                title: true,
                filePath: true,
                uploadedAt: true,
                _count: { select: { concepts: true } }
            },
            orderBy: { uploadedAt: 'desc' }
        });

        // Tạo URL cho mỗi file
        const docsWithUrl = documents.map(doc => ({
            ...doc,
            fileUrl: `http://localhost:5000/uploads/${path.basename(doc.filePath)}`
        }));

        res.json(docsWithUrl);
    } catch (error) {
        console.error("❌ Lỗi lấy tài liệu:", error);
        res.status(500).json({ error: "Lỗi lấy danh sách tài liệu." });
    }
};

// Helper: Lấy danh sách khái niệm của một môn học
const getConceptsBySubject = async (subjectId) => {
    return await prisma.concept.findMany({
        where: { document: { subjectId } },
        select: { term: true, definition: true, document: { select: { title: true, id: true } } },
        distinct: ['term'] // Tránh lặp lại khái niệm giống nhau
    });
};

// 6. Hỏi AI dựa trên tri thức trong môn học
const askQuestion = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({ error: "Vui lòng nhập câu hỏi" });
        }

        console.log(`💬 Câu hỏi: "${question}"`);

        // Step 1: Lấy danh sách khái niệm của môn học từ Knowledge Graph
        const conceptsInDB = await getConceptsBySubject(subjectId);
        
        // Step 2: NLP + đối chiếu với Knowledge Graph
        const extractedConcepts = await extractConceptsFromQuestion(question, conceptsInDB);
        
        if (extractedConcepts.length === 0) {
            console.log("⚠️ Không nhận diện được khái niệm nào từ Knowledge Graph");
            return res.json({ 
                answer: "Xin lỗi, không tìm thấy khái niệm liên quan trong tài liệu của bạn. Hãy hỏi về các chủ đề mà bạn đã upload tài liệu.",
                concepts: [],
                foundConcepts: [],
                fromGeneralKnowledge: false
            });
        }

        // Step 3: Tìm kiếm chi tiết thông tin của các concepts khớp
        const searchConditions = [];
        extractedConcepts.forEach(term => {
            searchConditions.push({ term: { contains: term } });
        });

        const concepts = await prisma.concept.findMany({
            where: {
                document: { subjectId: subjectId },
                OR: searchConditions.length > 0 ? searchConditions : undefined
            },
            include: {
                document: { select: { title: true } }
            },
            take: 10
        });

        // Step 4: Gọi AI LỚN chỉ ở bước tổng hợp/trả lời
        console.log("🤖 Đang sinh câu trả lời với AI...");

        let contextSource = [];
        let prompt = '';

        if (concepts.length === 0) {
            // Không tìm thấy chi tiết - trả lời bằng kiến thức chung
            prompt = `
Câu hỏi: "${question}"

Hãy trả lời dựa vào kiến thức chung một cách ngắn gọn, chính xác.

Lưu ý:
- Trả lời bằng tiếng Việt
- Bắt đầu bằng: "⚠️ Thông tin này không có trong tài liệu của bạn, nhưng theo kiến thức chung:"
- Thêm ví dụ minh họa nếu có
- Đề xuất upload tài liệu liên quan
            `;
        } else {
            // Tìm thấy khái niệm - tạo context từ documents
            contextSource = concepts.map(c => ({
                term: c.term,
                definition: c.definition,
                source: c.document.title
            }));

            const context = concepts.map((c, i) => 
                `${i + 1}. "${c.term}": ${c.definition} (từ: ${c.document.title})`
            ).join('\n');

            prompt = `
Bạn là trợ lý học tập. Tổng hợp câu trả lời từ kiến thức sau:

KIẾN THỨC TỪ TÀI LIỆU:
${context}

CÂUHỎI: "${question}"

Hướng dẫn:
- ƯU TIÊN sử dụng thông tin từ tài liệu
- Nếu cần, BỔ SUNG kiến thức chung (so sánh, ví dụ)
- Trả lời tiếng Việt, ngắn gọn, dễ hiểu
- Trích dẫn rõ nguồn tài liệu
            `;
        }

        const answer = await askSmartAI(prompt);
        console.log("✅ Hoàn thành");

        res.json({
            answer,
            concepts: extractedConcepts,
            foundConcepts: contextSource,
            fromGeneralKnowledge: concepts.length === 0
        });

    } catch (error) {
        console.error("❌ Lỗi xử lý câu hỏi:", error);
        res.status(500).json({ error: "Lỗi xử lý câu hỏi: " + error.message });
    }
};

module.exports = { getSubjects, createSubject, getSubjectGraph, deleteSubject, getDocuments, askQuestion };