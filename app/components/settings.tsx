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
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import ImagePickerComponent, {
  useImage,
  ImageProvider,
} from "@/components/picker/imagepicker";
import ModalTemplate from "./modals/ModalTemplate";
import ModalContent from "./modals/ModalContent";

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
  const [modalType, setModalType] = useState("info");

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;

  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  // Handler baru yang gabung pick image + tutup modal
  const handlePickImage = async () => {
    await openGallery();
    // setModalVisible(false); 
  };

  const handleOpenCamera = async () => {
    await openCamera(); 
    // setModalVisible(false); 
  };

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
        onPress={() => openModal("pilihgambar")}
      >
        <MaterialCommunityIcons
          name="image-edit-outline"
          size={22}
          color="#025F96"
        />
        <Text className="font-bold text-lg text-skyDark">
          Ganti Foto Profil
        </Text>
      </TouchableOpacity>

      <View className="w-full h-[2px] bg-skyDark" />

      <TouchableOpacity
        className="flex flex-row items-center gap-2 py-1"
        onPress={() => openModal("hapusprofil")}
        disabled={!profileImage}
      >
        <MaterialCommunityIcons name="image-remove" size={22} color="#025F96" />
        <Text className="font-bold text-lg text-skyDark">
          Hapus Foto Profil
        </Text>
      </TouchableOpacity>

      <View className="w-full h-[2px] bg-skyDark" />

      <TouchableOpacity
        className="flex flex-row items-center gap-3 py-1 pl-1"
        onPress={() => router.push("/profil/aturjadwal")}
      >
        <FontAwesome5 name="clipboard-list" size={22} color="#025F96" />
        <Text className="font-bold text-lg text-skyDark">Atur Jadwal</Text>
      </TouchableOpacity>

      <View className="w-full h-[2px] bg-skyDark" />

      <TouchableOpacity
        className="flex flex-row items-center gap-3 py-1 pl-1"
        onPress={() => router.push("/profil/ubahjadwal")}
      >
        <FontAwesome5 name="calendar-day" size={19} color="#025F96" />
        <Text className="font-bold text-lg text-skyDark">Ubah Jadwal</Text>
      </TouchableOpacity>

      <View className="w-full h-[2px] bg-skyDark" />

      <View className="flex-1 justify-center">
        <TouchableOpacity
          className="flex flex-row items-center gap-2 py-1"
          onPress={() => openModal("hapusakun")}
        >
          <AntDesign name="delete" size={22} color="#dc2626" />
          <Text className="font-bold text-lg text-red-600">Hapus Akun</Text>
        </TouchableOpacity>

        <View className="w-full h-[2px] bg-skyDark" />

        <TouchableOpacity
          className="flex flex-row items-center gap-2 pt-1"
          onPress={() => openModal("keluarakun")}
        >
          <AntDesign name="logout" size={22} color="#dc2626" />
          <Text className="font-bold text-lg text-red-600">Log Out</Text>
        </TouchableOpacity>

        <ModalTemplate
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        >
          <ModalContent
            modalType={modalType}
            onPickImage={handlePickImage}
            onOpenCamera={handleOpenCamera}
            onClose={() => setModalVisible(false)}
          />
        </ModalTemplate>

      </View>
    </View>
  );
}
