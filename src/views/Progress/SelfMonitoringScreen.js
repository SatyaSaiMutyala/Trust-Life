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

const MONITORING_SCORE = 86;
const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - MONITORING_SCORE / 100);

const STATS = [
    { label: 'Total Logs', value: '84', icon: 'create', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Completed', value: '72', icon: 'checkmark-circle', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Missed', value: '8', icon: 'close-circle', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Devices', value: '3', icon: 'bluetooth', color: '#7C3AED', bg: '#EDE9FE' },
];

const WEEK_DAYS = [
    { day: 'Mon', date: '3', logged: 3, total: 3 },
    { day: 'Tue', date: '4', logged: 3, total: 3 },
    { day: 'Wed', date: '5', logged: 2, total: 3 },
    { day: 'Thu', date: '6', logged: 3, total: 3 },
    { day: 'Fri', date: '7', logged: 1, total: 3 },
    { day: 'Sat', date: '8', logged: 3, total: 3 },
    { day: 'Sun', date: '9', logged: null, total: 3 },
];

const VITALS = [
    { name: 'Blood Sugar', icon: 'water', color: '#E11D48', bg: '#FCE4EC', lastReading: '112 mg/dL', frequency: 'Twice daily', logged: 12, expected: 14, status: 'On Track', statusType: 'strong' },
    { name: 'Blood Pressure', icon: 'heart', color: '#3B82F6', bg: '#DBEAFE', lastReading: '128/82 mmHg', frequency: 'Once daily', logged: 6, expected: 7, status: 'On Track', statusType: 'strong' },
    { name: 'Heart Rate', icon: 'pulse', color: '#D97706', bg: '#FEF3C7', lastReading: '74 bpm', frequency: 'Once daily', logged: 5, expected: 7, status: 'Needs Attention', statusType: 'moderate' },
    { name: 'Weight', icon: 'scale', color: '#7C3AED', bg: '#EDE9FE', lastReading: '72.5 kg', frequency: 'Weekly', logged: 3, expected: 4, status: 'On Track', statusType: 'strong' },
    { name: 'SpO2', icon: 'fitness', color: '#0891B2', bg: '#CFFAFE', lastReading: '98%', frequency: 'Once daily', logged: 4, expected: 7, status: 'Missed Often', statusType: 'poor' },
];

const DEVICES = [
    { name: 'Accu-Chek Glucometer', type: 'Blood Sugar', icon: 'water', color: '#E11D48', bg: '#FCE4EC', connected: true, lastSync: '2 hours ago' },
    { name: 'Omron BP Monitor', type: 'Blood Pressure', icon: 'heart', color: '#3B82F6', bg: '#DBEAFE', connected: true, lastSync: '5 hours ago' },
    { name: 'Mi Band 7', type: 'Heart Rate, SpO2', icon: 'watch', color: '#7C3AED', bg: '#EDE9FE', connected: false, lastSync: '2 days ago' },
];

const SelfMonitoringScreen = () => {
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
                    <Text style={styles.headerTitle}>Self Monitoring</Text>
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
                                        <SvgLinearGradient id="monGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                        fill="none" stroke="url(#monGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`}
                                        strokeDashoffset={RING_OFFSET}
                                        strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                                    />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{MONITORING_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={styles.adherenceBadge}>
                                    <Text style={styles.adherenceBadgeText}>Strong</Text>
                                </View>
                                <Text style={styles.scoreDesc}>You're logging 86% of your health metrics consistently</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>6 day streak</Text>
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

                    {/* Weekly Logging Calendar */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>This Week</Text>
                        <View style={styles.weekRow}>
                            {WEEK_DAYS.map((item, index) => {
                                const pct = item.logged !== null ? Math.round((item.logged / item.total) * 100) : 0;
                                const isToday = item.logged === null;
                                const bgColor = isToday ? '#F1F5F9' : pct === 100 ? '#DCFCE7' : pct >= 50 ? '#FEF3C7' : '#FCE4EC';
                                const borderColor = isToday ? '#E2E8F0' : pct === 100 ? '#16A34A' : pct >= 50 ? '#D97706' : '#E11D48';
                                return (
                                    <View key={index} style={styles.dayCol}>
                                        <Text style={styles.dayLabel}>{item.day}</Text>
                                        <View style={[styles.dayCircle, { backgroundColor: bgColor, borderColor }]}>
                                            {isToday ? (
                                                <Text style={styles.dayDate}>{item.date}</Text>
                                            ) : pct === 100 ? (
                                                <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color="#16A34A" />
                                            ) : (
                                                <Text style={[styles.dayCount, { color: pct >= 50 ? '#D97706' : '#E11D48' }]}>{item.logged}/{item.total}</Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Tracked Vitals */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tracked Vitals</Text>
                        {VITALS.map((item, index) => {
                            const statusColor = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                            const statusBg = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            const pct = item.expected > 0 ? Math.round((item.logged / item.expected) * 100) : 0;
                            return (
                                <View key={index} style={styles.vitalRow}>
                                    <View style={[styles.vitalIcon, { backgroundColor: item.bg }]}>
                                        <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.color} />
                                    </View>
                                    <View style={styles.vitalInfo}>
                                        <View style={styles.vitalTopRow}>
                                            <Text style={styles.vitalName}>{item.name}</Text>
                                            <View style={[styles.vitalBadge, { backgroundColor: statusBg }]}>
                                                <Text style={[styles.vitalBadgeText, { color: statusColor }]}>{item.status}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.vitalReading}>Last: {item.lastReading}  •  {item.frequency}</Text>
                                        <View style={styles.vitalBarTrack}>
                                            <View style={[styles.vitalBarFill, { width: `${pct}%`, backgroundColor: statusColor }]} />
                                        </View>
                                        <Text style={styles.vitalLogCount}>{item.logged}/{item.expected} logs this week</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Connected Devices */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Connected Devices</Text>
                        {DEVICES.map((item, index) => (
                            <View key={index} style={styles.deviceRow}>
                                <View style={[styles.deviceIcon, { backgroundColor: item.bg }]}>
                                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.color} />
                                </View>
                                <View style={styles.deviceInfo}>
                                    <Text style={styles.deviceName}>{item.name}</Text>
                                    <Text style={styles.deviceType}>{item.type}</Text>
                                    <Text style={styles.deviceSync}>Last sync: {item.lastSync}</Text>
                                </View>
                                <View style={[styles.deviceStatus, { backgroundColor: item.connected ? '#DCFCE7' : '#FCE4EC' }]}>
                                    <View style={[styles.deviceDot, { backgroundColor: item.connected ? '#16A34A' : '#E11D48' }]} />
                                    <Text style={[styles.deviceStatusText, { color: item.connected ? '#16A34A' : '#E11D48' }]}>
                                        {item.connected ? 'Connected' : 'Disconnected'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Stay Consistent</Text>
                        {[
                            { icon: 'alarm', text: 'Set daily reminders to log vitals at the same time' },
                            { icon: 'bluetooth', text: 'Keep devices synced for automatic data capture' },
                            { icon: 'trending-up', text: 'Review your trends weekly to stay motivated' },
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
        backgroundColor: '#DCFCE7', borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(4),
        alignSelf: 'flex-start', marginBottom: vs(8),
    },
    adherenceBadgeText: { fontFamily: interMedium, fontSize: ms(12), color: '#16A34A' },
    scoreDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: interMedium, fontSize: ms(12), color: '#F59E0B' },

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

    // Weekly Calendar
    weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCol: { alignItems: 'center' },
    dayLabel: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginBottom: vs(6) },
    dayCircle: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    },
    dayDate: { fontFamily: interRegular, fontSize: ms(12), color: '#9CA3AF' },
    dayCount: { fontFamily: interMedium, fontSize: ms(10) },

    // Vitals
    vitalRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        paddingVertical: vs(12), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    vitalIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12), marginTop: vs(2),
    },
    vitalInfo: { flex: 1 },
    vitalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    vitalName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    vitalBadge: { borderRadius: ms(12), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    vitalBadgeText: { fontFamily: interMedium, fontSize: ms(9) },
    vitalReading: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginBottom: vs(6) },
    vitalBarTrack: { height: vs(5), backgroundColor: '#F1F5F9', borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(4) },
    vitalBarFill: { height: '100%', borderRadius: ms(3) },
    vitalLogCount: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF' },

    // Devices
    deviceRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    deviceIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    deviceInfo: { flex: 1 },
    deviceName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    deviceType: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginTop: vs(1) },
    deviceSync: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    deviceStatus: { flexDirection: 'row', alignItems: 'center', borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(4), gap: ms(4) },
    deviceDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    deviceStatusText: { fontFamily: interMedium, fontSize: ms(10) },

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

export default SelfMonitoringScreen;
