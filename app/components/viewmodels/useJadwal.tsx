import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@env";

type Jadwal = {
  tanggal: string;
  jam: { time: string; available: boolean }[];
};

type AvailableTime = {
  time: string;
  available: boolean;
};

export const useScheduleViewModel = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJadwal = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const storedUserId = await SecureStore.getItemAsync("userId");

      if (!token || !storedUserId) {
        console.log("Token atau userId tidak ditemukan");
        return;
      }

      setUserId(storedUserId);
      const res = await axios.get(`${BASE_URL}/dokter/jadwal/${storedUserId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setJadwal(res.data);

      const datesWithSchedule = res.data
        .filter((j: Jadwal) => j.jam && j.jam.length > 0)
        .map((j: Jadwal) => {
          const parsed = new Date(j.tanggal);
          return parsed.toISOString().split("T")[0];
        });

      setAvailableDates(datesWithSchedule);
    } catch (err) {
      console.log("Error fetching jadwal:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchJadwal();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJadwal();
    setRefreshing(false);
  }, []);

  const handleDateChange = (date: Date) => {
    console.log("Selected date changed:", date);
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string, available: boolean) => {
    if (available) {
      setSelectedTime(time);
      console.log("Waktu dipilih:", time);
    }
  };

  useEffect(() => {
    const selected = selectedDate.toISOString().split("T")[0];
    const item = jadwal.find((j) => j.tanggal.split("T")[0] === selected);
    setAvailableTimes(item?.jam || []);
  }, [selectedDate, jadwal]);

  return {
    // State
    selectedDate,
    jadwal,
    availableTimes,
    selectedTime,
    availableDates,
    userId,
    loading,
    refreshing,
    
    // Actions
    fetchJadwal,
    loadData,
    onRefresh,
    handleDateChange,
    handleTimeSelect,
  };
};