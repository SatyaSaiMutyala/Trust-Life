import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const LabOrdersShimmer = () => {
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

    const OrderCardShimmer = () => (
        <View style={styles.card}>
            {/* Header Row - Badge and Status */}
            <View style={styles.cardHeader}>
                <Animated.View style={[styles.badge, { opacity }]} />
                <Animated.View style={[styles.statusText, { opacity }]} />
            </View>

            {/* ID and Date Row */}
            <View style={styles.detailRow}>
                <Animated.View style={[styles.idText, { opacity }]} />
                <Animated.View style={[styles.dateText, { opacity }]} />
            </View>

            {/* Test Name */}
            <Animated.View style={[styles.testName, { opacity }]} />

            {/* Amount Row */}
            <View style={styles.amountRow}>
                <View style={styles.amountLeft}>
                    <Animated.View style={[styles.checkIcon, { opacity }]} />
                    <Animated.View style={[styles.amountLabel, { opacity }]} />
                </View>
                <Animated.View style={[styles.amountValue, { opacity }]} />
            </View>

            {/* View Details Button */}
            <Animated.View style={[styles.viewDetailsButton, { opacity }]} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Filter Buttons Shimmer */}
            <View style={styles.filterContainer}>
                <Animated.View style={[styles.filterButton, { opacity }]} />
                <Animated.View style={[styles.filterButton, { opacity }]} />
                <Animated.View style={[styles.filterButton, { opacity }]} />
            </View>

            {/* Order Cards Shimmer */}
            <View style={styles.cardsContainer}>
                <OrderCardShimmer />
                <OrderCardShimmer />
                <OrderCardShimmer />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: vs(10),
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: ms(15),
        marginBottom: vs(15),
    },
    filterButton: {
        width: ms(70),
        height: vs(35),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(20),
        marginRight: ms(10),
    },
    cardsContainer: {
        paddingHorizontal: ms(15),
    },
    card: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(16),
        padding: ms(15),
        marginBottom: vs(20),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: ms(2) },
        shadowOpacity: 0.1,
        shadowRadius: ms(4),
        elevation: ms(5),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    badge: {
        width: ms(70),
        height: vs(24),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(5),
    },
    statusText: {
        width: ms(100),
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    idText: {
        width: ms(60),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    dateText: {
        width: ms(120),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    testName: {
        width: '80%',
        height: vs(18),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(12),
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    amountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        width: ms(16),
        height: ms(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(8),
        marginRight: ms(8),
    },
    amountLabel: {
        width: ms(80),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    amountValue: {
        width: ms(60),
        height: vs(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    viewDetailsButton: {
        height: vs(45),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(40),
        marginHorizontal: ms(10),
    },
});

export default LabOrdersShimmer;
