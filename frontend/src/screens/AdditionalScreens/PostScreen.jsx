import { ActivityIndicator, FlatList, StyleSheet, View, Animated, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, TextInput, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

import CommentCard from '../../components/CommentCard'
import PostCards from '../../components/PostCards'
import SharedHeader from '../../components/SharedHeader'
import baseURL from '../../assets/config'
import {
    setSinglePost,
    clearSinglePost,
    toggleLike,
    toggleCommentLike,
    addComment,
} from '../../redux/slices/singlePostSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { toggleFeedComment } from '../../redux/slices/feedSlice';
import { toggleMyProfileComment } from '../../redux/slices/myProfileSlice';
import { toggleOtherProfileComment } from '../../redux/slices/otherProfileSlice';
import CommentInput from '../../components/CommentInput';


dayjs.extend(relativeTime);

const PostScreen = ({ route }) => {
    const navigation = useNavigation();
    const { postId } = route.params;

    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const post = useSelector((state) => state.singlePost.post, shallowEqual);
    const dispatch = useDispatch();

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();
    const postLoading = useRef(false);

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

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    // function to fetch profile( if pageno = 1 ) and user post from backend
    const fetchPost = async (page) => {
        if (page !== 1 && (loading.current || !hasMore.current)) return;

        loading.current = true;

        try{
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }
            const response = await axios.get(`${ baseURL }/post?page=${page}&postId=${postId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                const postData = response.data.post;
                if (page === 1) {
                    totalPages.current = response.data.totalPages;
                }
                dispatch(setSinglePost({ page, post: postData }));
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

        } catch (err) {
            console.error('Error fetching post:', err);
        }
        loading.current = false;
    };

    useEffect(() => {
        postLoading.current = true;
        const loadData = async () => {
            dispatch(clearSinglePost());
            pageNumber.current = 0;
            loading.current = false;
            hasMore.current = true;
            totalPages.current = undefined;
            await fetchPost(1);
        }
        loadData();
        postLoading.current = false;
    }, [postId]);

    // if user reaches end to flatlist loadmore
    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchPost(pageNumber.current + 1);
        }
    }, []);

    const handleToggleCommentLike = useCallback((commentId) => {
        dispatch(toggleCommentLike(commentId));
    }, [dispatch]);

    const sendComment = async (text) => {
        console.log(text);
        if (text.trim() !== "") {
            try {

                const authToken = await AsyncStorage.getItem('authToken');
                if (!authToken) {
                    navigation.replace("LoginScreen");
                    return;
                }

                const response = await axios.post(`${ baseURL }/post/comment`, {
                    postId,
                    text
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });

                if (response.data.success) {
                    dispatch(addComment(response.data.comment));
                    dispatch(toggleFeedComment(postId));
                    if(post.isMine){
                        dispatch(toggleMyProfileComment(postId));
                    } else {
                        dispatch(toggleOtherProfileComment(postId));
                    }

                } else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }

            } catch (err) {
                console.error('Error fetching requests:', err);
            }

            setText('');
        }
    };

    const listHeader = useMemo(() => {
        // Return null or a loading spinner if there's no post data yet
        if (!post) {
            return <ActivityIndicator size="large" />;
        }
        if(postLoading.current){
            return( <ActivityIndicator size="large" /> );
        }

        return (
            <>
                <PostCards
                    name={post.owner?.name}
                    profileImage={post.owner?.profilepic}
                    createdAt={post.createdAt}
                    postText={post.caption}
                    postImage={post.postpic}
                    ownerId={post.owner?._id}
                    postId={post._id}
                    likesCount={post.likesCount}
                    commentsCount={post.commentsCount}
                    isLiked={post.isLiked}
                    isCommented={post.isCommented}
                    isMine={post.isMine}
                />
            </>
        );
    }, [post]);

    const keyExtractor = useCallback((item) => item._id, []);

    const renderItem = useCallback(({ item }) => {
        return (
            <CommentCard
                name={item.commentOwner.name}
                profileImage={item.commentOwner.profilepic}
                createdAt={item.createdAt}
                comment={item.text}
                commentId={item._id}
                commentOwnerId={item.commentOwner?._id}
                commentLikesCount={item.commentLikesCount}
                isCommentLiked={item.isCommentLiked}
                isCommentMine={item.isCommentMine}
                onToggleCommentLike={handleToggleCommentLike}
            />
        )
    }, [handleToggleCommentLike])

    console.log(post);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <SharedHeader
                            scrollY={headerTranslateY}
                            title="Post"
                        />
                        <View style={{ flex: 1 }}>
                            <AnimatedFlatList
                                data={post?.comments}
                                keyExtractor={keyExtractor}
                                renderItem={renderItem}

                                onScroll={handleScroll}
                                scrollEventThrottle={16}

                                // to run loadmore function when end is reached for infinite scrolling
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}

                                // this makes navbar sticky
                                ListHeaderComponent={listHeader}

                                contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 80 }}

                                // to display loading as footer
                                ListFooterComponent={loading.current && !postLoading.current && <ActivityIndicator />}
                                showsVerticalScrollIndicator={false}
                            />
                            <CommentInput onSend={sendComment} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default PostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    innerContainer: {
        flex: 1,
    },
})