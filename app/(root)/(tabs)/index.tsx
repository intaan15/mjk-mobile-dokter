import { Text, View } from "react-native";
import {Link} from 'expo-router'
import SplashScreen from "./splashscreen";
import SignIn from "@/app/screens/signin";
import { useState,useEffect } from "react";

export default function Index() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  
  useEffect(() =>{
    setTimeout(()=>{
      setIsShowSplash(false);
    }, 1000)
  });
  
  return <>{isShowSplash ? <SplashScreen/> : <SignIn/>}</>
}
