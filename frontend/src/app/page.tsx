"use client";

import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import { useSession} from "next-auth/react";
import feedsData from "../data/feeds.json";
import Header from "@/components/Header";

type Feed = {
  id?: string; // present when loaded from DB
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
  const { data: session } = useSession();
  const [availableFeeds, setAvailableFeeds] = useState<Feed[]>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);


  useEffect(() => {
    if (session) {
      fetch("/api/fetch-feeds")
        .then((res) => res.json())
        .then((data) => {
          setAvailableFeeds(data.feeds || []);
          setSelectedFeeds([]);
        })
        .catch((err) => console.error(err));
    } else {
      setAvailableFeeds(feedsData);
      setSelectedFeeds([]); 
    }
  }, [session]);

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

  const toggleLinks = () => {
    setLinksVisible(!linksVisible);
  };

  const handleRemoveFeed = async (feedId: string, feedLink: string) => {
    const res = await fetch("/api/user-feeds", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId }),
    });
    if (res.ok) {
      setAvailableFeeds((prev) =>
        prev.filter((feed) => feed.id !== feedId)
      );
      setSelectedFeeds((prev) =>
        prev.filter((link) => link !== feedLink)
      );
    } else {
      const data = await res.json();
      console.error("Error removing feed:", data.error);
    }
  };

  return (
    <>
      <Head>
        <title>Just The News</title>
      </Head>
      <div className="min-h-screen p-8 font-sans">
       <Header />
        <form onSubmit={handleSubmit}>
          <details className="mb-4 cursor-pointer">
            <summary className="font-bold">Select News Feeds</summary>
            <div className="mt-2">
              {availableFeeds.map((feed: Feed) => (
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
                  {session && feed.id && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeed(feed.id!, feed.link)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
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

        <div>
          <h2 className="text-2xl font-bold mb-4">Top News Stories</h2>
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
