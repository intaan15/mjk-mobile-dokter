import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import { images } from "@/constants/images";

function Modal1() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity className=" bg-skyDark py-4 px-8 rounded-xl mt-6" onPress={toggleModal}>
        <Text className="text-white font-bold">Simpan Perubahan</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.7)" />
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-5 rounded-xl w-3/4 justify-center items-center">
            <Text className=" text-skyDark font-bold mb-4">
              Jadwal Anda Berhasil Diubah
            </Text>
            <Image source={images.line} className=" w-full my-3" />
            <TouchableOpacity
              onPress={toggleModal}
              className="bg-transparent px-4 py-2 rounded-md"
            >
              <Text className="text-skyDark font-bold">Oke</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Modal1;
