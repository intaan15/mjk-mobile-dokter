import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import Background from "../../components/background";
import React, { useState } from "react";
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { images } from "@/constants/images";
import Settings from "@/components/settings";
import { ImageProvider, useImage } from "@/components/imagecontext";

const DataDummy = {
  id: 1,
  nama: "Dr Izzu Adit Intan Nita",
  username: "Zuditanit",
  email: "zuditanit@gmail.com",
  no_tlp: "08123712953234",
  spesialis: "Jantung",
};

export default function ProfileScreen() {
  return (
    <ImageProvider>
      <App />
    </ImageProvider>
  );
}

function App() {
  const imageContext = useImage();
  const profileImage = imageContext?.profileImage || null;

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
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-32 h-32 rounded-full mb-4"
              />
            ) : (
              <Text>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={110}
                  color="grey"
                />
              </Text>
            )}
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
            <View className="w-full h-[2px] bg-skyDark"/>
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
          <Settings />
        </ScrollView>
      </View>
    </Background>
  );
}
