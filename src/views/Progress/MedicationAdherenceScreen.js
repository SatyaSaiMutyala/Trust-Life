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
import { bold, regular } from '../../config/Constants';

// ── Medication Data ──
const TOTAL_DOSES = 56;
const TAKEN_DOSES = 52;
const MISSED_DOSES = 3;
const LATE_DOSES = 1;
const DRUG_HOLIDAY_DETECTED = false; // consecutive 3+ days missed

// ── PDC Calculation ──
const PDC = TAKEN_DOSES / TOTAL_DOSES; // Proportion of Days Covered
const ADHERENCE_RATE = PDC * 100;

const calculatePDCScore = (pdc, drugHoliday) => {
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
    if (drugHoliday) score -= 20; // Drug holiday penalty
    return Math.max(0, Math.min(100, Math.round(score)));
};

const ADHERENCE_SCORE = calculatePDCScore(PDC, DRUG_HOLIDAY_DETECTED);

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

const MEDICATIONS = [
    { name: 'Metformin 500mg', dosage: 'Twice daily', time: '8:00 AM, 8:00 PM', status: 'On Track', statusType: 'strong', streak: 14 },
    { name: 'Amlodipine 5mg', dosage: 'Once daily', time: '9:00 AM', status: 'On Track', statusType: 'strong', streak: 14 },
    { name: 'Vitamin D3', dosage: 'Once daily', time: '10:00 AM', status: 'Missed Today', statusType: 'poor', streak: 0 },
    { name: 'Omega-3', dosage: 'Once daily', time: '1:00 PM', status: 'On Track', statusType: 'strong', streak: 7 },
];

const WEEK_DAYS = [
    { day: 'Mon', date: '3', taken: true },
    { day: 'Tue', date: '4', taken: true },
    { day: 'Wed', date: '5', taken: true },
    { day: 'Thu', date: '6', taken: true },
    { day: 'Fri', date: '7', taken: false },
    { day: 'Sat', date: '8', taken: true },
    { day: 'Sun', date: '9', taken: null },
];

const STATS = [
    { label: 'Total Doses', value: `${TOTAL_DOSES}`, icon: 'medkit', color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Taken', value: `${TAKEN_DOSES}`, icon: 'checkmark-circle', color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Missed', value: `${MISSED_DOSES}`, icon: 'close-circle', color: '#E11D48', bg: '#FCE4EC' },
    { label: 'Late', value: `${LATE_DOSES}`, icon: 'time', color: '#D97706', bg: '#FEF3C7' },
];

const IMPACT = [
    { marker: 'Blood Sugar', change: '-8%', direction: 'down', type: 'strong', desc: 'Improved since regular Metformin intake' },
    { marker: 'Blood Pressure', change: '-5%', direction: 'down', type: 'strong', desc: 'Stabilized with consistent Amlodipine use' },
];

const MEDICATION_ORGANS = [
    {
        name: 'Heart',
        color: '#E11D48',
        medication: 'Amlodipine 5mg',
        taken: true,
        risk: 28,
        trend: 'stable',
        stage: 'Well Managed',
        impact: 'Amlodipine keeps blood pressure stable, reducing strain on heart walls and lowering risk of hypertensive heart disease.',
    },
    {
        name: 'Pancreas',
        color: '#7C3AED',
        medication: 'Metformin 500mg',
        taken: true,
        risk: 35,
        trend: 'stable',
        stage: 'Controlled',
        impact: 'Metformin reduces insulin resistance, allowing the pancreas to produce insulin more efficiently with less stress.',
    },
    {
        name: 'Liver',
        color: '#D97706',
        medication: 'Metformin 500mg',
        taken: true,
        risk: 30,
        trend: 'stable',
        stage: 'Improving',
        impact: 'Metformin suppresses hepatic glucose output, reducing liver workload and supporting metabolic recovery.',
    },
    {
        name: 'Kidneys',
        color: '#059669',
        medication: 'Metformin 500mg',
        taken: true,
        risk: 22,
        trend: 'stable',
        stage: 'Stable',
        impact: 'Consistent Metformin use keeps kidney filtration stable and prevents diabetic nephropathy progression.',
    },
    {
        name: 'Bones',
        color: '#6366F1',
        medication: 'Vitamin D3',
        taken: false,
        risk: 62,
        trend: 'worsening',
        stage: 'At Risk',
        impact: 'Vitamin D3 was missed today. Without consistent intake, calcium absorption decreases, weakening bone density over time.',
    },
    {
        name: 'Brain',
        color: '#0891B2',
        medication: 'Omega-3',
        taken: true,
        risk: 25,
        trend: 'stable',
        stage: 'Supported',
        impact: 'Omega-3 fatty acids reduce neuroinflammation and support myelin integrity, promoting cognitive clarity and mood stability.',
    },
];

const MEDICATION_BIOMARKERS = [
    {
        name: 'HbA1c',
        medication: 'Metformin 500mg',
        taken: true,
        value: '6.8',
        unit: '%',
        normalRange: '< 5.7%',
        targetRange: '< 7.0% (diabetic)',
        color: '#7C3AED',
        status: 'borderline',
        statusLabel: 'Near Target',
        trend: 'improving',
        change: '-0.4%',
        fillPct: 62,
        description: 'Regular Metformin use is gradually lowering your HbA1c. Consistent dosing for 3+ months can bring this into the target range.',
    },
    {
        name: 'Fasting Glucose',
        medication: 'Metformin 500mg',
        taken: true,
        value: '118',
        unit: 'mg/dL',
        normalRange: '70 – 99 mg/dL',
        targetRange: '< 130 mg/dL (diabetic)',
        color: '#D97706',
        status: 'elevated',
        statusLabel: 'Elevated',
        trend: 'improving',
        change: '-8 mg/dL',
        fillPct: 72,
        description: 'Metformin reduces hepatic glucose production. Your fasting glucose is trending down with consistent twice-daily dosing.',
    },
    {
        name: 'Systolic BP',
        medication: 'Amlodipine 5mg',
        taken: true,
        value: '128',
        unit: 'mmHg',
        normalRange: '< 120 mmHg',
        targetRange: '< 130 mmHg',
        color: '#E11D48',
        status: 'borderline',
        statusLabel: 'Borderline',
        trend: 'improving',
        change: '-5 mmHg',
        fillPct: 55,
        description: 'Amlodipine is effectively relaxing your blood vessels. Systolic pressure is approaching the normal range with continued therapy.',
    },
    {
        name: 'Diastolic BP',
        medication: 'Amlodipine 5mg',
        taken: true,
        value: '82',
        unit: 'mmHg',
        normalRange: '< 80 mmHg',
        targetRange: '< 80 mmHg',
        color: '#0891B2',
        status: 'borderline',
        statusLabel: 'Slightly High',
        trend: 'stable',
        change: '-2 mmHg',
        fillPct: 48,
        description: 'Diastolic pressure is nearly within normal range. Consistent Amlodipine intake and low-sodium diet will accelerate improvement.',
    },
    {
        name: 'Vitamin D (25-OH)',
        medication: 'Vitamin D3',
        taken: false,
        value: '22',
        unit: 'ng/mL',
        normalRange: '30 – 100 ng/mL',
        targetRange: '> 30 ng/mL',
        color: '#6366F1',
        status: 'deficient',
        statusLabel: 'Insufficient',
        trend: 'worsening',
        change: '-3 ng/mL',
        fillPct: 80,
        description: 'Vitamin D3 was missed today. Levels are already insufficient. Skipping doses delays recovery and worsens bone and immune health.',
    },
    {
        name: 'Triglycerides',
        medication: 'Omega-3',
        taken: true,
        value: '148',
        unit: 'mg/dL',
        normalRange: '< 150 mg/dL',
        targetRange: '< 150 mg/dL',
        color: '#059669',
        status: 'normal',
        statusLabel: 'Normal',
        trend: 'improving',
        change: '-12 mg/dL',
        fillPct: 35,
        description: 'Omega-3 fatty acids are actively lowering triglycerides. Keep up consistent intake — levels are just within the healthy range.',
    },
    {
        name: 'HDL Cholesterol',
        medication: 'Omega-3',
        taken: true,
        value: '52',
        unit: 'mg/dL',
        normalRange: '> 50 mg/dL (women)',
        targetRange: '> 50 mg/dL',
        color: '#16A34A',
        status: 'normal',
        statusLabel: 'Good',
        trend: 'stable',
        change: '+2 mg/dL',
        fillPct: 28,
        description: 'HDL "good cholesterol" is in a healthy range, supported by regular Omega-3 use. Continue current regimen to maintain this level.',
    },
];

const MED_CLUSTERS = [
    {
        name: 'Metabolic Control',
        color: '#7C3AED',
        icon: 'pulse',
        score: 72,
        trend: 'improving',
        medications: ['Metformin 500mg'],
        biomarkers: ['HbA1c', 'Fasting Glucose'],
        organs: ['Pancreas', 'Liver', 'Kidneys'],
        summary: 'Metformin is managing your blood sugar cascade. HbA1c and fasting glucose are trending down, reducing stress on pancreas and liver.',
        risk: 'Skipping Metformin for even 2 days can spike glucose and raise HbA1c rapidly.',
    },
    {
        name: 'Cardiovascular',
        color: '#E11D48',
        icon: 'heart',
        score: 58,
        trend: 'improving',
        medications: ['Amlodipine 5mg'],
        biomarkers: ['Systolic BP', 'Diastolic BP'],
        organs: ['Heart'],
        summary: 'Amlodipine is relaxing arterial walls, reducing systolic pressure. Heart strain is decreasing with consistent daily dosing.',
        risk: 'Missing Amlodipine can cause rebound hypertension within 24–48 hours.',
    },
    {
        name: 'Nutritional & Bone',
        color: '#6366F1',
        icon: 'fitness',
        score: 62,
        trend: 'worsening',
        medications: ['Vitamin D3'],
        biomarkers: ['Vitamin D (25-OH)'],
        organs: ['Bones'],
        summary: 'Vitamin D3 was missed today. Levels are already insufficient, slowing calcium absorption and increasing bone fragility risk.',
        risk: 'Continued missed doses will push Vitamin D below the deficient threshold (<20 ng/mL).',
    },
    {
        name: 'Lipid & Brain Health',
        color: '#0891B2',
        icon: 'analytics',
        score: 38,
        trend: 'stable',
        medications: ['Omega-3'],
        biomarkers: ['Triglycerides', 'HDL Cholesterol'],
        organs: ['Brain', 'Liver'],
        summary: 'Omega-3 is keeping triglycerides within range and maintaining HDL. Brain inflammation markers are trending stable.',
        risk: 'Inconsistent Omega-3 use allows triglycerides to creep back above 150 mg/dL.',
    },
];

const MED_ACTIONS = [
    {
        priority: 'urgent',
        label: 'Urgent',
        color: '#E11D48',
        bg: '#FEE2E2',
        icon: 'warning',
        items: [
            { title: 'Take Vitamin D3 Now', desc: 'You missed your 10:00 AM dose. Take it as soon as possible to avoid disrupting your daily level.', icon: 'medkit' },
        ],
    },
    {
        priority: 'today',
        label: 'Today',
        color: '#D97706',
        bg: '#FEF3C7',
        icon: 'today',
        items: [
            { title: 'Evening Metformin at 8:00 PM', desc: 'Your second Metformin dose is due at 8:00 PM. Do not skip — twice-daily consistency is critical.', icon: 'time' },
            { title: 'Check Blood Pressure', desc: 'Log a manual reading to track Amlodipine effectiveness. Aim for systolic < 130 mmHg.', icon: 'pulse' },
        ],
    },
    {
        priority: 'week',
        label: 'This Week',
        color: '#0891B2',
        bg: '#E0F7FA',
        icon: 'calendar',
        items: [
            { title: 'Fasting Glucose Self-Test', desc: 'Test fasting glucose before breakfast one morning. Target < 130 mg/dL with Metformin.', icon: 'analytics' },
            { title: 'Refill Metformin (5 days left)', desc: 'Your Metformin supply runs out in ~5 days. Contact pharmacy or request a prescription refill.', icon: 'reload' },
        ],
    },
    {
        priority: 'month',
        label: 'This Month',
        color: primaryColor,
        bg: primaryColor + '12',
        icon: 'clipboard',
        items: [
            { title: 'HbA1c Lab Test Due', desc: 'Schedule your quarterly HbA1c check to measure 3-month blood sugar control.', icon: 'flask' },
            { title: 'Endocrinologist Follow-up', desc: 'Discuss Metformin dose adjustment and HbA1c progress with your specialist.', icon: 'person' },
            { title: 'Vitamin D Level Recheck', desc: 'After 8 weeks of consistent D3, retest 25-OH Vitamin D. Target > 30 ng/mL.', icon: 'sunny' },
        ],
    },
];

const MED_CARE = {
    goals: [
        { label: 'HbA1c', target: '< 7.0%', current: '6.8%', color: '#7C3AED', met: true },
        { label: 'Systolic BP', target: '< 130 mmHg', current: '128 mmHg', color: '#E11D48', met: true },
        { label: 'Vitamin D', target: '> 30 ng/mL', current: '22 ng/mL', color: '#6366F1', met: false },
        { label: 'Triglycerides', target: '< 150 mg/dL', current: '148 mg/dL', color: '#059669', met: true },
    ],
    appointments: [
        { title: 'Primary Care Physician', date: 'Mar 24, 2026', type: 'Follow-up', icon: 'person', color: primaryColor },
        { title: 'Lab: HbA1c + Lipid Panel', date: 'Mar 28, 2026', type: 'Blood Test', icon: 'flask', color: '#7C3AED' },
        { title: 'Endocrinologist', date: 'Apr 5, 2026', type: 'Specialist', icon: 'medical', color: '#0891B2' },
    ],
    team: [
        { name: 'Dr. Sarah Mitchell', role: 'Primary Care', icon: 'person-circle', color: primaryColor },
        { name: 'Dr. Rajan Patel', role: 'Endocrinologist', icon: 'person-circle', color: '#7C3AED' },
        { name: 'Dr. Lena Harris', role: 'Cardiologist', icon: 'person-circle', color: '#E11D48' },
    ],
    tips: [
        { icon: 'restaurant', text: 'Follow a low-sodium, low-glycemic diet to support both Metformin and Amlodipine therapy.' },
        { icon: 'walk', text: 'A 30-minute daily walk improves insulin sensitivity and complements Metformin action.' },
        { icon: 'sunny', text: '15 minutes of morning sun exposure boosts natural Vitamin D synthesis alongside your supplement.' },
        { icon: 'water', text: 'Drink 8+ glasses of water daily to help kidneys process Metformin safely.' },
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

const MedicationAdherenceScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('insight');

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
                    <Text style={styles.headerTitle}>Medication Adherence</Text>
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

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                >
                    {activeTab === 'insight' && <>
                    {/* Score Ring */}
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Svg width={RING_SIZE} height={RING_SIZE}>
                                    <Defs>
                                        <SvgLinearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                        fill="none" stroke="url(#medGrad)" strokeWidth={RING_STROKE}
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
                                <Text style={styles.scoreDesc}>You're taking {ADHERENCE_RATE.toFixed(1)}% of your medications on time</Text>
                                <View style={styles.streakRow}>
                                    <Icon type={Icons.Ionicons} name="flame" size={ms(16)} color="#F59E0B" />
                                    <Text style={styles.streakText}>14 day streak</Text>
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
                        {DRUG_HOLIDAY_DETECTED && (
                            <View style={styles.pdcWarning}>
                                <Icon type={Icons.Ionicons} name="warning" size={ms(16)} color="#E11D48" />
                                <Text style={styles.pdcWarningText}>Drug holiday detected (-20 penalty)</Text>
                            </View>
                        )}
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

                    {/* Weekly Calendar */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>This Week</Text>
                        <View style={styles.weekRow}>
                            {WEEK_DAYS.map((item, index) => (
                                <View key={index} style={styles.dayCol}>
                                    <Text style={styles.dayLabel}>{item.day}</Text>
                                    <View style={[
                                        styles.dayCircle,
                                        item.taken === true ? { backgroundColor: '#DCFCE7', borderColor: '#16A34A' } :
                                        item.taken === false ? { backgroundColor: '#FCE4EC', borderColor: '#E11D48' } :
                                        { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
                                    ]}>
                                        {item.taken === true && <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color="#16A34A" />}
                                        {item.taken === false && <Icon type={Icons.Ionicons} name="close" size={ms(14)} color="#E11D48" />}
                                        {item.taken === null && <Text style={styles.dayDate}>{item.date}</Text>}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Current Medications */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Current Medications</Text>
                        {MEDICATIONS.map((item, index) => {
                            const color = item.statusType === 'strong' ? '#16A34A' : item.statusType === 'poor' ? '#E11D48' : '#D97706';
                            const bgColor = item.statusType === 'strong' ? '#DCFCE7' : item.statusType === 'poor' ? '#FCE4EC' : '#FEF3C7';
                            const iconBg = item.statusType === 'strong' ? '#F0FDF4' : item.statusType === 'poor' ? '#FFF1F2' : '#FFFBEB';
                            return (
                                <View key={index} style={styles.medRow}>
                                    <View style={[styles.medIcon, { backgroundColor: iconBg }]}>
                                        <Icon type={Icons.Ionicons} name="medkit" size={ms(18)} color={color} />
                                    </View>
                                    <View style={styles.medInfo}>
                                        <Text style={styles.medName}>{item.name}</Text>
                                        <Text style={styles.medDosage}>{item.dosage}  •  {item.time}</Text>
                                        {item.streak > 0 && (
                                            <View style={styles.medStreakRow}>
                                                <Icon type={Icons.Ionicons} name="flame" size={ms(12)} color="#F59E0B" />
                                                <Text style={styles.medStreakText}>{item.streak} day streak</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={[styles.medBadge, { backgroundColor: bgColor }]}>
                                        <Text style={[styles.medBadgeText, { color }]}>{item.status}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Health Impact */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Health Impact</Text>
                        <Text style={styles.impactSubtitle}>How your medication adherence affects your biomarkers</Text>
                        {IMPACT.map((item, index) => (
                            <View key={index} style={styles.impactRow}>
                                <View style={styles.impactLeft}>
                                    <Text style={styles.impactMarker}>{item.marker}</Text>
                                    <Text style={styles.impactDesc}>{item.desc}</Text>
                                </View>
                                <View style={styles.impactChange}>
                                    <Icon type={Icons.Ionicons} name={item.direction === 'up' ? 'arrow-up' : 'arrow-down'} size={ms(14)} color="#16A34A" />
                                    <Text style={styles.impactChangeText}>{item.change}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Tips */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Tips to Stay on Track</Text>
                        {[
                            { icon: 'alarm', text: 'Set daily alarms for each medication time' },
                            { icon: 'medkit', text: 'Use a pill organizer to pre-sort weekly doses' },
                            { icon: 'refresh', text: 'Refill prescriptions 5 days before they run out' },
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
                                    {MEDICATION_ORGANS.filter(o => o.taken).length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Recovering</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#E11D48' }]}>
                                    {MEDICATION_ORGANS.filter(o => !o.taken).length}
                                </Text>
                                <Text style={styles.organBannerLabel}>At Risk</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: primaryColor }]}>
                                    {MEDICATION_ORGANS.length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Total Organs</Text>
                            </View>
                        </View>

                        {/* Mini card grid */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Organ Status</Text>
                            <View style={styles.organGrid}>
                                {MEDICATION_ORGANS.map((o, i) => (
                                    <View key={i} style={[styles.organMiniCard, { width: (SCREEN_W - ms(82)) / 2 }]}>
                                        <View style={styles.organMiniTop}>
                                            <View style={[styles.organMiniIcon, { backgroundColor: o.color + '12' }]}>
                                                <Icon type={Icons.Ionicons} name="body" size={ms(14)} color={o.color} />
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
                                        <Text style={[styles.organMiniTrend, { color: o.trend === 'worsening' ? '#F97316' : '#16A34A' }]}>
                                            {o.trend === 'worsening' ? '↑ Worsening' : '→ Recovering'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Per-organ medication impact */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Medication Impact</Text>
                            {MEDICATION_ORGANS.map((o, i) => (
                                <View key={i} style={[styles.opImpactCard, {
                                    backgroundColor: o.color + '08',
                                    borderColor: o.color + '25',
                                    marginBottom: vs(8),
                                }]}>
                                    <View style={styles.opImpactHeader}>
                                        <Text style={[styles.opImpactTitle, { color: o.color }]}>{o.name} — {o.stage}</Text>
                                        <View style={[styles.opImpactBadge, { backgroundColor: o.taken ? '#DCFCE7' : '#FEE2E2' }]}>
                                            <Icon type={Icons.Ionicons}
                                                name={o.taken ? 'checkmark-circle' : 'close-circle'}
                                                size={ms(11)} color={o.taken ? '#16A34A' : '#E11D48'} />
                                            <Text style={[styles.opImpactBadgeText, { color: o.taken ? '#16A34A' : '#E11D48' }]}>
                                                {o.taken ? 'Taken' : 'Missed'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.opImpactMed}>{o.medication}</Text>
                                    <Text style={styles.opImpactText}>{o.impact}</Text>
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
                                    {MEDICATION_BIOMARKERS.filter(b => b.status === 'normal').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Normal</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#D97706' }]}>
                                    {MEDICATION_BIOMARKERS.filter(b => b.status === 'borderline').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>Borderline</Text>
                            </View>
                            <View style={styles.organBannerDivider} />
                            <View style={styles.organBannerItem}>
                                <Text style={[styles.organBannerCount, { color: '#E11D48' }]}>
                                    {MEDICATION_BIOMARKERS.filter(b => b.status === 'elevated' || b.status === 'deficient').length}
                                </Text>
                                <Text style={styles.organBannerLabel}>At Risk</Text>
                            </View>
                        </View>

                        {/* Biomarker cards */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Biomarker Readings</Text>
                            {MEDICATION_BIOMARKERS.map((b, i) => (
                                <View key={i} style={[styles.bmCard, {
                                    borderColor: b.color + '30',
                                    backgroundColor: b.color + '06',
                                    marginBottom: i < MEDICATION_BIOMARKERS.length - 1 ? vs(10) : 0,
                                }]}>
                                    {/* Top row */}
                                    <View style={styles.bmTopRow}>
                                        <View style={[styles.bmIconBox, { backgroundColor: b.color + '15' }]}>
                                            <Icon type={Icons.Ionicons} name="analytics" size={ms(14)} color={b.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: ms(10) }}>
                                            <Text style={styles.bmName}>{b.name}</Text>
                                            <Text style={styles.bmMed}>{b.medication}</Text>
                                        </View>
                                        <View style={styles.bmRightCol}>
                                            <Text style={[styles.bmValue, { color: b.color }]}>{b.value}<Text style={styles.bmUnit}> {b.unit}</Text></Text>
                                            <View style={[styles.bmStatusBadge, { backgroundColor: b.taken ? '#DCFCE7' : '#FEE2E2' }]}>
                                                <Icon type={Icons.Ionicons}
                                                    name={b.taken ? 'checkmark-circle' : 'close-circle'}
                                                    size={ms(10)} color={b.taken ? '#16A34A' : '#E11D48'} />
                                                <Text style={[styles.bmStatusText, { color: b.taken ? '#16A34A' : '#E11D48' }]}>
                                                    {b.taken ? 'Taken' : 'Missed'}
                                                </Text>
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
                                                name={b.trend === 'improving' ? 'trending-down' : b.trend === 'worsening' ? 'trending-up' : 'remove'}
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
                            <Text style={styles.organCardTitle}>Medication Clusters</Text>
                            <Text style={styles.clusterSubtitle}>How your medications, biomarkers and organs connect</Text>
                            {MED_CLUSTERS.map((c, i) => (
                                <View key={i} style={[styles.clusterCard, { borderColor: c.color + '30', backgroundColor: c.color + '06', marginBottom: i < MED_CLUSTERS.length - 1 ? vs(12) : 0 }]}>
                                    {/* Header */}
                                    <View style={styles.clusterHeader}>
                                        <View style={[styles.clusterIconBox, { backgroundColor: c.color + '18' }]}>
                                            <Icon type={Icons.Ionicons} name={c.icon} size={ms(16)} color={c.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: ms(10) }}>
                                            <Text style={styles.clusterName}>{c.name}</Text>
                                            <Text style={[styles.clusterTrend, { color: c.trend === 'worsening' ? '#E11D48' : c.trend === 'improving' ? '#16A34A' : '#D97706' }]}>
                                                {c.trend === 'improving' ? '↑ Improving' : c.trend === 'worsening' ? '↓ Worsening' : '→ Stable'}
                                            </Text>
                                        </View>
                                        <View style={styles.clusterScoreWrap}>
                                            <Text style={[styles.clusterScore, { color: c.color }]}>{c.score}</Text>
                                            <Text style={styles.clusterScoreLabel}>risk</Text>
                                        </View>
                                    </View>

                                    {/* Progress bar */}
                                    <View style={[styles.bmBarTrack, { marginBottom: vs(10) }]}>
                                        <View style={[styles.bmBarFill, { width: `${c.score}%`, backgroundColor: c.color }]} />
                                    </View>

                                    {/* Tags row */}
                                    <View style={styles.clusterTagsRow}>
                                        {c.medications.map((m, j) => (
                                            <View key={j} style={[styles.clusterTag, { backgroundColor: c.color + '15', borderColor: c.color + '40' }]}>
                                                <Icon type={Icons.Ionicons} name="medkit" size={ms(9)} color={c.color} />
                                                <Text style={[styles.clusterTagText, { color: c.color }]}>{m}</Text>
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

                                    {/* Summary & risk */}
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
                        {MED_ACTIONS.map((group, gi) => (
                            <View key={gi} style={styles.organsCard}>
                                <View style={styles.actionGroupHeader}>
                                    <View style={[styles.actionGroupBadge, { backgroundColor: group.bg }]}>
                                        <Icon type={Icons.Ionicons} name={group.icon} size={ms(12)} color={group.color} />
                                        <Text style={[styles.actionGroupLabel, { color: group.color }]}>{group.label}</Text>
                                    </View>
                                </View>
                                {group.items.map((item, ii) => (
                                    <View key={ii} style={[styles.actionCard, { borderColor: group.color + '25', marginBottom: ii < group.items.length - 1 ? vs(8) : 0 }]}>
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
                        {/* Health Goals */}
                        <View style={styles.organsCard}>
                            <Text style={styles.organCardTitle}>Health Goals</Text>
                            {MED_CARE.goals.map((g, i) => (
                                <View key={i} style={styles.goalRow}>
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
                            <Text style={styles.organCardTitle}>Upcoming Appointments</Text>
                            {MED_CARE.appointments.map((a, i) => (
                                <View key={i} style={[styles.apptCard, { borderColor: a.color + '25', marginBottom: i < MED_CARE.appointments.length - 1 ? vs(8) : 0 }]}>
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
                                {MED_CARE.team.map((t, i) => (
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
                            <Text style={styles.organCardTitle}>Lifestyle Recommendations</Text>
                            {MED_CARE.tips.map((tip, i) => (
                                <View key={i} style={[styles.careTipRow, { borderBottomWidth: i < MED_CARE.tips.length - 1 ? 1 : 0 }]}>
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
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    scrollContent: { paddingBottom: vs(40), paddingHorizontal: ms(14) },

    // Tab Bar
    tabScroll: { marginBottom: vs(8), flexGrow: 0 },
    tabRow: { paddingHorizontal: ms(16), gap: ms(4) },
    tab: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: whiteColor, borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(6), borderWidth: 1, borderColor: '#E5E7EB' },
    tabActive: { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
    tabText: { fontFamily: bold, fontSize: ms(9.5), color: '#9CA3AF' },
    tabTextActive: { color: primaryColor },

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
    pdcWarning: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        backgroundColor: '#FEE2E2', borderRadius: ms(10),
        padding: ms(10), marginTop: vs(8),
    },
    pdcWarningText: { fontFamily: bold, fontSize: ms(11), color: '#E11D48' },
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

    // Weekly Calendar
    weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCol: { alignItems: 'center' },
    dayLabel: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginBottom: vs(6) },
    dayCircle: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    },
    dayDate: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },

    // Medications
    medRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    medIcon: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    medInfo: { flex: 1 },
    medName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    medDosage: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    medStreakRow: { flexDirection: 'row', alignItems: 'center', gap: ms(3), marginTop: vs(3) },
    medStreakText: { fontFamily: regular, fontSize: ms(10), color: '#F59E0B' },
    medBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    medBadgeText: { fontFamily: bold, fontSize: ms(10) },

    // Impact
    impactSubtitle: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(-8), marginBottom: vs(12) },
    impactRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    impactLeft: { flex: 1 },
    impactMarker: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    impactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2), lineHeight: ms(16) },
    impactChange: { flexDirection: 'row', alignItems: 'center', gap: ms(2) },
    impactChangeText: { fontFamily: bold, fontSize: ms(14), color: '#16A34A' },

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

    // Organs Tab
    organBanner: {
        flexDirection: 'row', backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(12), justifyContent: 'space-around', alignItems: 'center',
    },
    organBannerItem: { alignItems: 'center' },
    organBannerCount: { fontFamily: bold, fontSize: ms(22) },
    organBannerLabel: { fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(2) },
    organBannerDivider: { width: 1, height: vs(32), backgroundColor: '#E5E7EB' },

    organsCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16), marginBottom: vs(14) },
    organCardTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(12) },
    organGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginTop: vs(4) },

    organMiniCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), borderWidth: 1.5, borderColor: '#E5E7EB' },
    organMiniTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    organMiniIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    organMiniScore: { fontFamily: bold, fontSize: ms(18), textAlign: 'right' },
    organMiniStressLabel: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF', textAlign: 'right' },
    organMiniName: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    organMiniStage: { fontFamily: regular, fontSize: ms(10), marginBottom: vs(8) },
    organMiniBar: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    organMiniFill: { height: '100%', borderRadius: ms(2) },
    organMiniTrend: { fontFamily: bold, fontSize: ms(9), marginTop: vs(6) },

    opImpactCard: { borderRadius: ms(12), borderWidth: 1, padding: ms(14) },
    opImpactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    opImpactTitle: { fontFamily: bold, fontSize: ms(11) },
    opImpactBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(3), borderRadius: ms(8), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    opImpactBadgeText: { fontFamily: bold, fontSize: ms(9) },
    opImpactMed: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(6) },
    opImpactText: { fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(19) },

    // Biomarkers Tab
    bmCard: { borderRadius: ms(14), borderWidth: 1, padding: ms(14) },
    bmTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
    bmIconBox: { width: ms(36), height: ms(36), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    bmName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    bmMed: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(1) },
    bmRightCol: { alignItems: 'flex-end', gap: vs(4) },
    bmValue: { fontFamily: bold, fontSize: ms(16) },
    bmUnit: { fontFamily: regular, fontSize: ms(10), color: '#6B7280' },
    bmStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(3), borderRadius: ms(8), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    bmStatusText: { fontFamily: bold, fontSize: ms(9) },
    bmBarTrack: { height: vs(5), backgroundColor: '#E5E7EB', borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(6) },
    bmBarFill: { height: '100%', borderRadius: ms(3) },
    bmRangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    bmRangeLabel: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' },
    bmTrendBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(3) },
    bmTrendText: { fontFamily: bold, fontSize: ms(10) },
    bmDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(17) },

    // Cluster Tab
    clusterSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(12), marginTop: vs(-6) },
    clusterCard: { borderRadius: ms(14), borderWidth: 1, padding: ms(14) },
    clusterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    clusterIconBox: { width: ms(38), height: ms(38), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    clusterName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    clusterTrend: { fontFamily: bold, fontSize: ms(10), marginTop: vs(2) },
    clusterScoreWrap: { alignItems: 'center' },
    clusterScore: { fontFamily: bold, fontSize: ms(20) },
    clusterScoreLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },
    clusterTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(10) },
    clusterTag: { flexDirection: 'row', alignItems: 'center', gap: ms(4), borderRadius: ms(8), borderWidth: 1, paddingHorizontal: ms(8), paddingVertical: vs(3) },
    clusterTagText: { fontFamily: bold, fontSize: ms(9) },
    clusterSummary: { fontFamily: regular, fontSize: ms(11), color: '#374151', lineHeight: ms(17), marginBottom: vs(8) },
    clusterRiskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(6), backgroundColor: '#FFF7ED', borderRadius: ms(8), padding: ms(8) },
    clusterRiskText: { fontFamily: regular, fontSize: ms(10), color: '#F97316', flex: 1, lineHeight: ms(15) },

    // Actions Tab
    actionGroupHeader: { marginBottom: vs(10) },
    actionGroupBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(6), alignSelf: 'flex-start', borderRadius: ms(10), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    actionGroupLabel: { fontFamily: bold, fontSize: ms(12) },
    actionCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), padding: ms(12) },
    actionIconBox: { width: ms(40), height: ms(40), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    actionTitle: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(3) },
    actionDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(16) },

    // Care Tab
    goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    goalDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginRight: ms(12) },
    goalLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(3) },
    goalLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    goalStatus: { fontFamily: bold, fontSize: ms(11) },
    goalValueRow: { flexDirection: 'row', gap: ms(12) },
    goalCurrent: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    goalCurrentVal: { fontFamily: bold },
    goalTarget: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },

    apptCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: ms(12), padding: ms(12) },
    apptIconBox: { width: ms(40), height: ms(40), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    apptTitle: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(3) },
    apptDate: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    apptTypeBadge: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    apptTypeText: { fontFamily: bold, fontSize: ms(10) },

    careTeamRow: { flexDirection: 'row', justifyContent: 'space-between' },
    careTeamCard: { alignItems: 'center', width: '30%' },
    careTeamAvatar: { width: ms(54), height: ms(54), borderRadius: ms(27), justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) },
    careTeamName: { fontFamily: bold, fontSize: ms(10), color: blackColor, textAlign: 'center', marginBottom: vs(3) },
    careTeamRole: { fontFamily: regular, fontSize: ms(9), textAlign: 'center' },

    careTipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomColor: '#F3F4F6' },
    careTipIcon: { width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: primaryColor + '12', justifyContent: 'center', alignItems: 'center', marginRight: ms(12) },
    careTipText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },
});

export default MedicationAdherenceScreen;
