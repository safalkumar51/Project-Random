import { StyleSheet, View, FlatList, ActivityIndicator, Animated, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCards from '../../components/PostCards';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { initSocket, socket } from '../../utils/socket';
import baseURL from '../../assets/config';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedPosts } from '../../redux/slices/feedSlice';

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
    const posts = useSelector((state) => state.feed.posts);
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
            );

            if (response.data.success) {
                const postsData = response.data.posts;
                dispatch(addFeedPosts({ page, posts: postsData }));

                if (page === 1) {
                    totalPages.current = response.data.totalPages;
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

    const loadMore = () => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchPosts(pageNumber.current + 1);
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
                //name={item.owner?.name}
                //time={dayjs(item.createdAt).fromNow()}
                //profileImage={item.owner?.profilepic}
                //postText={item.caption}
                //postImage={item.postpic}
                //ownerId={item.owner?._id}
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
            <View style={styles.HomeContainer}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        ref={flatListRef}
                        data={data}
                        keyExtractor={(item) => item.id}
                        //data={posts}
                        //keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        //onEndReached={loadMore}
                        //onEndReachedThreshold={0.5}

                        // to display loading as footer
                        //ListFooterComponent={loading && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1,
    },
});
