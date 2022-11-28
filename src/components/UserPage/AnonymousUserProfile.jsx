import ErrorAlert from "../UI/ErrorAlert";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Avatar } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useLoading } from "../../hooks/useLoading";
import { storage } from "../../util/firebase-config";
import "./AnonymousUserProfile.css";

const AnonymousUserProfile = () => {
  const [photoURL, setPhotoURL] = useState(null);
  const loadingState = useLoading();
  const getErrorMessage = useErrorMessage();

  useEffect(() => {
    const fetch = async () => {
      loadingState.setIsLoading(true);

      try {
        const imageRef = ref(storage, "images/profile/default.png");

        const url = await getDownloadURL(imageRef);
        setPhotoURL(url);
      } catch (error) {
        loadingState.setMessage(
          <ErrorAlert
            message={getErrorMessage(error.message)}
            onClose={() => loadingState.setMessage(null)}
          />
        );
      }

      loadingState.setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        photoURL && (
          <>
            <Avatar
              alt="Foto de perfil"
              src={photoURL}
              sx={{ width: 128, height: 128 }}
            />
            <h2 className="anonymous-avatar-group">Invitado</h2>
            <p className="group">
              Estás ingresando como invitado. Para personalizar tu perfil debes
              crear una cuenta e ingresar usando tu correo electrónico y
              contraseña.
            </p>
          </>
        )
      )}
      {loadingState.message && <div>{loadingState.message}</div>}
    </>
  );
};

export default AnonymousUserProfile;
