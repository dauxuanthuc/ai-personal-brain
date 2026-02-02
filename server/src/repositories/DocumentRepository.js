/**
 * Document Repository
 * SRP: Chỉ xử lý Document-related database operations
 */

const BaseRepository = require('./BaseRepository');
const ResourceNotFoundException = require('../exceptions/ResourceNotFoundException');

class DocumentRepository extends BaseRepository {
  async findById(id) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        concepts: true,
        subject: true,
      },
    });

    if (!document) {
      throw new ResourceNotFoundException('Document', id);
    }

    return document;
  }

  async findBySubjectId(subjectId) {
    return await this.prisma.document.findMany({
      where: { subjectId },
      select: {
        id: true,
        title: true,
        filePath: true,
        uploadedAt: true,
        _count: { select: { concepts: true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async create(data) {
    return await this.prisma.document.create({
      data,
    });
  }

  async update(id, data) {
    return await this.prisma.document.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await this.prisma.document.delete({
      where: { id },
    });
  }

  async findConceptsByDocumentId(documentId) {
    return await this.prisma.concept.findMany({
      where: { documentId },
    });
  }

  async deleteWithRelations(id) {
    const document = await this.findById(id);
    const concepts = await this.findConceptsByDocumentId(id);

    // Xóa tất cả relations liên quan
    for (const concept of concepts) {
      await this.prisma.relation.deleteMany({
        where: {
          OR: [{ sourceId: concept.id }, { targetId: concept.id }],
        },
      });
    }

    // Xóa tất cả concepts
    await this.prisma.concept.deleteMany({
      where: { documentId: id },
    });

    // Xóa document
    await this.delete(id);

    return document;
  }
}

module.exports = DocumentRepository;
