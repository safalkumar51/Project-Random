import {
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    Alert,
    Animated,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ActivityCard from '../../components/ActivityCard';
import NavBar from '../../components/NavBar';
import { socket } from '../../utils/socket';
import baseURL from '../../assets/config';

import { addRequest, addRequests, setRequests } from '../../redux/slices/requestsSlice';
import { selectRequestsIds } from '../../redux/selectors/requestsSelectors';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import RequestsList from '../../lists/RequestsList';

dayjs.extend(relativeTime);

const AlertScreen = () => {
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

    const fetchRequests = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;

        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.get(`${baseURL}/connection/requests?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    dispatch(setRequests(response.data.requests));
                }
                else {
                    dispatch(addRequests(response.data.requests));
                }
                pageNumber.current = page;
                hasMore.current = (page < totalPages.current);
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
            }
        } catch (err) {
            console.log('Error fetching requests:', err);
        }

        loading.current = false;
    };

    useEffect(() => {
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY.current > 0) {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    fetchRequests(1);
                }
            }
        });
        return reload;
    }, [navigation, isFocused]);

    // on mounting fetchrequests(pageno = 1)
    useEffect(() => {
        const handleRequest = (data) => {
            dispatch(addRequest(data));
        };
        socket.off('receive_request', handleRequest); // prevent duplicates
        socket.on('receive_request', handleRequest);

        fetchRequests(1);

        return () => {
            socket.off('receive_request', handleRequest);
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
    }, [headerHeight, insets.top]);

    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchRequests(pageNumber.current + 1);
        }
    }, []);
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <RequestsList
                        flatListRef = {flatListRef}
                        onScroll = {handleScroll}
                        onEndReached={loadMore}
                        loading = {loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default React.memo(AlertScreen);

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
});
