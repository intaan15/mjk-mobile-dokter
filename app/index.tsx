import { useState, useEffect } from "react";
import SplashScreen from "./splashscreen";
import { useRouter } from "expo-router";

export default function Index() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
      router.replace("/homee"); // Arahkan ke screen pertama di tabs
    }, 1000); // Ganti waktu delay sesuai kebutuhan
  }, []);

  return <>{isShowSplash ? <SplashScreen /> : null}</>;
}
