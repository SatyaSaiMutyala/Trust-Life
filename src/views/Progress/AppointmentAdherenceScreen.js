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

// ── Appointment Data ──
const TOTAL_APPOINTMENTS = 12;
const ATTENDED = 10;
const CANCELLED = 1;
const RESCHEDULED = 1;

// ── PDC Calculation (Appointment Adherence) ──
const PDC = ATTENDED / TOTAL_APPOINTMENTS; // Proportion of Days Covered
const ADHERENCE_RATE = PDC * 100;

const calculatePDCScore = (pdc) => {
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
    return Math.max(0, Math.min(100, Math.round(score)));
};

const ADHERENCE_SCORE = calculatePDCScore(PDC);

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

const APPOINTMENTS = [
    { doctor: 'Dr. Sindhu', specialty: 'Cardiologist', date: '4 Feb 2026', time: '10:30 AM', status: 'Completed', statusType: 'strong' },
    { doctor: 'Dr. Rakesh', specialty: 'General Physician', date: '18 Jan 2026', time: '2:00 PM', status: 'Completed', statusType: 'strong' },
    { doctor: 'Dr. Sumanth', specialty: 'Dermatologist', date: '5 Jan 2026', time: '11:00 AM', status: 'Cancelled', statusType: 'poor' },
    { doctor: 'Dr. Priya', specialty: 'Neurologist', date: '22 Dec 2025', time: '3:30 PM', status: 'Completed', statusType: 'strong' },
    { doctor: 'Dr. Anil', specialty: 'Orthopedic', date: '10 Dec 2025', time: '9:00 AM', status: 'Rescheduled', statusType: 'moderate' },
    { doctor: 'Dr. Sindhu', specialty: 'Cardiologist', date: '28 Nov 2025', time: '10:30 AM', status: 'Completed', statusType: 'strong' },
];

const STATS = [
    { label: 'Total', value: `${TOTAL_APPOINTMENTS}`, icon: 'calendar', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Attended', value: `${ATTENDED}`, icon: 'checkmark-circle', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Cancelled', value: `${CANCELLED}`, icon: 'close-circle', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Rescheduled', value: `${RESCHEDULED}`, icon: 'swap-horizontal', color: '#D97706', bg: '#FEF3C7' },
];

const MONTHLY = [
    { month: 'Nov', attended: 2, total: 2 },
    { month: 'Dec', attended: 1, total: 2 },
    { month: 'Jan', attended: 1, total: 2 },
    { month: 'Feb', attended: 2, total: 2 },
    { month: 'Mar', attended: 1, total: 1 },
];

const AppointmentAdherenceScreen = () => {
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
                    <Text style={styles.headerTitle}>Appointment Adherence</Text>
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
                                        <SvgLinearGradient id="adherenceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                        fill="none" stroke="url(#adherenceGrad)" strokeWidth={RING_STROKE}
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
                                <Text style={styles.scoreDesc}>You've attended {ADHERENCE_RATE.toFixed(1)}% of your scheduled appointments</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>5 appointment streak</Text>
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

                    {/* Monthly Trend */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Monthly Trend</Text>
                        <View style={styles.barChart}>
                            {MONTHLY.map((item, index) => {
                                const pct = item.total > 0 ? (item.attended / item.total) * 100 : 0;
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: pct === 100 ? '#16A34A' : '#EAB308' }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.month}</Text>
                                        <Text style={styles.barValue}>{item.attended}/{item.total}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Appointment History */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Appointment History</Text>
                        {APPOINTMENTS.map((item, index) => {
                            const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            return (
                                <View key={index} style={styles.historyRow}>
                                    <View style={styles.historyAvatar}>
                                        <Icon type={Icons.Ionicons} name="person" size={ms(22)} color="#9CA3AF" />
                                    </View>
                                    <View style={styles.historyInfo}>
                                        <Text style={styles.historyDoctor}>{item.doctor}</Text>
                                        <Text style={styles.historySpecialty}>{item.specialty}</Text>
                                        <Text style={styles.historyDate}>{item.date}  •  {item.time}</Text>
                                    </View>
                                    <View style={[styles.historyBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.historyBadgeText, { color }]}>{item.status}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Improve</Text>
                        {[
                            { icon: 'alarm', text: 'Set reminders 24 hours before appointments' },
                            { icon: 'calendar', text: 'Schedule follow-ups before leaving the clinic' },
                            { icon: 'notifications', text: 'Enable push notifications for appointment alerts' },
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

    // Bar Chart
    barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    barCol: { alignItems: 'center', flex: 1 },
    barTrack: {
        width: ms(28), height: vs(70), backgroundColor: '#F1F5F9',
        borderRadius: ms(6), justifyContent: 'flex-end', overflow: 'hidden',
    },
    barFill: { width: '100%', borderRadius: ms(6) },
    barLabel: { fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(6) },
    barValue: { fontFamily: bold, fontSize: ms(10), color: blackColor, marginTop: vs(2) },

    // History
    historyRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    historyAvatar: {
        width: ms(42), height: ms(42), borderRadius: ms(21),
        backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
        marginRight: ms(12),
    },
    historyInfo: { flex: 1 },
    historyDoctor: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    historySpecialty: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(1) },
    historyDate: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    historyBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    historyBadgeText: { fontFamily: bold, fontSize: ms(11) },

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

export default AppointmentAdherenceScreen;
