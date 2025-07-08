import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessagesScreen from '../screens/AppScreens/MessagesScreen.jsx';
import ChatScreen from '../screens/AppScreens/ChatScreen.jsx';


const Stack = createNativeStackNavigator();

const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Chats' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.name })} />
        </Stack.Navigator>
    );
};

export default ChatStackNavigator;