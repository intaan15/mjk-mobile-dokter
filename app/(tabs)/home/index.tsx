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
import Navbar from "../../components/navbar";
import Background from "../../components/background";

const { width } = Dimensions.get("window");

const chats = [
  {
    id: 1,
    user: "Zuditanit",
    message: "Selamat pagi dokter",
    date: "17/03/25",
  },
  {
    id: 2,
    user: "Fahri",
    message: "Bagaimana hasil tes kemarin?",
    date: "17/03/25",
  },
  {
    id: 3,
    user: "Aisyah",
    message: "Terima kasih dokter atas bantuannya.",
    date: "17/03/25",
  },
  {
    id: 4,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 5,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 6,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 7,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 8,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 9,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 10,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 11,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 12,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
  {
    id: 13,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "17/03/25",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Background>
      <View className="flex-1">
        {/* <Navbar /> */}

        {/* Header */}
        <View className="relative pt-12 bg-skyLight rounded-b-[50px] py-28">
          <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
            <Text className="text-skyDark text-2xl font-bold">
              Selamat datang, {"\n"}dr Rayhan Izzuddin
            </Text>
            <Image
              className="h-10 w-12"
              source={require("../../../assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Chat List */}
        <View className="flex-1">
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 80 }} // Menambah padding bawah agar tidak tertutup navbar
          >
            {chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                className="flex flex-col"
                onPress={() => router.push("./chat")}
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={require("../../../assets/images/foto.jpeg")}
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
                  source={require("../../../assets/images/Line.png")}
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
