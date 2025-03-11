import {Dispatch, SetStateAction,} from 'react'

export type Article = {
    feedTitle: string;
    headline: string;
    content: string;
    link: string;
  };

export type ArticleListProps = {
    articles: Article[];
    linksVisible: boolean;
    loading: boolean
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

export type AddFeedFormProps = {
    onFeedAdded: () => void;
    existingCategories: string[];
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
    collapse: boolean;
  }

  export interface FeedItemProps {
    refreshFeeds: () => void;
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    feedStoryCounts: Record<string, number>;
    setFeedStoryCounts: Dispatch<SetStateAction<Record<string, number>>>;
    selectedFeeds: string[];
    feed: Feed;
  }


export interface FeedItemProps {
    refreshFeeds: () => void;
    setSelectedFeeds: Dispatch<SetStateAction<string[]>>;
    feedStoryCounts: Record<string, number>;
    setFeedStoryCounts: Dispatch<SetStateAction<Record<string, number>>>;
    selectedFeeds: string[];
    feed: Feed;
  }

  export interface SelectDisplayTypeRadioProps {
    displayMode: "grouped" | "interleaved";
    setDisplayMode: Dispatch<SetStateAction<"grouped" | "interleaved">>;
  }


  export interface GlobalFeedCounterProps {
    globalCount: number;
    setGlobalCount: Dispatch<SetStateAction<number>>;
    selectedFeeds: string[];
    setFeedStoryCounts: Dispatch<SetStateAction<Record<string, number>>>;
  }

  
export type BaseExplanationProps = {
  title: string;
  content: string;
  initiallyExpanded?: boolean;
};

export type FeedAddExplanationProps = {
    initiallyExpanded?: boolean;
  };

  export interface ArticleItemProps {
    article: Article;
    linksVisible: boolean;
  }
  
  export interface UserSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultArticleCount: number;
    setDefaultArticleCount: (count: number) => void;
  }