import { ActivityIndicator, FlatList, StyleSheet, View, Animated, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, TextInput, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import CommentCard from '../../components/CommentCard'
import PostCards from '../../components/PostCards'
import BackButton from '../../components/BackButton'
import SharedHeader from '../../components/SharedHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import baseURL from '../../assets/config'

dayjs.extend(relativeTime);


const post = {
    name: "Monkey D. Luffy",
    profileImage: "https://i.pinimg.com/1200x/bb/d4/4b/bbd44b37f18e40a01543b8b4721b1cce.jpg",
    time: "2 days ago",
    postImage: "https://i.pinimg.com/1200x/7e/4e/72/7e4e7217eb5b18979b114ad6e7d9822a.jpg",
    postText: "The One Piece is real!",

};

const data = [
    {
        id: '1',
        name: 'Bruce Wayne',
        time: '10 hours ago',
        profileImage: 'https://cdna.artstation.com/p/assets/images/images/030/009/410/large/sourav-paul-bati1.jpg?1599316606',
        comment: 'I am vengeance!',
        likes: ['user1', 'user2', 'user3', 'user4'],
    },
    {
        id: '2',
        name: 'Clark Kent',
        time: '5 hours ago',
        profileImage: 'https://www.superherodb.com/pictures2/portraits/10/050/791.jpg',
        comment: 'Hope is everything.',
        likes: ['user2', 'user5', 'user6'],
    },
    {
        id: '3',
        name: 'Tony Stark',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/e0/ff/bf/e0ffbff6c52085427eaef2594b26f119.jpg',
        comment: 'I am Iron Man.',
        likes: ['user1', 'user3'],
    },
    {
        id: '4',
        name: 'Steve Rogers',
        time: '8 hours ago',
        profileImage: 'https://i.pinimg.com/736x/30/60/c2/3060c2116b5a55023b04437ee05490af.jpg',
        comment: 'I can do this all day.',
        likes: ['user4'],
    },
    {
        id: '5',
        name: 'Natasha Romanoff',
        time: '12 mins ago',
        profileImage: 'https://i.pinimg.com/736x/d3/0d/ff/d30dffb3277d7da9f27c272a7d784326.jpg',
        comment: 'At some point, we all have to choose.',
        likes: ['user2', 'user6', 'user9'],
    },
    {
        id: '6',
        name: 'Thor Odinson',
        time: '30 mins ago',
        profileImage: 'https://i.pinimg.com/736x/f4/56/5d/f4565d865bcdef4af6b2b1c1f04529ca.jpg',
        comment: 'Bring me THANOS!',
        likes: ['user1', 'user2'],
    },
    {
        id: '7',
        name: 'Peter Parker',
        time: '1 hour ago',
        profileImage: 'https://i.pinimg.com/736x/0f/f4/73/0ff47389fe04e8e6246b4f41bd299b0d.jpg',
        comment: 'With great power...',
        likes: ['user8'],
    },
    {
        id: '8',
        name: 'Wanda Maximoff',
        time: '20 mins ago',
        profileImage: 'https://i.pinimg.com/736x/e0/02/c4/e002c46a325767040c8b1feec73df024.jpg',
        comment: 'I just want my kids back.',
        likes: ['user1', 'user4', 'user5'],
    },
    {
        id: '9',
        name: 'Vision',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/ef/0c/23/ef0c23f162162c8b661213613c862de8.jpg',
        comment: 'What is grief, if not love persevering?',
        likes: ['user1'],
    },
    {
        id: '10',
        name: 'Loki Laufeyson',
        time: '6 hours ago',
        profileImage: 'https://i.pinimg.com/736x/dd/4e/b2/dd4eb2a6132e206b5f5e9c6d9a525958.jpg',
        comment: 'I am burdened with glorious purpose.',
        likes: ['user2', 'user3'],
    },
    {
        id: '11',
        name: 'Jon Snow',
        time: '4 hours ago',
        profileImage: 'https://i.pinimg.com/736x/55/f4/15/55f415c77008b7bd569206532202931b.jpg',
        comment: 'The North remembers.',
        likes: [],
    },
    {
        id: '12',
        name: 'Daenerys Targaryen',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/2e/50/54/2e5054746883b8654595adfa7db06419.jpg',
        comment: 'Dracarys!',
        likes: ['user9', 'user10'],
    },
    {
        id: '13',
        name: 'Arya Stark',
        time: '30 mins ago',
        profileImage: 'https://upload.wikimedia.org/wikipedia/en/3/39/Arya_Stark-Maisie_Williams.jpg',
        comment: 'A girl has no name.',
        likes: ['user3'],
    },
    {
        id: '14',
        name: 'Deadpool',
        time: '45 mins ago',
        profileImage: 'https://i.pinimg.com/736x/b3/68/84/b36884c348bcc6e69ca0aaa6601dd765.jpg',
        comment: 'Fourth wall? Never heard of it.',
        likes: ['user1', 'user4'],
    },
    {
        id: '15',
        name: 'Wade Wilson',
        time: '9 hours ago',
        profileImage: 'https://i.pinimg.com/736x/f7/9b/78/f79b78e29fe162e3c782558a1c5458ef.jpg',
        comment: 'Maximum effort!',
        likes: [],
    },
    {
        id: '16',
        name: 'Barry Allen',
        time: '50 mins ago',
        profileImage: 'https://i.pinimg.com/736x/ec/ff/e4/ecffe48bf69e6e85fb38e179c9c3848b.jpg',
        comment: 'Run, Barry, Run!',
        likes: ['user2'],
    },
    {
        id: '17',
        name: 'Wonder Women',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/02/90/ae/0290aea6560790707ab220d535728fb9.jpg',
        comment: 'I will fight for those who cannot fight for themselves.',
        likes: ['user5', 'user7'],
    },
    {
        id: '18',
        name: 'Thomas shelby',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/c2/5a/e4/c25ae4d3f7858e110b39a321aa0ad6bb.jpg',
        comment: 'By the order of Fuking Peaky Bliners',
        likes: ['user1', 'user2', 'user3'],
    },
    {
        id: '19',
        name: 'Logan',
        time: '1 day ago',
        profileImage: 'https://i.pinimg.com/736x/9d/9b/bd/9d9bbdad3424dafa43964c820626d22c.jpg',
        comment: 'Don’t be what they made you.',
        likes: ['user9'],
    },
    {
        id: '20',
        name: 'Professor Snape',
        time: '2 days ago',
        profileImage: 'https://i.pinimg.com/736x/99/ee/9a/99ee9a992d6b566c90ea6ee0cd7e9c23.jpg',
        comment: '"Always."',
        likes: ['user2', 'user4'],
    }
];

const PostScreen = ({ route }) => {
    const navigation = useNavigation();
    const { postId } = route.params;

    const headerHeight = 60;
    const headerTranslateY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const scrollDirection = useRef('up');
    const insets = useSafeAreaInsets();

    const [post, setPost] = useState({ comments: [] });
    const [text, setText] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState();
    const [postLoading, setPostLoading] = useState(false);

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

    // function to fetch profile( if pageno = 1 ) and user post from backend
    const fetchPost = async (page) => {
        if (page !== 1 && (loading || !hasMore)) return;

        setLoading(true);
        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }
            const response = await axios.get(`${ baseURL }/post?page=${page}&postId=${postId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                if (page === 1) {
                    setPost(response.data.post);
                    //setPosts(response.data.profile);
                    setTotalPages(response.data.totalPages);
                } else {
                    setPost(prev => {
                        if (!prev) return response.data.post; // fallback
                        return {
                            ...prev,
                            comments: [...prev.comments, ...response.data.post.comments]
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

        } catch (err) {
            console.error('Error fetching post:', err);
        }

        setLoading(false);
    };

    useEffect(() => {
        setPostLoading(true);
        const loadData = async () => {
            setPost({ comments: [] }); // clear old data
            setPageNumber(1);
            setLoading(false);
            setHasMore(true);
            setTotalPages(undefined);

            await fetchPost(1);;
        }
        //loadData();
        setPostLoading(false);

    }, [postId]);

    // if user reaches end to flatlist loadmore
    const loadMore = () => {
        if (!loading && hasMore) {
            //fetchPost(pageNumber + 1);
        }
    };

    const sendMessage = async () => {
        return;
        if (text.trim() !== "") {
            try {

                const authToken = await AsyncStorage.getItem('authToken');
                if (!authToken) {
                    navigation.replace("LoginScreen");
                    return;
                }

                const response = await axios.post(`${ baseURL }/post/comment`, {
                    postId,
                    text
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });

                if (response.data.success) {

                    Alert.alert(response.data.message);
                    //setChats((prev) => [...prev, response.data.chat]);

                } else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!') {
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }

            } catch (err) {
                console.error('Error fetching requests:', err);
            }

            setText('');
        }
    };

    const renderItem = ({ item }) => {
        return (
            <CommentCard
                name={item.name}
                profileImage={item.profileImage}
                time={item.time}
                comment={item.comment}
                likes={item.likes}
                //name={item.commentOwner.name}
                //profileImage={item.commentOwner.profilepic}
                //time={dayjs(item.createdAt).fromNow()}
                //comment={item.text}
                //commentId={item._id}
                //commentOwnerId={item.commentOwner?._id}
                //commentLikesCount={item.commentLikesCount}
                //isCommentLiked={item.isCommentLiked}
                //isCommentMine={item.isCommentMine}
            />
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <SharedHeader
                            scrollY={headerTranslateY}
                            title="Post"
                        />
                        <View style={{ flex: 1 }}>
                            <AnimatedFlatList
                                data={data}
                                keyExtractor={(item) => item.id}
                                //data={post.comments}
                                //keyExtractor={(item) => item._id}
                                renderItem={renderItem}

                                onScroll={handleScroll}
                                scrollEventThrottle={16}

                                // to run loadmore function when end is reached for infinite scrolling
                                //onEndReached={loadMore}
                                //onEndReachedThreshold={0.5}

                                // this makes navbar sticky
                                //ListHeaderComponent={() => (
                                //    <View>
                                //        {postLoading ? (
                                //            <ActivityIndicator size="large" />
                                //        ) : (
                                //            <>
                                //                <PostCards
                                //                    name={post.owner?.name}
                                //                    profileImage={post.owner?.profilepic}
                                //                    time={dayjs(post.createdAt).fromNow()}
                                //                    postText={post.caption}
                                //                    postImage={post.postpic}
                                //                    ownerId={post.owner?._id}
                                //                    postId={post._id}
                                //                    likesCount={post.likesCount}
                                //                    commentsCount={post.commentsCount}
                                //                    isLiked={post.isLiked}
                                //                    isCommented={post.isCommented}
                                //                    isMine={post.isMine}
                                //                />
                                //            </>
                                //        )}
                                //    </View>
                                //)}

                                contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 80 }}

                                // to display loading as footer
                                //ListFooterComponent={loading && <ActivityIndicator />}
                                showsVerticalScrollIndicator={false}
                            />
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    value={text}
                                    onChangeText={setText}
                                    placeholder="Write a comment"
                                    placeholderTextColor="#888"
                                />
                                <TouchableOpacity style={styles.buttonContainer} onPress={sendMessage}>
                                    <Text style={styles.buttonText}>SEND</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    innerContainer: {
        flex: 1,
    },
    inputRow: {
        position: 'absolute',
        bottom: 5, // ⬅️ Distance from the bottom
        left: 10,   // ⬅️ Optional: distance from left
        right: 10,  // ⬅️ Optional: distance from right
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 7
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        backgroundColor: "#0d76e6ff",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: 500,
    },
})