import { StyleSheet, View, ActivityIndicator, FlatList, Alert, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ActivityCard from '../../components/ActivityCard';
import NavBar from '../../components/NavBar';
import axios from 'axios';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { socket } from '../../utils/socket';

dayjs.extend(relativeTime);

const usersData = [
    {
        id: '1',
        name: 'Natasha Romanoff',
        time: '12 mins ago',
        profileImage: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
        status: 'pending'
    },
    {
        id: '2',
        name: 'Thor Odinson',
        time: '30 mins ago',
        profileImage: 'https://i.pinimg.com/736x/f4/56/5d/f4565d865bcdef4af6b2b1c1f04529ca.jpg',
        status: 'requested'
    },
    {
        id: '3',
        name: 'Tony Stark',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/e0/ff/bf/e0ffbff6c52085427eaef2594b26f119.jpg',
        status: 'connected'
    },
    {
        id: '4',
        name: 'Bruce Wayne',
        time: '10 hours ago',
        profileImage: 'https://cdna.artstation.com/p/assets/images/images/030/009/410/large/sourav-paul-bati1.jpg?1599316606',
        status: 'pending'
    },
    {
        id: '5',
        name: 'Logan',
        time: '1 day ago',
        profileImage: 'https://i.pinimg.com/736x/9d/9b/bd/9d9bbdad3424dafa43964c820626d22c.jpg',
        status: 'connected'
    },
    {
        id: '6',
        name: 'Professor Snape',
        time: '2 days ago',
        profileImage: 'https://i.pinimg.com/736x/99/ee/9a/99ee9a992d6b566c90ea6ee0cd7e9c23.jpg',
        status: 'requested'
    },
    {
        id: '7',
        name: 'Peter Parker',
        time: '1 hour ago',
        profileImage: 'https://i.pinimg.com/736x/0f/f4/73/0ff47389fe04e8e6246b4f41bd299b0d.jpg',
        status: 'pending'
    },
    {
        id: '8',
        name: 'Wanda Maximoff',
        time: '20 mins ago',
        profileImage: 'https://i.pinimg.com/736x/e0/02/c4/e002c46a325767040c8b1feec73df024.jpg',
        status: 'pending'
    },
    {
        id: '9',
        name: 'Vision',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/ef/0c/23/ef0c23f162162c8b661213613c862de8.jpg',
        status: 'requested'
    },
    {
        id: '10',
        name: 'Loki Laufeyson',
        time: '6 hours ago',
        profileImage: 'https://i.pinimg.com/736x/dd/4e/b2/dd4eb2a6132e206b5f5e9c6d9a525958.jpg',
        status: 'requested'
    },
    {
        id: '11',
        name: 'Jon Snow',
        time: '4 hours ago',
        profileImage: 'https://i.pinimg.com/736x/55/f4/15/55f415c77008b7bd569206532202931b.jpg',
        status: 'pending'
    },
    {
        id: '12',
        name: 'Daenerys Targaryen',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/2e/50/54/2e5054746883b8654595adfa7db06419.jpg',
        status: 'connected'
    },
    {
        id: '13',
        name: 'Arya Stark',
        time: '30 mins ago',
        profileImage: 'https://upload.wikimedia.org/wikipedia/en/3/39/Arya_Stark-Maisie_Williams.jpg',
        status: 'connected'
    },
    {
        id: '14',
        name: 'Deadpool',
        time: '45 mins ago',
        profileImage: 'https://i.pinimg.com/736x/b3/68/84/b36884c348bcc6e69ca0aaa6601dd765.jpg',
        status: 'pending'
    },
    {
        id: '15',
        name: 'Wade Wilson',
        time: '9 hours ago',
        profileImage: 'https://i.pinimg.com/736x/f7/9b/78/f79b78e29fe162e3c782558a1c5458ef.jpg',
        status: 'requested'
    },
    {
        id: '16',
        name: 'Barry Allen',
        time: '50 mins ago',
        profileImage: 'https://i.pinimg.com/736x/ec/ff/e4/ecffe48bf69e6e85fb38e179c9c3848b.jpg',
        status: 'connected'
    },
    {
        id: '17',
        name: 'Wonder Women',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/02/90/ae/0290aea6560790707ab220d535728fb9.jpg',
        status: 'connected'
    },
    {
        id: '18',
        name: 'Thomas shelby',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/c2/5a/e4/c25ae4d3f7858e110b39a321aa0ad6bb.jpg',
        status: 'requested'
    },
];

const AlertScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const flatListRef = useRef(null);
    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const [requests, setRequests] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState();

    const fetchRequests = async (page) => {
        if (page !== 1 && (loading || !hasMore)) return;

        setLoading(true);
        try {

            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.get(`http://10.0.2.2:4167/connection/requests?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                
                if (page === 1) {
                    setRequests(response.data.requests);
                    setTotalPages(response.data.totalPages);
                } else{
                    setRequests(prev => [...prev, ...response.data.requests]);
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
            console.log('Error fetching requests:', err);
        }

        setLoading(false);
    };

    useEffect(() => {
        const reload = navigation.addListener('tabPress', () => {
            if (isFocused) {
                if (lastScrollY > 0) {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                } else {
                    fetchRequests(1);
                }
            }
        })

        return reload;
    }, [navigation, isFocused, lastScrollY]);

    // on mounting fetchrequests(pageno = 1)
    useEffect(() => {
        const handleRequest = (data) => {
            Alert.alert("run");
        };
        socket.off('receive_request', handleRequest); // prevent duplicates
        socket.on('receive_request', handleRequest);

        fetchRequests(1);

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
    }

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

    // if user reaches end to flatlist loadmore
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchRequests(pageNumber + 1);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <ActivityCard
                //name={item.name}
                //profileImage={item.profileImage}
                //time={item.time}
                //status={item.status}
                name={item.from.name}
                profileImage={item.from.profilepic}
                time={dayjs(item.createdAt).fromNow()}
                status={item.status}
                requestId={item._id}
                senderId={item.from._id}
            />
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.main}>
                <NavBar scrollY={headerTranslateY} />

                <View style={{ flex: 1 }}>
                    <AnimatedFlatList
                        ref={flatListRef}
                        data={requests}
                        keyExtractor={(item) => item._id}
                        //data={usersData}
                        //keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: headerHeight }}

                        // to run loadmore function when end is reached for infinite scrolling
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}



                        // to display loading as footer
                        ListFooterComponent={loading && <ActivityIndicator />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

            </View>
        </SafeAreaView>
    )
}

export default AlertScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
})