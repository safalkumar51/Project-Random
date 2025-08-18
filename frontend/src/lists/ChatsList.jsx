import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated, ActivityIndicator } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectChatsIds } from '../redux/selectors/chatsSelectors';
import ChatCard from '../components/ChatCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ChatsList = React.memo(({
    otherId,
    avatar,
    onScroll,
    onEndReached,
    loading,
}) => {
    const chatsId = useSelector(selectChatsIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <ChatCard chatId={item} otherId={otherId} avatar={avatar} />, []);

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
                paddingTop: 80
            }}
            ListHeaderComponent={loading.current && <ActivityIndicator />}
            showsVerticalScrollIndicator={false}
            inverted
        />
    );
});

export default React.memo(ChatsList);
