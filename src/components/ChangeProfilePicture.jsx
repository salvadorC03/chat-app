import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { useLoading } from "../hooks/useLoading";
import { auth, storage } from "../util/firebase-config";
import { getErrorMessage } from "../util/getErrorMessage";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import LoadingSpinner from "./LoadingSpinner";

const ChangeProfilePicture = ({ setChangingPicture, setPhotoURL }) => {
  const loadingState = useLoading();

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadingState.setMessage(null);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingState.message]);

  const uploadPicture = async (event) => {
    loadingState.setMessage(null);
    loadingState.setIsLoading(true);
    try {
      const file = event.target.files[0];
      if (!file.type.includes("image")) {
        throw new Error("El archivo seleccionado no es válido");
      }

      const imageRef = ref(
        storage,
        `images/profile/${auth.currentUser.email}/picture`
      );
      await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(imageRef);

      await updateProfile(auth.currentUser, { photoURL });
      loadingState.setMessage(
        <SuccessAlert
          onClose={() => {
            loadingState.setMessage(null);
          }}
          message="Foto de perfil actualizada exitosamente."
        />
      );
      setPhotoURL(photoURL);
    } catch (error) {
      loadingState.setMessage(
        <ErrorAlert
          onClose={() => {
            loadingState.setMessage(null);
          }}
          message={getErrorMessage(error.message)}
        />
      );
    }
    loadingState.setIsLoading(false);
  };

  return (
    <div className="form-group">
      <label htmlFor="formFile" class="form-label mt-4">
        Seleccionar archivo:
      </label>
      <input
        class="form-control"
        onChange={uploadPicture}
        type="file"
        id="formFile"
        disabled={loadingState.isLoading}
      />
      {loadingState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <button
            className="btn btn-primary group"
            onClick={() => {
              loadingState.setMessage(null);
              setChangingPicture(false);
            }}
          >
            Cerrar
          </button>
        </>
      )}
      {loadingState.message && <div>{loadingState.message}</div>}
    </div>
  );
};

export default ChangeProfilePicture;
