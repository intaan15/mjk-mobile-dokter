import { ImageBackground, StyleSheet } from "react-native";
import React from "react";

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      className="flex-1 w-full h-full justify-center items-center"
    >
      {children}
    </ImageBackground>
  );
}
