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
  AppState,
  AppStateStatus,
  ImageErrorEventData,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Background from "../../components/background";
import { images } from "@/constants/images";
import { HomeViewModel } from "../../components/viewmodels/useHome";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface ChatItem {
  _id: string;
  nama_masyarakat?: string;
  foto_profil_masyarakat?: string;
  lastMessage?: string;
  lastMessageDate: string;
  status: "berlangsung" | "selesai";
  hasUnreadMessage?: boolean;
}

interface GroupedChats {
  berlangsung: ChatItem[];
  selesai: ChatItem[];
}

interface UserData {
  nama_dokter?: string;
  [key: string]: any;
}

interface HeaderViewProps {
  userData: UserData | null;
}

interface ChatListViewProps {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  groupedChats: GroupedChats;
  onChatPress: (chat: ChatItem) => void;
  formatDate: (date: string) => string;
  getImageUrl: (path: string | null | undefined) => string | null;
}

interface ChatItemViewProps {
  chat: ChatItem;
  onPress: () => void;
  formatDate: (date: string) => string;
  getImageUrl: (path: string | null | undefined) => string | null;
}

interface ProfileImageViewProps {
  imageUrl: string | null;
}

interface MarqueeTextProps {
  text: string;
  style?: any;
}

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
    refreshChatList,
  } = viewModel.useHome();

  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Fetch data saat screen focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  // Handle app state changes untuk refresh saat app kembali ke foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("[DEBUG] App came to foreground - refreshing chat list");
        refreshChatList();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => subscription?.remove();
  }, [refreshChatList]);

  // Auto refresh setiap 30 detik ketika screen aktif
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        console.log("[DEBUG] Auto refresh chat list");
        refreshChatList();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, refreshing, refreshChatList]);

  // Group chats by status
  const groupedChats = React.useMemo<GroupedChats>(() => {
    const grouped: GroupedChats = {
      berlangsung: [],
      selesai: []
    };

    (chatList as ChatItem[]).forEach((chat: ChatItem) => {
      if (chat.status === "selesai") {
        grouped.selesai.push(chat);
      } else {
        grouped.berlangsung.push(chat);
      }
    });

    // Sort each group by last message date (newest first)
    grouped.berlangsung.sort((a: ChatItem, b: ChatItem) => 
      new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
    );
    grouped.selesai.sort((a: ChatItem, b: ChatItem) => 
      new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
    );

    return grouped;
  }, [chatList]);

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
          groupedChats={groupedChats}
          onChatPress={navigateToChat}
          formatDate={formatDate}
          getImageUrl={getImageUrl}
        />

        {/* Real-time indicator */}
        <RealTimeIndicator />
      </View>
    </Background>
  );
}

const HeaderView: React.FC<HeaderViewProps> = ({ userData }) => (
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

const ChatListView: React.FC<ChatListViewProps> = ({
  loading,
  refreshing,
  onRefresh,
  groupedChats,
  onChatPress,
  formatDate,
  getImageUrl,
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

  const totalChats = groupedChats.berlangsung.length + groupedChats.selesai.length;

  return (
    <ScrollView
      className="px-6 py-4"
      contentContainerStyle={{ paddingBottom: 120 }}
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
      {totalChats === 0 ? (
        <View className="flex justify-center items-center mt-20">
          <Ionicons name="chatbubbles-outline" size={64} color="#025F96" />
          <Text className="text-skyDark font-semibold mt-4 text-center">
            Belum ada chat tersedia
          </Text>
        </View>
      ) : (
        <>
          {/* Berlangsung Section */}
          {groupedChats.berlangsung.length > 0 && (
            <View className="mb-6">
              <View className="flex flex-row items-center mb-4">
                <Text className="text-skyDark font-bold text-lg">
                  Berlangsung
                </Text>
                <View className="flex-1 h-[2px] bg-skyDark ml-4" />
              </View>
              {groupedChats.berlangsung.map((chat: ChatItem, index: number) => (
                <ChatItemView
                  key={`berlangsung-${chat._id}-${index}`}
                  chat={chat}
                  onPress={() => onChatPress(chat)}
                  formatDate={formatDate}
                  getImageUrl={getImageUrl}
                />
              ))}
            </View>
          )}

          {/* Selesai Section */}
          {groupedChats.selesai.length > 0 && (
            <View className="mb-6">
              <View className="flex flex-row items-center mb-4">
                <Text className="text-skyDark font-bold text-lg">
                  Selesai
                </Text>
                <View className="flex-1 h-[2px] bg-skyDark ml-4" />
              </View>
              {groupedChats.selesai.map((chat: ChatItem, index: number) => (
                <ChatItemView
                  key={`selesai-${chat._id}-${index}`}
                  chat={chat}
                  onPress={() => onChatPress(chat)}
                  formatDate={formatDate}
                  getImageUrl={getImageUrl}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const ChatItemView: React.FC<ChatItemViewProps> = ({
  chat,
  onPress,
  formatDate,
  getImageUrl,
}) => (
  <TouchableOpacity className="flex flex-col mb-4" onPress={onPress} activeOpacity={0.7}>

    <View className="flex flex-row items-center">
      <ProfileImageView
        imageUrl={getImageUrl(chat.foto_profil_masyarakat)}
      />

      <View className="ml-4 flex-1">
        <View className="flex flex-row justify-between items-center">
          <Text
            className="font-semibold text-lg text-skyDark flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.nama_masyarakat || "Masyarakat"}
          </Text>
          <Text className="text-gray-500 text-sm ml-2">
            {formatDate(chat.lastMessageDate)}
          </Text>
        </View>

        <View className="flex flex-row justify-between items-center mt-1">
          <Text
            className="text-gray-600 flex-1 mr-2"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {chat.lastMessage || "Belum ada pesan"}
          </Text>
          
          {/* New message indicator */}
          {chat.hasUnreadMessage && (
            <View className="bg-red-500 rounded-full w-3 h-3" />
          )}
        </View>
      </View>
    </View>
    <View className="w-full h-[2px] bg-gray-200 mt-3" />
  </TouchableOpacity>
);

const ProfileImageView: React.FC<ProfileImageViewProps> = ({ imageUrl }) => {
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  const handleImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log("Error loading profile image:", error.nativeEvent.error);
    setImageLoadError(true);
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  return (
    <View className="h-16 w-16 rounded-full border border-gray-300 bg-gray-100 justify-center items-center">
      {imageUrl && !imageLoadError ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-full w-full rounded-full"
          resizeMode="cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <View className="h-16 w-16 rounded-full border border-gray-300 items-center justify-center bg-gray-200">
          <Ionicons name="person" size={32} color="#0C4A6E" />
        </View>
      )}
    </View>
  );
};

const RealTimeIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (isConnected) {
      pulse.start();
    } else {
      pulse.stop();
      opacity.setValue(1);
    }

    return () => pulse.stop();
  }, [isConnected, opacity]);

  return (
    <View className="absolute bottom-4 right-4">
      <Animated.View
        className="flex-row items-center bg-white rounded-full px-3 py-2 shadow-lg"
        style={{ opacity }}
      >
        <View
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <Text className="text-xs text-gray-600">
          {isConnected ? "Real-time" : "Offline"}
        </Text>
      </Animated.View>
    </View>
  );
};

const MarqueeText: React.FC<MarqueeTextProps> = ({ text, style }) => {
  const screenWidth = Dimensions.get("window").width;
  const containerWidth = screenWidth * 0.7;

  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState<number>(0);
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
  }, [textWidth, containerWidth, translateX]);

  const handleTextLayout = (e: LayoutChangeEvent) => {
    setTextWidth(e.nativeEvent.layout.width);
  };

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
          onLayout={handleTextLayout}
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