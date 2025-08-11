import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addMessages, addSingleMessage, clearMessages } from '../../redux/slices/chatSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { name = 'User', avatar, userId } = route.params || {};
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);

  const [text, setText] = useState('');

  const fetchChatMessages = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;

      const response = await axios.get(
        `http://10.0.2.2:4167/chat/${userId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        dispatch(addMessages({ page: 1, data: response.data.messages }));
      }
    } catch (err) {
      console.log('Error fetching chat:', err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    return () => {
      dispatch(clearMessages());
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Optimistic update
    const newMessage = {
      _id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: formattedTime,
    };
    dispatch(addSingleMessage(newMessage));
    setText('');

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;

      await axios.post(
        `http://10.0.2.2:4167/chat/${userId}`,
        { text },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (err) {
      console.log('Error sending message:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Chat with {name}</Text>

          <FlatList
            data={messages}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item, index }) => {
              const isMe = item.sender === 'me';
              const showAvatar =
                !isMe &&
                (index === 0 || messages[index - 1].sender !== item.sender);

              return (
                <View
                  style={[
                    styles.messageContainer,
                    isMe ? styles.rightAlign : styles.leftAlign,
                  ]}
                >
                  {!isMe && showAvatar && (
                    <View style={styles.avatarWrapper}>
                      <Image source={{ uri: avatar?.uri }} style={styles.avatar} />
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.myBubble : styles.theirBubble,
                    ]}
                  >
                    <Text style={[styles.text, isMe && styles.myText]}>
                      {item.text}
                    </Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message"
              placeholderTextColor="#888"
            />
            <Button title="Send" onPress={sendMessage} color="#007aff" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  innerContainer: { flex: 1, padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  messagesContainer: { paddingBottom: 20 },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  bubble: { padding: 10, borderRadius: 16, maxWidth: '75%' },
  theirBubble: { backgroundColor: '#e6e6eb', marginLeft: 4 },
  myBubble: { backgroundColor: '#007aff', alignSelf: 'flex-end', marginRight: 4 },
  text: { fontSize: 16 },
  myText: { color: 'white' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
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
  avatarWrapper: { marginRight: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  timestamp: { fontSize: 10, color: 'black', marginTop: 4, alignSelf: 'flex-end' },
});

export default ChatScreen;
