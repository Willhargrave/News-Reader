import {Dispatch, SetStateAction,} from 'react'

export type Article = {
    feedTitle: string;
    headline: string;
    content: string;
    link: string;
  };
  
export type Feed = {
    id?: string;
    title: string;
    link: string;
    category: string;
  };
  
export type FeedFormProps = {
    availableFeeds: Feed[]; 
    setAvailableFeeds: Dispatch<SetStateAction<Feed[]>>;
    selectedFeeds: string[];
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    setArticles: Dispatch<SetStateAction<Article[]>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    toggleLinks: () => void;
    refreshFeeds: () => void;
    loading: boolean;
  };


  export interface FeedCategoryProps {
    selectedFeeds: string[];
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    feedStoryCounts: Record<string, number>;
    setFeedStoryCounts: Dispatch<SetStateAction<Record<string, number>>>;
    groupedFeeds: Record<string, Feed[]>;
    globalCount: number;
    categoryName: string;
    isAllSelected: boolean;
    feedsInCategory: Feed[];
    refreshFeeds: () => void;
  }

  export interface FeedItemProps {
    refreshFeeds: () => void;
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    feedStoryCounts: Record<string, number>;
    setFeedStoryCounts: Dispatch<SetStateAction<Record<string, number>>>;
    selectedFeeds: string[];
    feed: Feed;
  }