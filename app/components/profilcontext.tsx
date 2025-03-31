import React, { createContext, useContext, useState } from "react";

const profilcontext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <profilcontext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </profilcontext.Provider>
  );
};

export const useProfile = () => useContext(profilcontext);
