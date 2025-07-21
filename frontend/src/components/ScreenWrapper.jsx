import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({children ,bg}) => {
    const{top} = useSafeAreaInsets();
    const paddingTop = top>0 ? top+5 :30;
  return (
    <SafeAreaView styles={{flex:1,paddingTop ,backgroundColor:bg}}>
      {
        children
      }
    </SafeAreaView>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})