import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { htmlToText } from "html-to-text";

const parser = new Parser();

export async function POST(request: Request) {
  try {
    console.log("fetch-news endpoint reached");
    const { selectedFeeds, maxStories, displayMode } = await request.json();
    if (!selectedFeeds || !Array.isArray(selectedFeeds) || selectedFeeds.length === 0) {
      return NextResponse.json({ error: "No feeds selected" }, { status: 400 });
    }
    const limit = maxStories ? Number(maxStories) : 10; 

    const feedsPath = path.join(process.cwd(), "src", "data", "feeds.json");
    const feedsData = fs.readFileSync(feedsPath, "utf8");
    const allFeeds = JSON.parse(feedsData);
    const feedMap: Record<string, string> = {};
    allFeeds.forEach((feed: { title: string; link: string }) => {
      feedMap[feed.link] = feed.title;
    });

    let articles: any[] = [];
    for (const url of selectedFeeds) {
      const feedTitle = feedMap[url] || url;
      try {
        const feed = await parser.parseURL(url);
        const feedArticles = feed.items.slice(0, limit).map((item) => {
          const headline = item.title || "";
          const contentHtml = item.content || item.contentSnippet || "";
          const cleanContent = htmlToText(contentHtml, { wordwrap: false });
          const pubDate = item.pubDate || item.isoDate || "";
          return {
            feedTitle,
            headline,
            content: cleanContent,
            link: item.link || "",
            pubDate,
          };
        });
        articles = articles.concat(feedArticles);
      } catch (error) {
        console.error("Error parsing feed:", url, error);
      }
    }

    if (displayMode === "grouped") {
      const groupedArticles = articles.reduce((acc, article) => {
        const key = article.feedTitle;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(article);
        return acc;
      }, {} as Record<string, typeof articles>);
      return NextResponse.json({ articles: groupedArticles });
    } else {
      articles.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });
      return NextResponse.json({ articles });
    }
  } catch (error) {
    console.error("Error in fetch-news endpoint:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}
