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
import baseURL from '../../assets/config';

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

        setLoading(true);
        try {
            //console.error("Fetched Error");
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            if (status === 'connected') {
                const response = await axios.get(`${ baseURL }/connection/profile`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }, params: {
                        page,
                        otherId
                    }
                });
                if (response.data.success) {
                    if (page === 1) {
                        setProfile(response.data.profile);
                        setTotalPages(response.data.totalPages);
                    } else {
                        setProfile(prev => {
                            if (!prev) return response.data.profile; // fallback
                            return {
                                ...prev,
                                posts: [...prev.posts, ...response.data.profile.posts]
                            }
                        });
                    }

                    setPageNumber(page);
                    setHasMore(page < totalPages);
                }
                else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }
                //Alert.alert(response.data.profile.name);

            } else {
                const response = await axios.get(`${ baseURL }/connection/requestprofile`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }, params: {
                        otherId
                    }
                });
                if (response.data.success) {
                    setProfile(response.data.profile);
                    setHasMore(false);
                }
                else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }
                //Alert.alert(response.data.profile.name);
            }

        } catch (err) {
            console.error('Error fetching others profile:', err);
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

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    const renderItem = ({ item }) => {
        return (
            <PostCards
                name={item.name}
                time={item.time}
                profileImage={item.profileImage}
                postText={item.postText}
                postImage={item.postImage}
                //name={profile.name}
                //time={dayjs(item.createdAt).fromNow()}
                //profileImage={profile.profilepic}
                //postText={item.caption}
                //postImage={item.postpic}
                //ownerId={profile._id}
                //postId={item._id}
                //likesCount={item.likesCount}
                //commentsCount={item.commentsCount}
                //isLiked={item.isLiked}
                //isCommented={item.isCommented}
                //isMine={item.isMine}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <SharedHeader
                    scrollY={headerTranslateY}
                    title="Profile"
                />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        //data={profile.posts}
                        //keyExtractor={(item) => item._id}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}

                        onScroll={handleScroll}
                        scrollEventThrottle={16}

                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        //onEndReached={loadMore}
                        //onEndReachedThreshold={0.5}

                        // this makes navbar sticky
                        //ListHeaderComponent={() => (
                        //    <View>
                        //        {profileLoading ? (
                        //            <ActivityIndicator size="large" />
                        //        ) : (
                        //            <>
                        //                <ProfileCard
                        //                    name={profile.name}
                        //                    email={profile.email}
                        //                    profileImage={profile.profilepic}
                        //                    bio={profile.bio}
                        //                    status={status}
                        //                />
                        //                <StatusCard
                        //                    status={status}
                        //                    requestId={requestId}
                        //                    senderId={otherId}
                        //                />
                        //            </>
                        //        )}
                        //    </View>
                        //)}

                        // to display loading as footer
                        //ListFooterComponent={loading && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OtherProfileScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
});
