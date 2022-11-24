import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { useInitialLoad } from "./hooks/useInitialLoad";
import { router } from "./util/router-provider";

function App() {
  const [initialLoadState, setInitialLoadState] = useInitialLoad();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialLoadState(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    }
  }, [])

  return <>{!initialLoadState ? <RouterProvider router={router} /> : <LoadingSpinner />}</>;
}

export default App;
