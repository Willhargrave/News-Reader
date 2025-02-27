"use client";

import BaseExplanation from "./BaseExplanation";

export default function SiteExplanation() {
  const content = `Generate your personalized news feed by selecting your favorite RSS feeds from various categories.
As a guest, you have access to a default list of global feeds grouped by category (news, sports, business, technology, climate).
Sign up to unlock additional features: add new feeds, remove feeds you don't like, and even create and customize your own feed categories for a truly personalized experience.`;
  return <BaseExplanation title="How It Works" content={content} initiallyExpanded={true} />;
}
