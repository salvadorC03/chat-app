import { NavLink } from "react-router-dom";
import { AuthContext } from "../../util/firebase-config";
import { useContext, useState } from "react";

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const [showCollapseNav, setShowCollapseNav] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          ID Chat
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => {
            setShowCollapseNav((prevState) => !prevState);
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${showCollapseNav && "show"}`}
          id="navbarColor01"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={
                  !authCtx.currentUser
                    ? "/login"
                    : !authCtx.currentUser.isAnonymous
                    ? "/user"
                    : "/anonymous"
                }
              >
                {!authCtx.currentUser ? "Iniciar Sesión" : "Tu Perfil"}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
