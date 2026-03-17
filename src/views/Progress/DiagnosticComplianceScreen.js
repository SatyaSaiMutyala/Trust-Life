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

const COMPLIANCE_SCORE = 78;
const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - COMPLIANCE_SCORE / 100);

const TESTS = [
    { name: 'Complete Blood Count (CBC)', orderedBy: 'Dr. Sindhu', orderedDate: '15 Jan 2026', dueDate: '25 Jan 2026', status: 'Completed', statusType: 'strong', completedDate: '22 Jan 2026' },
    { name: 'HbA1c', orderedBy: 'Dr. Rakesh', orderedDate: '10 Jan 2026', dueDate: '20 Jan 2026', status: 'Completed', statusType: 'strong', completedDate: '18 Jan 2026' },
    { name: 'Lipid Profile', orderedBy: 'Dr. Sindhu', orderedDate: '1 Feb 2026', dueDate: '15 Feb 2026', status: 'Overdue', statusType: 'poor', completedDate: null },
    { name: 'Thyroid Panel (TSH)', orderedBy: 'Dr. Priya', orderedDate: '20 Feb 2026', dueDate: '5 Mar 2026', status: 'Pending', statusType: 'moderate', completedDate: null },
    { name: 'Liver Function Test', orderedBy: 'Dr. Anil', orderedDate: '25 Feb 2026', dueDate: '10 Mar 2026', status: 'Pending', statusType: 'moderate', completedDate: null },
    { name: 'Vitamin D Test', orderedBy: 'Dr. Rakesh', orderedDate: '5 Dec 2025', dueDate: '15 Dec 2025', status: 'Completed', statusType: 'strong', completedDate: '14 Dec 2025' },
];

const STATS = [
    { label: 'Total Tests', value: '14', icon: 'flask', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Completed', value: '11', icon: 'checkmark-circle', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Pending', value: '2', icon: 'time', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Overdue', value: '1', icon: 'alert-circle', color: '#E11D48', bg: '#FCE4EC' },
];

const CATEGORIES = [
    { name: 'Blood Tests', completed: 6, total: 7, icon: 'water', color: '#E11D48', bg: '#FCE4EC' },
    { name: 'Imaging', completed: 2, total: 2, icon: 'scan', color: '#7C3AED', bg: '#EDE9FE' },
    { name: 'Hormonal', completed: 2, total: 3, icon: 'fitness', color: '#D97706', bg: '#FEF3C7' },
    { name: 'Routine Checkup', completed: 1, total: 2, icon: 'clipboard', color: '#0891B2', bg: '#CFFAFE' },
];

const UPCOMING = [
    { test: 'Lipid Profile', dueDate: '15 Feb 2026', daysLeft: 'Overdue', urgent: true },
    { test: 'Thyroid Panel (TSH)', dueDate: '5 Mar 2026', daysLeft: '5 days left', urgent: false },
    { test: 'Liver Function Test', dueDate: '10 Mar 2026', daysLeft: '10 days left', urgent: false },
];

const DiagnosticComplianceScreen = () => {
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
                    <Text style={styles.headerTitle}>Diagnostic Compliance</Text>
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
                                        <SvgLinearGradient id="diagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor="#D97706" />
                                            <Stop offset="100%" stopColor="#FBBF24" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE}
                                    />
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="url(#diagGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`}
                                        strokeDashoffset={RING_OFFSET}
                                        strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                                    />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{COMPLIANCE_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={styles.adherenceBadge}>
                                    <Text style={styles.adherenceBadgeText}>Good</Text>
                                </View>
                                <Text style={styles.scoreDesc}>You've completed 78% of your recommended diagnostic tests</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="alert-circle" size={ms(16)} color="#D97706" />
                                    <Text style={[styles.streakText, { color: '#D97706' }]}>1 test overdue</Text>
                                </View>
                            </View>
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

                    {/* Upcoming / Overdue */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Upcoming & Overdue</Text>
                        {UPCOMING.map((item, index) => (
                            <View key={index} style={styles.upcomingRow}>
                                <View style={[styles.upcomingIcon, { backgroundColor: item.urgent ? '#FCE4EC' : '#FEF3C7' }]}>
                                    <Icon type={Icons.Ionicons} name={item.urgent ? 'alert-circle' : 'time'} size={ms(18)} color={item.urgent ? '#E11D48' : '#D97706'} />
                                </View>
                                <View style={styles.upcomingInfo}>
                                    <Text style={styles.upcomingName}>{item.test}</Text>
                                    <Text style={styles.upcomingDate}>Due: {item.dueDate}</Text>
                                </View>
                                <View style={[styles.upcomingBadge, { backgroundColor: item.urgent ? '#FCE4EC' : '#FEF3C7' }]}>
                                    <Text style={[styles.upcomingBadgeText, { color: item.urgent ? '#E11D48' : '#D97706' }]}>{item.daysLeft}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Test Categories */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Test Categories</Text>
                        {CATEGORIES.map((item, index) => {
                            const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
                            return (
                                <View key={index} style={styles.catRow}>
                                    <View style={[styles.catIcon, { backgroundColor: item.bg }]}>
                                        <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.color} />
                                    </View>
                                    <View style={styles.catInfo}>
                                        <View style={styles.catTopRow}>
                                            <Text style={styles.catName}>{item.name}</Text>
                                            <Text style={styles.catCount}>{item.completed}/{item.total}</Text>
                                        </View>
                                        <View style={styles.catBarTrack}>
                                            <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: pct === 100 ? '#16A34A' : item.color }]} />
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Test History */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Test History</Text>
                        {TESTS.map((item, index) => {
                            const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            const iconName = item.statusType === 'strong' ? 'checkmark-circle' : item.statusType === 'poor' ? 'alert-circle' : 'time';
                            return (
                                <View key={index} style={styles.historyRow}>
                                    <View style={[styles.historyIcon, { backgroundColor: bgColor }]}>
                                        <Icon type={Icons.Ionicons} name={iconName} size={ms(20)} color={color} />
                                    </View>
                                    <View style={styles.historyInfo}>
                                        <Text style={styles.historyName}>{item.name}</Text>
                                        <Text style={styles.historyDoctor}>Ordered by {item.orderedBy}</Text>
                                        <Text style={styles.historyDate}>
                                            {item.completedDate ? `Completed: ${item.completedDate}` : `Due: ${item.dueDate}`}
                                        </Text>
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
                        <Text style={styles.cardTitle}>Tips to Stay Compliant</Text>
                        {[
                            { icon: 'calendar', text: 'Schedule tests immediately after doctor recommends them' },
                            { icon: 'alarm', text: 'Set reminders 3 days before the due date' },
                            { icon: 'document-text', text: 'Keep a copy of all test reports in the app' },
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
    ringScore: { fontFamily: heading, fontSize: ms(22), color: blackColor },
    ringLabel: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF' },
    scoreInfo: { flex: 1, marginLeft: ms(16) },
    adherenceBadge: {
        backgroundColor: '#FEF3C7', borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(4),
        alignSelf: 'flex-start', marginBottom: vs(8),
    },
    adherenceBadgeText: { fontFamily: interMedium, fontSize: ms(12), color: '#D97706' },
    scoreDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: interMedium, fontSize: ms(12) },

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
    statValue: { fontFamily: interMedium, fontSize: ms(20), color: blackColor },
    statLabel: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

    // Card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    cardTitle: { fontFamily: heading, fontSize: ms(15), color: blackColor, marginBottom: vs(14) },

    // Upcoming
    upcomingRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    upcomingIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    upcomingInfo: { flex: 1 },
    upcomingName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    upcomingDate: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    upcomingBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    upcomingBadgeText: { fontFamily: interMedium, fontSize: ms(10) },

    // Categories
    catRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    catIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    catInfo: { flex: 1 },
    catTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6) },
    catName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    catCount: { fontFamily: interMedium, fontSize: ms(12), color: '#6B7280' },
    catBarTrack: { height: vs(6), backgroundColor: '#F1F5F9', borderRadius: ms(3), overflow: 'hidden' },
    catBarFill: { height: '100%', borderRadius: ms(3) },

    // History
    historyRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    historyIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    historyInfo: { flex: 1 },
    historyName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    historyDoctor: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginTop: vs(1) },
    historyDate: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    historyBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    historyBadgeText: { fontFamily: interMedium, fontSize: ms(11) },

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
    tipText: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default DiagnosticComplianceScreen;
