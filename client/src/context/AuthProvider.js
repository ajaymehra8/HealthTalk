import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [show,setShow]=useState(false);
  const [headers, setHeaders] = useState(null);
  const navigate = useNavigate();

  const loadUserFromLocalStorage = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        const token = parsedInfo?.jwt;
        if(!token) return;
        setHeaders({
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        });
        setUser(parsedInfo);
      } catch (err) {
        console.error("Failed to parse user info:", err);
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromLocalStorage();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, headers, setHeaders,show,setShow }),
    [user, headers,show]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
