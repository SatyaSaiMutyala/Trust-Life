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
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path,
    Circle,
    Line,
    Defs,
    LinearGradient as SvgLinearGradient,
    Stop,
} from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');
const CHART_W = width - ms(64);
const CHART_H = vs(110);

const TABS = ['All', 'Normal', 'Abnormal'];

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
        type: 'abnormal',
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
        type: 'abnormal',
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
        type: 'normal',
        points: [
            { x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 },
            { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 },
        ],
    },
    {
        name: 'Fasting Glucose',
        subtitle: 'Enzymatic Method',
        statusCode: 'N',
        statusLabel: 'Normal',
        statusColor: '#10B981',
        flagColor: '#10B981',
        normal: '92',
        abnormal: '-',
        unit: 'mg/dL',
        ref: '70 - 100',
        type: 'normal',
        points: [
            { x: 0, y: 0.45 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.40 },
            { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.35 }, { x: 1, y: 0.32 },
        ],
    },
    {
        name: 'Triglycerides',
        subtitle: 'Lipid Panel',
        statusCode: 'H',
        statusLabel: 'Abnormal High',
        statusColor: '#F59E0B',
        flagColor: '#F59E0B',
        normal: '-',
        abnormal: '210',
        unit: 'mg/dL',
        ref: '50 - 150',
        type: 'abnormal',
        points: [
            { x: 0, y: 0.80 }, { x: 0.18, y: 0.65 }, { x: 0.33, y: 0.70 },
            { x: 0.50, y: 0.85 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.75 },
        ],
    },
];

const X_LABELS = ['12 Feb', '13 Mar', '25 Apr', '21 May', '12 June', '12 July'];

// ── Chart Helper ─────────────────────────────────────────────────────────────
const createCurvePath = (pts) => {
    const p = pts.map((pt) => ({ x: pt.x * CHART_W, y: pt.y * CHART_H }));
    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 1; i < p.length; i++) {
        const prev = p[i - 1];
        const curr = p[i];
        const cpx1 = prev.x + (curr.x - prev.x) / 3;
        const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
        d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
};

// ── Bio Chart ────────────────────────────────────────────────────────────────
const BioChart = ({ points, id }) => {
    const curvePath = createCurvePath(points);
    const areaPath = `${curvePath} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`;
    const refLines = [0.10, 0.37, 0.64, 0.92];

    return (
        <View style={styles.bioChartWrap}>
            <Svg width={CHART_W} height={CHART_H}>
                <Defs>
                    <SvgLinearGradient id={`grad_${id}`} x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#F97316" stopOpacity="0.25" />
                        <Stop offset="1" stopColor="#F97316" stopOpacity="0" />
                    </SvgLinearGradient>
                </Defs>
                {refLines.map((ry, i) => (
                    <Line key={i} x1={0} y1={ry * CHART_H} x2={CHART_W} y2={ry * CHART_H}
                        stroke="#F97316" strokeWidth={0.8} strokeDasharray="4,4" opacity={0.5} />
                ))}
                <Path d={areaPath} fill={`url(#grad_${id})`} />
                <Path d={curvePath} fill="none" stroke="#F97316" strokeWidth={2} />
                {points.map((pt, i) => (
                    <Circle key={i} cx={pt.x * CHART_W} cy={pt.y * CHART_H}
                        r={4} fill="#F97316" stroke={whiteColor} strokeWidth={2} />
                ))}
            </Svg>
            <View style={styles.xLabels}>
                {X_LABELS.map((l, i) => (
                    <Text key={i} style={styles.xLabel}>{l}</Text>
                ))}
            </View>
        </View>
    );
};

// ── Bio Marker Card ──────────────────────────────────────────────────────────
const BioMarkerCard = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.bioCard}>
            <View style={styles.bioCardTop}>
                <View style={styles.bioNameWrap}>
                    <Text style={styles.bioName}>{item.name}</Text>
                    <Text style={styles.bioSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.bioTopRight}>
                    <View style={styles.bioCodeBadge}>
                        <Text style={styles.bioCodeText}>{item.statusCode}</Text>
                    </View>
                    <Icon type={Icons.Ionicons} name="flag" size={ms(16)} color={item.type === 'normal' ? '#10B981' : '#EF4444'} style={{ marginLeft: ms(4) }} />
                    <Text style={[styles.bioStatusLabel, { color: item.statusColor }]}>
                        {item.statusLabel}
                    </Text>
                </View>
            </View>

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

            <View style={styles.bioRefRow}>
                <Text style={styles.bioRefText}>Bio.Ref.Range  –  {item.ref}</Text>
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

            {expanded && <BioChart points={item.points} id={`bio_${index}`} />}
        </View>
    );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
const BioMarkersTrendScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('All');

    const filteredMarkers = BIO_MARKERS.filter((item) => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Normal') return item.type === 'normal';
        if (activeTab === 'Abnormal') return item.type === 'abnormal';
        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bio-Markers Trend</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabRow}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                {filteredMarkers.length > 0 ? (
                    filteredMarkers.map((item, i) => (
                        <BioMarkerCard key={i} item={item} index={i} />
                    ))
                ) : (
                    <View style={styles.emptyWrap}>
                        <Icon type={Icons.Ionicons} name="checkmark-circle-outline" size={ms(50)} color="#10B981" />
                        <Text style={styles.emptyText}>No markers in this category</Text>
                    </View>
                )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default BioMarkersTrendScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: whiteColor,
        marginLeft:ms(10)
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        marginBottom: vs(12),
        gap: ms(10),
    },
    tab: {
        flex: 1,
        paddingVertical: vs(10),
        borderRadius: ms(25),
        backgroundColor: whiteColor,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: primaryColor,
    },
    tabText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
    },
    tabTextActive: {
        color: whiteColor,
    },

    scrollContent: {
        paddingBottom: vs(80),
    },

    // Bio card
    bioCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: vs(12),
    },
    bioCardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: vs(14),
    },
    bioNameWrap: { flex: 1 },
    bioName: {
        fontFamily: bold,
        fontSize: ms(12),
        color: whiteColor,
        backgroundColor: 'green',
        paddingVertical: ms(6),
        paddingHorizontal: ms(10),
        borderRadius: ms(5),
        alignSelf: 'flex-start',
    },
    bioSubtitle: { fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    bioTopRight: { alignItems: 'flex-end' },
    bioCodeBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: ms(8),
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        alignSelf: 'flex-end',
    },
    bioCodeText: { fontSize: ms(12), fontFamily: bold, color: blackColor },
    bioStatusLabel: { fontSize: ms(12), fontFamily: bold, marginTop: vs(4) },

    // 3-column grid
    bioGrid: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        padding: ms(12),
        marginBottom: vs(12),
    },
    bioGridCell: { flex: 1, alignItems: 'center' },
    bioGridCellBorder: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    bioGridHeader: { fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4) },
    bioGridValue: { fontFamily: bold, fontSize: ms(14), color: blackColor },

    // Ref range row
    bioRefRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bioRefText: { fontSize: ms(12), color: '#374151' },
    viewTrendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    viewTrendText: { fontSize: ms(11), color: '#3B82F6', fontFamily: bold },

    // Chart
    bioChartWrap: { marginTop: vs(14) },
    xLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(8),
        paddingHorizontal: ms(2),
    },
    xLabel: { fontSize: ms(9), color: '#9CA3AF' },

    // Empty state
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(80),
    },
    emptyText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#9CA3AF',
        marginTop: vs(12),
    },
});
