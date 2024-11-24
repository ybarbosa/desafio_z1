/*
  Warnings:

  - The primary key for the `Cart_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `card_id` on the `Cart_item` table. All the data in the column will be lost.
  - Added the required column `cart_id` to the `Cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart_item" DROP CONSTRAINT "Cart_item_card_id_fkey";

-- AlterTable
ALTER TABLE "Cart_item" DROP CONSTRAINT "Cart_item_pkey",
DROP COLUMN "card_id",
ADD COLUMN     "cart_id" INTEGER NOT NULL,
ADD CONSTRAINT "Cart_item_pkey" PRIMARY KEY ("cart_id", "product_id");

-- AddForeignKey
ALTER TABLE "Cart_item" ADD CONSTRAINT "Cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
