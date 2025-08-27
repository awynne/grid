-- CreateTable
CREATE TABLE "balancing_authorities" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balancing_authorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "id" TEXT NOT NULL,
    "ba_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "units" TEXT NOT NULL,
    "description" TEXT,
    "eia_series_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations" (
    "series_id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(12,3) NOT NULL,
    "quality_flag" TEXT NOT NULL DEFAULT 'good',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observations_pkey" PRIMARY KEY ("series_id","ts")
);

-- CreateIndex
CREATE UNIQUE INDEX "balancing_authorities_code_key" ON "balancing_authorities"("code");

-- CreateIndex
CREATE INDEX "series_ba_id_type_idx" ON "series"("ba_id", "type");

-- CreateIndex
CREATE INDEX "series_is_active_idx" ON "series"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "series_ba_id_type_subtype_key" ON "series"("ba_id", "type", "subtype");

-- CreateIndex
CREATE INDEX "observations_ts_series_id_idx" ON "observations"("ts", "series_id");

-- CreateIndex
CREATE INDEX "observations_value_idx" ON "observations"("value");

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_ba_id_fkey" FOREIGN KEY ("ba_id") REFERENCES "balancing_authorities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations" ADD CONSTRAINT "observations_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
