import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import DatePickerComponent from "@/components/picker/datepicker";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { images } from "../../constants/images";
import { useFocusEffect } from "@react-navigation/native";
import { useScheduleViewModel } from "../../components/viewmodels/useJadwal";

const ScheduleView = () => {
  const router = useRouter();
  const {
    selectedDate,
    availableTimes,
    selectedTime,
    availableDates,
    loading,
    refreshing,
    loadData,
    onRefresh,
    handleDateChange,
    handleTimeSelect,
  } = useScheduleViewModel();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-3 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Jadwal Dokter
          </Text>
        </View>
        <Image
          className="h-10 w-12"
          source={images.logo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      {loading ? (
        <View className="flex h-3/4 justify-center items-center">
          <ActivityIndicator size="large" color="#025F96" />
          <Text className="mt-2 text-skyDark font-semibold">
            Memuat jadwal . . .
          </Text>
        </View>
      ) : (
        <ScrollView
          className="px-6 py-4 mt-[-30px]"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#025F96"]} // Android
              tintColor="#025F96" // iOS
              title="Memuat ulang jadwal..."
              titleColor="#025F96"
            />
          }
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
                        onPress={() => handleTimeSelect(slot.time, slot.available)}
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
      )}
    </Background>
  );
};

export default ScheduleView;