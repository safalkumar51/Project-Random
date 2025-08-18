import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const CommentInput = ({onSend, placeholderText}) => {
    const [text, setText] = useState('');
    const handlePress = () => {
        if (text.trim() !== '') {
            onSend(text); // pass the comment text to parent
            setText('');  // clear input after sending
        }
    };
    return (
        <View style={styles.inputRow}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder={placeholderText}
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
                <Text style={styles.buttonText}>SEND</Text>
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(CommentInput)

const styles = StyleSheet.create({
    inputRow: {
        position: 'absolute',
        bottom: 5, // ⬅️ Distance from the bottom
        left: 10,   // ⬅️ Optional: distance from left
        right: 10,  // ⬅️ Optional: distance from right
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 7,
        marginBottom: 13,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        backgroundColor: "#0d76e6ff",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: 500,
    },
})