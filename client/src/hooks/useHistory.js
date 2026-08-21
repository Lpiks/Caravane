import { useReducer, useCallback } from 'react';

function historyReducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }
    case 'SET': {
      const resolvedState = typeof action.payload === 'function' 
        ? action.payload(present) 
        : action.payload;
        
      if (resolvedState === present) return state;
      
      return {
        past: [...past, present],
        present: resolvedState,
        future: [] // clear future on new action
      };
    }
    case 'RESET': {
      return {
        past: [],
        present: action.payload,
        future: []
      };
    }
    default:
      return state;
  }
}

export function useHistory(initialPresent) {
  const [state, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialPresent,
    future: []
  });

  const set = useCallback((newState) => {
    dispatch({ type: 'SET', payload: newState });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const reset = useCallback((newState) => {
    dispatch({ type: 'RESET', payload: newState });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
}
