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

const socket = io("https://mjk-backend-production.up.railway.app", {
  transports: ["websocket"], // <--- penting supaya pakai websocket langsung
});

export default function ChatScreen() {
  const router = useRouter();
  const [username] = useState("User" + Math.floor(Math.random() * 1000));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

 useEffect(() => {
   // Event yang akan dipanggil saat koneksi berhasil
   socket.on("connected", (data) => {
     console.log(data.message); // Akan muncul "Successfully connected to backend"
   });

   socket.on("connect", () => {
     console.log("Connected to backend!");
   });

   socket.on("chat history", (msgs) => {
     console.log("Chat history received:", msgs);
     setMessages(msgs);
   });

    socket.on("chat message", (newMsg) => {
      console.log("New chat message:", newMsg);
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });

   // Bersihkan listener ketika komponen unmount
   return () => {
     socket.off("connect");
     socket.off("connected");
     socket.off("chat history");
     socket.off("chat message");
   };

 }, []);


  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        text: message,
        sender: username,
        type: "text",
      };
      console.log("Sending message:", msgData);
      socket.emit("chat message", msgData);
      setMessage("");
    }
  };

  const sendImage = async (fromCamera = false) => {
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
      socket.emit("chat message", {
        sender: username,
        image: base64Image,
        type: "image",
      });
    }
  };

  // renderItem dipisah sebagai fungsi
  const renderItem = ({ item }) => {
    const isSender = item.sender === username;

    return (
      <View
        className={`rounded-[3rem] p-4 px-4 my-1 max-w-[80%] ${
          isSender ? "bg-skyDark self-end" : "bg-[#C3E9FF] self-start"
        }`}
      >
        <Text className={`font-bold ${isSender ? "text-white" : "text-black"}`}>
          {item.sender}
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
            className="bg-blue-500 px-4 py-2 rounded-lg mr-1"
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
            <Image
              source={{ uri: previewImage }}
              className="w-[90%] h-[60%] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </Modal>
      </View>
    </Background>
  );
}
