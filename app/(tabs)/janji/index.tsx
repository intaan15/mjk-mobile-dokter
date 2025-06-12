import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl, // Import RefreshControl
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

const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  const baseUrlWithoutApi = BASE_URL.replace("/api", "");

  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseUrlWithoutApi}/${cleanPath}`;
};

export default function JadwalScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("menunggu");
  const [jadwals, setJadwal] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State untuk refresh

  // Fungsi fetch jadwal yang bisa dipanggil ulang
  const fetchJadwal = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");

      const response = await axios.get(`${BASE_URL}/jadwal/getall`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔍 DEBUG: Log raw response
      console.log(
        "📊 Raw API Response:",
        JSON.stringify(response.data, null, 2)
      );

      // 🔍 DEBUG: Check each jadwal data
      response.data.forEach((jadwal, index) => {
        console.log(`📋 Jadwal ${index}:`, {
          id: jadwal._id,
          masyarakat_id: jadwal.masyarakat_id,
          foto_profil: jadwal.masyarakat_id?.foto_profil_masyarakat,
          nama: jadwal.masyarakat_id?.nama_masyarakat,
        });
      });

      if (userId) {
        const filtered = response.data.filter(
          (jadwal) => jadwal.dokter_id?._id === userId
        );

        // 🔍 DEBUG: Log filtered data
        console.log("🎯 Filtered Jadwals:", filtered.length);
        filtered.forEach((jadwal, index) => {
          console.log(`✅ Filtered ${index}:`, {
            id: jadwal._id,
            foto_profil: jadwal.masyarakat_id?.foto_profil_masyarakat,
          });
        });

        setJadwal(filtered);
      }
    } catch (err) {
      console.log("❌ Error fetching jadwals:", err);
      console.log("❌ Error details:", err.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fungsi untuk handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJadwal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchJadwal();
    }, [])
  );

  const updateJadwalStatus = async (
    id: string,
    newStatus: Jadwal["status_konsul"]
  ) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Token:", token);

      // Ganti status jadwal langsung pakai PATCH
      const res = await axios.patch(
        `${BASE_URL}/jadwal/update/status/${id}`,
        { status_konsul: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status jadwal berhasil diperbarui:", res.data);

      // Update state lokal agar UI langsung merefleksikan perubahan
      setJadwal((prev) =>
        prev.map((jadwal) =>
          jadwal._id === id ? { ...jadwal, status_konsul: newStatus } : jadwal
        )
      );
    } catch (err: any) {
      console.log(
        "Error saat update status:",
        err.response?.data || err.message
      );
      Alert.alert(
        "Error",
        err.response?.data?.message || "Gagal memperbarui status"
      );
    }
  };

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-4 w-full px-5 pt-10">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
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
          {loading ? (
            <View className="flex h-3/4 justify-center items-center">
              <ActivityIndicator size="large" color="#025F96" />
              <Text className="mt-2 text-skyDark font-semibold">
                Memuat janji . . .
              </Text>
            </View>
          ) : (
            <ScrollView
              className="px-6 py-4"
              contentContainerStyle={{ paddingTop: 1, paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#025F96"]} // Warna spinner untuk Android
                  tintColor="#025F96" // Warna spinner untuk iOS
                  title="Memuat ulang..." // Text untuk iOS
                  titleColor="#025F96" // Warna text untuk iOS
                />
              }
            >
              {jadwals
                .sort(
                  (a, b) =>
                    new Date(b.tgl_konsul).getTime() -
                    new Date(a.tgl_konsul).getTime()
                )
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
                      {(() => {
                        const fotoUrl = getImageUrl(
                          jadwal.masyarakat_id?.foto_profil_masyarakat
                        );
                        console.log(
                          "Processing foto for:",
                          jadwal.masyarakat_id?.nama_masyarakat
                        );
                        console.log(
                          "Original foto path:",
                          jadwal.masyarakat_id?.foto_profil_masyarakat
                        );
                        console.log("Processed foto URL:", fotoUrl);

                        return fotoUrl ? (
                          <Image
                            source={{ uri: fotoUrl }}
                            className="h-20 w-20 rounded-full border border-gray-300"
                            resizeMode="cover"
                            onError={(error) => {
                              console.log(
                                "❌ Error loading image:",
                                error.nativeEvent.error
                              );
                              console.log("❌ Failed URL:", fotoUrl);
                            }}
                            onLoad={() => {
                              console.log(
                                "✅ Image loaded successfully:",
                                fotoUrl
                              );
                            }}
                          />
                        ) : (
                          <View className="h-20 w-20 rounded-full border border-gray-300 items-center justify-center bg-gray-200">
                            <Ionicons name="person" size={40} color="#0C4A6E" />
                          </View>
                        );
                      })()}
                      <View className="ml-4 flex-1">
                        <Text
                          className="truncate font-bold text-lg text-skyDark pb-1"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
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
          )}
        </View>
      </View>
    </Background>
  );
}
