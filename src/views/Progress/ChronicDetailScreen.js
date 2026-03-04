import React, { useState } from 'react';
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
const CHART_W = width - ms(64);
const CHART_H = vs(110);

// ── Static Data ────────────────────────────────────────────────────────────────
const KEY_INSIGHTS = [
    {
        dotColor: '#F97316',
        title: 'HbA1c Trend Rising',
        desc: 'Changed from 6.8% → 7.4% in last 90 days\nStatus: Moving from Controlled',
        hasTrend: true,
    },
    {
        dotColor: '#FBBF24',
        title: 'Fasting Glucose Variability Increased',
        desc: '3 readings above target range\nin last 30 days',
        hasTrend: true,
    },
    {
        dotColor: '#EF4444',
        title: 'Medication Adherence Dropped',
        desc: 'Adherence at 72% this week\nTarget is above 90%',
        hasTrend: false,
    },
    {
        dotColor: '#3B82F6',
        title: 'Physical Activity Below Target',
        desc: 'Only 80 min/week recorded\nRecommended: 150 min/week',
        hasTrend: false,
    },
];

const X_LABELS = ['12 Feb', '13 Mar', '25 Apr', '21 May', '12 June', '12 July'];

const BIO_MARKERS = [
    {
        name: 'Total RBC Count',
        subtitle: 'Electrical Impedance',
        statusCode: 'H**',
        statusLabel: 'Critical High',
        statusColor: '#EF4444',
        flagColor: '#EF4444',
        normal: '-',
        abnormal: '650',
        unit: 'g/dL',
        ref: '100 - 500',
        points: [
            { x: 0, y: 0.90 }, { x: 0.18, y: 0.70 }, { x: 0.33, y: 0.30 },
            { x: 0.50, y: 0.60 }, { x: 0.66, y: 0.75 }, { x: 1, y: 0.50 },
        ],
    },
    {
        name: 'Total RBC Count',
        subtitle: 'Electrical Impedance',
        statusCode: 'H',
        statusLabel: 'Abnormal High',
        statusColor: '#F59E0B',
        flagColor: '#F59E0B',
        normal: '-',
        abnormal: '650',
        unit: 'g/dL',
        ref: '100 - 500',
        points: [
            { x: 0, y: 0.88 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.20 },
            { x: 0.50, y: 0.65 }, { x: 0.66, y: 0.50 }, { x: 0.83, y: 0.70 }, { x: 1, y: 0.55 },
        ],
    },
    {
        name: 'HbA1c',
        subtitle: 'Glycated Haemoglobin',
        statusCode: 'N',
        statusLabel: 'Normal',
        statusColor: '#10B981',
        flagColor: '#10B981',
        normal: '5.4',
        abnormal: '-',
        unit: '%',
        ref: '4.0 - 5.6',
        points: [
            { x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 },
            { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 },
        ],
    },
];

const ORGANS = [
    {
        name: 'Heart',
        emoji: '🫀',
        statusLabel: 'Under stress',
        statusBg: '#FEF9C3',
        statusColor: '#92400E',
        contributors: [
            { name: 'Triglycerides', showArrow: true },
            { name: 'Glucose Swings', showArrow: false },
        ],
    },
    {
        name: 'Kidneys',
        emoji: '🫘',
        statusLabel: 'Under stress',
        statusBg: '#FEF9C3',
        statusColor: '#92400E',
        contributors: [
            { name: 'Microalbbumin', showArrow: true },
            { name: 'HbA1c', showArrow: false },
        ],
    },
    {
        name: 'Pancreas',
        emoji: '🥞',
        statusLabel: 'Under stress',
        statusBg: '#FEF9C3',
        statusColor: '#92400E',
        contributors: [
            { name: 'insulin Demand', showArrow: true },
        ],
    },
    {
        name: 'Eyes',
        emoji: '👁️',
        statusLabel: 'Stable',
        statusBg: '#DCFCE7',
        statusColor: '#065F46',
        contributors: [
            { name: 'Triglycerides', showArrow: true },
            { name: 'Glucose Swings', showArrow: false },
        ],
    },
];

const LIFESTYLE_ITEMS = [
    { label: 'Sleep consistency',  value: '64 %',              bg: '#E8E8F8' },
    { label: 'Physical Activity:', value: '64 %',              bg: '#FEFCE8' },
    { label: 'Diet Pattern',       value: 'High refined carbs', bg: '#DCFCE7' },
    { label: 'Alcohol',            value: 'Occasional',         bg: '#FEE2E2' },
    { label: 'Stress Indicator:',  value: 'Elevated',           bg: '#F3F4F6' },
];

const SYMPTOM_LOGS = [
    { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
    { date: '18 Feb', symptom: 'Fatigue',           severity: '3/5' },
    { date: '26 Feb', symptom: 'Blurred Vision',    severity: '2/5' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const createCurvePath = (pts) => {
    const p = pts.map((pt) => ({ x: pt.x * CHART_W, y: pt.y * CHART_H }));
    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 1; i < p.length; i++) {
        const prev = p[i - 1];
        const curr = p[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
        d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
};

const createAreaPath = (pts) => {
    const curve = createCurvePath(pts);
    const lastX = pts[pts.length - 1].x * CHART_W;
    return `${curve} L ${lastX},${CHART_H} L 0,${CHART_H} Z`;
};

// ── Bio Chart with reference lines ───────────────────────────────────────────
const BioChart = ({ points, id }) => (
    <View style={styles.bioChartWrap}>
        <Svg width={CHART_W} height={CHART_H}>
            <Defs>
                <SvgLinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                    <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                </SvgLinearGradient>
            </Defs>

            {/* Red critical line (top) */}
            <Line x1="0" y1={CHART_H * 0.10} x2={CHART_W} y2={CHART_H * 0.10}
                stroke="#EF4444" strokeWidth="0.5" />
            {/* Orange normal range lines */}
            <Line x1="0" y1={CHART_H * 0.37} x2={CHART_W} y2={CHART_H * 0.37}
                stroke="#F59E0B" strokeWidth="0.5" strokeLinecap="round" />
            <Line x1="0" y1={CHART_H * 0.64} x2={CHART_W} y2={CHART_H * 0.64}
                stroke="#F59E0B" strokeWidth="0.5" strokeLinecap="round" />
            {/* Bottom baseline */}
            <Line x1="0" y1={CHART_H * 0.92} x2={CHART_W} y2={CHART_H * 0.92}
                stroke="#EF4444" strokeWidth="0.5" />

            {/* Area fill */}
            <Path d={createAreaPath(points)} fill={`url(#${id})`} />
            {/* Curve */}
            <Path d={createCurvePath(points)} fill="none"
                stroke="#3B82F6" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {points.map((p, i) => (
                <Circle key={i}
                    cx={p.x * CHART_W} cy={p.y * CHART_H}
                    r={ms(5)}
                    fill="#3B82F6"
                    stroke={whiteColor} strokeWidth={1.5}
                />
            ))}
        </Svg>

        {/* X-axis labels */}
        <View style={styles.xLabels}>
            {X_LABELS.map((l, i) => (
                <Text key={i} style={styles.xLabel}>{l}</Text>
            ))}
        </View>
    </View>
);

// ── Bio Marker Card ───────────────────────────────────────────────────────────
const BioMarkerRow = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={[styles.bioCard, index > 0 && { marginTop: vs(12) }]}>
            {/* Top: name + status badge + flag */}
            <View style={styles.bioCardTop}>
                <View style={styles.bioNameWrap}>
                    <Text style={styles.bioName}>{item.name}</Text>
                    <Text style={styles.bioSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.bioTopRight}>
                    <View style={styles.bioCodeBadge}>
                        <Text style={styles.bioCodeText}>{item.statusCode}</Text>
                    </View>
                    <Text style={{ fontSize: ms(16), marginLeft: ms(4) }}>🚩</Text>
                    <Text style={[styles.bioStatusLabel, { color: item.statusColor }]}>
                        {item.statusLabel}
                    </Text>
                </View>
            </View>

            {/* 3-column grid: Normal | Abnormal | Unit */}
            <View style={styles.bioGrid}>
                <View style={styles.bioGridCell}>
                    <Text style={styles.bioGridHeader}>Normal</Text>
                    <Text style={styles.bioGridValue}>{item.normal}</Text>
                </View>
                <View style={[styles.bioGridCell, styles.bioGridCellBorder]}>
                    <Text style={styles.bioGridHeader}>Abnormal</Text>
                    <Text style={styles.bioGridValue}>{item.abnormal}</Text>
                </View>
                <View style={[styles.bioGridCell, styles.bioGridCellBorder]}>
                    <Text style={styles.bioGridHeader}>Unit of measure</Text>
                    <Text style={styles.bioGridValue}>{item.unit}</Text>
                </View>
            </View>

            {/* Ref range + View trend button */}
            <View style={styles.bioRefRow}>
                <Text style={styles.bioRefText}>
                    Bio.Ref.Range  –  {item.ref}
                </Text>
                <TouchableOpacity
                    style={styles.viewTrendBtn}
                    onPress={() => setExpanded(!expanded)}
                >
                    <Text style={styles.viewTrendText}>View trend</Text>
                    <Icon
                        type={Icons.Ionicons}
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={ms(14)}
                        color="#3B82F6"
                        style={{ marginLeft: ms(4) }}
                    />
                </TouchableOpacity>
            </View>

            {/* Expanded area chart */}
            {expanded && <BioChart points={item.points} id={`bio_${index}`} />}
        </View>
    );
};

// ── Organ Card ────────────────────────────────────────────────────────────────
const OrganCard = ({ item }) => (
    <View style={styles.organCard}>
        {/* Icon row */}
        <View style={styles.organTopRow}>
            <View style={styles.organIconCircle}>
                <Text style={styles.organEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.organName}>{item.name}</Text>
        </View>

        {/* Status row */}
        <View style={styles.organStatusRow}>
            <Text style={styles.organStatusLabel}>Status : </Text>
            <View style={[styles.organStatusBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.organStatusText, { color: item.statusColor }]}>
                    {item.statusLabel}
                </Text>
            </View>
        </View>

        {/* Contributors */}
        <Text style={styles.organContribTitle}>Contributors</Text>
        {item.contributors.map((c, i) => (
            <View key={i} style={styles.organContribRow}>
                <Text style={styles.organContribName}>{c.name}</Text>
                {c.showArrow && (
                    <Icon type={Icons.Ionicons} name="arrow-up"
                        size={ms(13)} color="#374151" />
                )}
            </View>
        ))}

        {/* View Details button */}
        <TouchableOpacity style={styles.viewDetailBtn}>
            <Text style={styles.viewDetailText}>View Details</Text>
        </TouchableOpacity>
    </View>
);

// ── Lifestyle Pill Row ────────────────────────────────────────────────────────
const LifestyleBar = ({ item }) => (
    <View style={[styles.lifestylePill, { backgroundColor: item.bg }]}>
        <Text style={styles.lifestylePillLabel}>{item.label}</Text>
        <Text style={styles.lifestylePillValue}>{item.value}</Text>
    </View>
);

// ── Symptom Log Row ───────────────────────────────────────────────────────────
const SymptomLog = ({ item }) => (
    <View style={styles.symptomRow}>
        <Text style={styles.symptomText}>
            {item.date} – {item.symptom}{'   '}
            <Text style={styles.symptomSeverity}>Severity {item.severity}</Text>
        </Text>
    </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
const ChronicDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};
    const conditionName = condition.name || 'Diabetes';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>{conditionName}</Text>
                        <Text style={styles.headerSub}>Chronic Condition</Text>
                    </View>
                    <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active</Text>
                    </View>
                </View>

                {/* ── Condition Summary Card ─────────────────────────────── */}
                <View style={styles.condCard}>
                    {/* "Condition" label */}
                    <Text style={styles.condLabel}>Condition</Text>

                    {/* Name row: title + last update */}
                    <View style={styles.condNameRow}>
                        <Text style={styles.condTitle}>{conditionName}</Text>
                        <Text style={styles.condLastUpdate}>Last update {condition.date || '12 Jan, 12:30 PM'}</Text>
                    </View>

                    {/* Subtitle */}
                    <Text style={styles.condSub}>Type 2 Diabetes</Text>

                    {/* Badges row: left stacked badges + right Active pill */}
                    <View style={styles.condBadgesRow}>
                        <View style={styles.condLeftBadges}>
                            <View style={[styles.condBadge, { backgroundColor: '#FEF9EE' }]}>
                                <Text style={[styles.condBadgeText, { color: '#92400E' }]}>Stability: Mild Escalation</Text>
                            </View>
                            <View style={[styles.condBadge, { backgroundColor: '#EDFAF5', marginTop: vs(8) }]}>
                                <Text style={[styles.condBadgeText, { color: '#065F46' }]}>Status: Under Monitoring</Text>
                            </View>
                        </View>
                        <View style={styles.activePill}>
                            <View style={styles.activePillDot} />
                            <Text style={styles.activePillText}>Active</Text>
                        </View>
                    </View>
                </View>

                {/* ── Key Insights ──────────────────────────────────────── */}
                <View style={styles.insightsCard}>
                    {/* Pill header */}
                    <View style={styles.insightsPillHeader}>
                        <Icon type={Icons.MaterialCommunityIcons} name="auto-fix" size={ms(15)} color={blackColor} />
                        <Text style={styles.insightsPillText}>Key insights</Text>
                    </View>

                    {KEY_INSIGHTS.map((item, i) => (
                        <View key={i} style={[styles.insightRow, i > 0 && styles.insightDivider]}>
                            {/* Colored circle dot */}
                            <View style={[styles.insightDot, { backgroundColor: item.dotColor }]} />

                            {/* Text block */}
                            <View style={styles.insightTextBlock}>
                                <Text style={styles.insightTitle}>{item.title}</Text>
                                <Text style={styles.insightDesc}>{item.desc}</Text>
                            </View>

                            {/* View trend button */}
                            {item.hasTrend && (
                                <TouchableOpacity style={styles.trendBtn}>
                                    <Text style={styles.trendText}>View trend</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── Bio-Markers Movement ──────────────────────────────── */}
                <View style={styles.bioSectionHeader}>
                    <View>
                        <Text style={styles.bioSectionTitle}>Bio - Markers Movement</Text>
                        <Text style={styles.bioSectionTitle}>( Lab reports )</Text>
                    </View>
                    <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('BioMarkersTrendScreen')}>
                        <Text style={styles.viewAllText}>View all trend</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bioCardsWrap}>
                    {BIO_MARKERS.map((item, i) => (
                        <BioMarkerRow key={i} item={item} index={i} />
                    ))}
                </View>

                {/* ── Organs Health Status ──────────────────────────────── */}
                <Text style={styles.organsSectionTitle}>Organs Health Status</Text>
                <View style={styles.organsGrid}>
                    {ORGANS.map((item, i) => (
                        <OrganCard key={i} item={item} />
                    ))}
                </View>

                {/* ── Lifestyle Influence ───────────────────────────────── */}
                <Text style={styles.lifestyleSectionTitle}>Lifestyle Influence</Text>
                <View style={styles.lifestyleCard}>
                    <Text style={styles.lifestyleImpactTitle}>Lifestyle Influence Impact:</Text>
                    <Text style={styles.lifestyleImpactDesc}>
                        Current lifestyle patterns are contributing to glucose variability
                    </Text>
                    <Text style={styles.lifestyleBreakdownLabel}>Breakdown</Text>
                    {LIFESTYLE_ITEMS.map((item, i) => (
                        <LifestyleBar key={i} item={item} />
                    ))}
                </View>

                {/* ── Symptom Tracker ───────────────────────────────────── */}
                <Text style={styles.symptomSectionTitle}>Symptom Tracker</Text>
                <View style={styles.symptomCard}>
                    <Text style={styles.symptomInsightLabel}>Insight:</Text>
                    <Text style={styles.symptomInsightDesc}>
                        Increased fatigue correlates with elevated glucose readings
                    </Text>
                    <Text style={styles.symptomRecentLabel}>Recent Logs:</Text>
                    {SYMPTOM_LOGS.map((item, i) => (
                        <SymptomLog key={i} item={item} />
                    ))}
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChronicDetailScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    scrollContent: { paddingBottom: vs(40) },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(16),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
    },
    headerText: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(17), color: blackColor },
    headerSub: { fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    activeBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#DCFCE7', paddingHorizontal: ms(12),
        paddingVertical: vs(5), borderRadius: ms(14),
    },
    activeDot: { width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: '#16A34A', marginRight: ms(5) },
    activeText: { fontFamily: bold, fontSize: ms(11), color: '#16A34A' },

    // Condition card
    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(20),
    },
    condLabel: { fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(6) },
    condNameRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(4),
    },
    condTitle: { fontFamily: bold, fontSize: ms(20), color: blackColor },
    condLastUpdate: { fontSize: ms(11), color: '#9CA3AF' },
    condSub: { fontSize: ms(13), color: '#374151', fontFamily: bold, marginBottom: vs(16) },
    condBadgesRow: {
        flexDirection: 'row', alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    condLeftBadges: { flex: 1 },
    condBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: ms(12), paddingVertical: vs(6),
        borderRadius: ms(10),
    },
    condBadgeText: { fontSize: ms(12) },
    activePill: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: primaryColor,
        paddingHorizontal: ms(16), paddingVertical: vs(10),
        borderRadius: ms(24), marginLeft: ms(12),
    },
    activePillDot: {
        width: ms(8), height: ms(8), borderRadius: ms(4),
        backgroundColor: whiteColor, marginRight: ms(6),
    },
    activePillText: { fontFamily: bold, fontSize: ms(13), color: whiteColor },

    // Key Insights card
    insightsCard: {
        backgroundColor: '#F0FDF8',
        borderRadius: ms(16),
        marginHorizontal: ms(20),
        paddingHorizontal: ms(16),
        paddingTop: ms(16),
        paddingBottom: ms(8),
        marginBottom: vs(20),
    },
    insightsPillHeader: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#E2ECF5',
        alignSelf: 'flex-start',
        paddingHorizontal: ms(14), paddingVertical: vs(7),
        borderRadius: ms(20), marginBottom: vs(16),
    },
    insightsPillText: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginLeft: ms(6) },

    insightRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingVertical: vs(12),
    },
    insightDivider: { borderTopWidth: 1, borderTopColor: '#D1FAE5' },
    insightDot: {
        width: ms(14), height: ms(14), borderRadius: ms(7),
        marginRight: ms(10), marginTop: vs(3),
    },
    insightTextBlock: { flex: 1, marginRight: ms(8) },
    insightTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(3) },
    insightDesc: { fontSize: ms(12), color: '#374151', lineHeight: ms(18) },
    trendBtn: {
        borderWidth: 1.5, borderColor: '#3B82F6',
        borderRadius: ms(20), paddingHorizontal: ms(12),
        paddingVertical: vs(6), alignSelf: 'center',
    },
    trendText: { fontSize: ms(11), color: '#3B82F6', fontFamily: bold },

    // Bio-Markers section header
    bioSectionHeader: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20), marginBottom: vs(12),
    },
    bioSectionTitle: { fontFamily: bold, fontSize: ms(18), color: blackColor, lineHeight: ms(22) },
    viewAllBtn: {
        borderWidth: 1.5, borderColor: '#3B82F6',
        borderRadius: ms(20), paddingHorizontal: ms(14),
        paddingVertical: vs(6),
    },
    viewAllText: { fontSize: ms(11), color: '#3B82F6', fontFamily: bold },

    bioCardsWrap: { paddingHorizontal: ms(20), marginBottom: vs(20) },

    // Bio card
    bioCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        padding: ms(16),
        marginBottom:ms(10)
    },
    bioCardTop: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: vs(14),
    },
    bioNameWrap: { flex: 1 },
    bioName: { fontFamily: bold, fontSize: ms(12), color: whiteColor, backgroundColor:'green', paddingVertical:ms(6), paddingHorizontal:ms(10),flexDirection:'row', borderRadius:ms(5),alignSelf: 'flex-start', },
    bioSubtitle: { fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    bioTopRight: { alignItems: 'flex-end' },
    bioCodeBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4),
        alignSelf: 'flex-end',
    },
    bioCodeText: { fontSize: ms(12), fontFamily: bold, color: blackColor },
    bioStatusLabel: { fontSize: ms(12), fontFamily: bold, marginTop: vs(4) },

    // 3-column grid
    bioGrid: {
        flexDirection: 'row', backgroundColor: '#F8FAFC',
        borderRadius: ms(12), padding: ms(12), marginBottom: vs(12),
    },
    bioGridCell: { flex: 1, alignItems: 'center' },
    bioGridCellBorder: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    bioGridHeader: { fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4) },
    bioGridValue: { fontFamily: bold, fontSize: ms(14), color: blackColor },

    // Ref range row
    bioRefRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
    },
    bioRefText: { fontSize: ms(12), color: '#374151' },
    viewTrendBtn: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#3B82F6',
        borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    viewTrendText: { fontSize: ms(11), color: '#3B82F6', fontFamily: bold },

    // Chart
    bioChartWrap: { marginTop: vs(14) },
    xLabels: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginTop: vs(8), paddingHorizontal: ms(2),
    },
    xLabel: { fontSize: ms(9), color: '#9CA3AF' },

    // Organs section
    organsSectionTitle: {
        fontFamily: bold, fontSize: ms(16), color: blackColor,
        paddingHorizontal: ms(20), marginBottom: vs(14),
    },
    organsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: ms(20), gap: ms(12), marginBottom: vs(20),
    },
    organCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        padding: ms(14),
        width: (width - ms(52)) / 2,
    },

    // Icon + name row
    organTopRow: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: vs(14),
    },
    organIconCircle: {
        width: ms(52), height: ms(52), borderRadius: ms(26),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center', alignItems: 'center',
        marginRight: ms(8),
    },
    organEmoji: { fontSize: ms(28) },
    organName: { fontFamily: bold, fontSize: ms(15), color: blackColor, flex: 1 },

    // Status row
    organStatusRow: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: vs(10),
    },
    organStatusLabel: { fontSize: ms(12), fontFamily: bold, color: blackColor },
    organStatusBadge: {
        paddingHorizontal: ms(10), paddingVertical: vs(4),
        borderRadius: ms(10),
    },
    organStatusText: { fontSize: ms(11), fontFamily: bold },

    // Contributors
    organContribTitle: {
        fontFamily: bold, fontSize: ms(12), color: blackColor,
        marginBottom: vs(6),
    },
    organContribRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(4),
    },
    organContribName: { fontSize: ms(12), color: '#6B7280', flex: 1 },

    // View Details button
    viewDetailBtn: {
        backgroundColor: '#CCFBF1',
        borderRadius: ms(20), paddingVertical: vs(9),
        alignItems: 'center', marginTop: vs(12),
    },
    viewDetailText: { fontSize: ms(12), color: blackColor, fontFamily: bold },

    // Lifestyle section
    lifestyleSectionTitle: {
        fontFamily: bold, fontSize: ms(16), color: blackColor,
        paddingHorizontal: ms(20), marginBottom: vs(14),
    },
    lifestyleCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(20),
    },
    lifestyleImpactTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(6) },
    lifestyleImpactDesc: { fontSize: ms(12), color: '#6B7280', lineHeight: ms(19), marginBottom: vs(14) },
    lifestyleBreakdownLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(10) },

    // Pill row
    lifestylePill: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: ms(30), paddingHorizontal: ms(16),
        paddingVertical: vs(12), marginBottom: vs(8),
    },
    lifestylePillLabel: { fontSize: ms(13), color: '#374151' },
    lifestylePillValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },

    // Symptom Tracker
    symptomSectionTitle: {
        fontFamily: bold, fontSize: ms(16), color: blackColor,
        paddingHorizontal: ms(20), marginBottom: vs(14),
    },
    symptomCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(20),
    },
    symptomInsightLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(6) },
    symptomInsightDesc: { fontSize: ms(12), color: '#6B7280', lineHeight: ms(19), marginBottom: vs(14) },
    symptomRecentLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(10) },
    symptomRow: {
        paddingVertical: vs(8),
    },
    symptomText: { fontSize: ms(13), color: '#374151' },
    symptomSeverity: { fontSize: ms(13), fontFamily: bold, color: blackColor },
});
