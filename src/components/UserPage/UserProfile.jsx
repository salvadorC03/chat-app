import { Link } from "react-router-dom";
import UserProfilePicture from "./UserProfilePicture";

const UserProfile = (props) => {
  return (
    <>
      <UserProfilePicture />
      <div className="group">
        <p>Nombre de usuario: {props.username}</p>
        <Link to="/user/profile/changeusername">
          <button className="btn btn-primary">Cambiar nombre de usuario</button>
        </Link>
      </div>
      <div className="group">
        <p>Correo Electrónico: {props.email}</p>
        <Link to="/user/profile/changeemail">
          <button className="btn btn-primary">
            Cambiar correo electrónico
          </button>
        </Link>
      </div>
      <div className="group">
        <p>Contraseña: {props.password}</p>
        <Link to="/user/profile/changepassword">
          <button className="btn btn-primary">Cambiar contraseña</button>
        </Link>
      </div>
    </>
  );
};

export default UserProfile;
