import React from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SharedHeader = ({ scrollY, title = '', leftComponent = null }) => {
    const insets = useSafeAreaInsets();

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    //paddingTop: insets.top,
                    transform: [{ translateY: scrollY }]
                }
            ]}
        >
            {leftComponent}
            <Text style={styles.headerText}>{title}</Text>
        </Animated.View>
    );
};

export default SharedHeader;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        zIndex: 10,
        height: 60,
        width: width,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});