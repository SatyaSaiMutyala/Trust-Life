import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { vs, ms } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { globalGradient, whiteColor } from '../utils/globalColors';

const PROFILE_IMAGE_SIZE = ms(70);

const ProfileShimmer = () => {
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

    const ShimmerBox = ({ width: boxWidth, height, style, borderRadius = ms(8) }) => (
        <Animated.View
            style={[
                {
                    width: boxWidth,
                    height,
                    backgroundColor: '#E0E0E0',
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.14]}
                style={styles.flex1}
            >
                {/* Header - Back Button */}
                <View style={styles.header}>
                    <ShimmerBox width={ms(34)} height={ms(34)} borderRadius={ms(17)} />
                </View>

                <View style={styles.scrollContent}>
                    {/* Personal Information Card */}
                    <View style={styles.personalCard}>
                        {/* Section Title */}
                        <ShimmerBox width={ms(160)} height={vs(16)} style={{ marginBottom: vs(16) }} />

                        {/* Profile Row */}
                        <View style={styles.profileRow}>
                            <ShimmerBox
                                width={PROFILE_IMAGE_SIZE}
                                height={PROFILE_IMAGE_SIZE}
                                borderRadius={PROFILE_IMAGE_SIZE / 2}
                            />
                            <View style={styles.profileInfo}>
                                <ShimmerBox width={ms(120)} height={vs(14)} />
                                <ShimmerBox width={ms(100)} height={vs(11)} style={{ marginTop: vs(6) }} />
                            </View>
                            <ShimmerBox width={ms(75)} height={vs(28)} borderRadius={ms(20)} />
                        </View>

                        {/* Info Rows */}
                        <View style={styles.infoSection}>
                            {/* Surname */}
                            <View style={styles.infoRow}>
                                <ShimmerBox width={ms(70)} height={vs(12)} />
                                <ShimmerBox width={ms(80)} height={vs(12)} />
                            </View>
                            <View style={styles.divider} />
                            {/* Gender */}
                            <View style={styles.infoRow}>
                                <ShimmerBox width={ms(55)} height={vs(12)} />
                                <ShimmerBox width={ms(40)} height={vs(12)} />
                            </View>
                            <View style={styles.divider} />
                            {/* DOB */}
                            <View style={styles.infoRow}>
                                <ShimmerBox width={ms(95)} height={vs(12)} />
                                <ShimmerBox width={ms(100)} height={vs(12)} />
                            </View>
                        </View>
                    </View>

                    {/* Manage Your Details Title */}
                    <ShimmerBox width={ms(150)} height={vs(16)} style={{ marginTop: vs(24), marginBottom: vs(14) }} />

                    {/* Manage Cards */}
                    {[1, 2, 3].map((item) => (
                        <View key={item} style={styles.manageCard}>
                            <ShimmerBox width={ms(44)} height={ms(44)} borderRadius={ms(22)} />
                            <View style={styles.manageTextWrapper}>
                                <ShimmerBox width={ms(100)} height={vs(12)} />
                                <ShimmerBox width={ms(180)} height={vs(10)} style={{ marginTop: vs(6) }} />
                            </View>
                            <ShimmerBox width={ms(20)} height={ms(20)} borderRadius={ms(10)} />
                        </View>
                    ))}
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    flex1: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    scrollContent: {
        paddingHorizontal: ms(20),
    },
    personalCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(16),
        padding: ms(18),
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(18),
    },
    profileInfo: {
        flex: 1,
        marginLeft: ms(14),
    },
    infoSection: {
        marginTop: vs(4),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(12),
    },
    divider: {
        height: ms(0.5),
        backgroundColor: '#E5E7EB',
    },
    manageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    manageTextWrapper: {
        flex: 1,
        marginLeft: ms(14),
        marginRight: ms(10),
    },
});

export default ProfileShimmer;
