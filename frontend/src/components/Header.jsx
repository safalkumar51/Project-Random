
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from './BackButton';


const Header = ({ title,showBackButton = false ,mb=10 }) => {
    return (
        <View style={[styles.container,{marginBottom:mb}]}>
            <BackButton />
            <Text style={styles.title}>{title || ""}</Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
    },
    title: {
       // alignSelf:'center',
        justifyContent:'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
    },
});
