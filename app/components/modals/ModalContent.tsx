import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ImagePickerComponent, {
  useImage,
  ImageProvider,
} from "@/components/picker/imagepicker";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

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

  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;

  const router = useRouter();
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    onClose?.();
    router.replace("/screens/signin"); 
  };

  switch (modalType) {
    // UBAH JADWAL DOKTER
    case "konfirm":
      return (
        <View className="flex flex-col ">
          <Text className="text-center text-lg font-bold text-skyDark">
            Simpan perubahan jadwal?
          </Text>

          <View className="flex flex-row justify-between items-center px-20">
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-red-500 font-medium">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "jadwaldefault":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Jadwal anda akan diatur secara default
          </Text>

          <View className="flex flex-row justify-between items-center px-20">
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-red-500 font-medium">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "pilihjam":
      return (
        <View className="w-full px-5 py-6 bg-white rounded-2xl relative items-center">
          <TouchableOpacity
            className="absolute top-2 right-2 p-2"
            onPress={onClose}
          ></TouchableOpacity>

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

    // SETTINGS
    case "hapusakun":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Anda yakin akan menghapus akun?
          </Text>

          <View className="flex flex-row justify-between items-center px-20">
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity onPress={onClose}>
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
          <Text className="text-center text-lg font-bold text-skyDark">
            Anda yakin akan keluar?
          </Text>

          <View className="flex flex-row justify-between items-center px-20">
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity onPress={handleLogout}>
              <Text className=" text-center text-red-500 font-medium">
                Keluar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "hapusprofil":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Anda yakin akan menghapus foto profil?
          </Text>

          <View className="flex flex-row justify-between items-center px-20">
            <TouchableOpacity onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              onPress={() => {
                setImage?.(null);
                onClose?.();
              }}
            >
              <Text className=" text-center text-red-500 font-medium">
                Hapus
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
            className="mt-5 py-3 bg-skyDark rounded-xl w-full"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold text-base">
              Batal
            </Text>
          </TouchableOpacity>
        </View>
      );

    // SIGN IN
    case "limiter":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Terlalu banyak percobaan login. Coba lagi nanti.
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "galat":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Galat! Terjadi kesalahan yang tidak terduga
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "dokterkosong":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Harap masukkan username/STR dan password
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "gadaakun":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Akun tidak ditemukan
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "pwsalah":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Password salah
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    // RESET PASSWORD
    case "ubahberhasil":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Password berhasil diubah
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "pwlamasalah":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Password lama salah
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "pwtidakcocok":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Konfirmasi password tidak cocok
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    case "kolompwkosong":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Semua kolom harus diisi
          </Text>

          <View className="w-full h-[2px] bg-skyDark my-5" />

          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    // PROFIL
    case "editprofil":
      return (
        <View>
          {/* Ganti Password */}
          <Text className="font-bold text-2xl text-skyDark mt-4 text-center">
            Edit profil
          </Text>
          {/* <View className="w-full h-[2px] bg-skyDark" /> */}
          <View className="flex flex-col items-center px-5">
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Nama
            </Text>
            <TextInput
              placeholder="Nama"
              secureTextEntry
              // value={}
              // onChangeText={}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Username
            </Text>
            <TextInput
              placeholder="contoh123"
              secureTextEntry
              // value={}
              // onChangeText={}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Email
            </Text>
            <TextInput
              placeholder="contoh@gmail.com"
              secureTextEntry
              // value={}
              // onChangeText={}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Nomor telepon
            </Text>
            <TextInput
              placeholder="0821312312312"
              secureTextEntry
              // value={}
              // onChangeText={}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Spesialis
            </Text>
            <TextInput
              placeholder="Tulang"
              secureTextEntry
              // value={}
              // onChangeText={}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              className="p-2 rounded-xl w-2/4 mt-6 bg-skyDark"
              onPress={onClose}
            >
              <Text className="text-white text-center font-bold">Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    default:
      return <Text>Modal tidak ditemukan.</Text>;
  }
};

export default ModalContent;
