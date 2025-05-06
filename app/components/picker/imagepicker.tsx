// import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import React, { createContext, useContext, useState } from "react";

export default function ImagePickerComponent({ onImageSelected }) {
  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onImageSelected(result.assets[0]);
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onImageSelected(result.assets[0]);
    }
  };

  return { openGallery, openCamera };
}




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
