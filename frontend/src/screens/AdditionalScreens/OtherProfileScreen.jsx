import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import StatusCard from '../../components/StatusCard';
import SharedHeader from '../../components/SharedHeader';
import baseURL from '../../assets/config';



import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { clearOtherProfile, setOtherProfile } from '../../redux/slices/otherProfileSlice';
import { addOtherPosts, clearOtherPosts, setOtherPosts } from '../../redux/slices/otherPostsSlice';
import { clearRequest, setRequest } from '../../redux/slices/requestSlice';
import OtherProfileList from '../../lists/OtherProfileList';

dayjs.extend(relativeTime);

const OtherProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { otherId } = route.params;

    const dispatch = useDispatch();

    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();
    const profileLoading = useRef(false);

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

    const fetchProfile = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.get(`${baseURL}/user/otherprofile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }, params: {
                    page,
                    otherId
                }
            });

            if (response.data.success) {
                const postsData = response.data.posts;
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    const profileData = response.data.profile;
                    const requestData = response.data.request;
                    dispatch(setOtherProfile(profileData));
                    dispatch(setOtherPosts(postsData));
                    dispatch(setRequest(requestData));
                } else {
                    dispatch(addOtherPosts(postsData));
                }

                pageNumber.current = page;
                hasMore.current = page < totalPages.current
            }
            else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error('Error fetching others profile:', err);
        }

        loading.current = false;
    };

    useEffect(() => {
        profileLoading.current = true;
        const loadData = async () => {
            await fetchProfile(1);
        }
        loadData();
        profileLoading.current = false;

        return () => {
            dispatch(clearOtherProfile());
            dispatch(clearOtherPosts());
            dispatch(clearRequest());
            pageNumber.current = 0;
            loading.current = false;
            hasMore.current = true;
            totalPages.current = undefined;
        }
    }, [otherId]);

    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchProfile(pageNumber.current + 1);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <SharedHeader
                    scrollY={headerTranslateY}
                    title="Profile"
                />
                <View style={{ flex: 1 }}>
                    <OtherProfileList
                        onScroll={handleScroll}
                        onEndReached={loadMore}
                        loading={loading}
                        profileLoading={profileLoading}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default React.memo(OtherProfileScreen);

const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
    },
});
