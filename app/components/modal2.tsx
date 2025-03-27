import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { images } from "@/constants/images";
import TimeRangePicker from "./time";

const { width, height } = Dimensions.get("window");

function Modal2({
  isModalVisible,
  toggleModal,
  message,
  confirmText,
  onConfirm,
}) {
  return (
    <Modal
      isVisible={isModalVisible}
      deviceWidth={width}
      deviceHeight={height}
      style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      backdropOpacity={0.5} // Opacity latar belakang
    >
      <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.5)" />

      <View className="flex-1 justify-center items-center w-full">
        <View className="absolute w-full h-full" />
        <View className="bg-white p-7 rounded-xl w-3/4 justify-center items-center flex-col">
        
          <Text className="text-skyDark font-bold mb-4">{message}</Text>
          
          <View className="flex flex-col justify-center items-center">
            <TouchableOpacity
              onPress={toggleModal}
              className="bg-transparent px-4 py-2 rounded-md"
            >
              <Text className="text-skyDark font-bold">Batal</Text>
            </TouchableOpacity>
            <Image source={images.vline} className="mx-10" />
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                toggleModal();
              }}
              className="bg-transparent px-4 py-2 rounded-md"
            >
              <Text className="text-red-600 font-bold">{confirmText}</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>
      </View>
    </Modal>
  );
}

export default Modal2;
