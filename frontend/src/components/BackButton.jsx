
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ color = '#000', size = 25, style }) => {
  const navigation = useNavigation();
// univerasl backbutton can be use in any screen
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.goBack()}>
      <MaterialIcons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf:'flex-start',
    padding: 3,
    borderRadius:3,
    backgroundColor:'rgba(0,0,0,0.07)',
    marginRight:20
  },
});
