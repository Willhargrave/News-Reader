import { useReducer } from "react";
import { feedReducer } from "@/reducers/FeedCountReducer";

export const useFeedCounts = (initialDefault = 10) => {
    const [state, dispatch] = useReducer(feedReducer, {
      defaultCount: initialDefault,
      globalCount: initialDefault,
      feedCounts: {},
      selectedFeeds: []
    });
  
    const getCountForFeed = (feedId: string) => 
      state.feedCounts[feedId] ?? state.globalCount;
  
    return {
      state,
      dispatch,
      getCountForFeed
    };
  };