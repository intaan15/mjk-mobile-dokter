import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@env";
import { useRouter } from "expo-router";

interface User {
  nama_dokter: string;
  username_dokter: string;
  email_dokter: string;
  spesialis_dokter: string;
  str_dokter: string;
  notlp_dokter: string;
  rating_dokter: string;
  foto_profil_dokter: string | null;
}

export const useProfileViewModel = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [modalType, setModalType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");
      console.log("UserId:", userId);
      console.log("Token ada:", token);
      
      const cleanedUserId = userId?.replace(/"/g, "");
      if (cleanedUserId) {
        const response = await axios.get(
          `${BASE_URL}/dokter/getbyid/${cleanedUserId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      }
    } catch (error) {
      console.log("Gagal mengambil data profil:", error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  const handleGantiPassword = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        setModalType("kolompwkosong");
        setModalVisible(true);
        return;
      }

      const res = await axios.patch(
        `${BASE_URL}/dokter/ubah-password`,
        {
          password_lama: passwordLama,
          password_baru: passwordBaru,
          konfirmasi_password_baru: konfirmasiPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalType("ubahberhasil");
      setModalVisible(true);
      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengubah password";

      if (msg.includes("Password lama salah")) {
        setModalType("pwlamasalah");
      } else if (msg.includes("Konfirmasi password tidak cocok")) {
        setModalType("pwtidakcocok");
      } else if (msg.includes("Semua field harus diisi")) {
        setModalType("kolompwkosong");
      } else {
        setModalType("kolompwkosong");
      }
      setModalVisible(true);
    }
  }, [passwordLama, passwordBaru, konfirmasiPassword]);

  const openModal = useCallback((type: string) => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    fetchUserData();
    setModalVisible(false);
  }, [fetchUserData]);

  // Fungsi helper untuk membuat URL gambar lengkap
  const getImageUrl = useCallback((imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const baseUrlWithoutApi = BASE_URL.replace("/api", "");

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;
    return `${baseUrlWithoutApi}/${cleanPath}`;
  }, []);

  return {
    // State
    userData,
    passwordLama,
    passwordBaru,
    konfirmasiPassword,
    modalType,
    isModalVisible,
    refreshing,
    
    // Actions
    setPasswordLama,
    setPasswordBaru,
    setKonfirmasiPassword,
    fetchUserData,
    onRefresh,
    handleGantiPassword,
    openModal,
    closeModal,
    handleUpdateSuccess,
    getImageUrl,
  };
};

export const useScheduleViewModel = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [modalType, setModalType] = useState("info");
  const [isModalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();

  const openModal = useCallback((type: string) => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const validateTimeSlots = useCallback((slots: string[]): boolean => {
    if (slots.length >= 2) {
      const startTime = parseFloat(slots[0].replace(".", ""));
      const endTime = parseFloat(slots[slots.length - 1].replace(".", ""));

      if (startTime > endTime) {
        return false;
      }
    }
    return true;
  }, []);

  const handleTimeSlotsChange = useCallback((slots: string[]) => {
    if (!validateTimeSlots(slots)) {
      alert("Jam akhir tidak boleh lebih awal dari jam mulai");
      return;
    }

    setTimeSlots(slots);
    setModalVisible(false);
  }, [validateTimeSlots]);

  const normalizeDate = useCallback((date: Date): string => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized.toISOString().split("T")[0];
  }, []);

  const checkExistingSchedule = useCallback(async (
    token: string, 
    dokterId: string, 
    selectedDateStr: string
  ): Promise<boolean> => {
    try {
      const cekRes = await axios.get(`${BASE_URL}/dokter/jadwal/${dokterId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const isSameDateExist = cekRes.data.some((jadwal: any) => {
        const jadwalDateStr = normalizeDate(new Date(jadwal.tanggal));
        return jadwalDateStr === selectedDateStr;
      });

      return isSameDateExist;
    } catch (error) {
      console.log("Error checking existing schedule:", error);
      throw error;
    }
  }, [normalizeDate]);

  const submitSchedule = useCallback(async (): Promise<void> => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Harap pilih tanggal dan jam praktek.");
      return;
    }

    if (!validateTimeSlots(timeSlots)) {
      alert("Jam akhir tidak boleh lebih awal dari jam mulai");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");
      
      if (!token || !dokterId) {
        alert("Token atau ID dokter tidak ditemukan.");
        return;
      }

      const jamMulai = timeSlots[0].replace(".", ":");
      const jamSelesai = timeSlots[timeSlots.length - 1].replace(".", ":");
      const selectedDateStr = normalizeDate(selectedDate);

      // Check if schedule already exists for the selected date
      const isScheduleExists = await checkExistingSchedule(token, dokterId, selectedDateStr);
      
      if (isScheduleExists) {
        alert("Jadwal pada tanggal ini sudah ada. Silahkan ubah jadwal anda pada menu ubah jadwal");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/dokter/jadwal/add/${dokterId}`,
        {
          tanggal: selectedDate,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Jadwal berhasil ditambahkan.");
        router.replace("/(tabs)/profil");
      } else {
        alert(`Gagal menambahkan jadwal: ${response.data.message}`);
      }
    } catch (error) {
      console.log("Error submitting schedule:", error);
      alert("Terjadi kesalahan saat menyimpan jadwal.");
    }
  }, [selectedDate, timeSlots, validateTimeSlots, normalizeDate, checkExistingSchedule, router]);

  const handleBackNavigation = useCallback(() => {
    router.replace("/(tabs)/profil");
  }, [router]);

  return {
    // State
    selectedDate,
    timeSlots,
    modalType,
    isModalVisible,
    
    // Actions
    openModal,
    closeModal,
    handleDateChange,
    handleTimeSlotsChange,
    submitSchedule,
    handleBackNavigation,
  };
};
type Jadwal = {
  tanggal: string;
  jam: { time: string; available: boolean }[];
};

type AvailableTime = {
  time: string;
  available: boolean;
};

export const useUbahJadwalViewModel = () => {
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [modalType, setModalType] = useState("info");
  const [isModalVisible, setModalVisible] = useState(false);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch jadwal from API
  const fetchJadwal = async () => {
    try {
      const id = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");
      if (!id || !token) {
        console.log("ID atau token tidak ditemukan.");
        return;
      }

      const res = await axios.get(`${BASE_URL}/dokter/jadwal/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setJadwal(res.data);
      const datesWithSchedule = res.data
        .filter((j) => j.jam && j.jam.length > 0)
        .map((j) => new Date(j.tanggal).toISOString().split("T")[0]);

      setAvailableDates(datesWithSchedule);
    } catch (err) {
      console.log("❌ Error saat fetch jadwal:", err);

      if (axios.isAxiosError(err)) {
        console.log("Axios Error - Response Status:", err.response?.status);
        console.log("Axios Error - Response Data:", err.response?.data);
        console.log("Axios Error - Response Headers:", err.response?.headers);
      } else {
        console.log("Non-Axios error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update available times when date changes
  const updateAvailableTimes = () => {
    if (!selectedDate) return;
    
    const selectedDateStr = selectedDate.toISOString().split("T")[0];
    const jadwalHariIni = jadwal.find((j) => {
      const jadwalDateStr = new Date(j.tanggal).toISOString().split("T")[0];
      return jadwalDateStr === selectedDateStr;
    });

    if (jadwalHariIni && Array.isArray(jadwalHariIni.jam)) {
      setAvailableTimes(jadwalHariIni.jam);
    } else {
      setAvailableTimes([]);
    }
  };

  // Validate time slots
  const validateTimeSlots = (slots: string[]): boolean => {
    if (slots.length >= 2) {
      const startTime = parseFloat(slots[0].replace(".", ""));
      const endTime = parseFloat(slots[slots.length - 1].replace(".", ""));

      if (startTime > endTime) {
        alert("Jam akhir tidak boleh lebih awal dari jam mulai");
        return false;
      }
    }
    return true;
  };

  // Handle time slots change
  const handleTimeSlotsChange = (slots: string[]) => {
    if (!validateTimeSlots(slots)) {
      return;
    }
    setTimeSlots(slots);
    setModalVisible(false);
  };

  // Submit schedule
  const handleSubmitSchedule = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Harap pilih tanggal dan jam praktek.");
      return;
    }

    if (!validateTimeSlots(timeSlots)) {
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const dokterId = await SecureStore.getItemAsync("userId");

      if (timeSlots.length === 1) {
        alert("Pilih minimal 2 slot waktu untuk jam mulai dan selesai");
        return;
      }

      const jamMulai = timeSlots[0].replace(".", ":") + ":00";
      const jamSelesai = timeSlots[timeSlots.length - 1].replace(".", ":") + ":00";
      const tanggal = new Date(selectedDate).toISOString();
      
      const response = await axios.patch(
        `${BASE_URL}/dokter/${dokterId}/jadwal/update`,
        {
          tanggal,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Jadwal berhasil diupdate!");
        router.replace("/(tabs)/profil");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("YEAYYY JADWAL TIDAK ADA SILAHKAN ATUR DULU");
        router.push("/(tabs)/profil/aturjadwal");
      }
    }
  };

  // Modal handlers
  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Navigation
  const navigateBack = () => {
    router.replace("/(tabs)/profil");
  };

  // Format selected date
  const getFormattedSelectedDate = () => {
    return selectedDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Effects
  useEffect(() => {
    fetchJadwal();
  }, []);

  useEffect(() => {
    updateAvailableTimes();
  }, [selectedDate, jadwal]);

  return {
    // State
    selectedDate,
    timeSlots,
    modalType,
    isModalVisible,
    jadwal,
    availableTimes,
    availableDates,
    loading,
    
    // Actions
    setSelectedDate,
    handleTimeSlotsChange,
    handleSubmitSchedule,
    openModal,
    closeModal,
    navigateBack,
    getFormattedSelectedDate,
  };
};