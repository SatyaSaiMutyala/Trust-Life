import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path, Circle, Line, Defs,
    LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - ms(80);
const CHART_HEIGHT = vs(140);
const X_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

// ── Detail configs per lifestyle id ─────────────────────────────────────
const LIFESTYLE_DETAILS = {
    activity: {
        description: 'Your daily step count has been trending upward over the past 3 months, positively impacting glucose control and cardiovascular health.',
        historyRows: [
            { label: 'Today',      value: '8,200 steps' },
            { label: '7-day avg',  value: '7,800 steps' },
            { label: '30-day avg', value: '7,200 steps' },
        ],
        biomarkerEffects: [
            { marker: 'Blood Sugar',    effect: 'Helps lower fasting glucose' },
            { marker: 'Blood Pressure', effect: 'Supports healthy levels' },
            { marker: 'Heart Rate',     effect: 'Improves resting rate' },
        ],
        suggestions: [
            'Aim for 10,000 steps daily',
            'Add a 30-minute walk after meals',
            'Take stairs instead of elevators',
        ],
        chart: {
            label: 'Daily Steps',
            color: '#10B981',
            tooltipValue: '8.2k',
            highlightIndex: 5,
            points: [
                { x: 0, y: 0.70 }, { x: 0.20, y: 0.55 }, { x: 0.40, y: 0.45 },
                { x: 0.60, y: 0.40 }, { x: 0.80, y: 0.30 }, { x: 1, y: 0.22 },
            ],
        },
    },
    sleep: {
        description: 'Your sleep duration has remained relatively stable. Consistent sleep supports cardiovascular and cognitive health.',
        historyRows: [
            { label: 'Last night',  value: '6.5 hours' },
            { label: '7-day avg',   value: '6.2 hours' },
            { label: '30-day avg',  value: '6.0 hours' },
        ],
        biomarkerEffects: [
            { marker: 'Blood Pressure', effect: 'Poor sleep raises BP levels' },
            { marker: 'Cortisol',       effect: 'Sleep regulates stress hormones' },
            { marker: 'Heart Rate',     effect: 'Better sleep improves HRV' },
        ],
        suggestions: [
            'Set a consistent bedtime',
            'Avoid screens 1 hour before sleep',
            'Keep bedroom cool and dark',
        ],
        chart: {
            label: 'Sleep Hours',
            color: '#7B61FF',
            tooltipValue: '6.2h',
            highlightIndex: 5,
            points: [
                { x: 0, y: 0.40 }, { x: 0.20, y: 0.45 }, { x: 0.40, y: 0.38 },
                { x: 0.60, y: 0.42 }, { x: 0.80, y: 0.40 }, { x: 1, y: 0.38 },
            ],
        },
    },
    weight: {
        description: 'Your weight has been gradually increasing this year. This trend may negatively affect blood pressure and metabolic markers.',
        historyRows: [
            { label: 'Current',     value: '78.4 kg' },
            { label: 'Last month',  value: '77.1 kg' },
            { label: 'Start of year', value: '75.0 kg' },
        ],
        biomarkerEffects: [
            { marker: 'Blood Pressure', effect: 'Weight gain raises BP' },
            { marker: 'Blood Sugar',    effect: 'Increases insulin resistance' },
            { marker: 'Cholesterol',    effect: 'May elevate LDL levels' },
        ],
        suggestions: [
            'Monitor caloric intake daily',
            'Increase physical activity to 10k steps',
            'Track weight weekly at same time',
        ],
        chart: {
            label: 'Weight (kg)',
            color: '#EF4444',
            tooltipValue: '78.4',
            highlightIndex: 5,
            points: [
                { x: 0, y: 0.65 }, { x: 0.20, y: 0.58 }, { x: 0.40, y: 0.50 },
                { x: 0.60, y: 0.42 }, { x: 0.80, y: 0.35 }, { x: 1, y: 0.28 },
            ],
        },
    },
    diet: {
        description: 'Irregular meal timing detected over the past few weeks. Consistent meals help stabilize blood sugar and energy levels.',
        historyRows: [
            { label: 'Meals today',     value: '2 of 3' },
            { label: 'Avg meals/day',   value: '2.4' },
            { label: 'Irregular days',  value: '12 this month' },
        ],
        biomarkerEffects: [
            { marker: 'Blood Sugar', effect: 'Irregular meals cause spikes' },
            { marker: 'Energy',      effect: 'Affects daily energy levels' },
            { marker: 'Digestion',   effect: 'Disrupts gut regularity' },
        ],
        suggestions: [
            'Eat meals at consistent times',
            'Never skip breakfast',
            'Plan meals a day in advance',
        ],
        chart: {
            label: 'Meals per Day',
            color: '#F59E0B',
            tooltipValue: '2.4',
            highlightIndex: 5,
            points: [
                { x: 0, y: 0.30 }, { x: 0.20, y: 0.45 }, { x: 0.40, y: 0.35 },
                { x: 0.60, y: 0.50 }, { x: 0.80, y: 0.42 }, { x: 1, y: 0.48 },
            ],
        },
    },
};

// ── Chart helpers (same as ChronicProgressiveDetailScreen) ──────────────
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

// ── Chart Component ─────────────────────────────────────────────────────
const AreaChart = ({ chartData }) => {
    const { label, color, tooltipValue, highlightIndex, points } = chartData;
    const gradientId = `lsFill_${label}`;

    const highlight = {
        x: points[highlightIndex].x * CHART_WIDTH,
        y: points[highlightIndex].y * CHART_HEIGHT,
    };

    return (
        <View style={styles.chartWrap}>
            <View style={styles.legendRow}>
                <Text style={styles.legendLabel}>{label}</Text>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
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
                        <Line key={i} x1="0" y1={pos * CHART_HEIGHT}
                            x2={CHART_WIDTH} y2={pos * CHART_HEIGHT}
                            stroke="#F3F4F6" strokeWidth="1" />
                    ))}

                    <Path d={createAreaPath(points)} fill={`url(#${gradientId})`} />
                    <Path d={createCurvePath(points)} fill="none"
                        stroke={color} strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((p, i) => (
                        <Circle key={i}
                            cx={p.x * CHART_WIDTH} cy={p.y * CHART_HEIGHT}
                            r={i === highlightIndex ? 6 : 4}
                            fill={i === highlightIndex ? color : whiteColor}
                            stroke={color} strokeWidth={i === highlightIndex ? 3 : 2} />
                    ))}

                    <Line x1={highlight.x} y1={highlight.y + 8}
                        x2={highlight.x} y2={CHART_HEIGHT}
                        stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4,4" />
                </Svg>

                <View style={[styles.tooltip, {
                    left: highlight.x - ms(28), top: highlight.y - vs(28),
                }]}>
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

// ── Main Screen ─────────────────────────────────────────────────────────
const LifestyleDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const lifestyle = route.params?.lifestyle || {};
    const config = LIFESTYLE_DETAILS[lifestyle.id] || LIFESTYLE_DETAILS.activity;

    const impactBg = lifestyle.impactColor === '#EF4444' ? '#FEE2E2'
        : lifestyle.impactColor === '#F59E0B' ? '#FEF3C7' : '#DCFCE7';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{lifestyle.title || 'Activity'}</Text>
                        <Text style={styles.headerSubtitle}>Lifestyle Detail</Text>
                    </View>
                    <View style={[styles.impactBadge, { backgroundColor: impactBg }]}>
                        <Text style={[styles.impactText, { color: lifestyle.impactColor || primaryColor }]}>
                            Impact {lifestyle.impact || '+8'}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.description}>{config.description}</Text>

                {/* Data History */}
                <View style={styles.whiteCard}>
                    <Text style={styles.sectionTitle}>Data History</Text>
                    {config.historyRows.map((row, i) => (
                        <View key={i} style={[styles.historyRow,
                            i < config.historyRows.length - 1 && styles.historyRowBorder]}>
                            <Text style={styles.historyLabel}>{row.label}</Text>
                            <Text style={styles.historyValue}>{row.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Trend Chart */}
                <View style={styles.whiteCard}>
                    <Text style={styles.sectionTitle}>Trend</Text>
                    <AreaChart chartData={config.chart} />
                </View>

                {/* Influence on Biomarkers */}
                <View style={styles.whiteCard}>
                    <Text style={styles.sectionTitle}>Influence on biomarkers</Text>
                    {config.biomarkerEffects.map((item, i) => (
                        <View key={i} style={styles.biomarkerRow}>
                            <View style={styles.biomarkerDot} />
                            <View style={styles.biomarkerTextWrap}>
                                <Text style={styles.biomarkerName}>{item.marker}</Text>
                                <Text style={styles.biomarkerEffect}>{item.effect}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Suggested Improvements */}
                <View style={styles.whiteCard}>
                    <Text style={styles.sectionTitle}>Suggested improvements</Text>
                    {config.suggestions.map((tip, i) => (
                        <View key={i} style={styles.suggestionRow}>
                            <View style={styles.suggestionBullet} />
                            <Text style={styles.suggestionText}>{tip}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: vs(40) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    scrollContent: { paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(40) },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingBottom: vs(12) },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTextWrap: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    impactBadge: {
        paddingHorizontal: ms(14), paddingVertical: vs(5), borderRadius: ms(14),
    },
    impactText: { fontFamily: bold, fontSize: ms(12) },

    description: {
        fontFamily: regular, fontSize: ms(13), color: '#6B7280',
        lineHeight: ms(20), marginBottom: vs(16),
    },

    // White card
    whiteCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    sectionTitle: {
        fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(10),
    },

    // History
    historyRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: vs(10),
    },
    historyRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    historyLabel: { fontFamily: regular, fontSize: ms(13), color: '#6B7280' },
    historyValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },

    // Biomarker
    biomarkerRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingVertical: vs(8), gap: ms(10),
    },
    biomarkerDot: {
        width: ms(8), height: ms(8), borderRadius: ms(4),
        backgroundColor: primaryColor, marginTop: vs(5),
    },
    biomarkerTextWrap: { flex: 1 },
    biomarkerName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    biomarkerEffect: {
        fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2),
    },

    // Suggestions
    suggestionRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingVertical: vs(6), gap: ms(10),
    },
    suggestionBullet: {
        width: ms(6), height: ms(6), borderRadius: ms(3),
        backgroundColor: primaryColor, marginTop: vs(6),
    },
    suggestionText: {
        fontFamily: regular, fontSize: ms(13), color: '#374151', flex: 1,
    },

    // Chart
    chartWrap: { marginBottom: vs(4) },
    legendRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(12),
    },
    legendLabel: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    legendDot: { width: ms(10), height: ms(10), borderRadius: ms(5) },
    chartArea: { flex: 1 },
    xAxisLabels: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8),
    },
    axisLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },
    tooltip: {
        position: 'absolute', backgroundColor: whiteColor, borderRadius: ms(8),
        paddingHorizontal: ms(8), paddingVertical: vs(4),
        elevation: 4, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
    },
    tooltipText: { fontFamily: bold, fontSize: ms(10) },
});

export default LifestyleDetailScreen;
