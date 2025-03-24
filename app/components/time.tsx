import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TimeRangePicker = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [isPickingStartTime, setIsPickingStartTime] = useState(true);
  const [isSaved, setIsSaved] = useState(false); // Untuk menampilkan label setelah simpan

  // Format waktu ke "HH:mm" (24 jam)
  const formatTime = (date) => {
    return date
      ? date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
  };

  // Hitung total jam kerja
  const calculateTotalTime = () => {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime);
    const end = new Date(endTime);

    let totalMinutes =
      end.getHours() * 60 +
      end.getMinutes() -
      (start.getHours() * 60 + start.getMinutes());

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Jika endTime lebih kecil dari startTime, berarti melewati tengah malam
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} jam ${minutes} menit`;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Pilih Rentang Waktu
      </Text>

      {/* Pilihan Waktu Awal & Akhir */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() => {
            setIsPickingStartTime(true);
            setPickerVisibility(true);
          }}
        >
          <Text>⏰ {formatTime(startTime)}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18 }}> - </Text>

        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginLeft: 10,
          }}
          onPress={() => {
            setIsPickingStartTime(false);
            setPickerVisibility(true);
          }}
        >
          <Text>⏰ {formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Simpan */}
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: startTime && endTime ? "#4CAF50" : "gray",
          borderRadius: 5,
        }}
        disabled={!startTime || !endTime} // Disable tombol jika waktu belum dipilih
        onPress={() => setIsSaved(true)}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Simpan</Text>
      </TouchableOpacity>

      {/* Label Jam Kerja & Total Waktu */}
      {isSaved && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "blue" }}>
            Jam kerja Anda dari {formatTime(startTime)} hingga{" "}
            {formatTime(endTime)}
          </Text>
          <Text style={{ fontSize: 16, color: "green", marginTop: 5 }}>
            Total waktu kerja: {calculateTotalTime()}
          </Text>
        </View>
      )}

      {/* DateTime Picker */}
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
