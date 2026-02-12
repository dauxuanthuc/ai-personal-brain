-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "processingStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "processingError" TEXT;

-- CreateIndex
CREATE INDEX "Document_processingStatus_idx" ON "Document"("processingStatus");
