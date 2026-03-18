import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import { heading, interMedium, interRegular } from '../config/Constants';
import { blackColor, primaryColor, whiteColor, globalGradient2 } from '../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';

const { width } = Dimensions.get('window');

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
    ok:     '#16A34A', okL:   '#F0FDF4', okB:   'rgba(22,163,74,0.15)',
    warn:   '#B45309', warnL: '#FFFBEB', warnB: 'rgba(180,83,9,0.13)',
    crit:   '#B91C1C', critL: '#FEF2F2', critB: 'rgba(185,28,28,0.13)',
    info:   '#1D4ED8', infoL: '#EFF6FF', infoB: 'rgba(29,78,216,0.12)',
    flag:   '#C2410C', flagL: '#FFF7ED', flagB: 'rgba(194,65,12,0.13)',
    purple: '#6D28D9', purL:  '#F5F3FF', purB:  'rgba(109,40,217,0.12)',
    acc:    primaryColor, accL: primaryColor + '18', accB: primaryColor + '33',
    gray:   '#94A3B8', muted: '#64748B', slate: '#334155',
    border: '#E2E8F0', surface: '#F7FAFC', bg: '#F1F5F9',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const PROBLEMS = [
    { icd:'E11.9', name:'Type 2 Diabetes Mellitus',    meta:'Sep 2023 · Metformin · HbA1c 5.9% (improving)',     sc:'warn', active:true },
    { icd:'E78.5', name:'Mixed Hyperlipidaemia',        meta:'Feb 2025 · Rosuvastatin 10mg · LDL 138 mg/dL',      sc:'crit', active:true },
    { icd:'E55.9', name:'Vitamin D Deficiency',         meta:'Nov 2024 · Cholecalciferol 60K IU/wk · D3 14 ng/mL',sc:'crit', active:true },
    { icd:'E53.8', name:'Vitamin B12 Deficiency',       meta:'Nov 2024 · Methylcobalamin 1500mcg · B12 280 pg/mL', sc:'warn', active:true },
    { icd:'M54.5', name:'Lower Back Pain',              meta:'Jan 2025 · Physiotherapy completed · Resolved',      sc:'dim',  active:false },
    { icd:'J02.9', name:'Acute Viral Pharyngitis',      meta:'Jan 2025 · Self-limiting · Resolved',               sc:'dim',  active:false },
];

const VITALS = [
    { lbl:'Blood Pressure', val:'118/76', unit:'mmHg', sub:'Optimal',          col:C.ok },
    { lbl:'Heart Rate',     val:'74',     unit:'bpm',  sub:'Normal sinus',     col:C.ok },
    { lbl:'Weight / BMI',   val:'74.2',   unit:'kg',   sub:'BMI 25.6 · Overweight', col:C.warn },
    { lbl:'SpO₂',           val:'99',     unit:'%',    sub:'Normal',           col:C.ok },
    { lbl:'Temperature',    val:'98.4',   unit:'°F',   sub:'Afebrile',         col:C.ok },
    { lbl:'eGFR',           val:'82',     unit:'mL/min',sub:'CKD Stage G2',   col:C.ok },
];

const PENDING_ORDERS = [
    { t:'Urine Microalbumin (spot)',     m:'Dr. Priya Nair · 09-Mar-25 · Diabetic nephropathy screen', sc:'crit', s:'Urgent' },
    { t:'Creatine Kinase (Total CK)',    m:'Dr. Priya Nair · 09-Mar-25 · Suspected statin myopathy',   sc:'crit', s:'Urgent' },
    { t:'Lipid Profile – repeat',        m:'Dr. Priya Nair · 09-Mar-25 · Post-statin response',        sc:'info', s:'Apr 5' },
    { t:'Cardiology Follow-up · Dr. Reddy', m:'Yashoda Hospitals · Lipid panel review',               sc:'warn', s:'Apr 18' },
];

const TRX_MATRIX = [
    { drug:'Metformin 500mg TDS',       marker:'HbA1c',          change:'↓0.9%',         pct:87, col:C.ok,   v:'Responding', vc:'ok' },
    { drug:'Rosuvastatin 10mg OD',      marker:'LDL-C',          change:'Pending Apr 5',  pct:5,  col:C.warn, v:'Pending',    vc:'warn' },
    { drug:'Cholecalciferol 60K/wk',    marker:'Vit D3 (25-OH)', change:'↑ Rising',       pct:18, col:C.info, v:'In Progress',vc:'info' },
    { drug:'Methylcobalamin 1500mcg',   marker:'B12',            change:'+70 pg/mL',      pct:55, col:C.acc,  v:'Responding', vc:'acc' },
    { drug:'Pantoprazole 40mg OD',      marker:'GI Protection',  change:'Resolved',       pct:100,col:C.ok,   v:'Resolved',   vc:'ok' },
];

const ENCOUNTER_TIMELINE = [
    { dt:'09-Mar-2025', title:'Endocrinology OPD · Dr. Priya Nair',       meta:'HbA1c 5.9% (↓0.9). FBG 102. Statin myalgia queried. CK ordered.',       col:C.acc,  tag:'Follow-up' },
    { dt:'14-Feb-2025', title:'Cardiology Consultation · Dr. Suresh Reddy',meta:'LDL 138 mg/dL. ECG normal. Rosuvastatin 10mg initiated.',                col:C.crit, tag:'New Rx' },
    { dt:'07-Jan-2025', title:'General Medicine · Dr. Kavitha Iyer',       meta:'Viral pharyngitis. Rapid Strep negative. No antibiotics – PCN allergy.',  col:C.warn, tag:'Acute' },
    { dt:'12-Nov-2024', title:'Endocrinology · Dr. Priya Nair',            meta:'HbA1c 6.8% (↑). Vit D3 14 ng/mL severe deficiency. Supplements started.',col:C.acc,  tag:'New Dx' },
    { dt:'22-Nov-2024', title:'Ophthalmology · Dr. Anand Krishnamurthy',   meta:'Annual diabetic eye review. No retinopathy. Myopia Rx updated.',          col:C.info, tag:'Screening' },
];

const CVD_RISK_FACTORS = [
    { label:'LDL-C 138 mg/dL',       sign:'+', val:'2.1%', col:C.crit },
    { label:'T2DM (HbA1c 5.9%)',     sign:'+', val:'1.8%', col:C.warn },
    { label:'Family Hx: Paternal MI',sign:'+', val:'0.8%', col:C.flag },
    { label:'BP 118/76 mmHg',        sign:'−', val:'0.4%', col:C.ok },
    { label:'Non-smoker',            sign:'−', val:'1.2%', col:C.ok },
];

// HbA1c chart data (7 points)
const HBAC1_DATA = [7.2, 7.0, 6.8, 6.5, 6.5, 6.8, 5.9];
const HBAC1_LABS = ["Sep'23",'Dec',"Mar'24",'Jun','Sep','Dec',"Mar'25"];

// Lab data
const LAB_GLYC = [
    { name:'HbA1c',              v:5.9,   lo:0,      hi:5.7,    unit:'%',       tr:'↓', p:'6.8%', isH:true  },
    { name:'Fasting Plasma Glucose', v:102, lo:70,   hi:100,    unit:'mg/dL',   tr:'↓', p:'104',  isH:true  },
    { name:'Post-prandial Glucose',  v:138, lo:70,   hi:140,    unit:'mg/dL',   tr:'↓', p:'142',  isH:false },
    { name:'Insulin (fasting)',      v:9.2, lo:2,    hi:25,     unit:'μIU/mL',  tr:'→', p:'10.1', isH:false },
];
const LAB_LIPID = [
    { name:'Total Cholesterol',  v:198, lo:0,   hi:200, unit:'mg/dL', tr:'↓', p:'204', isH:false },
    { name:'LDL Cholesterol',    v:138, lo:0,   hi:130, unit:'mg/dL', tr:'→', p:'142', isH:true  },
    { name:'HDL Cholesterol',    v:52,  lo:40,  hi:60,  unit:'mg/dL', tr:'↑', p:'50',  isH:false },
    { name:'Triglycerides',      v:142, lo:0,   hi:150, unit:'mg/dL', tr:'↓', p:'148', isH:false },
    { name:'Non-HDL Cholesterol',v:146, lo:0,   hi:160, unit:'mg/dL', tr:'↓', p:'154', isH:false },
];
const LAB_HAEM = [
    { name:'Haemoglobin',   v:13.2,   lo:13.5, hi:17.5, unit:'g/dL',  tr:'↑', p:'13.1', isH:false, isL:true  },
    { name:'PCV / Haematocrit', v:39.8,lo:40,  hi:54,   unit:'%',     tr:'↑', p:'39.6', isH:false, isL:true  },
    { name:'WBC Count',     v:7200,   lo:4500, hi:11000, unit:'/μL',   tr:'→', p:'7400', isH:false },
    { name:'Platelet Count',v:228000, lo:150000,hi:400000,unit:'/μL',  tr:'↓', p:'235K', isH:false },
];
const LAB_THYROID = [
    { name:'TSH',              v:2.4, lo:0.5, hi:5.0,  unit:'mIU/L', tr:'→', p:'2.6', isH:false },
    { name:'Free T4',          v:1.1, lo:0.8, hi:1.8,  unit:'ng/dL', tr:'→', p:'1.2', isH:false },
    { name:'25-OH Vitamin D3', v:14,  lo:30,  hi:100,  unit:'ng/mL', tr:'↑', p:'14',  isH:false, isL:true },
    { name:'Vitamin B12',      v:280, lo:200, hi:900,  unit:'pg/mL', tr:'↑', p:'210', isH:false },
];
const LAB_HISTORY = [
    { dt:'09-Mar-2025', p:'Apollo Diagnostics',  panel:'HbA1c · CBC · Urine',         by:'Dr. P. Nair',   abn:'HbA1c H · Hgb L', c:'₹2,400', s:'Reviewed' },
    { dt:'14-Feb-2025', p:'Dr. Lal Pathlabs',    panel:'Lipid Profile Full',           by:'Dr. S. Reddy',  abn:'LDL H',             c:'₹1,100', s:'Reviewed' },
    { dt:'12-Nov-2024', p:'Thyrocare',            panel:'TSH · T4 · HbA1c · Vit D · B12',by:'Dr. P. Nair', abn:'HbA1c H · Vit D L · B12 L',c:'₹3,200',s:'Reviewed' },
    { dt:'Aug-2024',    p:'Apollo Diagnostics',   panel:'HbA1c · Metabolic · CBC',     by:'Dr. P. Nair',   abn:'HbA1c H · LDL H',   c:'₹2,200', s:'Reviewed' },
];
const PEND_LABS = [
    { t:'Urine Microalbumin (Spot)',m:'Dr. Priya Nair · Diabetic nephropathy screening · Ordered 09-Mar-25', sc:'crit' },
    { t:'Creatine Kinase (Total CK)',m:'Dr. Priya Nair · Suspected statin myopathy · leg heaviness · Ordered 09-Mar-25', sc:'crit' },
];

const RX_DATA = [
    { n:'Metformin Hydrochloride',   dose:'500 mg',     route:'PO', freq:'TDS with meals',   start:'Sep 2023', by:'Dr. P. Nair',   ind:'T2DM · E11.9',              adh:92, note:'' },
    { n:'Pantoprazole Sodium',       dose:'40 mg',      route:'PO', freq:'OD before dinner', start:'Sep 2023', by:'Dr. P. Nair',   ind:'GI protection',             adh:90, note:'' },
    { n:'Rosuvastatin Calcium',      dose:'10 mg',      route:'PO', freq:'OD at bedtime',    start:'Feb 2025', by:'Dr. S. Reddy',  ind:'Hyperlipidaemia · E78.5',   adh:88, note:'⚠ Monitor CK – myalgia reported' },
    { n:'Cholecalciferol (Vit D3)',  dose:'60,000 IU',  route:'PO', freq:'Once weekly',      start:'Dec 2024', by:'Dr. P. Nair',   ind:'Vit D deficiency · E55.9',  adh:80, note:'⚠ 5-day supply – urgent refill' },
    { n:'Methylcobalamin (B12)',     dose:'1500 mcg',   route:'PO sublingual',freq:'OD',     start:'Dec 2024', by:'Dr. P. Nair',   ind:'B12 deficiency · E53.8',    adh:85, note:'' },
];
const SUPPLY = { Metformin:18, Pantoprazole:45, Rosuvastatin:62, Cholecalciferol:5, Methylcobalamin:34 };
const DISC_RX = [
    { n:'Amoxicillin 500mg TDS', ind:'Empirical pharyngitis', dur:'5 days · Oct 2024', by:'Self-discontinued', r:'ALLERGY RISK – Penicillin allergy. No adverse reaction.' },
    { n:'Paracetamol 500mg SOS', ind:'Viral pyrexia', dur:'3 days · Jan 2025', by:'Dr. Kavitha Iyer', r:'Short course complete – symptom resolution' },
];

// Biomarker trend data (view-based line chart points)
const HBAC1_TREND = [{ l:"Feb'24",v:6.4},{ l:"May",v:6.2},{ l:"Aug",v:6.5},{ l:"Nov",v:6.8},{ l:"Mar'25",v:5.9}];
const LIPID_TREND = [{ l:"Oct'23",ldl:145,hdl:48},{ l:"Mar'24",ldl:142,hdl:50},{ l:"Aug'24",ldl:138,hdl:50},{ l:"Feb'25",ldl:138,hdl:52}];
const VITD_TREND  = [{ l:"Nov'24",d:14},{ l:"Dec",d:14},{ l:"Jan'25",d:17},{ l:"Feb",d:20},{ l:"Mar",d:24}];
const HGB_TREND   = [{ l:"Sep'22",v:13.0},{ l:"Mar'23",v:13.2},{ l:"Sep",v:13.3},{ l:"Mar'24",v:13.4},{ l:"Sep",v:13.1},{ l:"Mar'25",v:13.2}];

const BM_SUMMARY = [
    { name:'HbA1c',          val:'5.9%',      st:'Borderline H', tr:'↓ Improving', hps:77, sc:'warn' },
    { name:'LDL Cholesterol',val:'138 mg/dL', st:'High',         tr:'↓ Declining', hps:55, sc:'crit' },
    { name:'Vitamin D3',     val:'14 ng/mL',  st:'Deficient',    tr:'↑ Rising',    hps:48, sc:'crit' },
    { name:'Haemoglobin',    val:'13.2 g/dL', st:'Borderline L', tr:'→ Static',    hps:70, sc:'warn' },
    { name:'TSH',            val:'2.4 mIU/L', st:'Normal',       tr:'→ Stable',    hps:95, sc:'ok' },
    { name:'HDL-C',          val:'52 mg/dL',  st:'Normal',       tr:'↑ Rising',    hps:86, sc:'ok' },
    { name:'Vitamin B12',    val:'280 pg/mL', st:'Low-normal',   tr:'↑ Rising',    hps:68, sc:'warn' },
    { name:'eGFR',           val:'82 mL/min', st:'Normal (G2)',  tr:'→ Stable',    hps:90, sc:'ok' },
    { name:'Fasting Glucose',val:'102 mg/dL', st:'Borderline H', tr:'↓ Declining', hps:67, sc:'warn' },
];

const PROG_NOTES = [
    { dr:'Dr. Priya Nair', role:'Endocrinologist · Apollo Hospitals', dt:'09-Mar-2025', type:'Progress Note',
      s:'Routine 3-month T2DM follow-up. Dietary compliance improved. Mild leg heaviness since Rosuvastatin.',
      o:'BP 118/76. HR 74. Wt 74.2kg. HbA1c 5.9% (↓0.9). FBG 102. eGFR 82.',
      a:'T2DM improving. Dyslipidaemia – statin response pending. Vit D repletion ongoing. Possible statin myalgia.',
      p:'Continue meds. Urine microalbumin STAT, CK level, lipid Apr 5. Urgent Vit D3 refill. Review Jun 2025.' },
    { dr:'Dr. Suresh Reddy', role:'Cardiologist · Yashoda Hospitals', dt:'14-Feb-2025', type:'Consultation Note',
      s:'Referred by Dr. Priya Nair – LDL 138 mg/dL on metabolic panel.',
      o:'BP 128/82. HR 78. ECG: Normal sinus. QTc 390ms. No angina. Father MI at 58.',
      a:'Hyperlipidaemia (LDL 138, TC 198). 10-yr ASCVD 8.4% – intermediate risk. Rosuvastatin 10mg OD initiated.',
      p:'Repeat lipid Apr 5 (Dr. Lal). Stress test deferred – reassess Apr 18. Target LDL <100 mg/dL.' },
];
const REFERRALS = [
    { f:'Dr. Priya Nair',  t:'Dr. Suresh Reddy',       dt:'Jan 2025', r:'Hyperlipidaemia workup' },
    { f:'Dr. Suresh Reddy',t:'Dr. Priya Nair',          dt:'Feb 2025', r:'Co-management: statin, glycaemic overlap' },
    { f:'Dr. Kavitha Iyer',t:'Dr. Ramya Srinivas',      dt:'Jan 2025', r:'Physiotherapy – back pain' },
    { f:'Self',            t:'Dr. Anand Krishnamurthy', dt:'Nov 2024', r:'Annual diabetic eye screening' },
];
const PREV_CARE = [
    { item:'Diabetic retinopathy screening', last:'Nov 2024', due:'Nov 2025',        sc:'ok' },
    { item:'Urine microalbumin (UACR)',      last:'–',        due:'Pending (ordered)',sc:'crit' },
    { item:'Lipid profile – annual',         last:'Feb 2025', due:'Aug 2025',        sc:'ok' },
    { item:'Peripheral neuropathy exam',     last:'Mar 2025', due:'Sep 2025',        sc:'ok' },
    { item:'BP monitoring (3-monthly)',      last:'Mar 2025', due:'Jun 2025',        sc:'ok' },
    { item:'Colonoscopy (age 40+)',          last:'–',        due:'2030 (estimated)',sc:'dim' },
];

const RISK_FACTORS = [
    { f:'LDL-C 138 mg/dL',        mod:true,  impact:'High',      sc:'crit' },
    { f:'HbA1c 5.9% (borderline)',mod:true,  impact:'High',      sc:'warn' },
    { f:'BMI 25.6 – Overweight',  mod:true,  impact:'Moderate',  sc:'warn' },
    { f:'Vitamin D deficiency',   mod:true,  impact:'Moderate',  sc:'warn' },
    { f:'Paternal MI at age 58',  mod:false, impact:'Moderate',  sc:'flag' },
    { f:'Age 34 / Male sex',      mod:false, impact:'Low',       sc:'dim' },
    { f:'Non-smoker',             mod:false, impact:'Protective', sc:'ok' },
    { f:'BP 118/76 – Optimal',    mod:false, impact:'Protective', sc:'ok' },
];
const RISK_DM = [
    { label:'Retinopathy', status:'No retinopathy · Annual screening',      sc:'ok'   },
    { label:'Nephropathy', status:'UACR pending · ACR not staged',          sc:'crit' },
    { label:'Neuropathy',  status:'Peripheral exam normal',                 sc:'ok'   },
    { label:'Foot health', status:'No callus · No deformity',               sc:'ok'   },
    { label:'Macrovascular',status:'ASCVD 8.4% · Intermediate',            sc:'warn' },
];
const CLIN_RECS = [
    { no:'1', rec:'Order Urine Microalbumin – STAT',            priority:'Urgent', pc:'crit',
      basis:'ADA 2024: Annual UACR mandatory in T2DM. Never performed. Essential for nephropathy staging.' },
    { no:'2', rec:'LDL-C target <100 mg/dL (Diabetic patient)', priority:'High',   pc:'warn',
      basis:'ACC/AHA 2019: T2DM + intermediate ASCVD risk = high-intensity statin. Current LDL 138. Reassess Apr 5.' },
    { no:'3', rec:'Monitor CK for Statin Myopathy',             priority:'High',   pc:'warn',
      basis:'Leg heaviness 4 weeks post-Rosuvastatin. DDI with high-dose Vit D3 adds risk. If CK >5× ULN, hold statin.' },
    { no:'4', rec:'Vitamin D3 Refill – Urgent',                 priority:'Urgent', pc:'crit',
      basis:'5 days supply remaining. Severe deficiency (14 ng/mL). Interrupted repletion delays recovery 3–4 weeks.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const scColor = (sc) => {
    const m = { ok: C.ok, warn: C.warn, crit: C.crit, info: C.info, flag: C.flag, dim: C.muted, acc: C.acc, purple: C.purple };
    return m[sc] || C.muted;
};
const scBg = (sc) => {
    const m = { ok: C.okL, warn: C.warnL, crit: C.critL, info: C.infoL, flag: C.flagL, dim: '#F1F5F9', acc: C.accL, purple: C.purL };
    return m[sc] || '#F1F5F9';
};
const scBorder = (sc) => {
    const m = { ok: C.okB, warn: C.warnB, crit: C.critB, info: C.infoB, flag: C.flagB, dim: '#E2E8F0', acc: C.accB, purple: C.purB };
    return m[sc] || '#E2E8F0';
};
const adhColor = (v) => v >= 90 ? C.ok : v >= 80 ? C.warn : C.crit;
const supplyKey = (n) => n.split(' ')[0];

// ── Shared UI Components ───────────────────────────────────────────────────────
const Badge = ({ sc, label, style: extra }) => (
    <View style={[{ backgroundColor: scBg(sc), borderColor: scBorder(sc), borderWidth: 1, borderRadius: ms(4), paddingHorizontal: ms(7), paddingVertical: vs(2) }, extra]}>
        <Text style={{ fontFamily: interMedium, fontSize: ms(9), color: scColor(sc), textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</Text>
    </View>
);

const CardHeader = ({ title, sub, right }) => (
    <View style={st.cardHdr}>
        <View style={{ flex: 1 }}>
            <Text style={st.cardTitle}>{title}</Text>
            {!!sub && <Text style={st.cardSub}>{sub}</Text>}
        </View>
        {right}
    </View>
);

const SectionLbl = ({ title }) => (
    <View style={st.seclblRow}>
        <Text style={st.seclbl}>{title}</Text>
        <View style={st.seclblLine} />
    </View>
);

const RowDivider = () => <View style={st.rowDivider} />;

const ProgBar = ({ pct, color, height = vs(5) }) => (
    <View style={[st.progWrap, { height }]}>
        <View style={[st.progFill, { width: `${Math.min(100, pct)}%`, backgroundColor: color, height }]} />
    </View>
);

const InsightBox = ({ text, sc = 'info' }) => (
    <View style={[st.insightBox, { backgroundColor: scBg(sc), borderColor: scBorder(sc), borderLeftColor: scColor(sc) }]}>
        <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(14)} color={scColor(sc)} style={{ marginTop: vs(1) }} />
        <Text style={[st.insightTxt, { color: scColor(sc) }]}>{text}</Text>
    </View>
);

// ── Bar Chart (View-based) ─────────────────────────────────────────────────────
const BarChart = ({ data, color = C.acc, maxVal, height = vs(80), labelKey = 'l', valKey = 'v' }) => {
    const max = maxVal || Math.max(...data.map(d => d[valKey]));
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: ms(4), height: height + vs(18) }}>
            {data.map((d, i) => {
                const pct = (d[valKey] / max) * 100;
                return (
                    <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: height + vs(18) }}>
                        <Text style={st.chartVal}>{d[valKey]}</Text>
                        <View style={{ width: '80%', height: (pct / 100) * height, backgroundColor: Array.isArray(color) ? color[i % color.length] : color, borderRadius: ms(3) }} />
                        <Text style={st.chartLbl} numberOfLines={1}>{d[labelKey]}</Text>
                    </View>
                );
            })}
        </View>
    );
};

// ── Lab Card (card-based, no table) ───────────────────────────────────────────
const LabCard = ({ item }) => {
    const isH = item.isH;
    const isL = item.isL;
    const isAbnormal = isH || isL;
    const col = isAbnormal ? (isH ? C.crit : C.warn) : C.ok;
    const bgCol = isAbnormal ? (isH ? C.critL : C.warnL) : C.okL;
    const flag = isH ? 'HIGH' : isL ? 'LOW' : 'NORMAL';
    const flagSc = isH ? 'crit' : isL ? 'warn' : 'ok';
    const trendCol = item.tr === '↓' ? C.ok : item.tr === '↑' ? C.info : C.gray;
    // range bar: clamp marker position 4–96%
    const pct = item.lo > 0
        ? Math.max(4, Math.min(96, ((item.v - item.lo) / (item.hi - item.lo)) * 100))
        : Math.min(96, (item.v / item.hi) * 80);
    const refLabel = item.lo > 0 ? `${item.lo} – ${item.hi}` : `< ${item.hi}`;
    return (
        <View style={[st.labCard, isAbnormal && { borderColor: col + '40', borderLeftWidth: 3, borderLeftColor: col }]}>
            {/* Top row: name + flag */}
            <View style={st.labCardTop}>
                <Text style={st.labCardName} numberOfLines={2}>{item.name}</Text>
                <Badge sc={flagSc} label={flag} />
            </View>
            {/* Value row */}
            <View style={st.labCardMid}>
                <View style={[st.labCardValWrap, { backgroundColor: bgCol }]}>
                    <Text style={[st.labCardVal, { color: col }]}>{item.v}</Text>
                    <Text style={[st.labCardUnit, { color: col }]}>{item.unit}</Text>
                </View>
                <View style={st.labCardRight}>
                    <View style={st.labCardTrendRow}>
                        <Text style={[st.labCardTrend, { color: trendCol }]}>{item.tr}</Text>
                        <Text style={st.labCardTrendLbl}>vs prev</Text>
                        <Text style={[st.labCardPrev, { color: C.muted }]}>{item.p}</Text>
                    </View>
                    <Text style={st.labCardRefLbl}>Ref: {refLabel} {item.unit}</Text>
                    {/* Range bar */}
                    <View style={st.labCardBar}>
                        <View style={st.labCardBarOk} />
                        <View style={[st.labCardMarker, { left: `${pct}%`, backgroundColor: col }]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 – CLINICAL OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const TabOverview = () => (
    <View>
        {/* 4 Metric Cards */}
        <View style={st.g2}>
            {[
                { lbl:'HbA1c', val:'5.9%',       sub:'Ref <5.7 · Borderline H', delta:'↓0.9 vs Nov \'24', dsc:'ok',  sc:'warn' },
                { lbl:'LDL-C', val:'138 mg/dL',  sub:'Target <100 · High',      delta:'↓4 vs Oct \'24',   dsc:'crit',sc:'crit' },
                { lbl:'Vit D3',val:'14 ng/mL',   sub:'Ref 30–100 · Deficient',  delta:'Repletion ongoing', dsc:'flag',sc:'crit' },
                { lbl:'eGFR',  val:'82',          sub:'mL/min · CKD G2',        delta:'Stable',            dsc:'ok',  sc:'ok' },
            ].map((m, i) => (
                <View key={i} style={[st.metricCard, { borderTopColor: scColor(m.sc) }]}>
                    <Text style={st.metricLbl}>{m.lbl}</Text>
                    <Text style={[st.metricVal, { color: scColor(m.sc) }]}>{m.val}</Text>
                    <Text style={st.metricSub}>{m.sub}</Text>
                    <View style={[st.metricDelta, { backgroundColor: scBg(m.dsc) }]}>
                        <Text style={[st.metricDeltaTxt, { color: scColor(m.dsc) }]}>{m.delta}</Text>
                    </View>
                </View>
            ))}
        </View>

        {/* HbA1c Chart */}
        <View style={st.card}>
            <CardHeader title="Glycaemic Response – HbA1c Longitudinal" sub="Metformin initiated Sep 2023 · Serial glycated haemoglobin" right={<Badge sc="ok" label="↑ Improving" />} />
            <View style={[st.cardBody, { paddingTop: vs(4) }]}>
                <BarChart data={HBAC1_DATA.map((v, i) => ({ l: HBAC1_LABS[i], v }))} color={HBAC1_DATA.map(v => v > 6.5 ? C.crit : v > 5.7 ? C.warn : C.ok)} maxVal={8} height={vs(70)} />
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.ok }]} />
                    <Text style={[st.chartRefTxt, { color: C.ok }]}>Threshold 5.7%</Text>
                </View>
            </View>
        </View>

        {/* Treatment Response Matrix */}
        <View style={st.card}>
            <CardHeader title="Treatment Response Matrix" sub="Drug efficacy mapped to target biomarker outcome" />
            <View style={{ paddingHorizontal: ms(4) }}>
                {TRX_MATRIX.map((t, i) => (
                    <View key={i} style={[st.trkRow, i === TRX_MATRIX.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={st.trkDrug} numberOfLines={1}>{t.drug}</Text>
                        <Text style={st.trkMarker}>{t.marker}</Text>
                        <View style={st.trkBar}><View style={[st.trkFill, { width: `${t.pct}%`, backgroundColor: t.col }]} /></View>
                        <Text style={[st.trkChange, { color: t.col }]}>{t.change}</Text>
                        <Badge sc={t.vc} label={t.v} />
                    </View>
                ))}
            </View>
        </View>

        {/* Clinical Encounter Timeline */}
        <View style={st.card}>
            <CardHeader title="Clinical Encounter Timeline" sub="Multi-disciplinary key events" right={<Badge sc="dim" label="34 All-time" />} />
            <View style={{ paddingLeft: ms(6), paddingTop: vs(4) }}>
                {ENCOUNTER_TIMELINE.map((e, i) => (
                    <View key={i} style={st.ctItem}>
                        <View style={st.ctLeft}>
                            <View style={[st.ctDot, { backgroundColor: e.col }]} />
                            {i < ENCOUNTER_TIMELINE.length - 1 && <View style={st.ctLine} />}
                        </View>
                        <View style={st.ctBody}>
                            <Text style={st.ctDate}>{e.dt}</Text>
                            <Text style={st.ctTitle}>{e.title}</Text>
                            <Text style={st.ctMeta}>{e.meta}</Text>
                            <Badge sc="acc" label={e.tag} style={{ alignSelf: 'flex-start', marginTop: vs(4) }} />
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Active Problem List */}
        <View style={st.card}>
            <CardHeader title="Active Problem List" sub="ICD-10 coded · 4 conditions" right={<Badge sc="crit" label="4 Active" />} />
            {PROBLEMS.map((p, i) => (
                <View key={i} style={[st.probRow, i === PROBLEMS.length - 1 && { borderBottomWidth: 0 }]}>
                    <Text style={st.probIcd}>{p.icd}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={st.probName}>{p.name}</Text>
                        <Text style={st.probMeta}>{p.meta}</Text>
                    </View>
                    <Badge sc={p.active ? p.sc : 'dim'} label={p.active ? 'Active' : 'Resolved'} />
                </View>
            ))}
        </View>

        {/* Allergies */}
        <View style={st.card}>
            <CardHeader title="Allergies & Contraindications" />
            <View style={st.cardBody}>
                <View style={[st.allergyStrip]}>
                    <Text style={[st.allergyTitle]}>⚠ Documented Drug Allergies</Text>
                    {[
                        { drug:'Penicillin / Amoxicillin', rxn:'Urticaria, angioedema', sc:'crit' },
                        { drug:'Sulfonamides',             rxn:'Rash (suspected)',       sc:'warn' },
                    ].map((a, i) => (
                        <View key={i} style={st.allergyRow}>
                            <Text style={st.allergyDrug}>{a.drug}</Text>
                            <Text style={st.allergyRxn}>{a.rxn}</Text>
                            <Badge sc={a.sc} label={a.sc === 'crit' ? 'HIGH' : 'MOD'} />
                        </View>
                    ))}
                </View>
                <Text style={st.allergyNote}>NKDA to contrast media · No food allergies documented{'\n'}Last verified: 09-Mar-2025</Text>
            </View>
        </View>

        {/* Vitals */}
        <View style={st.card}>
            <CardHeader title="Vitals – Last Encounter" sub="09-Mar-2025 · Apollo Hospitals OPD" />
            <View style={[st.cardBody, { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) }]}>
                {VITALS.map((v, i) => (
                    <View key={i} style={st.vitalCard}>
                        <Text style={st.vitalLbl}>{v.lbl}</Text>
                        <Text style={[st.vitalVal, { color: v.col }]}>{v.val}<Text style={st.vitalUnit}> {v.unit}</Text></Text>
                        <Text style={st.vitalSub}>{v.sub}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Pending Orders */}
        <View style={st.card}>
            <CardHeader title="Pending Orders" right={<Badge sc="crit" label="2 Urgent" />} />
            {PENDING_ORDERS.map((o, i) => (
                <View key={i} style={[st.probRow, i === PENDING_ORDERS.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={st.probName}>{o.t}</Text>
                        <Text style={st.probMeta}>{o.m}</Text>
                    </View>
                    <Badge sc={o.sc} label={o.s} />
                </View>
            ))}
        </View>

        {/* 10-Year CVD Risk */}
        <View style={st.card}>
            <CardHeader title="10-Year CVD Risk" sub="ACC/AHA Pooled Cohort Equations" />
            <View style={st.cardBody}>
                <View style={{ alignItems: 'center', marginBottom: vs(10) }}>
                    <Text style={[st.cvdScore, { color: C.warn }]}>8.4<Text style={st.cvdUnit}>%</Text></Text>
                    <Text style={st.cvdLabel}>Intermediate Risk</Text>
                </View>
                {/* Risk gauge */}
                <View style={st.riskGauge}>
                    <LinearGradient colors={[C.ok, '#EAB308', C.crit]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.riskGaugeFill} />
                    <View style={[st.riskNeedle, { left: '28%', backgroundColor: C.warn }]} />
                </View>
                <View style={st.riskLabels}>
                    <Text style={st.riskLbl}>Low &lt;5%</Text>
                    <Text style={st.riskLbl}>Intermediate</Text>
                    <Text style={st.riskLbl}>High &gt;20%</Text>
                </View>
                <RowDivider />
                {CVD_RISK_FACTORS.map((r, i) => (
                    <View key={i} style={st.cvdFRow}>
                        <Text style={st.cvdFLabel}>{r.label}</Text>
                        <Text style={[st.cvdFVal, { color: r.col }]}>{r.sign}{r.val}</Text>
                    </View>
                ))}
                <RowDivider />
                <InsightBox text="Action: T2DM + intermediate risk = high-benefit statin candidate (ACC/AHA 2019). Target LDL <100 mg/dL. Reassess after Apr 5 lipid panel." />
            </View>
        </View>

        {/* Renal Function */}
        <View style={st.card}>
            <CardHeader title="Renal Function & CKD Staging" sub="KDIGO 2024 · Metformin dose check" />
            <View style={st.cardBody}>
                <View style={st.renalRow}>
                    <View>
                        <Text style={st.renalStgLbl}>CURRENT STAGE</Text>
                        <Badge sc="ok" label="CKD G2 A1" />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={st.renalEgfrLbl}>eGFR</Text>
                        <Text style={[st.renalEgfr, { color: C.ok }]}>82</Text>
                        <Text style={st.renalEgfrUnit}>mL/min/1.73m²</Text>
                    </View>
                </View>
                {/* eGFR trend bars */}
                <View style={{ marginVertical: vs(8) }}>
                    <BarChart data={[{l:"Jan'24",v:85},{l:'Apr',v:84},{l:'Jul',v:83},{l:'Oct',v:82},{l:"Jan'25",v:82},{l:"Mar'25",v:82}]} color={C.ok} maxVal={100} height={vs(55)} />
                </View>
                <RowDivider />
                <Text style={st.renalNote}><Text style={{ color: C.ok, fontFamily: interMedium }}>✓ Metformin safe</Text> – eGFR ≥60. Urine microalbumin ordered (09-Mar-25) – pending. ACR not yet available. Recheck eGFR in 6 months.</Text>
            </View>
        </View>

        {/* Medication Adherence */}
        <View style={st.card}>
            <CardHeader title="Medication Adherence" sub="Pharmacy refill data · PDC 90 days" />
            <View style={st.cardBody}>
                {RX_DATA.map((r, i) => {
                    const adh = [92, 90, 88, 80, 85][i];
                    const col = adhColor(adh);
                    return (
                        <View key={i} style={[st.trkRow, i === RX_DATA.length - 1 && { borderBottomWidth: 0 }]}>
                            <Text style={[st.trkDrug, { width: ms(110) }]} numberOfLines={1}>{r.n.split(' ').slice(0, 2).join(' ')}</Text>
                            <View style={[st.trkBar, { flex: 1 }]}><View style={[st.trkFill, { width: `${adh}%`, backgroundColor: col }]} /></View>
                            <Text style={[st.trkChange, { color: col }]}>{adh}%</Text>
                        </View>
                    );
                })}
                <RowDivider />
                <Text style={st.renalNote}>Overall 30-day PDC <Text style={{ color: C.warn, fontFamily: interMedium }}>87%</Text>. Night-dose miss rate highest. Weekend adherence drops 14%. Vit D3 supply critically low – 5 days remaining.</Text>
            </View>
        </View>

        {/* Last Encounter Summary */}
        <View style={st.card}>
            <CardHeader title="Last Encounter Summary" sub="09-Mar-2025 · Endocrinology OPD · Dr. P. Nair" />
            <View style={st.cardBody}>
                <Text style={st.encounterSummary}>
                    <Text style={{ fontFamily: interMedium, color: blackColor }}>A/P: </Text>
                    T2DM improving – HbA1c 5.9%, bordering normal. Dyslipidaemia active – statin response check pending Apr 5. Vit D repletion ongoing – refill critical. Possible statin myalgia (leg heaviness) – CK ordered. Continue current regimen. Follow-up Jun 2025 or sooner if myalgia worsens.
                </Text>
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 – LABORATORY RESULTS
// ═══════════════════════════════════════════════════════════════════════════════
const LabPanel = ({ title, sub, badgeSc, badgeLabel, items }) => (
    <View style={st.card}>
        <CardHeader title={title} sub={sub} right={<Badge sc={badgeSc} label={badgeLabel} />} />
        <View style={st.labGrid}>
            {items.map((l, i) => (
                <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                    <LabCard item={l} />
                </View>
            ))}
        </View>
    </View>
);

const TabLabs = () => (
    <View>
        <LabPanel title="Glycaemic Panel" sub="09-Mar-2025 · Apollo Diagnostics" badgeSc="warn" badgeLabel="1 Abnormal" items={LAB_GLYC} />
        <LabPanel title="Lipid Profile"   sub="14-Feb-2025 · Dr. Lal Pathlabs"  badgeSc="crit" badgeLabel="1 Abnormal" items={LAB_LIPID} />
        <LabPanel title="Haematology – CBC" sub="09-Mar-2025 · Apollo Diagnostics" badgeSc="warn" badgeLabel="1 Low"    items={LAB_HAEM} />
        <LabPanel title="Thyroid + Micronutrients" sub="12-Nov-2024 · Thyrocare" badgeSc="crit" badgeLabel="2 Abnormal" items={LAB_THYROID} />

        {/* Lab Session History – timeline cards */}
        <View style={st.card}>
            <CardHeader title="Laboratory Session History" sub="All diagnostic encounters" />
            <View style={{ paddingHorizontal: ms(12), paddingTop: vs(8), paddingBottom: vs(4) }}>
                {LAB_HISTORY.map((l, i) => (
                    <View key={i} style={st.sessionItem}>
                        {/* Left: timeline dot + line */}
                        <View style={st.sessionLeft}>
                            <View style={[st.sessionDot, { backgroundColor: l.abn === 'None' ? C.ok : C.crit }]} />
                            {i < LAB_HISTORY.length - 1 && <View style={st.sessionLine} />}
                        </View>
                        {/* Right: session card */}
                        <View style={[st.sessionCard, i === LAB_HISTORY.length - 1 && { marginBottom: 0 }]}>
                            {/* Date + status */}
                            <View style={st.sessionCardTop}>
                                <Text style={st.sessionDate}>{l.dt}</Text>
                                <Badge sc="ok" label={l.s} />
                            </View>
                            {/* Provider + ordered by */}
                            <Text style={st.sessionProvider}>{l.p}</Text>
                            <Text style={st.sessionOrderedBy}>Ordered by {l.by}</Text>
                            {/* Panels as chips */}
                            <View style={st.sessionPanelRow}>
                                {l.panel.split(' · ').map((p, pi) => (
                                    <View key={pi} style={st.sessionPanelChip}>
                                        <Text style={st.sessionPanelTxt}>{p}</Text>
                                    </View>
                                ))}
                            </View>
                            {/* Abnormals + cost */}
                            <View style={st.sessionBottom}>
                                <View style={[st.sessionAbnWrap, { backgroundColor: l.abn.includes('H') || l.abn.includes('L') ? C.critL : C.okL }]}>
                                    <Icon type={Icons.Ionicons} name={l.abn.includes('H') || l.abn.includes('L') ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={ms(12)} color={l.abn.includes('H') || l.abn.includes('L') ? C.crit : C.ok} />
                                    <Text style={[st.sessionAbn, { color: l.abn.includes('H') || l.abn.includes('L') ? C.crit : C.ok }]}>{l.abn}</Text>
                                </View>
                                <Text style={st.sessionCost}>{l.c}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Pending Labs – alert cards */}
        <View style={st.card}>
            <CardHeader title="Pending Laboratory Orders" sub="Ordered · awaiting collection" right={<Badge sc="crit" label="2 Urgent" />} />
            <View style={{ padding: ms(12), gap: vs(8) }}>
                {PEND_LABS.map((o, i) => (
                    <View key={i} style={st.pendingLabCard}>
                        <View style={[st.pendingLabIcon, { backgroundColor: C.critL }]}>
                            <Icon type={Icons.Ionicons} name="flask-outline" size={ms(18)} color={C.crit} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={st.pendingLabTitle}>{o.t}</Text>
                            <Text style={st.pendingLabMeta}>{o.m}</Text>
                        </View>
                        <Badge sc={o.sc} label="URGENT" />
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 – PHARMACOTHERAPY
// ═══════════════════════════════════════════════════════════════════════════════
const TabMedications = () => (
    <View>
        {/* Active Prescriptions – drug cards */}
        <View style={st.card}>
            <CardHeader title="Active Prescriptions – Medication Reconciliation" sub="5 active agents · Last reconciled 09-Mar-2025" right={<Badge sc="flag" label="1 DDI Flagged" />} />
            <View style={{ padding: ms(10) }}>
                {RX_DATA.map((r, i) => {
                    const adh = [92, 90, 88, 80, 85][i];
                    const col = adhColor(adh);
                    const sc  = adh >= 90 ? 'ok' : adh >= 80 ? 'warn' : 'crit';
                    const hasNote = r.note.startsWith('⚠');
                    return (
                        <View key={i} style={[st.rxCard, hasNote && { borderLeftColor: C.warn, borderLeftWidth: 3 }]}>
                            {/* Row 1: name + PDC badge */}
                            <View style={st.rxCardTop}>
                                <Text style={st.rxCardName} numberOfLines={1}>{r.n}</Text>
                                <Badge sc={sc} label={`PDC ${adh}%`} />
                            </View>
                            {/* Row 2: dose chips */}
                            <View style={st.rxChipRow}>
                                <View style={st.rxChip}><Text style={st.rxChipTxt}>{r.dose}</Text></View>
                                <View style={st.rxChip}><Text style={st.rxChipTxt}>{r.route}</Text></View>
                                <View style={[st.rxChip, { backgroundColor: primaryColor + '10', borderColor: primaryColor + '30' }]}><Text style={[st.rxChipTxt, { color: primaryColor }]}>{r.freq}</Text></View>
                            </View>
                            {/* Row 3: indication */}
                            <Text style={st.rxInd}>{r.ind}</Text>
                            {/* Row 4: prescriber + date + PDC bar */}
                            <View style={st.rxCardMeta}>
                                <View style={{ flex: 1 }}>
                                    <Text style={st.rxMetaTxt}>{r.by} · Since {r.start}</Text>
                                    <View style={[st.adhBarWide, { marginTop: vs(4) }]}>
                                        <View style={[st.adhBarWideFill, { width: `${adh}%`, backgroundColor: col }]} />
                                    </View>
                                </View>
                            </View>
                            {/* Warning note */}
                            {hasNote && (
                                <View style={st.rxNote}>
                                    <Icon type={Icons.Ionicons} name="warning-outline" size={ms(12)} color={C.warn} />
                                    <Text style={st.rxNoteTxt}>{r.note.replace('⚠ ', '')}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>

        {/* DDI Panel */}
        <View style={st.card}>
            <CardHeader title="Drug Interaction Analysis" sub="In-silico DDI screening" right={<Badge sc="warn" label="1 Moderate" />} />
            <View style={st.cardBody}>
                <View style={[st.ddiBox, { backgroundColor: C.warnL, borderColor: C.warnB, borderLeftColor: C.warn }]}>
                    <View style={st.ddiHdr}>
                        <Text style={st.ddiDrug}>Rosuvastatin ↔ Cholecalciferol 60K IU</Text>
                        <Badge sc="warn" label="DDI MODERATE" />
                    </View>
                    <Text style={[st.ddiBody, { color: C.slate }]}>High-dose Vitamin D3 may potentiate rosuvastatin-induced myopathy via CYP27B1-mediated calcium dysregulation. Patient reports leg heaviness – clinical significance uncertain pending CK result.</Text>
                    <Text style={[st.ddiAction, { color: C.warn }]}>→ Await CK result · Review Vit D dose at May recheck · Counsel on myalgia red flags</Text>
                </View>
                <View style={[st.ddiBox, { backgroundColor: C.surface, borderColor: C.border, borderLeftColor: C.gray, marginBottom: 0 }]}>
                    <View style={st.ddiHdr}>
                        <Text style={st.ddiDrug}>Metformin ↔ Pantoprazole</Text>
                        <Badge sc="dim" label="DDI MINOR" />
                    </View>
                    <Text style={[st.ddiBody, { color: C.slate }]}>Chronic PPI use may reduce B12 absorption. Risk fully mitigated by concurrent Methylcobalamin 1500mcg supplementation (B12 rising 210→280 pg/mL).</Text>
                    <Text style={[st.ddiAction, { color: C.muted }]}>→ No action required · Monitor B12 at 6-month intervals</Text>
                </View>
            </View>
        </View>

        {/* Renal Dose */}
        <View style={st.card}>
            <CardHeader title="Renal Dose Appropriateness" sub="eGFR 82 mL/min · All active agents" right={<Badge sc="ok" label="All Safe" />} />
            <View style={st.cardBody}>
                {RX_DATA.map((r, i) => (
                    <View key={i} style={[st.trkRow, i === RX_DATA.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={[st.trkDrug, { width: ms(120) }]} numberOfLines={1}>{r.n.split(' ').slice(0, 2).join(' ')}</Text>
                        <Text style={[st.trkMarker, { flex: 1 }]}>Safe at eGFR 82 mL/min · No dose adjustment required</Text>
                        <Badge sc="ok" label="Safe" />
                    </View>
                ))}
            </View>
        </View>

        {/* PDC Chart */}
        <View style={st.card}>
            <CardHeader title="Proportion of Days Covered (PDC)" sub="Refill-based adherence · Last 90 days" />
            <View style={st.cardBody}>
                <BarChart
                    data={RX_DATA.map((r, i) => ({ l: r.n.split(' ')[0], v: [92, 90, 88, 80, 85][i] }))}
                    color={[92, 90, 88, 80, 85].map(v => v >= 90 ? C.ok : v >= 80 ? C.warn : C.crit)}
                    maxVal={100} height={vs(100)}
                />
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.gray }]} />
                    <Text style={[st.chartRefTxt, { color: C.gray }]}>Target 95%</Text>
                </View>
            </View>
        </View>

        {/* Supply Status */}
        <View style={st.card}>
            <CardHeader title="Supply Status & Refill Urgency" sub="Days of supply remaining" />
            <View style={st.cardBody}>
                {RX_DATA.map((r, i) => {
                    const key = supplyKey(r.n);
                    const d = SUPPLY[key] || 30;
                    const pct = Math.min(100, Math.round((d / 90) * 100));
                    const col = d <= 7 ? C.crit : d <= 20 ? C.warn : C.ok;
                    const sc = d <= 7 ? 'crit' : d <= 20 ? 'warn' : 'ok';
                    return (
                        <View key={i} style={[st.trkRow, i === RX_DATA.length - 1 && { borderBottomWidth: 0 }]}>
                            <Text style={st.trkDrug} numberOfLines={1}>{r.n.split(' ').slice(0, 2).join(' ')}</Text>
                            <View style={[st.trkBar, { flex: 1 }]}><View style={[st.trkFill, { width: `${pct}%`, backgroundColor: col }]} /></View>
                            <Text style={[st.trkChange, { color: col }]}>{d}d</Text>
                            <Badge sc={sc} label={d <= 7 ? 'URGENT' : d <= 20 ? 'Refill Soon' : 'OK'} />
                        </View>
                    );
                })}
            </View>
        </View>

        {/* Discontinued Medications – list cards */}
        <View style={st.card}>
            <CardHeader title="Discontinued Medications" sub="Complete pharmacotherapy record" />
            <View style={{ padding: ms(10) }}>
                {DISC_RX.map((d, i) => (
                    <View key={i} style={[st.discCard, i === DISC_RX.length - 1 && { marginBottom: 0 }]}>
                        <View style={st.discCardTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={st.discName}>{d.n}</Text>
                                <Text style={st.discInd}>{d.ind}</Text>
                            </View>
                            <Badge sc="dim" label="Stopped" />
                        </View>
                        <View style={st.discRow}>
                            <View style={st.discChip}>
                                <Icon type={Icons.Ionicons} name="calendar-outline" size={ms(11)} color={C.muted} />
                                <Text style={st.discChipTxt}>{d.dur}</Text>
                            </View>
                            <View style={st.discChip}>
                                <Icon type={Icons.Ionicons} name="person-outline" size={ms(11)} color={C.muted} />
                                <Text style={st.discChipTxt}>{d.by}</Text>
                            </View>
                        </View>
                        <Text style={st.discReason}>{d.r}</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 – BIOMARKER TRENDS
// ═══════════════════════════════════════════════════════════════════════════════
const TabTrends = () => (
    <View>
        <View style={st.card}>
            <CardHeader title="HbA1c – Longitudinal" sub="Serial glycaemic control · Diabetic threshold 5.7%" right={<Badge sc="ok" label="↑ Improving" />} />
            <View style={st.cardBody}>
                <BarChart data={HBAC1_TREND} color={HBAC1_TREND.map(d => d.v > 6.5 ? C.crit : d.v > 5.7 ? C.warn : C.ok)} maxVal={8} height={vs(100)} />
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.ok }]} />
                    <Text style={[st.chartRefTxt, { color: C.ok }]}>Threshold 5.7%</Text>
                </View>
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Lipid Panel – Longitudinal" sub="LDL-C · HDL-C · Rosuvastatin initiated Feb '25" right={<Badge sc="warn" label="LDL Above Target" />} />
            <View style={st.cardBody}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: ms(6), height: vs(120) }}>
                    {LIPID_TREND.map((d, i) => {
                        const maxLdl = 160;
                        const ldlH = (d.ldl / maxLdl) * vs(100);
                        const hdlH = (d.hdl / maxLdl) * vs(100);
                        return (
                            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: vs(120) }}>
                                <Text style={st.chartVal}>{d.ldl}</Text>
                                <View style={{ width: '45%', height: ldlH, backgroundColor: C.crit, borderRadius: ms(3) }} />
                                <View style={{ width: ms(4) }} />
                                <View style={{ position: 'absolute', bottom: vs(18), right: '8%', width: '35%', height: hdlH, backgroundColor: C.ok, borderRadius: ms(3) }} />
                                <Text style={st.chartLbl} numberOfLines={1}>{d.l}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={[st.chartRefLine, { marginTop: vs(4) }]}>
                    <View style={[st.legendDot, { backgroundColor: C.crit }]} />
                    <Text style={[st.chartRefTxt, { color: C.muted }]}>LDL-C</Text>
                    <View style={[st.legendDot, { backgroundColor: C.ok, marginLeft: ms(8) }]} />
                    <Text style={[st.chartRefTxt, { color: C.muted }]}>HDL-C</Text>
                    <View style={[st.chartRefDash, { backgroundColor: C.warn, marginLeft: ms(8) }]} />
                    <Text style={[st.chartRefTxt, { color: C.warn }]}>LDL Target 130</Text>
                </View>
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Vitamin D3 & B12 – Repletion Response" sub="Supplementation Dec 2024 · Actual + projected" />
            <View style={st.cardBody}>
                <BarChart data={VITD_TREND} color={VITD_TREND.map(d => d.d >= 30 ? C.ok : d.d >= 20 ? C.warn : C.crit)} maxVal={50} height={vs(100)} valKey="d" />
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.ok }]} />
                    <Text style={[st.chartRefTxt, { color: C.ok }]}>Target 30 ng/mL</Text>
                </View>
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Haemoglobin – 3-Year View" sub="Borderline chronic anaemia – investigate aetiology" right={<Badge sc="warn" label="Static Low" />} />
            <View style={st.cardBody}>
                <BarChart data={HGB_TREND} color={HGB_TREND.map(d => d.v >= 13.5 ? C.ok : C.warn)} maxVal={15} height={vs(100)} />
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.ok }]} />
                    <Text style={[st.chartRefTxt, { color: C.ok }]}>Lower limit 13.5 g/dL</Text>
                </View>
            </View>
        </View>

        {/* Multi-Biomarker Correlation */}
        <View style={st.card}>
            <CardHeader title="Multi-Biomarker Correlation" sub="HbA1c · LDL · Vit D3 · Hgb – scaled co-visualisation" />
            <View style={st.cardBody}>
                {[
                    { lbl:'HbA1c (×10)',  vals:[64,62,65,68,59],  col:C.warn },
                    { lbl:'LDL-C (÷5)',   vals:[null,null,28,null,28], col:C.crit },
                    { lbl:'Vit D3',       vals:[null,null,null,14,null],col:C.info },
                    { lbl:'Hgb (×10)',    vals:[134,134,131,133,132],col:C.purple },
                ].map((series, si) => (
                    <View key={si} style={{ marginBottom: vs(10) }}>
                        <View style={st.multiRow}>
                            <View style={[st.legendDot, { backgroundColor: series.col }]} />
                            <Text style={[st.trkMarker, { flex: 1 }]}>{series.lbl}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: ms(4), marginTop: vs(3) }}>
                            {["Feb'24","May","Aug","Nov","Mar'25"].map((l, li) => {
                                const v = series.vals[li];
                                const maxV = Math.max(...series.vals.filter(Boolean));
                                return (
                                    <View key={li} style={{ flex: 1, alignItems: 'center' }}>
                                        {v != null ? (
                                            <View style={{ width: '70%', height: vs((v / maxV) * 30), backgroundColor: series.col, borderRadius: ms(2) }} />
                                        ) : (
                                            <View style={{ width: '70%', height: vs(2), backgroundColor: '#E2E8F0' }} />
                                        )}
                                        <Text style={[st.chartLbl, { fontSize: ms(7.5) }]} numberOfLines={1}>{l}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Biomarker Status Summary – 2-col cards */}
        <View style={st.card}>
            <CardHeader title="Biomarker Status Summary" sub="All tracked parameters with HPS sub-scores" />
            <View style={st.labGrid}>
                {BM_SUMMARY.map((b, i) => {
                    const hpsCol = b.hps >= 85 ? C.ok : b.hps >= 65 ? C.warn : C.crit;
                    const hpsSc  = b.hps >= 85 ? 'ok' : b.hps >= 65 ? 'warn' : 'crit';
                    const trCol  = b.tr.startsWith('↓') ? C.ok : b.tr.startsWith('↑') ? C.info : C.gray;
                    return (
                        <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                            <View style={[st.labCard, { borderTopWidth: 3, borderTopColor: hpsCol }]}>
                                <Text style={[st.labCardName, { marginBottom: vs(4) }]} numberOfLines={2}>{b.name}</Text>
                                <Text style={[st.labCardVal, { color: hpsCol, fontSize: ms(15) }]}>{b.val}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(6), marginBottom: vs(5) }}>
                                    <Badge sc={b.sc} label={b.st} />
                                    <Text style={[{ fontFamily: interMedium, fontSize: ms(11), color: trCol }]}>{b.tr.split(' ')[0]}</Text>
                                </View>
                                <View style={st.progWrap}>
                                    <View style={[st.progFill, { width: `${b.hps}%`, backgroundColor: hpsCol }]} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4) }}>
                                    <Text style={[{ fontFamily: interMedium, fontSize: ms(10), color: hpsCol }]}>HPS {b.hps}</Text>
                                    <Badge sc={hpsSc} label={b.hps >= 85 ? 'Good' : b.hps >= 65 ? 'Fair' : 'Poor'} />
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5 – CLINICAL NOTES
// ═══════════════════════════════════════════════════════════════════════════════
const TabNotes = () => (
    <View>
        <View style={st.card}>
            <CardHeader title="Progress Notes" sub="SOAP format · Multi-disciplinary" />
            <View style={st.cardBody}>
                {PROG_NOTES.map((n, i) => (
                    <View key={i} style={[st.noteCard, i === PROG_NOTES.length - 1 && { marginBottom: 0 }]}>
                        <View style={st.noteHdr}>
                            <Text style={st.noteDr}>{n.dr}</Text>
                            <Badge sc="acc" label={n.type} />
                            <Text style={st.noteDate}>{n.dt}</Text>
                        </View>
                        <Text style={st.noteRole}>{n.role}</Text>
                        <View style={st.noteSoap}>
                            <Text style={st.noteSoapTxt}><Text style={st.noteSoapLbl}>S: </Text>{n.s}</Text>
                            <Text style={st.noteSoapTxt}><Text style={st.noteSoapLbl}>O: </Text>{n.o}</Text>
                            <Text style={st.noteSoapTxt}><Text style={st.noteSoapLbl}>A: </Text>{n.a}</Text>
                            <Text style={st.noteSoapTxt}><Text style={st.noteSoapLbl}>P: </Text>{n.p}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Referral Network" sub="Inbound & outbound" />
            <View style={st.cardBody}>
                {REFERRALS.map((r, i) => (
                    <View key={i} style={[st.rankRow, i === REFERRALS.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={st.rankName}>{r.f} → {r.t}</Text>
                            <Text style={st.rankMeta}>{r.r}</Text>
                        </View>
                        <Text style={st.rankDate}>{r.dt}</Text>
                    </View>
                ))}
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Preventive Care Checklist" sub="Guideline-recommended screenings" />
            <View style={st.cardBody}>
                {PREV_CARE.map((p, i) => {
                    const label = p.sc === 'crit' ? 'Pending' : p.sc === 'dim' ? 'Not due' : 'Done';
                    return (
                        <View key={i} style={[st.rankRow, i === PREV_CARE.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={st.rankName}>{p.item}</Text>
                                <Text style={st.rankMeta}>Last: {p.last} · Due: {p.due}</Text>
                            </View>
                            <Badge sc={p.sc} label={label} />
                        </View>
                    );
                })}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 6 – RISK STRATIFICATION
// ═══════════════════════════════════════════════════════════════════════════════
const TabRisk = () => (
    <View>
        <View style={st.card}>
            <CardHeader title="Risk Factor Analysis" sub="Modifiable vs non-modifiable contributions" />
            <View style={st.cardBody}>
                {/* Radar as progress bars */}
                {[
                    { label:'Glycaemia',    pct:65, col:C.warn },
                    { label:'Lipids',       pct:80, col:C.crit },
                    { label:'Blood Pressure',pct:30, col:C.ok },
                    { label:'Renal',        pct:25, col:C.ok },
                    { label:'Weight',       pct:55, col:C.warn },
                    { label:'Lifestyle',    pct:35, col:C.info },
                ].map((r, i) => (
                    <View key={i} style={[st.trkRow, i === 5 && { borderBottomWidth: 0 }]}>
                        <Text style={[st.trkDrug, { width: ms(110) }]}>{r.label}</Text>
                        <View style={[st.trkBar, { flex: 1 }]}><View style={[st.trkFill, { width: `${r.pct}%`, backgroundColor: r.col }]} /></View>
                        <Text style={[st.trkChange, { color: r.col }]}>{r.pct}</Text>
                    </View>
                ))}
                <RowDivider />
                <SectionLbl title="Risk Factors" />
                {RISK_FACTORS.map((r, i) => (
                    <View key={i} style={[st.rankRow, i === RISK_FACTORS.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={st.rankName}>{r.f}</Text>
                            <Text style={st.rankMeta}>{r.mod ? 'Modifiable' : 'Non-modifiable'}</Text>
                        </View>
                        <Badge sc={r.sc} label={r.impact} />
                    </View>
                ))}
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Diabetic Complication Risk" sub="Micro & macrovascular indices" />
            <View style={st.cardBody}>
                {RISK_DM.map((d, i) => {
                    const label = d.sc === 'ok' ? 'Clear' : d.sc === 'crit' ? 'Pending' : 'Monitor';
                    return (
                        <View key={i} style={[st.rankRow, i === RISK_DM.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={st.rankName}>{d.label}</Text>
                                <Text style={st.rankMeta}>{d.status}</Text>
                            </View>
                            <Badge sc={d.sc} label={label} />
                        </View>
                    );
                })}
            </View>
        </View>

        <View style={st.card}>
            <CardHeader title="Evidence-Based Clinical Recommendations" sub="ADA 2024 · ACC/AHA 2019 · KDIGO 2024 guideline alignment" right={<Badge sc="info" label="4 Actions" />} />
            <View style={st.cardBody}>
                {CLIN_RECS.map((r, i) => (
                    <View key={i} style={[st.recRow, i === CLIN_RECS.length - 1 && { borderBottomWidth: 0, marginBottom: 0 }]}>
                        <View style={[st.recNo, { backgroundColor: C.accL }]}>
                            <Text style={[st.recNoTxt, { color: C.acc }]}>{r.no}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={st.recTitle}>{r.rec}</Text>
                            <Text style={st.recBasis}>{r.basis}</Text>
                        </View>
                        <Badge sc={r.pc} label={r.priority} style={{ alignSelf: 'flex-start' }} />
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HOLISTIC HEALTH DATA
// ═══════════════════════════════════════════════════════════════════════════════
const HL_KPI = [
    { lbl:'Overall Wellness', val:'72', unit:'/100', sub:'Moderate',      col:C.warn, tc:C.warn },
    { lbl:'Physical Activity', val:'45', unit:'%',   sub:'Below Target',  col:C.crit, tc:C.crit },
    { lbl:'Nutrition Quality', val:'68', unit:'%',   sub:'Fair',          col:C.warn, tc:C.warn },
    { lbl:'Mental Wellness',   val:'61', unit:'%',   sub:'Moderate',      col:C.info, tc:C.info },
];
const DOMAINS = [
    { name:'Physical Activity', score:45, target:70, col:'#EF4444', sc:'crit',  meta:'Sedentary – <30 min/day exercise' },
    { name:'Nutrition',         score:68, target:80, col:'#F59E0B', sc:'warn',  meta:'High GI diet · low fibre intake' },
    { name:'Sleep',             score:55, target:75, col:'#6D28D9', sc:'warn',  meta:'6.4 hrs avg · poor sleep quality' },
    { name:'Stress Management', score:40, target:70, col:'#EF4444', sc:'crit',  meta:'PHQ-9: 8 · GAD-7: 6 (mild-mod)' },
    { name:'Hydration',         score:72, target:80, col:'#0EA5E9', sc:'ok',    meta:'1.8L/day · marginal' },
    { name:'Smoking/Alcohol',   score:90, target:95, col:'#16A34A', sc:'ok',    meta:'Non-smoker · social drinker' },
    { name:'Social Wellbeing',  score:74, target:80, col:'#16A34A', sc:'ok',    meta:'Good support network' },
    { name:'Preventive Care',   score:82, target:90, col:'#1D4ED8', sc:'info',  meta:'Vaccinations current · dental overdue' },
];
const WEARABLE = [
    { icon:'moon-outline',         lbl:'Avg Sleep',       val:'6.4 hrs',   sub:'Target: 7-9 hrs',   col:C.purple, sc:'warn' },
    { icon:'footsteps-outline',    lbl:'Daily Steps',     val:'4,823',     sub:'Target: 8,000',     col:C.crit,   sc:'crit' },
    { icon:'heart-outline',        lbl:'Resting HR',      val:'72 bpm',    sub:'Normal range',      col:C.ok,     sc:'ok' },
    { icon:'pulse-outline',        lbl:'SpO₂',            val:'98%',       sub:'Normal',            col:C.ok,     sc:'ok' },
    { icon:'flame-outline',        lbl:'Active Calories', val:'1,820',     sub:'Target: 2,500',     col:C.warn,   sc:'warn' },
    { icon:'thermometer-outline',  lbl:'Body Temp',       val:'36.6 °C',   sub:'Normal',            col:C.ok,     sc:'ok' },
    { icon:'fitness-outline',      lbl:'HRV',             val:'42 ms',     sub:'Below optimal',     col:C.warn,   sc:'warn' },
    { icon:'water-outline',        lbl:'Hydration',       val:'1.8 L/day', sub:'Target: 2.5L',      col:C.info,   sc:'info' },
];
const CORRELATIONS = [
    { ls:'Low Physical Activity', bm:'HbA1c',     dir:'↑ Increases', note:'Exercise improves insulin sensitivity',    col:C.crit },
    { ls:'High GI Diet',          bm:'Blood Glucose', dir:'↑ Spikes', note:'Complex carbs reduce post-prandial rise', col:C.warn },
    { ls:'Poor Sleep (<6.5 hrs)', bm:'Cortisol',  dir:'↑ Elevates',  note:'Sleep deprivation raises stress hormones', col:C.purple },
    { ls:'Sedentary Lifestyle',   bm:'LDL-C',     dir:'↑ Worsens',   note:'Activity improves lipid metabolism',       col:C.crit },
    { ls:'Stress (PHQ-9: 8)',     bm:'Blood Pressure', dir:'↑ Raises', note:'Mind-body interventions reduce BP',      col:C.warn },
    { ls:'Low Hydration (1.8L)',  bm:'Creatinine', dir:'↑ Increases', note:'Adequate hydration supports renal function', col:C.info },
];
const LS_MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const LS_TREND  = [52, 55, 50, 58, 60, 57, 62, 65, 63, 68, 70, 72];
const LS_RX = [
    { no:1, goal:'Increase Physical Activity', current:'<2,000 steps/day',  target:'8,000 steps/day',  advice:'Start brisk 20-min walk 5×/week; progress weekly',     col:C.crit },
    { no:2, goal:'Mediterranean Diet',         current:'High GI · low fibre', target:'Fibre >25g/day',  advice:'Replace white rice with millets; add dhal, greens daily', col:C.warn },
    { no:3, goal:'Improve Sleep Hygiene',      current:'6.4 hrs · poor quality', target:'7-8 hrs deep sleep', advice:'Consistent bedtime 10 PM; no screens 1 hr before bed', col:C.purple },
    { no:4, goal:'Stress Reduction',           current:'PHQ-9: 8 · GAD-7: 6', target:'PHQ-9 <5',        advice:'10-min guided meditation daily; refer to counsellor',    col:C.warn },
    { no:5, goal:'Hydration Target',           current:'1.8 L/day',          target:'2.5 L/day',        advice:'Set reminders every 90 min; avoid sugary drinks',         col:C.info },
];
const LS_IMPACT = [
    { domain:'HbA1c',              current:'5.9%', projected:'5.4%', timeframe:'6 months', improvement:'+35% faster', col:C.ok },
    { domain:'LDL Cholesterol',    current:'138', projected:'110 mg/dL', timeframe:'3 months', improvement:'+20% reduction', col:C.warn },
    { domain:'Blood Pressure',     current:'118/76', projected:'112/72', timeframe:'4 months', improvement:'Stress reduction benefit', col:C.info },
    { domain:'Weight / BMI',       current:'74.2 kg', projected:'70 kg', timeframe:'6 months', improvement:'Target BMI <25', col:C.acc },
];
const SLEEP_DIST = [
    { lbl:'Deep Sleep', pct:15, col:'#6D28D9' },
    { lbl:'Light Sleep', pct:45, col:'#A78BFA' },
    { lbl:'REM',         pct:20, col:'#0EA5E9' },
    { lbl:'Awake',       pct:20, col:'#FCA5A5' },
];
const WEEK_ACT = [
    { day:'Mon', steps:3200, col:C.crit },
    { day:'Tue', steps:5800, col:C.warn },
    { day:'Wed', steps:2100, col:C.crit },
    { day:'Thu', steps:6400, col:C.warn },
    { day:'Fri', steps:4100, col:C.warn },
    { day:'Sat', steps:8200, col:C.ok },
    { day:'Sun', steps:5600, col:C.warn },
];
const DIET_COMP = [
    { lbl:'Refined Carbs', pct:48, col:'#EF4444' },
    { lbl:'Protein',       pct:18, col:'#16A34A' },
    { lbl:'Healthy Fats',  pct:14, col:'#0EA5E9' },
    { lbl:'Fibre',         pct:10, col:'#F59E0B' },
    { lbl:'Others',        pct:10, col:'#94A3B8' },
];

// ── Holistic Health Components ────────────────────────────────────────────────
const TabHolistic = () => (
    <View>
        {/* KPI Grid */}
        <View style={st.g2}>
            {HL_KPI.map((k, i) => (
                <View key={i} style={[st.metricCard, { borderTopColor: k.col }]}>
                    <Text style={st.metricLbl}>{k.lbl}</Text>
                    <View style={{ flexDirection:'row', alignItems:'baseline', gap: ms(2) }}>
                        <Text style={[st.metricVal, { color: k.col }]}>{k.val}</Text>
                        <Text style={[st.metricUnit2, { color: k.col }]}>{k.unit}</Text>
                    </View>
                    <Text style={st.metricSub}>{k.sub}</Text>
                </View>
            ))}
        </View>

        {/* Lifestyle Domain Scores */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Lifestyle Domain Scores</Text>
                    <Text style={st.cardSub}>8 domains assessed · Composite Wellness Score: 72/100</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                {DOMAINS.map((d, i) => (
                    <View key={i} style={{ marginBottom: vs(10) }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: vs(4) }}>
                            <Text style={st.domainName}>{d.name}</Text>
                            <View style={{ flexDirection:'row', alignItems:'center', gap: ms(8) }}>
                                <Text style={[st.domainScore, { color: d.col }]}>{d.score}</Text>
                                <Text style={st.domainTarget}>/ {d.target}</Text>
                            </View>
                        </View>
                        <View style={st.domainBarTrack}>
                            <View style={[st.domainBarTarget, { left: `${d.target}%` }]} />
                            <View style={[st.domainBarFill, { width: `${d.score}%`, backgroundColor: d.col + 'CC' }]} />
                        </View>
                        <Text style={st.domainMeta}>{d.meta}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Wearable Data */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Wearable & Device Data</Text>
                    <Text style={st.cardSub}>Last 7-day average · Synced: 09-Mar-2025</Text>
                </View>
            </View>
            <View style={[st.labGrid, { padding: ms(12) }]}>
                {WEARABLE.map((w, i) => (
                    <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                        <View style={[st.wearCard, { borderTopColor: w.col, borderTopWidth: 3 }]}>
                            <View style={[st.wearIconWrap, { backgroundColor: w.col + '18' }]}>
                                <Icon type={Icons.Ionicons} name={w.icon} color={w.col} size={ms(16)} />
                            </View>
                            <Text style={st.wearLbl}>{w.lbl}</Text>
                            <Text style={[st.wearVal, { color: w.col }]}>{w.val}</Text>
                            <Text style={st.wearSub}>{w.sub}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Lifestyle Trends – 12 month bar chart */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Wellness Score Trend</Text>
                    <Text style={st.cardSub}>12-month composite lifestyle score</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={st.barChartWrap}>
                    {LS_TREND.map((v, i) => {
                        const pct = v / 100;
                        const col = v >= 70 ? C.ok : v >= 55 ? C.warn : C.crit;
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={st.chartVal}>{v}</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={st.chartLbl}>{LS_MONTHS[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>

        {/* Lifestyle-Biomarker Correlation */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Lifestyle – Biomarker Correlation</Text>
                    <Text style={st.cardSub}>Evidence-based lifestyle impact on clinical markers</Text>
                </View>
            </View>
            <View>
                {CORRELATIONS.map((c, i) => (
                    <View key={i} style={[st.corrRow, { borderLeftColor: c.col }]}>
                        <View style={{ flexDirection:'row', alignItems:'center', gap: ms(8), marginBottom: vs(3) }}>
                            <Text style={[st.corrLs, { color: c.col }]}>{c.ls}</Text>
                            <View style={[st.corrDirBadge, { backgroundColor: c.col + '18', borderColor: c.col + '33' }]}>
                                <Text style={[st.corrDir, { color: c.col }]}>{c.dir} {c.bm}</Text>
                            </View>
                        </View>
                        <Text style={st.corrNote}>{c.note}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Sleep Quality Distribution */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Sleep Quality Distribution</Text>
                    <Text style={st.cardSub}>Average nightly breakdown · 6.4 hrs</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={st.sleepBarWrap}>
                    {SLEEP_DIST.map((s, i) => (
                        <View key={i} style={[st.sleepBarSeg, { flex: s.pct, backgroundColor: s.col }]} />
                    ))}
                </View>
                <View style={st.sleepLegend}>
                    {SLEEP_DIST.map((s, i) => (
                        <View key={i} style={st.sleepLegItem}>
                            <View style={[st.legendDot, { backgroundColor: s.col }]} />
                            <Text style={st.sleepLegTxt}>{s.lbl} {s.pct}%</Text>
                        </View>
                    ))}
                </View>
                <View style={[st.insightBox, { backgroundColor: C.warnL, borderColor: C.warnB, borderLeftColor: C.warn }]}>
                    <Icon type={Icons.Ionicons} name="moon-outline" color={C.warn} size={ms(14)} />
                    <Text style={[st.insightTxt, { color: C.warn }]}>Deep sleep only 15% — target is 20-25%. Recommend consistent 10 PM bedtime and limit caffeine after 2 PM.</Text>
                </View>
            </View>
        </View>

        {/* Weekly Activity Pattern */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Weekly Activity Pattern</Text>
                    <Text style={st.cardSub}>Daily step count · Target: 8,000 steps</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={st.barChartWrap}>
                    {WEEK_ACT.map((w, i) => {
                        const pct = Math.min(w.steps / 10000, 1);
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={[st.chartVal, { color: w.col }]}>{(w.steps / 1000).toFixed(1)}K</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: w.col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={st.chartLbl}>{w.day}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={st.chartRefLine}>
                    <View style={[st.chartRefDash, { backgroundColor: C.ok, borderStyle:'dashed' }]} />
                    <Text style={st.chartRefTxt}>8,000 step target</Text>
                </View>
            </View>
        </View>

        {/* Diet Composition */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Diet Composition Tracking</Text>
                    <Text style={st.cardSub}>Average dietary analysis · last 30 days</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                {DIET_COMP.map((d, i) => (
                    <View key={i} style={{ marginBottom: vs(10) }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom: vs(4) }}>
                            <View style={{ flexDirection:'row', alignItems:'center', gap: ms(6) }}>
                                <View style={[st.legendDot, { backgroundColor: d.col }]} />
                                <Text style={st.dietLbl}>{d.lbl}</Text>
                            </View>
                            <Text style={[st.dietPct, { color: d.col }]}>{d.pct}%</Text>
                        </View>
                        <View style={st.progWrap}>
                            <View style={[st.progFill, { width: `${d.pct}%`, backgroundColor: d.col }]} />
                        </View>
                    </View>
                ))}
                <View style={[st.insightBox, { backgroundColor: C.critL, borderColor: C.critB, borderLeftColor: C.crit }]}>
                    <Icon type={Icons.Ionicons} name="warning-outline" color={C.crit} size={ms(14)} />
                    <Text style={[st.insightTxt, { color: C.crit }]}>Refined carbs at 48% significantly impact glycaemic control. Target &lt;30% with increase in complex carbohydrates and fibre.</Text>
                </View>
            </View>
        </View>

        {/* Clinical Lifestyle Assessment */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <Text style={st.cardTitle}>Clinical Lifestyle Assessment</Text>
            </View>
            <View style={st.cardBody}>
                <Text style={st.assessTxt}>
                    Patient demonstrates moderate lifestyle awareness with suboptimal physical activity being the primary modifiable risk factor. Diet quality requires significant improvement — high refined carbohydrate intake directly antagonises T2DM management and lipid targets. Sleep disturbances (6.4 hrs, poor sleep architecture) contribute to elevated HbA1c via cortisol-driven insulin resistance.{'\n\n'}
                    Stress indicators (PHQ-9: 8, GAD-7: 6) suggest mild-moderate anxiety affecting overall wellbeing. Wearable data corroborates sedentary behaviour pattern — steps average 4,823/day vs target 8,000. Positive findings: non-smoker, social support network intact, preventive care largely current.{'\n\n'}
                    <Text style={{ fontFamily: interMedium }}>Priority interventions:</Text> (1) Structured daily walking programme, (2) Dietary counselling with focus on GI reduction, (3) Sleep hygiene protocol, (4) Mindfulness-based stress reduction referral.
                </Text>
            </View>
        </View>

        {/* Lifestyle Prescription */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Lifestyle Prescription</Text>
                    <Text style={st.cardSub}>5 evidence-based lifestyle interventions</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                {LS_RX.map((r, i) => (
                    <View key={i} style={[st.lsRxCard, { borderLeftColor: r.col }]}>
                        <View style={[st.lsRxNo, { backgroundColor: r.col + '18', borderColor: r.col + '40' }]}>
                            <Text style={[st.lsRxNoTxt, { color: r.col }]}>{r.no}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={st.lsRxGoal}>{r.goal}</Text>
                            <View style={{ flexDirection:'row', gap: ms(6), marginBottom: vs(5), flexWrap:'wrap' }}>
                                <View style={[st.lsRxChip, { backgroundColor: C.critL, borderColor: C.critB }]}>
                                    <Text style={[st.lsRxChipTxt, { color: C.crit }]}>Now: {r.current}</Text>
                                </View>
                                <View style={[st.lsRxChip, { backgroundColor: C.okL, borderColor: C.okB }]}>
                                    <Text style={[st.lsRxChipTxt, { color: C.ok }]}>Target: {r.target}</Text>
                                </View>
                            </View>
                            <Text style={st.lsRxAdvice}>{r.advice}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Impact on Clinical Outcomes */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Projected Impact on Clinical Outcomes</Text>
                    <Text style={st.cardSub}>If lifestyle targets achieved</Text>
                </View>
            </View>
            <View style={[st.labGrid, { padding: ms(12) }]}>
                {LS_IMPACT.map((item, i) => (
                    <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                        <View style={[st.impactCard, { borderTopColor: item.col }]}>
                            <Text style={st.impactDomain}>{item.domain}</Text>
                            <View style={{ flexDirection:'row', alignItems:'center', gap: ms(4), marginBottom: vs(4) }}>
                                <Text style={st.impactCurr}>{item.current}</Text>
                                <Icon type={Icons.Ionicons} name="arrow-forward" color={item.col} size={ms(12)} />
                                <Text style={[st.impactProj, { color: item.col }]}>{item.projected}</Text>
                            </View>
                            <Text style={st.impactTime}>{item.timeframe}</Text>
                            <View style={[st.impactBadge, { backgroundColor: item.col + '18', borderColor: item.col + '33' }]}>
                                <Text style={[st.impactBadgeTxt, { color: item.col }]}>{item.improvement}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SYMPTOM TRACKER DATA
// ═══════════════════════════════════════════════════════════════════════════════
const SX_KPI = [
    { lbl:'Active Symptoms',  val:'6',    unit:'',    sub:'3 chronic · 3 acute', col:C.warn, tc:C.warn },
    { lbl:'Symptom Burden',   val:'68',   unit:'/100', sub:'Moderate burden',    col:C.warn, tc:C.warn },
    { lbl:'PHQ-9 Score',      val:'8',    unit:'/27',  sub:'Mild-Moderate',      col:C.info, tc:C.info },
    { lbl:'GAD-7 Score',      val:'6',    unit:'/21',  sub:'Mild Anxiety',       col:C.info, tc:C.info },
];
const SYMPTOMS = [
    { name:'Fatigue / Low Energy',      sev:7, freq:'Daily',  status:'Persistent', dx:'T2DM, Vit B12 def',  drug:'Metformin',     note:'Worsens after meals – likely post-prandial hyperglycaemia', col:C.crit,   sc:'crit' },
    { name:'Generalised Body Pain',     sev:5, freq:'3×/wk',  status:'Moderate',   dx:'Statin therapy',     drug:'Rosuvastatin',  note:'Possible statin-related myalgia – CK ordered',              col:C.warn,   sc:'warn' },
    { name:'Lower Back Pain',           sev:4, freq:'Intermit', status:'Improving', dx:'M54.5 resolved',    drug:'—',             note:'Post-physio improvement – no current intervention',          col:C.info,   sc:'info' },
    { name:'Headache / Mild',           sev:3, freq:'2×/wk',  status:'New',        dx:'Stress, HTN risk',   drug:'—',             note:'Associated with poor sleep and work stress',                 col:C.warn,   sc:'warn' },
    { name:'Nausea (mild)',             sev:2, freq:'Occasional', status:'Mild',    dx:'GI – Metformin ADR', drug:'Metformin',     note:'Take with meals; pantoprazole providing GI protection',      col:C.ok,     sc:'ok' },
    { name:'Mood / Anxiety',            sev:6, freq:'Daily',  status:'Moderate',   dx:'GAD-7: 6',           drug:'—',             note:'Work-related stress · refer to counselling',                 col:C.purple, sc:'warn' },
];
const SX_MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar'];
const SX_HISTORY = [
    [6, 5, 7, 6, 7, 7],
    [3, 4, 4, 5, 5, 5],
    [6, 5, 4, 4, 4, 4],
    [2, 3, 3, 3, 2, 3],
    [3, 2, 2, 2, 2, 2],
    [4, 5, 5, 6, 6, 6],
];
const SX_COLS = [C.crit, C.warn, C.info, C.warn, C.ok, C.purple];
const PHQ_DATA = [3, 4, 5, 6, 7, 8];
const GAD_DATA = [2, 3, 4, 4, 5, 6];
const SX_DX_MAP = [
    { sx:'Fatigue',        dx:'T2DM + B12 Def',   mechanism:'Impaired glucose utilisation + neurological deficit', col:C.warn },
    { sx:'Body Pain',      dx:'Statin Myopathy',  mechanism:'HMG-CoA reductase inhibition → muscle CoQ10 depletion', col:C.crit },
    { sx:'Headache',       dx:'Stress / HTN Risk', mechanism:'Cortisol elevation + sympathetic activation',          col:C.info },
    { sx:'Mood Changes',   dx:'GAD (mild)',        mechanism:'Chronic illness burden + lifestyle stress',             col:C.purple },
];
const ADR_WATCH = [
    { drug:'Metformin 500mg TDS', adr:'GI Disturbance', sev:'Mild', status:'Monitored', note:'Nausea reported 2×/week. Currently managed with pantoprazole 40mg. Monitor if persists >2 weeks.', col:C.warn, sc:'warn' },
    { drug:'Rosuvastatin 10mg', adr:'Myalgia / CK Rise', sev:'Moderate', status:'Investigating', note:'Body pain reported since Feb 2025, 3× per week. CK ordered urgently. Suspend if CK >5× ULN.', col:C.crit, sc:'crit' },
    { drug:'Cholecalciferol 60K', adr:'Hypercalcaemia Risk', sev:'Low', status:'Routine Monitor', note:'High-dose vitamin D supplementation. Serum calcium and 25-OH Vit D scheduled next check.', col:C.info, sc:'info' },
];
const SX_SEV_DATA = [5, 6, 6, 7, 6, 7];

// ── Symptom Tracker Components ────────────────────────────────────────────────
const TabSymptoms = () => (
    <View>
        {/* KPI Grid */}
        <View style={st.g2}>
            {SX_KPI.map((k, i) => (
                <View key={i} style={[st.metricCard, { borderTopColor: k.col }]}>
                    <Text style={st.metricLbl}>{k.lbl}</Text>
                    <View style={{ flexDirection:'row', alignItems:'baseline', gap: ms(2) }}>
                        <Text style={[st.metricVal, { color: k.col }]}>{k.val}</Text>
                        <Text style={[st.metricUnit2, { color: k.col }]}>{k.unit}</Text>
                    </View>
                    <Text style={st.metricSub}>{k.sub}</Text>
                </View>
            ))}
        </View>

        {/* Symptom Log */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Active Symptom Log</Text>
                    <Text style={st.cardSub}>6 symptoms tracked · Last updated: 09-Mar-2025</Text>
                </View>
            </View>
            <View style={{ padding: ms(12), gap: vs(8) }}>
                {SYMPTOMS.map((s, i) => (
                    <View key={i} style={[st.sxCard, { borderLeftColor: s.col }]}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom: vs(6) }}>
                            <View style={{ flex: 1, marginRight: ms(8) }}>
                                <Text style={st.sxName}>{s.name}</Text>
                                <Text style={st.sxDrug}>{s.dx} · {s.drug !== '—' ? `ADR: ${s.drug}` : 'No current drug'}</Text>
                            </View>
                            <Badge sc={s.sc} label={s.status} />
                        </View>
                        {/* Severity dots */}
                        <View style={{ flexDirection:'row', alignItems:'center', gap: ms(6), marginBottom: vs(6) }}>
                            <Text style={st.sxSevLbl}>Severity:</Text>
                            <View style={{ flexDirection:'row', gap: ms(4) }}>
                                {Array.from({ length: 10 }).map((_, j) => (
                                    <View key={j} style={[st.sxDot, j < s.sev && { backgroundColor: s.col }, j >= s.sev && { backgroundColor: C.border }]} />
                                ))}
                            </View>
                            <Text style={[st.sxSevNum, { color: s.col }]}>{s.sev}/10</Text>
                        </View>
                        <View style={{ flexDirection:'row', gap: ms(6), marginBottom: vs(5), flexWrap:'wrap' }}>
                            <View style={st.sxChip}><Icon type={Icons.Ionicons} name="time-outline" color={C.muted} size={ms(10)} /><Text style={st.sxChipTxt}>{s.freq}</Text></View>
                        </View>
                        <Text style={st.sxNote}>{s.note}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Symptom Frequency Heatmap (stacked bars) */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Symptom Frequency Over Time</Text>
                    <Text style={st.cardSub}>6-month severity tracking per symptom</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                {SYMPTOMS.map((s, si) => (
                    <View key={si} style={{ marginBottom: vs(10) }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom: vs(4) }}>
                            <Text style={[st.sxHeatName, { color: SX_COLS[si] }]}>{s.name.split(' ')[0]}</Text>
                        </View>
                        <View style={{ flexDirection:'row', gap: ms(4) }}>
                            {SX_MONTHS.map((m, mi) => {
                                const val = SX_HISTORY[si][mi];
                                const opacity = 0.15 + (val / 10) * 0.85;
                                return (
                                    <View key={mi} style={{ flex: 1, alignItems:'center' }}>
                                        <View style={[st.heatCell, { backgroundColor: SX_COLS[si], opacity }]} />
                                        <Text style={st.heatLbl}>{m}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
                <View style={st.sxHeatLegend}>
                    <Text style={st.sxHeatLegLbl}>Low</Text>
                    <View style={{ flexDirection:'row', gap: ms(2) }}>
                        {[0.2,0.4,0.6,0.8,1.0].map((o, i) => (
                            <View key={i} style={[st.heatLegBox, { backgroundColor: C.crit, opacity: o }]} />
                        ))}
                    </View>
                    <Text style={st.sxHeatLegLbl}>High</Text>
                </View>
            </View>
        </View>

        {/* PHQ-9 & GAD-7 Trend */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>PHQ-9 & GAD-7 Scores</Text>
                    <Text style={st.cardSub}>Mental health screening over 6 months</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={{ flexDirection:'row', gap: ms(12) }}>
                    {/* PHQ-9 */}
                    <View style={{ flex: 1 }}>
                        <Text style={[st.mhLabel, { color: C.info }]}>PHQ-9 (Depression)</Text>
                        <View style={st.barChartWrap}>
                            {PHQ_DATA.map((v, i) => {
                                const pct = v / 27;
                                const col = v >= 10 ? C.crit : v >= 5 ? C.warn : C.ok;
                                return (
                                    <View key={i} style={st.barChartCol}>
                                        <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                        <View style={st.barChartTrack}>
                                            <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                            <View style={{ flex: 1 - pct }} />
                                        </View>
                                        <Text style={st.chartLbl}>{SX_MONTHS[i]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {/* GAD-7 */}
                    <View style={{ flex: 1 }}>
                        <Text style={[st.mhLabel, { color: C.purple }]}>GAD-7 (Anxiety)</Text>
                        <View style={st.barChartWrap}>
                            {GAD_DATA.map((v, i) => {
                                const pct = v / 21;
                                const col = v >= 10 ? C.crit : v >= 5 ? C.warn : C.ok;
                                return (
                                    <View key={i} style={st.barChartCol}>
                                        <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                        <View style={st.barChartTrack}>
                                            <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                            <View style={{ flex: 1 - pct }} />
                                        </View>
                                        <Text style={st.chartLbl}>{SX_MONTHS[i]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
                <View style={[st.insightBox, { backgroundColor: C.infoL, borderColor: C.infoB, borderLeftColor: C.info }]}>
                    <Icon type={Icons.Ionicons} name="trending-up-outline" color={C.info} size={ms(14)} />
                    <Text style={[st.insightTxt, { color: C.info }]}>Both PHQ-9 and GAD-7 showing upward trend over 6 months. Consider referral to psychologist for CBT-based intervention.</Text>
                </View>
            </View>
        </View>

        {/* Symptom-Diagnosis Mapping */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Symptom – Diagnosis Mapping</Text>
                    <Text style={st.cardSub}>Pathophysiological linkage</Text>
                </View>
            </View>
            <View>
                {SX_DX_MAP.map((m, i) => (
                    <View key={i} style={[st.sxMapRow, { borderLeftColor: m.col }]}>
                        <View style={{ flexDirection:'row', alignItems:'center', gap: ms(8), marginBottom: vs(4) }}>
                            <View style={[st.sxMapBadge, { backgroundColor: m.col + '18', borderColor: m.col + '33' }]}>
                                <Text style={[st.sxMapSx, { color: m.col }]}>{m.sx}</Text>
                            </View>
                            <Icon type={Icons.Ionicons} name="arrow-forward" color={C.muted} size={ms(12)} />
                            <Text style={st.sxMapDx}>{m.dx}</Text>
                        </View>
                        <Text style={st.sxMapMech}>{m.mechanism}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* ADR Watch */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Drug-Symptom Association · ADR Watch</Text>
                    <Text style={st.cardSub}>Adverse drug reactions under monitoring</Text>
                </View>
            </View>
            <View style={{ padding: ms(12), gap: vs(10) }}>
                {ADR_WATCH.map((a, i) => (
                    <View key={i} style={[st.adrCard, { borderLeftColor: a.col }]}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom: vs(6), gap: ms(8) }}>
                            <View style={{ flex: 1 }}>
                                <Text style={st.adrDrug}>{a.drug}</Text>
                                <Text style={[st.adrAdr, { color: a.col }]}>{a.adr}</Text>
                            </View>
                            <View style={{ gap: vs(4), alignItems:'flex-end' }}>
                                <Badge sc={a.sc} label={a.sev} />
                                <Badge sc="dim" label={a.status} />
                            </View>
                        </View>
                        <Text style={st.adrNote}>{a.note}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Symptom Severity Over Time */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Overall Symptom Burden Trend</Text>
                    <Text style={st.cardSub}>Composite severity score · last 6 months</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={st.barChartWrap}>
                    {SX_SEV_DATA.map((v, i) => {
                        const pct = v / 10;
                        const col = v >= 7 ? C.crit : v >= 5 ? C.warn : C.ok;
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={st.chartLbl}>{SX_MONTHS[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH JOURNEY DATA
// ═══════════════════════════════════════════════════════════════════════════════
const JY_HERO = {
    name:'Arjun Sharma',
    since:'Sep 2023',
    duration:'18 months',
    visits:34,
    chips:['T2DM – Controlled','Lipid – Unresolved','Vit D – Improving','Stress – Moderate'],
    summary:'Patient journey spanning 18 months · 4 active diagnoses · 34 visits · Significant metabolic improvement noted',
};
const JY_TIMELINE_MONTHS = ['Sep\'23','Nov\'23','Jan\'24','Mar\'24','May\'24','Jul\'24','Sep\'24','Nov\'24','Jan\'25','Mar\'25'];
const JY_HBA1C  = [9.2, 8.5, 7.8, 7.2, 6.8, 6.5, 6.2, 6.0, 5.9, 5.9];
const JY_LDL    = [195, 185, 178, 170, 162, 155, 150, 145, 140, 138];
const JY_WEIGHT = [79, 78, 77, 76, 76, 75, 75, 74.5, 74.2, 74.2];
const JOURNEY_EVENTS = [
    {
        date:'Sep 2023',
        title:'Initial Diagnosis',
        col:'#EF4444',
        sc:'crit',
        clinical:{ title:'T2DM Diagnosed', body:'HbA1c 9.2% at presentation. Started Metformin 500mg TDS. BP 138/88 – lifestyle counselled. Referred diabetologist.' },
        lifestyle:{ title:'Baseline Assessment', body:'BMI 27.2 · Steps <2000/day · Sleep 5.5 hrs · Diet: high GI, processed foods · Sedentary work.' },
        symptoms:{ title:'Chief Complaints', body:'Fatigue, polyuria, polydipsia, weight gain. Severity 8/10. Daily impact on work performance.' },
    },
    {
        date:'Jan 2024',
        title:'Medication Optimisation',
        col:'#F59E0B',
        sc:'warn',
        clinical:{ title:'Dose Adjustment', body:'Metformin increased to 500mg TDS after tolerance confirmed. HbA1c 7.8% – improving. Added Pantoprazole for GI protection.' },
        lifestyle:{ title:'Activity Improvement', body:'Started evening walks – 3000 steps/day. Weight reduced to 77 kg. Sleep slightly improved to 6.0 hrs.' },
        symptoms:{ title:'Symptom Reduction', body:'Fatigue improved (7→5). Polyuria resolved. Mild nausea from Metformin managed with meals.' },
    },
    {
        date:'Sep 2024',
        title:'Lipid Panel Concern',
        col:'#1D4ED8',
        sc:'info',
        clinical:{ title:'Hyperlipidaemia Identified', body:'LDL 155 mg/dL · Total Cholesterol 220. Started Rosuvastatin 10mg OD. Referred cardiology. Vit D deficiency found.' },
        lifestyle:{ title:'Lifestyle Counselling', body:'Dietitian referral for Mediterranean diet. Yoga recommended for stress. Sleep improved to 6.4 hrs.' },
        symptoms:{ title:'New Symptoms', body:'Mild body pain reported (possible statin myalgia). PHQ-9 score 6 – mild depression noted.' },
    },
    {
        date:'Mar 2025',
        title:'Current Status',
        col:'#16A34A',
        sc:'ok',
        clinical:{ title:'Stable but Pending', body:'HbA1c 5.9% – good control. LDL 138 – still elevated awaiting statin effect. Pending: CK test, urine microalbumin.' },
        lifestyle:{ title:'Ongoing Challenges', body:'Steps 4823/day – below target. Diet improvement partial. Stress management ongoing. Wellness score 72/100.' },
        symptoms:{ title:'Current Burden', body:'Fatigue (7/10), body pain (5/10), mood changes (6/10) remain. Nausea mild. Overall burden moderate.' },
    },
];
const SCORECARD = [
    { domain:'HbA1c Control',       from:'9.2%',   to:'5.9%',     pct:85, col:C.ok,    sc:'ok',   note:'Excellent response to Metformin' },
    { domain:'LDL Cholesterol',     from:'195 mg/dL', to:'138 mg/dL', pct:40, col:C.warn, sc:'warn', note:'Partial improvement – statin stabilising' },
    { domain:'Blood Pressure',      from:'138/88', to:'118/76',   pct:80, col:C.ok,    sc:'ok',   note:'Well controlled · lifestyle benefit' },
    { domain:'Body Weight',         from:'79 kg',  to:'74.2 kg',  pct:50, col:C.info,  sc:'info', note:'5 kg lost – target 70 kg' },
    { domain:'Physical Activity',   from:'<2K steps', to:'4.8K steps', pct:35, col:C.warn, sc:'warn', note:'Improving but below 8K target' },
    { domain:'Sleep Quality',       from:'5.5 hrs', to:'6.4 hrs',  pct:45, col:C.warn,  sc:'warn', note:'Improving – target 7-8 hrs' },
    { domain:'Mental Wellbeing',    from:'PHQ-9: 4', to:'PHQ-9: 8', pct:20, col:C.crit, sc:'crit', note:'Worsened – counselling referral needed' },
    { domain:'Medication Adherence',from:'—',      to:'87%',      pct:87, col:C.ok,    sc:'ok',   note:'Good adherence · PDC >80%' },
];

// ── Health Journey Components ─────────────────────────────────────────────────
const TabJourney = () => (
    <View>
        {/* Journey Hero Card */}
        <View style={st.journeyHero}>
            <LinearGradient colors={['#1E3A5F','#0F2340']} style={st.journeyHeroGrad}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom: vs(10) }}>
                    <View>
                        <Text style={st.jhName}>{JY_HERO.name}</Text>
                        <Text style={st.jhSince}>Patient since {JY_HERO.since} · {JY_HERO.duration} journey</Text>
                    </View>
                    <View style={st.jhVisitBadge}>
                        <Text style={st.jhVisitNum}>{JY_HERO.visits}</Text>
                        <Text style={st.jhVisitLbl}>Visits</Text>
                    </View>
                </View>
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap: ms(6), marginBottom: vs(10) }}>
                    {JY_HERO.chips.map((c, i) => (
                        <View key={i} style={st.jhChip}>
                            <Text style={st.jhChipTxt}>{c}</Text>
                        </View>
                    ))}
                </View>
                <Text style={st.jhSummary}>{JY_HERO.summary}</Text>
            </LinearGradient>
        </View>

        {/* Integrated Health Timeline */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Integrated Health Timeline</Text>
                    <Text style={st.cardSub}>HbA1c, LDL & Weight over 18 months</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                {/* HbA1c trend */}
                <Text style={[st.mhLabel, { color: C.warn, marginBottom: vs(6) }]}>HbA1c % · (Normal &lt;5.7)</Text>
                <View style={st.barChartWrap}>
                    {JY_HBA1C.map((v, i) => {
                        const pct = Math.min(v / 10, 1);
                        const col = v >= 8 ? C.crit : v >= 6.5 ? C.warn : C.ok;
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={[st.chartLbl, { fontSize: ms(7) }]}>{JY_TIMELINE_MONTHS[i]}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={{ height: vs(12) }} />
                {/* LDL trend */}
                <Text style={[st.mhLabel, { color: C.crit, marginBottom: vs(6) }]}>LDL mg/dL · (Target &lt;100)</Text>
                <View style={st.barChartWrap}>
                    {JY_LDL.map((v, i) => {
                        const pct = Math.min(v / 200, 1);
                        const col = v >= 160 ? C.crit : v >= 130 ? C.warn : C.ok;
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={[st.chartLbl, { fontSize: ms(7) }]}>{JY_TIMELINE_MONTHS[i]}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={{ height: vs(12) }} />
                {/* Weight trend */}
                <Text style={[st.mhLabel, { color: C.info, marginBottom: vs(6) }]}>Weight kg · (Target 70 kg)</Text>
                <View style={st.barChartWrap}>
                    {JY_WEIGHT.map((v, i) => {
                        const pct = Math.min((v - 65) / 20, 1);
                        const col = v > 75 ? C.warn : v > 72 ? C.info : C.ok;
                        return (
                            <View key={i} style={st.barChartCol}>
                                <Text style={[st.chartVal, { color: col }]}>{v}</Text>
                                <View style={st.barChartTrack}>
                                    <View style={[st.barChartFill, { flex: pct, backgroundColor: col }]} />
                                    <View style={{ flex: 1 - pct }} />
                                </View>
                                <Text style={[st.chartLbl, { fontSize: ms(7) }]}>{JY_TIMELINE_MONTHS[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>

        {/* Clinical & Life Events Timeline */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Clinical & Life Events Timeline</Text>
                    <Text style={st.cardSub}>Integrated view: medical · lifestyle · symptoms</Text>
                </View>
            </View>
            <View style={{ padding: ms(12) }}>
                {JOURNEY_EVENTS.map((ev, i) => (
                    <View key={i} style={st.jevItem}>
                        {/* Timeline spine */}
                        <View style={st.jevLeft}>
                            <View style={[st.jevDot, { backgroundColor: ev.col, borderColor: ev.col + '44' }]} />
                            {i < JOURNEY_EVENTS.length - 1 && <View style={st.jevLine} />}
                        </View>
                        {/* Event content */}
                        <View style={{ flex: 1, marginBottom: vs(16) }}>
                            <View style={{ flexDirection:'row', alignItems:'center', gap: ms(8), marginBottom: vs(8) }}>
                                <Text style={[st.jevDate, { color: ev.col }]}>{ev.date}</Text>
                                <View style={[st.jevTitleBadge, { backgroundColor: ev.col + '18', borderColor: ev.col + '33' }]}>
                                    <Text style={[st.jevTitle, { color: ev.col }]}>{ev.title}</Text>
                                </View>
                            </View>
                            {/* 3-section card */}
                            <View style={[st.jevCard, { borderTopColor: ev.col }]}>
                                <View style={[st.jevSection, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
                                    <View style={st.jevSectionHdr}>
                                        <Icon type={Icons.Ionicons} name="medical-outline" color={primaryColor} size={ms(12)} />
                                        <Text style={[st.jevSectionLbl, { color: primaryColor }]}>Clinical</Text>
                                    </View>
                                    <Text style={st.jevSectionTitle}>{ev.clinical.title}</Text>
                                    <Text style={st.jevSectionBody}>{ev.clinical.body}</Text>
                                </View>
                                <View style={[st.jevSection, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
                                    <View style={st.jevSectionHdr}>
                                        <Icon type={Icons.Ionicons} name="leaf-outline" color={C.ok} size={ms(12)} />
                                        <Text style={[st.jevSectionLbl, { color: C.ok }]}>Lifestyle</Text>
                                    </View>
                                    <Text style={st.jevSectionTitle}>{ev.lifestyle.title}</Text>
                                    <Text style={st.jevSectionBody}>{ev.lifestyle.body}</Text>
                                </View>
                                <View style={st.jevSection}>
                                    <View style={st.jevSectionHdr}>
                                        <Icon type={Icons.Ionicons} name="body-outline" color={C.warn} size={ms(12)} />
                                        <Text style={[st.jevSectionLbl, { color: C.warn }]}>Symptoms</Text>
                                    </View>
                                    <Text style={st.jevSectionTitle}>{ev.symptoms.title}</Text>
                                    <Text style={st.jevSectionBody}>{ev.symptoms.body}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Progress Scorecard */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Progress Scorecard</Text>
                    <Text style={st.cardSub}>8 domains · Baseline → Current</Text>
                </View>
            </View>
            <View style={{ padding: ms(12) }}>
                {SCORECARD.map((s, i) => (
                    <View key={i} style={{ marginBottom: vs(12) }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: vs(4) }}>
                            <Text style={st.scDomain}>{s.domain}</Text>
                            <Badge sc={s.sc} label={s.pct + '%'} />
                        </View>
                        <View style={{ flexDirection:'row', alignItems:'center', gap: ms(6), marginBottom: vs(5) }}>
                            <View style={[st.scFromChip, { borderColor: C.border }]}>
                                <Text style={st.scFromTxt}>{s.from}</Text>
                            </View>
                            <Icon type={Icons.Ionicons} name="arrow-forward" color={s.col} size={ms(12)} />
                            <View style={[st.scToChip, { backgroundColor: s.col + '18', borderColor: s.col + '40' }]}>
                                <Text style={[st.scToTxt, { color: s.col }]}>{s.to}</Text>
                            </View>
                        </View>
                        <View style={st.progWrap}>
                            <View style={[st.progFill, { width: `${s.pct}%`, backgroundColor: s.col }]} />
                        </View>
                        <Text style={st.scNote}>{s.note}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Doctor's Holistic Assessment */}
        <View style={st.card}>
            <View style={st.cardHdr}>
                <View>
                    <Text style={st.cardTitle}>Doctor's Holistic Assessment</Text>
                    <Text style={st.cardSub}>Dr. Priya Nair · Diabetologist · 09-Mar-2025</Text>
                </View>
            </View>
            <View style={st.cardBody}>
                <View style={[st.insightBox, { backgroundColor: C.accL, borderColor: C.accB, borderLeftColor: primaryColor, marginBottom: vs(12) }]}>
                    <Icon type={Icons.Ionicons} name="star-outline" color={primaryColor} size={ms(14)} />
                    <Text style={[st.insightTxt, { color: primaryColor }]}>Excellent HbA1c response over 18 months (9.2% → 5.9%). Patient demonstrates good medication adherence and partial lifestyle improvement.</Text>
                </View>
                <Text style={st.assessTxt}>
                    Arjun has made commendable progress in glycaemic control — HbA1c now at target range after 18 months of consistent Metformin therapy and partial dietary modifications. Weight loss of 5 kg demonstrates positive lifestyle engagement, though physical activity remains suboptimal at 4,823 steps/day vs target 8,000.{'\n\n'}
                    Key areas of concern: (1) LDL remains elevated at 138 mg/dL — Rosuvastatin initiated but statin response pending April 2025 repeat. Possible statin myopathy flagged, CK ordered urgently. (2) Mental health indicators worsening — PHQ-9 rose from 4 to 8 over 6 months, likely driven by chronic illness burden and occupational stress. Formal psychological referral recommended. (3) Sleep deficit (6.4 hrs) contributing to suboptimal metabolic and psychological outcomes.{'\n\n'}
                    <Text style={{ fontFamily: interMedium }}>Immediate actions: </Text>Review CK results. If &lt;5× ULN, continue Rosuvastatin. Refer to Counsellor (psychological). Initiate structured walking programme with weekly step targets. Consider continuous glucose monitoring (CGM) for motivation and real-time feedback.{'\n\n'}
                    <Text style={{ fontFamily: interMedium }}>Prognosis: </Text>Favourable if lifestyle targets achieved. Projected HbA1c stable at 5.4-5.9%. LDL target (&lt;100 mg/dL) achievable in 6 months with statin + diet. Cardiovascular risk reduction estimated 35% with full lifestyle optimisation.
                </Text>
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
    { key:'overview',    label:'Overview',     icon:'pulse-outline' },
    { key:'labs',        label:'Labs',         icon:'flask-outline',              badge:'4' },
    { key:'medications', label:'Medications',  icon:'medkit-outline' },
    { key:'trends',      label:'Trends',       icon:'trending-up-outline' },
    { key:'holistic',    label:'Holistic',     icon:'leaf-outline' },
    { key:'symptoms',    label:'Symptoms',     icon:'body-outline' },
    { key:'journey',     label:'Journey',      icon:'map-outline' },
    { key:'notes',       label:'Notes',        icon:'document-text-outline' },
    { key:'risk',        label:'Risk',         icon:'shield-checkmark-outline' },
];

const DiseaseIntelligence = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('overview');

    const renderTab = () => {
        switch (activeTab) {
            case 'overview':    return <TabOverview />;
            case 'labs':        return <TabLabs />;
            case 'medications': return <TabMedications />;
            case 'trends':      return <TabTrends />;
            case 'notes':       return <TabNotes />;
            case 'risk':        return <TabRisk />;
            case 'holistic':    return <TabHolistic />;
            case 'symptoms':    return <TabSymptoms />;
            case 'journey':     return <TabJourney />;
            default:            return null;
        }
    };

    return (
        <LinearGradient colors={globalGradient2} locations={[0, 0.35]} style={st.flex1}>
            <SafeAreaView style={st.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={st.header}>
                    <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={st.headerTitle}>TrustMD</Text>
                        <Text style={st.headerSub}>Clinical Intelligence Platform</Text>
                    </View>
                    <View style={st.liveIndicator}>
                        <View style={st.liveDot} />
                        <Text style={st.liveTxt}>Live</Text>
                    </View>
                </View>

                {/* Patient Banner */}
                <View style={st.banner}>
                    <View style={st.bannerLeft}>
                        <Text style={st.bannerMrn}>MRN: APL-2024-847 · UHID: TL-2024-00847 · Last Seen: 09-Mar-2025</Text>
                        <Text style={st.bannerName}>Arjun Sharma</Text>
                        <Text style={st.bannerDemo}>34 yr · Male · DOB: 12-Jul-1990 · Blood Gp: B +ve · Hyderabad, TG</Text>
                    </View>
                    <View style={st.bannerStats}>
                        {[{v:'34',l:'Visits'},{v:'4',l:'Active Dx',c:C.crit},{v:'5',l:'Active Rx',c:C.acc},{v:'63',l:'Labs'},{v:'87%',l:'Adherence'}].map((s, i) => (
                            <View key={i} style={st.bannerStat}>
                                <Text style={[st.bannerStatV, s.c && { color: s.c }]}>{s.v}</Text>
                                <Text style={st.bannerStatL}>{s.l}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Patient Tags */}
                {/* <View style={st.tagsRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: ms(6), paddingHorizontal: ms(16), paddingVertical: vs(6) }}>
                        {[
                            { label:'T2DM – E11.9',           sc:'crit' },
                            { label:'Hyperlipidaemia – E78.5', sc:'crit' },
                            { label:'Vit D Deficiency – E55.9',sc:'crit' },
                            { label:'B12 Deficiency – E53.8',  sc:'warn' },
                            { label:'⚠ PCN Allergy',           sc:'flag' },
                            { label:'5 Active Medications',    sc:'acc'  },
                        ].map((t, i) => <Badge key={i} sc={t.sc} label={t.label} />)}
                    </ScrollView>
                </View> */}

                {/* Tab Bar */}
                <View style={st.tabBarWrap}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={st.tabBarInner}
                    >
                        {TABS.map(tab => {
                            const isActive = activeTab === tab.key;
                            return (
                                <TouchableOpacity
                                    key={tab.key}
                                    style={[st.tab, isActive ? st.tabActive : st.tabInactive]}
                                    onPress={() => setActiveTab(tab.key)}
                                    activeOpacity={0.75}
                                >
                                    <View style={st.tabIconWrap}>
                                        <Icon
                                            type={Icons.Ionicons}
                                            name={tab.icon}
                                            color={isActive ? whiteColor : C.muted}
                                            size={ms(13)}
                                        />
                                    </View>
                                    <Text style={[st.tabTxt, isActive ? st.tabTxtActive : st.tabTxtInactive]}>
                                        {tab.label}
                                    </Text>
                                    {!!tab.badge && (
                                        <View style={[st.tabBadge, isActive && st.tabBadgeActive]}>
                                            <Text style={[st.tabBadgeTxt, isActive && st.tabBadgeTxtActive]}>
                                                {tab.badge}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Content */}
                <View style={st.flex1}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
                        {renderTab()}
                        <View style={{ height: vs(80) }} />
                    </ScrollView>

                    {/* Floating Action Button */}
                    <TouchableOpacity
                        style={st.fab}
                        onPress={() => navigation.navigate('TrustMDActionsScreen')}
                        activeOpacity={0.85}
                    >
                        <View style={st.fabGrad}>
                            <Icon type={Icons.Ionicons} name="flash" color={whiteColor} size={ms(22)} />
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DiseaseIntelligence;

// ── Styles ────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    flex1: { flex: 1 },
    scroll: { paddingHorizontal: ms(16), paddingTop: vs(10) },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(10), gap: ms(10) },
    backBtn: { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.65)', marginTop: vs(1) },
    liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: ms(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(5) },
    liveDot: { width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: '#34D399' },
    liveTxt: { fontFamily: interMedium, fontSize: ms(10), color: '#34D399' },

    // Patient Banner
    banner: { marginHorizontal: ms(16), backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(6), elevation: 2, shadowColor: blackColor, shadowOpacity: 0.08, shadowRadius: 4 },
    bannerLeft: { marginBottom: vs(8) },
    bannerMrn: { fontFamily: interRegular, fontSize: ms(9), color: C.muted, letterSpacing: 0.3, marginBottom: vs(2) },
    bannerName: { fontFamily: heading, fontSize: ms(20), color: blackColor, marginBottom: vs(2) },
    bannerDemo: { fontFamily: interRegular, fontSize: ms(10), color: C.slate },
    bannerStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, paddingTop: vs(8) },
    bannerStat: { flex: 1, alignItems: 'center' },
    bannerStatV: { fontFamily: interMedium, fontSize: ms(14), color: blackColor, lineHeight: ms(16) },
    bannerStatL: { fontFamily: interRegular, fontSize: ms(8), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(1) },

    // Tags
    tagsRow: { backgroundColor: whiteColor, marginBottom: 0 },

    // Tab Bar
    tabBarWrap: {
        backgroundColor: whiteColor,
        paddingVertical: vs(9),
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        elevation: 3,
        shadowColor: blackColor,
        shadowOpacity: 0.07,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    tabBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        gap: ms(6),
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
        paddingHorizontal: ms(11),
        paddingVertical: vs(7),
        borderRadius: ms(20),
    },
    tabInactive: {
        backgroundColor: C.bg,
        borderWidth: 1,
        borderColor: C.border,
    },
    tabActive: {
        backgroundColor: primaryColor,
        elevation: 3,
        shadowColor: primaryColor,
        shadowOpacity: 0.35,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    tabIconWrap: {
        width: ms(15),
        height: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabTxt: { fontFamily: interMedium, fontSize: ms(11) },
    tabTxtInactive: { color: C.muted },
    tabTxtActive: { color: whiteColor },
    tabBadge: {
        backgroundColor: C.critL,
        borderRadius: ms(8),
        paddingHorizontal: ms(5),
        paddingVertical: vs(1),
        borderWidth: 1,
        borderColor: C.critB,
        minWidth: ms(16),
        alignItems: 'center',
    },
    tabBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderColor: 'rgba(255,255,255,0.4)',
    },
    tabBadgeTxt: { fontFamily: interMedium, fontSize: ms(8), color: C.crit },
    tabBadgeTxtActive: { color: whiteColor },

    // FAB
    fab: {
        position: 'absolute',
        bottom: vs(22),
        right: ms(16),
        width: ms(58),
        height: ms(58),
        borderRadius: ms(29),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: primaryColor,
        shadowOpacity: 0.45,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    fabGrad: {
        width: ms(58),
        height: ms(58),
        borderRadius: ms(29),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Card
    card: { backgroundColor: whiteColor, borderRadius: ms(12), marginBottom: vs(12), borderWidth: 1, borderColor: C.border, overflow: 'hidden', elevation: 1, shadowColor: blackColor, shadowOpacity: 0.05, shadowRadius: 3 },
    cardHdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ms(12), paddingVertical: vs(9), borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
    cardTitle: { fontFamily: interMedium, fontSize: ms(10.5), color: C.slate, textTransform: 'uppercase', letterSpacing: 0.6 },
    cardSub: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, marginTop: vs(1) },
    cardBody: { padding: ms(12) },

    // Metric cards
    g2: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(12) },
    metricCard: { width: (width - ms(32) - ms(8)) / 2, backgroundColor: whiteColor, borderRadius: ms(10), padding: ms(10), borderTopWidth: 3, borderWidth: 1, borderColor: C.border, elevation: 1 },
    metricLbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4) },
    metricVal: { fontFamily: interMedium, fontSize: ms(18), lineHeight: ms(20), letterSpacing: -0.5 },
    metricSub: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, marginTop: vs(4) },
    metricDelta: { borderRadius: ms(4), paddingHorizontal: ms(7), paddingVertical: vs(2), alignSelf: 'flex-start', marginTop: vs(5) },
    metricDeltaTxt: { fontFamily: interMedium, fontSize: ms(9) },

    // Section label
    seclblRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginTop: vs(8), marginBottom: vs(6) },
    seclbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.7 },
    seclblLine: { flex: 1, height: 1, backgroundColor: C.border },

    // Row divider
    rowDivider: { height: 1, backgroundColor: C.border, marginVertical: vs(8) },

    // Progress bar
    progWrap: { height: vs(5), backgroundColor: C.bg, borderRadius: ms(3), overflow: 'hidden' },
    progFill: { height: '100%', borderRadius: ms(3) },

    // Insight box
    insightBox: { flexDirection: 'row', gap: ms(8), borderRadius: ms(0), borderRightRadius: ms(8), padding: ms(10), borderWidth: 1, borderLeftWidth: 3, marginTop: vs(4), borderRadius: ms(6) },
    insightTxt: { flex: 1, fontFamily: interRegular, fontSize: ms(11), lineHeight: ms(17) },

    // Chart
    chartVal: { fontFamily: interMedium, fontSize: ms(8), color: C.slate, marginBottom: vs(2) },
    chartLbl: { fontFamily: interRegular, fontSize: ms(8), color: C.muted, marginTop: vs(2), textAlign: 'center' },
    chartRefLine: { flexDirection: 'row', alignItems: 'center', gap: ms(5), marginTop: vs(6) },
    chartRefDash: { width: ms(20), height: 1.5 },
    chartRefTxt: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },
    legendDot: { width: ms(7), height: ms(7), borderRadius: ms(2) },

    // Problem row
    probRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8), paddingVertical: vs(9), paddingHorizontal: ms(12), borderBottomWidth: 1, borderBottomColor: C.border },
    probIcd: { fontFamily: interRegular, fontSize: ms(9), color: C.muted, width: ms(45), paddingTop: vs(2), letterSpacing: 0.4 },
    probName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    probMeta: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },

    // Allergy
    allergyStrip: { backgroundColor: '#FFFBF5', borderLeftWidth: 3, borderLeftColor: C.flag, borderRadius: ms(6), padding: ms(10), marginBottom: vs(8) },
    allergyTitle: { fontFamily: interMedium, fontSize: ms(9), color: C.flag, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(6) },
    allergyRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(4) },
    allergyDrug: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, flex: 1 },
    allergyRxn: { fontFamily: interRegular, fontSize: ms(11), color: C.slate, flex: 1 },
    allergyNote: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, lineHeight: ms(16) },

    // Vitals
    vitalCard: { width: (width - ms(32) - ms(24) - ms(8)) / 2, backgroundColor: C.surface, borderRadius: ms(8), padding: ms(10), borderWidth: 1, borderColor: C.border, marginBottom: vs(4) },
    vitalLbl: { fontFamily: interMedium, fontSize: ms(8.5), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(3) },
    vitalVal: { fontFamily: interMedium, fontSize: ms(16), lineHeight: ms(18) },
    vitalUnit: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },
    vitalSub: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, marginTop: vs(2) },

    // CVD
    cvdScore: { fontFamily: heading, fontSize: ms(44), lineHeight: ms(46) },
    cvdUnit: { fontFamily: interRegular, fontSize: ms(18), color: C.muted },
    cvdLabel: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.7, marginTop: vs(2) },
    riskGauge: { height: vs(8), borderRadius: ms(4), overflow: 'hidden', marginVertical: vs(8), position: 'relative' },
    riskGaugeFill: { flex: 1, borderRadius: ms(4) },
    riskNeedle: { position: 'absolute', top: -vs(5), width: ms(18), height: ms(18), borderRadius: ms(9), borderWidth: 3, borderColor: whiteColor, elevation: 2 },
    riskLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) },
    riskLbl: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },
    cvdFRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: vs(4) },
    cvdFLabel: { fontFamily: interRegular, fontSize: ms(11), color: C.muted },
    cvdFVal: { fontFamily: interMedium, fontSize: ms(11) },

    // Renal
    renalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(8) },
    renalStgLbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4) },
    renalEgfrLbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2) },
    renalEgfr: { fontFamily: interMedium, fontSize: ms(22), lineHeight: ms(24) },
    renalEgfrUnit: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },
    renalNote: { fontFamily: interRegular, fontSize: ms(11), color: C.slate, lineHeight: ms(17) },

    // Encounter
    ctItem: { flexDirection: 'row', gap: ms(10), paddingBottom: vs(12) },
    ctLeft: { width: ms(20), alignItems: 'center' },
    ctDot: { width: ms(10), height: ms(10), borderRadius: ms(5), marginTop: vs(2), borderWidth: 2, borderColor: whiteColor },
    ctLine: { width: 1.5, flex: 1, backgroundColor: C.border, marginTop: vs(2) },
    ctBody: { flex: 1 },
    ctDate: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, letterSpacing: 0.4, marginBottom: vs(2), textTransform: 'uppercase' },
    ctTitle: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    ctMeta: { fontFamily: interRegular, fontSize: ms(11), color: C.slate, lineHeight: ms(17) },

    // Treatment row
    trkRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingVertical: vs(7), borderBottomWidth: 1, borderBottomColor: C.border },
    trkDrug: { fontFamily: interMedium, fontSize: ms(11), color: blackColor, width: ms(130) },
    trkMarker: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, width: ms(80) },
    trkBar: { flex: 1, height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' },
    trkFill: { height: '100%', borderRadius: ms(2) },
    trkChange: { fontFamily: interMedium, fontSize: ms(10), width: ms(72), textAlign: 'right' },

    // Lab card (new design)
    labGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: ms(10), paddingBottom: ms(4) },
    labCardOuter: { width: '48.5%', marginBottom: vs(8) },
    labCard: {
        flex: 1,
        backgroundColor: C.surface,
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: C.border,
        padding: ms(10),
        overflow: 'hidden',
    },
    labCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(8), gap: ms(4) },
    labCardName: { fontFamily: interMedium, fontSize: ms(11), color: blackColor, flex: 1, lineHeight: ms(15) },
    labCardMid: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8) },
    labCardValWrap: { borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(6), alignItems: 'center', minWidth: ms(54) },
    labCardVal: { fontFamily: heading, fontSize: ms(18), lineHeight: ms(20), letterSpacing: -0.5 },
    labCardUnit: { fontFamily: interRegular, fontSize: ms(8.5), marginTop: vs(1) },
    labCardRight: { flex: 1 },
    labCardTrendRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4), marginBottom: vs(4) },
    labCardTrend: { fontSize: ms(14), fontFamily: interMedium },
    labCardTrendLbl: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },
    labCardPrev: { fontFamily: interMedium, fontSize: ms(10) },
    labCardRefLbl: { fontFamily: interRegular, fontSize: ms(9), color: C.muted, marginBottom: vs(5) },
    labCardBar: { height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), position: 'relative', overflow: 'visible' },
    labCardBarOk: { position: 'absolute', top: 0, left: '15%', width: '60%', height: '100%', backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: ms(2) },
    labCardMarker: { position: 'absolute', top: -vs(3), width: ms(10), height: ms(10), borderRadius: ms(5), transform: [{ translateX: -ms(5) }], borderWidth: 2, borderColor: whiteColor, elevation: 2 },

    // BM Summary row (kept for reference, now replaced by card grid)
    bmSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6), paddingVertical: vs(8), paddingHorizontal: ms(12), borderBottomWidth: 1, borderBottomColor: C.border },

    // Rx drug cards (Tab 3)
    rxCard: {
        backgroundColor: C.surface,
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: C.border,
        padding: ms(12),
        marginBottom: vs(8),
    },
    rxCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(7), gap: ms(6) },
    rxCardName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, flex: 1 },
    rxChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(5), marginBottom: vs(7) },
    rxChip: { backgroundColor: C.bg, borderRadius: ms(5), borderWidth: 1, borderColor: C.border, paddingHorizontal: ms(8), paddingVertical: vs(3) },
    rxChipTxt: { fontFamily: interMedium, fontSize: ms(10), color: C.slate },
    rxInd: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, marginBottom: vs(7) },
    rxCardMeta: { flexDirection: 'row', alignItems: 'center' },
    rxMetaTxt: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    adhBarWide: { height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' },
    adhBarWideFill: { height: '100%', borderRadius: ms(2) },
    rxNote: { flexDirection: 'row', alignItems: 'center', gap: ms(5), marginTop: vs(8), backgroundColor: C.warnL, borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(5) },
    rxNoteTxt: { fontFamily: interRegular, fontSize: ms(10.5), color: C.warn, flex: 1 },

    // Discontinued med cards (Tab 3)
    discCard: {
        backgroundColor: C.surface,
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: C.border,
        padding: ms(12),
        marginBottom: vs(8),
    },
    discCardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(7), gap: ms(6) },
    discName: { fontFamily: interMedium, fontSize: ms(12), color: C.muted, marginBottom: vs(2) },
    discInd: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted },
    discRow: { flexDirection: 'row', gap: ms(6), marginBottom: vs(7) },
    discChip: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: C.bg, borderRadius: ms(5), borderWidth: 1, borderColor: C.border, paddingHorizontal: ms(7), paddingVertical: vs(3) },
    discChipTxt: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    discReason: { fontFamily: interRegular, fontSize: ms(10.5), color: C.slate, lineHeight: ms(16) },

    // Session history (timeline)
    sessionItem: { flexDirection: 'row', gap: ms(10), marginBottom: vs(4) },
    sessionLeft: { width: ms(16), alignItems: 'center', paddingTop: vs(2) },
    sessionDot: { width: ms(10), height: ms(10), borderRadius: ms(5), borderWidth: 2, borderColor: whiteColor, elevation: 1 },
    sessionLine: { width: 1.5, flex: 1, backgroundColor: C.border, marginTop: vs(3) },
    sessionCard: {
        flex: 1,
        backgroundColor: C.surface,
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: C.border,
        padding: ms(12),
        marginBottom: vs(10),
    },
    sessionCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
    sessionDate: { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    sessionProvider: { fontFamily: interMedium, fontSize: ms(12), color: C.slate, marginBottom: vs(1) },
    sessionOrderedBy: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, marginBottom: vs(8) },
    sessionPanelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(5), marginBottom: vs(8) },
    sessionPanelChip: { backgroundColor: primaryColor + '12', borderRadius: ms(5), paddingHorizontal: ms(8), paddingVertical: vs(3), borderWidth: 1, borderColor: primaryColor + '25' },
    sessionPanelTxt: { fontFamily: interMedium, fontSize: ms(10), color: primaryColor },
    sessionBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sessionAbnWrap: { flexDirection: 'row', alignItems: 'center', gap: ms(4), borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    sessionAbn: { fontFamily: interMedium, fontSize: ms(10) },
    sessionCost: { fontFamily: interMedium, fontSize: ms(11), color: blackColor },

    // Pending lab cards
    pendingLabCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(12),
        backgroundColor: C.critL,
        borderRadius: ms(10),
        borderWidth: 1,
        borderColor: C.critB,
        borderLeftWidth: 3,
        borderLeftColor: C.crit,
        padding: ms(12),
    },
    pendingLabIcon: { width: ms(36), height: ms(36), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    pendingLabTitle: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(3) },
    pendingLabMeta: { fontFamily: interRegular, fontSize: ms(10), color: C.slate, lineHeight: ms(15) },

    // Table
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(7), paddingHorizontal: ms(12), borderBottomWidth: 1, borderBottomColor: C.border },
    tableHdr: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1, paddingRight: ms(6) },
    tableCell: { fontFamily: interRegular, fontSize: ms(11), color: C.slate, flex: 1, paddingRight: ms(6) },

    // DDI
    ddiBox: { borderWidth: 1, borderLeftWidth: 3, borderRadius: ms(8), padding: ms(12), marginBottom: vs(10) },
    ddiHdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(6) },
    ddiDrug: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, flex: 1, marginRight: ms(8) },
    ddiBody: { fontFamily: interRegular, fontSize: ms(11), lineHeight: ms(17), marginBottom: vs(6) },
    ddiAction: { fontFamily: interMedium, fontSize: ms(10.5) },

    // Adh bar in table
    adhBarWrap: { width: ms(30), height: vs(3), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' },
    adhBarFill: { height: '100%', borderRadius: ms(2) },

    // Note card
    noteCard: { borderLeftWidth: 3, borderLeftColor: primaryColor, backgroundColor: C.surface, borderRadius: ms(8), padding: ms(12), marginBottom: vs(10) },
    noteHdr: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(4), flexWrap: 'wrap' },
    noteDr: { fontFamily: interMedium, fontSize: ms(12), color: primaryColor, flex: 1 },
    noteDate: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted },
    noteRole: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, marginBottom: vs(8) },
    noteSoap: { gap: vs(4) },
    noteSoapTxt: { fontFamily: interRegular, fontSize: ms(11.5), color: C.slate, lineHeight: ms(18) },
    noteSoapLbl: { fontFamily: interMedium, color: blackColor },

    // Rank row
    rankRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: C.border },
    rankName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(1) },
    rankMeta: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted },
    rankDate: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, flexShrink: 0 },

    // Clinical rec
    recRow: { flexDirection: 'row', gap: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border },
    recNo: { width: ms(22), height: ms(22), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: vs(1), borderWidth: 1, borderColor: C.accB },
    recNoTxt: { fontFamily: interMedium, fontSize: ms(10) },
    recTitle: { fontFamily: interMedium, fontSize: ms(13), color: blackColor, marginBottom: vs(4) },
    recBasis: { fontFamily: interRegular, fontSize: ms(11), color: C.slate, lineHeight: ms(17) },

    // Multi row
    multiRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },

    // ── Holistic Health ───────────────────────────────────────────────────────
    metricUnit2: { fontFamily: interRegular, fontSize: ms(11), marginLeft: ms(1) },

    // Domain bars
    domainName: { fontFamily: interMedium, fontSize: ms(11), color: blackColor, flex: 1 },
    domainScore: { fontFamily: interMedium, fontSize: ms(13) },
    domainTarget: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    domainBarTrack: { height: vs(6), backgroundColor: C.bg, borderRadius: ms(3), overflow:'visible', position:'relative', marginBottom: vs(3) },
    domainBarFill: { height: '100%', borderRadius: ms(3), position:'absolute', top:0, left:0 },
    domainBarTarget: { position:'absolute', top: -vs(3), width: ms(2), height: vs(12), backgroundColor: C.slate + '60', borderRadius: ms(1) },
    domainMeta: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, lineHeight: ms(14) },

    // Wearable card
    wearCard: { flex:1, backgroundColor: C.surface, borderRadius: ms(10), borderWidth:1, borderColor: C.border, padding: ms(10), alignItems:'center' },
    wearIconWrap: { width: ms(32), height: ms(32), borderRadius: ms(10), justifyContent:'center', alignItems:'center', marginBottom: vs(5) },
    wearLbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform:'uppercase', letterSpacing:0.4, textAlign:'center', marginBottom: vs(3) },
    wearVal: { fontFamily: interMedium, fontSize: ms(14), lineHeight: ms(16), textAlign:'center', marginBottom: vs(2) },
    wearSub: { fontFamily: interRegular, fontSize: ms(9), color: C.muted, textAlign:'center' },

    // Bar chart (reusable)
    barChartWrap: { flexDirection:'row', alignItems:'flex-end', height: vs(70), gap: ms(2) },
    barChartCol: { flex:1, alignItems:'center', height:'100%', justifyContent:'flex-end' },
    barChartTrack: { width:'100%', flex:1, backgroundColor: C.bg, borderRadius: ms(2), overflow:'hidden', flexDirection:'column-reverse' },
    barChartFill: { borderRadius: ms(2) },

    // Correlation
    corrRow: { borderLeftWidth: 3, paddingLeft: ms(10), paddingVertical: vs(9), paddingRight: ms(12), borderBottomWidth:1, borderBottomColor: C.border },
    corrLs: { fontFamily: interMedium, fontSize: ms(11), flex:1 },
    corrDirBadge: { borderRadius: ms(5), paddingHorizontal: ms(7), paddingVertical: vs(2), borderWidth:1 },
    corrDir: { fontFamily: interMedium, fontSize: ms(10) },
    corrNote: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, lineHeight: ms(15) },

    // Sleep
    sleepBarWrap: { flexDirection:'row', height: vs(18), borderRadius: ms(6), overflow:'hidden', marginBottom: vs(10) },
    sleepBarSeg: { height:'100%' },
    sleepLegend: { flexDirection:'row', flexWrap:'wrap', gap: ms(10), marginBottom: vs(8) },
    sleepLegItem: { flexDirection:'row', alignItems:'center', gap: ms(5) },
    sleepLegTxt: { fontFamily: interRegular, fontSize: ms(10), color: C.slate },

    // Diet
    dietLbl: { fontFamily: interMedium, fontSize: ms(11), color: C.slate },
    dietPct: { fontFamily: interMedium, fontSize: ms(11) },

    // Lifestyle Rx
    lsRxCard: { flexDirection:'row', gap: ms(10), borderLeftWidth: 3, backgroundColor: C.surface, borderRadius: ms(8), padding: ms(12), marginBottom: vs(8), borderWidth:1, borderColor: C.border },
    lsRxNo: { width: ms(24), height: ms(24), borderRadius: ms(12), justifyContent:'center', alignItems:'center', borderWidth:1, flexShrink:0, marginTop: vs(1) },
    lsRxNoTxt: { fontFamily: interMedium, fontSize: ms(11) },
    lsRxGoal: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(6) },
    lsRxChip: { borderRadius: ms(5), paddingHorizontal: ms(7), paddingVertical: vs(2), borderWidth:1 },
    lsRxChipTxt: { fontFamily: interRegular, fontSize: ms(10) },
    lsRxAdvice: { fontFamily: interRegular, fontSize: ms(11), color: C.muted, lineHeight: ms(16), marginTop: vs(4) },

    // Impact card
    impactCard: { flex:1, backgroundColor: C.surface, borderRadius: ms(10), borderWidth:1, borderColor: C.border, borderTopWidth:3, padding: ms(10) },
    impactDomain: { fontFamily: interMedium, fontSize: ms(11), color: blackColor, marginBottom: vs(6) },
    impactCurr: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    impactProj: { fontFamily: interMedium, fontSize: ms(11) },
    impactTime: { fontFamily: interRegular, fontSize: ms(9), color: C.muted, marginBottom: vs(5) },
    impactBadge: { borderRadius: ms(5), paddingHorizontal: ms(7), paddingVertical: vs(2), borderWidth:1, alignSelf:'flex-start' },
    impactBadgeTxt: { fontFamily: interMedium, fontSize: ms(10) },

    // Assessment text
    assessTxt: { fontFamily: interRegular, fontSize: ms(11.5), color: C.slate, lineHeight: ms(19) },

    // ── Symptom Tracker ───────────────────────────────────────────────────────
    // Symptom card
    sxCard: { borderLeftWidth: 3, backgroundColor: C.surface, borderRadius: ms(8), padding: ms(12), borderWidth:1, borderColor: C.border },
    sxName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    sxDrug: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    sxSevLbl: { fontFamily: interMedium, fontSize: ms(9.5), color: C.muted },
    sxDot: { width: ms(7), height: ms(7), borderRadius: ms(3.5) },
    sxSevNum: { fontFamily: interMedium, fontSize: ms(11) },
    sxChip: { flexDirection:'row', alignItems:'center', gap: ms(4), backgroundColor: C.bg, borderRadius: ms(5), borderWidth:1, borderColor: C.border, paddingHorizontal: ms(7), paddingVertical: vs(3) },
    sxChipTxt: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    sxNote: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, lineHeight: ms(15) },

    // Heatmap
    sxHeatName: { fontFamily: interMedium, fontSize: ms(10) },
    heatCell: { width:'100%', height: vs(16), borderRadius: ms(3) },
    heatLbl: { fontFamily: interRegular, fontSize: ms(7.5), color: C.muted, marginTop: vs(2), textAlign:'center' },
    sxHeatLegend: { flexDirection:'row', alignItems:'center', gap: ms(8), marginTop: vs(8), justifyContent:'center' },
    heatLegBox: { width: ms(14), height: ms(14), borderRadius: ms(3) },
    sxHeatLegLbl: { fontFamily: interRegular, fontSize: ms(9), color: C.muted },

    // PHQ/GAD label
    mhLabel: { fontFamily: interMedium, fontSize: ms(10), textTransform:'uppercase', letterSpacing:0.4 },

    // Symptom-Dx map
    sxMapRow: { borderLeftWidth: 3, paddingLeft: ms(10), paddingVertical: vs(9), paddingRight: ms(12), borderBottomWidth:1, borderBottomColor: C.border },
    sxMapBadge: { borderRadius: ms(5), paddingHorizontal: ms(8), paddingVertical: vs(3), borderWidth:1 },
    sxMapSx: { fontFamily: interMedium, fontSize: ms(11) },
    sxMapDx: { fontFamily: interMedium, fontSize: ms(11), color: blackColor, flex:1 },
    sxMapMech: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, lineHeight: ms(15) },

    // ADR card
    adrCard: { borderLeftWidth: 3, backgroundColor: C.surface, borderRadius: ms(8), padding: ms(12), borderWidth:1, borderColor: C.border },
    adrDrug: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    adrAdr: { fontFamily: interMedium, fontSize: ms(11) },
    adrNote: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, lineHeight: ms(16) },

    // ── Health Journey ────────────────────────────────────────────────────────
    // Hero card
    journeyHero: { borderRadius: ms(14), overflow:'hidden', marginBottom: vs(12), elevation:3, shadowColor: blackColor, shadowOpacity:0.15, shadowRadius:6 },
    journeyHeroGrad: { padding: ms(16) },
    jhName: { fontFamily: heading, fontSize: ms(20), color: whiteColor, marginBottom: vs(2) },
    jhSince: { fontFamily: interRegular, fontSize: ms(11), color:'rgba(255,255,255,0.65)' },
    jhVisitBadge: { backgroundColor:'rgba(255,255,255,0.15)', borderRadius: ms(10), padding: ms(10), alignItems:'center', minWidth: ms(54) },
    jhVisitNum: { fontFamily: heading, fontSize: ms(22), color: whiteColor, lineHeight: ms(24) },
    jhVisitLbl: { fontFamily: interRegular, fontSize: ms(9), color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:0.4 },
    jhChip: { backgroundColor:'rgba(255,255,255,0.12)', borderRadius: ms(6), paddingHorizontal: ms(10), paddingVertical: vs(4), borderWidth:1, borderColor:'rgba(255,255,255,0.2)' },
    jhChipTxt: { fontFamily: interMedium, fontSize: ms(10), color: whiteColor },
    jhSummary: { fontFamily: interRegular, fontSize: ms(10.5), color:'rgba(255,255,255,0.6)', lineHeight: ms(16) },

    // Journey event timeline
    jevItem: { flexDirection:'row', gap: ms(10) },
    jevLeft: { width: ms(18), alignItems:'center' },
    jevDot: { width: ms(14), height: ms(14), borderRadius: ms(7), borderWidth:2, zIndex:1 },
    jevLine: { width: 2, flex:1, backgroundColor: C.border, marginTop: vs(2) },
    jevDate: { fontFamily: interMedium, fontSize: ms(10), textTransform:'uppercase', letterSpacing:0.4 },
    jevTitleBadge: { borderRadius: ms(6), paddingHorizontal: ms(8), paddingVertical: vs(3), borderWidth:1 },
    jevTitle: { fontFamily: interMedium, fontSize: ms(11) },
    jevCard: { backgroundColor: C.surface, borderRadius: ms(10), borderWidth:1, borderColor: C.border, borderTopWidth:3, overflow:'hidden' },
    jevSection: { padding: ms(10) },
    jevSectionHdr: { flexDirection:'row', alignItems:'center', gap: ms(5), marginBottom: vs(4) },
    jevSectionLbl: { fontFamily: interMedium, fontSize: ms(9), textTransform:'uppercase', letterSpacing:0.5 },
    jevSectionTitle: { fontFamily: interMedium, fontSize: ms(11.5), color: blackColor, marginBottom: vs(3) },
    jevSectionBody: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted, lineHeight: ms(15) },

    // Scorecard
    scDomain: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, flex:1 },
    scFromChip: { backgroundColor: C.bg, borderRadius: ms(5), paddingHorizontal: ms(8), paddingVertical: vs(3), borderWidth:1 },
    scFromTxt: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    scToChip: { borderRadius: ms(5), paddingHorizontal: ms(8), paddingVertical: vs(3), borderWidth:1 },
    scToTxt: { fontFamily: interMedium, fontSize: ms(11) },
    scNote: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, marginTop: vs(4) },
});
