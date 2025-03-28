import React from "react";
import { View, StatusBar, Text, TouchableOpacity, Image } from "react-native";
import RNModal from "react-native-modal";
import { images } from "@/constants/images";

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  message: string;
  confirmText: string;
  onConfirm: () => void;
};

const Modal2 = ({
  isOpen,
  toggleModal,
  message,
  confirmText,
  onConfirm,
}: ModalProps) => {
  return (
    <RNModal
      isVisible={isOpen}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.1}
      coverScreen={true}
      style={{ margin: 0 }}
    >
      <StatusBar
        backgroundColor={isOpen ? "rgba(0, 0, 0, 0.55)" : "transparent"}
        barStyle={isOpen ? "light-content" : "dark-content"}
      />

      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="bg-white p-7 rounded-xl w-3/4 justify-center items-center">
          <Text className="text-skyDark font-bold mb-4">{message}</Text>

          <View className="flex flex-row justify-center items-center">
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
    </RNModal>
  );
};

export default Modal2;
