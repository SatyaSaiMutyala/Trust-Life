import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { globalGradient } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const BANNER_WIDTH = width * 0.9;
const BANNER_PADDING = (width - BANNER_WIDTH) / 2;

const DashboardShimmer = () => {
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

    const ShimmerBox = ({ width: w, height, style, borderRadius = ms(8) }) => (
        <Animated.View
            style={[
                {
                    width: w,
                    height,
                    backgroundColor: '#E0E0E0',
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );

    const ShimmerBoxLight = ({ width: w, height, style, borderRadius = ms(8) }) => (
        <Animated.View
            style={[
                {
                    width: w,
                    height,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 12]}
                style={{ paddingTop: ms(50), paddingBottom: ms(100) }}
            >
                {/* Header Row - Location icon, Name, 3 Icons */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(10), marginBottom: ms(30) }}>
                    <ShimmerBoxLight width={ms(34)} height={ms(34)} borderRadius={ms(17)} style={{ marginRight: ms(8) }} />
                    <View style={{ flex: 1, marginRight: ms(8) }}>
                        <ShimmerBoxLight width={ms(130)} height={ms(16)} style={{ marginBottom: ms(5) }} />
                        <ShimmerBoxLight width={ms(180)} height={ms(11)} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: ms(6) }}>
                        <ShimmerBoxLight width={ms(34)} height={ms(34)} borderRadius={ms(17)} />
                        <ShimmerBoxLight width={ms(34)} height={ms(34)} borderRadius={ms(17)} />
                        <ShimmerBoxLight width={ms(34)} height={ms(34)} borderRadius={ms(17)} />
                    </View>
                </View>

                {/* Search Bar */}
                <View style={{ paddingHorizontal: ms(15), marginBottom: ms(10) }}>
                    <ShimmerBoxLight
                        width={width - ms(30)}
                        height={vs(45)}
                        borderRadius={ms(25)}
                    />
                </View>

                {/* Top Service Cards - 4 horizontal */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: ms(15), paddingVertical: ms(5) }}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <ShimmerBoxLight
                            key={index}
                            width={ms(80)}
                            height={ms(80)}
                            borderRadius={ms(12)}
                            style={{ marginHorizontal: ms(2) }}
                        />
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* Banners */}
            <View style={{ marginTop: ms(-80) }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: BANNER_PADDING }}>
                    {[1, 2].map((_, index) => (
                        <ShimmerBox
                            key={index}
                            width={BANNER_WIDTH}
                            height={width * 0.30}
                            borderRadius={ms(15)}
                            style={{ marginRight: index === 0 ? ms(10) : 0 }}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Track your Test - 3 items */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: ms(15), marginVertical: ms(20) }}>
                {[1, 2, 3].map((_, index) => (
                    <View key={index} style={{ alignItems: 'center', width: ms(100) }}>
                        <ShimmerBox width={ms(40)} height={ms(40)} borderRadius={ms(20)} style={{ marginBottom: ms(8) }} />
                        <ShimmerBox width={ms(70)} height={ms(12)} style={{ marginBottom: ms(4) }} />
                        <ShimmerBox width={ms(50)} height={ms(12)} />
                    </View>
                ))}
            </View>

            {/* Popular Blood Test - heading + 6 circles */}
            <View style={{ paddingHorizontal: ms(15), marginBottom: ms(10) }}>
                <ShimmerBox width={ms(180)} height={ms(18)} style={{ marginBottom: ms(15) }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(10) }}>
                    {[1, 2, 3, 4, 5, 6].map((_, index) => (
                        <View key={index} style={{ alignItems: 'center', width: (width - ms(60)) / 3 }}>
                            <ShimmerBox width={ms(80)} height={ms(80)} borderRadius={ms(40)} />
                            <ShimmerBox width={ms(50)} height={ms(12)} style={{ marginTop: ms(6) }} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Your Health Status */}
            <View style={{ paddingHorizontal: ms(15), marginTop: ms(10), marginBottom: ms(10) }}>
                <ShimmerBox width={ms(150)} height={ms(18)} style={{ alignSelf: 'center', marginBottom: ms(12) }} />
                <ShimmerBox width={width - ms(30)} height={ms(140)} borderRadius={ms(16)} />
            </View>

            {/* Track your Health journey - 2x2 grid */}
            <View style={{ paddingHorizontal: ms(15), marginTop: ms(15), marginBottom: ms(10) }}>
                <ShimmerBox width={ms(200)} height={ms(18)} style={{ alignSelf: 'center', marginBottom: ms(12) }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: ms(15) }}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <ShimmerBox
                            key={index}
                            width={(width - ms(50)) / 2}
                            height={ms(180)}
                            borderRadius={ms(14)}
                            style={{
                                borderTopLeftRadius: ms(50),
                                borderTopRightRadius: ms(50),
                                borderBottomLeftRadius: ms(10),
                                borderBottomRightRadius: ms(10),
                            }}
                        />
                    ))}
                </View>
            </View>

            {/* What members say - horizontal cards */}
            <View style={{ marginHorizontal: ms(15), marginTop: ms(15), marginBottom: ms(10) }}>
                <ShimmerBox width={ms(160)} height={ms(18)} style={{ marginBottom: ms(12) }} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={{ width: ms(180), marginRight: ms(10), backgroundColor: '#F1F5F9', borderRadius: ms(12), padding: ms(12) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(8) }}>
                                <ShimmerBox width={ms(38)} height={ms(38)} borderRadius={ms(19)} style={{ marginRight: ms(8) }} />
                                <ShimmerBox width={ms(60)} height={ms(14)} style={{ flex: 1 }} />
                                <ShimmerBox width={ms(35)} height={ms(18)} borderRadius={ms(10)} />
                            </View>
                            <ShimmerBox width={ms(150)} height={ms(10)} style={{ marginBottom: ms(4) }} />
                            <ShimmerBox width={ms(130)} height={ms(10)} />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Footer Placeholder */}
            <View style={{ padding: ms(20), marginBottom: vs(20) }}>
                <ShimmerBox width={width - ms(40)} height={vs(180)} borderRadius={ms(16)} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

export default DashboardShimmer;
