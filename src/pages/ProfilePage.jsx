import ErrorAlert from "../components/UI/ErrorAlert";
import UserProfile from "../components/UserPage/UserProfile";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useEffect, useState } from "react";
import { findUser } from "../util/api";
import { useLoading } from "../hooks/useLoading";
import { Outlet } from "react-router-dom";
import { auth } from "../util/firebase-config";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const loadingState = useLoading();

  useEffect(() => {
    const fetchUserData = async () => {
      loadingState.setIsLoading(true);
      try {
        const data = await findUser(auth.currentUser.email);
        setUserData(data);
      } catch (error) {
        console.log(error.message);
        loadingState.setMessage(<ErrorAlert message={"Error al cargar perfil."} />);
      }
      loadingState.setIsLoading(false);
    };
    fetchUserData();
  }, []);

  return (
    <>
      {loadingState.message && <div>{loadingState.message}</div>}
      {loadingState.isLoading && <LoadingSpinner />}
      {!loadingState.isLoading && userData && (
        <UserProfile
          username={userData.username}
          password={userData.password}
          email={userData.email}
        />
      )}
      <Outlet />
    </>
  );
};

export default ProfilePage;
