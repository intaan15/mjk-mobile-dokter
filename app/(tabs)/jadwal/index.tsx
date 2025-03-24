import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Navbar from "../../components/navbar";
import Background from "../../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TabButton from "../../components/tabbutton";

const { width } = Dimensions.get("window");

// Data Dummy dengan Status
const JadwalDummy = [
  {
    id: 1,
    user: "Zuditanit",
    message:
      "Selamat pagi dokter. Keluhan yang saya alami adalah nyeri di bagian dada sebelah kiri dan sesak di malam hari.",
    time: "13.00",
    date: "Kamis, 20 Maret 2025",
    status: "Menunggu",
  },
  {
    id: 2,
    user: "Zuditanit",
    message:
      "Selamat pagi dokter. Keluhan yang saya alami adalah nyeri di bagian dada sebelah kiri dan sesak di malam hari.",
    time: "13.00",
    date: "Kamis, 20 Maret 2025",
    status: "Menunggu",
  },
  {
    id: 3,
    user: "Zuditanit",
    message:
      "Selamat pagi dokter. Keluhan yang saya alami adalah nyeri di bagian dada sebelah kiri dan sesak di malam hari.",
    time: "13.00",
    date: "Kamis, 20 Maret 2025",
    status: "Menunggu",
  },
  {
    id: 4,
    user: "Zuditanit",
    message:
      "Selamat pagi dokter. Keluhan yang saya alami adalah nyeri di bagian dada sebelah kiri dan sesak di malam hari.",
    time: "13.00",
    date: "Kamis, 20 Maret 2025",
    status: "Menunggu",
  },
];

export default function JadwalScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Menunggu");
  const [Jadwals, setJadwal] = useState(JadwalDummy);

  const updateJadwalStatus = (id, newStatus) => {
    setJadwal((prevJadwal) =>
      prevJadwal.map((jadwal) =>
        jadwal.id === id ? { ...jadwal, status: newStatus } : jadwal
      )
    );
  };

  return (
    <Background>
      <View className="flex-1">
        {/* <Navbar /> */}

        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.replace("./homescreen")}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text className="text-skyDark font-bold text-xl ml-2">
              Zuditanit
            </Text>
          </View>
          <Image
            className="h-10 w-12"
            source={require("../../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Menu Tab */}
        <View className="flex flex-row mx-6 rounded-xl border-2 border-skyDark overflow-hidden">
          {["Menunggu", "Diterima", "Ditolak"].map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={selectedTab === tab}
              onPress={() => setSelectedTab(tab)}
            />
          ))}
        </View>

        {/* Jadwal List */}
        <View className="flex-1">
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {Jadwals.filter((jadwal) => jadwal.status === selectedTab).map(
              (jadwal) => (
                <View
                  key={jadwal.id}
                  className="flex flex-col mb-4 bg-Warm p-2 rounded-xl shadow-black"
                  style={{
                    shadowOffset: { width: 0, height: -20 },
                    shadowOpacity: 0.2,
                    shadowRadius: 11,
                    elevation: 15,
                  }}
                >
                  <View className="flex flex-row items-center">
                    <Image
                      source={require("../../../assets/images/foto.jpeg")}
                      className="h-24 w-24 rounded-full border border-gray-300"
                      resizeMode="cover"
                    />
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-skyDark">
                        {jadwal.user}
                      </Text>
                      <Image
                        source={require("../../../assets/images/Line.png")}
                        className="w-full my-2"
                      />
                      <Text className="font-semibold text-lg text-skyDark">
                        {jadwal.date}
                      </Text>
                      <Text className="font-semibold text-lg text-skyDark">
                        {jadwal.time}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-700 mt-1 px-4 text-justify">
                    {jadwal.message}
                  </Text>
                  {selectedTab === "Menunggu" && (
                    <View className="flex flex-row justify-between px-10 mt-2 mb-4 items-center">
                      <TouchableOpacity
                        className="bg-red-500 rounded-xl px-4 py-2 flex flex-row items-center justify-center gap-2"
                        onPress={() => updateJadwalStatus(jadwal.id, "Ditolak")}
                      >
                        <AntDesign
                          name="closecircleo"
                          size={20}
                          color="white"
                        />
                        <Text className=" text-white">Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-green-500 rounded-xl px-4 py-2 flex flex-row items-center justify-center gap-2"
                        onPress={() =>
                          updateJadwalStatus(jadwal.id, "Diterima")
                        }
                      >
                        <AntDesign
                          name="checkcircleo"
                          size={20}
                          color="white"
                        />
                        <Text className=" text-white">Terima</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}
