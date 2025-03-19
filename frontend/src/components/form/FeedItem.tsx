"use client"

import { useSession } from "next-auth/react";
import { FeedItemProps } from "@/types";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { useFeedCountsContext } from "@/app/providers/FeedCountContext";
export default function FeedItem({
    refreshFeeds, 
    setSelectedFeeds,
    selectedFeeds,
    feed}: FeedItemProps) {
    
    const { data: session } = useSession();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const {dispatch, getCountForFeed, state} = useFeedCountsContext();
    const currentCount = getCountForFeed(feed.link.toLowerCase());
   



    const handleRemoveFeed = async (feedId: string, feedLink: string) => {
      const res = await fetch("/api/user-feeds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });
      if (res.ok) {
        refreshFeeds();
        setSelectedFeeds((prev) => prev.filter((link) => link !== feedLink));
        dispatch({
          type: 'REMOVE_SINGLE',
          payload: feedLink.toLowerCase(),
        });
      } else {
        const data = await res.json();
        console.error("Error removing feed:", data.error);
      }
    };
    const handleCheckBoxChange = (link: string, checked: boolean) => {
          const normalizedLink = link.toLowerCase();
          setSelectedFeeds((prev) =>
           checked ? [...prev, normalizedLink] : prev.filter((l) => l !== normalizedLink)
          );
        if (checked) {
            dispatch({ type: 'UPDATE_SINGLE', payload: { feedId: normalizedLink, value: state.globalCount } });
          }
       };
      
      

      const onRemoveClick = () => {
        if (confirmDelete) {
          handleRemoveFeed(feed.id!, feed.link);
          setConfirmDelete(false);
        } else {
          setConfirmDelete(true);
          setTimeout(() => setConfirmDelete(false), 3000);
        }
      };
    
    
    return (
        <div key={feed.link} className="flex items-center space-x-2 mb-1">
        <label className="flex items-center font-bold space-x-1 mb-2">
        <input
          type="checkbox"
          value={feed.link}
          checked={selectedFeeds.includes(feed.link)}
          onChange={(e) => handleCheckBoxChange(feed.link, e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <span className="cursor-default">{feed.title}</span>
        </label>
        {session && feed.id && (
          <button
          type="button"
          onClick={onRemoveClick}
          className={`text-sm ml-2 border rounded px-2 py-1 ${
            confirmDelete
              ? "bg-red-800 text-white"
              : "bg-transparent text-red-500 hover:bg-red-100"
          }`}
        >
          {confirmDelete ? "Confirm Delete" : "Remove"}
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
              value={currentCount}
              onChange={(e) => {
                const newVal = Number(e.target.value);
                dispatch({
                  type: "UPDATE_SINGLE",
                  payload: { feedId: feed.link.toLowerCase(), value: newVal },
                });
              }}
              className="w-32 transition-all duration-400 ease-in-out"
              title="Stories from this feed"
              />
              <span>{currentCount}</span>
            </div>
            </Transition>
        )}
      </div>
    )
}