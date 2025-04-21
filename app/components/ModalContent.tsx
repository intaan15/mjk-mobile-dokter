import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ModalContentProps {
  modalType: string;
  onTimeSlotsChange?: (slots: string[]) => void;
  onClose?: () => void;
  onPickImage?: () => void;
  onOpenCamera?: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalType,
  onTimeSlotsChange,
  onClose,
  onPickImage,
  onOpenCamera,
}) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [isPickingStartTime, setIsPickingStartTime] = useState(true);

  const formatTime = (date: Date | null): string => {
    return date
      ? date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
  };

  const generateTimeSlots = (): string[] => {
    if (!startTime || !endTime) return [];

    const slots: string[] = [];
    const currentTime = new Date(startTime);
    const end = new Date(endTime);

    if (end < currentTime) {
      end.setDate(end.getDate() + 1);
    }

    while (currentTime <= end) {
      slots.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return slots;
  };

  switch (modalType) {
    case "konfirm":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-gray-700">
            Jadwal anda berhasil diubah
          </Text>

          <View className="w-full h-1 bg-skyDark my-5" />

          <Text className=" text-center text-skyDark font-medium">Oke</Text>
        </View>
      );

    case "jadwaldefault":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-gray-700">
            Jadwal anda akan diatur secara default
          </Text>

          <View className="flex flex-row justify-between items-center mt-5 px-20">
            <TouchableOpacity>
              <Text className=" text-center text-skyDark font-medium">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity>
              <Text className=" text-center text-red-500 font-medium">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "hapusakun":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-gray-700">
            Anda yakin akan menghapus akun?
          </Text>

          <View className="flex flex-row justify-between items-center mt-5 px-20">
            <TouchableOpacity>
              <Text className=" text-center text-skyDark font-medium">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity>
              <Text className=" text-center text-red-500 font-medium">
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "keluarakun":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-gray-700">
            Anda yakin akan keluar?
          </Text>

          <View className="flex flex-row justify-between items-center mt-5 px-20">
            <TouchableOpacity>
              <Text className=" text-center text-skyDark font-medium">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity>
              <Text className=" text-center text-red-500 font-medium">
                Keluar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    case "pilihgambar":
      return (
        <View className="bg-white p-6 rounded-2xl w-full items-center">
          <Text className="text-xl font-semibold mb-4 text-center">
            Pilih Foto
          </Text>

          <TouchableOpacity
            className="flex-row items-center space-x-3 py-3 px-2 rounded-lg active:bg-gray-100 w-full"
            onPress={onPickImage}
          >
            <MaterialCommunityIcons name="image" size={24} color="black" />
            <Text className="text-base text-black">Ambil dari Galeri</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center space-x-3 py-3 px-2 rounded-lg active:bg-gray-100 w-full"
            onPress={onOpenCamera}
          >
            <MaterialCommunityIcons name="camera" size={24} color="black" />
            <Text className="text-base text-black">Ambil dari Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 py-3 bg-red-500 rounded-xl w-full"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold text-base">
              Batal
            </Text>
          </TouchableOpacity>
        </View>
      );

    case "pilihjam":
      return (
        <View className="w-full px-5 py-6 bg-white rounded-2xl relative items-center">
          <TouchableOpacity
            className="absolute top-2 right-2 p-2"
            onPress={onClose}
          >
            <MaterialIcons name="close" size={20} color="#025F96" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-800 mb-6">
            Pilih Rentang Waktu
          </Text>

          <View className="flex-row items-center justify-center mb-6">
            <TouchableOpacity
              className="px-4 py-2 border border-gray-400 rounded-lg mr-4"
              onPress={() => {
                setIsPickingStartTime(true);
                setPickerVisibility(true);
              }}
            >
              <Text className="text-base">⏰ {formatTime(startTime)}</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-600"> - </Text>
            <TouchableOpacity
              className="px-4 py-2 border border-gray-400 rounded-lg ml-4"
              onPress={() => {
                setIsPickingStartTime(false);
                setPickerVisibility(true);
              }}
            >
              <Text className="text-base">⏰ {formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`px-6 py-3 rounded-xl ${
              startTime && endTime ? "bg-skyDark" : "bg-gray-400"
            }`}
            disabled={!startTime || !endTime}
            onPress={() => {
              const slots = generateTimeSlots();
              if (slots.length > 0 && onTimeSlotsChange) {
                onTimeSlotsChange(slots);
              }
            }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Simpan
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="time"
            is24Hour
            onConfirm={(time: Date) => {
              if (isPickingStartTime) {
                setStartTime(time);
              } else {
                setEndTime(time);
              }
              setPickerVisibility(false);
            }}
            onCancel={() => setPickerVisibility(false)}
          />
        </View>
      );

    default:
      return <Text>Modal tidak ditemukan.</Text>;
  }
};

export default ModalContent;
