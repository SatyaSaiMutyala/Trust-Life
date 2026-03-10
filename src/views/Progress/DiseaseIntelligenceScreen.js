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
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const { width } = Dimensions.get('window');

const ORGAN_IMAGES = {
    Heart: require('../../assets/img/human-heart.png'),
    Kidneys: require('../../assets/img/human-kidneys.png'),
    Eyes: require('../../assets/img/human-eye.png'),
    Liver: require('../../assets/img/human-liver.png'),
    Pancreas: require('../../assets/img/human-pancreas.png'),
    Brain: require('../../assets/img/human-brain.png'),
};

// ── ORGAN DATA ──────────────────────────────────────────────────────────────
const ORGANS = {
    heart: {
        id: 'heart', name: 'Heart', cx: 96, cy: 125, r: 14,
        deterioration: 41, stage: 'Early Stress', stageNum: 1, maxStage: 4,
        stageNames: ['Normal', 'Early Stress', 'Functional Impairment', 'Organ Damage', 'Failure'],
        color: '#EF4444',
        biomarkerValues: [
            { name: 'LDL Cholesterol', value: '142 mg/dL', target: '<100', impact: 'Accelerating plaque in coronary arteries', severity: 'high' },
            { name: 'CRP', value: '3.2 mg/L', target: '<1.0', impact: 'Systemic inflammation stressing myocardium', severity: 'high' },
            { name: 'Blood Pressure', value: '138/88 mmHg', target: '<130/80', impact: 'Increased afterload — ventricular hypertrophy risk', severity: 'medium' },
            { name: 'Triglycerides', value: '198 mg/dL', target: '<150', impact: 'Lipid infiltration of arterial walls', severity: 'medium' },
        ],
        diseaseImpact: 'Chronic hyperglycemia causes endothelial glycation, accelerating atherosclerosis. Insulin resistance drives dyslipidemia and hypertension — a triple threat to coronary arteries.',
        patientExplain: 'High blood sugar damages the lining of blood vessels over time, making your heart work harder and arteries stiffer. Your cholesterol and inflammation levels are adding extra stress.',
        projectedStage: 'Functional Impairment', projectedTime: '18-24 months',
        interventions: ['Statin therapy review', 'ACE inhibitor consideration', 'Cardiac monitoring annually', 'Dietary fat reduction'],
        trend: 'worsening',
    },
    kidneys: {
        id: 'kidneys', name: 'Kidneys', cx: 100, cy: 175, r: 13,
        deterioration: 38, stage: 'Stage 2 CKD', stageNum: 2, maxStage: 5,
        stageNames: ['Normal', 'Mild Reduction', 'Stage 2 CKD', 'Stage 3 CKD', 'Stage 4 CKD', 'Kidney Failure'],
        color: '#3B82F6',
        biomarkerValues: [
            { name: 'eGFR', value: '68 mL/min', target: '>90', impact: 'Glomerular filtration declining — early nephropathy', severity: 'high' },
            { name: 'Creatinine', value: '1.4 mg/dL', target: '<1.2', impact: 'Waste clearance reducing, nephron stress rising', severity: 'medium' },
            { name: 'ACR', value: 'Not tested', target: '<30 mg/g', impact: 'Albumin ratio overdue — microalbuminuria possible', severity: 'medium' },
            { name: 'BUN', value: '22 mg/dL', target: '7-20', impact: 'Mild nitrogen retention indicating filtration decline', severity: 'low' },
        ],
        diseaseImpact: 'Diabetic nephropathy is the leading cause of CKD globally. Hyperglycemia causes glomerular hyperfiltration followed by progressive fibrosis.',
        patientExplain: 'Your kidneys act as filters for your blood. High blood sugar over time damages these tiny filters. Your kidney score (eGFR 68) is below the healthy range and slowly declining.',
        projectedStage: 'Stage 3 CKD', projectedTime: '12-18 months',
        interventions: ['Nephrology referral urgent', 'ACR urine test overdue', 'SGLT2 inhibitor review', 'Protein intake monitoring'],
        trend: 'worsening',
    },
    eyes: {
        id: 'eyes', name: 'Eyes', cx: 100, cy: 58, r: 10,
        deterioration: 28, stage: 'Early Changes', stageNum: 1, maxStage: 4,
        stageNames: ['Normal', 'Early Changes', 'Non-proliferative', 'Proliferative', 'Severe Loss'],
        color: '#8B5CF6',
        biomarkerValues: [
            { name: 'HbA1c', value: '7.8%', target: '<7%', impact: 'Sustained hyperglycemia damaging retinal microvasculature', severity: 'high' },
            { name: 'Blood Pressure', value: '138/88 mmHg', target: '<130/80', impact: 'Hypertensive retinopathy compounding diabetic risk', severity: 'medium' },
        ],
        diseaseImpact: 'Diabetic retinopathy develops from chronic hyperglycemia causing microaneurysms and capillary leakage in the retina.',
        patientExplain: 'The blood vessels in your eyes are very delicate. High blood sugar can damage them and eventually affect your vision.',
        projectedStage: 'Non-proliferative', projectedTime: '12-36 months',
        interventions: ['Dilated eye exam urgent', 'HbA1c reduction target', 'BP control <130/80', 'Annual retinal photography'],
        trend: 'stable-risk',
    },
    nerves: {
        id: 'nerves', name: 'Nerves', cx: 100, cy: 280, r: 11,
        deterioration: 32, stage: 'Early Neuropathy', stageNum: 1, maxStage: 4,
        stageNames: ['Normal', 'Early Neuropathy', 'Mild Neuropathy', 'Moderate', 'Severe'],
        color: '#F59E0B',
        biomarkerValues: [
            { name: 'HbA1c', value: '7.8%', target: '<7%', impact: 'Glycation of myelin sheaths degrading nerve conduction', severity: 'high' },
            { name: 'Vitamin B12', value: 'Not tested', target: '>300 pg/mL', impact: 'Metformin use can deplete B12, worsening neuropathy', severity: 'medium' },
            { name: 'Fasting Glucose', value: '172 mg/dL', target: '<100', impact: 'Oxidative stress directly injuring peripheral axons', severity: 'high' },
        ],
        diseaseImpact: 'Diabetic peripheral neuropathy results from metabolic and vascular injury to nerve fibers. Patient-reported foot tingling confirms early sensory neuropathy.',
        patientExplain: 'Your nerves — especially in your feet — are being affected by high blood sugar. This is why you feel tingling.',
        projectedStage: 'Mild Neuropathy', projectedTime: '6-12 months',
        interventions: ['Monofilament foot exam', 'B12 level check', 'Foot inspection protocol', 'Pain management review'],
        trend: 'worsening',
    },
    liver: {
        id: 'liver', name: 'Liver', cx: 122, cy: 148, r: 12,
        deterioration: 29, stage: 'Steatosis', stageNum: 1, maxStage: 4,
        stageNames: ['Normal', 'Steatosis', 'NASH', 'Fibrosis', 'Cirrhosis'],
        color: '#06B6D4',
        biomarkerValues: [
            { name: 'ALT', value: '52 U/L', target: '<40', impact: 'Elevated liver enzymes indicate hepatocellular stress', severity: 'medium' },
            { name: 'AST', value: '44 U/L', target: '<40', impact: 'AST/ALT ratio suggests early NAFLD pattern', severity: 'medium' },
        ],
        diseaseImpact: 'Non-alcoholic fatty liver disease (NAFLD) is a core component of the metabolic cluster. Insulin resistance promotes hepatic lipogenesis.',
        patientExplain: 'Your liver is showing early signs of fat accumulation — this is common when blood sugar is poorly controlled. It\'s reversible with lifestyle changes.',
        projectedStage: 'NASH', projectedTime: '24-36 months',
        interventions: ['Hepatology screen', 'Fibroscan/ultrasound', 'GGT + ferritin order', 'Alcohol abstinence counseling'],
        trend: 'stable-risk',
    },
    pancreas: {
        id: 'pancreas', name: 'Pancreas', cx: 78, cy: 155, r: 11,
        deterioration: 55, stage: 'Moderate Dysfunction', stageNum: 2, maxStage: 4,
        stageNames: ['Normal', 'Reduced Reserve', 'Moderate Dysfunction', 'Severe Depletion', 'Failure'],
        color: '#F97316',
        biomarkerValues: [
            { name: 'HbA1c', value: '7.8%', target: '<7%', impact: 'Persistent hyperglycemia accelerates beta-cell exhaustion', severity: 'high' },
            { name: 'C-Peptide', value: '0.8 ng/mL', target: '1.1-4.4', impact: 'Low C-peptide confirms declining insulin secretory capacity', severity: 'high' },
            { name: 'Fasting Glucose', value: '172 mg/dL', target: '<100', impact: 'Glucotoxicity directly injures remaining beta cells', severity: 'high' },
        ],
        diseaseImpact: 'The pancreatic beta cells show moderate depletion in secretory capacity, evidenced by low C-peptide. Glucotoxicity creates a vicious cycle.',
        patientExplain: 'Your pancreas makes insulin. Years of high blood sugar have worn down the insulin-producing cells. This is the root cause of your diabetes.',
        projectedStage: 'Severe Depletion', projectedTime: '3-5 years',
        interventions: ['C-peptide monitoring', 'Insulin therapy evaluation', 'GLP-1 agonist consideration', 'Beta cell preservation protocol'],
        trend: 'worsening',
    },
};

const BIOMARKER_DATA = [
    { name: 'HbA1c', value: '7.8%', target: '<7%', unit: '', status: 'high', trend: '\u2191', organs: ['pancreas', 'eyes', 'nerves', 'heart'], delta: '+0.4% in 3mo' },
    { name: 'LDL Cholesterol', value: '142', target: '<100', unit: 'mg/dL', status: 'high', trend: '\u2191', organs: ['heart', 'liver'], delta: '+18 mg/dL in 6mo' },
    { name: 'eGFR', value: '68', target: '>90', unit: 'mL/min', status: 'low', trend: '\u2193', organs: ['kidneys'], delta: '-6 in 4mo' },
    { name: 'CRP', value: '3.2', target: '<1.0', unit: 'mg/L', status: 'high', trend: '\u2192', organs: ['heart', 'kidneys', 'liver'], delta: 'Persistent elevation' },
    { name: 'Blood Pressure', value: '138/88', target: '<130/80', unit: 'mmHg', status: 'borderline', trend: '\u2191', organs: ['heart', 'kidneys', 'eyes'], delta: '+8 mmHg systolic' },
    { name: 'ALT', value: '52', target: '<40', unit: 'U/L', status: 'high', trend: '\u2191', organs: ['liver'], delta: '+12 U/L in 3mo' },
    { name: 'C-Peptide', value: '0.8', target: '1.1-4.4', unit: 'ng/mL', status: 'low', trend: '\u2193', organs: ['pancreas'], delta: 'Secretory decline' },
    { name: 'Fasting Glucose', value: '172', target: '<100', unit: 'mg/dL', status: 'high', trend: '\u2191', organs: ['pancreas', 'nerves', 'eyes'], delta: 'Avg 168 last 30d' },
    { name: 'Triglycerides', value: '198', target: '<150', unit: 'mg/dL', status: 'high', trend: '\u2191', organs: ['heart', 'liver'], delta: '+32 in 6mo' },
    { name: 'Creatinine', value: '1.4', target: '<1.2', unit: 'mg/dL', status: 'high', trend: '\u2191', organs: ['kidneys'], delta: '+0.2 in 4mo' },
];

const CLUSTER_DATA = {
    riskScore: 82,
    diseases: [
        { name: 'Type 2 Diabetes', progress: 88, type: 'active' },
        { name: 'Hypertension', progress: 61, type: 'emerging' },
        { name: 'CKD Stage 2', progress: 44, type: 'emerging' },
        { name: 'NAFLD', progress: 38, type: 'emerging' },
        { name: 'Cardiovascular Disease', progress: 24, type: 'risk' },
    ],
};

const RECOMMENDATIONS = [
    { priority: 'urgent', title: 'Nephrologist Referral', desc: 'eGFR declining — early CKD intervention critical', action: 'Schedule within 2 weeks', organ: 'kidneys' },
    { priority: 'urgent', title: 'Dilated Eye Exam', desc: 'Blurred vision + HbA1c 7.8% — retinopathy screening overdue', action: 'Ophthalmology referral', organ: 'eyes' },
    { priority: 'high', title: 'Medication Review', desc: 'HbA1c not at target — consider GLP-1 agonist or insulin', action: 'Review & adjust regimen', organ: 'pancreas' },
    { priority: 'high', title: 'B12 Level + Foot Exam', desc: 'Metformin use + foot tingling = neuropathy protocol', action: 'Order labs + monofilament', organ: 'nerves' },
    { priority: 'high', title: 'Statin Therapy', desc: 'LDL 142 with cardiac cluster risk', action: 'Initiate moderate-intensity statin', organ: 'heart' },
    { priority: 'medium', title: 'Liver Imaging', desc: 'Elevated ALT/AST + metabolic profile', action: 'Order abdominal ultrasound', organ: 'liver' },
];

const TIMELINE = {
    patient: [
        { time: 'Now', event: 'Diabetes active. Kidneys, nerves, liver showing early signs.', color: '#EF4444' },
        { time: '6 mo', event: 'Blood pressure likely needs treatment.', color: '#F97316' },
        { time: '12 mo', event: 'Kidney specialist care may be required.', color: '#F97316' },
        { time: '18-24 mo', event: 'Heart health at serious risk.', color: '#8B5CF6' },
        { time: 'With action', event: 'All of this is preventable or reversible now.', color: primaryColor },
    ],
    doctor: [
        { time: 'Now', event: 'T2DM active. Nephropathy Stage 2, early neuropathy, hepatic steatosis.', color: '#EF4444' },
        { time: '6 mo', event: 'HTN crosses pharmacological threshold. Ophthalmology referral critical.', color: '#F97316' },
        { time: '12 mo', event: 'CKD Stage 3 likely. eGFR <60. ACE-i + SGLT2i essential.', color: '#F97316' },
        { time: '18-24 mo', event: 'CV event risk >30%. LVH, CAD in window.', color: '#8B5CF6' },
        { time: 'With action', event: 'Cluster cascade preventable. Early polypharmacy + lifestyle: ROI high.', color: primaryColor },
    ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getDetColor = (pct) => {
    if (pct < 25) return '#16A34A';
    if (pct < 45) return '#F59E0B';
    if (pct < 65) return '#EF4444';
    return '#DC2626';
};

const getPriorityStyle = (p) => {
    if (p === 'urgent') return { bg: '#FEE2E2', color: '#DC2626', icon: 'alert-circle' };
    if (p === 'high') return { bg: '#FEF3C7', color: '#D97706', icon: 'warning' };
    return { bg: '#DBEAFE', color: '#2563EB', icon: 'information-circle' };
};

const organsArr = Object.values(ORGANS);
const avgDet = Math.round(organsArr.reduce((a, o) => a + o.deterioration, 0) / organsArr.length);

// ── Circular Organ Map ──────────────────────────────────────────────────────
const CIRCLE_SIZE = width - ms(80);
const CIRCLE_CENTER = CIRCLE_SIZE / 2;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - ms(42);
const NODE_SIZE = ms(56);
const IMG_SIZE = ms(28);
const ARC_R = NODE_SIZE / 2 + ms(4);

const OrganCircleMap = ({ selectedOrgan, onOrganPress }) => {
    return (
        <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, alignSelf: 'center', marginBottom: vs(10) }}>
            {/* SVG layer for stress arcs */}
            <Svg style={{ position: 'absolute', width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                {/* Dashed orbit */}
                <SvgCircle cx={CIRCLE_CENTER} cy={CIRCLE_CENTER} r={CIRCLE_RADIUS}
                    fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.1"
                    strokeDasharray="4 4" />
                {/* Stress arcs */}
                {organsArr.map((o, i) => {
                    const angle = (i * (360 / organsArr.length) - 90) * (Math.PI / 180);
                    const nx = CIRCLE_CENTER + Math.cos(angle) * CIRCLE_RADIUS;
                    const ny = CIRCLE_CENTER + Math.sin(angle) * CIRCLE_RADIUS;
                    const col = getDetColor(o.deterioration);
                    const on = selectedOrgan === o.id;
                    return (
                        <SvgCircle key={o.id + '-arc'} cx={nx} cy={ny} r={ARC_R}
                            fill="none" stroke={col} strokeWidth={on ? 3 : 2} strokeOpacity={on ? 0.7 : 0.3}
                            strokeDasharray={`${(o.deterioration / 100) * (2 * Math.PI * ARC_R)} ${2 * Math.PI * ARC_R}`}
                            strokeLinecap="round" rotation={-90} origin={`${nx}, ${ny}`} />
                    );
                })}
            </Svg>

            {/* Center hub */}
            <View style={[cmStyles.centerHub, { left: CIRCLE_CENTER - ms(32), top: CIRCLE_CENTER - ms(32) }]}>
                <Icon type={Icons.Ionicons} name="fitness" size={ms(20)} color={primaryColor} />
                <Text style={cmStyles.centerScore}>{avgDet}%</Text>
                <Text style={cmStyles.centerLabel}>Avg Stress</Text>
            </View>

            {/* Organ nodes */}
            {organsArr.map((o, i) => {
                const angle = (i * (360 / organsArr.length) - 90) * (Math.PI / 180);
                const nx = CIRCLE_CENTER + Math.cos(angle) * CIRCLE_RADIUS - NODE_SIZE / 2;
                const ny = CIRCLE_CENTER + Math.sin(angle) * CIRCLE_RADIUS - NODE_SIZE / 2;
                const col = getDetColor(o.deterioration);
                const on = selectedOrgan === o.id;
                return (
                    <TouchableOpacity key={o.id} activeOpacity={0.7}
                        onPress={() => onOrganPress(o.id)}
                        style={[cmStyles.node, {
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
                        <Text style={[cmStyles.nodeName, { color: on ? col : blackColor }]}>{o.name}</Text>
                        <Text style={[cmStyles.nodeScore, { color: col }]}>{o.deterioration}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const cmStyles = StyleSheet.create({
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

// ── Organ Detail Panel ──────────────────────────────────────────────────────
const OrganDetailPanel = ({ organId, view }) => {
    const organ = ORGANS[organId];
    if (!organ) return (
        <View style={s.emptyPanel}>
            <Icon type={Icons.Ionicons} name="hand-left" size={ms(30)} color="#9CA3AF" />
            <Text style={s.emptyText}>Tap an organ on the body map</Text>
        </View>
    );

    const col = getDetColor(organ.deterioration);

    return (
        <View>
            {/* Header */}
            <View style={s.opHeader}>
                <View style={[s.opIconWrap, { backgroundColor: col + '15', borderColor: col }]}>
                    {ORGAN_IMAGES[organ.name] ? (
                        <Image source={ORGAN_IMAGES[organ.name]} style={s.opIconImg} resizeMode="contain" />
                    ) : (
                        <Icon type={Icons.Ionicons} name="body" size={ms(20)} color={col} />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={s.opName}>{organ.name}</Text>
                    <Text style={[s.opStage, { color: col }]}>{organ.stage}</Text>
                </View>
                <View style={s.opScoreWrap}>
                    <Text style={[s.opScoreNum, { color: col }]}>{organ.deterioration}</Text>
                    <Text style={s.opScoreLabel}>stress</Text>
                </View>
            </View>

            {/* Stage bar */}
            <View style={s.opStageSection}>
                <Text style={s.opStageSectionTitle}>Deterioration Stage</Text>
                <View style={s.stageBarRow}>
                    {organ.stageNames.map((st, i) => {
                        const active = i <= organ.stageNum;
                        const current = i === organ.stageNum;
                        return (
                            <View key={i} style={{ flex: 1 }}>
                                <View style={[s.stageSegment, { backgroundColor: active ? col : '#E5E7EB' }]} />
                                {current && <Text style={[s.stageCurrentText, { color: col }]}>{st}</Text>}
                            </View>
                        );
                    })}
                </View>
                <View style={s.stageFooterRow}>
                    <Text style={s.stageNormal}>Normal</Text>
                    <Text style={[s.stageProjected, { color: col }]}>
                        Projected: {organ.projectedStage} in {organ.projectedTime}
                    </Text>
                </View>
            </View>

            {/* Disease impact */}
            <View style={[s.opImpactCard, { backgroundColor: col + '08', borderColor: col + '25' }]}>
                <Text style={[s.opImpactTitle, { color: col }]}>
                    {view === 'patient' ? "What's happening" : 'Disease Impact'}
                </Text>
                <Text style={s.opImpactText}>
                    {view === 'patient' ? organ.patientExplain : organ.diseaseImpact}
                </Text>
            </View>

            {/* Biomarker impacts */}
            <Text style={s.opStageSectionTitle}>Biomarkers Affecting This Organ</Text>
            {organ.biomarkerValues.map((bm, i) => {
                const sevCol = bm.severity === 'high' ? '#EF4444' : bm.severity === 'medium' ? '#F59E0B' : '#16A34A';
                return (
                    <View key={i} style={[s.bmImpactRow, { borderLeftColor: sevCol }]}>
                        <View style={s.bmImpactTop}>
                            <Text style={s.bmImpactName}>{bm.name}</Text>
                            <Text style={[s.bmImpactValue, { color: sevCol }]}>{bm.value}</Text>
                        </View>
                        <Text style={s.bmImpactDesc}>{bm.impact}</Text>
                    </View>
                );
            })}

            {/* Interventions */}
            <Text style={[s.opStageSectionTitle, { marginTop: vs(14) }]}>Required Actions</Text>
            {organ.interventions.map((iv, i) => (
                <View key={i} style={s.interventionRow}>
                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(12)} color={primaryColor} />
                    <Text style={s.interventionText}>{iv}</Text>
                </View>
            ))}
        </View>
    );
};

// ── Main Screen ─────────────────────────────────────────────────────────────
const DiseaseIntelligenceScreen = () => {
    const navigation = useNavigation();
    const [view, setView] = useState('patient');
    const [activeTab, setActiveTab] = useState('organs');
    const [selectedOrgan, setSelectedOrgan] = useState('kidneys');
    const [filterOrgan, setFilterOrgan] = useState(null);

    const TABS = [
        { key: 'organs', label: 'Organ Analysis', icon: 'body' },
        { key: 'biomarkers', label: 'Biomarkers', icon: 'analytics' },
        { key: 'cluster', label: 'Cluster', icon: 'git-network' },
        { key: 'actions', label: 'Actions', icon: 'checkmark-circle' },
    ];

    return (
        <SafeAreaView style={s.container}>
            <StatusBar2 />
            <LinearGradient colors={globalGradient2} start={{ x: 0, y: 0 }} end={{ x: 0, y: 3 }} locations={[0, 0.08]} style={s.gradient}>

                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: ms(12) }}>
                        <Text style={s.headerTitle}>Disease Intelligence</Text>
                        <Text style={s.headerSub}>Multi-organ impact analysis</Text>
                    </View>
                    {/* Doctor / Patient toggle */}
                    <View style={s.toggleWrap}>
                        {['patient', 'doctor'].map(v => (
                            <TouchableOpacity key={v} onPress={() => setView(v)}
                                style={[s.toggleBtn, view === v && s.toggleBtnActive]}
                            >
                                <Icon type={Icons.Ionicons} name={v === 'patient' ? 'person' : 'medkit'}
                                    size={ms(12)} color={view === v ? whiteColor : 'rgba(255,255,255,0.5)'} />
                                <Text style={[s.toggleText, view === v && s.toggleTextActive]}>
                                    {v === 'patient' ? 'Patient' : 'Doctor'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Stats bar */}
                <View style={s.statsBar}>
                    {[
                        { label: view === 'patient' ? 'Health Score' : 'Stress Index', value: `${avgDet}%`, color: '#F97316' },
                        { label: 'Organs', value: '6', color: '#EF4444' },
                        { label: 'Critical', value: '4', color: '#DC2626' },
                    ].map(st => (
                        <View key={st.label} style={s.statItem}>
                            <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
                            <Text style={s.statLabel}>{st.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabRow}>
                    {TABS.map(tab => (
                        <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)}
                            style={[s.tab, activeTab === tab.key && s.tabActive]}
                        >
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(12)}
                                color={activeTab === tab.key ? primaryColor : '#9CA3AF'} />
                            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={s.content}>

                    {/* ── ORGANS TAB ── */}
                    {activeTab === 'organs' && (
                        <>
                            {/* Body silhouette */}
                            <View style={s.card}>
                                <Text style={s.cardTitle}>
                                    {view === 'patient' ? 'Your Body Map' : 'Organ Impact Map'}
                                </Text>
                                <OrganCircleMap selectedOrgan={selectedOrgan} onOrganPress={setSelectedOrgan} />
                                {/* Legend */}
                                <View style={s.legendRow}>
                                    {[['#16A34A', '<25'], ['#F59E0B', '25-45'], ['#EF4444', '45-65'], ['#DC2626', '65+']].map(([c, l]) => (
                                        <View key={l} style={s.legendItem}>
                                            <View style={[s.legendDot, { backgroundColor: c }]} />
                                            <Text style={s.legendText}>{l}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Organ cards grid */}
                            <View style={s.organGrid}>
                                {organsArr.map(o => {
                                    const col = getDetColor(o.deterioration);
                                    const isActive = selectedOrgan === o.id;
                                    return (
                                        <TouchableOpacity key={o.id} activeOpacity={0.7}
                                            onPress={() => setSelectedOrgan(o.id)}
                                            style={[s.organMiniCard, isActive && { borderColor: col, backgroundColor: col + '08' }]}
                                        >
                                            <View style={s.organMiniTop}>
                                                <View style={[s.organMiniIcon, { backgroundColor: col + '12' }]}>
                                                    {ORGAN_IMAGES[o.name] ? (
                                                        <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(18), height: ms(18) }} resizeMode="contain" />
                                                    ) : (
                                                        <Icon type={Icons.Ionicons} name="body" size={ms(14)} color={col} />
                                                    )}
                                                </View>
                                                <View>
                                                    <Text style={[s.organMiniScore, { color: col }]}>{o.deterioration}</Text>
                                                    <Text style={s.organMiniStressLabel}>stress</Text>
                                                </View>
                                            </View>
                                            <Text style={s.organMiniName}>{o.name}</Text>
                                            <Text style={[s.organMiniStage, { color: col }]}>{o.stage}</Text>
                                            <View style={s.organMiniBar}>
                                                <View style={[s.organMiniFill, { width: `${o.deterioration}%`, backgroundColor: col }]} />
                                            </View>
                                            <Text style={[s.organMiniTrend, { color: o.trend === 'worsening' ? '#F97316' : primaryColor }]}>
                                                {o.trend === 'worsening' ? '\u2191 Worsening' : '\u2192 Stable Risk'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Detail panel */}
                            <View style={s.card}>
                                <OrganDetailPanel organId={selectedOrgan} view={view} />
                            </View>
                        </>
                    )}

                    {/* ── BIOMARKERS TAB ── */}
                    {activeTab === 'biomarkers' && (
                        <>
                            <View style={[s.card, { backgroundColor: primaryColor + '08', borderWidth: 1, borderColor: primaryColor + '20' }]}>
                                <Text style={s.bmHintText}>
                                    {view === 'patient'
                                        ? 'Each test result below is linked to the organs it affects. Tap the colored tags to see how each number impacts your body.'
                                        : 'Biomarkers are cross-referenced against organ systems. Tap organ tags to navigate to organ-level analysis.'}
                                </Text>
                            </View>
                            {/* Organ filter chips */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: vs(12) }}
                                contentContainerStyle={{ paddingHorizontal: ms(20), gap: ms(8) }}>
                                {organsArr.map(o => (
                                    <TouchableOpacity key={o.id}
                                        onPress={() => setFilterOrgan(filterOrgan === o.id ? null : o.id)}
                                        style={[s.filterChip, filterOrgan === o.id && { backgroundColor: o.color + '20', borderColor: o.color }]}
                                    >
                                        {ORGAN_IMAGES[o.name] && <Image source={ORGAN_IMAGES[o.name]} style={{ width: ms(14), height: ms(14) }} resizeMode="contain" />}
                                        <Text style={[s.filterChipText, { color: o.color }]}>{o.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {BIOMARKER_DATA
                                .filter(bm => !filterOrgan || bm.organs.includes(filterOrgan))
                                .map((bm, i) => {
                                    const statusCol = bm.status === 'high' || bm.status === 'low' ? '#EF4444' : bm.status === 'borderline' ? '#F59E0B' : '#16A34A';
                                    return (
                                        <View key={i} style={s.bmRow}>
                                            <View style={s.bmRowTop}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={s.bmRowName}>{bm.name}</Text>
                                                    <Text style={s.bmRowTarget}>Target: {bm.target} {bm.unit} · {bm.delta}</Text>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <Text style={[s.bmRowValue, { color: statusCol }]}>
                                                        {bm.value} <Text style={s.bmRowUnit}>{bm.unit}</Text>
                                                    </Text>
                                                    <Text style={[s.bmRowStatus, { color: statusCol }]}>{bm.trend} {bm.status}</Text>
                                                </View>
                                            </View>
                                            <View style={s.bmOrganTags}>
                                                {bm.organs.map(oid => {
                                                    const org = ORGANS[oid];
                                                    return (
                                                        <TouchableOpacity key={oid}
                                                            onPress={() => { setSelectedOrgan(oid); setActiveTab('organs'); }}
                                                            style={[s.bmOrganTag, { backgroundColor: org.color + '12', borderColor: org.color + '40' }]}
                                                        >
                                                            <Text style={[s.bmOrganTagText, { color: org.color }]}>{org.name}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                })}
                        </>
                    )}

                    {/* ── CLUSTER TAB ── */}
                    {activeTab === 'cluster' && (
                        <>
                            {/* Risk card */}
                            <View style={[s.card, { borderWidth: 1, borderColor: '#F9731630' }]}>
                                <View style={s.clusterHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.clusterTitle}>
                                            {view === 'patient' ? 'Your Conditions Are Connected' : 'Cluster Alert: Metabolic-Cardiovascular'}
                                        </Text>
                                        <Text style={s.clusterSub}>
                                            {view === 'patient'
                                                ? 'Your diabetes shares root causes with other developing conditions'
                                                : 'Cascade risk: 78% in 24mo without intervention'}
                                        </Text>
                                    </View>
                                    <View style={s.clusterScoreWrap}>
                                        <Text style={s.clusterScoreNum}>{CLUSTER_DATA.riskScore}</Text>
                                        <Text style={s.clusterScoreLabel}>Risk</Text>
                                    </View>
                                </View>
                                {CLUSTER_DATA.diseases.map((d, i) => {
                                    const typeCol = d.type === 'active' ? '#EF4444' : d.type === 'emerging' ? '#F97316' : '#3B82F6';
                                    return (
                                        <View key={i} style={s.clusterDisease}>
                                            <View style={s.clusterDiseaseTop}>
                                                <Text style={[s.clusterDiseaseName, d.type === 'active' && { fontFamily: bold }]}>{d.name}</Text>
                                                <Text style={[s.clusterDiseaseType, { color: typeCol }]}>
                                                    {d.type === 'active' ? 'Active' : d.type === 'emerging' ? 'Emerging' : 'Watch Zone'}
                                                </Text>
                                            </View>
                                            <View style={s.clusterBar}>
                                                <LinearGradient
                                                    colors={d.type === 'active' ? ['#EF4444', '#F97316'] : d.type === 'emerging' ? ['#F97316', '#FBBF24'] : ['#3B82F6', '#06B6D4']}
                                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                    style={[s.clusterBarFill, { width: `${d.progress}%` }]}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* View-specific insight */}
                                <View style={[s.clusterInsight, { backgroundColor: view === 'patient' ? primaryColor + '10' : '#8B5CF612', borderColor: view === 'patient' ? primaryColor + '30' : '#8B5CF630' }]}>
                                    <Text style={[s.clusterInsightTitle, { color: view === 'patient' ? primaryColor : '#8B5CF6' }]}>
                                        {view === 'patient' ? 'What You Can Do' : 'Clinical Rationale'}
                                    </Text>
                                    <Text style={s.clusterInsightText}>
                                        {view === 'patient'
                                            ? 'Each healthy change you make — better sleep, more movement, medication adherence — reduces risk across all of these conditions simultaneously.'
                                            : 'Shared pathophysiology: insulin resistance \u2192 endothelial dysfunction \u2192 systemic inflammation \u2192 multi-organ cascade. Polypharmacy review + lifestyle prescription essential.'}
                                    </Text>
                                </View>
                            </View>

                            {/* Timeline */}
                            <View style={s.card}>
                                <Text style={s.cardTitle}>
                                    {view === 'patient' ? 'What Could Happen Without Action' : 'Cascade Trajectory'}
                                </Text>
                                <View style={s.timelineWrap}>
                                    <View style={s.timelineLine} />
                                    {TIMELINE[view].map((pt, i) => (
                                        <View key={i} style={s.timelineItem}>
                                            <View style={[s.timelineDot, { backgroundColor: pt.color }]} />
                                            <Text style={[s.timelineTime, { color: pt.color }]}>{pt.time}</Text>
                                            <Text style={s.timelineEvent}>{pt.event}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* ── ACTIONS TAB ── */}
                    {activeTab === 'actions' && (
                        <>
                            <Text style={s.actionsTitle}>
                                {view === 'patient' ? 'Your Action Plan' : 'Clinical Recommendations — Priority Order'}
                            </Text>
                            {RECOMMENDATIONS.map((rec, i) => {
                                const ps = getPriorityStyle(rec.priority);
                                const org = ORGANS[rec.organ];
                                return (
                                    <TouchableOpacity key={i} activeOpacity={0.7}
                                        onPress={() => { setSelectedOrgan(rec.organ); setActiveTab('organs'); }}
                                        style={[s.actionCard, { borderLeftColor: ps.color }]}
                                    >
                                        <View style={s.actionTop}>
                                            <View style={[s.actionIconWrap, { backgroundColor: ps.bg }]}>
                                                <Icon type={Icons.Ionicons} name={ps.icon} size={ms(16)} color={ps.color} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={s.actionTitleRow}>
                                                    <Text style={s.actionTitle}>{rec.title}</Text>
                                                    <View style={[s.actionOrganChip, { backgroundColor: org.color + '12', borderColor: org.color + '30' }]}>
                                                        <Text style={[s.actionOrganText, { color: org.color }]}>{org.name}</Text>
                                                    </View>
                                                </View>
                                                <Text style={s.actionDesc}>{rec.desc}</Text>
                                                <View style={s.actionBtn}>
                                                    <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(10)} color={primaryColor} />
                                                    <Text style={s.actionBtnText}>{rec.action}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </>
                    )}

                    <View style={{ height: vs(30) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default DiseaseIntelligenceScreen;

// ── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradient: { flex: 1 },
    content: { paddingBottom: vs(40) },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(12),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontFamily: bold, fontSize: ms(17), color: whiteColor },
    headerSub: { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.7)', marginTop: vs(2) },
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

    // Stats bar
    statsBar: {
        flexDirection: 'row', justifyContent: 'space-around',
        paddingHorizontal: ms(20), paddingVertical: vs(10),
        marginHorizontal: ms(20), marginBottom: vs(8),
        backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(14),
    },
    statItem: { alignItems: 'center' },
    statValue: { fontFamily: bold, fontSize: ms(20) },
    statLabel: { fontFamily: regular, fontSize: ms(9), color: 'rgba(255,255,255,0.6)', marginTop: vs(2) },

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
    tabText: { fontFamily: bold, fontSize: ms(9.5), color: '#9CA3AF' },
    tabTextActive: { color: primaryColor },

    // Card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(20), padding: ms(16), marginBottom: vs(14),
    },
    cardTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(12) },

    // Legend
    legendRow: { flexDirection: 'row', justifyContent: 'center', gap: ms(16), marginTop: vs(6) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
    legendText: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },

    // Organ mini cards
    organGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: ms(20), gap: ms(10), marginBottom: vs(14),
    },
    organMiniCard: {
        width: (width - ms(60)) / 2, backgroundColor: whiteColor,
        borderRadius: ms(14), padding: ms(14),
        borderWidth: 1.5, borderColor: '#E5E7EB',
    },
    organMiniTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
    organMiniIcon: {
        width: ms(34), height: ms(34), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    organMiniScore: { fontFamily: bold, fontSize: ms(18), textAlign: 'right' },
    organMiniStressLabel: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF', textAlign: 'right' },
    organMiniName: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    organMiniStage: { fontFamily: regular, fontSize: ms(10), marginBottom: vs(8) },
    organMiniBar: { height: vs(4), backgroundColor: '#E5E7EB', borderRadius: ms(2), overflow: 'hidden' },
    organMiniFill: { height: '100%', borderRadius: ms(2) },
    organMiniTrend: { fontFamily: bold, fontSize: ms(9), marginTop: vs(6) },

    // Empty panel
    emptyPanel: { alignItems: 'center', justifyContent: 'center', paddingVertical: vs(40), gap: vs(10) },
    emptyText: { fontFamily: regular, fontSize: ms(13), color: '#9CA3AF' },

    // Organ detail panel
    opHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(16) },
    opIconWrap: {
        width: ms(48), height: ms(48), borderRadius: ms(14),
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: ms(12),
    },
    opIconImg: { width: ms(28), height: ms(28) },
    opName: { fontFamily: bold, fontSize: ms(16), color: blackColor },
    opStage: { fontFamily: bold, fontSize: ms(11), marginTop: vs(2) },
    opScoreWrap: { alignItems: 'center' },
    opScoreNum: { fontFamily: bold, fontSize: ms(22) },
    opScoreLabel: { fontFamily: regular, fontSize: ms(8), color: '#9CA3AF' },

    // Stage section
    opStageSection: { marginBottom: vs(16) },
    opStageSectionTitle: { fontFamily: bold, fontSize: ms(11), color: '#6B7280', marginBottom: vs(8) },
    stageBarRow: { flexDirection: 'row', gap: ms(3) },
    stageSegment: { height: vs(5), borderRadius: ms(3), flex: 1 },
    stageCurrentText: { fontFamily: bold, fontSize: ms(9), marginTop: vs(4) },
    stageFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8) },
    stageNormal: { fontFamily: regular, fontSize: ms(9), color: '#16A34A' },
    stageProjected: { fontFamily: regular, fontSize: ms(9) },

    // Impact card
    opImpactCard: {
        borderRadius: ms(12), borderWidth: 1, padding: ms(14), marginBottom: vs(16),
    },
    opImpactTitle: { fontFamily: bold, fontSize: ms(11), marginBottom: vs(6) },
    opImpactText: { fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(19) },

    // Biomarker impact rows
    bmImpactRow: {
        backgroundColor: '#F8FAFC', borderRadius: ms(10), padding: ms(12),
        marginBottom: vs(6), borderLeftWidth: ms(3),
    },
    bmImpactTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    bmImpactName: { fontFamily: bold, fontSize: ms(12), color: blackColor },
    bmImpactValue: { fontFamily: bold, fontSize: ms(12) },
    bmImpactDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(16) },

    // Intervention rows
    interventionRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: primaryColor + '08', borderRadius: ms(10),
        paddingHorizontal: ms(12), paddingVertical: vs(10), marginBottom: vs(5),
    },
    interventionText: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1 },

    // Biomarkers tab
    bmHintText: { fontFamily: regular, fontSize: ms(12), color: '#6B7280', lineHeight: ms(19) },
    filterChip: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(6),
        borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor,
    },
    filterChipText: { fontFamily: bold, fontSize: ms(10) },
    bmRow: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        marginHorizontal: ms(20), padding: ms(14), marginBottom: vs(8),
    },
    bmRowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(8) },
    bmRowName: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    bmRowTarget: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    bmRowValue: { fontFamily: bold, fontSize: ms(16) },
    bmRowUnit: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF' },
    bmRowStatus: { fontFamily: bold, fontSize: ms(11), marginTop: vs(2) },
    bmOrganTags: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) },
    bmOrganTag: {
        borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: vs(3),
        borderWidth: 1,
    },
    bmOrganTagText: { fontFamily: bold, fontSize: ms(9) },

    // Cluster tab
    clusterHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(16) },
    clusterTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(4) },
    clusterSub: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
    clusterScoreWrap: {
        backgroundColor: '#FEE2E2', borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(8), alignItems: 'center', marginLeft: ms(12),
    },
    clusterScoreNum: { fontFamily: bold, fontSize: ms(22), color: '#DC2626' },
    clusterScoreLabel: { fontFamily: regular, fontSize: ms(9), color: '#DC2626' },
    clusterDisease: { marginBottom: vs(10) },
    clusterDiseaseTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) },
    clusterDiseaseName: { fontFamily: regular, fontSize: ms(12), color: blackColor },
    clusterDiseaseType: { fontFamily: bold, fontSize: ms(10) },
    clusterBar: { height: vs(6), backgroundColor: '#E5E7EB', borderRadius: ms(3), overflow: 'hidden' },
    clusterBarFill: { height: '100%', borderRadius: ms(3) },
    clusterInsight: { borderRadius: ms(12), borderWidth: 1, padding: ms(14), marginTop: vs(12) },
    clusterInsightTitle: { fontFamily: bold, fontSize: ms(12), marginBottom: vs(6) },
    clusterInsightText: { fontFamily: regular, fontSize: ms(12), color: '#374151', lineHeight: ms(19) },

    // Timeline
    timelineWrap: { paddingLeft: ms(16) },
    timelineLine: { position: 'absolute', left: ms(22), top: 0, bottom: 0, width: 2, backgroundColor: '#E5E7EB' },
    timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(14), paddingLeft: ms(20) },
    timelineDot: {
        width: ms(12), height: ms(12), borderRadius: ms(6),
        position: 'absolute', left: ms(-4), top: vs(2),
    },
    timelineTime: { fontFamily: bold, fontSize: ms(11), width: ms(65), marginRight: ms(8) },
    timelineEvent: { fontFamily: regular, fontSize: ms(12), color: '#374151', flex: 1, lineHeight: ms(18) },

    // Actions tab
    actionsTitle: {
        fontFamily: bold, fontSize: ms(14), color: blackColor,
        paddingHorizontal: ms(20), marginBottom: vs(12),
    },
    actionCard: {
        flexDirection: 'row', backgroundColor: whiteColor,
        borderRadius: ms(14), marginHorizontal: ms(20),
        padding: ms(14), marginBottom: vs(10),
        borderLeftWidth: ms(3),
    },
    actionTop: { flexDirection: 'row', gap: ms(12), flex: 1 },
    actionIconWrap: {
        width: ms(36), height: ms(36), borderRadius: ms(10),
        justifyContent: 'center', alignItems: 'center',
    },
    actionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(4) },
    actionTitle: { fontFamily: bold, fontSize: ms(13), color: blackColor, flex: 1 },
    actionOrganChip: {
        borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: vs(2),
        borderWidth: 1, marginLeft: ms(6),
    },
    actionOrganText: { fontFamily: bold, fontSize: ms(9) },
    actionDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(17), marginBottom: vs(8) },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: primaryColor + '10', borderRadius: ms(8),
        paddingHorizontal: ms(10), paddingVertical: vs(5), alignSelf: 'flex-start',
    },
    actionBtnText: { fontFamily: bold, fontSize: ms(10), color: primaryColor },
});
