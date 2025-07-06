import React, { useState, useEffect } from 'react';
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

const ChatScreen = ({ route }) => {
  const { name = 'User', avatar } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    let initialMessages = [];

    if (name === 'Jenny Doe') {
      initialMessages = [
  {
    id: '1',
    text: 'Hey there!',
    sender: 'Jenny',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/1.jpg' },
    timestamp: '9:00 AM',
  },
  {
    id: '2',
    text: 'I was just thinking about the app.',
    sender: 'Jenny',
    avatar: { uri: 'https://randomuser.me/api/portraits/men/2.jpg' },
    timestamp: '9:01 AM',
  },
  {
    id: '3',
    text: 'Let’s build something cool.',
    sender: 'Dikshant',
    timestamp: '9:02 AM',
  },
];

    } else {
      initialMessages = [
  {
    id: '1',
    text: `Hi ${name}, welcome to chat.`,
    sender: name,
    avatar,
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: `You can test sending a message now.`,
    sender: 'Dikshant',
    timestamp: '10:31 AM',
  },
];


    }

    setMessages(initialMessages);
  }, [name]);

  const sendMessage = () => {
  if (text.trim()) {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'Dikshant',
      timestamp: formattedTime,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText('');
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
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const isMe = item.sender === 'Dikshant';
              const showAvatar =
                !isMe && (index === 0 || messages[index - 1].sender !== item.sender);

              return (
                <View
  style={[
    styles.messageContainer,
    isMe ? styles.rightAlign : styles.leftAlign,
  ]}
>
  {!isMe && showAvatar && (
    <View style={styles.avatarWrapper}>
      <Image source={item.avatar} style={styles.avatar} />
    </View>
  )}

  <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
    <Text style={[styles.text, isMe && styles.myText]}>{item.text}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  messagesContainer: {
    paddingBottom: 20,
  },
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
    marginLeft: 4,
  },
  myBubble: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    marginRight: 4,
  },
  text: {
    fontSize: 16,
  },
  myText: {
    color: 'white',
  },
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
  avatarWrapper: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  timestamp: {
  fontSize: 10,
  color: 'black',
  marginTop: 4,
  alignSelf: 'flex-end',
},

});

export default ChatScreen;
