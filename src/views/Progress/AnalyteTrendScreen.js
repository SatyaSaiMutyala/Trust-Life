import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Line, Rect, Defs, LinearGradient as SvgGrad, Stop, Text as SvgText } from 'react-native-svg';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

// ── Data ─────────────────────────────────────────────────────────────────────
const ANALYTES = [
    { name: 'HbA1c',      unit: '%',      lo: 4.0,  hi: 5.6,  machines: ['Roche Cobas','Roche Cobas','Abbott Architect','Abbott Architect','Roche Cobas','Roche Cobas'] },
    { name: 'Glucose',    unit: 'mg/dL',  lo: 70,   hi: 100,  machines: ['Siemens','Siemens','Siemens','Beckman AU','Beckman AU','Beckman AU'] },
    { name: 'TSH',        unit: 'µIU/mL', lo: 0.4,  hi: 4.0,  machines: ['Abbott i2000','Abbott i2000','Abbott i2000','Abbott i2000','Roche e801','Roche e801'] },
    { name: 'Creatinine', unit: 'mg/dL',  lo: 0.7,  hi: 1.3,  machines: ['Beckman AU','Beckman AU','Siemens','Siemens','Siemens','Siemens'] },
    { name: 'Hemoglobin', unit: 'g/dL',   lo: 13.5, hi: 17.5, machines: ['Roche Cobas','Roche Cobas','Roche Cobas','Sysmex XN','Sysmex XN','Sysmex XN'] },
    { name: 'LDL',        unit: 'mg/dL',  lo: 0,    hi: 100,  machines: ['Beckman AU','Beckman AU','Beckman AU','Roche Cobas','Roche Cobas','Roche Cobas'] },
    { name: 'ALT',        unit: 'U/L',    lo: 7,    hi: 40,   machines: ['Siemens','Siemens','Siemens','Siemens','Siemens','Siemens'] },
    { name: 'Ferritin',   unit: 'ng/mL',  lo: 20,   hi: 300,  machines: ['Abbott i2000','Abbott i2000','Abbott i2000','Abbott i2000','Abbott i2000','Abbott i2000'] },
];

const DATES = ['Jan 24', 'Apr 24', 'Jul 24', 'Oct 24', 'Jan 25', 'Apr 25'];
const NOTES = ['Baseline', 'Stable', 'Machine change', 'Follow-up', 'Medication started', 'Review'];

// Fixed patient dataset (Patient A · M, 52y)
const RAW_VALUES = [
    [6.1, 5.9, 6.4, 6.5, 6.2, 6.0],   // HbA1c
    [112, 108, 118, 125, 105, 98],       // Glucose
    [5.2, 4.8, 5.5, 0.38, 3.9, 1.2],   // TSH
    [0.9, 0.95, 1.1, 1.25, 1.15, 1.1], // Creatinine
    [14.8, 14.5, 14.2, 13.8, 13.6, 13.9], // Hemoglobin
    [138, 132, 145, 151, 110, 98],       // LDL
    [28, 32, 29, 35, 31, 28],            // ALT
    [45, 40, 38, 35, 30, 28],            // Ferritin
];

const MACHINE_COLORS = {
    'Roche Cobas': '#185FA5', 'Abbott Architect': '#0F6E56', 'Siemens': '#854F0B',
    'Beckman AU': '#993C1D', 'Abbott i2000': '#533AB7', 'Roche e801': '#185FA5', 'Sysmex XN': '#3B6D11',
};

// ── Per-analyte intelligence ───────────────────────────────────────────────────
const ANALYTE_INTEL = {
    'HbA1c': {
        insight: {
            description: 'HbA1c reflects average blood glucose over 2–3 months. Above 5.6% signals prediabetes risk; above 6.5% confirms diabetes.',
            symptoms: ['Increased thirst and urination', 'Unexplained fatigue', 'Blurred vision', 'Slow-healing wounds', 'Frequent infections'],
            causes: ['Uncontrolled blood sugar', 'High-carbohydrate diet', 'Physical inactivity', 'Insulin resistance', 'Pancreatic dysfunction'],
        },
        organs: [
            { name: 'Heart', color: '#EF4444', stage: 'Early Stress', impact: 'Hyperglycemia accelerates atherosclerosis and coronary artery damage.' },
            { name: 'Kidneys', color: '#3B82F6', stage: 'Stage 2 CKD', impact: 'Sustained high glucose damages glomerular filtration over time.' },
            { name: 'Eyes', color: '#8B5CF6', stage: 'Early Changes', impact: 'Retinal microvasculature damaged by chronic hyperglycemia.' },
            { name: 'Nerves', color: '#F59E0B', stage: 'Early Neuropathy', impact: 'Glycation of myelin sheaths degrades nerve conduction speed.' },
        ],
        biomarkers: [
            { name: 'Fasting Glucose', value: '125 mg/dL', target: '<100', status: 'high', note: 'Directly correlated with HbA1c elevation' },
            { name: 'C-Peptide', value: '1.8 ng/mL', target: '0.8–3.1', status: 'normal', note: 'Indicates residual insulin secretion' },
            { name: 'Insulin', value: '18 µIU/mL', target: '<15', status: 'borderline', note: 'Elevated — insulin resistance pattern' },
        ],
        cluster: {
            riskScore: '72%', name: 'Metabolic Syndrome Cluster',
            description: 'HbA1c elevation is the central driver of a cascade affecting cardiovascular, renal and neurological systems.',
            diseases: [
                { name: 'Type 2 Diabetes', progress: 85, type: 'active' },
                { name: 'Cardiovascular Disease', progress: 55, type: 'emerging' },
                { name: 'Chronic Kidney Disease', progress: 38, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'HbA1c persistently above 6.0% — prediabetic to diabetic range', color: '#EF4444' },
                { time: '6 months', event: 'Risk of microalbuminuria and early retinal changes', color: '#F97316' },
                { time: '12–18 months', event: 'Kidney filtration decline possible without intervention', color: '#F59E0B' },
                { time: '2–3 years', event: 'Cardiovascular event risk significantly elevated', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Reduce Refined Carbohydrates', desc: 'Cut white rice, bread and sugary drinks. Switch to complex carbs with low glycaemic index.', priority: 'high', icon: 'nutrition' },
            { title: 'Exercise 30 min Daily', desc: 'Brisk walking or cycling improves insulin sensitivity within 2 weeks.', priority: 'high', icon: 'walk' },
            { title: 'Monitor Fasting Glucose Weekly', desc: 'Self-monitoring helps identify food-glucose patterns.', priority: 'medium', icon: 'pulse' },
        ],
        care: {
            treatment: ['Metformin 500mg once daily with meals (if prescribed)', 'Review with endocrinologist every 3 months', 'Annual eye exam and kidney function panel'],
            prevention: 'Maintain HbA1c below 5.7% through consistent diet, regular physical activity, and annual screening.',
        },
    },
    'Glucose': {
        insight: {
            description: 'Fasting blood glucose measures blood sugar after an overnight fast. Normal: 70–100 mg/dL. Persistently elevated levels indicate insulin resistance or diabetes.',
            symptoms: ['Frequent urination', 'Extreme hunger', 'Fatigue after meals', 'Headaches', 'Difficulty concentrating'],
            causes: ['Insulin resistance', 'High-sugar diet', 'Stress hormones', 'Lack of physical activity', 'Medication side effects'],
        },
        organs: [
            { name: 'Pancreas', color: '#F59E0B', stage: 'Under Stress', impact: 'Beta cells overworked to produce excess insulin.' },
            { name: 'Liver', color: '#06B6D4', stage: 'Glycogen Overload', impact: 'Excess glucose converted to fat in the liver — NAFLD risk.' },
        ],
        biomarkers: [
            { name: 'HbA1c', value: '6.2%', target: '<5.7%', status: 'borderline', note: 'Confirms chronic glucose elevation pattern' },
            { name: 'Insulin', value: '22 µIU/mL', target: '<15', status: 'high', note: 'Hyperinsulinaemia — compensatory response' },
        ],
        cluster: {
            riskScore: '65%', name: 'Insulin Resistance Cluster',
            description: 'Elevated fasting glucose clusters with insulin resistance, NAFLD, and metabolic syndrome.',
            diseases: [
                { name: 'Pre-diabetes / T2DM', progress: 70, type: 'active' },
                { name: 'Non-alcoholic Fatty Liver', progress: 45, type: 'emerging' },
                { name: 'Hypertension', progress: 35, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'Fasting glucose 105–125 mg/dL — pre-diabetic range', color: '#F59E0B' },
                { time: '6–12 months', event: 'HbA1c may cross 6.5% confirming T2DM', color: '#F97316' },
                { time: '2 years', event: 'Organ-level damage begins without intervention', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Low-GI Diet', desc: 'Replace refined carbs with whole grains, legumes and vegetables.', priority: 'high', icon: 'nutrition' },
            { title: '30 min Post-Meal Walk', desc: 'Walking after meals reduces glucose spikes by up to 30%.', priority: 'high', icon: 'walk' },
            { title: 'HbA1c Test in 3 Months', desc: 'Confirm chronic glucose status beyond fasting snapshot.', priority: 'medium', icon: 'analytics' },
        ],
        care: {
            treatment: ['Lifestyle intervention first-line: diet + exercise', 'Metformin if glucose > 126 mg/dL confirmed twice', 'Quarterly monitoring until stable'],
            prevention: 'Maintain fasting glucose below 100 mg/dL with low-GI diet and 150 min/week aerobic exercise.',
        },
    },
    'TSH': {
        insight: {
            description: 'TSH (Thyroid-Stimulating Hormone) regulates thyroid function. Low TSH signals hyperthyroidism; high TSH indicates hypothyroidism. Normal: 0.4–4.0 µIU/mL.',
            symptoms: ['Fatigue and weight gain (high TSH)', 'Palpitations and weight loss (low TSH)', 'Hair thinning', 'Cold or heat intolerance', 'Mood changes'],
            causes: ["Hashimoto's thyroiditis", "Graves' disease", 'Iodine deficiency', 'Thyroid nodules', 'Pituitary dysfunction'],
        },
        organs: [
            { name: 'Heart', color: '#EF4444', stage: 'Rhythm Risk', impact: 'Hyperthyroidism causes tachycardia and atrial fibrillation risk.' },
            { name: 'Brain', color: '#7C3AED', stage: 'Mood Affected', impact: 'Thyroid imbalance causes depression, anxiety and cognitive fog.' },
        ],
        biomarkers: [
            { name: 'Free T4', value: '0.7 ng/dL', target: '0.8–1.8', status: 'low', note: 'Low fT4 with low TSH — secondary hypothyroidism pattern' },
            { name: 'Free T3', value: '2.1 pg/mL', target: '2.3–4.2', status: 'low', note: 'Reduced active thyroid hormone' },
        ],
        cluster: {
            riskScore: '48%', name: 'Thyroid-Metabolic Cluster',
            description: 'TSH instability clusters with metabolic weight gain, cardiovascular rhythm disorders and mood conditions.',
            diseases: [
                { name: 'Hypothyroidism', progress: 60, type: 'active' },
                { name: 'Cardiovascular Arrhythmia', progress: 30, type: 'watch' },
                { name: 'Depression / Anxiety', progress: 40, type: 'emerging' },
            ],
            timeline: [
                { time: 'Now', event: 'TSH fluctuating — unstable thyroid regulation', color: '#F59E0B' },
                { time: '6 months', event: 'Metabolic slowdown if undertreated', color: '#F97316' },
                { time: '1 year', event: 'Cardiac and mood risk compounds', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Endocrinology Review', desc: 'Unstable TSH across visits requires specialist evaluation.', priority: 'high', icon: 'medkit' },
            { title: 'Check fT4 and fT3', desc: 'TSH alone is insufficient — free hormone levels needed.', priority: 'high', icon: 'analytics' },
            { title: 'Avoid Iodine Excess', desc: 'Kelp, iodine supplements can worsen thyroid instability.', priority: 'medium', icon: 'nutrition' },
        ],
        care: {
            treatment: ['Levothyroxine (T4) replacement if TSH consistently high', 'Methimazole if TSH consistently suppressed', 'Retest TSH 6–8 weeks after any dose change'],
            prevention: 'Maintain adequate iodine intake. Annual TSH screening especially in women over 35.',
        },
    },
    'Creatinine': {
        insight: {
            description: 'Creatinine is a waste product filtered by the kidneys. Rising creatinine indicates declining kidney filtration capacity. Normal: 0.7–1.3 mg/dL.',
            symptoms: ['Often asymptomatic in early stages', 'Foamy urine (proteinuria)', 'Ankle swelling', 'Fatigue', 'High blood pressure'],
            causes: ['Diabetic nephropathy', 'Hypertension', 'Chronic NSAID use', 'Glomerulonephritis', 'Dehydration'],
        },
        organs: [
            { name: 'Kidneys', color: '#3B82F6', stage: 'Stage 2 CKD', impact: 'Rising creatinine directly reflects declining nephron function.' },
            { name: 'Heart', color: '#EF4444', stage: 'Cardiorenal Risk', impact: 'CKD doubles cardiovascular event risk through fluid and pressure dysregulation.' },
        ],
        biomarkers: [
            { name: 'eGFR', value: '68 mL/min', target: '>90', status: 'low', note: 'Stage 2 CKD — filtration declining' },
            { name: 'BUN', value: '22 mg/dL', target: '7–20', status: 'borderline', note: 'Mild nitrogen retention — early filtration decline' },
        ],
        cluster: {
            riskScore: '58%', name: 'Cardiorenal Syndrome Cluster',
            description: 'Rising creatinine clusters with CKD progression, hypertension and cardiovascular disease in a destructive cycle.',
            diseases: [
                { name: 'Chronic Kidney Disease', progress: 55, type: 'active' },
                { name: 'Hypertension', progress: 60, type: 'emerging' },
                { name: 'Heart Failure Risk', progress: 30, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'Creatinine rising — early CKD stage 2', color: '#F59E0B' },
                { time: '12 months', event: 'Nephrology referral essential to slow progression', color: '#F97316' },
                { time: '2–3 years', event: 'Stage 3 CKD and dialysis planning may be needed', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Nephrology Referral', desc: 'eGFR below 70 warrants specialist input to prevent progression.', priority: 'high', icon: 'medkit' },
            { title: 'Limit Protein Intake', desc: 'Keep to 0.8 g/kg/day — excess protein increases filtration load.', priority: 'high', icon: 'nutrition' },
            { title: 'Avoid NSAIDs', desc: 'Ibuprofen and similar drugs reduce kidney perfusion acutely.', priority: 'high', icon: 'close-circle' },
        ],
        care: {
            treatment: ['SGLT2 inhibitor — Empagliflozin (kidney-protective)', 'ACE inhibitor for blood pressure and kidney protection', 'eGFR monitoring every 3 months'],
            prevention: 'Control BP below 130/80 mmHg, maintain HbA1c below 7%, and avoid nephrotoxic drugs.',
        },
    },
    'Hemoglobin': {
        insight: {
            description: 'Hemoglobin carries oxygen in red blood cells. Low levels cause fatigue and impair organ oxygenation. Normal: 13.5–17.5 g/dL for adult males.',
            symptoms: ['Persistent fatigue and weakness', 'Pale skin and gums', 'Shortness of breath on exertion', 'Dizziness', 'Cold extremities'],
            causes: ['Iron deficiency', 'Vitamin B12 or folate deficiency', 'Chronic kidney disease', 'Chronic inflammation', 'Blood loss'],
        },
        organs: [
            { name: 'Heart', color: '#EF4444', stage: 'Compensating', impact: 'Heart pumps faster to deliver oxygen when haemoglobin is low.' },
            { name: 'Brain', color: '#7C3AED', stage: 'Cognitive Risk', impact: 'Reduced oxygen delivery impairs concentration and memory.' },
        ],
        biomarkers: [
            { name: 'Ferritin', value: '28 ng/mL', target: '20–300', status: 'borderline', note: 'Low-normal — iron stores need monitoring' },
            { name: 'MCV', value: '78 fL', target: '80–100', status: 'low', note: 'Low MCV suggests iron-deficiency pattern' },
        ],
        cluster: {
            riskScore: '42%', name: 'Anaemia-Fatigue Cluster',
            description: 'Declining haemoglobin clusters with iron deficiency, B12 depletion and chronic disease anaemia.',
            diseases: [
                { name: 'Iron Deficiency Anaemia', progress: 55, type: 'emerging' },
                { name: 'Nutritional Deficiency', progress: 48, type: 'active' },
                { name: 'CKD-related Anaemia', progress: 30, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'Hemoglobin declining — borderline anaemia at 13.6 g/dL', color: '#F59E0B' },
                { time: '3–6 months', event: 'Symptomatic anaemia if decline continues', color: '#F97316' },
                { time: '1 year', event: 'Cardiac compensation risk if severe', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Increase Iron-Rich Foods', desc: 'Red meat, spinach, legumes and fortified cereals boost iron stores.', priority: 'high', icon: 'nutrition' },
            { title: 'Pair Iron with Vitamin C', desc: 'Vitamin C enhances non-haem iron absorption by up to 6×.', priority: 'medium', icon: 'leaf' },
            { title: 'Full Blood Count + Ferritin', desc: 'Identify cause of decline before supplementing.', priority: 'high', icon: 'flask' },
        ],
        care: {
            treatment: ['Iron supplement 65mg elemental daily if ferritin < 30', 'B12 injection if absorption is the issue', 'Treat underlying CKD or inflammation if present'],
            prevention: 'Annual full blood count. Adequate dietary iron and B12. Avoid tea/coffee with meals — tannins block iron absorption.',
        },
    },
    'LDL': {
        insight: {
            description: 'LDL (Low-Density Lipoprotein) carries cholesterol to arterial walls. Elevated LDL accelerates plaque formation (atherosclerosis) and raises heart attack and stroke risk.',
            symptoms: ['Usually asymptomatic until advanced', 'Chest pain in advanced stages', 'Xanthomas (fatty deposits under skin)', 'Arcus corneae (white ring around iris)'],
            causes: ['Saturated and trans fat diet', 'Familial hypercholesterolaemia', 'Hypothyroidism', 'Diabetes', 'Physical inactivity'],
        },
        organs: [
            { name: 'Heart', color: '#EF4444', stage: 'Plaque Building', impact: 'LDL deposits in coronary arteries — atherosclerosis progressing.' },
            { name: 'Brain', color: '#7C3AED', stage: 'Stroke Risk', impact: 'Carotid artery plaque raises stroke risk significantly.' },
        ],
        biomarkers: [
            { name: 'HDL', value: '42 mg/dL', target: '>40', status: 'borderline', note: 'Low HDL with high LDL — atherogenic pattern' },
            { name: 'Triglycerides', value: '198 mg/dL', target: '<150', status: 'high', note: 'Elevated TG worsens cardiovascular risk further' },
        ],
        cluster: {
            riskScore: '68%', name: 'Cardiovascular Risk Cluster',
            description: 'Elevated LDL is the cornerstone of cardiovascular disease risk, compounded by hypertension and diabetes.',
            diseases: [
                { name: 'Atherosclerosis', progress: 62, type: 'active' },
                { name: 'Coronary Artery Disease', progress: 50, type: 'emerging' },
                { name: 'Ischaemic Stroke', progress: 35, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'LDL 130–150 mg/dL — moderate-high cardiovascular risk', color: '#EF4444' },
                { time: '1–2 years', event: 'Coronary plaque progression without statin therapy', color: '#F97316' },
                { time: '3–5 years', event: 'Significant cardiac event risk if untreated', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Mediterranean Diet', desc: 'Olive oil, fish, nuts and vegetables reduce LDL by 15–20%.', priority: 'high', icon: 'leaf' },
            { title: 'Eliminate Trans Fats', desc: 'Processed foods, margarine and fried foods raise LDL directly.', priority: 'high', icon: 'nutrition' },
            { title: 'Statin Therapy Review', desc: 'Consult doctor if LDL remains above 130 mg/dL despite lifestyle changes.', priority: 'high', icon: 'medkit' },
        ],
        care: {
            treatment: ['Rosuvastatin 10–20mg nightly (consult doctor)', 'Ezetimibe if statin intolerant', 'Lipid panel recheck 6 weeks after starting statin'],
            prevention: 'LDL target < 100 mg/dL general population, < 70 mg/dL if existing heart disease. Annual lipid panel from age 40.',
        },
    },
    'ALT': {
        insight: {
            description: 'ALT (Alanine Aminotransferase) is a liver enzyme. Elevated ALT signals liver cell damage. Values above 40 U/L indicate inflammation or injury to liver tissue.',
            symptoms: ['Fatigue and weakness', 'Abdominal discomfort (right side)', 'Nausea after fatty meals', 'Mild jaundice', 'Dark urine'],
            causes: ['Non-alcoholic fatty liver disease (NAFLD)', 'Alcohol consumption', 'Obesity and metabolic syndrome', 'Viral hepatitis', 'Certain medications'],
        },
        organs: [
            { name: 'Liver', color: '#06B6D4', stage: 'Steatosis', impact: 'Elevated ALT directly reflects hepatocellular stress and fat infiltration.' },
            { name: 'Pancreas', color: '#F59E0B', stage: 'Watch Zone', impact: 'NAFLD and diabetes often co-exist — pancreatic stress linked.' },
        ],
        biomarkers: [
            { name: 'AST', value: '38 U/L', target: '<40', status: 'borderline', note: 'AST/ALT ratio < 1 suggests NAFLD pattern' },
            { name: 'GGT', value: '58 U/L', target: '<50', status: 'high', note: 'Elevated GGT indicates alcohol or oxidative stress' },
        ],
        cluster: {
            riskScore: '52%', name: 'Liver-Metabolic Cluster',
            description: 'ALT elevation links to NAFLD, metabolic syndrome and insulin resistance in a common pathway.',
            diseases: [
                { name: 'Non-Alcoholic Fatty Liver (NAFLD)', progress: 58, type: 'active' },
                { name: 'Metabolic Syndrome', progress: 50, type: 'emerging' },
                { name: 'NASH (Liver Inflammation)', progress: 25, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'ALT elevated — hepatic steatosis likely', color: '#F59E0B' },
                { time: '6–12 months', event: 'Risk of NASH if metabolic factors uncorrected', color: '#F97316' },
                { time: '3–5 years', event: 'Fibrosis risk with persistent inflammation', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Reduce Alcohol to Zero', desc: 'Even moderate alcohol significantly elevates ALT in NAFLD patients.', priority: 'high', icon: 'close-circle' },
            { title: 'Lose 5–10% Body Weight', desc: 'Weight reduction is the most effective treatment for NAFLD.', priority: 'high', icon: 'fitness' },
            { title: 'Liver Ultrasound', desc: 'Confirm fatty liver diagnosis and rule out fibrosis.', priority: 'high', icon: 'medkit' },
        ],
        care: {
            treatment: ['Vitamin E 400IU daily — proven to reduce ALT in non-diabetic NAFLD', 'Liver specialist review if ALT > 2× upper limit', 'Avoid hepatotoxic drugs (NSAIDs, excess paracetamol)'],
            prevention: 'Maintain healthy BMI (18.5–24.9), limit alcohol, exercise regularly and follow a low-sugar diet.',
        },
    },
    'Ferritin': {
        insight: {
            description: 'Ferritin is the primary iron storage protein. Low ferritin signals depleted iron stores even before anaemia develops. Normal: 20–300 ng/mL.',
            symptoms: ['Fatigue even with normal haemoglobin', 'Restless legs syndrome', 'Hair loss', 'Brain fog', 'Reduced exercise tolerance'],
            causes: ['Inadequate dietary iron', 'Chronic blood loss', 'Malabsorption (coeliac, IBD)', 'Vegetarian or vegan diet', 'Chronic inflammation'],
        },
        organs: [
            { name: 'Heart', color: '#EF4444', stage: 'Watch Zone', impact: 'Iron deficiency forces heart to pump faster to compensate for low oxygen delivery.' },
            { name: 'Brain', color: '#7C3AED', stage: 'Fatigue Risk', impact: 'Iron is critical for dopamine synthesis — low stores affect mood and cognition.' },
        ],
        biomarkers: [
            { name: 'Hemoglobin', value: '13.6 g/dL', target: '13.5–17.5', status: 'borderline', note: 'Anaemia may follow if ferritin continues falling' },
            { name: 'TIBC', value: '380 µg/dL', target: '240–360', status: 'high', note: 'Elevated TIBC confirms iron deficiency pattern' },
        ],
        cluster: {
            riskScore: '38%', name: 'Iron Deficiency Cluster',
            description: 'Declining ferritin clusters with symptomatic anaemia, fatigue syndrome and reduced immunity.',
            diseases: [
                { name: 'Iron Deficiency Anaemia', progress: 50, type: 'emerging' },
                { name: 'Fatigue Syndrome', progress: 45, type: 'active' },
                { name: 'Immune Deficiency', progress: 30, type: 'watch' },
            ],
            timeline: [
                { time: 'Now', event: 'Ferritin declining — pre-anaemic iron deficiency', color: '#F59E0B' },
                { time: '3–6 months', event: 'Haemoglobin may drop below 12 g/dL', color: '#F97316' },
                { time: '1 year', event: 'Symptomatic anaemia with cardiac compensation', color: '#9CA3AF' },
            ],
        },
        actions: [
            { title: 'Iron-Rich Diet', desc: 'Red meat, dark leafy greens, legumes and fortified cereals daily.', priority: 'high', icon: 'nutrition' },
            { title: 'Investigate Bleeding Source', desc: 'GI blood loss is the most common cause in adults.', priority: 'high', icon: 'medkit' },
            { title: 'Oral Iron Supplement', desc: 'Ferrous sulfate 325mg with Vitamin C if ferritin < 20 ng/mL.', priority: 'high', icon: 'flask' },
        ],
        care: {
            treatment: ['Ferrous sulfate 325mg daily taken with orange juice', 'IV iron infusion if oral not tolerated or GI absorption impaired', 'Retest ferritin in 8–12 weeks after starting supplementation'],
            prevention: 'Annual ferritin check in at-risk groups. Avoid tea/coffee with meals. Pair plant-based iron sources with Vitamin C.',
        },
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const calcRIR = (val, lo, hi) => (val - lo) / (hi - lo);
const rirStatus = (r) => {
    if (r < 0) return 'low';
    if (r > 1.3) return 'high';
    if (r > 1.0) return 'border';
    return 'normal';
};
const DOT_COLOR  = { normal: '#1D9E75', border: '#BA7517', high: '#E24B4A', low: '#E24B4A' };
const STATUS_BG  = { normal: '#EAF3DE', border: '#FAEEDA', high: '#FCEBEB', low: '#FCEBEB' };
const STATUS_FG  = { normal: '#3B6D11', border: '#854F0B', high: '#A32D2D', low: '#A32D2D' };
const STATUS_LBL = { normal: 'Normal', border: 'Borderline', high: 'High', low: 'Low' };

// ── Chart geometry (fixed: accounts for card margin + padding) ────────────────
const { width: SCREEN_W } = Dimensions.get('window');
// card: marginHorizontal ms(16) each side, padding ms(14) each side → total ms(60)
const SVG_W  = SCREEN_W - ms(60);
const SVG_H  = vs(200);
const L_PAD  = ms(30);   // room for Y labels
const R_PAD  = ms(4);
const T_PAD  = vs(18);
const B_PAD  = vs(20);   // room for X labels
const DRAW_W = SVG_W - L_PAD - R_PAD;
const DRAW_H = SVG_H - T_PAD - B_PAD;
const N = 6;

const toX = (i)          => L_PAD + i * (DRAW_W / (N - 1));
const toY = (v, lo, hi)  => T_PAD + (1 - (v - lo) / (hi - lo)) * DRAW_H;

const buildCurve = (pts) => {
    if (!pts.length) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], c = pts[i];
        const cx1 = p.x + (c.x - p.x) * 0.4;
        const cx2 = p.x + (c.x - p.x) * 0.6;
        d += ` C ${cx1} ${p.y} ${cx2} ${c.y} ${c.x} ${c.y}`;
    }
    return d;
};
const buildArea = (pts, botY) => `${buildCurve(pts)} L ${pts[pts.length-1].x} ${botY} L ${pts[0].x} ${botY} Z`;

// ── Chart Component ───────────────────────────────────────────────────────────
const TrendChart = ({ rirs, rawVals, analyte, axisMode, machineChangeIdxs }) => {
    const minY  = axisMode === 'rir' ? -0.3  : Math.min(...rawVals) * 0.85;
    const maxY  = axisMode === 'rir' ? 1.7   : Math.max(...rawVals) * 1.15;
    const refLo = axisMode === 'rir' ? 0     : analyte.lo;
    const refHi = axisMode === 'rir' ? 1     : analyte.hi;
    const vals  = axisMode === 'rir' ? rirs  : rawVals;

    const pts      = vals.map((v, i) => ({ x: toX(i), y: toY(v, minY, maxY) }));
    const yRefLo   = toY(refLo, minY, maxY);
    const yRefHi   = toY(refHi, minY, maxY);
    const botY     = T_PAD + DRAW_H;

    const TICKS = 5;
    const tickVals = Array.from({ length: TICKS + 1 }, (_, i) => minY + i * (maxY - minY) / TICKS);

    return (
        <Svg width={SVG_W} height={SVG_H}>
            <Defs>
                <SvgGrad id="ag" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%"   stopColor={primaryColor} stopOpacity="0.28" />
                    <Stop offset="100%" stopColor={primaryColor} stopOpacity="0.01" />
                </SvgGrad>
                <SvgGrad id="nb" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%"   stopColor="#1D9E75" stopOpacity="0.12" />
                    <Stop offset="100%" stopColor="#1D9E75" stopOpacity="0.03" />
                </SvgGrad>
            </Defs>

            {/* Grid lines */}
            {tickVals.map((v, i) => {
                const y = toY(v, minY, maxY);
                return <Line key={i} x1={L_PAD} y1={y} x2={L_PAD + DRAW_W} y2={y} stroke="#F0F0F4" strokeWidth="1" />;
            })}

            {/* Left axis line */}
            <Line x1={L_PAD} y1={T_PAD} x2={L_PAD} y2={botY} stroke="#E5E7EB" strokeWidth="1" />

            {/* Normal band */}
            <Rect x={L_PAD} y={Math.min(yRefLo, yRefHi)} width={DRAW_W}
                height={Math.abs(yRefLo - yRefHi)} fill="url(#nb)" />
            <Line x1={L_PAD} y1={yRefHi} x2={L_PAD + DRAW_W} y2={yRefHi} stroke="#1D9E75" strokeWidth="0.9" strokeDasharray="5,3" />
            <Line x1={L_PAD} y1={yRefLo} x2={L_PAD + DRAW_W} y2={yRefLo} stroke="#1D9E75" strokeWidth="0.9" strokeDasharray="5,3" />

            {/* Machine change verticals */}
            {machineChangeIdxs.map(i => (
                <Line key={i} x1={toX(i)} y1={T_PAD} x2={toX(i)} y2={botY}
                    stroke="#BA7517" strokeWidth="1.2" strokeDasharray="4,4" />
            ))}

            {/* Area + curve */}
            <Path d={buildArea(pts, botY)} fill="url(#ag)" />
            <Path d={buildCurve(pts)} fill="none" stroke={primaryColor} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots */}
            {pts.map((pt, i) => {
                const s = rirStatus(rirs[i]);
                return <Circle key={i} cx={pt.x} cy={pt.y} r={ms(4.5)}
                    fill={DOT_COLOR[s]} stroke={whiteColor} strokeWidth={1.5} />;
            })}

            {/* Y labels */}
            {tickVals.map((v, i) => {
                const y = toY(v, minY, maxY);
                const lbl = axisMode === 'rir' ? v.toFixed(1) : Math.round(v).toString();
                return (
                    <SvgText key={i} x={L_PAD - ms(4)} y={y + vs(3.5)}
                        fontSize={ms(8)} fill="#9CA3AF" textAnchor="end">
                        {lbl}
                    </SvgText>
                );
            })}

            {/* X labels */}
            {DATES.map((d, i) => (
                <SvgText key={i} x={toX(i)} y={botY + vs(14)}
                    fontSize={ms(8)} fill="#9CA3AF" textAnchor="middle">
                    {d}
                </SvgText>
            ))}
        </Svg>
    );
};

// ── Organ helpers (no deterioration data — derive from stage text) ────────────
const stageSeverity = (stage) => {
    const s = stage.toLowerCase();
    if (s.includes('damage') || s.includes('failure') || s.includes('severe') || s.includes('overload')) return 75;
    if (s.includes('stress') || s.includes('stage') || s.includes('plaque') || s.includes('dysfunction') || s.includes('compensat')) return 52;
    return 32;
};
const stageTrend = (stage) => {
    const s = stage.toLowerCase();
    if (s.includes('early') || s.includes('watch') || s.includes('borderline') || s.includes('stable')) return 'stable-risk';
    return 'worsening';
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const AnalyteTrendScreen = () => {
    const navigation = useNavigation();
    const route      = useRoute();
    const analyteName = route.params?.analyteName || null;
    const initialIdx  = analyteName
        ? Math.max(0, ANALYTES.findIndex(a => a.name.toLowerCase() === analyteName.toLowerCase()))
        : 0;

    const [aid, setAid]             = useState(initialIdx);
    const [axisMode, setAxisMode]   = useState('rir');
    const [activeTab, setActiveTab] = useState('insight');

    const TABS = [
        { key: 'insight',    label: 'Insight',    icon: 'bulb' },
        { key: 'organs',     label: 'Organs',     icon: 'body' },
        { key: 'biomarkers', label: 'Biomarkers', icon: 'analytics' },
        { key: 'cluster',    label: 'Cluster',    icon: 'git-network' },
        { key: 'actions',    label: 'Actions',    icon: 'checkmark-circle' },
        { key: 'care',       label: 'Care',       icon: 'medical' },
    ];

    const analyte = ANALYTES[aid];
    const rawVals = RAW_VALUES[aid];
    const rirs    = rawVals.map(v => calcRIR(v, analyte.lo, analyte.hi));
    const machineChangeIdxs = analyte.machines
        .map((m, i) => (i > 0 && m !== analyte.machines[i - 1] ? i : -1))
        .filter(i => i !== -1);

    const latest      = rirs[rirs.length - 1];
    const baseline    = rirs[0];
    const delta       = latest - baseline;
    const latestSt    = rirStatus(latest);

    return (
        <SafeAreaView style={st.container}>
            <StatusBar2 />
            <LinearGradient colors={globalGradient2} start={{ x: 0, y: 0 }} end={{ x: 0, y: 3 }} locations={[0, 0.08]} style={st.flex}>

                    {/* ── Header ── */}
                    <View style={st.header}>
                        <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                        </TouchableOpacity>
                        <View style={st.headerText}>
                            <Text style={st.headerTitle}>{analyteName || 'Analyte Trend'}</Text>
                            {!analyteName && <Text style={st.headerSub}>Longitudinal biomarker tracking · Patient A</Text>}
                        </View>
                        <View style={st.headerBadge}>
                            <Icon type={Icons.Ionicons} name="analytics" size={ms(14)} color={whiteColor} />
                        </View>
                    </View>

                    {/* ── Tab Bar ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        style={st.tabScroll} contentContainerStyle={st.tabRow}>
                        {TABS.map(tab => (
                            <TouchableOpacity key={tab.key}
                                style={[st.tab, activeTab === tab.key && st.tabActive]}
                                onPress={() => setActiveTab(tab.key)}>
                                <Icon type={Icons.Ionicons} name={tab.icon} size={ms(12)}
                                    color={activeTab === tab.key ? primaryColor : '#9CA3AF'} />
                                <Text style={[st.tabText, activeTab === tab.key && st.tabTextActive]}>{tab.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={st.scroll}>

                    {/* ── Analyte Selector (hidden when opened from a specific biomarker) ── */}
                    {!analyteName && (
                        <View style={st.selectorWrap}>
                            <Text style={st.selectorLabel}>Select Analyte</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chipRow}>
                                {ANALYTES.map((a, i) => (
                                    <TouchableOpacity key={i}
                                        style={[st.chip, aid === i && st.chipActive]}
                                        onPress={() => setAid(i)}>
                                        <Text style={[st.chipText, aid === i && st.chipTextActive]}>
                                            {a.name}{aid === i ? <Text style={st.chipUnit}> · {a.unit}</Text> : null}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* ── Metrics Row (Insight tab only) ── */}
                    {activeTab === 'insight' && <View style={st.metricsRow}>
                        <View style={[st.metricCard, { borderLeftColor: DOT_COLOR[latestSt] }]}>
                            <Text style={st.metricLabel}>Latest RIR</Text>
                            <Text style={[st.metricValue, { color: DOT_COLOR[latestSt] }]}>{latest.toFixed(2)}</Text>
                            <View style={[st.metricBadge, { backgroundColor: STATUS_BG[latestSt] }]}>
                                <Text style={[st.metricBadgeText, { color: STATUS_FG[latestSt] }]}>{STATUS_LBL[latestSt]}</Text>
                            </View>
                        </View>
                        <View style={[st.metricCard, { borderLeftColor: primaryColor }]}>
                            <Text style={st.metricLabel}>Latest Value</Text>
                            <Text style={[st.metricValue, { color: blackColor }]}>{rawVals[rawVals.length - 1]}</Text>
                            <Text style={st.metricUnit}>{analyte.unit}</Text>
                        </View>
                        <View style={[st.metricCard, { borderLeftColor: delta > 0.1 ? '#E24B4A' : delta < -0.1 ? '#1D9E75' : '#9CA3AF' }]}>
                            <Text style={st.metricLabel}>Δ Baseline</Text>
                            <Text style={[st.metricValue, { color: delta > 0.1 ? '#E24B4A' : delta < -0.1 ? '#1D9E75' : '#888' }]}>
                                {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
                            </Text>
                            <Text style={st.metricUnit}>RIR change</Text>
                        </View>
                        <View style={[st.metricCard, { borderLeftColor: machineChangeIdxs.length > 0 ? '#BA7517' : '#1D9E75' }]}>
                            <Text style={st.metricLabel}>Machines</Text>
                            <Text style={[st.metricValue, { color: machineChangeIdxs.length > 0 ? '#BA7517' : '#1D9E75' }]}>{machineChangeIdxs.length}</Text>
                            <Text style={st.metricUnit}>changes</Text>
                        </View>
                    </View>}

                    {/* ── TAB CONTENT ── */}
                    {(() => {
                        const intel = ANALYTE_INTEL[analyte.name] || ANALYTE_INTEL['HbA1c'];

                        if (activeTab === 'insight') return (
                            <>
                                {/* Chart card — lives inside Insight tab */}
                                <View style={st.chartCard}>
                                    <View style={st.chartTopRow}>
                                        <View>
                                            <Text style={st.chartTitle}>{analyte.name} Trend</Text>
                                            <Text style={st.chartSub}>Ref range: {analyte.lo} – {analyte.hi} {analyte.unit}</Text>
                                        </View>
                                        <View style={st.toggle}>
                                            {[
                                                { mode: 'rir', label: 'RIR' },
                                                { mode: 'raw', label: analyte.unit },
                                            ].map(({ mode, label }) => (
                                                <TouchableOpacity key={mode}
                                                    style={[st.toggleBtn, axisMode === mode && st.toggleBtnActive]}
                                                    onPress={() => setAxisMode(mode)}>
                                                    <Text style={[st.toggleText, axisMode === mode && st.toggleTextActive]}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={st.legendRow}>
                                        {[
                                            { color: '#1D9E75', label: 'Normal' },
                                            { color: '#BA7517', label: 'Borderline' },
                                            { color: '#E24B4A', label: 'Flagged' },
                                        ].map((l, i) => (
                                            <View key={i} style={st.legendItem}>
                                                <View style={[st.legendDot, { backgroundColor: l.color }]} />
                                                <Text style={st.legendText}>{l.label}</Text>
                                            </View>
                                        ))}
                                        {machineChangeIdxs.length > 0 && (
                                            <View style={st.legendItem}>
                                                <View style={st.legendDash} />
                                                <Text style={[st.legendText, { color: '#BA7517' }]}>Machine Δ</Text>
                                            </View>
                                        )}
                                    </View>
                                    <TrendChart rirs={rirs} rawVals={rawVals} analyte={analyte}
                                        axisMode={axisMode} machineChangeIdxs={machineChangeIdxs} />
                                </View>

                                {/* Insight description */}
                                <View style={[st.intelCard, { borderWidth: 1, borderColor: primaryColor + '30' }]}>
                                    <View style={st.intelCardHeader}>
                                        <View style={[st.intelIconWrap, { backgroundColor: primaryColor + '15' }]}>
                                            <Icon type={Icons.Ionicons} name="bulb" size={ms(18)} color={primaryColor} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={st.intelCardTitle}>{analyte.name}</Text>
                                            <Text style={st.intelCardSub}>Ref: {analyte.lo} – {analyte.hi} {analyte.unit}</Text>
                                        </View>
                                    </View>
                                    <Text style={st.intelDesc}>{intel.insight.description}</Text>
                                </View>

                                {/* Symptoms */}
                                <View style={st.intelCard}>
                                    <View style={st.intelSectionRow}>
                                        <Icon type={Icons.Ionicons} name="warning" size={ms(14)} color="#F59E0B" />
                                        <Text style={[st.intelSectionTitle, { color: '#F59E0B' }]}>Symptoms</Text>
                                    </View>
                                    {intel.insight.symptoms.map((sym, i) => (
                                        <View key={i} style={st.intelListRow}>
                                            <View style={[st.intelDot, { backgroundColor: '#F59E0B' }]} />
                                            <Text style={st.intelListText}>{sym}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={[st.intelCard, { borderWidth: 1, borderColor: '#FEE2E2' }]}>
                                    <View style={st.intelSectionRow}>
                                        <Icon type={Icons.Ionicons} name="alert-circle" size={ms(14)} color="#EF4444" />
                                        <Text style={[st.intelSectionTitle, { color: '#EF4444' }]}>Causes</Text>
                                    </View>
                                    {intel.insight.causes.map((c, i) => (
                                        <View key={i} style={st.intelListRow}>
                                            <View style={[st.intelDot, { backgroundColor: '#EF4444' }]} />
                                            <Text style={st.intelListText}>{c}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        );

                        if (activeTab === 'organs') return (
                            <>
                                <View style={st.organsCard}>
                                    <Text style={st.cardTitle}>Affected Organs</Text>
                                    {/* Mini cards grid — identical layout to DiseaseIntelligenceScreen */}
                                    <View style={st.organGrid}>
                                        {intel.organs.map((o, i) => {
                                            const sev = stageSeverity(o.stage);
                                            const trend = stageTrend(o.stage);
                                            return (
                                                <View key={i} style={[st.organMiniCard, { width: (SCREEN_W - ms(82)) / 2 }]}>
                                                    <View style={st.organMiniTop}>
                                                        <View style={[st.organMiniIcon, { backgroundColor: o.color + '12' }]}>
                                                            <Icon type={Icons.Ionicons} name="body" size={ms(14)} color={o.color} />
                                                        </View>
                                                        <View>
                                                            <Text style={[st.organMiniScore, { color: o.color }]}>{sev}</Text>
                                                            <Text style={st.organMiniStressLabel}>risk</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={st.organMiniName}>{o.name}</Text>
                                                    <Text style={[st.organMiniStage, { color: o.color }]}>{o.stage}</Text>
                                                    <View style={st.organMiniBar}>
                                                        <View style={[st.organMiniFill, { width: `${sev}%`, backgroundColor: o.color }]} />
                                                    </View>
                                                    <Text style={[st.organMiniTrend, { color: trend === 'worsening' ? '#F97316' : primaryColor }]}>
                                                        {trend === 'worsening' ? '↑ Worsening' : '→ Stable Risk'}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    {/* Impact detail */}
                                    <View style={{ marginTop: vs(16), borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: vs(16) }}>
                                        {intel.organs.map((o, i) => (
                                            <View key={i} style={[st.opImpactCard, { backgroundColor: o.color + '08', borderColor: o.color + '25', marginBottom: vs(8) }]}>
                                                <Text style={[st.opImpactTitle, { color: o.color }]}>{o.name} — {o.stage}</Text>
                                                <Text style={st.opImpactText}>{o.impact}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        );

                        if (activeTab === 'biomarkers') return (
                            <>
                                <View style={[st.intelCard, { backgroundColor: primaryColor + '06' }]}>
                                    <Text style={st.intelHintText}>Related biomarkers that move together with {analyte.name} and complete the clinical picture.</Text>
                                </View>
                                {intel.biomarkers.map((bm, i) => {
                                    const col = bm.status === 'high' || bm.status === 'low' ? '#EF4444' : bm.status === 'borderline' ? '#F59E0B' : bm.status === 'normal' ? '#1D9E75' : '#9CA3AF';
                                    return (
                                        <View key={i} style={st.bmCard}>
                                            <View style={st.bmCardTop}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={st.bmName}>{bm.name}</Text>
                                                    <Text style={st.bmTarget}>Target: {bm.target}</Text>
                                                </View>
                                                <View style={[st.bmStatusBadge, { backgroundColor: col + '15' }]}>
                                                    <Text style={[st.bmStatusText, { color: col }]}>{bm.value}</Text>
                                                </View>
                                            </View>
                                            <Text style={st.bmNote}>{bm.note}</Text>
                                        </View>
                                    );
                                })}
                            </>
                        );

                        if (activeTab === 'cluster') return (
                            <>
                                <View style={[st.intelCard, { borderWidth: 1, borderColor: '#F9731630' }]}>
                                    <View style={st.clusterHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={st.clusterTitle}>{intel.cluster.name}</Text>
                                            <Text style={st.clusterSub}>{intel.cluster.description}</Text>
                                        </View>
                                        <View style={st.clusterScoreWrap}>
                                            <Text style={st.clusterScoreNum}>{intel.cluster.riskScore}</Text>
                                            <Text style={st.clusterScoreLabel}>Risk</Text>
                                        </View>
                                    </View>
                                    {intel.cluster.diseases.map((d, i) => {
                                        const typeCol = d.type === 'active' ? '#EF4444' : d.type === 'emerging' ? '#F97316' : '#3B82F6';
                                        return (
                                            <View key={i} style={st.clusterDisease}>
                                                <View style={st.clusterDiseaseTop}>
                                                    <Text style={st.clusterDiseaseName}>{d.name}</Text>
                                                    <Text style={[st.clusterDiseaseType, { color: typeCol }]}>
                                                        {d.type === 'active' ? 'Active' : d.type === 'emerging' ? 'Emerging' : 'Watch Zone'}
                                                    </Text>
                                                </View>
                                                <View style={st.clusterBar}>
                                                    <View style={[st.clusterBarFill, { width: `${d.progress}%`, backgroundColor: typeCol }]} />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={st.intelCard}>
                                    <Text style={st.clusterTitle}>Timeline — Without Intervention</Text>
                                    <View style={{ marginTop: vs(12) }}>
                                        {intel.cluster.timeline.map((pt, i) => (
                                            <View key={i} style={st.timelineItem}>
                                                <View style={st.timelineLeft}>
                                                    <View style={[st.timelineDot, { backgroundColor: pt.color }]} />
                                                    {i < intel.cluster.timeline.length - 1 && <View style={st.timelineConnector} />}
                                                </View>
                                                <View style={st.timelineContent}>
                                                    <Text style={[st.timelineTime, { color: pt.color }]}>{pt.time}</Text>
                                                    <Text style={st.timelineEvent}>{pt.event}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        );

                        if (activeTab === 'actions') return (
                            <>
                                {intel.actions.map((a, i) => {
                                    const col = a.priority === 'high' ? '#EF4444' : '#F59E0B';
                                    return (
                                        <View key={i} style={[st.actionCard, { borderLeftColor: col }]}>
                                            <View style={st.actionTop}>
                                                <View style={[st.actionIconWrap, { backgroundColor: col + '15' }]}>
                                                    <Icon type={Icons.Ionicons} name={a.icon} size={ms(16)} color={col} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <View style={st.actionTitleRow}>
                                                        <Text style={st.actionTitle}>{a.title}</Text>
                                                        <View style={[st.actionPriorityBadge, { backgroundColor: col + '15' }]}>
                                                            <Text style={[st.actionPriorityText, { color: col }]}>{a.priority === 'high' ? 'High' : 'Medium'}</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={st.actionDesc}>{a.desc}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </>
                        );

                        if (activeTab === 'care') return (
                            <>
                                <View style={[st.intelCard, { borderWidth: 1, borderColor: '#D1FAE5' }]}>
                                    <View style={st.intelSectionRow}>
                                        <Icon type={Icons.Ionicons} name="medical" size={ms(15)} color={primaryColor} />
                                        <Text style={[st.intelSectionTitle, { color: primaryColor }]}>Treatment</Text>
                                    </View>
                                    {intel.care.treatment.map((t, i) => (
                                        <View key={i} style={st.careRow}>
                                            <View style={[st.careBullet, { backgroundColor: primaryColor }]}>
                                                <Text style={st.careBulletNum}>{i + 1}</Text>
                                            </View>
                                            <Text style={st.careText}>{t}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={[st.intelCard, { backgroundColor: primaryColor + '08', borderWidth: 1, borderColor: primaryColor + '25' }]}>
                                    <View style={st.intelSectionRow}>
                                        <Icon type={Icons.Ionicons} name="shield-checkmark" size={ms(15)} color={primaryColor} />
                                        <Text style={[st.intelSectionTitle, { color: primaryColor }]}>Prevention</Text>
                                    </View>
                                    <Text style={st.intelDesc}>{intel.care.prevention}</Text>
                                </View>
                            </>
                        );

                        return null;
                    })()}

                    {/* ── Visit Log (hidden on Organs tab) ── */}
                    {activeTab === 'insight' && <>
                    <View style={st.sectionRow}>
                        <View style={st.sectionIcon}>
                            <Icon type={Icons.Ionicons} name="list-outline" size={ms(14)} color={primaryColor} />
                        </View>
                        <Text style={st.sectionTitle}>Visit Log</Text>
                    </View>

                    <View style={visitSt.logWrap}>
                        {DATES.map((date, i) => {
                            const r          = rirs[i];
                            const st2        = rirStatus(r);
                            const machChanged = i > 0 && analyte.machines[i] !== analyte.machines[i - 1];
                            const mc         = MACHINE_COLORS[analyte.machines[i]] || '#888';
                            return (
                                <View key={i} style={visitSt.card}>
                                    {/* Top row: visit badge + date/note + status */}
                                    <View style={visitSt.cardTop}>
                                        <View style={[visitSt.visitBadge, { backgroundColor: STATUS_BG[st2] }]}>
                                            <Text style={[visitSt.visitBadgeNum, { color: STATUS_FG[st2] }]}>{i + 1}</Text>
                                            <Text style={[visitSt.visitBadgeLbl, { color: STATUS_FG[st2] }]}>Visit</Text>
                                        </View>
                                        <View style={visitSt.dateBlock}>
                                            <Text style={visitSt.dateText}>{date}</Text>
                                            <Text style={visitSt.noteText}>{NOTES[i]}</Text>
                                        </View>
                                        <View style={[visitSt.statusBadge, { backgroundColor: STATUS_BG[st2] }]}>
                                            <View style={[visitSt.statusDot, { backgroundColor: STATUS_FG[st2] }]} />
                                            <Text style={[visitSt.statusLabel, { color: STATUS_FG[st2] }]}>{STATUS_LBL[st2]}</Text>
                                        </View>
                                    </View>

                                    {/* Divider */}
                                    <View style={visitSt.divider} />

                                    {/* Bottom section */}
                                    <View style={visitSt.cardBottom}>
                                        {/* Row 1: Value + Machine + RIR/Baseline */}
                                        {(() => {
                                            const rir = rirs[i];
                                            const bDelta = i === 0 ? null : rir - rirs[0];
                                            const bColor = bDelta === null ? '#9CA3AF' : bDelta > 0.05 ? '#E24B4A' : bDelta < -0.05 ? '#1D9E75' : '#9CA3AF';
                                            return (
                                                <View style={visitSt.machineRow}>
                                                    <View style={visitSt.machineInline}>
                                                        <Text style={visitSt.valueLabel}>Machine</Text>
                                                        <View style={[visitSt.machinePill, { backgroundColor: mc + '18' }]}>
                                                            {machChanged && (
                                                                <Icon type={Icons.Ionicons} name="swap-horizontal" size={ms(10)} color="#BA7517" style={{ marginRight: ms(3) }} />
                                                            )}
                                                            <Text style={[visitSt.machineText, { color: mc }]} numberOfLines={1}>{analyte.machines[i]}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={visitSt.valueInline}>
                                                        <Text style={visitSt.valueLabel}>Value</Text>
                                                        <Text style={[visitSt.valueNum, { color: STATUS_FG[st2] }]}>
                                                            {rawVals[i]}<Text style={visitSt.valueUnit}> {analyte.unit}</Text>
                                                        </Text>
                                                    </View>
                                                    <View style={visitSt.rirBlock}>
                                                        <Text style={visitSt.valueLabel}>RIR</Text>
                                                        <Text style={[visitSt.valueNum, { color: DOT_COLOR[st2], fontSize: ms(15) }]}>{rir.toFixed(2)}</Text>
                                                        <Text style={[visitSt.rirBaseline, { color: bColor }]}>
                                                            {bDelta === null ? 'Baseline' : `${bDelta >= 0 ? '+' : ''}${bDelta.toFixed(2)} vs base`}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })()}

                                        {/* Divider */}
                                        <View style={visitSt.innerDivider} />

                                        {/* Row 2: Normal | Abnormal | Unit — centered */}
                                        <View style={visitSt.statsRow}>
                                            <View style={visitSt.statBlock}>
                                                <Text style={visitSt.statLabel}>Normal</Text>
                                                <Text style={[visitSt.statVal, { color: '#1D9E75' }]}>
                                                    {analyte.lo} – {analyte.hi}
                                                </Text>
                                            </View>
                                            <View style={[visitSt.statBlock, visitSt.statBorder]}>
                                                <Text style={visitSt.statLabel}>Deviation</Text>
                                                <Text style={[visitSt.statVal, { color: st2 !== 'normal' ? STATUS_FG[st2] : '#1D9E75' }]}>
                                                    {st2 === 'normal'
                                                        ? 'OK'
                                                        : st2 === 'low'
                                                            ? `−${(analyte.lo - rawVals[i]).toFixed(1)}`
                                                            : `+${(rawVals[i] - analyte.hi).toFixed(1)}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    </>}

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default AnalyteTrendScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    flex: { flex: 1 },
    scroll: { paddingBottom: vs(20) },

    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(16),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center',
    },
    headerText: { flex: 1, marginLeft: ms(12) },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: interRegular, fontSize: ms(10.5), color: 'rgba(255,255,255,0.72)', marginTop: vs(2) },
    headerBadge: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    },

    // Selector
    selectorWrap: { paddingHorizontal: ms(16), marginBottom: vs(12) },
    selectorLabel: { fontFamily: interMedium, fontSize: ms(11), color: '#6B7280', marginBottom: vs(8) },
    chipRow: { gap: ms(8) },
    chip: {
        paddingHorizontal: ms(14), paddingVertical: vs(8),
        borderRadius: ms(20), backgroundColor: whiteColor,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    chipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    chipText: { fontFamily: interMedium, fontSize: ms(11.5), color: '#6B7280' },
    chipTextActive: { color: whiteColor },
    chipUnit: { fontFamily: interRegular, fontSize: ms(9.5), color: 'rgba(255,255,255,0.75)' },

    // Metrics
    metricsRow: {
        flexDirection: 'row', gap: ms(8),
        paddingHorizontal: ms(16), marginBottom: vs(12),
    },
    metricCard: {
        flex: 1, backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(10), borderLeftWidth: ms(3),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 }, elevation: 2,
    },
    metricLabel: { fontFamily: interRegular, fontSize: ms(9), color: '#9CA3AF', marginBottom: vs(3), textTransform: 'uppercase' },
    metricValue: { fontFamily: interMedium, fontSize: ms(16), marginBottom: vs(2) },
    metricUnit: { fontFamily: interRegular, fontSize: ms(9), color: '#9CA3AF' },
    metricBadge: { borderRadius: ms(6), paddingHorizontal: ms(6), paddingVertical: vs(2), alignSelf: 'flex-start', marginTop: vs(2) },
    metricBadgeText: { fontFamily: interMedium, fontSize: ms(9) },

    // Chart card
    chartCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), marginBottom: vs(14),
        padding: ms(14),
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 3,
    },
    chartTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(10) },
    chartTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor },
    chartSub: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    toggle: { flexDirection: 'row', borderRadius: ms(8), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    toggleBtn: { paddingHorizontal: ms(12), paddingVertical: vs(6), backgroundColor: whiteColor },
    toggleBtnActive: { backgroundColor: primaryColor },
    toggleText: { fontFamily: interMedium, fontSize: ms(10.5), color: '#6B7280' },
    toggleTextActive: { color: whiteColor },

    legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(8) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(7), height: ms(7), borderRadius: ms(3.5) },
    legendDash: { width: ms(12), height: 2, backgroundColor: '#BA7517' },
    legendText: { fontFamily: interRegular, fontSize: ms(10), color: '#6B7280' },

    // Tabs
    tabScroll: { marginBottom: vs(8), flexGrow: 0 },
    tabRow: { paddingHorizontal: ms(16), gap: ms(4) },
    tab: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        backgroundColor: whiteColor, borderRadius: ms(10),
        paddingHorizontal: ms(8), paddingVertical: vs(6),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    tabActive: { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
    tabText: { fontFamily: interMedium, fontSize: ms(9.5), color: '#9CA3AF' },
    tabTextActive: { color: primaryColor },

    // Tab content cards
    intelCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), padding: ms(16), marginBottom: vs(12),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 }, elevation: 2,
    },
    intelCardHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) },
    intelIconWrap: { width: ms(38), height: ms(38), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    intelCardTitle: { fontFamily: heading, fontSize: ms(14), color: '#111827' },
    intelCardSub: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    intelDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', lineHeight: ms(18) },
    intelHintText: { fontFamily: interRegular, fontSize: ms(12), color: primaryColor, lineHeight: ms(18) },
    intelSectionRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(10) },
    intelSectionTitle: { fontFamily: interMedium, fontSize: ms(13), color: '#374151' },
    intelListRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8), marginBottom: vs(6) },
    intelDot: { width: ms(6), height: ms(6), borderRadius: ms(3), marginTop: vs(5) },
    intelListText: { flex: 1, fontFamily: interRegular, fontSize: ms(12), color: '#374151', lineHeight: ms(18) },

    // Organs tab wrapper card (same as DIS s.card)
    organsCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), padding: ms(16), marginBottom: vs(14),
    },
    cardTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor, marginBottom: vs(12) },

    // Organ mini card grid — exact copy of DIS s.organGrid / s.organMiniCard etc.
    organGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        gap: ms(10), marginTop: vs(4),
    },
    organMiniCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14),
        borderWidth: 1.5, borderColor: '#E5E7EB',
    },
    organMiniTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    organMiniIcon: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    organMiniScore: { fontFamily: interMedium, fontSize: ms(18), textAlign: 'right' },
    organMiniStressLabel: { fontFamily: interRegular, fontSize: ms(8), color: '#9CA3AF', textAlign: 'right' },
    organMiniName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    organMiniStage: { fontFamily: interRegular, fontSize: ms(10), marginBottom: vs(8) },
    organMiniBar: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    organMiniFill: { height: '100%', borderRadius: ms(2) },
    organMiniTrend: { fontFamily: interMedium, fontSize: ms(9), marginTop: vs(6) },

    // Organ impact card (detail below grid)
    opImpactCard: { borderRadius: ms(12), borderWidth: 1, padding: ms(14) },
    opImpactTitle: { fontFamily: interMedium, fontSize: ms(11), marginBottom: vs(6) },
    opImpactText: { fontFamily: interRegular, fontSize: ms(12), color: '#374151', lineHeight: ms(19) },

    // Biomarker cards
    bmCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        marginHorizontal: ms(16), padding: ms(14), marginBottom: vs(10),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 }, elevation: 2,
    },
    bmCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) },
    bmName: { fontFamily: interMedium, fontSize: ms(13), color: '#111827' },
    bmTarget: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    bmStatusBadge: { borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    bmStatusText: { fontFamily: interMedium, fontSize: ms(12) },
    bmNote: { fontFamily: interRegular, fontSize: ms(11.5), color: '#6B7280', lineHeight: ms(17) },

    // Cluster
    clusterHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(14) },
    clusterTitle: { fontFamily: interMedium, fontSize: ms(13), color: '#111827', marginBottom: vs(3) },
    clusterSub: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(16) },
    clusterScoreWrap: { alignItems: 'center', marginLeft: ms(12) },
    clusterScoreNum: { fontFamily: interMedium, fontSize: ms(22), color: '#F97316' },
    clusterScoreLabel: { fontFamily: interRegular, fontSize: ms(9), color: '#9CA3AF' },
    clusterDisease: { marginBottom: vs(10) },
    clusterDiseaseTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) },
    clusterDiseaseName: { fontFamily: interRegular, fontSize: ms(12), color: '#374151' },
    clusterDiseaseType: { fontFamily: interMedium, fontSize: ms(10) },
    clusterBar: { height: vs(5), backgroundColor: '#F3F4F6', borderRadius: ms(3), overflow: 'hidden' },
    clusterBarFill: { height: '100%', borderRadius: ms(3) },

    // Timeline
    timelineItem: { flexDirection: 'row', gap: ms(12) },
    timelineLeft: { alignItems: 'center', width: ms(14) },
    timelineDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginTop: vs(3) },
    timelineConnector: { flex: 1, width: 2, backgroundColor: '#E5E7EB', marginVertical: vs(3) },
    timelineContent: { flex: 1, paddingBottom: vs(14) },
    timelineTime: { fontFamily: interMedium, fontSize: ms(11) },
    timelineEvent: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginTop: vs(2), lineHeight: ms(17) },

    // Action cards
    actionCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        marginHorizontal: ms(16), padding: ms(14), marginBottom: vs(10),
        borderLeftWidth: ms(3),
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 }, elevation: 2,
    },
    actionTop: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10) },
    actionIconWrap: { width: ms(36), height: ms(36), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    actionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(4), flexWrap: 'wrap' },
    actionTitle: { fontFamily: interMedium, fontSize: ms(13), color: '#111827', flex: 1 },
    actionPriorityBadge: { borderRadius: ms(6), paddingHorizontal: ms(7), paddingVertical: vs(2) },
    actionPriorityText: { fontFamily: interMedium, fontSize: ms(9.5) },
    actionDesc: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(17) },

    // Care
    careRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), marginBottom: vs(10) },
    careBullet: { width: ms(20), height: ms(20), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    careBulletNum: { fontFamily: interMedium, fontSize: ms(10), color: whiteColor },
    careText: { flex: 1, fontFamily: interRegular, fontSize: ms(12), color: '#374151', lineHeight: ms(18) },

    // Section header
    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingHorizontal: ms(16), marginBottom: vs(10) },
    sectionIcon: {
        width: ms(28), height: ms(28), borderRadius: ms(14),
        backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center',
    },
    sectionTitle: { fontFamily: heading, fontSize: ms(15), color: blackColor },

});

// Visit log styles (separate to avoid name collision)
const visitSt = StyleSheet.create({
    logWrap: { paddingHorizontal: ms(16), gap: vs(10), marginBottom: vs(14) },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
        overflow: 'hidden',
    },

    // Top row
    cardTop: { flexDirection: 'row', alignItems: 'center', padding: ms(14), gap: ms(10) },
    visitBadge: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center',
    },
    visitBadgeNum: { fontFamily: interMedium, fontSize: ms(15) },
    visitBadgeLbl: { fontFamily: interRegular, fontSize: ms(8), marginTop: vs(1) },
    dateBlock: { flex: 1 },
    dateText: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    noteText: { fontFamily: interRegular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
        borderRadius: ms(20),
    },
    statusDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    statusLabel: { fontFamily: interMedium, fontSize: ms(10.5) },

    divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: ms(14) },

    // Bottom section
    cardBottom: { paddingHorizontal: ms(14), paddingBottom: ms(14) },
    machineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(12), paddingTop: ms(12) },
    valueInline: { flex: 1, alignItems: 'center' },
    machineInline: { flex: 1.4 },
    rirBlock: { flex: 1, alignItems: 'flex-end' },
    rirBaseline: { fontFamily: interRegular, fontSize: ms(9.5), marginTop: vs(2) },
    innerDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: ms(10) },
    statsRow: { flexDirection: 'row' },

    valueBlock: { flex: 1 },
    machineBlock: { flex: 1.6 },
    deltaBlock: { flex: 0.9, alignItems: 'flex-end' },

    valueLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4), textTransform: 'uppercase', letterSpacing: 0.4 },
    valueNum: { fontFamily: interMedium, fontSize: ms(17) },
    valueUnit: { fontFamily: interRegular, fontSize: ms(12), color: '#9CA3AF' },

    machinePill: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(10), paddingVertical: vs(5),
        borderRadius: ms(10), alignSelf: 'flex-start',
    },
    machineText: { fontFamily: interMedium, fontSize: ms(11.5) },

    deltaRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    deltaVal: { fontFamily: interMedium, fontSize: ms(16) },
    deltaNA: { fontFamily: interRegular, fontSize: ms(13), color: '#9CA3AF' },
    statBlock: { flex: 1, alignItems: 'center' },
    statBorder: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
    statLabel: { fontFamily: interRegular, fontSize: ms(10), color: '#9CA3AF', marginBottom: vs(4), textTransform: 'uppercase', letterSpacing: 0.4 },
    statVal: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
});
