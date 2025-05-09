import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const BACKENDURL = "http://localhost:8080/api/v1";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(false);

  const getAdminData = async (emailAddress) => {
    try {
      const profileResponse = await axios.get(
        `${BACKENDURL}/profile?emailAddress=${emailAddress}`
      );
      if (profileResponse.status === 200) {
        setAdminData(profileResponse.data);
      } else {
        toast.error("Unable to Retrieve Data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const contextValue = {
    BACKENDURL,
    isLoggedIn,
    setIsLoggedIn,
    adminData,
    setAdminData,
    getAdminData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
