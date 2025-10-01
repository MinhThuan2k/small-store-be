/*
  Warnings:

  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tasks" DROP CONSTRAINT "Tasks_assigner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tasks" DROP CONSTRAINT "Tasks_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tasks" DROP CONSTRAINT "Tasks_updated_by_fkey";

-- DropTable
DROP TABLE "public"."Tasks";
