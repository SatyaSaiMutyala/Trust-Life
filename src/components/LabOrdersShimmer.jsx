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

    const BookingCardShimmer = () => (
        <View style={styles.card}>
            {/* Status Badge + Date */}
            <View style={styles.topRow}>
                <Animated.View style={[styles.statusBadge, { opacity }]} />
                <Animated.View style={[styles.dateBlock, { opacity }]} />
            </View>

            {/* Doctor Name + Rating */}
            <View style={styles.doctorRow}>
                <Animated.View style={[styles.doctorName, { opacity }]} />
                <View style={styles.ratingRow}>
                    <Animated.View style={[styles.starIcon, { opacity }]} />
                    <Animated.View style={[styles.ratingText, { opacity }]} />
                </View>
            </View>

            {/* Specialty */}
            <Animated.View style={[styles.specialty, { opacity }]} />

            {/* Appointment Date & Time */}
            <View style={styles.appointmentRow}>
                <Animated.View style={[styles.appointmentLabel, { opacity }]} />
                <Animated.View style={[styles.appointmentValue, { opacity }]} />
            </View>

            {/* Action Button */}
            <Animated.View style={[styles.actionButton, { opacity }]} />

            {/* Note Text */}
            <Animated.View style={[styles.noteText, { opacity }]} />
        </View>
    );

    return (
        <View style={styles.container}>
            <BookingCardShimmer />
            <BookingCardShimmer />
            <BookingCardShimmer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: ms(16),
        paddingTop: vs(8),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: vs(14),
    },

    // Status + Date
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    statusBadge: {
        width: ms(85),
        height: vs(28),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(20),
    },
    dateBlock: {
        width: ms(120),
        height: vs(14),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },

    // Doctor + Rating
    doctorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    doctorName: {
        width: ms(140),
        height: vs(16),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    starIcon: {
        width: ms(14),
        height: ms(14),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(7),
    },
    ratingText: {
        width: ms(24),
        height: vs(14),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },

    // Specialty
    specialty: {
        width: ms(110),
        height: vs(13),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
        marginBottom: vs(14),
    },

    // Appointment
    appointmentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    appointmentLabel: {
        width: ms(140),
        height: vs(14),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },
    appointmentValue: {
        width: ms(130),
        height: vs(14),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },

    // Action Button
    actionButton: {
        height: vs(44),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(25),
        marginBottom: vs(8),
    },

    // Note
    noteText: {
        width: '90%',
        height: vs(12),
        backgroundColor: '#E5E7EB',
        borderRadius: ms(4),
    },
});

export default LabOrdersShimmer;
