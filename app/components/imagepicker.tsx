import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerComponent({ onImageSelected }) {
  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return { openGallery, openCamera };
}
