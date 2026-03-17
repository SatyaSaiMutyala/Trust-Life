import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

// ── Activity Data ──
const STEPS_PER_DAY = 8200;
const MET_MIN_WEEK = 720;
const MODERATE_MIN = 180;
const VIGOROUS_MIN = 90;
const SEDENTARY_HRS = 6.5;
const STRENGTH_SESSIONS = 3;

// ── Score Calculation ──
const calculateActivityScore = (steps, metMin) => {
    let stepsScore = 0;
    if (steps > 10000) stepsScore = 90 + (steps - 10000) / 5000 * 10;
    else if (steps >= 7500) stepsScore = 70 + (steps - 7500) / 2500 * 15;
    else if (steps >= 5000) stepsScore = 50 + (steps - 5000) / 2500 * 15;
    else if (steps >= 2500) stepsScore = 30 + (steps - 2500) / 2500 * 15;
    else stepsScore = 10 + steps / 2500 * 10;

    let metScore = 0;
    if (metMin > 900) metScore = 90 + (metMin - 900) / 300 * 10;
    else if (metMin >= 600) metScore = 70 + (metMin - 600) / 300 * 15;
    else if (metMin >= 400) metScore = 50 + (metMin - 400) / 200 * 15;
    else if (metMin >= 150) metScore = 30 + (metMin - 150) / 250 * 15;
    else metScore = 10 + metMin / 150 * 10;

    const score = Math.round(stepsScore * 0.5 + metScore * 0.5);
    return Math.max(0, Math.min(100, score));
};

const ACTIVITY_SCORE = calculateActivityScore(STEPS_PER_DAY, MET_MIN_WEEK);

const getScoreStatus = (score) => {
    if (score >= 90) return { label: 'Highly Active', color: '#059669', bgColor: '#DCFCE7' };
    if (score >= 70) return { label: 'Active', color: '#16A34A', bgColor: '#DCFCE7' };
    if (score >= 50) return { label: 'Somewhat Active', color: '#D97706', bgColor: '#FEF3C7' };
    if (score >= 30) return { label: 'Low Active', color: '#CA8A04', bgColor: '#FEF9C3' };
    return { label: 'Sedentary', color: '#DC2626', bgColor: '#FEE2E2' };
};

const scoreStatus = getScoreStatus(ACTIVITY_SCORE);

const RING_SIZE = ms(120);
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = ms(46);
const RING_STROKE = ms(10);
const RING_CIRC = 2 * Math.PI * RING_R;
const RING_OFFSET = RING_CIRC * (1 - ACTIVITY_SCORE / 100);

const STATS = [
    { label: 'Steps/Day', value: `${(STEPS_PER_DAY / 1000).toFixed(1)}K`, icon: 'footsteps', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'MET-min/wk', value: `${MET_MIN_WEEK}`, icon: 'flame', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Active Min', value: `${MODERATE_MIN + VIGOROUS_MIN}`, icon: 'timer', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Strength', value: `${STRENGTH_SESSIONS}x`, icon: 'barbell', color: '#7C3AED', bg: '#EDE9FE' },
];

const WEEK_STEPS = [
    { day: 'Mon', steps: 9200 },
    { day: 'Tue', steps: 7800 },
    { day: 'Wed', steps: 10500 },
    { day: 'Thu', steps: 8400 },
    { day: 'Fri', steps: 6200 },
    { day: 'Sat', steps: 11000 },
    { day: 'Sun', steps: null },
];

const METRICS = [
    { name: 'Steps per day', value: `${STEPS_PER_DAY.toLocaleString()}`, target: '> 8,000', tool: 'Phone pedometer', status: STEPS_PER_DAY >= 8000 ? 'strong' : STEPS_PER_DAY >= 5000 ? 'moderate' : 'poor' },
    { name: 'MET-minutes/week', value: `${MET_MIN_WEEK}`, target: '> 600', tool: 'Wearable + self-report', status: MET_MIN_WEEK >= 600 ? 'strong' : MET_MIN_WEEK >= 400 ? 'moderate' : 'poor' },
    { name: 'Moderate activity', value: `${MODERATE_MIN} min`, target: '150-300 min/wk', tool: 'Heart rate zones', status: MODERATE_MIN >= 150 ? 'strong' : MODERATE_MIN >= 75 ? 'moderate' : 'poor' },
    { name: 'Vigorous activity', value: `${VIGOROUS_MIN} min`, target: '75-150 min/wk', tool: 'Heart rate zones', status: VIGOROUS_MIN >= 75 ? 'strong' : VIGOROUS_MIN >= 30 ? 'moderate' : 'poor' },
    { name: 'Sedentary hours/day', value: `${SEDENTARY_HRS} hrs`, target: '< 8 hrs', tool: 'Accelerometer', status: SEDENTARY_HRS < 8 ? 'strong' : SEDENTARY_HRS < 10 ? 'moderate' : 'poor' },
    { name: 'Strength training', value: `${STRENGTH_SESSIONS} sessions`, target: '2+ sessions/wk', tool: 'Self-report', status: STRENGTH_SESSIONS >= 2 ? 'strong' : STRENGTH_SESSIONS >= 1 ? 'moderate' : 'poor' },
];

const IMPACT = [
    { marker: 'Blood Sugar', effect: 'Regular activity improves insulin sensitivity and glucose uptake', direction: 'improved', type: 'strong' },
    { marker: 'Blood Pressure', effect: 'Aerobic exercise helps lower resting blood pressure', direction: 'improved', type: 'strong' },
    { marker: 'Cholesterol', effect: 'Active lifestyle raises HDL and lowers LDL over time', direction: 'improved', type: 'strong' },
    { marker: 'Heart Rate', effect: 'Consistent activity lowers resting heart rate', direction: 'stable', type: 'strong' },
];

const ACTIVITY_SCALE = [
    { label: 'Highly Active', steps: '> 10,000', met: '> 900', range: '90-100', color: '#059669', active: ACTIVITY_SCORE >= 90 },
    { label: 'Active', steps: '7,500-10,000', met: '600-900', range: '70-85', color: '#16A34A', active: ACTIVITY_SCORE >= 70 && ACTIVITY_SCORE < 90 },
    { label: 'Somewhat Active', steps: '5,000-7,500', met: '400-600', range: '50-65', color: '#D97706', active: ACTIVITY_SCORE >= 50 && ACTIVITY_SCORE < 70 },
    { label: 'Low Active', steps: '2,500-5,000', met: '150-400', range: '30-45', color: '#CA8A04', active: ACTIVITY_SCORE >= 30 && ACTIVITY_SCORE < 50 },
    { label: 'Sedentary', steps: '< 2,500', met: '< 150', range: '10-20', color: '#DC2626', active: ACTIVITY_SCORE < 30 },
];

const ACTIVITY_ORGANS = [
    {
        name: 'Heart',
        color: '#E11D48',
        icon: 'heart',
        risk: 24,
        trend: 'improving',
        stage: 'Strengthening',
        withActivity: 'Regular aerobic exercise strengthens heart muscle, lowers resting heart rate, and improves cardiac output. Your 720 MET-min/week significantly cuts cardiovascular disease risk.',
        withoutActivity: 'Without activity the heart weakens, resting rate rises, and risk of hypertension and heart failure grows progressively.',
    },
    {
        name: 'Lungs',
        color: '#3B82F6',
        icon: 'fitness',
        risk: 20,
        trend: 'improving',
        stage: 'Expanding',
        withActivity: 'Aerobic sessions expand lung capacity and oxygen exchange efficiency. You have 270 combined active minutes per week, which measurably improves VO₂ max.',
        withoutActivity: 'Sedentary lifestyle reduces lung capacity and oxygen uptake, causing increasing fatigue and breathlessness during even light tasks.',
    },
    {
        name: 'Brain',
        color: '#7C3AED',
        icon: 'bulb',
        risk: 18,
        trend: 'improving',
        stage: 'Supported',
        withActivity: 'Exercise boosts BDNF (brain-derived neurotrophic factor), sharpening memory and focus. Consistent activity reduces dementia risk by up to 30%.',
        withoutActivity: 'Inactivity accelerates cognitive decline and raises risk of depression, anxiety, and early-onset dementia.',
    },
    {
        name: 'Liver',
        color: '#D97706',
        icon: 'water',
        risk: 32,
        trend: 'stable',
        stage: 'Recovering',
        withActivity: 'Physical activity burns visceral and liver fat. Your step count is helping reduce fatty liver (NAFLD) risk and improving hepatic insulin sensitivity.',
        withoutActivity: 'Inactivity allows fat to accumulate in the liver, leading to NAFLD and elevated liver enzymes within months.',
    },
    {
        name: 'Muscles',
        color: '#F97316',
        icon: 'barbell',
        risk: 15,
        trend: 'improving',
        stage: 'Growing',
        withActivity: '3 strength sessions/week are building muscle mass, boosting metabolism, and improving glucose uptake without insulin — reducing diabetes risk.',
        withoutActivity: 'Muscle mass declines 3–5% per decade without resistance training, slowing metabolism and raising body fat percentage.',
    },
    {
        name: 'Pancreas',
        color: '#059669',
        icon: 'pulse',
        risk: 26,
        trend: 'stable',
        stage: 'Responsive',
        withActivity: 'Exercise improves insulin sensitivity, reducing the burden on the pancreas to produce excess insulin. Your MET-min level is helping prevent insulin resistance.',
        withoutActivity: 'Sedentary behavior forces the pancreas to overwork, accelerating beta-cell burnout and type 2 diabetes onset.',
    },
    {
        name: 'Bones',
        color: '#6366F1',
        icon: 'body',
        risk: 22,
        trend: 'stable',
        stage: 'Maintained',
        withActivity: 'Weight-bearing activity and strength training stimulate bone remodeling, increasing density and cutting fracture risk.',
        withoutActivity: 'Without weight-bearing exercise, bone density declines 1–2% per year after age 30, raising osteoporosis and fracture risk.',
    },
    {
        name: 'Kidneys',
        color: '#0891B2',
        icon: 'water',
        risk: 20,
        trend: 'stable',
        stage: 'Stable',
        withActivity: 'Regular activity improves blood pressure and blood flow to kidneys, protecting their filtering function and reducing CKD risk.',
        withoutActivity: 'Physical inactivity raises blood pressure and promotes metabolic syndrome, both leading causes of chronic kidney disease.',
    },
];

const ACTIVITY_BIOMARKERS = [
    {
        name: 'Resting Heart Rate',
        activity: 'Aerobic Exercise',
        value: '62', unit: 'bpm',
        normalRange: '60 – 100 bpm', targetRange: '< 70 bpm (active)',
        color: '#E11D48', status: 'normal', statusLabel: 'Optimal',
        trend: 'improving', change: '−4 bpm', fillPct: 30,
        description: 'Consistent cardio has brought your resting HR to an athletic level. Each 100 MET-min/week lowers resting heart rate by ~0.5 bpm over time.',
    },
    {
        name: 'Fasting Glucose',
        activity: 'Strength + Cardio',
        value: '94', unit: 'mg/dL',
        normalRange: '70 – 99 mg/dL', targetRange: '< 100 mg/dL',
        color: '#7C3AED', status: 'normal', statusLabel: 'Normal',
        trend: 'improving', change: '−6 mg/dL', fillPct: 32,
        description: 'Exercise increases GLUT-4 transporters in muscles, pulling glucose from blood without insulin. Your 3 strength sessions/week are the main driver.',
    },
    {
        name: 'HDL Cholesterol',
        activity: 'Aerobic Exercise',
        value: '55', unit: 'mg/dL',
        normalRange: '> 50 mg/dL', targetRange: '> 60 mg/dL (optimal)',
        color: '#16A34A', status: 'normal', statusLabel: 'Good',
        trend: 'improving', change: '+4 mg/dL', fillPct: 26,
        description: 'Aerobic activity is the most effective lifestyle lever for raising HDL. Your MET-min/week level is steadily improving this protective cholesterol.',
    },
    {
        name: 'LDL Cholesterol',
        activity: 'Aerobic Exercise',
        value: '108', unit: 'mg/dL',
        normalRange: '< 100 mg/dL', targetRange: '< 100 mg/dL',
        color: '#D97706', status: 'borderline', statusLabel: 'Borderline',
        trend: 'improving', change: '−7 mg/dL', fillPct: 60,
        description: 'Sustaining 720+ MET-min/week can bring LDL into the optimal range within 2–3 months. Combining with a low-saturated-fat diet accelerates the drop.',
    },
    {
        name: 'Triglycerides',
        activity: 'Cardio + Daily Steps',
        value: '132', unit: 'mg/dL',
        normalRange: '< 150 mg/dL', targetRange: '< 150 mg/dL',
        color: '#059669', status: 'normal', statusLabel: 'Normal',
        trend: 'improving', change: '−18 mg/dL', fillPct: 38,
        description: 'Your 8,200 daily steps are burning triglycerides stored from dietary fat. Keeping sedentary hours below 8 is critical to holding this level.',
    },
    {
        name: 'Systolic BP',
        activity: 'Aerobic Exercise',
        value: '122', unit: 'mmHg',
        normalRange: '< 120 mmHg', targetRange: '< 120 mmHg',
        color: '#0891B2', status: 'borderline', statusLabel: 'Near Normal',
        trend: 'improving', change: '−6 mmHg', fillPct: 46,
        description: 'Aerobic exercise relaxes arterial walls, lowering BP. At 180 moderate-intensity minutes/week, expect systolic to drop another 3–5 mmHg.',
    },
    {
        name: 'CRP (Inflammation)',
        activity: 'All Activity Types',
        value: '1.2', unit: 'mg/L',
        normalRange: '< 1.0 mg/L', targetRange: '< 1.0 mg/L',
        color: '#F97316', status: 'elevated', statusLabel: 'Slightly High',
        trend: 'improving', change: '−0.4 mg/L', fillPct: 54,
        description: 'Regular activity suppresses inflammatory cytokines. You are close to the < 1.0 target — adding anti-inflammatory foods will speed up the drop.',
    },
    {
        name: 'VO₂ Max',
        activity: 'Aerobic + Vigorous',
        value: '38', unit: 'mL/kg/min',
        normalRange: '> 35 (average)', targetRange: '> 42 (good)',
        color: '#3B82F6', status: 'normal', statusLabel: 'Above Average',
        trend: 'improving', change: '+2.4', fillPct: 42,
        description: 'Your 90 vigorous minutes/week are building cardiovascular efficiency. Adding interval training sessions will push VO₂ max toward the "Good" range.',
    },
];

const ACTIVITY_CLUSTERS = [
    {
        name: 'Cardiovascular',
        color: '#E11D48',
        icon: 'heart',
        score: 24,
        trend: 'improving',
        activityTypes: ['Aerobic', 'Daily Steps'],
        biomarkers: ['Resting Heart Rate', 'Systolic BP', 'VO₂ Max'],
        organs: ['Heart', 'Lungs'],
        summary: 'Your 180 moderate + 90 vigorous minutes/week are strengthening heart muscle and expanding lung capacity. Resting HR dropped 4 bpm this month.',
        risk: 'If activity drops below 150 MET-min/week, cardiovascular risk markers reverse within 6–8 weeks.',
    },
    {
        name: 'Metabolic',
        color: '#7C3AED',
        icon: 'pulse',
        score: 32,
        trend: 'improving',
        activityTypes: ['Strength Training', 'Cardio'],
        biomarkers: ['Fasting Glucose', 'Triglycerides', 'HDL Cholesterol'],
        organs: ['Pancreas', 'Liver', 'Muscles'],
        summary: '3 strength sessions/week are building GLUT-4 transporters in muscles, pulling glucose from blood without insulin and lowering triglycerides.',
        risk: 'Stopping strength training causes muscle insulin resistance to return within 2–3 weeks, spiking fasting glucose.',
    },
    {
        name: 'Musculoskeletal',
        color: '#F97316',
        icon: 'barbell',
        score: 20,
        trend: 'improving',
        activityTypes: ['Strength Training', 'Weight-Bearing Steps'],
        biomarkers: ['VO₂ Max'],
        organs: ['Muscles', 'Bones'],
        summary: 'Resistance training is increasing muscle mass and bone mineral density simultaneously. Your 3 sessions/week meets the WHO recommendation for bone health.',
        risk: 'Without weight-bearing activity, bone density declines 1–2%/year and muscle mass falls 3–5%/decade.',
    },
    {
        name: 'Anti-Inflammatory',
        color: '#0891B2',
        icon: 'shield',
        score: 42,
        trend: 'stable',
        activityTypes: ['All Activity Types'],
        biomarkers: ['CRP (Inflammation)', 'Fasting Glucose'],
        organs: ['Brain', 'Liver', 'Kidneys'],
        summary: 'Regular activity is suppressing inflammatory cytokines (IL-6, TNF-α). CRP is trending down but still slightly above target — diet can close the gap.',
        risk: 'A sedentary week can raise CRP by 0.3–0.5 mg/L. Chronic inactivity leads to systemic low-grade inflammation.',
    },
];

const ACTIVITY_ACTIONS = [
    {
        priority: 'urgent',
        label: 'Urgent',
        color: '#E11D48',
        bg: '#FEE2E2',
        icon: 'warning',
        items: [
            { title: 'Break Up Sitting — Now', desc: 'You have been sedentary for too long. Stand up, stretch, or walk for 5 minutes to reset your metabolic clock.', icon: 'walk' },
        ],
    },
    {
        priority: 'today',
        label: 'Today',
        color: '#D97706',
        bg: '#FEF3C7',
        icon: 'today',
        items: [
            { title: 'Hit 10,000 Steps Today', desc: 'You are averaging 8,200 steps/day. Push for 10,000 today — a 30-minute brisk walk adds ~3,500 steps.', icon: 'footsteps' },
            { title: 'Evening Mobility Routine', desc: 'Add 10–15 minutes of stretching or yoga after your activity to reduce soreness and improve flexibility.', icon: 'body' },
        ],
    },
    {
        priority: 'week',
        label: 'This Week',
        color: '#0891B2',
        bg: '#E0F7FA',
        icon: 'calendar',
        items: [
            { title: 'Add an Interval Training Session', desc: 'One HIIT session (20 min) this week will boost VO₂ max and push your MET-min/week above 800 — the "Good" threshold.', icon: 'timer' },
            { title: 'Reduce Sedentary Hours to < 6 hrs', desc: 'Your current 6.5 hrs/day is borderline. Use a standing desk or walk during calls to bring this below the 6 hr mark.', icon: 'time' },
            { title: 'Log Strength Session Nutrition', desc: 'Consume 20–30g protein within 30 minutes after strength training to maximize muscle protein synthesis.', icon: 'nutrition' },
        ],
    },
    {
        priority: 'month',
        label: 'This Month',
        color: primaryColor,
        bg: primaryColor + '12',
        icon: 'clipboard',
        items: [
            { title: 'VO₂ Max Field Test', desc: 'Do a 12-minute Cooper run test or use your wearable to estimate VO₂ max. Target: move from 38 to 40+ mL/kg/min.', icon: 'analytics' },
            { title: 'Increase Step Goal to 9,500', desc: 'Gradually increase your daily step target by 1,000 steps every 2 weeks to avoid injury and sustain the habit.', icon: 'trending-up' },
            { title: 'Sports Medicine Check-in', desc: 'Schedule a check-in to assess joint health, mobility, and ensure your training plan matches your long-term goals.', icon: 'medical' },
        ],
    },
];

const ACTIVITY_CARE = {
    goals: [
        { label: 'Daily Steps', target: '> 10,000', current: '8,200', color: '#3B82F6', met: false },
        { label: 'MET-min / Week', target: '> 800', current: '720', color: '#E11D48', met: false },
        { label: 'Sedentary Hours', target: '< 6 hrs', current: '6.5 hrs', color: '#D97706', met: false },
        { label: 'Strength Sessions', target: '3+ / week', current: '3x', color: '#7C3AED', met: true },
        { label: 'Active Minutes', target: '> 300 min', current: '270 min', color: '#16A34A', met: false },
        { label: 'Activity Score', target: '> 80', current: `${ACTIVITY_SCORE}`, color: primaryColor, met: ACTIVITY_SCORE >= 80 },
    ],
    appointments: [
        { title: 'Annual Fitness Assessment', date: 'Apr 10, 2026', type: 'Fitness Test', icon: 'barbell', color: '#3B82F6' },
        { title: 'Primary Care — Annual Check', date: 'Apr 18, 2026', type: 'General Check', icon: 'person', color: primaryColor },
        { title: 'Sports Medicine Consult', date: 'Apr 28, 2026', type: 'Specialist', icon: 'medical', color: '#F97316' },
    ],
    team: [
        { name: 'Dr. Alex Carter', role: 'Sports Medicine', icon: 'person-circle', color: '#F97316' },
        { name: 'Maya Singh', role: 'Physiotherapist', icon: 'person-circle', color: '#7C3AED' },
        { name: 'Dr. Sam Patel', role: 'Primary Care', icon: 'person-circle', color: primaryColor },
    ],
    tips: [
        { icon: 'walk', text: 'Take stairs instead of elevators and park farther away — these micro-steps add up to 1,000+ extra steps daily.' },
        { icon: 'nutrition', text: 'Fuel workouts with complex carbs 1–2 hours before and repair muscles with 20–30g protein within 30 min after.' },
        { icon: 'moon', text: 'Sleep 7–9 hours nightly. Growth hormone released during deep sleep is essential for muscle recovery and fat burning.' },
        { icon: 'water', text: 'Drink 500ml of water before exercise and replace 500ml for every 30 minutes of vigorous activity to maintain performance.' },
    ],
};

const TABS = [
    { key: 'insight',    label: 'Insight',    icon: 'bulb' },
    { key: 'organs',     label: 'Organs',     icon: 'body' },
    { key: 'biomarkers', label: 'Biomarkers', icon: 'analytics' },
    { key: 'cluster',    label: 'Cluster',    icon: 'git-network' },
    { key: 'actions',    label: 'Actions',    icon: 'checkmark-circle' },
    { key: 'care',       label: 'Care',       icon: 'medical' },
];

const PhysicalActivityScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('insight');
    const maxSteps = Math.max(...WEEK_STEPS.filter(d => d.steps !== null).map(d => d.steps), 1);

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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Physical Activity</Text>
                </View>

                {/* Tab Bar */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabScroll}
                    contentContainerStyle={styles.tabRow}
                >
                    {TABS.map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(12)}
                                color={activeTab === tab.key ? primaryColor : '#9CA3AF'} />
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                {activeTab === 'insight' && <>
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="actGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <Stop offset="0%" stopColor={scoreStatus.color} />
                                            <Stop offset="100%" stopColor="#34D399" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="#F1F5F9" strokeWidth={RING_STROKE} />
                                    <Circle cx={RING_CX} cy={RING_CY} r={RING_R} fill="none" stroke="url(#actGrad)" strokeWidth={RING_STROKE}
                                        strokeDasharray={`${RING_CIRC}`} strokeDashoffset={RING_OFFSET} strokeLinecap="round"
                                        transform={`rotate(-90, ${RING_CX}, ${RING_CY})`} />
                                </Svg>
                                <View style={styles.ringCenter}>
                                    <Text style={styles.ringScore}>{ACTIVITY_SCORE}%</Text>
                                    <Text style={styles.ringLabel}>Score</Text>
                                </View>
                            </View>
                            <View style={styles.scoreInfo}>
                                <View style={[styles.adherenceBadge, { backgroundColor: scoreStatus.bgColor }]}>
                                    <Text style={[styles.adherenceBadgeText, { color: scoreStatus.color }]}>{scoreStatus.label}</Text>
                                </View>
                                <Text style={styles.scoreDesc}>{STEPS_PER_DAY.toLocaleString()} steps/day avg with {MET_MIN_WEEK} MET-min/week</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>6 day active streak</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Activity Level Scale */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Activity Level Scale</Text>
                        {ACTIVITY_SCALE.map((item, index) => (
                            <View key={index} style={[styles.scaleRow, item.active && { backgroundColor: '#F8FAFC', borderRadius: ms(10) }]}>
                                <View style={[styles.scaleDot, { backgroundColor: item.color }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.scaleLabel, item.active && { fontFamily: interMedium, color: blackColor }]}>{item.label}</Text>
                                    <Text style={styles.scaleSubLabel}>{item.steps} steps  •  {item.met} MET</Text>
                                </View>
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

                    {/* Weekly Steps Chart */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Weekly Steps</Text>
                        <View style={styles.barChart}>
                            {WEEK_STEPS.map((item, index) => {
                                const pct = item.steps !== null ? (item.steps / maxSteps) * 100 : 0;
                                const isGood = item.steps !== null && item.steps >= 8000;
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[styles.barFill, { height: `${pct}%`, backgroundColor: item.steps === null ? '#E2E8F0' : isGood ? '#16A34A' : '#EAB308' }]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                        <Text style={styles.barValue}>{item.steps !== null ? `${(item.steps / 1000).toFixed(1)}K` : '-'}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Measurement Metrics */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Measurement Metrics</Text>
                        {METRICS.map((item, index) => {
                            const color = item.status === 'strong' ? '#16A34A' : item.status === 'moderate' ? '#D97706' : '#E11D48';
                            const bgColor = item.status === 'strong' ? '#DCFCE7' : item.status === 'moderate' ? '#FEF3C7' : '#FCE4EC';
                            const statusLabel = item.status === 'strong' ? 'On Target' : item.status === 'moderate' ? 'Near Target' : 'Below';
                            return (
                                <View key={index} style={styles.metricRow}>
                                    <View style={styles.metricInfo}>
                                        <View style={styles.metricTopRow}>
                                            <Text style={styles.metricName}>{item.name}</Text>
                                            <View style={[styles.metricBadge, { backgroundColor: bgColor }]}>
                                                <Text style={[styles.metricBadgeText, { color }]}>{statusLabel}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.metricValues}>
                                            <Text style={styles.metricCurrent}>{item.value}</Text>
                                            <Text style={styles.metricTarget}>Target: {item.target}</Text>
                                        </View>
                                        <Text style={styles.metricTool}>{item.tool}</Text>
                                    </View>
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
                            { icon: 'walk', text: 'Aim for 10,000+ steps daily for optimal health' },
                            { icon: 'barbell', text: 'Add 2+ strength training sessions per week' },
                            { icon: 'timer', text: 'Break up sitting time every 30 minutes' },
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
                    </>}

                    {activeTab === 'organs' && <>
                        {/* Summary banner */}
                        <View style={styles.organBanner}>
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#16A34A' }]}>
                                    {ACTIVITY_ORGANS.filter(o => o.trend === 'improving').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Improving</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: primaryColor }]}>
                                    {ACTIVITY_ORGANS.filter(o => o.trend === 'stable').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Stable</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#6B7280' }]}>
                                    {ACTIVITY_ORGANS.length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Total</Text>
                            </View>
                        </View>

                        {/* Mini card grid */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Organ Health Status</Text>
                            <View style={styles.organGrid}>
                                {ACTIVITY_ORGANS.map((o, i) => (
                                    <View key={i} style={[styles.organMiniCard, { width: (SCREEN_W - ms(82)) / 2 }]}>
                                        <View style={styles.organMiniTop}>
                                            <View style={[styles.organMiniIcon, { backgroundColor: o.color + '12' }]}>
                                                <Icon type={Icons.Ionicons} name={o.icon} size={ms(14)} color={o.color} />
                                            </View>
                                            <View>
                                                <Text style={[styles.organMiniScore, { color: o.color }]}>{o.risk}%</Text>
                                                <Text style={styles.organMiniStressLabel}>risk</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.organMiniName}>{o.name}</Text>
                                        <Text style={[styles.organMiniStage, { color: o.color }]}>{o.stage}</Text>
                                        <View style={styles.organMiniBar}>
                                            <View style={[styles.organMiniFill, { width: `${o.risk}%`, backgroundColor: o.color }]} />
                                        </View>
                                        <Text style={[styles.organMiniTrend, { color: o.trend === 'improving' ? '#16A34A' : primaryColor }]}>
                                            {o.trend === 'improving' ? '↑ Improving' : '→ Stable'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* With vs Without Activity */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Activity Impact per Organ</Text>
                            {ACTIVITY_ORGANS.map((o, i) => (
                                <View key={i} style={[styles.impactDetailCard, { borderColor: o.color + '25', marginBottom: i < ACTIVITY_ORGANS.length - 1 ? vs(10) : 0 }]}>
                                    <View style={styles.impactDetailHeader}>
                                        <View style={[styles.impactDetailIcon, { backgroundColor: o.color + '12' }]}>
                                            <Icon type={Icons.Ionicons} name={o.icon} size={ms(14)} color={o.color} />
                                        </View>
                                        <Text style={[styles.impactDetailName, { color: o.color }]}>{o.name}</Text>
                                        <View style={[styles.impactDetailBadge, { backgroundColor: o.color + '15' }]}>
                                            <Text style={[styles.impactDetailBadgeText, { color: o.color }]}>{o.stage}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.impactDetailRow}>
                                        <View style={[styles.impactDetailBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                                            <View style={styles.impactDetailBoxHeader}>
                                                <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(12)} color="#16A34A" />
                                                <Text style={[styles.impactDetailBoxTitle, { color: '#16A34A' }]}>With Activity</Text>
                                            </View>
                                            <Text style={styles.impactDetailBoxText}>{o.withActivity}</Text>
                                        </View>
                                        <View style={[styles.impactDetailBox, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
                                            <View style={styles.impactDetailBoxHeader}>
                                                <Icon type={Icons.Ionicons} name="close-circle" size={ms(12)} color="#F97316" />
                                                <Text style={[styles.impactDetailBoxTitle, { color: '#F97316' }]}>Without Activity</Text>
                                            </View>
                                            <Text style={styles.impactDetailBoxText}>{o.withoutActivity}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={{ height: vs(40) }} />
                    </>}

                    {activeTab === 'biomarkers' && <>
                        {/* Summary banner */}
                        <View style={styles.organBanner}>
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#16A34A' }]}>
                                    {ACTIVITY_BIOMARKERS.filter(b => b.status === 'normal').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Normal</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#D97706' }]}>
                                    {ACTIVITY_BIOMARKERS.filter(b => b.status === 'borderline').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Borderline</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#E11D48' }]}>
                                    {ACTIVITY_BIOMARKERS.filter(b => b.status === 'elevated').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>At Risk</Text>
                            </View>
                        </View>

                        {/* Biomarker cards */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Biomarker Readings</Text>
                            {ACTIVITY_BIOMARKERS.map((b, i) => (
                                <View key={i} style={[styles.bmCard, {
                                    borderColor: b.color + '30',
                                    backgroundColor: b.color + '06',
                                    marginBottom: i < ACTIVITY_BIOMARKERS.length - 1 ? vs(10) : 0,
                                }]}>
                                    {/* Top row */}
                                    <View style={styles.bmTopRow}>
                                        <View style={[styles.bmIconBox, { backgroundColor: b.color + '15' }]}>
                                            <Icon type={Icons.Ionicons} name="analytics" size={ms(14)} color={b.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: ms(10) }}>
                                            <Text style={styles.bmName}>{b.name}</Text>
                                            <Text style={styles.bmActivity}>{b.activity}</Text>
                                        </View>
                                        <View style={styles.bmRightCol}>
                                            <Text style={[styles.bmValue, { color: b.color }]}>
                                                {b.value}<Text style={styles.bmUnit}> {b.unit}</Text>
                                            </Text>
                                            <View style={[styles.bmStatusBadge, {
                                                backgroundColor: b.status === 'normal' ? '#DCFCE7' : b.status === 'borderline' ? '#FEF3C7' : '#FEE2E2',
                                            }]}>
                                                <Text style={[styles.bmStatusText, {
                                                    color: b.status === 'normal' ? '#16A34A' : b.status === 'borderline' ? '#D97706' : '#E11D48',
                                                }]}>{b.statusLabel}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Progress bar */}
                                    <View style={styles.bmBarTrack}>
                                        <View style={[styles.bmBarFill, { width: `${b.fillPct}%`, backgroundColor: b.color }]} />
                                    </View>
                                    <View style={styles.bmRangeRow}>
                                        <Text style={styles.bmRangeLabel}>Normal: {b.normalRange}</Text>
                                        <View style={styles.bmTrendBadge}>
                                            <Icon type={Icons.Ionicons}
                                                name={b.trend === 'improving' ? 'trending-up' : b.trend === 'worsening' ? 'trending-down' : 'remove'}
                                                size={ms(11)}
                                                color={b.trend === 'improving' ? '#16A34A' : b.trend === 'worsening' ? '#E11D48' : '#D97706'} />
                                            <Text style={[styles.bmTrendText, {
                                                color: b.trend === 'improving' ? '#16A34A' : b.trend === 'worsening' ? '#E11D48' : '#D97706',
                                            }]}>{b.change}  {b.trend === 'improving' ? 'Improving' : b.trend === 'worsening' ? 'Worsening' : 'Stable'}</Text>
                                        </View>
                                    </View>

                                    {/* Description */}
                                    <Text style={styles.bmDesc}>{b.description}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ height: vs(40) }} />
                    </>}

                    {/* ── CLUSTER TAB ── */}
                    {activeTab === 'cluster' && <>
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Activity Clusters</Text>
                            <Text style={styles.clusterSubtitle}>How your exercise types connect to biomarkers and organs</Text>
                            {ACTIVITY_CLUSTERS.map((c, i) => (
                                <View key={i} style={[styles.clusterCard, {
                                    borderColor: c.color + '30',
                                    backgroundColor: c.color + '06',
                                    marginBottom: i < ACTIVITY_CLUSTERS.length - 1 ? vs(12) : 0,
                                }]}>
                                    <View style={styles.clusterHeader}>
                                        <View style={[styles.clusterIconBox, { backgroundColor: c.color + '18' }]}>
                                            <Icon type={Icons.Ionicons} name={c.icon} size={ms(16)} color={c.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: ms(10) }}>
                                            <Text style={styles.clusterName}>{c.name}</Text>
                                            <Text style={[styles.clusterTrend, { color: c.trend === 'improving' ? '#16A34A' : c.trend === 'worsening' ? '#E11D48' : '#D97706' }]}>
                                                {c.trend === 'improving' ? '↑ Improving' : c.trend === 'worsening' ? '↓ Worsening' : '→ Stable'}
                                            </Text>
                                        </View>
                                        <View style={styles.clusterScoreWrap}>
                                            <Text style={[styles.clusterScore, { color: c.color }]}>{c.score}</Text>
                                            <Text style={styles.clusterScoreLabel}>risk</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.bmBarTrack, { marginBottom: vs(10) }]}>
                                        <View style={[styles.bmBarFill, { width: `${c.score}%`, backgroundColor: c.color }]} />
                                    </View>
                                    <View style={styles.clusterTagsRow}>
                                        {c.activityTypes.map((a, j) => (
                                            <View key={j} style={[styles.clusterTag, { backgroundColor: c.color + '15', borderColor: c.color + '40' }]}>
                                                <Icon type={Icons.Ionicons} name="barbell" size={ms(9)} color={c.color} />
                                                <Text style={[styles.clusterTagText, { color: c.color }]}>{a}</Text>
                                            </View>
                                        ))}
                                        {c.biomarkers.map((b, j) => (
                                            <View key={j} style={[styles.clusterTag, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}>
                                                <Icon type={Icons.Ionicons} name="analytics" size={ms(9)} color="#6B7280" />
                                                <Text style={[styles.clusterTagText, { color: '#6B7280' }]}>{b}</Text>
                                            </View>
                                        ))}
                                        {c.organs.map((o, j) => (
                                            <View key={j} style={[styles.clusterTag, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}>
                                                <Icon type={Icons.Ionicons} name="body" size={ms(9)} color="#6B7280" />
                                                <Text style={[styles.clusterTagText, { color: '#6B7280' }]}>{o}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <Text style={styles.clusterSummary}>{c.summary}</Text>
                                    <View style={styles.clusterRiskRow}>
                                        <Icon type={Icons.Ionicons} name="alert-circle" size={ms(12)} color="#F97316" />
                                        <Text style={styles.clusterRiskText}>{c.risk}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View style={{ height: vs(40) }} />
                    </>}

                    {/* ── ACTIONS TAB ── */}
                    {activeTab === 'actions' && <>
                        {ACTIVITY_ACTIONS.map((group, gi) => (
                            <View key={gi} style={styles.organsCard}>
                                <View style={styles.actionGroupHeader}>
                                    <View style={[styles.actionGroupBadge, { backgroundColor: group.bg }]}>
                                        <Icon type={Icons.Ionicons} name={group.icon} size={ms(12)} color={group.color} />
                                        <Text style={[styles.actionGroupLabel, { color: group.color }]}>{group.label}</Text>
                                    </View>
                                </View>
                                {group.items.map((item, ii) => (
                                    <View key={ii} style={[styles.actionCard, {
                                        borderColor: group.color + '25',
                                        marginBottom: ii < group.items.length - 1 ? vs(8) : 0,
                                    }]}>
                                        <View style={[styles.actionIconBox, { backgroundColor: group.bg }]}>
                                            <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color={group.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: ms(12) }}>
                                            <Text style={styles.actionTitle}>{item.title}</Text>
                                            <Text style={styles.actionDesc}>{item.desc}</Text>
                                        </View>
                                        <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color="#D1D5DB" />
                                    </View>
                                ))}
                            </View>
                        ))}
                        <View style={{ height: vs(40) }} />
                    </>}

                    {/* ── CARE TAB ── */}
                    {activeTab === 'care' && <>
                        {/* Activity Goals */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Activity Goals</Text>
                            {ACTIVITY_CARE.goals.map((g, i) => (
                                <View key={i} style={[styles.goalRow, { borderBottomWidth: i < ACTIVITY_CARE.goals.length - 1 ? 1 : 0 }]}>
                                    <View style={[styles.goalDot, { backgroundColor: g.color }]} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.goalLabelRow}>
                                            <Text style={styles.goalLabel}>{g.label}</Text>
                                            <Text style={[styles.goalStatus, { color: g.met ? '#16A34A' : '#E11D48' }]}>
                                                {g.met ? '✓ Met' : '✗ Not Met'}
                                            </Text>
                                        </View>
                                        <View style={styles.goalValueRow}>
                                            <Text style={styles.goalCurrent}>Current: <Text style={[styles.goalCurrentVal, { color: g.color }]}>{g.current}</Text></Text>
                                            <Text style={styles.goalTarget}>Target: {g.target}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Upcoming Appointments */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Upcoming Assessments</Text>
                            {ACTIVITY_CARE.appointments.map((a, i) => (
                                <View key={i} style={[styles.apptCard, {
                                    borderColor: a.color + '25',
                                    marginBottom: i < ACTIVITY_CARE.appointments.length - 1 ? vs(8) : 0,
                                }]}>
                                    <View style={[styles.apptIconBox, { backgroundColor: a.color + '15' }]}>
                                        <Icon type={Icons.Ionicons} name={a.icon} size={ms(16)} color={a.color} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: ms(12) }}>
                                        <Text style={styles.apptTitle}>{a.title}</Text>
                                        <Text style={styles.apptDate}>{a.date}</Text>
                                    </View>
                                    <View style={[styles.apptTypeBadge, { backgroundColor: a.color + '15' }]}>
                                        <Text style={[styles.apptTypeText, { color: a.color }]}>{a.type}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Care Team */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Care Team</Text>
                            <View style={styles.careTeamRow}>
                                {ACTIVITY_CARE.team.map((t, i) => (
                                    <View key={i} style={styles.careTeamCard}>
                                        <View style={[styles.careTeamAvatar, { backgroundColor: t.color + '18' }]}>
                                            <Icon type={Icons.Ionicons} name={t.icon} size={ms(26)} color={t.color} />
                                        </View>
                                        <Text style={styles.careTeamName} numberOfLines={2}>{t.name}</Text>
                                        <Text style={[styles.careTeamRole, { color: t.color }]}>{t.role}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Lifestyle Tips */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Performance Tips</Text>
                            {ACTIVITY_CARE.tips.map((tip, i) => (
                                <View key={i} style={[styles.careTipRow, { borderBottomWidth: i < ACTIVITY_CARE.tips.length - 1 ? 1 : 0 }]}>
                                    <View style={styles.careTipIcon}>
                                        <Icon type={Icons.Ionicons} name={tip.icon} size={ms(16)} color={primaryColor} />
                                    </View>
                                    <Text style={styles.careTipText}>{tip.text}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ height: vs(40) }} />
                    </>}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1, paddingTop: ms(50) },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: ms(16), paddingHorizontal: ms(14) },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    scrollContent: { paddingBottom: vs(40), paddingHorizontal: ms(14) },

    // Tab Bar
    tabScroll: { marginBottom: vs(8), flexGrow: 0 },
    tabRow: { paddingHorizontal: ms(16), gap: ms(4) },
    tab: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: whiteColor, borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(6), borderWidth: 1, borderColor: '#E5E7EB' },
    tabActive: { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
    tabText: { fontFamily: interMedium, fontSize: ms(9.5), color: '#9CA3AF' },
    tabTextActive: { color: primaryColor },

    scoreCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    scoreRow: { flexDirection: 'row', alignItems: 'center' },
    ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    ringScore: { fontFamily: heading, fontSize: ms(22), color: blackColor },
    ringLabel: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF' },
    scoreInfo: { flex: 1, marginLeft: ms(16) },
    adherenceBadge: { backgroundColor: '#DCFCE7', borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(4), alignSelf: 'flex-start', marginBottom: vs(8) },
    adherenceBadgeText: { fontFamily: interMedium, fontSize: ms(12), color: '#16A34A' },
    scoreDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(18), marginBottom: vs(8) },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    streakText: { fontFamily: interMedium, fontSize: ms(12), color: '#F59E0B' },

    // Scale
    scaleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: ms(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    scaleDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(10) },
    scaleLabel: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280' },
    scaleSubLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(1) },
    scaleRange: { fontFamily: interMedium, fontSize: ms(11), marginRight: ms(6) },
    scaleActiveBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    scaleActiveText: { fontFamily: interMedium, fontSize: ms(9), color: whiteColor },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(12) },
    statCard: { width: '48%', backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(8), alignItems: 'center' },
    statIcon: { width: ms(40), height: ms(40), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) },
    statValue: { fontFamily: heading, fontSize: ms(20), color: blackColor },
    statLabel: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },

    card: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12) },
    cardTitle: { fontFamily: heading, fontSize: ms(15), color: blackColor, marginBottom: vs(14) },

    barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    barCol: { alignItems: 'center', flex: 1 },
    barTrack: { width: ms(28), height: vs(70), backgroundColor: '#F1F5F9', borderRadius: ms(6), justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: ms(6) },
    barLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280', marginTop: vs(6) },
    barValue: { fontFamily: interMedium, fontSize: ms(10), color: blackColor, marginTop: vs(2) },

    metricRow: { paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    metricInfo: { flex: 1 },
    metricTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    metricName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    metricBadge: { borderRadius: ms(12), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    metricBadgeText: { fontFamily: interMedium, fontSize: ms(9) },
    metricValues: { flexDirection: 'row', alignItems: 'center', gap: ms(12), marginBottom: vs(3) },
    metricCurrent: { fontFamily: interMedium, fontSize: ms(14), color: blackColor },
    metricTarget: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF' },
    metricTool: { fontFamily: interRegular, fontSize: ms(10), color: '#D1D5DB' },

    // Impact
    impactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    impactBadgeText: { fontFamily: interMedium, fontSize: ms(10) },

    tipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    tipText: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },

    // Organs Tab
    organBanner: { flexDirection: 'row', backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(12), justifyContent: 'space-around', alignItems: 'center' },
    organBannerItem: { alignItems: 'center' },
    organBannerCount: { fontFamily: heading, fontSize: ms(22) },
    organBannerLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280', marginTop: vs(2) },
    organBannerDivider: { width: 1, height: vs(32), backgroundColor: '#E5E7EB' },

    organsCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16), marginBottom: vs(14) },
    organCardTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor, marginBottom: vs(12) },
    organGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginTop: vs(4) },

    organMiniCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), borderWidth: 1.5, borderColor: '#E5E7EB' },
    organMiniTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    organMiniIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    organMiniScore: { fontFamily: interMedium, fontSize: ms(18), textAlign: 'right' },
    organMiniStressLabel: { fontFamily: interRegular, fontSize: ms(8), color: '#9CA3AF', textAlign: 'right' },
    organMiniName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    organMiniStage: { fontFamily: interRegular, fontSize: ms(10), marginBottom: vs(8) },
    organMiniBar: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    organMiniFill: { height: '100%', borderRadius: ms(2) },
    organMiniTrend: { fontFamily: interMedium, fontSize: ms(9), marginTop: vs(6) },

    impactDetailCard: { borderRadius: ms(14), borderWidth: 1, padding: ms(14) },
    impactDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(10) },
    impactDetailIcon: { width: ms(30), height: ms(30), borderRadius: ms(9), justifyContent: 'center', alignItems: 'center' },
    impactDetailName: { fontFamily: interMedium, fontSize: ms(13), flex: 1 },
    impactDetailBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    impactDetailBadgeText: { fontFamily: interMedium, fontSize: ms(9) },
    impactDetailRow: { gap: vs(8) },
    impactDetailBox: { borderRadius: ms(10), borderWidth: 1, padding: ms(10) },
    impactDetailBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(5), marginBottom: vs(5) },
    impactDetailBoxTitle: { fontFamily: interMedium, fontSize: ms(10) },
    impactDetailBoxText: { fontFamily: interRegular, fontSize: ms(11), color: '#374151', lineHeight: ms(17) },

    // Biomarkers Tab
    bmCard: { borderRadius: ms(14), borderWidth: 1, padding: ms(14) },
    bmTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
    bmIconBox: { width: ms(36), height: ms(36), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    bmName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    bmActivity: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(1) },
    bmRightCol: { alignItems: 'flex-end', gap: vs(4) },
    bmValue: { fontFamily: interMedium, fontSize: ms(16) },
    bmUnit: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280' },
    bmStatusBadge: { borderRadius: ms(8), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    bmStatusText: { fontFamily: interMedium, fontSize: ms(9) },
    bmBarTrack: { height: vs(5), backgroundColor: '#E5E7EB', borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(6) },
    bmBarFill: { height: '100%', borderRadius: ms(3) },
    bmRangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    bmRangeLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF' },
    bmTrendBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(3) },
    bmTrendText: { fontFamily: interMedium, fontSize: ms(10) },
    bmDesc: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(17) },

    // Cluster Tab
    clusterSubtitle: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(12), marginTop: vs(-6) },
    clusterCard: { borderRadius: ms(14), borderWidth: 1, padding: ms(14) },
    clusterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    clusterIconBox: { width: ms(38), height: ms(38), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    clusterName: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    clusterTrend: { fontFamily: interMedium, fontSize: ms(10), marginTop: vs(2) },
    clusterScoreWrap: { alignItems: 'center' },
    clusterScore: { fontFamily: interMedium, fontSize: ms(20) },
    clusterScoreLabel: { fontFamily: interRegular, fontSize: ms(9), color: '#9CA3AF' },
    clusterTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(10) },
    clusterTag: { flexDirection: 'row', alignItems: 'center', gap: ms(4), borderRadius: ms(8), borderWidth: 1, paddingHorizontal: ms(8), paddingVertical: vs(3) },
    clusterTagText: { fontFamily: interMedium, fontSize: ms(9) },
    clusterSummary: { fontFamily: interRegular, fontSize: ms(11), color: '#374151', lineHeight: ms(17), marginBottom: vs(8) },
    clusterRiskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(6), backgroundColor: '#FFF7ED', borderRadius: ms(8), padding: ms(8) },
    clusterRiskText: { fontFamily: interRegular, fontSize: ms(10), color: '#F97316', flex: 1, lineHeight: ms(15) },

    // Actions Tab
    actionGroupHeader: { marginBottom: vs(10) },
    actionGroupBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(6), alignSelf: 'flex-start', borderRadius: ms(10), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    actionGroupLabel: { fontFamily: interMedium, fontSize: ms(12) },
    actionCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), padding: ms(12) },
    actionIconBox: { width: ms(40), height: ms(40), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    actionTitle: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(3) },
    actionDesc: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(16) },

    // Care Tab
    goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomColor: '#F3F4F6' },
    goalDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(12) },
    goalLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(3) },
    goalLabel: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    goalStatus: { fontFamily: interMedium, fontSize: ms(11) },
    goalValueRow: { flexDirection: 'row', gap: ms(12) },
    goalCurrent: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280' },
    goalCurrentVal: { fontFamily: interMedium },
    goalTarget: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF' },

    apptCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: ms(12), padding: ms(12) },
    apptIconBox: { width: ms(40), height: ms(40), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    apptTitle: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(3) },
    apptDate: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280' },
    apptTypeBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    apptTypeText: { fontFamily: interMedium, fontSize: ms(10) },

    careTeamRow: { flexDirection: 'row', justifyContent: 'space-between' },
    careTeamCard: { alignItems: 'center', width: '30%' },
    careTeamAvatar: { width: ms(54), height: ms(54), borderRadius: ms(27), justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) },
    careTeamName: { fontFamily: interMedium, fontSize: ms(10), color: blackColor, textAlign: 'center', marginBottom: vs(3) },
    careTeamRole: { fontFamily: interRegular, fontSize: ms(9), textAlign: 'center' },

    careTipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomColor: '#F3F4F6' },
    careTipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: primaryColor + '12', justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    careTipText: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default PhysicalActivityScreen;
