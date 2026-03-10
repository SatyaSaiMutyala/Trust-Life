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

// ── Sleep Data ──
const AVG_SLEEP_HRS = 6.5;
const SLEEP_EFFICIENCY = 82; // percentage
const SLEEP_REGULARITY = 'mostly'; // regular | mostly | irregular | severe
const HAS_SLEEP_DISORDER = false; // OSA / severe insomnia
const FREQUENT_WAKING = false;
const BEDTIME = '11:30 PM';
const WAKE_TIME = '6:00 AM';

// ── Score Calculation ──
const calculateSleepScore = (hrs, efficiency, regularity, disorder) => {
    if (disorder) return Math.min(40, 40); // Capped at 40 until treated

    let score = 0;
    if (hrs >= 7 && hrs <= 9 && efficiency >= 85 && regularity === 'regular') {
        score = 85 + (efficiency - 85) / 15 * 15; // 85–100
    } else if (hrs >= 6 && hrs <= 7 && efficiency >= 70 && (regularity === 'regular' || regularity === 'mostly')) {
        score = 65 + (efficiency - 70) / 30 * 15; // 65–80
    } else if (hrs >= 5 && hrs <= 6) {
        score = 40 + (efficiency - 50) / 50 * 20; // 40–60
    } else if (hrs < 5 || hrs > 10) {
        score = 15 + hrs / 10 * 20; // 15–35
    } else {
        score = 65 + (efficiency - 70) / 30 * 15;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
};

const SLEEP_SCORE = calculateSleepScore(AVG_SLEEP_HRS, SLEEP_EFFICIENCY, SLEEP_REGULARITY, HAS_SLEEP_DISORDER);

const getScoreStatus = (score, disorder) => {
    if (disorder) return { label: 'Capped', color: '#7C3AED', bgColor: '#EDE9FE' };
    if (score >= 85) return { label: 'Excellent', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 65) return { label: 'Good', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 40) return { label: 'Fair', color: '#D97706', bgColor: '#FEF3C7' };
    return { label: 'Poor', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(SLEEP_SCORE, HAS_SLEEP_DISORDER);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - SLEEP_SCORE / 100);

const STATS = [
    { label: 'Avg Sleep', value: `${AVG_SLEEP_HRS}h`, icon: 'moon', color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Efficiency', value: `${SLEEP_EFFICIENCY}%`, icon: 'speedometer', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Bedtime', value: BEDTIME, icon: 'bed', color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'Wake time', value: WAKE_TIME, icon: 'sunny', color: '#D97706', bg: '#FEF3C7' },
];

const WEEK_SLEEP = [
    { day: 'Mon', hours: 7.2, quality: 'strong' },
    { day: 'Tue', hours: 6.8, quality: 'moderate' },
    { day: 'Wed', hours: 5.5, quality: 'poor' },
    { day: 'Thu', hours: 7.0, quality: 'strong' },
    { day: 'Fri', hours: 6.2, quality: 'moderate' },
    { day: 'Sat', hours: 8.0, quality: 'strong' },
    { day: 'Sun', hours: null, quality: null },
];

const SLEEP_STAGES = [
    { stage: 'Deep Sleep', duration: '1h 20m', pct: 20, color: '#4338CA', bg: '#EEF2FF' },
    { stage: 'Light Sleep', duration: '3h 10m', pct: 48, color: '#6366F1', bg: '#EEF2FF' },
    { stage: 'REM Sleep', duration: '1h 30m', pct: 23, color: '#7C3AED', bg: '#EDE9FE' },
    { stage: 'Awake', duration: '35m', pct: 9, color: '#D97706', bg: '#FEF3C7' },
];

const SLEEP_SCALE = [
    { label: '7-9hrs, efficient, regular', range: '85-100', color: '#059669', active: SLEEP_SCORE >= 85 },
    { label: '6-7hrs, mostly efficient', range: '65-80', color: '#16A34A', active: SLEEP_SCORE >= 65 && SLEEP_SCORE < 85 },
    { label: '5-6hrs, frequent waking', range: '40-60', color: '#D97706', active: SLEEP_SCORE >= 40 && SLEEP_SCORE < 65 },
    { label: '< 5hrs or > 10hrs, severe', range: '15-35', color: '#DC2626', active: SLEEP_SCORE < 40 && !HAS_SLEEP_DISORDER },
    { label: 'OSA / severe insomnia', range: 'Capped 40', color: '#7C3AED', active: HAS_SLEEP_DISORDER },
];

const IMPACT = [
    { marker: 'Blood Pressure', effect: 'Irregular sleep may elevate BP readings', direction: 'up', type: 'moderate' },
    { marker: 'Blood Sugar', effect: 'Sleep quality supports glucose regulation', direction: 'stable', type: 'strong' },
    { marker: 'Heart Rate', effect: 'Resting HR stable with adequate sleep', direction: 'stable', type: 'strong' },
];

const SleepPatternScreen = () => {
    const navigation = useNavigation();
    const maxHrs = 10;

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
                    <Text style={styles.headerTitle}>Sleep Pattern</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="sleepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor="#6366F1" />
                                            <Stop offset="100%" stopColor="#A78BFA" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE} />
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="url(#sleepGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`} strokeDashoffset={RING_OFFSET} strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`} />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{SLEEP_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>Averaging {AVG_SLEEP_HRS}hrs with {SLEEP_EFFICIENCY}% sleep efficiency</Text>
                                {HAS_SLEEP_DISORDER && (
                                    <View style={styles.disorderWarning}>
                                        <Icon type={Icons.Ionicons} name="warning" size={ms(14)} color="#7C3AED" />
                                        <Text style={styles.disorderText}>Score capped at 40 until treated</Text>
                                    </View>
                                )}
                                {!HAS_SLEEP_DISORDER && (
                                    <View style={styles.streakRow}>
                                        <Icon type={Icons.Ionicons} name="moon" size={ms(16)} color="#6366F1" />
                                        <Text style={[styles.streakText, { color: '#6366F1' }]}>4 nights 7+ hrs</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Sleep Profile Scale */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sleep Profile Scale</Text>
                        {SLEEP_SCALE.map((item, index) => (
                            <View key={index} style={[styles.scaleRow, item.active && { backgroundColor: '#F8FAFC', borderRadius: ms(10) }]}>
                                <View style={[styles.scaleDot, { backgroundColor: item.color }]} />
                                <Text style={[styles.scaleLabel, item.active && { fontFamily: bold, color: blackColor }]}>{item.label}</Text>
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

                    {/* Weekly Sleep Chart */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Weekly Sleep</Text>
                        <View style={styles.barChart}>
                            {WEEK_SLEEP.map((item, index) => {
                                const pct = item.hours !== null ? (item.hours / maxHrs) * 100 : 0;
                                const barColor = item.quality === 'strong' ? '#6366F1' : item.quality === 'moderate' ? '#A78BFA' : item.quality === 'poor' ? '#D97706' : '#E2E8F0';
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: barColor }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                        <Text style={styles.barValue}>{item.hours !== null ? `${item.hours}h` : '-'}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Sleep Stages */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sleep Stages (Last Night)</Text>
                        {SLEEP_STAGES.map((item, index) => (
                            <View key={index} style={styles.stageRow}>
                                <View style={[styles.stageIcon, { backgroundColor: item.bg }]}>
                                    <View style={[styles.stageDot, { backgroundColor: item.color }]} />
                                </View>
                                <View style={styles.stageInfo}>
                                    <View style={styles.stageTopRow}>
                                        <Text style={styles.stageName}>{item.stage}</Text>
                                        <Text style={styles.stageDuration}>{item.duration} ({item.pct}%)</Text>
                                    </View>
                                    <View style={styles.stageBarTrack}>
                                        <View style={[styles.stageBarFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Health Impact */}
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
                                            {item.direction === 'stable' ? 'Stable' : item.direction === 'up' ? 'Elevated' : 'Improved'}
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
                            { icon: 'moon', text: 'Maintain a consistent sleep schedule, even on weekends' },
                            { icon: 'phone-portrait', text: 'Avoid screens 1 hour before bedtime' },
                            { icon: 'cafe', text: 'No caffeine after 2 PM for better sleep onset' },
                        ].map((tip, index) => (
                            <View key={index} style={styles.tipRow}>
                                <View style={[styles.tipIcon, { backgroundColor: '#EEF2FF' }]}>
                                    <Icon type={Icons.Ionicons} name={tip.icon} size={ms(16)} color="#6366F1" />
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
    adherenceBadgeText: { fontFamily: bold, fontSize: ms(12) },
    scoreDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: bold, fontSize: ms(12) },
    disorderWarning: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: '#EDE9FE', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    disorderText: { fontFamily: bold, fontSize: ms(10), color: '#7C3AED' },

    // Scale
    scaleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: ms(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    scaleDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(10) },
    scaleLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', flex: 1 },
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

    // Sleep Stages
    stageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    stageIcon: { width: ms(36), height: ms(36), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    stageDot: { width: ms(12), height: ms(12), borderRadius: ms(6) },
    stageInfo: { flex: 1 },
    stageTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6) },
    stageName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    stageDuration: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    stageBarTrack: { height: vs(5), backgroundColor: '#F1F5F9', borderRadius: ms(3), overflow: 'hidden' },
    stageBarFill: { height: '100%', borderRadius: ms(3) },

    // Impact
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    impactBadgeText: { fontFamily: bold, fontSize: ms(10) },

    tipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    tipText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default SleepPatternScreen;
