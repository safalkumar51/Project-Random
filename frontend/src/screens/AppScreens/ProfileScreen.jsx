import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';
import PostCards from '../../components/PostCards';
import ProfileCard from '../../components/ProfileCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMyProfile,
  addMyProfilePosts,
  setMyProfileLoading,
  setMyProfileError,
} from '../../redux/slices/myProfileSlice';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');

  const dispatch = useDispatch();
  const { user, posts, loading } = useSelector((state) => state.myProfile);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const totalPagesRef = useRef(1);

  const fetchProfile = async (page = 1) => {
    if (page !== 1 && (loading || !hasMoreRef.current)) return;

    dispatch(setMyProfileLoading(true));

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        `http://10.0.2.2:4167/user/profile?page=${page}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        const profileData = response.data.profile;
        const totalPages = response.data.totalPages || 1;

        if (page === 1) {
          dispatch(setMyProfile(profileData));
        }

        dispatch(addMyProfilePosts({ page, posts: profileData.posts }));

        pageRef.current = page;
        totalPagesRef.current = totalPages;
        hasMoreRef.current = page < totalPages;
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        }
        dispatch(setMyProfileError(response.data.message));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      dispatch(setMyProfileError(err.message));
    }

    dispatch(setMyProfileLoading(false));
  };

  useEffect(() => {
    fetchProfile(1);
  }, []);

  useEffect(() => {
    const reload = navigation.addListener('tabPress', () => {
      if (isFocused) {
        if (lastScrollY.current > 0) {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } else {
          fetchProfile(1);
        }
      }
    });
    return reload;
  }, [navigation, isFocused]);

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

  const loadMore = () => {
    if (!loading && hasMoreRef.current) {
      fetchProfile(pageRef.current + 1);
    }
  };

  const renderItem = ({ item }) => (
    <PostCards
      from="myProfile"
      postId={item._id}
      isLiked={item.isLiked}
      likeCount={item.likeCount}
      isCommented={item.isCommented}
      commentCount={item.commentCount}
      name={item.owner?.name || user?.name}
      time={item.createdAt}
      profileImage={item.owner?.profilepic || user?.profileImage}
      postText={item.caption}
      postImage={item.postpic}
      ownerId={item.owner?._id || user?._id}
    />
  );

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <NavBar scrollY={headerTranslateY} />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingTop: headerHeight }}
            ListHeaderComponent={() =>
              user && (
                <ProfileCard
                  name={user.name}
                  email={user.email}
                  profileImage={user.profileImage}
                  bio={user.bio}
                />
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

export default ProfileScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
});
