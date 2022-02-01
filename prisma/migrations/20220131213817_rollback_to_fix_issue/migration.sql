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
    "width" INTEGER,
    "height" INTEGER,
    CONSTRAINT "Picture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Picture" ("createdAt", "description", "filepath", "height", "id", "locationId", "place", "primaryTagID", "size", "width") SELECT "createdAt", "description", "filepath", "height", "id", "locationId", "place", "primaryTagID", "size", "width" FROM "Picture";
DROP TABLE "Picture";
ALTER TABLE "new_Picture" RENAME TO "Picture";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
