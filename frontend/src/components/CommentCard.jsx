import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../assets/config';

import { toggleCommentLike } from '../redux/slices/singlePostSlice'; 

const { width } = Dimensions.get('window');

const CommentCard = ({ name, profileImage, time, comment, commentLikesCount, commentId, commentOwnerId, isCommentLiked, isCommentMine }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); 

    const [commentLiked, setCommentLiked] = useState(false);
    const [commentLikeCount, setCommentLikeCount] = useState(0);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { status: "connected", otherId: ownerId, requestId: "" });
    }

    const toggleLike = async () => {
        return;
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

                //Alert.alert(response.data.message);
                setCommentLiked(!commentLiked);
                setCommentLikeCount(prev => commentLiked ? prev - 1 : prev + 1);

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
    useEffect(() => {

        setCommentLiked(isCommentLiked);
        setCommentLikeCount(commentLikesCount);

    },[])

    return (
        <View style={styles.card}>
            <View style={styles.upper}>
                <TouchableOpacity style={styles.userInfo} onPress={getProfileHandler}>
                    <Image style={styles.avatar} source={{ uri: profileImage }} />
                    <View style={styles.nameTime}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interaction} onPress={toggleLike}>
                    <Icon
                        name={commentLiked ? 'heart' : 'heart-o'}
                        size={18}
                        color={commentLiked ? 'red' : 'black'}
                    />
                    <Text style={[styles.interactionTxt, { color: commentLiked ? 'red' : '#333' }]}>
                        {commentLikeCount > 0 ? `${commentLikeCount} Likes` : '0 Like'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.lower}>
                <Text style={styles.comment}>{comment}</Text>
            </View>
        </View>
    );
};

export default CommentCard;
