/*
  Warnings:

  - Made the column `type` on table `Picture` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Picture" ("city", "country", "createdAt", "filepath", "id", "place", "state", "type") SELECT "city", "country", "createdAt", "filepath", "id", "place", "state", "type" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
