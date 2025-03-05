"use client"

import { useSession } from "next-auth/react";
import { FeedItemProps } from "@/types";
import { Transition } from "@headlessui/react";
export default function FeedItem({
    refreshFeeds, 
    setSelectedFeeds,
    feedStoryCounts, 
    setFeedStoryCounts,
    selectedFeeds,
    feed}: FeedItemProps) {
    
    const { data: session } = useSession();


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

      const handleCheckBoxChange = (link: string, checked: boolean) => {
        setSelectedFeeds((prev) =>
          checked ? [...prev, link] : prev.filter((l) => l !== link)
        );
        if (checked && !feedStoryCounts[link]) {
          setFeedStoryCounts((prev) => ({ ...prev, [link]: 10 }));
        }
      };

      const handleCountChange = (link: string, value: number) => {
        setFeedStoryCounts((prev) => ({ ...prev, [link]: value }));
      };
    
    return (
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
            <Transition
                      enter="transition-all duration-700"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-700"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0">
            <div className="flex items-center space-x-2">
                <input
                type="range"
                min={1}
                max={20} 
                value={feedStoryCounts[feed.link] ?? 10}
                onChange={(e) =>
                    handleCountChange(feed.link, Number(e.target.value))
                }
                className="w-32 transition-all duration-400 ease-in-out"
                title="Stories from this feed"
                />
                <span className="w-8 text-center">
                {feedStoryCounts[feed.link] ?? 10}
                </span>
            </div>
            </Transition>
        )}
      </div>
    )
}