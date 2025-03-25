/*
  Warnings:

  - A unique constraint covering the columns `[userId,link]` on the table `UserFeed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserFeed_userId_link_key" ON "UserFeed"("userId", "link");
