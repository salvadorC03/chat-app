import { useState } from "react";

export let initialLoad = true;

export const useInitialLoad = () => {
  const [initialLoadState, setInitialLoadState] = useState(initialLoad);

  const setInitialLoad = (expression) => {
    initialLoad = expression;
    setInitialLoadState(initialLoad);
  };

  return [initialLoadState, setInitialLoad];
};
