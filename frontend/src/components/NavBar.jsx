import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const NavBar = () => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.randomBtn}>
                <Text style={styles.randomTxt} onPress={() => { navigation.navigate("") }}>Random</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn}>
                <MaterialIcons name="dehaze" size={40} color='#2c2c2c' />
            </TouchableOpacity>
        </View>
    )
}

export default NavBar

const styles = StyleSheet.create({
    navBar: {
        height: width * 0.13,
        backgroundColor: '#fff',
        width:"100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 4, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        width: width * 0.97,
       // marginHorizontal: 5,
       // marginVertical: 2,
        borderRadius: 8,
        marginBottom:20,
    },
    randomBtn: {
        flex: 0.4,
    },
    randomTxt: {
        color: 'black',
        fontSize: 30,
        fontWeight: 500,
    },
    menuBtn: {
        flex: 0.2,
        alignItems: 'flex-end'
      },
})