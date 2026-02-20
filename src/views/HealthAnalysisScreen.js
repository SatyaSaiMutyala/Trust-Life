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
import Svg, { Path, Line, Circle as SvgCircle } from 'react-native-svg';

import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

// ── Chart data ──────────────────────────────────────────────────────────────
// Zigzag values matching the original design pattern
const CHART_VALUES = [72, 95, 65, 93, 60, 85, 58, 83, 55, 80, 53, 95];
// X-axis labels (only shown at evenly spaced positions)
const X_LABELS = ['100', '75', '50', '50', '50', '50', '50'];

const Y_MIN = 40;
const Y_MAX = 110;
const THRESHOLD_Y = 85;  // green dashed line
const TOP_LINE_Y = 105;  // gray line at top
const BOTTOM_LINE_Y = 48; // red line at bottom

const HealthAnalysisScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [expandedSections, setExpandedSections] = useState({
        impact: true,
        improve: true,
        diet: false,
        expert: false,
    });

    const title = route?.params?.title || 'Calcium Total, serum';
    const status = route?.params?.status || 'Critical';
    const value = route?.params?.value || '8.3';
    const unit = route?.params?.unit || 'Mg/dl';
    const normalRange = route?.params?.normalRange || '8.8- 10.6 mg/dl';

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const statusColor = status === 'Critical' ? '#EF4444' : status === 'Attention' ? '#F59E0B' : primaryColor;

    // ── Chart ───────────────────────────────────────────────────────────────
    const AnalysisChart = () => {
        const chartWidth = width - ms(120);
        const chartHeight = vs(120);
        const padTop = vs(8);
        const padBottom = vs(8);
        const drawHeight = chartHeight - padTop - padBottom;

        const toY = (val) => padTop + drawHeight * (1 - (val - Y_MIN) / (Y_MAX - Y_MIN));
        const toX = (idx) => (idx / (CHART_VALUES.length - 1)) * chartWidth;

        // Build zigzag path
        let pathD = `M ${toX(0).toFixed(1)},${toY(CHART_VALUES[0]).toFixed(1)}`;
        for (let i = 1; i < CHART_VALUES.length; i++) {
            pathD += ` L ${toX(i).toFixed(1)},${toY(CHART_VALUES[i]).toFixed(1)}`;
        }

        const thresholdLineY = toY(THRESHOLD_Y);
        const topLineY = toY(TOP_LINE_Y);
        const bottomLineY = toY(BOTTOM_LINE_Y);

        const yTicks = [100, 75, 50];

        return (
            <View style={styles.chartCard}>
                <View style={styles.chartContainer}>
                    {/* Y-axis labels */}
                    <View style={[styles.yAxisLabels, { height: chartHeight }]}>
                        {yTicks.map((tick) => (
                            <Text
                                key={tick}
                                style={[
                                    styles.axisLabel,
                                    { position: 'absolute', top: toY(tick) - ms(6) },
                                ]}
                            >
                                {tick}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.chartArea}>
                        <Svg width={chartWidth} height={chartHeight}>
                            {/* Gray line at top */}
                            <Line
                                x1="0" y1={topLineY}
                                x2={chartWidth} y2={topLineY}
                                stroke="red" strokeWidth="1"
                            />
                            {/* Green dashed threshold line */}
                            <Line
                                x1="0" y1={thresholdLineY}
                                x2={chartWidth} y2={thresholdLineY}
                                stroke={primaryColor} strokeWidth="1.5"
                                strokeDasharray="8,5"
                            />
                            {/* Red line at bottom */}
                            <Line
                                x1="0" y1={bottomLineY}
                                x2={chartWidth} y2={bottomLineY}
                                stroke="#EF4444" strokeWidth="1"
                            />
                            {/* Main zigzag line */}
                            <Path
                                d={pathD}
                                fill="none"
                                stroke={primaryColor}
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {/* Data point dots */}
                            {CHART_VALUES.map((val, i) => (
                                <SvgCircle
                                    key={i}
                                    cx={toX(i)}
                                    cy={toY(val)}
                                    r={3.5}
                                    fill={primaryColor}
                                />
                            ))}
                        </Svg>

                        {/* X-axis labels */}
                        <View style={styles.xAxisLabels}>
                            {X_LABELS.map((label, i) => (
                                <Text key={i} style={styles.axisLabel}>{label}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: primaryColor }]} />
                        <Text style={styles.legendText}>Stable</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.legendText}>Moderate</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
                        <Text style={styles.legendText}>Attention</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.legendText}>Critical</Text>
                    </View>
                </View>
            </View>
        );
    };

    // ── Accordion Row ───────────────────────────────────────────────────────
    const AccordionSection = ({ sectionKey, sectionTitle, children }) => (
        <>
            <TouchableOpacity
                style={styles.expandableHeader}
                onPress={() => toggleSection(sectionKey)}
            >
                <Text style={styles.expandableTitle}>{sectionTitle}</Text>
                <Icon
                    type={Icons.Ionicons}
                    name={expandedSections[sectionKey] ? 'chevron-up' : 'chevron-down'}
                    color={blackColor}
                    size={ms(22)}
                />
            </TouchableOpacity>
            {expandedSections[sectionKey] && (
                <View style={styles.expandableContent}>
                    {children}
                </View>
            )}
            <View style={styles.divider} />
        </>
    );

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
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(18)} />
                </TouchableOpacity>

                {/* Title + Badge Row */}
                <View style={styles.titleRow}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusBadgeText}>{status}</Text>
                    </View>
                </View>

                {/* Value */}
                <View style={styles.valueRow}>
                    <Text style={styles.valueText}>{value}</Text>
                    <Text style={styles.unitText}> {unit}</Text>
                </View>
                <Text style={styles.resultLabel}>Your Result Value</Text>

                {/* Normal Range */}
                <Text style={styles.normalRange}>Normal Value : {normalRange}</Text>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={styles.contentScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Chart */}
                <AnalysisChart />

                {/* Description */}
                <Text style={styles.descriptionText}>
                    Total serum calcium is a blood test done to measure the free and bound forms of calcium.
                </Text>
                <Text style={styles.descriptionText}>
                    It is often a part of screening test to detect abnormally high and low levels of calcium, as both can affect the health.
                </Text>

                {/* Accordion Sections */}
                <AccordionSection sectionKey="impact" sectionTitle="Impact on overall health?">
                    <Text style={styles.expandableText}>
                        Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases, overactive thyroid gland, parathyroid disease, kidney or liver diseases.
                    </Text>
                </AccordionSection>

                <AccordionSection sectionKey="improve" sectionTitle="How to improve health conditions?">
                    <Text style={styles.expandableText}>
                        For low calcium levels, a diet with calcium rich foods is recommended. See a doctor and discuss the need for calcium supplements.
                    </Text>
                </AccordionSection>

                <AccordionSection sectionKey="diet" sectionTitle="Recommended Diet Plan ?">
                    <Text style={styles.expandableText}>
                        Include dairy products, leafy greens, almonds, fortified cereals, and fish with edible bones. Limit caffeine and sodium which can reduce calcium absorption.
                    </Text>
                </AccordionSection>

                <AccordionSection sectionKey="expert" sectionTitle="Connect health expert for lifestyle recommendations">
                    <Text style={styles.expandableText}>
                        Connect with our certified health experts for personalized lifestyle and diet recommendations tailored to your health condition.
                    </Text>
                </AccordionSection>

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

    // ── Gradient Header
    headerGradient: {
        paddingTop: ms(45),
        paddingBottom: vs(25),
        paddingHorizontal: ms(20),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
        marginBottom: vs(10),
    },
    headerTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
    },
    statusBadge: {
        borderRadius: ms(16),
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
    },
    statusBadgeText: {
        fontSize: ms(12),
        fontFamily: bold,
        color: whiteColor,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    valueText: {
        fontSize: ms(36),
        fontFamily: bold,
        color: blackColor,
    },
    unitText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    resultLabel: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
        marginTop: vs(2),
    },
    normalRange: {
        fontSize: ms(13),
        fontFamily: regular,
        color: primaryColor,
        marginTop: vs(8),
    },

    // ── Content
    contentScrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
    },

    // ── Chart Card
    chartCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(18),
        marginBottom: vs(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    yAxisLabels: {
        width: ms(30),
        marginRight: ms(8),
    },
    axisLabel: {
        fontSize: ms(11),
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
        marginTop: vs(8),
    },

    // ── Legend
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(15),
        paddingTop: vs(12),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        marginRight: ms(5),
    },
    legendText: {
        fontSize: ms(11),
        fontFamily: regular,
        color: blackColor,
    },

    // ── Description
    descriptionText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        lineHeight: ms(21),
        marginBottom: vs(10),
    },

    // ── Expandable Sections
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(14),
    },
    expandableTitle: {
        fontSize: ms(15),
        fontFamily: bold,
        fontWeight: '700',
        color: blackColor,
        flex: 1,
        paddingRight: ms(10),
    },
    expandableContent: {
        paddingBottom: vs(12),
    },
    expandableText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        lineHeight: ms(21),
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    bottomSpacer: {
        height: vs(50),
    },
});
