import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { toggleCommentLike } from '../redux/slices/singlePostSlice'; 

const { width } = Dimensions.get('window');

const CommentCard = ({ name, profileImage, time, comment, likes, ownerId, commentId, isLiked }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); 
    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { status: "connected", otherId: ownerId, requestId: "" });
    }

    const toggleLike = () => {
        dispatch(toggleCommentLike(commentId)); 
    };

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
                        name={isLiked ? 'heart' : 'heart-o'}
                        size={18}
                        color={isLiked ? 'red' : 'black'}
                    />
                    <Text style={[styles.interactionTxt, { color: isLiked ? 'red' : '#333' }]}>
                        {likes > 0 ? `${likes} Like${likes > 1 ? 's' : ''}` : '0 Like'}
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
