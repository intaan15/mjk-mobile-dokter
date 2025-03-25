import { Stack } from "expo-router";

export default function ProfilLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Profil" }} />
      <Stack.Screen name="ubahjadwal" options={{ title: "Ubah Jadwal" }} />
    </Stack>
  );
}
