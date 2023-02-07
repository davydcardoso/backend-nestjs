/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('DEVELOPER', 'ADMINISTRATOR', 'SUPORT', 'CLIENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "access_level" "AccessLevel" NOT NULL DEFAULT 'CLIENT',
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "created_at" DATE,
ADD COLUMN     "document" VARCHAR(21) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "params" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "company_id" TEXT,
    "value" TEXT NOT NULL,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "params_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "button_icon" TEXT NOT NULL,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "document" VARCHAR(21) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "params_name_key" ON "params"("name");

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_document_key" ON "companies"("document");

-- CreateIndex
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");

-- AddForeignKey
ALTER TABLE "params" ADD CONSTRAINT "params_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
