import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const MessagesCard = ({ name, avatar, time, unreadCount, otherId }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { otherId, name, avatar })}

        >
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.chatDetails}>
                <View style={styles.rowBetween}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                {unreadCount > 0 ? (
                    <Text style={styles.newMessage}>
                        {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
                    </Text>
                ) : (
                    <Text style={styles.message}>No new messages</Text>
                )}

            </View>
        </TouchableOpacity>
    )
}

export default MessagesCard

const styles = StyleSheet.create({
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
})