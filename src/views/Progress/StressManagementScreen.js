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
import { heading, interMedium, interRegular } from '../../config/Constants';

// ── Stress Data ──
const PSS_SCORE = 18; // Perceived Stress Scale (0–40)
const CORTISOL_PATTERN = 'mildly_elevated'; // normal | mildly_elevated | elevated | high | chronic
const HRV_MS = 42; // Heart Rate Variability in ms
const RESTING_HR = 78; // bpm
const SLEEP_DISRUPTED = true;
const ANXIETY_REPORTED = false;
const RELAXATION_MIN_WEEK = 60; // minutes of meditation/breathing

// ── Scoring Framework ──
// PSS 0-13 = Low stress, 14-26 = Moderate, 27-40 = High
// HRV > 50ms = Good, 30-50 = Moderate, < 30 = Poor
// Score: Low stress + good HRV + no disruption = 85-100
//        Moderate stress + okay HRV = 55-75
//        High stress + low HRV = 15-45
//        Chronic/burnout = Capped at 30

const calculateStressScore = (pss, hrv, cortisol) => {
    if (cortisol === 'chronic') return Math.min(30, 30); // Capped at 30

    let pssScore = 0;
    if (pss <= 13) pssScore = 85 + (13 - pss) / 13 * 15;       // 85–100
    else if (pss <= 20) pssScore = 55 + (20 - pss) / 7 * 20;   // 55–75
    else if (pss <= 26) pssScore = 35 + (26 - pss) / 6 * 20;   // 35–55
    else pssScore = 15 + (40 - pss) / 14 * 20;                   // 15–35

    let hrvScore = 0;
    if (hrv > 50) hrvScore = 85 + (hrv - 50) / 30 * 15;
    else if (hrv >= 30) hrvScore = 50 + (hrv - 30) / 20 * 35;
    else hrvScore = 15 + hrv / 30 * 35;

    const score = Math.round(pssScore * 0.6 + hrvScore * 0.4);
    return Math.max(0, Math.min(100, score));
};

const STRESS_SCORE = calculateStressScore(PSS_SCORE, HRV_MS, CORTISOL_PATTERN);

const getScoreStatus = (score, cortisol) => {
    if (cortisol === 'chronic') return { label: 'Burnout Risk', color: '#7C3AED', bgColor: '#EDE9FE' };
    if (score >= 85) return { label: 'Low Stress', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 65) return { label: 'Manageable', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 45) return { label: 'Moderate', color: '#D97706', bgColor: '#FEF3C7' };
    if (score >= 25) return { label: 'Elevated', color: '#EA580C', bgColor: '#FFF7ED' };
    return { label: 'High Stress', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(STRESS_SCORE, CORTISOL_PATTERN);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - STRESS_SCORE / 100);

const STATS = [
    { label: 'PSS Score', value: `${PSS_SCORE}/40`, icon: 'analytics', color: '#D97706', bg: '#FEF3C7' },
    { label: 'HRV', value: `${HRV_MS}ms`, icon: 'pulse', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Resting HR', value: `${RESTING_HR}`, icon: 'heart', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Relaxation', value: `${RELAXATION_MIN_WEEK}m`, icon: 'leaf', color: '#16A34A', bg: '#DCFCE7' },
];

const STRESS_SCALE = [
    { label: 'Low stress, good HRV, no disruption', range: '85-100', color: '#059669', active: STRESS_SCORE >= 85 },
    { label: 'Manageable, mild fluctuations', range: '65-85', color: '#16A34A', active: STRESS_SCORE >= 65 && STRESS_SCORE < 85 },
    { label: 'Moderate stress, some impact', range: '45-65', color: '#D97706', active: STRESS_SCORE >= 45 && STRESS_SCORE < 65 },
    { label: 'Elevated stress, affecting health', range: '25-45', color: '#EA580C', active: STRESS_SCORE >= 25 && STRESS_SCORE < 45 },
    { label: 'High stress / burnout risk', range: '15-25', color: '#DC2626', active: STRESS_SCORE < 25 },
    { label: 'Chronic / burnout', range: 'Capped 30', color: '#7C3AED', active: CORTISOL_PATTERN === 'chronic' },
];

const WEEK_STRESS = [
    { day: 'Mon', level: 3, mood: 'calm' },
    { day: 'Tue', level: 5, mood: 'tense' },
    { day: 'Wed', level: 4, mood: 'neutral' },
    { day: 'Thu', level: 6, mood: 'stressed' },
    { day: 'Fri', level: 4, mood: 'neutral' },
    { day: 'Sat', level: 2, mood: 'relaxed' },
    { day: 'Sun', level: null, mood: null },
];

const TRIGGERS = [
    { trigger: 'Work Deadlines', frequency: 'Frequent', severity: 'High', icon: 'briefcase', color: '#DC2626', bg: '#FEE2E2' },
    { trigger: 'Sleep Disruption', frequency: 'Occasional', severity: 'Moderate', icon: 'moon', color: '#D97706', bg: '#FEF3C7' },
    { trigger: 'Financial Concerns', frequency: 'Occasional', severity: 'Moderate', icon: 'wallet', color: '#D97706', bg: '#FEF3C7' },
    { trigger: 'Health Anxiety', frequency: 'Rare', severity: 'Low', icon: 'medkit', color: '#16A34A', bg: '#DCFCE7' },
];

const BIOMARKER_IMPACT = [
    { marker: 'Blood Pressure', effect: 'Mild elevation during stress episodes', status: 'Elevated', statusType: 'moderate' },
    { marker: 'Blood Sugar', effect: 'Cortisol may raise fasting glucose', status: 'Watch', statusType: 'moderate' },
    { marker: 'Heart Rate', effect: 'Resting HR slightly above optimal', status: 'Moderate', statusType: 'moderate' },
    { marker: 'Sleep Quality', effect: 'Stress reducing deep sleep duration', status: 'Impacted', statusType: 'poor' },
];

const COPING = [
    { activity: 'Meditation', frequency: '3x/week', duration: '15 min', effective: true },
    { activity: 'Deep Breathing', frequency: '5x/week', duration: '5 min', effective: true },
    { activity: 'Walking', frequency: '4x/week', duration: '30 min', effective: true },
    { activity: 'Journaling', frequency: '1x/week', duration: '10 min', effective: false },
];

const StressManagementScreen = () => {
    const navigation = useNavigation();

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
                    <Text style={styles.headerTitle}>Stress Management</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="stressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor={scoreStatus.color} />
                                            <Stop offset="100%" stopColor="#FBBF24" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE} />
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="url(#stressGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`} strokeDashoffset={RING_OFFSET} strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`} />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{STRESS_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>PSS: {PSS_SCORE}/40 (moderate) • HRV: {HRV_MS}ms</Text>
                                {CORTISOL_PATTERN === 'chronic' && (
                                    <View style={styles.warningRow}>
                                        <Icon type={Icons.Ionicons} name="warning" size={ms(14)} color="#7C3AED" />
                                        <Text style={styles.warningText}>Score capped — seek professional support</Text>
                                    </View>
                                )}
                                {CORTISOL_PATTERN !== 'chronic' && (
                                    <View style={styles.streakRow}>
                                        <Icon type={Icons.Ionicons} name="leaf" size={ms(16)} color="#16A34A" />
                                        <Text style={[styles.streakText, { color: '#16A34A' }]}>3 relaxation sessions this week</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Stress Level Scale */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Stress Level Scale</Text>
                        {STRESS_SCALE.map((item, index) => (
                            <View key={index} style={[styles.scaleRow, item.active && { backgroundColor: '#F8FAFC', borderRadius: ms(10) }]}>
                                <View style={[styles.scaleDot, { backgroundColor: item.color }]} />
                                <Text style={[styles.scaleLabel, item.active && { fontFamily: interMedium, color: blackColor }]}>{item.label}</Text>
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

                    {/* Weekly Stress Levels */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Weekly Stress Levels</Text>
                        <View style={styles.barChart}>
                            {WEEK_STRESS.map((item, index) => {
                                const pct = item.level !== null ? (item.level / 10) * 100 : 0;
                                const barColor = item.level === null ? '#E2E8F0' : item.level <= 3 ? '#16A34A' : item.level <= 5 ? '#D97706' : '#DC2626';
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: barColor }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                        <Text style={styles.barValue}>{item.level !== null ? item.level : '-'}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.barLegend}>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} /><Text style={styles.legendText}>Low (1-3)</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#D97706' }]} /><Text style={styles.legendText}>Moderate (4-5)</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} /><Text style={styles.legendText}>High (6+)</Text></View>
                        </View>
                    </View>

                    {/* Stress Triggers */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Identified Triggers</Text>
                        {TRIGGERS.map((item, index) => (
                            <View key={index} style={styles.triggerRow}>
                                <View style={[styles.triggerIcon, { backgroundColor: item.bg }]}>
                                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.color} />
                                </View>
                                <View style={styles.triggerInfo}>
                                    <Text style={styles.triggerName}>{item.trigger}</Text>
                                    <Text style={styles.triggerFreq}>{item.frequency}</Text>
                                </View>
                                <View style={[styles.triggerBadge, { backgroundColor: item.bg }]}>
                                    <Text style={[styles.triggerBadgeText, { color: item.color }]}>{item.severity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Impact on Biomarkers */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Impact on Biomarkers</Text>
                        {BIOMARKER_IMPACT.map((item, index) => {
                            const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'moderate' ? '#D97706' : '#E11D48';
                            const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'moderate' ? '#FEF3C7' : '#FCE4EC';
                            return (
                                <View key={index} style={styles.impactRow}>
                                    <View style={styles.impactLeft}>
                                        <Text style={styles.impactMarker}>{item.marker}</Text>
                                        <Text style={styles.impactDesc}>{item.effect}</Text>
                                    </View>
                                    <View style={[styles.impactBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.impactBadgeText, { color }]}>{item.status}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Coping Activities */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Coping Activities</Text>
                        {COPING.map((item, index) => (
                            <View key={index} style={styles.copingRow}>
                                <View style={[styles.copingIcon, { backgroundColor: item.effective ? '#DCFCE7' : '#FEF3C7' }]}>
                                    <Icon type={Icons.Ionicons} name={item.effective ? 'checkmark-circle' : 'time'} size={ms(18)} color={item.effective ? '#16A34A' : '#D97706'} />
                                </View>
                                <View style={styles.copingInfo}>
                                    <Text style={styles.copingName}>{item.activity}</Text>
                                    <Text style={styles.copingDetail}>{item.frequency}  •  {item.duration}</Text>
                                </View>
                                <View style={[styles.copingBadge, { backgroundColor: item.effective ? '#DCFCE7' : '#FEF3C7' }]}>
                                    <Text style={[styles.copingBadgeText, { color: item.effective ? '#16A34A' : '#D97706' }]}>{item.effective ? 'Effective' : 'Increase'}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Reduce Stress</Text>
                        {[
                            { icon: 'leaf', text: 'Practice 10-15 minutes of daily meditation or deep breathing' },
                            { icon: 'walk', text: '30 minutes of physical activity reduces cortisol levels' },
                            { icon: 'phone-portrait', text: 'Limit screen time 1 hour before bed to improve sleep' },
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
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    scrollContent: { paddingBottom: vs(40) },

    scoreCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    scoreRow: { flexDirection: 'row', alignItems: 'center' },
    ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    ringScore: { fontFamily: interMedium, fontSize: ms(22), color: blackColor },
    ringLabel: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF' },
    scoreInfo: { flex: 1, marginLeft: ms(16) },
    adherenceBadge: { backgroundColor: '#DCFCE7', borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(4), alignSelf: 'flex-start', marginBottom: vs(8) },
    adherenceBadgeText: { fontFamily: interMedium, fontSize: ms(12) },
    scoreDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: interMedium, fontSize: ms(12) },
    warningRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: '#EDE9FE', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    warningText: { fontFamily: interMedium, fontSize: ms(10), color: '#7C3AED' },

    // Scale
    scaleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: ms(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    scaleDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(10) },
    scaleLabel: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', flex: 1 },
    scaleRange: { fontFamily: interMedium, fontSize: ms(11), marginRight: ms(6) },
    scaleActiveBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    scaleActiveText: { fontFamily: interMedium, fontSize: ms(9), color: whiteColor },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(12) },
    statCard: { width: '48%', backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(8), alignItems: 'center' },
    statIcon: { width: ms(40), height: ms(40), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) },
    statValue: { fontFamily: interMedium, fontSize: ms(20), color: blackColor },
    statLabel: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

    card: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    cardTitle: { fontFamily: heading, fontSize: ms(15), color: blackColor, marginBottom: vs(14) },

    barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    barCol: { alignItems: 'center', flex: 1 },
    barTrack: { width: ms(28), height: vs(70), backgroundColor: '#F1F5F9', borderRadius: ms(6), justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: ms(6) },
    barLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280', marginTop: vs(6) },
    barValue: { fontFamily: interMedium, fontSize: ms(10), color: blackColor, marginTop: vs(2) },
    barLegend: { flexDirection: 'row', justifyContent: 'center', gap: ms(16), marginTop: vs(12) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
    legendText: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280' },

    // Triggers
    triggerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    triggerIcon: { width: ms(42), height: ms(42), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    triggerInfo: { flex: 1 },
    triggerName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    triggerFreq: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(1) },
    triggerBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    triggerBadgeText: { fontFamily: interMedium, fontSize: ms(10) },

    // Impact
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    impactBadgeText: { fontFamily: interMedium, fontSize: ms(10) },

    // Coping
    copingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    copingIcon: { width: ms(42), height: ms(42), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    copingInfo: { flex: 1 },
    copingName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    copingDetail: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    copingBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    copingBadgeText: { fontFamily: interMedium, fontSize: ms(10) },

    tipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    tipText: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default StressManagementScreen;
