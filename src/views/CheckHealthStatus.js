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
import { heading, interMedium, interRegular } from '../config/Constants';

// ── Score Gauge (same as HealthScoreDetails) ─────────────────────────────────
const GAUGE_SIZE = ms(190);
const CX = GAUGE_SIZE / 2;
const CY = GAUGE_SIZE / 2;
const R  = ms(76);
const STROKE_W = ms(17);
const SCORE     = 590;

const getScoreStatus = (score) => {
    if (score >= 750) return { label: 'Exceptional', color: '#16A34A', bgColor: '#DCFCE7', arcColors: ['#059669', '#10B981', '#34D399'] };
    if (score >= 650) return { label: 'Very Good', color: '#22C55E', bgColor: '#F0FDF4', arcColors: ['#22C55E', '#4ADE80', '#86EFAC'] };
    if (score >= 550) return { label: 'Good', color: '#EAB308', bgColor: '#FEFCE8', arcColors: ['#CA8A04', '#EAB308', '#FACC15'] };
    if (score >= 450) return { label: 'Fair', color: '#CA8A04', bgColor: '#FEF9C3', arcColors: ['#A16207', '#CA8A04', '#EAB308'] };
    return { label: 'Poor', color: '#DC2626', bgColor: '#FEE2E2', arcColors: ['#991B1B', '#DC2626', '#EF4444'] };
};
const SCORE_STATUS = getScoreStatus(SCORE);
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
                    <Stop offset="0%"   stopColor={SCORE_STATUS.arcColors[0]} />
                    <Stop offset="40%"  stopColor={SCORE_STATUS.arcColors[1]} />
                    <Stop offset="100%" stopColor={SCORE_STATUS.arcColors[2]} />
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

const STORY_DATA = [
    { score: 614, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-13 Pts', isPositive: false, showArrow: true },
    { score: 627, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-7 Pts',  isPositive: false, showArrow: true },
    { score: 634, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 640, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-12 Pts', isPositive: false, showArrow: true },
    { score: 652, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-18 Pts', isPositive: false, showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true },
];

// ── Story Bottom Sheet ───────────────────────────────────────────────────────
const StorySheet = ({ visible, onClose }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose} />
        <View style={styles.storySheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}> Progression Score</Text>
                <TouchableOpacity onPress={onClose} style={styles.sheetClose}>
                    <Icon type={Icons.Ionicons} name="close" size={ms(22)} color={blackColor} />
                </TouchableOpacity>
            </View>

            {/* Black pill header */}
            <View style={styles.storyPill}>
                <Text style={styles.storyPillText}>Score</Text>
                <Text style={[styles.storyPillText, { marginLeft: ms(50) }]}>Health Variation</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
                {STORY_DATA.map((item, i) => (
                    <TimelineRow key={i} item={item} isLast={i === STORY_DATA.length - 1} />
                ))}
                <View style={{ height: vs(20) }} />
            </ScrollView>
        </View>
    </Modal>
);

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

// ── Main Screen ───────────────────────────────────────────────────────────────
const CheckHealthStatus = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const fromDashboard = route.params?.fromDashboard;
    const [sheetVisible, setSheetVisible] = useState(false);
    const [showCondInfo, setShowCondInfo] = useState(false);
    const [showOrganInfo, setShowOrganInfo] = useState(false);
    const [showBioInfo, setShowBioInfo] = useState(false);
    const [showSymptomInfo, setShowSymptomInfo] = useState(false);
    const [showLifestyleInfo, setShowLifestyleInfo] = useState(false);
    const [showMedicalInfo, setShowMedicalInfo] = useState(false);
    const [showMonitorInfo, setShowMonitorInfo] = useState(false);
    const [storyVisible, setStoryVisible] = useState(false);

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
                    <View style={[styles.stableBadge, { backgroundColor: SCORE_STATUS.bgColor }]}>
                        <Text style={[styles.scoreStable, { color: SCORE_STATUS.color }]}>{SCORE_STATUS.label}</Text>
                    </View>
                    <Text style={styles.scoreDesc}>
                        Your engagement with health has been{'\n'}consistent over the last 3 months
                    </Text>
                     <TouchableOpacity
                        style={styles.checkScoreBtn}
                        activeOpacity={0.85}
                        onPress={() => setStoryVisible(true)}
                    >
                        <Text style={styles.checkScoreBtnText}>Check Progression Score </Text>
                    </TouchableOpacity>
                </View>

                {/* ── Bio Markers Stability ── */}
                <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Bio-Markers Stability</Text>
                        <View style={styles.trendBadge}>
                            <Icon type={Icons.Ionicons} name="trending-up" size={ms(13)} color="#16A34A" />
                            <Text style={styles.trendBadgeText}>+9</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('BioMarkerDetailScreen')} style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(11)} color={whiteColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowBioInfo(!showBioInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    {showBioInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Bio Markers Score 21/25</Text>
                            <Text style={styles.condTooltipDesc}>Your key biomarkers are mostly within healthy ranges</Text>
                        </View>
                    )}
                    {[
                        { label: 'Bio-Markers Status', score: '+2', direction: 'up',   status: 'Moderate', statusType: 'moderate', icon: 'water' },
                        { label: 'Stability',             score: '+3', direction: 'up',   status: 'Stable',   statusType: 'strong',   icon: 'shield-checkmark' },
                        { label: 'Trend Velocity',        score: '+4', direction: 'up',   status: 'Stable',   statusType: 'strong',   icon: 'trending-up' },
                    ].map((item, index) => {
                        const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                        const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                        const iconBg = item.statusType === 'strong' ? '#F0FDF4' : item.statusType === 'poor' ? '#FFF1F2' : '#FFFBEB';
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                // onPress={() => navigation.navigate('BioMarkerDetailScreen', { marker: item.label })}
                                style={styles.bioRow}
                            >
                                {/* <View style={[styles.bioRowIcon, { backgroundColor: iconBg }]}>
                                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color={color} />
                                </View> */}
                                <Text style={styles.bioRowLabel} numberOfLines={1}>{item.label}</Text>
                                <View style={styles.bioRowCenter}>
                                    <Text style={[styles.bioRowScore, { color }]}>{item.score}</Text>
                                    <Icon type={Icons.Ionicons} name={item.direction === 'up' ? 'arrow-up' : 'arrow-down'} size={ms(14)} color={color} />
                                </View>
                                <View style={[styles.bioRowBadge, { backgroundColor: bgColor }]}>
                                    <Text style={[styles.bioRowBadgeText, { color }]}>{item.status}</Text>
                                </View>
                                {/* <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(16)} color={blackColor} /> */}
                            </TouchableOpacity>
                        );
                    })}
                    {/* <View style={styles.bioFooterRow}>
                        <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('BioMarkersScreen', { filter: ['Bio-Markers Status', 'Stability', 'Trend Velocity'], title: 'Bio-Markers Stability' })}>
                            <Text style={styles.condViewAllText}>View all</Text>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.analyteTrendBtn} onPress={() => navigation.navigate('AnalyteTrendScreen')}>
                            <Icon type={Icons.Ionicons} name="analytics-outline" size={ms(13)} color={whiteColor} />
                            <Text style={styles.analyteTrendBtnText}>Analyte Trend</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                {/* ── Health Progression Story ── */}
                {/* <View style={styles.card}>
                    <Text style={styles.cardTitle}>Health Progression story</Text>

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

                    <View style={{ alignSelf: 'stretch', marginTop: vs(8) }}>
                        {PROGRESSION_DATA.map((item, i) => (
                            <TimelineRow key={i} item={item} isLast={i === PROGRESSION_DATA.length - 1} />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.viewProgressBtn}
                        onPress={() => setStoryVisible(true)}
                    >
                        <Text style={styles.viewProgressText}>View Health Progress</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View> */}

                <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Active Health Conditions</Text>
                        {/* <Text style={styles.condScore}>18/25</Text>
                        <TouchableOpacity onPress={() => setShowCondInfo(!showCondInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity> */}
                    </View>
                    {/* {showCondInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Increased by 2 points + 18/25</Text>
                            <Text style={styles.condTooltipDesc}>You've taken health action regularly with no long gaps</Text>
                        </View>
                    )} */}
                    {[
                        { label: 'Diabetes', type: 'Chronic', typeColor: '#3B82F6', status: 'Moderate control', statusType: 'moderate', condition: { id: '1', name: 'Diabetes', category: 'Chronic', status: 'Active', stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Tracks your blood sugar levels to help you manage and stay within a healthy range.' } },
                        { label: 'Hypertension', type: 'Chronic', typeColor: '#3B82F6', status: 'Poor control', statusType: 'poor', screen: 'DiseaseIntelligenceScreen', condition: { id: '2', name: 'Hypertension', category: 'Chronic', status: 'Active', stability: 'Unstable', stabilityColor: '#1F2937', stabilityBgColor: '#F3F4F6', date: '12 Jan 2026  •  12:30 PM', description: 'Monitors your blood pressure to maintain healthy heart and circulation.' } },
                        { label: 'Fever', type: 'Acute', typeColor: '#EF4444', status: 'Need to monitor', statusType: 'moderate', condition: { id: '1', name: 'Fever', category: 'Acute', status: 'Active', stability: 'Stable', stabilityColor: primaryColor, stabilityBgColor: '#DCFCE7', date: '12 Jan, 2026  •  12:30 PM', description: 'Body temperature above normal, usually due to infection or inflammation' } },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.condRow} activeOpacity={0.7} onPress={() => navigation.navigate('DiseaseIntelligenceScreen', { disease: item.label })}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.condName}>{item.label}</Text>
                                <View style={[styles.condTypeBadge, { backgroundColor: item.typeColor + '15', marginTop: vs(3) }]}>
                                    <Text style={[styles.condTypeText, { color: item.typeColor }]}>{item.type}</Text>
                                </View>
                            </View>
                            <View style={
                                item.statusType === 'strong' ? styles.lisBadgeStrong :
                                item.statusType === 'poor' ? styles.lisBadgePoor :
                                styles.lisBadgeModerate
                            }>
                                <Text style={
                                    item.statusType === 'strong' ? styles.lisBadgeTextStrong :
                                    item.statusType === 'poor' ? styles.lisBadgeTextPoor :
                                    styles.lisBadgeTextModerate
                                }>{item.status}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('ActiveConditionsScreen')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={[styles.condViewAll, { borderTopWidth: 0, backgroundColor: primaryColor + '10', borderRadius: ms(10), marginHorizontal: ms(12), marginBottom: ms(12), paddingVertical: vs(10) }]} onPress={() => navigation.navigate('DiseaseIntelligenceScreen')}>
                        <Icon type={Icons.Ionicons} name="analytics-outline" size={ms(16)} color={primaryColor} />
                        <Text style={[styles.condViewAllText, { flex: 1, marginLeft: ms(6) }]}>Disease Intelligence</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity> */}
                </View>

                {/* ── Organ Insights ── */}
                <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Organ Insights</Text>
                        {/* <Text style={styles.condScore}>18/25</Text>
                        <TouchableOpacity onPress={() => setShowOrganInfo(!showOrganInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity> */}
                    </View>
                    {/* {showOrganInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Organ Health Score 18/25</Text>
                            <Text style={styles.condTooltipDesc}>Based on your latest biomarkers and health check data</Text>
                        </View>
                    )} */}
                    <View style={styles.organGrid}>
                        {[
                            { img: require('../assets/img/vo-heart.png'),     label: 'Heart',    organId: 'heart',    status: 'Stable', statusType: 'strong' },
                            { img: require('../assets/img/human-kidneys.png'), label: 'Kidney',   organId: 'kidneys',  status: 'Stable', statusType: 'strong' },
                            { img: require('../assets/img/human-liver.png'),   label: 'Liver',    organId: 'liver',    status: 'Stable', statusType: 'strong' },
                            { img: require('../assets/img/human-pancreas.png'), label: 'Pancreas', organId: 'pancreas', status: 'Stable', statusType: 'strong' },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.organGridCard} activeOpacity={0.7}
                            onPress={() => navigation.navigate('OrganInsightsScreen', { organId: item.organId })}>
                                <View style={styles.organGridTop}>
                                    <Image source={item.img} style={styles.organGridImage} />
                                    <Text style={styles.organGridLabel}>{item.label}</Text>
                                </View>
                                <View style={styles.organGridStatusRow}>
                                    <Text style={styles.organGridStatusLabel}>Status :</Text>
                                    <View style={[styles.organGridStatusBadge, item.statusType === 'strong' ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEF3C7' }]}>
                                        <Text style={[styles.organGridStatusText, item.statusType === 'strong' ? { color: '#16A34A' } : { color: '#D97706' }]}>{item.status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('AnalysisCheck')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={[styles.condViewAll, { borderTopWidth: 0, backgroundColor: primaryColor + '10', borderRadius: ms(10), marginHorizontal: ms(12), marginBottom: ms(12), paddingVertical: vs(10), paddingHorizontal:ms(10) }]} onPress={() => navigation.navigate('OrganInsightsScreen')}>
                        <Icon type={Icons.Ionicons} name="pulse-outline" size={ms(16)} color={primaryColor} />
                        <Text style={[styles.condViewAllText, { flex: 1, marginLeft: ms(6) }]}>Organ Intelligence</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.condViewAll, { borderTopWidth: 0, backgroundColor: primaryColor + '10', borderRadius: ms(10), marginHorizontal: ms(12), marginBottom: ms(12), paddingVertical: vs(10), paddingHorizontal:ms(10) }]} onPress={() => navigation.navigate('OrganLayerScreen')}>
                        <Icon type={Icons.Ionicons} name="pulse-outline" size={ms(16)} color={primaryColor} />
                        <Text style={[styles.condViewAllText, { flex: 1, marginLeft: ms(6) }]}>Organ Intelligence</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity> */}
                </View>

                {/* ── Symptoms ── */}
                {/* <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Symptom Monitoring</Text>
                        <Text style={styles.condScore}>16/25</Text>
                        <TouchableOpacity onPress={() => setShowSymptomInfo(!showSymptomInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    {showSymptomInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Symptom Score 16/25</Text>
                            <Text style={styles.condTooltipDesc}>Tracking your symptom patterns helps identify health trends</Text>
                        </View>
                    )}
                    {[
                        { label: 'Headache',   status: 'Frequent', statusType: 'moderate', prevScore: '18/25', currScore: '16/25', desc: 'Your score has slightly decreased since the last check.' },
                        { label: 'Fatigue',    status: 'Mild',     statusType: 'strong', prevScore: '20/25', currScore: '19/25', desc: 'Your score has slightly decreased since the last check.' },
                        { label: 'Joint Pain', status: 'Moderate', statusType: 'moderate', prevScore: '17/25', currScore: '15/25', desc: 'Your score has slightly decreased since the last check.' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.bioCard} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomDetailScreen', { symptom: item.label })}>
                            <View style={styles.bioCardTopRow}>
                                <Text style={styles.bioCardLabel}>{item.label}</Text>
                                <View style={[styles.bioCardBadge, item.statusType === 'strong' ? { backgroundColor: '#DCFCE7' } : item.statusType === 'poor' ? { backgroundColor: '#FCE4EC' } : { backgroundColor: '#FEF3C7' }]}>
                                    <Text style={[styles.bioCardBadgeText, item.statusType === 'strong' ? { color: '#16A34A' } : item.statusType === 'poor' ? { color: '#E11D48' } : { color: '#D97706' }]}>{item.status}</Text>
                                </View>
                            </View>
                            <View style={styles.bioCardScoreRow}>
                                <Text style={styles.bioCardScore}>{item.prevScore}</Text>
                                <Text style={styles.bioCardArrow}>→</Text>
                                <Text style={styles.bioCardScore}>{item.currScore}</Text>
                            </View>
                            <Text style={styles.bioCardDesc}>{item.desc}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('SymptomsScreen')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View> */}

                {/* ── Lifestyle Impact Summary ── */}
                <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Lifestyle Influences</Text>
                        <View style={styles.trendBadge}>
                            <Icon type={Icons.Ionicons} name="trending-up" size={ms(13)} color="#16A34A" />
                            <Text style={styles.trendBadgeText}>+9</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowLifestyleInfo(!showLifestyleInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    {showLifestyleInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Lifestyle Score 20/25</Text>
                            <Text style={styles.condTooltipDesc}>Your daily habits positively support your overall health</Text>
                        </View>
                    )}
                    {[
                        { label: 'Physical Activity',     status: 'Active',     statusType: 'strong', prevScore: '72/100', currScore: '76/100', desc: '8,200 steps/day • 720 MET-min/week', id: 'sleep', impact: '+4', impactColor: '#16A34A', screen: 'ProgressPhysicalActivityScreen' },
                        { label: 'Diet',   status: 'Good',   statusType: 'strong', prevScore: '65/100', currScore: '72/100', desc: 'Mostly healthy diet, condition-aware', id: 'activity', impact: '+8', impactColor: '#16A34A', screen: 'DietPatternScreen' },
                        { label: 'Sleep',    status: 'Good', statusType: 'strong', prevScore: '62/100', currScore: '68/100', desc: '6.5hrs avg • 82% efficiency', id: 'diet', impact: '-2', impactColor: '#F59E0B', screen: 'ProgressSleepPatternScreen' },
                        { label: 'Stress',    status: 'Moderate', statusType: 'moderate', prevScore: '52/100', currScore: '55/100', desc: 'PSS: 18/40 • HRV: 42ms', id: 'stress', impact: '-2', impactColor: '#F59E0B', screen: 'StressManagementScreen' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.bioCard, { flexDirection: 'row', alignItems: 'center' }]} activeOpacity={0.7} onPress={() => item.screen ? navigation.navigate(item.screen) : null}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.bioCardTopRow}>
                                    <Text style={styles.bioCardLabel}>{item.label}</Text>
                                    <View style={[styles.bioCardBadge, item.statusType === 'strong' ? { backgroundColor: '#DCFCE7' } : item.statusType === 'poor' ? { backgroundColor: '#FCE4EC' } : { backgroundColor: '#FEF3C7' }]}>
                                        <Text style={[styles.bioCardBadgeText, item.statusType === 'strong' ? { color: '#16A34A' } : item.statusType === 'poor' ? { color: '#E11D48' } : { color: '#D97706' }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.bioCardScoreRow}>
                                    <Text style={styles.bioCardScore}>{item.prevScore}</Text>
                                    <Text style={styles.bioCardArrow}>→</Text>
                                    <Text style={styles.bioCardScore}>{item.currScore}</Text>
                                </View>
                                <Text style={styles.bioCardDesc}>{item.desc}</Text>
                            </View>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color={blackColor} style={{ marginLeft: ms(8) }} />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('LifestyleImpactSummary')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View>

                {/* ── Medical Engagement ── */}
                <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Medical Engagement</Text>
                        <View style={styles.trendBadge}>
                            <Icon type={Icons.Ionicons} name="trending-up" size={ms(13)} color="#16A34A" />
                            <Text style={styles.trendBadgeText}>+9</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowMedicalInfo(!showMedicalInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    {showMedicalInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Medical Engagement Score 22/25</Text>
                            <Text style={styles.condTooltipDesc}>You're actively engaged with your healthcare providers</Text>
                        </View>
                    )}
                    {[
                        { label: 'Medication Adherence', status: 'Good',     statusType: 'strong', prevScore: '82/100', currScore: '88/100', desc: 'PDC Score: 0.93 • Adherence Rate: 92.9%', screen: 'MedicationAdherenceScreen' },
                        { label: 'Appointment Adherence', status: 'Moderate',    statusType: 'moderate', prevScore: '72/100', currScore: '73/100', desc: 'PDC Score: 0.83 • Adherence Rate: 83.3%', screen: 'AppointmentAdherenceScreen' },
                        { label: 'Diagnostic Compliance', status: 'Active',     statusType: 'strong', prevScore: '22/25', currScore: '22/25', desc: 'Your score has slightly decreased since the last check.', screen: 'DiagnosticComplianceScreen' },
                        { label: 'Self Monitoring', status: 'Active',     statusType: 'strong', prevScore: '22/25', currScore: '22/25', desc: 'Your score has slightly decreased since the last check.', screen: 'SelfMonitoringScreen' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.bioCard, { flexDirection: 'row', alignItems: 'center' }]} activeOpacity={0.7} onPress={() => item.screen ? navigation.navigate(item.screen) : null}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.bioCardTopRow}>
                                    <Text style={styles.bioCardLabel}>{item.label}</Text>
                                    <View style={[styles.bioCardBadge, item.statusType === 'strong' ? { backgroundColor: '#DCFCE7' } : item.statusType === 'poor' ? { backgroundColor: '#FCE4EC' } : { backgroundColor: '#FEF3C7' }]}>
                                        <Text style={[styles.bioCardBadgeText, item.statusType === 'strong' ? { color: '#16A34A' } : item.statusType === 'poor' ? { color: '#E11D48' } : { color: '#D97706' }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.bioCardScoreRow}>
                                    <Text style={styles.bioCardScore}>{item.prevScore}</Text>
                                    <Text style={styles.bioCardArrow}>→</Text>
                                    <Text style={styles.bioCardScore}>{item.currScore}</Text>
                                </View>
                                <Text style={styles.bioCardDesc}>{item.desc}</Text>
                            </View>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color={blackColor} style={{ marginLeft: ms(8) }} />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('MedicalEngagementScreen')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View>

                {/* ── Monitoring Continuity ── */}
                {/* <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={[styles.cardTitle, { flex: 1 }]}>Monitoring Continuity</Text>
                        <Text style={styles.condScore}>19/25</Text>
                        <TouchableOpacity onPress={() => setShowMonitorInfo(!showMonitorInfo)} style={{ padding: ms(4) }}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(20)} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    {showMonitorInfo && (
                        <View style={styles.condTooltip}>
                            <Text style={styles.condTooltipTitle}>Monitoring Score 19/25</Text>
                            <Text style={styles.condTooltipDesc}>Your health tracking consistency is helping build better insights</Text>
                        </View>
                    )}
                    {[
                        { label: 'Vital Tracking',     status: 'Consistent', statusType: 'strong', prevScore: '20/25', currScore: '19/25', desc: 'Your score has slightly decreased since the last check.' },
                        { label: 'Health Check-ins',   status: 'On track',   statusType: 'strong', prevScore: '19/25', currScore: '19/25', desc: 'Your score has slightly decreased since the last check.' },
                        { label: 'Screening Schedule', status: 'Due soon',   statusType: 'moderate', prevScore: '18/25', currScore: '17/25', desc: 'Your score has slightly decreased since the last check.' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.bioCard} activeOpacity={0.7} onPress={() => navigation.navigate('MonitoringContinuityScreen')}>
                            <View style={styles.bioCardTopRow}>
                                <Text style={styles.bioCardLabel}>{item.label}</Text>
                                <View style={[styles.bioCardBadge, item.statusType === 'strong' ? { backgroundColor: '#DCFCE7' } : item.statusType === 'poor' ? { backgroundColor: '#FCE4EC' } : { backgroundColor: '#FEF3C7' }]}>
                                    <Text style={[styles.bioCardBadgeText, item.statusType === 'strong' ? { color: '#16A34A' } : item.statusType === 'poor' ? { color: '#E11D48' } : { color: '#D97706' }]}>{item.status}</Text>
                                </View>
                            </View>
                            <View style={styles.bioCardScoreRow}>
                                <Text style={styles.bioCardScore}>{item.prevScore}</Text>
                                <Text style={styles.bioCardArrow}>→</Text>
                                <Text style={styles.bioCardScore}>{item.currScore}</Text>
                            </View>
                            <Text style={styles.bioCardDesc}>{item.desc}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.condViewAll} onPress={() => navigation.navigate('MonitoringContinuityScreen')}>
                        <Text style={styles.condViewAllText}>View all</Text>
                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={primaryColor} />
                    </TouchableOpacity>
                </View> */}

                {/* ── Recommendation ── */}
                {/* <View style={styles.card}>
                    <View style={styles.lisHeader}>
                        <Text style={styles.cardTitle}>Recommendation</Text>
                        <TouchableOpacity>
                            <Text style={styles.lisViewAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    {[
                        { iconType: Icons.Ionicons,              iconName: 'fitness',         iconColor: '#10B981', label: 'Exercise Plan',     status: 'Active',    statusType: 'strong'   },
                        { iconType: Icons.Ionicons,              iconName: 'nutrition',       iconColor: '#F59E0B', label: 'Diet Adjustment',   status: 'Suggested', statusType: 'moderate' },
                        { iconType: Icons.MaterialCommunityIcons, iconName: 'pill',           iconColor: '#6366F1', label: 'Supplement Intake', status: 'On track',  statusType: 'strong'   },
                        { iconType: Icons.Ionicons,              iconName: 'bed',             iconColor: '#7B61FF', label: 'Sleep Routine',     status: 'Improve',   statusType: 'moderate' },
                    ].map((item, index) => (
                        <View key={index} style={styles.lisRow}>
                            <Icon type={item.iconType} name={item.iconName} size={ms(22)} color={item.iconColor} />
                            <Text style={styles.lisLabel}>{item.label}</Text>
                            <View style={item.statusType === 'strong' ? styles.lisBadgeStrong : styles.lisBadgeModerate}>
                                <Text style={item.statusType === 'strong' ? styles.lisBadgeTextStrong : styles.lisBadgeTextModerate}>{item.status}</Text>
                            </View>
                        </View>
                    ))}
                </View> */}

                <View style={{ height: vs(80) }} />
            </ScrollView>

            {/* ── Score Details Bottom Sheet ── */}
            <ScoreDetailsSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
            <StorySheet visible={storyVisible} onClose={() => setStoryVisible(false)} />
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
    headerTitle: { fontSize: ms(22), fontFamily: heading, color: whiteColor },

    scroll: { paddingTop: vs(14), paddingBottom: vs(20), gap: vs(12) },

    // ── White Card ───────────────────────────────────────────────────────────────
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), alignItems: 'center',
    },
    cardTitle: {
        fontSize: ms(16), fontFamily: heading, color: blackColor,
         alignSelf: 'flex-start',
    },

    // ── Score Gauge ───────────────────────────────────────────────────────────────
    gaugeWrap: { alignItems: 'center', marginTop: vs(8) },
    gaugeCenterText: {
        position: 'absolute', width: GAUGE_SIZE, height: GAUGE_SIZE,
        justifyContent: 'center', alignItems: 'center',
    },
    gaugeScore:  { fontSize: ms(38), fontFamily: interMedium, color: '#166B5E' },
    gaugeOutOf:  { fontSize: ms(11), fontFamily: interRegular, color: '#777', marginTop: vs(-2) },
    gaugeMinMax: { fontSize: ms(13), fontFamily: interMedium, color: '#666' },

    stableBadge: {
        backgroundColor: 'rgba(26,126,112,0.1)',
        borderRadius: ms(20),
        paddingHorizontal: ms(20), paddingVertical: vs(6),
        marginTop: vs(8),
    },
    scoreStable: { fontSize: ms(18), fontFamily: interMedium, color: blackColor },
    scoreDesc: {
        fontSize: ms(12), fontFamily: interRegular, color: '#888', textAlign: 'center',
        lineHeight: ms(20), marginTop: vs(4),
    },
    checkScoreBtn: {
        backgroundColor: primaryColor, borderRadius: ms(25),
        paddingHorizontal: ms(28), paddingVertical: vs(12),
        marginTop: vs(16), marginBottom: vs(4),
    },
    checkScoreBtnText: { color: whiteColor, fontSize: ms(13), fontFamily: interMedium },

    // ── Health Progression Story ──────────────────────────────────────────────────
    progressionPill: {
        flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center',
        backgroundColor: blackColor, borderRadius: ms(30),
        paddingVertical: vs(10), paddingLeft: ms(20), paddingRight: ms(10),
        marginBottom: vs(4), marginTop:ms(10)
    },
    progressionPillText: { color: whiteColor, fontSize: ms(13), fontFamily: interMedium },
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
    tlOvalText: { color: whiteColor, fontSize: ms(13), fontFamily: interMedium },
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
    tlCondition: { fontSize: ms(12), fontFamily: interMedium, color: blackColor, flex: 1, marginRight: ms(6) },
    tlPointsRow: { flexDirection: 'row', alignItems: 'center' },
    tlPoints: { fontSize: ms(12), fontFamily: interMedium },
    tlDoctor: { fontSize: ms(10), fontFamily: interRegular, color: '#9CA3AF', marginTop: vs(2) },

    viewProgressBtn: {
        flexDirection: 'row', alignItems: 'center',
        alignSelf: 'flex-start', marginTop: vs(6),
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingVertical: vs(7), paddingHorizontal: ms(14),
    },
    viewProgressText: { fontSize: ms(12), fontFamily: interMedium, color: primaryColor, marginRight: ms(4) },

    // ── Grid ─────────────────────────────────────────────────────────────────────
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), alignSelf: 'stretch' , marginTop:ms(10)},
    gridCell: {
        width: '47.5%', backgroundColor: '#F3F4F6',
        borderRadius: ms(10), padding: ms(12), minHeight: vs(80),
        justifyContent: 'space-between',
    },
    gridCellTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    gridCellLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, flex: 1 },
    gridBadge: {
        width: ms(32), height: ms(32), borderRadius: ms(16),
        backgroundColor: blackColor, justifyContent: 'center', alignItems: 'center',
    },
    gridBadgeText: { color: whiteColor, fontSize: ms(14), fontFamily: interMedium },
    lifestyleBottom: {
        flexDirection: 'row', alignItems: 'flex-end',
        justifyContent: 'space-between', marginTop: vs(8),
    },
    lifestyleImage: { width: ms(55), height: ms(55) },

    // ── Data Row ─────────────────────────────────────────────────────────────────
    dataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), alignSelf: 'stretch', borderTopLeftRadius: ms(10), borderTopRightRadius: ms(10) },
    rowBorderTop: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    dataRowLabel: { flex: 1, fontSize: ms(13), color: '#333' },
    dataRowCount: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, marginRight: ms(8) },

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
    sheetTitle: { fontSize: ms(15), fontFamily: heading, color: blackColor, flex: 1 },
    sheetClose: {
        width: ms(30), height: ms(30), borderRadius: ms(15),
        backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
    },
    sheetScroll: { paddingBottom: vs(10) },
    storySheet: {
        backgroundColor: '#F2F5F8',
        paddingHorizontal: ms(20), paddingTop: ms(12),
        maxHeight: '85%',
    },
    storyPill: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: blackColor, borderRadius: ms(30),
        paddingVertical: vs(10), paddingHorizontal: ms(22),
        marginBottom: vs(16),
    },
    storyPillText: { color: whiteColor, fontSize: ms(13), fontFamily: interMedium },

    // ── Breakdown Item ────────────────────────────────────────────────────────────
    bdItem: {
        backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(14), marginBottom: vs(10),
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    bdHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bdTitle: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, flex: 1 },
    bdScoreRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    bdScore: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
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
    tooltipTitle: { fontSize: ms(12), fontFamily: interMedium, color: blackColor },
    tooltipDesc: { fontSize: ms(11), fontFamily: interRegular, color: '#888', marginTop: vs(2) },

    // ── Lifestyle Impact Summary ──
    lisHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginTop: vs(10),
        marginBottom: vs(4),
    },
    lisViewAll: {
        fontSize: ms(12),
        fontFamily: interMedium,
        color: primaryColor,
    },
    lisRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingVertical: ms(12),
        gap: ms(12),
    },
    lisLabel: {
        flex: 1,
        fontSize: ms(14),
        fontFamily: interRegular,
        color: '#111111',
    },
    lisBadgeStrong: {
        backgroundColor: '#E8F5E9',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(5),
    },
    lisBadgeTextStrong: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: '#2E7D32',
    },
    lisBadgeModerate: {
        backgroundColor: '#FFF4E5',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(5),
    },
    lisBadgeTextModerate: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: '#E07B00',
    },
    lisBadgePoor: {
        backgroundColor: '#FEE2E2',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(5),
    },
    lisBadgeTextPoor: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: '#DC2626',
    },

    // ── Active Condition Disease Row ──
    condHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(4),
    },
    condScore: {
        fontSize: ms(16),
        fontFamily: interMedium,
        color: blackColor,
        marginRight: ms(4),
    },
    condInfoBtn: {
        padding: ms(4),
    },
    condRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#F3F4F6',
        borderRadius: ms(12),
        padding: ms(14),
        marginTop: vs(8),
    },
    condName: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: blackColor,
    },
    condTypeBadge: {
        borderRadius: ms(6),
        paddingHorizontal: ms(8),
        paddingVertical: ms(2),
        alignSelf: 'flex-start',
    },
    condScore: {
        fontSize: ms(16),
        fontFamily: interMedium,
        color: blackColor,
        marginRight: ms(4),
    },
    condTooltip: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        padding: ms(12),
        marginBottom: vs(4),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    condTooltipTitle: {
        fontSize: ms(12),
        fontFamily: interMedium,
        color: blackColor,
        marginBottom: vs(2),
    },
    condTooltipDesc: {
        fontSize: ms(11),
        fontFamily: interRegular,
        color: '#6B7280',
    },
    condTypeText: {
        fontSize: ms(10),
        fontFamily: interMedium,
    },
    bioFooterRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginTop: vs(12),
    },
    analyteTrendBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: primaryColor, borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(7),
    },
    analyteTrendBtnText: {
        fontFamily: interMedium, fontSize: ms(11), color: whiteColor,
    },
    condViewAll: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: ms(4),
        marginTop:ms(8)
    },
    condViewAllText: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: primaryColor,
    },
    bioCard: {
        alignSelf: 'stretch',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        padding: ms(14),
        marginTop: vs(10),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    bioCardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    bioCardLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    bioCardBadge: {
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        paddingVertical: vs(2),
    },
    bioCardBadgeText: {
        fontFamily: interMedium,
        fontSize: ms(11),
    },
    bioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        padding: ms(12),
        marginTop: vs(8),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    bioRowIcon: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    bioRowLabel: {
        flex: 1,
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    bioRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(2),
        width: ms(42),
        justifyContent: 'center',
    },
    bioRowScore: {
        fontFamily: interMedium,
        fontSize: ms(12),
    },
    bioRowBadge: {
        borderRadius: ms(12),
        paddingHorizontal: ms(10),
        paddingVertical: vs(3),
        marginLeft: ms(8),
        marginRight: ms(8),
        width: ms(82),
        alignItems: 'center',
    },
    bioRowBadgeText: {
        fontFamily: interMedium,
        fontSize: ms(11),
    },
    bioCardScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(8),
        // marginBottom: vs(6),
    },
    bioCardScore: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
    },
    bioCardArrow: {
        fontFamily: interRegular,
        fontSize: ms(14),
        color: '#9CA3AF',
    },
    bioCardDesc: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
        lineHeight: ms(18),
    },
    organGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        marginTop: vs(12),
    },
    organGridCard: {
        width: '48%',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        padding: ms(14),
        marginBottom: vs(10),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    organGridTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    organGridImage: {
        width: ms(44),
        height: ms(44),
        resizeMode: 'contain',
        marginRight: ms(8),
    },
    organGridLabel: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
    },
    organGridStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    organGridStatusLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    organGridStatusBadge: {
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: vs(4),
    },
    organGridStatusText: {
        fontFamily: interMedium,
        fontSize: ms(12),
    },

    trustmdBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(12),
        backgroundColor: primaryColor, borderRadius: ms(16),
        paddingHorizontal: ms(18), paddingVertical: vs(16),
    },
    trustmdBtnLogo: { width: ms(32), height: ms(32) },
    trustmdBtnTitle: { fontSize: ms(15), fontFamily: interMedium, color: whiteColor },
    trustmdBtnSub: { fontSize: ms(11), fontFamily: interRegular, color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },

    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        borderRadius: ms(20),
        paddingHorizontal: ms(9),
        paddingVertical: ms(4),
        gap: ms(3),
        marginRight: ms(6),
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    trendBadgeText: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: '#16A34A',
        letterSpacing: 0.3,
    },
    viewBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(2),
        backgroundColor: primaryColor,
        borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(5),
    },
    viewBtnText: {
        fontSize: ms(1), fontFamily: interMedium, color: whiteColor,
    },
});
