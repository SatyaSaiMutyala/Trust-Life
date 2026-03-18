import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { heading, interMedium, interRegular } from '../../config/Constants';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
    teal: primaryColor,
    jade: '#15803D',
    gold: '#B45309',
    sapphire: '#1D4ED8',
    violet: '#7C3AED',
    ruby: '#B91C1C',
    gray: '#94A3B8',
};

// ── Drug master ───────────────────────────────────────────────────────────────
const DRUGS = [
    { name: 'Metformin 500mg',     short: 'Metformin',    color: C.teal,    monthly: 495,  adh: 92, streak: 573, refills: 7, totalCost: 3465, daysLeft: 18, maxDays: 90, start: 0,  end: 19 },
    { name: 'Pantoprazole 40mg',   short: 'Pantoprazole', color: C.jade,    monthly: 240,  adh: 90, streak: 521, refills: 7, totalCost: 1680, daysLeft: 45, maxDays: 90, start: 0,  end: 19 },
    { name: 'Vitamin B12 1500mcg', short: 'B12',          color: C.gold,    monthly: 960,  adh: 85, streak: 87,  refills: 3, totalCost: 2880, daysLeft: 34, maxDays: 90, start: 14, end: 19 },
    { name: 'Vitamin D3 60K IU',   short: 'Vit D3',       color: C.sapphire,monthly: 384,  adh: 80, streak: 62,  refills: 3, totalCost: 1152, daysLeft: 5,  maxDays: 60, start: 14, end: 19 },
    { name: 'Rosuvastatin 10mg',   short: 'Rosuvastatin', color: C.violet,  monthly: 660,  adh: 88, streak: 28,  refills: 1, totalCost: 660,  daysLeft: 62, maxDays: 90, start: 17, end: 19 },
];

const MO_24 = ['S23','Oct','Nov','Dec','J24','Feb','Mar','Apr','May','Jun','Jul','Aug','S24','Oct','Nov','Dec','J25','Feb','Mar'];

// Spend per month (19 months)
const MONTHLY_TOTALS = MO_24.map((_, i) => {
    let t = 0;
    DRUGS.forEach(d => { if (i >= d.start && i < d.end) t += d.monthly; });
    if (i === 13) t += 180;
    if (i === 16) t += 80;
    return t;
});
const MAX_MONTHLY = Math.max(...MONTHLY_TOTALS);

// 30-day heatmap status (g=taken, a=partial, r=missed)
const HEATMAP_STATUS = ['g','g','g','a','g','g','g','g','r','g','g','g','g','a','g','g','g','g','g','r','g','a','g','g','g','g','g','g','r','g'];
const sCol = { g: C.jade, a: C.gold, r: C.ruby };

// ── Shared UI helpers ─────────────────────────────────────────────────────────
const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const SecTitle = ({ title, sub }) => (
    <View style={styles.secTitleWrap}>
        <Text style={styles.secTitle}>{title}</Text>
        {sub ? <Text style={styles.secSub}>{sub}</Text> : null}
    </View>
);

const Bar = ({ pct, color, h = 5 }) => (
    <View style={[styles.barBg, { height: h }]}>
        <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color, height: h }]} />
    </View>
);

const Pill = ({ label, color, bg }) => (
    <View style={[styles.pill, { backgroundColor: bg || color + '20' }]}>
        <Text style={[styles.pillTxt, { color }]}>{label}</Text>
    </View>
);

// ══════════════════════════════════════════════════════════════════════════════
//  SPEND ANALYTICS TAB
// ══════════════════════════════════════════════════════════════════════════════
const SpendTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

        {/* ── Hero ── */}
        <LinearGradient colors={[primaryColor, '#0D5C52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroTop}>
                <View style={styles.heroMain}>
                    <Text style={styles.heroValue}>₹1.08<Text style={styles.heroValueSm}>L</Text></Text>
                    <Text style={styles.heroTag}>Total medication spend · all time</Text>
                </View>
            </View>
            <View style={styles.heroKpis}>
                {[
                    { n: '₹5,850',  l: 'Monthly burn (current)' },
                    { n: '₹70,200', l: '2025 annualised' },
                    { n: '5',       l: 'Active medications' },
                    { n: '87%',     l: 'Generic usage rate' },
                    { n: '₹2,907',  l: 'Monthly generic savings' },
                ].map((k, i) => (
                    <View key={i} style={styles.heroKpi}>
                        <Text style={styles.heroKpiN}>{k.n}</Text>
                        <Text style={styles.heroKpiL}>{k.l}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.heroChips}>
                <View style={[styles.heroChip, { backgroundColor: 'rgba(185,28,28,0.25)' }]}>
                    <Text style={[styles.heroChipTxt, { color: '#FCA5A5' }]}>↑ 3.8× spend since Sep 2023 – new diagnoses added</Text>
                </View>
                <View style={[styles.heroChip, { backgroundColor: 'rgba(13,148,136,0.25)' }]}>
                    <Text style={[styles.heroChipTxt, { color: '#5EEAD4' }]}>Vitamin B12 is costliest at ₹960/mo</Text>
                </View>
                <View style={[styles.heroChip, { backgroundColor: 'rgba(109,40,217,0.25)' }]}>
                    <Text style={[styles.heroChipTxt, { color: '#C4B5FD' }]}>₹34,884 saved vs branded equivalents (all time)</Text>
                </View>
                <View style={[styles.heroChip, { backgroundColor: 'rgba(180,83,9,0.25)' }]}>
                    <Text style={[styles.heroChipTxt, { color: '#FCD34D' }]}>₹0 insured – all out-of-pocket</Text>
                </View>
            </View>
        </LinearGradient>

        {/* ── Stat Strip ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stripScroll}>
            {[
                { lbl: 'Sep–Dec 2023', val: '₹8,820',  sub: '2 medications active',   color: C.teal },
                { lbl: 'Full Year 2024', val: '₹29,790', sub: '3 medications avg',       color: C.violet },
                { lbl: '2025 YTD (Q1)', val: '₹17,550', sub: '5 medications active',    color: C.sapphire },
                { lbl: 'Peak Month',    val: '₹5,850',  sub: 'Feb–Mar 2025',            color: C.gold },
                { lbl: 'Lowest Month',  val: '₹735',    sub: 'Sep 2023 (start)',         color: C.jade },
            ].map((s, i) => (
                <View key={i} style={[styles.statStrip, { borderTopColor: s.color }]}>
                    <Text style={styles.stripLbl}>{s.lbl}</Text>
                    <Text style={[styles.stripVal, { color: s.color }]}>{s.val}</Text>
                    <Text style={styles.stripSub}>{s.sub}</Text>
                </View>
            ))}
        </ScrollView>

        {/* ── R1: Monthly Spend Chart ── */}
        <Card>
            <SecTitle title="Monthly Medication Spend" sub="19-month pharmacy billing – total outlay per month" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.barChartWrap, { alignItems: 'flex-end' }]}>
                    {MONTHLY_TOTALS.map((val, i) => {
                        const barH = Math.max(4, Math.round((val / MAX_MONTHLY) * vs(80)));
                        const isRecent = i >= 16;
                        return (
                            <View key={i} style={styles.barCol}>
                                <Text style={styles.barAmt}>₹{val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}</Text>
                                <View style={[styles.barBg, { height: vs(80), width: ms(14), justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(3) }]}>
                                    <View style={{ width: '100%', height: barH, backgroundColor: isRecent ? C.teal : C.teal + '55', borderRadius: ms(3) }} />
                                </View>
                                <Text style={styles.barLbl}>{MO_24[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </Card>

        {/* ── R1b: Drug Breakdown (Stacked bars) ── */}
        <Card>
            <SecTitle title="Spend Breakdown by Drug" sub="Monthly contribution per medication" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.barChartWrap, { alignItems: 'flex-end' }]}>
                    {MONTHLY_TOTALS.map((total, i) => {
                        const segments = DRUGS.filter(d => i >= d.start && i < d.end);
                        const stackH = Math.max(4, Math.round((total / MAX_MONTHLY) * vs(80)));
                        return (
                            <View key={i} style={styles.barCol}>
                                <View style={{ height: vs(80), width: ms(14), justifyContent: 'flex-end', borderRadius: ms(3), overflow: 'hidden' }}>
                                    {segments.length === 0 ? (
                                        <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: ms(3) }} />
                                    ) : (
                                        <View style={{ width: '100%', height: stackH, borderRadius: ms(3), overflow: 'hidden' }}>
                                            {segments.map((d, si) => (
                                                <View key={si} style={{ flex: d.monthly, backgroundColor: d.color + 'BB' }} />
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.barLbl}>{MO_24[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={styles.legendRow}>
                {DRUGS.map((d, i) => (
                    <View key={i} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                        <Text style={styles.legendTxt}>{d.short}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* ── R2: Cumulative Spend ── */}
        <Card>
            <SecTitle title="Cumulative Spend Curve" sub="Running total – the true long-term cost of chronic care" />
            {(() => {
                const cumul = MONTHLY_TOTALS.reduce((a, v, i) => { a.push((a[i - 1] || 0) + v); return a; }, []);
                const maxC = cumul[cumul.length - 1];
                return (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={[styles.barChartWrap, { alignItems: 'flex-end' }]}>
                            {cumul.map((val, i) => {
                                const barH = Math.max(4, Math.round((val / maxC) * vs(75)));
                                return (
                                    <View key={i} style={styles.barCol}>
                                        <Text style={styles.barAmt}>₹{(val / 1000).toFixed(0)}k</Text>
                                        <View style={{ height: vs(75), width: ms(14), justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(3), backgroundColor: '#F1F5F9' }}>
                                            <View style={{ width: '100%', height: barH, backgroundColor: C.teal, borderRadius: ms(3), opacity: 0.4 + (i / cumul.length) * 0.6 }} />
                                        </View>
                                        <Text style={styles.barLbl}>{MO_24[i]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                );
            })()}
        </Card>

        {/* ── R2b: Quarter-over-Quarter ── */}
        <Card>
            <SecTitle title="Quarter-over-Quarter Spend" sub="2023 vs 2024 vs 2025 quarterly comparison" />
            {[
                { q: 'Q3 2023 (partial)', vals: [0, 0, 2205, 8820], color: C.gray },
                { q: '2024 all quarters',  vals: [8820, 8820, 8820, 9660], color: C.teal },
                { q: 'Q1 2025',            vals: [17550, 0, 0, 0], color: C.sapphire },
            ].map((row, ri) => (
                <View key={ri} style={{ marginBottom: vs(12) }}>
                    <Text style={[styles.secSub, { marginBottom: vs(4) }]}>{row.q}</Text>
                    <View style={{ flexDirection: 'row', gap: ms(6) }}>
                        {['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => {
                            const maxQ = 17550;
                            const barH = Math.max(4, Math.round((row.vals[qi] / maxQ) * vs(55)));
                            return (
                                <View key={qi} style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={[styles.barAmt, { fontSize: ms(8) }]}>{row.vals[qi] > 0 ? `₹${(row.vals[qi] / 1000).toFixed(1)}k` : ''}</Text>
                                    <View style={{ height: vs(55), width: '70%', justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(3), backgroundColor: '#F1F5F9' }}>
                                        {row.vals[qi] > 0 && <View style={{ width: '100%', height: barH, backgroundColor: row.color, borderRadius: ms(3), opacity: 0.8 }} />}
                                    </View>
                                    <Text style={styles.barLbl}>{q}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ))}
        </Card>

        {/* ── R3: Monthly Spend Share ── */}
        <Card>
            <SecTitle title="Monthly Spend Share by Drug" sub="Current regimen · ₹5,850/month total" />
            <View style={styles.donutLegend}>
                {DRUGS.map((d, i) => {
                    const totalMo = DRUGS.reduce((s, x) => s + x.monthly, 0);
                    const pct = Math.round((d.monthly / totalMo) * 100);
                    return (
                        <View key={i} style={styles.dlRow}>
                            <View style={[styles.dlSwatch, { backgroundColor: d.color }]} />
                            <Text style={styles.dlName} numberOfLines={1}>{d.name}</Text>
                            <View style={styles.dlBarWrap}>
                                <Bar pct={Math.round((d.monthly / 960) * 100)} color={d.color} h={4} />
                            </View>
                            <Text style={[styles.dlVal, { color: d.color }]}>₹{d.monthly}</Text>
                            <Text style={[styles.dlPct, { color: d.color }]}>{pct}%</Text>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── R3b: Monthly Cost by Condition ── */}
        <Card>
            <SecTitle title="Monthly Cost by Condition Treated" sub="What each diagnosis costs in medications" />
            {[
                { cond: 'B12 Deficiency',      amt: 960, color: C.gold },
                { cond: 'Hypercholesterolaemia', amt: 660, color: C.violet },
                { cond: 'Type 2 Diabetes',     amt: 495, color: C.teal },
                { cond: 'Vit D Deficiency',    amt: 384, color: C.sapphire },
                { cond: 'Acid Reflux',          amt: 240, color: C.jade },
            ].map((c, i) => (
                <View key={i} style={styles.drugRow}>
                    <Text style={[styles.condName, { color: c.color }]}>{c.cond}</Text>
                    <View style={{ flex: 1, marginHorizontal: ms(8) }}>
                        <Bar pct={Math.round((c.amt / 960) * 100)} color={c.color} h={8} />
                    </View>
                    <Text style={[styles.condAmt, { color: c.color }]}>₹{c.amt}</Text>
                </View>
            ))}
        </Card>

        {/* ── R4: Gantt Timeline ── */}
        <Card>
            <SecTitle title="Medication Timeline" sub="When each drug entered and how long it's been active" />
            {[...DRUGS, { name: 'Amoxicillin 500mg', short: 'Amoxicillin', color: C.gray, start: 13, end: 13.2 }, { name: 'Paracetamol 500mg', short: 'Paracetamol', color: C.gray, start: 16.2, end: 16.4 }].map((d, i) => {
                const N = 19;
                const leftPct = (d.start / N * 100).toFixed(1);
                const widthPct = Math.max(2, ((d.end - d.start) / N * 100));
                return (
                    <View key={i} style={styles.ganttRow}>
                        <Text style={styles.ganttLabel} numberOfLines={1}>{d.short || d.name.split(' ')[0]}</Text>
                        <View style={styles.ganttTrack}>
                            <View style={[styles.ganttBar, {
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                backgroundColor: d.color + 'CC',
                            }]}>
                                <Text style={styles.ganttBarTxt} numberOfLines={1}>{d.name}</Text>
                            </View>
                        </View>
                        <Text style={styles.ganttDur}>{Math.round(d.end - d.start)}mo</Text>
                    </View>
                );
            })}
            <View style={styles.ganttAxis}>
                {["Sep '23", "Jan '24", "May '24", "Sep '24", "Jan '25", "Mar '25"].map((l, i) => (
                    <Text key={i} style={styles.ganttAxisLbl}>{l}</Text>
                ))}
            </View>
        </Card>

        {/* ── R5a: Cost per unit ── */}
        <Card>
            <SecTitle title="Cost per Tablet / Capsule" sub="Unit economics – which drug costs most per dose" />
            {[
                { name: 'Vit D3 60K IU',    unit: 48,  color: C.sapphire },
                { name: 'B12 1500mcg',       unit: 32,  color: C.gold },
                { name: 'Rosuvastatin 10mg', unit: 22,  color: C.violet },
                { name: 'Pantoprazole 40mg', unit: 8,   color: C.jade },
                { name: 'Metformin 500mg',   unit: 5.5, color: C.teal },
            ].map((r, i) => (
                <View key={i} style={styles.drugRow}>
                    <Text style={styles.condName}>{r.name}</Text>
                    <View style={{ flex: 1, marginHorizontal: ms(8) }}>
                        <Bar pct={Math.round((r.unit / 48) * 100)} color={r.color} h={8} />
                    </View>
                    <Text style={[styles.condAmt, { color: r.color }]}>₹{r.unit}</Text>
                </View>
            ))}
        </Card>

        {/* ── R5b: Generic vs Branded Table ── */}
        <Card>
            <SecTitle title="Generic vs Branded – Savings Analysis" sub="What you pay vs branded equivalent" />
            <View style={styles.tableHead}>
                {['Drug', 'Generic cost', 'Branded', 'Monthly saving'].map((h, i) => (
                    <Text key={i} style={[styles.thCell, i > 0 && { textAlign: 'right', flex: 0.8 }]}>{h}</Text>
                ))}
            </View>
            {[
                { drug: 'Metformin 500mg',    gen: '₹5.5/u', brand: '₹18/u', save: '₹225' },
                { drug: 'Pantoprazole 40mg',  gen: '₹8/u',   brand: '₹22/u', save: '₹420' },
                { drug: 'Rosuvastatin 10mg',  gen: '₹22/u',  brand: '₹68/u', save: '₹1,380' },
                { drug: 'Vitamin D3 60K',     gen: '₹48/u',  brand: '₹72/u', save: '₹192' },
                { drug: 'Vitamin B12 1500',   gen: '₹32/u',  brand: '₹55/u', save: '₹690' },
            ].map((r, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={[styles.tdCell, { color: blackColor, fontFamily: interMedium }]} numberOfLines={1}>{r.drug}</Text>
                    <Text style={[styles.tdCell, { textAlign: 'right', flex: 0.8, color: C.jade }]}>{r.gen}</Text>
                    <Text style={[styles.tdCell, { textAlign: 'right', flex: 0.8, color: C.gray, textDecorationLine: 'line-through' }]}>{r.brand}</Text>
                    <Text style={[styles.tdCell, { textAlign: 'right', flex: 0.8, color: C.jade, fontFamily: interMedium }]}>{r.save}</Text>
                </View>
            ))}
            <View style={[styles.tableRow, { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: vs(4) }]}>
                <Text style={[styles.tdCell, { fontFamily: interMedium }]}>Total</Text>
                <Text style={styles.tdCell} />
                <Text style={styles.tdCell} />
                <Text style={[styles.tdCell, { textAlign: 'right', flex: 0.8, color: C.jade, fontFamily: interMedium }]}>₹2,907/mo</Text>
            </View>
            <View style={styles.insightBox}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color="#7C3AED" />
                <Text style={styles.insightTxt}>Choosing generics saves <Text style={{ fontFamily: interMedium }}>₹2,907/month (₹34,884/year)</Text>. Rosuvastatin alone saves ₹1,380/mo versus branded Crestor. All your current prescriptions are already generic — maintain this with every new prescription.</Text>
            </View>
        </Card>

        {/* ── R6a: Pharmacy Comparison ── */}
        <Card>
            <SecTitle title="Pharmacy Price Comparison" sub="Where you buy and what you pay relative to MRP" />
            {[
                { name: 'MedPlus Pharmacy',    visits: 6, spend: 8400,  rating: 'Best price',        color: C.jade,     note: '~MRP or below' },
                { name: 'PharmEasy (online)',   visits: 1, spend: 1840,  rating: 'Cheapest online',   color: C.teal,     note: '4–8% below MRP' },
                { name: 'Medica Pharmacy',      visits: 2, spend: 2900,  rating: 'Average',           color: C.sapphire, note: 'At MRP' },
                { name: 'Apollo Pharmacy',      visits: 4, spend: 6200,  rating: '8–12% premium',     color: C.gold,     note: 'Above MRP on vitamins' },
            ].map((p, i) => (
                <View key={i} style={styles.rankRow}>
                    <Text style={styles.rankN}>#{i + 1}</Text>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                            <Text style={styles.rankName}>{p.name}</Text>
                            <Text style={[styles.secSub, { color: p.color, fontSize: ms(10) }]}>{p.rating}</Text>
                        </View>
                        <Text style={styles.rankMeta}>{p.visits} refill visits · {p.note}</Text>
                        <Bar pct={Math.round((p.spend / 8400) * 100)} color={p.color} h={4} />
                    </View>
                    <Text style={[styles.rankVal, { color: p.color }]}>₹{p.spend.toLocaleString()}</Text>
                </View>
            ))}
            <View style={styles.insightBox}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color="#7C3AED" />
                <Text style={styles.insightTxt}><Text style={{ fontFamily: interMedium }}>Apollo Pharmacy</Text> charges 8–12% above MRP on Vitamin B12 and D3. Switch these two to <Text style={{ fontFamily: interMedium }}>MedPlus or PharmEasy</Text> for an estimated saving of ₹180–220/month.</Text>
            </View>
        </Card>

        {/* ── R6b: Spend Benchmarking ── */}
        <Card>
            <SecTitle title="Spend Benchmarking" sub="You vs similar chronic patients (diabetic, 30–40, urban India)" />
            <View style={styles.benchGrid}>
                {[
                    { lbl: 'Your monthly',   val: '₹5,850',  sub: '5 active drugs',        bg: C.teal + '18',    color: C.teal },
                    { lbl: 'Peer average',   val: '₹7,100',  sub: 'Similar conditions',    bg: '#F8FAFC',         color: blackColor },
                    { lbl: 'You save',       val: '17.6%',   sub: 'below peer median',      bg: C.jade + '15',    color: C.jade },
                    { lbl: '2025 projection',val: '₹70.2K',  sub: 'if regimen unchanged',   bg: C.sapphire + '15',color: C.sapphire },
                ].map((b, i) => (
                    <View key={i} style={[styles.benchCard, { backgroundColor: b.bg }]}>
                        <Text style={[styles.benchLbl, { color: b.color }]}>{b.lbl}</Text>
                        <Text style={[styles.benchVal, { color: b.color }]}>{b.val}</Text>
                        <Text style={[styles.secSub, { color: b.color, marginTop: vs(2) }]}>{b.sub}</Text>
                    </View>
                ))}
            </View>
            <View style={{ marginTop: vs(10) }}>
                <SecTitle title="" sub="Performance vs peer benchmark" />
                {[
                    { lbl: 'Cost efficiency', you: 82, peer: 68 },
                    { lbl: 'Generic use',     you: 87, peer: 72 },
                    { lbl: 'Adherence',       you: 87, peer: 74 },
                    { lbl: 'Refill timing',   you: 72, peer: 78 },
                    { lbl: 'Drug count',      you: 65, peer: 70 },
                ].map((r, i) => (
                    <View key={i} style={styles.drugRow}>
                        <Text style={[styles.condName, { width: ms(85) }]} numberOfLines={1}>{r.lbl}</Text>
                        <View style={{ flex: 1, gap: vs(3) }}>
                            <Bar pct={r.you}  color={C.teal} h={5} />
                            <Bar pct={r.peer} color={C.gray} h={5} />
                        </View>
                        <View style={{ alignItems: 'flex-end', minWidth: ms(40) }}>
                            <Text style={[styles.condAmt, { color: C.teal }]}>{r.you}</Text>
                            <Text style={[styles.condAmt, { color: C.gray, fontSize: ms(9) }]}>{r.peer}</Text>
                        </View>
                    </View>
                ))}
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: C.teal }]} />
                    <Text style={styles.legendTxt}>You</Text>
                    <View style={[styles.legendDot, { backgroundColor: C.gray, marginLeft: ms(10) }]} />
                    <Text style={styles.legendTxt}>Peer avg</Text>
                </View>
            </View>
        </Card>

        {/* ── R7a: Refill Tracker ── */}
        <Card>
            <SecTitle title="Refill Cost & Frequency Tracker" sub="Per-drug refill history, cost, and supply buffer" />
            <View style={styles.rfGrid}>
                {DRUGS.map((d, i) => {
                    const pct = Math.round((d.daysLeft / d.maxDays) * 100);
                    const col = pct <= 15 ? C.ruby : pct <= 40 ? C.gold : C.jade;
                    return (
                        <View key={i} style={[styles.rfCard, { borderLeftColor: d.color }]}>
                            <Text style={styles.rfName}>{d.short}</Text>
                            <Text style={styles.rfMeta}>{d.refills} refills · ₹{d.totalCost.toLocaleString()} total</Text>
                            <Bar pct={pct} color={col} h={5} />
                            <View style={styles.rfFoot}>
                                <Text style={styles.rfFootLbl}>Apr 10</Text>
                                <Text style={[styles.rfFootVal, { color: col }]}>{d.daysLeft}d left</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── R7b: Spend Insights ── */}
        <Card style={{ backgroundColor: '#F0FDFA', borderColor: 'rgba(13,148,136,0.2)' }}>
            <SecTitle title="Spend Insights" />
            {[
                { icon: '💊', bold: 'Vitamin B12', rest: ' (₹960/mo) costs more than any prescription drug. Ask Dr. Nair if bi-weekly dosing maintains levels – could halve the cost.' },
                { icon: '📦', bold: 'Switching Metformin', rest: ' to 90-day strips saves ₹45–90/month on MRP – ask for a 90-day prescription at your next visit.' },
                { icon: '🏪', bold: 'Consolidating all refills', rest: ' to MedPlus over Apollo saves an estimated ₹220/month based on your current basket.' },
                { icon: '🏥', bold: 'OPD drug riders', rest: ' from Star Health cover up to ₹5,000/year in outpatient pharmacy bills – worth adding given your ₹70K annual spend.' },
            ].map((ins, i) => (
                <View key={i} style={styles.insightBullet}>
                    <Text style={styles.insightBulletIcon}>{ins.icon}</Text>
                    <Text style={[styles.insightTxt, { color: C.teal }]}>
                        <Text style={{ fontFamily: interMedium }}>{ins.bold}</Text>{ins.rest}
                    </Text>
                </View>
            ))}
        </Card>

        <View style={{ height: vs(30) }} />
    </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  BEHAVIOUR ANALYTICS TAB
// ══════════════════════════════════════════════════════════════════════════════
const BehaviourTab = () => {
    const DOSE_CLOCK = [
        { label: 'Morning', time: '7:00 AM', pills: [{ n: 'Metformin 500mg', c: C.teal }, { n: 'Vitamin B12 1500mcg', c: C.gold }, { n: 'Vit D3 60K (weekly)', c: C.sapphire }], taken: true },
        { label: 'Afternoon', time: '1:30 PM', pills: [{ n: 'Metformin 500mg', c: C.teal }], taken: false },
        { label: 'Night', time: '9:00 PM', pills: [{ n: 'Metformin 500mg', c: C.teal }, { n: 'Pantoprazole 40mg', c: C.jade }, { n: 'Rosuvastatin 10mg', c: C.violet }], taken: false },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

            {/* ── Hero ── */}
            <LinearGradient colors={[primaryColor, '#0D5C52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                <View style={styles.heroTop}>
                    <View style={styles.heroMain}>
                        <Text style={styles.heroValue}>87<Text style={styles.heroValueSm}>%</Text></Text>
                        <Text style={styles.heroTag}>Overall adherence · last 30 days</Text>
                    </View>
                </View>
                <View style={styles.heroKpis}>
                    {[
                        { n: '18',    l: 'Doses missed / month' },
                        { n: '19 mo', l: 'Longest streak (Metformin)' },
                        { n: 'Mon',   l: 'Best adherence day' },
                        { n: 'Sun',   l: 'Worst adherence day' },
                        { n: '1',     l: 'Active drug interaction' },
                    ].map((k, i) => (
                        <View key={i} style={styles.heroKpi}>
                            <Text style={styles.heroKpiN}>{k.n}</Text>
                            <Text style={styles.heroKpiL}>{k.l}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.heroChips}>
                    <View style={[styles.heroChip, { backgroundColor: 'rgba(185,28,28,0.25)' }]}>
                        <Text style={[styles.heroChipTxt, { color: '#FCA5A5' }]}>Vitamin D3 – critically low supply, 5 days left</Text>
                    </View>
                    <View style={[styles.heroChip, { backgroundColor: 'rgba(13,148,136,0.25)' }]}>
                        <Text style={[styles.heroChipTxt, { color: '#5EEAD4' }]}>Metformin adherence linked to HbA1c drop 6.8→5.9%</Text>
                    </View>
                    <View style={[styles.heroChip, { backgroundColor: 'rgba(180,83,9,0.25)' }]}>
                        <Text style={[styles.heroChipTxt, { color: '#FCD34D' }]}>Night doses missed 2× more than morning doses</Text>
                    </View>
                    <View style={[styles.heroChip, { backgroundColor: 'rgba(109,40,217,0.25)' }]}>
                        <Text style={[styles.heroChipTxt, { color: '#C4B5FD' }]}>Weekend adherence 14% lower than weekdays</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* ── Stat Strip ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stripScroll}>
                {[
                    { lbl: '30-Day Adherence', val: '87%',       sub: 'Target 95%',          color: C.gold },
                    { lbl: 'Best Performer',   val: 'Metformin', sub: '92% · 19-mo streak',  color: C.teal },
                    { lbl: 'Needs Attention',  val: 'Vit D3',    sub: '80% · refill critical',color: C.ruby },
                    { lbl: 'Doses Missed',     val: '18',        sub: 'of 143 this month',   color: C.ruby },
                    { lbl: 'Longest Streak',   val: '573d',      sub: 'Metformin (zero gaps)',color: C.jade },
                ].map((s, i) => (
                    <View key={i} style={[styles.statStrip, { borderTopColor: s.color }]}>
                        <Text style={styles.stripLbl}>{s.lbl}</Text>
                        <Text style={[styles.stripVal, { color: s.color, fontSize: s.val.length > 5 ? ms(13) : ms(18) }]}>{s.val}</Text>
                        <Text style={styles.stripSub}>{s.sub}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* ── R1a: Adherence Trend ── */}
            <Card>
                <SecTitle title="Adherence Over Time" sub="19-month overall dose compliance vs targets" />
                {(() => {
                    const adh = [88,90,92,91,89,90,88,86,85,88,90,89,87,86,88,87,87,87,87];
                    return (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={[styles.barChartWrap, { alignItems: 'flex-end', gap: ms(3) }]}>
                                {adh.map((val, i) => {
                                    const barH = Math.round(((val - 70) / 30) * vs(65));
                                    return (
                                        <View key={i} style={styles.barCol}>
                                            <Text style={styles.barAmt}>{val}%</Text>
                                            <View style={{ height: vs(65), width: ms(12), justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(3), backgroundColor: '#F1F5F9' }}>
                                                <View style={{ width: '100%', height: barH, backgroundColor: val >= 90 ? C.jade : val >= 80 ? C.gold : C.ruby, borderRadius: ms(3) }} />
                                            </View>
                                            <Text style={styles.barLbl}>{MO_24[i]}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    );
                })()}
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: C.jade }]} /><Text style={styles.legendTxt}>≥90%</Text>
                    <View style={[styles.legendDot, { backgroundColor: C.gold, marginLeft: ms(10) }]} /><Text style={styles.legendTxt}>80–90%</Text>
                    <View style={[styles.legendDot, { backgroundColor: '#CBD5E1', marginLeft: ms(10) }]} /><Text style={styles.legendTxt}>Target 95%</Text>
                </View>
            </Card>

            {/* ── R1b: Per-Drug Adherence ── */}
            <Card>
                <SecTitle title="Per-Drug Adherence · Last 30 Days" sub="Compliance rate with streak duration per medication" />
                {DRUGS.map((d, i) => {
                    const adhColor = d.adh >= 90 ? C.jade : d.adh >= 80 ? C.gold : C.ruby;
                    const adhLabel = d.adh >= 90 ? 'Excellent' : d.adh >= 80 ? 'Good' : 'Low';
                    return (
                        <View key={i} style={styles.adhRow}>
                            <View style={[styles.adhSwatch, { backgroundColor: d.color }]} />
                            <View style={styles.adhInfo}>
                                <Text style={styles.adhName}>{d.name}</Text>
                                <Text style={styles.adhMeta}>Best streak: {d.streak} days</Text>
                            </View>
                            <View style={styles.adhBarWrap}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(2) }}>
                                    <Text style={styles.barAmt}>Adherence</Text>
                                    <Text style={[styles.barAmt, { color: adhColor, fontFamily: interMedium }]}>{d.adh}%</Text>
                                </View>
                                <Bar pct={d.adh} color={adhColor} h={5} />
                            </View>
                            <Pill label={adhLabel} color={adhColor} />
                        </View>
                    );
                })}
            </Card>

            {/* ── R2a: Day-of-Week ── */}
            <Card>
                <SecTitle title="Day-of-Week Miss Pattern" sub="When you're most likely to skip a dose" />
                <View style={[styles.barChartWrap, { alignItems: 'flex-end', justifyContent: 'space-around' }]}>
                    {[95, 93, 92, 91, 89, 82, 81].map((val, i) => {
                        const day = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i];
                        const barH = Math.round(((val - 70) / 30) * vs(70));
                        const isWeekend = i >= 5;
                        return (
                            <View key={i} style={[styles.barCol, { flex: 1 }]}>
                                <Text style={styles.barAmt}>{val}%</Text>
                                <View style={{ height: vs(70), width: ms(20), justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(4), backgroundColor: '#F1F5F9', alignSelf: 'center' }}>
                                    <View style={{ width: '100%', height: barH, backgroundColor: isWeekend ? C.ruby + 'BB' : C.teal + 'BB', borderRadius: ms(4) }} />
                                </View>
                                <Text style={[styles.barLbl, isWeekend && { color: C.ruby }]}>{day}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: C.teal }]} /><Text style={styles.legendTxt}>Weekday</Text>
                    <View style={[styles.legendDot, { backgroundColor: C.ruby, marginLeft: ms(10) }]} /><Text style={styles.legendTxt}>Weekend (higher miss rate)</Text>
                </View>
            </Card>

            {/* ── R2b: Dose-Time Compliance ── */}
            <Card>
                <SecTitle title="Dose-Time Compliance" sub="Morning vs afternoon vs night completion rate" />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                    {[
                        { slot: 'Morning\n7:00 AM', val: 92, color: C.jade },
                        { slot: 'Afternoon\n1:30 PM', val: 89, color: C.teal },
                        { slot: 'Night\n9:00 PM', val: 81, color: C.ruby },
                    ].map((s, i) => {
                        const barH = Math.round(((s.val - 70) / 30) * vs(80));
                        return (
                            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={[styles.barAmt, { fontFamily: interMedium, color: s.color }]}>{s.val}%</Text>
                                <View style={{ height: vs(80), width: ms(40), justifyContent: 'flex-end', overflow: 'hidden', borderRadius: ms(6), backgroundColor: '#F1F5F9' }}>
                                    <View style={{ width: '100%', height: barH, backgroundColor: s.color + 'BB', borderRadius: ms(6) }} />
                                </View>
                                <Text style={[styles.barLbl, { textAlign: 'center', marginTop: vs(4) }]}>{s.slot}</Text>
                            </View>
                        );
                    })}
                </View>
            </Card>

            {/* ── R3: 30-Day Heatmap ── */}
            <Card>
                <SecTitle title="30-Day Adherence Calendar" sub="Daily dose outcome per medication – last 30 days" />
                <View style={styles.legendRow}>
                    {[{ c: C.jade, l: 'Taken' }, { c: C.gold, l: 'Partial' }, { c: C.ruby, l: 'Missed' }, { c: '#CBD5E1', l: 'Not scheduled' }].map((x, i) => (
                        <View key={i} style={[styles.legendItem, { marginRight: ms(10) }]}>
                            <View style={[styles.legendDot, { backgroundColor: x.c, width: ms(11), height: ms(11), borderRadius: ms(2) }]} />
                            <Text style={styles.legendTxt}>{x.l}</Text>
                        </View>
                    ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: vs(8) }}>
                    <View>
                        {/* Day numbers header */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: ms(70) }} />
                            {Array.from({ length: 30 }, (_, d) => (
                                <Text key={d} style={styles.heatDay}>{d + 1}</Text>
                            ))}
                        </View>
                        {/* Drug rows */}
                        {[
                            { name: 'Metformin',    color: C.teal,     isWeekly: false },
                            { name: 'Pantoprazole', color: C.jade,     isWeekly: false },
                            { name: 'Rosuvastatin', color: C.violet,   isWeekly: false },
                            { name: 'Vitamin B12',  color: C.gold,     isWeekly: false },
                            { name: 'Vitamin D3',   color: C.sapphire, isWeekly: true, weeklyDays: [0, 7, 14, 21, 28] },
                        ].map((drug, di) => (
                            <View key={di} style={styles.heatRow}>
                                <Text style={[styles.heatDrugName, { color: drug.color }]} numberOfLines={1}>{drug.name}</Text>
                                {Array.from({ length: 30 }, (_, day) => {
                                    let bg;
                                    if (drug.isWeekly && !drug.weeklyDays.includes(day)) {
                                        bg = '#CBD5E1';
                                    } else {
                                        bg = sCol[HEATMAP_STATUS[day]] || C.jade;
                                    }
                                    return (
                                        <View key={day} style={[styles.heatCell, { backgroundColor: bg }]} />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Card>

            {/* ── R4a: Adherence vs HbA1c Correlation ── */}
            <Card>
                <SecTitle title="Adherence – HbA1c Correlation" sub="Does taking Metformin consistently actually move the needle?" />
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                    {[
                        { m: "Sep'23", adh: 88, hba: 7.2 },
                        { m: 'Dec',   adh: 91, hba: 7.0 },
                        { m: "Mar'24",adh: 90, hba: 6.8 },
                        { m: 'Jun',   adh: 88, hba: 6.5 },
                        { m: 'Sep',   adh: 89, hba: 6.5 },
                        { m: 'Dec',   adh: 87, hba: 6.8 },
                        { m: "Mar'25",adh: 92, hba: 5.9 },
                    ].map((pt, i) => {
                        const adhH = Math.round(((pt.adh - 80) / 20) * vs(65));
                        const hbaH = Math.round(((pt.hba - 5) / 3) * vs(65));
                        return (
                            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={[styles.barAmt, { color: C.ruby, fontSize: ms(8) }]}>{pt.hba}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: vs(65), gap: ms(2) }}>
                                    <View style={{ width: ms(8), height: adhH, backgroundColor: C.teal, borderRadius: ms(2) }} />
                                    <View style={{ width: ms(8), height: hbaH, backgroundColor: C.ruby, borderRadius: ms(2) }} />
                                </View>
                                <Text style={[styles.barAmt, { color: C.teal, fontSize: ms(8) }]}>{pt.adh}%</Text>
                                <Text style={[styles.barLbl, { fontSize: ms(7) }]}>{pt.m}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: C.teal }]} /><Text style={styles.legendTxt}>Adherence %</Text>
                    <View style={[styles.legendDot, { backgroundColor: C.ruby, marginLeft: ms(10) }]} /><Text style={styles.legendTxt}>HbA1c %</Text>
                </View>
            </Card>

            {/* ── R4b: Longest Consecutive Streak ── */}
            <Card>
                <SecTitle title="Longest Consecutive Streak" sub="Record days of full compliance per drug" />
                {DRUGS.map((d, i) => (
                    <View key={i} style={styles.drugRow}>
                        <Text style={styles.condName}>{d.short}</Text>
                        <View style={{ flex: 1, marginHorizontal: ms(8) }}>
                            <Bar pct={Math.round((d.streak / 573) * 100)} color={d.color} h={8} />
                        </View>
                        <Text style={[styles.condAmt, { color: d.color }]}>{d.streak}d</Text>
                    </View>
                ))}
            </Card>

            {/* ── R5a: Timing Drift ── */}
            <Card>
                <SecTitle title="Dose Timing Drift" sub="Average minutes late per dose-time vs prescribed schedule" />
                {[
                    { lbl: 'Metformin Morning',   min: 12, color: C.jade },
                    { lbl: 'Metformin Afternoon',  min: 28, color: C.teal },
                    { lbl: 'Metformin Night',      min: 88, color: C.ruby },
                    { lbl: 'Pantoprazole Night',   min: 95, color: C.ruby },
                    { lbl: 'Rosuvastatin Night',   min: 72, color: C.gold },
                    { lbl: 'B12 Morning',          min: 15, color: C.jade },
                    { lbl: 'Vit D3 Weekly',        min: 40, color: C.gold },
                ].map((r, i) => {
                    const driftColor = r.min < 30 ? C.jade : r.min < 60 ? C.gold : C.ruby;
                    return (
                        <View key={i} style={styles.drugRow}>
                            <Text style={[styles.condName, { width: ms(110) }]} numberOfLines={1}>{r.lbl}</Text>
                            <View style={{ flex: 1, marginHorizontal: ms(8) }}>
                                <Bar pct={Math.round((r.min / 100) * 100)} color={driftColor} h={7} />
                            </View>
                            <Text style={[styles.condAmt, { color: driftColor }]}>±{r.min}m</Text>
                        </View>
                    );
                })}
            </Card>

            {/* ── R5b: Refill Behaviour ── */}
            <Card>
                <SecTitle title="Refill Behaviour – Days of Supply at Refill" sub="How much buffer you maintain before reordering" />
                {[
                    { name: 'Metformin',    days: 18, color: C.jade },
                    { name: 'Pantoprazole', days: 22, color: C.jade },
                    { name: 'B12',          days: 34, color: C.jade },
                    { name: 'Vit D3',       days: 4,  color: C.ruby },
                    { name: 'Rosuvastatin', days: 25, color: C.jade },
                ].map((r, i) => {
                    const col = r.days < 7 ? C.ruby : r.days < 15 ? C.gold : C.jade;
                    return (
                        <View key={i} style={styles.drugRow}>
                            <Text style={styles.condName}>{r.name}</Text>
                            <View style={{ flex: 1, marginHorizontal: ms(8) }}>
                                <Bar pct={Math.round((r.days / 34) * 100)} color={col} h={8} />
                            </View>
                            <Text style={[styles.condAmt, { color: col }]}>{r.days}d</Text>
                        </View>
                    );
                })}
                <Text style={[styles.secSub, { marginTop: vs(4) }]}>Days of supply remaining when refill was ordered</Text>
            </Card>

            {/* ── R6a: Drug Interactions ── */}
            <Card>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10) }}>
                    <View>
                        <Text style={styles.secTitle}>Drug Interaction Monitor</Text>
                        <Text style={styles.secSub}>Known and flagged interactions in your current regimen</Text>
                    </View>
                    <Pill label="1 flagged" color={C.gold} />
                </View>
                {[
                    { d1: 'Rosuvastatin 10mg', d2: 'Vitamin D3 60K IU', sev: 'Moderate', body: 'High-dose Vitamin D3 may increase rosuvastatin muscle toxicity risk. Monitor for myalgia, cramping, or leg heaviness – especially in the first 3 months of co-administration.', action: 'Monitor monthly. Discuss with Dr. Suresh Reddy before adjusting either dose.', color: C.gold, bg: '#FEF3C7' },
                    { d1: 'Metformin 500mg', d2: 'Pantoprazole 40mg', sev: 'Minor', body: 'Long-term PPI use may reduce intrinsic factor production and impair B12 absorption. You are already supplementing B12 – this offset is adequate.', action: 'Current B12 supplementation neutralises this interaction. Continue regimen as prescribed.', color: C.gray, bg: '#F8FAFC' },
                ].map((ix, i) => (
                    <View key={i} style={[styles.ixCard, { backgroundColor: ix.bg, borderColor: ix.color + '55' }]}>
                        <View style={styles.ixHead}>
                            <Text style={styles.ixDrugs}>{ix.d1} <Text style={{ color: C.gray, fontFamily: interRegular }}>+</Text> {ix.d2}</Text>
                            <Pill label={ix.sev} color={ix.sev === 'Moderate' ? C.gold : C.gray} />
                        </View>
                        <Text style={styles.ixBody}>{ix.body}</Text>
                        <Text style={[styles.ixAction, { color: ix.color }]}>→ {ix.action}</Text>
                    </View>
                ))}
            </Card>

            {/* ── R6b: Side Effects ── */}
            <Card>
                <SecTitle title="Reported Side Effects Log" sub="Symptoms reported and likely drug association" />
                {[
                    { drug: 'Metformin',    color: C.teal,    effect: 'Mild nausea',          when: 'Sep–Oct 2023', resolved: true, note: 'Resolved after switching to taking with food. No recurrence in 18+ months.' },
                    { drug: 'Metformin',    color: C.teal,    effect: 'Loose stools (early)',  when: 'Sep 2023',     resolved: true, note: 'Self-resolved within 3 weeks. Common during dose initiation.' },
                    { drug: 'Rosuvastatin', color: C.violet,  effect: 'Leg heaviness',         when: 'Feb–Mar 2025', resolved: false,note: 'Reported to Dr. Suresh Reddy – under monitoring. May relate to Rosuvastatin + Vit D3 interaction.' },
                    { drug: 'Vitamin D3',   color: C.sapphire,effect: 'Mild headache (Day 1)', when: 'Dec 2024',     resolved: true, note: 'Single episode – likely unrelated. Not recurred.' },
                ].map((se, i) => (
                    <View key={i} style={styles.seRow}>
                        <View style={[styles.seDot, { backgroundColor: se.color }]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.seName}>{se.effect} <Text style={{ color: C.gray, fontFamily: interRegular }}>– {se.drug}</Text></Text>
                            <Text style={styles.seMeta}>{se.when} · {se.note}</Text>
                        </View>
                        <Pill label={se.resolved ? 'Resolved' : 'Ongoing'} color={se.resolved ? C.jade : C.gold} />
                    </View>
                ))}
            </Card>

            {/* ── R7a: Dose Clock ── */}
            <Card>
                <SecTitle title="Today's Dose Schedule" sub="Three-window daily routine · taken / pending" />
                <View style={styles.clockGrid}>
                    {DOSE_CLOCK.map((slot, i) => (
                        <View key={i} style={[styles.clockSlot, slot.taken && styles.clockSlotTaken]}>
                            <Text style={styles.clockLabel}>{slot.label}</Text>
                            <Text style={styles.clockTime}>{slot.time}</Text>
                            <View style={styles.clockPills}>
                                {slot.pills.map((p, pi) => (
                                    <View key={pi} style={styles.clockPillRow}>
                                        <View style={[styles.clockDot, { backgroundColor: p.c }]} />
                                        <Text style={styles.clockPillTxt} numberOfLines={1}>{p.n}</Text>
                                    </View>
                                ))}
                            </View>
                            <Pill label={slot.taken ? '✓ Taken' : 'Pending'} color={slot.taken ? C.jade : C.gold} />
                        </View>
                    ))}
                </View>
            </Card>

            {/* ── R7b: Medication Lifecycle ── */}
            <Card>
                <SecTitle title="Medication Lifecycle & Review Dates" sub="When each drug should be reviewed and what may change" />
                {[
                    { drug: 'Metformin 500mg',     color: C.teal,    icon: '✓', review: 'Jun 2025',    action: 'Likely continue – HbA1c trending into normal range. Dr. Nair may reduce dose if HbA1c stabilises below 5.7%.' },
                    { drug: 'Rosuvastatin 10mg',   color: C.violet,  icon: '⚠',  review: 'Apr 5, 2025', action: 'First lipid panel post-statin. Dose may increase to 20mg if LDL > 130 mg/dL (+₹660/mo).' },
                    { drug: 'Vitamin D3 60K IU',   color: C.sapphire,icon: '✓', review: 'May 2025',    action: 'Test Vit D3 – if normalised (>30 ng/mL), convert to 2000 IU maintenance dose (90% cost reduction).' },
                    { drug: 'Vitamin B12 1500mcg', color: C.gold,    icon: '✓', review: 'Jun 2025',    action: 'Test B12 – if mid-range achieved, switch to weekly dosing, cutting monthly cost from ₹960 to ₹240.' },
                    { drug: 'Pantoprazole 40mg',   color: C.jade,    icon: '?',  review: 'Jun 2025',    action: 'Re-evaluate need. Metformin GI tolerance now established – PPI may be discontinued, saving ₹240/month.' },
                ].map((lc, i) => (
                    <View key={i} style={styles.lcRow}>
                        <View style={[styles.lcIcon, { backgroundColor: lc.color + '20' }]}>
                            <Text style={[styles.lcIconTxt, { color: lc.color }]}>{lc.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.lcDrug}>{lc.drug}</Text>
                            <Text style={styles.lcMeta}>{lc.action}</Text>
                        </View>
                        <Text style={[styles.lcDate, { color: lc.color }]}>{lc.review}</Text>
                    </View>
                ))}
                <View style={styles.insightBox}>
                    <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color="#7C3AED" />
                    <Text style={styles.insightTxt}><Text style={{ fontFamily: interMedium }}>Rosuvastatin review on Apr 5</Text> is the most critical upcoming event. First lipid panel post-statin. If LDL drops to &lt;130 mg/dL, current 10mg dose stays. If insufficient, expect increase to 20mg (+₹660/mo spend).</Text>
                </View>
            </Card>

            {/* ── R8: Behavioural Insights Trio ── */}
            <View style={styles.trioGrid}>
                {[
                    { icon: '⏰', title: 'Timing Pattern', body: 'Morning doses taken within 30 min of waking – excellent habit. Night doses slip by 90 minutes on average, likely forgotten post-dinner. A phone reminder at 9:15 PM would capture the full night window before medication is put away.', bg: '#F0FDFA', border: 'rgba(13,148,136,0.15)', titleC: C.teal, bodyC: C.teal },
                    { icon: '📅', title: 'Weekend Drop', body: 'Weekend adherence is 14% lower than weekdays. Saturday night and Sunday morning are the two highest-miss slots – routine disruption from social events, travel, or sleeping in. Consider a weekend pill organiser refilled every Friday.', bg: '#EDE9FE', border: 'rgba(109,40,217,0.12)', titleC: C.violet, bodyC: C.violet },
                    { icon: '📦', title: 'Refill Delay Risk', body: 'You refill Vitamin D3 with only 3–5 days remaining – critically thin. If the pharmacy is out of stock, supplementation breaks. All other drugs are refilled at a comfortable 15–20 day buffer. Set a Vitamin D3 alert at 10 days remaining.', bg: '#FEF3C7', border: 'rgba(180,83,9,0.12)', titleC: C.gold, bodyC: C.gold },
                ].map((ins, i) => (
                    <View key={i} style={[styles.trioCard, { backgroundColor: ins.bg, borderColor: ins.border }]}>
                        <Text style={styles.trioIcon}>{ins.icon}</Text>
                        <Text style={[styles.trioTitle, { color: ins.titleC }]}>{ins.title}</Text>
                        <Text style={[styles.trioBdy, { color: ins.bodyC }]}>{ins.body}</Text>
                    </View>
                ))}
            </View>

            <View style={{ height: vs(30) }} />
        </ScrollView>
    );
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const MedicationAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Spend');

    return (
        <LinearGradient
            colors={globalGradient2}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Medication Analytics </Text>
                        <Text style={styles.headerSub}>Spend · Behaviour · Adherence</Text>
                    </View>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    {[
                        { key: 'Spend',     label: 'Spend Analytics',    icon: 'cash-outline' },
                        { key: 'Behaviour', label: 'Behaviour Analytics', icon: 'pulse-outline' },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(14)}
                                color={activeTab === tab.key ? whiteColor : '#94A3B8'} />
                            <Text style={[styles.tabTxt, activeTab === tab.key && styles.tabTxtActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'Spend' ? <SpendTab /> : <BehaviourTab />}
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MedicationAnalyticsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    flex1: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(14),
        backgroundColor: 'transparent',
    },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center', justifyContent: 'center', marginRight: ms(12),
    },
    headerTitle: { fontFamily: heading, fontSize: ms(18), color: whiteColor },
    headerSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', marginTop: vs(2) },

    // Tab bar
    tabBar: {
        flexDirection: 'row', marginHorizontal: ms(20),
        backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(4), marginBottom: vs(8),
        shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: ms(4), paddingVertical: vs(8), borderRadius: ms(9),
    },
    tabActive: { backgroundColor: primaryColor },
    tabTxt: { fontFamily: interMedium, fontSize: ms(12), color: '#94A3B8' },
    tabTxtActive: { color: whiteColor },

    tabContent: { paddingHorizontal: ms(16), paddingTop: vs(4) },

    // Hero
    hero: { borderRadius: ms(16), padding: ms(16), marginBottom: vs(12) },
    heroTop: { marginBottom: vs(12) },
    heroMain: {},
    heroValue: { fontFamily: heading, fontSize: ms(42), color: whiteColor, lineHeight: ms(48) },
    heroValueSm: { fontSize: ms(22), opacity: 0.65 },
    heroTag: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.55)', marginTop: vs(2) },
    heroKpis: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(0), marginBottom: vs(12) },
    heroKpi: { width: '33%', paddingVertical: vs(4), paddingRight: ms(6), borderRightWidth: 0 },
    heroKpiN: { fontFamily: heading, fontSize: ms(15), color: whiteColor },
    heroKpiL: { fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.5)', marginTop: vs(1) },
    heroChips: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) },
    heroChip: { paddingHorizontal: ms(9), paddingVertical: vs(4), borderRadius: ms(20) },
    heroChipTxt: { fontFamily: interMedium, fontSize: ms(10) },

    // Stat strip
    stripScroll: { marginBottom: vs(12) },
    statStrip: {
        backgroundColor: whiteColor, borderRadius: ms(10),
        padding: ms(12), marginRight: ms(8), minWidth: ms(120),
        borderTopWidth: 2.5,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    stripLbl: { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(3) },
    stripVal: { fontFamily: heading, fontSize: ms(18), marginBottom: vs(2) },
    stripSub: { fontFamily: interRegular, fontSize: ms(10), color: primaryColor },

    // Card
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(14), marginBottom: vs(12),
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },

    // Section title
    secTitleWrap: { marginBottom: vs(10) },
    secTitle: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    secSub: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginTop: vs(1) },

    // Bar chart
    barChartWrap: { flexDirection: 'row', gap: ms(4), alignItems: 'flex-end' },
    barCol: { alignItems: 'center', minWidth: ms(26) },
    barAmt: { fontFamily: interRegular, fontSize: ms(8), color: '#64748B', marginBottom: vs(2) },
    barLbl: { fontFamily: interRegular, fontSize: ms(8), color: '#94A3B8', marginTop: vs(3) },

    // Progress bar
    barBg: { backgroundColor: '#F1F5F9', borderRadius: ms(3), overflow: 'hidden' },
    barFill: { borderRadius: ms(3) },

    // Legend
    legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginTop: vs(8) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    legendDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
    legendTxt: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B' },

    // Drug row
    drugRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    condName: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', width: ms(80) },
    condAmt: { fontFamily: interMedium, fontSize: ms(11), minWidth: ms(44), textAlign: 'right' },

    // Donut legend
    donutLegend: { gap: vs(8) },
    dlRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    dlSwatch: { width: ms(8), height: ms(8), borderRadius: ms(2) },
    dlName: { fontFamily: interRegular, fontSize: ms(11), color: '#334155', flex: 1 },
    dlBarWrap: { width: ms(48) },
    dlVal: { fontFamily: interMedium, fontSize: ms(11), width: ms(40), textAlign: 'right' },
    dlPct: { fontFamily: interMedium, fontSize: ms(10), width: ms(28), textAlign: 'right' },

    // Gantt
    ganttRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(5), gap: ms(6) },
    ganttLabel: { fontFamily: interMedium, fontSize: ms(10), color: blackColor, width: ms(70) },
    ganttTrack: { flex: 1, height: vs(18), backgroundColor: '#F1F5F9', borderRadius: ms(5), overflow: 'hidden', position: 'relative' },
    ganttBar: { position: 'absolute', height: '100%', borderRadius: ms(5), top: 0, justifyContent: 'center', paddingHorizontal: ms(5) },
    ganttBarTxt: { fontFamily: interMedium, fontSize: ms(8), color: whiteColor },
    ganttDur: { fontFamily: interMedium, fontSize: ms(10), color: '#94A3B8', width: ms(26), textAlign: 'right' },
    ganttAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4), paddingLeft: ms(76) },
    ganttAxisLbl: { fontFamily: interRegular, fontSize: ms(8), color: '#94A3B8' },

    // Table
    tableHead: { flexDirection: 'row', paddingBottom: vs(6), borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: vs(2) },
    thCell: { flex: 1, fontFamily: interMedium, fontSize: ms(9), color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.4 },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(6), borderBottomWidth: 0.5, borderBottomColor: '#F8FAFC' },
    tdCell: { flex: 1, fontFamily: interRegular, fontSize: ms(11), color: '#334155' },

    // Insight box
    insightBox: {
        flexDirection: 'row', gap: ms(8), backgroundColor: '#EEF2FF',
        borderRadius: ms(10), padding: ms(10), marginTop: vs(10), alignItems: 'flex-start',
    },
    insightTxt: { fontFamily: interRegular, fontSize: ms(11), color: '#5B21B6', flex: 1, lineHeight: ms(16) },
    insightBullet: { flexDirection: 'row', gap: ms(8), marginBottom: vs(8), alignItems: 'flex-start' },
    insightBulletIcon: { fontSize: ms(14), marginTop: vs(1) },

    // Rank row
    rankRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(8), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
    rankN: { fontFamily: interMedium, fontSize: ms(11), color: '#94A3B8', width: ms(18) },
    rankName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    rankMeta: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginBottom: vs(4) },
    rankVal: { fontFamily: heading, fontSize: ms(13), minWidth: ms(55), textAlign: 'right' },

    // Benchmarking
    benchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(10) },
    benchCard: { width: '47%', borderRadius: ms(10), padding: ms(10) },
    benchLbl: { fontFamily: interMedium, fontSize: ms(9), textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4) },
    benchVal: { fontFamily: heading, fontSize: ms(20) },

    // Refill grid
    rfGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    rfCard: {
        width: '47%', borderRadius: ms(10), padding: ms(10),
        backgroundColor: '#F8FAFC', borderLeftWidth: 3,
    },
    rfName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(2) },
    rfMeta: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginBottom: vs(6) },
    rfFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4) },
    rfFootLbl: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8' },
    rfFootVal: { fontFamily: interMedium, fontSize: ms(11) },

    // Pill badge
    pill: { paddingHorizontal: ms(7), paddingVertical: vs(2), borderRadius: ms(4) },
    pillTxt: { fontFamily: interMedium, fontSize: ms(9), letterSpacing: 0.2 },

    // Adherence row
    adhRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), paddingVertical: vs(7), borderBottomWidth: 0.5, borderBottomColor: '#F8FAFC' },
    adhSwatch: { width: ms(10), height: ms(10), borderRadius: ms(3) },
    adhInfo: { width: ms(90) },
    adhName: { fontFamily: interMedium, fontSize: ms(11), color: blackColor },
    adhMeta: { fontFamily: interRegular, fontSize: ms(9), color: '#94A3B8', marginTop: vs(1) },
    adhBarWrap: { flex: 1 },

    // Heatmap
    heatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(3) },
    heatDrugName: { fontFamily: interMedium, fontSize: ms(9), width: ms(70) },
    heatCell: { width: ms(11), height: ms(11), borderRadius: ms(2), marginHorizontal: ms(1) },
    heatDay: { fontFamily: interRegular, fontSize: ms(7), color: '#94A3B8', width: ms(13), textAlign: 'center' },

    // Interaction cards
    ixCard: { borderRadius: ms(10), padding: ms(12), marginBottom: vs(8), borderWidth: 0.5 },
    ixHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(6) },
    ixDrugs: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, flex: 1, marginRight: ms(6) },
    ixBody: { fontFamily: interRegular, fontSize: ms(11), color: '#334155', lineHeight: ms(16), marginBottom: vs(5) },
    ixAction: { fontFamily: interMedium, fontSize: ms(11) },

    // Side effects
    seRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#F8FAFC' },
    seDot: { width: ms(9), height: ms(9), borderRadius: ms(5), marginTop: vs(3) },
    seName: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    seMeta: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginTop: vs(2), lineHeight: ms(14) },

    // Dose clock
    clockGrid: { flexDirection: 'row', gap: ms(8) },
    clockSlot: {
        flex: 1, borderWidth: 1, borderColor: '#E2E8F0',
        borderRadius: ms(12), padding: ms(10),
    },
    clockSlotTaken: { borderColor: primaryColor + '44', backgroundColor: primaryColor + '06' },
    clockLabel: { fontFamily: interRegular, fontSize: ms(8), color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(3) },
    clockTime: { fontFamily: heading, fontSize: ms(13), color: blackColor, marginBottom: vs(8) },
    clockPills: { gap: vs(4), marginBottom: vs(8) },
    clockPillRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    clockDot: { width: ms(7), height: ms(7), borderRadius: ms(4) },
    clockPillTxt: { fontFamily: interRegular, fontSize: ms(9), color: '#334155', flex: 1 },

    // Lifecycle
    lcRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#F8FAFC' },
    lcIcon: { width: ms(28), height: ms(28), borderRadius: ms(7), alignItems: 'center', justifyContent: 'center' },
    lcIconTxt: { fontFamily: interMedium, fontSize: ms(13) },
    lcDrug: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    lcMeta: { fontFamily: interRegular, fontSize: ms(10), color: '#94A3B8', marginTop: vs(2), lineHeight: ms(14), flex: 1 },
    lcDate: { fontFamily: interMedium, fontSize: ms(10), minWidth: ms(60), textAlign: 'right' },

    // Insight trio
    trioGrid: { gap: ms(10), marginBottom: vs(12) },
    trioCard: { borderRadius: ms(12), padding: ms(14), borderWidth: 1 },
    trioIcon: { fontSize: ms(18), marginBottom: vs(5) },
    trioTitle: { fontFamily: interMedium, fontSize: ms(12), marginBottom: vs(5) },
    trioBdy: { fontFamily: interRegular, fontSize: ms(11), lineHeight: ms(16) },
});
