// src/app/api/fetch-news/route.ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { htmlToText } from "html-to-text";
import fs from "fs";
import path from "path";

type Feed = {
  title: string;
  link: string;
};

export type Article = {
  feedTitle: string;
  headline: string;
  content: string;
  link: string;
};

const parser = new Parser();

export async function POST(request: Request) {
  try {
    console.log("fetch-news endpoint reached");
    const { selectedFeeds } = await request.json();
    if (!selectedFeeds || !Array.isArray(selectedFeeds) || selectedFeeds.length === 0) {
      return NextResponse.json({ error: "No feeds selected" }, { status: 400 });
    }

    const feedsPath = path.join(process.cwd(), "src", "data", "feeds.json");
    const feedsData = fs.readFileSync(feedsPath, "utf8");
    const allFeeds: Feed[] = JSON.parse(feedsData);

    const feedMap: Record<string, string> = {};
    allFeeds.forEach((feed) => {
      feedMap[feed.link] = feed.title;
    });

    let articles: Article[] = [];
    for (const url of selectedFeeds) {
      const feedTitle = feedMap[url] || url;
      try {
        const feed = await parser.parseURL(url);
        const feedArticles = feed.items.slice(0, 10).map((item) => {
          const headline = item.title || "";
          const contentHtml = item.content || item.contentSnippet || "";
          const cleanContent = htmlToText(contentHtml, { wordwrap: false });
          return {
            feedTitle,
            headline,
            content: cleanContent,
            link: item.link || ""
          };
        });
        articles = articles.concat(feedArticles);
      } catch (error) {
        console.error("Error parsing feed:", url, error);
      }
    }

    console.log("Returning articles:", articles.length);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error in fetch-news API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
