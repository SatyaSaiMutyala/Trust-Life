import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, View, Text, ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, {
    Path, Circle, Line, Defs,
    LinearGradient as SvgLinearGradient, Stop,
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

// ── Palette ───────────────────────────────────────────────────────────────────
const MUTED  = '#64748B';
const BORDER = 'rgba(15,118,110,0.13)';

// ── Data ──────────────────────────────────────────────────────────────────────
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
                points: [{ x: 0, y: 0.15 }, { x: 0.18, y: 0.30 }, { x: 0.33, y: 0.50 }, { x: 0.50, y: 0.42 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.65 }],
            },
            {
                name: 'Fasting Glucose', subtitle: 'Plasma Glucose',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '70-100', abnormal: '124', unit: 'mg/dL', ref: '70 - 100',
                points: [{ x: 0, y: 0.60 }, { x: 0.18, y: 0.45 }, { x: 0.33, y: 0.55 }, { x: 0.50, y: 0.65 }, { x: 0.66, y: 0.50 }, { x: 1, y: 0.72 }],
            },
            {
                name: 'HbA1c', subtitle: 'Glycated Hemoglobin',
                statusCode: 'H', statusLabel: 'High', statusColor: '#F59E0B',
                normal: '<5.7', abnormal: '7.4', unit: '%', ref: '4.0 - 5.7',
                points: [{ x: 0, y: 0.40 }, { x: 0.18, y: 0.52 }, { x: 0.33, y: 0.38 }, { x: 0.50, y: 0.60 }, { x: 0.66, y: 0.48 }, { x: 1, y: 0.58 }],
            },
            {
                name: 'Insulin Level', subtitle: 'Fasting Insulin',
                statusCode: 'N', statusLabel: 'Normal', statusColor: '#10B981',
                normal: '2-25', abnormal: '-', unit: 'μIU/mL', ref: '2 - 25',
                points: [{ x: 0, y: 0.50 }, { x: 0.18, y: 0.42 }, { x: 0.33, y: 0.38 }, { x: 0.50, y: 0.44 }, { x: 0.66, y: 0.40 }, { x: 1, y: 0.38 }],
            },
        ],
        symptoms: [
            { date: '14 Feb', symptom: 'Fatigue', severity: '3/5' },
            { date: '20 Feb', symptom: 'Dizziness', severity: '2/5' },
        ],
        organs: [
            { name: 'Heart', emoji: '🫀', statusLabel: 'Under stress', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Blood Pressure', showArrow: true }] },
            { name: 'Kidneys', emoji: '🫘', statusLabel: 'Watch', statusBg: '#FEF9C3', statusColor: '#92400E', contributors: [{ name: 'Creatinine', showArrow: true }] },
        ],
        history: [
            { date: 'Mar 2025', value: '7.4', delta: '+0.2', status: 'H' },
            { date: 'Dec 2024', value: '7.2', delta: '-0.3', status: 'H' },
            { date: 'Sep 2024', value: '7.5', delta: '+0.4', status: 'H' },
        ],
        insight: 'Blood sugar markers remain elevated. Maintain carbohydrate restriction and 30-min daily walks. Retest HbA1c in 3 months to track medication response.',
    },
    'Cholesterol': {
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
        history: [
            { date: 'Feb 2025', value: '218', delta: '+8',  status: 'H' },
            { date: 'Oct 2024', value: '210', delta: '-5',  status: 'H' },
            { date: 'Jun 2024', value: '215', delta: '+12', status: 'H' },
        ],
        insight: 'LDL has been persistently elevated. Statin therapy was initiated. Next lipid panel in 6 weeks will be first post-treatment reading. Target LDL < 100 mg/dL.',
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
        symptoms: null, organs: null,
        history: [
            { date: 'Mar 2025', value: '72', delta: '-2', status: 'N' },
            { date: 'Dec 2024', value: '74', delta: '+1', status: 'N' },
            { date: 'Sep 2024', value: '73', delta: '-1', status: 'N' },
        ],
        insight: 'Heart rate is consistently within the healthy range. Regular aerobic activity is helping maintain these values. Keep up the routine.',
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
                normal: '>90', abnormal: '52', unit: 'mL/min', ref: '> 90',
                points: [{ x: 0, y: 0.65 }, { x: 0.18, y: 0.55 }, { x: 0.33, y: 0.60 }, { x: 0.50, y: 0.50 }, { x: 0.66, y: 0.55 }, { x: 1, y: 0.48 }],
            },
            {
                name: 'Creatinine', subtitle: 'Serum Creatinine',
                statusCode: 'H', statusLabel: 'High', statusColor: '#EF4444',
                normal: '0.7-1.2', abnormal: '1.8', unit: 'mg/dL', ref: '0.7 - 1.2',
                points: [{ x: 0, y: 0.55 }, { x: 0.18, y: 0.65 }, { x: 0.33, y: 0.58 }, { x: 0.50, y: 0.70 }, { x: 0.66, y: 0.62 }, { x: 1, y: 0.75 }],
            },
        ],
        symptoms: null, organs: null,
        history: [
            { date: 'Mar 2025', value: '52', delta: '-3', status: 'L' },
            { date: 'Dec 2024', value: '55', delta: '-2', status: 'L' },
            { date: 'Sep 2024', value: '57', delta: '-4', status: 'L' },
        ],
        insight: 'Kidney function is declining slowly. Ensure adequate hydration and avoid nephrotoxic medications. Discuss ACE inhibitor options with your nephrologist.',
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const hpsColor  = s => s >= 85 ? '#16A34A' : s >= 65 ? '#D97706' : '#DC2626';
const stripeClr = code => code === 'N' ? '#16A34A' : code.includes('**') ? '#DC2626' : '#D97706';

const computeHps = code => code === 'N' ? 87 : code.includes('**') ? 32 : 52;
const computeStatusScore = code => code === 'N' ? 36 : code.includes('**') ? 8 : 20;

const rangePct = (val, ref) => {
    try {
        const nums = ref.replace(/[<>]/g, '').trim().split(/[-–]/).map(Number).filter(n => !isNaN(n));
        const lo = nums.length > 1 ? nums[0] : 0;
        const hi = nums.length > 1 ? nums[1] : nums[0];
        const range = hi - lo || 100;
        const v = parseFloat(val) || 0;
        return Math.max(3, Math.min(97, ((v - lo) / range) * 100));
    } catch { return 50; }
};

const dirLabel = code => code === 'N' ? 'Stable' : code.includes('**') ? 'Worsening' : 'Rising';
const dirColor = code => code === 'N' ? MUTED : code.includes('**') ? '#DC2626' : '#D97706';
const dirBg    = code => code === 'N' ? '#F1F5F9' : code.includes('**') ? '#FEF2F2' : '#FEF3C7';

const statusDeltaColor = s => s === 'N' ? '#16A34A' : '#DC2626';

// ── BioChart (kept) ───────────────────────────────────────────────────────────
const createCurvePath = pts => {
    let d = `M 0,${pts[0].y * CHART_H}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = { x: pts[i - 1].x * CHART_W, y: pts[i - 1].y * CHART_H };
        const curr = { x: pts[i].x * CHART_W, y: pts[i].y * CHART_H };
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
        d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
};
const createAreaPath = pts => {
    const curve = createCurvePath(pts);
    const lastX = pts[pts.length - 1].x * CHART_W;
    return `${curve} L ${lastX},${CHART_H} L 0,${CHART_H} Z`;
};

const BioChart = ({ points, id, color }) => (
    <View style={s.chartWrap}>
        <Svg width={CHART_W} height={CHART_H}>
            <Defs>
                <SvgLinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </SvgLinearGradient>
            </Defs>
            <Line x1="0" y1={CHART_H * 0.1}  x2={CHART_W} y2={CHART_H * 0.1}  stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.37} x2={CHART_W} y2={CHART_H * 0.37} stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.64} x2={CHART_W} y2={CHART_H * 0.64} stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="4,4" />
            <Line x1="0" y1={CHART_H * 0.92} x2={CHART_W} y2={CHART_H * 0.92} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4,4" />
            <Path d={createAreaPath(points)} fill={`url(#${id})`} />
            <Path d={createCurvePath(points)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
                <Circle key={i} cx={p.x * CHART_W} cy={p.y * CHART_H} r={ms(4)} fill={color} stroke={whiteColor} strokeWidth={1.5} />
            ))}
        </Svg>
        <View style={s.xLabels}>
            {X_LABELS.map((l, i) => <Text key={i} style={s.xLabel}>{l}</Text>)}
        </View>
    </View>
);

// ── Section Label ─────────────────────────────────────────────────────────────
const SecLabel = ({ text }) => (
    <View style={s.secLabelRow}>
        <Text style={s.secLabel}>{text}</Text>
        <View style={s.secLabelLine} />
    </View>
);

// ── Expandable BioMarker Card ─────────────────────────────────────────────────
const BioMarkerCard = ({ item, index, expanded, onToggle }) => {
    const navigation = useNavigation();
    const hps      = computeHps(item.statusCode);
    const hc       = hpsColor(hps);
    const sc       = stripeClr(item.statusCode);
    const rp       = rangePct(item.abnormal !== '-' ? item.abnormal : item.normal, item.ref);
    const statusSc = computeStatusScore(item.statusCode);
    const stabSc   = 24;
    const velSc    = 20;

    const circumference = 2 * Math.PI * 22;
    const offset = circumference * (1 - hps / 100);

    return (
        <View style={s.bmCard}>
            {/* Top stripe */}
            <LinearGradient
                colors={[sc, sc + 'AA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.bmStripe}
            />

            {/* Card Header */}
            <TouchableOpacity style={s.bmHdr} activeOpacity={0.75} onPress={onToggle}>
                {/* Row 1: icon + name + HPS ring + chevron */}
                <View style={s.bmRow1}>
                    <View style={[s.bmIcon, { backgroundColor: sc + '15' }]}>
                        <Icon type={Icons.Ionicons} name="flask-outline" size={ms(16)} color={sc} />
                    </View>
                    <View style={s.bmMeta}>
                        <Text style={s.bmName}>{item.name}</Text>
                        <Text style={s.bmCat}>{item.subtitle}</Text>
                    </View>
                    <View style={s.hpsMini}>
                        <View style={s.hpsMiniRing}>
                            <Svg width={ms(46)} height={ms(46)} viewBox="0 0 54 54">
                                <Circle cx="27" cy="27" r="22" fill="none" stroke={hc + '22'} strokeWidth="5" />
                                <Circle cx="27" cy="27" r="22" fill="none" stroke={hc} strokeWidth="5"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    rotation="-90"
                                    origin="27,27"
                                />
                            </Svg>
                            <Text style={[s.hpsMiniNum, { color: hc }]}>{hps}</Text>
                        </View>
                        <Text style={s.hpsMiniLbl}>HPS</Text>
                    </View>
                    <Icon type={Icons.Ionicons}
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={ms(16)} color={MUTED} style={{ marginLeft: ms(4) }} />
                </View>

                {/* Row 2: value + badges */}
                <View style={s.bmRow2}>
                    <Text style={[s.bmVal, { color: sc }]}>
                        {item.abnormal !== '-' ? item.abnormal : item.normal}
                        <Text style={s.bmUnit}> {item.unit}</Text>
                    </Text>
                    <Text style={s.bmRef}>Ref: {item.ref}</Text>
                    <View style={{ flex: 1 }} />
                    <View style={[s.dirBadge, { backgroundColor: dirBg(item.statusCode) }]}>
                        <Icon type={Icons.Ionicons}
                            name={item.statusCode === 'N' ? 'remove' : item.statusCode.includes('**') ? 'trending-down' : 'trending-up'}
                            size={ms(10)} color={dirColor(item.statusCode)} />
                        <Text style={[s.dirBadgeTx, { color: dirColor(item.statusCode) }]}>{dirLabel(item.statusCode)}</Text>
                    </View>
                    <View style={[s.statusPill, { backgroundColor: item.statusCode === 'N' ? '#DCFCE7' : item.statusCode.includes('**') ? '#FEE2E2' : '#FEF3C7' }]}>
                        <Text style={[s.statusPillTx, { color: item.statusCode === 'N' ? '#16A34A' : item.statusCode.includes('**') ? '#DC2626' : '#D97706' }]}>
                            {item.statusLabel}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider} />

            {/* Expanded Body */}
            {expanded && (
                <View style={s.bmBody}>

                    {/* Range Bar */}
                    <SecLabel text="Current Position in Range" />
                    <View style={s.rbarWrap}>
                        <View style={s.rbarTrack}>
                            <View style={s.rbarNormal} />
                            <View style={[s.rbarMarker, { left: `${rp}%`, backgroundColor: sc }]} />
                        </View>
                        <View style={s.rbarLabels}>
                            <Text style={s.rbarLbl}>Low</Text>
                            <Text style={[s.rbarLbl, { color: primaryColor, fontFamily: bold }]}>Normal: {item.ref}</Text>
                            <Text style={s.rbarLbl}>High</Text>
                        </View>
                    </View>

                    {/* Score Breakdown */}
                    <SecLabel text="Score Breakdown" />
                    <View style={s.panelRow}>
                        {/* Status */}
                        <LinearGradient colors={['#F0FDFA', '#CCFBF1']} style={s.panel}>
                            <View style={s.panelHead}>
                                <Text style={[s.panelLabel, { color: '#0F766E' }]}>STATUS</Text>
                                <Text style={[s.panelScore, { color: '#0F766E' }]}>{statusSc}<Text style={s.panelMax}>/40</Text></Text>
                            </View>
                            <View style={s.panelBar}>
                                <View style={[s.panelFill, { width: `${(statusSc / 40) * 100}%`, backgroundColor: primaryColor }]} />
                            </View>
                            <View style={[s.statusPill, { backgroundColor: item.statusCode === 'N' ? '#DCFCE7' : '#FEE2E2' }]}>
                                <Text style={[s.statusPillTx, { color: item.statusCode === 'N' ? '#16A34A' : '#DC2626' }]}>
                                    {item.statusLabel}
                                </Text>
                            </View>
                            <Text style={s.panelDetail}>
                                {item.statusCode === 'N' ? 'Value sits comfortably within the healthy reference range.' : `Value is outside normal range. Under active monitoring.`}
                            </Text>
                        </LinearGradient>

                        {/* Stability */}
                        <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={s.panel}>
                            <View style={s.panelHead}>
                                <Text style={[s.panelLabel, { color: '#7C3AED' }]}>STABILITY</Text>
                                <Text style={[s.panelScore, { color: '#7C3AED' }]}>{stabSc}<Text style={s.panelMax}>/35</Text></Text>
                            </View>
                            <View style={s.panelBar}>
                                <View style={[s.panelFill, { width: `${(stabSc / 35) * 100}%`, backgroundColor: '#7C3AED' }]} />
                            </View>
                            <View style={[s.dirBadge, { backgroundColor: dirBg(item.statusCode), alignSelf: 'flex-start', marginBottom: vs(4) }]}>
                                <Text style={[s.dirBadgeTx, { color: dirColor(item.statusCode) }]}>{dirLabel(item.statusCode)}</Text>
                            </View>
                            <Text style={s.panelDetail}>Direction of change — improving, stable or declining over recent tests.</Text>
                        </LinearGradient>

                        {/* Velocity */}
                        <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={s.panel}>
                            <View style={s.panelHead}>
                                <Text style={[s.panelLabel, { color: '#1D4ED8' }]}>VELOCITY</Text>
                                <Text style={[s.panelScore, { color: '#1D4ED8' }]}>{velSc}<Text style={s.panelMax}>/25</Text></Text>
                            </View>
                            <View style={s.panelBar}>
                                <View style={[s.panelFill, { width: `${(velSc / 25) * 100}%`, backgroundColor: '#1D4ED8' }]} />
                            </View>
                            <View style={[s.velBadge, { backgroundColor: '#FEF3C7' }]}>
                                <Text style={[s.velBadgeTx, { color: '#D97706' }]}>2.1%/mo</Text>
                            </View>
                            <Text style={s.panelDetail}>Speed of change — how fast values are rising or falling per month.</Text>
                        </LinearGradient>
                    </View>

                    {/* Trend Chart */}
                    <SecLabel text="Trend Over Time" />
                    <View style={s.chartCard}>
                        <BioChart points={item.points} id={`chart-${index}`} color={sc} />
                    </View>

                    {/* History Table */}
                    <SecLabel text="Measurement History" />
                    <View style={s.histTable}>
                        <View style={s.histHead}>
                            {['Date', 'Value', 'Change', 'Status'].map((h, i) => (
                                <Text key={i} style={[s.histTh, i === 0 && { flex: 1.5 }]}>{h}</Text>
                            ))}
                        </View>
                        {(item.history || [
                            { date: 'Mar 2025', value: item.abnormal !== '-' ? item.abnormal : item.normal, delta: '—', status: item.statusCode.replace('**', '') },
                            { date: 'Dec 2024', value: item.normal, delta: '—', status: 'N' },
                        ]).map((row, ri) => (
                            <View key={ri} style={[s.histRow, ri % 2 === 0 && s.histRowAlt]}>
                                <Text style={[s.histTd, { flex: 1.5 }]}>{row.date}</Text>
                                <Text style={[s.histTd, { color: statusDeltaColor(row.status), fontFamily: bold }]}>{row.value} <Text style={s.histUnit}>{item.unit}</Text></Text>
                                <Text style={[s.histTd, { color: row.delta?.startsWith('+') ? '#DC2626' : row.delta?.startsWith('-') ? '#16A34A' : MUTED }]}>{row.delta}</Text>
                                <View style={[s.histPill, { backgroundColor: row.status === 'N' ? '#DCFCE7' : '#FEE2E2' }]}>
                                    <Text style={[s.histPillTx, { color: row.status === 'N' ? '#16A34A' : '#DC2626' }]}>{row.status === 'N' ? 'Normal' : 'Abnormal'}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Clinical Insight */}
                    <SecLabel text="Clinical Insight" />
                    <View style={s.insightBox}>
                        <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(18)} color="#4338CA" style={{ marginTop: vs(1) }} />
                        <Text style={s.insightTx}>
                            {item.statusCode === 'N'
                                ? 'This marker is within the healthy range and stable. No immediate action required. Continue monitoring at regular intervals.'
                                : `This marker needs attention. Follow your doctor's recommendations and retest in 4–6 weeks to track progress.`}
                        </Text>
                    </View>

                    {/* View Trend button */}
                    <TouchableOpacity style={s.viewTrendBtn} activeOpacity={0.8}
                        onPress={() => navigation.navigate('AnalyteTrendScreen', { analyteName: item.name })}>
                        <Icon type={Icons.Ionicons} name="trending-up-outline" size={ms(14)} color={whiteColor} />
                        <Text style={s.viewTrendTx}>View Full Trend</Text>
                    </TouchableOpacity>

                </View>
            )}
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const BioMarkerDetailScreen = () => {
    const navigation = useNavigation();
    const route      = useRoute();
    const markerName = route.params?.marker || 'Blood Sugar';
    const config     = BIO_MARKER_CONFIGS[markerName] || BIO_MARKER_CONFIGS['Blood Sugar'];

    const [activeFilter, setActiveFilter] = useState('all');
    const [expanded, setExpanded]         = useState({ 0: true });

    const toggle = i => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

    const FILTERS = ['all', 'abnormal', 'worsening', 'fast'];
    const FILTER_LABELS = { all: 'All', abnormal: 'Abnormal', worsening: 'Worsening', fast: 'Fast Velocity' };

    const filteredMarkers = (config.bioMarkers || []).filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'abnormal') return item.statusCode !== 'N';
        if (activeFilter === 'worsening') return item.statusCode.includes('**');
        if (activeFilter === 'fast') return item.statusCode !== 'N';
        return true;
    });

    const totalMarkers = config.bioMarkers?.length || 0;
    const abnormalCount = (config.bioMarkers || []).filter(m => m.statusCode !== 'N').length;

    // Hero ring
    const heroScore = Math.round(100 - (abnormalCount / Math.max(totalMarkers, 1)) * 50);
    const heroCirc  = 2 * Math.PI * 55;
    const heroOffset = heroCirc * (1 - heroScore / 100);

    return (
        <SafeAreaView style={s.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={s.gradient}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

                    {/* ── Header ── */}
                    <View style={s.header}>
                        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                        </TouchableOpacity>
                        <View style={s.headerTextWrap}>
                            <Text style={s.headerTitle}>{markerName}</Text>
                            <Text style={s.headerSub}>Last updated {config.lastUpdate}</Text>
                        </View>
                        <View style={s.headerCodeBadge}>
                            <Text style={s.headerCodeText}>{config.code}</Text>
                        </View>
                    </View>

                    {/* ── HPS Hero Band ── */}
                    <LinearGradient
                        colors={[primaryColor, '#0A5248']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.hero}
                    >
                        <View style={s.heroDecor1} />
                        <View style={s.heroDecor2} />

                        {/* Row 1: Ring + Title */}
                        <View style={s.heroTopRow}>
                            <View style={s.heroRingWrap}>
                                <Svg width={ms(100)} height={ms(100)} viewBox="0 0 130 130">
                                    <Circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <Circle cx="65" cy="65" r="55" fill="none" stroke="#5EEAD4" strokeWidth="10"
                                        strokeDasharray={heroCirc}
                                        strokeDashoffset={heroOffset}
                                        strokeLinecap="round"
                                        rotation="-90"
                                        origin="65,65"
                                    />
                                </Svg>
                                <View style={s.heroRingCenter}>
                                    <Text style={s.heroNum}>{heroScore}</Text>
                                    <Text style={s.heroNumLbl}>/ 100</Text>
                                </View>
                            </View>
                            <View style={s.heroInfo}>
                                <Text style={s.heroTitle}>Health Progression Score</Text>
                                <Text style={s.heroSub}>
                                    Computed from <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: bold }}>{totalMarkers} biomarkers</Text> across 3 dimensions — Status, Stability and Velocity.
                                </Text>
                            </View>
                        </View>

                        {/* Row 2: 3 sub-score pills */}
                        <View style={s.subScoresRow}>
                            <View style={[s.ssPill, { backgroundColor: 'rgba(94,234,212,0.1)' }]}>
                                <View style={s.ssPillHead}>
                                    <Text style={[s.ssPillName, { color: '#5EEAD4' }]}>Status</Text>
                                    <Text style={[s.ssPillScore, { color: '#5EEAD4' }]}>26<Text style={s.ssPillMax}>/40</Text></Text>
                                </View>
                                <View style={s.ssPillBar}><View style={[s.ssPillFill, { width: '65%', backgroundColor: '#5EEAD4' }]} /></View>
                                <Text style={s.ssPillDesc}>Distance from healthy range</Text>
                            </View>
                            <View style={[s.ssPill, { backgroundColor: 'rgba(167,139,250,0.1)' }]}>
                                <View style={s.ssPillHead}>
                                    <Text style={[s.ssPillName, { color: '#A78BFA' }]}>Stability</Text>
                                    <Text style={[s.ssPillScore, { color: '#A78BFA' }]}>24<Text style={s.ssPillMax}>/35</Text></Text>
                                </View>
                                <View style={s.ssPillBar}><View style={[s.ssPillFill, { width: '69%', backgroundColor: '#A78BFA' }]} /></View>
                                <Text style={s.ssPillDesc}>Direction of change</Text>
                            </View>
                            <View style={[s.ssPill, { backgroundColor: 'rgba(96,165,250,0.1)' }]}>
                                <View style={s.ssPillHead}>
                                    <Text style={[s.ssPillName, { color: '#60A5FA' }]}>Velocity</Text>
                                    <Text style={[s.ssPillScore, { color: '#60A5FA' }]}>22<Text style={s.ssPillMax}>/25</Text></Text>
                                </View>
                                <View style={s.ssPillBar}><View style={[s.ssPillFill, { width: '88%', backgroundColor: '#60A5FA' }]} /></View>
                                <Text style={s.ssPillDesc}>Speed of change</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* ── Filter Chips ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
                        {FILTERS.map(f => (
                            <TouchableOpacity key={f}
                                style={[s.filterChip, activeFilter === f && s.filterChipActive]}
                                onPress={() => setActiveFilter(f)}>
                                <Text style={[s.filterChipTx, activeFilter === f && s.filterChipTxActive]}>
                                    {FILTER_LABELS[f]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* ── Section Title ── */}
                    <View style={s.sectionTitleRow}>
                        <View>
                            <Text style={s.sectionTitle}>Biomarker Intelligence</Text>
                            <Text style={s.sectionSub}>Tap any card to inspect score breakdown</Text>
                        </View>
                        <TouchableOpacity style={s.allTrendsBtn}
                            onPress={() => navigation.navigate('BioMarkersTrendScreen')}>
                            <Text style={s.allTrendsTx}>All Trends</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── BioMarker Cards ── */}
                    <View style={s.cardsWrap}>
                        {filteredMarkers.map((item, i) => (
                            <BioMarkerCard
                                key={i}
                                item={item}
                                index={i}
                                expanded={!!expanded[i]}
                                onToggle={() => toggle(i)}
                            />
                        ))}
                    </View>

                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default BioMarkerDetailScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0FDFA' },
    gradient:  { flex: 1 },
    scroll:    { paddingBottom: vs(40) },

    // Header
    header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(14) },
    backBtn:         { width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    headerTextWrap:  { flex: 1, marginLeft: ms(12) },
    headerTitle:     { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSub:       { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },
    headerCodeBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: ms(8), paddingHorizontal: ms(8), paddingVertical: vs(5) },
    headerCodeText:  { fontFamily: bold, fontSize: ms(10), color: whiteColor },

    // Hero Band
    hero:          { borderRadius: ms(20), margin: ms(14), marginTop: 0, padding: ms(16), flexDirection: 'column', gap: vs(12), overflow: 'hidden' },
    heroTopRow:    { flexDirection: 'row', alignItems: 'center', gap: ms(12), zIndex: 1 },
    heroDecor1:    { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(13,148,136,0.1)' },
    heroDecor2:    { position: 'absolute', bottom: -70, right: 120, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(94,234,212,0.06)' },
    heroRingWrap:  { flexShrink: 0, position: 'relative', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
    heroRingCenter:{ position: 'absolute', alignItems: 'center' },
    heroNum:       { fontFamily: bold, fontSize: ms(28), color: whiteColor, lineHeight: ms(32) },
    heroNumLbl:    { fontFamily: regular, fontSize: ms(9), color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8 },
    heroInfo:      { flex: 1 },
    heroTitle:     { fontFamily: bold, fontSize: ms(14), color: whiteColor, marginBottom: vs(3) },
    heroSub:       { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.5)', lineHeight: vs(16), marginBottom: vs(10) },
    subScoresRow:  { flexDirection: 'row', gap: ms(8), zIndex: 1 },
    ssPill:        { flex: 1, borderRadius: ms(10), padding: ms(8) },
    ssPillHead:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(5) },
    ssPillName:    { fontFamily: bold, fontSize: ms(9), textTransform: 'uppercase', letterSpacing: 0.6 },
    ssPillScore:   { fontFamily: bold, fontSize: ms(14) },
    ssPillMax:     { fontFamily: regular, fontSize: ms(9), opacity: 0.55 },
    ssPillBar:     { height: vs(3), backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(2), overflow: 'hidden', marginBottom: vs(4) },
    ssPillFill:    { height: '100%', borderRadius: ms(2) },
    ssPillDesc:    { fontFamily: regular, fontSize: ms(9), color: 'rgba(255,255,255,0.4)', lineHeight: vs(14) },

    // Filters
    filterRow:     { paddingHorizontal: ms(14), gap: ms(8), paddingBottom: vs(12) },
    filterChip:    { paddingHorizontal: ms(14), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1, borderColor: primaryColor + '40' },
    filterChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    filterChipTx:  { fontFamily: regular, fontSize: ms(12), color: MUTED },
    filterChipTxActive: { color: whiteColor, fontFamily: bold },

    // Section title
    sectionTitleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: ms(14), marginBottom: vs(10) },
    sectionTitle:    { fontFamily: bold, fontSize: ms(18), color: blackColor },
    sectionSub:      { fontFamily: regular, fontSize: ms(11), color: MUTED, marginTop: vs(2) },
    allTrendsBtn:    { borderWidth: 1, borderColor: primaryColor, borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(5) },
    allTrendsTx:     { fontFamily: bold, fontSize: ms(11), color: primaryColor },

    cardsWrap: { paddingHorizontal: ms(14), gap: vs(12) },

    // BioMarker Card
    bmCard:    { backgroundColor: whiteColor, borderRadius: ms(16), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden' },
    bmStripe:  { height: vs(4) },
    bmHdr:     { padding: ms(14) },
    bmRow1:    { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) },
    bmRow2:    { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingTop: vs(8), borderTopWidth: 0.5, borderTopColor: BORDER },
    bmIcon:    { width: ms(40), height: ms(40), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    bmMeta:    { flex: 1, minWidth: 0 },
    bmName:    { fontFamily: bold, fontSize: ms(13), color: blackColor },
    bmCat:     { fontFamily: regular, fontSize: ms(10), color: MUTED, marginTop: vs(1) },
    dirBadge:  { flexDirection: 'row', alignItems: 'center', gap: ms(3), paddingHorizontal: ms(7), paddingVertical: vs(3), borderRadius: ms(6) },
    dirBadgeTx:{ fontFamily: bold, fontSize: ms(9) },
    bmVal:     { fontFamily: bold, fontSize: ms(18) },
    bmUnit:    { fontFamily: regular, fontSize: ms(10), color: MUTED },
    bmRef:     { fontFamily: regular, fontSize: ms(9), color: '#94A3B8' },
    hpsMini:   { alignItems: 'center', flexShrink: 0 },
    hpsMiniRing:{ position: 'relative', width: ms(46), height: ms(46), justifyContent: 'center', alignItems: 'center' },
    hpsMiniNum:{ position: 'absolute', fontFamily: bold, fontSize: ms(11) },
    hpsMiniLbl:{ fontFamily: regular, fontSize: ms(8), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(1) },
    divider:   { height: 0.5, backgroundColor: BORDER, marginHorizontal: ms(12) },

    // Card Body
    bmBody: { padding: ms(12) },

    secLabelRow:  { flexDirection: 'row', alignItems: 'center', marginTop: vs(10), marginBottom: vs(6) },
    secLabel:     { fontFamily: bold, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: ms(8) },
    secLabelLine: { flex: 1, height: 0.5, backgroundColor: BORDER },

    // Range bar
    rbarWrap:   { marginBottom: vs(6) },
    rbarTrack:  { height: vs(8), backgroundColor: '#E2E8F0', borderRadius: ms(4), position: 'relative', marginVertical: vs(6), overflow: 'visible' },
    rbarNormal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(13,148,136,0.12)', borderRadius: ms(4) },
    rbarMarker: { position: 'absolute', top: -vs(5), width: ms(18), height: ms(18), borderRadius: ms(9), borderWidth: 3, borderColor: whiteColor, marginLeft: -ms(9) },
    rbarLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    rbarLbl:    { fontFamily: regular, fontSize: ms(9), color: '#94A3B8' },

    // Score Panels
    panelRow:   { flexDirection: 'row', gap: ms(8), marginBottom: vs(4) },
    panel:      { flex: 1, borderRadius: ms(12), padding: ms(10) },
    panelHead:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(6) },
    panelLabel: { fontFamily: bold, fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.6 },
    panelScore: { fontFamily: bold, fontSize: ms(18), lineHeight: ms(20) },
    panelMax:   { fontFamily: regular, fontSize: ms(9), opacity: 0.6 },
    panelBar:   { height: vs(5), backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(6) },
    panelFill:  { height: '100%', borderRadius: ms(3) },
    statusPill: { borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: vs(2), alignSelf: 'flex-start', marginBottom: vs(4) },
    statusPillTx:{ fontFamily: bold, fontSize: ms(9) },
    velBadge:   { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2), alignSelf: 'flex-start', marginBottom: vs(4) },
    velBadgeTx: { fontFamily: bold, fontSize: ms(9) },
    panelDetail:{ fontFamily: regular, fontSize: ms(10), color: '#334155', lineHeight: vs(15) },

    // Chart
    chartCard:  { backgroundColor: '#F8FFFE', borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), padding: ms(10), marginBottom: vs(4) },
    chartWrap:  {},
    xLabels:    { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: ms(4), marginTop: vs(4) },
    xLabel:     { fontFamily: regular, fontSize: ms(8), color: MUTED },

    // History Table
    histTable: { borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), overflow: 'hidden', marginBottom: vs(4) },
    histHead:  { flexDirection: 'row', backgroundColor: '#F8FFFE', padding: ms(8), borderBottomWidth: 0.5, borderBottomColor: BORDER },
    histTh:    { fontFamily: bold, fontSize: ms(9), color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },
    histRow:   { flexDirection: 'row', alignItems: 'center', padding: ms(8), borderBottomWidth: 0.5, borderBottomColor: BORDER + '80' },
    histRowAlt:{ backgroundColor: 'rgba(13,148,136,0.02)' },
    histTd:    { fontFamily: regular, fontSize: ms(11), color: blackColor, flex: 1 },
    histUnit:  { fontFamily: regular, fontSize: ms(9), color: MUTED },
    histPill:  { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(1) },
    histPillTx:{ fontFamily: bold, fontSize: ms(9) },

    // Insight
    insightBox: { backgroundColor: '#EEF2FF', borderWidth: 0.5, borderColor: 'rgba(67,56,202,0.15)', borderRadius: ms(10), padding: ms(12), flexDirection: 'row', gap: ms(8), marginBottom: vs(10) },
    insightTx:  { fontFamily: regular, fontSize: ms(11), color: '#4338CA', lineHeight: vs(18), flex: 1 },

    // View Trend btn
    viewTrendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(6), backgroundColor: primaryColor, borderRadius: ms(10), paddingVertical: vs(10), marginTop: vs(4) },
    viewTrendTx:  { fontFamily: bold, fontSize: ms(12), color: whiteColor },
});
