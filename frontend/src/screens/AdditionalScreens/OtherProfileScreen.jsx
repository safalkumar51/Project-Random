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
import { selectOtherPostsIds, selectRequestIds } from '../../redux/selectors/otherProfileSelectors';
import { clearOtherProfile, setOtherProfile } from '../../redux/slices/otherProfileSlice';
import { addManyOtherPosts, clearOtherPosts, setOtherPosts } from '../../redux/slices/otherPostsSlice';
import { clearRequest, setRequest } from '../../redux/slices/requestSlice';

dayjs.extend(relativeTime);

const OtherProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { otherId } = route.params;

    const dispatch = useDispatch();

    const requestIds = useSelector(selectRequestIds, shallowEqual);
    const otherPostsIds = useSelector(selectOtherPostsIds, shallowEqual);
    
    const requestData = useMemo(() => requestIds, [requestIds]);
    const postsData = useMemo(() => otherPostsIds, [otherPostsIds]);

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
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                    const profileData = response.data.profile;
                    dispatch(setOtherProfile(profileData));
                    const postsData = response.data.posts;
                    dispatch(setOtherPosts(postsData));
                    const requestData = response.data.request;
                    dispatch(setRequest(requestData));
                } else {
                    const postsData = response.data.posts;
                    dispatch(addManyOtherPosts(postsData));
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

    console.log(postsData);
    useEffect(() => {
        console.log("fuck fuck");
    },[])

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    const listHeader = useMemo(() => {
        if (!otherId || profileLoading.current) {
            return <ActivityIndicator size="large" />;
        }

        return (
            <>
                <ProfileCard
                    profileId={otherId}
                    counter={1}
                />
                <StatusCard
                    requestId={requestData[0]}
                />
            </>
        );
    }, [otherId, profileLoading.current, requestData]);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);

    const renderItem = useCallback(({ item }) => <PostCards postId={item} counter={4} /> , []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <SharedHeader
                    scrollY={headerTranslateY}
                    title="Profile"
                />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        data={postsData}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}

                        onScroll={handleScroll}
                        scrollEventThrottle={16}

                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}

                        // this makes navbar sticky
                        ListHeaderComponent={listHeader}

                        // to display loading as footer
                        ListFooterComponent={loading.current && !profileLoading.current && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
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
