"use client";

import { useState, useEffect, useCallback} from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";
import Header from "../components/items/Header";
import FeedForm from "../components/form/FeedForm";
import ArticleList from "../components/article/ArticleList";
import SiteExplanation from "@/components/explenation/SiteExplanation";
import { useSession } from "next-auth/react";
import feedsData from "../data/feeds.json";
import { Article, Feed } from "@/types";
import { FeedCountsProvider} from "./providers/FeedCountContext";
import Cookies from "js-cookie"


export default function Home() {
  
  const { data: session } = useSession();
  const [availableFeeds, setAvailableFeeds] = useState<Feed[]>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [initialCounter, setInitialCounter] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedLoading, setFeedLoading] = useState<boolean>(false)
  const [linksVisible, setLinksVisible] = useState(false);
   

  useEffect(() => {
    const cookieValue = Cookies.get("linksVisible");
    if (cookieValue !== undefined) {
      setLinksVisible(cookieValue === "true");
    }
  }, []);

  const toggleLinks = () => {
    setLinksVisible((prev) => {
      const newValue = !prev;
      Cookies.set("linksVisible", newValue.toString(), { expires: 30 });
      return newValue;
    });
  };


  const refreshFeeds = useCallback(async () => {
    setFeedLoading(true);
    if (session) {
      try {
        const startTime = Date.now();
        const res = await fetch("/api/fetch-feeds");
        const data = await res.json();
        setAvailableFeeds(data.feeds || []);
        setSelectedFeeds([]);
        const elapsed = Date.now() - startTime;
        const remaining = 500 - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFeedLoading(false);
      }
    } else {
      setAvailableFeeds(feedsData);
      setSelectedFeeds([]);
      setFeedLoading(false);
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
        if (data.defaultArticleCount !== undefined) {
          setInitialCounter(data.defaultArticleCount);
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
        <title>Clean Feed</title>
      </Head>
      <FeedCountsProvider initialDefault={initialCounter ?? 10}>
      <Transition
          appear={true}
          show={true}
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="min-h-screen p-6 font-sans">
            <Header/>
            <SiteExplanation />
            {feedLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
              linksVisible={linksVisible}
            />
          )}
            <ArticleList articles={articles} linksVisible={linksVisible} loading={loading} />
          </div>
          </Transition>
          </FeedCountsProvider>
    </>
  );
}
