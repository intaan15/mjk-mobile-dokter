import React from "react";
import { Modal, View, Text, TouchableOpacity, StatusBar } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ImageModal({
  visible,
  onClose,
  onPickImage,
  onOpenCamera,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <StatusBar
        translucent
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-5 rounded-xl w-72">
          <Text className="text-lg font-bold mb-3">Pilih Foto</Text>

          {/* Pilih dari Galeri */}
          <TouchableOpacity
            className="flex flex-row items-center gap-2 p-2"
            onPress={onPickImage}
          >
            <MaterialCommunityIcons name="image" size={24} color="black" />
            <Text className="text-lg">Ambil dari Galeri</Text>
          </TouchableOpacity>

          {/* Ambil dari Kamera */}
          <TouchableOpacity
            className="flex flex-row items-center gap-2 p-2"
            onPress={onOpenCamera}
          >
            <MaterialCommunityIcons name="camera" size={24} color="black" />
            <Text className="text-lg">Ambil dari Kamera</Text>
          </TouchableOpacity>

          {/* Tutup Modal */}
          <TouchableOpacity
            className="mt-3 p-2 bg-red-500 rounded-lg"
            onPress={onClose}
          >
            <Text className="text-center text-white font-bold">Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
