import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import { useUbahJadwalViewModel } from "../../components/viewmodels/useProfil";

const UbahJadwalView = () => {
  const viewModel = useUbahJadwalViewModel();
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
          <TouchableOpacity onPress={viewModel.navigateBack}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#025F96" />
          </TouchableOpacity>
          <Text className="text-skyDark font-bold text-xl ml-2">
            Ubah Jadwal
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
            onDateChange={viewModel.setSelectedDate}
          />
          <View className="w-full h-[2px] bg-skyDark my-2" />

          {/* Modal Pilih Jam */}
          <TouchableOpacity
            className="w-full flex flex-row items-center gap-4"
            onPress={() => viewModel.openModal("pilihjam")}
          >
            <MaterialCommunityIcons
              name="clock-edit-outline"
              size={24}
              color="#025F96"
            />
            <Text className="text-skyDark text-lg">Ubah Jam Praktek</Text>
          </TouchableOpacity>

          {/* Menampilkan Jadwal */}
          {viewModel.selectedDate && (
            <View className="mt-4">
              <Text className="font-bold text-skyDark mb-2">
                Jadwal hari {viewModel.getFormattedSelectedDate()} :
              </Text>

              {viewModel.loading ? (
                <View className="flex justify-center items-center py-4">
                  <ActivityIndicator size="small" color="#025F96" />
                  <Text className="mt-2 text-skyDark text-sm">
                    Memuat jadwal...
                  </Text>
                </View>
              ) : viewModel.availableTimes.length > 0 ? (
                <View className="flex flex-wrap flex-row gap-2 justify-center">
                  {viewModel.availableTimes.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      className="p-2 border-2 border-skyDark rounded-md min-w-[80px] text-center"
                    >
                      <Text className="text-lg text-skyDark text-center">
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic">
                  Tidak ada jadwal tersedia
                </Text>
              )}
            </View>
          )}

          {/* Menampilkan Waktu yang Disimpan */}
          {viewModel.timeSlots.length > 0 && (
            <View className="mt-6 w-full flex items-center">
              <Text className="text-skyDark font-bold mb-2">Jam Terpilih:</Text>
              <View className="mt-2 flex flex-wrap flex-row gap-2 justify-center">
                {viewModel.timeSlots.map((time, index) => (
                  <View
                    key={index}
                    className="bg-transparent border-2 border-skyDark rounded-md p-2 min-w-[80px] flex justify-center items-center"
                  >
                    <Text className="text-lg text-skyDark">{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="flex-row">
            {/* Modal Simpan Perubahan */}
            {viewModel.timeSlots.length > 0 && (
              <View className="flex-1 justify-center items-center mt-6">
                <TouchableOpacity
                  className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                  onPress={() => viewModel.openModal("konfirm")}
                >
                  <Text className="text-white font-bold">Simpan Perubahan</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Modal Set as Default */}
            <View className="flex-1 justify-center items-center mt-6">
              <TouchableOpacity
                className="bg-skyDark px-4 py-4 rounded-xl items-center w-44"
                onPress={() => viewModel.openModal("ubahjadwaldefault")}
              >
                <Text className="text-white font-bold px-5">Ubah Default</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal Hapus Jadwal */}
          <View className="flex-1 justify-center items-center mt-6">
            <TouchableOpacity
              className="bg-red-600 px-4 py-4 rounded-xl items-center w-44"
              onPress={() => viewModel.openModal("hapusjadwal")}
            >
              <Text className="text-white font-bold px-5">Hapus Jadwal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Template */}
      <ModalTemplate
        isVisible={viewModel.isModalVisible}
        onClose={viewModel.closeModal}
      >
        <ModalContent
          modalType={viewModel.modalType}
          onPickImage={openGallery}
          onOpenCamera={openCamera}
          onClose={viewModel.closeModal}
          onConfirm={viewModel.handleSubmitSchedule}
          onTimeSlotsChange={viewModel.handleTimeSlotsChange}
          selectedDate={viewModel.selectedDate}
        />
      </ModalTemplate>
    </Background>
  );
};

export default UbahJadwalView;