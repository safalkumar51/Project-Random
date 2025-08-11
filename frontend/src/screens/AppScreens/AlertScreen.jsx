import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityCard from '../../components/ActivityCard';
import NavBar from '../../components/NavBar';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { socket } from '../../utils/socket';
import baseURL from '../../assets/config';
import { useSelector, useDispatch } from 'react-redux';
import { addRequests } from '../../redux/slices/requestsSlice';

dayjs.extend(relativeTime);

const AlertScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const flatListRef = useRef(null);
  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const insets = useSafeAreaInsets();

  const requests = useSelector((state) => state.requests.requests);
  const dispatch = useDispatch();

  const pageNumber = useRef(0);
  const loading = useRef(false);
  const hasMore = useRef(true);
  const totalPages = useRef();

  const fetchRequests = async (page) => {
    if (loading.current || !hasMore.current) return;

    loading.current = true;
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.replace('LoginScreen');
        return;
      }

            const response = await axios.get(`${ baseURL }/connection/requests?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

      if (response.data.success) {
        dispatch(addRequests({ page, data: response.data.requests }));
        if (page === 1) {
          totalPages.current = response.data.totalPages;
        }
        pageNumber.current= page;
        hasMore.current = (page < totalPages.current);
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        }
      }
    } catch (err) {
      console.log('Error fetching requests:', err);
    }

    loading.current = false;
  };

  useEffect(() => {
    const reload = navigation.addListener('tabPress', () => {
      if (isFocused) {
        if (lastScrollY.current > 0) {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } else {
          fetchRequests(1);
        }
      }
    });
    return reload;
  }, [navigation, isFocused]);

    // on mounting fetchrequests(pageno = 1)
    useEffect(() => {
        const handleRequest = (data) => {
            Alert.alert("run");
        };
        socket.off('receive_request', handleRequest); // prevent duplicates
        socket.on('receive_request', handleRequest);

        //fetchRequests(1);

        return () => {
            socket.off('receive_request', handleRequest);
        }
    }, []);

    // Track scroll offset

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
    if (!loading.current && hasMore.current && pageNumber.current) {
      fetchRequests(pageNumber.current + 1);
    }
  };

  const renderItem = ({ item }) => (
    <ActivityCard
      name={item.from?.name}
      profileImage={item.from?.profilepic}
      time={dayjs(item.createdAt).fromNow()}
      status={item.status}
      requestId={item._id}
      senderId={item.from?._id}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <NavBar scrollY={headerTranslateY} />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            ref={flatListRef}
            data={requests}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AlertScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
