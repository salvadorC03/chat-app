import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { findUser } from "../util/api";
import { useLoading } from "../hooks/useLoading";
import { Outlet } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import { auth } from "../util/firebase-config";
import ErrorAlert from "../components/ErrorAlert";

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
