/*
  Warnings:

  - You are about to drop the column `tagId` on the `Picture` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PictureToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Picture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "place" TEXT,
    "createdAt" DATETIME NOT NULL,
    "locationId" INTEGER NOT NULL,
    "size" INTEGER,
    "description" TEXT,
    CONSTRAINT "Picture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "description", "filepath", "id", "locationId", "place", "size") SELECT "createdAt", "description", "filepath", "id", "locationId", "place", "size" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PictureToTag_AB_unique" ON "_PictureToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PictureToTag_B_index" ON "_PictureToTag"("B");
