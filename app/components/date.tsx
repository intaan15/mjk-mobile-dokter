import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DatePickerComponent = ({ label, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Format tanggal ke "Senin, 24 Maret 2025"
  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    onDateChange && onDateChange(date); // Mengirim data ke parent jika ada callback
    setDatePickerVisibility(false);
  };

  return (
    <View className="flex flex-col items-start justify-center">
      <TouchableOpacity
        className="flex flex-row items-center text-skyDark"
        onPress={() => setDatePickerVisibility(true)}
      >
        <MaterialIcons name="date-range" size={24} color="#025F96" />
        <Text className=" ml-4 text-lg text-skyDark">
          {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

export default DatePickerComponent;
