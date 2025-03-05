"use client"

import { FeedCategoryProps } from "@/types";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import FeedItem from "./FeedItem";


export default function FeedCategory({
    selectedFeeds, 
    setSelectedFeeds, 
    feedStoryCounts,
    setFeedStoryCounts, 
    groupedFeeds, 
    globalCount, 
    categoryName, 
    isAllSelected, 
    feedsInCategory, 
    refreshFeeds, 
}: FeedCategoryProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        setIsOpen(e.currentTarget.open);
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

     
   return (
    <details key={categoryName} className="mb-4 cursor-pointer" onToggle={handleToggle}>
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
          feedStoryCounts={feedStoryCounts} 
          setFeedStoryCounts={setFeedStoryCounts}
           selectedFeeds={selectedFeeds}
           feed={feed}/>
        ))}
      </div>
    </Transition>
    </details>
      )
}