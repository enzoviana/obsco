-- CreateTable
CREATE TABLE "MonthlyData" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "productCip" TEXT NOT NULL,
    "wholesalerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyData_agencyId_year_month_idx" ON "MonthlyData"("agencyId", "year", "month");

-- CreateIndex
CREATE INDEX "MonthlyData_productCip_idx" ON "MonthlyData"("productCip");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyData_agencyId_productCip_wholesalerId_year_month_key" ON "MonthlyData"("agencyId", "productCip", "wholesalerId", "year", "month");
