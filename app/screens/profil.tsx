import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Navbar from "../components/navbar";
import Background from "../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const chats = [
  {
    id: 1,
    user: "Rayhanita",
    message: "Selamat pagi dokter",
    date: "17/03/25",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Background>
      <View className="flex-1">
        <Navbar />

        {/* Header */}
        <View className="relative pt-12 bg-skyLight rounded-b-[50px] py-28">
                  <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
                    <Text className="text-skyDark text-2xl font-bold">
                      Selamat datang, {"\n"}dr Rayhan Izzuddin
                    </Text>
                    <Image
                      className="h-10 w-12"
                      source={require("../../assets/images/logo.png")}
                      resizeMode="contain"
                    />
                  </View>
                </View>

        {/* menu */}
        {/* <View className="flex flex-row justify-between  mx-6 rounded-xl border-2">
          <TouchableOpacity className="flex-1 items-center h-full border-r-2 border-black">
            <Text className=" py-4">Menunggu</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center h-full border-r-2 border-black">
            <Text className=" py-4">Diterima</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center h-full">
            <Text className=" py-4">Ditolak</Text>
          </TouchableOpacity>
        </View> */}

        {/* Chat List */}
        <View className="flex-1">
          <ScrollView className="px-6 py-4">
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                className="flex flex-col"
                onPress={() => router.push("./chat")}
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={require("../../assets/images/foto.jpg")}
                    className="h-16 w-16 rounded-full border border-gray-300"
                    resizeMode="cover"
                  />
                  <View className="ml-4 flex-1">
                    <View className="flex flex-row justify-between">
                      <Text className="font-semibold text-lg">{chat.user}</Text>
                      <Text className="text-gray-500 text-sm">{chat.date}</Text>
                    </View>
                    <Text className="text-gray-700 mt-1">{chat.message}</Text>
                  </View>
                </View>
                <Image
                  source={require("../../assets/images/Line.png")}
                  className="w-full my-2"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}
