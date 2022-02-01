/*
  Warnings:

  - You are about to drop the column `height` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Picture` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "place" TEXT,
    "createdAt" DATETIME NOT NULL,
    "primaryTagID" INTEGER,
    "locationId" INTEGER NOT NULL,
    "size" INTEGER,
    "description" TEXT,
    CONSTRAINT "Picture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "description", "filepath", "id", "locationId", "place", "primaryTagID", "size") SELECT "createdAt", "description", "filepath", "id", "locationId", "place", "primaryTagID", "size" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
