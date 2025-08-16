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
import { toggleFeedLike } from '../redux/slices/feedSlice';
import { toggleMyProfileLike } from '../redux/slices/myProfileSlice';
import { toggleOtherProfileLike } from '../redux/slices/otherProfileSlice';
import { selectSinglePostById } from '../redux/selectors/singlePostSelectors';
import { selectFeedPostById } from '../redux/selectors/feedSelectors';
import { toggleLike } from '../redux/slices/singlePostSlice';

dayjs.extend(relativeTime);

const PostCards = ({ postId, counter }) => {

    const[modalVisible , setModalVisible] = useState(false);

    const handleMenuPress = () =>{
        setModalVisible(true);
    }

    const handleCloseModal = () =>{
        setModalVisible(false);
    }


    const navigation = useNavigation();

    const dispatch= useDispatch();

    let post = {};

    if(counter === 1){
        post = useSelector(state => selectSinglePostById(state, postId), shallowEqual);
    } else if(counter === 2){
        post = useSelector(state => selectFeedPostById(state, postId), shallowEqual);
    }

    const time = useMemo(() => dayjs(post?.createdAt).fromNow(), [post?.createdAt]);

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", {otherId: post?.owner._id});
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
                    dispatch(toggleMyProfileLike(post._id));
                } else {
                    dispatch(toggleOtherProfileLike(post._id));
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
    
    // for deleting the post

    // const handleMenuPress = () => {
    //     const options = [];

    //     if(post.isMine){
    //         options.push("Delete");
    //     }

    //     options.push("Report");
    //     options.push("cancel");

    //     Alert.alert(
    //         "options",
    //         "choose an action",
    //         options.map(option =>({

    //             text: option,
    //             style:option === "cancel" ? "cancel" : "default",

    //             onPress :()=>{
    //                 if(option === "Delete"){
    //                     handleDeletePost();
    //                 }
    //                 else if (option === "Report"){
    //                     handleReportPost();
    //                 }
    //             }

    //         }))
    //     )
    // }
    // delete function 
    const handleDeletePost =async ()=>{
        Alert.alert("are you sure you want to this delete post")
    }
    // report function
     const handleReportPost =async ()=>{
        Alert.alert("are you sure you want to this report  post")
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
                    <Icons name="dots-three-vertical" size={20} color="#333"/>
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
                                onPress={()=>{
                                    handleCloseModal();
                                 handleDeletePost();
                                }}
                           >
                           <Text style={[styles.modalText , {color :"red"}]}>Delete</Text> </TouchableOpacity>
                        )
                    }
                 <TouchableOpacity
                 style={styles.modalOption}
                 onPress={()=>{
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
                    <Text style={styles.modalText}>cancel</Text>

                 </TouchableOpacity>

                </View>
            </TouchableOpacity>

          </Modal>
 
                <TouchableOpacity onPress={getPostHandler}>

                    {post?.caption ? (
               <Text style={styles.postText}>{post?.caption}</Text>
                      ) :  <View style={{ paddingTop: 10 }} />}


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
                            {post?.likesCount > 0 ? `${post?.likesCount} Like` : 'Like'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.interaction} onPress={getPostHandler}>
                        <Icon
                            name={post?.isCommented ? 'comment' : 'comment-o'}
                            size={26}
                            color={post?.isCommented ? '#007AFF' : 'black'}
                        />
                        <Text style={[styles.interactionTxt, { color: post?.isCommented ? '#007AFF' : '#333' }]}>
                            {post?.commentsCount > 0 ? `${post?.commentsCount} Comment` : 'Comment'}
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
        paddingRight:15
        
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
        width:width,
        height:width * 3/4,
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
