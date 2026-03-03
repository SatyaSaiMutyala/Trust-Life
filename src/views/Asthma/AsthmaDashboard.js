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
import Svg, { Path, Line } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['Day', 'Week', 'Month', '3Mon', 'Yearly'];

const SEVERITY_COLORS = {
    Low: '#D1FAE5',
    LowText: primaryColor,
};

const READINGS = [
    {
        id: '1',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        triggers: 'Cold Air, Pollen',
        severity: 'Low',
        startedDate: '11 Feb,2026,',
        startEndTime: '2:30PM, to 2:50PM',
    },
    {
        id: '2',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        triggers: 'Cold Air, Pollen',
        severity: 'Low',
        startedDate: '11 Feb,2026,',
        startEndTime: '2:30PM, to 2:50PM',
    },
    {
        id: '3',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        triggers: 'Cold Air, Pollen',
        severity: 'Low',
        startedDate: '11 Feb,2026,',
        startEndTime: '2:30PM, to 2:50PM',
    },
];

// ── Line Chart Component ─────────────────────────────────────────
const Y_LABEL_W = ms(60);
const CHART_W = SCREEN_WIDTH - Y_LABEL_W - ms(20);
const CHART_H = vs(180);
const PADT = vs(5);
const PADB = vs(5);

const LINE_LABELS = ['Server', 'Moderate', 'Mild', 'None'];
const LINE_Y = LINE_LABELS.map((_, i) => PADT + (i * (CHART_H - PADT - PADB)) / (LINE_LABELS.length - 1));

// Curve: starts at None, rises to Moderate, slight peak, descends to Mild, drops lower, slight uptick
const LINE_DATA = [5, 12, 28, 45, 55, 62, 60, 52, 40, 28, 18, 25];
const X_LABELS = ['12:00', '12:00', '12:00', '12:00'];

const toX = (i) => (i / (LINE_DATA.length - 1)) * CHART_W;
const toY = (v) => {
    const minV = 0, maxV = 100;
    return PADT + ((maxV - v) / (maxV - minV)) * (CHART_H - PADT - PADB);
};

const buildCurvePath = (data) => {
    let d = `M ${toX(0)} ${toY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        const x0 = toX(i - 1), y0 = toY(data[i - 1]);
        const x1 = toX(i), y1 = toY(data[i]);
        const cpx1 = x0 + (x1 - x0) / 3;
        const cpx2 = x1 - (x1 - x0) / 3;
        d += ` C ${cpx1} ${y0}, ${cpx2} ${y1}, ${x1} ${y1}`;
    }
    return d;
};

const LineChart = () => (
    <View style={styles.chartBox}>
        <View style={styles.chartRow}>
            {/* Y labels */}
            <View style={styles.lineYLabels}>
                {LINE_LABELS.map((label, i) => (
                    <Text key={label} style={[styles.lineYLabel, { top: LINE_Y[i] - ms(7) }]}>{label}</Text>
                ))}
            </View>
            {/* SVG Chart */}
            <View style={styles.chartSvgWrap}>
                <Svg width={CHART_W} height={CHART_H}>
                    {/* Dashed horizontal lines */}
                    {LINE_Y.map((y, i) => (
                        <Line key={i} x1={0} y1={y} x2={CHART_W} y2={y}
                            stroke="#E0E0E0" strokeWidth={1} strokeDasharray="4,4" />
                    ))}
                    {/* Vertical teal line (today marker) */}
                    <Line x1={toX(3)} y1={PADT} x2={toX(3)} y2={CHART_H - PADB}
                        stroke={primaryColor} strokeWidth={1.5} />
                    {/* Fill under curve */}
                    <Path
                        d={`${buildCurvePath(LINE_DATA)} L ${toX(LINE_DATA.length - 1)} ${CHART_H - PADB} L ${toX(0)} ${CHART_H - PADB} Z`}
                        fill="rgba(239,68,68,0.06)"
                    />
                    {/* Curve line */}
                    <Path d={buildCurvePath(LINE_DATA)} fill="none" stroke="#EF4444" strokeWidth={2} />
                </Svg>
            </View>
        </View>
        {/* X labels */}
        <View style={styles.lineXLabels}>
            {X_LABELS.map((label, i) => (
                <Text key={i} style={styles.lineXLabel}>{label}</Text>
            ))}
        </View>
    </View>
);

// ── Bar Chart Component ─────────────────────────────────────────
const BAR_Y_LABELS = [8, 6, 4, 2, 0];
const BAR_DATA = [
    { label: '1:00', value: 2 },
    { label: '12:00', value: 3 },
    { label: '1:00', value: 0 },
    { label: '2:00', value: 0 },
    { label: '3:00', value: 0 },
    { label: '4:00', value: 0 },
    { label: '5:00', value: 1 },
];

const BarChart = () => {
    const maxVal = 8;
    const barH = vs(110);

    return (
        <View style={styles.barChartBox}>
            <View style={styles.barYLabels}>
                {BAR_Y_LABELS.map((v) => (
                    <Text key={v} style={styles.barYLabel}>{v}</Text>
                ))}
            </View>
            <View style={styles.barsArea}>
                {/* Horizontal guide lines */}
                {BAR_Y_LABELS.map((_, i) => (
                    <View key={i} style={[styles.barGuideLine, { top: (i / (BAR_Y_LABELS.length - 1)) * barH }]} />
                ))}
                <View style={[styles.barsContainer, { height: barH }]}>
                    {BAR_DATA.map((item, idx) => (
                        <View key={idx} style={styles.barCol}>
                            <View style={[styles.barTrack, { height: barH }]}>
                                {item.value > 0 && (
                                    <View style={[styles.barFill, { height: `${(item.value / maxVal) * 100}%` }]} />
                                )}
                            </View>
                        </View>
                    ))}
                </View>
                {/* X labels */}
                <View style={styles.barXLabelsRow}>
                    {BAR_DATA.map((item, idx) => (
                        <Text key={idx} style={styles.barXLabel}>{item.label}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

// ── Top Trigger Component ────────────────────────────────────────
const TRIGGERS = [
    { name: 'Dust', times: 2, progress: 0.4, color: '#3B82F6' },
    { name: 'Cold Air', times: 0, progress: 0.5, color: '#EF4444' },
];

const TopTrigger = () => (
    <View style={styles.triggerSection}>
        <Text style={styles.triggerTitle}>Top Trigger</Text>
        {TRIGGERS.map((item, idx) => (
            <View key={idx} style={styles.triggerItem}>
                <View style={styles.triggerNameRow}>
                    <Text style={styles.triggerName}>{item.name}</Text>
                    <Text style={styles.triggerTimes}>{item.times} Times</Text>
                </View>
                <View style={styles.triggerBarBg}>
                    <View style={[styles.triggerBarFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
                </View>
            </View>
        ))}
    </View>
);

// ── Main Screen ──────────────────────────────────────────────────
const AsthmaDashboard = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('Day');

    const renderReadingCard = (item) => (
        <View key={item.id} style={styles.readingCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.readingDate}>{item.date}</Text>
                <TouchableOpacity style={styles.readingMenu}>
                    <Icon type={Icons.Ionicons} name="ellipsis-horizontal" color="#999" size={ms(18)} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContentRow}>
                <Text style={styles.triggerText}>{item.triggers}</Text>
                <View style={styles.severityBadge}>
                    <Text style={styles.severityBadgeText}>{item.severity}</Text>
                </View>
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Started Date</Text>
                <Text style={styles.cardInfoValue}>{item.startedDate}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Starting time &  Ending Time</Text>
                <Text style={styles.cardInfoValue}>{item.startEndTime}</Text>
            </View>
        </View>
    );

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
                        <Text style={styles.headerTitle}>Asthma Management</Text>
                        <Text style={styles.headerSubtitle}>Manual Reading</Text>
                    </View>
                    <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddAsthmaDetails')}>
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

                {/* Line Chart */}
                <LineChart />

                {/* Times Inhaler Used */}
                <View style={styles.inhalerRow}>
                    <Text style={styles.inhalerLabel}>Times Inhaler Used</Text>
                    <Text style={styles.inhalerValue}>0 Puffs</Text>
                </View>

                {/* Bar Chart */}
                <BarChart />

                {/* Top Trigger */}
                <TopTrigger />

                {/* Recently Added */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recently Added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AsthmaReadings', { readings: READINGS })}>
                            <Text style={styles.viewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    {READINGS.map((item) => renderReadingCard(item))}
                </View>

                {/* Explore */}
                <View style={styles.exploreSection}>
                    <Text style={styles.exploreTitle}>Explore</Text>
                    <View style={styles.exploreCard}>
                        <Text style={styles.exploreCardTitle}>How to add Asthma Details to Manage</Text>
                        <Text style={styles.exploreCardDesc}>
                            Easily track your symptoms, triggers, and inhaler usage to understand your asthma...
                            <Text style={styles.learnMore}> Learn More</Text>
                        </Text>
                    </View>
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default AsthmaDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(30),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
    },
    headerSubtitle: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    headerIconBg: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: ms(15),
        marginTop: vs(10),
        gap: ms(4),
    },
    tab: {
        flex: 1,
        paddingVertical: vs(8),
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: primaryColor,
    },
    tabText: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },
    tabTextActive: {
        color: blackColor,
        fontWeight: '700',
    },

    // Today Nav
    todayNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        marginTop: vs(12),
        marginBottom: vs(5),
    },
    todayText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Line Chart
    chartBox: {
        marginTop: vs(10),
        paddingHorizontal: ms(10),
    },
    chartRow: {
        flexDirection: 'row',
    },
    lineYLabels: {
        width: Y_LABEL_W,
        position: 'relative',
    },
    lineYLabel: {
        position: 'absolute',
        left: 0,
        fontSize: ms(10),
        color: '#888',
    },
    chartSvgWrap: {
        flex: 1,
    },
    lineXLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(4),
        marginLeft: Y_LABEL_W,
    },
    lineXLabel: {
        fontSize: ms(10),
        color: '#888',
    },

    // Inhaler Row
    inhalerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginTop: vs(20),
        marginBottom: vs(10),
    },
    inhalerLabel: {
        fontSize: ms(14),
        color: blackColor,
        fontWeight: '500',
    },
    inhalerValue: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Bar Chart
    barChartBox: {
        flexDirection: 'row',
        paddingHorizontal: ms(15),
        marginTop: vs(5),
    },
    barYLabels: {
        justifyContent: 'space-between',
        marginRight: ms(8),
        height: vs(100),
    },
    barYLabel: {
        fontSize: ms(10),
        color: '#888',
        textAlign: 'right',
        width: ms(16),
    },
    barsArea: {
        flex: 1,
        position: 'relative',
    },
    barGuideLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    barCol: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        width: ms(20),
        justifyContent: 'flex-end',
    },
    barFill: {
        width: '100%',
        backgroundColor: primaryColor,
        borderTopLeftRadius: ms(4),
        borderTopRightRadius: ms(4),
    },
    barXLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(6),
    },
    barXLabel: {
        fontSize: ms(9),
        color: '#888',
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },

    // Trigger
    triggerSection: {
        paddingHorizontal: ms(20),
        marginTop: vs(20),
    },
    triggerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(12),
    },
    triggerItem: {
        marginBottom: vs(12),
    },
    triggerNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    triggerName: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    triggerTimes: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },
    triggerBarBg: {
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: '#E0E7EF',
        overflow: 'hidden',
    },
    triggerBarFill: {
        height: '100%',
        borderRadius: ms(4),
    },

    // Recently Added
    recentSection: {
        marginTop: vs(20),
        paddingHorizontal: ms(15),
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    recentTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    viewAll: {
        fontSize: ms(13),
        color: '#888',
        fontWeight: '500',
    },

    // Reading Card
    readingCard: {
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(14),
        marginBottom: vs(8),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    readingDate: {
        fontSize: ms(11),
        color: '#888',
    },
    readingMenu: {
        width: ms(30),
        height: ms(30),
        borderRadius: ms(18),
        backgroundColor: '#E8ECF0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    triggerText: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    severityBadge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(3),
        borderRadius: ms(20),
        backgroundColor: '#D1FAE5',
    },
    severityBadgeText: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: primaryColor,
    },
    cardInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(3),
    },
    cardInfoLabel: {
        fontSize: ms(12),
        color: '#888',
    },
    cardInfoValue: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },

    // Explore
    exploreSection: {
        paddingHorizontal: ms(15),
        marginTop: vs(20),
    },
    exploreTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(10),
    },
    exploreCard: {
        backgroundColor: '#F6F8FB',
        borderRadius: ms(12),
        padding: ms(16),
    },
    exploreCardTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(6),
    },
    exploreCardDesc: {
        fontSize: ms(12),
        color: '#888',
        lineHeight: ms(18),
    },
    learnMore: {
        color: '#3B82F6',
        fontWeight: '600',
    },
});
