import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path,
    Circle,
    Line,
    Defs,
    LinearGradient as SvgLinearGradient,
    Stop,
} from 'react-native-svg';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - ms(80);
const CHART_HEIGHT = vs(140);
const X_LABELS = ['12 Feb', '13 Mar', '25 Apr', '21 May', '12 June', '12 July'];

// ── Chart configs per condition ──────────────────────────────────────────
const CONDITION_CHARTS = {
    Fever: {
        timelineSubtext: 'View your past readings to identify trends and monitor whether your fever is improving or worsening.',
        normalRange: { title: 'Normal body temperature: 97°F – 99°F', desc: 'Track your temperature changes and compare them with the normal range' },
        charts: [
            {
                label: 'Fahrenheit (°F)',
                color: '#3B82F6',
                tooltipValue: '100.1 F',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.55 }, { x: 0.12, y: 0.35 }, { x: 0.20, y: 0.15 },
                    { x: 0.30, y: 0.12 }, { x: 0.40, y: 0.18 }, { x: 0.52, y: 0.45 },
                    { x: 0.62, y: 0.55 }, { x: 0.72, y: 0.50 }, { x: 0.82, y: 0.60 },
                    { x: 0.92, y: 0.35 }, { x: 1, y: 0.30 },
                ],
            },
        ],
    },
    Infection: {
        timelineSubtext: 'View your past readings to identify trends and monitor whether your infection is improving or worsening.',
        normalRange: null,
        charts: [
            {
                label: 'WBCTREND',
                color: '#3B82F6',
                tooltipValue: '12.4',
                highlightIndex: 1,
                points: [
                    { x: 0, y: 0.75 }, { x: 0.10, y: 0.50 }, { x: 0.20, y: 0.20 },
                    { x: 0.32, y: 0.15 }, { x: 0.44, y: 0.25 }, { x: 0.55, y: 0.40 },
                    { x: 0.65, y: 0.30 }, { x: 0.75, y: 0.35 }, { x: 0.85, y: 0.25 },
                    { x: 1, y: 0.20 },
                ],
            },
            {
                label: 'CRP TREND',
                color: '#D946EF',
                tooltipValue: '12.4',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.80 }, { x: 0.12, y: 0.60 }, { x: 0.22, y: 0.25 },
                    { x: 0.35, y: 0.15 }, { x: 0.45, y: 0.30 }, { x: 0.55, y: 0.50 },
                    { x: 0.65, y: 0.35 }, { x: 0.78, y: 0.40 }, { x: 0.88, y: 0.30 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'ESR TREND',
                color: '#3B82F6',
                tooltipValue: '12.4',
                highlightIndex: 1,
                points: [
                    { x: 0, y: 0.70 }, { x: 0.10, y: 0.45 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.30 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.35 },
                    { x: 0.66, y: 0.22 }, { x: 0.77, y: 0.15 }, { x: 0.88, y: 0.25 },
                    { x: 1, y: 0.18 },
                ],
            },
        ],
    },
    Allergy: {
        timelineSubtext: 'View your past readings to identify trends and monitor whether your allergy is improving or worsening.',
        normalRange: null,
        charts: [
            {
                label: 'IgE',
                color: '#3B82F6',
                tooltipValue: '250 IU/mL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.60 }, { x: 0.12, y: 0.40 }, { x: 0.22, y: 0.18 },
                    { x: 0.34, y: 0.15 }, { x: 0.45, y: 0.25 }, { x: 0.55, y: 0.38 },
                    { x: 0.65, y: 0.42 }, { x: 0.75, y: 0.35 }, { x: 0.85, y: 0.30 },
                    { x: 1, y: 0.28 },
                ],
            },
        ],
    },
};

// ── Helpers ──────────────────────────────────────────────────────────────
const createCurvePath = (dataPoints) => {
    const points = dataPoints.map((p) => ({
        x: p.x * CHART_WIDTH,
        y: p.y * CHART_HEIGHT,
    }));
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
        path += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return path;
};

const createAreaPath = (dataPoints) => {
    const curvePath = createCurvePath(dataPoints);
    const lastX = dataPoints[dataPoints.length - 1].x * CHART_WIDTH;
    const firstX = dataPoints[0].x * CHART_WIDTH;
    return `${curvePath} L ${lastX},${CHART_HEIGHT} L ${firstX},${CHART_HEIGHT} Z`;
};

// ── Reusable Chart Component ─────────────────────────────────────────────
const AreaChart = ({ chartData, chartIndex }) => {
    const { label, color, tooltipValue, highlightIndex, points } = chartData;
    const gradientId = `areaFill_${chartIndex}`;

    const highlight = {
        x: points[highlightIndex].x * CHART_WIDTH,
        y: points[highlightIndex].y * CHART_HEIGHT,
    };

    return (
        <View style={styles.singleChart}>
            {/* Label + Bio-meters */}
            <View style={styles.legendRow}>
                <Text style={styles.legendLabel}>{label}</Text>
                <View style={styles.bioMetersBadge}>
                    <Text style={styles.bioMetersText}>Bio-meters</Text>
                </View>
            </View>

            <View style={styles.chartArea}>
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    <Defs>
                        <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
                        </SvgLinearGradient>
                    </Defs>

                    {/* Horizontal grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
                        <Line
                            key={i}
                            x1="0"
                            y1={pos * CHART_HEIGHT}
                            x2={CHART_WIDTH}
                            y2={pos * CHART_HEIGHT}
                            stroke="#F3F4F6"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Area fill */}
                    <Path d={createAreaPath(points)} fill={`url(#${gradientId})`} />

                    {/* Curve line */}
                    <Path
                        d={createCurvePath(points)}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data point dots */}
                    {points.map((p, i) => (
                        <Circle
                            key={i}
                            cx={p.x * CHART_WIDTH}
                            cy={p.y * CHART_HEIGHT}
                            r={i === highlightIndex ? 6 : 4}
                            fill={i === highlightIndex ? color : whiteColor}
                            stroke={color}
                            strokeWidth={i === highlightIndex ? 3 : 2}
                        />
                    ))}

                    {/* Vertical dashed line */}
                    <Line
                        x1={highlight.x}
                        y1={highlight.y + 8}
                        x2={highlight.x}
                        y2={CHART_HEIGHT}
                        stroke="#D1D5DB"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                    />
                </Svg>

                {/* Tooltip */}
                <View style={[
                    styles.tooltip,
                    { left: highlight.x - ms(28), top: highlight.y - vs(28) },
                ]}>
                    <Text style={[styles.tooltipText, { color }]}>{tooltipValue}</Text>
                </View>

                {/* X-axis labels */}
                <View style={styles.xAxisLabels}>
                    {X_LABELS.map((l, i) => (
                        <Text key={i} style={styles.axisLabel}>{l}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

// ── Main Screen ──────────────────────────────────────────────────────────
const ConditionDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};

    const conditionName = condition.name || 'Fever';
    const config = CONDITION_CHARTS[conditionName] || CONDITION_CHARTS.Fever;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{conditionName}</Text>
                        <Text style={styles.headerSubtitle}>Acute</Text>
                    </View>
                    <View style={styles.activeStatusBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeStatusText}>Active</Text>
                    </View>
                </View>

                {/* Stability + Date */}
                <View style={styles.statusRow}>
                    <View style={[styles.stabilityBadge, { backgroundColor: condition.stabilityBgColor || '#DCFCE7' }]}>
                        <Text style={[styles.stabilityText, { color: condition.stabilityColor || primaryColor }]}>
                            {condition.stability || 'Stable'}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>{condition.date || '12 Jan, 12:30 PM'}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {condition.description || 'Body temperature above normal, usually due to infection or inflammation'}
                </Text>

                {/* Report Timeline Card */}
                <View style={styles.timelineCard}>
                    <Text style={styles.timelineTitle}>Report Timeline</Text>
                    <Text style={styles.timelineSubtext}>{config.timelineSubtext}</Text>

                    {/* Render all charts for this condition */}
                    {config.charts.map((chartData, index) => (
                        <AreaChart key={index} chartData={chartData} chartIndex={index} />
                    ))}
                </View>

                {/* Normal Range Card */}
                {config.normalRange && (
                    <View style={styles.normalRangeCard}>
                        <Text style={styles.normalRangeTitle}>{config.normalRange.title}</Text>
                        <Text style={styles.normalRangeDesc}>{config.normalRange.desc}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(40),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTextWrap: {
        flex: 1,
        marginLeft: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    headerSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },
    activeStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        borderRadius: ms(14),
    },
    activeDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: primaryColor,
        marginRight: ms(6),
    },
    activeStatusText: {
        fontFamily: bold,
        fontSize: ms(11),
        color: primaryColor,
    },

    // Status Row
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: vs(16),
        marginBottom: vs(10),
    },
    stabilityBadge: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
        borderRadius: ms(14),
    },
    stabilityText: {
        fontFamily: bold,
        fontSize: ms(12),
    },
    dateText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },

    // Description
    description: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        lineHeight: ms(20),
        marginBottom: vs(20),
    },

    // Timeline Card
    timelineCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    timelineTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(6),
    },
    timelineSubtext: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        lineHeight: ms(17),
        marginBottom: vs(14),
    },

    // Single Chart Block
    singleChart: {
        marginBottom: vs(20),
    },

    // Legend
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    legendLabel: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
    },
    bioMetersBadge: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: ms(8),
        paddingHorizontal: ms(12),
        paddingVertical: vs(4),
    },
    bioMetersText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: blackColor,
    },

    // Chart
    chartArea: {
        flex: 1,
    },
    xAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(8),
    },
    axisLabel: {
        fontFamily: regular,
        fontSize: ms(9),
        color: '#9CA3AF',
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: whiteColor,
        borderRadius: ms(8),
        paddingHorizontal: ms(8),
        paddingVertical: vs(4),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    tooltipText: {
        fontFamily: bold,
        fontSize: ms(10),
    },

    // Normal Range Card
    normalRangeCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    normalRangeTitle: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(8),
    },
    normalRangeDesc: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(19),
    },
});

export default ConditionDetailScreen;
