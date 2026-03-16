import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Day', 'Week', 'Month', '3Mon', 'Yearly'];

const READINGS = [
    {
        id: '1',
        date: 'Mon, 11 Feb, 2026, 10:30 AM',
        rhythm: 'Normal Sinus',
        heartRate: '72 bpm',
        interpretation: 'Normal',
        qrs: '88 ms',
        pr: '160 ms',
        qtc: '410 ms',
    },
    {
        id: '2',
        date: 'Tue, 12 Feb, 2026, 9:15 AM',
        rhythm: 'Sinus Tachycardia',
        heartRate: '105 bpm',
        interpretation: 'Borderline',
        qrs: '92 ms',
        pr: '148 ms',
        qtc: '430 ms',
    },
    {
        id: '3',
        date: 'Wed, 13 Feb, 2026, 8:00 AM',
        rhythm: 'Normal Sinus',
        heartRate: '68 bpm',
        interpretation: 'Normal',
        qrs: '84 ms',
        pr: '155 ms',
        qtc: '405 ms',
    },
];

const INTERPRETATION_COLORS = {
    Normal: { bg: '#D1FAE5', text: primaryColor },
    Borderline: { bg: '#FEF3C7', text: '#D97706' },
    Abnormal: { bg: '#FEE2E2', text: '#EF4444' },
};

// ── ECG Rhythm Chart ──────────────────────────────────────────────
const Y_LABEL_W = ms(40);
const CHART_W = SCREEN_WIDTH - Y_LABEL_W - ms(40);
const CHART_H = vs(160);
const PADT = vs(8);
const PADB = vs(8);

// Simulated ECG-like heart rate data (BPM over time)
const HR_DATA = [72, 74, 76, 80, 85, 90, 88, 82, 75, 70, 68, 72];
const X_LABELS = ['6am', '9am', '12pm', '3pm'];
const Y_LABELS = ['120', '90', '60', '30'];

const toX = (i) => (i / (HR_DATA.length - 1)) * CHART_W;
const toY = (v) => {
    const min = 30, max = 130;
    return PADT + ((max - v) / (max - min)) * (CHART_H - PADT - PADB);
};
const LINE_Y = [0, 1, 2, 3].map((i) => PADT + (i / 3) * (CHART_H - PADT - PADB));

const buildPath = (data) => {
    let d = `M ${toX(0)} ${toY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        const x0 = toX(i - 1), y0 = toY(data[i - 1]);
        const x1 = toX(i), y1 = toY(data[i]);
        const cpx = x0 + (x1 - x0) / 3;
        d += ` C ${cpx} ${y0}, ${x1 - (x1 - x0) / 3} ${y1}, ${x1} ${y1}`;
    }
    return d;
};

const RhythmChart = () => (
    <View style={styles.chartBox}>
        <View style={styles.chartRow}>
            {/* Y labels */}
            <View style={styles.yLabels}>
                {Y_LABELS.map((label, i) => (
                    <Text key={i} style={[styles.yLabel, { top: LINE_Y[i] - ms(7) }]}>{label}</Text>
                ))}
            </View>
            {/* SVG */}
            <View>
                <Svg width={CHART_W} height={CHART_H}>
                    {LINE_Y.map((y, i) => (
                        <Line key={i} x1={0} y1={y} x2={CHART_W} y2={y}
                            stroke="#E0E0E0" strokeWidth={1} strokeDasharray="4,4" />
                    ))}
                    {/* Normal zone band */}
                    <Path
                        d={`M 0 ${toY(100)} L ${CHART_W} ${toY(100)} L ${CHART_W} ${toY(60)} L 0 ${toY(60)} Z`}
                        fill={primaryColor + '10'}
                    />
                    {/* Fill area */}
                    <Path
                        d={`${buildPath(HR_DATA)} L ${toX(HR_DATA.length - 1)} ${CHART_H - PADB} L ${toX(0)} ${CHART_H - PADB} Z`}
                        fill={primaryColor + '18'}
                    />
                    {/* Line */}
                    <Path d={buildPath(HR_DATA)} fill="none" stroke={primaryColor} strokeWidth={2} />
                    {/* Dots */}
                    {HR_DATA.map((v, i) => (
                        <Circle key={i} cx={toX(i)} cy={toY(v)} r={ms(3)}
                            fill={v > 100 ? '#EF4444' : primaryColor} />
                    ))}
                </Svg>
            </View>
        </View>
        {/* X labels */}
        <View style={styles.xLabels}>
            {X_LABELS.map((label, i) => (
                <Text key={i} style={styles.xLabel}>{label}</Text>
            ))}
        </View>
    </View>
);

// ── Metric Cards ─────────────────────────────────────────────────
const METRICS = [
    { label: 'Avg Heart Rate', value: '72', unit: 'bpm', color: primaryColor },
    { label: 'QRS Duration', value: '88', unit: 'ms', color: '#3B82F6' },
    { label: 'PR Interval', value: '160', unit: 'ms', color: '#8B5CF6' },
    { label: 'QTc Interval', value: '410', unit: 'ms', color: '#F59E0B' },
];

const MetricCards = () => (
    <View style={styles.metricsRow}>
        {METRICS.map((m, i) => (
            <View key={i} style={styles.metricCard}>
                <View style={[styles.metricAccent, { backgroundColor: m.color }]} />
                <Text style={styles.metricLabel}>{m.label}</Text>
                <View style={styles.metricValueRow}>
                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                    <Text style={styles.metricUnit}>{m.unit}</Text>
                </View>
            </View>
        ))}
    </View>
);

// ── Main Screen ───────────────────────────────────────────────────
const EcgDashboard = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Day');

    const renderCard = (item) => {
        const ic = INTERPRETATION_COLORS[item.interpretation] || INTERPRETATION_COLORS.Normal;
        return (
            <View key={item.id} style={styles.readingCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.readingDate}>{item.date}</Text>
                    <TouchableOpacity style={styles.menuBtn}>
                        <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(18)} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContentRow}>
                    <Text style={styles.rhythmText}>{item.rhythm}</Text>
                    <View style={[styles.badge, { backgroundColor: ic.bg }]}>
                        <Text style={[styles.badgeText, { color: ic.text }]}>{item.interpretation}</Text>
                    </View>
                </View>

                <View style={styles.cardInfoRow}>
                    <Text style={styles.infoLabel}>Heart Rate</Text>
                    <Text style={styles.infoValue}>{item.heartRate}</Text>
                </View>
                <View style={styles.cardInfoRow}>
                    <Text style={styles.infoLabel}>QRS / PR / QTc</Text>
                    <Text style={styles.infoValue}>{item.qrs}  {item.pr}  {item.qtc}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>ECG Management</Text>
                        <Text style={styles.headerSubtitle}>Manual Reading</Text>
                    </View>
                    <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddEcgDetails')}>
                        <Icon type={Icons.Ionicons} name="add" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabRow}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, selectedTab === tab && styles.tabActive]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Today Nav */}
                <View style={styles.todayNav}>
                    <TouchableOpacity>
                        <Icon type={Icons.Ionicons} name="chevron-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.todayText}>Today</Text>
                    <TouchableOpacity>
                        <Icon type={Icons.Ionicons} name="chevron-forward" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                </View>

                {/* Rhythm Chart */}
                <RhythmChart />

                {/* Metric Cards */}
                <MetricCards />

                {/* Recently Added */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recently Added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('EcgReadings', { readings: READINGS })}>
                            <Text style={styles.viewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    {READINGS.map((item) => renderCard(item))}
                </View>

                {/* Explore */}
                <View style={styles.exploreSection}>
                    <Text style={styles.exploreTitle}>Explore</Text>
                    <View style={styles.exploreCard}>
                        <Text style={styles.exploreCardTitle}>How to record your ECG readings</Text>
                        <Text style={styles.exploreCardDesc}>
                            Learn how to log your ECG results, understand your heart rhythm patterns, and track cardiac intervals over time.
                            <Text style={styles.learnMore}> Learn More</Text>
                        </Text>
                    </View>
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default EcgDashboard;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    scrollContent: { paddingBottom: vs(30) },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(15), paddingTop: ms(50), paddingBottom: ms(10),
    },
    backButton: { width: ms(40), height: ms(40), justifyContent: 'center', alignItems: 'flex-start' },
    headerCenter: { flex: 1 },
    headerTitle: { fontSize: ms(18), fontWeight: 'bold', color: blackColor },
    headerSubtitle: { fontSize: ms(11), color: '#888', marginTop: vs(2) },
    headerIconBg: {
        width: ms(38), height: ms(38), borderRadius: ms(19),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
    },

    // Tabs
    tabRow: { flexDirection: 'row', paddingHorizontal: ms(15), marginTop: vs(10), gap: ms(4) },
    tab: { flex: 1, paddingVertical: vs(8), alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: primaryColor },
    tabText: { fontSize: ms(13), color: '#888', fontWeight: '500' },
    tabTextActive: { color: blackColor, fontWeight: '700' },

    // Today Nav
    todayNav: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: ms(15), marginTop: vs(12), marginBottom: vs(5),
    },
    todayText: { fontSize: ms(14), fontWeight: '600', color: blackColor },

    // Chart
    chartBox: { marginTop: vs(10), paddingHorizontal: ms(10) },
    chartRow: { flexDirection: 'row' },
    yLabels: { width: Y_LABEL_W, position: 'relative', height: CHART_H },
    yLabel: { position: 'absolute', left: 0, fontSize: ms(10), color: '#888' },
    xLabels: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginTop: vs(4), marginLeft: Y_LABEL_W,
    },
    xLabel: { fontSize: ms(10), color: '#888' },

    // Metrics
    metricsRow: {
        flexDirection: 'row', flexWrap: 'wrap', gap: ms(10),
        paddingHorizontal: ms(15), marginTop: vs(20),
    },
    metricCard: {
        width: (SCREEN_WIDTH - ms(50)) / 2,
        backgroundColor: '#F8FAFC', borderRadius: ms(12),
        padding: ms(14), overflow: 'hidden',
    },
    metricAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: ms(4), borderTopLeftRadius: ms(12), borderBottomLeftRadius: ms(12) },
    metricLabel: { fontSize: ms(11), color: '#888', marginBottom: vs(6) },
    metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: ms(3) },
    metricValue: { fontSize: ms(22), fontWeight: 'bold' },
    metricUnit: { fontSize: ms(12), color: '#888' },

    // Recently Added
    recentSection: { marginTop: vs(20), paddingHorizontal: ms(15) },
    recentHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: vs(12),
    },
    recentTitle: { fontSize: ms(16), fontWeight: 'bold', color: blackColor },
    viewAll: { fontSize: ms(13), color: '#888', fontWeight: '500' },

    // Reading Card
    readingCard: {
        backgroundColor: '#F6F8FB', borderRadius: ms(12),
        paddingHorizontal: ms(15), paddingVertical: vs(14), marginBottom: vs(8),
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: vs(10),
    },
    readingDate: { fontSize: ms(11), color: '#888' },
    menuBtn: {
        width: ms(30), height: ms(30), borderRadius: ms(18),
        backgroundColor: '#E8ECF0', justifyContent: 'center', alignItems: 'center',
    },
    cardContentRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(10),
    },
    rhythmText: { fontSize: ms(14), fontWeight: '600', color: blackColor },
    badge: { paddingHorizontal: ms(16), paddingVertical: vs(3), borderRadius: ms(20) },
    badgeText: { fontSize: ms(12), fontWeight: 'bold' },
    cardInfoRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: vs(3),
    },
    infoLabel: { fontSize: ms(12), color: '#888' },
    infoValue: { fontSize: ms(12), fontWeight: '600', color: blackColor },

    // Explore
    exploreSection: { paddingHorizontal: ms(15), marginTop: vs(20) },
    exploreTitle: { fontSize: ms(16), fontWeight: 'bold', color: blackColor, marginBottom: vs(10) },
    exploreCard: { backgroundColor: '#F6F8FB', borderRadius: ms(12), padding: ms(16) },
    exploreCardTitle: { fontSize: ms(14), fontWeight: '600', color: blackColor, marginBottom: vs(6) },
    exploreCardDesc: { fontSize: ms(12), color: '#888', lineHeight: ms(18) },
    learnMore: { color: '#3B82F6', fontWeight: '600' },
});
