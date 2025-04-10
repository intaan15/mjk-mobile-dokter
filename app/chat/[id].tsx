import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Background from "../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

import { useImage } from "@/components/imagecontext";
import ImagePickerComponent from "@/components/imagepicker";
import ImageModal from "@/components/modal4";

const dummyMessages = [
  { id: "1", text: "Halo, ada yang bisa dibantu?", sender: "other" },
  { id: "2", text: "Iya, aku butuh informasi tentang tanaman.", sender: "me" },
  {
    id: "3",
    text: "Tentu! Jenis tanaman apa yang kamu maksud?",
    sender: "other",
  },
  { id: "4", text: "Tanaman bonsai", sender: "me" },
  { id: "5", text: "Kira kira yang harga berapa?", sender: "other" },
  {
    id: "6",
    text: "Harga bonsai bervariasi, mulai dari ratusan ribu hingga jutaan.",
    sender: "me",
  },
  { id: "7", text: "Oh, begitu. Terima kasih!", sender: "other" },
  {
    id: "8",
    text: "Sama-sama! Jika ada pertanyaan lain, silakan tanya saja.",
    sender: "me",
  },
  { id: "9", text: "Baiklah, terima kasih banyak!", sender: "other" },
  { id: "10", text: "Sama-sama! Semoga harimu menyenangkan!", sender: "me" },
  { id: "11", text: "Terima kasih! Kamu juga!", sender: "other" },
  { id: "12", text: "Sama-sama!", sender: "me" },
  {
    id: "13",
    text: "Ada yang lain yang ingin kamu tanyakan?",
    sender: "other",
  },
  { id: "14", text: "Tidak, itu saja. Terima kasih!", sender: "me" },
  { id: "15", text: "Baiklah, sampai jumpa!", sender: "other" },
  { id: "16", text: "Sampai jumpa!", sender: "me" },
  { id: "17", text: "Selamat tinggal!", sender: "other" },
  { id: "18", text: "Selamat tinggal!", sender: "me" },
  { id: "19", text: "Selamat tinggal!", sender: "other" },
];

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [modalVisible, setModalImageVisible] = useState(false);

  const imageContext = useImage();
  const setImage = imageContext?.setImage;

  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  const handleSend = () => {
    if (message.trim()) {
      // Di sini bisa ditambahkan logika push message baru ke array state
      setMessage("");
    }
  };

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center w-full px-5 bg-skyLight py-5 pt-10">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text className="text-skyDark font-bold text-xl ml-2">
              Zuditanit
            </Text>
          </View>
          <Image
            className="h-10 w-12"
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Chat List */}
        <FlatList
          className="flex-1 px-4"
          data={dummyMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`my-2 px-4 py-2 rounded-2xl max-w-[75%] ${
                item.sender === "me"
                  ? "self-end bg-sky-800"
                  : "self-start bg-sky-200"
              }`}
            >
              <Text
                className={`text-base ${
                  item.sender === "me" ? "text-white" : "text-black"
                }`}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* Chat Input */}
        <View className="absolute bottom-0 left-0 right-0 bg-skyDark p-4 flex-row items-center gap-2">
          <TouchableOpacity onPress={() => setModalImageVisible(true)}>
            <Feather name="image" size={28} color="#C3E9FF" />
          </TouchableOpacity>

          <View className="flex-1 bg-skyLight mx-2 rounded-full px-4">
            <TextInput
              className="text-base text-black"
              placeholder="Tulis pesan..."
              value={message}
              onChangeText={setMessage}
              style={{ paddingVertical: 10 }}
            />
          </View>

          <TouchableOpacity
            className="p-2 bg-skyLight rounded-full"
            onPress={handleSend}
          >
            <MaterialCommunityIcons name="send" size={22} color="#025F96" />
          </TouchableOpacity>
        </View>

        {/* Modal untuk pilih gambar */}
        <ImageModal
          visible={modalVisible}
          onClose={() => setModalImageVisible(false)}
          onPickImage={() => {
            openGallery();
            setModalImageVisible(false);
          }}
          onOpenCamera={() => {
            openCamera();
            setModalImageVisible(false);
          }}
        />
      </View>
    </Background>
  );
}
