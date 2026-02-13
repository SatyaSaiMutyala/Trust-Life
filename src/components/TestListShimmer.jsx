import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const IMAGE_SIZE = ms(80);

const useShimmerAnim = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });
};

const ShimmerBox = ({ width, height, style, borderRadius = ms(8), opacity }) => (
    <Animated.View
        style={[
            {
                width,
                height,
                backgroundColor: '#E0E0E0',
                borderRadius,
                opacity,
            },
            style,
        ]}
    />
);

const ShimmerCard = ({ opacity }) => (
    <View style={styles.cardContainer}>
        {/* Image area with green tag */}
        <View style={styles.imageWrapper}>
            <ShimmerBox
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                borderRadius={ms(10)}
                opacity={opacity}
            />
            {/* Green report tag placeholder */}
            <View style={styles.reportTag}>
                <ShimmerBox
                    width={IMAGE_SIZE - ms(10)}
                    height={ms(8)}
                    borderRadius={ms(4)}
                    opacity={opacity}
                />
            </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
            {/* Title */}
            <ShimmerBox width="80%" height={ms(14)} opacity={opacity} />
            {/* Subtitle */}
            <ShimmerBox width="55%" height={ms(11)} opacity={opacity} style={styles.subtitle} />

            {/* Price and Button row */}
            <View style={styles.bottomRow}>
                <ShimmerBox width={ms(50)} height={ms(16)} opacity={opacity} />
                <ShimmerBox width={ms(65)} height={ms(30)} borderRadius={ms(20)} opacity={opacity} />
            </View>
        </View>
    </View>
);

const TestListShimmer = () => {
    const opacity = useShimmerAnim();

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((_, i) => (
                <ShimmerCard key={i} opacity={opacity} />
            ))}
        </View>
    );
};

export const FooterShimmer = () => {
    const opacity = useShimmerAnim();

    return (
        <View style={styles.footerContainer}>
            {[1, 2].map((_, i) => (
                <ShimmerCard key={i} opacity={opacity} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: vs(10),
    },
    footerContainer: {
        paddingVertical: vs(5),
    },
    cardContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(15),
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: ms(15),
        marginVertical: vs(8),
        padding: ms(10),
        paddingVertical: vs(20),
    },
    imageWrapper: {
        marginRight: ms(15),
        position: 'relative',
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    reportTag: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: IMAGE_SIZE * 0.3,
        backgroundColor: 'rgba(30, 174, 85, 0.3)',
        borderBottomLeftRadius: ms(10),
        borderBottomRightRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        height: IMAGE_SIZE,
        justifyContent: 'space-between',
    },
    subtitle: {
        marginTop: vs(6),
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default TestListShimmer;
