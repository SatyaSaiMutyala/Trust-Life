import React, { useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {
    View, Text, SafeAreaView, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { heading, interMedium, interRegular } from '../../config/Constants';
import { blackColor, globalGradient2, grayColor, primaryColor, whiteColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY   = '#1E293B';
const SLATE  = '#334155';
const MUTED  = '#64748B';
const BORDER = 'rgba(15,118,110,0.13)';

const DOC_COLORS = [
    { bg: '#EDE9FE', tx: '#7C3AED' },
    { bg: '#CCFBF1', tx: '#0D9488' },
    { bg: '#FEF3C7', tx: '#D97706' },
    { bg: '#FEF2F2', tx: '#DC2626' },
    { bg: '#EFF6FF', tx: '#1D4ED8' },
    { bg: '#F0FDF4', tx: '#16A34A' },
];

const VISIT_TYPE_STYLE = {
    'Follow-up':        { bg: '#CCFBF1', tx: '#0D9488' },
    'Consultation':     { bg: '#EDE9FE', tx: '#7C3AED' },
    'Sick Visit':       { bg: '#FEF2F2', tx: '#DC2626' },
    'Annual Checkup':   { bg: '#EFF6FF', tx: '#1D4ED8' },
    'Specialist Visit': { bg: '#FEF3C7', tx: '#D97706' },
};

// ── Static Data ───────────────────────────────────────────────────────────────
const PATIENT = {
    name: 'Arjun Sharma', initials: 'AS', age: 34, gender: 'Male',
    dob: 'Jul 12, 1990', blood: 'B+', id: 'TL-2024-00847',
    diagnoses: ['Type 2 Diabetes', 'Hypercholesterolemia', 'Vitamin D Deficiency'],
    activeMeds: 5, allergy: 'Penicillin Allergy',
    visits: 34, reports: 18, activeRx: 5,
};

const STATS = [
    { label: 'Last Visit',      value: 'Mar 09',  sub: 'Dr. Priya Nair' },
    { label: 'Next Appointment',value: 'Apr 3',   sub: 'Endocrinology' },
    { label: 'Abnormal Markers',value: '4',       sub: 'need attention', valueColor: '#DC2626', subColor: '#DC2626' },
    { label: 'Med Adherence',   value: '87%',     sub: 'last 30 days' },
];

const SCORE_ITEMS = [
    { name: 'Diabetes', pct: 82, color: primaryColor },
    { name: 'Cardiac',  pct: 61, color: '#D97706' },
    { name: 'Vitamins', pct: 38, color: '#DC2626' },
    { name: 'Kidney',   pct: 95, color: primaryColor },
    { name: 'Thyroid',  pct: 90, color: primaryColor },
];

const ACTIVE_MEDS = [
    { name: 'Metformin 500mg',      dose: 'TDS',      color: '#0D9488', daysLeft: 18, total: 90 },
    { name: 'Rosuvastatin 10mg',    dose: 'OD night', color: '#7C3AED', daysLeft: 62, total: 90 },
    { name: 'Pantoprazole 40mg',    dose: 'OD',       color: '#16A34A', daysLeft: 45, total: 90 },
    { name: 'Vitamin D3 60K IU',    dose: 'Weekly',   color: '#1D4ED8', daysLeft: 5,  total: 60 },
    { name: 'Vitamin B12 1500mcg',  dose: 'OD',       color: '#D97706', daysLeft: 34, total: 90 },
];

const UPCOMING = [
    { doc: 'Dr. Priya Nair',   sp: 'Endocrinology · Apollo', date: 'Apr 3',  color: primaryColor },
    { doc: 'Dr. Suresh Reddy', sp: 'Cardiology · Yashoda',   date: 'Apr 18', color: '#7C3AED' },
    { doc: 'Lipid Profile',    sp: 'Dr. Lal Pathlabs',       date: 'Apr 5',  color: '#D97706' },
];

const EVENTS = [
    {
        id: 1, doc: 'Dr. Priya Nair', sp: 'Endocrinologist', cl: 'Apollo Hospitals, Hyderabad',
        date: 'Mar 09, 2025', type: 'Follow-up', ci: 1,
        cc: 'Quarterly diabetes review – HbA1c follow-up',
        notes: 'Excellent progress this quarter. HbA1c improved from 6.8% to 5.9%. Fasting glucose still marginally elevated at 102 mg/dL. Advised strict carbohydrate restriction and 30 min daily walk. Vitamin D and B12 supplementation to continue. No changes to Metformin dosage.',
        vitals: [{ l: 'Blood Pressure', v: '118/76 mmHg' }, { l: 'Weight', v: '74.2 kg' }, { l: 'Temperature', v: '98.4°F' }, { l: 'SpO₂', v: '99%' }],
        dx: ['Type 2 Diabetes – Controlled', 'Vitamin D Deficiency'],
        labs: [{
            name: 'Complete Blood Count + HbA1c', lab: 'Apollo Diagnostics',
            markers: [
                { n: 'HbA1c',         v: '5.9',  u: '%',      lo: 0,    hi: 5.7,  st: 'high' },
                { n: 'Fasting Glucose',v: '102',  u: 'mg/dL',  lo: 70,   hi: 100,  st: 'high' },
                { n: 'Hemoglobin',     v: '13.2', u: 'g/dL',   lo: 13.5, hi: 17.5, st: 'low'  },
                { n: 'WBC Count',      v: '7.2',  u: 'K/μL',   lo: 4.5,  hi: 11,   st: 'normal' },
            ],
        }],
        meds: [
            { n: 'Metformin 500mg',     dose: '3× daily – continued',  color: '#0D9488', st: 'continued' },
            { n: 'Vitamin D3 60,000 IU',dose: 'Weekly – newly added',  color: '#1D4ED8', st: 'new' },
            { n: 'Vitamin B12 1500mcg', dose: 'Daily – newly added',   color: '#D97706', st: 'new' },
            { n: 'Pantoprazole 40mg',   dose: 'Daily – continued',     color: '#16A34A', st: 'continued' },
        ],
        fu: { doc: 'Dr. Priya Nair', date: 'June 2025', note: 'HbA1c + Urine Microalbumin review' },
    },
    {
        id: 2, doc: 'Dr. Suresh Reddy', sp: 'Cardiologist', cl: 'Yashoda Hospitals, Secunderabad',
        date: 'Feb 14, 2025', type: 'Consultation', ci: 3,
        cc: 'Elevated LDL cholesterol – lipid management consultation',
        notes: 'Patient referred after lipid profile showed LDL 138 mg/dL. ECG entirely normal. No symptoms of chest pain or dyspnoea. Dietary counselling given. Initiated Rosuvastatin 10mg at night. Repeat lipid profile in 6 weeks.',
        vitals: [{ l: 'Blood Pressure', v: '128/82 mmHg' }, { l: 'Weight', v: '74.5 kg' }, { l: 'Temperature', v: '98.2°F' }, { l: 'SpO₂', v: '98%' }],
        dx: ['Hypercholesterolemia', 'Borderline hypertension'],
        labs: [{
            name: 'Lipid Profile', lab: 'Dr. Lal Pathlabs',
            markers: [
                { n: 'Total Cholesterol', v: '198', u: 'mg/dL', lo: 0,  hi: 200, st: 'normal' },
                { n: 'LDL Cholesterol',   v: '138', u: 'mg/dL', lo: 0,  hi: 130, st: 'high'   },
                { n: 'HDL Cholesterol',   v: '52',  u: 'mg/dL', lo: 40, hi: 60,  st: 'normal' },
                { n: 'Triglycerides',     v: '142', u: 'mg/dL', lo: 0,  hi: 150, st: 'normal' },
            ],
        }],
        meds: [
            { n: 'Rosuvastatin 10mg', dose: 'Once nightly – newly prescribed', color: '#7C3AED', st: 'new' },
        ],
        fu: { doc: 'Dr. Suresh Reddy', date: 'Apr 18, 2025', note: 'Lipid profile review + Stress test decision' },
    },
    {
        id: 3, doc: 'Dr. Kavitha Iyer', sp: 'General Physician', cl: 'Care Clinic, Banjara Hills',
        date: 'Jan 07, 2025', type: 'Sick Visit', ci: 2,
        cc: 'Fever 102°F, sore throat, body ache for 3 days',
        notes: 'Throat congested. Mild tonsillar hypertrophy. Rapid strep test negative. Viral pharyngitis. Paracetamol SOS and ORS prescribed. No antibiotics – Penicillin allergy documented. Patient recovered within 5 days.',
        vitals: [{ l: 'Blood Pressure', v: '116/74 mmHg' }, { l: 'Weight', v: '74.8 kg' }, { l: 'Temperature', v: '102.1°F' }, { l: 'SpO₂', v: '97%' }],
        dx: ['Viral Pharyngitis', 'Mild fever'],
        labs: [],
        meds: [
            { n: 'Paracetamol 500mg', dose: 'SOS (as needed) – short course', color: '#64748B', st: 'discontinued' },
            { n: 'ORS sachets',       dose: '3× daily for hydration',         color: '#64748B', st: 'discontinued' },
        ],
        fu: { doc: 'Self-care', date: 'Only if not resolved in 7 days', note: 'Consult if fever persists or worsens' },
    },
    {
        id: 4, doc: 'Dr. Priya Nair', sp: 'Endocrinologist', cl: 'Apollo Hospitals, Hyderabad',
        date: 'Nov 12, 2024', type: 'Follow-up', ci: 1,
        cc: '6-month diabetes and thyroid review',
        notes: 'Blood sugar reasonably controlled but HbA1c crept up to 6.8%. Discussed dietary lapses during festive season. TSH normal at 2.4 mIU/L. Vitamin D checked for first time – severely deficient at 14 ng/mL. Supplementation initiated.',
        vitals: [{ l: 'Blood Pressure', v: '122/80 mmHg' }, { l: 'Weight', v: '75.1 kg' }, { l: 'Temperature', v: '98.3°F' }, { l: 'SpO₂', v: '99%' }],
        dx: ['Type 2 Diabetes – Borderline controlled', 'Vitamin D Deficiency – Severe', 'Thyroid – Normal'],
        labs: [{
            name: 'Thyroid Panel + HbA1c + Vitamin D', lab: 'SRL Diagnostics',
            markers: [
                { n: 'HbA1c',     v: '6.8', u: '%',     lo: 0,   hi: 5.7,  st: 'high'   },
                { n: 'TSH',       v: '2.4', u: 'mIU/L', lo: 0.5, hi: 5.0,  st: 'normal' },
                { n: 'Free T4',   v: '1.1', u: 'ng/dL', lo: 0.8, hi: 1.8,  st: 'normal' },
                { n: 'Vitamin D3',v: '14',  u: 'ng/mL', lo: 30,  hi: 100,  st: 'low'    },
            ],
        }],
        meds: [
            { n: 'Metformin 500mg',  dose: '3× daily – continued', color: '#0D9488', st: 'continued' },
            { n: 'Pantoprazole 40mg',dose: 'Daily – continued',     color: '#16A34A', st: 'continued' },
        ],
        fu: { doc: 'Dr. Priya Nair', date: 'March 2025', note: 'HbA1c + Vit D repeat + Lipid profile' },
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = name => name.replace('Dr. ', '').split(' ').slice(0, 2).map(p => p[0]).join('');

const markerColor = st =>
    st === 'normal' ? { fill: '#16A34A', bg: '#F0FDF4', label: 'Normal' }
    : st === 'high'  ? { fill: '#DC2626', bg: '#FEF2F2', label: 'High'   }
    :                  { fill: '#D97706', bg: '#FEF3C7', label: 'Low'    };

const markerPos = (v, lo, hi) => {
    const range = hi - lo;
    if (!range) return 50;
    const pct = ((parseFloat(v) - lo) / range) * 100;
    return Math.max(4, Math.min(94, pct));
};

const medStatusStyle = {
    new:          { bg: '#CCFBF1', tx: '#0D9488', label: 'New Rx' },
    continued:    { bg: '#F0FDF4', tx: '#16A34A', label: 'Continued' },
    discontinued: { bg: '#F1F5F9', tx: '#64748B', label: 'Stopped' },
};

const refillColor = (d, t) => {
    const pct = (d / t) * 100;
    return pct <= 15 ? '#DC2626' : pct <= 40 ? '#D97706' : '#16A34A';
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
    <View style={s.seclblRow}>
        <Text style={s.seclbl}>{text}</Text>
        <View style={s.seclblLine} />
    </View>
);

const BiomarkerRow = ({ item }) => {
    const mc = markerColor(item.st);
    const pos = markerPos(item.v, item.lo, item.hi);
    return (
        <View style={s.bmRow}>
            <Text style={s.bmName} numberOfLines={1}>{item.n}</Text>
            <Text style={[s.bmVal, { color: mc.fill }]}>{item.v} <Text style={s.bmUnit}>{item.u}</Text></Text>
            <View style={s.bmBar}>
                <View style={[s.bmFill, { width: `${Math.min(pos, 100)}%`, backgroundColor: mc.fill + '25' }]} />
                <View style={[s.bmDot, { left: `${pos}%`, backgroundColor: mc.fill }]} />
            </View>
            <Text style={s.bmRef}>{item.lo > 0 ? `${item.lo}–${item.hi}` : `<${item.hi}`}</Text>
            <View style={[s.bmPill, { backgroundColor: mc.bg }]}>
                <Text style={[s.bmPillTx, { color: mc.fill }]}>{mc.label}</Text>
            </View>
        </View>
    );
};

const downloadReport = async (fileName) => {
    try {
        const { dirs } = RNFetchBlob.fs;
        const dest = `${dirs.DownloadDir}/${fileName}`;
        await RNFetchBlob.config({ fileCache: true, path: dest, addAndroidDownloads: { useDownloadManager: true, notification: true, path: dest, description: 'Lab Report', mime: 'application/pdf' } })
            .fetch('GET', `https://example.com/reports/${fileName}`);
    } catch (e) { console.log('Download error:', e); }
};

const VisitCard = ({ event, expanded, onToggle }) => {
    const dc = DOC_COLORS[event.ci % DOC_COLORS.length];
    const vt = VISIT_TYPE_STYLE[event.type] || { bg: '#F1F5F9', tx: '#64748B' };

    return (
        <View style={s.visitCard}>
            {/* Header row */}
            <TouchableOpacity style={s.visitHeader} activeOpacity={0.75} onPress={onToggle}>
                <View style={[s.docAvatar, { backgroundColor: dc.bg }]}>
                    <Text style={[s.docAvatarTx, { color: dc.tx }]}>{initials(event.doc)}</Text>
                </View>
                <View style={s.visitMeta}>
                    <Text style={s.visitDoc}>{event.doc}</Text>
                    <Text style={s.visitSp}>{event.sp}</Text>
                    <Text style={s.visitCl} numberOfLines={1}>{event.cl}</Text>
                </View>
                <View style={s.visitRight}>
                    <Text style={s.visitDate}>{event.date}</Text>
                    <View style={[s.vtypeBadge, { backgroundColor: vt.bg }]}>
                        <Text style={[s.vtypeText, { color: vt.tx }]}>{event.type}</Text>
                    </View>
                </View>
                <Icon type={Icons.Ionicons}
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={ms(16)} color={MUTED} style={{ marginLeft: ms(4) }} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider} />

            {/* Body */}
            {expanded && (
                <View style={s.visitBody}>

                    <SectionLabel text="Chief Complaint" />
                    <View style={s.noteBox}>
                        <Text style={[s.noteText, { fontStyle: 'italic', color: MUTED }]}>{event.cc}</Text>
                    </View>

                    <SectionLabel text="Vitals" />
                    <View style={s.vitalsGrid}>
                        {event.vitals.map((v, i) => (
                            <View key={i} style={s.vitalBox}>
                                <Text style={s.vitalLabel}>{v.l}</Text>
                                <Text style={s.vitalValue}>{v.v}</Text>
                            </View>
                        ))}
                    </View>

                    <SectionLabel text="Doctor's Notes" />
                    <View style={s.noteBox}>
                        <Text style={s.noteText}>{event.notes}</Text>
                    </View>

                    <SectionLabel text="Diagnoses" />
                    <View style={s.tagRow}>
                        {event.dx.map((d, i) => (
                            <View key={i} style={s.dxTag}>
                                <Text style={s.dxTagTx}>{d}</Text>
                            </View>
                        ))}
                    </View>

                    {event.labs.length > 0 && (
                        <>
                            <SectionLabel text="Lab Reports from this Visit" />
                            {event.labs.map((lab, li) => (
                                <View key={li} style={s.labCard}>
                                    <View style={s.labCardHdr}>
                                        <View style={s.labCardTitle}>
                                            <View style={s.pdfBadge}><Text style={s.pdfBadgeTx}>PDF</Text></View>
                                            <View>
                                                <Text style={s.labName} numberOfLines={1}>{lab.name}</Text>
                                                <Text style={s.labLab} numberOfLines={1}>{lab.lab}</Text>
                                            </View>
                                        </View>
                                        <View style={s.labActions}>
                                            <TouchableOpacity style={s.dlBtn} activeOpacity={0.7}
                                                onPress={() => downloadReport(lab.pdf)}>
                                                <Icon type={Icons.Ionicons} name="download-outline" size={ms(11)} color={primaryColor} />
                                                <Text style={s.dlBtnTx}>Download</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[s.dlBtn, s.viewBtn]} activeOpacity={0.7}>
                                                <Icon type={Icons.Ionicons} name="eye-outline" size={ms(11)} color={whiteColor} />
                                                <Text style={[s.dlBtnTx, { color: whiteColor }]}>View</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={s.bmList}>
                                        {lab.markers.map((m, mi) => <BiomarkerRow key={mi} item={m} />)}
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    <SectionLabel text="Medications at this Visit" />
                    <View style={s.medSection}>
                        {event.meds.map((m, mi) => {
                            const ms2 = medStatusStyle[m.st];
                            return (
                                <View key={mi} style={s.medRow}>
                                    <View style={[s.medDot, { backgroundColor: m.color }]} />
                                    <View style={s.medInfo}>
                                        <Text style={s.medName}>{m.n}</Text>
                                        <Text style={s.medDose}>{m.dose}</Text>
                                    </View>
                                    <View style={[s.medBadge, { backgroundColor: ms2.bg }]}>
                                        <Text style={[s.medBadgeTx, { color: ms2.tx }]}>{ms2.label}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    <View style={s.fuBanner}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.fuDoc}>Follow-up: {event.fu.doc}</Text>
                            <Text style={s.fuNote}>{event.fu.note}</Text>
                        </View>
                        <Text style={s.fuDate}>{event.fu.date}</Text>
                    </View>

                </View>
            )}
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const ClinicalMedicalSummary = () => {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState({ 1: true });

    const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <SafeAreaView style={s.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.4]}
                style={s.gradient}
            >
                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={s.headerTitle}>Medical Summary</Text>
                        <Text style={s.headerSub}>{PATIENT.id}</Text>
                    </View>
                    <View style={s.patientAvi}>
                        <Text style={s.patientAviTx}>{PATIENT.initials}</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

                    {/* ── Patient Card ── */}
                    <LinearGradient
                        colors={[primaryColor, '#0F5E53']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.patientCard}
                    >
                        <View style={s.patientCardDecor1} />
                        <View style={s.patientCardDecor2} />
                        <View style={s.patientRow}>
                            <View style={s.patientAvatar}>
                                <Text style={s.patientAvatarTx}>{PATIENT.initials}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.patientName}>{PATIENT.name}</Text>
                                <Text style={s.patientDob}>{PATIENT.age} yrs · {PATIENT.gender} · DOB: {PATIENT.dob} · {PATIENT.blood}</Text>
                                <View style={s.tagRow}>
                                    {PATIENT.diagnoses.map((d, i) => (
                                        <View key={i} style={s.dxBadge}>
                                            <Text style={s.dxBadgeTx}>{d}</Text>
                                        </View>
                                    ))}
                                    <View style={s.dxBadge}>
                                        <Text style={s.dxBadgeTx}>{PATIENT.activeMeds} Active Meds</Text>
                                    </View>
                                    <View style={[s.dxBadge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                        <Text style={s.dxBadgeTx}>{PATIENT.allergy}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={s.pcStatsRow}>
                            {[['Visits', PATIENT.visits], ['Reports', PATIENT.reports], ['Active Rx', PATIENT.activeRx]].map(([label, val], i) => (
                                <View key={i} style={s.pcStat}>
                                    <Text style={s.pcStatVal}>{val}</Text>
                                    <Text style={s.pcStatLabel}>{label}</Text>
                                </View>
                            ))}
                        </View>
                    </LinearGradient>

                    {/* ── Stats Row ── */}
                    <View style={s.statsRow}>
                        {STATS.map((st, i) => (
                            <View key={i} style={s.statCard}>
                                <Text style={s.statLabel}>{st.label}</Text>
                                <Text style={[s.statValue, st.valueColor ? { color: st.valueColor } : {}]}>{st.value}</Text>
                                <Text style={[s.statSub, st.subColor ? { color: st.subColor } : {}]}>{st.sub}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Health Score ── */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.cardTitle}>Health Score</Text>
                            <Text style={s.cardSub}>updated Mar 09</Text>
                        </View>
                        <View style={s.scoreRingRow}>
                            <View style={s.scoreRing}>
                                <Text style={s.scoreNum}>74</Text>
                                <View style={s.scoreArc} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.scoreLabel}>Good</Text>
                                <Text style={s.scoreSub}>3 areas need attention — Lipids, Vitamin D, and Glucose</Text>
                            </View>
                        </View>
                        {SCORE_ITEMS.map((si, i) => (
                            <View key={i} style={s.scoreItem}>
                                <Text style={s.scoreItemName}>{si.name}</Text>
                                <View style={s.scoreBar}>
                                    <View style={[s.scoreBarFill, { width: `${si.pct}%`, backgroundColor: si.color }]} />
                                </View>
                                <Text style={[s.scoreItemPct, { color: si.color }]}>{si.pct}%</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Alerts ── */}
                    <View style={s.alertCard}>
                        <Icon type={Icons.Ionicons} name="warning-outline" size={ms(16)} color="#EA580C" style={{ marginTop: vs(1) }} />
                        <Text style={s.alertTx}><Text style={{ color: '#EA580C', fontFamily: interMedium }}>Drug interaction: </Text>Rosuvastatin + Vitamin D3 high-dose. Monitor for muscle pain.</Text>
                    </View>
                    <View style={[s.alertCard, { backgroundColor: '#FEF2F2', borderColor: 'rgba(220,38,38,0.2)' }]}>
                        <Icon type={Icons.Ionicons} name="warning-outline" size={ms(16)} color="#DC2626" style={{ marginTop: vs(1) }} />
                        <Text style={[s.alertTx, { color: '#DC2626' }]}><Text style={{ fontFamily: interMedium }}>Refill due in 5 days: </Text>Vitamin D3 – only 5 days of supply remaining.</Text>
                    </View>

                    {/* ── Active Medications ── */}
                    <View style={s.card}>
                        <View style={s.cardTitleRow}>
                            <Text style={s.cardTitle}>Active Medications</Text>
                            <Text style={s.cardSub}>5 current</Text>
                        </View>
                        {ACTIVE_MEDS.map((m, i) => {
                            const rc = refillColor(m.daysLeft, m.total);
                            return (
                                <View key={i} style={s.activeMedRow}>
                                    <View style={[s.activeMedDot, { backgroundColor: m.color }]} />
                                    <Text style={s.activeMedName}>{m.name}</Text>
                                    <Text style={s.activeMedDose}>{m.dose}</Text>
                                    <Text style={[s.activeMedRefill, { color: rc }]}>{m.daysLeft}d</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* ── Upcoming ── */}
                    <View style={s.card}>
                        <Text style={[s.cardTitle, { marginBottom: vs(10) }]}>Upcoming</Text>
                        {UPCOMING.map((u, i) => (
                            <View key={i} style={s.upRow}>
                                <View style={[s.upDot, { backgroundColor: u.color }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={s.upDoc}>{u.doc}</Text>
                                    <Text style={s.upSp}>{u.sp}</Text>
                                </View>
                                <Text style={s.upDate}>{u.date}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Clinical Timeline ── */}
                    <Text style={s.timelineTitle}>Clinical Timeline</Text>
                    <Text style={s.timelineSub}>Each visit with associated labs and prescriptions</Text>

                    <View style={s.timeline}>
                        <View style={s.timelineLine} />
                        {EVENTS.map(event => (
                            <View key={event.id} style={s.timelineItem}>
                                <View style={s.timelineDot}>
                                    <View style={s.timelineDotInner} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <VisitCard
                                        event={event}
                                        expanded={!!expanded[event.id]}
                                        onToggle={() => toggle(event.id)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default ClinicalMedicalSummary;

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: whiteColor },
    gradient:   { flex: 1, paddingTop: ms(46) },

    // Header
    header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(16), marginBottom: vs(12) },
    backBtn:       { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginRight: ms(10) },
    headerTitle:   { fontFamily: heading, fontSize: ms(16), color: whiteColor },
    headerSub:     { fontFamily: interRegular, fontSize: ms(10), color: grayColor, marginTop: vs(1) },
    patientAvi:    { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center' },
    patientAviTx:  { fontFamily: interMedium, fontSize: ms(12), color: whiteColor },

    scroll: { paddingHorizontal: ms(14) },

    // Patient Card
    patientCard:       { borderRadius: ms(16), padding: ms(16), marginBottom: vs(12), overflow: 'hidden' },
    patientCardDecor1: { position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)' },
    patientCardDecor2: { position: 'absolute', bottom: -50, right: 50, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
    patientRow:        { flexDirection: 'row', gap: ms(12), marginBottom: vs(14) },
    patientAvatar:     { width: ms(54), height: ms(54), borderRadius: ms(27), backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center', flexShrink: 0, zIndex: 1 },
    patientAvatarTx:   { fontFamily: interMedium, fontSize: ms(18), color: whiteColor },
    patientName:       { fontFamily: heading, fontSize: ms(18), color: whiteColor, marginBottom: vs(2) },
    patientDob:        { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.7)', marginBottom: vs(8) },
    dxBadge:           { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: vs(2), marginRight: ms(4), marginBottom: vs(4) },
    dxBadgeTx:         { fontFamily: interMedium, fontSize: ms(9), color: whiteColor },
    pcStatsRow:        { flexDirection: 'row', gap: ms(10), zIndex: 1 },
    pcStat:            { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(10), padding: ms(10), alignItems: 'center' },
    pcStatVal:         { fontFamily: interMedium, fontSize: ms(16), color: whiteColor },
    pcStatLabel:       { fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(2) },

    // Stats Row
    statsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(12) },
    statCard:   { flex: 1, minWidth: (width - ms(28) - ms(8)) / 2, backgroundColor: whiteColor, borderRadius: ms(10), padding: ms(10), borderWidth: 0.5, borderColor: BORDER },
    statLabel:  { fontFamily: interRegular, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: vs(3) },
    statValue:  { fontFamily: interMedium, fontSize: ms(18), color: blackColor },
    statSub:    { fontFamily: interRegular, fontSize: ms(10), color: primaryColor, marginTop: vs(2) },

    // Card
    card:         { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), borderWidth: 0.5, borderColor: BORDER, marginBottom: vs(12) },
    cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(12) },
    cardTitle:    { fontFamily: heading, fontSize: ms(13), color: blackColor },
    cardSub:      { fontFamily: interRegular, fontSize: ms(10), color: MUTED },

    // Health Score
    scoreRingRow: { flexDirection: 'row', alignItems: 'center', gap: ms(14), marginBottom: vs(12) },
    scoreRing:    { width: ms(64), height: ms(64), borderRadius: ms(32), borderWidth: ms(5), borderColor: primaryColor + '30', backgroundColor: '#CCFBF1', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    scoreNum:     { fontFamily: interMedium, fontSize: ms(18), color: NAVY },
    scoreArc:     {},
    scoreLabel:   { fontFamily: heading, fontSize: ms(13), color: blackColor, marginBottom: vs(2) },
    scoreSub:     { fontFamily: interRegular, fontSize: ms(11), color: MUTED, lineHeight: vs(16) },
    scoreItem:    { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    scoreItemName:{ fontFamily: interRegular, fontSize: ms(11), color: MUTED, width: ms(60) },
    scoreBar:     { flex: 1, height: vs(4), backgroundColor: '#E2E8F0', borderRadius: ms(2), marginHorizontal: ms(8), overflow: 'hidden' },
    scoreBarFill: { height: '100%', borderRadius: ms(2) },
    scoreItemPct: { fontFamily: interMedium, fontSize: ms(11), width: ms(34), textAlign: 'right' },

    // Alerts
    alertCard: { backgroundColor: '#FFF7ED', borderWidth: 0.5, borderColor: 'rgba(234,88,12,0.2)', borderRadius: ms(10), padding: ms(12), flexDirection: 'row', gap: ms(8), marginBottom: vs(10) },
    alertTx:   { fontFamily: interRegular, fontSize: ms(11), color: SLATE, lineHeight: vs(18), flex: 1 },

    // Active Meds
    activeMedRow:    { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(8) },
    activeMedDot:    { width: ms(8), height: ms(8), borderRadius: ms(4), flexShrink: 0 },
    activeMedName:   { fontFamily: interRegular, fontSize: ms(11), color: blackColor, flex: 1 },
    activeMedDose:   { fontFamily: interRegular, fontSize: ms(10), color: MUTED },
    activeMedRefill: { fontFamily: interMedium, fontSize: ms(10), width: ms(28), textAlign: 'right' },

    // Upcoming
    upRow:   { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(8) },
    upDot:   { width: ms(8), height: ms(8), borderRadius: ms(4), flexShrink: 0 },
    upDoc:   { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    upSp:    { fontFamily: interRegular, fontSize: ms(10), color: MUTED },
    upDate:  { fontFamily: interMedium, fontSize: ms(11), color: blackColor },

    // Timeline
    timelineTitle:  { fontFamily: heading, fontSize: ms(18), color: blackColor, marginBottom: vs(2) },
    timelineSub:    { fontFamily: interRegular, fontSize: ms(11), color: MUTED, marginBottom: vs(14) },
    timeline:       { position: 'relative', paddingLeft: ms(24) },
    timelineLine:   { position: 'absolute', left: ms(8), top: ms(18), bottom: ms(18), width: 1.5, backgroundColor: primaryColor + '40' },
    timelineItem:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(14) },
    timelineDot:    { position: 'absolute', left: -ms(24), top: ms(16), width: ms(18), height: ms(18), borderRadius: ms(9), borderWidth: 2, borderColor: primaryColor, backgroundColor: '#F8FFFE', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    timelineDotInner: { width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: primaryColor },

    // Visit Card
    visitCard:   { backgroundColor: whiteColor, borderRadius: ms(14), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden', flex: 1 },
    visitHeader: { flexDirection: 'row', alignItems: 'center', padding: ms(12), gap: ms(10) },
    docAvatar:   { width: ms(40), height: ms(40), borderRadius: ms(20), justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    docAvatarTx: { fontFamily: interMedium, fontSize: ms(12) },
    visitMeta:   { flex: 1, minWidth: 0 },
    visitDoc:    { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    visitSp:     { fontFamily: interRegular, fontSize: ms(10), color: MUTED },
    visitCl:     { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', marginTop: vs(1) },
    visitRight:  { alignItems: 'flex-end', flexShrink: 0 },
    visitDate:   { fontFamily: interMedium, fontSize: ms(10), color: blackColor },
    vtypeBadge:  { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2), marginTop: vs(3) },
    vtypeText:   { fontFamily: interMedium, fontSize: ms(9) },
    divider:     { height: 0.5, backgroundColor: BORDER, marginHorizontal: ms(12) },

    // Visit Body
    visitBody: { padding: ms(12) },
    seclblRow: { flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(6) },
    seclbl:    { fontFamily: interMedium, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: ms(8) },
    seclblLine:{ flex: 1, height: 0.5, backgroundColor: BORDER },

    noteBox:  { backgroundColor: '#F8FFFE', borderLeftWidth: 3, borderLeftColor: primaryColor, borderRadius: ms(6), padding: ms(10) },
    noteText: { fontFamily: interRegular, fontSize: ms(11), color: SLATE, lineHeight: vs(18) },

    vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    vitalBox:   { flex: 1, minWidth: (width - ms(80)) / 2, backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(8), padding: ms(8) },
    vitalLabel: { fontFamily: interRegular, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2) },
    vitalValue: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },

    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4) },
    dxTag:   { backgroundColor: '#FEF2F2', borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    dxTagTx: { fontFamily: interMedium, fontSize: ms(10), color: '#DC2626' },

    // Lab Card
    labCard:      { backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), overflow: 'hidden', marginBottom: vs(8) },
    labCardHdr:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: ms(10), borderBottomWidth: 0.5, borderBottomColor: BORDER, gap: ms(10) },
    labCardTitle: { flexDirection: 'row', alignItems: 'center', gap: ms(8), flex: 1, minWidth: 0 },
    pdfBadge:     { backgroundColor: '#FEE2E2', borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: vs(2) },
    pdfBadgeTx:   { fontFamily: interMedium, fontSize: ms(9), color: '#DC2626' },
    labName:      { fontFamily: interMedium, fontSize: ms(11), color: blackColor, flexShrink: 1 },
    labLab:       { fontFamily: interRegular, fontSize: ms(10), color: MUTED, flexShrink: 1 },
    labActions:   { flexDirection: 'row', gap: ms(6) },
    dlBtn:        { flexDirection: 'row', alignItems: 'center', gap: ms(3), borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(4) },
    dlBtnTx:      { fontFamily: interRegular, fontSize: ms(10), color: primaryColor },
    viewBtn:      { backgroundColor: primaryColor, borderColor: primaryColor },

    // Biomarker Row
    bmList:   { padding: ms(10), gap: vs(8) },
    bmRow:    { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    bmName:   { fontFamily: interRegular, fontSize: ms(10), color: blackColor, width: ms(100), flexShrink: 0 },
    bmVal:    { fontFamily: interMedium, fontSize: ms(10), width: ms(52), flexShrink: 0 },
    bmUnit:   { fontFamily: interRegular, fontSize: ms(9), color: MUTED },
    bmBar:    { flex: 1, height: vs(5), backgroundColor: '#E2E8F0', borderRadius: ms(3), position: 'relative', overflow: 'visible' },
    bmFill:   { position: 'absolute', top: 0, height: '100%', borderRadius: ms(3) },
    bmDot:    { position: 'absolute', top: -vs(4), width: ms(13), height: ms(13), borderRadius: ms(7), borderWidth: 2, borderColor: whiteColor, marginLeft: -ms(6) },
    bmRef:    { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', width: ms(48), textAlign: 'right', flexShrink: 0 },
    bmPill:   { borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: vs(1), flexShrink: 0 },
    bmPillTx: { fontFamily: interMedium, fontSize: ms(9) },

    // Medications
    medSection: { gap: vs(6) },
    medRow:     { backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(8), padding: ms(10), flexDirection: 'row', alignItems: 'center', gap: ms(10) },
    medDot:     { width: ms(10), height: ms(10), borderRadius: ms(5), flexShrink: 0 },
    medInfo:    { flex: 1 },
    medName:    { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    medDose:    { fontFamily: interRegular, fontSize: ms(10), color: MUTED, marginTop: vs(1) },
    medBadge:   { borderRadius: ms(4), paddingHorizontal: ms(7), paddingVertical: vs(2), flexShrink: 0 },
    medBadgeTx: { fontFamily: interMedium, fontSize: ms(9) },

    // Follow-up
    fuBanner: { backgroundColor: '#EFF6FF', borderWidth: 0.5, borderColor: 'rgba(29,78,216,0.18)', borderRadius: ms(10), padding: ms(12), flexDirection: 'row', alignItems: 'center', marginTop: vs(10) },
    fuDoc:    { fontFamily: interMedium, fontSize: ms(11), color: '#1D4ED8' },
    fuNote:   { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(29,78,216,0.65)', marginTop: vs(2) },
    fuDate:   { fontFamily: interMedium, fontSize: ms(11), color: '#1D4ED8' },
});
