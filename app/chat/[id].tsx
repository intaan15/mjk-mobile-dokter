import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
  transports: ["websocket"], // 
});

export default function ChatScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [userRole, setUserRole] = useState("");
  const flatListRef = useRef<FlatList>(null);


  const { receiverId } = useLocalSearchParams();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const rawUserId = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("userToken");

        if (!rawUserId || !token) {
          console.warn("Token atau ID tidak ditemukan.");
          router.push("/screens/signin");
          return;
        }

        const cleanedUserId = rawUserId.replace(/"/g, "");
        setUserId(cleanedUserId);

        const response = await axios.get(
          `${BASE_URL}/dokter/getbyid/${cleanedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.nama_dokter) {
          setUsername(response.data.nama_dokter);
        } else {
          console.warn("Property nama_dokter tidak ada di response");
        }

        if (response.data?.role) {
          setUserRole(response.data.role);
          // console.log("[DEBUG] Set user role:", response.data.role);
        } else {
          console.warn("Property role tidak ada di response");
        }
      } catch (error) {
        console.log("Gagal fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReceiverName = async () => {
      if (!receiverId) return;
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const res = await axios.get(
          `${BASE_URL}/masyarakat/getbyid/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.nama_masyarakat) {
          setReceiverName(res.data.nama_masyarakat);
          // console.log(
          //   "[DEBUG] receiverName fetched:",
          //   res.data.nama_masyarakat
          // );
        } else {
          console.log("[DEBUG] receiverName not found in response:", res.data);
        }
      } catch (error) {
        console.log("Gagal fetch nama receiver:", error);
      }
    };

    fetchReceiverName();
  }, [receiverId]);

  useEffect(() => {
    if (userId) {
      // console.log("[DEBUG] Emitting joinRoom with:", userId);
      socket.emit("joinRoom", userId);
    }
  }, [userId]);

  // Fetch chat history setelah userId dan receiverId siap
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (!userId || !receiverId) {
          console.warn("UserId atau receiverId kosong, skip fetch.");
          return;
        }

        const token = await SecureStore.getItemAsync("userToken");
        const res = await axios.get(
          `${BASE_URL}/chat/history/${userId}/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.log("Gagal ambil riwayat chat:", error);
      }
    };

    fetchChatHistory();
  }, [userId, receiverId]);

  useEffect(() => {
    // console.log("[DEBUG] Current username:", username);
  }, [username]);

  // ✅ Terima pesan dari socket
  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      // console.log("[DEBUG] Received message via socket:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat message", handleIncomingMessage);

    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, []);

  // ✅ Kirim pesan teks
  const sendMessage = async () => {
    // console.log("[DEBUG] Tombol Kirim ditekan");
    // console.log("username:", username);
    // console.log("userId:", userId);
    // console.log("receiverId:", receiverId);
    // console.log("userRole:", userRole);
    // console.log("message:", message);

    if (message.trim() && username && userId && receiverId) {
      const msgData = {
        text: message,
        sender: username,
        senderId: userId,
        receiverId: receiverId,
        type: "text",
        role: userRole,
        waktu: new Date().toISOString(),
      };

      // console.log("[DEBUG] Sending text message:", msgData);
      // console.log("[DEBUG] Socket connected:", socket.connected);

      socket.emit("chat message", msgData);
      setMessage("");
    } else {
      console.warn("Gagal kirim pesan: Ada data kosong.");
    }
  };


  // console.log("[DEBUG] Messages state after fetch:", messages);
  // console.log("[DEBUG] User ID:", userId);
  // console.log("[DEBUG] Receiver ID:", receiverId);

  // ✅ Render pesan (teks / gambar)
  const renderItem = ({ item }) => {
    const isSender = item.senderId === userId;

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
        console.log("Gagal mengirim gambar:", error);
      }
    };

    return (
      <View
        className={`rounded-[3rem] p-4 px-4 my-1 max-w-[80%] ${
          isSender ? "bg-skyDark self-end" : "bg-[#C3E9FF] self-start"
        }`}
      >
        {/* 
        <Text className={`font-bold ${isSender ? "text-white" : "text-black"}`}>
          {isSender ? "Saya" : item.sender || item.role}
        </Text> */}

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

  return (
    <Background>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center w-full px-5 bg-skyLight py-5 pt-10">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text className="text-skyDark font-bold text-xl ml-2">
              {receiverName ? receiverName : "Loading..."}
            </Text>
          </View>
          <Image
            className="h-10 w-12"
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Main Area */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                  padding: 16,
                  flexGrow: 1,
                }}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                keyboardShouldPersistTaps="handled"
              />

              {/* Chat Input - Pastikan ini tetap di bawah */}
              <View className="px-4 bg-skyDark py-4">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => sendImage(false)}>
                    <Ionicons name="image-outline" size={28} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => sendImage(true)}
                    className="ml-2"
                  >
                    <Ionicons name="camera-outline" size={28} color="gray" />
                  </TouchableOpacity>
                  <View className="flex-1 ml-2 mr-2">
                    <TextInput
                      className="border border-gray-400 bg-[#C3E9FF] rounded-3xl p-2"
                      value={message}
                      onChangeText={setMessage}
                      placeholder="Tulis pesan..."
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-blue-500 px-4 py-2 rounded-lg mr-1"
                  >
                    <Text className="text-white font-semibold">Kirim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

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
