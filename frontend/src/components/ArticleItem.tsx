"use client";

import { forwardRef, useState } from "react";
import { ArticleItemProps } from "@/types";

const ArticleItem = forwardRef<HTMLDivElement, ArticleItemProps>(
    ({ article, linksVisible }, ref) => {
      const [expanded, setExpanded] = useState(false);
      const words = article.content.split(/\s+/);
      const isLong = words.length > 200;
      const truncatedContent = words.slice(0, 200).join(" ") + "...";
      const displayedContent = expanded || !isLong ? article.content : truncatedContent;
  
      return (
        <div ref={ref} className="mb-6">
          <h3 className="text-xl font-bold">
            {article.feedTitle}: {article.headline}
          </h3>
          <p>{displayedContent}</p>
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-500 underline mt-1 block"
            >
              Read more
            </button>
          )}
          {isLong && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="text-blue-500 underline mt-1 block"
            >
              Read less
            </button>
          )}
  
          {linksVisible && (
            <p className="mt-2">
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Read full article
              </a>
            </p>
          )}
          <hr className="mt-4 border-t border-gray-300" />
        </div>
      );
    }
  );
  
  ArticleItem.displayName = "ArticleItem";
  export default ArticleItem;
