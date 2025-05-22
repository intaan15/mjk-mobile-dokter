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
      // await SecureStore.deleteItemAsync("userToken");
      // await SecureStore.deleteItemAsync("userId");
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");

      console.log("Retrieved token:", token);
      console.log("Retrieved userId:", userId);


      if (token && userId) {
        setTimeout(() => {
          setIsLoading(false);
          router.replace("/(tabs)/home");
        }, 2000);
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
