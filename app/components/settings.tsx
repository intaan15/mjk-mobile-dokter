import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import Modal2 from "@/components/modal2";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import ImagePickerComponent from "@/components/imagepicker";
import ImageModal from "@/components/modal4";
import { ImageProvider, useImage } from "@/components/imagecontext";

const DataDummy = {
  id: 1,
  nama: "Dr Izzu Adit Intan Nita",
  username: "Zuditanit",
  email: "zuditanit@gmail.com",
  no_tlp: "08123712953234",
  spesialis: "Jantung",
};

export default function Settings() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const showDeleteModal = () => {
    setModalConfig({
      message: "Anda yakin akan menghapus akun?",
      confirmText: "Hapus",
      onConfirm: () => console.log("Akun dihapus"),
    });
    toggleModal();
  };

  const showLogoutModal = () => {
    setModalConfig({
      message: "Anda yakin ingin keluar?",
      confirmText: "Keluar",
      onConfirm: () => console.log("Logout sukses"),
    });
    toggleModal();
  };

  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;
  const [modalVisible, setModalImageVisible] = useState(false);

  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  return (
    <View
      className="bg-white rounded-xl mx-10 mt-10 p-6 mb-24"
      style={{
        shadowOffset: { width: 0, height: -20 },
        shadowOpacity: 0.2,
        shadowRadius: 11,
        elevation: 15,
      }}
    >
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => setModalImageVisible(true)}
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

      <Image source={images.line} className="w-full my-2" />

      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => setImage?.(null)}
        disabled={!profileImage}
      >
        <MaterialCommunityIcons name="image-remove" size={24} color="black" />
        <Text className="font-bold text-lg text-skyDark">
          Hapus Foto Profil
        </Text>
      </TouchableOpacity>

      <Image source={images.line} className="w-full my-2" />

      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => router.push("/profil/ubahjadwal")}
      >
        <FontAwesome5 name="clipboard-list" size={24} color="black" />
        <Text className="font-bold text-lg text-skyDark">Ubah Jadwal</Text>
      </TouchableOpacity>

      <Image source={images.line} className="w-full my-2" />

      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={showDeleteModal}
        >
          <AntDesign name="delete" size={24} color="red" />
          <Text className="font-bold text-lg text-red-500">Hapus Akun</Text>
        </TouchableOpacity>

        <Image source={images.line} className="w-full my-2" />

        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          onPress={showLogoutModal}
        >
          <AntDesign name="logout" size={24} color="red" />
          <Text className="font-bold text-lg text-red-500">Log Out</Text>
        </TouchableOpacity>
        <Modal2
          isOpen={isModalVisible}
          toggleModal={toggleModal}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          onConfirm={modalConfig.onConfirm}
        />
        <ImageModal
          visible={modalVisible}
          onClose={() => setModalImageVisible(false)}
          onPickImage={() => {
            openGallery();
            setModalImageVisible(false);
          }}
          onOpenCamera={() => {
            openCamera();
            setModalImageVisible(false);
          }}
        />
      </View>
    </View>
  );
}
