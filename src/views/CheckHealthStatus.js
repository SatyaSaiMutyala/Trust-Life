import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity, Image,
    Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Circle, Defs, Line,
    LinearGradient as SvgLinearGradient,
    RadialGradient, Stop,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
import { bold, regular } from '../config/Constants';

// ── Score Gauge (same as HealthScoreDetails) ─────────────────────────────────
const GAUGE_SIZE = ms(190);
const CX = GAUGE_SIZE / 2;
const CY = GAUGE_SIZE / 2;
const R  = ms(76);
const STROKE_W = ms(17);
const SCORE     = 320;
const MIN_SCORE = 300;
const MAX_SCORE = 900;
const NORMALIZED = Math.max(0, Math.min(1, (SCORE - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)));
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_DEG   = 240;
const START_DEG = 150;
const ARC_LEN   = (ARC_DEG / 360) * CIRCUMFERENCE;
const DASH_OFFSET = ARC_LEN * (1 - NORMALIZED);

const toRad  = (d) => (d * Math.PI) / 180;
const polar  = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
});

const ScoreGauge = () => (
    <View style={styles.gaugeWrap}>
        <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
            <Defs>
                <SvgLinearGradient id="ckArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%"   stopColor="#0C5E50" />
                    <Stop offset="40%"  stopColor="#1A7E70" />
                    <Stop offset="100%" stopColor="#3BB89A" />
                </SvgLinearGradient>
                <RadialGradient id="ckGlow" cx="50%" cy="50%" r="55%">
                    <Stop offset="55%"  stopColor="#1A7E70" stopOpacity="0.15" />
                    <Stop offset="100%" stopColor="#1A7E70" stopOpacity="0" />
                </RadialGradient>
                <RadialGradient id="ckInner" cx="50%" cy="46%" r="50%">
                    <Stop offset="0%"   stopColor="#FFFFFF" />
                    <Stop offset="80%"  stopColor="#FFFFFF" />
                    <Stop offset="92%"  stopColor="#F2F2F2" />
                    <Stop offset="100%" stopColor="#D5D5D5" />
                </RadialGradient>
            </Defs>
            {/* Background arc */}
            <Circle cx={CX} cy={CY} r={R}
                fill="none" stroke="#F1F5F9" strokeWidth={STROKE_W}
                strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
                transform={`rotate(${START_DEG}, ${CX}, ${CY})`}
            />
            {/* Progress arc */}
            <Circle cx={CX} cy={CY} r={R}
                fill="none" stroke="url(#ckArcGrad)" strokeWidth={STROKE_W}
                strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
                strokeDashoffset={DASH_OFFSET}
                strokeLinecap="round"
                transform={`rotate(${START_DEG}, ${CX}, ${CY})`}
            />
            {/* Inner circle */}
            <Circle cx={CX} cy={CY} r={R - ms(6)} fill="url(#ckInner)" />
            {/* Tick marks */}
            {Array.from({ length: 7 }).map((_, i) => {
                const angle = START_DEG + (ARC_DEG / 6) * i;
                const s = polar(CX, CY, R - ms(11), angle);
                const e = polar(CX, CY, R - ms(22), angle);
                return (
                    <Line key={i} x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                        stroke="#D1D5DB" strokeWidth={ms(1.5)} strokeLinecap="round" />
                );
            })}
        </Svg>
        {/* Center text */}
        <View style={styles.gaugeCenterText}>
            <Text style={styles.gaugeScore}>{SCORE}</Text>
            <Text style={styles.gaugeOutOf}>out of {MAX_SCORE}</Text>
        </View>
        {/* Min/Max labels */}
        <Text style={[styles.gaugeMinMax, {
            position: 'absolute',
            left: polar(CX, CY, R + STROKE_W / 2 + ms(8), START_DEG).x - ms(16),
            top:  polar(CX, CY, R + STROKE_W / 2 + ms(8), START_DEG).y - ms(4),
        }]}>{MIN_SCORE}</Text>
        <Text style={[styles.gaugeMinMax, {
            position: 'absolute',
            left: polar(CX, CY, R + STROKE_W / 2 + ms(8), START_DEG + ARC_DEG).x - ms(4),
            top:  polar(CX, CY, R + STROKE_W / 2 + ms(8), START_DEG + ARC_DEG).y - ms(4),
        }]}>{MAX_SCORE}</Text>
    </View>
);

// ── Breakdown Data (same as HealthScoreDetails) ───────────────────────────────
const BREAKDOWN_DATA = [
    {
        title: 'Regularity of Health Actions',
        score: 18, total: 25, color: '#3B82F6',
        desc: "You've taken health action regularly with no long gaps",
        tooltip: 'Increased by 2 points + 18/25',
        tooltipDesc: "You've taken health action regularly with no long gaps",
    },
    {
        title: 'Consistency Over time',
        score: 21, total: 25, color: '#F59E0B',
        desc: 'Your engagement has been steady month over month',
        tooltip: 'Stable at 21/25',
        tooltipDesc: 'Your engagement has been steady month over month',
    },
    {
        title: 'Follow - through on Medical Guidance',
        score: 14, total: 20, color: '#10B981',
        desc: 'Some recommended follow-ups are pending',
        tooltip: 'Decreased by 1 point + 14/20',
        tooltipDesc: 'Some recommended follow-ups are pending',
    },
    {
        title: 'Stability of health Indicators',
        score: 12, total: 15, color: '#3B82F6', secondColor: '#F59E0B',
        desc: 'Your health markers are being monitored consistently',
        tooltip: 'Stable at 12/15',
        tooltipDesc: 'Your health markers are being monitored consistently',
    },
    {
        title: 'Preventive care engagement',
        score: 11, total: 15, color: '#06B6D4',
        desc: 'You are mostly on track with preventive care',
        tooltip: 'Increased by 1 point + 11/15',
        tooltipDesc: 'You are mostly on track with preventive care',
    },
];

// ── Breakdown Item ────────────────────────────────────────────────────────────
const BreakdownItem = ({ item, showTooltip, onToggleTooltip }) => {
    const pct = (item.score / item.total) * 100;
    return (
        <View style={styles.bdItem}>
            <View style={styles.bdHeader}>
                <Text style={styles.bdTitle}>{item.title}</Text>
                <View style={styles.bdScoreRow}>
                    <Text style={styles.bdScore}>{item.score}/{item.total}</Text>
                    <TouchableOpacity onPress={onToggleTooltip}>
                        <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(18)} color="#C0C0C0" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bdProgressBg}>
                {item.secondColor ? (
                    <View style={{ flexDirection: 'row', height: '100%' }}>
                        <View style={[styles.bdProgressFill, { backgroundColor: item.color, width: `${pct * 0.6}%` }]} />
                        <View style={[styles.bdProgressFill, { backgroundColor: item.secondColor, width: `${pct * 0.4}%` }]} />
                    </View>
                ) : (
                    <View style={[styles.bdProgressFill, { backgroundColor: item.color, width: `${pct}%` }]} />
                )}
            </View>
            <Text style={styles.bdDesc}>{item.desc}</Text>
            {showTooltip && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{item.tooltip}</Text>
                    <Text style={styles.tooltipDesc}>{item.tooltipDesc}</Text>
                </View>
            )}
        </View>
    );
};

// ── Score Details Bottom Sheet ────────────────────────────────────────────────
const ScoreDetailsSheet = ({ visible, onClose }) => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Health Progression Score Details</Text>
                    <TouchableOpacity onPress={onClose} style={styles.sheetClose}>
                        <Icon type={Icons.Ionicons} name="close" size={ms(22)} color={blackColor} />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
                    {BREAKDOWN_DATA.map((item, i) => (
                        <BreakdownItem
                            key={i}
                            item={item}
                            showTooltip={activeTooltip === i}
                            onToggleTooltip={() => setActiveTooltip(activeTooltip === i ? null : i)}
                        />
                    ))}
                    <View style={{ height: vs(20) }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

// ── Health Progression Story ──────────────────────────────────────────────────
const PROGRESSION_DATA = [
    { score: 614, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-13 Pts', isPositive: false, showArrow: true },
    { score: 627, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-7 Pts',  isPositive: false, showArrow: true },
];

// ── Timeline Score Badge (oval + right-pointing arrow) ───────────────────────
const TimelineBadge = ({ score }) => (
    <View style={styles.tlBadgeRow}>
        <View style={styles.tlOval}>
            <Text style={styles.tlOvalText}>{score}</Text>
        </View>
        <View style={styles.tlArrow} />
    </View>
);

// ── Single Timeline Row ───────────────────────────────────────────────────────
const TimelineRow = ({ item, isLast }) => (
    <View style={styles.tlRow}>
        {/* Left: badge + connector line */}
        <View style={styles.tlLeft}>
            <TimelineBadge score={item.score} />
            {!isLast && <View style={styles.tlConnector} />}
        </View>
        {/* Right: content */}
        <View style={styles.tlContent}>
            <Text style={styles.tlDate}>{item.date}</Text>
            <View style={styles.tlConditionRow}>
                <Text style={styles.tlCondition} numberOfLines={1}>{item.condition}</Text>
                <View style={styles.tlPointsRow}>
                    <Text style={[styles.tlPoints, { color: item.isPositive ? '#10B981' : '#EF4444' }]}>
                        {item.points}
                    </Text>
                    {item.showArrow && (
                        <Icon
                            type={Icons.Ionicons}
                            name={item.isPositive ? 'arrow-up' : 'arrow-down'}
                            size={ms(12)}
                            color={item.isPositive ? '#10B981' : '#EF4444'}
                            style={{ marginLeft: ms(2) }}
                        />
                    )}
                </View>
            </View>
            <Text style={styles.tlDoctor}>{item.doctor} • {item.visit}</Text>
        </View>
    </View>
);

// ── Active Health Condition Grid Cell ────────────────────────────────────────
const ConditionItem = ({ label, count, onPress }) => (
    <TouchableOpacity style={styles.gridCell} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.gridCellTop}>
            <Text style={styles.gridCellLabel} numberOfLines={1}>{label}</Text>
            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(13)} color={blackColor} />
        </View>
        <View style={[styles.gridBadge, { marginTop: vs(8) }]}>
            <Text style={styles.gridBadgeText}>{count}</Text>
        </View>
    </TouchableOpacity>
);

// ── Lifestyle Grid Cell ───────────────────────────────────────────────────────
const LifestyleItem = ({ label, count, image, onPress }) => (
    <TouchableOpacity style={styles.gridCell} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.gridCellTop}>
            <Text style={styles.gridCellLabel} numberOfLines={1}>{label}</Text>
            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(13)} color={blackColor} />
        </View>
        <View style={styles.lifestyleBottom}>
            <View style={styles.gridBadge}>
                <Text style={styles.gridBadgeText}>{count}</Text>
            </View>
            {image && <Image source={image} style={styles.lifestyleImage} resizeMode="contain" />}
        </View>
    </TouchableOpacity>
);

// ── Organ Row ─────────────────────────────────────────────────────────────────
const OrganRow = ({ label, count, showBorder }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('AnalysisCheck')} style={[styles.dataRow]}>
            <Text style={styles.dataRowLabel}>{label}</Text>
            <Text style={styles.dataRowCount}>{count}</Text>
            <Icon type={Icons.Ionicons} name="chevron-forward-circle-outline" size={ms(18)} color="#C0C0C0" />
        </TouchableOpacity>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const CheckHealthStatus = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const fromDashboard = route.params?.fromDashboard;
    const [sheetVisible, setSheetVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={[primaryColor, grayColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradient}
            >
            {/* Header */}
            <View style={styles.header}>
                {fromDashboard && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={whiteColor} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>Health Progression</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── My Health Continuity Score ── */}
                <View style={styles.card}>
                    <ScoreGauge />
                    <View style={styles.stableBadge}>
                        <Text style={styles.scoreStable}>Stable</Text>
                    </View>
                    <Text style={styles.scoreDesc}>
                        Your engagement with health has been{'\n'}consistent over the last 3 months
                    </Text>
                    <TouchableOpacity
                        style={styles.checkScoreBtn}
                        activeOpacity={0.85}
                        onPress={() => setSheetVisible(true)}
                    >
                        <Text style={styles.checkScoreBtnText}>Check Score Details</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Health Progression Story ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Health Progression story</Text>

                    {/* Black pill header */}
                    <View style={styles.progressionPill}>
                        <Text style={[styles.progressionPillText, { width: ms(76) }]}>Score</Text>
                        <Text style={[styles.progressionPillText, { flex: 1 }]}>Health Update</Text>
                        <View style={styles.pillArrows}>
                            <View style={[styles.pillArrowBg, { backgroundColor: 'rgba(16,185,129,0.2)' }]}>
                                <Icon type={Icons.Ionicons} name="arrow-up" size={ms(11)} color="#10B981" />
                            </View>
                            <View style={[styles.pillArrowBg, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
                                <Icon type={Icons.Ionicons} name="arrow-down" size={ms(11)} color="#EF4444" />
                            </View>
                        </View>
                    </View>

                    {/* Timeline rows */}
                    <View style={{ alignSelf: 'stretch', marginTop: vs(8) }}>
                        {PROGRESSION_DATA.map((item, i) => (
                            <TimelineRow key={i} item={item} isLast={i === PROGRESSION_DATA.length - 1} />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.viewProgressBtn}
                        onPress={() => navigation.navigate('HealthProgressionStoryScreen')}
                    >
                        <Text style={styles.viewProgressText}>View Health Progress</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View>

                {/* ── My Active Health Conditions ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>My Active Health Conditions</Text>
                    <View style={styles.grid}>
                        <ConditionItem label="Acute" count="4" onPress={() => navigation.navigate('AcuteConditionsScreen')} />
                        <ConditionItem label="Chronic" count="4" onPress={() => navigation.navigate('ChronicConditionsScreen')} />
                        <ConditionItem label="Chronic infec..." count="4" onPress={() => navigation.navigate('ChronicProgressiveScreen')} />
                        <ConditionItem label="Genetic" count="4" />
                        <ConditionItem label="Life threats" count="4" onPress={() => navigation.navigate('LifeThreatsScreen')} />
                        <ConditionItem label="Preventive" count="4" />
                    </View>
                </View>

                {/* ── Organs Health Status ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Organs Health Status :</Text>
                    <OrganRow label="Total organs monitor" count="10" />
                    <OrganRow label="Stable" count="6" showBorder />
                    <OrganRow label="Needs Attention" count="4" showBorder />
                </View>

                {/* ── Lifestyle Influence ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Lifestyle Influence :</Text>
                    <View style={styles.grid}>
                        <LifestyleItem label="Diet"      count="4" image={require('../assets/img/lsdite.png')} />
                        <LifestyleItem label="Sleep"     count="4" image={require('../assets/img/lssleep.png')} />
                        <LifestyleItem label="Fitness"   count="4" image={require('../assets/img/lsfitness.png')} />
                        <LifestyleItem label="Medicat..."count="4" image={require('../assets/img/lsmedication.png')} />
                        <LifestyleItem label="Alcohol"   count="4" image={require('../assets/img/lsalchol.png')} />
                        <LifestyleItem label="Smoking"   count="4" image={require('../assets/img/lssmoking.png')} />
                    </View>
                </View>

                <View style={{ height: vs(80) }} />
            </ScrollView>

            {/* ── Score Details Bottom Sheet ── */}
            <ScoreDetailsSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default CheckHealthStatus;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: grayColor },
    gradient: { flex: 1, paddingHorizontal: ms(14), paddingTop: ms(50) },

    // ── Header ──────────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(12),
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: ms(22), fontFamily: bold, color: whiteColor },

    scroll: { paddingTop: vs(14), paddingBottom: vs(20), gap: vs(12) },

    // ── White Card ───────────────────────────────────────────────────────────────
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), alignItems: 'center',
    },
    cardTitle: {
        fontSize: ms(14), fontWeight: '700', color: blackColor,
        marginBottom: vs(12), alignSelf: 'flex-start',
    },

    // ── Score Gauge ───────────────────────────────────────────────────────────────
    gaugeWrap: { alignItems: 'center', marginTop: vs(8) },
    gaugeCenterText: {
        position: 'absolute', width: GAUGE_SIZE, height: GAUGE_SIZE,
        justifyContent: 'center', alignItems: 'center',
    },
    gaugeScore:  { fontSize: ms(38), fontWeight: 'bold', color: '#166B5E' },
    gaugeOutOf:  { fontSize: ms(11), color: '#777', marginTop: vs(-2) },
    gaugeMinMax: { fontSize: ms(13), color: '#666', fontWeight: '600' },

    stableBadge: {
        backgroundColor: 'rgba(26,126,112,0.1)',
        borderRadius: ms(20),
        paddingHorizontal: ms(20), paddingVertical: vs(6),
        marginTop: vs(8),
    },
    scoreStable: { fontSize: ms(18), fontWeight: 'bold', color: blackColor },
    scoreDesc: {
        fontSize: ms(12), color: '#888', textAlign: 'center',
        lineHeight: ms(20), marginTop: vs(4),
    },
    checkScoreBtn: {
        backgroundColor: primaryColor, borderRadius: ms(25),
        paddingHorizontal: ms(28), paddingVertical: vs(12),
        marginTop: vs(16), marginBottom: vs(4),
    },
    checkScoreBtnText: { color: whiteColor, fontSize: ms(13), fontWeight: '700' },

    // ── Health Progression Story ──────────────────────────────────────────────────
    progressionPill: {
        flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center',
        backgroundColor: blackColor, borderRadius: ms(30),
        paddingVertical: vs(10), paddingLeft: ms(20), paddingRight: ms(10),
        marginBottom: vs(4),
    },
    progressionPillText: { color: whiteColor, fontSize: ms(13), fontWeight: '700' },
    pillArrows: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
    },
    pillArrowBg: {
        width: ms(22), height: ms(22), borderRadius: ms(11),
        justifyContent: 'center', alignItems: 'center',
    },

    // ── Timeline ──────────────────────────────────────────────────────────────
    tlRow: { flexDirection: 'row', alignItems: 'flex-start' },
    tlLeft: { alignItems: 'center', width: ms(88), marginRight: ms(8) },
    tlBadgeRow: { flexDirection: 'row', alignItems: 'center' },
    tlOval: {
        backgroundColor: primaryColor, borderRadius: ms(22),
        paddingHorizontal: ms(14), paddingVertical: vs(7),
        minWidth: ms(58), alignItems: 'center',
    },
    tlOvalText: { color: whiteColor, fontSize: ms(13), fontWeight: 'bold' },
    tlArrow: {
        width: 0, height: 0,
        borderTopWidth: ms(9), borderTopColor: 'transparent',
        borderBottomWidth: ms(9), borderBottomColor: 'transparent',
        borderLeftWidth: ms(11), borderLeftColor: primaryColor,
    },
    tlConnector: { width: ms(2.5), flex: 1, minHeight: vs(22), backgroundColor: primaryColor },
    tlContent: { flex: 1, paddingTop: vs(4), paddingBottom: vs(12) },
    tlDate: { fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(2) },
    tlConditionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tlCondition: { fontSize: ms(12), fontWeight: '700', color: blackColor, flex: 1, marginRight: ms(6) },
    tlPointsRow: { flexDirection: 'row', alignItems: 'center' },
    tlPoints: { fontSize: ms(12), fontWeight: '700' },
    tlDoctor: { fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },

    viewProgressBtn: {
        flexDirection: 'row', alignItems: 'center',
        alignSelf: 'flex-start', marginTop: vs(6),
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingVertical: vs(7), paddingHorizontal: ms(14),
    },
    viewProgressText: { fontSize: ms(12), color: primaryColor, fontWeight: '700', marginRight: ms(4) },

    // ── Grid ─────────────────────────────────────────────────────────────────────
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), alignSelf: 'stretch' },
    gridCell: {
        width: '47.5%', backgroundColor: '#F3F4F6',
        borderRadius: ms(10), padding: ms(12), minHeight: vs(80),
        justifyContent: 'space-between',
    },
    gridCellTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    gridCellLabel: { fontSize: ms(13), fontWeight: '600', color: blackColor, flex: 1 },
    gridBadge: {
        width: ms(32), height: ms(32), borderRadius: ms(16),
        backgroundColor: blackColor, justifyContent: 'center', alignItems: 'center',
    },
    gridBadgeText: { color: whiteColor, fontSize: ms(14), fontWeight: 'bold' },
    lifestyleBottom: {
        flexDirection: 'row', alignItems: 'flex-end',
        justifyContent: 'space-between', marginTop: vs(8),
    },
    lifestyleImage: { width: ms(55), height: ms(55) },

    // ── Data Row ─────────────────────────────────────────────────────────────────
    dataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), alignSelf: 'stretch', borderTopLeftRadius: ms(10), borderTopRightRadius: ms(10) },
    rowBorderTop: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    dataRowLabel: { flex: 1, fontSize: ms(13), color: '#333' },
    dataRowCount: { fontSize: ms(13), fontWeight: '600', color: blackColor, marginRight: ms(8) },

    // ── Bottom Sheet ─────────────────────────────────────────────────────────────
    sheetOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        backgroundColor: whiteColor,
        paddingHorizontal: ms(20), paddingTop: ms(12),
        maxHeight: '80%',
    },
    sheetHandle: {
        width: ms(40), height: ms(4), borderRadius: ms(2),
        backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: vs(12),
    },
    sheetHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(16),
    },
    sheetTitle: { fontSize: ms(15), fontWeight: '700', color: blackColor, flex: 1 },
    sheetClose: {
        width: ms(30), height: ms(30), borderRadius: ms(15),
        backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
    },
    sheetScroll: { paddingBottom: vs(10) },

    // ── Breakdown Item ────────────────────────────────────────────────────────────
    bdItem: {
        backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(14), marginBottom: vs(10),
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    bdHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bdTitle: { fontSize: ms(13), fontWeight: '700', color: blackColor, flex: 1 },
    bdScoreRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    bdScore: { fontSize: ms(13), fontWeight: '700', color: blackColor },
    bdProgressBg: {
        height: vs(6), backgroundColor: '#E8E8E8',
        borderRadius: ms(3), overflow: 'hidden', marginTop: vs(8),
    },
    bdProgressFill: { height: '100%', borderRadius: ms(3) },
    bdDesc: { fontSize: ms(11), color: '#999', marginTop: vs(4) },

    // ── Tooltip ───────────────────────────────────────────────────────────────────
    tooltip: {
        backgroundColor: '#F9FAFB', borderRadius: ms(8),
        padding: ms(10), marginTop: vs(8),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    tooltipTitle: { fontSize: ms(12), fontWeight: '700', color: blackColor },
    tooltipDesc: { fontSize: ms(11), color: '#888', marginTop: vs(2) },
});
