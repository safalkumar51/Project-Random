import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Animated,
    Alert,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavBar from '../../components/NavBar';
import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import baseURL from '../../assets/config';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { selectMyPostsIds, selectMyProfileIds } from '../../redux/selectors/myProfileSelectors';
import { setMyProfile } from '../../redux/slices/myProfileSlice';
import { addMyPosts, setMyPosts } from '../../redux/slices/myPostsSlice';
import MyProfileList from '../../lists/MyProfileList';

dayjs.extend(relativeTime);


const ProfileScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);

    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');

    const dispatch = useDispatch();

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef(1);
    const profileLoading = useRef(false);

    const fetchProfile = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;
        loading.current = true;

        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.get(`${baseURL}/user/profile?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                const postsData = response.data.posts;
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    const profileData = response.data.profile;
                    dispatch(setMyProfile(profileData));
                    dispatch(setMyPosts(postsData));
                } else {
                    dispatch(addMyPosts(postsData));
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
            console.error('Error fetching profile:', err);
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
    }, []);

    useEffect(() => {
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY.current > 0) {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    fetchProfile(1);
                }
            }
        });
        return reload;
    }, [navigation, isFocused]);

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
            fetchProfile(pageNumber.current + 1);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <MyProfileList
                        flatListRef={flatListRef}
                        onScroll={handleScroll}
                        onEndReached={loadMore}
                        loading={loading}
                        profileLoading={profileLoading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
    },
});
