import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Background from "../components/background";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import ModalTemplate from "@/components/modals/ModalTemplate";
import ModalContent from "@/components/modals/ModalContent";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "@env";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // tipe pesan: "dokterkosong", "pwsalah", dll

  const handleLogin = async () => {
    if (!identifier || !password) {
      setModalType("dokterkosong");
      setModalVisible(true);
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/login_dokter`, {
        identifier_dokter: identifier,
        password_dokter: password,
      });
      const { token, userId } = response.data;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userId", userId.toString());
      router.replace("/(tabs)/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 429) {
          setModalType("limiter");
        } else if (status === 400) {
          if (message === "Akun tidak ditemukan") {
            setModalType("gadaakun");
          } else if (message === "Password salah") {
            setModalType("pwsalah");
          } else {
            setModalType("galat");
          }
        } else {
          setModalType("galat");
        }
      } else {
        setModalType("galat");
      }
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      {/* StatusBar untuk mengubah warna navbar HP
      <StatusBar backgroundColor="#f6f6f6" barStyle="dark-content" /> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo & Title */}
            <View className="items-center mb-6 pb-24">
              <Image
                className="w-44 h-48"
                source={require("../../assets/images/logo.png")}
                resizeMode="contain"
              />
              <Text className="text-4xl font-bold text-skyDark">Masuk</Text>
            </View>

            {/* Form */}
            <View className="w-full px-8">
              <View className="flex flex-col gap-4 w-full">
                <Text>Nama Pengguna atau STR</Text>
                <TextInput
                  placeholder="Masukkan Nama Pengguna atau STR"
                  value={identifier}
                  onChangeText={setIdentifier}
                  className="bg-transparent border-gray-400 border-2 text-black px-4 py-3 rounded-xl"
                  placeholderTextColor="#ccc"
                />
                <Text>Kata Sandi</Text>
                <View className="relative">
                  <TextInput
                    placeholder="Masukkan Kata Sandi"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    className="bg-transparent border-2 border-gray-400 text-black px-4 py-3 rounded-xl"
                    placeholderTextColor="#ccc"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tombol Login */}
              <TouchableOpacity
                className={`py-3 rounded-xl items-center mt-6 w-64 self-center flex-row justify-center ${
                  isLoading ? "bg-[#0459708a]" : "bg-[#025F96]"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white text-lg">Loading...</Text>
                  </>
                ) : (
                  <Text className="text-white text-lg">Masuk</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ModalTemplate
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent
          modalType={modalType}
          onClose={() => setModalVisible(false)}
        />
      </ModalTemplate>
    </Background>
  );
}
