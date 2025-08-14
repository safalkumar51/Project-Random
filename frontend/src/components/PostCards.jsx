import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import baseURL from '../assets/config';
import { toggleFeedLike } from '../redux/slices/feedSlice';
import { toggleMyProfileLike } from '../redux/slices/myProfileSlice';
import { toggleOtherProfileLike } from '../redux/slices/otherProfileSlice';
import { toggleLike } from '../redux/slices/singlePostSlice';

dayjs.extend(relativeTime);

const PostCards = ({ name, createdAt, profileImage, postText, postImage, ownerId, postId, likesCount, commentsCount, isLiked, isCommented, isMine }) => {
    const navigation = useNavigation();

    const dispatch= useDispatch();

    const time = useMemo(() => dayjs(createdAt).fromNow(), [createdAt]);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", {
            status: "connected",
            otherId: ownerId,
            requestId: ""
        });
    };

    const getPostHandler = () => {
        navigation.navigate("PostScreen", { postId });
    }

    const handleLike = async () => {
        try {

            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/post/like`, {
                postId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                dispatch(toggleLike(postId));
                dispatch(toggleFeedLike(postId));
                if (isMine) {
                    dispatch(toggleMyProfileLike(postId));
                } else {
                    dispatch(toggleOtherProfileLike(postId));
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
    };


    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.card}>
                <TouchableOpacity style={styles.topRow} onPress={getProfileHandler}>
                    <Image style={styles.avatar} source={{ uri: profileImage }} />
                    <View style={styles.ImageTxt}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={getPostHandler}>
                    <Text style={styles.postText}>{postText}</Text>
                    {postImage && (
                        <Image style={styles.PostImage} source={{ uri: postImage }} />
                    )}
                </TouchableOpacity>

                <View style={styles.interactionWrapper}>
                    <TouchableOpacity style={styles.interaction} onPress={handleLike}>
                        <Icon
                            name={isLiked ? 'heart' : 'heart-o'}
                            size={26}
                            color={isLiked ? 'red' : 'black'}
                        />
                        <Text style={[styles.interactionTxt, { color: isLiked ? 'red' : '#333' }]}>
                            {likesCount > 0 ? `${likesCount} Like` : 'Like'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.interaction} onPress={getPostHandler}>
                        <Icon
                            name={isCommented ? 'comment' : 'comment-o'}
                            size={26}
                            color={isCommented ? '#007AFF' : 'black'}
                        />
                        <Text style={[styles.interactionTxt, { color: isCommented ? '#007AFF' : '#333' }]}>
                            {commentsCount > 0 ? `${commentsCount} Comment` : 'Comment'}
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
        width: width,
        maxHeight: width,
        minHeight: width * 0.7
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
