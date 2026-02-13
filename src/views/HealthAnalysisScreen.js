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
import Svg, { Path, Line } from 'react-native-svg';

// Importing your specific project utilities/config
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const HealthAnalysisScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [expandedSections, setExpandedSections] = useState({
        impact: true,
        improve: true,
    });

    const title = route?.params?.title || 'Heart Rate';

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Chart Component
    const AnalysisChart = () => {
        const chartWidth = width - ms(130);
        const chartHeight = vs(100);

        // Create zigzag path for the main line
        const createZigzagPath = () => {
            const points = [
                { x: 0, y: 0.5 },
                { x: 0.12, y: 0.25 },
                { x: 0.24, y: 0.7 },
                { x: 0.36, y: 0.35 },
                { x: 0.48, y: 0.8 },
                { x: 0.60, y: 0.3 },
                { x: 0.72, y: 0.65 },
                { x: 0.84, y: 0.4 },
                { x: 1, y: 0.55 },
            ];

            let path = `M ${points[0].x * chartWidth},${points[0].y * chartHeight}`;
            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x * chartWidth},${points[i].y * chartHeight}`;
            }
            return path;
        };

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartContainer}>
                    {/* Y-axis labels */}
                    <View style={styles.yAxisLabels}>
                        <Text style={styles.axisLabel}>100</Text>
                        <Text style={styles.axisLabel}>75</Text>
                        <Text style={styles.axisLabel}>50</Text>
                    </View>

                    <View style={styles.chartArea}>
                        <Svg width={chartWidth} height={chartHeight}>
                            {/* Red danger line at top */}
                            <Line
                                x1="0"
                                y1={chartHeight * 0.1}
                                x2={chartWidth}
                                y2={chartHeight * 0.1}
                                stroke="#EF4444"
                                strokeWidth="2"
                            />
                            {/* Dashed line at 100 */}
                            <Line
                                x1="0"
                                y1={chartHeight * 0.2}
                                x2={chartWidth}
                                y2={chartHeight * 0.2}
                                stroke="#9CA3AF"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                            />
                            {/* Yellow warning line in middle */}
                            <Line
                                x1="0"
                                y1={chartHeight * 0.5}
                                x2={chartWidth}
                                y2={chartHeight * 0.5}
                                stroke="#F59E0B"
                                strokeWidth="1"
                                strokeDasharray="5,5"
                            />
                            {/* Dashed line at 50 */}
                            <Line
                                x1="0"
                                y1={chartHeight * 0.85}
                                x2={chartWidth}
                                y2={chartHeight * 0.85}
                                stroke="#9CA3AF"
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
                            <Text style={styles.axisLabel}>Mon</Text>
                            <Text style={styles.axisLabel}>Tue</Text>
                            <Text style={styles.axisLabel}>Wed</Text>
                            <Text style={styles.axisLabel}>Thu</Text>
                            <Text style={styles.axisLabel}>Fri</Text>
                        </View>
                    </View>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: primaryColor }]} />
                        <Text style={styles.legendText}>All Good</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.legendText}>Keep an Eye On</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendText}>Attention Needed</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header with gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(24)} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>Analysis</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={styles.contentScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Chart */}
                <AnalysisChart />

                {/* Suggestions Section */}
                <View style={styles.suggestionsSection}>
                    <Text style={styles.sectionTitle}>Suggestions</Text>
                    <Text style={styles.suggestionText}>
                        Total serum calcium is a blood test done to measure the free and bound forms of calcium.
                    </Text>
                    <Text style={styles.suggestionText}>
                        It is often a part of screening test to detect abnormally high and low levels of calcium, as both can affect the health.
                    </Text>
                </View>

                {/* Impact on overall health */}
                <TouchableOpacity
                    style={styles.expandableHeader}
                    onPress={() => toggleSection('impact')}
                >
                    <Text style={styles.expandableTitle}>Impact on overall health?</Text>
                    <Icon
                        type={Icons.Ionicons}
                        name={expandedSections.impact ? "chevron-up" : "chevron-down"}
                        color={blackColor}
                        size={ms(22)}
                    />
                </TouchableOpacity>
                {expandedSections.impact && (
                    <View style={styles.expandableContent}>
                        <Text style={styles.expandableText}>
                            Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases, overactive thyroid gland, parathyroid disease, kidney or liver diseases.
                        </Text>
                    </View>
                )}

                <View style={styles.divider} />

                {/* How to improve health conditions */}
                <TouchableOpacity
                    style={styles.expandableHeader}
                    onPress={() => toggleSection('improve')}
                >
                    <Text style={styles.expandableTitle}>How to improve health conditions?</Text>
                    <Icon
                        type={Icons.Ionicons}
                        name={expandedSections.improve ? "chevron-up" : "chevron-down"}
                        color={blackColor}
                        size={ms(22)}
                    />
                </TouchableOpacity>
                {expandedSections.improve && (
                    <View style={styles.expandableContent}>
                        <Text style={styles.expandableText}>
                            For low calcium levels, a diet with calcium rich foods is recommended. See a doctor and discuss the need for calcium supplements.
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HealthAnalysisScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    headerGradient: {
        paddingTop: ms(50),
        paddingBottom: vs(25),
        paddingHorizontal: ms(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: ms(15),
    },
    headerTitle: {
        fontSize: ms(24),
        fontFamily: bold,
        color: whiteColor,
    },
    headerSubtitle: {
        fontSize: ms(14),
        fontFamily: regular,
        color: whiteColor,
        opacity: 0.9,
        marginTop: vs(2),
    },
    contentScrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
    },
    // Chart Card
    chartCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(25),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    yAxisLabels: {
        justifyContent: 'space-between',
        height: vs(100),
        marginRight: ms(12),
        paddingVertical: vs(5),
    },
    axisLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    chartArea: {
        flex: 1,
        overflow: 'hidden',
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(10),
        paddingRight: ms(5),
    },
    // Legend
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(15),
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginRight: ms(5),
    },
    legendText: {
        fontSize: ms(10),
        fontFamily: regular,
        color: blackColor,
    },
    // Suggestions
    suggestionsSection: {
        marginBottom: vs(20),
    },
    sectionTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(12),
    },
    suggestionText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        lineHeight: ms(22),
        marginBottom: vs(10),
    },
    // Expandable sections
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(15),
    },
    expandableTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        flex: 1,
    },
    expandableContent: {
        paddingBottom: vs(15),
    },
    expandableText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        lineHeight: ms(22),
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    bottomSpacer: {
        height: vs(50),
    },
});
