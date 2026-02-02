/**
 * Document Service
 * SRP: Chỉ xử lý document-related business logic
 */

const fs = require('fs');
const { PdfDataParser } = require('pdf-data-parser');
const ValidationException = require('../exceptions/ValidationException');

class DocumentService {
  constructor(documentRepository, conceptRepository, subjectRepository, aiService) {
    this.documentRepository = documentRepository;
    this.conceptRepository = conceptRepository;
    this.subjectRepository = subjectRepository;
    this.aiService = aiService;
  }

  /**
   * Upload và process document
   */
  async uploadDocument(file, subjectId) {
    if (!file) {
      throw new ValidationException('Vui lòng upload file PDF', 'file');
    }

    try {
      // Đọc PDF
      const fullText = await this._extractPdfText(file.path);
      const totalPages = Math.ceil(fullText.length / 3000) || 1;

      // Lấy hoặc tạo subject
      let subject = await this.subjectRepository.findById(subjectId).catch(() => null);
      if (!subject) {
        subject = await this.subjectRepository.create({
          name: 'Môn học Demo',
          userId: 'demo-user',
        });
        subjectId = subject.id;
      }

      // Tạo document
      const newDoc = await this.documentRepository.create({
        title: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        subjectId,
      });

      // Gọi AI để trích xuất concepts
      const concepts = await this._extractConceptsViaAI(fullText);

      // Lưu concepts vào DB với deduplication
      await this._saveConcepts(concepts, newDoc.id, subjectId);

      return {
        message: 'Xử lý thành công!',
        document: newDoc,
        extractedConcepts: concepts,
        totalPages,
      };
    } catch (error) {
      // Xóa file nếu lỗi
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  /**
   * Xóa document
   */
  async deleteDocument(documentId) {
    const document = await this.documentRepository.deleteWithRelations(documentId);

    // Xóa file từ disk
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
      console.log(`✅ Xóa file: ${document.filePath}`);
    }

    return { message: 'Xóa tài liệu thành công!', documentId };
  }

  /**
   * Private method: Extract text từ PDF
   */
  async _extractPdfText(filePath) {
    try {
      const parser = new PdfDataParser({ url: filePath });
      const rows = await parser.parse();
      return rows.map((row) => row.join(' ')).join('\n');
    } catch (error) {
      console.error('❌ Lỗi đọc PDF:', error);
      throw new ValidationException('Không thể đọc nội dung file PDF này');
    }
  }

  /**
   * Private method: Gọi AI để trích xuất concepts
   */
  async _extractConceptsViaAI(text) {
    const prompt = `
      Dựa vào tài liệu học tập sau, hãy trích xuất 5-7 khái niệm quan trọng nhất.
      Trả về JSON CHUẨN dạng: [{"term": "Tên khái niệm", "definition": "Định nghĩa", "page": 1}]
      Tuyệt đối chỉ trả về JSON, không thêm lời dẫn.
      
      Văn bản: "${text.substring(0, 4000)}..."
    `;

    const aiResponse = await this.aiService.ask(prompt);

    try {
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('⚠️ Lỗi parse JSON từ AI:', error);
      return [];
    }
  }

  /**
   * Private method: Lưu concepts với deduplication
   */
  async _saveConcepts(concepts, documentId, subjectId) {
    for (const concept of concepts) {
      const normalizedTerm = concept.term.toLowerCase().trim();

      // Kiểm tra xem concept đã tồn tại trong subject chưa
      // (Placeholder: implement concept deduplication logic)

      await this.conceptRepository.create({
        term: concept.term,
        definition: concept.definition,
        pageNumber: concept.page || 1,
        documentId,
      });
    }
  }
}

module.exports = DocumentService;
