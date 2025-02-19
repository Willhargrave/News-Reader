"use client"
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import feedsData from '../data/feeds.json';

type Feed = {
  title: string;
  link: string;
};

type Article = {
  feedTitle: string;
  headline: string;
  content: string;
  link: string;
};

export default function Home() {
  const { data: session } = useSession();
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [linksVisible, setLinksVisible] = useState<boolean>(false);
  

  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds(prev =>
      checked ? [...prev, link] : prev.filter(l => l !== link)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/fetch-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedFeeds }),
    });
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  const toggleLinks = () => {
    setLinksVisible(!linksVisible);
  };

  return (
    <>
      <Head>
        <title>News Summarizer</title>
      </Head>

      {!session ? (
          <div className="flex space-x-4 mb-6">
            <Link
              href="/login"
              className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4 mb-6">
            <p className="text-sm">Welcome, {session.user?.name || 'User'}!</p>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}

      
      <div className="m-8 font-sans text-base">
        
        <h1 className="text-xl font-bold mb-4">News Summarizer</h1>
        
        <form onSubmit={handleSubmit}>
          
          <details className="mb-4 cursor-pointer">
            <summary className="font-bold">Select News Feeds</summary>
            <div className="mt-2">
              {feedsData.map((feed: Feed) => (
                <label key={feed.link} className="block mb-1">
                  <input
                    type="checkbox"
                    value={feed.link}
                    onChange={(e) =>
                      handleCheckboxChange(feed.link, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {feed.title}
                </label>
              ))}
            </div>
          </details>
          
          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-block px-4 py-2 mr-2 border border-gray-500 text-sm hover:bg-gray-100"
            >
              {loading ? 'Loading...' : 'Show Top News Stories'}
            </button>
            <button
              type="button"
              onClick={toggleLinks}
              className="inline-block px-4 py-2 border border-gray-500 text-sm hover:bg-gray-100"
            >
              Toggle Links
            </button>
          </div>
        </form>

        <div className="news mt-6">
          <h2 className="font-bold mb-3">Top News Stories</h2>
          
          {articles.map((article, index) => (
            <div key={index} className="mb-5">
              <h3 className="font-bold text-base">
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
          ))}
        </div>
      </div>
    </>
  );
}
