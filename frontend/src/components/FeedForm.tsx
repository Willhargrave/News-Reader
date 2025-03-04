"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import AddFeedForm from "./AddFeedForm";
import { Feed } from "../types";
import { FeedFormProps } from "../types";
import AddFeedExplanation from "./AddFeedExplanation";
import FeedCategory from "./FeedCategory";

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
        const cat = feed.category || "news";
        if (!groupedFeeds[cat]) {
          groupedFeeds[cat] = [];
        }
        groupedFeeds[cat].push(feed);
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
            <AddFeedExplanation initiallyExpanded={true} />
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
          const isAllSelected = feedsInCategory.every((feed) =>
            selectedFeeds.includes(feed.link)
          );
          return (
            <FeedCategory
              key={categoryName}
              selectedFeeds={selectedFeeds}
              setSelectedFeeds={setSelectedFeeds}
              feedStoryCounts={feedStoryCounts}
              setFeedStoryCounts={setFeedStoryCounts}
              groupedFeeds={groupedFeeds}
              globalCount={globalCount}
              categoryName={categoryName}
              isAllSelected={isAllSelected}
              feedsInCategory={feedsInCategory}
              refreshFeeds={refreshFeeds}
            />
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
                  checked={displayMode === "grouped"}
                  onChange={(e) =>
                    setDisplayMode(e.target.value as "grouped" | "interleaved")
                  }
                  className="mr-1"
                />
                Grouped by feed
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="interleaved"
                  checked={displayMode === "interleaved"}
                  onChange={(e) =>
                    setDisplayMode(e.target.value as "grouped" | "interleaved")
                  }
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
  

