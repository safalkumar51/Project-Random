import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectMyPostsIds, selectMyProfileIds } from '../redux/selectors/myProfileSelectors';
import PostCards from '../components/PostCards';
import ProfileCard from '../components/ProfileCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MyProfileList = React.memo(({
    flatListRef,
    onScroll,
    onEndReached,
    loading,
    profileLoading
}) => {
    const profileIds = useSelector(selectMyProfileIds, shallowEqual);
    const postsIds = useSelector(selectMyPostsIds, shallowEqual);

    const profileData = useMemo(() => profileIds, [profileIds]);
    const postsData = useMemo(() => postsIds, [postsIds]);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <PostCards postId={item} counter={3} />, []);

    const listHeader = useMemo(() => {
        if (!profileData?.length || profileLoading.current) {
            return <ActivityIndicator size="large" />;
        }

        return (
            <>
                <ProfileCard
                    profileId={profileData[0]}
                    counter={0}
                />
            </>
        );
    }, [profileData, profileLoading.current]);

    return (
        <AnimatedFlatList
            ref={flatListRef}
            data={postsData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{paddingTop: 60}}
            ListFooterComponent={loading.current && !profileLoading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(MyProfileList);
