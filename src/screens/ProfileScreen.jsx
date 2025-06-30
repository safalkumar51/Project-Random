import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.main}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImg}>
        </View>
        <Text style={styles.name}>Some Name</Text>
        <Text style={styles.email}>someone@mail.com</Text>
      </View>
      <View style={styles.bioContainer}>
        <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos sint deleniti modi molestiae! Reiciendis quidem unde dolor neque sunt sint dicta, odit perspiciatis. Nostrum ad sapiente harum qui! Rerum, saepe.</Text>
      </View>
      <View style={styles.postsContainer}>
        <View style={styles.postContainer}>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  profileContainer: {
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: 200,
    height: 200,
    backgroundColor: '#DC143C',
    borderRadius: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: 500,
  },
  email: {
    fontSize: 20,
  },
  bioContainer: {
    padding: 20,
    marginBottom: 10
  },
  postsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    width: width * 0.9,
    // maxHeight: width * 0.9, >> use this !!
    height: width * 0.9,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    marginBottom: 16,
  },
})

// To make the screen scrollable, wrap your content in a ScrollView:
// <ScrollView contentContainerStyle={{ flexGrow: 1 }}> content </ScrollView>
