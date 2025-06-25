import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import moment from "moment";
import { io } from "socket.io-client";
import { BASE_URL, BASE_URL2 } from "@env";

interface User {
  nama_dokter: string;
  role: string;
}

interface ChatItem {
  _id: string;
  participant: {
    _id: string;
    nama: string;
    foto_profil: string | null;
  };
  lastMessage: string;
  lastMessageDate: string;
  status: 'berlangsung' | 'selesai';
}

export class HomeViewModel {
  useHome = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);
    const [dokterId, setDokterId] = useState<string | null>(null);
    const [chatList, setChatList] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [socket, setSocket] = useState(null);

    // Initialize Socket.IO connection
    useEffect(() => {
      if (dokterId) {
        const socketInstance = io(`${BASE_URL2}`, {
          transports: ["websocket"],
        });
        
        setSocket(socketInstance);

        // Join room untuk dokter
        socketInstance.emit("joinRoom", dokterId);

        // Listen untuk chat message baru
        socketInstance.on("chat message", (newMessage) => {
          console.log("[DEBUG] New message received in HomeScreen:", newMessage);
          
          // Update chat list ketika ada pesan baru
          if (newMessage.receiverId === dokterId || newMessage.senderId === dokterId) {
            refreshChatList();
          }
        });

        // Listen untuk update chat list
        socketInstance.on("chatListUpdate", (data) => {
          console.log("[DEBUG] Chat list update received:", data);
          refreshChatList();
        });

        return () => {
          socketInstance.disconnect();
        };
      }
    }, [dokterId]);

    // Utility function untuk membuat URL gambar
    const getImageUrl = (imagePath: string | null | undefined): string | null => {
      if (!imagePath) return null;
      
      if (imagePath.startsWith("http")) {
        return imagePath;
      }
      
      const baseUrlWithoutApi = BASE_URL.replace("/api", "");
      const cleanPath = imagePath.startsWith("/") 
        ? imagePath.substring(1) 
        : imagePath;
      
      return `${baseUrlWithoutApi}/${cleanPath}`;
    };

    // Fetch chat list dari API
    const fetchChatList = async (userId: string, token: string) => {
      try {
        const response = await axios.get(`${BASE_URL}/chatlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrichedChatList = response.data.map((chat: any) => ({
          ...chat,
          nama_masyarakat: chat.participant?.nama || "Pasien",
          foto_profil_masyarakat: getImageUrl(chat.participant?.foto_profil),
          id_masyarakat: chat.participant?._id || "",
          lastMessageDate: chat.lastMessageDate || new Date().toISOString(),
        }));

        setChatList(enrichedChatList);
      } catch (error) {
        console.log("Gagal ambil chat list", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    // Refresh chat list tanpa loading indicator
    const refreshChatList = async () => {
      try {
        const storedId = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("userToken");
        const cleanedId = storedId?.replace(/"/g, "");

        if (cleanedId && token) {
          await fetchChatList(cleanedId, token);
        }
      } catch (error) {
        console.log("Gagal refresh chat list", error);
      }
    };

    // Filter chats berdasarkan tab
    const filterChatsByTab = (tab: string, chats: ChatItem[]) => {
      if (!chats || !Array.isArray(chats)) return [];

      const now = moment();
      return chats.filter((chat) => {
        try {
          const lastDate = moment(chat.lastMessageDate);
          const diffDays = now.diff(lastDate, "days");
          return tab === "Berlangsung" ? diffDays <= 1 : diffDays > 1;
        } catch (e) {
          console.warn("Error processing chat date:", chat.lastMessageDate);
          return false;
        }
      });
    };

    // Fetch user data dan chat list
    const fetchUserData = async () => {
      try {
        const storedId = await SecureStore.getItemAsync("userId");
        const token = await SecureStore.getItemAsync("userToken");
        const cleanedId = storedId?.replace(/"/g, "");

        if (!cleanedId || !token) {
          setLoading(false);
          return;
        }

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
          await handleLogout();
          return;
        }

        setUserData(response.data);
        setDokterId(cleanedId);
        await fetchChatList(cleanedId, token);
        
      } catch (error) {
        console.log("Gagal ambil data user", error);
        setRefreshing(false);
        setLoading(false);
      }
    };

    // Handle pull to refresh
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchUserData();
    }, []);

    // Handle logout
    const handleLogout = async () => {
      try {
        // Disconnect socket before logout
        if (socket) {
          socket.disconnect();
        }
        
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userId");
        router.replace("/screens/signin");
      } catch (error) {
        console.log("Error during logout:", error);
      }
    };

    // Navigate to chat
    const navigateToChat = (chat: ChatItem) => {
      if (dokterId && chat.participant?._id) {
        router.push({
          pathname: "/chat/[id]",
          params: {
            senderId: dokterId,
            receiverId: chat.participant._id,
          },
        });
      } else {
        console.warn("Data participant tidak lengkap:", chat);
      }
    };

    // Format date untuk display
    const formatDate = (dateString: string) => {
      return moment(dateString).format("DD/MM/YY");
    };

    // Cleanup socket on unmount
    useEffect(() => {
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [socket]);

    return {
      // State
      userData,
      dokterId,
      chatList,
      loading,
      refreshing,
      
      // Functions
      fetchUserData,
      onRefresh,
      navigateToChat,
      formatDate,
      getImageUrl,
      filterChatsByTab,
      refreshChatList,
    };
  };
}