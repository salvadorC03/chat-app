import { Fragment, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserNavigation from "../components/UserNavigation";
import { auth, AuthContext } from '../util/firebase-config';

const UserPage = () => {
  const authCtx = useContext(AuthContext);
  if (!authCtx.currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Fragment>
      <UserNavigation />
      <div className="group">
        <div className="card border-primary mb-3" style={{ width: "80%" }}>
          <div className="card-header">Menú</div>
          <div className="card-body">
            <Outlet />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserPage;
