import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { htmlToText } from "html-to-text";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const parser = new Parser();

export async function POST(request: Request) {
  try {
    console.log("fetch-news endpoint reached");
    const { selectedFeeds, feedStoryCounts, displayMode } = await request.json();
    if (!selectedFeeds || !Array.isArray(selectedFeeds) || selectedFeeds.length === 0) {
      return NextResponse.json({ error: "No feeds selected" }, { status: 400 });
    }

    const feedsPath = path.join(process.cwd(), "src", "data", "feeds.json");
    const feedsData = fs.readFileSync(feedsPath, "utf8");
    const allFeeds = JSON.parse(feedsData);
    const feedMap: Record<string, string> = {};
    allFeeds.forEach((feed: { title: string; link: string }) => {
      feedMap[feed.link.toLowerCase()] = feed.title;
    });
    const session = await getServerSession(authOptions);

    const feedArticlesMap: Record<string, any[]> = {};
    const defaultLimit = 10;

    for (const url of selectedFeeds) {
      const normalizedUrl = url.toLowerCase();
      const limit =
        feedStoryCounts && feedStoryCounts[url]
          ? Number(feedStoryCounts[url])
          : defaultLimit;
      try {
        const feed = await parser.parseURL(normalizedUrl);
        let customTitle = "";
        if (session && session.user?.name) {
          const userFeed = await prisma.userFeed.findUnique({ where: { link: normalizedUrl } });
          if (userFeed) {
            customTitle = userFeed.title;
          }
        }
        const feedTitle = customTitle || feedMap[normalizedUrl] || feed.title;

        const articles = feed.items.slice(0, limit).map((item) => {
          const headline = item.title || "";
          const contentHtml = item.content || item.contentSnippet || "";
          const rawContent = htmlToText(contentHtml, { wordwrap: false });
          const cleanContent = rawContent.replace(/\[.*?\]/g, "");
          return {
            feedTitle,
            headline,
            content: cleanContent,
            link: item.link || "",
            pubDate: item.pubDate || item.isoDate || null,
          };
        });
        feedArticlesMap[normalizedUrl] = articles;
      } catch (error) {
        console.error("Error parsing feed:", normalizedUrl, error);
        feedArticlesMap[normalizedUrl] = [];
      }
    }

    let finalArticles: any[] = [];
    if (displayMode === "grouped") {
      for (const url of selectedFeeds) {
        finalArticles = finalArticles.concat(feedArticlesMap[url.toLowerCase()] || []);
      }
    } else if (displayMode === "interleaved") {
      const maxLength = Math.max(
        ...selectedFeeds.map((url) => (feedArticlesMap[url.toLowerCase()] || []).length)
      );
      for (let i = 0; i < maxLength; i++) {
        for (const url of selectedFeeds) {
          const articles = feedArticlesMap[url.toLowerCase()] || [];
          if (i < articles.length) {
            finalArticles.push(articles[i]);
          }
        }
      }
    } else {
      for (const url of selectedFeeds) {
        finalArticles = finalArticles.concat(feedArticlesMap[url.toLowerCase()] || []);
      }
    }

    return NextResponse.json({ articles: finalArticles });
  } catch (error) {
    console.error("Error in fetch-news endpoint:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

