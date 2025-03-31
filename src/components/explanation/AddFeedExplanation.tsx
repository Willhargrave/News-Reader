"use client";

import BaseExplanation from "./BaseExplanation";
import type { FeedAddExplanationProps } from "@/types";

export default function AddFeedExplanation({ initiallyExpanded = false }: FeedAddExplanationProps) {
  const content = `To manually add a new RSS feed, enter the URL of the feed in the input field and click "Preview Feed". The system will fetch the feed details (title and category) so you can confirm or edit them. Once confirmed, the feed will be added to your personalized feed list. You can test a RSS feed out by clicking the 'Personal' tab and pasting a URL into the form.
  Note: RSS feed URLs typically end with /rss, /feed, or .xml and must be in XML format. If your link doesn't follow this pattern, double-check it to ensure it's a valid RSS feed URL.`;
  return <BaseExplanation title="How to Add a Feed" content={content} initiallyExpanded={initiallyExpanded} />;
}
