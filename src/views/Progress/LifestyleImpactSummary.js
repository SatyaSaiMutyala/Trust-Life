import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import {
    blackColor, whiteColor, primaryColor, globalGradient2,
} from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const INFLUENCE_SCORE = { current: 18, total: 25 };

const BIGGEST_INFLUENCES = [
    { label: 'Physical activity', value: '+8', color: '#10B981', bgColor: '#DCFCE7' },
    { label: 'Sleep quality',     value: '+4', color: '#3B82F6', bgColor: '#DBEAFE' },
    { label: 'Weight gain',       value: '-5', color: '#EF4444', bgColor: '#FEE2E2' },
    { label: 'Irregular meals',   value: '-2', color: '#F59E0B', bgColor: '#FEF3C7' },
];

const DETAIL_TILES = [
    {
        id: 'activity', title: 'Activity', metric: '8,200 steps/day',
        impact: '+8', impactColor: '#10B981', trend: 'Improving',
        trendIcon: 'arrow-up', trendColor: '#10B981',
        iconName: 'walk', iconColor: '#10B981',
    },
    {
        id: 'sleep', title: 'Sleep', metric: '6.2 hours/night',
        impact: '+2', impactColor: '#3B82F6', trend: 'Stable',
        trendIcon: 'remove', trendColor: '#F59E0B',
        iconName: 'moon', iconColor: '#7B61FF',
    },
    {
        id: 'weight', title: 'Weight Trend', metric: '+3.4 kg this year',
        impact: '-5', impactColor: '#EF4444', trend: 'Increasing',
        trendIcon: 'arrow-up', trendColor: '#EF4444',
        iconName: 'scale', iconType: Icons.MaterialCommunityIcons, iconColor: '#EF4444',
    },
    {
        id: 'diet', title: 'Diet Pattern', metric: 'Irregular meal timing',
        impact: '-2', impactColor: '#F59E0B', trend: 'Needs attention',
        trendIcon: 'alert-circle', trendColor: '#F59E0B',
        iconName: 'restaurant', iconColor: '#2E7D32',
    },
];

const HABIT_LINKS = [
    { habit: 'Activity',    effect: 'Supports glucose control', color: '#10B981' },
    { habit: 'Weight gain', effect: 'Raises blood pressure',    color: '#EF4444' },
    { habit: 'Sleep',       effect: 'Supports cardiovascular health', color: '#3B82F6' },
];

const IMPROVEMENTS = [
    { icon: 'walk',      text: 'Walk 30 minutes daily' },
    { icon: 'bed',       text: 'Maintain consistent sleep schedule' },
    { icon: 'analytics', text: 'Track weight weekly' },
];

const LifestyleImpactSummary = () => {
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
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Lifestyle Influences</Text>
                        <Text style={styles.headerSubtitle}>Your daily habits affecting health progression</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Influence Score */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Influence Score</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreValue}>{INFLUENCE_SCORE.current}</Text>
                            <Text style={styles.scoreTotal}> / {INFLUENCE_SCORE.total}</Text>
                        </View>
                        <View style={styles.scoreProgressBg}>
                            <View style={[styles.scoreProgressFill, {
                                width: `${(INFLUENCE_SCORE.current / INFLUENCE_SCORE.total) * 100}%`,
                            }]} />
                        </View>
                    </View>

                    {/* Biggest Influences */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Biggest Influences</Text>
                        <View style={styles.badgesWrap}>
                            {BIGGEST_INFLUENCES.map((item, i) => (
                                <View key={i} style={[styles.badge, { backgroundColor: item.bgColor }]}>
                                    <Text style={[styles.badgeValue, { color: item.color }]}>{item.value}</Text>
                                    <Text style={[styles.badgeLabel, { color: item.color }]}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Detail Tiles */}
                    {DETAIL_TILES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.detailTile}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('LifestyleDetailScreen', { lifestyle: item })}
                        >
                            <View style={styles.tileHeader}>
                                <View style={[styles.tileIconWrap, { backgroundColor: item.iconColor + '15' }]}>
                                    <Icon type={item.iconType || Icons.Ionicons} name={item.iconName}
                                        size={ms(20)} color={item.iconColor} />
                                </View>
                                <Text style={styles.tileTitle}>{item.title}</Text>
                                <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(16)} color="#9CA3AF" />
                            </View>
                            <Text style={styles.tileMetric}>{item.metric}</Text>
                            <View style={styles.tileFooter}>
                                <View style={[styles.tileImpactBadge, {
                                    backgroundColor: item.impactColor + '15',
                                }]}>
                                    <Text style={[styles.tileImpactText, { color: item.impactColor }]}>
                                        Impact {item.impact}
                                    </Text>
                                </View>
                                <View style={styles.tileTrendRow}>
                                    <Icon type={Icons.Ionicons} name={item.trendIcon}
                                        size={ms(12)} color={item.trendColor} />
                                    <Text style={[styles.tileTrendText, { color: item.trendColor }]}>
                                        {item.trend}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* How habits influence health */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>How habits influence health</Text>
                        {HABIT_LINKS.map((link, i) => (
                            <View key={i} style={styles.habitRow}>
                                <View style={[styles.habitDot, { backgroundColor: link.color }]} />
                                <Text style={styles.habitLabel}>{link.habit}</Text>
                                <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(14)} color="#9CA3AF" />
                                <Text style={styles.habitEffect}>{link.effect}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Ways to improve */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Ways to improve your score</Text>
                        {IMPROVEMENTS.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                                <View style={styles.tipIconWrap}>
                                    <Icon type={Icons.Ionicons} name={tip.icon} size={ms(18)} color={primaryColor} />
                                </View>
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ height: vs(80) }} />
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(10), flex: 1 },
    headerTitle: { fontSize: ms(18), fontFamily: bold, color: whiteColor },
    headerSubtitle: {
        fontSize: ms(11), fontFamily: regular,
        color: 'rgba(255,255,255,0.8)', marginTop: vs(2),
    },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    cardTitle: {
        fontSize: ms(15), fontFamily: bold,
        color: blackColor, marginBottom: vs(10),
    },

    // Score
    scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: vs(8) },
    scoreValue: { fontSize: ms(32), fontFamily: bold, color: primaryColor },
    scoreTotal: { fontSize: ms(16), fontFamily: regular, color: '#9CA3AF' },
    scoreProgressBg: {
        height: vs(8), backgroundColor: '#E8E8E8',
        borderRadius: ms(4), overflow: 'hidden',
    },
    scoreProgressFill: {
        height: '100%', backgroundColor: primaryColor, borderRadius: ms(4),
    },

    // Badges
    badgesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    badge: {
        flexDirection: 'row', alignItems: 'center', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(6),
    },
    badgeValue: { fontSize: ms(13), fontFamily: bold, marginRight: ms(4) },
    badgeLabel: { fontSize: ms(12), fontFamily: regular },

    // Detail Tiles
    detailTile: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12),
    },
    tileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    tileIconWrap: {
        width: ms(36), height: ms(36), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    tileTitle: {
        flex: 1, fontSize: ms(14), fontFamily: bold,
        color: blackColor, marginLeft: ms(10),
    },
    tileMetric: {
        fontSize: ms(16), fontFamily: bold,
        color: blackColor, marginBottom: vs(10),
    },
    tileFooter: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    tileImpactBadge: {
        borderRadius: ms(12),
        paddingHorizontal: ms(10), paddingVertical: vs(4),
    },
    tileImpactText: { fontSize: ms(12), fontFamily: bold },
    tileTrendRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    tileTrendText: { fontSize: ms(12), fontFamily: regular },

    // Habit links
    habitRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), gap: ms(8),
    },
    habitDot: {
        width: ms(8), height: ms(8), borderRadius: ms(4),
    },
    habitLabel: {
        fontSize: ms(13), fontFamily: bold, color: blackColor,
        width: ms(85),
    },
    habitEffect: {
        fontSize: ms(12), fontFamily: regular, color: '#6B7280', flex: 1,
    },

    // Tips
    tipRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), gap: ms(12),
    },
    tipIconWrap: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        backgroundColor: '#ECFDF5',
        justifyContent: 'center', alignItems: 'center',
    },
    tipText: {
        fontSize: ms(13), fontFamily: regular, color: '#374151', flex: 1,
    },
});

export default LifestyleImpactSummary;
