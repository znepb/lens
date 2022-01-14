/*
  Warnings:

  - The primary key for the `Picture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location` on the `Picture` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Picture` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "place" TEXT,
    "createdAt" DATETIME NOT NULL,
    "type" TEXT
);
INSERT INTO "new_Picture" ("createdAt", "filepath", "id") SELECT "createdAt", "filepath", "id" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
