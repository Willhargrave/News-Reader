"use client";

import BaseExplanation from "./BaseExplanation";

export default function SiteExplanation() {
  const content = `Generate your personalized news feed by selecting your favorite RSS feeds from our default categories (news, sports, business, technology, climate)
If you want to make an account to access some features: add new feeds, remove feeds you don't like, and create and customize your own feed categories, you can so with just a user name and password.
By default we have links to the website turned off to reduce distracting features but there is 'toggle links' button below if you wish to read the full stories on their websites. You can add as many feeds as you want but it should go without saying 
the more feeds and stories you generate the slower the site will load. You have the choice of having all the stories grouped by their own feed or interleaved between each other. `;
  return <BaseExplanation title="How It Works" content={content} initiallyExpanded={true} />;
}
