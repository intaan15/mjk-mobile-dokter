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
import { BASE_URL, BASE_URL2 } from "@env";
import { useLocalSearchParams } from "expo-router";

// const socket = io("http://192.168.2.210:3330", {
//   transports: ["websocket"], //
// });

const socket = io(`${BASE_URL2}`, {
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

  const getJakartaTime = () => {
    const now = new Date();
    // Jakarta = UTC+7, jadi tambahkan 7 jam (7 * 60 * 60 * 1000 ms)
    const jakartaOffset = 7 * 60 * 60 * 1000;
    const jakartaTime = new Date(now.getTime() + jakartaOffset);
    return jakartaTime.toISOString();
  };

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      // Delay scroll to ensure FlatList has rendered
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [messages]);

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
      socket.emit("joinRoom", userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleErrorMessage = (error) => {
      alert(error.message);
    };

    socket.on("errorMessage", handleErrorMessage);

    return () => {
      socket.off("errorMessage", handleErrorMessage);
    };
  }, []);

  // Fetch chat history setelah userId dan receiverId siap
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (!userId || !receiverId) {
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

  // ✅ Terima pesan dari socket
  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat message", handleIncomingMessage);

    return () => {
      socket.off("chat message", handleIncomingMessage);
    };
  }, []);

  // ✅ Kirim pesan teks
  const sendMessage = async () => {
    console.log("[DEBUG] Tombol Kirim ditekan");
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
        waktu: getJakartaTime(),
      };
      console.log(msgData);
      socket.emit("chat message", msgData);
      setMessage("");
    } else {
      console.warn("Gagal kirim pesan: Ada data kosong.");
    }
  };

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
        const asset = result.assets[0];
        let base64Image;

        const imageFormat =
          asset.uri?.split(".").pop()?.toLowerCase() || "jpeg";
        const mimeType = imageFormat === "png" ? "image/png" : "image/jpeg";

        if (asset.base64) {
          base64Image = `data:${mimeType};base64,${asset.base64}`;
        } else {
          console.log("❌ Base64 data tidak tersedia");
          alert("Gagal mengambil data gambar");
          return;
        }

        const imgMsg = {
          sender: username,
          senderId: userId,
          receiverId: receiverId,
          image: base64Image,
          type: "image",
          role: userRole,
          waktu: getJakartaTime(),
        };

        console.log("[DEBUG] 📷 Sending image message:", {
          type: imgMsg.type,
          hasImage: !!imgMsg.image,
          imageLength: imgMsg.image?.length || 0,
          imageHeader: imgMsg.image?.substring(0, 30) + "...",
          sender: imgMsg.sender,
          senderId: imgMsg.senderId,
          receiverId: imgMsg.receiverId,
        });

        socket.emit("chat message", imgMsg);

        console.log("✅ Image message sent successfully");
      } else {
        console.warn("⚠️ Pengambilan gambar dibatalkan atau tidak valid.");
      }
    } catch (error) {
      console.error("❌ Gagal mengirim gambar:", error);
      alert("Gagal mengirim gambar: " + error.message);
    }
  };

  const renderItem = ({ item }) => {
    const isSender = item.senderId === userId;

    return (
      <View
        className={`rounded-[3rem] p-4 px-4 my-1 max-w-[80%] ${
          isSender ? "bg-skyDark self-end" : "bg-[#C3E9FF] self-start"
        }`}
      >
        {item.type === "image" && item.image ? (
          <TouchableOpacity
            onPress={() => {
              console.log("[DEBUG] 🖼️ Opening preview for image:", item.image);
              setPreviewImage(item.image);
            }}
            onLongPress={() => {
              console.log("[DEBUG] 📋 Image URI:", item.image);
            }}
          >
            <Image
              source={{
                uri: item.image.startsWith("data:")
                  ? item.image
                  : item.image.startsWith("http")
                  ? item.image
                  : // : `http://192.168.2.210:3330${item.image}`,
                    `${BASE_URL2}${previewImage}`, // Path relatif
              }}
              className="w-24 h-32 mt-1 rounded-md"
              resizeMode="cover"
              onError={(error) => {
                console.log("❌ Error loading image:", error.nativeEvent.error);
                console.log("❌ Failed image URI:", item.image);
              }}
              onLoad={() => {
                console.log("✅ Image loaded successfully");
              }}
            />
          </TouchableOpacity>
        ) : item.type === "text" && item.text ? (
          <Text className={`${isSender ? "text-white" : "text-black"}`}>
            {item.text}
          </Text>
        ) : (
          <View>
            <Text
              className={`${isSender ? "text-white" : "text-black"} italic`}
            >
              [Pesan tidak dapat ditampilkan]
            </Text>
            <Text
              className={`${
                isSender ? "text-white" : "text-black"
              } text-xs opacity-50`}
            >
              Type: {item.type} | HasText: {!!item.text} | HasImage:{" "}
              {!!item.image}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Background>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center w-full px-5 bg-skyLight py-5 pt-10">
          <View className="flex-row items-center w-10/12">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text
              className="w-11/12 truncate text-skyDark font-bold text-xl ml-2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {receiverName ? receiverName : "Loading..."}
            </Text>
          </View>
          <Image
            className="h-10 w-12"
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
          />
        </View>

        {/* Main Chat Area */}
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            {/* Chat Messages */}
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={[...messages].reverse()}
                keyExtractor={(item, index) =>
                  `message-${index}-${item.waktu || getJakartaTime()}`
                }
                renderItem={renderItem}
                contentContainerStyle={{
                  padding: 16,
                  flexGrow: 1,
                  justifyContent: "flex-end", // Align messages to bottom
                }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                inverted={true}
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                  autoscrollToTopThreshold: 10,
                }}
                removeClippedSubviews={false} // Important for scroll performance
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={10}
                getItemLayout={null} // Let FlatList calculate item heights
              />
            </View>

            {/* Chat Input */}
            <View className="px-4 bg-skyDark py-4" style={{ minHeight: 70 }}>
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
                    className="border border-gray-400 bg-[#C3E9FF] rounded-3xl p-2 min-h-[40px]"
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Tulis pesan..."
                    multiline
                    textAlignVertical="center"
                    maxHeight={100}
                    scrollEnabled={true}
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
          </KeyboardAvoidingView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={!!previewImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewImage(null)}
        >
          <View className="flex-1 bg-black/80 justify-center items-center">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                console.log("[DEBUG] 🚫 Closing preview modal");
                setPreviewImage(null);
              }}
              className="absolute top-10 right-4 z-10 bg-black/50 rounded-full p-2"
            >
              <Ionicons name="close-circle" size={36} color="white" />
            </TouchableOpacity>

            {/* Background Touchable */}
            <TouchableOpacity
              onPress={() => setPreviewImage(null)}
              className="absolute inset-0 bg-transparent"
              activeOpacity={1}
            />

            {/* Image Container */}
            {previewImage && (
              <View className="justify-center items-center w-full h-full p-4">
                <Image
                  source={{
                    uri: previewImage.startsWith("data:")
                      ? previewImage
                      : previewImage.startsWith("http")
                      ? previewImage
                      : // : `http://192.168.2.210:3330${previewImage}`,
                        `${BASE_URL2}${previewImage}`, // Path relatif
                  }}
                  style={{
                    width: "90%",
                    height: "60%",
                  }}
                  resizeMode="contain"
                  onLoadStart={() => {
                    console.log("🔄 Image loading started...");
                  }}
                  onLoad={(event) => {
                    console.log("✅ Preview image loaded successfully");
                    console.log("Image dimensions:", event.nativeEvent.source);
                  }}
                  onError={(error) => {
                    console.log(
                      "❌ Preview image error:",
                      error.nativeEvent.error
                    );
                    console.log("❌ Preview URI:", previewImage);
                    console.log(
                      "❌ Full URI being used:",
                      previewImage.startsWith("data:")
                        ? "Base64 Image"
                        : previewImage.startsWith("http")
                        ? previewImage
                        : // : `http://192.168.2.210:3330${previewImage}`
                          `${BASE_URL2}${previewImage}` // Path relatif
                    );
                  }}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </Background>
  );
}
