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
import { bold, regular } from '../../config/Constants';

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

// ── Main Screen ───────────────────────────────────────────────────────────────
const AnalyteTrendScreen = () => {
    const navigation = useNavigation();
    const route      = useRoute();
    const analyteName = route.params?.analyteName || null;
    const initialIdx  = analyteName
        ? Math.max(0, ANALYTES.findIndex(a => a.name.toLowerCase() === analyteName.toLowerCase()))
        : 0;

    const [aid, setAid]           = useState(initialIdx);
    const [axisMode, setAxisMode] = useState('rir');

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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>

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

                    {/* ── Metrics Row ── */}
                    <View style={st.metricsRow}>
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
                    </View>

                    {/* ── Chart Card ── */}
                    <View style={st.chartCard}>
                        {/* Card header */}
                        <View style={st.chartTopRow}>
                            <View>
                                <Text style={st.chartTitle}>{analyte.name} Trend</Text>
                                <Text style={st.chartSub}>Ref range: {analyte.lo} – {analyte.hi} {analyte.unit}</Text>
                            </View>
                            {/* Axis toggle */}
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

                        {/* Legend */}
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

                        {/* SVG Chart */}
                        <TrendChart rirs={rirs} rawVals={rawVals} analyte={analyte}
                            axisMode={axisMode} machineChangeIdxs={machineChangeIdxs} />
                    </View>

                    {/* ── Visit Log ── */}
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
                            const dRir       = i > 0 ? r - rirs[i - 1] : null;
                            const machChanged = i > 0 && analyte.machines[i] !== analyte.machines[i - 1];
                            const mc         = MACHINE_COLORS[analyte.machines[i]] || '#888';
                            const deltaColor = dRir === null ? '#888' : dRir > 0.05 ? '#E24B4A' : dRir < -0.05 ? '#1D9E75' : '#888';
                            const deltaIcon  = dRir === null ? null : dRir > 0.05 ? 'trending-up' : dRir < -0.05 ? 'trending-down' : 'remove';
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

                                    {/* Bottom row: value + machine + delta */}
                                    <View style={visitSt.cardBottom}>
                                        {/* Value block */}
                                        <View style={visitSt.valueBlock}>
                                            <Text style={visitSt.valueLabel}>Value</Text>
                                            <Text style={visitSt.valueNum}>
                                                {rawVals[i]}
                                                <Text style={visitSt.valueUnit}> {analyte.unit}</Text>
                                            </Text>
                                        </View>

                                        {/* Machine block */}
                                        <View style={visitSt.machineBlock}>
                                            <Text style={visitSt.valueLabel}>Machine</Text>
                                            <View style={[visitSt.machinePill, { backgroundColor: mc + '18' }]}>
                                                {machChanged && (
                                                    <Icon type={Icons.Ionicons} name="swap-horizontal" size={ms(10)} color="#BA7517" style={{ marginRight: ms(3) }} />
                                                )}
                                                <Text style={[visitSt.machineText, { color: mc }]} numberOfLines={1}>{analyte.machines[i]}</Text>
                                            </View>
                                        </View>

                                        {/* Delta block */}
                                        <View style={visitSt.deltaBlock}>
                                            <Text style={visitSt.valueLabel}>Δ RIR</Text>
                                            {dRir !== null ? (
                                                <View style={visitSt.deltaRow}>
                                                    <Icon type={Icons.Ionicons} name={deltaIcon} size={ms(13)} color={deltaColor} />
                                                    <Text style={[visitSt.deltaVal, { color: deltaColor }]}>
                                                        {dRir >= 0 ? '+' : ''}{dRir.toFixed(2)}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text style={visitSt.deltaNA}>Baseline</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

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
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: regular, fontSize: ms(10.5), color: 'rgba(255,255,255,0.72)', marginTop: vs(2) },
    headerBadge: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
    },

    // Selector
    selectorWrap: { paddingHorizontal: ms(16), marginBottom: vs(12) },
    selectorLabel: { fontFamily: bold, fontSize: ms(11), color: '#6B7280', marginBottom: vs(8) },
    chipRow: { gap: ms(8) },
    chip: {
        paddingHorizontal: ms(14), paddingVertical: vs(8),
        borderRadius: ms(20), backgroundColor: whiteColor,
        borderWidth: 1.5, borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    chipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    chipText: { fontFamily: bold, fontSize: ms(11.5), color: '#6B7280' },
    chipTextActive: { color: whiteColor },
    chipUnit: { fontFamily: regular, fontSize: ms(9.5), color: 'rgba(255,255,255,0.75)' },

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
    metricLabel: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF', marginBottom: vs(3), textTransform: 'uppercase' },
    metricValue: { fontFamily: bold, fontSize: ms(16), marginBottom: vs(2) },
    metricUnit: { fontFamily: regular, fontSize: ms(9), color: '#9CA3AF' },
    metricBadge: { borderRadius: ms(6), paddingHorizontal: ms(6), paddingVertical: vs(2), alignSelf: 'flex-start', marginTop: vs(2) },
    metricBadgeText: { fontFamily: bold, fontSize: ms(9) },

    // Chart card
    chartCard: {
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), marginBottom: vs(14),
        padding: ms(14),
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 3,
    },
    chartTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(10) },
    chartTitle: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    chartSub: { fontFamily: regular, fontSize: ms(10), color: '#9CA3AF', marginTop: vs(2) },
    toggle: { flexDirection: 'row', borderRadius: ms(8), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    toggleBtn: { paddingHorizontal: ms(12), paddingVertical: vs(6), backgroundColor: whiteColor },
    toggleBtnActive: { backgroundColor: primaryColor },
    toggleText: { fontFamily: bold, fontSize: ms(10.5), color: '#6B7280' },
    toggleTextActive: { color: whiteColor },

    legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(8) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(7), height: ms(7), borderRadius: ms(3.5) },
    legendDash: { width: ms(12), height: 2, backgroundColor: '#BA7517' },
    legendText: { fontFamily: regular, fontSize: ms(10), color: '#6B7280' },

    // Section header
    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingHorizontal: ms(16), marginBottom: vs(10) },
    sectionIcon: {
        width: ms(28), height: ms(28), borderRadius: ms(14),
        backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center',
    },
    sectionTitle: { fontFamily: bold, fontSize: ms(15), color: blackColor },

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
    visitBadgeNum: { fontFamily: bold, fontSize: ms(15) },
    visitBadgeLbl: { fontFamily: regular, fontSize: ms(8), marginTop: vs(1) },
    dateBlock: { flex: 1 },
    dateText: { fontFamily: bold, fontSize: ms(13), color: blackColor },
    noteText: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginTop: vs(2) },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
        borderRadius: ms(20),
    },
    statusDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    statusLabel: { fontFamily: bold, fontSize: ms(10.5) },

    divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: ms(14) },

    // Bottom row
    cardBottom: { flexDirection: 'row', padding: ms(14), gap: ms(12) },
    valueBlock: { flex: 1 },
    machineBlock: { flex: 1.6 },
    deltaBlock: { flex: 0.9, alignItems: 'flex-end' },

    valueLabel: { fontFamily: regular, fontSize: ms(11), color: '#9CA3AF', marginBottom: vs(5), textTransform: 'uppercase' },
    valueNum: { fontFamily: bold, fontSize: ms(17), color: blackColor },
    valueUnit: { fontFamily: regular, fontSize: ms(12), color: '#9CA3AF' },

    machinePill: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(10), paddingVertical: vs(5),
        borderRadius: ms(10), alignSelf: 'flex-start',
    },
    machineText: { fontFamily: bold, fontSize: ms(11.5) },

    deltaRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    deltaVal: { fontFamily: bold, fontSize: ms(16) },
    deltaNA: { fontFamily: regular, fontSize: ms(13), color: '#9CA3AF' },
});
