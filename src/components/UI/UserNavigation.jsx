import { signOut } from "firebase/auth";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../util/firebase-config";

const UserNavigation = () => {
  return (
    <Fragment>
      <h2>Página de Usuario</h2>
      <div className="user-navigation">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink className="nav-link" to="/user/newchat">
              Iniciar nuevo chat
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/user/joinchat">
              Unirse a un chat
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/user/chats">
              Mis chats
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/user/profile">
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
    </Fragment>
  );
};

export default UserNavigation;
