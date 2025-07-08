import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const messages = [
    {
        id: '1',
        name: 'Nishant',
        lastMessage: 'Yo bro, update?',
        time: '9:45 AM',
        avatar: { uri: 'https://randomuser.me/api/portraits/men/3.jpg' },
    },
    {
        id: '2',
        name: 'Ravi',
        lastMessage: 'Check your mail',
        time: 'Yesterday',
        avatar: { uri: 'https://randomuser.me/api/portraits/men/1.jpg' },
    },
    {
        id: '3',
        name: 'Aryan',
        lastMessage: 'Join Zoom',
        time: '2 days ago',
        avatar: { uri: 'https://randomuser.me/api/portraits/men/2.jpg' },
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
                <Text style={styles.message} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
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
});

export default MessagesScreen;