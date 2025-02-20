"use client";

import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import feedsData from "../data/feeds.json";

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

  // Load feeds based on login status. 
  // For both logged in and logged out, start with no feeds selected.
  useEffect(() => {
    if (session) {
      // For logged in users, fetch from the DB.
      fetch("/api/fetch-feeds")
        .then((res) => res.json())
        .then((data) => {
          setAvailableFeeds(data.feeds || []);
          setSelectedFeeds([]); // default: none selected
        })
        .catch((err) => console.error(err));
    } else {
      // For unlogged in users, use the static JSON.
      setAvailableFeeds(feedsData);
      setSelectedFeeds([]); // default: none selected
    }
  }, [session]);

  // When a checkbox changes, update the selected feeds state.
  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds((prev) =>
      checked ? [...prev, link] : prev.filter((l) => l !== link)
    );
  };

  // Submit selected feeds to fetch news.
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

  // Toggle "Read more" links.
  const toggleLinks = () => {
    setLinksVisible(!linksVisible);
  };

  // For logged in users: remove a feed from their personal defaults.
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
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Just The News</h1>
          <div>
            {!session ? (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <p className="text-sm">
                  Welcome, {session.user?.name || "User"}!
                </p>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

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
