import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectConnectionsIds } from '../redux/selectors/connectionsSelector';
import MyConnectionCard from '../components/MyConnectionCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ConnectionsList = React.memo(({
    onScroll,
    onEndReached,
    loading,

}) => {
    // Only select the comment IDs for this post
    const connectionsIds = useSelector(selectConnectionsIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <MyConnectionCard connectionId={item} />, []);

    // Optionally, you can memoize the data if needed
    const connectionsData = useMemo(() => connectionsIds, [connectionsIds]);

    return (
        <AnimatedFlatList
            data={connectionsData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingTop: 60 }}
            ListFooterComponent={loading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(ConnectionsList);
