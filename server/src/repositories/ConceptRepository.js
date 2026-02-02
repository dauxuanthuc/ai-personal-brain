/**
 * Concept Repository
 * SRP: Chỉ xử lý Concept-related database operations
 */

const BaseRepository = require('./BaseRepository');
const ResourceNotFoundException = require('../exceptions/ResourceNotFoundException');

class ConceptRepository extends BaseRepository {
  async findById(id) {
    const concept = await this.prisma.concept.findUnique({
      where: { id },
      include: {
        document: true,
        relatedFrom: true,
        relatedTo: true,
      },
    });

    if (!concept) {
      throw new ResourceNotFoundException('Concept', id);
    }

    return concept;
  }

  async create(data) {
    return await this.prisma.concept.create({
      data,
    });
  }

  async update(id, data) {
    return await this.prisma.concept.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    // Xóa tất cả relations
    await this.prisma.relation.deleteMany({
      where: {
        OR: [{ sourceId: id }, { targetId: id }],
      },
    });

    return await this.prisma.concept.delete({
      where: { id },
    });
  }

  async findByTermInSubject(term, subjectId) {
    return await this.prisma.concept.findMany({
      where: {
        term: { contains: term },
        document: { subjectId },
      },
      include: {
        document: { select: { title: true } },
      },
    });
  }

  async bulkCreate(concepts) {
    return await Promise.all(
      concepts.map((concept) => this.create(concept))
    );
  }

  async findExistingConceptInSubject(normalizedTerm, subjectId) {
    return await this.prisma.concept.findFirst({
      where: {
        document: { subjectId },
        term: {
          // Search case-insensitive
          search: normalizedTerm,
        },
      },
    });
  }
}

module.exports = ConceptRepository;
