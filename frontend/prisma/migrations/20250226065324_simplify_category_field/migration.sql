/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoryId` on the `UserFeed` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'news'
);
INSERT INTO "new_Feed" ("category", "id", "link", "title") SELECT "category", "id", "link", "title" FROM "Feed";
DROP TABLE "Feed";
ALTER TABLE "new_Feed" RENAME TO "Feed";
CREATE UNIQUE INDEX "Feed_link_key" ON "Feed"("link");
CREATE TABLE "new_UserFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'news',
    CONSTRAINT "UserFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserFeed" ("id", "link", "title", "userId") SELECT "id", "link", "title", "userId" FROM "UserFeed";
DROP TABLE "UserFeed";
ALTER TABLE "new_UserFeed" RENAME TO "UserFeed";
CREATE UNIQUE INDEX "UserFeed_link_key" ON "UserFeed"("link");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
