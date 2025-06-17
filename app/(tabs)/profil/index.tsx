import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Background from "../../components/background";
import React, { useEffect, useState, useCallback } from "react";
import { images } from "@/constants/images";
import Settings from "@/components/settings";
import { ImageProvider } from "@/components/picker/imagepicker";
import { Ionicons } from "@expo/vector-icons";
import ModalContent from "@/components/modals/ModalContent";
import ModalTemplate from "@/components/modals/ModalTemplate";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileViewModel } from "../../components/viewmodels/useProfil";

// Interface untuk props komponen PasswordValidationIndicator
interface PasswordValidationIndicatorProps {
  passwordValidation: {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
  showPasswordValidation: boolean;
}

// Komponen untuk indikator validasi password
const PasswordValidationIndicator: React.FC<
  PasswordValidationIndicatorProps
> = ({ passwordValidation, showPasswordValidation }) => {
  if (!showPasswordValidation) return null;

  const validationItems = [
    {
      key: "minLength",
      text: "Minimal 8 karakter",
      valid: passwordValidation.minLength,
    },
    {
      key: "hasLowercase",
      text: "Huruf kecil (a-z)",
      valid: passwordValidation.hasLowercase,
    },
    {
      key: "hasUppercase",
      text: "Huruf besar (A-Z)",
      valid: passwordValidation.hasUppercase,
    },
    {
      key: "hasNumber",
      text: "Angka (0-9)",
      valid: passwordValidation.hasNumber,
    },
    {
      key: "hasSymbol",
      text: "Simbol (@$!%*?&/#^()[]{})",
      valid: passwordValidation.hasSymbol,
    },
  ];

  return (
    <View className="w-full mt-2 p-3 bg-gray-50 rounded-lg">
      <Text className="text-sm font-semibold text-gray-600 mb-2">
        Syarat Password:
      </Text>
      {validationItems.map((item) => (
        <View key={item.key} className="flex-row items-center mb-1">
          <Ionicons
            name={item.valid ? "checkmark-circle" : "close-circle"}
            size={16}
            color={item.valid ? "#10B981" : "#EF4444"}
          />
          <Text
            className={`ml-2 text-sm ${
              item.valid ? "text-green-600" : "text-red-500"
            }`}
          >
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

function ProfileApp() {
  const {
    userData,
    passwordLama,
    passwordBaru,
    konfirmasiPassword,
    modalType,
    isModalVisible,
    refreshing,
    passwordValidation,
    showPasswordValidation,
    setPasswordLama,
    setPasswordBaru,
    setKonfirmasiPassword,
    setShowPasswordValidation,
    fetchUserData,
    onRefresh,
    handleGantiPassword,
    openModal,
    closeModal,
    handleUpdateSuccess,
    getImageUrl,
    formatTanggal,
  } = useProfileViewModel();

  const [imageLoadError, setImageLoadError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      setImageLoadError(false);
    }, [fetchUserData])
  );

  if (!userData) {
    return (
      <Background>
        <View className="flex h-full justify-center items-center">
          <ActivityIndicator size="large" color="#025F96" />
          <Text className="mt-2 text-skyDark font-semibold">
            Memuat profil . . .
          </Text>
        </View>
      </Background>
    );
  }

  // Fungsi untuk menangani error loading image
  const handleImageError = () => {
    setImageLoadError(true);
  };

  // Fungsi untuk menangani sukses loading image
  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  return (
    <Background>
      <View className="flex-1">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#025F96"]} // Android
              tintColor="#025F96" // iOS
              title="Memuat ulang profil..."
              titleColor="#025F96"
            />
          }
        >
          {/* Header Profil */}
          <View className="relative pt-12 bg-skyLight rounded-b-[50px] py-28">
            <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
              <Text className="text-skyDark text-2xl font-bold">Profil</Text>
              <Image
                className="h-10 w-12"
                source={images.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Foto Profil */}
          <View className="absolute top-28 left-1/2 -translate-x-1/2">
            {userData.foto_profil_dokter && !imageLoadError ? (
              <Image
                source={{
                  uri: getImageUrl(userData.foto_profil_dokter),
                }}
                className="w-32 h-32 rounded-full border-4 border-skyDark"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <View className="w-32 h-32 rounded-full border-4 border-skyDark items-center justify-center bg-gray-200">
                <Ionicons name="person" size={64} color="#0C4A6E" />
              </View>
            )}
          </View>

          {/* Card Profil */}
          <View
            className="bg-white rounded-xl mx-10 mt-24 p-6"
            style={{
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 11,
              elevation: 15,
            }}
          >
            <TouchableOpacity
              className="items-end"
              onPress={() => openModal("editprofil")}
            >
              <FontAwesome5 name="edit" size={24} color="#025F96" />
            </TouchableOpacity>

            <Text className="font-bold text-lg text-skyDark">Nama</Text>
            <Text className="text-gray-700">{userData.nama_dokter}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              Nama Pengguna
            </Text>

            <Text className="text-gray-700">{userData.username_dokter}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">Email</Text>
            <Text className="text-gray-700">{userData.email_dokter}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              Nomor Telepon
            </Text>
            <Text className="text-gray-700">{userData.notlp_dokter}</Text>

            <Text className="font-bold text-lg text-skyDark mt-2">
              STR Dokter
            </Text>
            <Text className="text-gray-700">{userData.str_dokter}</Text>
            <Text className="font-bold text-lg text-skyDark mt-2">
              Spesialis
            </Text>
            <Text className="text-gray-700">{userData.spesialis_dokter}</Text>

            {/* Ganti Password */}
            <Text className="font-bold text-lg text-skyDark mt-4">
              Ganti Kata Sandi
            </Text>
            <View className="w-full h-[2px] bg-skyDark" />
            <View className="flex flex-col items-center">
              <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
                Kata Sandi Lama
              </Text>
              <TextInput
                placeholder="Masukkan Kata Sandi Lama"
                secureTextEntry
                value={passwordLama}
                onChangeText={setPasswordLama}
                className="border-2 rounded-xl border-gray-400 p-2 w-full"
                placeholderTextColor="#888"
              />
              <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
                Kata Sandi Baru
              </Text>
              <TextInput
                placeholder="Masukkan Kata Sandi Baru"
                secureTextEntry
                value={passwordBaru}
                onChangeText={setPasswordBaru}
                onFocus={() => setShowPasswordValidation(true)}
                className="border-2 rounded-xl border-gray-400 p-2 w-full"
                placeholderTextColor="#888"
              />
              <PasswordValidationIndicator
                passwordValidation={passwordValidation}
                showPasswordValidation={showPasswordValidation}
              />
              <Text className="w-full pl-1 text-base font-semibold text-skyDark pt-2">
                Konfirmasi Kata Sandi Baru
              </Text>
              <TextInput
                placeholder="Masukkan Konfirmasi Kata Sandi Baru"
                secureTextEntry
                value={konfirmasiPassword}
                onChangeText={setKonfirmasiPassword}
                className="border-2 rounded-xl border-gray-400 p-2 w-full"
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                className="px-12 py-3 rounded-xl mt-6 bg-skyDark"
                onPress={handleGantiPassword}
              >
                <Text className="text-white text-center font-bold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Settings />
        </ScrollView>
      </View>

      <ModalTemplate isVisible={isModalVisible} onClose={closeModal}>
        <ModalContent
          modalType={modalType}
          onClose={closeModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </ModalTemplate>
    </Background>
  );
}

export default function ProfileScreen() {
  return (
    <ImageProvider>
      <ProfileApp />
    </ImageProvider>
  );
}
