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
import { setMyProfile, addMyProfilePosts, setMyProfileError } from '../../redux/slices/myProfileSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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

    const profileIds = useSelector(selectMyProfileIds, shallowEqual);
    const postsIds = useSelector(selectMyPostsIds, shallowEqual);

    const profileData = useMemo(() => profileIds, [profileIds]);
    const postsData = useMemo(() => postsIds, [postsIds]);

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef(1);
    const profileLoading = useRef(false);

    const fetchProfile = async (page = 1) => {
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



                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    const profileData = response.data.profile;
                    const postsData = response.data.posts;
                    dispatch(setMyProfile(profileData));
                    dispatch(setMyPosts(postsData));
                } else {
                    const postsData = response.data.posts;
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

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchProfile(pageNumber.current + 1);
        }
    }, []);

    const listHeader = useMemo(() => {
        if (profileLoading.current) {
            return <ActivityIndicator size="large" />;
        }

        return (
            <>
                <ProfileCard
                    profileId={profileData[0]}
                    counter={0}
                />
            </>
        );
    }, [profileLoading.current, profileData]);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);

    const renderItem = useCallback(({ item }) => {
        return (
            <PostCards
                postId={item}
                counter={3}
            />
        );
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        ref={flatListRef}
                        data={postsData}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingTop: headerHeight }}
                        ListHeaderComponent={listHeader}
                        ListFooterComponent={loading.current && !profileLoading.current && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
    },
});
