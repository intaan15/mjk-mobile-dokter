import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import Background from "../../components/background";
import { images } from "@/constants/images";
import TabButton from "../../components/tabbutton";
import DatePickerComponent from "@/components/picker/datepicker";
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "@env";

const { width } = Dimensions.get("window");

interface User {
  nama_dokter: string;
}


export default function HomeScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [dokterId, setDokterId] = useState<string | null>(null);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Berlangsung");
  const [selectedDate, setSelectedDate] = useState(moment().format("DD/MM/YY"));
  const [chatList, setChatList] = useState<any[]>([]);
  const fallbackImageUrl ="/assets/images/foto.jpeg"; // Atau URL default lainnya

  const filteredChats = chatList.filter(
    (chat) => moment(chat.lastMessageDate).format("DD/MM/YY") === selectedDate
  );
  const fetchChatList = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/chatlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Chat list response:", response.data);
      const enrichedChatList = response.data.map((chat: any) => {
        return {
          ...chat,
          nama_masyarakat: chat.participant?.nama || "Pasien",
          foto_masyarakat: chat.participant?.foto_profil || fallbackImageUrl,
          id_masyarakat: chat.participant?._id || "",
        };
      });
      
      

      setChatList(enrichedChatList);
    } catch (error) {
      console.log("Gagal ambil chat list fe", error);
    }
  };
  

  const fetchUserData = async () => {
    try {
      const storedId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");
      const cleanedId = storedId?.replace(/"/g, "");

      if (!cleanedId || !token) return;

      const response = await axios.get(
        `${BASE_URL}/dokter/getbyid/${cleanedId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.role !== "dokter") {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userId");
        router.replace("/screens/signin");
        return;
      }

      setUserData(response.data);
      setDokterId(cleanedId); // <- simpan ke state agar bisa dipakai nanti
      fetchChatList(cleanedId, token); // <- Panggil ambil chatlist
    } catch (error) {
      console.log("Gagal ambil data user", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );
  const MarqueeText = ({ text, style }: { text: string; style?: any }) => {
    const screenWidth = Dimensions.get("window").width;
    const containerWidth = screenWidth * 0.7;

    const translateX = useRef(new Animated.Value(0)).current;
    const [textWidth, setTextWidth] = useState(0);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      if (textWidth > containerWidth) {
        const duration = (textWidth + containerWidth) * 30;

        animationRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: -textWidth,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(translateX, {
              toValue: containerWidth,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );

        translateX.setValue(containerWidth);
        animationRef.current.start();
      } else {
        // Reset posisi ke awal jika tidak jalan
        translateX.setValue(0);
      }

      return () => {
        animationRef.current?.stop();
      };
    }, [textWidth, containerWidth]);

    return (
      <View style={[styles.container, { width: containerWidth }]}>
        <Animated.View
          style={{
            transform: [{ translateX }],
            flexDirection: "row",
          }}
        >
          <Text
            style={[style, { flexShrink: 0 }]}
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {text + "     "}
          </Text>
          {textWidth > containerWidth && (
            <Text
              style={[style, { flexShrink: 0 }]}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {text + "     "}
            </Text>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <View className="relative pt-12 flex flex-col gap-4 px-6">
          <View className="flex items-center justify-between flex-row">
            <Text className="text-skyDark text-2xl font-bold">Hi,</Text>
            <MarqueeText
              text={userData?.nama_dokter || "Loading..."}
              style={{ fontSize: 20, color: "#025F96", fontWeight: "bold" }}
            />
            <Image
              className="h-10 w-12"
              source={images.logo}
              resizeMode="contain"
            />
          </View>
          <View className="flex flex-col w-full gap-1">
            <DatePickerComponent
              label="Tanggal Terpilih"
              onDateChange={(date) => {
                const formattedDate = moment(date).format("DD/MM/YY");
                setSelectedDate(formattedDate);
              }}
            />
            <View className="w-full h-[2px] bg-skyDark" />
          </View>

          <View className="flex flex-row rounded-xl border-2 border-skyDark overflow-hidden">
            {["Berlangsung", "Selesai"].map((tab) => (
              <TabButton
                key={tab}
                label={tab}
                isActive={selectedTab === tab}
                onPress={() => setSelectedTab(tab)}
              />
            ))}
          </View>
        </View>

        {/* Chat List */}
        <View className="flex-1">
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {filteredChats.map((chat) => (
              <TouchableOpacity
                key={chat._id}
                className="flex flex-col"
                onPress={() => router.push(`/chat/${chat._id}`)}
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={{ uri: chat.foto_masyarakat || fallbackImageUrl }}
                    className="h-16 w-16 rounded-full border border-gray-300"
                    resizeMode="cover"
                  />

                  <View className="ml-4 flex-1">
                    <View className="flex flex-row justify-between">
                      <Text className="font-semibold text-lg">
                        {chat.nama_masyarakat || "Masyarakat"}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {moment(chat.lastMessageDate).format("DD/MM/YY")}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between">
                      <Text className="text-gray-700 mt-1">
                        {chat.lastMessage || "Belum ada pesan"}
                      </Text>
                      {dokterId &&
                        chat.unreadCount &&
                        chat.unreadCount[dokterId] > 0 && (
                          <View className="bg-red-500 rounded-full px-2 py-1 ml-2">
                            <Text className="text-white text-xs">
                              {chat.unreadCount[dokterId]}
                            </Text>
                          </View>
                        )}
                    </View>
                  </View>
                </View>
                <View className="w-full h-[2px] bg-skyDark my-2" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "row",
  },
  text: {
    color: "#025F96",
  },
});