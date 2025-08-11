import { ActivityIndicator, FlatList, StyleSheet, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CommentCard from '../../components/CommentCard';
import PostCards from '../../components/PostCards';
import BackButton from '../../components/BackButton';
import SharedHeader from '../../components/SharedHeader';

import { useDispatch, useSelector } from 'react-redux';
import {
  clearSinglePost,
  toggleLike,
  toggleComment,
} from '../../redux/slices/singlePostSlice';

const PostScreen = () => {
  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const post = useSelector((state) => state.singlePost.post);

  const handleScroll = (event) => {
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
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSinglePost());
    };
  }, [dispatch]);

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const renderItem = ({ item }) => <CommentCard {...item} />;

  if (!post) return null; // wait until post is loaded

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <SharedHeader
          scrollY={headerTranslateY}
          title="Post"
          leftComponent={<BackButton />}
        />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            data={post.comments || []}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight }}
            ListHeaderComponent={() => (
              <PostCards
                from="singlePost"
                postId={post._id}
                isLiked={post.isLiked}
                likeCount={post.likeCount}
                isCommented={post.isCommented}
                commentCount={post.commentCount}
                name={post.owner?.name}
                profileImage={post.owner?.profilepic}
                time={post.createdAt}
                postText={post.caption}
                postImage={post.postpic}
                onLikePress={() => dispatch(toggleLike())}
                onCommentPress={() => dispatch(toggleComment())}
              />
            )}
            ListFooterComponent={<ActivityIndicator />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
});
