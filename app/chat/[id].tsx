import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Background from "../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { BASE_URL } from "@env";
import { useLocalSearchParams } from "expo-router";


const socket = io("https://mjk-backend-production.up.railway.app", {
  transports: ["websocket"], // <--- penting supaya pakai websocket langsung
});

export default function ChatScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [userId, setUserId] = useState("");
  const { id: receiverId } = useLocalSearchParams();

  // ✅ Ambil data user dari backend
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const rawUserId = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("userToken");

        if (!rawUserId || !token) {
          console.warn("Token atau ID tidak ditemukan.");
          router.push("/screens/signin");
          return;
        }

        const cleanedUserId = rawUserId.replace(/"/g, "");
        console.log("[DEBUG] Fetched userId:", cleanedUserId);

        const response = await axios.get(
          `${BASE_URL}/dokter/getbyid/${cleanedUserId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data;
        if (user && user.nama_dokter) {
          console.log("[DEBUG] Fetched username:", user.nama_dokter);
          setUsername(user.nama_dokter);
        } else {
          console.warn("Nama user tidak ditemukan dalam response.");
        }

        setUserId(cleanedUserId);
      } catch (error) {
        console.error("Gagal fetch username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    console.log("[DEBUG] Current username:", username);
  }, [username]);

  // ✅ Terima pesan dari socket
  useEffect(() => {
    socket.on("chat message", (msg) => {
      console.log("[DEBUG] Received message via socket:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // ✅ Kirim pesan teks
  const sendMessage = async () => {
    if (message.trim() && username && userId && receiverId) {
      const msgData = {
        text: message,
        sender: username,
        senderId: userId,
        receiverId: receiverId,
        type: "text",
        waktu: new Date().toISOString(),
      };

      console.log("[DEBUG] Sending text message:", msgData);
      socket.emit("chat message", msgData);
      setMessage("");
    } else {
      console.warn("Gagal kirim pesan: Ada data kosong.");
    }
  };

  // ✅ Ambil riwayat chat dari backend
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const rawUserId = await SecureStore.getItemAsync("userId");
        const cleanedUserId = rawUserId?.replace(/"/g, "");

        console.log("[DEBUG] cleanedUserId:", cleanedUserId);
        console.log("[DEBUG] receiverId:", receiverId);

        if (!cleanedUserId || !receiverId) {
          console.warn("Tidak ada userId atau receiverId untuk fetch chat.");
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/chat/history/${cleanedUserId}/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("[DEBUG] Chat history fetched:", res.data);
        setMessages(res.data);
      } catch (err) {
        console.log("Gagal ambil riwayat chat:", err);
      }
    };

    fetchChatHistory();
  }, [receiverId]);

  console.log("[DEBUG] Messages state after fetch:", messages);
  console.log("[DEBUG] User ID:", userId);
  console.log("[DEBUG] Receiver ID:", receiverId);

  // ✅ Render pesan (teks / gambar)
  const renderItem = ({ item }) => {
    const isSender = item.senderId === userId;

    return (
      <View
        className={`rounded-[3rem] p-4 px-4 my-1 max-w-[80%] ${
          isSender ? "bg-skyDark self-end" : "bg-[#C3E9FF] self-start"
        }`}
      >
        <Text className={`font-bold ${isSender ? "text-white" : "text-black"}`}>
          {isSender ? "Saya" : item.sender || item.role}
        </Text>

        {item.type === "image" && item.image ? (
          <TouchableOpacity onPress={() => setPreviewImage(item.image)}>
            <Image
              source={{ uri: item.image }}
              className="w-24 h-32 mt-1 rounded-md"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <Text className={`${isSender ? "text-white" : "text-black"}`}>
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  // ✅ Kirim gambar dari galeri/kamera
  const sendImage = async (fromCamera = false) => {
    try {
      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: true,
        });
      }

      if (!result.canceled && result.assets?.length > 0) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const imgMsg = {
          sender: username,
          senderId: userId,
          receiverId: receiverId,
          image: base64Image,
          type: "image",
          waktu: new Date().toISOString(),
        };

        console.log("[DEBUG] Sending image message:", imgMsg);
        socket.emit("chat message", imgMsg);
      } else {
        console.warn("Pengambilan gambar dibatalkan atau tidak valid.");
      }
    } catch (error) {
      console.error("Gagal mengirim gambar:", error);
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
          data={messages}
          keyExtractor={(item, index) => index.toString()} // pastiin unique
          renderItem={renderItem}
          // contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* Chat Input */}
        <View className="flex-row items-end mt-2 px-4 bg-skyDark py-4 pb-6">
          <TouchableOpacity onPress={() => sendImage(false)}>
            <Ionicons name="image-outline" size={28} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sendImage(true)} className="ml-2">
            <Ionicons name="camera-outline" size={28} color="gray" />
          </TouchableOpacity>

          <View className="flex-1 ml-2 mr-2">
            <TextInput
              className="border border-gray-400 bg-[#C3E9FF] rounded-3xl p-2"
              value={message}
              onChangeText={setMessage}
              placeholder="Tulis pesan..."
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!username || !message.trim()}
            className={`bg-blue-500 px-4 py-2 rounded-lg mr-1 ${
              !username || !message.trim() ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white font-semibold">Kirim</Text>
          </TouchableOpacity>
        </View>

        {/* Preview Modal */}
        <Modal visible={!!previewImage} transparent={true} animationType="fade">
          <View className="flex-1 bg-black bg-opacity-80 justify-center items-center">
            <TouchableOpacity
              onPress={() => setPreviewImage(null)}
              className="absolute top-10 right-4 z-10"
            >
              <Ionicons name="close-circle" size={36} color="white" />
            </TouchableOpacity>
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                className="w-[90%] h-[60%] rounded-lg"
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </View>
    </Background>
  );
}
