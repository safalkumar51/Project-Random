import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { selectChatsById } from '../redux/selectors/chatsSelectors'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatCard = ({otherId, avatar, chatId}) => {
    const chat = useSelector(state => selectChatsById(state, chatId), shallowEqual);
    const chatData = useMemo(() => chat, [chat]);
    const time = useMemo(() => dayjs(chatData?.createdAt).fromNow(), [chatData?.createdAt]);
    
    return (
        <View
            style={[
                styles.messageContainer,
                chatData.from !== otherId ? styles.rightAlign : styles.leftAlign,
            ]}
        >
            {chatData.from === otherId && (
                <View style={styles.avatarWrapper}>
                    <Image source={{uri: avatar}} style={styles.avatar} />
                </View>
            )}

            <View style={[styles.bubble, chatData.from !== otherId ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.text, chatData.from !== otherId && styles.myText]}>{chatData.message}</Text>
                <Text style={[styles.time, chatData.from !== otherId && styles.myText]}>{time}</Text>
            </View>
        </View>
    )
}

export default React.memo(ChatCard)

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    leftAlign: {
        justifyContent: 'flex-start',
    },
    rightAlign: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    bubble: {
        padding: 10,
        borderRadius: 16,
        maxWidth: '75%',
    },
    theirBubble: {
        backgroundColor: '#e6e6eb',
        //marginLeft: 4,
    },
    myBubble: {
        backgroundColor: '#007aff',
        alignSelf: 'flex-end',
        //marginRight: 4,
    },
    text: {
        fontSize: 16,
    },
    myText: {
        color: 'white',
    },
    avatarWrapper: {
        marginRight: 2,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 30,
    },
    time: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
})