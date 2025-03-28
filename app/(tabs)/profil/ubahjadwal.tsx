import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import DatePickerComponent from "../../components/date";
import Button from "../../components/button";
import Background from "@/components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import {Modal1}  from "@/components/modal1";
import Modal3 from "@/components/modal3";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Background>
      <StatusBar
        translucent
        backgroundColor={isModalVisible ? "rgba(0, 0, 0, 0.5)" : "transparent"}
      />
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
          <View>
            <TouchableOpacity className="w-full flex flex-row items-center gap-4">
              <MaterialCommunityIcons
                name="clock-edit-outline"
                size={24}
                color="#025F96"
              />
              <Text className=" text-skyDark text-lg">Ubah Jam Praktek</Text>
            </TouchableOpacity>
            {/* <Modal3 isModalVisible={isModalVisible} toggleModal={toggleModal} /> */}
          </View>

          <View className="flex flex-row flex-wrap gap-2 justify-center mt-2">
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

          <View className="flex-1 justify-center items-center">
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              className="bg-skyDark px-4 py-4 rounded-xl mt-6"
            >
              <Text className="text-white font-bold">Simpan Perubahan</Text>
            </TouchableOpacity>

            <Modal1 isOpen={isOpen}>
              <View className="bg-white p-5 rounded-xl w-3/4 justify-center items-center">
                <Text className="text-skyDark font-bold mb-4">
                  Jadwal Anda Berhasil Diubah
                </Text>
                <Image source={images.line} className="w-full my-3" />
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  className="bg-transparent px-4 py-2 rounded-md"
                >
                  <Text className="text-skyDark font-bold">Oke</Text>
                </TouchableOpacity>
              </View>
            </Modal1>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

export default App;
