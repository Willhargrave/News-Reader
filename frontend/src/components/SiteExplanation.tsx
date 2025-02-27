"use client";

import BaseExplanation from "./BaseExplanation";

export default function SiteExplanation() {
  const content = `Generate your personalized news feed by selecting your favorite RSS feeds from various categories.
As a guest, you have access to a default list of global feeds grouped by category (news, sports, business, technology, climate).
Sign up to unlock additional features: add new feeds, remove feeds you don't like, and even create and customize your own feed categories for a truly personalized experience.
By default we have links to the website turned off to reduce distracting features but there is 'toggle links' button below if you wish to read the full stories on their websites.`;
  return <BaseExplanation title="How It Works" content={content} initiallyExpanded={true} />;
}
