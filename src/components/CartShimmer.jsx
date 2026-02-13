import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const CARD_MARGIN = ms(15);
const CARD_WIDTH = width - (2 * CARD_MARGIN);
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

const CartItemShimmer = ({ opacity }) => (
    <View style={styles.cartItem}>
        {/* Image area with green tag */}
        <View style={styles.imageWrapper}>
            <ShimmerBox
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                borderRadius={ms(10)}
                opacity={opacity}
            />
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
            <View>
                {/* Title */}
                <ShimmerBox width="80%" height={ms(14)} opacity={opacity} />
                {/* Subtitle */}
                <ShimmerBox width="55%" height={ms(11)} opacity={opacity} style={{ marginTop: vs(4) }} />
            </View>

            {/* Price and Remove button row */}
            <View style={styles.bottomRow}>
                <ShimmerBox width={ms(50)} height={ms(16)} opacity={opacity} />
                <ShimmerBox width={ms(90)} height={ms(35)} borderRadius={ms(20)} opacity={opacity} />
            </View>
        </View>
    </View>
);

const CartShimmer = () => {
    const opacity = useShimmerAnim();

    return (
        <View style={styles.container}>
            {/* ADD MORE TESTS Button Shimmer */}
            <ShimmerBox
                width="90%"
                height={ms(45)}
                borderRadius={ms(10)}
                opacity={opacity}
                style={styles.addTestButton}
            />

            {/* Cart Items Wrapper */}
            <View style={styles.cartContainer}>
                {[1, 2, 3].map((item) => (
                    <CartItemShimmer key={item} opacity={opacity} />
                ))}
            </View>

            {/* Coupon Section */}
            <View style={styles.couponSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(10) }}>
                    <ShimmerBox width={ms(25)} height={ms(25)} borderRadius={ms(5)} opacity={opacity} />
                    <ShimmerBox width={ms(100)} height={ms(12)} opacity={opacity} style={{ marginLeft: ms(5) }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(10) }}>
                    <ShimmerBox width="70%" height={ms(40)} borderRadius={ms(8)} opacity={opacity} />
                    <ShimmerBox width="25%" height={ms(40)} borderRadius={ms(8)} opacity={opacity} />
                </View>
            </View>

            {/* Booking Type Section */}
            <View style={styles.bookingSection}>
                <ShimmerBox width={ms(120)} height={ms(16)} opacity={opacity} style={{ marginBottom: ms(10) }} />
                <ShimmerBox width="100%" height={ms(45)} borderRadius={ms(12)} opacity={opacity} style={{ marginBottom: ms(18) }} />
                <ShimmerBox width="100%" height={ms(45)} borderRadius={ms(10)} opacity={opacity} style={{ marginBottom: ms(12) }} />
                <ShimmerBox width="100%" height={ms(45)} borderRadius={ms(10)} opacity={opacity} style={{ marginBottom: ms(12) }} />
                <ShimmerBox width="100%" height={ms(45)} borderRadius={ms(10)} opacity={opacity} />
            </View>

            {/* Add Patient Details Section */}
            <View style={styles.patientSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ms(10) }}>
                    <ShimmerBox width={ms(150)} height={ms(16)} opacity={opacity} />
                    <ShimmerBox width={ms(35)} height={ms(35)} borderRadius={ms(18)} opacity={opacity} />
                </View>
                <ShimmerBox width="100%" height={ms(50)} borderRadius={ms(10)} opacity={opacity} />
            </View>

            {/* Bill Details Section */}
            <View style={styles.billSection}>
                <ShimmerBox width={ms(90)} height={ms(15)} opacity={opacity} style={{ marginBottom: ms(12) }} />
                <View style={styles.billRow}>
                    <ShimmerBox width={ms(80)} height={ms(12)} opacity={opacity} />
                    <ShimmerBox width={ms(60)} height={ms(12)} opacity={opacity} />
                </View>
                <View style={styles.billRow}>
                    <ShimmerBox width={ms(50)} height={ms(12)} opacity={opacity} />
                    <ShimmerBox width={ms(50)} height={ms(12)} opacity={opacity} />
                </View>
                <View style={{ margin: ms(8) }} />
                <View style={styles.billRow}>
                    <ShimmerBox width={ms(100)} height={ms(15)} opacity={opacity} />
                    <ShimmerBox width={ms(70)} height={ms(15)} opacity={opacity} />
                </View>
            </View>

            <View style={{ margin: ms(8) }} />

            {/* Continue Button */}
            <ShimmerBox
                width="100%"
                height={ms(50)}
                borderRadius={ms(10)}
                opacity={opacity}
                style={styles.continueButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: vs(10),
    },
    addTestButton: {
        alignSelf: 'center',
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    cartContainer: {
        marginVertical: vs(10),
        marginHorizontal: ms(15),
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingVertical: ms(10),
    },
    cartItem: {
        width: CARD_WIDTH,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(10),
        paddingVertical: ms(10) + 20,
        marginBottom: 10,
    },
    imageWrapper: {
        marginRight: 15,
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
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    couponSection: {
        marginHorizontal: ms(15),
        backgroundColor: '#F8FAFC',
        paddingVertical: 15,
        marginBottom: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    bookingSection: {
        backgroundColor: '#F8FAFC',
        borderRadius: 15,
        padding: ms(15),
        margin: ms(15),
    },
    patientSection: {
        margin: ms(15),
        backgroundColor: '#F8FAFC',
        borderRadius: ms(15),
        padding: ms(15),
    },
    billSection: {
        marginHorizontal: ms(15),
        paddingHorizontal: ms(20),
        paddingVertical: ms(20),
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: ms(8),
    },
    continueButton: {
        marginBottom: ms(50),
        marginHorizontal: ms(15),
    },
});

export default CartShimmer;
