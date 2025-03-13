import { createContext, useContext, ReactNode, useEffect } from "react";
import { useFeedCounts } from "@/hooks/useFeedCount";

interface FeedCountsContextType {
  state: ReturnType<typeof useFeedCounts>["state"];
  dispatch: ReturnType<typeof useFeedCounts>["dispatch"];
  getCountForFeed: ReturnType<typeof useFeedCounts>["getCountForFeed"];
}

const FeedCountsContext = createContext<FeedCountsContextType | undefined>(undefined);

interface FeedCountsProviderProps {
  children: ReactNode;
  initialDefault: number;
}

export const FeedCountsProvider = ({ children, initialDefault }: FeedCountsProviderProps) => {
  const feedCounts = useFeedCounts(initialDefault);
  const { dispatch, state } = feedCounts;

  useEffect(() => {
    dispatch({ type: "SET_DEFAULT", payload: initialDefault, selectedFeeds: state.selectedFeeds });
  }, [initialDefault, dispatch, state.selectedFeeds]);

  return (
    <FeedCountsContext.Provider value={feedCounts}>
      {children}
    </FeedCountsContext.Provider>
  );
};

export const useFeedCountsContext = () => {
  const context = useContext(FeedCountsContext);
  if (!context) {
    throw new Error("useFeedCountsContext must be used within a FeedCountsProvider");
  }
  return context;
};
