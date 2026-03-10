import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

// ── Activity Data ──
const STEPS_PER_DAY = 8200;
const MET_MIN_WEEK = 720;
const MODERATE_MIN = 180;
const VIGOROUS_MIN = 90;
const SEDENTARY_HRS = 6.5;
const STRENGTH_SESSIONS = 3;

// ── Score Calculation ──
const calculateActivityScore = (steps, metMin) => {
    let stepsScore = 0;
    if (steps > 10000) stepsScore = 90 + (steps - 10000) / 5000 * 10;
    else if (steps >= 7500) stepsScore = 70 + (steps - 7500) / 2500 * 15;
    else if (steps >= 5000) stepsScore = 50 + (steps - 5000) / 2500 * 15;
    else if (steps >= 2500) stepsScore = 30 + (steps - 2500) / 2500 * 15;
    else stepsScore = 10 + steps / 2500 * 10;

    let metScore = 0;
    if (metMin > 900) metScore = 90 + (metMin - 900) / 300 * 10;
    else if (metMin >= 600) metScore = 70 + (metMin - 600) / 300 * 15;
    else if (metMin >= 400) metScore = 50 + (metMin - 400) / 200 * 15;
    else if (metMin >= 150) metScore = 30 + (metMin - 150) / 250 * 15;
    else metScore = 10 + metMin / 150 * 10;

    const score = Math.round(stepsScore * 0.5 + metScore * 0.5);
    return Math.max(0, Math.min(100, score));
};

const ACTIVITY_SCORE = calculateActivityScore(STEPS_PER_DAY, MET_MIN_WEEK);

const getScoreStatus = (score) => {
    if (score >= 90) return { label: 'Highly Active', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 70) return { label: 'Active', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 50) return { label: 'Somewhat Active', color: '#D97706', bgColor: '#FEF3C7' };
    if (score >= 30) return { label: 'Low Active', color: '#CA8A04', bgColor: '#FEF9C3' };
    return { label: 'Sedentary', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(ACTIVITY_SCORE);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - ACTIVITY_SCORE / 100);

const STATS = [
    { label: 'Steps/Day', value: `${(STEPS_PER_DAY / 1000).toFixed(1)}K`, icon: 'footsteps', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'MET-min/wk', value: `${MET_MIN_WEEK}`, icon: 'flame', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Active Min', value: `${MODERATE_MIN + VIGOROUS_MIN}`, icon: 'timer', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Strength', value: `${STRENGTH_SESSIONS}x`, icon: 'barbell', color: '#7C3AED', bg: '#EDE9FE' },
];

const WEEK_STEPS = [
    { day: 'Mon', steps: 9200 },
    { day: 'Tue', steps: 7800 },
    { day: 'Wed', steps: 10500 },
    { day: 'Thu', steps: 8400 },
    { day: 'Fri', steps: 6200 },
    { day: 'Sat', steps: 11000 },
    { day: 'Sun', steps: null },
];

const METRICS = [
    { name: 'Steps per day', value: `${STEPS_PER_DAY.toLocaleString()}`, target: '> 8,000', tool: 'Phone pedometer', status: STEPS_PER_DAY >= 8000 ? 'strong' : STEPS_PER_DAY >= 5000 ? 'moderate' : 'poor' },
    { name: 'MET-minutes/week', value: `${MET_MIN_WEEK}`, target: '> 600', tool: 'Wearable + self-report', status: MET_MIN_WEEK >= 600 ? 'strong' : MET_MIN_WEEK >= 400 ? 'moderate' : 'poor' },
    { name: 'Moderate activity', value: `${MODERATE_MIN} min`, target: '150-300 min/wk', tool: 'Heart rate zones', status: MODERATE_MIN >= 150 ? 'strong' : MODERATE_MIN >= 75 ? 'moderate' : 'poor' },
    { name: 'Vigorous activity', value: `${VIGOROUS_MIN} min`, target: '75-150 min/wk', tool: 'Heart rate zones', status: VIGOROUS_MIN >= 75 ? 'strong' : VIGOROUS_MIN >= 30 ? 'moderate' : 'poor' },
    { name: 'Sedentary hours/day', value: `${SEDENTARY_HRS} hrs`, target: '< 8 hrs', tool: 'Accelerometer', status: SEDENTARY_HRS < 8 ? 'strong' : SEDENTARY_HRS < 10 ? 'moderate' : 'poor' },
    { name: 'Strength training', value: `${STRENGTH_SESSIONS} sessions`, target: '2+ sessions/wk', tool: 'Self-report', status: STRENGTH_SESSIONS >= 2 ? 'strong' : STRENGTH_SESSIONS >= 1 ? 'moderate' : 'poor' },
];

const IMPACT = [
    { marker: 'Blood Sugar', effect: 'Regular activity improves insulin sensitivity and glucose uptake', direction: 'improved', type: 'strong' },
    { marker: 'Blood Pressure', effect: 'Aerobic exercise helps lower resting blood pressure', direction: 'improved', type: 'strong' },
    { marker: 'Cholesterol', effect: 'Active lifestyle raises HDL and lowers LDL over time', direction: 'improved', type: 'strong' },
    { marker: 'Heart Rate', effect: 'Consistent activity lowers resting heart rate', direction: 'stable', type: 'strong' },
];

const ACTIVITY_SCALE = [
    { label: 'Highly Active', steps: '> 10,000', met: '> 900', range: '90-100', color: '#059669', active: ACTIVITY_SCORE >= 90 },
    { label: 'Active', steps: '7,500-10,000', met: '600-900', range: '70-85', color: '#16A34A', active: ACTIVITY_SCORE >= 70 && ACTIVITY_SCORE < 90 },
    { label: 'Somewhat Active', steps: '5,000-7,500', met: '400-600', range: '50-65', color: '#D97706', active: ACTIVITY_SCORE >= 50 && ACTIVITY_SCORE < 70 },
    { label: 'Low Active', steps: '2,500-5,000', met: '150-400', range: '30-45', color: '#CA8A04', active: ACTIVITY_SCORE >= 30 && ACTIVITY_SCORE < 50 },
    { label: 'Sedentary', steps: '< 2,500', met: '< 150', range: '10-20', color: '#DC2626', active: ACTIVITY_SCORE < 30 },
];

const PhysicalActivityScreen = () => {
    const navigation = useNavigation();
    const maxSteps = Math.max(...WEEK_STEPS.filter(d => d.steps !== null).map(d => d.steps), 1);

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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Physical Activity</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="actGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor={scoreStatus.color} />
                                            <Stop offset="100%" stopColor="#34D399" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE} />
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="url(#actGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`} strokeDashoffset={RING_OFFSET} strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`} />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{ACTIVITY_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>{STEPS_PER_DAY.toLocaleString()} steps/day avg with {MET_MIN_WEEK} MET-min/week</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>6 day active streak</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Activity Level Scale */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Activity Level Scale</Text>
                        {ACTIVITY_SCALE.map((item, index) => (
                            <View key={index} style={[styles.scaleRow, item.active && { backgroundColor: '#F8FAFC', borderRadius: ms(10) }]}>
                                <View style={[styles.scaleDot, { backgroundColor: item.color }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.scaleLabel, item.active && { fontFamily: bold, color: blackColor }]}>{item.label}</Text>
                                    <Text style={styles.scaleSubLabel}>{item.steps} steps  •  {item.met} MET</Text>
                                </View>
                                <Text style={[styles.scaleRange, { color: item.color }]}>{item.range}</Text>
                                {item.active && (
                                    <View style={[styles.scaleActiveBadge, { backgroundColor: item.color }]}>
                                        <Text style={styles.scaleActiveText}>You</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {STATS.map((item, index) => (
                            <View key={index} style={styles.statCard}>
                                <View style={[styles.statIcon, { backgroundColor: item.bg }]}>
                                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.color} />
                                </View>
                                <Text style={styles.statValue}>{item.value}</Text>
                                <Text style={styles.statLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Weekly Steps Chart */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Weekly Steps</Text>
                        <View style={styles.barChart}>
                            {WEEK_STEPS.map((item, index) => {
                                const pct = item.steps !== null ? (item.steps / maxSteps) * 100 : 0;
                                const isGood = item.steps !== null && item.steps >= 8000;
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: item.steps === null ? '#E2E8F0' : isGood ? '#16A34A' : '#EAB308' }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                        <Text style={styles.barValue}>{item.steps !== null ? `${(item.steps / 1000).toFixed(1)}K` : '-'}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Measurement Metrics */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Measurement Metrics</Text>
                        {METRICS.map((item, index) => {
                            const color = item.status === 'strong' ? '#16A34A' : item.status === 'moderate' ? '#D97706' : '#E11D48';
                            const bgColor = item.status === 'strong' ? '#DCFCE7' : item.status === 'moderate' ? '#FEF3C7' : '#FCE4EC';
                            const statusLabel = item.status === 'strong' ? 'On Target' : item.status === 'moderate' ? 'Near Target' : 'Below';
                            return (
                                <View key={index} style={styles.metricRow}>
                                    <View style={styles.metricInfo}>
                                        <View style={styles.metricTopRow}>
                                            <Text style={styles.metricName}>{item.name}</Text>
                                            <View style={[styles.metricBadge, { backgroundColor: bgColor }]}>
                                                <Text style={[styles.metricBadgeText, { color }]}>{statusLabel}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.metricValues}>
                                            <Text style={styles.metricCurrent}>{item.value}</Text>
                                            <Text style={styles.metricTarget}>Target: {item.target}</Text>
                                        </View>
                                        <Text style={styles.metricTool}>{item.tool}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Impact on Biomarkers */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Impact on Biomarkers</Text>
                        {IMPACT.map((item, index) => {
                            const color = item.type === 'strong' ? '#16A34A' : item.type === 'moderate' ? '#D97706' : '#E11D48';
                            const bgColor = item.type === 'strong' ? '#DCFCE7' : item.type === 'moderate' ? '#FEF3C7' : '#FCE4EC';
                            return (
                                <View key={index} style={styles.impactRow}>
                                    <View style={styles.impactLeft}>
                                        <Text style={styles.impactMarker}>{item.marker}</Text>
                                        <Text style={styles.impactDesc}>{item.effect}</Text>
                                    </View>
                                    <View style={[styles.impactBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.impactBadgeText, { color }]}>
                                            {item.direction === 'stable' ? 'Stable' : item.direction === 'improved' ? 'Improved' : 'Elevated'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Improve</Text>
                        {[
                            { icon: 'walk', text: 'Aim for 10,000+ steps daily for optimal health' },
                            { icon: 'barbell', text: 'Add 2+ strength training sessions per week' },
                            { icon: 'timer', text: 'Break up sitting time every 30 minutes' },
                        ].map((tip, index) => (
                            <View key={index} style={styles.tipRow}>
                                <View style={styles.tipIcon}>
                                    <Icon type={Icons.Ionicons} name={tip.icon} size={ms(16)} color={primaryColor} />
                                </View>
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1, paddingHorizontal: ms(14), paddingTop: ms(50) },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: ms(16) },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    scrollContent: { paddingBottom: vs(40) },

    scoreCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    scoreRow: { flexDirection: 'row', alignItems: 'center' },
    ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    ringScore: { fontFamily: bold, fontSize: ms(22), color: blackColor },
    ringLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },
    scoreInfo: { flex: 1, marginLeft: ms(16) },
    adherenceBadge: { backgroundColor: '#DCFCE7', borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(4), alignSelf: 'flex-start', marginBottom: vs(8) },
    adherenceBadgeText: { fontFamily: bold, fontSize: ms(12), color: '#16A34A' },
    scoreDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: bold, fontSize: ms(12), color: '#F59E0B' },

    // Scale
    scaleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: ms(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    scaleDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(10) },
    scaleLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },
    scaleSubLabel: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(1) },
    scaleRange: { fontFamily: bold, fontSize: ms(11), marginRight: ms(6) },
    scaleActiveBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    scaleActiveText: { fontFamily: bold, fontSize: ms(9), color: whiteColor },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(12) },
    statCard: { width: '48%', backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(8), alignItems: 'center' },
    statIcon: { width: ms(40), height: ms(40), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) },
    statValue: { fontFamily: bold, fontSize: ms(20), color: blackColor },
    statLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

    card: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    cardTitle: { fontFamily: bold, fontSize: ms(15), color: blackColor, marginBottom: vs(14) },

    barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    barCol: { alignItems: 'center', flex: 1 },
    barTrack: { width: ms(28), height: vs(70), backgroundColor: '#F1F5F9', borderRadius: ms(6), justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: ms(6) },
    barLabel: { fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(6) },
    barValue: { fontFamily: bold, fontSize: ms(10), color: blackColor, marginTop: vs(2) },

    metricRow: { paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    metricInfo: { flex: 1 },
    metricTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    metricName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    metricBadge: { borderRadius: ms(12), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    metricBadgeText: { fontFamily: bold, fontSize: ms(9) },
    metricValues: { flexDirection: 'row', alignItems: 'center', gap: ms(12), marginBottom: vs(3) },
    metricCurrent: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    metricTarget: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },
    metricTool: { fontFamily: regular, fontSize: ms(10), color: '#D1D5DB' },

    // Impact
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    impactBadgeText: { fontFamily: bold, fontSize: ms(10) },

    tipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    tipText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default PhysicalActivityScreen;
