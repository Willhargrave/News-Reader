"use client";

import BaseExplanation from "./BaseExplanation";

export default function SiteExplanation() {
  const content = `Generate your personalized news feed by selecting your favorite RSS feeds from our default categories (news, sports, business, technology, climate). You can choose as many RSS feeds as you like which does impact the performance, but there is a limit of 50 total articles you can generate at one time.
  You can select from as many RSS feeds as you'd like, and use the slider to control how many articles you want (limit of 20 for each RSS feed). By default we have links to the source website turned off but you can press the 'Toggle Links' button to enable them on.
  Registering an account allows you to customize your feeds however you'd like. You can register with just a username and password, we don't require an email to sign up. After signing up you can click click on the user button above to adjust your default settings.`;
  return <BaseExplanation title="How It Works" content={content} initiallyExpanded={true} />;
}
