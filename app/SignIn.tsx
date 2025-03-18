import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text>Ini adalah halaman Sign In</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
})