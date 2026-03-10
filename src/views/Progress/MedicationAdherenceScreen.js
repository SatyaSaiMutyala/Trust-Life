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

// ── Medication Data ──
const TOTAL_DOSES = 56;
const TAKEN_DOSES = 52;
const MISSED_DOSES = 3;
const LATE_DOSES = 1;
const DRUG_HOLIDAY_DETECTED = false; // consecutive 3+ days missed

// ── PDC Calculation ──
const PDC = TAKEN_DOSES / TOTAL_DOSES; // Proportion of Days Covered
const ADHERENCE_RATE = PDC * 100;

const calculatePDCScore = (pdc, drugHoliday) => {
    let score = 0;
    if (pdc > 0.95) {
        score = 95 + (pdc - 0.95) / 0.05 * 5; // 95–100
    } else if (pdc >= 0.90) {
        score = 85 + (pdc - 0.90) / 0.05 * 5; // 85–90
    } else if (pdc >= 0.80) {
        score = 70 + (pdc - 0.80) / 0.10 * 10; // 70–80
    } else if (pdc >= 0.70) {
        score = 50 + (pdc - 0.70) / 0.10 * 15; // 50–65
    } else {
        score = 15 + pdc / 0.70 * 30; // 15–45
    }
    if (drugHoliday) score -= 20; // Drug holiday penalty
    return Math.max(0, Math.min(100, Math.round(score)));
};

const ADHERENCE_SCORE = calculatePDCScore(PDC, DRUG_HOLIDAY_DETECTED);

const getScoreStatus = (score) => {
    if (score >= 95) return { label: 'Excellent', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 85) return { label: 'Good', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 70) return { label: 'Moderate', color: '#D97706', bgColor: '#FEF3C7' };
    if (score >= 50) return { label: 'Fair', color: '#CA8A04', bgColor: '#FEF9C3' };
    return { label: 'Poor', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(ADHERENCE_SCORE);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - ADHERENCE_SCORE / 100);

const MEDICATIONS = [
    { name: 'Metformin 500mg', dosage: 'Twice daily', time: '8:00 AM, 8:00 PM', status: 'On Track', statusType: 'strong', streak: 14 },
    { name: 'Amlodipine 5mg', dosage: 'Once daily', time: '9:00 AM', status: 'On Track', statusType: 'strong', streak: 14 },
    { name: 'Vitamin D3', dosage: 'Once daily', time: '10:00 AM', status: 'Missed Today', statusType: 'poor', streak: 0 },
    { name: 'Omega-3', dosage: 'Once daily', time: '1:00 PM', status: 'On Track', statusType: 'strong', streak: 7 },
];

const WEEK_DAYS = [
    { day: 'Mon', date: '3', taken: true },
    { day: 'Tue', date: '4', taken: true },
    { day: 'Wed', date: '5', taken: true },
    { day: 'Thu', date: '6', taken: true },
    { day: 'Fri', date: '7', taken: false },
    { day: 'Sat', date: '8', taken: true },
    { day: 'Sun', date: '9', taken: null },
];

const STATS = [
    { label: 'Total Doses', value: `${TOTAL_DOSES}`, icon: 'medkit', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Taken', value: `${TAKEN_DOSES}`, icon: 'checkmark-circle', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Missed', value: `${MISSED_DOSES}`, icon: 'close-circle', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Late', value: `${LATE_DOSES}`, icon: 'time', color: '#D97706', bg: '#FEF3C7' },
];

const IMPACT = [
    { marker: 'Blood Sugar', change: '-8%', direction: 'down', type: 'strong', desc: 'Improved since regular Metformin intake' },
    { marker: 'Blood Pressure', change: '-5%', direction: 'down', type: 'strong', desc: 'Stabilized with consistent Amlodipine use' },
];

const MedicationAdherenceScreen = () => {
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Medication Adherence</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor="#059669" />
                                            <Stop offset="100%" stopColor="#34D399" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE}
                                    />
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="url(#medGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`}
                                        strokeDashoffset={RING_OFFSET}
                                        strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                                    />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{ADHERENCE_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>You're taking {ADHERENCE_RATE.toFixed(1)}% of your medications on time</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>14 day streak</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* PDC Breakdown */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>PDC Score Breakdown</Text>
                        <View style={styles.pdcRow}>
                            <Text style={styles.pdcLabel}>Adherence Rate</Text>
                            <Text style={styles.pdcValue}>{ADHERENCE_RATE.toFixed(1)}%</Text>
                        </View>
                        <View style={styles.pdcRow}>
                            <Text style={styles.pdcLabel}>PDC (Proportion of Days Covered)</Text>
                            <Text style={styles.pdcValue}>{PDC.toFixed(2)}</Text>
                        </View>
                        <View style={styles.pdcRow}>
                            <Text style={styles.pdcLabel}>Calculated Score</Text>
                            <Text style={[styles.pdcValue, { color: scoreStatus.color, fontFamily: bold }]}>{ADHERENCE_SCORE}/100</Text>
                        </View>
                        {DRUG_HOLIDAY_DETECTED && (
                            <View style={styles.pdcWarning}>
                                <Icon type={Icons.Ionicons} name="warning" size={ms(16)} color="#E11D48" />
                                <Text style={styles.pdcWarningText}>Drug holiday detected (-20 penalty)</Text>
                            </View>
                        )}
                        <View style={styles.pdcScaleRow}>
                            {[
                                { range: '95-100', label: '>95%', color: '#059669' },
                                { range: '85-90', label: '90-95%', color: '#16A34A' },
                                { range: '70-80', label: '80-90%', color: '#D97706' },
                                { range: '50-65', label: '70-80%', color: '#CA8A04' },
                                { range: '15-45', label: '<70%', color: '#DC2626' },
                            ].map((item, index) => (
                                <View key={index} style={styles.pdcScaleItem}>
                                    <View style={[styles.pdcScaleDot, { backgroundColor: item.color }]} />
                                    <Text style={styles.pdcScaleLabel}>{item.label}</Text>
                                    <Text style={styles.pdcScaleScore}>{item.range}</Text>
                                </View>
                            ))}
                        </View>
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

                    {/* Weekly Calendar */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>This Week</Text>
                        <View style={styles.weekRow}>
                            {WEEK_DAYS.map((item, index) => (
                                <View key={index} style={styles.dayCol}>
                                    <Text style={styles.dayLabel}>{item.day}</Text>
                                    <View style={[
                                        styles.dayCircle,
                                        item.taken === true ? { backgroundColor: '#DCFCE7', borderColor: '#16A34A' } :
                                        item.taken === false ? { backgroundColor: '#FCE4EC', borderColor: '#E11D48' } :
                                        { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
                                    ]}>
                                        {item.taken === true && <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color="#16A34A" />}
                                        {item.taken === false && <Icon type={Icons.Ionicons} name="close" size={ms(14)} color="#E11D48" />}
                                        {item.taken === null && <Text style={styles.dayDate}>{item.date}</Text>}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Current Medications */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Current Medications</Text>
                        {MEDICATIONS.map((item, index) => {
                            const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            const iconBg = item.statusType === 'strong' ? '#F0FDF4' : item.statusType === 'poor' ? '#FFF1F2' : '#FFFBEB';
                            return (
                                <View key={index} style={styles.medRow}>
                                    <View style={[styles.medIcon, { backgroundColor: iconBg }]}>
                                        <Icon type={Icons.Ionicons} name="medkit" size={ms(18)} color={color} />
                                    </View>
                                    <View style={styles.medInfo}>
                                        <Text style={styles.medName}>{item.name}</Text>
                                        <Text style={styles.medDosage}>{item.dosage}  •  {item.time}</Text>
                                        {item.streak > 0 && (
                                            <View style={styles.medStreakRow}>
                                                <Icon type={Icons.Ionicons} name="flame" size={ms(12)} color="#F59E0B" />
                                                <Text style={styles.medStreakText}>{item.streak} day streak</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={[styles.medBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.medBadgeText, { color }]}>{item.status}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Health Impact */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Health Impact</Text>
                        <Text style={styles.impactSubtitle}>How your medication adherence affects your biomarkers</Text>
                        {IMPACT.map((item, index) => (
                            <View key={index} style={styles.impactRow}>
                                <View style={styles.impactLeft}>
                                    <Text style={styles.impactMarker}>{item.marker}</Text>
                                    <Text style={styles.impactDesc}>{item.desc}</Text>
                                </View>
                                <View style={styles.impactChange}>
                                    <Icon type={Icons.Ionicons} name={item.direction === 'up' ? 'arrow-up' : 'arrow-down'} size={ms(14)} color="#16A34A" />
                                    <Text style={styles.impactChangeText}>{item.change}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Stay on Track</Text>
                        {[
                            { icon: 'alarm', text: 'Set daily alarms for each medication time' },
                            { icon: 'medkit', text: 'Use a pill organizer to pre-sort weekly doses' },
                            { icon: 'refresh', text: 'Refill prescriptions 5 days before they run out' },
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

    // Score Card
    scoreCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    scoreRow: { flexDirection: 'row', alignItems: 'center' },
    ringCenter: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
    },
    ringScore: { fontFamily: bold, fontSize: ms(22), color: blackColor },
    ringLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },
    scoreInfo: { flex: 1, marginLeft: ms(16) },
    adherenceBadge: {
        backgroundColor: '#DCFCE7', borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(4),
        alignSelf: 'flex-start', marginBottom: vs(8),
    },
    adherenceBadgeText: { fontFamily: bold, fontSize: ms(12), color: '#16A34A' },
    scoreDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: bold, fontSize: ms(12), color: '#F59E0B' },

    // PDC Breakdown
    pdcRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    pdcLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', flex: 1 },
    pdcValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    pdcWarning: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        backgroundColor: '#FEE2E2', borderRadius: ms(10),
        padding: ms(10), marginTop: vs(8),
    },
    pdcWarningText: { fontFamily: bold, fontSize: ms(11), color: '#E11D48' },
    pdcScaleRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginTop: vs(14), paddingTop: vs(10), borderTopWidth: 1, borderTopColor: '#F1F5F9',
    },
    pdcScaleItem: { alignItems: 'center' },
    pdcScaleDot: { width: ms(8), height: ms(8), borderRadius: ms(4), marginBottom: vs(3) },
    pdcScaleLabel: { fontFamily: regular, fontSize: ms(9), color: '#6B7280' },
    pdcScaleScore: { fontFamily: bold, fontSize: ms(9), color: blackColor, marginTop: vs(1) },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between', marginBottom: vs(12),
    },
    statCard: {
        width: '48%', backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(14), marginBottom: vs(8), alignItems: 'center',
    },
    statIcon: {
        width: ms(40), height: ms(40), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginBottom: vs(8),
    },
    statValue: { fontFamily: bold, fontSize: ms(20), color: blackColor },
    statLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

    // Card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    cardTitle: { fontFamily: bold, fontSize: ms(15), color: blackColor, marginBottom: vs(14) },

    // Weekly Calendar
    weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCol: { alignItems: 'center' },
    dayLabel: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginBottom: vs(6) },
    dayCircle: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    },
    dayDate: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },

    // Medications
    medRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    medIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    medInfo: { flex: 1 },
    medName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    medDosage: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    medStreakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(3), marginTop: vs(3) },
    medStreakText: { fontFamily: regular, fontSize: ms(10), color: '#F59E0B' },
    medBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    medBadgeText: { fontFamily: bold, fontSize: ms(10) },

    // Impact
    impactSubtitle: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(-8), marginBottom: vs(12) },
    impactRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactChange: { flexDirection: 'row', alignItems: 'center', gap: ms(2) },
    impactChangeText: { fontFamily: bold, fontSize: ms(14), color: '#16A34A' },

    // Tips
    tipRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    tipIcon: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center',
        marginRight: ms(12),
    },
    tipText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default MedicationAdherenceScreen;
