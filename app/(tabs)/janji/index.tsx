import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import Background from "../../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TabButton from "../../components/tabbutton";
import { images } from "@/constants/images";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "@env";

const { width } = Dimensions.get("window");

type Jadwal = {
  _id: string;
  dokter_id: {
    _id: string;
    nama_dokter: string;
    spesialis_dokter: string;
    rating_dokter: number;
  };
  masyarakat_id: {
    nama_masyarakat: string;
    foto_profil_masyarakat?: string;
  };
  tgl_konsul: string;
  jam_konsul: string;
  keluhan_pasien: string;
  status_konsul: "menunggu" | "diterima" | "ditolak";
};

const formatTanggalIndo = (isoDate: string) => {
  const hariIndo = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const tanggal = new Date(isoDate);
  const hari = hariIndo[tanggal.getDay()];
  const tanggalNum = tanggal.getDate();
  const bulan = bulanIndo[tanggal.getMonth()];
  const tahun = tanggal.getFullYear();

  return `${hari}, ${tanggalNum} ${bulan} ${tahun}`;
};

export default function JadwalScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("menunggu");
  const [jadwals, setJadwal] = useState<Jadwal[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchJadwal = async () => {
        try {
          const userId = await SecureStore.getItemAsync("userId");
          const token = await SecureStore.getItemAsync("userToken");

          const response = await axios.get(
            `${BASE_URL}/jadwal/getall`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (userId) {
            const filtered = response.data.filter(
              (jadwal: Jadwal) => jadwal.dokter_id?._id === userId
            );
            setJadwal(filtered);
          }
        } catch (err) {
          console.error("Error fetching jadwals:", err);
        }
      };

      fetchJadwal();
    }, [])
  );

  const updateJadwalStatus = async (
    id: string,
    newStatus: Jadwal["status_konsul"]
  ) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      await axios.patch(
        `${BASE_URL}/jadwal/update/status/${id}`,
        {
          status_konsul: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setJadwal((prev) =>
        prev.map((jadwal) =>
          jadwal._id === id ? { ...jadwal, status_konsul: newStatus } : jadwal
        )
      );
    } catch (err) {
      Alert.alert("Gagal", "Gagal memperbarui status");
      console.error("Error updating status:", err);
    }
  };  

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-4 w-full px-5 pt-10">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.replace("./homescreen")}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text className="text-skyDark font-bold text-xl ml-2">Janji</Text>
          </View>
          <Image
            className="h-10 w-12"
            source={images.logo}
            resizeMode="contain"
          />
        </View>

        {/* Menu Tab */}
        <View className="flex flex-row mx-6 rounded-xl border-2 border-skyDark overflow-hidden mb-5">
          {["menunggu", "diterima", "ditolak"].map((tab) => (
            <TabButton
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              isActive={selectedTab === tab}
              onPress={() => setSelectedTab(tab)}
            />
          ))}
        </View>

        {/* Jadwal List */}
        <View className="flex-1">
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingTop: 1, paddingBottom: 100 }}
          >
            {jadwals
              .filter((jadwal) => jadwal.status_konsul === selectedTab)
              .map((jadwal) => (
                <View
                  key={jadwal._id}
                  className="flex flex-col mb-4 bg-white p-2 rounded-xl shadow-black"
                  style={{
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    elevation: 15,
                  }}
                >
                  <View className="flex flex-row items-center px-3 pt-2">
                    {jadwal.masyarakat_id?.foto_profil_masyarakat &&
                    jadwal.masyarakat_id?.nama_masyarakat ? (
                      <Image
                        source={{
                          uri: `https://mjk-backend-production.up.railway.app/uploads/${jadwal.masyarakat_id.foto_profil_masyarakat}`,
                        }}
                        className="h-20 w-20 rounded-full border border-gray-300"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-20 w-20 rounded-full border border-gray-300 items-center justify-center bg-gray-200">
                        <Ionicons name="person" size={40} color="#0C4A6E" />
                      </View>
                    )}
                    <View className="ml-4 flex-1">
                      <Text className="font-bold text-lg text-skyDark pb-1">
                        {jadwal?.masyarakat_id?.nama_masyarakat ?? "Pasien"}
                      </Text>
                      <View className="w-full h-[2px] bg-skyDark " />
                      <Text className="font-semibold text-base text-skyDark">
                        {formatTanggalIndo(jadwal.tgl_konsul)}
                      </Text>
                      <Text className="font-semibold text-base text-skyDark">
                        Pukul {jadwal.jam_konsul}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-skyDark py-4 px-4 text-justify">
                    {jadwal.keluhan_pasien}
                  </Text>

                  {selectedTab === "menunggu" && (
                    <View className="flex flex-row justify-between px-10 mt-2 mb-4 items-center">
                      <TouchableOpacity
                        className="bg-red-700 w-2/5 rounded-lg px-4 py-2 flex flex-row items-center justify-center gap-2"
                        onPress={() =>
                          updateJadwalStatus(jadwal._id, "ditolak")
                        }
                      >
                        <AntDesign
                          name="closecircleo"
                          size={20}
                          color="white"
                        />
                        <Text className="text-white font-bold">Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-green-600 w-2/5 rounded-lg px-4 py-2 flex flex-row items-center justify-center gap-2"
                        onPress={() =>
                          updateJadwalStatus(jadwal._id, "diterima")
                        }
                      >
                        <AntDesign
                          name="checkcircleo"
                          size={20}
                          color="white"
                        />
                        <Text className="text-white font-bold">Terima</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}
