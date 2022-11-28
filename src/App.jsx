import LoadingSpinner from "./components/UI/LoadingSpinner";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useInitialLoad } from "./hooks/useInitialLoad";
import { router } from "./util/router-provider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase-config";

function App() {
  const [initialLoadState, setInitialLoadState] = useInitialLoad();

  useEffect(() => {
    onAuthStateChanged(auth, () => {
      setInitialLoadState(false);
    });
  }, []);

  return (
    <>
      {!initialLoadState ? (
        <RouterProvider router={router} />
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

export default App;
