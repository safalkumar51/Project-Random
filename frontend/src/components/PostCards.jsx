import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert, Modal } from 'react-native';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import baseURL from '../assets/config';
import { removeFeedPost, toggleFeedLike } from '../redux/slices/feedSlice';
import { selectSinglePostById } from '../redux/selectors/singlePostSelectors';
import { selectFeedPostById } from '../redux/selectors/feedSelectors';
import { removePost, toggleLike } from '../redux/slices/singlePostSlice';
import { selectOtherPostsById } from '../redux/selectors/otherProfileSelectors';
import { toggleOtherPostsLike } from '../redux/slices/otherPostsSlice';
import { selectMyPostsById } from '../redux/selectors/myProfileSelectors';
import { removeMyPost, toggleMyPostLike } from '../redux/slices/myPostsSlice';

dayjs.extend(relativeTime);

const PostCards = ({ postId, counter }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleMenuPress = () => {
        setModalVisible(true);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    const loading = useRef(false);


    const navigation = useNavigation();

    const dispatch = useDispatch();

    let post = {};

    if (counter === 1) {
        post = useSelector(state => selectSinglePostById(state, postId), shallowEqual);
    } else if (counter === 2) {
        post = useSelector(state => selectFeedPostById(state, postId), shallowEqual);
    } else if (counter === 3) {
        post = useSelector(state => selectMyPostsById(state, postId), shallowEqual);
    } else if (counter === 4) {
        post = useSelector(state => selectOtherPostsById(state, postId), shallowEqual);
    }

    const time = useMemo(() => dayjs(post?.createdAt).fromNow(), [post?.createdAt]);

    const getProfileHandler = () => {
        if(counter === 3 || counter === 4) return;
        if (post.isMine) {
            if (counter === 1) {
                navigation.navigate("Home", { screen: "Profile" });
            } else {
                navigation.navigate("Profile");
            }

        } else {
            navigation.navigate("OtherProfileScreen", { otherId: post?.owner._id });
        }
    };

    const getPostHandler = () => {
        if(counter===1) return;
        navigation.navigate("PostScreen", { postId });
    }

    const handleLike = async () => {
        if (loading.current) return;
        loading.current = true;
        try {

            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/post/like`, {
                postId: post._id
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                dispatch(toggleLike(post._id));
                dispatch(toggleFeedLike(post._id));
                if (post.isMine) {
                    dispatch(toggleMyPostLike(post._id));
                } else {
                    dispatch(toggleOtherPostsLike(post._id));
                }

            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error('Error like/unlike post:', err);
        }
        loading.current = false;
    };

    const handleDeletePost = async () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePost() },
            ]
        );
    }
    // report function
    const handleReportPost = async () => {
        Alert.alert(
            'Confirm Report',
            'Are you sure you want to report this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => reportPost() },
            ]
        );
    }

    const deletePost = async () => {
        if(loading.current) return;
        loading.current = true;
        try{
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.post(`${baseURL}/post/delete`,{
                postId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                dispatch(removePost(response.data.post._id));
                dispatch(removeFeedPost(response.data.post._id));
                dispatch(removeMyPost(response.data.post._id));
                if(counter===1) navigation.goBack();
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
            }
        } catch(err){
            console.error('Error deleting post:', err);
        }
        loading.current = false;
    }

    const reportPost = async () => {
        if (loading.current) return;
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.post(`${baseURL}/user/report/post`, {
                problem
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            })

            if (response.data.success) {
                Alert.alert("Reported Successfully!!", "Our Support Team wiil tend to your report ASAP")
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
            }
        } catch (err) {
            console.error('Error reporting post:', err);
        }
        loading.current = false;
    }

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.card}>
                <View style={styles.topRowContainer}>
                    <TouchableOpacity style={styles.topRow} onPress={getProfileHandler}>
                        <Image style={styles.avatar} source={{ uri: post?.owner?.profilepic }} />
                        <View style={styles.ImageTxt}>
                            <Text style={styles.name}>{post?.owner?.name}</Text>
                            <Text style={styles.time}>{time}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                        <Icons name="dots-three-vertical" size={20} color="#333" />
                    </TouchableOpacity>

                </View>

                {/* Model for three dots  */}

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}

                >
                    <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseModal}>
                        <View style={styles.modalContainer}>
                            {
                                post?.isMine && (
                                    <TouchableOpacity

                                        style={styles.modalOption}
                                        onPress={() => {
                                            handleCloseModal();
                                            handleDeletePost();
                                        }}
                                    >
                                        <Text style={[styles.modalText, { color: "red" }]}>Delete</Text>
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    handleCloseModal();
                                    handleReportPost();
                                }}
                            >
                                <Text style={styles.modalText}>Report</Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.modalText}>Cancel</Text>

                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>

                </Modal>

                <TouchableOpacity onPress={getPostHandler}>

                    {post?.caption ? (
                        <Text style={styles.postText}>{post?.caption}</Text>
                    ) : <View style={{ paddingTop: 10 }} />}


                    {post?.postpic && (
                        <Image style={styles.PostImage} source={{ uri: post?.postpic }} />
                    )}
                </TouchableOpacity>

                <View style={styles.interactionWrapper}>
                    <TouchableOpacity style={styles.interaction} onPress={handleLike}>
                        <Icon
                            name={post?.isLiked ? 'heart' : 'heart-o'}
                            size={26}
                            color={post?.isLiked ? 'red' : 'black'}
                        />
                        <Text style={[styles.interactionTxt, { color: post?.isLiked ? 'red' : '#333' }]}>
                            {post?.likesCount > 0 ? `${post?.likesCount} ` : ''}{post?.likesCount > 1 ? 'Likes' : 'Like'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.interaction} onPress={getPostHandler}>
                        <Icon
                            name={post?.isCommented ? 'comment' : 'comment-o'}
                            size={26}
                            color={post?.isCommented ? '#007AFF' : 'black'}
                        />
                        <Text style={[styles.interactionTxt, { color: post?.isCommented ? '#007AFF' : '#333' }]}>
                            {post?.commentsCount > 0 ? `${post?.commentsCount} ` : ''}{post?.commentsCount > 1 ? 'Comments' : 'Comment'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default React.memo(PostCards);

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginVertical: 5,
        width: width,
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 7,
    },
    topRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
    },
    menuButton: {
        padding: 5,
        paddingRight: 15

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    modalOption: {
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalText: {
        fontSize: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    ImageTxt: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
    },
    time: {
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        color: '#666',
    },
    postText: {
        marginTop: 10,
        fontSize: 14,
        paddingLeft: 15,
        paddingRight: 15,
        fontFamily: 'Lato-Regular',
        color: '#000',
        marginBottom: 10,
    },
    PostImage: {
        // width: width,
        // maxHeight: width,
        // minHeight: width * 0.7
        width: width,
        height: width * 3 / 4,
    },
    interactionWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
    },
    interaction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionTxt: {
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        color: '#333',
        marginLeft: 5,
    },
});
