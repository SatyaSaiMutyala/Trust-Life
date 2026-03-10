import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
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

const ORGAN_IMAGES = {
    Pancreas: require('../../assets/img/human-pancreas.png'),
    Heart: require('../../assets/img/human-heart.png'),
    Kidneys: require('../../assets/img/human-kidneys.png'),
    Eyes: require('../../assets/img/human-eye.png'),
    Lungs: require('../../assets/img/human-lungs.png'),
    Brain: require('../../assets/img/human-brain.png'),
    Liver: require('../../assets/img/human-liver.png'),
    Skin: require('../../assets/img/human-skin.png'),
    Gut: require('../../assets/img/human-gut.png'),
    Thyroid: require('../../assets/img/human-thyroid.png'),
    Vascular: require('../../assets/img/human-vascular.png'),
    Muscle: require('../../assets/img/human-muscle.png'),
};

// ── All condition configs ─────────────────────────────────────────────────────
const CONDITION_CONFIGS = {
    Diabetes: {
        subType: 'Type 2 Diabetes',
        stabilityLabel: 'Mild Escalation',
        statusLabel: 'Under Monitoring',
        description: 'Chronic metabolic disorder affecting how your body processes blood sugar (glucose)',
        diseaseImpact: 'High blood sugar damages blood vessel linings over time, making your heart work harder and arteries stiffer. Your cholesterol and inflammation levels are adding extra stress to multiple organs.',
        stageLabel: 'Moderate Dysfunction',
        stageNum: 2,
        maxStage: 4,
        stageNames: ['Normal', 'Reduced Reserve', 'Moderate Dysfunction', 'Severe Depletion', 'Failure'],
        projectedStage: 'Severe Depletion',
        projectedTime: '3-5 years',
        interventions: [
            { text: 'HbA1c reduction target — consider GLP-1 agonist', priority: 'urgent' },
            { text: 'Nephrology referral — eGFR declining', priority: 'urgent' },
            { text: 'Dilated eye exam — retinopathy screening', priority: 'high' },
            { text: 'Dietary carb reduction + activity increase', priority: 'medium' },
        ],
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
            { name: 'Pancreas', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 55, contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
            { name: 'Heart', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 41, contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
            { name: 'Kidneys', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 38, contributors: [{ name: 'Microalbbumin', showArrow: true }, { name: 'HbA1c', showArrow: false }] },
            { name: 'Eyes', statusLabel: 'Stable', statusBg: '#DCFCE7', statusColor: '#065F46', deterioration: 12, contributors: [{ name: 'Triglycerides', showArrow: true }, { name: 'Glucose Swings', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Sleep consistency', value: '64 %', bg: '#E8E8F8', icon: 'moon' },
            { label: 'Physical Activity', value: '64 %', bg: '#FEFCE8', icon: 'walk' },
            { label: 'Diet Pattern', value: 'High refined carbs', bg: '#DCFCE7', icon: 'restaurant' },
            { label: 'Alcohol', value: 'Occasional', bg: '#FEE2E2', icon: 'wine' },
            { label: 'Stress Indicator', value: 'Elevated', bg: '#F3F4F6', icon: 'pulse' },
        ],
        symptoms: [
            { date: '12 Feb', symptom: 'Excessive Thirst', severity: 3, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Fatigue', severity: 3, maxSeverity: 5 },
            { date: '26 Feb', symptom: 'Blurred Vision', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Cardiologist Consultation', value: '15 Feb 2026' }, { label: 'BP: 148/92 mmHg', value: '' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Amlodipine', value: 'Duration: 3 months' }, { label: 'Dosage: 5 mg', value: '' }] },
            { title: 'Past Surgeries', icon: 'cut', rows: [{ label: 'Appendectomy', value: '12 Aug 2021' }] },
            { title: 'Past Physiotherapy', icon: 'fitness', rows: [{ label: 'Lower Back Physiotherapy', value: 'Jan 2025 – Feb 2025' }] },
            { title: 'Lab Reports', icon: 'document-text', rows: [{ label: 'Lipid Profile', value: '10 Feb 2026' }, { label: 'Total Cholesterol: 210 mg/dL', value: '' }] },
        ],
        monitoring: ['HbA1c trend', 'RBC trend graph'],
    },
    Hypertension: {
        subType: 'Essential Hypertension',
        stabilityLabel: 'Unstable',
        statusLabel: 'Under Monitoring',
        description: 'Persistent high blood pressure that increases risk of heart disease and stroke',
        diseaseImpact: 'Elevated blood pressure puts constant strain on your heart and blood vessels, increasing risk of heart disease, stroke, and kidney damage over time.',
        stageLabel: 'Stage 1 Hypertension',
        stageNum: 1,
        maxStage: 3,
        stageNames: ['Normal', 'Stage 1 Hypertension', 'Stage 2 Hypertension', 'Hypertensive Crisis'],
        projectedStage: 'Stage 2 Hypertension',
        projectedTime: '12-18 months',
        interventions: [
            { text: 'Blood pressure medication review', priority: 'urgent' },
            { text: 'Reduce sodium intake to < 2300mg/day', priority: 'high' },
            { text: 'Regular aerobic exercise — 150 min/week', priority: 'medium' },
        ],
        bioMarkers: [
            {
                name: 'Systolic BP', subtitle: 'Blood Pressure',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '-', abnormal: '145', unit: 'mmHg', ref: '90 - 120',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.30 }, { x: 0.50, y: 0.45 }, { x: 0.66, y: 0.60 }, { x: 1, y: 0.40 }],
            },
        ],
        organs: [
            { name: 'Heart', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 41, contributors: [{ name: 'Blood Pressure', showArrow: true }] },
            { name: 'Kidneys', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 25, contributors: [{ name: 'Creatinine', showArrow: true }] },
        ],
        lifestyle: [
            { label: 'Salt Intake', value: 'High', bg: '#FEE2E2', icon: 'restaurant' },
            { label: 'Physical Activity', value: '45 %', bg: '#FEFCE8', icon: 'walk' },
            { label: 'Stress Indicator', value: 'High', bg: '#FEE2E2', icon: 'pulse' },
        ],
        symptoms: [
            { date: '15 Feb', symptom: 'Headache', severity: 3, maxSeverity: 5 },
            { date: '20 Feb', symptom: 'Dizziness', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'General Checkup', value: '10 Feb 2026' }, { label: 'BP: 150/95 mmHg', value: '' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Losartan', value: 'Duration: 6 months' }, { label: 'Dosage: 50 mg', value: '' }] },
        ],
        monitoring: ['BP trend', 'Heart rate graph'],
    },
    Thyroid: {
        subType: 'Hypothyroidism',
        stabilityLabel: 'Critical',
        statusLabel: 'Needs Attention',
        description: 'Underactive thyroid gland producing insufficient thyroid hormones',
        diseaseImpact: 'Your thyroid isn\'t producing enough hormones, which slows down your metabolism. This affects energy levels, weight, and can impact heart health if untreated.',
        stageLabel: 'Moderate Hypothyroidism',
        stageNum: 2,
        maxStage: 3,
        stageNames: ['Normal', 'Subclinical', 'Moderate Hypothyroidism', 'Severe Hypothyroidism'],
        projectedStage: 'Severe Hypothyroidism',
        projectedTime: '6-12 months',
        interventions: [
            { text: 'Levothyroxine dosage adjustment — TSH still elevated', priority: 'urgent' },
            { text: 'Iodine-rich diet supplementation', priority: 'high' },
            { text: 'Follow-up thyroid panel in 6 weeks', priority: 'medium' },
        ],
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
            { label: 'Sleep consistency', value: '50 %', bg: '#FEFCE8', icon: 'moon' },
            { label: 'Diet Pattern', value: 'Iodine deficient', bg: '#FEE2E2', icon: 'restaurant' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Fatigue', severity: 4, maxSeverity: 5 },
            { date: '22 Feb', symptom: 'Weight Gain', severity: 3, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Endocrinologist Consultation', value: '8 Feb 2026' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Levothyroxine', value: 'Duration: Ongoing' }, { label: 'Dosage: 50 mcg', value: '' }] },
        ],
        monitoring: ['TSH trend', 'T3/T4 trend graph'],
    },
    Fever: {
        subType: 'Acute Fever',
        stabilityLabel: 'Stable',
        statusLabel: 'Monitoring',
        description: 'Body temperature above normal, usually due to infection or inflammation',
        diseaseImpact: null,
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
        bioMarkers: null, organs: null, lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'Body Ache', severity: 3, maxSeverity: 5 },
            { date: '14 Feb', symptom: 'Chills', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'General Physician', value: '12 Feb 2026' }, { label: 'Temp: 101.2°F', value: '' }] },
        ],
        monitoring: ['Temperature trend'],
    },
    Infection: {
        subType: 'Bacterial Infection',
        stabilityLabel: 'Unstable',
        statusLabel: 'Under Treatment',
        description: 'Active bacterial infection requiring antibiotic treatment',
        diseaseImpact: 'Your immune system is actively fighting an infection, causing elevated white blood cell counts and inflammation markers.',
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
        bioMarkers: [
            {
                name: 'WBC Count', subtitle: 'White Blood Cells',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '-', abnormal: '12400', unit: '/µL', ref: '4000 - 11000',
                points: [{ x: 0, y: 0.75 }, { x: 0.18, y: 0.50 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.35 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.30 }],
            },
        ],
        organs: null, lifestyle: null,
        symptoms: [
            { date: '10 Feb', symptom: 'Fever', severity: 3, maxSeverity: 5 },
            { date: '12 Feb', symptom: 'Swelling', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Infectious Disease Specialist', value: '10 Feb 2026' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Amoxicillin', value: 'Duration: 7 days' }, { label: 'Dosage: 500 mg', value: '' }] },
        ],
        monitoring: ['WBC trend', 'CRP trend'],
    },
    Allergy: {
        subType: 'Seasonal Allergy',
        stabilityLabel: 'Stable',
        statusLabel: 'Monitoring',
        description: 'Immune system overreaction to seasonal allergens',
        diseaseImpact: null,
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
        bioMarkers: null, organs: null, lifestyle: null,
        symptoms: [
            { date: '15 Feb', symptom: 'Sneezing', severity: 2, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Itchy Eyes', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Allergist Consultation', value: '14 Feb 2026' }] },
        ],
        monitoring: ['IgE trend'],
    },
    'Chronic kidney disease': {
        subType: 'CKD Stage 3',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Monitoring',
        description: 'Gradual loss of kidney function over time',
        diseaseImpact: 'Your kidneys act as filters for your blood. The filtration rate (eGFR 52) is below healthy range and slowly declining. Early intervention is crucial to slow progression.',
        stageLabel: 'Stage 2 CKD',
        stageNum: 2,
        maxStage: 5,
        stageNames: ['Normal', 'Mild Reduction', 'Stage 2 CKD', 'Stage 3 CKD', 'Stage 4 CKD', 'Kidney Failure'],
        projectedStage: 'Stage 3 CKD',
        projectedTime: '12-18 months',
        interventions: [
            { text: 'Nephrology referral — eGFR declining', priority: 'urgent' },
            { text: 'ACR urine test overdue', priority: 'high' },
            { text: 'SGLT2 inhibitor review', priority: 'high' },
            { text: 'Protein intake monitoring', priority: 'medium' },
        ],
        bioMarkers: [
            {
                name: 'eGFR', subtitle: 'Estimated Glomerular Filtration',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#F59E0B',
                normal: '-', abnormal: '52', unit: 'mL/min', ref: '> 90',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.22 }, { x: 0.50, y: 0.28 }, { x: 0.66, y: 0.45 }, { x: 1, y: 0.35 }],
            },
        ],
        organs: [
            { name: 'Kidneys', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 38, contributors: [{ name: 'Creatinine', showArrow: true }, { name: 'eGFR', showArrow: false }] },
        ],
        lifestyle: [
            { label: 'Protein Intake', value: 'Moderate', bg: '#FEFCE8', icon: 'restaurant' },
            { label: 'Hydration', value: 'Adequate', bg: '#DCFCE7', icon: 'water' },
        ],
        symptoms: [
            { date: '14 Feb', symptom: 'Swelling in legs', severity: 3, maxSeverity: 5 },
            { date: '20 Feb', symptom: 'Fatigue', severity: 3, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Nephrologist Consultation', value: '12 Feb 2026' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Telmisartan', value: 'Duration: Ongoing' }, { label: 'Dosage: 40 mg', value: '' }] },
        ],
        monitoring: ['eGFR trend', 'Creatinine trend'],
    },
    "Alzheimer's disease": {
        subType: 'Early Onset',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Monitoring',
        description: 'Progressive neurological disorder affecting memory and cognitive function',
        diseaseImpact: 'Amyloid plaques are building up in the brain, affecting nerve cell communication. Early detection allows for interventions that can slow cognitive decline.',
        stageLabel: 'Early Changes',
        stageNum: 1,
        maxStage: 4,
        stageNames: ['Normal', 'Early Changes', 'Mild Cognitive Impairment', 'Moderate', 'Severe'],
        projectedStage: 'Mild Cognitive Impairment',
        projectedTime: '24-36 months',
        interventions: [
            { text: 'Cognitive behavioral therapy sessions', priority: 'high' },
            { text: 'Social engagement programs', priority: 'high' },
            { text: 'Sleep hygiene improvement', priority: 'medium' },
        ],
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
            { label: 'Sleep consistency', value: '55 %', bg: '#FEFCE8', icon: 'moon' },
            { label: 'Social Engagement', value: 'Low', bg: '#FEE2E2', icon: 'people' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Memory Lapses', severity: 3, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Confusion', severity: 2, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Neurologist Consultation', value: '8 Feb 2026' }] },
        ],
        monitoring: ['Cognitive score trend'],
    },
    Pneumonia: {
        subType: 'Community-Acquired',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Treatment',
        description: 'Lung infection causing inflammation and difficulty breathing',
        diseaseImpact: 'Infection is causing inflammation in your lung tissue, reducing oxygen transfer. Your SpO2 at 88% needs close monitoring.',
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
        bioMarkers: [
            {
                name: 'Oxygen Saturation', subtitle: 'SpO2',
                statusCode: 'L', statusLabel: 'Low', statusColor: '#EF4444',
                normal: '-', abnormal: '88', unit: '%', ref: '95 - 100',
                points: [{ x: 0, y: 0.70 }, { x: 0.18, y: 0.48 }, { x: 0.33, y: 0.20 }, { x: 0.50, y: 0.25 }, { x: 0.66, y: 0.38 }, { x: 1, y: 0.30 }],
            },
        ],
        organs: [
            { name: 'Lungs', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', deterioration: 45, contributors: [{ name: 'SpO2', showArrow: false }, { name: 'CRP', showArrow: true }] },
        ],
        lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'Cough', severity: 4, maxSeverity: 5 },
            { date: '15 Feb', symptom: 'Shortness of Breath', severity: 3, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Pulmonologist Consultation', value: '12 Feb 2026' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: Azithromycin', value: 'Duration: 5 days' }, { label: 'Dosage: 500 mg', value: '' }] },
        ],
        monitoring: ['SpO2 trend', 'CRP trend'],
    },
    Sepsis: {
        subType: 'Severe Sepsis',
        stabilityLabel: 'Critical',
        statusLabel: 'Under Treatment',
        description: 'Life-threatening organ dysfunction caused by infection',
        diseaseImpact: 'Your body\'s response to infection is causing organ dysfunction. Lactate at 4.0 indicates tissue hypoperfusion — critical care is essential.',
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
        bioMarkers: [
            {
                name: 'Lactate', subtitle: 'Blood Lactate',
                statusCode: 'H**', statusLabel: 'Critical High', statusColor: '#EF4444',
                normal: '-', abnormal: '4.0', unit: 'mmol/L', ref: '0.5 - 2.2',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.18 }, { x: 0.50, y: 0.25 }, { x: 0.66, y: 0.38 }, { x: 1, y: 0.28 }],
            },
        ],
        organs: null, lifestyle: null,
        symptoms: [
            { date: '12 Feb', symptom: 'High Fever', severity: 5, maxSeverity: 5 },
            { date: '13 Feb', symptom: 'Confusion', severity: 4, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'ICU Admission', value: '12 Feb 2026' }] },
            { title: 'Past Prescription', icon: 'medical', rows: [{ label: 'Medication: IV Antibiotics', value: 'Duration: Ongoing' }] },
        ],
        monitoring: ['Lactate trend', 'MAP trend'],
    },
    Malnutrition: {
        subType: 'Protein-Energy Malnutrition',
        stabilityLabel: 'Stable',
        statusLabel: 'Under Monitoring',
        description: 'Nutritional deficiency affecting overall health and immunity',
        diseaseImpact: 'Insufficient protein and caloric intake is weakening your immune system and slowing tissue repair. Albumin at 2.8 confirms significant protein deficit.',
        stageLabel: null, stageNum: null, maxStage: null, stageNames: null,
        projectedStage: null, projectedTime: null, interventions: null,
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
            { label: 'Caloric Intake', value: 'Low', bg: '#FEE2E2', icon: 'flame' },
            { label: 'Diet Pattern', value: 'Deficient', bg: '#FEE2E2', icon: 'restaurant' },
        ],
        symptoms: [
            { date: '10 Feb', symptom: 'Weight Loss', severity: 4, maxSeverity: 5 },
            { date: '18 Feb', symptom: 'Weakness', severity: 3, maxSeverity: 5 },
        ],
        medicalEngagement: [
            { title: 'Past Doctor Visit', icon: 'person', rows: [{ label: 'Nutritionist Consultation', value: '8 Feb 2026' }] },
        ],
        monitoring: ['BMI trend', 'Albumin trend'],
    },
};

// ── Stability color helper ──────────────────────────────────────────────
const getStabilityStyle = (label) => {
    if (label === 'Stable') return { bg: '#DCFCE7', color: '#065F46' };
    if (label === 'Unstable' || label === 'Mild Escalation') return { bg: '#FEF3C7', color: '#92400E' };
    if (label === 'Critical') return { bg: '#FEE2E2', color: '#991B1B' };
    return { bg: '#F3F4F6', color: '#374151' };
};

const getStatusStyle = (label) => {
    if (label === 'Monitoring') return { bg: '#DBEAFE', color: '#1E40AF' };
    if (label === 'Under Monitoring') return { bg: '#DBEAFE', color: '#1E40AF' };
    if (label === 'Under Treatment') return { bg: '#FEF3C7', color: '#92400E' };
    if (label === 'Needs Attention') return { bg: '#FEE2E2', color: '#991B1B' };
    return { bg: '#F3F4F6', color: '#374151' };
};

const getDeteriorationColor = (pct) => {
    if (pct < 25) return '#16A34A';
    if (pct < 45) return '#F59E0B';
    if (pct < 65) return '#EF4444';
    return '#DC2626';
};

const getPriorityStyle = (priority) => {
    if (priority === 'urgent') return { bg: '#FEE2E2', color: '#DC2626', icon: 'alert-circle' };
    if (priority === 'high') return { bg: '#FEF3C7', color: '#D97706', icon: 'warning' };
    return { bg: '#DBEAFE', color: '#2563EB', icon: 'information-circle' };
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
            {expanded && <BioChart points={item.points} id={`bio_${index}`} />}
        </View>
    );
};

// ── Organ Card ──────────────────────────────────────────────────────────────
const OrganCard = ({ item, onPress }) => {
    const detColor = getDeteriorationColor(item.deterioration || 0);
    const pct = item.deterioration || 0;
    return (
        <TouchableOpacity style={styles.organCard} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.organTopRow}>
                <View style={styles.organIconCircle}>
                    {ORGAN_IMAGES[item.name] ? (
                        <Image source={ORGAN_IMAGES[item.name]} style={styles.organImg} resizeMode="contain" />
                    ) : (
                        <Icon type={Icons.Ionicons} name="body" size={ms(24)} color={primaryColor} />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.organName}>{item.name}</Text>
                    <View style={[styles.organStatusBadge, { backgroundColor: item.statusBg }]}>
                        <Text style={[styles.organStatusText, { color: item.statusColor }]}>{item.statusLabel}</Text>
                    </View>
                </View>
                {pct > 0 && (
                    <View style={styles.organStressWrap}>
                        <Text style={[styles.organStressValue, { color: detColor }]}>{pct}</Text>
                        <Text style={styles.organStressLabel}>stress</Text>
                        <View style={styles.organStressBar}>
                            <View style={[styles.organStressFill, { width: `${pct}%`, backgroundColor: detColor }]} />
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.organContribWrap}>
                {item.contributors.map((c, i) => (
                    <View key={i} style={styles.organContribChip}>
                        <Text style={styles.organContribName}>{c.name}</Text>
                        {c.showArrow && <Icon type={Icons.Ionicons} name="arrow-up" size={ms(12)} color="#EF4444" style={{ marginLeft: ms(4) }} />}
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};

// ── Main Screen ──────────────────────────────────────────────────────────────
const CategoryDiseaseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const condition = route.params?.condition || {};
    const conditionName = condition.name || 'Diabetes';
    const config = CONDITION_CONFIGS[conditionName] || CONDITION_CONFIGS.Diabetes;
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
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{conditionName}</Text>
                        <Text style={styles.headerSub}>{config.subType}</Text>
                    </View>
                    <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active</Text>
                    </View>
                </View>

                {/* ── Summary Card ── */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryDesc}>{config.description}</Text>
                    <View style={styles.summaryBadges}>
                        <View style={[styles.summaryBadge, { backgroundColor: stabilityStyle.bg }]}>
                            <Icon type={Icons.Ionicons} name="pulse" size={ms(12)} color={stabilityStyle.color} />
                            <Text style={[styles.summaryBadgeText, { color: stabilityStyle.color }]}>{config.stabilityLabel}</Text>
                        </View>
                        <View style={[styles.summaryBadge, { backgroundColor: statusStyle.bg }]}>
                            <Icon type={Icons.Ionicons} name="eye" size={ms(12)} color={statusStyle.color} />
                            <Text style={[styles.summaryBadgeText, { color: statusStyle.color }]}>{config.statusLabel}</Text>
                        </View>
                    </View>
                    <Text style={styles.summaryDate}>Last update: {condition.date || '12 Jan, 12:30 PM'}</Text>
                </View>

                {/* ── Disease Impact ── */}
                {config.diseaseImpact && (
                    <View style={styles.impactCard}>
                        <View style={styles.impactHeader}>
                            <Icon type={Icons.Ionicons} name="information-circle" size={ms(18)} color={primaryColor} />
                            <Text style={styles.impactTitle}>What's Happening</Text>
                        </View>
                        <Text style={styles.impactText}>{config.diseaseImpact}</Text>
                    </View>
                )}

                {/* ── Stage Progression ── */}
                {config.stageNames && config.stageNum !== null && (
                    <View style={styles.stageCard}>
                        <View style={styles.stageHeader}>
                            <Icon type={Icons.Ionicons} name="git-branch" size={ms(18)} color={blackColor} />
                            <Text style={styles.stageHeaderText}>Disease Stage</Text>
                        </View>
                        <View style={styles.stageBarRow}>
                            {config.stageNames.map((s, i) => {
                                const isActive = i <= config.stageNum;
                                const isCurrent = i === config.stageNum;
                                const stageColor = i <= 1 ? '#16A34A' : i <= 2 ? '#F59E0B' : '#EF4444';
                                return (
                                    <View key={i} style={{ flex: 1 }}>
                                        <View style={[styles.stageSegment, { backgroundColor: isActive ? stageColor : '#E5E7EB' }]} />
                                        {isCurrent && (
                                            <View style={styles.stageCurrentWrap}>
                                                <View style={[styles.stageCurrentDot, { backgroundColor: stageColor }]} />
                                                <Text style={[styles.stageCurrentLabel, { color: stageColor }]}>{s}</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.stageFooter}>
                            <Text style={styles.stageFooterNormal}>Normal</Text>
                            {config.projectedStage && (
                                <Text style={styles.stageProjected}>
                                    Projected: {config.projectedStage} in {config.projectedTime}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* ── Organs Health ── */}
                {config.organs && config.organs.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="body" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Organs Affected</Text>
                        </View>
                        <View style={styles.organsGrid}>
                            {config.organs.map((item, i) => (
                                <OrganCard
                                    key={i}
                                    item={item}
                                    onPress={() => navigation.navigate('OrganDetailScreen', { organ: item.name })}
                                />
                            ))}
                        </View>
                    </>
                )}

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

                {/* ── Required Actions ── */}
                {config.interventions && config.interventions.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(18)} color={blackColor} />
                            <Text style={styles.sectionHeaderText}>Required Actions</Text>
                        </View>
                        <View style={styles.interventionsWrap}>
                            {config.interventions.map((item, i) => {
                                const ps = getPriorityStyle(item.priority);
                                return (
                                    <View key={i} style={[styles.interventionCard, { borderLeftColor: ps.color }]}>
                                        <View style={[styles.interventionIconWrap, { backgroundColor: ps.bg }]}>
                                            <Icon type={Icons.Ionicons} name={ps.icon} size={ms(14)} color={ps.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.interventionText}>{item.text}</Text>
                                            <Text style={[styles.interventionPriority, { color: ps.color }]}>
                                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} priority
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
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
    headerTextWrap: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },
    activeBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#DCFCE7', paddingHorizontal: ms(10),
        paddingVertical: vs(4), borderRadius: ms(12),
    },
    activeDot: { width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: '#16A34A', marginRight: ms(5) },
    activeText: { fontFamily: bold, fontSize: ms(10), color: '#16A34A' },

    // Summary Card
    summaryCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(18), marginBottom: vs(16),
    },
    summaryDesc: { fontFamily: regular, fontSize: ms(13), color: '#6B7280', lineHeight: ms(20), marginBottom: vs(14) },
    summaryBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(12) },
    summaryBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        paddingHorizontal: ms(12), paddingVertical: vs(6), borderRadius: ms(10),
    },
    summaryBadgeText: { fontFamily: bold, fontSize: ms(12) },
    summaryDate: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF' },

    // Disease Impact
    impactCard: {
        backgroundColor: primaryColor + '08', borderRadius: ms(16), borderWidth: 1,
        borderColor: primaryColor + '20', marginHorizontal: ms(20),
        padding: ms(16), marginBottom: vs(16),
    },
    impactHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(10) },
    impactTitle: { fontFamily: bold, fontSize: ms(14), color: primaryColor },
    impactText: { fontFamily: regular, fontSize: ms(13), color: '#374151', lineHeight: ms(21) },

    // Stage Progression
    stageCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(16),
    },
    stageHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(14) },
    stageHeaderText: { fontFamily: bold, fontSize: ms(15), color: blackColor },
    stageBarRow: { flexDirection: 'row', gap: ms(3), marginBottom: vs(6) },
    stageSegment: { height: vs(5), borderRadius: ms(3) },
    stageCurrentWrap: { flexDirection: 'row', alignItems: 'center', gap: ms(4), marginTop: vs(6) },
    stageCurrentDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    stageCurrentLabel: { fontFamily: bold, fontSize: ms(10) },
    stageFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8) },
    stageFooterNormal: { fontFamily: regular, fontSize: ms(10), color: '#16A34A' },
    stageProjected: { fontFamily: regular, fontSize: ms(10), color: '#F59E0B' },

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

    // Organs
    organsGrid: { paddingHorizontal: ms(20), marginBottom: vs(14), gap: vs(10) },
    organCard: { backgroundColor: whiteColor, borderRadius: ms(16), padding: ms(16) },
    organTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
    organIconCircle: {
        width: ms(46), height: ms(46), borderRadius: ms(23),
        backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    organImg: { width: ms(30), height: ms(30) },
    organName: { fontFamily: bold, fontSize: ms(15), color: blackColor, marginBottom: vs(4) },
    organStatusBadge: { paddingHorizontal: ms(10), paddingVertical: vs(3), borderRadius: ms(8), alignSelf: 'flex-start' },
    organStatusText: { fontFamily: bold, fontSize: ms(10) },
    organStressWrap: { alignItems: 'center', width: ms(50) },
    organStressValue: { fontFamily: bold, fontSize: ms(18) },
    organStressLabel: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF', marginBottom: vs(3) },
    organStressBar: { width: ms(40), height: vs(3), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    organStressFill: { height: '100%', borderRadius: ms(2) },
    organContribWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    organContribChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(5),
    },
    organContribName: { fontFamily: regular, fontSize: ms(11), color: '#374151' },

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

    // Interventions / Required Actions
    interventionsWrap: { paddingHorizontal: ms(20), marginBottom: vs(14) },
    interventionCard: {
        flexDirection: 'row', alignItems: 'center', gap: ms(12),
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14),
        marginBottom: vs(8), borderLeftWidth: ms(3),
    },
    interventionIconWrap: {
        width: ms(32), height: ms(32), borderRadius: ms(8),
        justifyContent: 'center', alignItems: 'center',
    },
    interventionText: { fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(18) },
    interventionPriority: { fontFamily: bold, fontSize: ms(10), marginTop: vs(3) },

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
