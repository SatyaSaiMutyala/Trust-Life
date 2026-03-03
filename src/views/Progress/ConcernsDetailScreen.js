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
    Heart: {
        description: 'Keep eating well, staying active, and monitoring your nutrition regularly to stay healthy',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your Malnutrition is improving or worsening.',
        normalValues: {
            title: 'Normal Values',
            rows: [
                { label: 'Troponin I <0.04 ng/mL,', value: 'Troponin T <0.01 ng/mL' },
                { label: 'BNP <100 pg/mL,', value: 'NT-proBNP <125 pg/mL' },
                { label: 'Lipid Profile \u2013 Total Cholesterol', value: '<200 mg/dL' },
                { label: 'Lipid Profile \u2013 LDL', value: '<100 mg/dL' },
                { label: 'Triglycerides', value: '<150 mg/dL' },
                { label: 'Lipid Profile \u2013 HDL', value: '\u226540 mg/dL (men)' },
                { label: 'CRP', value: '<1 mg/L' },
                { label: 'Potassium (K\u207A)', value: '3.5\u20135.0 mmol/L' },
                { label: 'Magnesium (Mg\u00B2\u207A)', value: '1.7\u20132.2 mg/dL' },
            ],
            desc: 'Keep track of your results\u2014compare them with the normal values to understand your health',
        },
        charts: [
            {
                label: 'Troponin I/T',
                color: '#3B82F6',
                tooltipValue: '0.04 ng/mL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.70 }, { x: 0.12, y: 0.48 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.25 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.38 },
                    { x: 0.65, y: 0.30 }, { x: 0.75, y: 0.42 }, { x: 0.85, y: 0.35 },
                    { x: 1, y: 0.28 },
                ],
            },
            {
                label: '(BNP / NT-proBNP)',
                color: '#3B82F6',
                tooltipValue: '350 pg/mL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.65 }, { x: 0.12, y: 0.45 }, { x: 0.22, y: 0.18 },
                    { x: 0.33, y: 0.22 }, { x: 0.44, y: 0.15 }, { x: 0.55, y: 0.35 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'Lipid Profile \u2013 Total Cholesterol',
                color: '#3B82F6',
                tooltipValue: '220 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.72 }, { x: 0.12, y: 0.50 }, { x: 0.22, y: 0.22 },
                    { x: 0.33, y: 0.28 }, { x: 0.44, y: 0.20 }, { x: 0.55, y: 0.40 },
                    { x: 0.65, y: 0.32 }, { x: 0.75, y: 0.45 }, { x: 0.85, y: 0.38 },
                    { x: 1, y: 0.30 },
                ],
            },
            {
                label: 'Lipid Profile \u2013 LDL',
                color: '#3B82F6',
                tooltipValue: '100 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.68 }, { x: 0.12, y: 0.46 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.24 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.36 },
                    { x: 0.65, y: 0.30 }, { x: 0.75, y: 0.42 }, { x: 0.85, y: 0.35 },
                    { x: 1, y: 0.28 },
                ],
            },
            {
                label: 'Triglycerides',
                color: '#3B82F6',
                tooltipValue: '180 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.60 }, { x: 0.12, y: 0.42 }, { x: 0.22, y: 0.18 },
                    { x: 0.33, y: 0.22 }, { x: 0.44, y: 0.15 }, { x: 0.55, y: 0.32 },
                    { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.38 }, { x: 0.85, y: 0.30 },
                    { x: 1, y: 0.22 },
                ],
            },
            {
                label: 'CRP',
                color: '#3B82F6',
                tooltipValue: '4 mg/L',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.55 }, { x: 0.12, y: 0.38 }, { x: 0.22, y: 0.18 },
                    { x: 0.33, y: 0.22 }, { x: 0.44, y: 0.15 }, { x: 0.55, y: 0.30 },
                    { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.35 }, { x: 0.85, y: 0.28 },
                    { x: 1, y: 0.22 },
                ],
            },
            {
                label: 'Potassium (K\u207A)',
                color: '#3B82F6',
                tooltipValue: '5.8 mmol/L',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.62 }, { x: 0.12, y: 0.44 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.26 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.34 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'Magnesium (Mg\u00B2\u207A)',
                color: '#3B82F6',
                tooltipValue: '1.5 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.58 }, { x: 0.12, y: 0.40 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.24 }, { x: 0.44, y: 0.16 }, { x: 0.55, y: 0.34 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
        ],
    },
    Lungs: {
        description: 'Keep eating well, staying active, and monitoring your nutrition regularly to stay healthy',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your Malnutrition is improving or worsening.',
        normalValues: {
            title: 'Normal Values',
            rows: [
                { label: 'FEV1', value: '\u226580% of predicted' },
                { label: 'FVC', value: '\u226580% of predicted' },
                { label: 'FVC Ratio', value: '\u226570%' },
            ],
            desc: 'Keep track of your results\u2014compare them with the normal values to understand your health',
        },
        charts: [
            {
                label: 'FEV1',
                color: '#3B82F6',
                tooltipValue: '55%',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.65 }, { x: 0.12, y: 0.45 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.25 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.35 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
            {
                label: 'FVC',
                color: '#3B82F6',
                tooltipValue: '2.8 g/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.60 }, { x: 0.12, y: 0.42 }, { x: 0.22, y: 0.18 },
                    { x: 0.33, y: 0.22 }, { x: 0.44, y: 0.15 }, { x: 0.55, y: 0.32 },
                    { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.38 }, { x: 0.85, y: 0.30 },
                    { x: 1, y: 0.22 },
                ],
            },
            {
                label: 'FVC Ratio',
                color: '#3B82F6',
                tooltipValue: '9.5 g/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.58 }, { x: 0.12, y: 0.40 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.24 }, { x: 0.44, y: 0.16 }, { x: 0.55, y: 0.34 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.40 }, { x: 0.85, y: 0.32 },
                    { x: 1, y: 0.25 },
                ],
            },
        ],
    },
    Kidneys: {
        description: 'Keep eating well, staying active, and monitoring your nutrition regularly to stay healthy',
        timelineSubtext: 'View your past readings to identify trends and monitor whether your Malnutrition is improving or worsening.',
        normalValues: {
            title: 'Normal Values',
            rows: [
                { label: 'Serum Creatinine', value: '0.6\u20131.3 mg/dL (adults)' },
                { label: 'eGFR', value: '\u226590 mL/min/1.73 m\u00B2' },
            ],
            desc: 'Keep track of your results\u2014compare them with the normal values to understand your health',
        },
        charts: [
            {
                label: 'Serum creatinine',
                color: '#3B82F6',
                tooltipValue: '2.0 mg/dL',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.62 }, { x: 0.12, y: 0.44 }, { x: 0.22, y: 0.20 },
                    { x: 0.33, y: 0.25 }, { x: 0.44, y: 0.18 }, { x: 0.55, y: 0.36 },
                    { x: 0.65, y: 0.28 }, { x: 0.75, y: 0.42 }, { x: 0.85, y: 0.35 },
                    { x: 1, y: 0.28 },
                ],
            },
            {
                label: 'eGFR',
                color: '#3B82F6',
                tooltipValue: '45 mL/min/1.73 m\u00B2',
                highlightIndex: 2,
                points: [
                    { x: 0, y: 0.58 }, { x: 0.12, y: 0.40 }, { x: 0.22, y: 0.18 },
                    { x: 0.33, y: 0.22 }, { x: 0.44, y: 0.15 }, { x: 0.55, y: 0.32 },
                    { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.38 }, { x: 0.85, y: 0.30 },
                    { x: 1, y: 0.22 },
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
    const gradientId = `cnFill_${chartIndex}`;

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
                        <Line key={i} x1="0" y1={pos * CHART_HEIGHT} x2={CHART_WIDTH} y2={pos * CHART_HEIGHT} stroke="#F3F4F6" strokeWidth="1" />
                    ))}

                    <Path d={createAreaPath(points)} fill={`url(#${gradientId})`} />
                    <Path d={createCurvePath(points)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((p, i) => (
                        <Circle key={i} cx={p.x * CHART_WIDTH} cy={p.y * CHART_HEIGHT} r={i === highlightIndex ? 6 : 4} fill={i === highlightIndex ? color : whiteColor} stroke={color} strokeWidth={i === highlightIndex ? 3 : 2} />
                    ))}

                    <Line x1={highlight.x} y1={highlight.y + 8} x2={highlight.x} y2={CHART_HEIGHT} stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4,4" />
                </Svg>

                <View style={[styles.tooltip, { left: highlight.x - ms(28), top: highlight.y - vs(28) }]}>
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
const ConcernsDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};

    const conditionName = condition.name || 'Heart';
    const config = CONDITION_CHARTS[conditionName] || CONDITION_CHARTS.Heart;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{conditionName}</Text>
                        <Text style={styles.headerSubtitle}>Concerns</Text>
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
                <Text style={styles.description}>{config.description}</Text>

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
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    scrollContent: { paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(40) },

    header: { flexDirection: 'row', alignItems: 'center', paddingBottom: vs(12) },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTextWrap: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    activeStatusBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7',
        paddingHorizontal: ms(12), paddingVertical: vs(5), borderRadius: ms(14),
    },
    activeDot: { width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: primaryColor, marginRight: ms(6) },
    activeStatusText: { fontFamily: bold, fontSize: ms(11), color: primaryColor },

    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(16), marginBottom: vs(10) },
    stabilityBadge: { paddingHorizontal: ms(14), paddingVertical: vs(5), borderRadius: ms(14) },
    stabilityText: { fontFamily: bold, fontSize: ms(12) },
    dateText: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },

    description: { fontFamily: regular, fontSize: ms(13), color: '#6B7280', lineHeight: ms(20), marginBottom: vs(20) },

    normalValuesCard: { backgroundColor: '#F0FDF4', borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    normalValuesTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(12) },
    normalValueRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) },
    normalValueLabel: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginRight: ms(8) },
    normalValueText: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },
    normalValuesDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(19), marginTop: vs(12) },

    timelineCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    timelineTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(6) },
    timelineSubtext: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(17), marginBottom: vs(14) },

    singleChart: { marginBottom: vs(20) },
    legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
    legendLabel: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    bioMetersBadge: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingHorizontal: ms(12), paddingVertical: vs(4) },
    bioMetersText: { fontFamily: regular, fontSize: ms(11), color: blackColor },

    chartArea: { flex: 1 },
    xAxisLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8) },
    axisLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },
    tooltip: {
        position: 'absolute', backgroundColor: whiteColor, borderRadius: ms(8),
        paddingHorizontal: ms(8), paddingVertical: vs(4),
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
    },
    tooltipText: { fontFamily: bold, fontSize: ms(10) },
});

export default ConcernsDetailScreen;
