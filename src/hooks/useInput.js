import { useState } from "react";

export const useInput = (validateFunc) => {
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const isValid = !hasError && isTouched;
  const inputClasses = isTouched ? (hasError ? "is-invalid" : "is-valid") : "";

  const changeHandler = (event) => {
    setValue(event.target.value);
    setIsTouched(true);
    setHasError(validateFunc(event.target.value));
  };

  return {value, changeHandler, hasError, isValid, inputClasses, setValue, setHasError};
};
