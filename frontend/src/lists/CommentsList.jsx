import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Animated } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { selectCommentIds } from '../redux/selectors/singlePostSelectors';
import CommentCard from '../components/CommentCard';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CommentsList = React.memo(({
    postId,
    onScroll,
    scrollEventThrottle,
    onEndReached,
    onEndReachedThreshold,
    ListHeaderComponent,
    contentContainerStyle,
    ListFooterComponent,
    showsVerticalScrollIndicator
}) => {
    // Only select the comment IDs for this post
    const commentIds = useSelector(selectCommentIds, shallowEqual);

    const keyExtractor = useCallback((item) => (item._id ? item._id : item), []);
    const renderItem = useCallback(({ item }) => <CommentCard commentId={item} />, []);

    // Optionally, you can memoize the data if needed
    const data = useMemo(() => commentIds, [commentIds]);

    return (
        <AnimatedFlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={contentContainerStyle}
            ListFooterComponent={ListFooterComponent}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        />
    );
});

export default CommentsList;
