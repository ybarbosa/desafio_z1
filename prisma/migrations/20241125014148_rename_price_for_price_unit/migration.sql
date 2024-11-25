/*
  Warnings:

  - You are about to drop the column `price` on the `Order_Item` table. All the data in the column will be lost.
  - Added the required column `priceUnit` to the `Order_Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_Item" DROP COLUMN "price",
ADD COLUMN     "priceUnit" INTEGER NOT NULL;
