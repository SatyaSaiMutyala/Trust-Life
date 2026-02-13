import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { globalGradient } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const SelectedTestShimmer = () => {
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
                end={{ x: 0, y: 3 }}
                locations={[0, 0.07]}
                style={{ paddingTop: vs(50), paddingBottom: vs(20) }}
            >
                {/* Back Button and Help */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: ms(15), marginBottom: vs(20) }}>
                    <ShimmerBox width={ms(35)} height={ms(35)} borderRadius={ms(18)} />
                    <ShimmerBox width={ms(100)} height={ms(35)} borderRadius={ms(20)} />
                </View>

            {/* Main Details Card */}
            <View style={{ backgroundColor: '#fff', marginHorizontal: ms(15), marginTop: vs(20), borderRadius: ms(15), padding: ms(15) }}>
                {/* Test Name */}
                <ShimmerBox width="80%" height={vs(20)} style={{ marginBottom: vs(20) }} />

                {/* Info Pills Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: ms(10), marginBottom: vs(15) }}>
                    <ShimmerBox width={(width - ms(60)) * 0.4} height={vs(40)} borderRadius={ms(10)} />
                    <ShimmerBox width={(width - ms(60)) * 0.6} height={vs(40)} borderRadius={ms(10)} />
                </View>

                {/* Report Delivery */}
                <ShimmerBox width="100%" height={vs(40)} style={{ marginBottom: vs(15) }} borderRadius={ms(10)} />

                {/* Price and Button Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(15) }}>
                    <View>
                        <ShimmerBox width={ms(80)} height={vs(20)} style={{ marginBottom: vs(5) }} />
                        <ShimmerBox width={ms(120)} height={vs(15)} />
                    </View>
                    <ShimmerBox width={ms(100)} height={vs(40)} borderRadius={ms(20)} />
                </View>

                {/* Instructions Section */}
                <ShimmerBox width="70%" height={vs(18)} style={{ marginTop: vs(10), marginBottom: vs(8) }} />
                <ShimmerBox width="100%" height={vs(15)} style={{ marginBottom: vs(5) }} />
                <ShimmerBox width="90%" height={vs(15)} style={{ marginBottom: vs(5) }} />
                <ShimmerBox width="95%" height={vs(15)} />
            </View>

            {/* Tests Included Section */}
            <View style={{ marginVertical: vs(20) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: ms(20), marginBottom: vs(15) }}>
                    <ShimmerBox width={ms(180)} height={vs(18)} />
                    <ShimmerBox width={ms(80)} height={vs(18)} />
                </View>

                {/* Test Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: ms(20) }}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <ShimmerBox
                            key={index}
                            width={ms(120)}
                            height={vs(40)}
                            style={{ marginRight: ms(10) }}
                            borderRadius={ms(10)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Sample Collection Section */}
            <View style={{ paddingHorizontal: ms(20), marginBottom: vs(50) }}>
                <ShimmerBox width={ms(180)} height={vs(18)} style={{ marginBottom: vs(15) }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(15) }}>
                    <ShimmerBox width={ms(120)} height={vs(80)} borderRadius={ms(10)} />
                    <ShimmerBox width={ms(100)} height={vs(80)} borderRadius={ms(10)} />
                </View>
                <ShimmerBox width="100%" height={vs(15)} style={{ marginBottom: vs(5) }} />
                <ShimmerBox width="80%" height={vs(15)} />
            </View>
            </LinearGradient>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});

export default SelectedTestShimmer;
