"use client";

import { SelectDisplayTypeRadioProps } from "@/types";

export default function SelectDisplayTypeRadio({ displayMode, setDisplayMode }: SelectDisplayTypeRadioProps) {
    return (
        <div className="mb-4">
            <p className="font-bold mb-1">
              How would you like the articles to be displayed?
            </p>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="grouped"
                  checked={displayMode === "grouped"}
                  onChange={(e) =>
                    setDisplayMode(e.target.value as "grouped" | "interleaved")
                  }
                  className="mr-1"
                />
                Grouped by feed
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="displayMode"
                  value="interleaved"
                  checked={displayMode === "interleaved"}
                  onChange={(e) =>
                    setDisplayMode(e.target.value as "grouped" | "interleaved")
                  }
                  className="mr-1"
                />
                Interleaved
              </label>
            </div>
          </div>
    )
}