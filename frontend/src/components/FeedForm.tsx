import { FormEvent, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";


type Feed = {
  id?: string;
  title: string;
  link: string;
};

export type Article = {
  feedTitle: string;
  headline: string;
  content: string;
  link: string;
};

type FeedFormProps = {
    availableFeeds: Feed[]; 
    setAvailableFeeds: Dispatch<SetStateAction<Feed[]>>;
    selectedFeeds: string[];
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    setArticles: Dispatch<SetStateAction<Article[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    toggleLinks: () => void;
    loading: boolean;
  };
export default function FeedForm({
  availableFeeds,
  setAvailableFeeds,
  selectedFeeds,
  setSelectedFeeds,
  setArticles,
  setLoading,
  toggleLinks,
  loading,
}: FeedFormProps) {

  const {data: session} = useSession();
  const handleCheckboxChange = (link: string, checked: boolean) => {
    setSelectedFeeds((prev) =>
      checked ? [...prev, link] : prev.filter((l) => l !== link)
    );
  };


  
  const handleRemoveFeed = async (feedId: string, feedLink: string) => {
    const res = await fetch("/api/user-feeds", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId }),
    });
    if (res.ok) {
      // Optionally remove from selectedFeeds if it's there.
      const response = await fetch("/api/fetch-feeds");
      const data = await response.json();
      setAvailableFeeds(data.feeds || []);
      setSelectedFeeds((prev) => prev.filter((link) => link !== feedLink));
      // You might also update availableFeeds if needed.
    } else {
      const data = await res.json();
      console.error("Error removing feed:", data.error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/fetch-news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedFeeds }),
    });
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <details className="mb-4 cursor-pointer">
        <summary className="font-bold">Select News Feeds</summary>
        <div className="mt-2">
          {availableFeeds.map((feed) => (
            <div key={feed.link} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                value={feed.link}
                checked={selectedFeeds.includes(feed.link)}
                onChange={(e) =>
                  handleCheckboxChange(feed.link, e.target.checked)
                }
                className="mr-2"
              />
              <span>{feed.title}</span>
              {session && feed.id && (
                <button
                  type="button"
                  onClick={() => handleRemoveFeed(feed.id!, feed.link)}
                  className="text-red-500 text-sm ml-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </details>
      <div className="flex space-x-4 mb-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-block px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
        >
          {loading ? "Loading..." : "Show Top News Stories"}
        </button>
        <button
          type="button"
          onClick={toggleLinks}
          className="inline-block px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
        >
          Toggle Links
        </button>
      </div>
    </form>
  );
}
