/*
  Warnings:

  - Made the column `cover` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "locationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "cover" TEXT NOT NULL
);
INSERT INTO "new_Location" ("cover", "flag", "locationID", "name") SELECT "cover", "flag", "locationID", "name" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
