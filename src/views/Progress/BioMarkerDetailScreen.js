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
    'Bio-Markers Status': {
        code: 'BMS1001A11',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Overall Status: 21/25 markers in range',
        stabilityLabel: 'Stability: Mild Escalation',
        statusLabel: 'Status: Under Monitoring',
        bioMarkers: [
            {
                name: 'HbA1c', subtitle: 'Glycated Haemoglobin',
                statusCode: 'H', statusLabel: 'Above Target', statusColor: '#F59E0B',
                normal: '<5.7%', abnormal: '7.4%', unit: '%', ref: '4.0 - 5.6',
                points: [{ x: 0, y: 0.80 }, { x: 0.18, y: 0.65 }, { x: 0.33, y: 0.40 }, { x: 0.50, y: 0.55 }, { x: 0.66, y: 0.70 }, { x: 1, y: 0.52 }],
            },
            {
                name: 'CRP (C-Reactive Protein)', subtitle: 'Inflammation Marker',
                statusCode: 'H', statusLabel: 'Elevated', statusColor: '#EF4444',
                normal: '<1.0', abnormal: '3.2', unit: 'mg/L', ref: '< 1.0',
                points: [{ x: 0, y: 0.85 }, { x: 0.18, y: 0.60 }, { x: 0.33, y: 0.35 }, { x: 0.50, y: 0.50 }, { x: 0.66, y: 0.65 }, { x: 1, y: 0.48 }],
            },
            {
                name: 'eGFR', subtitle: 'Kidney Filtration Rate',
                statusCode: 'L', statusLabel: 'Below Normal', statusColor: '#F59E0B',
                normal: '>90', abnormal: '68', unit: 'mL/min', ref: '> 90',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.48 }, { x: 1, y: 0.35 }],
            },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Fatigue', severity: '3/5' },
            { date: '18 Feb', symptom: 'Mild Headache', severity: '2/5' },
        ],
        organs: [
            { name: 'Pancreas', emoji: '\u{1F95E}', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'HbA1c', showArrow: true }, { name: 'Glucose', showArrow: false }] },
            { name: 'Kidneys', emoji: '\u{1FAD8}', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'eGFR', showArrow: false }, { name: 'Creatinine', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '58 %', bg: '#FEFCE8' },
            { label: 'Physical Activity', value: '40 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#FEE2E2' },
            { label: 'Stress Indicator', value: 'Elevated', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'General Physician Consultation', value: '14 Feb 2026' }, { label: 'HbA1c: 7.4%', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Metformin', value: 'Duration: 3 months' }, { label: 'Dosage: 500 mg', value: '' }] },
        ],
        monitoring: ['HbA1c trend', 'CRP trend', 'eGFR trend'],
    },
    Stability: {
        code: 'STB2002B22',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Stability Score: 18/25 , Trend: Improving',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Stable',
        bioMarkers: [
            {
                name: 'Blood Pressure Variability', subtitle: 'BP Stability Index',
                statusCode: 'N', statusLabel: 'Stable', statusColor: '#10B981',
                normal: '<10', abnormal: '-', unit: 'mmHg SD', ref: '< 10',
                points: [{ x: 0, y: 0.45 }, { x: 0.18, y: 0.35 }, { x: 0.33, y: 0.28 }, { x: 0.50, y: 0.32 }, { x: 0.66, y: 0.25 }, { x: 1, y: 0.28 }],
            },
            {
                name: 'Glucose Variability', subtitle: 'Blood Sugar Stability',
                statusCode: 'H', statusLabel: 'Mild Instability', statusColor: '#F59E0B',
                normal: '<36%', abnormal: '42%', unit: '% CV', ref: '< 36%',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.35 }, { x: 0.50, y: 0.48 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.45 }],
            },
            {
                name: 'Heart Rate Stability', subtitle: 'HRV Consistency',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '20-70', abnormal: '-', unit: 'ms', ref: '20 - 70',
                points: [{ x: 0, y: 0.42 }, { x: 0.18, y: 0.36 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.33 }, { x: 0.66, y: 0.27 }, { x: 1, y: 0.31 }],
            },
        ],
        symptoms: [
            { date: '15 Feb', symptom: 'Occasional Dizziness', severity: '2/5' },
        ],
        organs: null,
        lifestyle: [
            { label: 'Sleep consistency', value: '72 %', bg: '#DCFCE7' },
            { label: 'Physical Activity', value: '55 %', bg: '#FEFCE8' },
            { label: 'Stress Indicator', value: 'Moderate', bg: '#FEFCE8' },
            { label: 'Medication Adherence', value: '85 %', bg: '#DCFCE7' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Follow-up Consultation', value: '18 Feb 2026' }, { label: 'Stability improving noted', value: '' }] },
            { title: 'Past Diagnostics', rows: [{ label: 'Continuous Glucose Monitor', value: 'Feb 2026' }, { label: 'Holter Monitor', value: '10 Feb 2026' }] },
        ],
        monitoring: ['BP variability trend', 'Glucose CV trend'],
    },
    'Trend Velocity': {
        code: 'TRV3003C33',
        lastUpdate: '12 Jan, 12:30 PM',
        info: 'Velocity Score: +4 , Direction: Improving',
        stabilityLabel: 'Stability: Stable',
        statusLabel: 'Status: Positive Trend',
        bioMarkers: [
            {
                name: 'LDL Cholesterol Rate of Change', subtitle: 'Monthly Delta',
                statusCode: 'H', statusLabel: 'Declining Fast', statusColor: '#EF4444',
                normal: '<5%/mo', abnormal: '12%/mo', unit: '% change', ref: '< 5%/month',
                points: [{ x: 0, y: 0.90 }, { x: 0.18, y: 0.75 }, { x: 0.33, y: 0.55 }, { x: 0.50, y: 0.65 }, { x: 0.66, y: 0.78 }, { x: 1, y: 0.60 }],
            },
            {
                name: 'HbA1c Trend', subtitle: 'Quarterly Delta',
                statusCode: 'H', statusLabel: 'Rising', statusColor: '#F59E0B',
                normal: '<0.5%/q', abnormal: '0.8%/q', unit: '%/quarter', ref: '< 0.5%/quarter',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.60 }, { x: 0.33, y: 0.40 }, { x: 0.50, y: 0.52 }, { x: 0.66, y: 0.65 }, { x: 1, y: 0.50 }],
            },
            {
                name: 'eGFR Trend', subtitle: 'Kidney Function Delta',
                statusCode: 'N', statusLabel: 'Stable', statusColor: '#10B981',
                normal: '±5/yr', abnormal: '-', unit: 'mL/min/yr', ref: '± 5 mL/min/yr',
                points: [{ x: 0, y: 0.50 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.35 }, { x: 0.50, y: 0.38 }, { x: 0.66, y: 0.30 }, { x: 1, y: 0.33 }],
            },
        ],
        symptoms: null,
        organs: [
            { name: 'Heart', emoji: '\u{1FAC0}', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'LDL Rising', showArrow: true }, { name: 'CRP', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Physical Activity', value: '48 %', bg: '#FEFCE8' },
            { label: 'Diet Pattern', value: 'High saturated fat', bg: '#FEE2E2' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2' },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', rows: [{ label: 'Cardiologist Consultation', value: '15 Feb 2026' }, { label: 'LDL trend discussed', value: '' }] },
            { title: 'Past Doctor Prescription', rows: [{ label: 'Medication: Rosuvastatin', value: 'Duration: 6 months' }, { label: 'Dosage: 10 mg', value: '' }] },
        ],
        monitoring: ['LDL monthly trend', 'HbA1c quarterly trend', 'eGFR annual rate'],
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
                    <Stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
                    <Stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
                </SvgLinearGradient>
            </Defs>
            <Line x1="0" y1={CHART_H * 0.10} x2={CHART_W} y2={CHART_H * 0.10} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.37} x2={CHART_W} y2={CHART_H * 0.37} stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.64} x2={CHART_W} y2={CHART_H * 0.64} stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.92} x2={CHART_W} y2={CHART_H * 0.92} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4,4" />
            <Path d={createAreaPath(points)} fill={`url(#${id})`} />
            <Path d={createCurvePath(points)} fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
                <Circle key={i} cx={p.x * CHART_W} cy={p.y * CHART_H} r={ms(4.5)} fill={primaryColor} stroke={whiteColor} strokeWidth={1.5} />
            ))}
        </Svg>
        <View style={styles.xLabels}>
            {X_LABELS.map((l, i) => <Text key={i} style={styles.xLabel}>{l}</Text>)}
        </View>
    </View>
);

// ── Bio Marker Card ──────────────────────────────────────────────────────────
const BioMarkerRow = ({ item, index }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={[styles.bioCard, index > 0 && { marginTop: vs(8) }]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('AnalyteTrendScreen', { analyteName: item.name })}
        >
            <View style={styles.bioCardInner}>
                {/* Left: icon circle + name */}
                <View style={[styles.bioIconCircle, { backgroundColor: item.statusColor + '18' }]}>
                    <Icon type={Icons.Ionicons} name="flask-outline" size={ms(16)} color={item.statusColor} />
                </View>

                <View style={styles.bioNameWrap}>
                    <Text style={styles.bioName}>{item.name}</Text>
                    <Text style={styles.bioSubtitle}>{item.subtitle}</Text>
                </View>

                {/* Right: status pill */}
                <View style={[styles.bioStatusPill, { backgroundColor: item.statusColor + '18', borderColor: item.statusColor + '40' }]}>
                    <View style={[styles.bioStatusDot, { backgroundColor: item.statusColor }]} />
                    <Text style={[styles.bioStatusPillText, { color: item.statusColor }]}>{item.statusLabel}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ── Organ Card ───────────────────────────────────────────────────────────────
const OrganCard = ({ item }) => (
    <View style={styles.organCard}>
        <View style={styles.organTopRow}>
            <View style={styles.organIconCircle}>
                <Text style={styles.organEmoji}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.organName}>{item.name}</Text>
                <View style={[styles.organStatusBadge, { backgroundColor: item.statusBg, alignSelf: 'flex-start' }]}>
                    <Icon type={Icons.Ionicons} name="warning-outline" size={ms(11)} color={item.statusColor} />
                    <Text style={[styles.organStatusText, { color: item.statusColor }]}>{item.statusLabel}</Text>
                </View>
            </View>
        </View>
        <View style={styles.organDivider} />
        <Text style={styles.organContribTitle}>Contributing Factors</Text>
        <View style={styles.organContribWrap}>
            {item.contributors.map((c, i) => (
                <View key={i} style={styles.organContribChip}>
                    <Text style={styles.organContribName}>{c.name}</Text>
                    {c.showArrow && <Icon type={Icons.Ionicons} name="arrow-up" size={ms(11)} color="#EF4444" style={{ marginLeft: ms(4) }} />}
                </View>
            ))}
        </View>
    </View>
);

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, label, actionLabel, onAction }) => (
    <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIconCircle}>
                <Icon type={Icons.Ionicons} name={icon} size={ms(14)} color={primaryColor} />
            </View>
            <Text style={styles.sectionTitle}>{label}</Text>
        </View>
        {actionLabel && (
            <TouchableOpacity onPress={onAction} style={styles.sectionActionBtn}>
                <Text style={styles.sectionActionText}>{actionLabel}</Text>
            </TouchableOpacity>
        )}
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
                        <View style={styles.headerTextWrap}>
                            <Text style={styles.headerTitle}>{markerName}</Text>
                            <Text style={styles.headerSub}>Last updated {config.lastUpdate}</Text>
                        </View>
                        <View style={styles.headerCodeBadge}>
                            <Text style={styles.headerCodeText}>{config.code}</Text>
                        </View>
                    </View>

                    {/* ── Summary Card ── */}
                    <View style={styles.condCard}>
                        <View style={styles.condInfoRow}>
                            <Icon type={Icons.Ionicons} name="pulse-outline" size={ms(15)} color={primaryColor} />
                            <Text style={styles.condInfo}>{config.info}</Text>
                        </View>
                        {(() => {
                            const markers = config.bioMarkers || [];
                            const normal = markers.filter(m => m.statusCode === 'N').length;
                            const critical = markers.filter(m => m.statusCode.includes('**')).length;
                            const abnormal = markers.length - normal - critical;
                            return (
                                <View style={styles.statusCountRow}>
                                    <View style={[styles.statusCountChip, { backgroundColor: '#DCFCE7' }]}>
                                        <Text style={[styles.statusCountNum, { color: '#10B981' }]}>{normal}</Text>
                                        <Text style={[styles.statusCountLabel, { color: '#10B981' }]}>Normal</Text>
                                    </View>
                                    <View style={[styles.statusCountChip, { backgroundColor: '#FEF3C7' }]}>
                                        <Text style={[styles.statusCountNum, { color: '#F59E0B' }]}>{abnormal}</Text>
                                        <Text style={[styles.statusCountLabel, { color: '#F59E0B' }]}>Abnormal</Text>
                                    </View>
                                    <View style={[styles.statusCountChip, { backgroundColor: '#FEE2E2' }]}>
                                        <Text style={[styles.statusCountNum, { color: '#EF4444' }]}>{critical}</Text>
                                        <Text style={[styles.statusCountLabel, { color: '#EF4444' }]}>Critical</Text>
                                    </View>
                                </View>
                            );
                        })()}
                    </View>

                    {/* ── Bio-Markers Movement ── */}
                    {config.bioMarkers && config.bioMarkers.length > 0 && (
                        <>
                            <SectionHeader
                                icon="flask-outline"
                                label="Bio-Markers Movement"
                                actionLabel="All trends"
                                onAction={() => navigation.navigate('BioMarkersTrendScreen')}
                            />
                            <View style={styles.bioCardsWrap}>
                                {config.bioMarkers.map((item, i) => (
                                    <BioMarkerRow key={i} item={item} index={i} />
                                ))}
                            </View>
                        </>
                    )}

                    {/* ── Symptom Tracker ── */}
                    {/* {config.symptoms && config.symptoms.length > 0 && (
                        <>
                            <SectionHeader icon="flash-outline" label="Symptom Tracker" />
                            <View style={styles.sectionCard}>
                                <View style={styles.insightBanner}>
                                    <Icon type={Icons.Ionicons} name="bulb-outline" size={ms(14)} color={primaryColor} />
                                    <Text style={styles.insightText}>
                                        Elevated readings correlate with reported fatigue & discomfort
                                    </Text>
                                </View>
                                <Text style={styles.cardSubLabel}>Recent Logs</Text>
                                {config.symptoms.map((item, i) => (
                                    <View key={i} style={styles.symptomRow}>
                                        <View style={styles.symptomDot} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.symptomDate}>{item.date}</Text>
                                            <Text style={styles.symptomText}>{item.symptom}</Text>
                                        </View>
                                        <View style={styles.severityBadge}>
                                            <Text style={styles.severityText}>Sev {item.severity}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )} */}

                    {/* ── Organs Affected ── */}
                    {/* {config.organs && config.organs.length > 0 && (
                        <>
                            <SectionHeader icon="body-outline" label="Organs Affected" />
                            <View style={styles.organsWrap}>
                                {config.organs.map((item, i) => (
                                    <OrganCard key={i} item={item} />
                                ))}
                            </View>
                        </>
                    )} */}

                    {/* ── Lifestyle Influence ── */}
                    {/* {config.lifestyle && config.lifestyle.length > 0 && (
                        <>
                            <SectionHeader icon="fitness-outline" label="Lifestyle Influence" />
                            <View style={styles.sectionCard}>
                                <View style={styles.insightBanner}>
                                    <Icon type={Icons.Ionicons} name="bulb-outline" size={ms(14)} color={primaryColor} />
                                    <Text style={styles.insightText}>
                                        Current lifestyle patterns are contributing to marker variability
                                    </Text>
                                </View>
                                <Text style={styles.cardSubLabel}>Breakdown</Text>
                                {config.lifestyle.map((item, i) => (
                                    <View key={i} style={[styles.lifestylePill, { backgroundColor: item.bg }]}>
                                        <Text style={styles.lifestylePillLabel}>{item.label}</Text>
                                        <Text style={styles.lifestylePillValue}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )} */}

                    {/* ── Medical Engagement ── */}
                    {/* {config.medicalEngagement && config.medicalEngagement.length > 0 && (
                        <>
                            <SectionHeader icon="medkit-outline" label="Medical Engagement" />
                            <View style={styles.sectionCard}>
                                {config.medicalEngagement.map((section, si) => (
                                    <View key={si} style={[styles.meSection, si > 0 && styles.meSectionBordered]}>
                                        <View style={styles.meTitleRow}>
                                            <View style={styles.meDotLarge} />
                                            <Text style={styles.meSectionTitle}>{section.title}</Text>
                                        </View>
                                        {section.rows.map((row, ri) => (
                                            <View key={ri} style={styles.meRow}>
                                                <Text style={styles.meLabel}>{row.label}</Text>
                                                {row.value !== '' && (
                                                    <View style={styles.meValueChip}>
                                                        <Text style={styles.meValue}>{row.value}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </>
                    )} */}

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default BioMarkerDetailScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    fullGradient: { flex: 1 },
    scrollContent: { paddingBottom: vs(40) },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(14),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },
    headerCodeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: ms(8),
        paddingHorizontal: ms(8), paddingVertical: vs(5),
    },
    headerCodeText: { fontFamily: bold, fontSize: ms(10), color: whiteColor },

    // Summary Card
    condCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), marginBottom: vs(14),
        padding: ms(16),
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 3,
    },
    condInfoRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: primaryColor + '0D', borderRadius: ms(10),
        padding: ms(12), marginBottom: vs(12),
    },
    condInfo: { fontFamily: regular, fontSize: ms(12), color: '#1A4A44', flex: 1, lineHeight: ms(18) },
    badgeRow: { flexDirection: 'row', gap: ms(8), flexWrap: 'wrap' },
    statusCountRow: { flexDirection: 'row', gap: ms(8) },
    statusCountChip: {
        flex: 1, borderRadius: ms(10), paddingVertical: vs(8),
        alignItems: 'center', justifyContent: 'center',
    },
    statusCountNum: { fontFamily: bold, fontSize: ms(20), lineHeight: ms(24) },
    statusCountLabel: { fontFamily: regular, fontSize: ms(10), marginTop: vs(2) },
    condBadgeAmber: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: '#FEF9EE', paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(10),
    },
    condBadgeAmberText: { fontFamily: bold, fontSize: ms(10.5), color: '#92400E' },
    condBadgeGreen: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: '#EDFAF5', paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(10),
    },
    condBadgeGreenText: { fontFamily: bold, fontSize: ms(10.5), color: '#065F46' },

    // Section header
    sectionHeaderRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: ms(16), marginBottom: vs(10), marginTop: vs(4),
    },
    sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    sectionIconCircle: {
        width: ms(28), height: ms(28), borderRadius: ms(14),
        backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center',
    },
    sectionTitle: { fontFamily: bold, fontSize: ms(15), color: blackColor },
    sectionActionBtn: {
        borderWidth: 1.5, borderColor: primaryColor, borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    sectionActionText: { fontFamily: bold, fontSize: ms(11), color: primaryColor },

    // Bio-Markers section
    bioCardsWrap: { paddingHorizontal: ms(16), marginBottom: vs(14) },
    bioCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        flexDirection: 'row', overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    bioAccent: { width: ms(4) },
    bioCardStrip: { position: 'absolute', top: 0, left: 0, right: 0, height: ms(4) },
    bioCardInner: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(12), paddingVertical: ms(12), gap: ms(10),
    },
    bioIconCircle: {
        width: ms(38), height: ms(38), borderRadius: ms(19),
        justifyContent: 'center', alignItems: 'center',
    },
    bioCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bioNameWrap: { flex: 1 },
    bioName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    bioSubtitle: { fontFamily: regular, fontSize: ms(10.5), color: '#9CA3AF', marginTop: vs(2) },
    bioTopRight: { alignItems: 'flex-end', gap: vs(4) },
    bioCodeBadge: { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    bioCodeText: { fontFamily: bold, fontSize: ms(11) },
    bioStatusLabel: { fontFamily: bold, fontSize: ms(11) },
    bioStatusPill: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        borderRadius: ms(20), borderWidth: 1,
        paddingHorizontal: ms(10), paddingVertical: vs(5),
    },
    bioStatusDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    bioStatusPillText: { fontFamily: bold, fontSize: ms(10.5) },
    bioGrid: {
        flexDirection: 'row', backgroundColor: '#F8FAFC',
        borderRadius: ms(10), padding: ms(10), marginBottom: vs(10),
    },
    bioGridCell: { flex: 1, alignItems: 'center' },
    bioGridCellBorder: { borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    bioGridHeader: { fontFamily: regular, fontSize: ms(9.5), color: '#9CA3AF', marginBottom: vs(3) },
    bioGridValue: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    bioRefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bioRefChip: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
    },
    bioRefText: { fontFamily: regular, fontSize: ms(10.5), color: '#6B7280' },
    viewTrendBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        borderWidth: 1.5, borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
    },
    viewTrendText: { fontFamily: bold, fontSize: ms(10.5), color: primaryColor },
    bioChartWrap: { marginTop: vs(12), borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: vs(10) },
    xLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6), paddingHorizontal: ms(2) },
    xLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },

    // Shared section card
    sectionCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), padding: ms(16), marginBottom: vs(14),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    insightBanner: {
        flexDirection: 'row', alignItems: 'flex-start', gap: ms(8),
        backgroundColor: primaryColor + '0D', borderRadius: ms(10),
        padding: ms(12), marginBottom: vs(14),
    },
    insightText: { fontFamily: regular, fontSize: ms(11.5), color: '#1A4A44', flex: 1, lineHeight: ms(17) },
    cardSubLabel: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(10) },

    // Symptom
    symptomRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8FAFC', borderRadius: ms(10),
        padding: ms(10), marginBottom: vs(6),
    },
    symptomDot: {
        width: ms(8), height: ms(8), borderRadius: ms(4),
        backgroundColor: primaryColor, marginRight: ms(10),
    },
    symptomDate: { fontFamily: bold, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(2) },
    symptomText: { fontFamily: regular, fontSize: ms(12), color: '#374151' },
    severityBadge: {
        backgroundColor: '#FEF3C7', borderRadius: ms(8),
        paddingHorizontal: ms(8), paddingVertical: vs(3),
    },
    severityText: { fontFamily: bold, fontSize: ms(10), color: '#D97706' },

    // Organs
    organsWrap: { paddingHorizontal: ms(16), marginBottom: vs(14), gap: vs(10) },
    organCard: {
        backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    organTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(12) },
    organIconCircle: {
        width: ms(50), height: ms(50), borderRadius: ms(25),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    organEmoji: { fontSize: ms(26) },
    organName: { fontFamily: bold, fontSize: ms(15), color: blackColor, marginBottom: vs(6) },
    organStatusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingHorizontal: ms(10), paddingVertical: vs(4), borderRadius: ms(20),
    },
    organStatusText: { fontFamily: bold, fontSize: ms(10.5) },
    organDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: vs(12) },
    organContribTitle: { fontFamily: bold, fontSize: ms(11.5), color: '#6B7280', marginBottom: vs(8) },
    organContribWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    organContribChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    organContribName: { fontFamily: regular, fontSize: ms(11.5), color: '#374151' },

    // Lifestyle
    lifestylePill: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(11), marginBottom: vs(6),
    },
    lifestylePillLabel: { fontFamily: regular, fontSize: ms(12.5), color: '#374151' },
    lifestylePillValue: { fontFamily: bold, fontSize: ms(12.5), color: blackColor },

    // Medical Engagement
    meSection: { paddingVertical: vs(8) },
    meSectionBordered: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    meTitleRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(8) },
    meDotLarge: {
        width: ms(10), height: ms(10), borderRadius: ms(5),
        backgroundColor: primaryColor,
    },
    meSectionTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    meRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingVertical: vs(4),
        paddingLeft: ms(18),
    },
    meLabel: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1 },
    meValueChip: {
        backgroundColor: '#F3F4F6', borderRadius: ms(8),
        paddingHorizontal: ms(8), paddingVertical: vs(3),
    },
    meValue: { fontFamily: bold, fontSize: ms(11), color: '#6B7280' },
});
