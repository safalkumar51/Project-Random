import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { addMessages, clearMessages } from '../../redux/slices/chatSlice';
import SharedHeader from '../../components/SharedHeader';

dayjs.extend(relativeTime);

const MessagesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages);

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const headerHeight = 60;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');

  const fetchMessages = async (page) => {
    if (page !== 1 && (loading || !hasMore)) return;

    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        `http://10.0.2.2:4167/messages?page=${page}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        dispatch(addMessages({ page, data: response.data.messages }));
        setHasMore(page < response.data.totalPages);
        setPageNumber(page);
      } else {
        if (response.data.message === 'Log In Required!') {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('LoginScreen');
        }
      }
    } catch (err) {
      console.log('Error fetching messages:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages(1);
    return () => {
      dispatch(clearMessages());
    };
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMessages(pageNumber + 1);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('Chat', {
          name: item.user?.name,
          avatar: { uri: item.user?.profilepic },
        })
      }
    >
      <Image
        source={{ uri: item.user?.profilepic }}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{item.user?.name}</Text>
          <Text style={styles.time}>
            {dayjs(item.lastMessageAt).fromNow()}
          </Text>
        </View>
        {item.unreadCount > 0 ? (
          <Text style={styles.newMessage}>
            {item.unreadCount} New Message
            {item.unreadCount > 1 ? 's' : ''}
          </Text>
        ) : (
          <Text style={styles.message}>No new messages</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <SharedHeader
          scrollY={headerTranslateY}
          title="Messages"
        />
        <View style={{ flex: 1 }}>
          <AnimatedFlatList
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  main: { flex: 1 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
  newMessage: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '600',
  },
});
