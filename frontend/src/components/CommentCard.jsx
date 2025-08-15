import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../assets/config';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { selectCommentById } from '../redux/selectors/singlePostSelectors';
import { toggleCommentLike } from '../redux/slices/singlePostCommentsSlice';

dayjs.extend(relativeTime);

const { width } = Dimensions.get('window');

const CommentCard = ({ commentId }) => {
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const comment = useSelector(state => selectCommentById(state, commentId), shallowEqual);

    const time = useMemo(() => dayjs(comment.createdAt).fromNow(), [comment.createdAt]);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { otherId: comment.commentOwner._id });
    }

    const toggleLike = async () => {
        try {

            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/post/comment/like`, {
                commentId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                
                dispatch(toggleCommentLike(commentId));

            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error('Error like/unlike comment:', err);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.upper}>
                <TouchableOpacity style={styles.userInfo} onPress={getProfileHandler}>
                    <Image style={styles.avatar} source={{ uri: comment.commentOwner.profilepic }} />
                    <View style={styles.nameTime}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{comment.commentOwner.name}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interaction} onPress={toggleLike}>
                    <Icon
                        name={comment.isCommentLiked ? 'heart' : 'heart-o'}
                        size={18}
                        color={comment.isCommentLiked ? 'red' : 'black'}
                    />
                    <Text style={[styles.interactionTxt, { color: comment.isCommentLiked ? 'red' : '#333' }]}>
                        {comment.commentLikesCount > 0 ? `${comment.commentLikesCount} Likes` : '0 Like'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.lower}>
                <Text style={styles.comment}>{comment.text}</Text>
            </View>
        </View>
    );
};

export default React.memo(CommentCard);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        marginVertical: 2,
        width: width,
        alignSelf: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        //borderBottomColor: '#777',
        //borderBottomWidth: 1,
    },
    upper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allow it to take available space
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 25,
        backgroundColor: '#ddd',
    },
    nameTime: {
        marginLeft: 8,
        flex: 1,
        overflow: 'hidden',
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 9,
        color: '#777',
        marginTop: 2,
    },
    interaction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionTxt: {
        fontSize: 12,
        fontFamily: 'Lato-Regular',
        color: '#333',
        marginLeft: 5,
    },
    lower: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 5,
    },
    comment: {
        color: '#000',
        fontWeight: 400,
        fontSize: 13,
    },
})