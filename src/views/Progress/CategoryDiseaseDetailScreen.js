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

// ── All condition configs ─────────────────────────────────────────────────────
const CONDITION_CONFIGS = {
    Diabetes: {
        subType: 'Type 2 Diabetes',
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Total RBC Count', subtitle: 'Electrical Impedance',
                statusCode: 'H**', statusLabel: 'Critical High', statusColor: '#EF4444',
                normal: '-', abnormal: '650', unit: 'g/dL', ref: '100 - 500',
                points: [{ x: 0, y: 0.90 }, { x: 0.18, y: 0.70 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.60 }, { x: 0.66, y: 0.75 }, { x: 1, y: 0.50 }],
            },
            {
                name: 'Total RBC Count', subtitle: 'Electrical Impedance',
                statusCode: 'H', statusLabel: 'Abnormal High', statusColor: '#F59E0B',
                normal: '-', abnormal: '650', unit: 'g/dL', ref: '100 - 500',
                points: [{ x: 0, y: 0.88 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.65 }, { x: 0.66, y: 0.50 }, { x: 0.83, y: 0.70 }, { x: 1, y: 0.55 }],
            },
            {
                name: 'HbA1c', subtitle: 'Glycated Haemoglobin',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '5.4', abnormal: '-', unit: '%', ref: '4.0 - 5.6',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 }],
            },
        ],
        organs: [
            { name: 'Pancreas', emoji: '🥞', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
            { name: 'Heart', emoji: '🫀', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
            { name: 'Kidneys', emoji: '🫘', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Microalbbumin', showArrow: true }, { name: 'HbA1c', showArrow: false }] },
            { name: 'Eyes', emoji: '👁️', statusLabel: 'Stable', statusBg: '#DCFCE7', statusColor: '#065F46', contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '64 %', bg: '#E8E8F8' },
            { label: 'Physical Activity:', value: '64 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
            { label: 'Stress Indicator:', value: 'Elevated', bg: '#F3F4F6' },
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
            { date: '18 Feb', symptom: 'Fatigue', severity: '3/5' },
            { date: '26 Feb', symptom: 'Blurred Vision', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '15 Feb 2026' }, { label: 'BP: 148/92 mmHg', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Amlodipine', value: 'Duration: 3 months' }, { label: 'Dosage: 5 mg', value: '' }] },
            { title: 'Past surgeries', rows: [{ label: 'Appendectomy', value: '12 Aug 2021' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lower Back Physiotherapy', value: 'Jan 2025 – Feb 2025' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lipid Profile', value: '10 Feb 2026' }, { label: 'Total Cholesterol: 210 mg/dL', value: '' }] },
        ],
        monitoring: ['HbA1c trend', 'RBC trend graph'],
    },
    Hypertension: {
        subType: 'Essential Hypertension',
        stabilityLabel: 'Stability: Unstable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Systolic BP', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '-', abnormal: '145', unit: 'mmHg', ref: '90 - 120',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.45 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.40 }],
            },
        ],
        organs: [
            { name: 'Heart', emoji: '🫀', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Blood Pressure', showArrow: true }] },
            { name: 'Kidneys', emoji: '🫘', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Creatinine', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Salt Intake', value: 'High', bg: '#FEE2E2' },
            { label: 'Physical Activity:', value: '45 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'High', bg: '#FEE2E2' },
        ],
        symptoms: [
            { date: '15 Feb', symptom: 'Headache', severity: '3/5' },
            { date: '20 Feb', symptom: 'Dizziness', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Checkup', value: '10 Feb 2026' }, { label: 'BP: 150/95 mmHg', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Losartan', value: 'Duration: 6 months' }, { label: 'Dosage: 50 mg', value: '' }] },
        ],
        monitoring: ['BP trend', 'Heart rate graph'],
    },
    Thyroid: {
        subType: 'Hypothyroidism',
        stabilityLabel: 'Stability: Critical',
        statusLabel: 'Status: Needs Attention',
        bioMarkers: [
            {
                name: 'TSH', subtitle: 'Thyroid Stimulating Hormone',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '-', abnormal: '8.2', unit: 'mIU/L', ref: '0.4 - 4.0',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.45 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '50 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'Iodine deficient', bg: '#FEE2E2' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Fatigue', severity: '4/5' },
            { date: '22 Feb', symptom: 'Weight Gain', severity: '3/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Endocrinologist Consultation', value: '8 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Levothyroxine', value: 'Duration: Ongoing' }, { label: 'Dosage: 50 mcg', value: '' }] },
        ],
        monitoring: ['TSH trend', 'T3/T4 trend graph'],
    },
    Fever: {
        subType: 'Acute Fever',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Monitoring',
        bioMarkers: null,
        organs: null,
        lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'Body Ache', severity: '3/5' },
            { date: '14 Feb', symptom: 'Chills', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Physician', value: '12 Feb 2026' }, { label: 'Temp: 101.2°F', value: '' }] },
        ],
        monitoring: ['Temperature trend'],
    },
    Infection: {
        subType: 'Bacterial Infection',
        stabilityLabel: 'Stability: Unstable',
        statusLabel: 'Status: Under Treatment',
        bioMarkers: [
            {
                name: 'WBC Count', subtitle: 'White Blood Cells',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '-', abnormal: '12400', unit: '/µL', ref: '4000 - 11000',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.30 }],
            },
        ],
        organs: null,
        lifestyle: null,
        symptoms: [
            { date: '10 Feb', symptom: 'Fever', severity: '3/5' },
            { date: '12 Feb', symptom: 'Swelling', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Infectious Disease Specialist', value: '10 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Amoxicillin', value: 'Duration: 7 days' }, { label: 'Dosage: 500 mg', value: '' }] },
        ],
        monitoring: ['WBC trend', 'CRP trend'],
    },
    Allergy: {
        subType: 'Seasonal Allergy',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Monitoring',
        bioMarkers: null,
        organs: null,
        lifestyle: null,
        symptoms: [
            { date: '15 Feb', symptom: 'Sneezing', severity: '2/5' },
            { date: '18 Feb', symptom: 'Itchy Eyes', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Allergist Consultation', value: '14 Feb 2026' }] },
        ],
        monitoring: ['IgE trend'],
    },
    'Chronic kidney disease': {
        subType: 'CKD Stage 3',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'eGFR', subtitle: 'Estimated Glomerular Filtration',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '-', abnormal: '52', unit: 'mL/min', ref: '> 90',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.28 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: [
            { name: 'Kidneys', emoji: '🫘', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Creatinine', showArrow: true }, { name: 'eGFR', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Protein Intake', value: 'Moderate', bg: '#FEFCE8' },
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7' },
        ],
        symptoms: [
            { date: '14 Feb', symptom: 'Swelling in legs', severity: '3/5' },
            { date: '20 Feb', symptom: 'Fatigue', severity: '3/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Nephrologist Consultation', value: '12 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Telmisartan', value: 'Duration: Ongoing' }, { label: 'Dosage: 40 mg', value: '' }] },
        ],
        monitoring: ['eGFR trend', 'Creatinine trend'],
    },
    "Alzheimer's disease": {
        subType: 'Early Onset',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Amyloid beta (Aβ42)', subtitle: 'CSF Biomarker',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '-', abnormal: '380', unit: 'pg/mL', ref: '500 - 1200',
                points: [{ x: 0, y: 0.80 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.35 }, { x: 1, y: 0.25 }],
            },
        ],
        organs: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '55 %', bg: '#FEFCE8' },
            { label: 'Social Engagement', value: 'Low', bg: '#FEE2E2' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Memory Lapses', severity: '3/5' },
            { date: '18 Feb', symptom: 'Confusion', severity: '2/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Neurologist Consultation', value: '8 Feb 2026' }] },
        ],
        monitoring: ['Cognitive score trend'],
    },
    Pneumonia: {
        subType: 'Community-Acquired',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Treatment',
        bioMarkers: [
            {
                name: 'Oxygen Saturation', subtitle: 'SpO2',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#EF4444',
                normal: '-', abnormal: '88', unit: '%', ref: '95 - 100',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.25 }, { x: 0.66, y: 0.38 }, { x: 1, y: 0.30 }],
            },
        ],
        organs: [
            { name: 'Lungs', emoji: '🫁', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'SpO2', showArrow: false }, { name: 'CRP', showArrow: true }] },
        ],
        lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'Cough', severity: '4/5' },
            { date: '15 Feb', symptom: 'Shortness of Breath', severity: '3/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Pulmonologist Consultation', value: '12 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Azithromycin', value: 'Duration: 5 days' }, { label: 'Dosage: 500 mg', value: '' }] },
        ],
        monitoring: ['SpO2 trend', 'CRP trend'],
    },
    Sepsis: {
        subType: 'Severe Sepsis',
        stabilityLabel: 'Stability: Critical',
        statusLabel: 'Status: Under Treatment',
        bioMarkers: [
            {
                name: 'Lactate', subtitle: 'Blood Lactate',
                statusCode: 'H**', statusLabel: 'Critical High', statusColor: '#EF4444',
                normal: '-', abnormal: '4.0', unit: 'mmol/L', ref: '0.5 - 2.2',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.18 }, { x: 0.50, y: 0.25 }, { x: 0.66, y: 0.38 }, { x: 1, y: 0.28 }],
            },
        ],
        organs: null,
        lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'High Fever', severity: '5/5' },
            { date: '13 Feb', symptom: 'Confusion', severity: '4/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'ICU Admission', value: '12 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: IV Antibiotics', value: 'Duration: Ongoing' }] },
        ],
        monitoring: ['Lactate trend', 'MAP trend'],
    },
    Malnutrition: {
        subType: 'Protein-Energy Malnutrition',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Serum Albumin', subtitle: 'Protein Marker',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '-', abnormal: '2.8', unit: 'g/dL', ref: '3.5 - 5.0',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.18 }, { x: 0.50, y: 0.22 }, { x: 0.66, y: 0.30 }, { x: 1, y: 0.22 }],
            },
        ],
        organs: null,
        lifestyle: [
            { label: 'Caloric Intake', value: 'Low', bg: '#FEE2E2' },
            { label: 'Diet Pattern', value: 'Deficient', bg: '#FEE2E2' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Weight Loss', severity: '4/5' },
            { date: '18 Feb', symptom: 'Weakness', severity: '3/5' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Nutritionist Consultation', value: '8 Feb 2026' }] },
        ],
        monitoring: ['BMI trend', 'Albumin trend'],
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
                    <Text style={styles.bioSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.bioTopRight}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.bioCodeBadge}>
                            <Text style={styles.bioCodeText}>{item.statusCode}</Text>
                        </View>
                        <Text style={{ fontSize: ms(16), marginLeft: ms(4) }}>🚩</Text>
                    </View>
                    <Text style={[styles.bioStatusLabel, { color: item.statusColor }]}>{item.statusLabel}</Text>
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
                <Text style={styles.bioRefText}>Bio.Ref.Range  –  {item.ref}</Text>
                <TouchableOpacity style={styles.viewTrendBtn} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.viewTrendText}>View trend</Text>
                    <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#3B82F6" style={{ marginLeft: ms(4) }} />
                </TouchableOpacity>
            </View>
            {expanded && <BioChart points={item.points} id={`bio_${index}`} />}
        </View>
    );
};

// ── Organ Card (full width) ──────────────────────────────────────────────────
const OrganCard = ({ item }) => (
    <View style={styles.organCard}>
        <View style={styles.organTopRow}>
            <View style={styles.organIconCircle}>
                <Text style={styles.organEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.organName}>{item.name}</Text>
        </View>
        <View style={styles.organStatusRow}>
            <Text style={styles.organStatusLabel}>Status :   </Text>
            <View style={[styles.organStatusBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.organStatusText, { color: item.statusColor }]}>{item.statusLabel}</Text>
            </View>
        </View>
        <Text style={styles.organContribTitle}>Contributors</Text>
        <View style={styles.organContribWrap}>
            {item.contributors.map((c, i) => (
                <View key={i} style={styles.organContribChip}>
                    <Text style={styles.organContribName}>{c.name}</Text>
                    {c.showArrow && <Icon type={Icons.Ionicons} name="arrow-up" size={ms(12)} color="#374151" style={{ marginLeft: ms(4) }} />}
                </View>
            ))}
        </View>
    </View>
);

// ── Main Screen ──────────────────────────────────────────────────────────────
const CategoryDiseaseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};
    const category = route.params?.category || 'Chronic';

    const conditionName = condition.name || 'Diabetes';
    const config = CONDITION_CONFIGS[conditionName] || CONDITION_CONFIGS.Diabetes;

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
                    <Text style={styles.headerTitle}>{conditionName}</Text>
                    <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active</Text>
                    </View>
                </View>

                {/* ── Condition Summary Card ── */}
                <View style={styles.condCard}>
                    <Text style={styles.condLabel}>Condition</Text>
                    <View style={styles.condNameRow}>
                        <Text style={styles.condTitle} numberOfLines={2}>{conditionName}</Text>
                        <Text style={styles.condLastUpdate}>Last update {condition.date || '12 Jan, 12:30 PM'}</Text>
                    </View>
                    <Text style={styles.condSub}>{config.subType}</Text>
                    <View style={[styles.condBadge, { backgroundColor: '#FEF9EE' }]}>
                        <Text style={[styles.condBadgeText, { color: '#92400E' }]}>{config.stabilityLabel}</Text>
                    </View>
                    <View style={[styles.condBadge, { backgroundColor: '#EDFAF5', marginTop: vs(8) }]}>
                        <Text style={[styles.condBadgeText, { color: '#065F46' }]}>{config.statusLabel}</Text>
                    </View>
                </View>

                {/* ── Organs Health Status ── */}
                {config.organs && config.organs.length > 0 && (
                    <View style={styles.organsWrap}>
                        {config.organs.map((item, i) => (
                            <OrganCard key={i} item={item} />
                        ))}
                    </View>
                )}

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
                            {config.medicalEngagement.map((section, si) => (
                                <View key={si} style={si === 0 ? styles.meFirstSection : styles.meNestedCard}>
                                    <Text style={styles.meSectionTitle}>{section.title}</Text>
                                    {section.rows.map((row, ri) => (
                                        <View key={ri} style={styles.meRow}>
                                            <Text style={styles.meLabel}>{row.label}</Text>
                                            {row.value !== '' && (
                                                <View style={styles.meDotValueRow}>
                                                    <View style={styles.meDot} />
                                                    <Text style={styles.meValue}>{row.value}</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}
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

export default CategoryDiseaseDetailScreen;

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
    activeBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#DCFCE7', paddingHorizontal: ms(12),
        paddingVertical: vs(5), borderRadius: ms(14),
    },
    activeDot: { width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: '#16A34A', marginRight: ms(5) },
    activeText: { fontFamily: bold, fontSize: ms(11), color: '#16A34A' },

    // Condition card
    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    condLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(8) },
    condNameRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: vs(4),
    },
    condTitle: { fontFamily: bold, fontSize: ms(18), color: blackColor, flex: 1, marginRight: ms(8) },
    condLastUpdate: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(4) },
    condSub: { fontFamily: bold, fontSize: ms(13), color: '#374151', marginBottom: vs(14) },
    condBadge: {
        alignSelf: 'flex-start', paddingHorizontal: ms(12),
        paddingVertical: vs(6), borderRadius: ms(10),
    },
    condBadgeText: { fontFamily: bold, fontSize: ms(12) },

    // Organs
    organsWrap: { paddingHorizontal: ms(20), marginBottom: vs(16), gap: vs(12) },
    organCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16) },
    organTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(14) },
    organIconCircle: {
        width: ms(52), height: ms(52), borderRadius: ms(26),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    organEmoji: { fontSize: ms(28) },
    organName: { fontFamily: bold, fontSize: ms(16), color: blackColor, flex: 1 },
    organStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(12) },
    organStatusLabel: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    organStatusBadge: { paddingHorizontal: ms(12), paddingVertical: vs(4), borderRadius: ms(10) },
    organStatusText: { fontFamily: bold, fontSize: ms(11) },
    organContribTitle: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(8) },
    organContribWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10) },
    organContribChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingHorizontal: ms(14), paddingVertical: vs(6),
    },
    organContribName: { fontFamily: regular, fontSize: ms(12), color: '#374151' },

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
    bioCardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(14) },
    bioNameWrap: { flex: 1 },
    bioName: {
        fontFamily: bold, fontSize: ms(12), color: whiteColor,
        backgroundColor: 'green', paddingVertical: ms(6), paddingHorizontal: ms(10),
        borderRadius: ms(5), alignSelf: 'flex-start',
    },
    bioSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    bioTopRight: { alignItems: 'flex-end' },
    bioCodeBadge: { backgroundColor: '#F3F4F6', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    bioCodeText: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    bioStatusLabel: { fontFamily: bold, fontSize: ms(12), marginTop: vs(4) },
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
    meFirstSection: { marginBottom: vs(10) },
    meNestedCard: {
        backgroundColor: '#F3F4F6', borderRadius: ms(12),
        padding: ms(14), marginBottom: vs(10),
    },
    meSectionTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, marginBottom: vs(8) },
    meRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(4) },
    meLabel: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1 },
    meDotValueRow: { flexDirection: 'row', alignItems: 'center' },
    meDot: { width: ms(5), height: ms(5), borderRadius: ms(3), backgroundColor: blackColor, marginRight: ms(6) },
    meValue: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },

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
