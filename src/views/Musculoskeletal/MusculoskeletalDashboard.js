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

const READINGS = [
    {
        id: '1',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
    {
        id: '2',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
    {
        id: '3',
        date: 'Mon, 11 Feb,2026,12:30 PM',
        painLocation: 'Neck',
        severity: 'Dull',
        trigger: 'Injury',
        startDateTime: '2:30PM,11 Feb,2026',
        endDateTime: '2:30PM ,13 Feb,2026',
    },
];

// ── Line Chart ───────────────────────────────────────────────────
const Y_LABEL_W = ms(30);
const CHART_W = SCREEN_WIDTH - Y_LABEL_W - ms(40);
const CHART_H = vs(160);
const PADT = vs(5);
const PADB = vs(5);

const Y_VALUES = [10, 8, 4, 0];
const Y_POSITIONS = Y_VALUES.map((_, i) => PADT + (i * (CHART_H - PADT - PADB)) / (Y_VALUES.length - 1));

const CHART_DATA = [0, 1, 2.5, 4, 5.5, 7, 6.5, 5, 3.5, 2, 1, 3];
const X_LABELS = ['12:00', '12:00', '12:00', '12:00', '12:00'];

const toX = (i) => (i / (CHART_DATA.length - 1)) * CHART_W;
const toY = (v) => {
    const minV = 0, maxV = 10;
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
            <View style={styles.lineYLabels}>
                {Y_VALUES.map((val, i) => (
                    <Text key={i} style={[styles.lineYLabel, { top: Y_POSITIONS[i] - ms(7) }]}>{val}</Text>
                ))}
            </View>
            <View style={styles.chartSvgWrap}>
                <Svg width={CHART_W} height={CHART_H}>
                    {Y_POSITIONS.map((y, i) => (
                        <Line key={i} x1={0} y1={y} x2={CHART_W} y2={y}
                            stroke="#E0E0E0" strokeWidth={1} strokeDasharray="4,4" />
                    ))}
                    <Path
                        d={`${buildCurvePath(CHART_DATA)} L ${toX(CHART_DATA.length - 1)} ${CHART_H - PADB} L ${toX(0)} ${CHART_H - PADB} Z`}
                        fill="rgba(239,68,68,0.06)"
                    />
                    <Path d={buildCurvePath(CHART_DATA)} fill="none" stroke="#EF4444" strokeWidth={2} />
                </Svg>
            </View>
        </View>
        <View style={styles.lineXLabels}>
            {X_LABELS.map((label, i) => (
                <Text key={i} style={styles.lineXLabel}>{label}</Text>
            ))}
        </View>
    </View>
);

// ── Main Screen ──────────────────────────────────────────────────
const MusculoskeletalDashboard = () => {
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
                <View>
                    <Text style={styles.cardSmallLabel}>Pain location</Text>
                    <Text style={styles.painLocationText}>{item.painLocation}</Text>
                </View>
                <View style={styles.severityBadge}>
                    <Text style={styles.severityBadgeText}>{item.severity}</Text>
                </View>
            </View>

            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Trigger</Text>
                <Text style={styles.cardInfoValue}>{item.trigger}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Starting Date & time</Text>
                <Text style={styles.cardInfoValue}>{item.startDateTime}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.cardInfoLabel}>Ending Date & Time</Text>
                <Text style={styles.cardInfoValue}>{item.endDateTime}</Text>
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
                        <Text style={styles.headerTitle}>Musculoskeletal</Text>
                    </View>
                    <TouchableOpacity style={styles.headerIconBg} onPress={() => navigation.navigate('AddMusculoskeletalDetails')}>
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

                {/* Dropdown filter */}
                <View style={styles.dropdownRow}>
                    <TouchableOpacity style={styles.dropdownBtn}>
                        <Text style={styles.dropdownText}>Neck</Text>
                        <Icon type={Icons.Ionicons} name="chevron-down" color="#555" size={ms(16)} />
                    </TouchableOpacity>
                </View>

                {/* Line Chart */}
                <LineChart />

                {/* Recently Added */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>Recently Added</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MusculoskeletalReadings', { readings: READINGS })}>
                            <Text style={styles.viewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    {READINGS.map((item) => renderReadingCard(item))}
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MusculoskeletalDashboard;

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

    // Dropdown
    dropdownRow: {
        alignItems: 'flex-end',
        paddingHorizontal: ms(20),
        marginTop: vs(8),
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        gap: ms(4),
    },
    dropdownText: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
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
        paddingRight: ms(10),
    },
    lineXLabel: {
        fontSize: ms(10),
        color: '#888',
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
        borderRadius: ms(15),
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
    cardSmallLabel: {
        fontSize: ms(11),
        color: '#888',
        marginBottom: vs(2),
    },
    painLocationText: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    severityBadge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(5),
        borderRadius: ms(20),
        backgroundColor: '#E0E7EF',
    },
    severityBadgeText: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: blackColor,
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
});
