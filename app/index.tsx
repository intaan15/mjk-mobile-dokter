import { useState, useEffect } from "react";
import SplashScreen from "./splashscreen";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@env";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  
  useEffect(() => {
    const handleStartup = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");
  
      if (token && userId) {
        try {
          const response = await axios.get(`${BASE_URL}/dokter/getbyid/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const user = response.data;
  
          if (user.role === "dokter") {
            console.log("User valid:", user.nama_dokter);
            setTimeout(() => {
              setIsLoading(false);
              router.replace("/(tabs)/home");
            }, 2000);
          } else {
            // Role bukan dokter, logout paksa
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("userId");
            setTimeout(() => {
              setIsLoading(false);
              router.replace("/screens/signin");
            }, 2000);
          }
        } catch (error) {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userId");
          setTimeout(() => {
            setIsLoading(false);
            router.replace("/screens/signin");
          }, 2000);
        }
      } else {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userId");
        setTimeout(() => {
          setIsLoading(false);
          router.replace("/screens/signin");
        }, 2000);
      }
    };
  
    handleStartup();
  }, []);
  

  return <>{isLoading ? <SplashScreen /> : null}</>;
}
