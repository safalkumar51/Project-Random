import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { shallowEqual, useSelector } from 'react-redux';
import { selectMessagesById } from '../redux/selectors/messagesSelectors';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MessagesCard = ({ messageId }) => {
    const navigation = useNavigation();
    const message = useSelector(state => selectMessagesById(state, messageId), shallowEqual);
    const messageData = useMemo(() => message, [message]);
    const time = useMemo(() => dayjs(messageData?.updatedAt).fromNow(), [messageData?.updatedAt]);
    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatScreen', { messageId: messageData._id, otherId: messageData.from._id, name: messageData.from.name , avatar: message.from.profilepic })}

        >
            <Image source={{ uri: messageData.from.profilepic }} style={styles.avatar} />
            <View style={styles.chatDetails}>
                <View style={styles.rowBetween}>
                    <Text style={styles.name}>{messageData.from.name}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                {messageData.newMessages > 0 ? (
                    <Text style={styles.newMessage}>
                        {messageData.newMessages} New Message{messageData.newMessages > 1 ? 's' : ''}
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