/*
  Warnings:

  - Made the column `emoji` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "tagID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "emoji" TEXT NOT NULL
);
INSERT INTO "new_Tag" ("backgroundColor", "emoji", "name", "tagID", "textColor") SELECT "backgroundColor", "emoji", "name", "tagID", "textColor" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
