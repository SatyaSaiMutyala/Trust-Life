import React from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar3 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';

// ── Data ──────────────────────────────────────────────────────────────────────
const STORY_DATA = [
    { score: 614, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-13 Pts', isPositive: false, showArrow: true  },
    { score: 627, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-7 Pts',  isPositive: false, showArrow: false },
    { score: 634, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true  },
    { score: 640, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-12 Pts', isPositive: false, showArrow: false },
    { score: 652, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '-18 Pts', isPositive: false, showArrow: false },
    { score: 670, date: '24 Feb, 2019', condition: 'Hypothyroidism Diagnosed', doctor: 'Dr. Sarah Smith', visit: 'Routine Check', points: '+13 Pts', isPositive: true,  showArrow: true  },
];

// ── Timeline Badge (oval + right arrow) ──────────────────────────────────────
const TimelineBadge = ({ score }) => (
    <View style={styles.tlBadgeRow}>
        <View style={styles.tlOval}>
            <Text style={styles.tlOvalText}>{score}</Text>
        </View>
        <View style={styles.tlArrow} />
    </View>
);

// ── Timeline Row ─────────────────────────────────────────────────────────────
const TimelineRow = ({ item, isLast }) => (
    <View style={styles.tlRow}>
        {/* Left: badge + connector */}
        <View style={styles.tlLeft}>
            <TimelineBadge score={item.score} />
            {!isLast && <View style={styles.tlConnector} />}
        </View>

        {/* Right: white content card */}
        <View style={styles.tlCard}>
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
                            size={ms(13)}
                            color={item.isPositive ? '#10B981' : '#EF4444'}
                            style={{ marginLeft: ms(3) }}
                        />
                    )}
                </View>
            </View>
            <Text style={styles.tlDoctor}>{item.doctor} • {item.visit}</Text>
        </View>
    </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
const HealthProgressionStoryScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar3 />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Health Progression Story</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Icon type={Icons.Ionicons} name="close" size={ms(22)} color={blackColor} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Black pill header */}
                <View style={styles.pill}>
                    <Text style={styles.pillText}>Score</Text>
                    <Text style={[styles.pillText, { marginLeft: ms(50) }]}>Health Variation</Text>
                </View>

                {/* Timeline */}
                <View style={styles.timeline}>
                    {STORY_DATA.map((item, i) => (
                        <TimelineRow key={i} item={item} isLast={i === STORY_DATA.length - 1} />
                    ))}
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HealthProgressionStoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F5F8' },

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: ms(16),
        backgroundColor: '#F2F5F8',
    },
    headerTitle: { fontSize: ms(18), fontWeight: 'bold', color: blackColor },
    closeBtn: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
    },

    scroll: { paddingHorizontal: ms(16), paddingTop: vs(4) },

    // ── Pill header ───────────────────────────────────────────────────────────
    pill: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: blackColor, borderRadius: ms(30),
        paddingVertical: vs(12), paddingHorizontal: ms(22),
        marginBottom: vs(20),
    },
    pillText: { color: whiteColor, fontSize: ms(14), fontWeight: '700' },

    // ── Timeline ──────────────────────────────────────────────────────────────
    timeline: { alignSelf: 'stretch' },

    tlRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },

    tlLeft: {
        alignItems: 'center',
        width: ms(92),
        marginRight: ms(10),
    },

    // Oval badge + right-pointing arrow
    tlBadgeRow: { flexDirection: 'row', alignItems: 'center' },
    tlOval: {
        backgroundColor: primaryColor,
        borderRadius: ms(22),
        paddingHorizontal: ms(14),
        paddingVertical: vs(8),
        minWidth: ms(60),
        alignItems: 'center',
    },
    tlOvalText: { color: whiteColor, fontSize: ms(14), fontWeight: 'bold' },
    tlArrow: {
        width: 0, height: 0,
        borderTopWidth: ms(10), borderTopColor: 'transparent',
        borderBottomWidth: ms(10), borderBottomColor: 'transparent',
        borderLeftWidth: ms(12), borderLeftColor: primaryColor,
    },

    // Vertical connector
    tlConnector: {
        width: ms(2.5),
        flex: 1,
        minHeight: vs(28),
        backgroundColor: primaryColor,
    },

    // Content card
    tlCard: {
        flex: 1,
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(12),
    },
    tlDate: { fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4) },
    tlConditionRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: vs(4),
    },
    tlCondition: {
        fontSize: ms(13), fontWeight: '700', color: blackColor,
        flex: 1, marginRight: ms(8),
    },
    tlPointsRow: { flexDirection: 'row', alignItems: 'center' },
    tlPoints: { fontSize: ms(13), fontWeight: '700' },
    tlDoctor: { fontSize: ms(11), color: '#9CA3AF' },
});
