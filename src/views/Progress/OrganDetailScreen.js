import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path,
    Circle,
    Line,
    Defs,
    LinearGradient as SvgLinearGradient,
    Stop,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');
const CHART_W = width - ms(64);
const CHART_H = vs(110);
const X_LABELS = ['12 Feb', '13 Mar', '25 Apr', '21 May', '12 June', '12 July'];

// ── Organ configs ────────────────────────────────────────────────────────────
const ORGAN_CONFIGS = {
    Heart: {
        emoji: '\u{1FAC0}',
        condition: 'Hypertension',
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'Systolic Blood Pressure', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '<120', abnormal: '110', unit: 'mmHg', ref: '0- 120 mmHg',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.45 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.40 }],
            },
            {
                name: 'Diastolic Blood Pressure', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '<80', abnormal: '76', unit: 'mmHg', ref: '0- 80 mmHg',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.35 }],
            },
            {
                name: 'Heart Rate', subtitle: 'Heart Rate',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '60-100', abnormal: '54', unit: 'bpm', ref: '60-100 bpm',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 }],
            },
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
            { date: '18 Feb', symptom: 'Fatigue', severity: '3/5' },
            { date: '26 Feb', symptom: 'Blurred Vision', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '64 %', bg: '#E8E8F8' },
            { label: 'Physical Activity:', value: '64 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
            { label: 'Stress Indicator:', value: 'Elevated', bg: '#F3F4F6' },
        ],
        medicalEngagement: [
            { label: 'Last endocrinologist visit: 1 week ago' },
            { label: 'Last endocrinologist visit: 2 months ago' },
        ],
        monitoring: ['HbA1c trend', 'RBC trend graph'],
    },
    Kidney: {
        emoji: '\u{1FAD8}',
        condition: 'Chronic Kidney Disease',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'eGFR', subtitle: 'Estimated Glomerular Filtration',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '-', abnormal: '52', unit: 'mL/min', ref: '> 90',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.28 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.35 }],
            },
            {
                name: 'Creatinine', subtitle: 'Serum Creatinine',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '0.7-1.3', abnormal: '1.8', unit: 'mg/dL', ref: '0.7 - 1.3',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.50 }, { x: 1, y: 0.42 }],
            },
        ],
        symptoms: [
            { date: '14 Feb', symptom: 'Swelling in legs', severity: '3/5' },
            { date: '20 Feb', symptom: 'Fatigue', severity: '3/5' },
        ],
        lifestyle: [
            { label: 'Protein Intake', value: 'Moderate', bg: '#FEFCE8' },
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { label: 'Last nephrologist visit: 2 weeks ago' },
        ],
        monitoring: ['eGFR trend', 'Creatinine trend'],
    },
    Liver: {
        emoji: '\u{1FAC1}',
        condition: 'Fatty Liver',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'ALT', subtitle: 'Alanine Aminotransferase',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '7-56', abnormal: '72', unit: 'U/L', ref: '7 - 56',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.38 }],
            },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Abdominal discomfort', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
            { label: 'Diet Pattern', value: 'High fat', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last hepatologist visit: 1 month ago' },
        ],
        monitoring: ['ALT trend', 'AST trend'],
    },
    Pancreas: {
        emoji: '\u{1F95E}',
        condition: 'Type 2 Diabetes',
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'HbA1c', subtitle: 'Glycated Haemoglobin',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '4-5.6', abnormal: '7.2', unit: '%', ref: '4.0 - 5.6',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 }],
            },
            {
                name: 'Fasting Glucose', subtitle: 'Blood Sugar',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '70-100', abnormal: '142', unit: 'mg/dL', ref: '70 - 100',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.42 }, { x: 0.66, y: 0.58 }, { x: 1, y: 0.45 }],
            },
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
            { date: '18 Feb', symptom: 'Fatigue', severity: '3/5' },
        ],
        lifestyle: [
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7' },
            { label: 'Physical Activity:', value: '64 %', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last endocrinologist visit: 1 week ago' },
        ],
        monitoring: ['HbA1c trend', 'Glucose trend'],
    },
    Lungs: {
        emoji: '\u{1FAC1}',
        condition: 'Mild Asthma',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Efficient',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'Oxygen Saturation', subtitle: 'SpO2',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '95-100', abnormal: '-', unit: '%', ref: '95 - 100',
                points: [{ x: 0, y: 0.35 }, { x: 0.18, y: 0.28 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.25 }, { x: 0.66, y: 0.20 }, { x: 1, y: 0.24 }],
            },
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Mild wheeze', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Physical Activity:', value: '70 %', bg: '#DCFCE7' },
            { label: 'Smoking', value: 'None', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { label: 'Last pulmonologist visit: 3 months ago' },
        ],
        monitoring: ['SpO2 trend', 'Peak flow trend'],
    },
    Brain: {
        emoji: '\u{1F9E0}',
        condition: 'Cognitive Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Active',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: [
            { date: '10 Feb', symptom: 'Mild headache', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '72 %', bg: '#E8E8F8' },
            { label: 'Stress Indicator:', value: 'Moderate', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last neurologist visit: 6 months ago' },
        ],
        monitoring: ['Cognitive score trend'],
    },
    Eye: {
        emoji: '\u{1F441}\u{FE0F}',
        condition: 'Eye Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: null,
        medicalEngagement: [
            { label: 'Last ophthalmologist visit: 4 months ago' },
        ],
        monitoring: ['Vision check trend'],
    },
    Skin: {
        emoji: '\u{1F9D1}',
        condition: 'Skin Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Healthy',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: [
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7' },
            { label: 'Sun Exposure', value: 'Moderate', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last dermatologist visit: 5 months ago' },
        ],
        monitoring: ['Skin health trend'],
    },
    Gut: {
        emoji: '\u{1F34E}',
        condition: 'Digestive Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Balanced',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: [
            { date: '15 Feb', symptom: 'Mild bloating', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Diet Pattern', value: 'Balanced', bg: '#DCFCE7' },
            { label: 'Fiber Intake', value: 'Adequate', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { label: 'Last gastroenterologist visit: 3 months ago' },
        ],
        monitoring: ['Gut health trend'],
    },
    Muscle: {
        emoji: '\u{1F4AA}',
        condition: 'Muscle Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Strong',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: [
            { label: 'Physical Activity:', value: '80 %', bg: '#DCFCE7' },
            { label: 'Protein Intake', value: 'Adequate', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { label: 'Last physiotherapy visit: 2 months ago' },
        ],
        monitoring: ['Muscle strength trend'],
    },
    'Musculo Skeletal': {
        emoji: '\u{1F9B4}',
        condition: 'Bone Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Stable',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'Vitamin D', subtitle: 'Serum Vitamin D',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '30-100', abnormal: '22', unit: 'ng/mL', ref: '30 - 100',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.45 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.32 }],
            },
        ],
        symptoms: [
            { date: '18 Feb', symptom: 'Joint stiffness', severity: '2/5' },
        ],
        lifestyle: [
            { label: 'Calcium Intake', value: 'Moderate', bg: '#FEFCE8' },
            { label: 'Physical Activity:', value: '55 %', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last orthopedic visit: 3 months ago' },
        ],
        monitoring: ['Vitamin D trend', 'Calcium trend'],
    },
    'Vascular System': {
        emoji: '\u{1FA78}',
        condition: 'Vascular Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'Total Cholesterol', subtitle: 'Lipid Panel',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '<200', abnormal: '218', unit: 'mg/dL', ref: '< 200',
                points: [{ x: 0, y: 0.68 }, { x: 0.18, y: 0.52 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.48 }, { x: 1, y: 0.40 }],
            },
        ],
        symptoms: null,
        lifestyle: [
            { label: 'Diet Pattern', value: 'Moderate fat', bg: '#FEFCE8' },
            { label: 'Physical Activity:', value: '60 %', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { label: 'Last cardiologist visit: 2 months ago' },
        ],
        monitoring: ['Cholesterol trend', 'Triglyceride trend'],
    },
    Reproductive: {
        emoji: '\u{1F9EC}',
        condition: 'Reproductive Health',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: null,
        medicalEngagement: [
            { label: 'Last specialist visit: 6 months ago' },
        ],
        monitoring: ['Hormone level trend'],
    },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const createCurvePath = (pts) => {
    const p = pts.map((pt) => ({ x: pt.x * CHART_W, y: pt.y * CHART_H }));
    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 1; i < p.length; i++) {
        const prev = p[i - 1];
        const curr = p[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
        d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
};

const createAreaPath = (pts) => {
    const curve = createCurvePath(pts);
    const lastX = pts[pts.length - 1].x * CHART_W;
    return `${curve} L ${lastX},${CHART_H} L 0,${CHART_H} Z`;
};

// ── Bio Chart ────────────────────────────────────────────────────────────────
const BioChart = ({ points, id }) => (
    <View style={styles.bioChartWrap}>
        <Svg width={CHART_W} height={CHART_H}>
            <Defs>
                <SvgLinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                    <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                </SvgLinearGradient>
            </Defs>
            <Line x1="0" y1={CHART_H * 0.10} x2={CHART_W} y2={CHART_H * 0.10} stroke="#EF4444" strokeWidth="0.5" />
            <Line x1="0" y1={CHART_H * 0.37} x2={CHART_W} y2={CHART_H * 0.37} stroke="#F59E0B" strokeWidth="0.5" strokeLinecap="round" />
            <Line x1="0" y1={CHART_H * 0.64} x2={CHART_W} y2={CHART_H * 0.64} stroke="#F59E0B" strokeWidth="0.5" strokeLinecap="round" />
            <Line x1="0" y1={CHART_H * 0.92} x2={CHART_W} y2={CHART_H * 0.92} stroke="#EF4444" strokeWidth="0.5" />
            <Path d={createAreaPath(points)} fill={`url(#${id})`} />
            <Path d={createCurvePath(points)} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
                <Circle key={i} cx={p.x * CHART_W} cy={p.y * CHART_H} r={ms(5)} fill="#3B82F6" stroke={whiteColor} strokeWidth={1.5} />
            ))}
        </Svg>
        <View style={styles.xLabels}>
            {X_LABELS.map((l, i) => <Text key={i} style={styles.xLabel}>{l}</Text>)}
        </View>
    </View>
);

// ── Bio Marker Card ──────────────────────────────────────────────────────────
const BioMarkerRow = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={[styles.bioCard, index > 0 && { marginTop: vs(12) }]}>
            <View style={styles.bioCardTop}>
                <View style={styles.bioNameWrap}>
                    <Text style={styles.bioName}>{item.name}</Text>
                </View>
            </View>
            <View style={styles.bioGrid}>
                <View style={styles.bioGridCell}>
                    <Text style={styles.bioGridHeader}>Normal</Text>
                    <Text style={styles.bioGridValue}>{item.normal}</Text>
                </View>
                <View style={[styles.bioGridCell, styles.bioGridCellBorder]}>
                    <Text style={styles.bioGridHeader}>Abnormal</Text>
                    <Text style={styles.bioGridValue}>{item.abnormal}</Text>
                </View>
                <View style={[styles.bioGridCell, styles.bioGridCellBorder]}>
                    <Text style={styles.bioGridHeader}>Unit of measure</Text>
                    <Text style={styles.bioGridValue}>{item.unit}</Text>
                </View>
            </View>
            <View style={styles.bioRefRow}>
                <Text style={styles.bioRefText}>Bio.Ref.Range  -  {item.ref}</Text>
                <TouchableOpacity style={styles.viewTrendBtn} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.viewTrendText}>View trend</Text>
                    <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#3B82F6" style={{ marginLeft: ms(4) }} />
                </TouchableOpacity>
            </View>
            {expanded && <BioChart points={item.points} id={`organ_bio_${index}`} />}
        </View>
    );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
const OrganDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const organName = route.params?.organ || 'Heart';

    const config = ORGAN_CONFIGS[organName] || ORGAN_CONFIGS.Heart;

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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{organName}</Text>
                </View>

                {/* ── Organ Summary Card ── */}
                <View style={styles.condCard}>
                    <View style={styles.organHeaderRow}>
                        <View style={styles.organIconCircle}>
                            <Text style={styles.organEmoji}>{config.emoji}</Text>
                        </View>
                        <View style={styles.organHeaderTextWrap}>
                            <Text style={styles.organHeaderName}>{organName}</Text>
                        </View>
                        <Text style={styles.condLastUpdate}>Last update {config.lastUpdate}</Text>
                    </View>
                    <Text style={styles.condLabel}>Condition</Text>
                    <Text style={styles.condSub}>{config.condition}</Text>
                    <View style={[styles.condBadge, { backgroundColor: '#FEF9EE' }]}>
                        <Text style={[styles.condBadgeText, { color: '#92400E' }]}>{config.stabilityLabel}</Text>
                    </View>
                    <View style={[styles.condBadge, { backgroundColor: '#EDFAF5', marginTop: vs(8) }]}>
                        <Text style={[styles.condBadgeText, { color: '#065F46' }]}>{config.statusLabel}</Text>
                    </View>
                </View>

                {/* ── Bio-Markers Movement ── */}
                {config.bioMarkers && config.bioMarkers.length > 0 && (
                    <>
                        <View style={styles.bioSectionHeader}>
                            <View>
                                <Text style={styles.bioSectionTitle}>Bio - Markers Movement</Text>
                                <Text style={styles.bioSectionTitle}>( Lab reports )</Text>
                            </View>
                            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('BioMarkersTrendScreen')}>
                                <Text style={styles.viewAllText}>View all trend</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bioCardsWrap}>
                            {config.bioMarkers.map((item, i) => (
                                <BioMarkerRow key={i} item={item} index={i} />
                            ))}
                        </View>
                    </>
                )}

                {/* ── Symptom Tracker ── */}
                {config.symptoms && config.symptoms.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Symptom Tracker</Text>
                        <View style={styles.sectionCard}>
                            <Text style={styles.cardBoldLabel}>Insight:</Text>
                            <Text style={styles.cardGrayDesc}>
                                Increased fatigue correlates with elevated glucose readings
                            </Text>
                            <Text style={styles.cardBoldLabel}>Recent Logs:</Text>
                            {config.symptoms.map((item, i) => (
                                <View key={i} style={styles.symptomRow}>
                                    <Text style={styles.symptomText}>
                                        {item.date} – {item.symptom}{'   '}
                                        <Text style={styles.symptomSeverity}>Severity {item.severity}</Text>
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* ── Lifestyle Influence ── */}
                {config.lifestyle && config.lifestyle.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Lifestyle Influence</Text>
                        <View style={styles.sectionCard}>
                            <Text style={styles.cardBoldLabel}>Lifestyle Influence Impact:</Text>
                            <Text style={styles.cardGrayDesc}>
                                Current lifestyle patterns are contributing to glucose variability
                            </Text>
                            <Text style={styles.cardBoldLabel}>Breakdown</Text>
                            {config.lifestyle.map((item, i) => (
                                <View key={i} style={[styles.lifestylePill, { backgroundColor: item.bg }]}>
                                    <Text style={styles.lifestylePillLabel}>{item.label}</Text>
                                    <Text style={styles.lifestylePillValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* ── Medical Engagement ── */}
                {config.medicalEngagement && config.medicalEngagement.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Medical Engagement</Text>
                        <View style={styles.sectionCard}>
                            {config.medicalEngagement.map((item, i) => (
                                <View key={i} style={styles.meRow}>
                                    <View style={styles.meDot} />
                                    <Text style={styles.meLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* ── Monitoring ── */}
                {config.monitoring && config.monitoring.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Monitoring</Text>
                        <View style={styles.monitorCard}>
                            {config.monitoring.map((item, i) => (
                                <View key={i} style={styles.monitorItem}>
                                    <View style={styles.monitorDot} />
                                    <Text style={styles.monitorText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <View style={{ height: vs(30) }} />
            </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default OrganDetailScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1 },
    scrollContent: { paddingBottom: vs(40) },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(16),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { flex: 1, fontFamily: bold, fontSize: ms(17), color: whiteColor, marginLeft: ms(12) },

    // Organ Summary Card
    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    organHeaderRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: vs(12),
    },
    organIconCircle: {
        width: ms(44), height: ms(44), borderRadius: ms(22),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
    },
    organEmoji: { fontSize: ms(24) },
    organHeaderTextWrap: { flex: 1, marginLeft: ms(10) },
    organHeaderName: { fontFamily: bold, fontSize: ms(16), color: blackColor },
    condLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(4) },
    condLastUpdate: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' },
    condSub: { fontFamily: bold, fontSize: ms(14), color: '#374151', marginBottom: vs(14) },
    condBadge: {
        alignSelf: 'flex-start', paddingHorizontal: ms(12),
        paddingVertical: vs(6), borderRadius: ms(10),
    },
    condBadgeText: { fontFamily: bold, fontSize: ms(12) },

    // Bio-Markers section
    bioSectionHeader: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', paddingHorizontal: ms(20), marginBottom: vs(12),
    },
    bioSectionTitle: { fontFamily: bold, fontSize: ms(16), color: blackColor, lineHeight: ms(22) },
    viewAllBtn: {
        borderWidth: 1.5, borderColor: '#3B82F6', borderRadius: ms(20),
        paddingHorizontal: ms(14), paddingVertical: vs(6),
    },
    viewAllText: { fontFamily: bold, fontSize: ms(11), color: '#3B82F6' },
    bioCardsWrap: { paddingHorizontal: ms(20), marginBottom: vs(16) },
    bioCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16), marginBottom: ms(10) },
    bioCardTop: { marginBottom: vs(10) },
    bioNameWrap: { flex: 1 },
    bioName: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    bioGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: ms(12), padding: ms(12), marginBottom: vs(12) },
    bioGridCell: { flex: 1, alignItems: 'center' },
    bioGridCellBorder: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    bioGridHeader: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4) },
    bioGridValue: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    bioRefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bioRefText: { fontFamily: regular, fontSize: ms(12), color: '#374151' },
    viewTrendBtn: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#3B82F6', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    viewTrendText: { fontFamily: bold, fontSize: ms(11), color: '#3B82F6' },
    bioChartWrap: { marginTop: vs(14) },
    xLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8), paddingHorizontal: ms(2) },
    xLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },

    // Shared section styles
    sectionTitle: {
        fontFamily: bold, fontSize: ms(16), color: blackColor,
        paddingHorizontal: ms(20), marginBottom: vs(12),
    },
    sectionCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(16),
    },
    cardBoldLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(6) },
    cardGrayDesc: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(19), marginBottom: vs(14) },

    // Symptom
    symptomRow: { paddingVertical: vs(4) },
    symptomText: { fontFamily: regular, fontSize: ms(13), color: '#374151' },
    symptomSeverity: { fontFamily: bold, fontSize: ms(13), color: blackColor },

    // Lifestyle
    lifestylePill: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: ms(30), paddingHorizontal: ms(16), paddingVertical: vs(12), marginBottom: vs(8),
    },
    lifestylePillLabel: { fontFamily: regular, fontSize: ms(13), color: '#374151' },
    lifestylePillValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },

    // Medical Engagement
    meRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    meDot: { width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: blackColor, marginRight: ms(10) },
    meLabel: { fontFamily: regular, fontSize: ms(13), color: '#374151', flex: 1 },

    // Monitoring
    monitorCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(16),
        flexDirection: 'row', flexWrap: 'wrap', gap: ms(16),
    },
    monitorItem: { flexDirection: 'row', alignItems: 'center' },
    monitorDot: { width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: blackColor, marginRight: ms(8) },
    monitorText: { fontFamily: bold, fontSize: ms(13), color: blackColor },
});
