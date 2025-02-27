"use client";

import BaseExplanation from "./BaseExplanation";


type FeedAddExplanationProps = {
    initiallyExpanded?: boolean;
  };

export default function AddFeedExplanation({ initiallyExpanded = false }: FeedAddExplanationProps) {
  const content = `To add a new RSS feed, enter the URL of the feed in the input field and click "Preview Feed".
The system will fetch the feed details (title and category) so you can confirm or edit them.
Once confirmed, the feed will be added to your personalized feed list.`;
  return <BaseExplanation title="How to Add a Feed" content={content} initiallyExpanded={initiallyExpanded} />;
}
