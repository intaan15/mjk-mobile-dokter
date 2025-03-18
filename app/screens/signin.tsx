import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Background from "../components/background";
import Button from "../components/button";

export default function SignIn() {
  const router = useRouter();

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full h-full"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo & Title */}
            <View className="items-center mb-6">
              <Image
                className="w-44 h-48"
                source={require("../../assets/images/logo.png")}
                resizeMode="contain"
              />
              <Text className="text-4xl font-bold text-blue-900">Login</Text>
            </View>

            {/* Form */}
            <View className="w-full max-w-sm flex items-center">
              <View className="flex flex-col gap-4 w-full">
                <Text>Username/STR</Text>
                <TextInput
                  placeholder="Enter email address"
                  className="bg-transparent border border-black text-black px-4 py-3 rounded-md"
                  placeholderTextColor="#ccc"
                />
                <Text>Password</Text>
                <TextInput
                  placeholder="Enter password"
                  secureTextEntry
                  className="bg-transparent border border-black text-black px-4 py-3 rounded-md"
                  placeholderTextColor="#ccc"
                />
              </View>

              {/* Tombol Login */}
              <Button
                text="Login"
                variant="success"
                className="w-5/6 mt-6"
                onPress={() => router.push("./homescreen")}
              />

              {/* <Text className="mt-6">Anda tidak memiliki akun? klik Register</Text> */}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Background>
  );
}
