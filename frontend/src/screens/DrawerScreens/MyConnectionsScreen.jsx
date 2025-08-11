import {
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import MyConnectionCard from '../../components/MyConnectionCard';
import BackButton from '../../components/BackButton';
import SharedHeader from '../../components/SharedHeader';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../../redux/slices/connectionsSlice';

dayjs.extend(relativeTime);

const MyConnectionsScreen = () => {
  const navigation = useNavigation();
  const connections = useSelector((state) => state.connections.connections);
  const dispatch = useDispatch();

  const pageNumber = useRef(1);
  const loading = useRef(false);
  const hasMore = useRef(true);
  const totalPages = useRef();

  const fetchConnections = async (page) => {
    if (page !== 1 && (loading.current || !hasMore.current)) return;

    loading.current = true;
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        `http://10.138.91.124:4167/connection?page=${page}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data.success) {
        dispatch(addConnections({ page, connections: response.data.connections }));
        if (page === 1) {
          totalPages.current = response.data.totalPages;
        }
        hasMore.current = (page < totalPages.current);
        pageNumber.current = page;
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        }
      }
    } catch (err) {
      console.log('Error fetching connections:', err);
    }
    loading.current = false;
  };

  useEffect(() => {
    fetchConnections(1);
  }, []);

  const loadMore = () => {
    if (!loading.current && hasMore.current && pageNumber.current) {
      fetchConnections(pageNumber.current + 1);
    }
  };

  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const insets = useSafeAreaInsets();

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

  const renderItem = ({ item }) => (
    <MyConnectionCard
      name={item.from?.name}
      profileImage={item.from?.profilepic}
      time={dayjs(item.updatedAt).fromNow()}
      senderId={item.from?._id}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <SharedHeader
          scrollY={headerTranslateY}
          title="My Connections"
          leftComponent={<BackButton />}
        />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            data={connections}
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

export default MyConnectionsScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
  },
});
