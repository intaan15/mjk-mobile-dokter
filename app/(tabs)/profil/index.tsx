import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Navbar from "../../components/navbar";
import Background from "../../components/background";
import Modal2 from "../../components/modal2";
import React, { useState } from "react";
import TimeRangePicker from "@/components/time";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";

const DataDummy = {
  id: 1,
  nama: "Dr Izzu Adit Intan Nita",
  username: "Zuditanit",
  email: "zuditanit@gmail.com",
  no_tlp: "08123712953234",
  spesialis: "Jantung",
};

export default function ProfileScreen() {
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

  // Fungsi untuk mengatur modal sesuai aksi yang diinginkan
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

  return (
    <Background>
      <View className="flex-1">
        {/* <Navbar /> */}
        <ScrollView>
          {/* Header */}
          <View className="relative pt-12 bg-skyLight rounded-b-[50px] py-28">
            <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
              <Text className="text-skyDark text-2xl font-bold">
                Selamat datang, {"\n"}
                {DataDummy.nama}
              </Text>
              <Image
                className="h-10 w-12"
                source={images.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Foto Profil */}
          <View className="absolute top-28 left-1/2 -translate-x-1/2">
            <Image
              source={images.foto}
              className="h-32 w-32 rounded-full border-4 border-white"
              resizeMode="cover"
            />
          </View>

          {/* Card Profil */}
          <View
            className="bg-white rounded-xl mx-10 mt-24 p-6"
            style={{
              shadowOffset: { width: 0, height: -20 },
              shadowOpacity: 0.2,
              shadowRadius: 11,
              elevation: 15,
            }}
          >
            <Text className="font-bold text-lg text-skyDark">Nama</Text>
            <Text className="text-gray-700">{DataDummy.nama}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              Username
            </Text>

            <Text className="text-gray-700">{DataDummy.username}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">Email</Text>
            <Text className="text-gray-700">{DataDummy.email}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              Nomor Telepon
            </Text>
            <Text className="text-gray-700">{DataDummy.no_tlp}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              Spesialis
            </Text>
            <Text className="text-gray-700">{DataDummy.spesialis}</Text>

            {/* Ganti Password */}
            <Text className="font-bold text-lg text-skyDark mt-4">
              Ganti Password
            </Text>
            <Image source={images.line} className="w-full my-2" />
            <View className="flex flex-col items-center gap-2 ">
              <TextInput
                placeholder="Password Lama"
                secureTextEntry
                className="border-2 rounded-xl border-gray-400 p-2 mt-2 w-full"
              />
              <TextInput
                placeholder="Password Baru"
                secureTextEntry
                className="border-2 rounded-xl border-gray-400 p-2 mt-2 w-full"
              />
              <TextInput
                placeholder="Konfirmasi Password Baru"
                secureTextEntry
                className="border-2 rounded-xl border-gray-400 p-2 mt-2 w-full"
              />

              <TouchableOpacity className="bg-white p-2 rounded-xl w-2/4  mt-4 border-2 border-sky-500">
                <Text className="text-skyDark text-center font-bold">
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card Settings  */}
          <View
            className="bg-white rounded-xl mx-10 mt-10 p-6 mb-24"
            style={{
              shadowOffset: { width: 0, height: -20 },
              shadowOpacity: 0.2,
              shadowRadius: 11,
              elevation: 15,
            }}
          >
            {/* Ganti Foto Profil */}
            <TouchableOpacity className="flex flex-row items-center gap-2">
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

            {/* Hapus Foto Profil */}
            <TouchableOpacity className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="image-remove"
                size={24}
                color="black"
              />
              <Text className="font-bold text-lg text-skyDark">
                Hapus Foto Profil
              </Text>
            </TouchableOpacity>

            <Image source={images.line} className="w-full my-2" />

            {/* Ubah Jadwal */}
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              onPress={() => router.push("/profil/ubahjadwal")}
            >
              <FontAwesome5 name="clipboard-list" size={24} color="black" />
              <Text className="font-bold text-lg text-skyDark">
                Ubah Jadwal
              </Text>
            </TouchableOpacity>

            <Image source={images.line} className="w-full my-2" />

            {/* Hapus Akun */}
            <View className="flex-1 justify-center">
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={showDeleteModal}
              >
                <AntDesign name="delete" size={24} color="red" />
                <Text className="font-bold text-lg text-red-500">
                  Hapus Akun
                </Text>
              </TouchableOpacity>

              <Image source={images.line} className="w-full my-2" />

              {/* Tombol Logout */}
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={showLogoutModal}
              >
                <AntDesign name="logout" size={24} color="red" />
                <Text className="font-bold text-lg text-red-500">Log Out</Text>
                
              </TouchableOpacity>
              <Modal2
                isModalVisible={isModalVisible}
                toggleModal={toggleModal}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
}

