/*
  Warnings:

  - You are about to drop the column `locationLocationID` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `tagTagID` on the `Picture` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "photoID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "locationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "size" INTEGER,
    CONSTRAINT "Picture_photoID_fkey" FOREIGN KEY ("photoID") REFERENCES "Location" ("locationID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Picture_photoID_fkey" FOREIGN KEY ("photoID") REFERENCES "Tag" ("tagID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "filepath", "locationId", "photoID", "place", "size", "tagId") SELECT "createdAt", "filepath", "locationId", "photoID", "place", "size", "tagId" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
