"use client";

import { GlobalFeedCounterProps } from "@/types";

export default function GlobalFeedCounter({
  globalCount,
  setGlobalCount,
  selectedFeeds,
  setFeedStoryCounts,
}: GlobalFeedCounterProps){
    return (
        <div className="mb-4">
          <label htmlFor="globalCounter" className="block font-bold mb-1">
            Stories for all selected feeds:
          </label>
          <div className="flex items-center">
            <input
              id="globalCounter"
              type="range"
              min={1}
              max={20} 
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
              className="w-1/2 transition-all duration-300 ease-in-out"
              title="Set story count for all selected feeds"
            />
            <span className="w-8 text-center">{globalCount}</span>
          </div>
        </div>
      );
}