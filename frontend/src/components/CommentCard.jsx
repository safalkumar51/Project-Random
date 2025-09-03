import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, Alert, Pressable, Modal } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../assets/config';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { selectCommentById } from '../redux/selectors/singlePostSelectors';
import { removeComment, toggleCommentLike } from '../redux/slices/singlePostCommentsSlice';
import { untoggleFeedComment } from '../redux/slices/feedSlice';
import { untoggleMyPostsComment } from '../redux/slices/myPostsSlice';
import { untoggleComment } from '../redux/slices/singlePostSlice';
import { untoggleOtherPostsComment } from '../redux/slices/otherPostsSlice';

dayjs.extend(relativeTime);

const { width } = Dimensions.get('window');

const CommentCard = ({ commentId }) => {
    const navigation = useNavigation();
    const loading = useRef(false);

    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    const comment = useSelector(state => selectCommentById(state, commentId), shallowEqual);

    const time = useMemo(() => dayjs(comment.createdAt).fromNow(), [comment.createdAt]);

    const getProfileHandler = () => {
        if(comment.isCommentMine){
            navigation.navigate("Home", { screen: "Profile" }); 
        }
        else{
            navigation.navigate("OtherProfileScreen", { otherId: comment.commentOwner._id });
        }
    }

    const toggleLike = async () => {
        if(loading.current) return;
        loading.current = true;
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
        loading.current = false;;
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteComment() },
            ]
        );
        setModalVisible(false);
    }
    const handleReport = () => {
        Alert.alert(
            'Confirm Report',
            'Are you sure you want to report this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => reportComment() },
            ]
        );
        setModalVisible(false);
    }

    const deleteComment = async () => {
        if (loading.current) return;
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.post(`${baseURL}/post/comment/delete`,{
                commentId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                dispatch(removeComment(response.data.comment._id));
                dispatch(untoggleComment(response.data.comment.post._id))
                dispatch(untoggleFeedComment(response.data.comment.post._id));
                if(comment.isPostMine) dispatch(untoggleMyPostsComment(response.data.comment.post._id));
                else dispatch(untoggleOtherPostsComment(response.data.comment.post._id))
            } else {
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace('LoginScreen');
                }
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
        loading.current = false;
    }

    const reportComment = async () => {
        if (loading.current) return;
        loading.current = true;
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace('LoginScreen');
                return;
            }

            const response = await axios.post(`${baseURL}/user/report/comment`, {
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
        <>
            <Pressable onLongPress={() => setModalVisible(true)}>
                <View style={styles.card}>

                    <View style={styles.upper}>



                        <TouchableOpacity style={styles.userInfo} onPress={getProfileHandler}>

                            <Image style={styles.avatar} source={{ uri: comment.commentOwner.profilepic }} />

                            <View style={styles.nameTime}>

                                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{comment.commentOwner.name}</Text>

                                <Text style={styles.time}>{time}</Text>


                            </View>
                            {/* <TouchableOpacity  style={styles.menuButton}>
                     <Icons name="dots-three-horizontal" size={20} color="#333"/>
                     
                  </TouchableOpacity> */}

                        </TouchableOpacity>







                        <TouchableOpacity style={styles.interaction} onPress={toggleLike}>
                            <Icon
                                name={comment.isCommentLiked ? 'heart' : 'heart-o'}
                                size={18}
                                color={comment.isCommentLiked ? 'red' : 'black'}
                            />
                            <Text style={[styles.interactionTxt, { color: comment.isCommentLiked ? 'red' : '#333' }]}>
                                {comment.commentLikesCount > 0 ? `${comment.commentLikesCount} ` : ''}{comment.commentLikesCount > 1 ? 'Likes' : 'Like'}
                            </Text>
                        </TouchableOpacity>


                    </View>


                    <View style={styles.lower}>
                        <Text style={styles.comment}>{comment.text}</Text>
                    </View>
                </View>

            </Pressable>

            {/* Modal for delete , report , cancel option */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {(comment?.isCommentMine || comment?.isPostMine) && (
                            <Pressable style={[styles.modalBtn, styles.withBorder]} onPress={handleDelete}>
                                <Text style={styles.deleteTxt}>Delete</Text>
                            </Pressable>
                        )}
                        {/* <Pressable style={[styles.modalBtn, styles.withBorder]}  onPress={handleDelete}>
                            <Text style={styles.deleteTxt}>Delete</Text>
                        </Pressable> */}
                        <Pressable style={[styles.modalBtn, styles.withBorder]} onPress={handleReport}>
                            <Text style={styles.reportTxt}>Report</Text>
                        </Pressable>
                        <Pressable style={[styles.modalBtn, styles.withBorder]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelTxt}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>


            </Modal>

        </>
    );
};

export default React.memo(CommentCard);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#eff1f5ff',
        borderRadius: 14,
        marginTop: 2,
        width: width,
        alignSelf: 'center',
        padding: 12,
        //shadowColor: '#000',
        //shadowOffset: { width: 0, height: 3 },
        //shadowOpacity: 0.1,
        //shadowRadius: 6,
        //elevation: 5,
        borderTopColor: '#777',
        borderTopWidth: 1,
    },
    // threeDots:{
    //     flexDirection: 'col',
    //     justifyContent: 'space-around',
    //     alignItems: 'start',
    //     marginTop: 10,
    //     marginHorizontal: 10,


    // },
    menuButton: {
        marginRight: 150
    },
    upper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 6,
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
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#dedcdcff',
        borderRadius: 8,
    },
    comment: {
        color: '#000',
        fontWeight: 400,
        fontSize: 13,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: 'rgba(0,0,0,0.5)',

    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomWidth: 1
    },
    modalBtn: {
        paddingVertical: 15,
        alignItems: 'center',

    },
    deleteTxt: {
        fontSize: 16,
        color: 'red',
        fontWeight: '600'
    },
    reportTxt: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600'
    },
    cancelTxt: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600'
    },

    withBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd", // light grey line
    },
})