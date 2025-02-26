import fs from 'fs';
import path from 'path';

async function main() {
  const prismaModule = await import(path.join(process.cwd(), 'src', 'lib', 'prisma.ts'));
  const prisma = prismaModule.default;

  const feedsPath = path.join(process.cwd(), 'src', 'data', 'feeds.json');
  const feedsData = fs.readFileSync(feedsPath, 'utf8');
  const feeds = JSON.parse(feedsData);

  for (const feed of feeds) {
    const existing = await prisma.feed.findUnique({ where: { link: feed.link } });
    if (!existing) {
        await prisma.feed.create({
            data: {
              title: feed.title,
              link: feed.link,
              category: feed.category, 
            },
          });
      console.log(`Inserted feed: ${feed.title}`);
    } else {
      console.log(`Feed exists: ${feed.title}`);
    }
  }
  console.log("Done loading feeds.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
