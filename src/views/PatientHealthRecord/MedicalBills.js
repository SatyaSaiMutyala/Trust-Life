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
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

// ── Category definitions ──────────────────────────────────────────────────────
const CATS = [
    { id: 'all',        short: 'All',  color: primaryColor, light: primaryColor + '18' },
    { id: 'outpatient', short: 'OPD',  color: primaryColor, light: '#CCFBF1' },
    { id: 'inpatient',  short: 'IPD',  color: '#7C3AED',    light: '#EDE9FE' },
    { id: 'diagnostics',short: 'Lab',  color: '#1D4ED8',    light: '#EFF6FF' },
    { id: 'pharmacy',   short: 'Rx',   color: '#16A34A',    light: '#F0FDF4' },
    { id: 'services',   short: 'Svc',  color: '#D97706',    light: '#FEF3C7' },
    { id: 'insurance',  short: 'Ins',  color: '#4338CA',    light: '#EEF2FF' },
];

const STATUS_META = {
    paid:        { label: 'Paid',        bg: '#F0FDF4', color: '#16A34A' },
    pending:     { label: 'Pending',     bg: '#FEF3C7', color: '#D97706' },
    reimbursed:  { label: 'Reimbursed',  bg: '#EFF6FF', color: '#1D4ED8' },
    partial:     { label: 'Partial',     bg: '#FFF7ED', color: '#EA580C' },
};

// ── Bills data ────────────────────────────────────────────────────────────────
const BILLS = [
    {
        id: 1, cat: 'outpatient', provider: 'Apollo Hospitals', doctor: 'Dr. Priya Nair',
        date: 'Mar 09, 2025', title: 'Endocrinology OPD Consultation',
        status: 'paid', amount: 800, insured: false,
        detail: { billNo: 'APL/OPD/2025/4721', visit: 'Mar 09 — Diabetes Follow-up', mode: 'UPI · PhonePe', tax: 'Nil' },
        lines: [{ desc: 'OPD Consultation Fee', qty: '1', rate: '₹800', amt: '₹800' }, { desc: 'TOTAL', qty: '', rate: '', amt: '₹800', total: true }],
        tags: ['Diabetes Review', 'Endocrinology'],
    },
    {
        id: 2, cat: 'diagnostics', provider: 'Apollo Diagnostics', doctor: 'Dr. Priya Nair (Ref)',
        date: 'Mar 09, 2025', title: 'HbA1c + CBC + Urine Panel',
        status: 'paid', amount: 2400, insured: false,
        detail: { billNo: 'APD/2025/8834', visit: 'Mar 09 — Diabetes Follow-up', mode: 'Card · HDFC', tax: '₹115 GST' },
        lines: [
            { desc: 'HbA1c (Glycated Haemoglobin)', qty: '1', rate: '₹750', amt: '₹750' },
            { desc: 'Complete Blood Count (CBC)',    qty: '1', rate: '₹550', amt: '₹550' },
            { desc: 'Urine Routine & Microscopy',   qty: '1', rate: '₹350', amt: '₹350' },
            { desc: 'Urine Microalbumin (spot)',     qty: '1', rate: '₹635', amt: '₹635' },
            { desc: 'GST @5%', qty: '', rate: '', amt: '₹115' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹2,400', total: true },
        ],
        tags: ['Diagnostics', 'Referred by Dr. Nair'],
    },
    {
        id: 3, cat: 'inpatient', provider: 'Yashoda Hospitals', doctor: 'Dr. Suresh Reddy',
        date: 'Feb 14, 2025', title: 'Cardiology OPD + ECG + Consultation',
        status: 'paid', amount: 3800, insured: true,
        insuranceClaim: { policy: 'Star Health · Individual', ref: 'SH/CL/2025/00341', status: 'Approved', amount: '₹3,800' },
        detail: { billNo: 'YH/OPD/2025/1182', visit: 'Feb 14 — Cholesterol Consultation', mode: 'Insurance (Star Health)', tax: '₹181 GST' },
        lines: [
            { desc: 'Cardiology OPD Fee',  qty: '1', rate: '₹1,200', amt: '₹1,200' },
            { desc: 'ECG (Resting 12-lead)', qty: '1', rate: '₹450',   amt: '₹450' },
            { desc: 'Echocardiography',    qty: '1', rate: '₹1,800', amt: '₹1,800' },
            { desc: 'GST @5%', qty: '', rate: '', amt: '₹181' },
            { desc: 'Patient Paid (Post-Reimbursement)', qty: '', rate: '', amt: '₹0' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹3,800', total: true },
        ],
        tags: ['Cardiac', 'Insurance Claimed'],
    },
    {
        id: 4, cat: 'pharmacy', provider: 'MedPlus Pharmacy', doctor: '',
        date: 'Mar 10, 2025', title: 'Monthly Medication Refill — Mar 2025',
        status: 'paid', amount: 2150, insured: false,
        detail: { billNo: 'MDP/HYD/2025/33481', visit: 'Post consultation refill', mode: 'UPI · GPay', tax: '₹85 GST' },
        lines: [
            { desc: 'Metformin 500mg × 90 tabs',     qty: '90', rate: '₹5.5', amt: '₹495' },
            { desc: 'Pantoprazole 40mg × 30 tabs',   qty: '30', rate: '₹8',   amt: '₹240' },
            { desc: 'Vitamin D3 60K IU × 8 caps',    qty: '8',  rate: '₹48',  amt: '₹384' },
            { desc: 'Vitamin B12 1500mcg × 30 tabs', qty: '30', rate: '₹32',  amt: '₹960' },
            { desc: 'GST (varies per drug)', qty: '', rate: '', amt: '₹85' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹2,150', total: true },
        ],
        tags: ['Monthly Refill', 'Diabetes', 'Vitamins'],
    },
    {
        id: 5, cat: 'services', provider: 'ActiveLife Physiotherapy', doctor: 'Dr. Ramya Srinivas',
        date: 'Jan 20, 2025', title: 'Physiotherapy — Back Pain (5 sessions)',
        status: 'paid', amount: 5000, insured: false,
        detail: { billNo: 'ALP/2025/0091', visit: 'Jan 20 – Feb 10, 2025', mode: 'Card', tax: '₹238 GST' },
        lines: [
            { desc: 'Physiotherapy Session', qty: '5', rate: '₹952', amt: '₹4,762' },
            { desc: 'GST @5%', qty: '', rate: '', amt: '₹238' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹5,000', total: true },
        ],
        tags: ['Physiotherapy', 'Back Pain'],
    },
    {
        id: 6, cat: 'inpatient', provider: 'Care Hospitals (Day Surgery)', doctor: 'Dr. Kavitha Iyer',
        date: 'Jan 07, 2025', title: 'Minor Procedure — Cyst Removal (Day Care)',
        status: 'reimbursed', amount: 18500, insured: true,
        insuranceClaim: { policy: 'Star Health · Individual', ref: 'SH/CL/2025/00192', status: 'Processing', amount: '₹18,500' },
        detail: { billNo: 'CH/DAY/2025/0029', visit: 'Jan 07 — Day Care Admission', mode: 'Insurance · Processing', tax: '₹881 GST' },
        lines: [
            { desc: 'Surgeon Fee',              qty: '1', rate: '₹8,000', amt: '₹8,000' },
            { desc: 'OT Charges',               qty: '1', rate: '₹4,500', amt: '₹4,500' },
            { desc: 'Anaesthesia Fee',          qty: '1', rate: '₹2,000', amt: '₹2,000' },
            { desc: 'Bed/Room (Day Care)',       qty: '1', rate: '₹1,500', amt: '₹1,500' },
            { desc: 'Medicines & Consumables',  qty: '1', rate: '₹619',   amt: '₹619'   },
            { desc: 'GST @5%', qty: '', rate: '', amt: '₹881' },
            { desc: 'Balance (Insurance pending)', qty: '', rate: '', amt: '₹13,500' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹18,500', total: true },
        ],
        tags: ['Day Surgery', 'Insurance Pending'],
    },
    {
        id: 7, cat: 'pharmacy', provider: 'Medica Pharmacy', doctor: '',
        date: 'Nov 15, 2024', title: 'Medication Refill — Nov 2024',
        status: 'pending', amount: 1860, insured: false,
        detail: { billNo: 'MDA/2024/11-09182', visit: 'Post November consultation', mode: 'Pending', tax: '₹74 GST' },
        lines: [
            { desc: 'Metformin 500mg × 90 tabs',   qty: '90', rate: '₹5.5', amt: '₹495' },
            { desc: 'Pantoprazole 40mg × 30 tabs', qty: '30', rate: '₹8',   amt: '₹240' },
            { desc: 'Vitamin D3 60K IU × 8 caps',  qty: '8',  rate: '₹48',  amt: '₹384' },
            { desc: 'Paracetamol 500mg × 20 tabs', qty: '20', rate: '₹4',   amt: '₹80'  },
            { desc: 'GST', qty: '', rate: '', amt: '₹74' },
            { desc: 'TOTAL', qty: '', rate: '', amt: '₹1,860', total: true },
        ],
        tags: ['Monthly Refill'],
    },
];

// ── Spend Hero ────────────────────────────────────────────────────────────────
const SpendHero = () => {
    const catTotals = { outpatient: 800, inpatient: 22300, diagnostics: 5600, pharmacy: 4010, services: 5000, insurance: 0 };
    const total = Object.values(catTotals).reduce((a, b) => a + b, 0);
    const barCats = CATS.slice(1).filter(c => catTotals[c.id] > 0);

    return (
        <LinearGradient
            colors={[primaryColor, '#0D5C52']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
        >
            {/* Top: label + amount + period */}
            <View style={styles.heroTop}>
                <View style={styles.heroTopLeft}>
                    <Text style={styles.heroLabel}>Total Medical Spend · 2025</Text>
                    <Text style={styles.heroAmount}>₹{total.toLocaleString('en-IN')}</Text>
                    <Text style={styles.heroPeriod}>Jan – Mar 2025  ·  12 bills tracked</Text>
                </View>
                <View style={styles.heroTopRight}>
                    <View style={styles.heroBillsBadge}>
                        <Icon type={Icons.Ionicons} name="document-text-outline" size={ms(14)} color={whiteColor} />
                        <Text style={styles.heroBillsBadgeTxt}>12 Bills</Text>
                    </View>
                </View>
            </View>

            {/* Stacked bar */}
            <View style={styles.heroBar}>
                {barCats.map(c => (
                    <View key={c.id} style={[styles.heroBarSeg, {
                        flex: catTotals[c.id] / total,
                        backgroundColor: whiteColor,
                        opacity: catTotals[c.id] / total,
                    }]} />
                ))}
            </View>

            {/* Divider */}
            <View style={styles.heroDivider} />

            {/* Category mini-cards row */}
            <View style={styles.heroCatsRow}>
                {barCats.map(c => {
                    const pct = Math.round((catTotals[c.id] / total) * 100);
                    return (
                        <View key={c.id} style={styles.heroCatCard}>
                            <Text style={styles.heroCatPct}>{pct}%</Text>
                            <Text style={styles.heroCatVal}>₹{(catTotals[c.id] / 1000).toFixed(0)}K</Text>
                            <Text style={styles.heroCatName}>{c.short}</Text>
                            <View style={styles.heroCatBar}>
                                <View style={[styles.heroCatFill, { width: `${pct}%` }]} />
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Legend */}
            <View style={styles.heroLegend}>
                {barCats.map(c => (
                    <View key={c.id} style={styles.heroLegItem}>
                        <View style={[styles.heroLegDot, { backgroundColor: c.color }]} />
                        <Text style={styles.heroLegTxt}>{c.short}</Text>
                    </View>
                ))}
            </View>
        </LinearGradient>
    );
};

// ── Bill Card ─────────────────────────────────────────────────────────────────
const BillCard = ({ bill, expanded, onToggle, onNavigate }) => {
    const cat = CATS.find(c => c.id === bill.cat) || CATS[1];
    const st = STATUS_META[bill.status] || STATUS_META.pending;

    return (
        <View style={styles.billCard}>
            {/* Left accent */}
            <View style={[styles.billAccent, { backgroundColor: cat.color }]} />

            <View style={{ flex: 1 }}>
                {/* Header row */}
                <TouchableOpacity style={styles.billRow} activeOpacity={0.7} onPress={onToggle}>
                    <View style={[styles.billCatIcon, { backgroundColor: cat.light }]}>
                        <Icon type={Icons.Ionicons} name="document-text-outline" size={ms(16)} color={cat.color} />
                    </View>

                    <View style={styles.billMeta}>
                        <Text style={styles.billTitle} numberOfLines={1}>{bill.title}</Text>
                        <Text style={styles.billSubtitle} numberOfLines={1}>
                            {bill.provider}{bill.doctor ? ' · ' + bill.doctor : ''} · {bill.date}
                        </Text>
                        <View style={styles.billTags}>
                            {bill.tags.map((t, i) => (
                                <View key={i} style={[styles.billTag, { backgroundColor: cat.light }]}>
                                    <Text style={[styles.billTagTxt, { color: cat.color }]}>{t}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.billRight}>
                        <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                            <Text style={[styles.statusBadgeTxt, { color: st.color }]}>{st.label}</Text>
                        </View>
                        <View style={styles.billAmtWrap}>
                            <Text style={styles.billAmt}>₹{bill.amount.toLocaleString('en-IN')}</Text>
                            {bill.insured && <Text style={[styles.billAmtSub, { color: '#1D4ED8' }]}>Insured</Text>}
                        </View>
                        <Icon type={Icons.Ionicons}
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={ms(16)} color="#94A3B8" />
                    </View>
                </TouchableOpacity>

                {/* Expanded body */}
                {expanded && (
                    <View style={styles.billBody}>
                        {/* Detail grid */}
                        <View style={styles.detailGrid}>
                            {[
                                { lbl: 'Bill No.', val: bill.detail.billNo },
                                { lbl: 'Related Visit', val: bill.detail.visit },
                                { lbl: 'Payment Mode', val: bill.detail.mode },
                                { lbl: 'Tax / GST', val: bill.detail.tax },
                            ].map((d, i) => (
                                <View key={i} style={styles.detailCell}>
                                    <Text style={styles.detailLbl}>{d.lbl}</Text>
                                    <Text style={styles.detailVal} numberOfLines={2}>{d.val}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Insurance row */}
                        {bill.insured && bill.insuranceClaim && (
                            <View style={styles.insRow}>
                                <Icon type={Icons.Ionicons} name="shield-checkmark-outline" size={ms(16)} color="#1D4ED8" />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.insTitle}>{bill.insuranceClaim.policy}</Text>
                                    <Text style={styles.insSub}>
                                        Ref: {bill.insuranceClaim.ref} · {bill.insuranceClaim.status}
                                    </Text>
                                </View>
                                <Text style={styles.insAmt}>{bill.insuranceClaim.amount}</Text>
                            </View>
                        )}

                        {/* Line items */}
                        <Text style={styles.lineItemsLabel}>Line Items</Text>
                        <View style={styles.lineItemsTable}>
                            <View style={[styles.lineRow, styles.lineHeader]}>
                                <Text style={[styles.lineDesc, styles.lineHdrTxt]}>Description</Text>
                                <Text style={[styles.lineNum, styles.lineHdrTxt]}>Qty</Text>
                                <Text style={[styles.lineNum, styles.lineHdrTxt]}>Rate</Text>
                                <Text style={[styles.lineNum, styles.lineHdrTxt]}>Amt</Text>
                            </View>
                            {bill.lines.map((l, i) => (
                                <View key={i} style={[styles.lineRow, l.total && styles.lineTotal]}>
                                    <Text style={[styles.lineDesc, l.total && styles.lineTotalTxt]} numberOfLines={2}>{l.desc}</Text>
                                    <Text style={[styles.lineNum, l.total && styles.lineTotalTxt]}>{l.qty}</Text>
                                    <Text style={[styles.lineNum, l.total && styles.lineTotalTxt]}>{l.rate}</Text>
                                    <Text style={[styles.lineNum, l.total && styles.lineTotalTxt]}>{l.amt}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionBtns}>
                            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
                                <Icon type={Icons.Ionicons} name="download-outline" size={ms(12)} color={whiteColor} />
                                <Text style={[styles.actionBtnTxt, { color: whiteColor }]}>Download PDF</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Icon type={Icons.Ionicons} name="share-outline" size={ms(12)} color="#64748B" />
                                <Text style={styles.actionBtnTxt}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Icon type={Icons.Feather} name="edit-2" size={ms(12)} color="#64748B" />
                                <Text style={styles.actionBtnTxt}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const MedicalBills = () => {
    const navigation = useNavigation();
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filtered = activeFilter === 'all'
        ? BILLS
        : BILLS.filter(b => b.cat === activeFilter);

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.22]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Medical Bills</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    {/* ── Spend Hero ── */}
                    <SpendHero />

                    {/* ── Stats Row ── */}
                    <View style={styles.statsRow}>
                        {[
                            { lbl: 'Total Bills',       val: '12',  sub: 'all time',     vc: blackColor },
                            { lbl: 'Paid',              val: '8',   sub: '₹42,850',      vc: '#16A34A' },
                            { lbl: 'Pending',           val: '3',   sub: '₹18,600',      vc: '#D97706' },
                            { lbl: 'Reimbursed',        val: '1',   sub: '₹12,000',      vc: '#1D4ED8' },
                            { lbl: 'Insurance Claims',  val: '2',   sub: '₹24,000 filed', vc: blackColor },
                        ].map((s, i) => (
                            <View key={i} style={styles.statCard}>
                                <Text style={styles.statLbl}>{s.lbl}</Text>
                                <Text style={[styles.statVal, { color: s.vc }]}>{s.val}</Text>
                                <Text style={styles.statSub}>{s.sub}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Section header ── */}
                    <View style={styles.secRow}>
                        <View>
                            <Text style={styles.secTitle}>Bill Vault</Text>
                            <Text style={styles.secSub}>All medical expenses in one place</Text>
                        </View>
                    </View>

                    {/* ── Category filter chips ── */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}>
                        {CATS.map(c => (
                            <TouchableOpacity
                                key={c.id}
                                style={[styles.chip, activeFilter === c.id && { backgroundColor: c.color, borderColor: c.color }]}
                                onPress={() => setActiveFilter(c.id)}
                            >
                                <Text style={[styles.chipTxt, activeFilter === c.id && { color: whiteColor }]}>
                                    {c.short === 'All' ? 'All Bills' : c.short}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* ── Bills List ── */}
                    <View style={styles.billsList}>
                        {filtered.map(bill => (
                            <BillCard
                                key={bill.id}
                                bill={bill}
                                expanded={expandedIds.has(bill.id)}
                                onToggle={() => toggleExpand(bill.id)}
                                onNavigate={() => {}}
                            />
                        ))}
                    </View>

                    <View style={{ height: vs(100) }} />
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('UploadMedicalBill')}
                >
                    <Icon type={Icons.Ionicons} name="add" size={ms(26)} color={whiteColor} />
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MedicalBills;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    flex1: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(20), paddingTop: ms(50), paddingBottom: vs(14),
    },
    backBtn: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: { flex: 1, fontFamily: heading, fontSize: ms(18), color: whiteColor, marginLeft: ms(12) },

    scroll: { paddingHorizontal: ms(16), paddingTop: vs(4) },

    // ── Hero ──
    hero: {
        borderRadius: ms(18), padding: ms(16),
        marginBottom: vs(14), overflow: 'hidden',
    },
    heroTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(14) },
    heroTopLeft: { flex: 1 },
    heroTopRight: { alignItems: 'flex-end' },
    heroLabel: {
        fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(4),
    },
    heroAmount: { fontFamily: heading, fontSize: ms(32), color: whiteColor, marginBottom: vs(2) },
    heroPeriod: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(255,255,255,0.55)' },
    heroBillsBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
    },
    heroBillsBadgeTxt: { fontFamily: interMedium, fontSize: ms(11), color: whiteColor },

    heroBar: {
        flexDirection: 'row', height: vs(6), borderRadius: ms(3),
        overflow: 'hidden', marginBottom: vs(14), gap: ms(2),
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    heroBarSeg: { height: '100%', borderRadius: ms(2) },

    heroDivider: { height: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: vs(12) },

    heroCatsRow: { flexDirection: 'row', gap: ms(6), marginBottom: vs(12) },
    heroCatCard: {
        flex: 1, backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: ms(10), padding: ms(8),
        borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)',
    },
    heroCatPct: { fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.55)', marginBottom: vs(1) },
    heroCatVal: { fontFamily: interMedium, fontSize: ms(12), color: whiteColor },
    heroCatName: { fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.6)', marginTop: vs(1) },
    heroCatBar: {
        height: vs(3), backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: ms(2), overflow: 'hidden', marginTop: vs(5),
    },
    heroCatFill: { height: '100%', borderRadius: ms(2), backgroundColor: whiteColor },

    heroLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) },
    heroLegItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    heroLegDot: { width: ms(7), height: ms(7), borderRadius: ms(2) },
    heroLegTxt: { fontFamily: interRegular, fontSize: ms(9), color: 'rgba(255,255,255,0.6)' },

    // ── Stats Row ──
    statsRow: { flexDirection: 'row', gap: ms(6), marginBottom: vs(14) },
    statCard: {
        flex: 1, backgroundColor: whiteColor, borderRadius: ms(10),
        padding: ms(9), borderWidth: 0.5, borderColor: primaryColor + '22',
    },
    statLbl: { fontFamily: interRegular, fontSize: ms(8), color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(2) },
    statVal: { fontFamily: interMedium, fontSize: ms(15), color: blackColor },
    statSub: { fontFamily: interRegular, fontSize: ms(8), color: primaryColor, marginTop: vs(1) },

    // ── Section Header ──
    secRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: vs(10) },
    secTitle: { fontFamily: heading, fontSize: ms(16), color: blackColor },
    secSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', marginTop: vs(1) },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        backgroundColor: primaryColor, borderRadius: ms(8),
        paddingHorizontal: ms(12), paddingVertical: vs(6),
    },
    addBtnTxt: { fontFamily: interMedium, fontSize: ms(12), color: whiteColor },

    // ── Filter Chips ──
    filterScroll: { gap: ms(7), paddingBottom: vs(12) },
    chip: {
        paddingHorizontal: ms(14), paddingVertical: vs(6),
        borderRadius: ms(20), borderWidth: 1, borderColor: primaryColor + '40',
    },
    chipTxt: { fontFamily: interMedium, fontSize: ms(12), color: '#64748B' },

    // ── Upload Zone ──
    uploadZone: {
        borderWidth: 2, borderStyle: 'dashed', borderColor: primaryColor + '44',
        borderRadius: ms(14), padding: ms(18), alignItems: 'center',
        backgroundColor: primaryColor + '04', marginBottom: vs(14),
    },
    uploadIconCircle: {
        width: ms(48), height: ms(48), borderRadius: ms(14),
        backgroundColor: primaryColor + '18', justifyContent: 'center', alignItems: 'center', marginBottom: vs(10),
    },
    uploadTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor, marginBottom: vs(4) },
    uploadSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', textAlign: 'center', lineHeight: ms(16), marginBottom: vs(12) },
    uploadPills: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), justifyContent: 'center' },
    uploadPill: {
        paddingHorizontal: ms(10), paddingVertical: vs(3),
        borderRadius: ms(20), borderWidth: 1,
    },
    uploadPillTxt: { fontFamily: interMedium, fontSize: ms(10) },

    // ── Bills List ──
    billsList: { gap: ms(10), marginBottom: vs(12) },
    billCard: {
        flexDirection: 'row', backgroundColor: whiteColor,
        borderRadius: ms(14), borderWidth: 0.5, borderColor: primaryColor + '20', overflow: 'hidden',
    },
    billAccent: { width: ms(5) },
    billRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), padding: ms(12) },
    billCatIcon: { width: ms(38), height: ms(38), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    billMeta: { flex: 1, minWidth: 0 },
    billTitle: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
    billSubtitle: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B', marginTop: vs(1) },
    billTags: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(4), marginTop: vs(4) },
    billTag: { paddingHorizontal: ms(7), paddingVertical: vs(2), borderRadius: ms(4) },
    billTagTxt: { fontFamily: interMedium, fontSize: ms(9) },
    billRight: { alignItems: 'flex-end', gap: vs(4), flexShrink: 0 },
    statusBadge: { paddingHorizontal: ms(8), paddingVertical: vs(2), borderRadius: ms(6) },
    statusBadgeTxt: { fontFamily: interMedium, fontSize: ms(10) },
    billAmtWrap: { alignItems: 'flex-end' },
    billAmt: { fontFamily: interMedium, fontSize: ms(16), color: blackColor },
    billAmtSub: { fontFamily: interRegular, fontSize: ms(9), marginTop: vs(1) },

    // ── Expanded body ──
    billBody: {
        borderTopWidth: 0.5, borderTopColor: primaryColor + '18',
        paddingHorizontal: ms(14), paddingVertical: ms(12),
    },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(10) },
    detailCell: {
        width: '47%', backgroundColor: '#F8FFFE',
        borderWidth: 0.5, borderColor: primaryColor + '18',
        borderRadius: ms(8), padding: ms(8),
    },
    detailLbl: { fontFamily: interRegular, fontSize: ms(9), color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2) },
    detailVal: { fontFamily: interMedium, fontSize: ms(11), color: blackColor },

    // Insurance row
    insRow: {
        flexDirection: 'row', alignItems: 'center', gap: ms(10),
        backgroundColor: '#EFF6FF', borderWidth: 0.5, borderColor: 'rgba(29,78,216,0.15)',
        borderRadius: ms(10), padding: ms(10), marginBottom: vs(10),
    },
    insTitle: { fontFamily: interMedium, fontSize: ms(12), color: '#1D4ED8' },
    insSub: { fontFamily: interRegular, fontSize: ms(10), color: 'rgba(29,78,216,0.6)', marginTop: vs(1) },
    insAmt: { fontFamily: interMedium, fontSize: ms(13), color: '#1D4ED8' },

    // Line items
    lineItemsLabel: {
        fontFamily: interMedium, fontSize: ms(10), color: '#64748B',
        textTransform: 'uppercase', letterSpacing: 0.6,
        borderBottomWidth: 0.5, borderBottomColor: primaryColor + '18',
        paddingBottom: vs(4), marginBottom: vs(6),
    },
    lineItemsTable: { marginBottom: vs(10) },
    lineRow: { flexDirection: 'row', paddingVertical: vs(5), borderBottomWidth: 0.5, borderBottomColor: primaryColor + '0A' },
    lineHeader: { borderBottomWidth: 0.5, borderBottomColor: primaryColor + '20' },
    lineHdrTxt: { fontFamily: interMedium, fontSize: ms(9), color: '#64748B', textTransform: 'uppercase' },
    lineTotal: { borderTopWidth: 0.5, borderTopColor: primaryColor + '20', borderBottomWidth: 0 },
    lineTotalTxt: { fontFamily: interMedium, color: blackColor },
    lineDesc: { flex: 2, fontFamily: interRegular, fontSize: ms(11), color: '#334155' },
    lineNum: { flex: 1, fontFamily: interRegular, fontSize: ms(11), color: '#334155', textAlign: 'right' },

    // Action buttons
    actionBtns: { flexDirection: 'row', gap: ms(8), marginTop: vs(4) },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: ms(5),
        borderWidth: 0.5, borderColor: primaryColor + '30',
        borderRadius: ms(7), paddingHorizontal: ms(10), paddingVertical: vs(6),
    },
    actionBtnPrimary: { backgroundColor: primaryColor, borderColor: primaryColor },
    actionBtnTxt: { fontFamily: interMedium, fontSize: ms(11), color: '#64748B' },

    // FAB
    fab: {
        position: 'absolute', bottom: vs(24), right: ms(20),
        width: ms(54), height: ms(54), borderRadius: ms(27),
        backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center',
        elevation: 6, shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6,
    },
});
