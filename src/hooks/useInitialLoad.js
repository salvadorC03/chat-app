import { useState } from "react";

let initialLoad = true;

export const useInitialLoad = () => {
  const [initialLoadState, setInitialLoadState] = useState(initialLoad);

  const setInitialLoad = (expression) => {
    initialLoad = expression;
    setInitialLoadState(initialLoad);
  };

  return [initialLoadState, setInitialLoad];
};
