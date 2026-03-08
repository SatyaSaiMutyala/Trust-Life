import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path, Circle, Line, Defs,
    LinearGradient as SvgLinearGradient, Stop,
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

const SYMPTOM_CONFIGS = {
    Headache: {
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: 'Last update 12 Jan, 12:30 PM',
        symptoms: {
            insight: 'Increased Headache correlates with elevated glucose readings',
            logs: [
                { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
                { date: '18 Feb', symptom: 'Fatigue', severity: '3/5' },
                { date: '26 Feb', symptom: 'Blurred Vision', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Blood Pressure', subtitle: 'Sphygmomanometer',
                statusCode: 'H**', statusLabel: 'Critical High', statusColor: '#EF4444',
                normal: '90/60 - 120/80', abnormal: '130/80', unit: 'mmHg', ref: '100 - 500',
                points: [{ x: 0, y: 0.90 }, { x: 0.18, y: 0.70 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.60 }, { x: 0.66, y: 0.75 }, { x: 1, y: 0.50 }],
            },
            {
                name: 'Hemoglobin (Hb)', subtitle: 'Complete Blood Count',
                statusCode: 'H**', statusLabel: 'Critical High', statusColor: '#EF4444',
                normal: '13 - 17', abnormal: '130/80', unit: 'g/dL', ref: '100 - 500',
                points: [{ x: 0, y: 0.88 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.65 }, { x: 0.66, y: 0.50 }, { x: 0.83, y: 0.70 }, { x: 1, y: 0.55 }],
            },
            {
                name: 'Blood Glucose', subtitle: 'Fasting Blood Sugar',
                statusCode: 'H', statusLabel: 'Abnormal High', statusColor: '#F59E0B',
                normal: '-', abnormal: '650', unit: 'g/dL', ref: '100 - 500',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.40 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.38 }],
            },
        ],
        organs: [
            { name: 'Brain', emoji: '\uD83E\uDDE0', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '64 %', bg: '#E8E8F8' },
            { label: 'Physical Activity:', value: '64 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
            { label: 'Stress Indicator:', value: 'Elevated', bg: '#F3F4F6' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '15 Feb 2026' }, { label: 'BP: 148/92 mmHg', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Amlodipine', value: 'Duration: 3 months' }, { label: 'Dosage: 5 mg', value: '' }] },
            { title: 'Past surgeries', rows: [{ label: 'Appendectomy', value: '12 Aug 2021' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lower Back Physiotherapy', value: 'Jan 2025 \u2013 Feb 2025' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lipid Profile', value: '10 Feb 2026' }, { label: 'Total Cholesterol: 210 mg/dL', value: '' }] },
        ],
        monitoring: ['Glucose levels', 'HbA1c'],
    },
    Fatigue: {
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: 'Last update 10 Jan, 09:00 AM',
        symptoms: {
            insight: 'Fatigue episodes linked to poor sleep quality and low hemoglobin',
            logs: [
                { date: '10 Feb', symptom: 'Excessive Tiredness', severity: '4/5' },
                { date: '15 Feb', symptom: 'Muscle Weakness', severity: '3/5' },
                { date: '22 Feb', symptom: 'Drowsiness', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Hemoglobin (Hb)', subtitle: 'Complete Blood Count',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '13 - 17', abnormal: '10.2', unit: 'g/dL', ref: '13 - 17',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.35 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.50 }, { x: 1, y: 0.42 }],
            },
            {
                name: 'TSH', subtitle: 'Thyroid Stimulating Hormone',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '-', abnormal: '6.8', unit: 'mIU/L', ref: '0.4 - 4.0',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.45 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.52 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '48 %', bg: '#FEE2E2' },
            { label: 'Physical Activity:', value: '30 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'High', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Physician', value: '10 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Iron Supplements', value: 'Duration: 3 months' }, { label: 'Dosage: 65 mg', value: '' }] },
        ],
        monitoring: ['Hemoglobin trend', 'TSH trend'],
    },
    Nausea: {
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Monitoring',
        lastUpdate: 'Last update 8 Jan, 11:00 AM',
        symptoms: {
            insight: 'Nausea episodes correlate with elevated liver enzymes',
            logs: [
                { date: '8 Feb', symptom: 'Morning Nausea', severity: '3/5' },
                { date: '14 Feb', symptom: 'Loss of Appetite', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'ALT', subtitle: 'Liver Function Test',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '-', abnormal: '62', unit: 'U/L', ref: '7 - 56',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.42 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: [
            { name: 'Gut', emoji: '\uD83E\uDE78', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'ALT', showArrow: true }, { name: 'Bilirubin', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Diet Pattern', value: 'Irregular meals', bg: '#FEE2E2' },
            { label: 'Alcohol', value: 'Moderate', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Gastroenterologist', value: '8 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Omeprazole', value: 'Duration: 1 month' }, { label: 'Dosage: 20 mg', value: '' }] },
        ],
        monitoring: ['ALT trend', 'Bilirubin trend'],
    },
    'Joint Pain': {
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: 'Last update 14 Jan, 02:00 PM',
        symptoms: {
            insight: 'Joint pain worsens with physical inactivity and elevated uric acid',
            logs: [
                { date: '14 Feb', symptom: 'Knee Stiffness', severity: '3/5' },
                { date: '20 Feb', symptom: 'Swollen Joints', severity: '3/5' },
                { date: '25 Feb', symptom: 'Morning Stiffness', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Uric Acid', subtitle: 'Metabolic Panel',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '-', abnormal: '8.5', unit: 'mg/dL', ref: '3.5 - 7.2',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.58 }, { x: 1, y: 0.45 }],
            },
            {
                name: 'CRP', subtitle: 'C-Reactive Protein',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '-', abnormal: '12', unit: 'mg/L', ref: '< 10',
                points: [{ x: 0, y: 0.68 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.48 }, { x: 1, y: 0.38 }],
            },
        ],
        organs: [
            { name: 'Musculo Skeletal', emoji: '\uD83E\uDDB4', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Uric Acid', showArrow: true }, { name: 'CRP', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Physical Activity:', value: '25 %', bg: '#FEE2E2' },
            { label: 'Diet Pattern', value: 'High purine diet', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'Moderate', bg: '#F3F4F6' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Rheumatologist Consultation', value: '14 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Allopurinol', value: 'Duration: 6 months' }, { label: 'Dosage: 100 mg', value: '' }] },
        ],
        monitoring: ['Uric Acid trend', 'CRP trend'],
    },
    Dizziness: {
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Monitoring',
        lastUpdate: 'Last update 15 Jan, 10:30 AM',
        symptoms: {
            insight: 'Dizziness episodes linked to blood pressure fluctuations',
            logs: [
                { date: '15 Feb', symptom: 'Lightheadedness', severity: '3/5' },
                { date: '20 Feb', symptom: 'Vertigo', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Blood Pressure', subtitle: 'Sphygmomanometer',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '90/60 - 120/80', abnormal: '145/92', unit: 'mmHg', ref: '90 - 120',
                points: [{ x: 0, y: 0.72 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.48 }, { x: 0.66, y: 0.62 }, { x: 1, y: 0.42 }],
            },
        ],
        organs: [
            { name: 'Brain', emoji: '\uD83E\uDDE0', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Blood Pressure', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '55 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'Elevated', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Neurologist Consultation', value: '15 Feb 2026' }] },
        ],
        monitoring: ['BP trend', 'Heart rate trend'],
    },
    'Back Pain': {
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: 'Last update 11 Jan, 03:00 PM',
        symptoms: {
            insight: 'Back pain correlates with sedentary lifestyle and poor posture',
            logs: [
                { date: '11 Feb', symptom: 'Lower Back Ache', severity: '3/5' },
                { date: '18 Feb', symptom: 'Stiffness', severity: '3/5' },
                { date: '24 Feb', symptom: 'Radiating Pain', severity: '2/5' },
            ],
        },
        bioMarkers: null,
        organs: [
            { name: 'Musculo Skeletal', emoji: '\uD83E\uDDB4', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Posture', showArrow: false }, { name: 'Sedentary', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Physical Activity:', value: '20 %', bg: '#FEE2E2' },
            { label: 'Stress Indicator:', value: 'Moderate', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Orthopedic Consultation', value: '11 Feb 2026' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lower Back Physiotherapy', value: 'Jan 2026 \u2013 Feb 2026' }] },
        ],
        monitoring: ['Pain severity trend'],
    },
    'Chest Tightness': {
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Needs Attention',
        lastUpdate: 'Last update 13 Jan, 04:00 PM',
        symptoms: {
            insight: 'Chest tightness linked to elevated blood pressure and stress',
            logs: [
                { date: '13 Feb', symptom: 'Chest Pressure', severity: '3/5' },
                { date: '19 Feb', symptom: 'Palpitations', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Blood Pressure', subtitle: 'Sphygmomanometer',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '90/60 - 120/80', abnormal: '150/95', unit: 'mmHg', ref: '90 - 120',
                points: [{ x: 0, y: 0.78 }, { x: 0.18, y: 0.58 }, { x: 0.33, y: 0.32 }, { x: 0.50, y: 0.45 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.48 }],
            },
            {
                name: 'Troponin', subtitle: 'Cardiac Marker',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '0.01', abnormal: '-', unit: 'ng/mL', ref: '< 0.04',
                points: [{ x: 0, y: 0.50 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.30 }],
            },
        ],
        organs: [
            { name: 'Heart', emoji: '\uD83E\uDEC0', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Blood Pressure', showArrow: true }, { name: 'Stress', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Physical Activity:', value: '35 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'High', bg: '#FEE2E2' },
            { label: 'Sleep consistency', value: '50 %', bg: '#E8E8F8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '13 Feb 2026' }, { label: 'ECG: Normal sinus rhythm', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Atenolol', value: 'Duration: 3 months' }, { label: 'Dosage: 25 mg', value: '' }] },
        ],
        monitoring: ['BP trend', 'Troponin trend'],
    },
    'Shortness of Breath': {
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        lastUpdate: 'Last update 16 Jan, 01:00 PM',
        symptoms: {
            insight: 'Shortness of breath correlates with low SpO2 and reduced lung capacity',
            logs: [
                { date: '16 Feb', symptom: 'Breathlessness on exertion', severity: '3/5' },
                { date: '22 Feb', symptom: 'Wheezing', severity: '2/5' },
            ],
        },
        bioMarkers: [
            {
                name: 'Oxygen Saturation', subtitle: 'SpO2',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#EF4444',
                normal: '-', abnormal: '92', unit: '%', ref: '95 - 100',
                points: [{ x: 0, y: 0.68 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.42 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: [
            { name: 'Lungs', emoji: '\uD83E\uDEC1', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'SpO2', showArrow: false }, { name: 'PFT', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Physical Activity:', value: '30 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'Moderate', bg: '#F3F4F6' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Pulmonologist Consultation', value: '16 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Salbutamol Inhaler', value: 'Duration: As needed' }] },
        ],
        monitoring: ['SpO2 trend', 'PFT trend'],
    },
};

// Helpers
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
                        <Text style={{ fontSize: ms(16), marginLeft: ms(4) }}>{'\uD83D\uDEA9'}</Text>
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
                <Text style={styles.bioRefText}>Bio.Ref.Range  \u2013  {item.ref}</Text>
                <TouchableOpacity style={styles.viewTrendBtn} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.viewTrendText}>View trend</Text>
                    <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#3B82F6" style={{ marginLeft: ms(4) }} />
                </TouchableOpacity>
            </View>
            {expanded && <BioChart points={item.points} id={`sym_bio_${index}`} />}
        </View>
    );
};

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

const SymptomDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const symptomName = route.params?.symptom || 'Headache';
    const config = SYMPTOM_CONFIGS[symptomName] || SYMPTOM_CONFIGS.Headache;

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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{symptomName}</Text>
                    </View>

                    {/* Condition Summary Card */}
                    <View style={styles.condCard}>
                        <Text style={styles.condLabel}>Condition</Text>
                        <View style={styles.condNameRow}>
                            <Text style={styles.condTitle}>{symptomName}</Text>
                            <Text style={styles.condLastUpdate}>{config.lastUpdate}</Text>
                        </View>
                        <View style={[styles.condBadge, { backgroundColor: '#FEF9EE' }]}>
                            <Text style={[styles.condBadgeText, { color: '#92400E' }]}>{config.stabilityLabel}</Text>
                        </View>
                        <View style={[styles.condBadge, { backgroundColor: '#EDFAF5', marginTop: vs(8) }]}>
                            <Text style={[styles.condBadgeText, { color: '#065F46' }]}>{config.statusLabel}</Text>
                        </View>
                    </View>

                    {/* Symptom */}
                    {config.symptoms && (
                        <>
                            <Text style={styles.sectionTitle}>Symptom</Text>
                            <View style={styles.sectionCard}>
                                <Text style={styles.cardBoldLabel}>Insight:</Text>
                                <Text style={styles.cardGrayDesc}>{config.symptoms.insight}</Text>
                                <Text style={styles.cardBoldLabel}>Recent Logs:</Text>
                                {config.symptoms.logs.map((item, i) => (
                                    <View key={i} style={styles.symptomRow}>
                                        <Text style={styles.symptomText}>
                                            {item.date} \u2013 {item.symptom}{'   '}
                                            <Text style={styles.symptomSeverity}>Severity {item.severity}</Text>
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Bio-Markers Movement */}
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

                    {/* Organs */}
                    {config.organs && config.organs.length > 0 && (
                        <View style={styles.organsWrap}>
                            {config.organs.map((item, i) => (
                                <OrganCard key={i} item={item} />
                            ))}
                        </View>
                    )}

                    {/* Lifestyle Influence */}
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

                    {/* Medical Engagement */}
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

                    {/* Monitoring */}
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

export default SymptomDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1 },
    scrollContent: { paddingBottom: vs(40) },

    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(16),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { flex: 1, fontFamily: bold, fontSize: ms(17), color: whiteColor, marginLeft: ms(12) },

    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    condLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(8) },
    condNameRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: vs(14),
    },
    condTitle: { fontFamily: bold, fontSize: ms(18), color: blackColor, flex: 1, marginRight: ms(8) },
    condLastUpdate: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(4) },
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

    // Bio-Markers
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

    // Shared section
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
