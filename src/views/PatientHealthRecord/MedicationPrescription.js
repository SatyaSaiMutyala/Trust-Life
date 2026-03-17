import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, ScrollView, TouchableOpacity,
    StyleSheet, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { heading, interMedium, interRegular } from '../../config/Constants';
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const CARD_W = (width - ms(40) - ms(10)) / 2;

// ── Data ──────────────────────────────────────────────────────────────────────
const MEDS = [
    {
        n: 'Metformin', gen: 'Metformin Hydrochloride', dose: '500mg', freq: '3× daily',
        form: 'Tablet', st: 'active', ref: 18, tot: 90,
        c: primaryColor, cl: primaryColor + '22',
        by: 'Dr. Priya Nair', since: 'Sep 2023', cond: 'Type 2 Diabetes', note: 'Take with meals',
    },
    {
        n: 'Rosuvastatin', gen: 'Rosuvastatin Calcium', dose: '10mg', freq: 'Once at night',
        form: 'Tablet', st: 'active', ref: 62, tot: 90,
        c: '#7C3AED', cl: '#EDE9FE',
        by: 'Dr. Suresh Reddy', since: 'Feb 2025', cond: 'Hypercholesterolemia', note: 'Avoid grapefruit',
    },
    {
        n: 'Pantoprazole', gen: 'Pantoprazole Sodium', dose: '40mg', freq: 'Once daily',
        form: 'Tablet', st: 'active', ref: 45, tot: 90,
        c: '#16A34A', cl: '#F0FDF4',
        by: 'Dr. Priya Nair', since: 'Sep 2023', cond: 'Acid reflux', note: '30 min before dinner',
    },
    {
        n: 'Vitamin D3', gen: 'Cholecalciferol', dose: '60,000 IU', freq: 'Once weekly',
        form: 'Capsule', st: 'active', ref: 5, tot: 60,
        c: '#1D4ED8', cl: '#EFF6FF',
        by: 'Dr. Priya Nair', since: 'Dec 2024', cond: 'Vitamin D deficiency', note: 'Take with fatty meal',
    },
    {
        n: 'Vitamin B12', gen: 'Methylcobalamin', dose: '1500mcg', freq: 'Once daily',
        form: 'Tablet', st: 'active', ref: 34, tot: 90,
        c: '#D97706', cl: '#FEF3C7',
        by: 'Dr. Priya Nair', since: 'Dec 2024', cond: 'B12 deficiency', note: 'Sublingual preferred',
    },
    {
        n: 'Amoxicillin', gen: 'Amoxicillin Trihydrate', dose: '500mg', freq: '3× daily × 5d',
        form: 'Capsule', st: 'completed', ref: 0, tot: 5,
        c: '#64748B', cl: '#F1F5F9',
        by: 'Dr. Kavitha Iyer', since: 'Oct 2024', cond: 'Throat infection', note: 'Full course completed',
    },
];

const SCHEDULE = [
    { slot: 'Morning', time: '7:00 AM', pills: ['Metformin 500mg', 'Rosuvastatin 10mg', 'Vit D3 60K IU'], taken: true },
    { slot: 'Afternoon', time: '1:30 PM', pills: ['Metformin 500mg'], taken: false },
    { slot: 'Night', time: '9:00 PM', pills: ['Metformin 500mg', 'Pantoprazole 40mg'], taken: false },
];

// ── Med Card ──────────────────────────────────────────────────────────────────
const MedCard = ({ m }) => {
    const pct = Math.round((m.ref / m.tot) * 100);
    const barColor = pct <= 15 ? '#EF4444' : pct <= 40 ? '#F59E0B' : m.c;
    return (
        <View style={styles.medCard}>
            {/* Left accent bar */}
            <View style={[styles.medAccent, { backgroundColor: m.c }]} />
            <View style={styles.medInner}>
                {/* Top: icon + status badge */}
                <View style={styles.medTop}>
                    <View style={[styles.medIconCircle, { backgroundColor: m.cl }]}>
                        <Icon type={Icons.Ionicons} name="medkit-outline" size={ms(15)} color={m.c} />
                    </View>
                    <View style={[styles.statusBadge,
                        m.st === 'active' ? styles.badgeActive : styles.badgeDone]}>
                        <Text style={[styles.statusBadgeTxt,
                            { color: m.st === 'active' ? '#16A34A' : '#D97706' }]}>
                            {m.st === 'active' ? 'Active' : 'Done'}
                        </Text>
                    </View>
                </View>

                {/* Name */}
                <Text style={styles.medName} numberOfLines={1}>{m.n}</Text>
                <Text style={styles.medGen} numberOfLines={1}>{m.gen}</Text>

                {/* Dose row */}
                <View style={styles.doseRow}>
                    <Text style={styles.doseVal}>{m.dose}</Text>
                    <Text style={styles.doseSep}> · </Text>
                    <Text style={styles.doseFreq} numberOfLines={1}>{m.freq}</Text>
                </View>

                {/* Details grid */}
                <View style={styles.detGrid}>
                    <View style={styles.detHalf}>
                        <Text style={styles.detLbl}>Form</Text>
                        <Text style={styles.detVal}>{m.form}</Text>
                    </View>
                    <View style={styles.detHalf}>
                        <Text style={styles.detLbl}>Since</Text>
                        <Text style={styles.detVal}>{m.since}</Text>
                    </View>
                    <View style={styles.detFull}>
                        <Text style={styles.detLbl}>Condition</Text>
                        <Text style={styles.detVal} numberOfLines={1}>{m.cond}</Text>
                    </View>
                    <View style={styles.detFull}>
                        <Text style={styles.detLbl}>Notes</Text>
                        <Text style={[styles.detVal, { color: '#64748B', fontFamily: interRegular }]} numberOfLines={1}>{m.note}</Text>
                    </View>
                </View>

                {/* Supply bar — active meds only */}
                {m.st === 'active' && (
                    <View style={styles.supplyWrap}>
                        <View style={styles.supplyLblRow}>
                            <Text style={styles.supplyLbl}>Supply remaining</Text>
                            <Text style={[styles.supplyDays, { color: barColor }]}>{m.ref} days</Text>
                        </View>
                        <View style={styles.supplyTrack}>
                            <View style={[styles.supplyFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.medFooter}>
                    <Text style={styles.rxBy} numberOfLines={1}>
                        Rx by <Text style={{ color: m.c, fontFamily: interMedium }}>{m.by}</Text>
                    </Text>
                    {/* <View style={styles.footerBtns}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Icon type={Icons.Feather} name="edit-2" size={ms(11)} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Icon type={Icons.Ionicons} name="time-outline" size={ms(12)} color="#64748B" />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </View>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const MedicationPrescription = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const title = route.params?.title || 'Medication Vault';
    const [medFilter, setMedFilter] = useState('all');

    const filteredMeds = MEDS.filter(m =>
        medFilter === 'all' ||
        (medFilter === 'active' && m.st === 'active') ||
        (medFilter === 'history' && m.st !== 'active')
    );

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
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                    {/* ── Stats Row ── */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLbl}>Active Meds</Text>
                            <Text style={styles.statVal}>5</Text>
                            <Text style={styles.statSub}>currently taking</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLbl}>Total History</Text>
                            <Text style={styles.statVal}>18</Text>
                            <Text style={styles.statSub}>all medications</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLbl}>Refills Due</Text>
                            <Text style={[styles.statVal, { color: '#DC2626' }]}>1</Text>
                            <Text style={[styles.statSub, { color: '#DC2626' }]}>within 5 days</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLbl}>Adherence</Text>
                            <Text style={styles.statVal}>87<Text style={styles.statPct}>%</Text></Text>
                            <Text style={styles.statSub}>last 30 days</Text>
                        </View>
                    </View>

                    {/* ── Section header + filter chips ── */}
                    <View style={styles.secRow}>
                        <View>
                            <Text style={styles.secTitle}>Medication Vault</Text>
                            <Text style={styles.secSub}>Active prescriptions and full history</Text>
                        </View>
                    </View>

                    <View style={styles.filterRow}>
                        {['all', 'active', 'history'].map(f => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.chip, medFilter === f && styles.chipActive]}
                                onPress={() => setMedFilter(f)}
                            >
                                <Text style={[styles.chipTxt, medFilter === f && styles.chipTxtActive]}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── Medication Cards Grid (2 columns) ── */}
                    <View style={styles.medsGrid}>
                        {filteredMeds.map((m, i) => <MedCard key={i} m={m} />)}
                    </View>

                    {/* ── Today's Schedule ── */}
                    <View style={styles.schedCard}>
                        <View style={styles.schedHead}>
                            <Text style={styles.schedTitle}>Today's Schedule</Text>
                            <Text style={styles.schedSub}>Tue Mar 17 · 3 of 5 taken</Text>
                        </View>
                        <View style={styles.schedGrid}>
                            {SCHEDULE.map((s, i) => (
                                <View key={i} style={[styles.slotCard,
                                    s.taken && { borderColor: primaryColor + '33', backgroundColor: primaryColor + '06' }]}>
                                    <Text style={styles.slotName}>{s.slot}</Text>
                                    <Text style={styles.slotTime}>{s.time}</Text>
                                    <View style={styles.slotPills}>
                                        {s.pills.map((p, j) => (
                                            <View key={j} style={styles.pillRow}>
                                                <View style={[styles.pillDot,
                                                    { backgroundColor: primaryColor, opacity: s.taken ? 0.35 : 1 }]} />
                                                <Text style={[styles.pillName,
                                                    s.taken && styles.pillStrike]} numberOfLines={1}>{p}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <View style={[styles.slotBadge,
                                        { backgroundColor: s.taken ? '#F0FDF4' : '#FEF3C7' }]}>
                                        <Text style={[styles.slotBadgeTxt,
                                            { color: s.taken ? '#16A34A' : '#D97706' }]}>
                                            {s.taken ? 'Taken' : 'Pending'}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── Interaction Alert ── */}
                    <View style={styles.alertBox}>
                        <Icon type={Icons.Ionicons} name="warning-outline" size={ms(20)} color="#EA580C" />
                        <Text style={styles.alertTxt}>
                            <Text style={styles.alertBold}>Potential interaction noted: </Text>
                            Rosuvastatin and high-dose Vitamin D3 — monitor for muscle pain. Consult your doctor before adjusting dosages.
                        </Text>
                    </View>

                    <View style={{ height: vs(100) }} />
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('AddPrescription')}
                >
                    <Icon type={Icons.Ionicons} name="add" size={ms(26)} color={whiteColor} />
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MedicationPrescription;

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
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: {
        flex: 1, fontFamily: heading, fontSize: ms(18),
        color: whiteColor, marginLeft: ms(12),
    },

    // Scroll
    scroll: { paddingHorizontal: ms(20), paddingTop: vs(4) },

    // Stats Row
    statsRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(16) },
    statCard: {
        flex: 1, backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(10), borderWidth: 0.5, borderColor: primaryColor + '22',
    },
    statLbl: {
        fontFamily: interRegular, fontSize: ms(9), color: '#64748B',
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2),
    },
    statVal: { fontFamily: interMedium, fontSize: ms(18), color: blackColor },
    statPct: { fontSize: ms(12), color: '#64748B' },
    statSub: { fontFamily: interRegular, fontSize: ms(9), color: primaryColor, marginTop: vs(1) },

    // Section header
    secRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: vs(10) },
    secTitle: { fontFamily: heading, fontSize: ms(16), color: blackColor },
    secSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B', marginTop: vs(1) },

    // Filter chips
    filterRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(14) },
    chip: {
        paddingHorizontal: ms(16), paddingVertical: vs(6),
        borderRadius: ms(20), borderWidth: 1, borderColor: primaryColor + '40',
    },
    chipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    chipTxt: { fontFamily: interMedium, fontSize: ms(12), color: '#64748B' },
    chipTxtActive: { color: whiteColor },

    // Meds grid
    medsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(16) },
    medCard: {
        width: CARD_W, backgroundColor: whiteColor, borderRadius: ms(14),
        borderWidth: 0.5, borderColor: primaryColor + '20',
        overflow: 'hidden', marginBottom: ms(10), flexDirection: 'row',
    },
    medAccent: { width: ms(4) },
    medInner: { flex: 1, padding: ms(10) },
    medTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: vs(8) },
    medIconCircle: { width: ms(32), height: ms(32), borderRadius: ms(8), justifyContent: 'center', alignItems: 'center' },
    statusBadge: { borderRadius: ms(5), paddingHorizontal: ms(6), paddingVertical: vs(2) },
    badgeActive: { backgroundColor: '#F0FDF4' },
    badgeDone: { backgroundColor: '#FEF3C7' },
    statusBadgeTxt: { fontFamily: interMedium, fontSize: ms(9) },
    medName: { fontFamily: heading, fontSize: ms(13), color: blackColor, marginBottom: vs(1) },
    medGen: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B', marginBottom: vs(8) },

    // Dose row
    doseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) },
    doseVal: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
    doseSep: { fontFamily: interRegular, fontSize: ms(12), color: '#64748B' },
    doseFreq: { fontFamily: interRegular, fontSize: ms(11), color: '#334155', flex: 1 },

    // Details grid
    detGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        borderTopWidth: 0.5, borderTopColor: primaryColor + '18',
        paddingTop: vs(8), marginBottom: vs(6),
    },
    detHalf: { width: '50%', marginBottom: vs(5) },
    detFull: { width: '100%', marginBottom: vs(5) },
    detLbl: { fontFamily: interRegular, fontSize: ms(9), color: '#64748B', marginBottom: vs(1) },
    detVal: { fontFamily: interMedium, fontSize: ms(10), color: blackColor },

    // Supply bar
    supplyWrap: { marginBottom: vs(8) },
    supplyLblRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3) },
    supplyLbl: { fontFamily: interRegular, fontSize: ms(9), color: '#64748B' },
    supplyDays: { fontFamily: interMedium, fontSize: ms(9) },
    supplyTrack: { height: vs(4), backgroundColor: '#E2E8F0', borderRadius: ms(3), overflow: 'hidden' },
    supplyFill: { height: '100%', borderRadius: ms(3) },

    // Med footer
    medFooter: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderTopWidth: 0.5, borderTopColor: primaryColor + '18', paddingTop: vs(8),
    },
    rxBy: { fontFamily: interRegular, fontSize: ms(10), color: '#64748B', flex: 1 },
    footerBtns: { flexDirection: 'row', gap: ms(4) },
    iconBtn: {
        width: ms(24), height: ms(24), borderRadius: ms(6),
        borderWidth: 0.5, borderColor: '#E2E8F0',
        justifyContent: 'center', alignItems: 'center',
    },

    // Schedule
    schedCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        borderWidth: 0.5, borderColor: primaryColor + '20',
        padding: ms(14), marginBottom: vs(12),
    },
    schedHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12) },
    schedTitle: { fontFamily: heading, fontSize: ms(14), color: blackColor },
    schedSub: { fontFamily: interRegular, fontSize: ms(11), color: '#64748B' },
    schedGrid: { flexDirection: 'row', gap: ms(8) },
    slotCard: {
        flex: 1, borderWidth: 0.5, borderColor: primaryColor + '20',
        borderRadius: ms(10), padding: ms(10),
    },
    slotName: {
        fontFamily: interRegular, fontSize: ms(9), color: '#64748B',
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(3),
    },
    slotTime: { fontFamily: interMedium, fontSize: ms(12), color: blackColor, marginBottom: vs(6) },
    slotPills: { gap: vs(3), marginBottom: vs(8) },
    pillRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    pillDot: { width: ms(6), height: ms(6), borderRadius: ms(3) },
    pillName: { fontFamily: interRegular, fontSize: ms(9), color: '#334155', flex: 1 },
    pillStrike: { textDecorationLine: 'line-through', opacity: 0.45 },
    slotBadge: { borderRadius: ms(4), paddingHorizontal: ms(6), paddingVertical: vs(2), alignSelf: 'flex-start' },
    slotBadgeTxt: { fontFamily: interMedium, fontSize: ms(9) },

    // Alert
    alertBox: {
        flexDirection: 'row', gap: ms(10), alignItems: 'flex-start',
        backgroundColor: '#FFF7ED', borderWidth: 0.5, borderColor: 'rgba(234,88,12,0.2)',
        borderRadius: ms(12), padding: ms(14), marginBottom: vs(12),
    },
    alertTxt: { fontFamily: interRegular, fontSize: ms(12), color: '#334155', lineHeight: ms(18), flex: 1 },
    alertBold: { fontFamily: interMedium, color: '#EA580C' },

    // FAB
    fab: {
        position: 'absolute', bottom: vs(24), right: ms(20),
        width: ms(54), height: ms(54), borderRadius: ms(27),
        backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center',
        elevation: 6, shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 6,
    },
});
