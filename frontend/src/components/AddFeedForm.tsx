"use client";

import { useState, FormEvent } from "react";
import { AddFeedFormProps } from "@/types";

export default function AddFeedForm({ onFeedAdded, existingCategories }: AddFeedFormProps) {
    const [feedUrl, setFeedUrl] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewCategory, setPreviewCategory] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<"input" | "preview">("input");
  
    const handlePreview = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/preview-feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: feedUrl }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error previewing feed");
        } else {
          const data = await res.json();
          setPreviewTitle(data.title);
          setPreviewCategory(data.category);
          setStage("preview");
        }
      } catch (err) {
        console.error(err);
        setError("Error previewing feed");
      }
      setLoading(false);
    };
  
    const handleConfirm = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/add-feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            link: feedUrl,
            title: previewTitle,
            category: previewCategory,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error adding feed");
        } else {
          onFeedAdded();
          setFeedUrl("");
          setPreviewTitle("");
          setPreviewCategory("");
          setStage("input");
        }
      } catch (err) {
        console.error(err);
        setError("Error adding feed");
      }
      setLoading(false);
    };
  
    const handleCancel = () => {
      setStage("input");
      setPreviewTitle("");
      setPreviewCategory("");
      setError("");
    };
  
    return (
      <div className="p-4 border rounded mb-4 shadow">
        {stage === "input" && (
          <form onSubmit={handlePreview}>
            <label className="block mb-2 font-bold">
              Enter RSS Feed URL:
            </label>
            <input
              type="url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              className="w-full p-2 border mb-2"
              placeholder="https://example.com/rss"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {loading ? "Loading..." : "Preview Feed"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
        {stage === "preview" && (
          <form onSubmit={handleConfirm}>
            <p className="mb-2">
              The title of your RSS feed is:{" "}
              <input
                type="text"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="border p-1"
                required
              />
            </p>
            <p className="mb-2">
            The category of your RSS feed is:{" "}
            <input
              type="text"
              list="existingCategories"
              // value={previewCategory}
              placeholder=""
              onChange={(e) => setPreviewCategory(e.target.value)}
              className="border p-1"
              required
            />
            <datalist id="existingCategories">
            {existingCategories.map((cat) => {
            const capitalized = cat.charAt(0).toUpperCase() + cat.slice(1);
            return <option key={cat} value={capitalized} />;
            })}
            </datalist>
          </p>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                {loading ? "Adding..." : "Confirm Add"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
      </div>
    );
}