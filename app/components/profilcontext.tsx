import React, { createContext, useContext, useState } from "react";

const profilcontext = createContext<{
  profileImage: null;
  setProfileImage: React.Dispatch<React.SetStateAction<null>>;
} | null>(null);

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <profilcontext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </profilcontext.Provider>
  );
};

export const useProfile = () => useContext(profilcontext);
