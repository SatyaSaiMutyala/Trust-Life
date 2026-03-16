import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, primaryColor, whiteColor, globalGradient2} from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const SIGNALS = [
    {
        id: 1,
        accent: primaryColor,
        iconBg: primaryColor + '18',
        icon: 'heart',
        name: 'Heart Health Supported',
        status: 'Good',
        statusColor: primaryColor,
        statusBg: primaryColor + '18',
        desc: "Yesterday's activity improved cardiovascular stability.",
        detail: 'Your resting heart rate is within the optimal range. Regular walking sessions over the past 5 days have contributed to improved heart rate variability and better cardiac endurance.',
        metrics: [
            { label: 'Resting HR', value: '68 bpm', color: primaryColor },
            { label: 'HRV', value: '42 ms', color: '#1A5A8A' },
            { label: 'Active days', value: '5 / 7', color: '#5A3F9E' },
        ],
        trend: [55, 60, 58, 65, 62, 68, 68],
        trendColor: primaryColor,
    },
    {
        id: 2,
        accent: '#1A5A8A',
        iconBg: '#E6F0FA',
        icon: 'water',
        name: 'Blood Sugar Stable',
        status: 'Stable',
        statusColor: '#1A5A8A',
        statusBg: '#E6F0FA',
        desc: 'Meals and medication helped maintain balance.',
        detail: 'Your blood glucose levels have remained within the healthy target range across all readings today. Consistent meal timing and medication adherence are key contributors.',
        metrics: [
            { label: 'Fasting', value: '98 mg/dL', color: '#1A5A8A' },
            { label: 'Post-meal', value: '132 mg/dL', color: primaryColor },
            { label: 'HbA1c', value: '5.8%', color: '#5A3F9E' },
        ],
        trend: [105, 98, 115, 102, 98, 101, 98],
        trendColor: '#1A5A8A',
    },
    {
        id: 3,
        accent: '#5A3F9E',
        iconBg: '#EDE8FB',
        icon: 'moon',
        name: 'Recovery Good',
        status: 'Good',
        statusColor: '#5A3F9E',
        statusBg: '#EDE8FB',
        desc: 'Sleep duration supported overnight recovery.',
        detail: 'You achieved 7h 12m of sleep last night with strong deep sleep phases. Your recovery score is above average for your age group, supporting immune function and metabolic repair.',
        metrics: [
            { label: 'Sleep', value: '7h 12m', color: '#5A3F9E' },
            { label: 'Deep sleep', value: '1h 48m', color: primaryColor },
            { label: 'Recovery', value: '82 / 100', color: '#1A5A8A' },
        ],
        trend: [5.5, 6.2, 6.8, 7.0, 6.5, 7.1, 7.2],
        trendColor: '#5A3F9E',
    },
];

const CHART_W = ms(100);
const CHART_H = vs(40);

const MiniChart = ({ data, color }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({
        x: (i / (data.length - 1)) * CHART_W,
        y: CHART_H - ((v - min) / range) * CHART_H * 0.8 - CHART_H * 0.1,
    }));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const fill = `${line} L ${pts[pts.length - 1].x} ${CHART_H} L 0 ${CHART_H} Z`;
    return (
        <Svg width={CHART_W} height={CHART_H}>
            <Defs>
                <SvgGrad id={`g${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={color} stopOpacity="0.25" />
                    <Stop offset="1" stopColor={color} stopOpacity="0.02" />
                </SvgGrad>
            </Defs>
            <Path d={fill} fill={`url(#g${color.replace('#', '')})`} />
            <Path d={line} fill="none" stroke={color} strokeWidth={ms(1.5)} strokeLinejoin="round" strokeLinecap="round" />
        </Svg>
    );
};

const SignalCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={styles.card}>
            <View style={[styles.accentBar, { backgroundColor: item.accent }]} />
            <View style={styles.cardInner}>
                <TouchableOpacity style={styles.cardTop} activeOpacity={0.8} onPress={() => setExpanded(e => !e)}>
                    <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                        <Icon type={Icons.Ionicons} name={item.icon} size={ms(20)} color={item.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.cardDesc}>{item.desc}</Text>
                    </View>
                    <View>
                        <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                            <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                        </View>
                        <Icon
                            type={Icons.Ionicons}
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={ms(14)} color="#AAA"
                            style={{ alignSelf: 'center', marginTop: vs(6) }}
                        />
                    </View>
                </TouchableOpacity>

                <View style={styles.metricsRow}>
                    {item.metrics.map((m, i) => (
                        <View key={i} style={styles.metricChip}>
                            <Text style={[styles.metricVal, { color: m.color }]}>{m.value}</Text>
                            <Text style={styles.metricLbl}>{m.label}</Text>
                        </View>
                    ))}
                    <MiniChart data={item.trend} color={item.trendColor} />
                </View>

                {expanded && (
                    <View style={[styles.detailBox, { borderTopColor: item.accent + '30' }]}>
                        <Text style={styles.detailText}>{item.detail}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const KeySignalsScreen = () => {
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
                        <Text style={styles.headerTitle}>Key Signals</Text>
                        <Text style={styles.headerSub}>Today's health indicators</Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <View style={styles.headerDot} />
                        <Text style={styles.headerBadgeText}>3 of 3</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    {/* Summary bar */}
                    <View style={styles.summaryBar}>
                        {[
                            { label: 'Good', count: 3, color: primaryColor },
                            { label: 'Warning', count: 0, color: '#F59E0B' },
                            { label: 'Critical', count: 0, color: '#EF4444' },
                        ].map((s, i) => (
                            <View key={i} style={styles.summaryItem}>
                                <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
                                <Text style={styles.summaryLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Signal cards */}
                    <View style={styles.cards}>
                        {SIGNALS.map(item => <SignalCard key={item.id} item={item} />)}
                    </View>

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default KeySignalsScreen;

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
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: ms(4),
    },
    headerDot: { width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: whiteColor },
    headerBadgeText: { fontSize: ms(11), fontFamily: bold, color: whiteColor },

    scroll: { paddingHorizontal: ms(20), paddingTop: vs(8) },

    summaryBar: {
        flexDirection: 'row', backgroundColor: whiteColor,
        borderRadius: ms(14), padding: ms(14),
        marginBottom: vs(14), gap: ms(4),
        borderWidth: 0.5, borderColor: '#E5E7EB',
    },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryCount: { fontSize: ms(22), fontFamily: bold, lineHeight: ms(26) },
    summaryLabel: { fontSize: ms(11), fontFamily: regular, color: '#888', marginTop: vs(2) },

    cards: { gap: vs(12) },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        overflow: 'hidden', flexDirection: 'row',
        borderWidth: 0.5, borderColor: '#E5E7EB',
    },
    accentBar: { width: ms(4) },
    cardInner: { flex: 1, padding: ms(14) },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(12), marginBottom: vs(12) },
    iconWrap: {
        width: ms(44), height: ms(44), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center',
    },
    cardName: { fontSize: ms(13.5), fontFamily: bold, color: blackColor, marginBottom: vs(3) },
    cardDesc: { fontSize: ms(11.5), fontFamily: regular, color: '#666', lineHeight: ms(16) },
    statusBadge: {
        borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: ms(3),
        alignSelf: 'flex-start',
    },
    statusText: { fontSize: ms(10.5), fontFamily: bold },

    metricsRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8F9FA', borderRadius: ms(10),
        padding: ms(10), gap: ms(6),
    },
    metricChip: { flex: 1, alignItems: 'center' },
    metricVal: { fontSize: ms(13), fontFamily: bold },
    metricLbl: { fontSize: ms(9.5), fontFamily: regular, color: '#888', marginTop: vs(2) },

    detailBox: { marginTop: vs(10), paddingTop: vs(10), borderTopWidth: 1 },
    detailText: { fontSize: ms(12), fontFamily: regular, color: '#555', lineHeight: ms(18) },
});
