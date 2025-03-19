-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "removedFeeds" JSONB NOT NULL DEFAULT [],
    "defaultArticleCount" INTEGER NOT NULL DEFAULT 10
);
INSERT INTO "new_User" ("id", "password", "removedFeeds", "username") SELECT "id", "password", "removedFeeds", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
