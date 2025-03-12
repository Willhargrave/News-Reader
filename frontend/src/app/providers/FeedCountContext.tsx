import { createContext, useContext, ReactNode } from "react";
import { useFeedCounts } from "@/hooks/useFeedCount";

interface FeedCountsContextType {
  state: ReturnType<typeof useFeedCounts>["state"];
  dispatch: ReturnType<typeof useFeedCounts>["dispatch"];
  getCountForFeed: ReturnType<typeof useFeedCounts>["getCountForFeed"];
}

const FeedCountsContext = createContext<FeedCountsContextType | undefined>(undefined);

export const FeedCountsProvider = ({ children }: { children: ReactNode }) => {
  const feedCounts = useFeedCounts(10);
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
