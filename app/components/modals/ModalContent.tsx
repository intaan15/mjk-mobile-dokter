import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { BASE_URL } from "@env";

interface ModalContentProps {
  modalType: string;
  onTimeSlotsChange?: (slots: string[]) => void;
  onClose?: () => void;
  onPickImage?: () => void;
  onOpenCamera?: () => void;
  onUpdateSuccess?: () => void;
  onConfirm?: () => void;
  selectedDate?: Date;
}

interface User {
  nama_dokter: string;
  username_dokter: string;
  email_dokter: string;
  spesialis_dokter: string;
  str_dokter: string;
  notlp_dokter: string;
  rating_dokter: string;
  foto_profil_dokter: string | null;
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalType,
  onTimeSlotsChange,
  onClose,
  onPickImage,
  onOpenCamera,
  onUpdateSuccess,
  onConfirm,
  selectedDate,
}) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [isPickingStartTime, setIsPickingStartTime] = useState(true);

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [spesialis, setSpesialis] = useState("");

  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (userData) {
      setNama(userData.nama_dokter || "");
      setUsername(userData.username_dokter || "");
      setEmail(userData.email_dokter || "");
      setNoTlp(userData.notlp_dokter || "");
      setSpesialis(userData.spesialis_dokter || "");
    }
  }, [userData]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const dokterId = await SecureStore.getItemAsync("userId");
        const cleanedId = dokterId?.replace(/"/g, "");
        const token = await SecureStore.getItemAsync("userToken");
        console.log("Dokter ID:", cleanedId);
        console.log("token:", token);
        // if (!cleanedId || !token) {
        //   alert("Token atau user ID tidak ditemukan.");
        //   return;
        // }
        const response = await axios.get(
          `${BASE_URL}/dokter/getbyid/${cleanedId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response data:", response.data);
        setUserData(response.data);
      } catch (error: any) {
        console.log("Gagal mengambil data profil dari modal:", error);
        // alert(error.response?.data?.message || "Gagal mengambil data user");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    try {
      const dokterId = await SecureStore.getItemAsync("userId");
      const cleanedDokterId = dokterId?.replace(/"/g, "");
      const token = await SecureStore.getItemAsync("userToken");

      const response = await axios.patch(
        `${BASE_URL}/dokter/update/${cleanedDokterId}`,
        {
          nama_dokter: nama,
          username_dokter: username,
          email_dokter: email,
          notlp_dokter: noTlp,
          spesialis_dokter: spesialis,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // alert("Data berhasil diperbarui!");
      onUpdateSuccess?.();
    } catch (error: any) {
      if (error.response) {
        console.log("Gagal update:", error.response.data);
        alert(error.response.data.message || "Gagal update data.");
      } else {
        console.log("Gagal update:", error.message);
        alert("Gagal terhubung ke server.");
      }
    }
  };

  const formatTime = (date: Date | null): string => {
    return date
      ? date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const generateTimeSlots = (): string[] => {
    if (!startTime || !endTime) return [];

    const slots: string[] = [];
    const currentTime = new Date(startTime);
    const end = new Date(endTime);

    if (end < currentTime) {
      end.setDate(end.getDate() + 1);
    }

    while (currentTime < end) {
      slots.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;

  const router = useRouter();
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userId");
    onClose?.();
    router.replace("/screens/signin");
  };

  // upload image
  const uploadImageToServer = async () => {
    if (!profileImage?.uri) {
      alert("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    const uri = profileImage.uri;
    const fileName = uri.split("/").pop();
    const fileType = fileName?.split(".").pop();
    const userId = await SecureStore.getItemAsync("userId");
    const cleanedUserId = userId?.replace(/"/g, "");

    if (!cleanedUserId) {
      alert("User ID tidak ditemukan.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    } as any);
    formData.append("id", cleanedUserId);

    try {
      const response = await axios.post(
        // "http://192.168.18.109:3330/api/dokter/upload",
        "http://10.52.170.231:3330/api/dokter/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload berhasil:", response.data);
      alert("Foto berhasil diunggah!");
    } catch (error: any) {
      console.log("Upload gagal:", error.message);
      alert("Gagal upload gambar");
    }
  };

  const handleUpload = async () => {
    await uploadImageToServer();
    onClose?.();
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");

      if (!userId || !token) {
        alert("Token atau user ID tidak ditemukan.");
        return;
      }

      const response = await axios.delete(
        `${BASE_URL}/dokter/delete/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userId");
        onClose?.();
        alert("akun anda berhasil dihapus");
        router.replace("/screens/signin");
      } else {
        alert("Terjadi kesalahan saat menghapus akun.");
      }
    } catch (error) {
      console.log("Error deleting account:", error);
      alert("Terjadi kesalahan server.");
    }
  };

  const handleUbahDefault = async () => {
    if (!selectedDate) return;

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");
      const tanggal = selectedDate.toISOString();

      const response = await axios.patch(
        `${BASE_URL}/dokter/${dokterId}/jadwal/update`,
        {
          tanggal,
          jam_mulai: "08:00",
          jam_selesai: "15:30",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("YEAYYY JADWAL DIUBAH DEFOLT");
        onClose?.();
        router.push("/(tabs)/profil");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("YEAYYY JADWAL TIDAK ADA SILAHKAN ATUR DULU");
        onClose?.();
        router.push("/(tabs)/profil/aturjadwal");
      } else {
        console.log("Gagal mengatur jadwal default:", error);
      }
    }
  };

  const handleAturDefault = async () => {
    if (!selectedDate) return;

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");
      const cekRes = await axios.get(`${BASE_URL}/dokter/jadwal/${dokterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tanggalDipilih = formatDate(new Date(selectedDate));

      const sudahAda = cekRes.data.some((item: any) => {
        const tanggalDB = formatDate(new Date(item.tanggal));
        return tanggalDB === tanggalDipilih;
      });

      if (sudahAda) {
        onClose?.();
        alert("Jadwal pada tanggal ini sudah ada. Tidak bisa atur default.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/dokter/jadwal/add/${dokterId}`,
        {
          tanggal: selectedDate,
          jam_mulai: "08:00",
          jam_selesai: "15:30",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("YEAYYY JADWAL DIATUR DEFOLT");
        onClose?.();
        router.push("/(tabs)/profil");
      } else {
        alert("Gagal mengatur jadwal default: " + response.data.message);
      }
    } catch (error: any) {
      console.log("Gagal mengatur jadwal default:", error);
      alert("Terjadi kesalahan saat menyimpan jadwal default.");
    }
  };

  const handleDeleteJadwal = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");

      if (!selectedDate || !token || !dokterId) {
        alert("Data tidak lengkap");
        return;
      }
      const tanggalHapus = new Date(selectedDate);
      tanggalHapus.setUTCHours(0, 0, 0, 0);
      const response = await axios.delete(
        `${BASE_URL}/dokter/jadwal/hapus/${dokterId}`,
        {
          data: {
            tanggal: tanggalHapus.toISOString(),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("YEAYY JADWAL DIHAPUS WAKTUNYA LIBUR");
        onClose?.();
        router.replace("/(tabs)/profil");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        onClose?.();
        alert("Tidak ada jadwal pada tanggal ini untuk dihapus.");
      }
    }
  };

  switch (modalType) {
    case "pilihgambar":
      return (
        <View className="bg-white p-6 rounded-2xl w-full items-center">
          <Text className="text-xl font-semibold mb-4 text-center text-skyDark">
            Pilih Foto
          </Text>

          <TouchableOpacity
            className="flex-row items-center space-x-3 py-3 px-2 rounded-lg active:bg-gray-100 w-full"
            onPress={onPickImage}
          >
            <MaterialCommunityIcons name="image" size={24} color="#025F96" />
            <Text className="text-base text-skyDark"> Ambil dari Galeri</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center space-x-3 py-3 px-2 rounded-lg active:bg-gray-100 w-full"
            onPress={onOpenCamera}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#025F96" />
            <Text className="text-base text-skyDark"> Ambil dari Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 py-3 bg-green-700 rounded-xl w-full"
            onPress={uploadImageToServer}
          >
            <Text
              className="text-center text-white font-semibold text-base"
              onPress={handleUpload}
            >
              Unggah Foto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-3 py-3 bg-skyDark rounded-xl w-full"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold text-base">
              Batal
            </Text>
          </TouchableOpacity>
        </View>
      );

    // PROFIL
    case "editprofil":
      return (
        <View>
          {/* Ganti Password */}
          <Text className="font-bold text-2xl text-skyDark mt-4 text-center">
            Ubah profil
          </Text>
          <View className="flex flex-col items-center px-5">
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Nama
            </Text>
            <TextInput
              placeholder="Nama"
              value={nama}
              onChangeText={setNama}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Nama Pengguna
            </Text>
            <TextInput
              placeholder="contoh123"
              value={username}
              onChangeText={setUsername}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Email
            </Text>
            <TextInput
              placeholder="contoh@gmail.com"
              value={email}
              onChangeText={setEmail}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Nomor telepon
            </Text>
            <TextInput
              placeholder="0821312312312"
              value={noTlp}
              onChangeText={setNoTlp}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
              Spesialis
            </Text>
            <TextInput
              placeholder="Tulang"
              value={spesialis}
              onChangeText={setSpesialis}
              className="border-2 rounded-xl border-gray-400 p-2 w-full"
              placeholderTextColor="#888"
            />
            <View className="flex-row gap-12">
              <TouchableOpacity
                className="w-2/5 h-10 justify-center rounded-xl mt-6 mb-3 bg-red-700"
                onPress={onClose}
              >
                <Text className="text-white text-center font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-2/5 h-10 justify-center rounded-xl mt-6 mb-3 bg-skyDark"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center font-bold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );

    // UBAH JADWAL DOKTER
    case "konfirm":
      return (
        <View className="flex flex-col ">
          <Text className="text-center text-lg font-bold text-skyDark">
            Simpan perubahan jadwal?
          </Text>

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-red-500 font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
              onPress={() => {
                if (onConfirm) onConfirm();
                if (onClose) onClose();
              }}
            >
              <Text className=" text-center text-skyDark font-medium">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "aturjadwaldefault":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Jadwal anda akan diatur secara default
          </Text>

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-red-500 font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
              onPress={handleAturDefault}
            >
              <Text className=" text-center text-skyDark font-medium">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    case "ubahjadwaldefault":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Jadwal anda akan diubah secara default
          </Text>

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-red-500 font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
              onPress={handleUbahDefault}
            >
              <Text className=" text-center text-skyDark font-medium">Oke</Text>
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

          <Text className="text-lg font-semibold text-skyDark mb-6">
            Pilih Rentang Waktu
          </Text>

          <View className="flex-row items-center justify-center mb-6">
            <TouchableOpacity
              className="px-5 py-3 border border-gray-400 rounded-lg mr-4"
              onPress={() => {
                setIsPickingStartTime(true);
                setPickerVisibility(true);
              }}
            >
              <Text className="text-base text-skyDark">
                <FontAwesome5 name="clock" size={19} color="#025F96" />{" "}
                {formatTime(startTime)}
              </Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-skyDark"> s.d.</Text>
            <TouchableOpacity
              className="px-5 py-3 border border-gray-400 rounded-lg ml-4"
              onPress={() => {
                setIsPickingStartTime(false);
                setPickerVisibility(true);
              }}
            >
              <Text className="text-base text-skyDark">
                <FontAwesome5 name="clock" size={19} color="#025F96" />{" "}
                {formatTime(endTime)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`px-10 py-3 rounded-lg ${
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
            <Text className="text-white text-base font-semibold text-center">
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

    case "hapusjadwal":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Anda yakin akan menghapus jadwal pada hari{" "}
            {selectedDate?.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            ?
          </Text>

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className="text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
              onPress={handleDeleteJadwal}
            >
              <Text className="text-center text-red-500 font-medium">
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    // SETTINGS
    case "hapusakun":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Anda yakin akan menghapus akun?
          </Text>

          <View className="flex flex-row justify-between items-center 10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
              onPress={handleDeleteAccount}
            >
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

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity className="px-10 py-3" onPress={handleLogout}>
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

          <View className="flex flex-row justify-between items-center px-10">
            <TouchableOpacity className="px-10 py-3" onPress={onClose}>
              <Text className=" text-center text-skyDark font-medium w-full">
                Batal
              </Text>
            </TouchableOpacity>
            <View className="w-[2px] h-10 text-center bg-skyDark my-5" />
            <TouchableOpacity
              className="px-10 py-3"
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

    // SIGN IN
    case "limiter":
      return (
        <View>
          <Text className="text-center text-lg font-bold text-skyDark">
            Terlalu banyak percobaan masuk. Coba lagi nanti.
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
            Harap masukkan Nama Pengguna/STR dan Kata Sandi
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
            Kata Sandi salah
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
            Kata Sandi berhasil diubah
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
            Kata Sandi lama salah
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
            Konfirmasi Kata Sandi tidak cocok
          </Text>
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
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
          <View className="w-full h-[2px] bg-skyDark mt-5 mb-3" />
          <TouchableOpacity
            className=" text-center text-skyDark font-medium w-full py-2"
            onPress={onClose}
          >
            <Text className="text-center text-skyDark">Oke</Text>
          </TouchableOpacity>
        </View>
      );

    default:
      return <Text>Modal tidak ditemukan.</Text>;
  }
};

export default ModalContent;
