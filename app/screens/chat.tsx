import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Background from "../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View className="flex flex-row justify-between items-center mb-4 w-full px-5 bg-skyLight py-5 pt-10">
              <View className="flex flex-row items-center">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex flex-row items-center"
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color="#025F96"
                  />
                </TouchableOpacity>
                <Text className="text-skyDark font-bold text-xl">
                  Zuditanit
                </Text>
              </View>
              <Image
                className="h-10 w-12"
                source={require("../../assets/images/logo.png")}
                resizeMode="contain"
              />
            </View>

            {/* Chat Body */}
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 italic">Mulai percakapan...</Text>
            </View>

            {/* Chat Input */}
            <View className="flex flex-row bg-skyDark w-full p-4 items-center gap-2">
              <TouchableOpacity>
                <Feather name="image" size={28} color="#C3E9FF" />
              </TouchableOpacity>
              <View className="flex-1 bg-skyLight mx-2 rounded-full px-4">
                <TextInput
                  className="text-base text-black"
                  placeholder="Tulis pesan..."
                  value={message}
                  onChangeText={setMessage}
                  style={{ paddingVertical: 10 }} // Menambah padding untuk iOS
                />
              </View>
              <TouchableOpacity className="p-2 bg-skyLight rounded-full">
                <MaterialCommunityIcons name="send" size={22} color="#025F96" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Background>
  );
}
