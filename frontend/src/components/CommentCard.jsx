import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const CommentCard = ({ name, profileImage, time, comment, likes, ownerId }) => {
    const navigation = useNavigation();

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { status: "connected", otherId: ownerId, requestId: "" });
    }

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
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
                        name={liked ? 'heart' : 'heart-o'}
                        size={18}
                        color={liked ? 'red' : 'black'}
                    />
                    <Text style={[styles.interactionTxt, { color: liked ? 'red' : '#333' }]}>
                        {likeCount > 0 ? `${likeCount} Likes` : '0 Like'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.lower}>
                <Text style={styles.comment}>{comment}</Text>
            </View>
        </View>
    )
}

export default CommentCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        marginVertical: 2,
        width: width * 0.95,
        alignSelf: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
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