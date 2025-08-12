import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
    Animated,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import StatusCard from '../../components/StatusCard';
import BackButton from '../../components/BackButton';
import SharedHeader from '../../components/SharedHeader';
import baseURL from '../../assets/config';

import {
    setOtherProfile,
    addOtherProfilePosts,
    clearOtherProfile,
    setOtherProfileLoading,
    setOtherProfileError,
} from '../../redux/slices/otherProfileSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const OtherProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { status = '', otherId = '', requestId = '' } = route.params;

    const profile = useSelector((state) => state.otherProfile.profile);
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

    const fetchProfile = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;
        try {
            //console.error("Fetched Error");
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            if (status === 'connected') {
                const response = await axios.get(`${baseURL}/connection/profile`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }, params: {
                        page,
                        otherId
                    }
                });
                if (response.data.success) {
                    if (page === 1) {
                        totalPages.current = response.data.totalPages;
                    }

                    dispatch(addOtherProfilePosts({page, profile: response.data.profile}))
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

            } else {
                const response = await axios.get(`${baseURL}/connection/requestprofile`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }, params: {
                        otherId
                    }
                });
                if (response.data.success) {
                    dispatch(addOtherProfilePosts({ page, profile: response.data.profile }));
                    totalPages.current = 1;
                    pageNumber.current = page;
                    hasMore.current = page < totalPages.current;
                }
                else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
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
            dispatch(clearOtherProfile());
            pageNumber.current = 0;
            loading.current = false;
            hasMore.current = true;
            totalPages.current = undefined;
            fetchProfile(1);
        }
        loadData();
        profileLoading.current = false;
    }, [otherId, status, requestId]);

    const loadMore = () => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchProfile(page + 1);
        }
    };

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
    };

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    const renderItem = ({ item }) => {
        return (
            <PostCards
                name={profile.name}
                time={dayjs(item.createdAt).fromNow()}
                profileImage={profile.profilepic}
                postText={item.caption}
                postImage={item.postpic}
                ownerId={profile._id}
                postId={item._id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
                isLiked={item.isLiked}
                isCommented={item.isCommented}
                isMine={item.isMine}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <SharedHeader
                    scrollY={headerTranslateY}
                    title="Profile"
                />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        data={profile.posts}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}

                        onScroll={handleScroll}
                        scrollEventThrottle={16}

                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}

                        // this makes navbar sticky
                        ListHeaderComponent={() => (
                            <View>
                                {profileLoading.current ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                    <>
                                        <ProfileCard
                                            name={profile.name}
                                            email={profile.email}
                                            profileImage={profile.profilepic}
                                            bio={profile.bio}
                                            status={status}
                                        />
                                        <StatusCard
                                            status={status}
                                            requestId={requestId}
                                            senderId={otherId}
                                        />
                                    </>
                                )}
                            </View>
                        )}

                        // to display loading as footer
                        ListFooterComponent={loading.current && !profileLoading.current && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OtherProfileScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
    },
});
