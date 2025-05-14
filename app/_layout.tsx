import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css"


export default function RootLayout() {
  return (
    <>
      {/* <StatusBar hidden={true} /> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="screens/signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
