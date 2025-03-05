"use client"
import { Transition } from "@headlessui/react";
import { ArticleListProps } from "../types";

export default function ArticleList({ articles, linksVisible, loading }: ArticleListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article, index) => (
        <Transition
          key={index}
          appear={true}
          show={true}
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">
              {article.feedTitle}: {article.headline}
            </h3>
            <p>{article.content}</p>
            {linksVisible && (
              <p className="mt-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  Read more
                </a>
              </p>
            )}
            <hr className="mt-4 border-t border-gray-300" />
          </div>
        </Transition>
      ))}
    </div>
  );
}