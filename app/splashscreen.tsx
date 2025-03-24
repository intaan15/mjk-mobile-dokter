import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import {ScrollView, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); // Ambil lebar layar

export default function SplashScreen() {
  return (
      <SafeAreaView className="flex-1 bg-Warm">
        <StatusBar backgroundColor="#f6f6f6" barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center w-full">
            {/* Logo di pojok kanan atas */}
            <Image
              source={require("./../assets/images/logomjk.png")}
              className="absolute top-0 right-0 m-4 h-16 w-16"
              resizeMode="contain"
            />
  
            {/* Logo utama di tengah */}
            <Image
              source={require("./../assets/images/logo.png")}
              className="h-48 w-96"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold mt-4 text-blue-900">
              MOJOKERTO SEHAT
            </Text>
            <Text className="text-sm text-gray-600">By timtujuh UNEJ</Text>
  
            {/* Iconsplash di bawah */}
            <Image
              source={require("./../assets/images/iconsplash.png")}
              className="absolute bottom-0 h-{120} w-{width}"
              style={{
                width: width, 
              }}
              resizeMode="cover"
            />
  
            {/* Tulisan Version di atas iconsplash */}
            <Text
            className="absolute bottom-10 text-black text-sm font-bold"
            >
              Version 1.0.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

