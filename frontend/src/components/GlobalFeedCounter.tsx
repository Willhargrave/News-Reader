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
    )
}