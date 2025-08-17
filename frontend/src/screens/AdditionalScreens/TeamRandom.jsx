import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const members = [
   {
     id: '1',
    name: 'Safal Kumar',
     avatar: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
    github: 'https://github.com/safalkumar51',
    instagram: 'https://www.instagram.com/_manish49_/?hl=en',
    linkedin: 'https://www.linkedin.com/in/safal-kumar-279799281/',
  },
   {
     id: '2',
    name: 'Dikshant Alhawat',
     avatar: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
    github: 'https://github.com/dikshantahlawat',
    instagram: 'https://www.instagram.com/dikshant.ahlawat_/?hl=en',
    linkedin: 'https://www.linkedin.com/in/dikshant-ahlawat-b435a41b3/',
  },

   {
     id: '3',
    name: 'Ashutosh Singh',
     avatar: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
    github: 'https://github.com/Ashutosh100404',
    instagram: 'https://www.instagram.com/ashutosh_singh_sambyal/?hl=en',
    linkedin: 'https://www.linkedin.com/in/dikshant-ahlawat-b435a41b3/',
  },
 
  
  {
     id: '4',
    name: 'Manish Kumar',
     avatar: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
    github: 'https://github.com/manish00355',
    instagram: 'https://www.instagram.com/_manish49_/?hl=en',
    linkedin: 'hhttps://www.linkedin.com/in/manish-kumar-a53548249/',
  },
  {
     id: '5',
    name: 'Pao sahab',
     avatar: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
    github: 'https://github.com/manish00355',
    instagram: 'https://www.instagram.com/_manish49_/?hl=en',
    linkedin: 'hhttps://www.linkedin.com/in/manish-kumar-a53548249/',
  },

]

const TeamRandom = () => {
   
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };
       const renderMember = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
       
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => openLink(item.github)}>
            <Icon name="github" size={24} color="#gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(item.instagram)}>
            <Icon name="instagram" size={24} color="#gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(item.linkedin)}>
            <Icon name="linkedin" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Developer Team</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export  default TeamRandom;

const styles = StyleSheet.create({
  container: {
     flex: 1,
     // backgroundColor: '#fff',
       padding: 16
       },

  title: { 
    fontSize: 22,
     fontWeight: 'bold',
      marginBottom: 16, 
      textAlign: 'center'
     },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
  },
  avatar: {
     width: 60, 
     height: 60, 
     borderRadius: 30,
      marginRight: 12
     },
  info: { 
    flex: 1
   },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold'
   },
  role: { 
    fontSize: 14,
     color: 'gray',
      marginBottom: 8
     },
  socialRow: { 
    flexDirection: 'row',
     gap: 12 
    },
});