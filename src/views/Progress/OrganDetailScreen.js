import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
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

// ── Stability / Status badge helpers ─────────────────────────────────────────
const getStabilityStyle = (label) => {
    if (!label) return { bg: '#F3F4F6', color: '#6B7280' };
    const l = label.toLowerCase();
    if (l.includes('escalation') || l.includes('declining')) return { bg: '#FEF2F2', color: '#DC2626' };
    if (l.includes('watch') || l.includes('mild')) return { bg: '#FEF9C3', color: '#92400E' };
    return { bg: '#DCFCE7', color: '#065F46' };
};

const getStatusStyle = (label) => {
    if (!label) return { bg: '#F3F4F6', color: '#6B7280' };
    const l = label.toLowerCase();
    if (l.includes('critical') || l.includes('stress')) return { bg: '#FEF2F2', color: '#DC2626' };
    if (l.includes('monitoring') || l.includes('watch')) return { bg: '#FEF9C3', color: '#92400E' };
    return { bg: '#EDFAF5', color: '#065F46' };
};

// ── Organ configs ────────────────────────────────────────────────────────────
const ORGAN_CONFIGS = {
    Heart: {
        img: require('../../assets/img/human-heart.png'),
        condition: 'Hypertension',
        description: 'Your heart is under mild stress due to elevated blood pressure. Regular monitoring and lifestyle adjustments are recommended.',
        stabilityLabel: 'Mild Escalation',
        statusLabel: 'Under Monitoring',
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
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: 3, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Fatigue', severity: 3, maxSeverity: 5 },
            { date: '26 Feb', symptom: 'Blurred Vision', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '64 %', bg: '#E8E8F8', icon: 'moon' },
            { label: 'Physical Activity', value: '64 %', bg: '#FEFCE8', icon: 'walk' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7', icon: 'restaurant' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2', icon: 'wine' },
            { label: 'Stress Indicator', value: 'Elevated', bg: '#F3F4F6', icon: 'pulse' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Cardiologist Consultation', value: '1 week ago' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Amlodipine', value: '5 mg' }] },
        ],
        monitoring: ['HbA1c trend', 'RBC trend graph'],
    },
    Kidney: {
        img: require('../../assets/img/human-kidneys.png'),
        condition: 'Chronic Kidney Disease',
        description: 'Your kidneys are under monitoring with mildly reduced filtration rate. Hydration and protein management are key.',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Monitoring',
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
            { date: '14 Feb', symptom: 'Swelling in legs', severity: 3, maxSeverity: 5 },
            { date: '20 Feb', symptom: 'Fatigue', severity: 3, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Protein Intake', value: 'Moderate', bg: '#FEFCE8', icon: 'restaurant' },
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7', icon: 'water' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Nephrologist Consultation', value: '2 weeks ago' }] },
        ],
        monitoring: ['eGFR trend', 'Creatinine trend'],
    },
    Liver: {
        img: require('../../assets/img/human-liver.png'),
        condition: 'Fatty Liver',
        description: 'Mild fatty liver detected with slightly elevated liver enzymes. Diet and activity improvements recommended.',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Monitoring',
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
            { date: '10 Feb', symptom: 'Abdominal discomfort', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2', icon: 'wine' },
            { label: 'Diet Pattern', value: 'High fat', bg: '#FEFCE8', icon: 'restaurant' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Hepatologist Consultation', value: '1 month ago' }] },
        ],
        monitoring: ['ALT trend', 'AST trend'],
    },
    Pancreas: {
        img: require('../../assets/img/human-pancreas.png'),
        condition: 'Type 2 Diabetes',
        description: 'Pancreas function is under stress due to elevated blood sugar levels. Monitoring glucose trends closely.',
        stabilityLabel: 'Mild Escalation',
        statusLabel: 'Under Monitoring',
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
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: 3, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Fatigue', severity: 3, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7', icon: 'restaurant' },
            { label: 'Physical Activity', value: '64 %', bg: '#FEFCE8', icon: 'walk' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Endocrinologist Consultation', value: '1 week ago' }] },
        ],
        monitoring: ['HbA1c trend', 'Glucose trend'],
    },
    Lungs: {
        img: require('../../assets/img/human-lungs.png'),
        condition: 'Mild Asthma',
        description: 'Lung function is stable with well-controlled asthma symptoms. Continue current management plan.',
        stabilityLabel: 'Stable',
        statusLabel: 'Efficient',
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
            { date: '12 Feb', symptom: 'Mild wheeze', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Physical Activity', value: '70 %', bg: '#DCFCE7', icon: 'walk' },
            { label: 'Smoking', value: 'None', bg: '#DCFCE7', icon: 'ban' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Pulmonologist Consultation', value: '3 months ago' }] },
        ],
        monitoring: ['SpO2 trend', 'Peak flow trend'],
    },
    Brain: {
        img: require('../../assets/img/human-brain.png'),
        condition: 'Cognitive Health',
        description: 'Cognitive function is stable. Maintaining good sleep and managing stress levels are important.',
        stabilityLabel: 'Stable',
        statusLabel: 'Active',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: [
            { date: '10 Feb', symptom: 'Mild headache', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '72 %', bg: '#E8E8F8', icon: 'moon' },
            { label: 'Stress Indicator', value: 'Moderate', bg: '#FEFCE8', icon: 'pulse' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Neurologist Consultation', value: '6 months ago' }] },
        ],
        monitoring: ['Cognitive score trend'],
    },
    Eye: {
        img: require('../../assets/img/human-eye.png'),
        condition: 'Eye Health',
        description: 'Eye health is normal with no current concerns. Regular check-ups recommended.',
        stabilityLabel: 'Stable',
        statusLabel: 'Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: null,
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Ophthalmologist Consultation', value: '4 months ago' }] },
        ],
        monitoring: ['Vision check trend'],
    },
    Skin: {
        img: require('../../assets/img/human-skin.png'),
        condition: 'Skin Health',
        description: 'Skin health is in good condition. Adequate hydration and sun protection are maintained.',
        stabilityLabel: 'Stable',
        statusLabel: 'Healthy',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: [
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7', icon: 'water' },
            { label: 'Sun Exposure', value: 'Moderate', bg: '#FEFCE8', icon: 'sunny' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Dermatologist Consultation', value: '5 months ago' }] },
        ],
        monitoring: ['Skin health trend'],
    },
    Gut: {
        img: require('../../assets/img/human-gut.png'),
        condition: 'Digestive Health',
        description: 'Digestive system is functioning well with balanced diet and adequate fiber intake.',
        stabilityLabel: 'Stable',
        statusLabel: 'Balanced',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: [
            { date: '15 Feb', symptom: 'Mild bloating', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Diet Pattern', value: 'Balanced', bg: '#DCFCE7', icon: 'restaurant' },
            { label: 'Fiber Intake', value: 'Adequate', bg: '#DCFCE7', icon: 'leaf' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Gastroenterologist Consultation', value: '3 months ago' }] },
        ],
        monitoring: ['Gut health trend'],
    },
    Muscle: {
        img: require('../../assets/img/human-muscle.png'),
        condition: 'Muscle Health',
        description: 'Muscle health is strong with good physical activity levels and adequate protein intake.',
        stabilityLabel: 'Stable',
        statusLabel: 'Strong',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: [
            { label: 'Physical Activity', value: '80 %', bg: '#DCFCE7', icon: 'walk' },
            { label: 'Protein Intake', value: 'Adequate', bg: '#DCFCE7', icon: 'restaurant' },
        ],
        medicalEngagement: [
            { title: 'Past Physiotherapy', icon: 'fitness', rows: [{ label: 'Physiotherapy Session', value: '2 months ago' }] },
        ],
        monitoring: ['Muscle strength trend'],
    },
    'Musculo Skeletal': {
        img: require('../../assets/img/human-muscle.png'),
        condition: 'Bone Health',
        description: 'Bone health is stable with slightly low Vitamin D levels. Supplementation may be beneficial.',
        stabilityLabel: 'Stable',
        statusLabel: 'Stable',
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
            { date: '18 Feb', symptom: 'Joint stiffness', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Calcium Intake', value: 'Moderate', bg: '#FEFCE8', icon: 'nutrition' },
            { label: 'Physical Activity', value: '55 %', bg: '#FEFCE8', icon: 'walk' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Orthopedic Consultation', value: '3 months ago' }] },
        ],
        monitoring: ['Vitamin D trend', 'Calcium trend'],
    },
    'Vascular System': {
        img: require('../../assets/img/human-vascular.png'),
        condition: 'Vascular Health',
        description: 'Vascular system is mostly normal with slightly elevated cholesterol. Diet improvements recommended.',
        stabilityLabel: 'Stable',
        statusLabel: 'Normal',
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
            { label: 'Diet Pattern', value: 'Moderate fat', bg: '#FEFCE8', icon: 'restaurant' },
            { label: 'Physical Activity', value: '60 %', bg: '#FEFCE8', icon: 'walk' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Cardiologist Consultation', value: '2 months ago' }] },
        ],
        monitoring: ['Cholesterol trend', 'Triglyceride trend'],
    },
    Thyroid: {
        img: require('../../assets/img/human-thyroid.png'),
        condition: 'Thyroid Health',
        description: 'Thyroid function is within normal limits. Continue routine monitoring.',
        stabilityLabel: 'Stable',
        statusLabel: 'Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'TSH', subtitle: 'Thyroid Stimulating Hormone',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '0.4-4.0', abnormal: '-', unit: 'mIU/L', ref: '0.4 - 4.0',
                points: [{ x: 0, y: 0.45 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.32 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.30 }, { x: 1, y: 0.33 }],
            },
            {
                name: 'Free T4', subtitle: 'Thyroxine',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '0.8-1.8', abnormal: '-', unit: 'ng/dL', ref: '0.8 - 1.8',
                points: [{ x: 0, y: 0.40 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.30 }],
            },
        ],
        symptoms: [
            { date: '20 Feb', symptom: 'Mild fatigue', severity: 2, maxSeverity: 5 },
        ],
        lifestyle: [
            { label: 'Iodine Intake', value: 'Adequate', bg: '#DCFCE7', icon: 'nutrition' },
            { label: 'Stress Indicator', value: 'Low', bg: '#DCFCE7', icon: 'pulse' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Endocrinologist Consultation', value: '3 months ago' }] },
        ],
        monitoring: ['TSH trend', 'Free T4 trend'],
    },
    Thymus: {
        img: require('../../assets/img/human-thymus.png'),
        condition: 'Immune Health',
        description: 'Immune system is functioning well with normal white blood cell counts. Good lifestyle habits maintained.',
        stabilityLabel: 'Stable',
        statusLabel: 'Active',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: [
            {
                name: 'WBC Count', subtitle: 'White Blood Cells',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '4.5-11.0', abnormal: '-', unit: 'K/uL', ref: '4.5 - 11.0',
                points: [{ x: 0, y: 0.42 }, { x: 0.18, y: 0.36 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.33 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.31 }],
            },
        ],
        symptoms: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '75 %', bg: '#E8E8F8', icon: 'moon' },
            { label: 'Physical Activity', value: '70 %', bg: '#DCFCE7', icon: 'walk' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Immunologist Consultation', value: '6 months ago' }] },
        ],
        monitoring: ['WBC trend', 'Lymphocyte trend'],
    },
    Reproductive: {
        img: require('../../assets/img/human-reproductive.png'),
        condition: 'Reproductive Health',
        description: 'Reproductive health is normal with no current concerns. Routine check-ups recommended.',
        stabilityLabel: 'Stable',
        statusLabel: 'Normal',
        lastUpdate: '12 Jan, 12:30 PM',
        bioMarkers: null,
        symptoms: null,
        lifestyle: null,
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Specialist Consultation', value: '6 months ago' }] },
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
        <View style={[styles.bioCard, index > 0 && { marginTop: vs(10) }]}>
            <View style={styles.bioCardTop}>
                <View style={styles.bioNameWrap}>
                    <Text style={styles.bioName}>{item.name}</Text>
                    <Text style={styles.bioSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.bioTopRight}>
                    <View style={[styles.bioCodeBadge, { backgroundColor: item.statusColor + '15' }]}>
                        <Text style={[styles.bioCodeText, { color: item.statusColor }]}>{item.statusCode}</Text>
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
                    <Text style={[styles.bioGridValue, { color: item.statusColor }]}>{item.abnormal}</Text>
                </View>
                <View style={[styles.bioGridCell, styles.bioGridCellBorder]}>
                    <Text style={styles.bioGridHeader}>Unit</Text>
                    <Text style={styles.bioGridValue}>{item.unit}</Text>
                </View>
            </View>
            <View style={styles.bioRefRow}>
                <Text style={styles.bioRefText}>Ref: {item.ref}</Text>
                <TouchableOpacity style={styles.viewTrendBtn} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.viewTrendText}>{expanded ? 'Hide' : 'View'} trend</Text>
                    <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color={primaryColor} style={{ marginLeft: ms(4) }} />
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
    const stabilityStyle = getStabilityStyle(config.stabilityLabel);
    const statusStyle = getStatusStyle(config.statusLabel);

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

                {/* ── Summary Card ── */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryTopRow}>
                        <View style={styles.organIconCircle}>
                            <Image source={config.img} style={styles.organImg} />
                        </View>
                        <View style={styles.summaryTopText}>
                            <Text style={styles.summaryOrganName}>{organName}</Text>
                            <Text style={styles.summaryCondition}>{config.condition}</Text>
                        </View>
                    </View>
                    <Text style={styles.summaryDesc}>{config.description}</Text>
                    <View style={styles.summaryBadges}>
                        <View style={[styles.summaryBadge, { backgroundColor: stabilityStyle.bg }]}>
                            <Icon type={Icons.Ionicons} name="pulse" size={ms(12)} color={stabilityStyle.color} />
                            <Text style={[styles.summaryBadgeText, { color: stabilityStyle.color }]}>{config.stabilityLabel}</Text>
                        </View>
                        <View style={[styles.summaryBadge, { backgroundColor: statusStyle.bg }]}>
                            <Icon type={Icons.Ionicons} name="shield-checkmark" size={ms(12)} color={statusStyle.color} />
                            <Text style={[styles.summaryBadgeText, { color: statusStyle.color }]}>{config.statusLabel}</Text>
                        </View>
                    </View>
                    <Text style={styles.summaryDate}>Last update: {config.lastUpdate}</Text>
                </View>

                {/* ── Bio-Markers Movement ── */}
                {config.bioMarkers && config.bioMarkers.length > 0 && (
                    <>
                        <View style={styles.bioSectionRow}>
                            <View style={styles.sectionHeader}>
                                <Icon type={Icons.Ionicons} name="analytics" size={ms(18)} color={blackColor} />
                                <Text style={styles.sectionHeaderText}>Bio-Markers</Text>
                            </View>
                            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('BioMarkersTrendScreen')}>
                                <Text style={styles.viewAllText}>View all</Text>
                                <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(12)} color={primaryColor} style={{ marginLeft: ms(4) }} />
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
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="alert-circle" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Symptoms</Text>
                        </View>
                        <View style={styles.card}>
                            {config.symptoms.map((item, i) => {
                                const severityPct = (item.severity / item.maxSeverity) * 100;
                                const severityColor = item.severity >= 4 ? '#EF4444' : item.severity >= 3 ? '#F59E0B' : '#16A34A';
                                return (
                                    <View key={i} style={[styles.symptomRow, i < config.symptoms.length - 1 && styles.symptomBorder]}>
                                        <View style={styles.symptomLeft}>
                                            <Text style={styles.symptomName}>{item.symptom}</Text>
                                            <Text style={styles.symptomDate}>{item.date}</Text>
                                        </View>
                                        <View style={styles.symptomRight}>
                                            <Text style={[styles.symptomSeverity, { color: severityColor }]}>{item.severity}/{item.maxSeverity}</Text>
                                            <View style={styles.severityTrack}>
                                                <View style={[styles.severityFill, { width: `${severityPct}%`, backgroundColor: severityColor }]} />
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* ── Lifestyle Influence ── */}
                {config.lifestyle && config.lifestyle.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="leaf" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Lifestyle Influence</Text>
                        </View>
                        <View style={styles.card}>
                            {config.lifestyle.map((item, i) => (
                                <View key={i} style={[styles.lifestyleRow, i < config.lifestyle.length - 1 && styles.lifestyleBorder]}>
                                    <View style={[styles.lifestyleIcon, { backgroundColor: item.bg }]}>
                                        <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color="#374151" />
                                    </View>
                                    <Text style={styles.lifestyleLabel}>{item.label}</Text>
                                    <Text style={styles.lifestyleValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* ── Medical Engagement ── */}
                {config.medicalEngagement && config.medicalEngagement.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="medkit" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Medical Engagement</Text>
                        </View>
                        {config.medicalEngagement.map((section, si) => (
                            <View key={si} style={styles.meCard}>
                                <View style={styles.meTitleRow}>
                                    <View style={styles.meTitleIcon}>
                                        <Icon type={Icons.Ionicons} name={section.icon} size={ms(14)} color={primaryColor} />
                                    </View>
                                    <Text style={styles.meSectionTitle}>{section.title}</Text>
                                </View>
                                {section.rows.map((row, ri) => (
                                    <View key={ri} style={styles.meRow}>
                                        <Text style={styles.meLabel}>{row.label}</Text>
                                        {row.value !== '' && <Text style={styles.meValue}>{row.value}</Text>}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </>
                )}

                {/* ── Monitoring ── */}
                {config.monitoring && config.monitoring.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="eye" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Active Monitoring</Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.monitorWrap}>
                                {config.monitoring.map((item, i) => (
                                    <View key={i} style={styles.monitorChip}>
                                        <Icon type={Icons.Ionicons} name="trending-up" size={ms(14)} color={primaryColor} />
                                        <Text style={styles.monitorText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
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

    // Summary Card
    summaryCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    summaryTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(14) },
    organIconCircle: {
        width: ms(56), height: ms(56), borderRadius: ms(28),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
    },
    organImg: { width: ms(36), height: ms(36), resizeMode: 'contain' },
    summaryTopText: { flex: 1, marginLeft: ms(14) },
    summaryOrganName: { fontFamily: bold, fontSize: ms(17), color: blackColor },
    summaryCondition: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2) },
    summaryDesc: { fontFamily: regular, fontSize: ms(13), color: '#6B7280', lineHeight: ms(20), marginBottom: vs(14) },
    summaryBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(12) },
    summaryBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        paddingHorizontal: ms(12), paddingVertical: vs(6), borderRadius: ms(10),
    },
    summaryBadgeText: { fontFamily: bold, fontSize: ms(12) },
    summaryDate: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },

    // Section Header
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        paddingHorizontal: ms(20), marginBottom: vs(10), marginTop: vs(4),
    },
    sectionHeaderText: { fontFamily: bold, fontSize: ms(16), color: blackColor },

    // Shared card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(14),
    },

    // Bio-Markers
    bioSectionRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingRight: ms(20),
    },
    viewAllBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: primaryColor + '12', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    viewAllText: { fontFamily: bold, fontSize: ms(11), color: primaryColor },
    bioCardsWrap: { paddingHorizontal: ms(20), marginBottom: vs(14) },
    bioCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16) },
    bioCardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(12) },
    bioNameWrap: { flex: 1 },
    bioName: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    bioSubtitle: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    bioTopRight: { alignItems: 'flex-end' },
    bioCodeBadge: { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    bioCodeText: { fontFamily: bold, fontSize: ms(12) },
    bioStatusLabel: { fontFamily: bold, fontSize: ms(11), marginTop: vs(4) },
    bioGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: ms(12), padding: ms(12), marginBottom: vs(12) },
    bioGridCell: { flex: 1, alignItems: 'center' },
    bioGridCellBorder: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    bioGridHeader: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4) },
    bioGridValue: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    bioRefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bioRefText: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },
    viewTrendBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: primaryColor + '12', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    viewTrendText: { fontFamily: bold, fontSize: ms(11), color: primaryColor },
    bioChartWrap: { marginTop: vs(14) },
    xLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8), paddingHorizontal: ms(2) },
    xLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },

    // Symptoms
    symptomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(10) },
    symptomBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    symptomLeft: { flex: 1 },
    symptomName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    symptomDate: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    symptomRight: { alignItems: 'flex-end', width: ms(80) },
    symptomSeverity: { fontFamily: bold, fontSize: ms(12), marginBottom: vs(4) },
    severityTrack: { width: ms(60), height: vs(4), backgroundColor: '#F1F5F9', borderRadius: ms(2), overflow: 'hidden' },
    severityFill: { height: '100%', borderRadius: ms(2) },

    // Lifestyle
    lifestyleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10) },
    lifestyleBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    lifestyleIcon: {
        width: ms(36), height: ms(36), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    lifestyleLabel: { fontFamily: regular, fontSize: ms(13), color: '#374151', flex: 1 },
    lifestyleValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },

    // Medical Engagement
    meCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(10),
    },
    meTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
    meTitleIcon: {
        width: ms(30), height: ms(30), borderRadius: ms(8),
        backgroundColor: primaryColor + '12', justifyContent: 'center', alignItems: 'center',
        marginRight: ms(10),
    },
    meSectionTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    meRow: {
        flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
        paddingVertical: vs(5), paddingLeft: ms(40),
    },
    meLabel: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1 },
    meValue: { fontFamily: regular, fontSize: ms(12), color: '#6B7280' },

    // Monitoring
    monitorWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10) },
    monitorChip: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        backgroundColor: primaryColor + '10', borderRadius: ms(20),
        paddingHorizontal: ms(14), paddingVertical: vs(8),
    },
    monitorText: { fontFamily: bold, fontSize: ms(12), color: primaryColor },
});
