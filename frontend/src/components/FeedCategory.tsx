"use client";
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import FeedItem from "./FeedItem";
import { useFeedCountsContext } from "@/app/providers/FeedCountContext";
import { FeedCategoryProps } from "@/types";

export default function FeedCategory({
  setSelectedFeeds,
  selectedFeeds,
  groupedFeeds,
  categoryName,
  isAllSelected,
  feedsInCategory,
  refreshFeeds,
  collapse,
  state
}: FeedCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useFeedCountsContext();

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(e.currentTarget.open);
  };

  useEffect(() => {
    if (collapse) {
      setIsOpen(false);
    }
  }, [collapse]);

  const handleSelectAllForCategory = (categoryName: string, select: boolean) => {
    const feedsInCategory = groupedFeeds[categoryName] || [];
    const feedLinks = feedsInCategory.map((feed) => feed.link.toLowerCase());
    if (select) {
      setSelectedFeeds((prev) => {
        const newLinks = feedLinks.filter((link) => !prev.includes(link));
        return [...prev, ...newLinks];
      });
      feedLinks.forEach((link) => {
        dispatch({ type: "UPDATE_SINGLE", payload: { feedId: link, value: state.globalCount } });
      });
    } else {
      setSelectedFeeds((prev) => prev.filter((link) => !feedLinks.includes(link)));
    }
  };

  return (
    <details open={isOpen} key={categoryName} className="mb-4 cursor-pointer" onToggle={handleToggle}>
      <summary className="font-bold">{categoryName.toUpperCase()}</summary>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-2">
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
          {feedsInCategory.map((feed) => (
            <FeedItem 
              key={feed.link}
              refreshFeeds={refreshFeeds} 
              setSelectedFeeds={setSelectedFeeds}
              selectedFeeds={selectedFeeds}
              feed={feed}
            />
          ))}
        </div>
      </Transition>
    </details>
  );
}
