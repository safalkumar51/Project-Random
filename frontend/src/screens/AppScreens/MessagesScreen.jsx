import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Animated, ActivityIndicator, Alert } from 'react-native';
import MessagesCard from '../../components/MessagesCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import baseURL from '../../assets/config';

dayjs.extend(relativeTime);

const data = [
    {
        id: '1',
        name: 'Nishant',
        time: '9:45 AM',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        unreadCount: 2,
    },
    {
        id: '2',
        name: 'Ravi',
        time: 'Yesterday',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        unreadCount: 0,
    },
    {
        id: '3',
        name: 'Aryan',
        time: '2 days ago',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        unreadCount: 1,
    },
];


const MessagesScreen = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const flatListRef = useRef(null);
    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState();


    // function to fetch profile( if pageno = 1 ) and user post from backend
    const fetchMessages = async (page) => {
        if (page !== 1 && (loading || !hasMore)) return;

        setLoading(true);
        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.get(`${ baseURL }/messages?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                if (page === 1) {
                    setMessages(response.data.messages);
                    setTotalPages(response.data.totalPages);
                } else {
                    setMessages(prev => [...prev, ...response.data.messages]);
                }

                setPageNumber(page);
                setHasMore(page < totalPages);
            }
            else {
                console.log(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.log('Error fetching messages:', err);
        }

        setLoading(false);
    };

    useEffect(() => {
        console.log(navigation.getState());
        // function to reload or scroll to top 
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY.current > 0) {
                    //Alert.alert("y");
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    //fetchMessages(1);
                }
            }
        });

        return reload;
    }, [navigation, isFocused, lastScrollY]);

    // on mounting fetchposts(pageno = 1)
    useEffect(() => {
        //fetchMessages(1);
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
    }

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    // if user reaches end to flatlist loadmore
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchMessages(pageNumber + 1);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <MessagesCard
                name={item.name}
                time={item.time}
                avatar={item.avatar}
                unreadCount={item.unreadCount}
                //name={item.from.name}
                //avatar={item.from.profilepic}
                //time={dayjs(item.updatedAt).fromNow()}
                //unreadCount={item.newMessages}
                //otherId={item.from._id}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <NavBar scrollY={headerTranslateY} />
                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        ref={flatListRef}
                        data={data}
                        keyExtractor={(item) => item.id}
                        //data={messages}
                        //keyExtractor={(item => item._id)}
                        renderItem={renderItem}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        //onEndReached={loadMore}
                        //onEndReachedThreshold={0.5}

                        // to display loading as footer
                        //ListFooterComponent={loading && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});

export default MessagesScreen;