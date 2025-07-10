import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const messages = [
  {
    id: '1',
    name: 'Nishant',
    time: '9:45 AM',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/3.jpg' },
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Ravi',
    time: 'Yesterday',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/1.jpg' },
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Aryan',
    time: '2 days ago',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/2.jpg' },
    unreadCount: 1,
  },
];


const MessagesScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { name: item.name, avatar: item.avatar })}

        >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.chatDetails}>
                <View style={styles.rowBetween}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                {item.unreadCount > 0 ? (
  <Text style={styles.newMessage}>
    {item.unreadCount} New Message{item.unreadCount > 1 ? 's' : ''}
  </Text>
) : (
  <Text style={styles.message}>No new messages</Text>
)}

            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    chatDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    time: {
        fontSize: 12,
        color: '#888',
    },
    message: {
        fontSize: 14,
        color: '#555',
    },
    newMessage: {
  fontSize: 14,
  color: '#007aff',
  fontWeight: '600',
},

});

export default MessagesScreen;