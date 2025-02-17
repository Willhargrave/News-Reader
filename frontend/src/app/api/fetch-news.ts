// pages/api/fetch-news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';
import { htmlToText } from 'html-to-text';
import fs from 'fs';
import path from 'path';

type Feed = {
  title: string;
  link: string;
};

type Article = {
  feedTitle: string;
  headline: string;
  content: string;
  link: string;
};

const parser = new Parser();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ articles?: Article[]; error?: string }>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const { selectedFeeds } = req.body;
  if (!selectedFeeds || !Array.isArray(selectedFeeds) || selectedFeeds.length === 0) {
    res.status(400).json({ error: 'No feeds selected' });
    return;
  }

  // Load feeds.json from the data folder.
  const feedsPath = path.join(process.cwd(), 'data', 'feeds.json');
  const feedsData = fs.readFileSync(feedsPath, 'utf8');
  const allFeeds: Feed[] = JSON.parse(feedsData);
  
  // Create a mapping from feed link to title.
  const feedMap: Record<string, string> = {};
  allFeeds.forEach(feed => {
    feedMap[feed.link] = feed.title;
  });
  
  let articles: Article[] = [];
  for (const url of selectedFeeds) {
    const feedTitle = feedMap[url] || url;
    try {
      const feed = await parser.parseURL(url);
      const feedArticles = feed.items.slice(0, 10).map(item => {
        const headline = item.title || '';
        const contentHtml = item.content || item.contentSnippet || '';
        const cleanContent = htmlToText(contentHtml, { wordwrap: false });
        return {
          feedTitle,
          headline,
          content: cleanContent,
          link: item.link || ''
        };
      });
      articles = articles.concat(feedArticles);
    } catch (error) {
      console.error('Error parsing feed:', url, error);
    }
  }

  res.status(200).json({ articles });
}
