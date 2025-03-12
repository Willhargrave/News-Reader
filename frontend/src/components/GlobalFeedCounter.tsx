"use client";

import { useFeedCountsContext } from "@/app/providers/FeedCountContext";


export default function GlobalFeedCounter(){
  const {state, dispatch} = useFeedCountsContext();
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
              value={state.globalCount}
              onChange={e => dispatch({
                type: 'UPDATE_GLOBAL',
                payload: Number(e.target.value)
              })}
              className="w-1/2 transition-all duration-300 ease-in-out"
              title="Set story count for all selected feeds"
            />
            <span className="w-8 text-center">{state.globalCount}</span>
          </div>
        </div>
      );
}