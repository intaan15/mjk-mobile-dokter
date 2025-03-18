import { View, Text, Dimensions } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons"; // Import ikon

const { width } = Dimensions.get("window");

export default function Navbar() {
  return (
    <View className="absolute bottom-0 flex flex-row justify-between px-4 py-3 bg-blue-950 w-full text-white">
      <NavItem icon="home" label="Beranda" />
      <NavItem icon="calendar-alt" label="Jadwal" />
      <NavItem icon="user" label="Profil" />
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
