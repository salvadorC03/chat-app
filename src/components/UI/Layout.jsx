import { Outlet } from "react-router-dom";
import { Fragment } from "react";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <Fragment>
      <Navigation />
      <div className="layout">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Layout;
