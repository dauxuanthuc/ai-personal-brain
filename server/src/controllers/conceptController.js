const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteConcept = async (req, res) => {
    try {
        const { conceptId } = req.params;

        if (!conceptId) {
            return res.status(400).json({ error: "Cần cung cấp conceptId" });
        }

        // Kiểm tra concept có tồn tại không
        const concept = await prisma.concept.findUnique({
            where: { id: conceptId }
        });

        if (!concept) {
            return res.status(404).json({ error: "Khái niệm không tồn tại hoặc đã bị xóa" });
        }

        // Xóa tất cả Relation liên quan
        await prisma.relation.deleteMany({
            where: {
                OR: [
                    { sourceId: conceptId },
                    { targetId: conceptId }
                ]
            }
        });

        // Xóa Concept
        const deleted = await prisma.concept.delete({
            where: { id: conceptId }
        });

        res.json({ message: "Xóa khái niệm thành công!", conceptId });
    } catch (error) {
        console.error("❌ Lỗi xóa:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { deleteConcept };
