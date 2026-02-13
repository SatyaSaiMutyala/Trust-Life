import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const AllAddressShimmer = () => {
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

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const AddressCardShimmer = () => (
        <View style={styles.cardContainer}>
            {/* Left Side Content */}
            <View style={styles.contentWrapper}>
                {/* Icon and Label Row */}
                <View style={styles.iconLabelRow}>
                    <Animated.View style={[styles.iconShimmer, { opacity }]} />
                    <Animated.View style={[styles.labelShimmer, { opacity }]} />
                </View>
                {/* Address Text */}
                <Animated.View style={[styles.addressLine1, { opacity }]} />
                <Animated.View style={[styles.addressLine2, { opacity }]} />
            </View>
            {/* Right Side Menu Icon */}
            <Animated.View style={[styles.menuIcon, { opacity }]} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Add New Address Button Shimmer */}
            <Animated.View style={[styles.addNewButton, { opacity }]} />

            {/* Saved Address Header Shimmer */}
            <Animated.View style={[styles.sectionHeader, { opacity }]} />

            {/* Address Cards Shimmer */}
            <AddressCardShimmer />
            <AddressCardShimmer />
            <AddressCardShimmer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingTop: vs(15),
    },
    addNewButton: {
        height: vs(50),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(8),
        marginBottom: vs(20),
    },
    sectionHeader: {
        width: ms(130),
        height: vs(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(15),
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: ms(8),
        padding: ms(15),
        marginBottom: vs(15),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: ms(1) },
        shadowOpacity: 0.1,
        shadowRadius: ms(2),
    },
    contentWrapper: {
        flex: 1,
        marginRight: ms(10),
    },
    iconLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    iconShimmer: {
        width: ms(20),
        height: ms(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginRight: ms(8),
    },
    labelShimmer: {
        width: ms(60),
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    addressLine1: {
        width: '90%',
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(6),
    },
    addressLine2: {
        width: '60%',
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    menuIcon: {
        width: ms(24),
        height: ms(24),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(12),
    },
});

export default AllAddressShimmer;
