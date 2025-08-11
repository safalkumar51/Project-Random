import { StyleSheet, View, FlatList, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCards from '../../components/PostCards';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedPosts } from '../../redux/slices/feedSlice';

dayjs.extend(relativeTime);

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const flatListRef = useRef(null);
  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const insets = useSafeAreaInsets();
  const posts = useSelector((state) => state.feed.posts);
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState();

  const fetchPosts = async (page) => {
    if (page !== 1 && (loading || !hasMore)) return;

    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        `http://10.0.2.2:4167/user/home?page=${page}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        const { posts: newPosts, totalPages: tp } = response.data;
        dispatch(addFeedPosts({ page, posts: newPosts }));

        if (page === 1) {
          setTotalPages(tp);
          setHasMore(tp > 1);
        } else {
          setHasMore(page < tp);
        }

        setPageNumber(page);
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        }
      }
    } catch (err) {
      console.log('Error fetching posts:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const reload = navigation.addListener('tabPress', () => {
      if (isFocused) {
        if (lastScrollY.current > 0) {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
      }
    });
    return reload;
  }, [navigation, isFocused]);

  useEffect(() => {
    fetchPosts(1);
  }, []);

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

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(pageNumber + 1);
    }
  };

  const renderItem = ({ item }) => (
    <PostCards
      from="feed"
      postId={item._id}
      isLiked={item.isLiked}
      likeCount={item.likeCount}
      isCommented={item.isCommented}
      commentCount={item.commentCount}
      name={item.owner?.name}
      time={dayjs(item.createdAt).fromNow()}
      profileImage={item.owner?.profilepic}
      postText={item.caption}
      postImage={item.postpic}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.HomeContainer}>
        <NavBar scrollY={headerTranslateY} />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && pageNumber >= 1 ? <ActivityIndicator /> : null
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
  },
});
