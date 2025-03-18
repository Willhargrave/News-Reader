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
import { useFeedCountsContext } from "@/app/providers/FeedCountContext";

export default function FeedForm({
  availableFeeds,
  refreshFeeds,
  selectedFeeds,
  setSelectedFeeds,
  setArticles,
  setLoading,
  toggleLinks,
  linksVisible,
  loading,
}: FeedFormProps) {
    const [showAddFeedForm, setShowAddFeedForm] = useState(false);
    const [displayMode, setDisplayMode] = useState<'grouped' | 'interleaved'>('grouped');
    const [collapseCategories, setCollapseCategories] = useState(false);
    const { state: feedCountsState, dispatch } = useFeedCountsContext();


    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const startTime = Date.now();
      const res = await fetch("/api/fetch-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedFeeds, 
          feedStoryCounts: feedCountsState.feedCounts,
          defaultCount: feedCountsState.defaultCount,
          displayMode,
        }),
      });
      const data = await res.json();
      setArticles(data.articles || []);
      const elapsed = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsed < minDelay) {
        setTimeout(() => {
          setLoading(false);
          setSelectedFeeds([]);
          dispatch({ type: 'RESET_FEED_COUNTS' });
          setCollapseCategories(true);
          setTimeout(() => setCollapseCategories(false), 100);
        }, minDelay - elapsed);
      } else {
        setLoading(false);
        setSelectedFeeds([]);
        dispatch({ type: 'RESET_FEED_COUNTS' });
        setCollapseCategories(true);
        setTimeout(() => setCollapseCategories(false), 100);
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
            <AddFeedExplanation initiallyExpanded={true} />
            <AddFeedForm
              onFeedAdded={() => {
                refreshFeeds();
                setShowAddFeedForm(false);
              }}
              existingCategories={Object.keys(groupedFeeds)}
            />
          </div>
        )}
        {selectedFeeds.length > 1 && (
          <Transition
            enter="transition-opacity duration-700"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-700"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div>
              <SelectDisplayTypeRadio displayMode={displayMode} setDisplayMode={setDisplayMode} />
              <GlobalFeedCounter />
            </div>
          </Transition>
        )}
        {Object.keys(groupedFeeds).map((categoryName) => {
          const feedsInCategory = groupedFeeds[categoryName] || [];
          const isAllSelected = feedsInCategory.every((feed) =>
            selectedFeeds.includes(feed.link.toLowerCase())
          );
          return (
            <FeedCategory
              key={categoryName}
              selectedFeeds={selectedFeeds}
              setSelectedFeeds={setSelectedFeeds}
              groupedFeeds={groupedFeeds}
              categoryName={categoryName}
              isAllSelected={isAllSelected}
              feedsInCategory={feedsInCategory}
              refreshFeeds={refreshFeeds}
              state={feedCountsState}
              collapse={collapseCategories}
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
          className={`inline-block px-4 py-2 border border-gray-500 text-sm rounded transition-transform transform active:scale-95 active:shadow-inner ${
          linksVisible 
          ? "bg-blue-500 text-white" 
          : "bg-transparent text-gray-500 hover:bg-gray-100"
          }`}
>
  Toggle Links
</button>

        </div>
      </div>
    );
  }
  
  