import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatCard = ({otherId, id, avatar, message, time}) => {
    const isMe = id !== otherId;
    return (
        <View
            style={[
                styles.messageContainer,
                isMe ? styles.rightAlign : styles.leftAlign,
            ]}
        >
            {!isMe && (
                <View style={styles.avatarWrapper}>
                    <Image source={{uri: avatar}} style={styles.avatar} />
                </View>
            )}

            <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.text, isMe && styles.myText]}>{message}</Text>
                <Text style={[styles.time, isMe && styles.myText]}>{time}</Text>
            </View>
        </View>
    )
}

export default ChatCard

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