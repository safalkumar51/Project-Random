import { Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { selectFeedPostsIds } from '../redux/selectors/feedSelectors';
import { shallowEqual, useSelector } from 'react-redux';
import PostCards from '../components/PostCards';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const FeedList = ({ flatListRef, onScroll,
    scrollEventThrottle,
    onEndReached,
    onEndReachedThreshold,
    contentContainerStyle,
    ListFooterComponent,
    showsVerticalScrollIndicator }) => {
    const postsIds = useSelector(selectFeedPostsIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <PostCards postId={item} counter={2} />, []);

    // Optionally, you can memoize the data if needed
    const data = useMemo(() => postsIds, [postsIds]);
    return (
        <AnimatedFlatList
            ref={flatListRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            contentContainerStyle={contentContainerStyle}
            ListFooterComponent={ListFooterComponent}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        />
    )
}

export default React.memo(FeedList)

const styles = StyleSheet.create({})