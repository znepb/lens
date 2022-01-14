/*
  Warnings:

  - You are about to drop the column `descriotion` on the `Picture` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "locationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "size" INTEGER,
    "description" TEXT,
    CONSTRAINT "Picture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Picture_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "filepath", "id", "locationId", "place", "size", "tagId") SELECT "createdAt", "filepath", "id", "locationId", "place", "size", "tagId" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
