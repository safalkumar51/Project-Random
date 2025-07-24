import { StyleSheet, Image } from 'react-native';
import React from 'react';

const Avatar = ({
  uri,
  size = 45,
  rounded = true,
  style = {},
}) => {
  return (
    <Image
      source={{ uri }}
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded ? size / 2 : 6,
        },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
   
    borderColor: 'red',
    borderWidth: 1,
  },
});
