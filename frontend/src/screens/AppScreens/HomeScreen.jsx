import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostCards from '../../components/PostCards';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '../../components/NavBar';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/* const data = [
    {
        type: 'profile',
        id: '0',
        name: 'Some Name',
        email: 'someone@example.com',
        profileImage: 'https://res.cloudinary.com/project-random/image/upload/v1751710445/default_yte3vu.png',
        bio: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi iure adipisci praesentium. Provident temporibus facilis libero architecto quam, repudiandae dicta!',
    },
    {
        type: 'post',
        id: '1',
        name: 'Bruce Wayne',
        time: '10 hours ago',
        profileImage: 'https://cdna.artstation.com/p/assets/images/images/030/009/410/large/sourav-paul-bati1.jpg?1599316606',
        postText: 'I am vengeance!',
        postImage: 'https://images.wallpapersden.com/image/wxl-robert-pattinson-as-bruce-wayne-4k-the-batman_81455.jpg',
    },
    {
        type: 'post',
        id: '2',
        name: 'Clark Kent',
        time: '5 hours ago',
        profileImage: 'https://www.superherodb.com/pictures2/portraits/10/050/791.jpg',
        postText: 'Hope is everything.',
        postImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfv_B-cr26SEnSKkU7V7ZcNyCb7_TtciaAxQ&s',
    },
    {
        type: 'post',
        id: '3',
        name: 'Tony Stark',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/e0/ff/bf/e0ffbff6c52085427eaef2594b26f119.jpg',
        postText: 'I am Iron Man.',
        postImage: 'https://i.pinimg.com/736x/94/c8/e3/94c8e36b0d182d9661f94f7d11a0887b.jpg',
    },
    {
        type: 'post',
        id: '4',
        name: 'Steve Rogers',
        time: '8 hours ago',
        profileImage: 'https://i.pinimg.com/736x/30/60/c2/3060c2116b5a55023b04437ee05490af.jpg',
        postText: 'I can do this all day.',
        postImage: 'https://i.pinimg.com/736x/66/44/1c/66441c9d0315267064ef899e7884e969.jpg',
    },
    {
        type: 'post',
        id: '5',
        name: 'Natasha Romanoff',
        time: '12 mins ago',
        profileImage: 'https://i.pinimg.com/736x/d3/0d/ff/d30dffb3277d7da9f27c272a7d784326.jpg',
        postText: 'At some point, we all have to choose.',
        postImage: '',
    },
    {
        type: 'post',
        id: '6',
        name: 'Thor Odinson',
        time: '30 mins ago',
        profileImage: 'https://i.pinimg.com/736x/f4/56/5d/f4565d865bcdef4af6b2b1c1f04529ca.jpg',
        postText: 'Bring me THANOS!',
        postImage: 'https://i.pinimg.com/736x/e1/e5/d9/e1e5d9991437b279ff32a1e3a9afe60b.jpg',
    },
    {
        type: 'post',
        id: '7',
        name: 'Peter Parker',
        time: '1 hour ago',
        profileImage: 'https://i.pinimg.com/736x/0f/f4/73/0ff47389fe04e8e6246b4f41bd299b0d.jpg',
        postText: 'With great power...',
        postImage: 'https://i.pinimg.com/736x/49/9c/f5/499cf5062493b70ae2d419a68a09ba4f.jpg',
    },
    {
        type: 'post',
        id: '8',
        name: 'Wanda Maximoff',
        time: '20 mins ago',
        profileImage: 'https://i.pinimg.com/736x/e0/02/c4/e002c46a325767040c8b1feec73df024.jpg',
        postText: 'I just want my kids back.',
        postImage: '',
    },
    {
        type: 'post',
        id: '9',
        name: 'Vision',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/ef/0c/23/ef0c23f162162c8b661213613c862de8.jpg',
        postText: 'What is grief, if not love persevering?',
        postImage: '',
    },
    {
        type: 'post',
        id: '10',
        name: 'Loki Laufeyson',
        time: '6 hours ago',
        profileImage: 'https://i.pinimg.com/736x/dd/4e/b2/dd4eb2a6132e206b5f5e9c6d9a525958.jpg',
        postText: 'I am burdened with glorious purpose.',
        postImage: 'https://i.pinimg.com/736x/df/5e/fa/df5efa14710485b41799d58c628f2daf.jpg',
    },
    {
        type: 'post',
        id: '11',
        name: 'Jon Snow',
        time: '4 hours ago',
        profileImage: 'https://i.pinimg.com/736x/55/f4/15/55f415c77008b7bd569206532202931b.jpg',
        postText: 'The North remembers.',
        postImage: 'https://i.pinimg.com/736x/11/95/7b/11957b5d60df79328f4185f8ca3c486d.jpg',
    },
    {
        type: 'post',
        id: '12',
        name: 'Daenerys Targaryen',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/2e/50/54/2e5054746883b8654595adfa7db06419.jpg',
        postText: 'Dracarys!',
        postImage: 'https://i.pinimg.com/736x/d1/b0/77/d1b0773e27e5b7b6438de709f2412862.jpg',
    },
    {
        type: 'post',
        id: '13',
        name: 'Arya Stark',
        time: '30 mins ago',
        profileImage: 'https://upload.wikimedia.org/wikipedia/en/3/39/Arya_Stark-Maisie_Williams.jpg',
        postText: 'A girl has no name.',
        postImage: '',
    },
    {
        type: 'post',
        id: '14',
        name: 'Deadpool',
        time: '45 mins ago',
        profileImage: 'https://i.pinimg.com/736x/b3/68/84/b36884c348bcc6e69ca0aaa6601dd765.jpg',
        postText: 'Fourth wall? Never heard of it.',
        postImage: 'https://i.pinimg.com/736x/2f/54/d7/2f54d764f6271a4a3216cba0ce958912.jpg',
    },
    {
        type: 'post',
        id: '15',
        name: 'Wade Wilson',
        time: '9 hours ago',
        profileImage: 'https://i.pinimg.com/736x/f7/9b/78/f79b78e29fe162e3c782558a1c5458ef.jpg',
        postText: 'Maximum effort!',
        postImage: '',
    },
    {
        type: 'post',
        id: '16',
        name: 'Barry Allen',
        time: '50 mins ago',
        profileImage: 'https://i.pinimg.com/736x/ec/ff/e4/ecffe48bf69e6e85fb38e179c9c3848b.jpg',
        postText: 'Run, Barry, Run!',
        postImage: 'https://i.pinimg.com/736x/f6/c0/32/f6c03275f781d36e12fa7933fc8093e2.jpg',
    },
    {
        type: 'post',
        id: '17',
        name: 'Wonder Women',
        time: '2 hours ago',
        profileImage: 'https://i.pinimg.com/736x/02/90/ae/0290aea6560790707ab220d535728fb9.jpg',
        postText: 'I will fight for those who cannot fight for themselves.',
        postImage: 'https://i.pinimg.com/736x/b5/74/4a/b5744a8659c99095bf9060b7f2f6ee23.jpg',
    },
    {
        type: 'post',
        id: '18',
        name: 'Thomas shelby',
        time: '3 hours ago',
        profileImage: 'https://i.pinimg.com/736x/c2/5a/e4/c25ae4d3f7858e110b39a321aa0ad6bb.jpg',
        postText: 'By the order of Fuking Peaky Bliners',
        postImage: 'https://i.pinimg.com/736x/f4/2a/c6/f42ac6888544fbf02eaac1c9bddb6040.jpg',
    },
    {
        type: 'post',
        id: '19',
        name: 'Logan',
        time: '1 day ago',
        profileImage: 'https://i.pinimg.com/736x/9d/9b/bd/9d9bbdad3424dafa43964c820626d22c.jpg',
        postText: 'Don’t be what they made you.',
        postImage: 'https://i.pinimg.com/736x/d0/9b/da/d09bda05c89a8c8d8ae545d84b4813d6.jpg',
    },
    {
        type: 'post',
        id: '20',
        name: 'Professor Snape',
        time: '2 days ago',
        profileImage: 'https://i.pinimg.com/736x/99/ee/9a/99ee9a992d6b566c90ea6ee0cd7e9c23.jpg',
        postText: '"Always."',
        postImage: '',
    },
]; */


const HomeScreen = () => {

    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // function to fetch profile( if pageno = 1 ) and user post from backend
    const fetchPosts = async (page) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {

            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                navigation.replace("LoginScreen");
            }

            const response = await axios.get(`http://10.0.2.2:4167/user/home?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            if (response.data.success) {
                setPosts(prev => [...prev, ...response.data.posts]);

                setPageNumber(page);
                setHasMore(page < response.data.totalPages);
            }
            else {
                console.log(response.data.message);
                navigation.replace("LoginScreen");
            }

        } catch (err) {
            console.log('Error fetching posts:', err);
        }

        setLoading(false);
    };

    // on mounting fetchposts(pageno = 1)
    useEffect(() => {
        fetchPosts(1);
    }, []);

    // if user reaches end to flatlist loadmore
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchPosts(pageNumber + 1);
        }
    };



    const renderItem = ({ item, index }) => {
        if (index === 0) return null; // Skip the dummy item (used for NavBar)

        const post = item;
        console.log(post);
        return (
            <PostCards
                name={post.owner.name}
                time={dayjs(post.Date).fromNow()}
                profileImage={post.owner.profilepic}
                postText={post.caption}
                postImage={post.postpic}
            />
        );
    };
      

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.HomeContainer}>

                <FlatList
                    data={[{}, ...posts]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}

                    // to run loadmore function when end is reached for infinite scrolling
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}

                    // this makes navbar sticky
                    ListHeaderComponent={<NavBar />}
                    stickyHeaderIndices={[0]}

                    // to display loading as footer
                    ListFooterComponent={loading && <ActivityIndicator />}
                    showsVerticalScrollIndicator={false}
                />

            </View>
        </SafeAreaView>
    )
}  

export default HomeScreen

const styles = StyleSheet.create({
    HomeContainer: {
        flex: 1,
        // alignItems:"center",
        // padding:20,
    },
})