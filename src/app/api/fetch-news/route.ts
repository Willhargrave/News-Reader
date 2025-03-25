import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import prisma from "@/lib/prisma";
import { htmlToText } from "html-to-text";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Article } from "@/types";

const parser = new Parser();


export async function POST(request: Request) {
  try {
    const { selectedFeeds, feedStoryCounts, displayMode, defaultCount, globalCount } = await request.json();

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

    const feedArticlesMap: Record<string, Article[]> = {};

    let user: any = null;
    if (session && session.user?.name) {
      user = await prisma.user.findUnique({ where: { username: session.user.name } });
    }

    for (const url of selectedFeeds) {
      const normalizedUrl = url.toLowerCase();
      const validatedDefault = Math.max(1, Math.min(globalCount || defaultCount || 10, 20));
      const limit =
        feedStoryCounts?.[normalizedUrl] !== undefined
          ? Number(feedStoryCounts[normalizedUrl])
          : validatedDefault;
      try {
        const feed = await parser.parseURL(normalizedUrl);
        let customTitle = "";
        if (user) {
          const userFeed = await prisma.userFeed.findFirst({
            where: { link: normalizedUrl, userId: user.id },
          });
          if (userFeed) {
            customTitle = userFeed.title;
          }
        }
        const feedTitle = customTitle || feedMap[normalizedUrl] || feed.title || "Untitled Feed";

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

    let finalArticles: Article[] = [];
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

