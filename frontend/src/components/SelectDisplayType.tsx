"use client";

import { SelectDisplayTypeRadioProps } from "@/types";

export default function SelectDisplayTypeRadio({ displayMode, setDisplayMode }: SelectDisplayTypeRadioProps) {
  return (
    <div className="mb-4">
      <p className="font-bold mb-1">
        How would you like the articles to be displayed?
      </p>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setDisplayMode("grouped")}
          className={`px-4 py-2 rounded border transition-colors duration-200 ${
            displayMode === "grouped"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-transparent text-gray-500 hover:bg-gray-100"
          }`}
        >
          Grouped by Feed
        </button>
        <button
          type="button"
          onClick={() => setDisplayMode("interleaved")}
          className={`px-4 py-2 rounded border transition-colors duration-200 ${
            displayMode === "interleaved"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-transparent text-gray-500 hover:bg-gray-100"
          }`}
        >
          Interleaved
        </button>
      </div>
    </div>
  );
  
}