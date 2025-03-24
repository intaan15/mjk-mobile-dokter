import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        {label}: {formatDate(selectedDate)}
      </Text>
      <Button
        title="Pilih Tanggal"
        onPress={() => setDatePickerVisibility(true)}
      />
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
