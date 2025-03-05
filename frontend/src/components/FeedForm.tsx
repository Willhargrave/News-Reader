"use client";

import { FormEvent, useState } from "react";
import AddFeedForm from "./AddFeedForm";
import { Feed } from "../types";
import { FeedFormProps } from "../types";
import { Transition } from "@headlessui/react";
import AddFeedExplanation from "./AddFeedExplanation";
import FeedCategory from "./FeedCategory";
import SelectDisplayTypeRadio from "./SelectDisplayType";
import GlobalFeedCounter from "./GlobalFeedCounter";

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
    const [feedStoryCounts, setFeedStoryCounts] = useState<Record<string, number>>({});
    const [displayMode, setDisplayMode] = useState<'grouped' | 'interleaved'>('grouped');
    const [globalCount, setGlobalCount] = useState<number>(10);
  
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const startTime = Date.now();
        const res = await fetch("/api/fetch-news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedFeeds, feedStoryCounts, displayMode }),
        });
        const data = await res.json();
        setArticles(data.articles || []);
        const elapsed = Date.now() - startTime;
        const minDelay = 1500;
        if (elapsed < minDelay) {
          setTimeout(() => {
            setLoading(false);
          }, minDelay - elapsed);
        } else {
          setLoading(false);
        }
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
            <Transition
            enter="transition-opacity duration-700"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-700"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div>
            <SelectDisplayTypeRadio displayMode={displayMode} setDisplayMode={setDisplayMode} />
            <GlobalFeedCounter globalCount={globalCount} setGlobalCount={setGlobalCount} selectedFeeds={selectedFeeds} setFeedStoryCounts={setFeedStoryCounts}/>
             </div>
           </Transition>
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
  