import React, { useState } from "react";
import { View, Image, Alert, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ImagePickerComponent() {
  const [image, setImage] = useState(null);

  // Buka Kamera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin diperlukan", "Akses kamera ditolak!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Buka Galeri
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin diperlukan", "Akses galeri ditolak!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Hapus Gambar
  const deleteImage = () => {
    if (image) {
      setImage(null);
      Alert.alert("Gambar dihapus");
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-20 bg-slate-200">
      {/* Tampilkan Gambar atau Placeholder */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-64 h-64 mb-20 rounded-xl border-1 border-black"
        />
      ) : (
        <Text className="mb-20 text-slate-400 text-lg">
          Belum ada gambar dipilih
        </Text>
      )}

      {/* Tombol Kamera & Galeri */}
      <View className="flex flex-row gap-10 mb-20">
        <TouchableOpacity onPress={openCamera}>
          <Text>
            <SimpleLineIcons name="camera" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openGallery}>
          <Text>
            <Feather name="image" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteImage} disabled={!image}>
          <Text>
            <MaterialCommunityIcons
              name="image-remove"
              size={24}
              color="black"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
