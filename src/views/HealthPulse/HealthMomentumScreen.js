import React from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Circle } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, primaryColor, whiteColor, globalGradient2} from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const WEEK_SCORES = [52, 61, 58, 67, 72, 75, 81];
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const METRICS = [
    { icon: 'footsteps', label: 'Steps Avg', value: '7,240', unit: 'steps/day', color: primaryColor, bg: primaryColor + '18', change: '+12%', up: true },
    { icon: 'medical', label: 'Med Adherence', value: '86%', unit: 'this week', color: '#1A5A8A', bg: '#E6F0FA', change: '+5%', up: true },
    { icon: 'moon', label: 'Sleep Avg', value: '7.1h', unit: 'per night', color: '#5A3F9E', bg: '#EDE8FB', change: '+0.4h', up: true },
    { icon: 'water', label: 'Blood Sugar', value: 'Stable', unit: '5 days', color: '#0891B2', bg: '#E0F2FE', change: 'Steady', up: null },
];

const MILESTONES = [
    { done: true, label: '3-day walking streak', icon: 'checkmark-circle', color: primaryColor },
    { done: true, label: 'Medication on time 5 days', icon: 'checkmark-circle', color: primaryColor },
    { done: true, label: 'Sleep target reached', icon: 'checkmark-circle', color: primaryColor },
    { done: false, label: 'Reach 7-day streak', icon: 'ellipse-outline', color: '#CCC' },
    { done: false, label: 'Achieve 85 health score', icon: 'ellipse-outline', color: '#CCC' },
];

const CHART_W = 280;
const CHART_H = 120;

const WeekChart = () => {
    const min = Math.min(...WEEK_SCORES) - 5;
    const max = Math.max(...WEEK_SCORES) + 5;
    const range = max - min;
    const pts = WEEK_SCORES.map((v, i) => ({
        x: ms(16) + (i / (WEEK_SCORES.length - 1)) * (CHART_W - ms(32)),
        y: CHART_H - ms(12) - ((v - min) / range) * (CHART_H - ms(24)),
    }));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const fill = `${line} L ${pts[pts.length - 1].x} ${CHART_H} L ${pts[0].x} ${CHART_H} Z`;
    return (
        <Svg width={CHART_W} height={CHART_H}>
            <Defs>
                <SvgGrad id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={primaryColor} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={primaryColor} stopOpacity="0.02" />
                </SvgGrad>
            </Defs>
            <Path d={fill} fill="url(#chartGrad)" />
            <Path d={line} fill="none" stroke={primaryColor} strokeWidth={ms(2)} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <Circle
                    key={i}
                    cx={p.x} cy={p.y}
                    r={i === pts.length - 1 ? ms(5) : ms(3)}
                    fill={i === pts.length - 1 ? primaryColor : whiteColor}
                    stroke={primaryColor}
                    strokeWidth={ms(1.5)}
                />
            ))}
        </Svg>
    );
};

const HealthMomentumScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Health Momentum</Text>
                        <Text style={styles.headerSub}>Your weekly progress at a glance</Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <Icon type={Icons.Ionicons} name="trending-up" size={ms(13)} color={whiteColor} />
                        <Text style={styles.headerBadgeText}> Improving</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    {/* Score banner */}
                    <View style={styles.scoreBanner}>
                        <View style={styles.scoreBannerLeft}>
                            <Text style={styles.scoreBannerLabel}>TODAY'S HEALTH SCORE</Text>
                            <Text style={styles.scoreBannerValue}>81</Text>
                            <Text style={styles.scoreBannerSub}>Up from 52 on Monday · best score this week</Text>
                        </View>
                        <View style={styles.scoreCircle}>
                            <Text style={styles.scoreCircleNum}>+29</Text>
                            <Text style={styles.scoreCircleSub}>this week</Text>
                        </View>
                    </View>

                    {/* Weekly chart card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>WEEKLY SCORE TREND</Text>
                        <View style={styles.chartWrap}>
                            <WeekChart />
                        </View>
                        <View style={styles.chartLabels}>
                            {WEEK_LABELS.map((l, i) => (
                                <Text key={i} style={[styles.chartLabel, i === 6 && { color: primaryColor, fontFamily: bold }]}>{l}</Text>
                            ))}
                        </View>
                        <View style={styles.chartScores}>
                            {WEEK_SCORES.map((v, i) => (
                                <Text key={i} style={[styles.chartScore, i === 6 && { color: primaryColor, fontFamily: bold }]}>{v}</Text>
                            ))}
                        </View>
                    </View>

                    {/* Metric cards 2×2 */}
                    <Text style={styles.sectionTitle}>KEY METRICS THIS WEEK</Text>
                    <View style={styles.metricsGrid}>
                        {METRICS.map((m, i) => (
                            <View key={i} style={styles.metricCard}>
                                <View style={[styles.metricIconWrap, { backgroundColor: m.bg }]}>
                                    <Icon type={Icons.Ionicons} name={m.icon} size={ms(18)} color={m.color} />
                                </View>
                                <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                <Text style={styles.metricLabel}>{m.label}</Text>
                                <Text style={styles.metricUnit}>{m.unit}</Text>
                                <View style={[styles.changeBadge, { backgroundColor: m.up === false ? '#FEF2F2' : m.up ? primaryColor + '18' : '#F3F4F6' }]}>
                                    {m.up !== null && (
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={m.up ? 'arrow-up' : 'arrow-down'}
                                            size={ms(9)}
                                            color={m.up ? primaryColor : '#EF4444'}
                                        />
                                    )}
                                    <Text style={[styles.changeText, { color: m.up ? primaryColor : m.up === false ? '#EF4444' : '#888' }]}>{m.change}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Milestones */}
                    <Text style={styles.sectionTitle}>MILESTONES</Text>
                    <View style={styles.card}>
                        {MILESTONES.map((m, i) => (
                            <View key={i} style={[styles.milestoneRow, i < MILESTONES.length - 1 && styles.milestoneRowBorder]}>
                                <Icon type={Icons.Ionicons} name={m.icon} size={ms(20)} color={m.color} />
                                <Text style={[styles.milestoneLabel, !m.done && styles.milestoneLabelMuted]}>{m.label}</Text>
                                {m.done && (
                                    <View style={styles.doneBadge}>
                                        <Text style={styles.doneText}>Done</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Insight box */}
                    <View style={styles.insightBox}>
                        <Icon type={Icons.Ionicons} name="bulb-outline" size={ms(18)} color={primaryColor} />
                        <Text style={styles.insightText}>
                            Your momentum is building. Maintaining consistency for 2 more days will lock in this week's progress and set a strong baseline for next week.
                        </Text>
                    </View>

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HealthMomentumScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradient: { flex: 1, paddingTop: ms(50) },

    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingBottom: ms(16),
    },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    headerCenter: { flex: 1 },
    headerTitle: { fontSize: ms(18), fontFamily: bold, color: whiteColor },
    headerSub: { fontSize: ms(11), fontFamily: regular, color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },
    headerBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: ms(4),
    },
    headerBadgeText: { fontSize: ms(11), fontFamily: bold, color: whiteColor },

    scroll: { paddingHorizontal: ms(20), paddingTop: vs(8) },

    scoreBanner: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: primaryColor + '12',
        borderRadius: ms(14), padding: ms(16),
        marginBottom: vs(14), gap: ms(12),
        borderWidth: 0.5, borderColor: primaryColor + '30',
    },
    scoreBannerLeft: { flex: 1 },
    scoreBannerLabel: { fontSize: ms(9), fontFamily: bold, color: primaryColor, letterSpacing: 1, textTransform: 'uppercase', marginBottom: vs(4) },
    scoreBannerValue: { fontSize: ms(48), fontFamily: bold, color: blackColor, lineHeight: ms(52) },
    scoreBannerSub: { fontSize: ms(11), fontFamily: regular, color: '#666', lineHeight: ms(16), marginTop: vs(4) },
    scoreCircle: {
        width: ms(68), height: ms(68), borderRadius: ms(34),
        backgroundColor: primaryColor + '18',
        justifyContent: 'center', alignItems: 'center',
    },
    scoreCircleNum: { fontSize: ms(18), fontFamily: bold, color: primaryColor },
    scoreCircleSub: { fontSize: ms(9), fontFamily: regular, color: primaryColor },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        borderWidth: 0.5, borderColor: '#E5E7EB',
        padding: ms(14), marginBottom: vs(14),
    },
    cardTitle: { fontSize: ms(9), fontFamily: bold, color: '#AAA', letterSpacing: 1, marginBottom: vs(10) },

    chartWrap: { alignItems: 'center', marginVertical: vs(4) },
    chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6) },
    chartLabel: { fontSize: ms(9.5), fontFamily: regular, color: '#888', flex: 1, textAlign: 'center' },
    chartScores: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(2) },
    chartScore: { fontSize: ms(10), fontFamily: bold, color: '#555', flex: 1, textAlign: 'center' },

    sectionTitle: { fontSize: ms(9), fontFamily: bold, color: '#AAA', letterSpacing: 1, marginBottom: vs(8) },

    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginBottom: vs(14) },
    metricCard: {
        width: '47%', backgroundColor: whiteColor,
        borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5E7EB',
        padding: ms(14), alignItems: 'flex-start',
    },
    metricIconWrap: {
        width: ms(38), height: ms(38), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center', marginBottom: vs(8),
    },
    metricValue: { fontSize: ms(20), fontFamily: bold, lineHeight: ms(24) },
    metricLabel: { fontSize: ms(11.5), fontFamily: bold, color: blackColor, marginTop: vs(2) },
    metricUnit: { fontSize: ms(10), fontFamily: regular, color: '#888', marginTop: vs(1) },
    changeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(2),
        borderRadius: ms(20), paddingHorizontal: ms(7), paddingVertical: ms(3),
        marginTop: vs(8), alignSelf: 'flex-start',
    },
    changeText: { fontSize: ms(10), fontFamily: bold },

    milestoneRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(10),
        paddingVertical: ms(10),
    },
    milestoneRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
    milestoneLabel: { flex: 1, fontSize: ms(12.5), fontFamily: regular, color: blackColor },
    milestoneLabelMuted: { color: '#AAA' },
    doneBadge: {
        backgroundColor: primaryColor + '18', borderRadius: ms(20),
        paddingHorizontal: ms(9), paddingVertical: ms(3),
    },
    doneText: { fontSize: ms(10), fontFamily: bold, color: primaryColor },

    insightBox: {
        flexDirection: 'row', alignItems: 'flex-start', gap: ms(10),
        backgroundColor: primaryColor + '0F',
        borderRadius: ms(14), padding: ms(14),
        borderWidth: 0.5, borderColor: primaryColor + '25',
        marginBottom: vs(6),
    },
    insightText: { flex: 1, fontSize: ms(12), fontFamily: regular, color: '#444', lineHeight: ms(18) },
});
