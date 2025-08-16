import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectChatsIds } from '../redux/selectors/chatsSelectors';
import ChatCard from '../components/ChatCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ChatsList = React.memo(({
    onScroll,
    onEndReached,
    loading,
}) => {
    // Only select the comment IDs for this post
    const chatsId = useSelector(selectMessagesIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <ChatCard chatsId={item} />, []);

    // Optionally, you can memoize the data if needed
    const chatsData = useMemo(() => chatsId, [chatsId]);

    return (
        <AnimatedFlatList
            data={chatsData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
                paddingBottom: 60,
                paddingTop: 60
            }}
            ListFooterComponent={loading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
        />
    );
});

export default React.memo(ChatsList);
