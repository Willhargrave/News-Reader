"use client";

import { useState, useEffect} from "react";
import Head from "next/head";
import Header from "../components/Header";
import FeedForm from "../components/FeedForm";
import ArticleList from "../components/ArticleList";
import { useSession } from "next-auth/react";
import feedsData from "../data/feeds.json";


export default function Home() {
  
  const { data: session } = useSession();
  const [availableFeeds, setAvailableFeeds] = useState<Feed[]>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);
  const toggleLinks = () => setLinksVisible((prev) => !prev);

  useEffect(() => {
    if (session) {
      fetch("/api/fetch-feeds")
        .then((res) => res.json())
        .then((data) => {
          setAvailableFeeds(data.feeds || []);
          setSelectedFeeds([]); 
        })
        .catch((err) => console.error(err));
    } else {
      setAvailableFeeds(feedsData);
      setSelectedFeeds([]); 
    }
  }, [session]);



  return (
    <>
      <Head>
        <title>Just The News</title>
      </Head>
      <div className="min-h-screen p-8 font-sans">
        <Header />
        <FeedForm
          availableFeeds={availableFeeds}
          setAvailableFeeds={setAvailableFeeds}
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

type Feed = {
  id?: string;
  title: string;
  link: string;
};

