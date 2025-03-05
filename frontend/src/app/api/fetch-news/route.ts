import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { htmlToText } from "html-to-text";

const parser = new Parser();

export async function POST(request: Request) {
  try {
    console.log("fetch-news endpoint reached");
    const { selectedFeeds, feedStoryCounts, displayMode } = await request.json();
    if (!selectedFeeds || !Array.isArray(selectedFeeds) || selectedFeeds.length === 0) {
      return NextResponse.json({ error: "No feeds selected" }, { status: 400 });
    }
    const feedArticlesMap: Record<string, any[]> = {};
    const defaultLimit = 10;

    for (const url of selectedFeeds) {
      const limit = feedStoryCounts && feedStoryCounts[url]
        ? Number(feedStoryCounts[url])
        : defaultLimit;
      try {
        const feed = await parser.parseURL(url);
        const articles = feed.items.slice(0, limit).map((item) => {
          const headline = item.title || "";
          const contentHtml = item.content || item.contentSnippet || "";
          const rawContent = htmlToText(contentHtml, { wordwrap: false });
          const cleanContent = rawContent.replace(/\[.*?\]/g, "");
          return {
            feedTitle: feed.title, 
            headline,
            content: cleanContent,
            link: item.link || "",
          };
        });
        feedArticlesMap[url] = articles;
      } catch (error) {
        console.error("Error parsing feed:", url, error);
        feedArticlesMap[url] = [];
      }
    }

    let finalArticles: any[] = [];
    if (displayMode === "grouped") {
      for (const url of selectedFeeds) {
        finalArticles = finalArticles.concat(feedArticlesMap[url] || []);
      }
    } else if (displayMode === "interleaved") {
      const maxLength = Math.max(...selectedFeeds.map(url => (feedArticlesMap[url] || []).length));
      for (let i = 0; i < maxLength; i++) {
        for (const url of selectedFeeds) {
          const articles = feedArticlesMap[url] || [];
          if (i < articles.length) {
            finalArticles.push(articles[i]);
          }
        }
      }
    } else {
      for (const url of selectedFeeds) {
        finalArticles = finalArticles.concat(feedArticlesMap[url] || []);
      }
    }

    return NextResponse.json({ articles: finalArticles });
  } catch (error) {
    console.error("Error in fetch-news endpoint:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

