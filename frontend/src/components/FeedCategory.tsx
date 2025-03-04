"use client"

import { useSession } from "next-auth/react"
import { FeedCategoryProps } from "@/types";
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
    const { data: session } = useSession();
  
 
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
    <details key={categoryName} className="mb-4 cursor-pointer">
      <summary className="font-bold">{categoryName.toUpperCase()}</summary>
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
    </details>
      )
}