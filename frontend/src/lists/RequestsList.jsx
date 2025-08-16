import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectRequestsIds } from '../redux/selectors/requestsSelectors';
import ActivityCard from '../components/ActivityCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const RequestsList = React.memo(({
    flatListref,
    onScroll,
    onEndReached,
    loading,

}) => {
    // Only select the comment IDs for this post
    const requestsIds = useSelector(selectRequestsIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <ActivityCard requestId={item} />, []);

    // Optionally, you can memoize the data if needed
    const requestsData = useMemo(() => requestsIds, [requestsIds]);
    console.log(requestsData);

    return (
        <AnimatedFlatList
            ref = {flatListref}
            data={requestsData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingTop: 60}}
            ListFooterComponent={loading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(RequestsList);
