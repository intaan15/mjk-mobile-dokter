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
import React, { useEffect } from "react";
import { images } from "@/constants/images";
import Settings from "@/components/settings";
import { ImageProvider } from "@/components/picker/imagepicker";
import { Ionicons } from "@expo/vector-icons";
import ModalContent from "@/components/modals/ModalContent";
import ModalTemplate from "@/components/modals/ModalTemplate";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileViewModel } from "../../components/viewmodels/useProfil";

export default function ProfileScreen() {
  return (
    <ImageProvider>
      <ProfileView />
    </ImageProvider>
  );
}

function ProfileView() {
  const {
    // State
    userData,
    passwordLama,
    passwordBaru,
    konfirmasiPassword,
    modalType,
    isModalVisible,
    refreshing,
    // Actions
    setPasswordLama,
    setPasswordBaru,
    setKonfirmasiPassword,
    fetchUserData,
    onRefresh,
    handleGantiPassword,
    openModal,
    closeModal,
    handleUpdateSuccess,
    getImageUrl,
  } = useProfileViewModel();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
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
              title="Memuat ulang jadwal..."
              titleColor="#025F96"
            />
          }
        >
          {/* Header */}
          <View className="relative pt-12 bg-skyLight rounded-b-[50px] py-28">
            <View className="absolute inset-0 flex items-center justify-between flex-row px-12">
              <Text className="text-skyDark text-2xl font-bold">Profile</Text>
              <Image
                className="h-10 w-12"
                source={images.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Foto Profil */}
          <View className="absolute top-28 left-1/2 -translate-x-1/2">
            {userData.foto_profil_dokter ? (
              <Image
                source={{
                  uri: getImageUrl(userData.foto_profil_dokter),
                }}
                className="w-32 h-32 rounded-full border-4 border-skyDark"
                onError={(error) => {
                  console.log(
                    "Error loading profile image:",
                    error.nativeEvent.error
                  );
                  console.log(
                    "Image URL:",
                    getImageUrl(userData.foto_profil_dokter)
                  );
                }}
                onLoad={() => {
                  console.log(
                    "Image loaded successfully:",
                    getImageUrl(userData.foto_profil_dokter)
                  );
                }}
              />
            ) : (
              <View className="w-32 h-32 rounded-full border-4 border-skyDark items-center justify-center bg-gray-200">
                <Ionicons name="person" size={64} color="#0C4A6E" />
              </View>
            )}
          </View>

          {/* Card Profil */}
          <View
            className="bg-white rounded-xl mx-10 mt-28 p-6"
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
                className="border-2 rounded-xl border-gray-400 p-2 w-full"
                placeholderTextColor="#888"
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

          {/* Card Settings  */}
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
