import { StyleSheet, View, Animated, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import { useEffect, useRef, useCallback, } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

import SharedHeader from '../../components/SharedHeader'    
import baseURL from '../../assets/config'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentInput from '../../components/CommentInput';
import { clearPost, setPost, toggleComment } from '../../redux/slices/singlePostSlice';
import { addComment, addManyComment, clearComments, setComments } from '../../redux/slices/singlePostCommentsSlice';
import SinglePostList from '../../lists/SinglePostList';


dayjs.extend(relativeTime);

const PostScreen = ({ route }) => {
    const navigation = useNavigation();
    const { postId } = route.params;

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
                const commentsData = response.data.comments;
                if (page === 1) {
                    const postData = response.data.post;
                    totalPages.current = response.data.totalPages;
                    dispatch(setPost(postData));
                    dispatch(setComments(commentsData));
                } else{
                    dispatch(addManyComment(commentsData));
                }
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
            await fetchPost(1);
        }
        loadData();
        postLoading.current = false;

        return () => {
            dispatch(clearPost());
            dispatch(clearComments());
            pageNumber.current = 0;
            loading.current = false;
            hasMore.current = true;
            totalPages.current = undefined;
        }
    }, [postId]);

    const loadMore = useCallback(() => {
        if (!loading.current && hasMore.current && pageNumber.current) {
            fetchPost(pageNumber.current + 1);
        }
    }, []);

    const sendComment = async (text) => {
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
                    dispatch(toggleComment(postId));

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
                            <SinglePostList
                                postId={postId}
                                onScroll={handleScroll}
                                onEndReached={loadMore}
                                loading={loading}
                                postLoading={postLoading}
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