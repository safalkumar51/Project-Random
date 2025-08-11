import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import StatusCard from '../../components/StatusCard';
import BackButton from '../../components/BackButton';
import SharedHeader from '../../components/SharedHeader';

import {
  setOtherProfile,
  addOtherPosts,
  clearOtherProfile,
  setOtherProfileLoading,
  setOtherProfileError,
} from '../../redux/slices/otherProfileSlice';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const OtherProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const { status = '', otherId = '', requestId = '' } = route.params;

  const { user: profile, posts, loading, hasMore, page } = useSelector(
    (state) => state.otherProfile
  );

  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');

  const fetchProfile = async (pageNo) => {
    if (pageNo !== 1 && (loading || !hasMore)) return;

    dispatch(setOtherProfileLoading(true));

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return navigation.replace('LoginScreen');

      const url =
        status === 'connected'
          ? 'http://10.0.2.2:4167/connection/profile'
          : 'http://10.0.2.2:4167/connection/requestprofile';

      const params =
        status === 'connected'
          ? { otherId, page: pageNo }
          : { otherId };

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });

      if (response.data.success) {
        if (pageNo === 1) {
          dispatch(
            setOtherProfile({
              ...response.data.profile,
              totalPages: response.data.totalPages,
            })
          );
        } else {
          dispatch(
            addOtherPosts({
              page: pageNo,
              posts: response.data.profile.posts,
            })
          );
        }
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        } else {
          dispatch(setOtherProfileError(response.data.message));
        }
      }
    } catch (err) {
      dispatch(setOtherProfileError('Error fetching profile'));
      console.error(err);
    }

    dispatch(setOtherProfileLoading(false));
  };

  useEffect(() => {
    dispatch(clearOtherProfile());
    fetchProfile(1);
  }, [otherId, status, requestId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProfile(page + 1);
    }
  };

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

  const renderItem = ({ item }) => (
    <PostCards
      from="otherProfile"
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
      ownerId={item.owner?._id}
    />
  );

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <SharedHeader
          scrollY={headerTranslateY}
          title="Profile"
          leftComponent={<BackButton />}
        />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={() =>
              profile ? (
                <>
                  <ProfileCard
                    name={profile.name}
                    email={profile.email}
                    profileImage={profile.profilepic}
                    bio={profile.bio}
                    status={status}
                  />
                  <StatusCard
                    status={status}
                    requestId={requestId}
                    senderId={otherId}
                  />
                </>
              ) : (
                <ActivityIndicator size="large" />
              )
            }
            ListFooterComponent={loading && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtherProfileScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
});
