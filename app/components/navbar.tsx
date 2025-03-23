import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Navbar() {
  const router = useRouter();

  return (
    <View className="absolute bottom-0 flex flex-row justify-between px-14 py-3 bg-skyDark w-full text-white z-50">
      <TouchableOpacity onPress={() => router.replace("./homescreen")}>
        <NavItem icon="home" label="Beranda" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("./jadwal")}>
        <NavItem icon="calendar-alt" label="Jadwal" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("./profil")}>
        <NavItem icon="user" label="Profil" />
      </TouchableOpacity>
    </View>
  );
}

// Komponen untuk tiap item navbar
const NavItem = ({ icon, label }) => {
  return (
    <View className="flex items-center flex-1">
      <FontAwesome5 name={icon} size={24} color="white" />
      <Text className="text-white text-xs mt-1">{label}</Text>
    </View>
  );
};
