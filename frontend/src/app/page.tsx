// pages/index.tsx
import { useState, FormEvent } from 'react';
import Head from 'next/head';
import feeds from '../../../feeds.json';

export default function Home() {
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [newsHtml, setNewsHtml] = useState<string>('');
  const [linksVisible, setLinksVisible] = useState<boolean>(false);

  
  const handleCheckboxChange = (feedLink: string, checked: boolean) => {
    if (checked) {
      setSelectedFeeds((prev) => [...prev, feedLink]);
    } else {
      setSelectedFeeds((prev) => prev.filter((link) => link !== feedLink));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNewsHtml(
      `<p>Simulated news content for feeds: ${selectedFeeds.join(', ')}</p>` +
      `<p class="article-link"><a href="#">Read more</a></p><hr>`
    );
  };

  const toggleLinks = () => {
    setLinksVisible((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>News Summarizer</title>
      </Head>
      <div className="min-h-screen p-8 font-sans">
        <h1 className="text-3xl mb-6">News Summarizer</h1>
        <form onSubmit={handleSubmit}>
          <details className="mb-6 cursor-pointer">
            <summary className="font-bold">Select News Feeds</summary>
            <div className="mt-4">
              {feeds.map((feed) => (
                <label key={feed.link} className="block mb-2">
                  <input
                    type="checkbox"
                    name="feeds"
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
          <div className="flex space-x-4 mb-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Show Top News Stories
            </button>
            <button
              type="button"
              onClick={toggleLinks}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Toggle Links
            </button>
          </div>
        </form>
        <div className="news">
          <h2 className="text-2xl mb-4">Top News Stories</h2>
          {/* Render the news HTML */}
          <div
            className={`prose ${linksVisible ? 'block' : 'hidden'}`}
            dangerouslySetInnerHTML={{ __html: newsHtml }}
          />
          {/* If links are toggled off, remove the .article-link content.
              In a real app, your API would handle this formatting. */}
          {!linksVisible && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: newsHtml.replace(/<p class="article-link">.*?<\/p>/g, '')
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
