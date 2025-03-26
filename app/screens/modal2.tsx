import React, { useState } from "react";
import { Button, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {images} from "@/constants/images";

function Modal1() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Button title="Show modal" onPress={toggleModal} />

      <Modal isVisible={isModalVisible}>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-7 rounded-xl w-3/4 justify-center items-center flex-col">
            <Text className=" text-skyDark font-bold mb-4">
              Anda yakin akan menghapus Akun?
            </Text>
            <View className=" flex flex-row justify-center items-center">
              <TouchableOpacity
                onPress={toggleModal}
                className="bg-transparent px-4 py-2 rounded-md"
              >
                <Text className="text-skyDark font-bold">Batal</Text>
              </TouchableOpacity>
              <Image source={images.vline} className="mx-10" />
              <TouchableOpacity
                onPress={toggleModal}
                className="bg-transparent px-4 py-2 rounded-md"
              >
                <Text className="text-red-600 font-bold">Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Modal1;
