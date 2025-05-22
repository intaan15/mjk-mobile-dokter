import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import Background from "../../components/background";
import { images } from "@/constants/images";
import TabButton from "../../components/tabbutton";
import DatePickerComponent from "@/components/picker/datepicker";
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "@env";

const { width } = Dimensions.get("window");

interface User {
  nama_dokter: string;
}

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
    date: "23/04/25",
  },
  {
    id: 12,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "22/04/25",
  },
  {
    id: 13,
    user: "Budi",
    message: "Saya merasa lebih baik sekarang.",
    date: "21/04/25",
  },
];

export default function HomeScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Berlangsung");
  const [selectedDate, setSelectedDate] = useState(moment().format("DD/MM/YY"));
  const filteredChats = chats.filter((chat) => chat.date === selectedDate);

  const fetchUserData = async () => {
    try {
      const dokterId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");
      const cleanedId = dokterId?.replace(/"/g, "");
      const response = await axios.get(
        `${BASE_URL}/dokter/getbyid/${cleanedId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
    } 
    catch (error: any) {
      // router.push("/screens/signin")
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <View className="relative pt-12 flex flex-col gap-4 px-6">
          <View className="flex items-center justify-between flex-row">
            <Text className="text-skyDark text-2xl font-bold">
              Hi, {userData ? userData.nama_dokter : "Loading..."}
            </Text>
            <Image
              className="h-10 w-12"
              source={images.logo}
              resizeMode="contain"
            />
          </View>
          <View className="flex flex-col w-full gap-1">
            <DatePickerComponent
              label="Tanggal Terpilih"
              onDateChange={(date) => {
                const formattedDate = moment(date).format("DD/MM/YY");
                setSelectedDate(formattedDate);
              }}
            />
            <View className="w-full h-[2px] bg-skyDark" />
          </View>

          <View className="flex flex-row rounded-xl border-2 border-skyDark overflow-hidden">
            {["Berlangsung", "Selesai"].map((tab) => (
              <TabButton
                key={tab}
                label={tab}
                isActive={selectedTab === tab}
                onPress={() => setSelectedTab(tab)}
              />
            ))}
          </View>
        </View>

        {/* Chat List */}
        <View className="flex-1">
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {filteredChats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                className="flex flex-col"
                onPress={() => router.push("/chat/[id]")}
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={images.foto}
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
                <View className="w-full h-[2px] bg-skyDark my-2" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}
