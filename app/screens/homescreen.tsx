import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import Navbar from "../components/navbar";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <Navbar />

      {/* Wrapper untuk Image */}
      <View className="relative">
        <Image
          source={require("../../assets/images/shape1.png")}
          style={{ width: width }} // Pastikan ada tinggi yang cukup
          resizeMode="cover" // Agar gambar tidak terdistorsi
        />

        {/* Teks di dalam gambar */}
        <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
          <Text className="text-blue-900 text-2xl font-bold">
            Selamat datang, {'\n'}dr Rayhan Izzuddin
          </Text>
          <Image
            className="h-10 w-12"
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"r
          ></Image>
        </View>
      </View>
    </View>
  );
}
