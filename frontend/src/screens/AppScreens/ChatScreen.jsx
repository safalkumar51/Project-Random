import React, { useState, useEffect, useRef } from 'react';
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
import BackButton from '../../components/BackButton';
import ChatCard from '../../components/ChatCard';
import { socket } from '../../utils/socket';
import baseURL from '../../assets/config';
import { addMessages, addSingleMessage, clearMessages } from '../../redux/slices/chatSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatScreen = ({ route }) => {
    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const { otherId, name, avatar, userId } = route.params;
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.messages);

    const [text, setText] = useState('');

    const pageNumber = useRef(1);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();


    const handleScroll = (event) => {
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
    }

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
                dispatch(addMessages({page, data: response.data.chats}))
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
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
            setChats(prev => [...prev, chat]);
        };
        socket.off('receive_chat', handleRequest); // prevent duplicates
        socket.on('receive_chat', handleRequest);
        fetchChats(1);

        return () => {
            socket.off('receive_chat', handleRequest);
        }
    }, [otherId]);

    // if user reaches end to flatlist loadmore
    const loadMore = () => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchChats(pageNumber.current + 1);
        }
    };

    const sendMessage = async () => {
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

                    Alert.alert(response.data.message);
                    setChats((prev) => [...prev, response.data.chat]);

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

    const renderItem = ({ item }) => {
        return (
            <ChatCard
                otherId={otherId}
                id={`${item.from}`}
                avatar={avatar}
                message={item.message}
                time={dayjs(item.createdAt).fromNow()}
            />
        );
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
                            <AnimatedFlatList
                                data={chats}
                                keyExtractor={(item) => item._id}
                                renderItem={renderItem}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}

                                // to run loadmore function when end is reached for infinite scrolling
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}

                                // to display loading as footer
                                ListFooterComponent={loading.current && <ActivityIndicator />}
                                showsVerticalScrollIndicator={false}

                                contentContainerStyle={styles.messagesContainer}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={text}
                                onChangeText={setText}
                                placeholder="Type a message"
                                placeholderTextColor="#888"
                            />
                            <TouchableOpacity style={styles.buttonContainer} onPress={sendMessage}>
                                <Text style={styles.buttonText}>SEND</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingBottom: 60,
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
