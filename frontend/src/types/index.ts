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