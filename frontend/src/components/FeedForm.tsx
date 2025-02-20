"use client";

import { FormEvent } from "react";
import feedsData from "../data/feeds.json";

type Feed = {
  title: string;
  link: string;
};

type FeedFormProps = {
  selectedFeeds: string[];
  setSelectedFeeds: (feeds: string[]) => void;
  setArticles: (articles: any[]) => void;
  setLoading: (loading: boolean) => void;
  toggleLinks: () => void;
  loading: boolean;
};

export default function FeedForm({
  selectedFeeds,
  setSelectedFeeds,
  setArticles,
  setLoading,
  toggleLinks,
  loading,
}: FeedFormProps) {
  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds((prev) =>
      checked ? [...prev, link] : prev.filter((l) => l !== link)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/fetch-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedFeeds }),
    });
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <details className="mb-4 cursor-pointer">
        <summary className="font-bold">Select News Feeds</summary>
        <div className="mt-2">
          {(feedsData as Feed[]).map((feed) => (
            <div key={feed.link} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                value={feed.link}
                checked={selectedFeeds.includes(feed.link)}
                onChange={(e) =>
                  handleCheckboxChange(feed.link, e.target.checked)
                }
                className="mr-2"
              />
              <span>{feed.title}</span>
            </div>
          ))}
        </div>
      </details>
      <div className="flex space-x-4 mb-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-block px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
        >
          {loading ? "Loading..." : "Show Top News Stories"}
        </button>
        <button
          type="button"
          onClick={toggleLinks}
          className="inline-block px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
        >
          Toggle Links
        </button>
      </div>
    </form>
  );
}
