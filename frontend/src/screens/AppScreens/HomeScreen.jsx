import { StyleSheet, View, FlatList, ActivityIndicator, Animated, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { initSocket, socket } from '../../utils/socket';
import { useDispatch} from 'react-redux';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import baseURL from '../../assets/config';
import NavBar from '../../components/NavBar';
import { addFeedPosts, setFeedPosts } from '../../redux/slices/feedSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedList from '../../lists/FeedList';

dayjs.extend(relativeTime);

const HomeScreen = () => {
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
    const totalPages = useRef(1);

    const fetchPosts = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;
        
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.get(`${ baseURL }/user/home?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                const postsData = response.data.posts;

                if (page === 1) {
                    dispatch(setFeedPosts(postsData));
                    totalPages.current = response.data.totalPages;
                } else{
                    dispatch(addFeedPosts(postsData));
                }
                pageNumber.current = page;
                hasMore.current = page < totalPages.current;
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
            }
        } catch (err) {
            console.log('Error fetching posts:', err);
        }
        loading.current = false;
    };

    useEffect(() => {
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY.current > 0) {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    fetchPosts(1);
                }
            }
        });
        return reload;
    }, [navigation, isFocused]);

    useEffect(() => {
        const connectSocket = async () => {
            const authToken = await AsyncStorage.getItem('authToken');
            initSocket(authToken);
        }
        connectSocket();
        fetchPosts(1);

        return () => {
            socket.disconnect(); // ✅ disconnects only on unmount
            console.log('Socket disconnected on component unmount');
        };
    }, []);

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
    },[]);

    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchPosts(pageNumber.current + 1);
        }
    },[]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.HomeContainer}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <FeedList
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

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1,
    },
});
