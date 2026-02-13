import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { globalGradient } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const LabDetailsShimmer = () => {
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

    const ShimmerBox = ({ width, height, style, borderRadius = ms(8) }) => (
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

    return (
        <ScrollView style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                style={styles.gradientBg}
            >
                {/* Back Button and Title */}
                <View style={styles.headerRow}>
                    <ShimmerBox width={ms(35)} height={ms(35)} borderRadius={ms(18)} />
                    <ShimmerBox width={ms(120)} height={vs(20)} style={styles.headerTitle} />
                </View>

                {/* Search Bar */}
                <ShimmerBox
                    width={width - ms(20)}
                    height={vs(45)}
                    style={styles.searchBar}
                    borderRadius={ms(25)}
                />

                {/* Book a Test & Upload Prescription Cards */}
                <View style={styles.bookTestRow}>
                    <ShimmerBox width={(width - ms(40)) * 0.65} height={vs(90)} borderRadius={ms(10)} />
                    <ShimmerBox width={(width - ms(40)) * 0.35} height={vs(90)} borderRadius={ms(10)} />
                </View>

                {/* Relevances Horizontal Scroll */}
                <View style={styles.relevancesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <View key={index} style={styles.relevanceItem}>
                                <ShimmerBox width={ms(60)} height={ms(60)} borderRadius={ms(30)} />
                                <ShimmerBox width={ms(50)} height={vs(10)} style={styles.relevanceText} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>

            {/* Popular Packages Section */}
            <View style={styles.sectionContainer}>
                <ShimmerBox width={ms(140)} height={vs(18)} style={styles.sectionTitleShimmer} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.cardTouchable}>
                            <ShimmerBox width={ms(130)} height={vs(150)} borderRadius={ms(10)} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Profiles Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <ShimmerBox width={ms(80)} height={vs(18)} />
                    <ShimmerBox width={ms(60)} height={vs(18)} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.cardTouchable}>
                            <View style={styles.detailCard}>
                                <ShimmerBox width={ms(114)} height={ms(60)} borderRadius={ms(5)} />
                                <ShimmerBox width={ms(100)} height={vs(12)} style={styles.cardLine} />
                                <ShimmerBox width={ms(80)} height={vs(10)} style={styles.cardLine} />
                                <ShimmerBox width={ms(60)} height={vs(12)} style={styles.cardLine} />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Packages Section */}
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <ShimmerBox width={ms(90)} height={vs(18)} />
                    <ShimmerBox width={ms(60)} height={vs(18)} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.cardTouchable}>
                            <View style={styles.detailCard}>
                                <ShimmerBox width={ms(114)} height={ms(60)} borderRadius={ms(5)} />
                                <ShimmerBox width={ms(100)} height={vs(12)} style={styles.cardLine} />
                                <ShimmerBox width={ms(80)} height={vs(10)} style={styles.cardLine} />
                                <ShimmerBox width={ms(60)} height={vs(12)} style={styles.cardLine} />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Tests Section */}
            <View style={[styles.sectionContainer, styles.lastSection]}>
                <View style={styles.testsHeader}>
                    <ShimmerBox width={ms(60)} height={vs(18)} />
                    <ShimmerBox width={ms(60)} height={vs(18)} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.cardTouchable}>
                            <ShimmerBox width={ms(130)} height={vs(120)} borderRadius={ms(10)} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    gradientBg: {
        paddingTop: vs(50),
        padding: ms(10),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginLeft: ms(10),
    },
    searchBar: {
        marginVertical: vs(15),
    },
    bookTestRow: {
        flexDirection: 'row',
        gap: ms(10),
    },
    relevancesContainer: {
        marginVertical: vs(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    relevanceItem: {
        alignItems: 'center',
        marginHorizontal: ms(10),
        marginVertical: vs(10),
    },
    relevanceText: {
        marginTop: vs(4),
    },
    sectionContainer: {
        paddingHorizontal: ms(15),
        paddingBottom: ms(10),
        paddingTop: vs(10),
    },
    sectionTitleShimmer: {
        marginBottom: vs(5),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(10),
        marginBottom: vs(5),
    },
    cardTouchable: {
        width: ms(130),
        margin: ms(8),
    },
    detailCard: {
        padding: ms(8),
        backgroundColor: '#F8FAFC',
        borderRadius: ms(10),
        minHeight: vs(180),
    },
    cardLine: {
        marginTop: vs(6),
    },
    testsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(10),
        paddingVertical: vs(10),
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: ms(10),
        marginBottom: vs(5),
    },
    lastSection: {
        marginBottom: vs(20),
    },
});

export default LabDetailsShimmer;
