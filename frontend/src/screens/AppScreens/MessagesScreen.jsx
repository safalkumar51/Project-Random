import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Animated, ActivityIndicator, Alert } from 'react-native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import baseURL from '../../assets/config';
import NavBar from '../../components/NavBar';
import { addMessages, setMessages, upsertMessage } from '../../redux/slices/messagesSlice';
import MessagesList from '../../lists/MessagesList';
import { socket } from '../../utils/socket';

const MessagesScreen = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const flatListRef = useRef(null);
    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch();

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();


    // function to fetch profile( if pageno = 1 ) and user post from backend
    const fetchMessages = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;
        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.get(`${baseURL}/messages?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                const messagesData = response.data.messages;
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    dispatch(setMessages(messagesData));
                } else {
                    dispatch(addMessages(messagesData));
                }
                pageNumber.current = page;
                hasMore.current = page < totalPages.current;
            }
            else {
                console.log(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.log('Error fetching messages:', err);
        }

        loading.current = false;
    };

    useEffect(() => {
        // function to reload or scroll to top 
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY.current > 0) {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    fetchMessages(1);
                }
            }
        });

        return reload;
    }, [navigation, isFocused, lastScrollY]);

    // on mounting fetchposts(pageno = 1)
    useEffect(() => {
        const handleMessage = (message) => {
            dispatch(upsertMessage(message));
        };
        socket.off('receive_message', handleMessage); // prevent duplicates
        socket.on('receive_message', handleMessage);
        fetchMessages(1);

        return () => {
            socket.off('receive_message', handleMessage);
        }
    }, []);

    // Track scroll offset

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

    // if user reaches end to flatlist loadmore
    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchMessages(pageNumber.current + 1);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <MessagesList
                        flatListRef={flatListRef}
                        onScroll={handleScroll}
                        onEndReached={loadMore}
                        loading={loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default React.memo(MessagesScreen);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});
