import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/picker/datepicker";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalContent from "@/components/modals/ModalContent";
import ModalTemplate from "@/components/modals/ModalTemplate";
import ImagePickerComponent, {
  useImage,
} from "@/components/picker/imagepicker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { BASE_URL } from "@env";

type Jadwal = {
  tanggal: string;
  jam: { time: string; available: boolean }[];
};

type AvailableTime = {
  time: string;
  available: boolean;
};

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [modalType, setModalType] = useState("info");
  const [isModalVisible, setModalVisible] = useState(false);
  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const router = useRouter();

  const handleTimeSlotsChange = (slots) => {
    setTimeSlots(slots);
    setModalVisible(false);
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const id = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("userToken");
        if (!id) {
          console.log("User ID tidak ditemukan di SecureStore.");
          return;
        }
        const res = await axios.get(
          `${BASE_URL}/dokter/jadwal/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJadwal(res.data);

        const datesWithSchedule = res.data
          .filter((j) => j.jam && j.jam.length > 0)
          .map((j) => new Date(j.tanggal).toISOString().split("T")[0]);

        setAvailableDates(datesWithSchedule);
      } catch (err) {
        console.log("Error fetching jadwal:", err);
      }
    };

    fetchJadwal();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    const jadwalHariIni = jadwal.find((j) => {
      const jadwalDateStr = new Date(j.tanggal).toISOString().split("T")[0];
      return jadwalDateStr === selectedDateStr;
    });

    if (jadwalHariIni && Array.isArray(jadwalHariIni.jam)) {
      setAvailableTimes(jadwalHariIni.jam);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, jadwal]);

  const handleSubmitSchedule = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Harap pilih tanggal dan jam praktek.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");

      if (timeSlots.length === 1) {
        alert("Pilih minimal 2 slot waktu untuk jam mulai dan selesai");
        return;
      }

      const jamMulai = timeSlots[0].replace(".", ":") + ":00";
      const jamSelesai =
        timeSlots[timeSlots.length - 1].replace(".", ":") + ":00";
      const tanggal = new Date(selectedDate).toISOString();
      const response = await axios.patch(
        `${BASE_URL}/dokter/${dokterId}/jadwal/update`,
        {
          tanggal,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Jadwal berhasil diupdate!");
        router.replace("/(tabs)/profil");
      }
    } catch (error: any) {
        if (error.response.status === 404) {
          alert("YEAYYY JADWAL TIDAK ADA SILAHKAN ATUR DULU");
          router.push("/(tabs)/profil/aturjadwal");
        }
      
    }
  };

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("./homescreen")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Ubah Jadwal
          </Text>
        </View>
        <Image
          className="h-10 w-12"
          source={images.logo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <ScrollView
        className="px-6 py-4 mt-[-30px]"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Tanggal */}
        <View className="flex-1 flex-col p-2">
          <DatePickerComponent
            label="Tanggal Terpilih"
            onDateChange={(date) => setSelectedDate(date)}
          />
          <View className="w-full h-[2px] bg-skyDark my-2" />

          {/* Modal Pilih Jam */}
          <TouchableOpacity
            className="w-full flex flex-row items-center gap-4"
            onPress={() => openModal("pilihjam")}
          >
            <MaterialCommunityIcons
              name="clock-edit-outline"
              size={24}
              color="#025F96"
            />
            <Text className="text-skyDark text-lg">Ubah Jam Praktek</Text>
          </TouchableOpacity>

          {/* Menampilkan Jadwal */}
          {selectedDate && (
            <View className="mt-4">
              <Text className="font-bold text-skyDark mb-2">
                Jadwal hari{" "}
                {selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                :
              </Text>
              {availableTimes.length > 0 ? (
                <View className="flex flex-wrap flex-row gap-2 justify-center">
                  {availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-2 border-2 border-skyDark rounded-md min-w-[80px] text-center"
                    >
                      <Text className="text-lg text-skyDark text-center">
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic">
                  Tidak ada jadwal tersedia
                </Text>
              )}
            </View>
          )}

          {/* Menampilkan Waktu yang Disimpan */}
          {timeSlots.length > 0 && (
            <View className="mt-6 w-full flex items-center">
              <Text className="text-skyDark font-bold mb-2">Jam Terpilih:</Text>
              <View className="mt-2 flex flex-wrap flex-row gap-2 justify-center">
                {timeSlots.map((time, index) => (
                  <View
                    key={index}
                    className="bg-transparent border-2 border-skyDark rounded-md p-2 min-w-[80px] flex justify-center items-center"
                  >
                    <Text className="text-lg text-skyDark">{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="flex-row">
            {/* Modal Simpan Perubahan */}
            {timeSlots.length > 0 && (
              <View className="flex-1 justify-center items-center mt-6">
                <TouchableOpacity
                  className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                  onPress={() => openModal("konfirm")}
                >
                  <Text className="text-white font-bold">Simpan Perubahan</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Modal Set as Default */}
            <View className="flex-1 justify-center items-center mt-6">
              <TouchableOpacity
                className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                onPress={() => openModal("ubahjadwaldefault")}
              >
                <Text className="text-white font-bold px-5">Ubah Default</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal Hapus Jadwal */}
          <View className="flex-1 justify-center items-center mt-6">
            <TouchableOpacity
              className="bg-red-600 px-4 py-4 rounded-xl items-center w-44"
              onPress={() => openModal("hapusjadwal")}
            >
              <Text className="text-white font-bold px-5">Hapus Jadwal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Template */}
      <ModalTemplate
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent
          modalType={modalType}
          onPickImage={openGallery}
          onOpenCamera={openCamera}
          onClose={() => setModalVisible(false)}
          onConfirm={handleSubmitSchedule}
          onTimeSlotsChange={handleTimeSlotsChange}
          selectedDate={selectedDate}
        />
      </ModalTemplate>
    </Background>
  );
};

export default App;
