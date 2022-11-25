import { useEffect } from "react";
import { useState } from "react";
import { auth } from "../util/firebase-config";
import Avatar from "@mui/material/Avatar";
import ChangeProfilePicture from "./ChangeProfilePicture";

const UserProfilePicture = () => {
  const [changingPicture, setChangingPicture] = useState(false);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    setPhotoURL(auth.currentUser.photoURL);
  }, [auth.currentUser.photoURL]);

  return (
    <>
      <Avatar
        alt="Foto de perfil"
        src={photoURL}
        sx={{ width: 128, height: 128 }}
      />
      {changingPicture ? (
        <>
          <ChangeProfilePicture setChangingPicture={setChangingPicture} setPhotoURL={setPhotoURL} />
        </>
      ) : (
        <button
          className="btn btn-primary group"
          onClick={() => {
            setChangingPicture(true);
          }}
        >
          Cambiar foto de perfil
        </button>
      )}
    </>
  );
};

export default UserProfilePicture;
