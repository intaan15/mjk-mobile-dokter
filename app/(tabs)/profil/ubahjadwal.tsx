import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import DatePickerComponent from "../../components/date";
import Button from "../../components/button";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();

  return (
    <Background>
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("./homescreen")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">Zuditanit</Text>
        </View>
        <Image
          className="h-10 w-12"
          source={images.logo}
          resizeMode="contain"
        />
      </View>
      {/* main  */}
      <ScrollView
        className="px-6 py-4 mt-[-30px]"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-1 flex-col p-2">
          <View className="w-full">
            <DatePickerComponent
              label="Tanggal Terpilih"
              onDateChange={(date) => setSelectedDate(date)}
            />
          </View>
          <Image source={images.line} className="w-full my-2" />
          <View className="flex flex-row flex-wrap gap-2 justify-center">
            {[
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
            ].map((time, index) => (
              <TouchableOpacity key={index}>
                <Text className="text-skyDark bg-white border border-stone-950 rounded-xl p-2 min-w-[80px] text-center">
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex w-full items-center">
            <Button
              text="Ubah Jadwal"
              variant="success"
              className="w-40 mt-6 text-center"
              onPress={() => router.push("./homescreen")}
            />
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

export default App;
