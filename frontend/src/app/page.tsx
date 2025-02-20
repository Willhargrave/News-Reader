"use client";

import { useState} from "react";
import Head from "next/head";
import Header from "../components/Header";
import FeedForm from "../components/FeedForm";
import ArticleList from "../components/ArticleList";

export default function Home() {

  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);

  const toggleLinks = () => setLinksVisible((prev) => !prev);

  return (
    <>
      <Head>
        <title>Just The News</title>
      </Head>
      <div className="min-h-screen p-8 font-sans">
        <Header />
        <FeedForm
          selectedFeeds={selectedFeeds}
          setSelectedFeeds={setSelectedFeeds}
          setArticles={setArticles}
          setLoading={setLoading}
          toggleLinks={toggleLinks}
          loading={loading}
        />
        <ArticleList articles={articles} linksVisible={linksVisible} />
      </div>
    </>
  );
}

export type Article = {
  feedTitle: string;
  headline: string;
  content: string;
  link: string;
};
