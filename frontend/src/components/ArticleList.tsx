"use client"
import { Transition } from "@headlessui/react";
import { ArticleListProps } from "../types";
import ArticleItem from "./ArticleItem";

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
        <ArticleItem article={article} linksVisible={linksVisible} />
        </Transition>
      ))}
    </div>
  );
}