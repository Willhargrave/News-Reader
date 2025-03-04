"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import AddFeedForm from "./AddFeedForm";
import { Feed } from "../types";
import { FeedFormProps } from "../types";
import AddFeedExplanation from "./AddFeedExplanation";

export default function FeedForm({
  availableFeeds,
  refreshFeeds,
  selectedFeeds,
  setSelectedFeeds,
  setArticles,
  setLoading,
  toggleLinks,
  loading,
}: FeedFormProps) {
  const [showAddFeedForm, setShowAddFeedForm] = useState(false);
  const { data: session } = useSession();
  const [feedStoryCounts, setFeedStoryCounts] = useState<Record<string, number>>({});
  const [displayMode, setDisplayMode] = useState<'grouped' | 'interleaved'>('grouped');
  const [globalCount, setGlobalCount] = useState<number>(10);

  

  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds((prev) =>
      checked ? [...prev, link] : prev.filter((l) => l !== link)
    );
    if (checked && !feedStoryCounts[link]) {
      setFeedStoryCounts((prev) => ({ ...prev, [link]: 10 }));
    }
  };

  const handleSelectAllForCategory = (categoryName: string, select: boolean) => {
  const feedsInCategory = groupedFeeds[categoryName] || [];
  const feedLinks = feedsInCategory.map((feed) => feed.link);
  if (select) {
    setSelectedFeeds((prev) => {
      const newLinks = feedLinks.filter((link) => !prev.includes(link));
      return [...prev, ...newLinks];
    });
    setFeedStoryCounts((prev) => {
      const updated = { ...prev };
      feedLinks.forEach((link) => {
        if (!updated[link]) updated[link] = globalCount;
      });
      return updated;
    });
  } else {
    setSelectedFeeds((prev) => prev.filter((link) => !feedLinks.includes(link)));
  }
};


  const handleCountChange = (link: string, value: number) => {
    setFeedStoryCounts((prev) => ({ ...prev, [link]: value }));
  };

  const handleRemoveFeed = async (feedId: string, feedLink: string) => {
    const res = await fetch("/api/user-feeds", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId }),
    });
    if (res.ok) {
      refreshFeeds();
      setSelectedFeeds((prev) => prev.filter((link) => link !== feedLink));
      setFeedStoryCounts((prev) => {
        const { [feedLink]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      const data = await res.json();
      console.error("Error removing feed:", data.error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/fetch-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedFeeds, feedStoryCounts, displayMode }),
    });
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  const groupedFeeds: Record<string, Feed[]> = {};
  if (Array.isArray(availableFeeds)) {
    availableFeeds.forEach((feed) => {
      const category = feed.category || "news";
      if (!groupedFeeds[category]) {
        groupedFeeds[category] = [];
      }
      groupedFeeds[category].push(feed);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowAddFeedForm((prev) => !prev)}
        className="mb-4 px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
      >
        {showAddFeedForm ? "Hide Add Feed" : "Add a New Feed"}
      </button>
      {showAddFeedForm && (
          <div>
        <AddFeedForm
          onFeedAdded={() => {
            refreshFeeds();
            setShowAddFeedForm(false);
          }}
        />
        <AddFeedExplanation  initiallyExpanded={true} />
        </div>
      )}
      {selectedFeeds.length > 1 && (
    <div className="mb-4">
    <label htmlFor="globalCounter" className="block font-bold mb-1">
      Stories for all selected feeds:
    </label>
    <input
      id="globalCounter"
      type="number"
      min={1}
      value={globalCount}
      onChange={(e) => {
        const newCount = Number(e.target.value);
        setGlobalCount(newCount);
        setFeedStoryCounts((prev) => {
          const updated = { ...prev };
          selectedFeeds.forEach((feedLink) => {
            updated[feedLink] = newCount;
          });
          return updated;
        });
      }}
      className="w-16 p-1 border transition-all duration-300 ease-in-out"
      title="Set story count for all selected feeds"
    />
  </div>
)}

{Object.keys(groupedFeeds).map((categoryName) => {
  const feedsInCategory = groupedFeeds[categoryName] || [];
  const isAllSelected = feedsInCategory.every(feed =>
    selectedFeeds.includes(feed.link)
  );
  return (
    <details key={categoryName} className="mb-4 cursor-pointer">
      {/* The summary now only shows the category name. */}
      <summary className="font-bold">{categoryName.toUpperCase()}</summary>
      {/* This content is revealed after the user expands the category. */}
      <div className="mt-2">
        {/* The "Select All" checkbox is placed here, above the list of feeds. */}
        <label className="flex items-center text-sm space-x-1 mb-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) =>
              handleSelectAllForCategory(categoryName, e.target.checked)
            }
            className="cursor-pointer"
          />
          <span>Select All</span>
        </label>

        {/* Render each feed in this category. */}
        {feedsInCategory.map((feed) => (
          <div key={feed.link} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              value={feed.link}
              checked={selectedFeeds.includes(feed.link)}
              onChange={(e) =>
                handleCheckboxChange(feed.link, e.target.checked)
              }
              className="mr-2 cursor-pointer"
            />
            <span className="cursor-default">{feed.title}</span>
            {session && feed.id && (
              <button
                type="button"
                onClick={() => handleRemoveFeed(feed.id!, feed.link)}
                className="text-red-500 text-sm ml-2"
              >
                Remove
              </button>
            )}
            {selectedFeeds.includes(feed.link) && (
              <input
                type="number"
                min={1}
                value={feedStoryCounts[feed.link] ?? 10}
                onChange={(e) =>
                  handleCountChange(feed.link, Number(e.target.value))
                }
                className="w-16 p-1 border ml-2 transition-all duration-400 ease-in-out"
                title="Stories from this feed"
              />
            )}
          </div>
        ))}
      </div>
    </details>
  );
})}

      {selectedFeeds.length > 1 && (
    <div className="mb-4">
    <p className="font-bold mb-1">
      How would you like the articles to be displayed?
    </p>
    <div className="flex items-center space-x-4">
      <label className="flex items-center">
        <input
          type="radio"
          name="displayMode"
          value="grouped"
          checked={displayMode === 'grouped'}
          onChange={(e) => setDisplayMode(e.target.value as 'grouped' | 'interleaved')}
          className="mr-1"
        />
        Grouped by feed
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="displayMode"
          value="interleaved"
          checked={displayMode === 'interleaved'}
          onChange={(e) => setDisplayMode(e.target.value as 'grouped' | 'interleaved')}
          className="mr-1"
        />
        Interleaved
      </label>
    </div>
  </div>
)}
      <div className="flex space-x-4 mb-4">
        <button
          type="submit"
          onClick={handleSubmit}
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
    </div>
  );
}
