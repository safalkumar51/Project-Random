import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, TextInput, Button, FlatList, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import SharedHeader from '../../components/SharedHeader';
import ChatCard from '../../components/ChatCard';
import { socket } from '../../utils/socket';
import baseURL from '../../assets/config';
//import { addMessages, addSingleMessage, clearMessages } from '../../redux/slices/chatsSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentInput from '../../components/CommentInput';
import { addChat, addChats, setChats } from '../../redux/slices/chatsSlice';

dayjs.extend(relativeTime);

const ChatScreen = ({ route }) => {
    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const { otherId, name, avatar } = route.params;
    const dispatch = useDispatch();

    const pageNumber = useRef(1);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();


    const handleScroll = useCallback((event) => {
        const currentY = event.nativeEvent.contentOffset.y;
        if (currentY > lastScrollY.current) {
            if (scrollDirection.current !== 'down' && currentY > 60) {
                Animated.timing(headerTranslateY, {
                    toValue: -headerHeight - insets.top,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
                scrollDirection.current = 'down';
            }
        } else {
            if (scrollDirection.current !== 'up') {
                Animated.timing(headerTranslateY, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
                scrollDirection.current = 'up';
            }
        }

        lastScrollY.current = currentY;
    }, [headerHeight, insets.top])
    
    const fetchChats = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;
        try {

            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.get(`${baseURL}/chat?page=${page}&otherId=${otherId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                const chatsData = response.data.chats;
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    dispatch(setChats(chatsData));
                } else{
                    dispatch(addChats(chatsData));
                }                
                pageNumber.current = page;
                hasMore.current = page < totalPages.current
            }
            else {
                console.log(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.log('Error fetching requests:', err);
        }

        loading.current = false;
    }

    useEffect(() => {
        const handleRequest = (chat) => {
            dispatch(addSingleMessage(chat));
        };
        socket.off('receive_chat', handleRequest); // prevent duplicates
        socket.on('receive_chat', handleRequest);
        fetchChats(1);

        return () => {
            socket.off('receive_chat', handleRequest);
        }
    }, [otherId]);

    // if user reaches end to flatlist loadmore
    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchChats(pageNumber.current + 1);
        }
    },[]);

    const sendMessage = async (text) => {
        if (text.trim() !== "") {
            try {

                const authToken = await AsyncStorage.getItem('authToken');
                if (!authToken) {
                    navigation.replace("LoginScreen");
                    return;
                }

                const response = await axios.post(`${baseURL}/chat/send`, {
                    otherId,
                    message: text
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });

                if (response.data.success) {
                    dispatch(addChat(response.data.chat));
                } else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }

            } catch (err) {
                console.error('Error fetching requests:', err);
            }

            setText('');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <SharedHeader
                            scrollY={headerTranslateY}
                            title={name}
                        />
                        <View style={{ flex: 1 }}>
                            
                        </View>
                        <CommentInput onSend={sendMessage} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    innerContainer: {
        flex: 1,
        //padding: 10,
        margin: 5,
    },
    messagesContainer: {
        paddingBottom: 80,
        paddingTop: 60
    },
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
        elevation: 7
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
});

export default ChatScreen;
