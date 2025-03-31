"use client";
import React from "react";

type UrlFormProps = {
  url: string;
  setUrl: (value: string) => void;
  articleCount: number;
  setArticleCount: (value: number) => void;
};

export default function UrlForm({
  url,
  setUrl,
  articleCount,
  setArticleCount,
}: UrlFormProps) {
  return (
    <div className="p-4 border rounded shadow-lg mb-4">
      <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/rss"
          className="w-full md:w-80 p-2 border rounded"
        />
        {url.trim() !== "" && (
          <div className="w-full md:w-auto flex items-center space-x-2 mt-2 md:mt-0">
            <input
              type="range"
              min={1}
              max={20}
              value={articleCount}
              onChange={(e) => setArticleCount(Number(e.target.value))}
              className="w-full md:w-24"
            />
            <span>{articleCount}</span>
          </div>
        )}
      </div>
    </div>
  );
  
}


