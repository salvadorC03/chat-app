import { useState } from "react";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  return { isLoading, setIsLoading, message, setMessage };
};
