import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectMessagesIds } from '../redux/selectors/messagesSelectors';
import MessagesCard from '../components/MessagesCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MessagesList = React.memo(({
    flatlistref,
    onScroll,
    onEndReached,
    loading,

}) => {
    // Only select the comment IDs for this post
    const messagesId = useSelector(selectMessagesIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <MessagesCard messagesId={item} />, []);

    // Optionally, you can memoize the data if needed
    const messagesData = useMemo(() => messagesId, [messagesId]);

    return (
        <AnimatedFlatList
            flatlistref={flatlistref}
            data={messagesData}
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

export default React.memo(MessagesList);
