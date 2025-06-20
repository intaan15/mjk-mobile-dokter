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
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Background from "../../components/background";
import { images } from "@/constants/images";
import { HomeViewModel } from "../../components/viewmodels/useHome";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const viewModel = new HomeViewModel();
  const {
    userData,
    chatList,
    loading,
    refreshing,
    fetchUserData,
    onRefresh,
    navigateToChat,
    formatDate,
    getImageUrl,
  } = viewModel.useHome();

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <Background>
      <View className="flex-1">
        {/* Header */}
        <HeaderView userData={userData} />

        {/* Chat List */}
        <ChatListView 
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          chatList={chatList}
          onChatPress={navigateToChat}
          formatDate={formatDate}
          getImageUrl={getImageUrl}
        />
      </View>
    </Background>
  );
}

const HeaderView = ({ userData }: { userData: any }) => (
  <View className="flex flex-row justify-between items-center mb-4 w-full px-5 pt-10">
    <View className="flex flex-row items-center">
      <Text className="text-skyDark text-2xl font-bold">Hi,</Text>
      <MarqueeText
        text={userData?.nama_dokter || "Loading..."}
        style={{ fontSize: 20, color: "#025F96", fontWeight: "bold" }}
      />
    </View>
    <Image
      className="h-10 w-12"
      source={images.logo}
      resizeMode="contain"
    />
  </View>
);

const ChatListView = ({
  loading,
  refreshing,
  onRefresh,
  chatList,
  onChatPress,
  formatDate,
  getImageUrl,
}: {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  chatList: any[];
  onChatPress: (chat: any) => void;
  formatDate: (date: string) => string;
  getImageUrl: (path: string) => string | null;
}) => {
  if (loading) {
    return (
      <View className="flex h-3/4 justify-center items-center">
        <ActivityIndicator size="large" color="#025F96" />
        <Text className="mt-2 text-skyDark font-semibold">
          Memuat chat . . .
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="px-6 py-4"
      contentContainerStyle={{ paddingBottom: 80 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#025F96"]}
          tintColor="#025F96"
          title="Memuat ulang..."
          titleColor="#025F96"
        />
      }
    >
      {chatList.map((chat) => (
        <ChatItemView
          key={chat._id}
          chat={chat}
          onPress={() => onChatPress(chat)}
          formatDate={formatDate}
          getImageUrl={getImageUrl}
        />
      ))}
    </ScrollView>
  );
};

const ChatItemView = ({
  chat,
  onPress,
  formatDate,
  getImageUrl,
}: {
  chat: any;
  onPress: () => void;
  formatDate: (date: string) => string;
  getImageUrl: (path: string) => string | null;
}) => (
  <TouchableOpacity className="flex flex-col" onPress={onPress}>
    <View className="flex flex-row justify-between">
      <Text className="p-2 rounded-xl font-bold self-end">
        Konsultasi Dengan
      </Text>
      <Text
        className={`p-2 rounded-xl self-end ${
          chat.status === "selesai" ? "bg-lime-200" : "bg-yellow-200"
        }`}
      >
        {chat.status === "selesai" ? "selesai" : "berlangsung"}
      </Text>
    </View>
    
    <View className="flex flex-row items-center">
      <ProfileImageView
        imageUrl={getImageUrl(chat.foto_profil_masyarakat)}
      />

      <View className="ml-4 flex-1">
        <View className="flex flex-row justify-between items-center">
          <Text
            className="font-semibold text-lg max-w-[80%] text-skyDark"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.nama_masyarakat || "Masyarakat"}
          </Text>
          <Text className="text-gray-500 text-sm">
            {formatDate(chat.lastMessageDate)}
          </Text>
        </View>

        <View className="flex flex-row justify-between items-center mt-1">
          <Text
            className="text-gray-700 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.lastMessage || "Belum ada pesan"}
          </Text>
        </View>
      </View>
    </View>
    <View className="w-full h-[2px] bg-skyDark my-2" />
  </TouchableOpacity>
);

const ProfileImageView = ({ imageUrl }: { imageUrl: string | null }) => (
  <View className="h-16 w-16 rounded-full border border-gray-300 bg-gray-100 justify-center items-center">
    {imageUrl ? (
      <Image
        source={{ uri: imageUrl }}
        className="h-full w-full rounded-full"
        resizeMode="cover"
      />
    ) : (
      <View className="h-16 w-16 rounded-full border border-gray-300 items-center justify-center bg-gray-200">
        <Ionicons name="person" size={32} color="#0C4A6E" />
      </View>
    )}
  </View>
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

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "row",
  },
  text: {
    color: "#025F96",
  },
});