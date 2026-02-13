import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const LabOrderDetailsShimmer = () => {
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

    const DetailRowShimmer = () => (
        <View style={styles.detailRow}>
            <Animated.View style={[styles.labelShimmer, { opacity }]} />
            <Animated.View style={[styles.valueShimmer, { opacity }]} />
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Status Header */}
            <Animated.View style={[styles.statusHeader, { opacity }]} />

            {/* Amount Paid Section */}
            <View style={styles.amountSection}>
                <Animated.View style={[styles.checkIcon, { opacity }]} />
                <Animated.View style={[styles.amountLabel, { opacity }]} />
                <Animated.View style={[styles.amountValue, { opacity }]} />
            </View>

            {/* Order ID and Date */}
            <View style={styles.orderIdRow}>
                <Animated.View style={[styles.orderIdShimmer, { opacity }]} />
                <Animated.View style={[styles.dateShimmer, { opacity }]} />
            </View>

            {/* Test Details Card */}
            <View style={styles.card}>
                <Animated.View style={[styles.cardTitle, { opacity }]} />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
            </View>

            {/* Patient Details Card */}
            <View style={styles.card}>
                <Animated.View style={[styles.cardTitle, { opacity }]} />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
                <DetailRowShimmer />
            </View>

            {/* Test Status Timeline Card */}
            <View style={styles.card}>
                <Animated.View style={[styles.cardTitle, { opacity }]} />
                <Animated.View style={[styles.statusDescription, { opacity }]} />

                {/* Timeline Steps */}
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={styles.timelineStep}>
                        <Animated.View style={[styles.timelineIcon, { opacity }]} />
                        <View style={styles.timelineContent}>
                            <Animated.View style={[styles.timelineTitle, { opacity }]} />
                            <Animated.View style={[styles.timelineDate, { opacity }]} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Bill Details Card */}
            <View style={[styles.card, { marginBottom: vs(30) }]}>
                <Animated.View style={[styles.cardTitle, { opacity }]} />
                <View style={styles.billRow}>
                    <Animated.View style={[styles.billLabel, { opacity }]} />
                    <Animated.View style={[styles.billValue, { opacity }]} />
                </View>
                <View style={styles.billRow}>
                    <Animated.View style={[styles.billLabel, { opacity }]} />
                    <Animated.View style={[styles.billValue, { opacity }]} />
                </View>
                <View style={styles.billRow}>
                    <Animated.View style={[styles.billLabel, { opacity }]} />
                    <Animated.View style={[styles.billValue, { opacity }]} />
                </View>
                <View style={[styles.billRow, styles.grandTotalRow]}>
                    <Animated.View style={[styles.grandTotalLabel, { opacity }]} />
                    <Animated.View style={[styles.grandTotalValue, { opacity }]} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: ms(10),
    },
    statusHeader: {
        height: vs(40),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(15),
        marginHorizontal: ms(20),
        marginTop: ms(10),
        marginBottom: vs(10),
    },
    amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(10),
        paddingHorizontal: ms(15),
    },
    checkIcon: {
        width: ms(20),
        height: ms(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(10),
    },
    amountLabel: {
        flex: 1,
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginLeft: ms(10),
        marginRight: ms(20),
    },
    amountValue: {
        width: ms(80),
        height: vs(22),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    orderIdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        paddingVertical: vs(8),
    },
    orderIdShimmer: {
        width: ms(100),
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    dateShimmer: {
        width: ms(140),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    card: {
        paddingHorizontal: ms(15),
        paddingVertical: ms(15),
    },
    cardTitle: {
        width: ms(120),
        height: vs(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(12),
    },
    detailRow: {
        marginBottom: vs(12),
    },
    labelShimmer: {
        width: ms(100),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(4),
    },
    valueShimmer: {
        width: '80%',
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    statusDescription: {
        width: '100%',
        height: vs(30),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(15),
    },
    timelineStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(15),
    },
    timelineIcon: {
        width: ms(24),
        height: ms(24),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(12),
        marginRight: ms(15),
    },
    timelineContent: {
        flex: 1,
    },
    timelineTitle: {
        width: ms(140),
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(4),
    },
    timelineDate: {
        width: ms(180),
        height: vs(12),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    billLabel: {
        width: ms(100),
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    billValue: {
        width: ms(60),
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    grandTotalRow: {
        marginTop: vs(10),
        paddingTop: vs(10),
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    grandTotalLabel: {
        width: ms(100),
        height: vs(18),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    grandTotalValue: {
        width: ms(80),
        height: vs(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
});

export default LabOrderDetailsShimmer;
