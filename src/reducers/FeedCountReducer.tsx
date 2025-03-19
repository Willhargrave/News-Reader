interface FeedState {
    defaultCount: number;     
    globalCount: number;       
    feedCounts: Record<string, number>; 
    selectedFeeds: string[]; 
  }

  type FeedAction =
  | { type: 'SET_DEFAULT'; payload: number; selectedFeeds: string[] }
  | { type: 'UPDATE_GLOBAL'; payload: number }
  | { type: 'UPDATE_SINGLE'; payload: { feedId: string; value: number } }
  | { type: 'SELECT_FEEDS'; payload: string[] }
  | { type: 'RESET_FEED_COUNTS'}
  | { type: "REMOVE_SINGLE"; payload: string }


  
 export const feedReducer = (state: FeedState, action: FeedAction): FeedState => {
    switch (action.type) {
        case 'SET_DEFAULT': {
            const previousDefault = state.defaultCount;
            const newDefault = action.payload;    
            return {
              ...state,
              defaultCount: newDefault,
              globalCount: newDefault,
              feedCounts: Object.fromEntries(
                Object.entries(state.feedCounts).map(([feedId, count]) => [
                  feedId,
                  count === previousDefault ? newDefault : count
                ])
              )
            };
          }

          case 'UPDATE_GLOBAL': {
            const newGlobal = action.payload;
            const previousGlobal = state.globalCount;
            
            return {
              ...state,
              globalCount: newGlobal,
              feedCounts: Object.fromEntries(
                Object.entries(state.feedCounts).map(([feedId, count]) => [
                  feedId,
                  count === previousGlobal ? newGlobal : count
                ]))
            };
          }
          
  
      case 'UPDATE_SINGLE':
        return {
          ...state,
          feedCounts: {
            ...state.feedCounts,
            [action.payload.feedId]: action.payload.value
          }
        };
  
      case 'SELECT_FEEDS':
        return { ...state, selectedFeeds: action.payload };

        case "RESET_FEED_COUNTS":
        return {
        ...state,
        feedCounts: {}
        };
        
        case 'REMOVE_SINGLE': {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [action.payload]: removed, ...rest } = state.feedCounts;
            return {
              ...state,
              feedCounts: rest
            };
          }
          
      default:
        return state;
    }
  };
  