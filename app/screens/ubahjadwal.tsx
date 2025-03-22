import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Background from "../components/background";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import Navbar from "../components/navbar";




const { width } = Dimensions.get("window");

export default function ChatScreen() {
  const router = useRouter();
  let today = new Date();
  const [selected, setSelected] = useState<DateType>();

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View className="flex flex-row justify-between items-center mb-4 w-full px-5  py-5 pt-10">
              <View className="flex flex-row items-center">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="flex flex-row items-center"
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color="#025F96"
                  />
                </TouchableOpacity>
                <Text className="text-skyDark font-bold text-xl">
                  Zuditanit
                </Text>
              </View>
              <Image
                className="h-10 w-12"
                source={require("../../assets/images/logo.png")}
                resizeMode="contain"
              />
            </View>

            {/* Body */}

            <DateTimePicker
              mode="single"
              date={selected}
              onChange={({ date }) => setSelected(date)}
              minDate={today} // Set the minimum selectable date to today
              enabledDates={(date) => dayjs(date).day() === 1} // Enable only Mondays (takes precedence over disabledDates)
              disabledDates={(date) => [0, 6].includes(dayjs(date).day())} // Disable weekends
            />

            {/* Chat Input */}
            <Navbar />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Background>
  );
}
