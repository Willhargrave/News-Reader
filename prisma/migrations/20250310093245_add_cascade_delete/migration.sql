-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'news',
    CONSTRAINT "UserFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserFeed" ("category", "id", "link", "title", "userId") SELECT "category", "id", "link", "title", "userId" FROM "UserFeed";
DROP TABLE "UserFeed";
ALTER TABLE "new_UserFeed" RENAME TO "UserFeed";
CREATE UNIQUE INDEX "UserFeed_link_key" ON "UserFeed"("link");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
