import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert, AppState } from "react-native";
import { BASE_URL } from "@env";

type Jadwal = {
  _id: string;
  dokter_id: {
    _id: string;
    nama_dokter: string;
    spesialis_dokter: string;
    rating_dokter: number;
  };
  masyarakat_id: {
    nama_masyarakat: string;
    foto_profil_masyarakat?: string;
  };
  tgl_konsul: string;
  jam_konsul: string;
  keluhan_pasien: string;
  status_konsul: "menunggu" | "diterima" | "ditolak";
  createdAt: Date;
};

export const useJadwalViewModel = () => {
  const [selectedTab, setSelectedTab] = useState("menunggu");
  const [jadwals, setJadwal] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  
  // Refs untuk interval dan tracking
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastJadwalCountRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  const formatTanggalIndo = (isoDate: string) => {
    const hariIndo = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const bulanIndo = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const tanggal = new Date(isoDate);
    const hari = hariIndo[tanggal.getDay()];
    const tanggalNum = tanggal.getDate();
    const bulan = bulanIndo[tanggal.getMonth()];
    const tahun = tanggal.getFullYear();

    return `${hari}, ${tanggalNum} ${bulan} ${tahun}`;
  };

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

  const fetchJadwal = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true);
      }

      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");

      const response = await axios.get(`${BASE_URL}/jadwal/getall`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔍 DEBUG: Log raw response
      // console.log(
      //   "📊 Raw API Response:",
      //   JSON.stringify(response.data, null, 2)
      // );

      if (userId) {
        const filtered = response.data.filter(
          (jadwal) => jadwal.dokter_id?._id === userId
        );

        // 🔍 DEBUG: Log filtered data
        // console.log("🎯 Filtered Jadwals:", filtered.length);
        
        // Cek apakah ada jadwal baru
        const currentCount = filtered.length;
        const previousCount = lastJadwalCountRef.current;
        
        lastJadwalCountRef.current = currentCount;
        setJadwal(filtered);
      }
    } catch (err: any) {
      console.log("❌ Error fetching jadwals:", err);
      console.log("❌ Error details:", err.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsAutoRefreshing(false);
    }
  };

  // Auto-refresh functionality
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Refresh setiap 30 detik
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        fetchJadwal(true);
      }
    }, 30000); // 30 detik

  }, []);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        isActiveRef.current = true;
        // Refresh immediately when app comes back to foreground
        fetchJadwal(true);
        startAutoRefresh();
      } else {
        isActiveRef.current = false;
        stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [startAutoRefresh, stopAutoRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, [stopAutoRefresh]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJadwal();
  }, []);

  const loadData = async () => {
    await fetchJadwal();
    startAutoRefresh();
  };

  const updateJadwalStatus = async (
    id: string,
    newStatus: Jadwal["status_konsul"]
  ) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Token:", token);

      // Ganti status jadwal langsung pakai PATCH
      const res = await axios.patch(
        `${BASE_URL}/jadwal/update/status/${id}`,
        { status_konsul: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status jadwal berhasil diperbarui:", res.data);

      // Update state lokal agar UI langsung merefleksikan perubahan
      setJadwal((prev) =>
        prev.map((jadwal) =>
          jadwal._id === id ? { ...jadwal, status_konsul: newStatus } : jadwal
        )
      );
    } catch (err: any) {
      console.log(
        "Error saat update status:",
        err.response?.data || err.message
      );
      Alert.alert(
        "Error",
        err.response?.data?.message || "Gagal memperbarui status"
      );
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const getFilteredJadwals = () => {
    return jadwals
      .sort(
        (a, b) =>
          new Date(b.tgl_konsul).getTime() - new Date(a.tgl_konsul).getTime()
      )
      .filter((jadwal) => jadwal.status_konsul === selectedTab);
  };

  // Manual refresh function for pull-to-refresh
  const handleManualRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJadwal();
  }, []);

  // Function to enable/disable auto-refresh
  const toggleAutoRefresh = useCallback((enabled: boolean) => {
    if (enabled) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }, [startAutoRefresh, stopAutoRefresh]);

  return {
    // State
    selectedTab,
    jadwals,
    loading,
    refreshing,
    isAutoRefreshing,

    // Computed
    filteredJadwals: getFilteredJadwals(),

    // Actions
    fetchJadwal,
    loadData,
    onRefresh: handleManualRefresh,
    updateJadwalStatus,
    handleTabChange,
    toggleAutoRefresh,
    startAutoRefresh,
    stopAutoRefresh,

    // Utilities
    formatTanggalIndo,
    getImageUrl,
  };
};