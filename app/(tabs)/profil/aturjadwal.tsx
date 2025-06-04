import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Button,
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

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [modalType, setModalType] = useState("info");
  const [isModalVisible, setModalVisible] = useState(false);
  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;
  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const router = useRouter();

  const handleTimeSlotsChange = (slots) => {
    if (slots.length >= 2) {
      const startTime = parseFloat(slots[0].replace(".", ""));
      const endTime = parseFloat(slots[slots.length - 1].replace(".", ""));

      if (startTime > endTime) {
        alert("Jam akhir tidak boleh lebih awal dari jam mulai");
        return;
      }
    }

    setTimeSlots(slots);
    setModalVisible(false);
  };

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized.toISOString().split("T")[0];
  };

  const handleSubmitAturJadwal = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Harap pilih tanggal dan jam praktek.");
      return;
    }

    if (timeSlots.length >= 2) {
      const startTime = parseFloat(timeSlots[0].replace(".", ""));
      const endTime = parseFloat(
        timeSlots[timeSlots.length - 1].replace(".", "")
      );

      if (startTime > endTime) {
        alert("Jam akhir tidak boleh lebih awal dari jam mulai");
        return;
      }
    }

    const token = await SecureStore.getItemAsync("userToken");
    const dokterId = await SecureStore.getItemAsync("userId");
    const jamMulai = timeSlots[0].replace(".", ":");
    const jamSelesai = timeSlots[timeSlots.length - 1].replace(".", ":");

    try {
      const cekRes = await axios.get(`${BASE_URL}/dokter/jadwal/${dokterId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const selectedDateStr = normalizeDate(selectedDate);

      const isSameDateExist = cekRes.data.some((jadwal) => {
        const jadwalDateStr = normalizeDate(jadwal.tanggal);
        return jadwalDateStr === selectedDateStr;
      });

      if (isSameDateExist) {
        alert("Jadwal pada tanggal ini sudah ada. Silahkan ubah jadwal anda pada menu ubah jadwal");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/dokter/jadwal/add/${dokterId}`,
        {
          tanggal: selectedDate,
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

      if (response.status === 201) {
        alert("Jadwal berhasil ditambahkan.");
        router.replace("/(tabs)/profil");
      } else {
        alert(`Gagal menambahkan jadwal: ${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat menyimpan jadwal.");
    }
  };

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/profil")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Atur Jadwal
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
            <Text className="text-skyDark text-lg">Atur Jam Praktek</Text>
          </TouchableOpacity>

          {/* Menampilkan Waktu yang Disimpan */}
          {timeSlots.length > 0 && (
            <View className="mt-6 w-full flex items-center">
              <Text className="text-skyDark font-bold mb-2">Jam Terpilih:</Text>
              <View className="mt-2 flex flex-wrap flex-row gap-2 justify-center">
                {timeSlots.map((time, index) => (
                  <View
                    key={index}
                    className="bg-transparent border-2 border-skyDark rounded-lg p-2 min-w-[80px] flex justify-center items-center"
                  >
                    <Text className="text-lg font-semibold text-skyDark">
                      {time}
                    </Text>
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
                onPress={() => openModal("aturjadwaldefault")}
              >
                <Text className="text-white font-bold px-5">Atur Default</Text>
              </TouchableOpacity>
            </View>
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
          onConfirm={handleSubmitAturJadwal}
          onTimeSlotsChange={handleTimeSlotsChange}
          selectedDate={selectedDate}
        />
      </ModalTemplate>
    </Background>
  );
};

export default App;
