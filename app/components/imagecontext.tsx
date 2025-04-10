import React, { createContext, useContext, useState } from "react";

const imagecontext = createContext<{
  profileImage: null;
  setImage: React.Dispatch<React.SetStateAction<null>>;
} | null>(null);

export const ImageProvider = ({ children }) => {
  const [profileImage, setImage] = useState(null);

  return (
    <imagecontext.Provider value={{ profileImage, setImage }}>
      {children}
    </imagecontext.Provider>
  );
};

export const useImage = () => useContext(imagecontext);
