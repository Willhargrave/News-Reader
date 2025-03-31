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
      <div className="flex items-center space-x-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/rss"
          className="w-80 p-2 border rounded" 
        />
        {url.trim() !== "" && (
          <>
            <input
              type="range"
              min={1}
              max={20}
              value={articleCount}
              onChange={(e) => setArticleCount(Number(e.target.value))}
              className="w-24"
            />
            <span className="w-8 text-center">{articleCount}</span>
          </>
        )}
      </div>
    </div>
  );
}


