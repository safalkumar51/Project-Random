import { ActivityIndicator, FlatList, StyleSheet, View, Animated, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, TextInput, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useDispatch, useSelector } from 'react-redux';
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


dayjs.extend(relativeTime);

const PostScreen = ({ route }) => {
    const navigation = useNavigation();
    const { postId } = route.params;

    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const post = useSelector((state) => state.singlePost.post);
    const dispatch = useDispatch();
    const [text, setText] = useState('');

    const pageNumber = useRef(0);
    const loading = useRef(false);
    const hasMore = useRef(true);
    const totalPages = useRef();
    const postLoading = useRef(false);

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
    }

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
                console.log(response.data.post);
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
    const loadMore = () => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchPost(pageNumber.current + 1);
        }
    };

    const handleToggleLike = useCallback((commentId) => {
        dispatch(toggleCommentLike(commentId));
    }, [dispatch]);

    const sendComment = async () => {
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
                    console.log(post.isMine)
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

        return (
            <View>
                {postLoading.current ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <>
                        <PostCards
                            name={post.owner?.name}
                            profileImage={post.owner?.profilepic}
                            time={dayjs(post.createdAt).fromNow()}
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
                )}
            </View>
        );
    }, [post]);

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
                onToggleLike={handleToggleLike}
            />
        )
    }, [handleToggleLike])
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
                                keyExtractor={(item) => item._id}
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
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    value={text}
                                    onChangeText={setText}
                                    placeholder="Write a comment"
                                    placeholderTextColor="#888"
                                />
                                <TouchableOpacity style={styles.buttonContainer} onPress={sendComment}>
                                    <Text style={styles.buttonText}>SEND</Text>
                                </TouchableOpacity>
                            </View>
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
    inputRow: {
        position: 'absolute',
        bottom: 5, // ⬅️ Distance from the bottom
        left: 10,   // ⬅️ Optional: distance from left
        right: 10,  // ⬅️ Optional: distance from right
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 7
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        backgroundColor: "#0d76e6ff",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: 500,
    },
})