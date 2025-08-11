import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'; 
import { toggleFeedLike, toggleFeedComment } from '../redux/slices/feedSlice';
import { toggleLike, toggleComment } from '../redux/slices/myProfileSlice';
import { toggleOtherLike, toggleOtherComment } from '../redux/slices/otherProfileSlice'; 
const { width } = Dimensions.get('window');

const PostCards = ({
  name,
  time,
  profileImage,
  postText,
  postImage,
  ownerId,
  liked,
  likeCount,
  commented,
  commentCount,
  postId,
  from = 'feed',
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); 

  const getProfileHandler = () => {
    navigation.navigate("OtherProfileScreen", {
      status: "connected",
      otherId: ownerId,
      requestId: ""
    });
  };

  const getPostHandler = () => {
    // could navigate to detailed post screen
  };

  const handleLike = () => {
    if (from === 'feed') dispatch(toggleFeedLike(postId));
    else if (from === 'myProfile') dispatch(toggleLike(postId));
    else if (from === 'otherProfile') dispatch(toggleOtherLike(postId));
  };

  const handleComment = () => {
    if (from === 'feed') dispatch(toggleFeedComment(postId));
    else if (from === 'myProfile') dispatch(toggleComment({ _id: postId }));
    else if (from === 'otherProfile') dispatch(toggleOtherComment({ _id: postId }));
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
              name={liked ? 'heart' : 'heart-o'}
              size={26}
              color={liked ? 'red' : 'black'}
            />
            <Text style={[styles.interactionTxt, { color: liked ? 'red' : '#333' }]}>
              {likeCount > 0 ? `${likeCount} Like` : 'Like'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interaction} onPress={handleComment}>
            <Icon
              name={commented ? 'comment' : 'comment-o'}
              size={26}
              color={commented ? '#007AFF' : 'black'}
            />
            <Text style={[styles.interactionTxt, { color: commented ? '#007AFF' : '#333' }]}>
              {commentCount > 0 ? `${commentCount} Comment` : 'Comment'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCards;

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
