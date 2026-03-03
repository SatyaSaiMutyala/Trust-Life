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

// ── Chart configs per condition ─────────────────────────────────────────
const CONDITION_CHARTS = {
    'Chronic kidney disease': {
        description: 'Kidney function is stable, continue regular monitoring and follow your care plan to maintain your health.',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your hypertension is improving or worsening.',
        normalValues: {
            title: 'Normal values',
            rows: [
                { label: 'eGFR:', value: '90 or above' },
                { label: 'Creatinine:', value: '~0.7 – 1.3 mg/dL' },
                { label: 'Blood Urea', value: '~7 – 20 mg/dL.' },
                { label: 'Urine Albumin', value: 'below 30 mg/g' },
            ],
            desc: 'These reference ranges show normal kidney health values to help you understand and compare your test results.',
        },
        charts: [
            {
                label: 'eGFR',
                color: '#3B82F6',
                tooltipValue: '52',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.60 }, { x: 0.12, y: 0.42 }, { x: 0.22, y: 0.22 },
                    { x: 0.33, y: 0.18 }, { x: 0.44, y: 0.28 }, { x: 0.55, y: 0.45 },
                    { x: 0.65, y: 0.38 }, { x: 0.75, y: 0.50 }, { x: 0.85, y: 0.35 },
                    { x: 1, y: 0.28 },
                ],
            },
            {
                label: 'Creatinine',
                color: '#3B82F6',
                tooltipValue: '1.6 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.55 }, { x: 0.12, y: 0.38 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.25 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.35 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'Blood Urea',
                color: '#3B82F6',
                tooltipValue: '32 mg/dL',
                highlightIndex: 3,
                points: [
                    { x: 0, y: 0.50 }, { x: 0.12, y: 0.35 }, { x: 0.22, y: 0.25 },
                    { x: 0.33, y: 0.18 }, { x: 0.44, y: 0.30 }, { x: 0.55, y: 0.48 },
                    { x: 0.65, y: 0.40 }, { x: 0.75, y: 0.52 }, { x: 0.85, y: 0.38 },
                    { x: 1, y: 0.30 },
                ],
            },
            {
                label: 'Urine ACR:',
                color: '#3B82F6',
                tooltipValue: '120 mg/g',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.55 }, { x: 0.12, y: 0.40 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.15 }, { x: 0.44, y: 0.25 }, { x: 0.55, y: 0.38 },
                    { x: 0.65, y: 0.32 }, { x: 0.75, y: 0.42 }, { x: 0.85, y: 0.30 },
                    { x: 1, y: 0.22 },
                ],
            },
        ],
    },
    Asthma: {
        description: 'Your asthma is currently being monitored. Continue following your treatment plan and track symptoms regularly.',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your asthma is improving or worsening.',
        normalValues: null,
        charts: [
            {
                label: 'Peak Flow',
                color: '#3B82F6',
                tooltipValue: '420 L/min',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.55 }, { x: 0.12, y: 0.38 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.25 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.35 },
                    { x: 0.65, y: 0.30 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.28 },
                    { x: 1, y: 0.22 },
                ],
            },
        ],
    },
    "Alzheimer's disease": {
        description: 'Your diabetes levels are currently stable. Continue regular monitoring to maintain control."',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your diabetes is improving or worsening.',
        normalValues: {
            title: null,
            rows: [
                { label: 'Normal: CSF A\u03B242:', value: '~500–1,200 pg/mL' },
                { label: '(t-tau) Normal:', value: '~80–400 pg/mL' },
                { label: '(p-tau) below', value: '~60–70 pg/mL' },
                { label: 'Tau (p-tau)', value: '~60–70 pg/mL' },
            ],
            desc: 'Keep your blood sugar within a healthy range to stay in control and prevent complications.',
        },
        charts: [
            {
                label: 'Amyloid beta (A\u03B242)',
                color: '#3B82F6',
                tooltipValue: '800 pg/mL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.80 }, { x: 0.12, y: 0.55 }, { x: 0.22, y: 0.22 },
                    { x: 0.33, y: 0.30 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.35 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'Total Tau (t-tau)',
                color: '#3B82F6',
                tooltipValue: '320 pg/mL',
                highlightIndex: 3,
                points: [
                    { x: 0, y: 0.70 }, { x: 0.12, y: 0.45 }, { x: 0.22, y: 0.30 },
                    { x: 0.33, y: 0.20 }, { x: 0.44, y: 0.28 }, { x: 0.55, y: 0.42 },
                    { x: 0.65, y: 0.35 }, { x: 0.75, y: 0.48 }, { x: 0.85, y: 0.40 },
                    { x: 1, y: 0.35 },
                ],
            },
            {
                label: 'Phosphorylated Tau (p-tau)',
                color: '#3B82F6',
                tooltipValue: '55 pg/mL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.75 }, { x: 0.12, y: 0.50 }, { x: 0.22, y: 0.25 },
                    { x: 0.33, y: 0.20 }, { x: 0.44, y: 0.30 }, { x: 0.55, y: 0.45 },
                    { x: 0.65, y: 0.38 }, { x: 0.75, y: 0.50 }, { x: 0.85, y: 0.42 },
                    { x: 1, y: 0.35 },
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
    const gradientId = `cpFill_${chartIndex}`;

    const highlight = {
        x: points[highlightIndex].x * CHART_WIDTH,
        y: points[highlightIndex].y * CHART_HEIGHT,
    };

    return (
        <View style={styles.singleChart}>
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

                    <Path d={createAreaPath(points)} fill={`url(#${gradientId})`} />

                    <Path
                        d={createCurvePath(points)}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

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

                <View style={[
                    styles.tooltip,
                    { left: highlight.x - ms(28), top: highlight.y - vs(28) },
                ]}>
                    <Text style={[styles.tooltipText, { color }]}>{tooltipValue}</Text>
                </View>

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
const ChronicProgressiveDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};

    const conditionName = condition.name || 'Chronic kidney disease';
    const config = CONDITION_CHARTS[conditionName] || CONDITION_CHARTS['Chronic kidney disease'];

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
                        <Text style={styles.headerSubtitle}>Chronic Progressive</Text>
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
                            {condition.stability || 'stable'}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>{condition.date || '12 Jan, 12:30 PM'}</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {config.description}
                </Text>

                {/* Normal Values Card */}
                {config.normalValues && (
                    <View style={styles.normalValuesCard}>
                        {config.normalValues.title && (
                            <Text style={styles.normalValuesTitle}>{config.normalValues.title}</Text>
                        )}
                        {config.normalValues.rows.map((row, i) => (
                            <View key={i} style={styles.normalValueRow}>
                                <Text style={styles.normalValueLabel}>{row.label}</Text>
                                <Text style={styles.normalValueText}>{row.value}</Text>
                            </View>
                        ))}
                        <Text style={styles.normalValuesDesc}>{config.normalValues.desc}</Text>
                    </View>
                )}

                {/* Report Timeline Card (LAST) */}
                <View style={styles.timelineCard}>
                    <Text style={styles.timelineTitle}>Report Timeline</Text>
                    <Text style={styles.timelineSubtext}>{config.timelineSubtext}</Text>

                    {config.charts.map((chartData, index) => (
                        <AreaChart key={index} chartData={chartData} chartIndex={index} />
                    ))}
                </View>
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

    // Normal Values Card
    normalValuesCard: {
        backgroundColor: '#F0FDF4',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    normalValuesTitle: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(12),
    },
    normalValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    normalValueLabel: {
        fontFamily: bold,
        fontSize: ms(12),
        color: blackColor,
        marginRight: ms(8),
    },
    normalValueText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    normalValuesDesc: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(19),
        marginTop: vs(12),
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
});

export default ChronicProgressiveDetailScreen;
