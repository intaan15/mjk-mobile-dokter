  import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function TabButton({ label, isActive, onPress }) {
    return (
        <TouchableOpacity
        onPress={onPress}
        className={`flex-1 items-center py-3 ${
            isActive ? 'bg-skyDark' : 'bg-white border-l border-skyDark'
        }`}
        >
        <Text className={`font-semibold ${isActive ? 'text-white' : 'text-skyDark'}`}>{label}</Text>
        </TouchableOpacity>
    );
}
