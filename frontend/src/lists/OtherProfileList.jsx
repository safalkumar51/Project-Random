import React, { use, useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import PostCards from '../components/PostCards';
import { selectOtherPostsIds, selectOtherProfileIds, selectRequestIds } from '../redux/selectors/otherProfileSelectors';
import StatusCard from '../components/StatusCard';
import ProfileCard from '../components/ProfileCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const OtherProfileList = React.memo(({
    onScroll,
    onEndReached,
    loading,
    profileLoading
}) => {
    const profileIds = useSelector(selectOtherProfileIds, shallowEqual);
    const requestIds = useSelector(selectRequestIds, shallowEqual);
    const postsIds = useSelector(selectOtherPostsIds, shallowEqual);

    const profileData = useMemo(() => profileIds, [profileIds]);
    const requestData = useMemo(() => requestIds, [requestIds]);
    const postsData = useMemo(() => postsIds, [postsIds]);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <PostCards postId={item} counter={4} />, []);

    const listHeader = useMemo(() => {
        if (!requestData?.length || !profileData?.length || profileLoading.current) {
            return <ActivityIndicator size="large" />;
        }

        return (
            <>
                <ProfileCard
                    profileId={profileData[0]}
                    counter={1}
                />
                <StatusCard
                    requestId={requestData[0]}
                />
            </>
        );
    }, [profileData, requestData, profileLoading.current]);

    return (
        <AnimatedFlatList
            data={postsData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{ paddingTop: 60 }}
            ListFooterComponent={loading.current && !profileLoading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(OtherProfileList);
