import React from "react";
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
import { images } from "@/constants/images";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalContent from "@/components/modals/ModalContent";
import ModalTemplate from "@/components/modals/ModalTemplate";
import ImagePickerComponent, {
  useImage,
} from "@/components/picker/imagepicker";
import { useScheduleViewModel } from "../../components/viewmodels/useProfil";

const ScheduleScreen = () => {
  const {
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
  } = useScheduleViewModel();

  const imageContext = useImage();
  const profileImage = imageContext?.profileImage;
  const setImage = imageContext?.setImage;
  const { openGallery, openCamera } = ImagePickerComponent({
    onImageSelected: setImage,
  });

  return (
    <Background>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4 w-full px-5 py-5 pt-10">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={handleBackNavigation}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Atur Jadwal
          </Text>
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
            onDateChange={handleDateChange}
          />
          <View className="w-full h-[2px] bg-skyDark my-2" />

          {/* Modal Pilih Jam */}
          <TouchableOpacity
            className="w-full flex flex-row items-center gap-4"
            onPress={() => openModal("pilihjam")}
          >
            <MaterialCommunityIcons
              name="clock-edit-outline"
              size={24}
              color="#025F96"
            />
            <Text className="text-skyDark text-lg">Atur Jam Praktek</Text>
          </TouchableOpacity>

          {/* Menampilkan Waktu yang Disimpan */}
          {timeSlots.length > 0 && (
            <View className="mt-6 w-full flex items-center">
              <Text className="text-skyDark font-bold mb-2">Jam Terpilih:</Text>
              <View className="mt-2 flex flex-wrap flex-row gap-2 justify-center">
                {timeSlots.map((time, index) => (
                  <View
                    key={index}
                    className="bg-transparent border-2 border-skyDark rounded-lg p-2 min-w-[80px] flex justify-center items-center"
                  >
                    <Text className="text-lg font-semibold text-skyDark">
                      {time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="flex-row">
            {/* Modal Simpan Perubahan */}
            {timeSlots.length > 0 && (
              <View className="flex-1 justify-center items-center mt-6">
                <TouchableOpacity
                  className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                  onPress={() => openModal("konfirm")}
                >
                  <Text className="text-white font-bold">Simpan Perubahan</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Modal Set as Default */}
            <View className="flex-1 justify-center items-center mt-6">
              <TouchableOpacity
                className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                onPress={() => openModal("aturjadwaldefault")}
              >
                <Text className="text-white font-bold px-5">Atur Default</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Template */}
      <ModalTemplate
        isVisible={isModalVisible}
        onClose={closeModal}
      >
        <ModalContent
          modalType={modalType}
          onPickImage={openGallery}
          onOpenCamera={openCamera}
          onClose={closeModal}
          onConfirm={submitSchedule}
          onTimeSlotsChange={handleTimeSlotsChange}
          selectedDate={selectedDate}
        />
      </ModalTemplate>
    </Background>
  );
};

export default ScheduleScreen;