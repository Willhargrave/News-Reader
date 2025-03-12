"use client";

import { useState, useEffect, useCallback, useReducer} from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";
import Header from "../components/Header";
import FeedForm from "../components/FeedForm";
import ArticleList from "../components/ArticleList";
import SiteExplanation from "@/components/SiteExplanation";
import { useSession } from "next-auth/react";
import feedsData from "../data/feeds.json";
import { Article, Feed } from "@/types";
import { FeedCountsProvider } from "./providers/FeedCountContext";

export default function Home() {
  
  const { data: session } = useSession();
  const [availableFeeds, setAvailableFeeds] = useState<Feed[]>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [feedStoryCounts, setFeedStoryCounts] = useState<Record<string, number>>({});
  const [defaultArticleCount, setDefaultArticleCount] = useState(10);
  const [globalCount, setGlobalCount] = useState(defaultArticleCount);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);
  const toggleLinks = () => setLinksVisible((prev) => !prev);


  const refreshFeeds = useCallback(() => {
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

  useEffect(() => {
    refreshFeeds();
  }, [refreshFeeds]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/get-settings");
        const data = await res.json();
        console.log("Fetched settings:", data);
        if (data.defaultArticleCount !== undefined) {
          setDefaultArticleCount(data.defaultArticleCount);
          setGlobalCount(data.defaultArticleCount);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);
  


  return (
    <>
  
      <Head>
        <title>Just The News</title>
      </Head>
      <FeedCountsProvider>
        <Transition
          appear={true}
          show={true}
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="min-h-screen p-8 font-sans">
            <Header defaultArticleCount={defaultArticleCount} setDefaultArticleCount={setDefaultArticleCount}/>
            <SiteExplanation />
            <FeedForm
              availableFeeds={availableFeeds}
              setAvailableFeeds={setAvailableFeeds}
              selectedFeeds={selectedFeeds}
              setSelectedFeeds={setSelectedFeeds}
              setArticles={setArticles}
              setLoading={setLoading}
              toggleLinks={toggleLinks}
              loading={loading}
              refreshFeeds={refreshFeeds}
              globalCount={globalCount}
              feedStoryCounts={feedStoryCounts}
              setFeedStoryCounts={setFeedStoryCounts}
              setGlobalCount={setGlobalCount}
            />
            <ArticleList articles={articles} linksVisible={linksVisible} loading={loading} />
          </div>
          </Transition>
          </FeedCountsProvider>
    </>
  );
}
