import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text, ScrollView,
    TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');

const ORGAN_IMAGES = {
    Heart: require('../../assets/img/human-heart.png'),
    Kidneys: require('../../assets/img/human-kidneys.png'),
    Eyes: require('../../assets/img/human-eye.png'),
    Nerves: require('../../assets/img/human-brain.png'),
    Liver: require('../../assets/img/human-liver.png'),
    Pancreas: require('../../assets/img/human-pancreas.png'),
    Lungs: require('../../assets/img/human-lungs.png'),
    Gut: require('../../assets/img/human-gut.png'),
    Thyroid: require('../../assets/img/human-thyroid.png'),
    Thymus: require('../../assets/img/human-thymus.png'),
    Skin: require('../../assets/img/human-skin.png'),
    Muscle: require('../../assets/img/human-muscle.png'),
    Vascular: require('../../assets/img/human-vascular.png'),
    Reproductive: require('../../assets/img/human-reproductive.png'),
};

// ── ORGAN DATA ──────────────────────────────────────────────────────────────
const ORGANS = {
    heart: {
        id: 'heart', name: 'Heart', cx: 90, cy: 122, r: 13,
        stress: 41, stage: 'Early Stress', stageI: 1,
        stages: ['Normal', 'Early Stress', 'Impairment', 'Damage', 'Failure'],
        color: '#FF4560', trend: 'worsening',
        biomarkers: ['LDL', 'CRP', 'BP', 'Triglycerides'],
        bms: [
            { name: 'LDL Cholesterol', val: '142 mg/dL', tgt: '<100', sev: 'high', why: 'Accelerating coronary plaque deposition' },
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'high', why: 'Myocardial inflammatory stress' },
            { name: 'Blood Pressure', val: '138/88', tgt: '<130/80', sev: 'med', why: 'Increased afterload → LVH risk' },
            { name: 'Triglycerides', val: '198 mg/dL', tgt: '<150', sev: 'med', why: 'Arterial wall lipid infiltration' },
        ],
        patientText: 'High blood sugar damages artery walls, making your heart work harder. Your cholesterol and inflammation are adding extra strain.',
        clinicalText: 'Chronic hyperglycemia → endothelial glycation → accelerated atherosclerosis. Insulin resistance drives dyslipidemia and hypertension — triple coronary threat.',
        nextStage: 'Functional Impairment', nextTime: '18-24 mo',
        actions: ['Statin initiation', 'ACE-i consideration', 'Annual ECG', 'Dietary fat counseling'],
    },
    kidneys: {
        id: 'kidneys', name: 'Kidneys', cx: 100, cy: 172, r: 13,
        stress: 38, stage: 'Stage 2 CKD', stageI: 2,
        stages: ['Normal', 'Mild', 'Stage 2 CKD', 'Stage 3', 'Stage 4', 'Failure'],
        color: '#4B9EFF', trend: 'worsening',
        biomarkers: ['eGFR', 'Creatinine', 'BUN', 'ACR'],
        bms: [
            { name: 'eGFR', val: '68 mL/min', tgt: '>90', sev: 'high', why: 'Glomerular filtration declining — early nephropathy' },
            { name: 'Creatinine', val: '1.4 mg/dL', tgt: '<1.2', sev: 'med', why: 'Waste clearance reducing, nephron stress rising' },
            { name: 'BUN', val: '22 mg/dL', tgt: '7-20', sev: 'low', why: 'Mild nitrogen retention — filtration decline' },
            { name: 'ACR', val: 'Not tested', tgt: '<30 mg/g', sev: 'med', why: 'Microalbuminuria test overdue' },
        ],
        patientText: 'Your kidneys filter your blood like a sieve. High blood sugar damages these filters. Your kidney score (eGFR 68) is below healthy range.',
        clinicalText: 'Diabetic nephropathy: hyperglycemia causes glomerular hyperfiltration then fibrosis. eGFR 68 = Stage 2 CKD with active deterioration. ACR urgently needed.',
        nextStage: 'Stage 3 CKD', nextTime: '12-18 mo',
        actions: ['Nephrology referral — urgent', 'Order ACR urine test', 'SGLT2i review', 'Protein intake monitoring'],
    },
    eyes: {
        id: 'eyes', name: 'Eyes', cx: 100, cy: 52, r: 11,
        stress: 28, stage: 'Early Changes', stageI: 1,
        stages: ['Normal', 'Early Changes', 'Non-prolif', 'Proliferative', 'Vision Loss'],
        color: '#9B72FF', trend: 'stable-risk',
        biomarkers: ['HbA1c', 'BP'],
        bms: [
            { name: 'HbA1c', val: '7.8%', tgt: '<7%', sev: 'high', why: 'Sustained hyperglycemia damaging retinal microvasculature' },
            { name: 'Blood Pressure', val: '138/88', tgt: '<130/80', sev: 'med', why: 'Hypertensive retinopathy compounding diabetic risk' },
        ],
        patientText: 'The tiny blood vessels in your eyes are delicate. High blood sugar can damage them and affect your vision.',
        clinicalText: 'Diabetic retinopathy: chronic hyperglycemia causes retinal microaneurysms and capillary leakage. HbA1c 7.8% + blurred vision = ophthalmology referral urgent.',
        nextStage: 'Non-proliferative', nextTime: '12-36 mo',
        actions: ['Dilated fundus exam — urgent', 'HbA1c reduction target <7%', 'BP control <130/80', 'Annual retinal photography'],
    },
    nerves: {
        id: 'nerves', name: 'Nerves', cx: 100, cy: 295, r: 11,
        stress: 32, stage: 'Early Neuropathy', stageI: 1,
        stages: ['Normal', 'Early', 'Mild', 'Moderate', 'Severe'],
        color: '#F5A524', trend: 'worsening',
        biomarkers: ['HbA1c', 'Glucose', 'B12'],
        bms: [
            { name: 'HbA1c', val: '7.8%', tgt: '<7%', sev: 'high', why: 'Glycation of myelin sheaths — nerve conduction slowing' },
            { name: 'Fasting Glucose', val: '172 mg/dL', tgt: '<100', sev: 'high', why: 'Oxidative stress directly injuring peripheral axons' },
            { name: 'Vitamin B12', val: 'Not tested', tgt: '>300', sev: 'med', why: 'Metformin depletes B12 — compound neuropathy risk' },
        ],
        patientText: 'Your nerves in feet are being affected by high blood sugar — that\'s the tingling you feel. If untreated, it can progress to numbness.',
        clinicalText: 'Diabetic peripheral neuropathy: metabolic-vascular nerve fiber injury. Patient-confirmed foot tingling = early sensory neuropathy.',
        nextStage: 'Mild Neuropathy', nextTime: '6-12 mo',
        actions: ['Monofilament foot exam', 'B12 + methylmalonic acid', 'Foot inspection protocol', 'Pain management consult'],
    },
    liver: {
        id: 'liver', name: 'Liver', cx: 116, cy: 134, r: 11,
        stress: 29, stage: 'Steatosis', stageI: 1,
        stages: ['Normal', 'Steatosis', 'NASH', 'Fibrosis', 'Cirrhosis'],
        color: '#00C8D4', trend: 'stable-risk',
        biomarkers: ['ALT', 'AST', 'Triglycerides'],
        bms: [
            { name: 'ALT', val: '52 U/L', tgt: '<40', sev: 'med', why: 'Hepatocellular stress — early NAFLD pattern' },
            { name: 'AST', val: '44 U/L', tgt: '<40', sev: 'med', why: 'AST/ALT ratio confirms metabolic liver disease' },
            { name: 'Triglycerides', val: '198 mg/dL', tgt: '<150', sev: 'med', why: 'Hepatic lipogenesis driven by insulin resistance' },
        ],
        patientText: 'Your liver is showing early fat accumulation — common with high blood sugar. The good news: it\'s reversible with lifestyle changes.',
        clinicalText: 'NAFLD: insulin resistance promotes hepatic lipogenesis and TG accumulation. Elevated ALT/AST confirm steatosis. Fibroscan recommended.',
        nextStage: 'NASH', nextTime: '24-36 mo',
        actions: ['Hepatology screening', 'Fibroscan / abdominal US', 'GGT + ferritin levels', 'Alcohol abstinence'],
    },
    pancreas: {
        id: 'pancreas', name: 'Pancreas', cx: 84, cy: 148, r: 11,
        stress: 55, stage: 'Moderate Dysfunction', stageI: 2,
        stages: ['Normal', 'Reduced Reserve', 'Moderate', 'Severe Depletion', 'Failure'],
        color: '#FF7235', trend: 'worsening',
        biomarkers: ['HbA1c', 'C-Peptide', 'Glucose'],
        bms: [
            { name: 'HbA1c', val: '7.8%', tgt: '<7%', sev: 'high', why: 'Persistent hyperglycemia accelerates beta-cell exhaustion' },
            { name: 'C-Peptide', val: '0.8 ng/mL', tgt: '1.1-4.4', sev: 'high', why: 'Confirms declining insulin secretory capacity' },
            { name: 'Fasting Glucose', val: '172 mg/dL', tgt: '<100', sev: 'high', why: 'Glucotoxicity directly injures remaining beta cells' },
        ],
        patientText: 'Your pancreas makes insulin — the key that lets sugar into cells. Years of high blood sugar have worn down insulin-producing cells.',
        clinicalText: 'Beta-cell depletion: glucotoxicity creates a vicious cycle. Low C-peptide (0.8) confirms moderate secretory failure. GLP-1/insulin evaluation indicated.',
        nextStage: 'Severe Depletion', nextTime: '3-5 yr',
        actions: ['C-peptide monitoring', 'GLP-1 agonist evaluation', 'Insulin therapy assessment', 'Beta-cell preservation protocol'],
    },
    lungs: {
        id: 'lungs', name: 'Lungs', cx: 100, cy: 108, r: 13,
        stress: 22, stage: 'Mild Restriction', stageI: 1,
        stages: ['Normal', 'Mild Restriction', 'Moderate', 'Severe', 'Failure'],
        color: '#06B6D4', trend: 'stable-risk',
        biomarkers: ['SpO2', 'FEV1', 'CRP'],
        bms: [
            { name: 'SpO2', val: '97%', tgt: '>98%', sev: 'low', why: 'Mild reduction in oxygen saturation under exertion' },
            { name: 'FEV1', val: '82%', tgt: '>80%', sev: 'low', why: 'Borderline airflow — early obstructive pattern' },
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'med', why: 'Systemic inflammation can impair alveolar function' },
        ],
        patientText: 'Your lungs are working well, with minor early changes. Staying active and avoiding smoke keeps them healthy.',
        clinicalText: 'Mild restrictive pattern on spirometry. Elevated CRP may indicate early subclinical pulmonary inflammation. Monitor SpO2 trends.',
        nextStage: 'Moderate Restriction', nextTime: '36-48 mo',
        actions: ['Annual spirometry', 'Smoking cessation if applicable', 'Cardiopulmonary exercise test', 'SpO2 monitoring'],
    },
    gut: {
        id: 'gut', name: 'Gut', cx: 100, cy: 192, r: 11,
        stress: 34, stage: 'Dysbiosis', stageI: 1,
        stages: ['Normal', 'Dysbiosis', 'Permeability', 'Inflammation', 'Severe'],
        color: '#84CC16', trend: 'worsening',
        biomarkers: ['CRP', 'Glucose', 'Ferritin'],
        bms: [
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'high', why: 'Gut-driven systemic inflammatory signaling' },
            { name: 'Fasting Glucose', val: '172 mg/dL', tgt: '<100', sev: 'high', why: 'Dysglycemia alters gut microbiome composition' },
            { name: 'Ferritin', val: '88 ng/mL', tgt: '20-80', sev: 'low', why: 'Mild elevation suggests gut-barrier stress' },
        ],
        patientText: 'Your gut bacteria balance is disrupted. High blood sugar changes the gut environment, which can affect digestion and immunity.',
        clinicalText: 'Dysglycemia-driven microbiome dysbiosis: elevated glucose alters bacterial diversity. CRP elevation may reflect gut permeability increase.',
        nextStage: 'Gut Permeability', nextTime: '12-24 mo',
        actions: ['Probiotic trial', 'High-fiber dietary plan', 'Gut microbiome panel', 'GI motility evaluation'],
    },
    thyroid: {
        id: 'thyroid', name: 'Thyroid', cx: 100, cy: 72, r: 11,
        stress: 18, stage: 'Subclinical Risk', stageI: 0,
        stages: ['Normal', 'Subclinical Risk', 'Hypothyroid', 'Hyperthyroid', 'Failure'],
        color: '#A78BFA', trend: 'stable-risk',
        biomarkers: ['TSH', 'T3', 'T4'],
        bms: [
            { name: 'TSH', val: '3.8 mIU/L', tgt: '0.4-4.0', sev: 'low', why: 'High-normal TSH — borderline subclinical hypothyroid' },
            { name: 'Free T3', val: 'Not tested', tgt: '2.3-4.2', sev: 'med', why: 'Active thyroid hormone — testing overdue' },
            { name: 'Free T4', val: 'Not tested', tgt: '0.8-1.8', sev: 'med', why: 'Required to rule out subclinical hypothyroidism' },
        ],
        patientText: 'Your thyroid controls your metabolism. It looks mostly normal, but some values suggest monitoring is needed.',
        clinicalText: 'TSH at upper limit — subclinical hypothyroidism possible. Fatigue and insulin resistance can compound thyroid dysfunction.',
        nextStage: 'Hypothyroid', nextTime: '24-60 mo',
        actions: ['Free T3/T4 panel', 'Anti-TPO antibodies', 'Annual TSH monitoring', 'Iodine intake review'],
    },
    thymus: {
        id: 'thymus', name: 'Thymus', cx: 90, cy: 95, r: 10,
        stress: 15, stage: 'Age-related Decline', stageI: 1,
        stages: ['Active', 'Decline', 'Involution', 'Atrophy', 'Inactive'],
        color: '#F472B6', trend: 'stable-risk',
        biomarkers: ['WBC', 'Lymphocytes', 'CRP'],
        bms: [
            { name: 'WBC', val: '7.2 K/µL', tgt: '4.5-11', sev: 'low', why: 'Within range — immune output appears adequate' },
            { name: 'Lymphocytes', val: '28%', tgt: '20-40%', sev: 'low', why: 'Normal adaptive immune cell proportion' },
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'high', why: 'Chronic inflammation suppresses thymic T-cell output' },
        ],
        patientText: 'Your thymus trains immune cells. It naturally shrinks with age, but chronic inflammation can speed up this process.',
        clinicalText: 'Thymic involution expected at this age. Elevated CRP may accelerate immune senescence. Lymphocyte subset analysis recommended.',
        nextStage: 'Progressive Involution', nextTime: 'Ongoing',
        actions: ['Lymphocyte subset panel', 'Reduce systemic inflammation', 'Vitamin D optimization', 'Immune function assessment'],
    },
    skin: {
        id: 'skin', name: 'Skin', cx: 70, cy: 200, r: 10,
        stress: 26, stage: 'Early Changes', stageI: 1,
        stages: ['Normal', 'Early Changes', 'Moderate', 'Severe', 'Ulceration'],
        color: '#FB923C', trend: 'stable-risk',
        biomarkers: ['HbA1c', 'Glucose', 'CRP'],
        bms: [
            { name: 'HbA1c', val: '7.8%', tgt: '<7%', sev: 'high', why: 'Glycation impairs skin collagen cross-linking and repair' },
            { name: 'Fasting Glucose', val: '172 mg/dL', tgt: '<100', sev: 'high', why: 'High glucose slows wound healing and increases infection risk' },
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'med', why: 'Inflammation promotes skin barrier dysfunction' },
        ],
        patientText: 'High blood sugar affects how your skin heals. Small wounds may take longer to close and infections may occur more easily.',
        clinicalText: 'Diabetic dermopathy risk: hyperglycemia impairs microvascular supply and collagen turnover. Monitor for shin spots and slow-healing lesions.',
        nextStage: 'Moderate Skin Changes', nextTime: '18-36 mo',
        actions: ['Dermatology skin check', 'Wound care protocol', 'Moisturization plan', 'Foot skin monitoring'],
    },
    muscle: {
        id: 'muscle', name: 'Muscle', cx: 70, cy: 240, r: 10,
        stress: 30, stage: 'Early Sarcopenia', stageI: 1,
        stages: ['Normal', 'Early Sarcopenia', 'Moderate', 'Severe', 'Disability'],
        color: '#10B981', trend: 'worsening',
        biomarkers: ['CK', 'Glucose', 'Albumin'],
        bms: [
            { name: 'Creatine Kinase', val: 'Not tested', tgt: '22-198', sev: 'med', why: 'Muscle breakdown marker — testing recommended' },
            { name: 'Fasting Glucose', val: '172 mg/dL', tgt: '<100', sev: 'high', why: 'Insulin resistance reduces muscle glucose uptake' },
            { name: 'Albumin', val: '4.0 g/dL', tgt: '3.5-5.0', sev: 'low', why: 'Normal protein status — critical for muscle preservation' },
        ],
        patientText: 'Low physical activity and high blood sugar reduce muscle mass over time. This makes daily tasks harder and raises fall risk.',
        clinicalText: 'Insulin resistance impairs muscle protein synthesis. Low step count (3,200/day) accelerates sarcopenia. Resistance exercise is primary intervention.',
        nextStage: 'Moderate Sarcopenia', nextTime: '24-36 mo',
        actions: ['Grip strength test', 'Resistance training program', 'Protein intake 1.2g/kg', 'DEXA body composition scan'],
    },
    vascular: {
        id: 'vascular', name: 'Vascular', cx: 100, cy: 160, r: 12,
        stress: 45, stage: 'Early Atherosclerosis', stageI: 2,
        stages: ['Normal', 'Endothelial Stress', 'Early Atherosclerosis', 'Plaque', 'Occlusion'],
        color: '#DC2626', trend: 'worsening',
        biomarkers: ['LDL', 'CRP', 'BP', 'Homocysteine'],
        bms: [
            { name: 'LDL Cholesterol', val: '142 mg/dL', tgt: '<100', sev: 'high', why: 'Primary driver of arterial plaque formation' },
            { name: 'CRP', val: '3.2 mg/L', tgt: '<1.0', sev: 'high', why: 'Endothelial inflammation accelerates atherosclerosis' },
            { name: 'Blood Pressure', val: '138/88', tgt: '<130/80', sev: 'med', why: 'Chronic pressure stress damages arterial walls' },
            { name: 'Homocysteine', val: 'Not tested', tgt: '<15', sev: 'med', why: 'Elevated homocysteine is an independent vascular risk factor' },
        ],
        patientText: 'Your blood vessels show early signs of narrowing. High cholesterol and blood pressure are the main drivers — both are treatable.',
        clinicalText: 'Converging cardiovascular risk: LDL 142 + CRP 3.2 + BP 138/88 → accelerated endothelial dysfunction. Statin + lifestyle intervention critical.',
        nextStage: 'Plaque Formation', nextTime: '12-18 mo',
        actions: ['Statin initiation', 'Carotid IMT ultrasound', 'Homocysteine + B12 panel', 'BP target <130/80'],
    },
    reproductive: {
        id: 'reproductive', name: 'Repro', cx: 100, cy: 260, r: 10,
        stress: 20, stage: 'Hormonal Imbalance', stageI: 1,
        stages: ['Normal', 'Hormonal Imbalance', 'Dysfunction', 'Significant', 'Severe'],
        color: '#EC4899', trend: 'stable-risk',
        biomarkers: ['Testosterone', 'LH', 'FSH'],
        bms: [
            { name: 'Testosterone', val: 'Not tested', tgt: '300-1000', sev: 'med', why: 'Insulin resistance commonly suppresses testosterone levels' },
            { name: 'LH', val: 'Not tested', tgt: '1.7-8.6', sev: 'med', why: 'Pituitary hormone affecting reproductive axis' },
            { name: 'FSH', val: 'Not tested', tgt: '1.5-12.4', sev: 'med', why: 'Testing overdue given metabolic syndrome profile' },
        ],
        patientText: 'Hormones controlling reproductive health can be affected by blood sugar and weight. Testing will give a clearer picture.',
        clinicalText: 'Metabolic syndrome commonly induces hypogonadism in males, PCOS in females. Comprehensive hormone panel is overdue.',
        nextStage: 'Functional Dysfunction', nextTime: '12-36 mo',
        actions: ['Hormone panel (LH/FSH/Testosterone)', 'Metabolic syndrome management', 'Endocrinology consult', 'BMI reduction target'],
    },
};

// ── DISEASE WEB NODES ───────────────────────────────────────────────────────
const WEB_NODES = [
    { key: 'biomarkers', label: 'Biomarkers', icon: 'flask', color: '#4B9EFF', items: ['HbA1c 7.8%', 'LDL 142', 'CRP 3.2', 'eGFR 68', 'C-Peptide ↓'], detail: '8 out of range' },
    { key: 'symptoms', label: 'Symptoms', icon: 'flash', color: '#9B72FF', items: ['Fatigue (moderate)', 'Polyuria', 'Blurred vision', 'Foot tingling'], detail: '4 active' },
    { key: 'lifestyle', label: 'Lifestyle', icon: 'fitness', color: '#00D4AA', items: ['Sleep 5.2h avg', '3,200 steps/day', 'High glycemic diet', 'Stress: high'], detail: 'All poor' },
    { key: 'engagement', label: 'Engagement', icon: 'medkit', color: '#F5A524', items: ['Last visit: 43d ago', 'Missed 2 appts', 'Rx adherence 72%', 'Labs overdue'], detail: 'Dropping' },
    { key: 'insights', label: 'Insights', icon: 'bulb', color: '#00C8D4', items: ['Glycemic trend ↑', 'Kidney stress early', 'Neuropathy rising', 'Metabolic shift'], detail: '3 critical' },
];

// ── BIOMARKERS ──────────────────────────────────────────────────────────────
const BIOMARKERS = [
    { name: 'HbA1c', val: '7.8%', tgt: '<7%', unit: '', status: 'high', trend: '↑', delta: '+0.4% / 3mo', organs: ['pancreas', 'eyes', 'nerves', 'heart'] },
    { name: 'LDL Cholesterol', val: '142', tgt: '<100', unit: 'mg/dL', status: 'high', trend: '↑', delta: '+18 in 6mo', organs: ['heart', 'liver'] },
    { name: 'eGFR', val: '68', tgt: '>90', unit: 'mL/min', status: 'low', trend: '↓', delta: '−6 in 4mo', organs: ['kidneys'] },
    { name: 'CRP', val: '3.2', tgt: '<1.0', unit: 'mg/L', status: 'high', trend: '→', delta: 'Persistent', organs: ['heart', 'kidneys', 'liver'] },
    { name: 'Blood Pressure', val: '138/88', tgt: '<130/80', unit: 'mmHg', status: 'borderline', trend: '↑', delta: '+8 systolic', organs: ['heart', 'kidneys', 'eyes'] },
    { name: 'ALT', val: '52', tgt: '<40', unit: 'U/L', status: 'high', trend: '↑', delta: '+12 in 3mo', organs: ['liver'] },
    { name: 'C-Peptide', val: '0.8', tgt: '1.1-4.4', unit: 'ng/mL', status: 'low', trend: '↓', delta: 'Secretory ↓', organs: ['pancreas'] },
    { name: 'Fasting Glucose', val: '172', tgt: '<100', unit: 'mg/dL', status: 'high', trend: '↑', delta: 'Avg 168/30d', organs: ['pancreas', 'nerves', 'eyes'] },
    { name: 'Creatinine', val: '1.4', tgt: '<1.2', unit: 'mg/dL', status: 'high', trend: '↑', delta: '+0.2 in 4mo', organs: ['kidneys'] },
    { name: 'Triglycerides', val: '198', tgt: '<150', unit: 'mg/dL', status: 'high', trend: '↑', delta: '+32 in 6mo', organs: ['heart', 'liver'] },
];

const RECS = [
    { pri: 'urgent', title: 'Nephrology Referral', desc: 'eGFR declining — CKD intervention critical', action: 'Within 2 weeks', organ: 'kidneys' },
    { pri: 'urgent', title: 'Dilated Eye Exam', desc: 'Blurred vision + HbA1c 7.8% — retinopathy Rx', action: 'Ophthalmology', organ: 'eyes' },
    { pri: 'high', title: 'Medication Review', desc: 'HbA1c off-target — GLP-1/insulin evaluation', action: 'Rx adjust', organ: 'pancreas' },
    { pri: 'high', title: 'Statin Initiation', desc: 'LDL 142 with cardiac cluster convergence', action: 'Moderate statin', organ: 'heart' },
    { pri: 'high', title: 'B12 + Foot Exam', desc: 'Metformin + tingling = neuropathy protocol', action: 'Order labs', organ: 'nerves' },
    { pri: 'medium', title: 'Liver Imaging', desc: 'Elevated ALT/AST → NAFLD staging needed', action: 'Abdominal US', organ: 'liver' },
];

const CLUSTER_DISEASES = [
    { name: 'Type 2 Diabetes', pct: 88, type: 'current' },
    { name: 'Hypertension', pct: 61, type: 'emerging' },
    { name: 'CKD Stage 2', pct: 44, type: 'emerging' },
    { name: 'NAFLD', pct: 38, type: 'emerging' },
    { name: 'Cardiovascular Risk', pct: 24, type: 'risk' },
];

const LIFESTYLE = [
    { label: 'Sleep', value: '5.2h avg', icon: 'moon', score: 35, why: '↑ cortisol → insulin resistance' },
    { label: 'Activity', value: '3,200 steps', icon: 'walk', score: 32, why: '↓ muscle glucose uptake' },
    { label: 'Diet', value: 'High glycemic', icon: 'restaurant', score: 28, why: '↑ postprandial glucose spikes' },
    { label: 'Stress', value: 'High', icon: 'thunderstorm', score: 20, why: '↑ cortisol → β-cell exhaustion' },
];

// ── HELPERS ─────────────────────────────────────────────────────────────────
const stressColor = p => p < 25 ? '#22C55E' : p < 45 ? '#F5A524' : p < 65 ? '#EF4444' : '#DC2626';
const statusColor = s => s === 'high' || s === 'low' ? '#EF4444' : s === 'borderline' ? '#F5A524' : '#22C55E';
const sevColor = s => s === 'high' ? '#EF4444' : s === 'med' ? '#F5A524' : '#9CA3AF';
const priStyle = p => p === 'urgent' ? { bg: '#FEE2E2', color: '#DC2626', icon: 'alert-circle' } :
    p === 'high' ? { bg: '#FEF3C7', color: '#D97706', icon: 'warning' } :
        { bg: '#DBEAFE', color: '#2563EB', icon: 'information-circle' };

const organsArr = Object.values(ORGANS);
const avgStress = Math.round(organsArr.reduce((a, o) => a + o.stress, 0) / organsArr.length);

// ── CIRCULAR ORGAN MAP ──────────────────────────────────────────────────────
const CIRCLE_SIZE = width - ms(80);
const CENTER = CIRCLE_SIZE / 2;
const RADIUS = CIRCLE_SIZE / 2 - ms(42);
const NODE_SIZE = ms(56);
const IMG_SIZE = ms(28);
const ARC_R = NODE_SIZE / 2 + ms(4);

const OrganCircleMap = ({ selectedOrgan, onSelect }) => {
    return (
        <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignSelf: 'center' }}>
            {/* SVG layer for connector lines + stress arcs */}
            <Svg style={{ position: 'absolute', width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                {/* Dashed orbit circle */}
                <SvgCircle cx={CENTER} cy={CENTER} r={RADIUS}
                    fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.1"
                    strokeDasharray="4 4" />
                {/* Connector lines from center to each organ */}
                {organsArr.map((o, i) => {
                    const angle = (i * (360 / organsArr.length) - 90) * (Math.PI / 180);
                    const nx = CENTER + Math.cos(angle) * RADIUS;
                    const ny = CENTER + Math.sin(angle) * RADIUS;
                    const col = stressColor(o.stress);
                    const on = selectedOrgan === o.id;
                    return (
                        <SvgCircle key={o.id + '-line'} cx={nx} cy={ny} r={ARC_R}
                            fill="none" stroke={col} strokeWidth={on ? 3 : 2} strokeOpacity={on ? 0.7 : 0.3}
                            strokeDasharray={`${(o.stress / 100) * (2 * Math.PI * ARC_R)} ${2 * Math.PI * ARC_R}`}
                            strokeLinecap="round" rotation={-90} origin={`${nx}, ${ny}`} />
                    );
                })}
            </Svg>

            {/* Center hub */}
            <View style={[cmSt.centerHub, { left: CENTER - ms(32), top: CENTER - ms(32) }]}>
                <Icon type={Icons.Ionicons} name="fitness" size={ms(20)} color={primaryColor} />
                <Text style={cmSt.centerScore}>{avgStress}%</Text>
                <Text style={cmSt.centerLabel}>Avg Stress</Text>
            </View>

            {/* Organ nodes around the circle */}
            {organsArr.map((o, i) => {
                const angle = (i * (360 / organsArr.length) - 90) * (Math.PI / 180);
                const nx = CENTER + Math.cos(angle) * RADIUS - NODE_SIZE / 2;
                const ny = CENTER + Math.sin(angle) * RADIUS - NODE_SIZE / 2;
                const col = stressColor(o.stress);
                const on = selectedOrgan === o.id;
                return (
                    <TouchableOpacity key={o.id} activeOpacity={0.7}
                        onPress={() => onSelect(o.id)}
                        style={[cmSt.node, {
                            left: nx, top: ny,
                            borderColor: on ? col : col + '40',
                            backgroundColor: on ? col + '15' : whiteColor,
                            shadowColor: on ? col : 'transparent',
                            shadowOpacity: on ? 0.3 : 0,
                            shadowRadius: 8, elevation: on ? 6 : 2,
                        }]}>
                        {ORGAN_IMAGES[o.name] ? (
                            <Image source={ORGAN_IMAGES[o.name]} style={{ width: IMG_SIZE, height: IMG_SIZE }} resizeMode="contain" />
                        ) : (
                            <Icon type={Icons.Ionicons} name="body" size={ms(20)} color={col} />
                        )}
                        <Text style={[cmSt.nodeName, { color: on ? col : blackColor }]}>{o.name}</Text>
                        <Text style={[cmSt.nodeScore, { color: col }]}>{o.stress}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const cmSt = StyleSheet.create({
    centerHub: {
        position: 'absolute', width: ms(64), height: ms(64), borderRadius: ms(32),
        backgroundColor: primaryColor + '12', borderWidth: 2, borderColor: primaryColor,
        justifyContent: 'center', alignItems: 'center',
    },
    centerScore: { fontFamily: bold, fontSize: ms(14), color: primaryColor, marginTop: vs(1) },
    centerLabel: { fontFamily: regular, fontSize: ms(7), color: primaryColor },
    node: {
        position: 'absolute', width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2,
        borderWidth: 2, justifyContent: 'center', alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
    },
    nodeName: { fontFamily: bold, fontSize: ms(7), marginTop: vs(1) },
    nodeScore: { fontFamily: bold, fontSize: ms(9) },
});

// ── ORGAN DETAIL PANEL ──────────────────────────────────────────────────────
const OrganDetail = ({ organId, view }) => {
    const o = ORGANS[organId];
    if (!o) return null;
    const col = stressColor(o.stress);

    return (
        <View>
            {/* Header */}
            <View style={st.odHeader}>
                <View style={[st.odIconWrap, { backgroundColor: col + '12', borderColor: col }]}>
                    {ORGAN_IMAGES[o.name] ? (
                        <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(26), height: ms(26) }} resizeMode="contain" />
                    ) : (
                        <Icon type={Icons.Ionicons} name="body" size={ms(20)} color={col} />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={st.odName}>{o.name}</Text>
                    <Text style={[st.odStage, { color: col }]}>
                        {o.stage} · {o.trend === 'worsening' ? '↑ Worsening' : '→ Stable Risk'}
                    </Text>
                </View>
                <View style={st.odScoreCircle}>
                    <View style={[st.odScoreOuter, { borderColor: col }]}>
                        <Text style={[st.odScoreNum, { color: col }]}>{o.stress}</Text>
                    </View>
                    <Text style={st.odScoreLabel}>stress</Text>
                </View>
            </View>

            {/* Stage bar */}
            <View style={st.stageSection}>
                <Text style={st.sectionLabel}>Deterioration Stage</Text>
                <View style={st.stageBarRow}>
                    {o.stages.map((s, i) => (
                        <View key={i} style={[st.stageSeg, {
                            backgroundColor: i < o.stageI ? col : i === o.stageI ? col + '55' : '#E5E7EB',
                        }]} />
                    ))}
                </View>
                <View style={st.stageFooter}>
                    <Text style={st.stageNormal}>Normal</Text>
                    <Text style={[st.stageProj, { color: col }]}>→ {o.nextStage} in {o.nextTime}</Text>
                </View>
            </View>

            {/* Impact text */}
            <View style={[st.impactCard, { backgroundColor: col + '08', borderColor: col + '20' }]}>
                <Text style={[st.impactTitle, { color: col }]}>
                    {view === 'patient' ? "What's Happening" : 'Clinical Impact'}
                </Text>
                <Text style={st.impactText}>
                    {view === 'patient' ? o.patientText : o.clinicalText}
                </Text>
            </View>

            {/* Biomarkers → organ */}
            <Text style={st.sectionLabel}>Biomarkers → This Organ</Text>
            {o.bms.map((bm, i) => {
                const sc = sevColor(bm.sev);
                return (
                    <View key={i} style={[st.bmRow, { borderLeftColor: sc }]}>
                        <View style={st.bmRowTop}>
                            <Text style={st.bmName}>{bm.name}</Text>
                            <Text style={[st.bmVal, { color: sc }]}>{bm.val}</Text>
                        </View>
                        <Text style={st.bmWhy}>{bm.why}</Text>
                    </View>
                );
            })}

            {/* Actions */}
            <Text style={[st.sectionLabel, { marginTop: vs(12) }]}>Required Actions</Text>
            {o.actions.map((a, i) => (
                <View key={i} style={st.actionRow}>
                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(11)} color={primaryColor} />
                    <Text style={st.actionText}>{a}</Text>
                </View>
            ))}
        </View>
    );
};

// ── MAIN SCREEN ─────────────────────────────────────────────────────────────
const OrganInsightsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const singleOrganId = route.params?.organId || null;
    const [view, setView] = useState('patient');
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [clusterOpen, setClusterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const handleOrganSelect = id => {
        setSelectedOrgan(prev => prev === id ? null : id);
        setSelectedNode(null);
    };
    const handleNodeClick = k => {
        setSelectedNode(prev => prev === k ? null : k);
        setSelectedOrgan(null);
    };

    // ── SINGLE ORGAN VIEW ──────────────────────────────────────────────────
    if (singleOrganId && ORGANS[singleOrganId]) {
        const o = ORGANS[singleOrganId];
        const col = stressColor(o.stress);
        const organBiomarkers = BIOMARKERS.filter(bm => bm.organs.includes(singleOrganId));
        const organRecs = RECS.filter(r => r.organ === singleOrganId);

        const ORGAN_TABS = [
            { key: 'overview',  label: 'Overview',  icon: 'pulse' },
            { key: 'analysis',  label: 'Analysis',  icon: 'analytics' },
            { key: 'results',   label: 'Results',   icon: 'flask' },
            { key: 'lifestyle', label: 'Lifestyle', icon: 'fitness' },
            { key: 'actions',   label: 'Actions',   icon: 'checkmark-circle' },
        ];

        return (
            <SafeAreaView style={st.container}>
                <StatusBar2 />
                <LinearGradient colors={globalGradient2} start={{ x: 0, y: 0 }} end={{ x: 0, y: 3 }} locations={[0, 0.08]} style={st.gradient}>
                    {/* Header */}
                    <View style={st.header}>
                        <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: ms(12) }}>
                            <Text style={st.headerTitle}>{o.name}</Text>
                            <Text style={st.headerSub}>Organ Intelligence · {o.stage}</Text>
                        </View>
                        <View style={[st.stressBadge, { backgroundColor: col + '20', borderColor: col }]}>
                            <Text style={[st.stressBadgeNum, { color: col }]}>{o.stress}</Text>
                            <Text style={[st.stressBadgeLbl, { color: col }]}>stress</Text>
                        </View>
                    </View>

                    {/* ── TAB BAR ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.tabScroll} contentContainerStyle={st.tabRow}>
                        {ORGAN_TABS.map(tab => {
                            const isActive = activeTab === tab.key;
                            return (
                                <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)}
                                    style={[st.tab, isActive && st.tabActive]}>
                                    <Icon type={Icons.Ionicons} name={tab.icon} size={ms(12)}
                                        color={isActive ? primaryColor : '#9CA3AF'} />
                                    <Text style={[st.tabText, isActive && st.tabTextActive]}>{tab.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={[st.content, { paddingTop: vs(8) }]}>

                        {/* ── OVERVIEW TAB: Banner + Organ Stress Index ── */}
                        {activeTab === 'overview' && (<>
                            <View style={[st.card, { alignItems: 'center', paddingVertical: vs(24) }]}>
                                {ORGAN_IMAGES[o.name] ? (
                                    <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(100), height: ms(100) }} resizeMode="contain" />
                                ) : (
                                    <Icon type={Icons.Ionicons} name="body" size={ms(60)} color={col} />
                                )}
                                <Text style={[st.stressScore, { color: col, fontSize: ms(28), marginTop: vs(8) }]}>{o.stress}</Text>
                                <Text style={[st.stressScoreLabel, { fontSize: ms(12) }]}>Stress Score</Text>
                                <View style={{ flexDirection: 'row', marginTop: vs(10), gap: ms(8) }}>
                                    <View style={[st.stagePill, { backgroundColor: col + '15', borderColor: col }]}>
                                        <Text style={[st.stagePillText, { color: col }]}>{o.stage}</Text>
                                    </View>
                                    <View style={[st.stagePill, { backgroundColor: o.trend === 'worsening' ? '#FEE2E2' : '#FEF9C3', borderColor: o.trend === 'worsening' ? '#EF4444' : '#F59E0B' }]}>
                                        <Text style={[st.stagePillText, { color: o.trend === 'worsening' ? '#EF4444' : '#D97706' }]}>
                                            {o.trend === 'worsening' ? '↑ Worsening' : '→ Stable Risk'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="pulse" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Organ Stress Index</Text>
                                </View>
                                <View style={[st.stressRow, { backgroundColor: col + '08', borderColor: col }]}>
                                    <View style={[st.stressIcon, { backgroundColor: col + '12' }]}>
                                        {ORGAN_IMAGES[o.name] ? (
                                            <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(20), height: ms(20) }} resizeMode="contain" />
                                        ) : (
                                            <Icon type={Icons.Ionicons} name="body" size={ms(16)} color={col} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={st.stressName}>{o.name}</Text>
                                        <Text style={[st.stressStageTxt, { color: col }]}>{o.stage}</Text>
                                        <View style={{ flexDirection: 'row', gap: ms(4), marginTop: vs(4) }}>
                                            {o.stages.map((sg, i) => (
                                                <View key={i} style={[st.stageDot, { backgroundColor: i <= o.stageI ? col : '#E5E7EB', flex: 1 }]} />
                                            ))}
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(2) }}>
                                            <Text style={[st.stressStageTxt, { color: '#9CA3AF', fontSize: ms(9) }]}>{o.stages[0]}</Text>
                                            <Text style={[st.stressStageTxt, { color: '#9CA3AF', fontSize: ms(9) }]}>{o.stages[o.stages.length - 1]}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', marginLeft: ms(10) }}>
                                        <Text style={[st.stressScore, { color: col }]}>{o.stress}</Text>
                                        <Text style={st.stressScoreLabel}>stress</Text>
                                    </View>
                                </View>
                            </View>
                        </>)}

                        {/* ── ANALYSIS TAB: Organ Detail + Health Connects ── */}
                        {activeTab === 'analysis' && (<>
                            <View style={[st.card, { borderWidth: 1.5, borderColor: col + '30' }]}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="analytics" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Organ Detail Analysis</Text>
                                </View>
                                <OrganDetail organId={singleOrganId} view={view} />
                            </View>

                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="git-network" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>How Your Health Connects</Text>
                                </View>
                                <View style={st.webCenter}>
                                    <View style={[st.webCenterCircle, { borderColor: col, backgroundColor: col + '10' }]}>
                                        {ORGAN_IMAGES[o.name] ? (
                                            <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(26), height: ms(26) }} resizeMode="contain" />
                                        ) : (
                                            <Icon type={Icons.Ionicons} name="body" size={ms(18)} color={col} />
                                        )}
                                        <Text style={[st.webCenterText, { color: col }]}>{o.name.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={st.webGrid}>
                                    {WEB_NODES.map(n => {
                                        const sel = selectedNode === n.key;
                                        return (
                                            <TouchableOpacity key={n.key} activeOpacity={0.7}
                                                onPress={() => handleNodeClick(n.key)}
                                                style={[st.webNode, sel
                                                    ? { borderColor: n.color, backgroundColor: n.color + '15' }
                                                    : { borderColor: n.color + '30', backgroundColor: n.color + '06' }]}>
                                                <View style={[st.webNodeIcon, { backgroundColor: n.color + '15' }]}>
                                                    <Icon type={Icons.Ionicons} name={n.icon} size={ms(16)} color={n.color} />
                                                </View>
                                                <Text style={[st.webNodeLabel, { color: n.color }]}>{n.label}</Text>
                                                <Text style={[st.webNodeDetail, { color: n.color }]}>{n.detail}</Text>
                                                {sel && <Icon type={Icons.Ionicons} name="chevron-up" size={ms(10)} color={n.color} style={{ marginTop: vs(2) }} />}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {selectedNode && (() => {
                                    const node = WEB_NODES.find(n => n.key === selectedNode);
                                    return (
                                        <View style={[st.webExpanded, { borderColor: node.color + '30', backgroundColor: node.color + '06' }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(8) }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                                                    <Icon type={Icons.Ionicons} name={node.icon} size={ms(14)} color={node.color} />
                                                    <Text style={[st.webExpandedTitle, { color: node.color }]}>{node.label}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => handleNodeClick(selectedNode)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                                    <Icon type={Icons.Ionicons} name="close-circle" size={ms(16)} color={node.color + '80'} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={st.webExpandedItems}>
                                                {node.items.map((it, i) => (
                                                    <View key={i} style={st.webExpandedItem}>
                                                        <View style={[st.webExpandedDot, { backgroundColor: node.color }]} />
                                                        <Text style={st.webExpandedText}>{it}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    );
                                })()}
                            </View>
                        </>)}

                        {/* ── RESULTS TAB: Test Results ── */}
                        {activeTab === 'results' && (
                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="flask" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Your Test Results</Text>
                                </View>
                                {organBiomarkers.length === 0 ? (
                                    <Text style={[st.stressStageTxt, { color: '#9CA3AF', marginTop: vs(4) }]}>No direct biomarkers linked to this organ.</Text>
                                ) : organBiomarkers.map((bm, i) => {
                                    const sc = statusColor(bm.status);
                                    return (
                                        <View key={i} style={[st.bioRow, { backgroundColor: sc + '06', borderColor: sc + '25' }]}>
                                            <View style={st.bioRowTop}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={st.bioName}>{bm.name}</Text>
                                                    <Text style={st.bioDelta}>{bm.delta}</Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={[st.bioValue, { color: sc }]}>{bm.val} <Text style={st.bioUnit}>{bm.unit}</Text></Text>
                                                    <Text style={st.bioTarget}>tgt {bm.tgt}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* ── LIFESTYLE TAB ── */}
                        {activeTab === 'lifestyle' && (
                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="fitness" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Lifestyle Signals</Text>
                                </View>
                                {LIFESTYLE.map((ls, i) => (
                                    <View key={i} style={st.lifeRow}>
                                        <View style={st.lifeRowTop}>
                                            <View style={[st.lifeIcon, { backgroundColor: primaryColor + '10' }]}>
                                                <Icon type={Icons.Ionicons} name={ls.icon} size={ms(14)} color={primaryColor} />
                                            </View>
                                            <View style={{ flex: 1, marginLeft: ms(8) }}>
                                                <Text style={st.lifeLabel}>{ls.label}</Text>
                                                <Text style={st.lifeWhy}>{ls.why}</Text>
                                            </View>
                                            <Text style={st.lifeValue}>{ls.value}</Text>
                                        </View>
                                        <View style={st.lifeBarBg}>
                                            <View style={[st.lifeBarFill, { width: `${ls.score}%` }]} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* ── ACTIONS TAB: Action Plan + Progression Timeline ── */}
                        {activeTab === 'actions' && (<>
                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Action Plan</Text>
                                </View>
                                {organRecs.length > 0 ? organRecs.map((r, i) => {
                                    const ps = priStyle(r.pri);
                                    return (
                                        <View key={i} style={[st.recCard, { borderLeftColor: ps.color }]}>
                                            <View style={[st.recIconWrap, { backgroundColor: ps.bg }]}>
                                                <Icon type={Icons.Ionicons} name={ps.icon} size={ms(16)} color={ps.color} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={st.recTitle}>{r.title}</Text>
                                                <Text style={st.recDesc}>{r.desc}</Text>
                                                <View style={st.recActionRow}>
                                                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(10)} color={primaryColor} />
                                                    <Text style={st.recActionText}>{r.action}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                }) : o.actions.map((a, i) => (
                                    <View key={i} style={st.actionRow}>
                                        <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(11)} color={primaryColor} />
                                        <Text style={st.actionText}>{a}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={st.card}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="time" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>What Could Happen Without Action</Text>
                                </View>
                                <View style={st.timelineWrap}>
                                    {[
                                        { t: 'Now', e: `${o.name} at ${o.stage}. Stress score: ${o.stress}/100`, col: col },
                                        { t: o.nextTime, e: `Progression to ${o.nextStage} without intervention`, col: '#FF7235' },
                                        { t: o.stages[o.stages.length - 2] || 'Late Stage', e: `Advanced ${o.name.toLowerCase()} dysfunction — medical intervention required`, col: '#EF4444' },
                                        { t: '✓ Action', e: 'Targeted intervention now can halt or reverse this progression', col: primaryColor },
                                    ].map((pt, i, arr) => (
                                        <View key={i} style={st.timelineItem}>
                                            <View style={st.timelineLeft}>
                                                <View style={[st.timelineDot, { backgroundColor: pt.col }]} />
                                                {i < arr.length - 1 && <View style={st.timelineConnector} />}
                                            </View>
                                            <View style={st.timelineContent}>
                                                <Text style={[st.timelineTime, { color: pt.col }]}>{pt.t}</Text>
                                                <Text style={st.timelineEvent}>{pt.e}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>)}

                        <View style={{ height: vs(40) }} />
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={st.container}>
            <StatusBar2 />
            <LinearGradient colors={globalGradient2} start={{ x: 0, y: 0 }} end={{ x: 0, y: 3 }} locations={[0, 0.08]} style={st.gradient}>

                {/* Header */}
                <View style={st.header}>
                    <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: ms(12) }}>
                        <Text style={st.headerTitle}>Organ Insights</Text>
                        <Text style={st.headerSub}>Disease Intelligence Layer</Text>
                    </View>
                    {/* Doctor / Patient toggle */}
                    {/* <View style={st.toggleWrap}>
                        {['patient', 'doctor'].map(v => (
                            <TouchableOpacity key={v} onPress={() => setView(v)}
                                style={[st.toggleBtn, view === v && st.toggleBtnActive]}>
                                <Icon type={Icons.Ionicons} name={v === 'patient' ? 'person' : 'medkit'}
                                    size={ms(11)} color={view === v ? whiteColor : 'rgba(255,255,255,0.5)'} />
                                <Text style={[st.toggleText, view === v && st.toggleTextActive]}>
                                    {v === 'patient' ? 'Patient' : 'Doctor'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View> */}
                </View>

                {/* Patient strip */}
                <View style={st.patientStrip}>
                    <View style={st.patientAvatar}>
                        <Icon type={Icons.Ionicons} name="person" size={ms(14)} color={whiteColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: ms(8) }}>
                        <Text style={st.patientName}>Marcus Chen, 54M</Text>
                        <Text style={st.patientMeta}>T2DM · dx 2019 · HIGH RISK</Text>
                    </View>
                    {[
                        { val: `${avgStress}%`, label: 'Stress', color: '#FF7235' },
                        { val: '6', label: 'Organs', color: '#EF4444' },
                        { val: '3', label: 'Risks', color: '#FF2E5B' },
                    ].map(s => (
                        <View key={s.label} style={st.patientStat}>
                            <Text style={[st.patientStatVal, { color: s.color }]}>{s.val}</Text>
                            <Text style={st.patientStatLbl}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Cluster alert toggle */}
                <TouchableOpacity style={st.clusterToggle} onPress={() => setClusterOpen(o => !o)} activeOpacity={0.7}>
                    <Icon type={Icons.Ionicons} name="flash" size={ms(13)} color="#FF7235" />
                    <Text style={st.clusterToggleText}>Cluster Active</Text>
                    <Icon type={Icons.Ionicons} name={clusterOpen ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#FF7235" />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={st.content}>

                    {/* ── CLUSTER ALERT BANNER ── */}
                    {clusterOpen && (
                        <View style={st.clusterBanner}>
                            <Text style={st.clusterBannerTitle}>
                                {view === 'patient'
                                    ? '⚠ Your Conditions Share Common Roots'
                                    : 'CLUSTER: Metabolic-Cardiovascular Convergence · Risk: 82/100'}
                            </Text>
                            {CLUSTER_DISEASES.map((d, i) => {
                                const col = d.type === 'current' ? '#EF4444' : d.type === 'emerging' ? '#FF7235' : '#3B82F6';
                                return (
                                    <View key={i} style={st.clusterDiseaseRow}>
                                        <View style={st.clusterDiseaseInfo}>
                                            <Text style={st.clusterDiseaseName}>{d.name}</Text>
                                            <Text style={[st.clusterDiseaseType, { color: col }]}>
                                                {d.type === 'current' ? 'Active' : d.type === 'emerging' ? 'Emerging' : 'Watch'}
                                            </Text>
                                        </View>
                                        <View style={st.clusterBar}>
                                            <View style={[st.clusterBarFill, { width: `${d.pct}%`, backgroundColor: col }]} />
                                        </View>
                                    </View>
                                );
                            })}
                            <View style={[st.clusterNote, { backgroundColor: view === 'patient' ? primaryColor + '10' : '#8B5CF610' }]}>
                                <Text style={[st.clusterNoteText, { color: view === 'patient' ? primaryColor : '#8B5CF6' }]}>
                                    {view === 'patient'
                                        ? '💚 Each healthy change reduces risk across all conditions at once.'
                                        : 'Shared pathophysiology: IR → endothelial dysfunction → systemic inflammation → multi-organ cascade.'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* ── SECTION 1: BODY MAP ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="body" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'Your Body Map' : 'Organ Impact Map'}
                            </Text>
                        </View>
                        <OrganCircleMap selectedOrgan={selectedOrgan} onSelect={handleOrganSelect} />
                        {/* Legend */}
                        <View style={st.legendRow}>
                            {[['#22C55E', '<25 Healthy'], ['#F5A524', '25-45 Stress'], ['#EF4444', '45-65 Damage'], ['#DC2626', '65+ Critical']].map(([c, l]) => (
                                <View key={l} style={st.legendItem}>
                                    <View style={[st.legendDot, { backgroundColor: c }]} />
                                    <Text style={st.legendText}>{l}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── SECTION 2: ORGAN STRESS INDEX LIST ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="pulse" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>Organ Stress Index</Text>
                        </View>
                        {organsArr.map(o => {
                            const col = stressColor(o.stress);
                            const sel = selectedOrgan === o.id;
                            return (
                                <TouchableOpacity key={o.id} activeOpacity={0.7}
                                    onPress={() => handleOrganSelect(o.id)}
                                    style={[st.stressRow, sel && { backgroundColor: col + '08', borderColor: col }]}>
                                    <View style={[st.stressIcon, { backgroundColor: col + '12' }]}>
                                        {ORGAN_IMAGES[o.name] ? (
                                            <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(20), height: ms(20) }} resizeMode="contain" />
                                        ) : (
                                            <Icon type={Icons.Ionicons} name="body" size={ms(16)} color={col} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={st.stressName}>{o.name}</Text>
                                        <Text style={[st.stressStageTxt, { color: col }]}>{o.stage}</Text>
                                        <View style={st.stressBarBg}>
                                            <View style={[st.stressBarFill, { width: `${o.stress}%`, backgroundColor: col }]} />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[st.stressScore, { color: col }]}>{o.stress}</Text>
                                        <Text style={st.stressScoreLabel}>stress</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ── SECTION 3: ORGAN DETAIL ── */}
                    {selectedOrgan && (
                        <View style={[st.card, { borderWidth: 1.5, borderColor: stressColor(ORGANS[selectedOrgan].stress) + '30' }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(12) }}>
                                <View style={st.cardHeader}>
                                    <Icon type={Icons.Ionicons} name="analytics" size={ms(16)} color={primaryColor} />
                                    <Text style={st.cardTitle}>Organ Detail Analysis</Text>
                                </View>
                                <TouchableOpacity onPress={() => setSelectedOrgan(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Icon type={Icons.Ionicons} name="close" size={ms(18)} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                            <OrganDetail organId={selectedOrgan} view={view} />
                        </View>
                    )}

                    {/* ── SECTION 4: DISEASE WEB ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="git-network" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'How Your Health Connects' : 'Disease Intelligence Web'}
                            </Text>
                        </View>
                        {/* Center disease node */}
                        <View style={st.webCenter}>
                            <View style={st.webCenterCircle}>
                                <Icon type={Icons.Ionicons} name="fitness" size={ms(18)} color="#FF4560" />
                                <Text style={st.webCenterText}>TYPE 2{'\n'}DIABETES</Text>
                            </View>
                        </View>
                        {/* Satellite nodes */}
                        <View style={st.webGrid}>
                            {WEB_NODES.map(n => {
                                const sel = selectedNode === n.key;
                                return (
                                    <TouchableOpacity key={n.key} activeOpacity={0.7}
                                        onPress={() => handleNodeClick(n.key)}
                                        style={[st.webNode, sel && { borderColor: n.color, backgroundColor: n.color + '10' }]}>
                                        <View style={[st.webNodeIcon, { backgroundColor: n.color + '15' }]}>
                                            <Icon type={Icons.Ionicons} name={n.icon} size={ms(16)} color={n.color} />
                                        </View>
                                        <Text style={[st.webNodeLabel, sel && { color: n.color }]}>{n.label}</Text>
                                        <Text style={[st.webNodeDetail, { color: n.color }]}>{n.detail}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {/* Expanded node items */}
                        {selectedNode && (() => {
                            const node = WEB_NODES.find(n => n.key === selectedNode);
                            return (
                                <View style={[st.webExpanded, { borderColor: node.color + '30', backgroundColor: node.color + '06' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(8) }}>
                                        <Icon type={Icons.Ionicons} name={node.icon} size={ms(14)} color={node.color} />
                                        <Text style={[st.webExpandedTitle, { color: node.color }]}>{node.label}</Text>
                                    </View>
                                    <View style={st.webExpandedItems}>
                                        {node.items.map((it, i) => (
                                            <View key={i} style={st.webExpandedItem}>
                                                <View style={[st.webExpandedDot, { backgroundColor: node.color }]} />
                                                <Text style={st.webExpandedText}>{it}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            );
                        })()}
                    </View>

                    {/* ── SECTION 5: BIOMARKERS × ORGAN ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="flask" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'Your Test Results' : 'Biomarkers × Organ Impact'}
                            </Text>
                        </View>
                        {BIOMARKERS.map((bm, i) => {
                            const col = statusColor(bm.status);
                            const highlighted = selectedOrgan && bm.organs.includes(selectedOrgan);
                            return (
                                <View key={i} style={[st.bioRow, highlighted && { backgroundColor: col + '06', borderColor: col + '25' }]}>
                                    <View style={st.bioRowTop}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={st.bioName}>{bm.name}</Text>
                                            <Text style={st.bioDelta}>{bm.delta}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={[st.bioValue, { color: col }]}>{bm.val} <Text style={st.bioUnit}>{bm.unit}</Text></Text>
                                            <Text style={st.bioTarget}>tgt {bm.tgt}</Text>
                                        </View>
                                    </View>
                                    <View style={st.bioOrganTags}>
                                        {bm.organs.map(oid => {
                                            const org = ORGANS[oid];
                                            return (
                                                <TouchableOpacity key={oid} onPress={() => handleOrganSelect(oid)}
                                                    style={[st.bioOrganTag, { backgroundColor: org.color + '10', borderColor: org.color + '30' }]}>
                                                    {ORGAN_IMAGES[org.name] && <Image source={ORGAN_IMAGES[org.name]} style={{ width: ms(10), height: ms(10) }} resizeMode="contain" />}
                                                    <Text style={[st.bioOrganTagText, { color: org.color }]}>{org.name}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* ── SECTION 6: LIFESTYLE SIGNALS ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="fitness" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'Lifestyle Signals' : 'Lifestyle × Disease Drivers'}
                            </Text>
                        </View>
                        {LIFESTYLE.map((ls, i) => (
                            <View key={i} style={st.lifeRow}>
                                <View style={st.lifeRowTop}>
                                    <View style={[st.lifeIcon, { backgroundColor: primaryColor + '10' }]}>
                                        <Icon type={Icons.Ionicons} name={ls.icon} size={ms(14)} color={primaryColor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: ms(8) }}>
                                        <Text style={st.lifeLabel}>{ls.label}</Text>
                                        <Text style={st.lifeWhy}>{ls.why}</Text>
                                    </View>
                                    <Text style={st.lifeValue}>{ls.value}</Text>
                                </View>
                                <View style={st.lifeBarBg}>
                                    <View style={[st.lifeBarFill, { width: `${ls.score}%` }]} />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* ── SECTION 7: RECOMMENDATIONS ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'Action Plan' : 'Clinical Priorities'}
                            </Text>
                        </View>
                        {RECS.map((r, i) => {
                            const ps = priStyle(r.pri);
                            const org = ORGANS[r.organ];
                            return (
                                <TouchableOpacity key={i} activeOpacity={0.7}
                                    onPress={() => handleOrganSelect(r.organ)}
                                    style={[st.recCard, { borderLeftColor: ps.color }]}>
                                    <View style={[st.recIconWrap, { backgroundColor: ps.bg }]}>
                                        <Icon type={Icons.Ionicons} name={ps.icon} size={ms(16)} color={ps.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={st.recTitleRow}>
                                            <Text style={st.recTitle}>{r.title}</Text>
                                            <View style={[st.recOrganChip, { backgroundColor: org.color + '10', borderColor: org.color + '30' }]}>
                                                <Text style={[st.recOrganText, { color: org.color }]}>{org.name}</Text>
                                            </View>
                                        </View>
                                        <Text style={st.recDesc}>{r.desc}</Text>
                                        <View style={st.recActionRow}>
                                            <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(10)} color={primaryColor} />
                                            <Text style={st.recActionText}>{r.action}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* ── SECTION 8: CASCADE TIMELINE ── */}
                    <View style={st.card}>
                        <View style={st.cardHeader}>
                            <Icon type={Icons.Ionicons} name="time" size={ms(16)} color={primaryColor} />
                            <Text style={st.cardTitle}>
                                {view === 'patient' ? 'What Could Happen Without Action' : 'Cluster Cascade Timeline'}
                            </Text>
                        </View>
                        <View style={st.timelineWrap}>
                            {[
                                { t: 'Now', e: view === 'patient' ? 'Diabetes active — kidneys, nerves & liver showing early signs' : 'T2DM active. Nephropathy Stage 2, early neuropathy, hepatic steatosis. eGFR 68↓', col: '#EF4444' },
                                { t: '6 mo', e: view === 'patient' ? 'Blood pressure likely needs treatment' : 'HTN crosses pharmacological threshold. Ophthalmology referral critical.', col: '#FF7235' },
                                { t: '12 mo', e: view === 'patient' ? 'Kidney specialist care may be needed' : 'CKD → Stage 3. eGFR <60. ACE-i + SGLT2i protocol essential.', col: '#FF7235' },
                                { t: '18-24 mo', e: view === 'patient' ? 'Heart health at serious risk' : 'CV event risk >30%. LVH, CAD, cerebrovascular events enter risk window.', col: '#9B72FF' },
                                { t: '✓ Action', e: view === 'patient' ? 'All of this is preventable or reversible — starting now' : 'Cascade preventable. Early polypharmacy + lifestyle modification: ROI high.', col: primaryColor },
                            ].map((pt, i, arr) => (
                                <View key={i} style={st.timelineItem}>
                                    {/* Left: dot + connector */}
                                    <View style={st.timelineLeft}>
                                        <View style={[st.timelineDot, { backgroundColor: pt.col }]} />
                                        {i < arr.length - 1 && <View style={st.timelineConnector} />}
                                    </View>
                                    {/* Right: time + event */}
                                    <View style={st.timelineContent}>
                                        <Text style={[st.timelineTime, { color: pt.col }]}>{pt.t}</Text>
                                        <Text style={st.timelineEvent}>{pt.e}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default OrganInsightsScreen;

// ── STYLES ──────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradient: { flex: 1 },
    content: { paddingBottom: vs(40) },

    // Tab bar  
    tabScroll: { marginBottom: vs(8), flexGrow: 0 },
    tabRow: { paddingHorizontal: ms(16), gap: ms(4) },
    tab: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        backgroundColor: whiteColor, borderRadius: ms(10),
        paddingHorizontal: ms(8), paddingVertical: vs(6),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    tabActive: { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
    tabText: { fontFamily: bold, fontSize: ms(9.5), color: '#9CA3AF' },
    tabTextActive: { color: primaryColor },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(10),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontFamily: bold, fontSize: ms(17), color: whiteColor },
    headerSub: { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.65)', marginTop: vs(1) },
    toggleWrap: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: ms(10), padding: ms(3),
    },
    toggleBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingHorizontal: ms(10), paddingVertical: vs(5), borderRadius: ms(8),
    },
    toggleBtnActive: { backgroundColor: primaryColor },
    toggleText: { fontFamily: bold, fontSize: ms(10), color: 'rgba(255,255,255,0.5)' },
    toggleTextActive: { color: whiteColor },

    // Patient strip
    patientStrip: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: ms(20), marginBottom: vs(8),
        backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(14),
        paddingHorizontal: ms(12), paddingVertical: vs(8),
    },
    patientAvatar: {
        width: ms(28), height: ms(28), borderRadius: ms(14),
        backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center',
    },
    patientName: { fontFamily: bold, fontSize: ms(11), color: whiteColor },
    patientMeta: { fontFamily: regular, fontSize: ms(8), color: 'rgba(255,255,255,0.5)', marginTop: vs(1) },
    patientStat: { alignItems: 'center', marginLeft: ms(10) },
    patientStatVal: { fontFamily: bold, fontSize: ms(14) },
    patientStatLbl: { fontFamily: regular, fontSize: ms(7), color: 'rgba(255,255,255,0.5)' },

    // Cluster toggle
    clusterToggle: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        alignSelf: 'center', marginBottom: vs(8),
        backgroundColor: '#FF723515', borderWidth: 1, borderColor: '#FF723535',
        borderRadius: ms(20), paddingHorizontal: ms(14), paddingVertical: vs(5),
    },
    clusterToggleText: { fontFamily: bold, fontSize: ms(10), color: '#FF7235' },

    // Cluster banner
    clusterBanner: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(14),
        borderWidth: 1, borderColor: '#FF723530',
    },
    clusterBannerTitle: { fontFamily: bold, fontSize: ms(12), color: '#FF7235', marginBottom: vs(10) },
    clusterDiseaseRow: { marginBottom: vs(8) },
    clusterDiseaseInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3) },
    clusterDiseaseName: { fontFamily: regular, fontSize: ms(11), color: blackColor },
    clusterDiseaseType: { fontFamily: bold, fontSize: ms(9) },
    clusterBar: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    clusterBarFill: { height: '100%', borderRadius: ms(2) },
    clusterNote: { borderRadius: ms(10), padding: ms(12), marginTop: vs(6) },
    clusterNoteText: { fontFamily: regular, fontSize: ms(11), lineHeight: ms(17) },

    // Card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(14),
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(12) },
    cardTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor },

    // Legend
    legendRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: ms(12), marginTop: vs(10) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(7), height: ms(7), borderRadius: ms(4) },
    legendText: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF' },

    // Stress index list
    stressRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(10),
        paddingVertical: vs(10), paddingHorizontal: ms(10),
        borderRadius: ms(12), borderWidth: 1, borderColor: '#F1F5F9',
        marginBottom: vs(5),
    },
    stressIcon: {
        width: ms(36), height: ms(36), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    stressName: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    stressStageTxt: { fontFamily: regular, fontSize: ms(9), marginTop: vs(1), marginBottom: vs(4) },
    stressBarBg: { height: vs(3), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    stressBarFill: { height: '100%', borderRadius: ms(2) },
    stressScore: { fontFamily: bold, fontSize: ms(18) },
    stressScoreLabel: { fontFamily: regular, fontSize: ms(7), color: '#9CA3AF' },
    stageDot: { height: vs(4), borderRadius: ms(2) },
    stressBadge: { alignItems: 'center', borderRadius: ms(10), borderWidth: 1.5, paddingHorizontal: ms(10), paddingVertical: vs(4) },
    stressBadgeNum: { fontFamily: bold, fontSize: ms(16) },
    stressBadgeLbl: { fontFamily: regular, fontSize: ms(8) },
    stagePill: { borderRadius: ms(20), borderWidth: 1, paddingHorizontal: ms(10), paddingVertical: vs(3) },
    stagePillText: { fontFamily: bold, fontSize: ms(11) },

    // Organ detail
    odHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(14) },
    odIconWrap: {
        width: ms(44), height: ms(44), borderRadius: ms(12),
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    odName: { fontFamily: bold, fontSize: ms(15), color: blackColor },
    odStage: { fontFamily: bold, fontSize: ms(10), marginTop: vs(2) },
    odScoreCircle: { alignItems: 'center' },
    odScoreOuter: {
        width: ms(42), height: ms(42), borderRadius: ms(21),
        borderWidth: 2.5, justifyContent: 'center', alignItems: 'center',
    },
    odScoreNum: { fontFamily: bold, fontSize: ms(15) },
    odScoreLabel: { fontFamily: regular, fontSize: ms(7), color: '#9CA3AF', marginTop: vs(2) },

    // Stage section
    stageSection: { marginBottom: vs(14) },
    sectionLabel: { fontFamily: bold, fontSize: ms(10), color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(8) },
    stageBarRow: { flexDirection: 'row', gap: ms(3) },
    stageSeg: { height: vs(5), borderRadius: ms(3), flex: 1 },
    stageFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6) },
    stageNormal: { fontFamily: regular, fontSize: ms(9), color: '#22C55E' },
    stageProj: { fontFamily: regular, fontSize: ms(9) },

    // Impact card
    impactCard: { borderRadius: ms(12), borderWidth: 1, padding: ms(14), marginBottom: vs(14) },
    impactTitle: { fontFamily: bold, fontSize: ms(11), marginBottom: vs(5) },
    impactText: { fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(19) },

    // Biomarker impact rows
    bmRow: { backgroundColor: '#F8FAFC', borderRadius: ms(10), padding: ms(12), marginBottom: vs(5), borderLeftWidth: ms(3) },
    bmRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(3) },
    bmName: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    bmVal: { fontFamily: bold, fontSize: ms(12) },
    bmWhy: { fontFamily: regular, fontSize: ms(10), color: '#6B7280', lineHeight: ms(15) },

    // Action rows
    actionRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: primaryColor + '08', borderRadius: ms(8),
        paddingHorizontal: ms(12), paddingVertical: vs(9), marginBottom: vs(4),
    },
    actionText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1 },

    // Disease web
    webCenter: { alignItems: 'center', marginBottom: vs(14) },
    webCenterCircle: {
        width: ms(72), height: ms(72), borderRadius: ms(36),
        backgroundColor: '#FF456012', borderWidth: 2, borderColor: '#FF4560',
        justifyContent: 'center', alignItems: 'center',
    },
    webCenterText: { fontFamily: bold, fontSize: ms(8), color: '#FF4560', textAlign: 'center', lineHeight: ms(10), marginTop: vs(2) },
    webGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), justifyContent: 'center', marginBottom: vs(10) },
    webNode: {
        width: (width - ms(100)) / 3, alignItems: 'center',
        paddingVertical: vs(10), paddingHorizontal: ms(6),
        borderRadius: ms(14), borderWidth: 1.5, borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
    },
    webNodeIcon: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center', marginBottom: vs(5),
    },
    webNodeLabel: { fontFamily: bold, fontSize: ms(9), color: '#6B7280', textAlign: 'center' },
    webNodeDetail: { fontFamily: bold, fontSize: ms(7.5), marginTop: vs(2) },
    webExpanded: { borderRadius: ms(12), borderWidth: 1, padding: ms(14), marginTop: vs(6) },
    webExpandedTitle: { fontFamily: bold, fontSize: ms(11), textTransform: 'uppercase', letterSpacing: 0.5 },
    webExpandedItems: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) },
    webExpandedItem: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: '#F8FAFC', borderRadius: ms(8),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
    },
    webExpandedDot: { width: ms(5), height: ms(5), borderRadius: ms(3) },
    webExpandedText: { fontFamily: regular, fontSize: ms(10), color: blackColor },

    // Biomarkers section
    bioRow: {
        borderRadius: ms(12), borderWidth: 1, borderColor: '#F1F5F9',
        padding: ms(12), marginBottom: vs(6),
    },
    bioRowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(8) },
    bioName: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    bioDelta: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF', marginTop: vs(1) },
    bioValue: { fontFamily: bold, fontSize: ms(15) },
    bioUnit: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },
    bioTarget: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF', marginTop: vs(1) },
    bioOrganTags: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(5) },
    bioOrganTag: {
        flexDirection: 'row', alignItems: 'center', gap: ms(3),
        borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: vs(3),
        borderWidth: 1,
    },
    bioOrganTagText: { fontFamily: bold, fontSize: ms(8) },

    // Lifestyle
    lifeRow: { marginBottom: vs(10) },
    lifeRowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) },
    lifeIcon: {
        width: ms(30), height: ms(30), borderRadius: ms(8),
        justifyContent: 'center', alignItems: 'center',
    },
    lifeLabel: { fontFamily: bold, fontSize: ms(11), color: blackColor },
    lifeWhy: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF', marginTop: vs(1) },
    lifeValue: { fontFamily: bold, fontSize: ms(11), color: '#FF7235' },
    lifeBarBg: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    lifeBarFill: { height: '100%', backgroundColor: '#FF7235', borderRadius: ms(2) },

    // Recommendations
    recCard: {
        flexDirection: 'row', gap: ms(10),
        borderRadius: ms(12), padding: ms(12), marginBottom: vs(8),
        borderLeftWidth: ms(3), backgroundColor: '#F8FAFC',
    },
    recIconWrap: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    recTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(3) },
    recTitle: { fontFamily: bold, fontSize: ms(12), color: blackColor, flex: 1 },
    recOrganChip: {
        borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: vs(2),
        borderWidth: 1, marginLeft: ms(6),
    },
    recOrganText: { fontFamily: bold, fontSize: ms(8) },
    recDesc: { fontFamily: regular, fontSize: ms(10), color: '#6B7280', lineHeight: ms(16), marginBottom: vs(6) },
    recActionRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    recActionText: { fontFamily: bold, fontSize: ms(10), color: primaryColor },

    // Timeline
    timelineWrap: {},
    timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
    timelineLeft: { alignItems: 'center', width: ms(24), marginRight: ms(12) },
    timelineDot: { width: ms(12), height: ms(12), borderRadius: ms(6), marginTop: vs(3) },
    timelineConnector: { width: 2, flex: 1, backgroundColor: '#E5E7EB', minHeight: vs(22) },
    timelineContent: { flex: 1, paddingBottom: vs(18) },
    timelineTime: { fontFamily: bold, fontSize: ms(10), marginBottom: vs(3) },
    timelineEvent: { fontFamily: regular, fontSize: ms(11), color: '#374151', lineHeight: ms(17) },
});
