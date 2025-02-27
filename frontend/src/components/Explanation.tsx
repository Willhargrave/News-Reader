"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

export default function Explanation() {
  // Auto-expand on first load if the user hasn't dismissed it before.
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Check if explanation was dismissed in a previous visit.
    const dismissed = localStorage.getItem("explanationDismissed");
    if (!dismissed) {
      setExpanded(true);
    }
  }, []);

  const handleMinimize = () => {
    setExpanded(false);
    localStorage.setItem("explanationDismissed", "true");
  };

  if (!expanded) {
    // When minimized, only show a '+' button in the top-right
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-2xl text-blue-500 hover:text-blue-700"
          title="Show explanation"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <Transition
      appear
      show={expanded}
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-0 transform scale-95"
      enterTo="opacity-100 transform scale-100"
      leave="transition-all duration-300 ease-in"
      leaveFrom="opacity-100 transform scale-100"
      leaveTo="opacity-0 transform scale-95"
    >
      <div className="p-4 mb-6 border rounded bg-gray-100 text-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <button
            type="button"
            onClick={handleMinimize}
            className="text-2xl text-blue-500 hover:text-blue-700"
            title="Minimize explanation"
          >
            &ndash;
          </button>
        </div>
        <div className="mt-3">
          <p className="mb-2">
            Generate your personalized news feed by selecting your favorite RSS feeds from various categories.
          </p>
          <p className="mb-2">
            As a guest, you have access to a default list of global feeds grouped by category (news, sports, business, technology, climate).
          </p>
          <p>
            Sign up to unlock additional features: add new feeds, remove feeds you don't like, and even create and customize your own feed categories for a truly personalized experience.
          </p>
        </div>
      </div>
    </Transition>
  );
}
