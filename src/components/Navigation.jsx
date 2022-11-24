import { NavLink } from "react-router-dom";
import { Fragment } from "react";
import { auth, AuthContext } from "../util/firebase-config";
import { useContext } from "react";

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Chat App
          </NavLink>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={!authCtx.currentUser ? "/login" : "/user"}
              >
                {!authCtx.currentUser ? "Iniciar Sesión" : "Tu Perfil"}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navigation;
