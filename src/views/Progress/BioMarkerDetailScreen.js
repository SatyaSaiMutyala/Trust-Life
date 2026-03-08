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

// ── Bio Marker configs ───────────────────────────────────────────────────────
const BIO_MARKER_CONFIGS = {
    'Blood Sugar': {
        code: 'BG5854U67',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'HbA1c: 7.4% , Normal: 4.0 - 5.6%',
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
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: '3/5' },
            { date: '18 Feb', symptom: 'Fatigue', severity: '3/5' },
            { date: '26 Feb', symptom: 'Blurred Vision', severity: '2/5' },
        ],
        organs: [
            { name: 'Pancreas', emoji: '\u{1F95E}', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
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
            { title: 'Past Physiotherapy', rows: [{ label: 'Lower Back Physiotherapy', value: 'Jan 2025 - Feb 2025' }] },
            { title: 'Past Physiotherapy', rows: [{ label: 'Lipid Profile', value: '10 Feb 2026' }, { label: 'Total Cholesterol: 210 mg/dL', value: '' }] },
        ],
        monitoring: ['Glucose levels', 'HbA1c'],
    },
    'Blood Pressure': {
        code: 'BP7821K34',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Systolic: 145 mmHg , Normal: 90 - 120 mmHg',
        stabilityLabel: 'Stability: Unstable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Systolic Blood Pressure', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '<120', abnormal: '145', unit: 'mmHg', ref: '90 - 120',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.45 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.40 }],
            },
            {
                name: 'Diastolic Blood Pressure', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '<80', abnormal: '92', unit: 'mmHg', ref: '60 - 80',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.35 }],
            },
        ],
        symptoms: [
            { date: '15 Feb', symptom: 'Headache', severity: '3/5' },
            { date: '20 Feb', symptom: 'Dizziness', severity: '2/5' },
        ],
        organs: [
            { name: 'Heart', emoji: '\u{1FAC0}', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Blood Pressure', showArrow: true }] },
            { name: 'Kidneys', emoji: '\u{1FAD8}', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Creatinine', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Salt Intake', value: 'High', bg: '#FEE2E2' },
            { label: 'Physical Activity:', value: '45 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator:', value: 'High', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Checkup', value: '10 Feb 2026' }, { label: 'BP: 150/95 mmHg', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Losartan', value: 'Duration: 6 months' }, { label: 'Dosage: 50 mg', value: '' }] },
        ],
        monitoring: ['BP trend', 'Heart rate graph'],
    },
    Cholesterol: {
        code: 'CL4921M88',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Total: 218 mg/dL , Normal: < 200 mg/dL',
        stabilityLabel: 'Stability: Borderline',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'Total Cholesterol', subtitle: 'Lipid Panel',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '<200', abnormal: '218', unit: 'mg/dL', ref: '< 200',
                points: [{ x: 0, y: 0.68 }, { x: 0.18, y: 0.52 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.48 }, { x: 1, y: 0.40 }],
            },
            {
                name: 'LDL Cholesterol', subtitle: 'Low-Density Lipoprotein',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '<100', abnormal: '142', unit: 'mg/dL', ref: '< 100',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.42 }, { x: 0.66, y: 0.52 }, { x: 1, y: 0.45 }],
            },
            {
                name: 'HDL Cholesterol', subtitle: 'High-Density Lipoprotein',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '>40', abnormal: '-', unit: 'mg/dL', ref: '> 40',
                points: [{ x: 0, y: 0.40 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.30 }],
            },
            {
                name: 'Triglycerides', subtitle: 'Lipid Panel',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '<150', abnormal: '180', unit: 'mg/dL', ref: '< 150',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.38 }],
            },
        ],
        symptoms: null,
        organs: null,
        lifestyle: [
            { label: 'Diet Pattern', value: 'High fat', bg: '#FEE2E2' },
            { label: 'Physical Activity:', value: '50 %', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '12 Feb 2026' }] },
        ],
        monitoring: ['Cholesterol trend', 'Triglyceride trend'],
    },
    'Heart Rate': {
        code: 'HR6732P21',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Resting: 72 bpm , Normal: 60 - 100 bpm',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Normal',
        bioMarkers: [
            {
                name: 'Resting Heart Rate', subtitle: 'Heart Rate',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '60-100', abnormal: '-', unit: 'bpm', ref: '60 - 100',
                points: [{ x: 0, y: 0.45 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.32 }],
            },
            {
                name: 'Heart Rate Variability', subtitle: 'HRV',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '20-70', abnormal: '-', unit: 'ms', ref: '20 - 70',
                points: [{ x: 0, y: 0.50 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.35 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.30 }, { x: 1, y: 0.34 }],
            },
        ],
        symptoms: null,
        organs: null,
        lifestyle: [
            { label: 'Physical Activity:', value: '70 %', bg: '#DCFCE7' },
            { label: 'Stress Indicator:', value: 'Moderate', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '8 Feb 2026' }] },
        ],
        monitoring: ['Heart rate trend', 'HRV trend'],
    },
    'Kidney Function': {
        code: 'KF3291L56',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'eGFR: 52 mL/min , Normal: > 90 mL/min',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
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
            {
                name: 'BUN', subtitle: 'Blood Urea Nitrogen',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '7-20', abnormal: '28', unit: 'mg/dL', ref: '7 - 20',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.42 }, { x: 1, y: 0.38 }],
            },
        ],
        symptoms: [
            { date: '14 Feb', symptom: 'Swelling in legs', severity: '3/5' },
            { date: '20 Feb', symptom: 'Fatigue', severity: '3/5' },
        ],
        organs: [
            { name: 'Kidneys', emoji: '\u{1FAD8}', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Creatinine', showArrow: true }, { name: 'eGFR', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Protein Intake', value: 'Moderate', bg: '#FEFCE8' },
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Nephrologist Consultation', value: '12 Feb 2026' }] },
        ],
        monitoring: ['eGFR trend', 'Creatinine trend'],
    },
    'Liver Function': {
        code: 'LF8432N77',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'ALT: 72 U/L , Normal: 7 - 56 U/L',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'ALT', subtitle: 'Alanine Aminotransferase',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '7-56', abnormal: '72', unit: 'U/L', ref: '7 - 56',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.38 }],
            },
            {
                name: 'AST', subtitle: 'Aspartate Aminotransferase',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '10-40', abnormal: '-', unit: 'U/L', ref: '10 - 40',
                points: [{ x: 0, y: 0.45 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.30 }],
            },
            {
                name: 'Bilirubin', subtitle: 'Total Bilirubin',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '0.1-1.2', abnormal: '-', unit: 'mg/dL', ref: '0.1 - 1.2',
                points: [{ x: 0, y: 0.40 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.28 }, { x: 0.66, y: 0.22 }, { x: 1, y: 0.26 }],
            },
        ],
        symptoms: null,
        organs: null,
        lifestyle: [
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
            { label: 'Diet Pattern', value: 'High fat', bg: '#FEFCE8' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Hepatologist Consultation', value: '10 Feb 2026' }] },
        ],
        monitoring: ['ALT trend', 'AST trend'],
    },
    Thyroid: {
        code: 'TH5612R43',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'TSH: 8.2 mIU/L , Normal: 0.4 - 4.0 mIU/L',
        stabilityLabel: 'Stability: Critical',
        statusLabel: 'Status: Needs Attention',
        bioMarkers: [
            {
                name: 'TSH', subtitle: 'Thyroid Stimulating Hormone',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '0.4-4.0', abnormal: '8.2', unit: 'mIU/L', ref: '0.4 - 4.0',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.45 }, { x: 0.33, y: 0.25 }, { x: 0.50, y: 0.40 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.35 }],
            },
            {
                name: 'T3', subtitle: 'Triiodothyronine',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '80-200', abnormal: '65', unit: 'ng/dL', ref: '80 - 200',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.32 }],
            },
            {
                name: 'T4', subtitle: 'Thyroxine',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '5-12', abnormal: '3.8', unit: 'mcg/dL', ref: '5 - 12',
                points: [{ x: 0, y: 0.58 }, { x: 0.18, y: 0.44 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.26 }, { x: 1, y: 0.30 }],
            },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Fatigue', severity: '4/5' },
            { date: '22 Feb', symptom: 'Weight Gain', severity: '3/5' },
        ],
        organs: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '50 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'Iodine deficient', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Endocrinologist Consultation', value: '8 Feb 2026' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Levothyroxine', value: 'Duration: Ongoing' }, { label: 'Dosage: 50 mcg', value: '' }] },
        ],
        monitoring: ['TSH trend', 'T3/T4 trend graph'],
    },
    'Blood Count': {
        code: 'BC2947S15',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'RBC: 650 g/dL , Normal: 100 - 500 g/dL',
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
                name: 'WBC Count', subtitle: 'White Blood Cells',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '4000-11000', abnormal: '-', unit: '/uL', ref: '4000 - 11000',
                points: [{ x: 0, y: 0.45 }, { x: 0.18, y: 0.38 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.28 }, { x: 1, y: 0.32 }],
            },
            {
                name: 'Hemoglobin', subtitle: 'Blood Hemoglobin',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '12-17.5', abnormal: '-', unit: 'g/dL', ref: '12 - 17.5',
                points: [{ x: 0, y: 0.42 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.30 }],
            },
            {
                name: 'Platelet Count', subtitle: 'Thrombocytes',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '150K-400K', abnormal: '-', unit: '/uL', ref: '150K - 400K',
                points: [{ x: 0, y: 0.40 }, { x: 0.18, y: 0.34 }, { x: 0.33, y: 0.26 }, { x: 0.50, y: 0.30 }, { x: 0.66, y: 0.24 }, { x: 1, y: 0.28 }],
            },
        ],
        symptoms: null,
        organs: null,
        lifestyle: null,
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Checkup', value: '12 Feb 2026' }] },
        ],
        monitoring: ['RBC trend', 'Hemoglobin trend'],
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
                        <Text style={{ fontSize: ms(16), marginLeft: ms(4) }}>{'\u{1F6A9}'}</Text>
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
                <Text style={styles.bioRefText}>Bio.Ref.Range  -  {item.ref}</Text>
                <TouchableOpacity style={styles.viewTrendBtn} onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.viewTrendText}>View trend</Text>
                    <Icon type={Icons.Ionicons} name={expanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#3B82F6" style={{ marginLeft: ms(4) }} />
                </TouchableOpacity>
            </View>
            {expanded && <BioChart points={item.points} id={`bmd_${index}`} />}
        </View>
    );
};

// ── Organ Card ───────────────────────────────────────────────────────────────
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
const BioMarkerDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const markerName = route.params?.marker || 'Blood Sugar';

    const config = BIO_MARKER_CONFIGS[markerName] || BIO_MARKER_CONFIGS['Blood Sugar'];

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
                    <Text style={styles.headerTitle}>{markerName}</Text>
                </View>

                {/* ── Summary Card ── */}
                <View style={styles.condCard}>
                    <Text style={styles.condLabel}>Condition</Text>
                    <View style={styles.condNameRow}>
                        <Text style={styles.condTitle}>{markerName}</Text>
                        <Text style={styles.condCode}>{config.code}</Text>
                    </View>
                    <Text style={styles.condDate}>Last update {config.lastUpdate}</Text>
                    <Text style={styles.condInfo}>{config.info}</Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.condBadge, { backgroundColor: '#FEF9EE' }]}>
                            <Text style={[styles.condBadgeText, { color: '#92400E' }]}>{config.stabilityLabel}</Text>
                        </View>
                        <View style={[styles.condBadge, { backgroundColor: '#EDFAF5', marginLeft: ms(8) }]}>
                            <Text style={[styles.condBadgeText, { color: '#065F46' }]}>{config.statusLabel}</Text>
                        </View>
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

                {/* ── Organs ── */}
                {config.organs && config.organs.length > 0 && (
                    <View style={styles.organsWrap}>
                        {config.organs.map((item, i) => (
                            <OrganCard key={i} item={item} />
                        ))}
                    </View>
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

export default BioMarkerDetailScreen;

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
    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    condLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(4) },
    condNameRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: vs(4),
    },
    condTitle: { fontFamily: bold, fontSize: ms(18), color: blackColor, flex: 1, marginRight: ms(8) },
    condCode: { fontFamily: bold, fontSize: ms(13), color: '#6B7280' },
    condDate: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(6) },
    condInfo: { fontFamily: regular, fontSize: ms(12), color: '#374151', marginBottom: vs(14) },
    badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    condBadge: {
        paddingHorizontal: ms(12),
        paddingVertical: vs(6), borderRadius: ms(10),
    },
    condBadgeText: { fontFamily: bold, fontSize: ms(11) },

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
