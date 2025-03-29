import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TimeRangePicker = ({ onTimeSlotsChange, onClose }) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [isPickingStartTime, setIsPickingStartTime] = useState(true);

  const formatTime = (date) => {
    return date
      ? date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
  };

  const generateTimeSlots = () => {
    if (!startTime || !endTime) return [];

    let slots: string[] = [];
    let currentTime = new Date(startTime);
    let end = new Date(endTime);

    // Handle jika endTime lebih kecil dari startTime (melewati tengah malam)
    if (end < currentTime) {
      end.setDate(end.getDate() + 1);
    }

    while (currentTime <= end) {
      slots.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    return slots;
  };

  const handleSave = () => {
    const slots = generateTimeSlots();
    if (slots.length > 0) {
      onTimeSlotsChange(slots); // Send the time slots to parent component
    }
  };

  return (
    <View className="w-full p-4 flex items-center justify-center">
      {/* Close Button in Top Right Corner */}
      <TouchableOpacity
        className="absolute top-0 right-0 p-2"
        onPress={onClose}
      >
        <MaterialIcons name="close" size={20} color="#025F96" />
      </TouchableOpacity>

      <Text className="text-lg mb-4">Pilih Rentang Waktu</Text>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          className="p-2 border border-gray-500 rounded-lg mr-4"
          onPress={() => {
            setIsPickingStartTime(true);
            setPickerVisibility(true);
          }}
        >
          <Text>⏰ {formatTime(startTime)}</Text>
        </TouchableOpacity>
        <Text className="text-lg"> - </Text>
        <TouchableOpacity
          className="p-2 border border-gray-500 rounded-lg ml-4"
          onPress={() => {
            setIsPickingStartTime(false);
            setPickerVisibility(true);
          }}
        >
          <Text>⏰ {formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`p-3 rounded-lg ${
          startTime && endTime ? "bg-skyDark" : "bg-gray-400"
        }`}
        disabled={!startTime || !endTime}
        onPress={handleSave}
      >
        <Text className="text-white text-lg">Simpan</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        is24Hour={true}
        onConfirm={(time) => {
          if (isPickingStartTime) {
            setStartTime(time);
          } else {
            setEndTime(time);
          }
          setPickerVisibility(false);
        }}
        onCancel={() => setPickerVisibility(false)}
      />
    </View>
  );
};

export default TimeRangePicker;
