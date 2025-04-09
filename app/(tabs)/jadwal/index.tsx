import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/datepicker";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const scheduleByDay = {
  Monday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  Tuesday: ["09:15", "09:45", "10:15", "10:45", "11:15", "11:45"],
  Wednesday: [
    "09:00",
    "09:20",
    "09:40",
    "10:00",
    "10:20",
    "10:40",
    "11:00",
    "11:20",
    "11:40",
  ],
  Thursday: [
    "09:10",
    "09:30",
    "09:50",
    "10:10",
    "10:30",
    "10:50",
    "11:10",
    "11:30",
    "11:50",
  ],
  Friday: [
    "09:05",
    "09:25",
    "09:45",
    "10:05",
    "10:25",
    "10:45",
    "11:05",
    "11:25",
    "11:45",
  ],
  Saturday: ["10:00", "10:30", "11:00", "11:30"],
  Sunday: ["10:15", "10:45", "11:15", "11:45"],
};

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(new Date());
    setAvailableTimes(scheduleByDay[dayOfWeek] || []);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);
    setAvailableTimes(scheduleByDay[dayOfWeek] || []);
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
        {/* Tanggal */}
        <View className="flex-1 flex-col p-2">
          <DatePickerComponent
            label="Pilih Tanggal"
            onDateChange={handleDateChange}
            defaultValue={selectedDate}
          />

          {selectedDate && (
            <View className="mt-4">
              <Text className="text-lg font-bold text-skyDark mb-2">
                Jam Tersedia ({selectedDate?.toLocaleDateString()}):
              </Text>
              <View className="flex flex-wrap flex-row gap-2 justify-between">
                {availableTimes.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-2 border-2 border-skyDark rounded-md w-[23%] text-center"
                  >
                    <Text className="text-lg text-skyDark text-center">
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Background>
  );
};

export default ScheduleScreen;
