import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState=async()=>{
    try {
        const { data } = await axios.get(`${backendUrl}v1/api/auth/is-authenticated`)
        if (data.success) {
            setIsLoggedIn(true);
            getUserData();
        }
    } catch (error) {
         toast.error(data.message);
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}v1/api/user/userdata`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
    
  },[])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
