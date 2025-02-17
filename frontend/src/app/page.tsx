"use client"
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import feedsData from '../data/feeds.json';

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

export default function Home() {
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);

  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds(prev =>
      checked ? [...prev, link] : prev.filter(l => l !== link)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/fetch-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedFeeds }),
    });
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  const toggleLinks = () => {
    setLinksVisible(!linksVisible);
  };

  return (
    <>
      <Head>
        <title>News Summarizer</title>
      </Head>
      <div className="min-h-screen p-8 font-sans">
        <h1 className="text-3xl mb-6">News Summarizer</h1>
        <form onSubmit={handleSubmit}>
          <details className="mb-4 cursor-pointer">
            <summary className="font-bold">Select News Feeds</summary>
            <div className="mt-2">
              {(feedsData as Feed[]).map(feed => (
                <label key={feed.link} className="block mb-2">
                  <input
                    type="checkbox"
                    value={feed.link}
                    onChange={(e) =>
                      handleCheckboxChange(feed.link, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {feed.title}
                </label>
              ))}
            </div>
          </details>
          <div className="flex space-x-4 mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Show Top News Stories'}
            </button>
            <button
              type="button"
              onClick={toggleLinks}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Toggle Links
            </button>
          </div>
        </form>
        <div>
          <h2 className="text-2xl mb-4">Top News Stories</h2>
          {articles.map((article, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold">
                {article.feedTitle}: {article.headline}
              </h3>
              <p>{article.content}</p>
              {linksVisible && (
                <p className="mt-2">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Read more
                  </a>
                </p>
              )}
              <hr className="mt-4 border-t border-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
