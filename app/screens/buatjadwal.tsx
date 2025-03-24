import React, { useState } from "react";
import { View, Text } from "react-native";
import DatePickerComponent from "./../components/date";
import TimeRangePicker from "./../components/time";

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Pilih Tanggal:</Text>
      <DatePickerComponent
        label="Tanggal Terpilih"
        onDateChange={(date) => setSelectedDate(date)}
      />
      {selectedDate && (
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Anda memilih: {selectedDate.toLocaleDateString("id-ID")}
        </Text>
      )}
      <TimeRangePicker />
    </View>
  );
};

export default App;
