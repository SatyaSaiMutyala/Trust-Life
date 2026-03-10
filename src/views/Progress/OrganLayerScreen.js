import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text, ScrollView,
    TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');

// ── ORGAN IMAGES ─────────────────────────────────────────────────────────────
const ORGAN_IMAGES = {
    Kidneys: require('../../assets/img/human-kidneys.png'),
    Heart: require('../../assets/img/human-heart.png'),
    Pancreas: require('../../assets/img/human-pancreas.png'),
    Eyes: require('../../assets/img/human-eye.png'),
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
const stressColor = p => p < 25 ? '#22C55E' : p < 45 ? '#F59E0B' : p < 65 ? '#EF4444' : '#DC2626';
const sevColor = s => s === 'critical' ? '#EF4444' : s === 'high' ? '#F97316' : s === 'medium' ? '#F59E0B' : '#9CA3AF';
const statusCol = s => (s === 'high' || s === 'low') ? '#EF4444' : s === 'borderline' ? '#F59E0B' : s === 'unknown' ? '#9CA3AF' : '#22C55E';
const priStyle = p => p === 'urgent' ? { bg: '#FEE2E2', color: '#DC2626', icon: 'alert-circle' } :
    p === 'high' ? { bg: '#FEF3C7', color: '#D97706', icon: 'warning' } :
        { bg: '#DBEAFE', color: '#2563EB', icon: 'information-circle' };

// ── WEB NODES ────────────────────────────────────────────────────────────────
const WEB_NODES = [
    { key: 'disease', label: 'Disease', icon: 'medkit', color: '#EF4444' },
    { key: 'biomarkers', label: 'Biomarkers', icon: 'flask', color: '#3B82F6' },
    { key: 'symptoms', label: 'Symptoms', icon: 'flash', color: '#8B5CF6' },
    { key: 'lifestyle', label: 'Lifestyle', icon: 'fitness', color: primaryColor },
    { key: 'engagement', label: 'Engagement', icon: 'calendar', color: '#F59E0B' },
];

// ── ORGAN DATA ───────────────────────────────────────────────────────────────
const ORGANS = {
    kidneys: {
        id: 'kidneys', name: 'Kidneys', color: '#3B82F6',
        condition: 'Diabetic Nephropathy \u2014 Stage 2 CKD', conditionShort: 'Stage 2 CKD',
        stress: 38, stageI: 2, functionScore: 62, functionLabel: 'Filtration Function', trend: 'worsening',
        stages: ['Normal', 'Mild Reduction', 'Stage 2 CKD', 'Stage 3 CKD', 'Stage 4 CKD', 'Kidney Failure'],
        clusterAffected: true, clusterName: 'Metabolic\u2013Renal\u2013Cardiac Cluster',
        clusterDiseases: [
            { name: 'Type 2 Diabetes', role: 'Primary driver', pct: 88, color: '#EF4444' },
            { name: 'Hypertension', role: 'Amplifier', pct: 61, color: '#F97316' },
            { name: 'NAFLD', role: 'Systemic contributor', pct: 38, color: '#F59E0B' },
        ],
        clusterMechanism: 'Diabetic hyperglycemia \u2192 glomerular hyperfiltration \u2192 glomerulosclerosis. Concurrent hypertension increases intraglomerular pressure, accelerating nephron loss. NAFLD adds cardiorenal syndrome pressure through shared insulin-resistance pathway.',
        clusterPatient: 'Your kidneys are being stressed by three conditions at once \u2014 not just diabetes. High blood pressure squeezes the tiny filters even harder, and your liver condition adds to overall strain.',
        diseases: [
            { name: 'Type 2 Diabetes', contribution: 'Primary cause \u2014 hyperglycemia damages glomerular basement membrane', severity: 'critical', pct: 88 },
            { name: 'Hypertension', contribution: 'Secondary amplifier \u2014 elevated BP destroys nephrons faster', severity: 'high', pct: 61 },
            { name: 'NAFLD', contribution: 'Cardiorenal syndrome pathway \u2014 systemic metabolic stress', severity: 'medium', pct: 38 },
        ],
        biomarkers: [
            { name: 'eGFR', val: '68', unit: 'mL/min', tgt: '>90', status: 'low', trend: '\u2193', delta: '\u22126 in 4mo', impact: 'Glomerular filtration declining \u2014 Stage 2 threshold with active deterioration', severity: 'critical' },
            { name: 'Creatinine', val: '1.4', unit: 'mg/dL', tgt: '<1.2', status: 'high', trend: '\u2191', delta: '+0.2 in 4mo', impact: 'Waste accumulation indicating nephron count falling', severity: 'high' },
            { name: 'BUN', val: '22', unit: 'mg/dL', tgt: '7\u201320', status: 'high', trend: '\u2191', delta: 'Mild elev.', impact: 'Blood urea nitrogen rising \u2014 early filtration impairment', severity: 'medium' },
            { name: 'ACR', val: 'Pending', unit: 'mg/g', tgt: '<30', status: 'unknown', trend: '?', delta: 'Test overdue', impact: 'Microalbuminuria marker absent \u2014 most sensitive early CKD signal', severity: 'high' },
            { name: 'Potassium', val: '4.8', unit: 'mEq/L', tgt: '3.5\u20135.0', status: 'borderline', trend: '\u2191', delta: 'Near upper', impact: 'Approaching hyperkalemia \u2014 monitor with ACE-i initiation', severity: 'medium' },
        ],
        symptoms: [
            { s: 'Mild ankle swelling', frequency: 'Occasional', link: 'Reduced fluid excretion capacity', sev: 'medium' },
            { s: 'Fatigue', frequency: 'Daily', link: 'Toxin accumulation + anemia of CKD', sev: 'high' },
            { s: 'Foamy urine', frequency: 'Sometimes', link: 'Protein leaking into urine \u2014 early albuminuria', sev: 'medium' },
            { s: 'Nocturia', frequency: '3x/night', link: 'Impaired concentrating ability of damaged tubules', sev: 'medium' },
        ],
        lifestyle: [
            { factor: 'Dietary sodium', status: 'High', icon: 'restaurant', impact: 'Direct BP elevation \u2192 intraglomerular hypertension', score: 75 },
            { factor: 'Protein intake', status: 'Excess', icon: 'nutrition', impact: 'High filtration demand accelerates nephron exhaustion', score: 65 },
            { factor: 'Hydration', status: 'Poor', icon: 'water', impact: 'Chronic dehydration concentrates nephrotoxic metabolites', score: 60 },
            { factor: 'Exercise', status: 'Minimal', icon: 'walk', impact: 'Sedentary state worsens insulin resistance', score: 68 },
        ],
        engagement: [
            { item: 'Nephrology referral', status: 'Not done', urgency: 'critical', due: 'Overdue', note: 'No specialist seen despite eGFR 68 declining' },
            { item: 'ACR urine test', status: 'Not ordered', urgency: 'high', due: 'Overdue', note: 'Microalbuminuria screening completely absent' },
            { item: 'Last kidney labs', status: 'Done', urgency: 'low', due: '4 months ago', note: 'BMP + creatinine reviewed at last visit' },
            { item: 'ACE-i / ARB review', status: 'Partial', urgency: 'high', due: 'Pending', note: 'Renin-angiotensin blockade not yet initiated' },
        ],
        insights: [
            { title: 'eGFR Velocity', body: 'Declining ~1.5 mL/min/month. Stage 3 in 12\u201315 months without intervention.', patient: 'Your kidney filter score is dropping 1.5 points every month.', icon: 'trending-down', sev: 'critical' },
            { title: 'ACR Gap', body: 'No microalbuminuria test ordered \u2014 the earliest and most sensitive CKD biomarker.', patient: 'A key early-warning test for your kidneys hasn\'t been done yet.', icon: 'warning', sev: 'high' },
            { title: 'Dual Hypertension', body: 'HTN + diabetic nephropathy = 2.3x faster progression vs. diabetes alone.', patient: 'High blood pressure is making your kidney condition progress much faster.', icon: 'git-compare', sev: 'high' },
            { title: 'SGLT2i Opportunity', body: 'SGLT2 inhibitors show 30\u201340% CKD progression reduction in T2DM patients.', patient: 'A newer diabetes pill could also protect your kidneys.', icon: 'medkit', sev: 'medium' },
        ],
        recommendations: [
            { pri: 'urgent', title: 'Nephrology Referral', desc: 'eGFR 68 declining \u2014 specialist oversight required', action: 'Refer within 2 weeks', impact: 'Prevent Stage 3 CKD' },
            { pri: 'urgent', title: 'Order ACR Urine Test', desc: 'Most sensitive early CKD marker \u2014 completely absent', action: 'Next lab draw', impact: 'Detect protein leak' },
            { pri: 'high', title: 'Initiate ACE-i or ARB', desc: 'RAAS blockade reduces intraglomerular pressure', action: 'Lisinopril 10mg \u2014 titrate', impact: 'Nephron preservation' },
            { pri: 'high', title: 'SGLT2 Inhibitor Review', desc: 'Dual glycemic + nephroprotective benefit', action: 'Endocrinology co-review', impact: '30\u201340% progression \u2193' },
            { pri: 'medium', title: 'Dietary Sodium Reduction', desc: '<1500 mg/day sodium to control BP-mediated kidney stress', action: 'Dietitian referral', impact: 'BP + filtration stress' },
        ],
        nextStage: 'Stage 3 CKD', nextTime: '12\u201318 months',
        patientSummary: 'Your kidneys filter waste from your blood. Three conditions are pressing on them at once. We caught this early \u2014 there are real options to slow or reverse this.',
        clinicalSummary: 'Diabetic nephropathy Stage 2 CKD (eGFR 68, declining). HTN amplifies 2.3x. Critical gaps: nephrology referral, ACR test, ACE-i. SGLT2i highest-yield intervention.',
    },
    heart: {
        id: 'heart', name: 'Heart', color: '#EF4444',
        condition: 'Hypertensive Cardiomyopathy Risk', conditionShort: 'Cardiac Stress',
        stress: 41, stageI: 1, functionScore: 59, functionLabel: 'Cardiac Reserve', trend: 'worsening',
        stages: ['Normal', 'Early Stress', 'Functional Impairment', 'Structural Damage', 'Heart Failure'],
        clusterAffected: true, clusterName: 'Metabolic\u2013Cardiovascular Cluster',
        clusterDiseases: [
            { name: 'Type 2 Diabetes', role: 'Metabolic driver', pct: 88, color: '#EF4444' },
            { name: 'Hypertension', role: 'Direct pressure load', pct: 61, color: '#F97316' },
            { name: 'CKD Stage 2', role: 'Cardiorenal axis', pct: 44, color: '#3B82F6' },
        ],
        clusterMechanism: 'Diabetic cardiomyopathy from hyperglycemia + AGE accumulation stiffens myocardium. Hypertension imposes afterload causing LVH. CKD generates uremic toxins and anemia \u2014 cardiorenal syndrome.',
        clusterPatient: 'Your heart is being squeezed from three directions \u2014 high blood sugar stiffens the muscle, high blood pressure forces it to pump harder, and your kidneys add extra strain.',
        diseases: [
            { name: 'Type 2 Diabetes', contribution: 'Diabetic cardiomyopathy \u2014 AGE accumulation stiffens myocardium', severity: 'critical', pct: 88 },
            { name: 'Hypertension', contribution: 'Afterload elevation \u2192 left ventricular hypertrophy risk', severity: 'high', pct: 61 },
            { name: 'CKD Stage 2', contribution: 'Cardiorenal axis \u2014 uremic stress + fluid dysregulation', severity: 'medium', pct: 44 },
        ],
        biomarkers: [
            { name: 'LDL Cholesterol', val: '142', unit: 'mg/dL', tgt: '<100', status: 'high', trend: '\u2191', delta: '+18 in 6mo', impact: 'Coronary plaque acceleration \u2014 no statin coverage', severity: 'critical' },
            { name: 'CRP', val: '3.2', unit: 'mg/L', tgt: '<1.0', status: 'high', trend: '\u2192', delta: 'Persistent', impact: 'Myocardial inflammatory stress \u2014 linked to cardiac events', severity: 'high' },
            { name: 'Blood Pressure', val: '138/88', unit: 'mmHg', tgt: '<130/80', status: 'borderline', trend: '\u2191', delta: '+8 systolic', impact: 'Persistent elevation \u2192 ventricular wall thickening', severity: 'high' },
            { name: 'Triglycerides', val: '198', unit: 'mg/dL', tgt: '<150', status: 'high', trend: '\u2191', delta: '+32 in 6mo', impact: 'Endothelial lipid infiltration', severity: 'medium' },
            { name: 'HbA1c', val: '7.8%', unit: '', tgt: '<7%', status: 'high', trend: '\u2191', delta: '+0.4% / 3mo', impact: 'Cardiac protein glycation \u2192 diastolic dysfunction', severity: 'high' },
        ],
        symptoms: [
            { s: 'Exertional fatigue', frequency: 'On exertion', link: 'Reduced cardiac output on demand', sev: 'medium' },
            { s: 'Occasional chest tightness', frequency: 'Weekly', link: 'Vasospasm / early ischemic signal', sev: 'high' },
            { s: 'Mild shortness of breath', frequency: 'Rare', link: 'Early diastolic dysfunction indicator', sev: 'medium' },
            { s: 'Palpitations', frequency: 'Occasional', link: 'Glucose variability triggering ectopic beats', sev: 'medium' },
        ],
        lifestyle: [
            { factor: 'Saturated fat', status: 'High', icon: 'restaurant', impact: 'LDL elevation \u2192 endothelial damage + plaque', score: 72 },
            { factor: 'Sodium intake', status: 'High', icon: 'nutrition', impact: 'BP elevation \u2192 cardiac afterload increase', score: 70 },
            { factor: 'Physical activity', status: 'Very low', icon: 'walk', impact: 'Cardiac deconditioning + metabolic syndrome', score: 68 },
            { factor: 'Sleep quality', status: '5.2h avg', icon: 'moon', impact: 'Cortisol dysregulation \u2192 BP + glucose spikes', score: 65 },
        ],
        engagement: [
            { item: 'Baseline ECG', status: 'Not done', urgency: 'high', due: 'Overdue', note: 'No cardiac baseline ECG in 3 years' },
            { item: 'Statin initiation', status: 'Not started', urgency: 'critical', due: 'Delayed', note: 'LDL 142 + cluster risk \u2014 statin indicated' },
            { item: 'BP to target <130/80', status: 'Partial', urgency: 'high', due: 'Pending', note: 'Current 138/88 \u2014 target not achieved' },
            { item: 'Lipid panel follow-up', status: 'Done', urgency: 'medium', due: '4 months ago', note: 'LDL/TG elevated \u2014 no action taken' },
        ],
        insights: [
            { title: 'Silent MI Risk', body: 'Diabetic autonomic neuropathy causes silent myocardial ischemia.', patient: 'Heart attacks can happen without chest pain in diabetes.', icon: 'flash', sev: 'critical' },
            { title: 'LDL Trajectory', body: 'LDL +18 mg/dL in 6mo without statin. 10-year CV risk crosses 20%.', patient: 'Your cholesterol has been rising for 6 months without treatment.', icon: 'trending-up', sev: 'high' },
            { title: 'Cardiorenal Axis', body: 'CKD + cardiac stress form a bidirectional deterioration loop.', patient: 'Your kidney and heart conditions are linked \u2014 improving one helps the other.', icon: 'git-compare', sev: 'high' },
            { title: 'Statin Gap', body: 'Moderate-intensity statin therapy reduces CV events by 25\u201335%.', patient: 'A cholesterol medication could significantly cut your heart risk.', icon: 'medkit', sev: 'high' },
        ],
        recommendations: [
            { pri: 'urgent', title: 'Initiate Statin Therapy', desc: 'LDL 142 + cluster cardiac risk + no statin', action: 'Atorvastatin 20\u201340mg', impact: '25\u201335% CV risk \u2193' },
            { pri: 'urgent', title: 'Baseline ECG + Echo', desc: 'No cardiac baseline in 3 years \u2014 asymptomatic LVH possible', action: 'Order both studies', impact: 'Structural assessment' },
            { pri: 'high', title: 'BP to Target <130/80', desc: 'Every 10mmHg reduction = 20% CV risk reduction', action: 'ACE-i + lifestyle', impact: 'Afterload reduction' },
            { pri: 'high', title: 'GLP-1 Agonist Evaluation', desc: 'CV outcome trials: 20% MACE reduction', action: 'Endocrinology review', impact: 'CV + glycemic dual' },
            { pri: 'medium', title: 'Exercise Program', desc: '30 min moderate activity 5x/week reduces CV risk 35%', action: 'Exercise referral', impact: 'Cardiac conditioning' },
        ],
        nextStage: 'Functional Impairment', nextTime: '18\u201324 months',
        patientSummary: 'Your heart is under pressure from blood sugar, cholesterol, and blood pressure simultaneously. Three things need to change now before real damage sets in.',
        clinicalSummary: 'High-risk: T2DM + HTN + CKD (cardiorenal). LDL 142, CRP 3.2, no statin. Silent ischemia risk elevated. GLP-1 + statin = highest-yield interventions.',
    },
    pancreas: {
        id: 'pancreas', name: 'Pancreas', color: '#F97316',
        condition: 'Beta-Cell Depletion \u2014 Moderate', conditionShort: 'Beta-Cell Dysfunction',
        stress: 55, stageI: 2, functionScore: 45, functionLabel: 'Insulin Secretory Capacity', trend: 'worsening',
        stages: ['Normal', 'Reduced Reserve', 'Moderate Dysfunction', 'Severe Depletion', 'Exocrine Failure'],
        clusterAffected: false, clusterName: null, clusterDiseases: [],
        clusterMechanism: null, clusterPatient: null,
        diseases: [
            { name: 'Type 2 Diabetes', contribution: 'Origin disease \u2014 beta-cell exhaustion is the core pathology', severity: 'critical', pct: 88 },
            { name: 'Metabolic Syndrome', contribution: 'Insulin resistance amplifies beta-cell workload', severity: 'high', pct: 60 },
        ],
        biomarkers: [
            { name: 'HbA1c', val: '7.8%', unit: '', tgt: '<7%', status: 'high', trend: '\u2191', delta: '+0.4% / 3mo', impact: 'Persistent hyperglycemia = glucotoxicity \u2192 beta-cell apoptosis', severity: 'critical' },
            { name: 'C-Peptide', val: '0.8', unit: 'ng/mL', tgt: '1.1\u20134.4', status: 'low', trend: '\u2193', delta: 'Secretory \u2193', impact: 'Confirms moderate secretory depletion', severity: 'critical' },
            { name: 'Fasting Glucose', val: '172', unit: 'mg/dL', tgt: '<100', status: 'high', trend: '\u2191', delta: 'Avg 168/30d', impact: 'Baseline hyperglycemia stressing beta cells daily', severity: 'high' },
            { name: 'Fasting Insulin', val: 'Pending', unit: '\u03bcIU/mL', tgt: '2\u201325', status: 'unknown', trend: '?', delta: 'Not ordered', impact: 'HOMA-IR calculation absent', severity: 'medium' },
        ],
        symptoms: [
            { s: 'Persistent high blood sugar', frequency: 'Daily', link: 'Insufficient insulin secretion', sev: 'critical' },
            { s: 'Fatigue after meals', frequency: 'Daily', link: 'Postprandial glucose spike', sev: 'high' },
            { s: 'Increased thirst / urination', frequency: 'Daily', link: 'Osmotic diuresis from hyperglycemia', sev: 'medium' },
            { s: 'Slow wound healing', frequency: 'Noticed', link: 'Hyperglycemia impairs neutrophil function', sev: 'medium' },
        ],
        lifestyle: [
            { factor: 'Dietary carbs', status: 'High glycemic', icon: 'restaurant', impact: 'Excessive beta-cell stimulation hastens depletion', score: 80 },
            { factor: 'Meal timing', status: 'Irregular', icon: 'time', impact: 'Disrupted circadian insulin secretion rhythm', score: 65 },
            { factor: 'Physical activity', status: 'Minimal', icon: 'walk', impact: 'Muscle insulin resistance forces pancreas to overcompensate', score: 68 },
            { factor: 'Sleep', status: '5.2h avg', icon: 'moon', impact: 'Sleep deprivation raises fasting glucose', score: 70 },
        ],
        engagement: [
            { item: 'C-Peptide monitoring', status: 'Single test', urgency: 'high', due: '3 months ago', note: 'Decline rate unquantified' },
            { item: 'Fasting insulin test', status: 'Not ordered', urgency: 'high', due: 'Overdue', note: 'HOMA-IR cannot be calculated' },
            { item: 'GLP-1 evaluation', status: 'Not done', urgency: 'high', due: 'Pending', note: 'Beta-cell preservation agent not reviewed' },
            { item: 'Diabetes education', status: 'Not referred', urgency: 'medium', due: 'Overdue', note: 'No structured self-management education' },
        ],
        insights: [
            { title: 'Glucotoxicity Loop', body: 'Elevated glucose destroys the beta cells needed to lower it \u2014 self-reinforcing.', patient: 'High blood sugar is destroying the very cells that make insulin.', icon: 'sync', sev: 'critical' },
            { title: 'C-Peptide Decline', body: 'C-peptide 0.8 = moderate depletion. Serial measurements needed.', patient: 'One test showed low insulin production. We need to track it over time.', icon: 'trending-down', sev: 'high' },
            { title: 'GLP-1 Opportunity', body: 'GLP-1 agonists show beta-cell preservation + proliferation in T2DM.', patient: 'A newer medication can protect remaining insulin-producing cells.', icon: 'medkit', sev: 'high' },
            { title: 'Insulin Horizon', body: 'Insulin dependence likely within 3\u20135 years without targeted intervention.', patient: 'Without action, you may need insulin injections within a few years.', icon: 'time', sev: 'medium' },
        ],
        recommendations: [
            { pri: 'urgent', title: 'GLP-1 Agonist Initiation', desc: 'Beta-cell preservation + weight + CV benefits', action: 'Semaglutide or dulaglutide', impact: 'Beta-cell preservation' },
            { pri: 'urgent', title: 'Serial C-Peptide Monitoring', desc: 'Decline rate determines insulin timeline', action: 'Every 6 months', impact: 'Track secretory decline' },
            { pri: 'high', title: 'Order Fasting Insulin', desc: 'HOMA-IR quantification needed', action: 'Next lab draw', impact: 'Precision Rx targeting' },
            { pri: 'high', title: 'Low-Glycemic Diet Plan', desc: 'Reducing glucose load cuts beta-cell overwork ~40%', action: 'Structured meal plan', impact: 'Glucotoxicity reduction' },
            { pri: 'medium', title: 'DSMES Enrollment', desc: 'Structured diabetes education improves HbA1c 0.5\u20131%', action: 'Diabetes educator referral', impact: 'Self-management' },
        ],
        nextStage: 'Severe Depletion', nextTime: '3\u20135 years',
        patientSummary: 'Your pancreas makes insulin. Years of high blood sugar have worn down insulin-producing cells. The goal is to protect what\'s left.',
        clinicalSummary: 'Beta-cell depletion (C-peptide 0.8). Glucotoxic loop active. GLP-1 agonist = highest priority. Insulin horizon: 3\u20135 years at current trajectory.',
    },
    eyes: {
        id: 'eyes', name: 'Eyes', color: '#8B5CF6',
        condition: 'Diabetic Retinopathy \u2014 Early Changes', conditionShort: 'Early Retinopathy',
        stress: 28, stageI: 1, functionScore: 82, functionLabel: 'Visual Function', trend: 'stable-risk',
        stages: ['Normal', 'Early Changes', 'Non-proliferative', 'Proliferative', 'Severe Vision Loss'],
        clusterAffected: true, clusterName: 'Hyperglycemic\u2013Hypertensive Retinal Cluster',
        clusterDiseases: [
            { name: 'Type 2 Diabetes', role: 'Primary cause', pct: 88, color: '#EF4444' },
            { name: 'Hypertension', role: 'Amplifier', pct: 61, color: '#F97316' },
        ],
        clusterMechanism: 'Diabetic retinopathy from chronic hyperglycemia causing retinal microaneurysms. Hypertension concurrently causes hypertensive retinopathy \u2014 two mechanisms converging on same retinal microvasculature.',
        clusterPatient: 'Two conditions are affecting your eyes at the same time. High blood sugar and high blood pressure damage the tiny eye blood vessels in different ways.',
        diseases: [
            { name: 'Type 2 Diabetes', contribution: 'Diabetic retinopathy \u2014 hyperglycemia causes retinal microaneurysms', severity: 'critical', pct: 88 },
            { name: 'Hypertension', contribution: 'Hypertensive retinopathy \u2014 arteriovenous nicking + flame hemorrhages', severity: 'high', pct: 61 },
        ],
        biomarkers: [
            { name: 'HbA1c', val: '7.8%', unit: '', tgt: '<7%', status: 'high', trend: '\u2191', delta: '+0.4% / 3mo', impact: 'Sustained hyperglycemia damaging retinal microvasculature', severity: 'critical' },
            { name: 'Blood Pressure', val: '138/88', unit: 'mmHg', tgt: '<130/80', status: 'borderline', trend: '\u2191', delta: '+8 systolic', impact: 'Hypertensive retinopathy compounding diabetic damage', severity: 'high' },
        ],
        symptoms: [
            { s: 'Blurred vision', frequency: 'Intermittent', link: 'Macular edema or lens osmotic changes', sev: 'high' },
            { s: 'Floaters', frequency: 'Occasionally', link: 'Vitreous changes \u2014 monitor for progression', sev: 'medium' },
            { s: 'Difficulty reading fine print', frequency: 'Recent', link: 'Macular involvement in early retinopathy', sev: 'medium' },
        ],
        lifestyle: [
            { factor: 'Blood sugar control', status: 'Poor', icon: 'water', impact: 'Every 1% HbA1c reduction = 35% retinopathy risk reduction', score: 78 },
            { factor: 'BP control', status: 'Uncontrolled', icon: 'pulse', impact: 'Each 10mmHg systolic reduction cuts retinopathy risk 30%', score: 70 },
            { factor: 'Smoking', status: 'Non-smoker', icon: 'checkmark-circle', impact: 'Protective \u2014 smoking cessation critical if status changes', score: 10 },
            { factor: 'Eye protection (UV)', status: 'None', icon: 'sunny', impact: 'UV exposure amplifies oxidative retinal stress', score: 45 },
        ],
        engagement: [
            { item: 'Dilated fundus exam', status: 'Not done', urgency: 'critical', due: 'Overdue 2+ years', note: 'Annual diabetic eye exam absent' },
            { item: 'Retinal photography', status: 'Never done', urgency: 'high', due: 'Overdue', note: 'Baseline retinal image needed' },
            { item: 'HbA1c control', status: 'Suboptimal', urgency: 'high', due: 'Ongoing', note: '7.8% \u2014 target <7%' },
            { item: 'Ophthalmology referral', status: 'Not done', urgency: 'critical', due: 'Overdue', note: 'Blurred vision + HbA1c 7.8% = referral indicated' },
        ],
        insights: [
            { title: 'Blurred Vision Signal', body: 'Blurred vision + HbA1c 7.8% = ophthalmology referral immediately indicated.', patient: 'The blurred vision you reported combined with your blood sugar level needs an eye specialist now.', icon: 'eye', sev: 'critical' },
            { title: '35% Rule', body: 'For every 1% reduction in HbA1c, retinopathy progression risk falls 35%.', patient: 'Getting blood sugar under control is the most powerful thing for your eyesight.', icon: 'stats-chart', sev: 'high' },
            { title: 'Dual Vascular Attack', body: 'Diabetic + hypertensive retinopathy simultaneously = faster macular damage.', patient: 'Both blood sugar and blood pressure are damaging the same blood vessels in your eyes.', icon: 'git-compare', sev: 'high' },
            { title: 'Annual Screen Gap', body: 'Annual dilated fundus examination absent. Early-stage retinopathy is reversible.', patient: 'Regular eye checks could have caught this sooner. Starting now means we can prevent vision loss.', icon: 'search', sev: 'medium' },
        ],
        recommendations: [
            { pri: 'urgent', title: 'Ophthalmology Referral', desc: 'Blurred vision + HbA1c 7.8% \u2014 dilated fundus exam overdue', action: 'Within 2 weeks', impact: 'Detect/stage retinopathy' },
            { pri: 'urgent', title: 'Retinal Photography', desc: 'Baseline image needed \u2014 no prior comparison', action: 'With ophthalmology visit', impact: 'Progression tracking' },
            { pri: 'high', title: 'HbA1c to <7%', desc: '35% retinopathy reduction per 1% HbA1c drop', action: 'Intensify glycemic Rx', impact: 'Primary prevention' },
            { pri: 'high', title: 'BP to <130/80', desc: 'Dual vascular protection', action: 'ACE-i + lifestyle', impact: 'Retinopathy halt' },
            { pri: 'medium', title: 'Annual Eye Exam', desc: 'Establish annual rhythm \u2014 dilated exam + OCT', action: 'Schedule recurring', impact: 'Early detection' },
        ],
        nextStage: 'Non-proliferative Retinopathy', nextTime: '12\u201336 months',
        patientSummary: 'The tiny blood vessels in your eyes are being damaged by blood sugar and blood pressure. We caught it early enough to prevent vision loss.',
        clinicalSummary: 'Early diabetic retinopathy + hypertensive retinopathy converging. HbA1c 7.8% + BP 138/88 + blurred vision = ophthalmology referral urgent.',
    },
};

const organsArr = Object.values(ORGANS);

// ── MINI STRESS RING ─────────────────────────────────────────────────────────
const RING_R = ms(14);
const RING_CIRCUM = 2 * Math.PI * RING_R;
const StressRing = ({ pct, size }) => {
    const r = size ? size / 2 - 3 : RING_R;
    const c = 2 * Math.PI * r;
    return (
        <Svg width={(r + 3) * 2} height={(r + 3) * 2}>
            <SvgCircle cx={r + 3} cy={r + 3} r={r} fill="none" stroke="#E5E7EB" strokeWidth={2.5} />
            <SvgCircle cx={r + 3} cy={r + 3} r={r} fill="none"
                stroke={stressColor(pct)} strokeWidth={2.5}
                strokeDasharray={`${(pct / 100) * c} ${c}`}
                strokeLinecap="round" rotation={-90} origin={`${r + 3}, ${r + 3}`} />
            <View style={{ position: 'absolute', width: (r + 3) * 2, height: (r + 3) * 2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: bold, fontSize: ms(9), color: stressColor(pct) }}>{pct}</Text>
            </View>
        </Svg>
    );
};

// ── COMPONENT ────────────────────────────────────────────────────────────────
const OrganLayerScreen = () => {
    const navigation = useNavigation();
    const [view, setView] = useState('patient');
    const [organId, setOrganId] = useState('kidneys');
    const [activeNode, setActiveNode] = useState(null);
    const [centerTab, setCenterTab] = useState('insights');
    const [summaryOpen, setSummaryOpen] = useState(true);

    const organ = ORGANS[organId];

    // ── RENDER HELPERS ───────────────────────────────────────────────────────

    const renderSectionLabel = (label) => (
        <Text style={s.sectionLabel}>{label}</Text>
    );

    // ── NODE DETAIL RENDERERS ────────────────────────────────────────────────

    const renderDiseaseDetail = () => (
        <View style={{ marginTop: vs(8) }}>
            {organ.diseases.map((d, i) => (
                <View key={i} style={s.nodeDetailRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor, flex: 1 }}>{d.name}</Text>
                        <View style={{ backgroundColor: sevColor(d.severity) + '20', paddingHorizontal: ms(8), paddingVertical: vs(2), borderRadius: ms(8) }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(9), color: sevColor(d.severity), textTransform: 'uppercase' }}>{d.severity}</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(4) }}>{d.contribution}</Text>
                    <View style={{ height: ms(6), backgroundColor: '#E5E7EB', borderRadius: ms(3), marginTop: vs(6), overflow: 'hidden' }}>
                        <View style={{ height: ms(6), width: `${d.pct}%`, backgroundColor: sevColor(d.severity), borderRadius: ms(3) }} />
                    </View>
                    <Text style={{ fontFamily: bold, fontSize: ms(10), color: sevColor(d.severity), marginTop: vs(3), textAlign: 'right' }}>{d.pct}%</Text>
                </View>
            ))}
        </View>
    );

    const renderBiomarkersDetail = () => (
        <View style={{ marginTop: vs(8) }}>
            {organ.biomarkers.map((b, i) => (
                <View key={i} style={s.nodeDetailRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor }}>{b.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(13), color: statusCol(b.status) }}>{b.val}</Text>
                            <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>{b.unit}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(4) }}>
                        <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>Target: {b.tgt}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(11), color: statusCol(b.status) }}>{b.trend}</Text>
                            <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280' }}>{b.delta}</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(4) }}>{b.impact}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4), marginTop: vs(4) }}>
                        <View style={{ width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: sevColor(b.severity) }} />
                        <Text style={{ fontFamily: bold, fontSize: ms(9), color: sevColor(b.severity), textTransform: 'uppercase' }}>{b.severity}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderSymptomsDetail = () => (
        <View style={{ marginTop: vs(8) }}>
            {organ.symptoms.map((sy, i) => (
                <View key={i} style={s.nodeDetailRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6), flex: 1 }}>
                            <View style={{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: sevColor(sy.sev) }} />
                            <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor }}>{sy.s}</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) }}>Frequency: {sy.frequency}</Text>
                    <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) }}>{sy.link}</Text>
                </View>
            ))}
        </View>
    );

    const renderLifestyleDetail = () => (
        <View style={{ marginTop: vs(8) }}>
            {organ.lifestyle.map((l, i) => (
                <View key={i} style={s.nodeDetailRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8) }}>
                        <Icon type={Icons.Ionicons} name={l.icon} size={ms(18)} color={organ.color} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor }}>{l.factor}</Text>
                            <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>{l.status}</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(4) }}>{l.impact}</Text>
                    <View style={{ height: ms(6), backgroundColor: '#E5E7EB', borderRadius: ms(3), marginTop: vs(6), overflow: 'hidden' }}>
                        <View style={{ height: ms(6), width: `${l.score}%`, backgroundColor: organ.color, borderRadius: ms(3) }} />
                    </View>
                    <Text style={{ fontFamily: bold, fontSize: ms(10), color: organ.color, marginTop: vs(2), textAlign: 'right' }}>{l.score}%</Text>
                </View>
            ))}
        </View>
    );

    const renderEngagementDetail = () => (
        <View style={{ marginTop: vs(8) }}>
            {organ.engagement.map((e, i) => {
                const uCol = sevColor(e.urgency);
                return (
                    <View key={i} style={s.nodeDetailRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor, flex: 1 }}>{e.item}</Text>
                            <View style={{ backgroundColor: uCol + '20', paddingHorizontal: ms(8), paddingVertical: vs(2), borderRadius: ms(8) }}>
                                <Text style={{ fontFamily: bold, fontSize: ms(9), color: uCol, textTransform: 'uppercase' }}>{e.urgency}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(4) }}>
                            <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280' }}>{e.status}</Text>
                            <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>Due: {e.due}</Text>
                        </View>
                        <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(3) }}>{e.note}</Text>
                    </View>
                );
            })}
        </View>
    );

    const renderNodeContent = () => {
        if (!activeNode) return null;
        switch (activeNode) {
            case 'disease': return renderDiseaseDetail();
            case 'biomarkers': return renderBiomarkersDetail();
            case 'symptoms': return renderSymptomsDetail();
            case 'lifestyle': return renderLifestyleDetail();
            case 'engagement': return renderEngagementDetail();
            default: return null;
        }
    };

    // ── TAB CONTENT ──────────────────────────────────────────────────────────

    const renderInsightsTab = () => (
        <View>
            {/* 2x2 Insight Cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginBottom: vs(14) }}>
                {organ.insights.map((ins, i) => (
                    <View key={i} style={{
                        width: (width - ms(40) - ms(42) - ms(10)) / 2,
                        backgroundColor: whiteColor, borderRadius: ms(12),
                        padding: ms(12), borderLeftWidth: 3, borderLeftColor: sevColor(ins.sev),
                    }}>
                        <Icon type={Icons.Ionicons} name={ins.icon} size={ms(18)} color={sevColor(ins.sev)} />
                        <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor, marginTop: vs(6) }}>{ins.title}</Text>
                        <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(4), lineHeight: ms(15) }}>
                            {view === 'patient' ? ins.patient : ins.body}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Projected Trajectory */}
            <View style={s.card}>
                <View style={s.cardHeader}>
                    <Icon type={Icons.Ionicons} name="analytics" size={ms(18)} color={organ.color} />
                    <Text style={s.cardTitle}>Projected Trajectory</Text>
                </View>
                {[
                    { label: 'Now', text: organ.condition, color: organ.color },
                    { label: 'No action', text: `${organ.nextStage} in ${organ.nextTime}`, color: '#EF4444' },
                    { label: 'With care', text: 'Stabilization or reversal possible', color: '#22C55E' },
                ].map((t, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(10) }}>
                        <View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: t.color, marginTop: vs(3), marginRight: ms(10) }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(11), color: t.color }}>{t.label}</Text>
                            <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) }}>{t.text}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderClusterTab = () => {
        if (!organ.clusterAffected) {
            return (
                <View style={s.card}>
                    <View style={{ alignItems: 'center', paddingVertical: vs(20) }}>
                        <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(36)} color="#22C55E" />
                        <Text style={{ fontFamily: bold, fontSize: ms(14), color: blackColor, marginTop: vs(8) }}>No Cluster Involvement</Text>
                        <Text style={{ fontFamily: regular, fontSize: ms(12), color: '#6B7280', marginTop: vs(4), textAlign: 'center' }}>
                            This organ is not part of a multi-disease cluster.
                        </Text>
                    </View>
                </View>
            );
        }
        return (
            <View>
                <View style={s.card}>
                    <View style={s.cardHeader}>
                        <Icon type={Icons.Ionicons} name="git-network" size={ms(18)} color={organ.color} />
                        <Text style={s.cardTitle}>{organ.clusterName}</Text>
                    </View>

                    {/* Disease Pressure Sources */}
                    {organ.clusterDiseases.map((cd, i) => (
                        <View key={i} style={{ marginBottom: vs(10) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor }}>{cd.name}</Text>
                                <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>{cd.role}</Text>
                            </View>
                            <View style={{ height: ms(8), backgroundColor: '#E5E7EB', borderRadius: ms(4), marginTop: vs(4), overflow: 'hidden' }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    colors={[cd.color + '60', cd.color]}
                                    style={{ height: ms(8), width: `${cd.pct}%`, borderRadius: ms(4) }}
                                />
                            </View>
                            <Text style={{ fontFamily: bold, fontSize: ms(10), color: cd.color, textAlign: 'right', marginTop: vs(2) }}>{cd.pct}%</Text>
                        </View>
                    ))}

                    {/* Mechanism / Patient text */}
                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: ms(10), padding: ms(12), marginTop: vs(6) }}>
                        {renderSectionLabel(view === 'patient' ? 'How it affects you' : 'Mechanism')}
                        <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#374151', lineHeight: ms(17), marginTop: vs(4) }}>
                            {view === 'patient' ? organ.clusterPatient : organ.clusterMechanism}
                        </Text>
                    </View>
                </View>

                {/* Amplification Timeline */}
                <View style={s.card}>
                    <View style={s.cardHeader}>
                        <Icon type={Icons.Ionicons} name="time" size={ms(18)} color={organ.color} />
                        <Text style={s.cardTitle}>Amplification Timeline</Text>
                    </View>
                    {organ.clusterDiseases.map((cd, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) }}>
                            <View style={{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: cd.color, marginRight: ms(8) }} />
                            <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#374151', flex: 1 }}>
                                {cd.name} ({cd.role}) \u2192 accelerates {organ.name.toLowerCase()} stress
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderActionsTab = () => (
        <View>
            {organ.recommendations.map((rec, i) => {
                const ps = priStyle(rec.pri);
                return (
                    <View key={i} style={[s.card, { borderLeftWidth: 3, borderLeftColor: ps.color }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(6) }}>
                            <View style={{ width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: ps.bg, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon type={Icons.Ionicons} name={ps.icon} size={ms(16)} color={ps.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: bold, fontSize: ms(13), color: blackColor }}>{rec.title}</Text>
                                <Text style={{ fontFamily: bold, fontSize: ms(9), color: ps.color, textTransform: 'uppercase' }}>{rec.pri}</Text>
                            </View>
                        </View>
                        <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginBottom: vs(4) }}>{rec.desc}</Text>
                        <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#374151' }}>Action: {rec.action}</Text>
                        <View style={{ backgroundColor: ps.bg, paddingHorizontal: ms(10), paddingVertical: vs(3), borderRadius: ms(8), alignSelf: 'flex-start', marginTop: vs(6) }}>
                            <Text style={{ fontFamily: bold, fontSize: ms(10), color: ps.color }}>Impact: {rec.impact}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    // ── MAIN RENDER ──────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
            <StatusBar2 />
            <LinearGradient colors={globalGradient2} style={{ flex: 1 }}>

                {/* ── HEADER ────────────────────────────────────────────── */}
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(22)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={s.headerTitle}>Organ Intelligence</Text>
                        <Text style={s.headerSub}>Deep organ analysis</Text>
                    </View>

                    {/* Doctor / Patient Toggle */}
                    <View style={s.toggleWrap}>
                        <TouchableOpacity
                            onPress={() => setView('patient')}
                            style={[s.toggleBtn, view === 'patient' && s.toggleActive]}>
                            <Icon type={Icons.Ionicons} name="person" size={ms(13)} color={view === 'patient' ? whiteColor : '#D1D5DB'} />
                            <Text style={[s.toggleText, view === 'patient' && s.toggleTextActive]}>Patient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setView('doctor')}
                            style={[s.toggleBtn, view === 'doctor' && s.toggleActive]}>
                            <Icon type={Icons.Ionicons} name="medkit" size={ms(13)} color={view === 'doctor' ? whiteColor : '#D1D5DB'} />
                            <Text style={[s.toggleText, view === 'doctor' && s.toggleTextActive]}>Doctor</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── ORGAN SELECTOR (horizontal) ────────────────────── */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: ms(20), paddingBottom: vs(12), gap: ms(10) }}>
                    {organsArr.map(o => {
                        const on = organId === o.id;
                        return (
                            <TouchableOpacity key={o.id} activeOpacity={0.7}
                                onPress={() => { setOrganId(o.id); setActiveNode(null); setSummaryOpen(true); }}
                                style={[s.organChip, {
                                    borderColor: on ? o.color : '#E5E7EB',
                                    backgroundColor: on ? o.color + '15' : whiteColor,
                                }]}>
                                {ORGAN_IMAGES[o.name] && (
                                    <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(28), height: ms(28) }} resizeMode="contain" />
                                )}
                                <Text style={{ fontFamily: bold, fontSize: ms(12), color: on ? o.color : blackColor }}>{o.name}</Text>
                                <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>{o.conditionShort}</Text>
                                <StressRing pct={o.stress} />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* ── SCROLL CONTENT ─────────────────────────────────── */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(40) }}>

                    {/* ── Summary Banner ─────────────────────────────── */}
                    {summaryOpen && (
                        <View style={s.card}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(8) }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8), flex: 1 }}>
                                    <View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: organ.color }} />
                                    <Text style={{ fontFamily: bold, fontSize: ms(14), color: blackColor, flex: 1 }}>{organ.condition}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setSummaryOpen(false)} style={{ padding: ms(4) }}>
                                    <Icon type={Icons.Ionicons} name="close-circle" size={ms(20)} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(18), marginBottom: vs(10) }}>
                                {view === 'patient' ? organ.patientSummary : organ.clinicalSummary}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: bold, fontSize: ms(18), color: stressColor(organ.stress) }}>{organ.stress}%</Text>
                                    <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>Stress</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: bold, fontSize: ms(18), color: organ.functionScore >= 60 ? '#22C55E' : '#EF4444' }}>{organ.functionScore}%</Text>
                                    <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>Function</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: bold, fontSize: ms(12), color: '#EF4444' }}>{organ.nextStage}</Text>
                                    <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>Next Stage</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ── Stage Bar Card ──────────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="bar-chart" size={ms(18)} color={organ.color} />
                            <Text style={s.cardTitle}>Condition Stage</Text>
                        </View>

                        {/* Stage segments */}
                        <View style={{ flexDirection: 'row', gap: ms(3), marginBottom: vs(6) }}>
                            {organ.stages.map((st, i) => {
                                const isCurrent = i === organ.stageI;
                                const isPast = i < organ.stageI;
                                const segColor = i <= 1 ? '#22C55E' : i <= 2 ? '#F59E0B' : i <= 3 ? '#EF4444' : '#DC2626';
                                return (
                                    <View key={i} style={{
                                        flex: 1, height: ms(8), borderRadius: ms(4),
                                        backgroundColor: (isPast || isCurrent) ? segColor : '#E5E7EB',
                                        borderWidth: isCurrent ? 1.5 : 0,
                                        borderColor: isCurrent ? blackColor : 'transparent',
                                    }} />
                                );
                            })}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {organ.stages.map((st, i) => (
                                <Text key={i} style={{
                                    fontFamily: i === organ.stageI ? bold : regular,
                                    fontSize: ms(7), color: i === organ.stageI ? blackColor : '#9CA3AF',
                                    flex: 1, textAlign: 'center',
                                }}>{st}</Text>
                            ))}
                        </View>

                        {/* Function Score */}
                        <View style={{ marginTop: vs(14) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(4) }}>
                                <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor }}>{organ.functionLabel}</Text>
                                <Text style={{ fontFamily: bold, fontSize: ms(14), color: organ.functionScore >= 60 ? '#22C55E' : '#EF4444' }}>{organ.functionScore}%</Text>
                            </View>
                            <View style={{ height: ms(8), backgroundColor: '#E5E7EB', borderRadius: ms(4), overflow: 'hidden' }}>
                                <View style={{
                                    height: ms(8), width: `${organ.functionScore}%`, borderRadius: ms(4),
                                    backgroundColor: organ.functionScore >= 60 ? '#22C55E' : organ.functionScore >= 40 ? '#F59E0B' : '#EF4444',
                                }} />
                            </View>
                        </View>

                        {/* Next Stage Projection */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: vs(12), backgroundColor: '#FEF3C7', borderRadius: ms(8), padding: ms(10) }}>
                            <Icon type={Icons.Ionicons} name="time" size={ms(16)} color="#D97706" />
                            <Text style={{ fontFamily: regular, fontSize: ms(11), color: '#92400E', marginLeft: ms(8), flex: 1 }}>
                                Next stage: <Text style={{ fontFamily: bold }}>{organ.nextStage}</Text> projected in <Text style={{ fontFamily: bold }}>{organ.nextTime}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* ── Web Node Selector ───────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="grid" size={ms(18)} color={organ.color} />
                            <Text style={s.cardTitle}>Intelligence Web</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) }}>
                            {WEB_NODES.map(n => {
                                const on = activeNode === n.key;
                                return (
                                    <TouchableOpacity key={n.key} activeOpacity={0.7}
                                        onPress={() => setActiveNode(on ? null : n.key)}
                                        style={{
                                            width: (width - ms(40) - ms(32) - ms(16)) / 3,
                                            backgroundColor: on ? n.color + '15' : '#F9FAFB',
                                            borderRadius: ms(12), padding: ms(12), alignItems: 'center',
                                            borderWidth: 1.5, borderColor: on ? n.color : '#E5E7EB',
                                        }}>
                                        <Icon type={Icons.Ionicons} name={n.icon} size={ms(20)} color={on ? n.color : '#9CA3AF'} />
                                        <Text style={{ fontFamily: bold, fontSize: ms(10), color: on ? n.color : '#6B7280', marginTop: vs(4) }}>{n.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {renderNodeContent()}
                    </View>

                    {/* ── Center Tabs ─────────────────────────────────── */}
                    <View style={{ flexDirection: 'row', marginHorizontal: ms(20), marginBottom: vs(14), gap: ms(6) }}>
                        {[
                            { key: 'insights', label: 'Insights', icon: 'bulb' },
                            { key: 'cluster', label: 'Cluster', icon: 'git-network' },
                            { key: 'recs', label: 'Actions', icon: 'rocket' },
                        ].map(t => {
                            const on = centerTab === t.key;
                            return (
                                <TouchableOpacity key={t.key} activeOpacity={0.7}
                                    onPress={() => setCenterTab(t.key)}
                                    style={{
                                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                        gap: ms(4), paddingVertical: vs(10), borderRadius: ms(12),
                                        backgroundColor: on ? organ.color : whiteColor,
                                        borderWidth: on ? 0 : 1, borderColor: '#E5E7EB',
                                    }}>
                                    <Icon type={Icons.Ionicons} name={t.icon} size={ms(14)} color={on ? whiteColor : '#6B7280'} />
                                    <Text style={{ fontFamily: bold, fontSize: ms(11), color: on ? whiteColor : '#6B7280' }}>{t.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Tab Content */}
                    <View style={{ marginHorizontal: ms(20) }}>
                        {centerTab === 'insights' && renderInsightsTab()}
                        {centerTab === 'cluster' && renderClusterTab()}
                        {centerTab === 'recs' && renderActionsTab()}
                    </View>

                    {/* ── Biomarkers Card ─────────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="flask" size={ms(18)} color="#3B82F6" />
                            <Text style={s.cardTitle}>Biomarkers</Text>
                        </View>
                        {organ.biomarkers.map((b, i) => (
                            <View key={i} style={{ paddingVertical: vs(10), borderBottomWidth: i < organ.biomarkers.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor }}>{b.name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}>
                                        <Text style={{ fontFamily: bold, fontSize: ms(12), color: statusCol(b.status) }}>{b.val}</Text>
                                        <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>{b.unit}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(2) }}>
                                    <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' }}>Target: {b.tgt}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}>
                                        <Text style={{ fontFamily: bold, fontSize: ms(11), color: statusCol(b.status) }}>{b.trend}</Text>
                                        <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#6B7280' }}>{b.delta}</Text>
                                    </View>
                                </View>
                                <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(3) }}>{b.impact}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Symptoms Card ────────────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="flash" size={ms(18)} color="#8B5CF6" />
                            <Text style={s.cardTitle}>Symptoms</Text>
                        </View>
                        {organ.symptoms.map((sy, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: vs(8), borderBottomWidth: i < organ.symptoms.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                                <View style={{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: sevColor(sy.sev), marginTop: vs(4), marginRight: ms(10) }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor }}>{sy.s}</Text>
                                    <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(1) }}>Frequency: {sy.frequency}</Text>
                                    <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(2) }}>{sy.link}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* ── Lifestyle Card ───────────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="fitness" size={ms(18)} color={primaryColor} />
                            <Text style={s.cardTitle}>Lifestyle Factors</Text>
                        </View>
                        {organ.lifestyle.map((l, i) => (
                            <View key={i} style={{ paddingVertical: vs(10), borderBottomWidth: i < organ.lifestyle.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8) }}>
                                    <Icon type={Icons.Ionicons} name={l.icon} size={ms(16)} color={organ.color} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor }}>{l.factor}</Text>
                                        <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>{l.status}</Text>
                                    </View>
                                </View>
                                <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(3) }}>{l.impact}</Text>
                                <View style={{ height: ms(6), backgroundColor: '#E5E7EB', borderRadius: ms(3), marginTop: vs(4), overflow: 'hidden' }}>
                                    <View style={{ height: ms(6), width: `${l.score}%`, backgroundColor: organ.color, borderRadius: ms(3) }} />
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* ── Engagement Card ──────────────────────────────── */}
                    <View style={s.card}>
                        <View style={s.cardHeader}>
                            <Icon type={Icons.Ionicons} name="calendar" size={ms(18)} color="#F59E0B" />
                            <Text style={s.cardTitle}>Engagement Checklist</Text>
                        </View>
                        {organ.engagement.map((e, i) => {
                            const uCol = sevColor(e.urgency);
                            return (
                                <View key={i} style={{ paddingVertical: vs(10), borderBottomWidth: i < organ.engagement.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: bold, fontSize: ms(12), color: blackColor, flex: 1 }}>{e.item}</Text>
                                        <View style={{ backgroundColor: uCol + '20', paddingHorizontal: ms(8), paddingVertical: vs(2), borderRadius: ms(8) }}>
                                            <Text style={{ fontFamily: bold, fontSize: ms(8), color: uCol, textTransform: 'uppercase' }}>{e.urgency}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(3) }}>
                                        <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280' }}>{e.status}</Text>
                                        <Text style={{ fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' }}>Due: {e.due}</Text>
                                    </View>
                                    <Text style={{ fontFamily: regular, fontSize: ms(10), color: '#6B7280', marginTop: vs(2) }}>{e.note}</Text>
                                </View>
                            );
                        })}
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

// ── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: vs(10), paddingBottom: vs(8),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    headerTitle: {
        fontFamily: bold, fontSize: ms(18), color: whiteColor,
    },
    headerSub: {
        fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.7)', marginTop: vs(1),
    },
    toggleWrap: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: ms(10), padding: ms(3),
    },
    toggleBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingHorizontal: ms(10), paddingVertical: vs(5), borderRadius: ms(8),
    },
    toggleActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    toggleText: {
        fontFamily: regular, fontSize: ms(10), color: '#D1D5DB',
    },
    toggleTextActive: {
        fontFamily: bold, color: whiteColor,
    },
    organChip: {
        alignItems: 'center', gap: vs(4),
        paddingVertical: vs(10), paddingHorizontal: ms(14),
        borderRadius: ms(14), borderWidth: 1.5,
    },
    card: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(14),
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(12),
    },
    cardTitle: {
        fontFamily: bold, fontSize: ms(14), color: blackColor,
    },
    sectionLabel: {
        fontFamily: bold, fontSize: ms(10), color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: 0.5,
    },
    nodeDetailRow: {
        backgroundColor: '#F9FAFB', borderRadius: ms(10),
        padding: ms(12), marginBottom: vs(8),
    },
});

export default OrganLayerScreen;
