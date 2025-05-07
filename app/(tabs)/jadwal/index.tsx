import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/picker/datepicker"; 
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

type Jadwal = {
  tanggal: string;
  jam: { time: string; available: boolean }[];
};

type AvailableTime = {
  time: string;
  available: boolean;
};

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]); 
  const [userId, setUserId] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userIdFromStore = await SecureStore.getItemAsync('userId');
        if (userIdFromStore) {
          setUserId(userIdFromStore);
        } else {
          console.log("userId tidak ditemukan di SecureStore");
        }
      } catch (error) {
        console.error("Error fetching userId from SecureStore:", error);
      }
    };
    
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`https://mjk-backend-production.up.railway.app/api/dokter/jadwal/${userId}`)
        .then((res) => {
          setJadwal(res.data); 
          const datesWithSchedule = res.data
            .filter(j => j.jam && j.jam.length > 0) 
            .map(j => new Date(j.tanggal).toISOString().split("T")[0]);
          setAvailableDates(datesWithSchedule);
        })
        .catch((err) => console.log("Error fetching jadwal:", err));
    }
  }, [userId]);

  useEffect(() => {
    const selected = selectedDate.toISOString().split("T")[0];
    const item = jadwal.find((j) => j.tanggal.split("T")[0] === selected);
    setAvailableTimes(item?.jam?.filter((j) => j.available) || []); 
  }, [selectedDate, jadwal]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("./homescreen")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Jadwal Dokter
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="px-6 py-4 mt-[-30px]"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-1 flex-col p-2">
          <DatePickerComponent
            label="Pilih Tanggal"
            onDateChange={handleDateChange}
            availableDates={availableDates} 
          />
          <View className="w-full h-[2px] bg-skyDark mt-1" />

          {/* Menampilkan Jadwal */}
          {selectedDate && (
            <View className="mt-4">
              <Text className="text-lg font-bold text-skyDark mb-2">
                Jam Tersedia ({selectedDate?.toLocaleDateString()}):
              </Text>
              {availableTimes.length > 0 ? (
                <View className="flex flex-wrap flex-row gap-2 justify-between">
                  {availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-2 border-2 border-skyDark rounded-md w-[23%] text-center"
                    >
                      <Text className="text-lg text-skyDark text-center">
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic mt-2">
                  Tidak ada jadwal tersedia
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

export default ScheduleScreen;
