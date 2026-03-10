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

// ── Diet Data ──
const DIET_BEHAVIOR = 'mostly_healthy'; // whole_food | mostly_healthy | mixed | poor | restricted
const FLAGGED_EATING = false; // severely restricted / disordered eating

const calculateDietScore = (behavior, flagged) => {
    if (flagged) return { score: 0, flagged: true };
    switch (behavior) {
        case 'whole_food': return { score: 92, flagged: false };    // 85–100
        case 'mostly_healthy': return { score: 72, flagged: false }; // 65–80
        case 'mixed': return { score: 50, flagged: false };          // 40–60
        case 'poor': return { score: 25, flagged: false };           // 15–35
        case 'restricted': return { score: 0, flagged: true };
        default: return { score: 50, flagged: false };
    }
};

const { score: DIET_SCORE, flagged: IS_FLAGGED } = calculateDietScore(DIET_BEHAVIOR, FLAGGED_EATING);

const getScoreStatus = (score, flagged) => {
    if (flagged) return { label: 'Flagged', color: '#7C3AED', bgColor: '#EDE9FE' };
    if (score >= 85) return { label: 'Excellent', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 65) return { label: 'Good', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 40) return { label: 'Fair', color: '#D97706', bgColor: '#FEF3C7' };
    return { label: 'Poor', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(DIET_SCORE, IS_FLAGGED);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - DIET_SCORE / 100);

const STATS = [
    { label: 'Healthy Meals', value: '18', icon: 'leaf', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Processed', value: '4', icon: 'fast-food', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Water (L/day)', value: '2.4', icon: 'water', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Meals Logged', value: '22', icon: 'create', color: '#7C3AED', bg: '#EDE9FE' },
];

const WEEK_MEALS = [
    { day: 'Mon', healthy: 3, total: 3 },
    { day: 'Tue', healthy: 3, total: 3 },
    { day: 'Wed', healthy: 2, total: 3 },
    { day: 'Thu', healthy: 3, total: 3 },
    { day: 'Fri', healthy: 1, total: 3 },
    { day: 'Sat', healthy: 3, total: 3 },
    { day: 'Sun', healthy: null, total: 3 },
];

const NUTRIENT_TRACKING = [
    { name: 'Protein', current: '68g', target: '75g', pct: 91, color: '#E11D48', bg: '#FCE4EC' },
    { name: 'Fiber', current: '22g', target: '30g', pct: 73, color: '#16A34A', bg: '#DCFCE7' },
    { name: 'Sodium', current: '1800mg', target: '<2000mg', pct: 90, color: '#D97706', bg: '#FEF3C7' },
    { name: 'Sugar', current: '32g', target: '<25g', pct: 128, color: '#DC2626', bg: '#FEE2E2' },
    { name: 'Calcium', current: '850mg', target: '1000mg', pct: 85, color: '#3B82F6', bg: '#DBEAFE' },
];

const MEAL_LOG = [
    { meal: 'Breakfast', item: 'Oats with fruits & nuts', time: '8:00 AM', quality: 'Healthy', qualityType: 'strong' },
    { meal: 'Lunch', item: 'Brown rice, dal, sabzi, salad', time: '1:00 PM', quality: 'Healthy', qualityType: 'strong' },
    { meal: 'Snack', item: 'Green tea & almonds', time: '4:30 PM', quality: 'Healthy', qualityType: 'strong' },
    { meal: 'Dinner', item: 'Roti, paneer curry, curd', time: '8:00 PM', quality: 'Moderate', qualityType: 'moderate' },
];

const CONDITION_DIET = [
    { condition: 'Diabetes (Type 2)', recommendation: 'Low glycemic foods, controlled carbs, high fiber', adherence: 'Following', adherenceType: 'strong' },
    { condition: 'Hypertension', recommendation: 'DASH diet, low sodium (<2000mg/day)', adherence: 'Partially', adherenceType: 'moderate' },
];

const IMPACT = [
    { marker: 'Blood Sugar', effect: 'Healthy diet with controlled carbs supports stable glucose levels', direction: 'improved', type: 'strong' },
    { marker: 'Blood Pressure', effect: 'Low sodium intake helps maintain healthy BP readings', direction: 'stable', type: 'strong' },
    { marker: 'Cholesterol', effect: 'High fiber and low saturated fat improve lipid profile', direction: 'improved', type: 'strong' },
    { marker: 'Weight', effect: 'Excess sugar intake may contribute to weight gain', direction: 'elevated', type: 'moderate' },
];

const BEHAVIOR_SCALE = [
    { label: 'Whole food / DASH aligned', range: '85-100', color: '#059669', active: DIET_BEHAVIOR === 'whole_food' },
    { label: 'Mostly healthy', range: '65-80', color: '#16A34A', active: DIET_BEHAVIOR === 'mostly_healthy' },
    { label: 'Mixed diet', range: '40-60', color: '#D97706', active: DIET_BEHAVIOR === 'mixed' },
    { label: 'Poor diet quality', range: '15-35', color: '#DC2626', active: DIET_BEHAVIOR === 'poor' },
    { label: 'Restricted / Disordered', range: 'Flagged', color: '#7C3AED', active: DIET_BEHAVIOR === 'restricted' || IS_FLAGGED },
];

const DietPatternScreen = () => {
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
                    <Text style={styles.headerTitle}>Diet Pattern</Text>
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
                                        <SvgLinearGradient id="dietGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor={scoreStatus.color} />
                                            <Stop offset="100%" stopColor={DIET_SCORE >= 65 ? '#34D399' : '#FBBF24'} />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE}
                                    />
                                    <Circle
                                        cx={RING_CX} cy={RING_CY} r={RING_R}
                                        fill="none" stroke="url(#dietGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`}
                                        strokeDashoffset={RING_OFFSET}
                                        strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                                    />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{IS_FLAGGED ? '!' : `${DIET_SCORE}%`}</Text>
                                    <Text style={styles.ringLabel}>{IS_FLAGGED ? 'Flagged' : 'Score'}</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>Mostly healthy diet with occasional lapses, aware of condition requirements</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>5 day healthy streak</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Dietary Behavior Scale */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Dietary Behavior Scale</Text>
                        {BEHAVIOR_SCALE.map((item, index) => (
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

                    {/* Weekly Meal Quality */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>This Week</Text>
                        <View style={styles.weekRow}>
                            {WEEK_MEALS.map((item, index) => {
                                const isToday = item.healthy === null;
                                const pct = !isToday && item.total > 0 ? Math.round((item.healthy / item.total) * 100) : 0;
                                const bgColor = isToday ? '#F1F5F9' : pct === 100 ? '#DCFCE7' : pct >= 50 ? '#FEF3C7' : '#FCE4EC';
                                const borderColor = isToday ? '#E2E8F0' : pct === 100 ? '#16A34A' : pct >= 50 ? '#D97706' : '#E11D48';
                                return (
                                    <View key={index} style={styles.dayCol}>
                                        <Text style={styles.dayLabel}>{item.day}</Text>
                                        <View style={[styles.dayCircle, { backgroundColor: bgColor, borderColor }]}>
                                            {isToday ? (
                                                <Text style={styles.dayDate}>-</Text>
                                            ) : pct === 100 ? (
                                                <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color="#16A34A" />
                                            ) : (
                                                <Text style={[styles.dayCount, { color: pct >= 50 ? '#D97706' : '#E11D48' }]}>{item.healthy}/{item.total}</Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Nutrient Tracking */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Nutrient Tracking</Text>
                        {NUTRIENT_TRACKING.map((item, index) => {
                            const isOver = item.pct > 100;
                            return (
                                <View key={index} style={styles.nutrientRow}>
                                    <View style={styles.nutrientTop}>
                                        <Text style={styles.nutrientName}>{item.name}</Text>
                                        <Text style={[styles.nutrientValue, isOver && { color: '#DC2626' }]}>
                                            {item.current} / {item.target}
                                        </Text>
                                    </View>
                                    <View style={styles.nutrientBarTrack}>
                                        <View style={[
                                            styles.nutrientBarFill,
                                            { width: `${Math.min(item.pct, 100)}%`, backgroundColor: isOver ? '#DC2626' : item.color },
                                        ]} />
                                    </View>
                                    {isOver && (
                                        <Text style={styles.nutrientWarning}>Exceeding target</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Today's Meal Log */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Today's Meals</Text>
                        {MEAL_LOG.map((item, index) => {
                            const color = item.qualityType === 'strong' ? '#16A34A' : item.qualityType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.qualityType === 'strong' ? '#DCFCE7' : item.qualityType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            const iconName = item.meal === 'Breakfast' ? 'sunny' : item.meal === 'Lunch' ? 'restaurant' : item.meal === 'Snack' ? 'cafe' : 'moon';
                            return (
                                <View key={index} style={styles.mealRow}>
                                    <View style={[styles.mealIcon, { backgroundColor: bgColor }]}>
                                        <Icon type={Icons.Ionicons} name={iconName} size={ms(18)} color={color} />
                                    </View>
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealType}>{item.meal}</Text>
                                        <Text style={styles.mealItem}>{item.item}</Text>
                                        <Text style={styles.mealTime}>{item.time}</Text>
                                    </View>
                                    <View style={[styles.mealBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.mealBadgeText, { color }]}>{item.quality}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Condition-Specific Diet */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Condition-Specific Diet</Text>
                        {CONDITION_DIET.map((item, index) => {
                            const color = item.adherenceType === 'strong' ? '#16A34A' : item.adherenceType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.adherenceType === 'strong' ? '#DCFCE7' : item.adherenceType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            return (
                                <View key={index} style={styles.condRow}>
                                    <View style={styles.condTop}>
                                        <Text style={styles.condName}>{item.condition}</Text>
                                        <View style={[styles.condBadge, { backgroundColor: bgColor }]}>
                                            <Text style={[styles.condBadgeText, { color }]}>{item.adherence}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.condRec}>{item.recommendation}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Impact on Biomarkers */}
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
                                            {item.direction === 'stable' ? 'Stable' : item.direction === 'improved' ? 'Improved' : 'Elevated'}
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
                            { icon: 'leaf', text: 'Replace processed snacks with fruits, nuts, or seeds' },
                            { icon: 'water', text: 'Drink at least 2.5L of water daily' },
                            { icon: 'time', text: 'Maintain consistent meal timings to stabilize blood sugar' },
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

    // Behavior Scale
    scaleRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(9), paddingHorizontal: ms(10),
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    scaleDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(10) },
    scaleLabel: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', flex: 1 },
    scaleRange: { fontFamily: bold, fontSize: ms(11), marginRight: ms(6) },
    scaleActiveBadge: {
        borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(2),
    },
    scaleActiveText: { fontFamily: bold, fontSize: ms(9), color: whiteColor },

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
    dayCount: { fontFamily: bold, fontSize: ms(10) },

    // Nutrient Tracking
    nutrientRow: {
        paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    nutrientTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6) },
    nutrientName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    nutrientValue: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    nutrientBarTrack: { height: vs(6), backgroundColor: '#F1F5F9', borderRadius: ms(3), overflow: 'hidden' },
    nutrientBarFill: { height: '100%', borderRadius: ms(3) },
    nutrientWarning: { fontFamily: regular, fontSize: ms(10), color: '#DC2626', marginTop: vs(3) },

    // Meal Log
    mealRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    mealIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    mealInfo: { flex: 1 },
    mealType: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    mealItem: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(1) },
    mealTime: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    mealBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    mealBadgeText: { fontFamily: bold, fontSize: ms(10) },

    // Condition Diet
    condRow: {
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    condTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    condName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    condBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    condBadgeText: { fontFamily: bold, fontSize: ms(10) },
    condRec: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(17) },

    // Impact
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    impactBadgeText: { fontFamily: bold, fontSize: ms(10) },

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

export default DietPatternScreen;
