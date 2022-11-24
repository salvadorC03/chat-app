export const getErrorMessage = (errorMessage) => {
  switch (errorMessage) {
    case "Failed to fetch":
      return "Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.";

    case "USERNAME_EXISTS":
      return "El nombre de usuario ya está en uso.";

    case "Firebase: Error (auth/wrong-password).":
        return "La contraseña es incorrecta." 

    case "Firebase: Error (auth/user-not-found).":
        return "Correo electrónico no registrado."

    case "Firebase: Error (auth/email-already-in-use).":
      return "El correo electrónico ya está en uso.";

    case "WRONG_PASSWORD":
      return "La contraseña es incorrecta.";

    default:
      return errorMessage;
  }
};
