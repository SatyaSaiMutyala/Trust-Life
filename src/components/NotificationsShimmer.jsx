import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs, s } from 'react-native-size-matters';

const NotificationsShimmer = () => {
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

    const NotificationCardShimmer = () => (
        <View style={styles.notificationCard}>
            <Animated.View style={[styles.titleShimmer, { opacity }]} />
            <Animated.View style={[styles.descriptionLine1, { opacity }]} />
            <Animated.View style={[styles.descriptionLine2, { opacity }]} />
        </View>
    );

    const DateGroupShimmer = ({ cardsCount = 3 }) => (
        <View style={styles.dateGroup}>
            <Animated.View style={[styles.dateHeader, { opacity }]} />
            {[...Array(cardsCount)].map((_, index) => (
                <NotificationCardShimmer key={index} />
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Today's Group */}
            <DateGroupShimmer cardsCount={3} />

            {/* Yesterday Group */}
            <DateGroupShimmer cardsCount={2} />

            {/* Older Group */}
            <DateGroupShimmer cardsCount={2} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dateGroup: {
        marginBottom: vs(20),
    },
    dateHeader: {
        width: ms(80),
        height: vs(18),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(10),
        marginTop: vs(10),
    },
    notificationCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: ms(12),
        padding: s(15),
        marginBottom: vs(10),
    },
    titleShimmer: {
        width: '70%',
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(8),
    },
    descriptionLine1: {
        width: '100%',
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(5),
    },
    descriptionLine2: {
        width: '60%',
        height: vs(14),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
});

export default NotificationsShimmer;
