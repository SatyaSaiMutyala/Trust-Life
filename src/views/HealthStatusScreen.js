import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import Svg, { Path, Line, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

// Importing your specific project utilities/config
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const FILTER_TABS = ['Sugar', 'Thyroid', 'Cholesterol', 'Other'];

const HealthStatusScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedTab, setSelectedTab] = useState('Sugar');

    const patientName = route?.params?.name || 'Suresh Kumar';

    // Heart Rate Chart Component
    const HeartRateChart = () => {
        const chartWidth = width - ms(100);
        const chartHeight = vs(80);

        // Create zigzag path for heart rate
        const createZigzagPath = () => {
            const points = [
                { x: 0, y: 0.3 },
                { x: 0.14, y: 0.1 },
                { x: 0.28, y: 0.6 },
                { x: 0.42, y: 0.2 },
                { x: 0.56, y: 0.7 },
                { x: 0.70, y: 0.15 },
                { x: 0.84, y: 0.5 },
                { x: 1, y: 0.9 },
            ];

            let path = `M ${points[0].x * chartWidth},${points[0].y * chartHeight}`;
            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x * chartWidth},${points[i].y * chartHeight}`;
            }
            return path;
        };

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Heart Rate</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'Heart Rate' })}
                    >
                        <Text style={styles.analysisButtonText}>Analysis</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chartContainer}>
                    {/* Y-axis labels */}
                    <View style={styles.yAxisLabels}>
                        <Text style={styles.axisLabel}>100</Text>
                        <Text style={styles.axisLabel}>75</Text>
                        <Text style={styles.axisLabel}>50</Text>
                    </View>

                    <View style={styles.chartArea}>
                        <Svg width={chartWidth} height={chartHeight}>
                            {/* Dashed horizontal line at 100 (top) */}
                            <Line
                                x1="0"
                                y1={0}
                                x2={chartWidth}
                                y2={0}
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                            />
                            {/* Dashed horizontal line at 75 (middle) */}
                            <Line
                                x1="0"
                                y1={chartHeight * 0.5}
                                x2={chartWidth}
                                y2={chartHeight * 0.5}
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                            />
                            {/* Dashed horizontal line at 50 (bottom) */}
                            <Line
                                x1="0"
                                y1={chartHeight}
                                x2={chartWidth}
                                y2={chartHeight}
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                            />
                            {/* Main zigzag line */}
                            <Path
                                d={createZigzagPath()}
                                fill="none"
                                stroke={primaryColor}
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                        </Svg>

                        {/* X-axis labels */}
                        <View style={styles.xAxisLabels}>
                            <Text style={styles.axisLabel}>100</Text>
                            <Text style={styles.axisLabel}>75</Text>
                            <Text style={styles.axisLabel}>50</Text>
                            <Text style={styles.axisLabel}>50</Text>
                            <Text style={styles.axisLabel}>50</Text>
                            <Text style={styles.axisLabel}>50</Text>
                            <Text style={styles.axisLabel}>50</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Blood Pressure Chart Component
    const BloodPressureChart = () => {
        const chartWidth = width - ms(70);
        const chartHeight = vs(100);

        // Mountain-like area chart path
        const createMountainPath = () => {
            return `
                M 0,${chartHeight}
                L 0,${chartHeight * 0.7}
                C ${chartWidth * 0.1},${chartHeight * 0.5} ${chartWidth * 0.15},${chartHeight * 0.4} ${chartWidth * 0.2},${chartHeight * 0.45}
                C ${chartWidth * 0.25},${chartHeight * 0.5} ${chartWidth * 0.3},${chartHeight * 0.35} ${chartWidth * 0.38},${chartHeight * 0.25}
                C ${chartWidth * 0.45},${chartHeight * 0.15} ${chartWidth * 0.5},${chartHeight * 0.3} ${chartWidth * 0.55},${chartHeight * 0.4}
                C ${chartWidth * 0.6},${chartHeight * 0.5} ${chartWidth * 0.65},${chartHeight * 0.35} ${chartWidth * 0.72},${chartHeight * 0.2}
                C ${chartWidth * 0.8},${chartHeight * 0.05} ${chartWidth * 0.88},${chartHeight * 0.3} ${chartWidth * 0.95},${chartHeight * 0.45}
                L ${chartWidth},${chartHeight * 0.5}
                L ${chartWidth},${chartHeight}
                Z
            `;
        };

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Blood Pressure</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'Blood Pressure' })}
                    >
                        <Text style={styles.analysisButtonText}>Analysis</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bpValueRow}>
                    <Text style={styles.bpValue}>90/60</Text>
                    <Text style={styles.bpSuggested}>Suggested  120/80</Text>
                </View>

                <View style={styles.bpChartContainer}>
                    <Svg width={chartWidth} height={chartHeight}>
                        <Defs>
                            <SvgLinearGradient id="bpGradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={primaryColor} stopOpacity="1" />
                                <Stop offset="1" stopColor={primaryColor} stopOpacity="0.4" />
                            </SvgLinearGradient>
                        </Defs>
                        <Path
                            d={createMountainPath()}
                            fill="url(#bpGradient)"
                        />
                        {/* Circle indicator */}
                        <Circle
                            cx={chartWidth * 0.38}
                            cy={chartHeight * 0.25}
                            r={ms(5)}
                            fill={whiteColor}
                            stroke={primaryColor}
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            </View>
        );
    };

    // Pulse Chart Component
    const PulseChart = () => {
        const chartWidth = width - ms(70);
        const chartHeight = vs(50);

        // Wave line path - smoother sine wave
        const createWavePath = () => {
            let path = `M 0,${chartHeight * 0.5}`;
            const waves = 5;
            const waveWidth = chartWidth / waves;

            for (let i = 0; i < waves; i++) {
                const startX = i * waveWidth;
                const midX = startX + waveWidth / 2;
                const endX = startX + waveWidth;

                path += ` Q ${startX + waveWidth * 0.25},${chartHeight * 0.2} ${midX},${chartHeight * 0.5}`;
                path += ` Q ${midX + waveWidth * 0.25},${chartHeight * 0.8} ${endX},${chartHeight * 0.5}`;
            }
            return path;
        };

        return (
            <View style={styles.pulseCard}>
                <View style={styles.pulseHeader}>
                    <View>
                        <Text style={styles.pulseTitle}>Pulse</Text>
                        <Text style={styles.pulseValue}>78 Beats/Min</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.analysisButtonWhite}
                        onPress={() => navigation.navigate('HealthAnalysisScreen', { title: 'Pulse' })}
                    >
                        <Text style={styles.analysisButtonTextDark}>Analysis</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pulseChartContainer}>
                    <Svg width={chartWidth} height={chartHeight}>
                        <Path
                            d={createWavePath()}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.5)"
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.22]}
                style={styles.headerGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(24)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{patientName}</Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {FILTER_TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.filterTab,
                                    selectedTab === tab && styles.filterTabActive
                                ]}
                                onPress={() => setSelectedTab(tab)}
                            >
                                <Text style={[
                                    styles.filterTabText,
                                    selectedTab === tab && styles.filterTabTextActive
                                ]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Charts */}
                <ScrollView
                    style={styles.chartsScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.chartsContent}
                >
                    <HeartRateChart />
                    <BloodPressureChart />
                    <PulseChart />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HealthStatusScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerGradient: {
        flex: 1,
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginBottom: vs(25),
    },
    backButton: {
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(22),
        fontFamily: bold,
        color: whiteColor,
    },
    tabsWrapper: {
        marginBottom: vs(20),
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        gap: ms(10),
    },
    filterTab: {
        paddingHorizontal: ms(22),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor:whiteColor
    },
    filterTabActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    filterTabText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    filterTabTextActive: {
        color: whiteColor,
        fontFamily: bold,
    },
    chartsScrollView: {
        flex: 1,
        paddingHorizontal: ms(20),
    },
    chartsContent: {
        paddingBottom: vs(100),
    },
    // Heart Rate Card
    chartCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(15),
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    chartTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    analysisButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        borderRadius: ms(20),
    },
    analysisButtonText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    yAxisLabels: {
        justifyContent: 'space-between',
        height: vs(80),
        marginRight: ms(12),
        paddingTop: vs(2),
    },
    axisLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    chartArea: {
        flex: 1,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(10),
        paddingRight: ms(5),
    },
    // Blood Pressure Card
    bpValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(5),
    },
    bpValue: {
        fontSize: ms(22),
        fontFamily: bold,
        color: blackColor,
        marginRight: ms(15),
    },
    bpSuggested: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    bpChartContainer: {
        marginTop: vs(5),
        marginHorizontal: ms(-5),
    },
    // Pulse Card
    pulseCard: {
        backgroundColor: primaryColor,
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(15),
    },
    pulseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    pulseTitle: {
        fontSize: ms(14),
        fontFamily: regular,
        color: whiteColor,
        opacity: 0.9,
        marginBottom: vs(4),
    },
    pulseValue: {
        fontSize: ms(20),
        fontFamily: bold,
        color: whiteColor,
    },
    analysisButtonWhite: {
        backgroundColor: whiteColor,
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        borderRadius: ms(20),
    },
    analysisButtonTextDark: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    pulseChartContainer: {
        marginTop: vs(15),
        marginHorizontal: ms(-5),
    },
});
