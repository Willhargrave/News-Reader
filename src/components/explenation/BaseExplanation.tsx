"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import { BaseExplanationProps } from "@/types";

export default function BaseExplanation({
  title,
  content,
  initiallyExpanded = false,
}: BaseExplanationProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  if (!expanded) {
    return (
      <div className="flex justify-end p-6">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-4xl text-blue-600 hover:text-blue-900"
          title="Show explanation"
        >
          ?
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
      <div className="p-4 mb-6 border rounded shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-2xl text-blue-500 hover:text-blue-700"
            title="Minimize explanation"
          >
            &ndash;
          </button>
        </div>
        <div className="mt-3">
        <p style={{ whiteSpace: 'pre-line' }}>{content}</p>
        </div>
      </div>
    </Transition>
  );
}
