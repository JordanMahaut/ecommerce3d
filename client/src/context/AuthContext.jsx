import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authService from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const data = await authService.login({
      email,
      password,
    });

    if (!data.token || !data.user) {
      throw new Error("Réponse de connexion invalide.");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function loadUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();

      const authenticatedUser = data.user ?? data;

      if (!authenticatedUser?.id) {
        throw new Error("Utilisateur invalide.");
      }

      setUser(authenticatedUser);
    } catch (error) {
      console.error(
        "Erreur lors de la restauration de la session :",
        error,
      );

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé dans un AuthProvider.",
    );
  }

  return context;
}