import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

 
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUser));
    }
  }, []);

  // 🔐 Login
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    setToken(data.token);
    setUsuario(data.usuario);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = usuario?.rol === "admin";

  return (
    <AuthContext.Provider 
      value={{ 
        usuario,
        token,
        isAuthenticated,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


