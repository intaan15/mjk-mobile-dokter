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

  // Helper function to check if a date is today or in the future
  const isDateValidForScheduling = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate >= today;
  }, []);

  // Helper function to check if time slots are valid for today
  const areTimeSlotsValidForToday = useCallback((date: Date, slots: string[]): boolean => {
    const today = new Date();
    const selectedDate = new Date(date);
    
    // If not today, no need to check time
    if (selectedDate.toDateString() !== today.toDateString()) {
      return true;
    }
    
    // If today, check if the earliest time slot is after current time
    if (slots.length === 0) return false;
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const earliestSlot = slots[0];
    const [slotHour, slotMinute] = earliestSlot.split('.').map(Number);
    const slotTimeInMinutes = slotHour * 60 + (slotMinute || 0);
    
    return slotTimeInMinutes > currentTimeInMinutes;
  }, []);

  const openModal = useCallback((type: string) => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    if (!isDateValidForScheduling(date)) {
      alert("Tidak dapat mengatur jadwal untuk tanggal yang sudah berlalu");
      return;
    }
    setSelectedDate(date);
    // Reset time slots when date changes
    setTimeSlots([]);
  }, [isDateValidForScheduling]);

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

    if (!areTimeSlotsValidForToday(selectedDate, slots)) {
      alert("Tidak dapat mengatur jadwal untuk waktu yang sudah berlalu hari ini");
      return;
    }

    setTimeSlots(slots);
    setModalVisible(false);
  }, [validateTimeSlots, areTimeSlotsValidForToday, selectedDate]);

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

    if (!isDateValidForScheduling(selectedDate)) {
      alert("Tidak dapat mengatur jadwal untuk tanggal yang sudah berlalu");
      return;
    }

    if (!validateTimeSlots(timeSlots)) {
      alert("Jam akhir tidak boleh lebih awal dari jam mulai");
      return;
    }

    if (!areTimeSlotsValidForToday(selectedDate, timeSlots)) {
      alert("Tidak dapat mengatur jadwal untuk waktu yang sudah berlalu hari ini");
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
  }, [selectedDate, timeSlots, isDateValidForScheduling, validateTimeSlots, areTimeSlotsValidForToday, normalizeDate, checkExistingSchedule, router]);

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
    
    // Helper functions
    isDateValidForScheduling,
    areTimeSlotsValidForToday,
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

  // Helper function to check if a date is today or in the future
  const isDateValidForScheduling = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate >= today;
  }, []);

  // Helper function to check if time slots are valid for today
  const areTimeSlotsValidForToday = useCallback((date: Date, slots: string[]): boolean => {
    const today = new Date();
    const selectedDate = new Date(date);
    
    // If not today, no need to check time
    if (selectedDate.toDateString() !== today.toDateString()) {
      return true;
    }
    
    // If today, check if the earliest time slot is after current time
    if (slots.length === 0) return false;
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const earliestSlot = slots[0];
    const [slotHour, slotMinute] = earliestSlot.split('.').map(Number);
    const slotTimeInMinutes = slotHour * 60 + (slotMinute || 0);
    
    return slotTimeInMinutes > currentTimeInMinutes;
  }, []);

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
      
      // Show ALL existing schedules (past, present, and future) for display purposes
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

  // Handle date selection with validation only for editing
  const handleDateSelection = useCallback((date: Date) => {
    setSelectedDate(date);
    setTimeSlots([]);
  }, []);

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

  // Handle time slots change with validation
  const handleTimeSlotsChange = (slots: string[]) => {
    if (!validateTimeSlots(slots)) {
      return;
    }
    
    // Only validate for editing if the date is today or in the future
    if (isDateValidForScheduling(selectedDate)) {
      if (!areTimeSlotsValidForToday(selectedDate, slots)) {
        alert("Tidak dapat mengatur jadwal untuk waktu yang sudah berlalu hari ini");
        return;
      }
    }
    
    setTimeSlots(slots);
    setModalVisible(false);
  };

  // Check if the selected date can be edited
  const canEditSelectedDate = useCallback((): boolean => {
    return isDateValidForScheduling(selectedDate);
  }, [selectedDate, isDateValidForScheduling]);

  // Submit schedule with validation
  const handleSubmitSchedule = async () => {
    if (!selectedDate || timeSlots.length === 0) {
      alert("Harap pilih tanggal dan jam praktek.");
      return;
    }

    // Validate that the date can be edited
    if (!canEditSelectedDate()) {
      alert("Tidak dapat mengubah jadwal untuk tanggal yang sudah berlalu");
      return;
    }

    if (!validateTimeSlots(timeSlots)) {
      return;
    }

    if (!areTimeSlotsValidForToday(selectedDate, timeSlots)) {
      alert("Tidak dapat mengatur jadwal untuk waktu yang sudah berlalu hari ini");
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

  // Modal handlers with validation for editing actions
  const openModal = (type: string) => {
    // Check if trying to edit a past date
    if ((type === "pilihjam" || type === "konfirm") && !canEditSelectedDate()) {
      alert("Tidak dapat mengubah jadwal untuk tanggal yang sudah berlalu");
      return;
    }
    
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

  // Check if selected date is in the past (for UI indicators)
  const isSelectedDateInPast = useCallback((): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(selectedDate);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < today;
  }, [selectedDate]);

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
    setSelectedDate: handleDateSelection,
    handleTimeSlotsChange,
    handleSubmitSchedule,
    openModal,
    closeModal,
    navigateBack,
    getFormattedSelectedDate,
    
    // Helper functions
    isDateValidForScheduling,
    areTimeSlotsValidForToday,
    canEditSelectedDate,
    isSelectedDateInPast,
  };
};