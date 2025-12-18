
import { useState, useCallback } from 'react';

export const useAuthMock = () => {
  // Static mock for the logic demonstration
  // In a real app, this would check tokens or sessions
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, login, logout };
};
