import { FormEvent,  useState } from "react";
import { useSession } from "next-auth/react";
import AddFeedForm from "./AddFeedForm";
import AddFeedExplanation from "./AddFeedExplanation";
import { Feed, FeedFormProps } from "@/types";


export default function FeedForm({
  availableFeeds,
  refreshFeeds,
  selectedFeeds,
  setSelectedFeeds,
  setArticles,
  setLoading,
  toggleLinks,
  loading,
}: FeedFormProps) {
  const [showAddFeedForm, setShowAddFeedForm] = useState(false);
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
      refreshFeeds();
      setSelectedFeeds((prev) => prev.filter((link) => link !== feedLink));
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

  const groupedFeeds: Record<string, Feed[]> = {};
  if (Array.isArray(availableFeeds)) {
    availableFeeds.forEach((feed) => {
      const category = feed.category || "news";
      if (!groupedFeeds[category]) {
        groupedFeeds[category] = [];
      }
      groupedFeeds[category].push(feed);
    });
  }

  return (
    <div>
      {session && (<button
        type="button"
        onClick={() => setShowAddFeedForm((prev) => !prev)}
        className="mb-4 px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
      >
        {showAddFeedForm ? "Hide Add Feed" : "Add a New Feed"}
      </button> )}
      {showAddFeedForm && (
        <div>
        <AddFeedForm
          onFeedAdded={() => {
            refreshFeeds();
            setShowAddFeedForm(false);
          }}
        />
         <AddFeedExplanation initiallyExpanded={true}/>
        </div>
      )}

      {Object.keys(groupedFeeds).map((categoryName) => (
        <details key={categoryName} className="mb-4 cursor-pointer">
          <summary className="font-bold">{categoryName.toUpperCase()}</summary>
          <div className="mt-2">
            {groupedFeeds[categoryName].map((feed) => (
              <div key={feed.link} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  value={feed.link}
                  checked={selectedFeeds.includes(feed.link)}
                  onChange={(e) =>
                    handleCheckboxChange(feed.link, e.target.checked)
                  }
                  className="mr-2 cursor-pointer"
                />
                <span className="cursor-default">{feed.title}</span>
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
      ))}
      <div className="flex space-x-4 mb-4">
        <button
          type="submit"
          onClick={handleSubmit}
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
    </div>
  );
}
