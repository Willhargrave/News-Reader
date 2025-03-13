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
  | { type: 'SELECT_FEEDS'; payload: string[] };

  
 export const feedReducer = (state: FeedState, action: FeedAction): FeedState => {
    switch (action.type) {
      case 'SET_DEFAULT':
        return {
          ...state,
          defaultCount: action.payload,
          globalCount: action.payload,
          feedCounts: Object.fromEntries(
            Object.entries(state.feedCounts)
              .filter(([_, v]) => v !== state.globalCount)
          )
        };
  
      case 'UPDATE_GLOBAL': {
        const newGlobal = action.payload;
        return {
          ...state,
          globalCount: newGlobal,
          feedCounts: {
            ...state.feedCounts,
            ...Object.fromEntries(
              state.selectedFeeds.map(id => [id, newGlobal])
            )
          }
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
  
      default:
        return state;
    }
  };
  