-- AlterTable
ALTER TABLE "Ride" ADD COLUMN "office" TEXT;

-- CreateIndex
CREATE INDEX "Ride_office_idx" ON "Ride"("office");
