import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/picker/datepicker";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { images } from "../../constants/images";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "@env";

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
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchJadwal = async () => {
        try {
          const token = await SecureStore.getItemAsync("userToken");
          const storedUserId = await SecureStore.getItemAsync("userId");

          if (!token || !storedUserId) {
            console.log("Token atau userId tidak ditemukan");
            return;
          }

          setUserId(storedUserId);
          const res = await axios.get(
            `${BASE_URL}/dokter/jadwal/${storedUserId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setJadwal(res.data);
          const datesWithSchedule = res.data
            .filter((j) => j.jam && j.jam.length > 0)
            .map((j) => new Date(j.tanggal).toISOString().split("T")[0]);
          setAvailableDates(datesWithSchedule);
        } catch (err) {
          console.log("Error fetching jadwal:", err);
        }
      };
      fetchJadwal();
    }, [])
  );

  useEffect(() => {
    const selected = selectedDate.toISOString().split("T")[0];
    const item = jadwal.find((j) => j.tanggal.split("T")[0] === selected);
    // setAvailableTimes(item?.jam?.filter((j) => j.available) || []);
    setAvailableTimes(item?.jam || []);
  }, [selectedDate, jadwal]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-3 pt-10">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.replace("./homescreen")}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
            </TouchableOpacity>
            <Text className="text-skyDark font-bold text-xl ml-2">Jadwal Dokter</Text>
          </View>
          <Image
            className="h-10 w-12"
            source={images.logo}
            resizeMode="contain"
          />
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
                {selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                :
              </Text>
              {availableTimes.length > 0 ? (
                <View className="flex flex-wrap flex-row gap-2 justify-between">
                  {availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-2 border-2 border-skyDark rounded-md w-[23%] text-center"
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        width: "23%",
                        borderWidth: 2,
                        backgroundColor: slot.available
                          ? selectedTime === slot.time
                            ? "#025F96"
                            : "transparent"
                          : "#D1D5DB",
                        borderColor: slot.available
                          ? selectedTime === slot.time
                            ? "#025F96"
                            : "#025F96"
                          : "#D1D5DB",
                      }}
                    >
                      <Text
                        className="text-lg text-skyDark text-center"
                        style={{
                          color: slot.available
                            ? selectedTime === slot.time
                              ? "white"
                              : "#025F96"
                            : "white",
                          textAlign: "center",
                        }}
                      >
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
