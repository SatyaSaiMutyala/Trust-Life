import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../../components/Icons';
import { heading, interMedium, interRegular } from '../../config/Constants';
import { blackColor, primaryColor, whiteColor, globalGradient2 } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';

const { width } = Dimensions.get('window');

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
    teal: '#0D9488', tealL: '#CCFBF1', tealD: '#0F766E',
    ok: '#16A34A', okL: '#F0FDF4', okB: 'rgba(22,163,74,0.15)',
    warn: '#D97706', warnL: '#FEF3C7', warnB: 'rgba(217,119,6,0.15)',
    crit: '#DC2626', critL: '#FEF2F2', critB: 'rgba(220,38,38,0.15)',
    info: '#1D4ED8', infoL: '#EFF6FF', infoB: 'rgba(29,78,216,0.12)',
    purple: '#7C3AED', purL: '#EDE9FE', purB: 'rgba(124,58,237,0.15)',
    amber: '#D97706', amberL: '#FEF3C7',
    blue: '#1D4ED8', blueL: '#EFF6FF',
    acc: primaryColor, accL: primaryColor + '18', accB: primaryColor + '33',
    muted: '#64748B', slate: '#334155', subtle: '#94A3B8',
    border: '#E2E8F0', surface: '#F7FAFC', bg: '#F1F5F9',
    navy: '#1E293B',
};

// ── Shared Components ─────────────────────────────────────────────────────────
const scColor = (sc) => ({ ok: C.ok, warn: C.warn, crit: C.crit, info: C.info, purple: C.purple, dim: C.muted, teal: C.teal }[sc] || C.muted);
const scBg    = (sc) => ({ ok: C.okL, warn: C.warnL, crit: C.critL, info: C.infoL, purple: C.purL, dim: C.bg, teal: C.tealL }[sc] || C.bg);
const scBorder= (sc) => ({ ok: C.okB, warn: C.warnB, crit: C.critB, info: C.infoB, purple: C.purB, dim: C.border, teal: C.tealL }[sc] || C.border);

const Badge = ({ sc, label }) => (
    <View style={{ backgroundColor: scBg(sc), borderRadius: ms(4), paddingHorizontal: ms(7), paddingVertical: vs(2), borderWidth: 1, borderColor: scBorder(sc) }}>
        <Text style={{ fontFamily: interMedium, fontSize: ms(9), color: scColor(sc) }}>{label}</Text>
    </View>
);

const CardHdr = ({ title, sub, right }) => (
    <View style={st.cardHdr}>
        <View style={{ flex: 1 }}>
            <Text style={st.cardTitle}>{title}</Text>
            {!!sub && <Text style={st.cardSub}>{sub}</Text>}
        </View>
        {right}
    </View>
);

const SectionLabel = ({ label }) => (
    <View style={st.seclblRow}>
        <Text style={st.seclbl}>{label}</Text>
        <View style={st.seclblLine} />
    </View>
);

const ProgBar = ({ pct, color, h = 5 }) => (
    <View style={[st.progWrap, { height: vs(h) }]}>
        <View style={[st.progFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
);

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const BarChart = ({ data, maxVal, height = 70, showVal = true, formatVal }) => {
    const max = maxVal || Math.max(...data.map(d => d.v), 1);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: vs(height), gap: ms(3) }}>
            {data.map((d, i) => {
                const pct = Math.max(d.v / max, 0.03);
                return (
                    <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        {showVal && <Text style={[st.chartVal, { color: d.col || C.muted }]}>{formatVal ? formatVal(d.v) : d.v}</Text>}
                        <View style={{ width: '100%', flex: 1, backgroundColor: C.bg, borderRadius: ms(3), overflow: 'hidden', flexDirection: 'column-reverse' }}>
                            <View style={{ flex: pct, backgroundColor: d.col || primaryColor, borderRadius: ms(3) }} />
                            <View style={{ flex: 1 - pct }} />
                        </View>
                        <Text style={[st.chartLbl, d.active && { color: primaryColor, fontFamily: interMedium }]}>{d.lbl}</Text>
                    </View>
                );
            })}
        </View>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPEND ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════════════════════
const SP_KPI = [
    { lbl: 'Total Spend',     val: '₹14.9K', sub: 'All time · 11 sessions',    col: C.navy },
    { lbl: '2025 YTD',        val: '₹7,700', sub: '3 sessions · Jan–Mar',       col: C.crit },
    { lbl: 'Avg / Session',   val: '₹1,354', sub: 'Per lab visit',              col: C.info },
    { lbl: 'Avg / Biomarker', val: '₹235',   sub: 'Cost per single test',       col: C.purple },
    { lbl: 'Insurance',       val: '₹0',     sub: 'Zero claims processed',      col: C.warn },
];

const MONTHLY_SPEND = [
    { lbl: "Apr'24", v: 0,    col: C.bg },
    { lbl: "May'24", v: 650,  col: C.info },
    { lbl: "Jun'24", v: 0,    col: C.bg },
    { lbl: "Jul'24", v: 0,    col: C.bg },
    { lbl: "Aug'24", v: 1200, col: C.purple },
    { lbl: "Sep'24", v: 0,    col: C.bg },
    { lbl: "Oct'24", v: 0,    col: C.bg },
    { lbl: "Nov'24", v: 4200, col: C.crit },
    { lbl: "Dec'24", v: 0,    col: C.bg },
    { lbl: "Jan'25", v: 2200, col: C.warn },
    { lbl: "Feb'25", v: 1100, col: C.info },
    { lbl: "Mar'25", v: 2400, col: C.warn },
];

const YOY = [
    { q: 'Q1', y24: 0,    y25: 3500 },
    { q: 'Q2', y24: 1850, y25: 0 },
    { q: 'Q3', y24: 1200, y25: 0 },
    { q: 'Q4', y24: 4200, y25: 0 },
];

const CUMUL = [0, 650, 650, 650, 1850, 1850, 1850, 6050, 6050, 8250, 9350, 11750];

const CAT_SPEND = [
    { name: 'Metabolic Panel',   val: 5800, pct: 39, col: C.info },
    { name: 'Full Body Check',   val: 4200, pct: 28, col: C.purple },
    { name: 'Lipid & Cardiac',   val: 3100, pct: 21, col: C.teal },
    { name: 'Thyroid',           val: 1800, pct: 12, col: C.warn },
];

const PROVIDERS = [
    { name: 'Apollo Diagnostics', sessions: 4, total: 9200, perTest: 612, sc: 'crit', label: 'Expensive' },
    { name: 'Thyrocare',          sessions: 4, total: 4000, perTest: 267, sc: 'ok',   label: 'Best value' },
    { name: 'Dr. Lal Pathlabs',   sessions: 2, total: 2100, perTest: 350, sc: 'ok',   label: 'Good value' },
    { name: 'SRL Diagnostics',    sessions: 1, total: 1600, perTest: 400, sc: 'warn', label: 'Average' },
];

const COST_RANKED = [
    { name: 'Vitamin D3 (25-OH)',       cost: 1000, col: C.warn },
    { name: 'Echocardiography',         cost: 900,  col: C.purple },
    { name: 'HbA1c (Glycated Hb)',      cost: 750,  col: C.crit },
    { name: 'Urine Microalbumin',       cost: 635,  col: C.teal },
    { name: 'Homocysteine',             cost: 600,  col: C.info },
    { name: 'Lipid Profile',            cost: 550,  col: C.blue },
    { name: 'CBC (Complete Blood)',     cost: 350,  col: C.ok },
    { name: 'TSH (Thyroid)',            cost: 325,  col: C.info },
];

const BILL_DIST = [
    { lbl: '<₹999',    v: 1, col: C.ok },
    { lbl: '₹1–1.9K', v: 2, col: C.teal },
    { lbl: '₹2–2.9K', v: 2, col: C.info },
    { lbl: '₹3–3.9K', v: 1, col: C.warn },
    { lbl: '₹4K+',    v: 2, col: C.purple },
];

const AVG_COST = [
    { lbl: "Apr'23", v: 325, col: C.ok },
    { lbl: "Aug'23", v: 267, col: C.ok },
    { lbl: "May'24", v: 400, col: C.warn },
    { lbl: "Aug'24", v: 350, col: C.ok },
    { lbl: "Nov'24", v: 267, col: C.ok },
    { lbl: "Feb'25", v: 312, col: C.info },
    { lbl: "Mar'25", v: 600, col: C.crit },
];

const DOC_REFERRAL = [
    { name: 'Dr. Priya Nair',   role: 'Endocrinologist', tests: 7,  spend: 9800, col: C.teal },
    { name: 'Dr. Suresh Reddy', role: 'Cardiologist',    tests: 4,  spend: 3300, col: C.purple },
    { name: 'Dr. Kavitha Iyer', role: 'Gen. Physician',  tests: 1,  spend: 1600, col: C.warn },
    { name: 'Self-initiated',   role: 'Annual full body', tests: 2, spend: 5800, col: C.muted },
];

const BENCH = [
    { lbl: 'Your Annual Spend',     val: '₹5,900', sub: '2025 (annualised)',          col: C.teal,   bg: C.tealL },
    { lbl: 'Peer Average',          val: '₹7,200', sub: 'Similar age · conditions',   col: C.muted,  bg: C.bg },
    { lbl: 'You Spend Less',        val: '18%',    sub: 'Below peer median',          col: C.ok,     bg: C.okL },
    { lbl: 'Cost / Abnormal Found', val: '₹1,867', sub: '₹14,900 for 8 abnormals',   col: C.info,   bg: C.infoL },
];

const TAT = [
    { name: 'Apollo Diagnostics', tat: 'Same day (4h)', col: C.teal },
    { name: 'Thyrocare',          tat: 'Next day',       col: C.ok },
    { name: 'Dr. Lal Pathlabs',   tat: '4–6 hours',      col: C.teal },
    { name: 'SRL Diagnostics',    tat: 'Next day',        col: C.ok },
];

const SP_INSIGHTS = [
    { icon: 'cash-outline',        text: 'Biggest cost driver is comprehensive panels — Nov 2024 Thyrocare panel alone was ₹3,200.', col: C.teal },
    { icon: 'copy-outline',        text: 'Splitting tests across sessions costs 23% more than bundled panel in one visit.', col: C.info },
    { icon: 'pricetag-outline',    text: 'Thyrocare is your most cost-efficient lab at ₹267/test vs Apollo Diagnostics at ₹600/test.', col: C.ok },
    { icon: 'trending-up-outline', text: 'Q1 spend on track to exceed full-year 2024 by March end — driven by new cardiac workup.', col: C.warn },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SPEND TAB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const TabSpend = () => (
    <View>
        {/* Hero */}
        <View style={st.hero}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12) }}>
                <View>
                    <Text style={st.heroNum}>₹14.9<Text style={st.heroUnit}>K</Text></Text>
                    <Text style={st.heroLbl}>Total diagnostic spend · all time</Text>
                </View>
                <View style={st.heroKpiGrid}>
                    {[
                        { v: '11',    l: 'Sessions' },
                        { v: '₹1,354', l: 'Avg/session' },
                        { v: '₹7,700', l: '2025 YTD' },
                        { v: '₹235',   l: 'Per marker' },
                    ].map((k, i) => (
                        <View key={i} style={st.heroKpi}>
                            <Text style={st.heroKpiVal}>{k.v}</Text>
                            <Text style={st.heroKpiLbl}>{k.l}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) }}>
                {[
                    { t: '↑ 62% YoY spend increase',              bg: 'rgba(220,38,38,0.25)',  col: '#FCA5A5' },
                    { t: 'Thyrocare cheapest ₹267/test',           bg: 'rgba(13,148,136,0.25)', col: '#5EEAD4' },
                    { t: 'Vit D3 most expensive single test',      bg: 'rgba(217,119,6,0.25)',  col: '#FCD34D' },
                    { t: 'Zero lab costs covered by insurance',    bg: 'rgba(29,78,216,0.25)',  col: '#93C5FD' },
                ].map((c, i) => (
                    <View key={i} style={[st.heroChip, { backgroundColor: c.bg }]}>
                        <Text style={[st.heroChipTxt, { color: c.col }]}>{c.t}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Stat Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: ms(8), paddingBottom: vs(4) }}>
            {SP_KPI.map((k, i) => (
                <View key={i} style={[st.statCard, { borderTopColor: k.col }]}>
                    <Text style={st.statLbl}>{k.lbl}</Text>
                    <Text style={[st.statVal, { color: k.col }]}>{k.val}</Text>
                    <Text style={st.statSub}>{k.sub}</Text>
                </View>
            ))}
        </ScrollView>

        {/* Monthly Spend */}
        <View style={st.card}>
            <CardHdr title="Monthly Lab Spend — 2 Year View" sub="Spending pattern across 12 months" />
            <View style={st.cardBody}>
                <BarChart
                    data={MONTHLY_SPEND.map(m => ({ ...m, col: m.v === 0 ? C.bg : m.col }))}
                    maxVal={4500}
                    height={75}
                    showVal={false}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(3) }}>
                    {MONTHLY_SPEND.map((m, i) => (
                        <Text key={i} style={[st.chartLbl, { flex: 1, textAlign: 'center', fontSize: ms(6.5) }]}>{m.lbl.split("'")[0]}</Text>
                    ))}
                </View>
            </View>
        </View>

        {/* YoY Comparison */}
        <View style={st.card}>
            <CardHdr title="Year-over-Year Comparison" sub="Quarterly spend: 2024 vs 2025" />
            <View style={st.cardBody}>
                {YOY.map((q, i) => (
                    <View key={i} style={{ marginBottom: vs(10) }}>
                        <Text style={st.yoyQ}>{q.q}</Text>
                        <View style={{ gap: vs(4) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8) }}>
                                <Text style={[st.yoyLbl, { color: C.muted }]}>2024</Text>
                                <View style={{ flex: 1, height: vs(7), backgroundColor: C.bg, borderRadius: ms(4), overflow: 'hidden' }}>
                                    <View style={{ width: `${(q.y24 / 4500) * 100}%`, height: '100%', backgroundColor: C.muted + 'AA', borderRadius: ms(4) }} />
                                </View>
                                <Text style={st.yoyVal}>{q.y24 ? `₹${q.y24.toLocaleString('en-IN')}` : '—'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(8) }}>
                                <Text style={[st.yoyLbl, { color: primaryColor }]}>2025</Text>
                                <View style={{ flex: 1, height: vs(7), backgroundColor: C.bg, borderRadius: ms(4), overflow: 'hidden' }}>
                                    <View style={{ width: `${(q.y25 / 4500) * 100}%`, height: '100%', backgroundColor: primaryColor + 'CC', borderRadius: ms(4) }} />
                                </View>
                                <Text style={[st.yoyVal, { color: q.y25 ? primaryColor : C.muted }]}>{q.y25 ? `₹${q.y25.toLocaleString('en-IN')}` : '—'}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Cumulative + Category */}
        <View style={st.card}>
            <CardHdr title="Cumulative Spend Over Time" sub="Running total since first test" />
            <View style={st.cardBody}>
                <BarChart
                    data={MONTHLY_SPEND.map((m, i) => ({ lbl: m.lbl.split("'")[0], v: CUMUL[i], col: primaryColor + (CUMUL[i] > 8000 ? 'EE' : CUMUL[i] > 3000 ? 'AA' : '66') }))}
                    maxVal={12000}
                    height={70}
                    showVal={false}
                />
            </View>
        </View>

        <View style={st.card}>
            <CardHdr title="Spend by Test Category" sub="What types of tests consume budget" />
            <View style={st.cardBody}>
                {CAT_SPEND.map((c, i) => (
                    <View key={i} style={{ marginBottom: vs(10) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                                <View style={{ width: ms(8), height: ms(8), borderRadius: ms(2), backgroundColor: c.col }} />
                                <Text style={st.catName}>{c.name}</Text>
                            </View>
                            <Text style={[st.catVal, { color: c.col }]}>₹{c.val.toLocaleString('en-IN')}</Text>
                        </View>
                        <ProgBar pct={c.pct} color={c.col} h={6} />
                        <Text style={st.catPct}>{c.pct}% of total spend</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Provider Comparison */}
        <View style={st.card}>
            <CardHdr title="Lab Provider Comparison" sub="Total billed, sessions, avg cost per test" />
            <View>
                {PROVIDERS.map((p, i) => (
                    <View key={i} style={[st.providerRow, i === PROVIDERS.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={st.providerName}>{p.name}</Text>
                            <Text style={st.providerMeta}>{p.sessions} sessions</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', gap: vs(3) }}>
                            <Text style={st.providerTotal}>₹{p.total.toLocaleString('en-IN')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                                <Text style={[st.providerPerTest, { color: scColor(p.sc) }]}>₹{p.perTest}/test</Text>
                                <Badge sc={p.sc} label={p.label} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Most Expensive Tests */}
        <View style={st.card}>
            <CardHdr title="Most Expensive Individual Tests" sub="Cost per single biomarker test" />
            <View style={st.cardBody}>
                {COST_RANKED.map((t, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(9) }}>
                        <Text style={st.rankNum}>{i + 1}</Text>
                        <Text style={{ fontFamily: interMedium, fontSize: ms(11), color: blackColor, flex: 1 }}>{t.name}</Text>
                        <View style={{ width: ms(70), height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' }}>
                            <View style={{ width: `${(t.cost / 1000) * 100}%`, height: '100%', backgroundColor: t.col }} />
                        </View>
                        <Text style={[st.rankVal, { color: t.col }]}>₹{t.cost}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Bill Distribution */}
        <View style={st.card}>
            <CardHdr title="Bill Size Distribution" sub="Histogram of lab session costs" />
            <View style={st.cardBody}>
                <BarChart data={BILL_DIST} maxVal={3} height={70} />
            </View>
        </View>

        {/* Avg Cost Per Test */}
        <View style={st.card}>
            <CardHdr title="Average Cost per Biomarker Over Time" sub="Efficiency trend — are panels getting cheaper?" />
            <View style={st.cardBody}>
                <BarChart data={AVG_COST} maxVal={700} height={70} formatVal={v => `₹${v}`} />
            </View>
        </View>

        {/* Doctor Referral Spend */}
        <View style={st.card}>
            <CardHdr title="Spend Triggered by Doctor Referral" sub="Which doctor referrals led to most lab spend" />
            <View style={st.cardBody}>
                {DOC_REFERRAL.map((d, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) }}>
                        <View style={[st.docAvatar, { backgroundColor: d.col + '22' }]}>
                            <Text style={[st.docAvatarTxt, { color: d.col }]}>
                                {d.name.replace('Dr. ', '').split(' ').slice(0, 2).map(p => p[0]).join('')}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={st.docName}>{d.name}</Text>
                            <Text style={st.docRole}>{d.role} · {d.tests} test orders</Text>
                            <View style={{ marginTop: vs(4), height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' }}>
                                <View style={{ width: `${(d.spend / 9800) * 100}%`, height: '100%', backgroundColor: d.col }} />
                            </View>
                        </View>
                        <Text style={[st.docSpend, { color: d.col }]}>₹{d.spend.toLocaleString('en-IN')}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Benchmarking */}
        <View style={st.card}>
            <CardHdr title="Spend Benchmarking" sub="You vs similar profiles (diabetic male, 30–40, urban India)" />
            <View style={[st.labGrid, { padding: ms(12) }]}>
                {BENCH.map((b, i) => (
                    <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                        <View style={[st.benchCard, { backgroundColor: b.bg }]}>
                            <Text style={[st.benchLbl, { color: b.col }]}>{b.lbl}</Text>
                            <Text style={[st.benchVal, { color: b.col }]}>{b.val}</Text>
                            <Text style={[st.benchSub, { color: b.col }]}>{b.sub}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Spend Insights + TAT */}
        <View style={st.card}>
            <CardHdr title="Spend Insights" />
            <View style={st.cardBody}>
                {SP_INSIGHTS.map((s, i) => (
                    <View key={i} style={[st.insightRow, { backgroundColor: s.col + '12', borderLeftColor: s.col, marginBottom: vs(8) }]}>
                        <Icon type={Icons.Ionicons} name={s.icon} color={s.col} size={ms(14)} />
                        <Text style={[st.insightTxt, { color: s.col }]}>{s.text}</Text>
                    </View>
                ))}
            </View>
        </View>

        <View style={st.card}>
            <CardHdr title="Turn-around Time by Provider" sub="Sample to report delivery" />
            <View>
                {TAT.map((t, i) => (
                    <View key={i} style={[st.tatRow, i === TAT.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={st.tatName}>{t.name}</Text>
                        <Badge sc={t.tat.includes('Same') ? 'teal' : 'ok'} label={t.tat} />
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BEHAVIOUR ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════════════════════
const BH_KPI = [
    { lbl: 'Compliance Rate', val: '78%',   sub: '11 of 14 ordered',     col: C.warn },
    { lbl: 'Avg Delay',       val: '8.2d',  sub: 'Order to sample',       col: C.info },
    { lbl: 'Self-Initiated',  val: '2',     sub: 'Proactive tests',       col: C.teal },
    { lbl: 'Skipped Tests',   val: '3',     sub: 'Needs attention',       col: C.crit },
    { lbl: 'Repeat Rate',     val: '41%',   sub: 'Markers tested 3+ times', col: C.purple },
];

const COMP_BY_TYPE = [
    { name: 'Glycaemic (HbA1c, Glucose)', done: 5, total: 5, col: C.teal },
    { name: 'Lipid Profile',              done: 2, total: 4, col: C.purple },
    { name: 'Vitamin / Micronutrient',    done: 3, total: 3, col: C.blue },
    { name: 'Thyroid Panel',              done: 2, total: 2, col: C.ok },
    { name: 'Kidney / Renal',             done: 1, total: 2, col: C.warn },
    { name: 'Liver Function',             done: 1, total: 1, col: C.info },
];

const LAG_DATA = [
    { lbl: 'HbA1c\nMar', v: 3,  col: C.ok },
    { lbl: 'Lipid\nFeb', v: 8,  col: C.warn },
    { lbl: 'CBC\nMar',   v: 3,  col: C.ok },
    { lbl: 'Vit D\nNov', v: 5,  col: C.warn },
    { lbl: 'HbA1c\nNov', v: 2,  col: C.ok },
    { lbl: 'TSH\nNov',   v: 2,  col: C.ok },
    { lbl: 'CBC\nAug',   v: 12, col: C.crit },
    { lbl: 'Hcy\nFeb',   v: 10, col: C.crit },
];

const HEATMAP_SESSIONS = ["Apr'23", "Aug'23", "May'24", "Aug'24", "Nov'24", "Feb'25", "Mar'25"];
const HEATMAP_MARKERS = [
    { name: 'HbA1c',            vals: ['h','h','h','h','h',null,'h'] },
    { name: 'Fasting Glucose',  vals: ['h',null,'h','h',null,null,'h'] },
    { name: 'Hemoglobin',       vals: ['l','l','l','l','l',null,'l'] },
    { name: 'WBC Count',        vals: ['n',null,'n','n',null,null,'n'] },
    { name: 'Platelets',        vals: ['n',null,null,'n',null,null,'n'] },
    { name: 'LDL Cholesterol',  vals: [null,null,'h','h',null,'h',null] },
    { name: 'HDL Cholesterol',  vals: [null,null,'n','n',null,'n',null] },
    { name: 'Triglycerides',    vals: [null,null,'n','n',null,'n',null] },
    { name: 'TSH',              vals: [null,null,'n',null,'n',null,null] },
    { name: 'Vitamin D3',       vals: [null,null,null,null,'l',null,null] },
    { name: 'Vitamin B12',      vals: [null,null,null,null,'l',null,null] },
    { name: 'Creatinine',       vals: [null,null,'n','n',null,null,null] },
    { name: 'ALT',              vals: [null,null,'n',null,null,null,null] },
    { name: 'Urine Microalb.',  vals: [null,null,null,null,null,null,null] },
];
const HM_COL = { n: C.ok, h: C.crit, l: C.warn, null: C.border };
const HM_LBL = { n: 'N', h: 'H', l: 'L', null: '–' };

const MARKER_EVO = [
    { name: 'HbA1c',        vals: ['h','h','h','h','h','h'], trend: '↓ Improving', latest: '5.9%',    tc: C.ok },
    { name: 'LDL',          vals: ['h','h','h','h'],         trend: '↓ Declining', latest: '138',      tc: C.warn },
    { name: 'Hemoglobin',   vals: ['l','l','l','l','l','l'], trend: '→ Static',    latest: '13.2',     tc: C.crit },
    { name: 'Vitamin D3',   vals: ['l','l','l'],             trend: '↑ Rising',    latest: '14 ng/mL', tc: C.ok },
    { name: 'Fasting Gluc', vals: ['h','h','n','h','h'],     trend: '~ Borderline', latest: '102',     tc: C.warn },
    { name: 'TSH',          vals: ['n','n','n','n'],         trend: '→ Stable',    latest: '2.4',      tc: C.ok },
    { name: 'HDL',          vals: ['n','n','n','n'],         trend: '→ Stable',    latest: '52',       tc: C.ok },
    { name: 'Vitamin B12',  vals: ['l','l','n'],             trend: '↑ Improving', latest: '280',      tc: C.ok },
];

const SEASONS = [
    { name: 'Q1 Jan–Mar', icon: 'flower-outline',    count: 3, sub: '22 biomarkers', col: C.warn,   bg: C.warnL },
    { name: 'Q2 Apr–Jun', icon: 'sunny-outline',     count: 2, sub: '11 biomarkers', col: C.teal,   bg: C.tealL },
    { name: 'Q3 Jul–Sep', icon: 'rainy-outline',     count: 2, sub: '9 biomarkers',  col: C.info,   bg: C.infoL },
    { name: 'Q4 Oct–Dec', icon: 'snow-outline',      count: 4, sub: '21 biomarkers', col: C.purple, bg: C.purL },
];

const REPEAT_DATA = [
    { lbl: 'HbA1c',     v: 6, col: C.crit },
    { lbl: 'Hgb',       v: 5, col: C.crit },
    { lbl: 'Glucose',   v: 5, col: C.crit },
    { lbl: 'LDL',       v: 4, col: C.warn },
    { lbl: 'HDL',       v: 4, col: C.warn },
    { lbl: 'TSH',       v: 4, col: C.warn },
    { lbl: 'Plt',       v: 3, col: C.info },
    { lbl: 'Creat.',    v: 3, col: C.info },
    { lbl: 'Vit D',     v: 3, col: C.info },
    { lbl: 'B12',       v: 2, col: C.teal },
    { lbl: 'ALT',       v: 2, col: C.teal },
    { lbl: 'TG',        v: 4, col: C.warn },
];

const SKIPPED = [
    { name: 'Urine Microalbumin (Spot)', ordered: 'Mar 09, 2025', by: 'Dr. Priya Nair',  reason: 'Not yet done',           sc: 'crit' },
    { name: 'Lipid Profile Repeat',      ordered: 'Aug 2024',     by: 'Dr. Suresh Reddy', reason: 'Skipped — no symptoms', sc: 'warn' },
    { name: 'Kidney Function Panel',     ordered: 'May 2024',     by: 'Dr. Priya Nair',  reason: 'Delayed, done partially', sc: 'warn' },
];

const RECOMMENDED = [
    { name: 'Urine Microalbumin',  reason: 'Ordered Mar 9 — not done',       due: 'Immediate',  col: C.crit },
    { name: 'Lipid Profile',       reason: '6-week post-Rosuvastatin check',  due: 'Apr 5, 2025',col: C.purple },
    { name: 'Vitamin D3 (25-OH)',  reason: 'Repletion progress check',        due: 'May 2025',   col: C.info },
    { name: 'HbA1c',               reason: 'Quarterly review — 3 months due', due: 'Jun 2025',   col: C.teal },
    { name: 'Kidney Function',     reason: 'Annual check — diabetic monitor', due: 'Jun 2025',   col: C.warn },
];

const BH_INSIGHTS = [
    { title: 'Compliance Pattern', icon: 'checkmark-circle-outline', col: C.teal, bg: C.tealL, body: 'You complete 95% of HbA1c tests ordered (diabetes vigilance high) but only 60% of cardiac tests. Cardiac follow-through needs attention.' },
    { title: 'Delay Pattern',      icon: 'time-outline',             col: C.purple, bg: C.purL, body: 'You wait 7–10 days after a doctor visit before getting blood drawn. Friday-ordered tests have the longest delay (14 days avg).' },
    { title: 'Clustering Pattern', icon: 'layers-outline',           col: C.warn, bg: C.warnL, body: 'You bundle multiple referrals into one lab visit (saving ₹150–200 in collection fees). 3 of 11 sessions combined tests from 2 different doctors.' },
];

const TRIGGER_DATA = [
    { name: 'Doctor-ordered (follow-up)',   v: 7,  col: C.teal   },
    { name: 'Doctor-ordered (new symptom)', v: 2,  col: C.purple },
    { name: 'Self-initiated (annual)',      v: 1,  col: C.info   },
    { name: 'Self-initiated (concern)',     v: 1,  col: C.muted  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// BEHAVIOUR TAB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const TabBehaviour = () => (
    <View>
        {/* Hero */}
        <View style={st.hero}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12) }}>
                <View>
                    <Text style={st.heroNum}>78<Text style={st.heroUnit}>%</Text></Text>
                    <Text style={st.heroLbl}>Test compliance score</Text>
                </View>
                <View style={st.heroKpiGrid}>
                    {[
                        { v: '14',   l: 'Ordered' },
                        { v: '11',   l: 'Completed' },
                        { v: '3',    l: 'Skipped' },
                        { v: '8.2d', l: 'Avg delay' },
                    ].map((k, i) => (
                        <View key={i} style={st.heroKpi}>
                            <Text style={st.heroKpiVal}>{k.v}</Text>
                            <Text style={st.heroKpiLbl}>{k.l}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) }}>
                {[
                    { t: 'Urine Microalbumin ordered Mar 9 — not yet done', bg: 'rgba(220,38,38,0.25)',  col: '#FCA5A5' },
                    { t: 'Self-ordered full body check Feb 2024',             bg: 'rgba(124,58,237,0.25)', col: '#C4B5FD' },
                    { t: 'Avg 8.2 days to complete doctor-ordered tests',    bg: 'rgba(217,119,6,0.25)',  col: '#FCD34D' },
                ].map((c, i) => (
                    <View key={i} style={[st.heroChip, { backgroundColor: c.bg }]}>
                        <Text style={[st.heroChipTxt, { color: c.col }]}>{c.t}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Stat Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: ms(8), paddingBottom: vs(4) }}>
            {BH_KPI.map((k, i) => (
                <View key={i} style={[st.statCard, { borderTopColor: k.col }]}>
                    <Text style={st.statLbl}>{k.lbl}</Text>
                    <Text style={[st.statVal, { color: k.col }]}>{k.val}</Text>
                    <Text style={st.statSub}>{k.sub}</Text>
                </View>
            ))}
        </ScrollView>

        {/* Order-to-Test Lag */}
        <View style={st.card}>
            <CardHdr title="Order-to-Test Lag" sub="Days between doctor order and sample collection" />
            <View style={st.cardBody}>
                <BarChart data={LAG_DATA} maxVal={15} height={75} />
                <View style={[st.insightRow, { backgroundColor: C.warnL, borderLeftColor: C.warn, marginTop: vs(10) }]}>
                    <Icon type={Icons.Ionicons} name="time-outline" color={C.warn} size={ms(13)} />
                    <Text style={[st.insightTxt, { color: C.warn }]}>Tests ordered on Fridays average 14 day delay. Aim to visit lab within 3 days of doctor consultation.</Text>
                </View>
            </View>
        </View>

        {/* Compliance by Test Type */}
        <View style={st.card}>
            <CardHdr title="Compliance by Test Type" sub="How reliably each test category gets done" />
            <View>
                {COMP_BY_TYPE.map((t, i) => {
                    const pct = Math.round((t.done / t.total) * 100);
                    return (
                        <View key={i} style={[st.compRow, i === COMP_BY_TYPE.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={[st.compIcon, { backgroundColor: t.col + '18' }]}>
                                <Icon type={Icons.Ionicons} name="flask-outline" color={t.col} size={ms(13)} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={st.compName}>{t.name}</Text>
                                <Text style={st.compMeta}>{t.done} of {t.total} completed</Text>
                            </View>
                            <View style={{ width: ms(80) }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: vs(3) }}>
                                    <Text style={[st.compPct, { color: pct >= 90 ? C.ok : pct >= 60 ? C.warn : C.crit }]}>{pct}%</Text>
                                </View>
                                <ProgBar pct={pct} color={pct >= 90 ? C.ok : pct >= 60 ? C.warn : C.crit} h={4} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>

        {/* Ordered vs Completed summary */}
        <View style={st.card}>
            <CardHdr title="Ordered vs Completed vs Skipped" sub="Overall test completion summary" />
            <View style={[st.labGrid, { padding: ms(12) }]}>
                {[
                    { lbl: 'Completed', v: 11, total: 14, col: C.ok },
                    { lbl: 'Pending',   v: 2,  total: 14, col: C.warn },
                    { lbl: 'Skipped',   v: 1,  total: 14, col: C.crit },
                ].map((item, i) => (
                    <View key={i} style={[{ width: '31%', marginRight: i < 2 ? '3.5%' : 0, backgroundColor: item.col + '12', borderRadius: ms(10), borderWidth: 1, borderColor: item.col + '33', padding: ms(12), alignItems: 'center' }]}>
                        <Text style={[st.statVal, { color: item.col, fontSize: ms(22) }]}>{item.v}</Text>
                        <Text style={[st.statLbl, { textAlign: 'center', marginTop: vs(2) }]}>{item.lbl}</Text>
                        <ProgBar pct={(item.v / item.total) * 100} color={item.col} h={4} />
                    </View>
                ))}
            </View>
        </View>

        {/* Biomarker Heatmap */}
        <View style={st.card}>
            <CardHdr
                title="Biomarker Test History Heatmap"
                sub="Each column = one session · Colour = result status"
                right={
                    <View style={{ flexDirection: 'row', gap: ms(6), flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {[{ l: 'Normal', c: C.ok }, { l: 'High', c: C.crit }, { l: 'Low', c: C.warn }, { l: 'N/A', c: C.border }].map((x, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: ms(3) }}>
                                <View style={{ width: ms(8), height: ms(8), borderRadius: ms(2), backgroundColor: x.c }} />
                                <Text style={{ fontFamily: interRegular, fontSize: ms(8), color: C.muted }}>{x.l}</Text>
                            </View>
                        ))}
                    </View>
                }
            />
            <View style={st.cardBody}>
                {/* Header row */}
                <View style={{ flexDirection: 'row', marginBottom: vs(4) }}>
                    <View style={{ width: ms(90) }} />
                    {HEATMAP_SESSIONS.map((s, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontFamily: interRegular, fontSize: ms(7.5), color: C.muted, textAlign: 'center' }}>{s.replace("'", "\n'")}</Text>
                        </View>
                    ))}
                </View>
                {HEATMAP_MARKERS.map((m, mi) => (
                    <View key={mi} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(5) }}>
                        <Text style={{ width: ms(90), fontFamily: interMedium, fontSize: ms(9.5), color: blackColor }} numberOfLines={1}>{m.name}</Text>
                        {m.vals.map((v, vi) => (
                            <View key={vi} style={{ flex: 1, alignItems: 'center' }}>
                                <View style={[st.hmCell, { backgroundColor: HM_COL[v] || C.border, opacity: v ? 1 : 0.4 }]}>
                                    <Text style={st.hmCellTxt}>{HM_LBL[v] || '–'}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </View>

        {/* Marker Evolution */}
        <View style={st.card}>
            <CardHdr title="Marker Status Evolution" sub="Status change across all readings" />
            <View style={st.cardBody}>
                {MARKER_EVO.map((m, i) => (
                    <View key={i} style={[st.mevRow, i === MARKER_EVO.length - 1 && { borderBottomWidth: 0 }]}>
                        <Text style={st.mevName}>{m.name}</Text>
                        <View style={{ flexDirection: 'row', gap: ms(4), flex: 1 }}>
                            {m.vals.map((v, vi) => (
                                <View key={vi} style={[st.mevDot, { backgroundColor: HM_COL[v] }]}>
                                    <Text style={st.mevDotTxt}>{HM_LBL[v]}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={[st.mevTrend, { color: m.tc }]}>{m.trend}</Text>
                        <Text style={[st.mevLatest, { color: m.tc }]}>{m.latest}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Test-Seeking Trigger */}
        <View style={st.card}>
            <CardHdr title="Test-Seeking Behaviour" sub="What drives a lab visit" />
            <View style={st.cardBody}>
                {TRIGGER_DATA.map((t, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(9) }}>
                        <View style={{ width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: t.col }} />
                        <Text style={{ fontFamily: interMedium, fontSize: ms(11), color: blackColor, flex: 1 }}>{t.name}</Text>
                        <View style={{ width: ms(60), height: vs(4), backgroundColor: C.bg, borderRadius: ms(2), overflow: 'hidden' }}>
                            <View style={{ width: `${(t.v / 7) * 100}%`, height: '100%', backgroundColor: t.col }} />
                        </View>
                        <Text style={[st.rankVal, { color: t.col }]}>{t.v}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Seasonality */}
        <View style={st.card}>
            <CardHdr title="Lab Visit Seasonality" sub="Tests distributed by quarter" />
            <View style={[st.labGrid, { padding: ms(12) }]}>
                {SEASONS.map((s, i) => (
                    <View key={i} style={[st.labCardOuter, i % 2 === 0 && { marginRight: '3%' }]}>
                        <View style={[st.seasonCard, { backgroundColor: s.bg, borderColor: s.col + '33' }]}>
                            <Text style={[st.seasonName, { color: s.col }]}>{s.name}</Text>
                            <Icon type={Icons.Ionicons} name={s.icon} color={s.col} size={ms(22)} />
                            <Text style={[st.seasonCount, { color: s.col }]}>{s.count}</Text>
                            <Text style={st.seasonSub}>{s.sub}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={[st.insightRow, { backgroundColor: C.infoL, borderLeftColor: C.info, marginHorizontal: ms(12), marginBottom: ms(12) }]}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" color={C.info} size={ms(13)} />
                <Text style={[st.insightTxt, { color: C.info }]}>Q4 is highest-activity quarter — Nov/Dec aligns with 6-month review cycle. Consider spacing Q1 tests to April to even out costs.</Text>
            </View>
        </View>

        {/* Repeat Test Pattern */}
        <View style={st.card}>
            <CardHdr title="Repeat Test Pattern" sub="How often each biomarker is re-tested" />
            <View style={st.cardBody}>
                <BarChart data={REPEAT_DATA} maxVal={7} height={70} />
            </View>
        </View>

        {/* Skipped & Pending */}
        <View style={st.card}>
            <CardHdr title="Skipped & Pending Tests" sub="Ordered by doctors but not yet completed" right={<Badge sc="crit" label="3 action needed" />} />
            <View style={{ padding: ms(12), gap: vs(8) }}>
                {SKIPPED.map((s, i) => (
                    <View key={i} style={[st.insightRow, { backgroundColor: scBg(s.sc), borderLeftColor: scColor(s.sc), borderWidth: 1, borderColor: scBorder(s.sc) }]}>
                        <Icon type={Icons.Ionicons} name="warning-outline" color={scColor(s.sc)} size={ms(14)} />
                        <View style={{ flex: 1 }}>
                            <Text style={[st.skippedName, { color: scColor(s.sc) }]}>{s.name}</Text>
                            <Text style={st.skippedMeta}>Ordered by {s.by} · {s.ordered} · {s.reason}</Text>
                        </View>
                        <Badge sc={s.sc} label={s.sc === 'crit' ? 'Overdue' : 'Pending'} />
                    </View>
                ))}
            </View>
        </View>

        {/* Recommended Next Tests */}
        <View style={st.card}>
            <CardHdr title="Recommended Next Tests" sub="Based on conditions and test history" />
            <View>
                {RECOMMENDED.map((r, i) => (
                    <View key={i} style={[st.recRow, i === RECOMMENDED.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={{ width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: r.col, marginTop: vs(2) }} />
                        <View style={{ flex: 1 }}>
                            <Text style={st.recName}>{r.name}</Text>
                            <Text style={st.recReason}>{r.reason}</Text>
                        </View>
                        <Text style={[st.recDue, { color: r.col }]}>{r.due}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Behavioural Patterns */}
        <View style={st.card}>
            <CardHdr title="Behavioural Patterns & Insights" sub="Detected patterns in your lab-testing behaviour" />
            <View style={{ padding: ms(12), gap: vs(8) }}>
                {BH_INSIGHTS.map((b, i) => (
                    <View key={i} style={[st.bhInsightCard, { backgroundColor: b.bg, borderColor: b.col + '33' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(5) }}>
                            <Icon type={Icons.Ionicons} name={b.icon} color={b.col} size={ms(14)} />
                            <Text style={[st.bhInsightTitle, { color: b.col }]}>{b.title}</Text>
                        </View>
                        <Text style={[st.bhInsightBody, { color: b.col }]}>{b.body}</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const SEC_TABS = [
    { key: 'spend',     label: 'Spend Analytics',    icon: 'cash-outline' },
    { key: 'behaviour', label: 'Behaviour Analytics', icon: 'stats-chart-outline' },
];

const LabAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('spend');

    return (
        <LinearGradient colors={globalGradient2} locations={[0, 0.3]} style={st.flex1}>
            <SafeAreaView style={st.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={st.header}>
                    <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={st.headerTitle}>Lab Analytics</Text>
                        <Text style={st.headerSub}>Spend & Behaviour Intelligence · Arjun Sharma</Text>
                    </View>
                </View>

                {/* Section Tab Bar */}
                <View style={st.tabBar}>
                    {SEC_TABS.map(tab => {
                        const isActive = activeTab === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={[st.tab, isActive && st.tabActive]}
                                onPress={() => setActiveTab(tab.key)}
                                activeOpacity={0.8}
                            >
                                <Icon type={Icons.Ionicons} name={tab.icon} color={isActive ? whiteColor : C.subtle} size={ms(14)} />
                                <Text style={[st.tabTxt, isActive && st.tabTxtActive]}>{tab.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Content */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
                    {activeTab === 'spend' ? <TabSpend /> : <TabBehaviour />}
                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default LabAnalyticsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
    flex1: { flex: 1 },
    scroll: { paddingHorizontal: ms(16), paddingTop: vs(10) },

    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(10), gap: ms(10) },
    backBtn: { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.65)', marginTop: vs(1) },

    // Tab Bar — matches MedicationAnalyticsScreen floating card style
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: ms(20),
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(4),
        marginBottom: vs(8),
        shadowColor: blackColor,
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: ms(4), paddingVertical: vs(8), borderRadius: ms(9),
    },
    tabActive: { backgroundColor: primaryColor },
    tabTxt: { fontFamily: interMedium, fontSize: ms(12), color: C.subtle },
    tabTxtActive: { color: whiteColor },

    // Card
    card: { backgroundColor: whiteColor, borderRadius: ms(12), marginBottom: vs(12), borderWidth: 1, borderColor: C.border, overflow: 'hidden', elevation: 1, shadowColor: blackColor, shadowOpacity: 0.05, shadowRadius: 3 },
    cardHdr: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface, gap: ms(8) },
    cardTitle: { fontFamily: interMedium, fontSize: ms(11), color: C.slate, textTransform: 'uppercase', letterSpacing: 0.5 },
    cardSub: { fontFamily: interRegular, fontSize: ms(10), color: C.muted, marginTop: vs(1) },
    cardBody: { padding: ms(12) },

    // Hero
    hero: { borderRadius: ms(14), padding: ms(16), marginBottom: vs(12), overflow: 'hidden', backgroundColor: primaryColor },
    heroNum: { fontFamily: heading, fontSize: ms(44), color: whiteColor, lineHeight: ms(46) },
    heroUnit: { fontFamily: interRegular, fontSize: ms(18), color: 'rgba(255,255,255,0.55)' },
    heroLbl: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(2) },
    heroKpiGrid: { flexDirection: 'row', flexWrap: 'wrap', flex: 1, paddingLeft: ms(16), gap: ms(12) },
    heroKpi: { minWidth: ms(60) },
    heroKpiVal: { fontFamily: interMedium, fontSize: ms(15), color: whiteColor },
    heroKpiLbl: { fontFamily: interRegular, fontSize: ms(9.5), color: 'rgba(255,255,255,0.5)', marginTop: vs(1) },
    heroChip: { borderRadius: ms(14), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    heroChipTxt: { fontFamily: interMedium, fontSize: ms(10) },

    // Stat card (horizontal scroll)
    statCard: { backgroundColor: whiteColor, borderRadius: ms(10), padding: ms(12), borderTopWidth: 3, borderWidth: 1, borderColor: C.border, minWidth: ms(110), elevation: 1 },
    statLbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(4) },
    statVal: { fontFamily: interMedium, fontSize: ms(18), lineHeight: ms(20) },
    statSub: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, marginTop: vs(3) },

    // Charts
    chartVal: { fontFamily: interMedium, fontSize: ms(8), color: C.slate, marginBottom: vs(2), textAlign: 'center' },
    chartLbl: { fontFamily: interRegular, fontSize: ms(8), color: C.muted, marginTop: vs(2), textAlign: 'center' },

    // Progress bar
    progWrap: { height: vs(5), backgroundColor: C.bg, borderRadius: ms(3), overflow: 'hidden' },
    progFill: { height: '100%', borderRadius: ms(3) },

    // Section label
    seclblRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginTop: vs(8), marginBottom: vs(6) },
    seclbl: { fontFamily: interMedium, fontSize: ms(9), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.7 },
    seclblLine: { flex: 1, height: 1, backgroundColor: C.border },

    // YoY
    yoyQ: { fontFamily: interMedium, fontSize: ms(11), color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(5) },
    yoyLbl: { fontFamily: interMedium, fontSize: ms(10), width: ms(28) },
    yoyVal: { fontFamily: interMedium, fontSize: ms(10), width: ms(60), textAlign: 'right' },

    // Category
    catName: { fontFamily: interMedium, fontSize: ms(11.5), color: blackColor },
    catVal: { fontFamily: interMedium, fontSize: ms(11.5) },
    catPct: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, marginTop: vs(2) },

    // Provider row
    providerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border },
    providerName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    providerMeta: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    providerTotal: { fontFamily: interMedium, fontSize: ms(13), color: blackColor, marginBottom: vs(3) },
    providerPerTest: { fontFamily: interMedium, fontSize: ms(10) },

    // Rank
    rankNum: { fontFamily: interMedium, fontSize: ms(11), color: C.subtle, width: ms(18) },
    rankVal: { fontFamily: interMedium, fontSize: ms(11), width: ms(48), textAlign: 'right' },

    // Doc referral
    docAvatar: { width: ms(36), height: ms(36), borderRadius: ms(18), justifyContent: 'center', alignItems: 'center' },
    docAvatarTxt: { fontFamily: interMedium, fontSize: ms(11) },
    docName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    docRole: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    docSpend: { fontFamily: interMedium, fontSize: ms(12) },

    // 2-col grid
    labGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: ms(10), paddingBottom: ms(4) },
    labCardOuter: { width: '48.5%', marginBottom: vs(8) },

    // Benchmarking card
    benchCard: { flex: 1, borderRadius: ms(10), padding: ms(12) },
    benchLbl: { fontFamily: interMedium, fontSize: ms(10), textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(5) },
    benchVal: { fontFamily: heading, fontSize: ms(22), lineHeight: ms(24), marginBottom: vs(3) },
    benchSub: { fontFamily: interRegular, fontSize: ms(10), lineHeight: ms(15) },

    // Insight row
    insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8), padding: ms(10), borderRadius: ms(8), borderLeftWidth: 3 },
    insightTxt: { flex: 1, fontFamily: interRegular, fontSize: ms(11), lineHeight: ms(17) },

    // TAT
    tatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border },
    tatName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },

    // Compliance row
    compRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingHorizontal: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border },
    compIcon: { width: ms(32), height: ms(32), borderRadius: ms(8), justifyContent: 'center', alignItems: 'center' },
    compName: { fontFamily: interMedium, fontSize: ms(11.5), color: blackColor, marginBottom: vs(2) },
    compMeta: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },
    compPct: { fontFamily: interMedium, fontSize: ms(10) },

    // Heatmap
    hmCell: { width: ms(18), height: ms(18), borderRadius: ms(3), justifyContent: 'center', alignItems: 'center' },
    hmCellTxt: { fontFamily: interMedium, fontSize: ms(7.5), color: whiteColor },

    // Marker evolution
    mevRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: C.border },
    mevName: { fontFamily: interMedium, fontSize: ms(10), color: blackColor, width: ms(80), flexShrink: 0 },
    mevDot: { width: ms(18), height: ms(18), borderRadius: ms(9), justifyContent: 'center', alignItems: 'center' },
    mevDotTxt: { fontFamily: interMedium, fontSize: ms(7.5), color: whiteColor },
    mevTrend: { fontFamily: interMedium, fontSize: ms(10), width: ms(72), textAlign: 'right' },
    mevLatest: { fontFamily: interMedium, fontSize: ms(11), width: ms(52), textAlign: 'right' },

    // Seasonality
    seasonCard: { flex: 1, borderRadius: ms(10), borderWidth: 1, padding: ms(12), alignItems: 'center', gap: vs(4) },
    seasonName: { fontFamily: interMedium, fontSize: ms(9.5), textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },
    seasonCount: { fontFamily: heading, fontSize: ms(24), lineHeight: ms(26) },
    seasonSub: { fontFamily: interRegular, fontSize: ms(9.5), color: C.muted, textAlign: 'center' },

    // Skipped
    skippedName: { fontFamily: interMedium, fontSize: ms(12), marginBottom: vs(2) },
    skippedMeta: { fontFamily: interRegular, fontSize: ms(10), color: C.muted },

    // Recommended
    recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), paddingHorizontal: ms(12), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: C.border },
    recName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    recReason: { fontFamily: interRegular, fontSize: ms(10.5), color: C.muted },
    recDue: { fontFamily: interMedium, fontSize: ms(10.5), flexShrink: 0, marginTop: vs(2) },

    // Behavioural insight cards
    bhInsightCard: { borderRadius: ms(10), borderWidth: 1, padding: ms(12) },
    bhInsightTitle: { fontFamily: interMedium, fontSize: ms(12) },
    bhInsightBody: { fontFamily: interRegular, fontSize: ms(11), lineHeight: ms(17) },
});
