import { createContext, useContext, useEffect, useState } from "react";
import type { AuthData, User } from "../types/userType";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed: AuthData = JSON.parse(stored);
      setUser(parsed.datas.user);
      setToken(parsed.datas.token);
    }
  }, []);

  const login = (data: AuthData) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data.datas.user);
    setToken(data.datas.token);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
