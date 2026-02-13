import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs, s } from 'react-native-size-matters';

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

const OfferCardShimmer = ({ opacity }) => (
    <View style={styles.offerCard}>
        {/* Discount Badge and Package Type */}
        <View style={styles.cardHeader}>
            <ShimmerBox width={ms(100)} height={ms(28)} borderRadius={ms(20)} opacity={opacity} />
            <ShimmerBox width={ms(60)} height={ms(14)} opacity={opacity} />
        </View>

        {/* Offer Title */}
        <ShimmerBox width="85%" height={ms(16)} opacity={opacity} style={{ marginBottom: vs(10) }} />

        {/* Description */}
        <ShimmerBox width="65%" height={ms(12)} opacity={opacity} style={{ marginBottom: vs(8) }} />

        {/* Valid Till */}
        <ShimmerBox width={ms(130)} height={ms(12)} opacity={opacity} style={{ marginBottom: vs(8) }} />

        {/* Terms Link */}
        <ShimmerBox width={ms(120)} height={ms(12)} opacity={opacity} style={{ marginBottom: vs(12) }} />

        {/* Promo Code Section */}
        <View style={styles.promoCodeContainer}>
            <ShimmerBox width={ms(150)} height={ms(14)} opacity={opacity} />
            <ShimmerBox width={ms(20)} height={ms(20)} borderRadius={ms(4)} opacity={opacity} />
        </View>
    </View>
);

const OffersShimmer = () => {
    const opacity = useShimmerAnim();

    return (
        <View style={styles.container}>
            {/* Search Bar Shimmer */}
            <ShimmerBox
                width="100%"
                height={ms(44)}
                borderRadius={ms(12)}
                opacity={opacity}
                style={{ marginTop: vs(4), marginBottom: vs(20) }}
            />

            {/* Offer Cards */}
            {[1, 2, 3, 4].map((item) => (
                <OfferCardShimmer key={item} opacity={opacity} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    offerCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: ms(15),
        padding: s(15),
        marginBottom: vs(15),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    promoCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: ms(8),
        padding: s(12),
    },
});

export default OffersShimmer;
