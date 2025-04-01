import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "@/components/datepicker";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Modal1 } from "@/components/modal1";
import { Modal3 } from "@/components/modal3";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TimeRangePicker from "@/components/timepicker";

const App = () => {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const router = useRouter();

  const handleTimeSlotsChange = (slots) => {
    setTimeSlots(slots);
    setIsModal3Open(false); // Close modal automatically after receiving time slots
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
          <Text className="text-skyDark font-bold text-xl ml-2">Zuditanit</Text>
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
        {/* Tanggal */}
        <View className="flex-1 flex-col p-2">
          <DatePickerComponent
            label="Tanggal Terpilih"
            onDateChange={(date) => setSelectedDate(date)}
          />
          <Image source={images.line} className="w-full my-2" />

          {/* Main */}
          <View>
            <Text className=" text-xl font-bold text-skyDark">halaman ini akan menampilkan list jadwal dokter secara default</Text>
          </View>
          
        </View>
      </ScrollView>
    </Background>
  );
};

export default App;
