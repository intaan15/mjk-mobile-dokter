import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/date";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Modal1 } from "@/components/modal1";
import { Modal3 } from "@/components/modal3";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TimeRangePicker from "@/components/time";

const App = () => {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const router = useRouter();

  const handleTimeSlotsChange = (slots) => {
    setTimeSlots(slots);
    setIsModal3Open(false); // Close modal automatically after receiving time slots
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
          <Text className="text-skyDark font-bold text-xl ml-2">Zuditanit</Text>
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
          <Image source={images.line} className="w-full my-2" />

          {/* Jam */}
          <TouchableOpacity
            className="w-full flex flex-row items-center gap-4"
            onPress={() => setIsModal3Open(true)}
          >
            <MaterialCommunityIcons
              name="clock-edit-outline"
              size={24}
              color="#025F96"
            />
            <Text className="text-skyDark text-lg">Ubah Jam Praktek</Text>
          </TouchableOpacity>

          {/* Modal Pilih Jam */}
          <Modal3 isOpen={isModal3Open} onClose={() => setIsModal3Open(false)}>
            <View className="bg-white p-5 rounded-xl w-3/4 justify-center items-center">
              <TimeRangePicker
                onTimeSlotsChange={(slots) => {
                  setTimeSlots(slots);
                  setIsModal3Open(false);
                }}
                onClose={() => setIsModal3Open(false)}
              />
            </View>
          </Modal3>

          {/* Menampilkan Waktu yang Disimpan */}
          {timeSlots.length > 0 && (
            <View className="mt-6 w-full flex items-center">
              <Text className="text-skyDark font-bold mb-2">Jam Terpilih:</Text>
              <View className="mt-2 flex flex-wrap flex-row gap-2 justify-center">
                {timeSlots.map((time, index) => (
                  <View
                    key={index}
                    className="bg-white border border-skyDark rounded-xl p-2 min-w-[80px] flex justify-center items-center"
                  >
                    <Text className="text-lg font-semibold text-skyDark">
                      {time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tombol Simpan Perubahan */}
          {timeSlots.length > 0 && (
            <View className="flex-1 justify-center items-center mt-6">
              <TouchableOpacity
                onPress={() => setIsModal1Open(true)}
                className="bg-skyDark px-4 py-4 rounded-xl"
              >
                <Text className="text-white font-bold">Simpan Perubahan</Text>
              </TouchableOpacity>

              {/* Modal Konfirmasi */}
              <Modal1
                isOpen={isModal1Open}
                onClose={() => setIsModal1Open(false)}
              >
                <View className="bg-white p-5 rounded-xl w-3/4 justify-center items-center">
                  <Text className="text-skyDark font-bold mb-4">
                    Jadwal Anda Berhasil Diubah
                  </Text>
                  <Image source={images.line} className="w-full my-3" />
                  <TouchableOpacity
                    onPress={() => setIsModal1Open(false)}
                    className="bg-transparent px-4 py-2 rounded-md"
                  >
                    <Text className="text-skyDark font-bold">Oke</Text>
                  </TouchableOpacity>
                </View>
              </Modal1>
            </View>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

export default App;
