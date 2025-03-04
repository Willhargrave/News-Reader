"use client"

import { useSession } from "next-auth/react"
import { FeedCategoryProps } from "@/types";

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

         const handleCheckBoxChange = (link: string, checked: boolean) => {
           setSelectedFeeds((prev) =>
             checked ? [...prev, link] : prev.filter((l) => l !== link)
           );
           if (checked && !feedStoryCounts[link]) {
             setFeedStoryCounts((prev) => ({ ...prev, [link]: 10 }));
           }
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
          <div key={feed.link} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              value={feed.link}
              checked={selectedFeeds.includes(feed.link)}
              onChange={(e) => handleCheckBoxChange(feed.link, e.target.checked)}
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
      )
}