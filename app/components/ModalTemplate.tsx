import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Modal from "react-native-modal";

interface ModalTemplateProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View className="bg-white p-4 rounded-xl relative">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-2 right-4 z-10"
        >
          <Text className="text-2xl text-gray-700">×</Text>
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

export default ModalTemplate;
