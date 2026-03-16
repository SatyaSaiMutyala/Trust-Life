import React from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, primaryColor, whiteColor, globalGradient2} from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const DRIVERS = [
    {
        id: 1,
        icon: 'walk',
        iconColor: primaryColor,
        iconBg: primaryColor + '18',
        name: 'Walking',
        pill: '28 min',
        impact: 'High',
        impactColor: primaryColor,
        impactBg: primaryColor + '18',
        desc: 'Daily walking is the top contributor to your cardiovascular score today.',
        detail: '28 minutes of brisk walking contributes to improved circulation, reduced blood pressure, and better glucose metabolism.',
        progress: 0.65,
        goal: '45 min / day',
        week: [20, 35, 28, 40, 15, 28, 28],
        weekLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    {
        id: 2,
        icon: 'medical',
        iconColor: '#1A5A8A',
        iconBg: '#E6F0FA',
        name: 'Medication Taken',
        pill: 'On time',
        impact: 'High',
        impactColor: primaryColor,
        impactBg: primaryColor + '18',
        desc: 'Medication taken on schedule improves treatment effectiveness significantly.',
        detail: 'Taking medication on time maximises therapeutic benefit and prevents disease progression. Consistency over 5+ days also reduces side-effect risk.',
        progress: 1.0,
        goal: '1× daily',
        week: [1, 1, 0, 1, 1, 1, 1],
        weekLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        weekBinary: true,
    },
    {
        id: 3,
        icon: 'moon',
        iconColor: '#5A3F9E',
        iconBg: '#EDE8FB',
        name: 'Sleep Duration',
        pill: '7h 12m',
        impact: 'Medium',
        impactColor: '#F59E0B',
        impactBg: '#FEF3C7',
        desc: 'Quality sleep supports recovery, hormone regulation, and cognitive function.',
        detail: '7h 12m of sleep is within the healthy adult range. Maintaining 7–9 hours consistently improves metabolic stability and immune response.',
        progress: 0.86,
        goal: '8h / night',
        week: [5.5, 6.2, 6.8, 7.0, 6.5, 7.1, 7.2],
        weekLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
];

const WeekBar = ({ item }) => {
    const max = item.weekBinary ? 1 : Math.max(...item.week);
    return (
        <View style={styles.weekBarWrap}>
            {item.week.map((v, i) => (
                <View key={i} style={styles.weekBarCol}>
                    <View style={styles.weekBarTrack}>
                        <View style={[
                            styles.weekBarFill,
                            {
                                height: `${(v / max) * 100}%`,
                                backgroundColor: i === 6 ? item.iconColor : item.iconColor + '50',
                            },
                        ]} />
                    </View>
                    <Text style={styles.weekBarLabel}>{item.weekLabels[i]}</Text>
                </View>
            ))}
        </View>
    );
};

const DriverCard = ({ item }) => (
    <View style={styles.card}>
        <View style={[styles.accentBar, { backgroundColor: item.iconColor }]} />
        <View style={styles.cardInner}>
            <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(22)} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
                <View style={[styles.pillBadge, { backgroundColor: item.iconBg }]}>
                    <Text style={[styles.pillText, { color: item.iconColor }]}>{item.pill}</Text>
                </View>
            </View>

            <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, {
                        width: `${item.progress * 100}%`,
                        backgroundColor: item.iconColor,
                    }]} />
                </View>
                <Text style={styles.progressGoal}>{item.goal}</Text>
            </View>

            <View style={styles.impactRow}>
                <View style={[styles.impactBadge, { backgroundColor: item.impactBg }]}>
                    <Text style={[styles.impactText, { color: item.impactColor }]}>
                        {item.impact} Impact
                    </Text>
                </View>
                <Text style={styles.detailText}>{item.detail}</Text>
            </View>

            <View style={styles.weekSection}>
                <Text style={styles.weekTitle}>THIS WEEK</Text>
                <WeekBar item={item} />
            </View>
        </View>
    </View>
);

const TopDriversScreen = () => {
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
                        <Text style={styles.headerTitle}>Top Drivers Today</Text>
                        <Text style={styles.headerSub}>What's moving your health score</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    {/* Score banner */}
                    <View style={styles.scoreBanner}>
                        <View style={styles.scoreBannerLeft}>
                            <Text style={styles.scoreBannerLabel}>HEALTH SCORE IMPACT</Text>
                            <Text style={styles.scoreBannerValue}>+12 pts today</Text>
                            <Text style={styles.scoreBannerSub}>Driven by consistency across all 3 factors</Text>
                        </View>
                        <View style={styles.scoreBannerIcon}>
                            <Icon type={Icons.Ionicons} name="trending-up" size={ms(28)} color={primaryColor} />
                        </View>
                    </View>

                    {/* Driver cards */}
                    <View style={styles.cards}>
                        {DRIVERS.map(item => <DriverCard key={item.id} item={item} />)}
                    </View>

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default TopDriversScreen;

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
    scoreBannerValue: { fontSize: ms(22), fontFamily: bold, color: blackColor, marginBottom: vs(3) },
    scoreBannerSub: { fontSize: ms(11), fontFamily: regular, color: '#666', lineHeight: ms(15) },
    scoreBannerIcon: {
        width: ms(52), height: ms(52), borderRadius: ms(26),
        backgroundColor: primaryColor + '18',
        justifyContent: 'center', alignItems: 'center',
    },

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
        width: ms(46), height: ms(46), borderRadius: ms(13),
        justifyContent: 'center', alignItems: 'center',
    },
    cardName: { fontSize: ms(14), fontFamily: bold, color: blackColor, marginBottom: vs(3) },
    cardDesc: { fontSize: ms(11.5), fontFamily: regular, color: '#666', lineHeight: ms(16) },
    pillBadge: { borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: ms(4), alignSelf: 'flex-start' },
    pillText: { fontSize: ms(11), fontFamily: bold },

    progressRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) },
    progressTrack: {
        flex: 1, height: ms(6), backgroundColor: '#F0F0F0',
        borderRadius: ms(3), overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: ms(3) },
    progressGoal: { fontSize: ms(10), fontFamily: regular, color: '#888' },

    impactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8), marginBottom: vs(12) },
    impactBadge: { borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: ms(3), alignSelf: 'flex-start' },
    impactText: { fontSize: ms(10), fontFamily: bold },
    detailText: { flex: 1, fontSize: ms(11), fontFamily: regular, color: '#555', lineHeight: ms(16) },

    weekSection: {},
    weekTitle: { fontSize: ms(9), fontFamily: bold, color: '#AAA', letterSpacing: 1, marginBottom: vs(8) },
    weekBarWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: ms(4), height: ms(50) },
    weekBarCol: { flex: 1, alignItems: 'center', height: '100%' },
    weekBarTrack: { flex: 1, width: '70%', justifyContent: 'flex-end', marginBottom: vs(3) },
    weekBarFill: { width: '100%', borderRadius: ms(3) },
    weekBarLabel: { fontSize: ms(9), fontFamily: regular, color: '#AAA' },
});
