import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Animated,
    Alert,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';
import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import baseURL from '../../assets/config';
import { useSelector, useDispatch } from 'react-redux';
import {
    setMyProfile,
    addMyProfilePosts,
    setMyProfileError,
} from '../../redux/slices/myProfileSlice';

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
    const profile = useSelector((state) => state.myProfile.profile);

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef(1);

    const fetchProfile = async (page = 1) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;

        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.get(`${ baseURL }/user/profile?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            );
            
            if (response.data.success) {
                
                const profileData = response.data.profile;

                if (page === 1) {
                    //dispatch(setMyProfile(profileData));
                    totalPages.current = response.data.totalPages;
                }
                
                dispatch(addMyProfilePosts({ page, profile: profileData }));
                pageNumber.current = page;
                hasMore.current = page < totalPages.current;
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
                dispatch(setMyProfileError(response.data.message));
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            dispatch(setMyProfileError(err.message));
        }

        loading.current = false;
    };

    useEffect(() => {
        fetchProfile(1);
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

    const loadMore = () => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchProfile(pageNumber.current + 1);
        }
    };



    const renderItem = ({ item }) => {
        return (
            <PostCards
                name={item.name}
                time={item.time}
                profileImage={item.profileImage}
                postText={item.postText}
                postImage={item.postImage}
                //name={profile.name}
                //time={dayjs(item.createdAt).fromNow()}
                //profileImage={profile.profilepic}
                //postText={item.caption}
                //postImage={item.postpic}
                //ownerId={profile._id}
                //postId={item._id}
                //likesCount={item.likesCount}
                //commentsCount={item.commentsCount}
                //isLiked={item.isLiked}
                //isCommented={item.isCommented}
                //isMine={item.isMine}
            />
        );
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        ref={flatListRef}
                        data={profile.posts}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingTop: headerHeight }}
                        ListHeaderComponent={() =>
                            profile && (
                                <ProfileCard
                                    name={profile.name}
                                    email={profile.email}
                                    profileImage={profile.profilepic}
                                    bio={profile.bio}
                                />
                            )
                        }
                        ListFooterComponent={loading.current && <ActivityIndicator />}
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
