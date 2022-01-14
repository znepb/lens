/*
  Warnings:

  - The primary key for the `Picture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationLocationID` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoID` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagTagID` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "tagID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "locationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Picture" (
    "photoID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filepath" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "locationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "locationLocationID" INTEGER NOT NULL,
    "tagTagID" INTEGER NOT NULL,
    CONSTRAINT "Picture_locationLocationID_fkey" FOREIGN KEY ("locationLocationID") REFERENCES "Location" ("locationID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Picture_tagTagID_fkey" FOREIGN KEY ("tagTagID") REFERENCES "Tag" ("tagID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "filepath", "place") SELECT "createdAt", "filepath", "place" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
