import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api/client.js";

const TOKEN_KEY = "student_analytics_token";
const USER_KEY = "student_analytics_user";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  function storeSession(nextToken, nextUser) {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  async function signIn(credentials) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials
    });
    storeSession(data.token, data.user);
    return data.user;
  }

  async function signUp(payload) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: payload
    });
    storeSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, signIn, signUp, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
