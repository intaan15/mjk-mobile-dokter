import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ImagePickerComponent from "@/components/imagepicker";
import ProfileImageModal from "@/components/modal4";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function App() {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setProfileImage,
  });

  return (
    <View className="flex-1 justify-center items-center p-10">
      {/* Tampilkan Foto Profil */}
      {profileImage ? (
        <Image
          source={{ uri: profileImage }}
          className="w-32 h-32 rounded-full mb-4"
        />
      ) : (
        <Text>Belum ada foto profil</Text>
      )}

      {/* Ganti Foto Profil */}
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="image-edit-outline"
          size={24}
          color="black"
        />
        <Text className="font-bold text-lg text-skyDark">
          Ganti Foto Profil
        </Text>
      </TouchableOpacity>

      {/* Hapus Foto Profil */}
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => setProfileImage(null)}
        disabled={!profileImage}
      >
        <MaterialCommunityIcons name="image-remove" size={24} color="black" />
        <Text className="font-bold text-lg text-skyDark">
          Hapus Foto Profil
        </Text>
      </TouchableOpacity>

      {/* Modal Pilih Foto */}
      <ProfileImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPickImage={() => {
          openGallery();
          setModalVisible(false);
        }}
        onOpenCamera={() => {
          openCamera();
          setModalVisible(false);
        }}
      />
    </View>
  );
}
