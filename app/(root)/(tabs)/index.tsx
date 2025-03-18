import { Text, View } from "react-native";
import {Link} from 'expo-router'
import SplashScreen from "./splashscreen";
import SignIn from "@/app/signin";
import { useState,useEffect } from "react";

export default function Index() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  
  useEffect(() =>{
    setTimeout(()=>{
      setIsShowSplash(false);
    }, 3000)
  });
  
  return <>{isShowSplash ? <SplashScreen/> : <SignIn/>}</>
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   {/* <Text className=" text-red-300 font-bold underline text-2xl">Edit app/index.tsx to edit this screen.</Text> */}
    //   <Link href="/SignIn" className="underline font-extrabold text-4xl"> Splash Screen</Link>
    //   {/* <Link href="/Explore"> Masuk</Link>
    //   <Link href="/Profile"> Masuk</Link>
    //   <Link href="/properties/1"> Masuk</Link> */}
    // </View>
}
