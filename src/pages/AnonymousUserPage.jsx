import Card from "../components/UI/Card";
import UserNavigation from "../components/UI/UserNavigation";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../util/firebase-config";
import "./UserPage.css";

const AnonymousUserPage = () => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.currentUser) return <Navigate to="/login" />;
  if (!authCtx.currentUser.isAnonymous) return <Navigate to="/user/profile" />;

  return (
    <>
      <UserNavigation />
      <Card header="Menú" classes="border-primary mb-3 group userPage">
        <Outlet />
      </Card>
    </>
  );
};

export default AnonymousUserPage;
