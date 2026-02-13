-- DropIndex
DROP INDEX "ZipCode_code_idx";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "text" DROP NOT NULL;
