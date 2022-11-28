import { signOut } from "firebase/auth";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { auth, AuthContext } from "../../util/firebase-config";
import "./UserNavigation.css";

const UserNavigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <h2>Página de Usuario</h2>
      <div className="user-navigation">
        <ul className="nav nav-pills" id="adjustSize">
          {!authCtx.currentUser.isAnonymous && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/newchat">
                Iniciar nuevo chat
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to={
                !authCtx.currentUser.isAnonymous
                  ? "/user/joinchat"
                  : "/anonymous/joinchat"
              }
            >
              Unirse a un chat
            </NavLink>
          </li>
          {!authCtx.currentUser.isAnonymous && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/chats">
                Mis chats
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to={
                !authCtx.currentUser.isAnonymous
                  ? "/user/profile"
                  : "/anonymous/profile"
              }
            >
              Ver Perfil
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              onClick={async () => {
                await signOut(auth);
              }}
            >
              Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserNavigation;
