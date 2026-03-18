import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient2,
} from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = [
    'Spend Overview',
    'By Category',
    'All Bills',
    '80D Tax',
    'Insurance',
    'Savings',
];

const KPI_CARDS = [
    { label: 'OPD', value: '₹22,400', icon: 'person-outline', color: '#3B82F6' },
    { label: 'IPD', value: '₹18,500', icon: 'bed-outline', color: '#8B5CF6' },
    { label: 'Lab', value: '₹14,900', icon: 'flask-outline', color: '#06B6D4' },
    { label: 'Pharmacy', value: '₹55,410', icon: 'medkit-outline', color: '#10B981' },
    { label: 'Health Svcs', value: '₹19,200', icon: 'fitness-outline', color: '#F59E0B' },
    { label: 'Insurance', value: '₹56,800', icon: 'shield-checkmark-outline', color: '#EC4899' },
];

const MONTHLY_BARS = [
    { month: 'Sep', val: 8200 },
    { month: 'Oct', val: 12400 },
    { month: 'Nov', val: 6800 },
    { month: 'Dec', val: 15200 },
    { month: 'Jan', val: 9600 },
    { month: 'Feb', val: 11800 },
    { month: 'Mar', val: 7200 },
    { month: 'Apr', val: 13900 },
    { month: 'May', val: 8400 },
    { month: 'Jun', val: 10200 },
    { month: 'Jul', val: 18500 },
    { month: 'Aug', val: 9100 },
    { month: 'Sep', val: 14700 },
    { month: 'Oct', val: 7600 },
    { month: 'Nov', val: 11300 },
    { month: 'Dec', val: 8900 },
    { month: 'Jan', val: 13100 },
    { month: 'Feb', val: 9700 },
    { month: 'Mar', val: 0 },
];

const CATEGORY_BARS = [
    { label: 'Pharmacy', pct: 29.6, color: '#10B981' },
    { label: 'Insurance', pct: 30.3, color: '#EC4899' },
    { label: 'OPD', pct: 11.9, color: '#3B82F6' },
    { label: 'Health Svcs', pct: 10.3, color: '#F59E0B' },
    { label: 'Lab', pct: 8.0, color: '#06B6D4' },
    { label: 'IPD', pct: 9.9, color: '#8B5CF6' },
];

const BURDEN_ITEMS = [
    { label: 'Out-of-pocket', pct: 60, color: '#EF4444' },
    { label: 'Insurance covered', pct: 24, color: '#3B82F6' },
    { label: 'Reimbursed', pct: 9, color: '#10B981' },
    { label: 'Pending settlement', pct: 7, color: '#F59E0B' },
];

const YOY_DATA = [
    { year: '2023-24', val: 94300, color: '#94A3B8' },
    { year: '2024-25', val: 187210, color: primaryColor },
];

const SPEND_INSIGHTS = [
    { icon: 'trending-up-outline', color: '#EF4444', bg: '#FEF2F2', text: 'Pharmacy spend up 34% vs last year — consider generic alternatives.' },
    { icon: 'shield-outline', color: '#3B82F6', bg: '#EFF6FF', text: 'Only 24% covered by insurance. Review your plan for better coverage.' },
    { icon: 'bulb-outline', color: '#F59E0B', bg: '#FFFBEB', text: 'You qualify for ₹25,000 Section 80D deduction — file before March 31.' },
];

// ── By Category data ──
const OPD_DOCTORS = [
    { name: 'Dr. Sindhu Sai', specialty: 'Cardiology', visits: 4, amount: '₹8,000' },
    { name: 'Dr. Ramesh N.', specialty: 'General Medicine', visits: 3, amount: '₹4,500' },
    { name: 'Dr. Priya K.', specialty: 'Dermatology', visits: 2, amount: '₹5,200' },
    { name: 'Dr. Arun V.', specialty: 'Orthopedics', visits: 1, amount: '₹4,700' },
];

const LAB_PROVIDERS = [
    { name: 'Apollo Diagnostics', tests: 8, amount: '₹6,200' },
    { name: 'Thyrocare', tests: 5, amount: '₹3,800' },
    { name: 'Dr. Lal PathLabs', tests: 3, amount: '₹4,900' },
];

const PHARMACY_DRUGS = [
    { name: 'Telmisartan 40mg', category: 'BP', branded: '₹380', generic: '₹95', saving: '₹285' },
    { name: 'Atorvastatin 10mg', category: 'Cholesterol', branded: '₹420', generic: '₹110', saving: '₹310' },
    { name: 'Metformin 500mg', category: 'Diabetes', branded: '₹190', generic: '₹55', saving: '₹135' },
];

// ── All Bills ──
const ALL_BILLS = [
    { id: '1', name: 'Apollo Hospitals', category: 'IPD', date: '15 Jul 2025', amount: '₹18,500', status: 'Paid', statusColor: '#16A34A', borderColor: '#8B5CF6' },
    { id: '2', name: 'Thyrocare', category: 'Lab', date: '03 Jun 2025', amount: '₹2,100', status: 'Paid', statusColor: '#16A34A', borderColor: '#06B6D4' },
    { id: '3', name: 'MedPlus Pharmacy', category: 'Pharmacy', date: '28 May 2025', amount: '₹4,800', status: 'Paid', statusColor: '#16A34A', borderColor: '#10B981' },
    { id: '4', name: 'Dr. Sindhu Sai', category: 'OPD', date: '20 Apr 2025', amount: '₹2,000', status: 'Paid', statusColor: '#16A34A', borderColor: '#3B82F6' },
    { id: '5', name: 'HDFC ERGO', category: 'Insurance', date: '01 Apr 2025', amount: '₹28,400', status: 'Paid', statusColor: '#16A34A', borderColor: '#EC4899' },
    { id: '6', name: 'Manipal Hospital', category: 'Health Svcs', date: '12 Mar 2025', amount: '₹7,200', status: 'Pending', statusColor: '#D97706', borderColor: '#F59E0B' },
    { id: '7', name: 'Apollo Diagnostics', category: 'Lab', date: '05 Feb 2025', amount: '₹3,400', status: 'Reimbursed', statusColor: '#1D4ED8', borderColor: '#06B6D4' },
];

const BILL_CATS = ['All', 'OPD', 'IPD', 'Lab', 'Pharmacy', 'Insurance', 'Health Svcs'];

// ── 80D Tax ──
const TAX_ELIGIBLE = [
    { label: 'Health Insurance Premium (Self)', amount: '₹28,400' },
    { label: 'Health Insurance Premium (Parents)', amount: '₹28,400', note: 'Senior citizen' },
    { label: 'Preventive Health Checkup', amount: '₹5,000' },
];

const YR_80D = [
    { yr: 'FY 22-23', val: 18000 },
    { yr: 'FY 23-24', val: 22000 },
    { yr: 'FY 24-25', val: 25000 },
];

const ITR_CHECKLIST = [
    { label: 'Health Insurance Certificate', done: true },
    { label: 'Preventive Checkup Receipt', done: true },
    { label: 'Parents Insurance Certificate', done: false },
    { label: 'Form 16 (employer data)', done: false },
];

const TAX_INSIGHTS = [
    { icon: 'checkmark-circle-outline', color: '#16A34A', bg: '#DCFCE7', text: '₹25,000 Section 80D limit fully utilized — no more room this year.' },
    { icon: 'alert-circle-outline', color: '#D97706', bg: '#FEF3C7', text: 'Parents insurance certificate missing — download from HDFC ERGO portal.' },
    { icon: 'calculator-outline', color: '#3B82F6', bg: '#EFF6FF', text: 'At 30% tax slab, your effective saving is ₹7,500 + 4% cess = ₹7,800.' },
];

// ── Insurance ──
const CLAIMS = [
    { id: 'SH/CL/2025/00341', type: 'Lab Test', amount: '₹3,800', status: 'Approved', statusColor: '#16A34A', statusBg: '#DCFCE7', date: '18 Feb 2025' },
    { id: 'SH/CL/2025/00192', type: 'Hospitalization', amount: '₹18,500', status: 'Processing', statusColor: '#D97706', statusBg: '#FEF3C7', date: '14 Jul 2025' },
];

const TIMELINE_STEPS = [
    { label: 'Claim Filed', date: '14 Jul', done: true },
    { label: 'Documents Verified', date: '16 Jul', done: true },
    { label: 'Under Review', date: '18 Jul', done: false },
    { label: 'Settlement', date: 'Pending', done: false },
];

// ── Savings ──
const SAVINGS_KPIS = [
    { label: 'Generic Drug Savings', value: '₹8,400', icon: 'medkit-outline', color: '#10B981', bg: '#DCFCE7' },
    { label: 'Preventive Checkup ROI', value: '₹15,200', icon: 'fitness-outline', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Tax Saved (80D)', value: '₹7,500', icon: 'calculator-outline', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Total Potential Save', value: '₹31,100', icon: 'trending-down-outline', color: primaryColor, bg: '#F0FDF4' },
];

const PROJECTION_BARS = [
    { label: 'FY 24-25\n(Actual)', base: 187210, optimized: 155900, generic: 134200 },
    { label: 'FY 25-26\n(Projected)', base: 198000, optimized: 145000, generic: 118000 },
    { label: 'FY 26-27\n(Projected)', base: 210000, optimized: 136000, generic: 103000 },
];

// ─── Shared Components ─────────────────────────────────────────────────────────

const SectionCard = ({ children, style }) => (
    <View style={[styles.sectionCard, style]}>{children}</View>
);

const SectionTitle = ({ title, subtitle }) => (
    <View style={styles.secTitleWrap}>
        <Text style={styles.secTitle}>{title}</Text>
        {subtitle ? <Text style={styles.secSubtitle}>{subtitle}</Text> : null}
    </View>
);

const InsightCard = ({ icon, color, bg, text }) => (
    <View style={[styles.insightCard, { backgroundColor: bg }]}>
        <Icon type={Icons.Ionicons} name={icon} size={ms(18)} color={color} />
        <Text style={styles.insightText}>{text}</Text>
    </View>
);

// ─── Tab Contents ──────────────────────────────────────────────────────────────

const SpendOverviewTab = () => {
    const maxVal = Math.max(...MONTHLY_BARS.map(b => b.val));
    const yoyMax = Math.max(...YOY_DATA.map(d => d.val));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>

            {/* Hero Card */}
            <LinearGradient
                colors={['#0F4C3A', '#1A6B55']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <Text style={styles.heroLabel}>Total Medical Spend</Text>
                <Text style={styles.heroAmount}>₹1,87,210</Text>
                <View style={styles.heroRow}>
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Period</Text>
                        <Text style={styles.heroStatValue}>19 months</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Monthly Avg</Text>
                        <Text style={styles.heroStatValue}>₹9,853</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Last Month</Text>
                        <Text style={styles.heroStatValue}>₹9,700</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* KPI Grid */}
            <SectionCard>
                <SectionTitle title="Category Breakdown" />
                <View style={styles.kpiGrid}>
                    {KPI_CARDS.map((k, i) => (
                        <View key={i} style={styles.kpiCard}>
                            <View style={[styles.kpiIcon, { backgroundColor: k.color + '20' }]}>
                                <Icon type={Icons.Ionicons} name={k.icon} size={ms(18)} color={k.color} />
                            </View>
                            <Text style={styles.kpiValue}>{k.value}</Text>
                            <Text style={styles.kpiLabel}>{k.label}</Text>
                        </View>
                    ))}
                </View>
            </SectionCard>

            {/* Monthly Bar Chart */}
            <SectionCard>
                <SectionTitle title="Monthly Spend" subtitle="Last 19 months" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.barChart}>
                        {MONTHLY_BARS.map((b, i) => (
                            <View key={i} style={styles.barItem}>
                                <View style={styles.barTrack}>
                                    <View style={[
                                        styles.barFill,
                                        { height: `${Math.round((b.val / maxVal) * 100)}%`, backgroundColor: b.val === maxVal ? primaryColor : '#A7D5CE' }
                                    ]} />
                                </View>
                                <Text style={styles.barLabel}>{b.month}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SectionCard>

            {/* Category Composition */}
            <SectionCard>
                <SectionTitle title="Category Composition" />
                {CATEGORY_BARS.map((c, i) => (
                    <View key={i} style={styles.compRow}>
                        <Text style={styles.compLabel}>{c.label}</Text>
                        <View style={styles.compTrack}>
                            <View style={[styles.compFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
                        </View>
                        <Text style={styles.compPct}>{c.pct}%</Text>
                    </View>
                ))}
            </SectionCard>

            {/* Financial Burden */}
            <SectionCard>
                <SectionTitle title="Financial Burden Split" />
                {BURDEN_ITEMS.map((b, i) => (
                    <View key={i} style={styles.compRow}>
                        <View style={[styles.dot, { backgroundColor: b.color }]} />
                        <Text style={[styles.compLabel, { flex: 1 }]}>{b.label}</Text>
                        <View style={[styles.compTrack, { flex: 2 }]}>
                            <View style={[styles.compFill, { width: `${b.pct}%`, backgroundColor: b.color }]} />
                        </View>
                        <Text style={styles.compPct}>{b.pct}%</Text>
                    </View>
                ))}
            </SectionCard>

            {/* Year-on-Year */}
            <SectionCard>
                <SectionTitle title="Year-on-Year Comparison" />
                {YOY_DATA.map((d, i) => (
                    <View key={i} style={styles.yoyRow}>
                        <Text style={styles.yoyLabel}>{d.year}</Text>
                        <View style={styles.yoyTrack}>
                            <View style={[styles.yoyFill, { width: `${Math.round((d.val / yoyMax) * 100)}%`, backgroundColor: d.color }]} />
                        </View>
                        <Text style={styles.yoyAmt}>₹{(d.val / 1000).toFixed(0)}K</Text>
                    </View>
                ))}
                <View style={styles.yoyChangeRow}>
                    <Icon type={Icons.Ionicons} name="trending-up-outline" size={ms(14)} color="#EF4444" />
                    <Text style={[styles.yoyChangeText, { color: '#EF4444' }]}>+98.5% vs previous year</Text>
                </View>
            </SectionCard>

            {/* Insights */}
            <SectionCard>
                <SectionTitle title="Key Insights" />
                {SPEND_INSIGHTS.map((ins, i) => (
                    <InsightCard key={i} {...ins} />
                ))}
            </SectionCard>
        </ScrollView>
    );
};

const ByCategoryTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>

        {/* OPD */}
        <SectionCard>
            <SectionTitle title="OPD — Outpatient" subtitle="₹22,400 total" />
            {OPD_DOCTORS.map((d, i) => (
                <View key={i} style={[styles.listRow, i < OPD_DOCTORS.length - 1 && styles.listBorder]}>
                    <View style={[styles.listIcon, { backgroundColor: '#EFF6FF' }]}>
                        <Icon type={Icons.Ionicons} name="person-outline" size={ms(16)} color="#3B82F6" />
                    </View>
                    <View style={styles.listInfo}>
                        <Text style={styles.listName}>{d.name}</Text>
                        <Text style={styles.listSub}>{d.specialty} • {d.visits} visits</Text>
                    </View>
                    <Text style={styles.listAmount}>{d.amount}</Text>
                </View>
            ))}
        </SectionCard>

        {/* IPD */}
        <SectionCard>
            <SectionTitle title="IPD — Inpatient" subtitle="₹18,500 total" />
            <View style={styles.ipdCard}>
                <View style={styles.ipdRow}>
                    <Text style={styles.ipdLabel}>Apollo Hospitals</Text>
                    <Text style={styles.ipdDate}>14–18 Jul 2025</Text>
                </View>
                {[
                    { item: 'Room Charges (4 nights)', amt: '₹8,000' },
                    { item: 'Surgeon Fees', amt: '₹4,500' },
                    { item: 'Anaesthesia', amt: '₹2,200' },
                    { item: 'Medicines & Consumables', amt: '₹2,400' },
                    { item: 'Lab Tests (in-house)', amt: '₹1,400' },
                ].map((r, i) => (
                    <View key={i} style={styles.ipdItem}>
                        <Text style={styles.ipdItemLabel}>{r.item}</Text>
                        <Text style={styles.ipdItemAmt}>{r.amt}</Text>
                    </View>
                ))}
                <View style={styles.ipdTotal}>
                    <Text style={styles.ipdTotalLabel}>Total</Text>
                    <Text style={styles.ipdTotalAmt}>₹18,500</Text>
                </View>
            </View>
        </SectionCard>

        {/* Lab */}
        <SectionCard>
            <SectionTitle title="Lab & Diagnostics" subtitle="₹14,900 total" />
            {LAB_PROVIDERS.map((p, i) => (
                <View key={i} style={[styles.listRow, i < LAB_PROVIDERS.length - 1 && styles.listBorder]}>
                    <View style={[styles.listIcon, { backgroundColor: '#ECFEFF' }]}>
                        <Icon type={Icons.Ionicons} name="flask-outline" size={ms(16)} color="#06B6D4" />
                    </View>
                    <View style={styles.listInfo}>
                        <Text style={styles.listName}>{p.name}</Text>
                        <Text style={styles.listSub}>{p.tests} tests</Text>
                    </View>
                    <Text style={styles.listAmount}>{p.amount}</Text>
                </View>
            ))}
        </SectionCard>

        {/* Pharmacy */}
        <SectionCard>
            <SectionTitle title="Pharmacy" subtitle="₹55,410 total • Generic savings possible" />
            <View style={styles.pharmHeader}>
                <Text style={[styles.pharmCol, { flex: 2 }]}>Drug</Text>
                <Text style={styles.pharmCol}>Branded</Text>
                <Text style={styles.pharmCol}>Generic</Text>
                <Text style={[styles.pharmCol, { color: '#16A34A' }]}>Save</Text>
            </View>
            {PHARMACY_DRUGS.map((d, i) => (
                <View key={i} style={[styles.pharmRow, i < PHARMACY_DRUGS.length - 1 && styles.listBorder]}>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.pharmName}>{d.name}</Text>
                        <Text style={styles.pharmCat}>{d.category}</Text>
                    </View>
                    <Text style={styles.pharmAmt}>{d.branded}</Text>
                    <Text style={[styles.pharmAmt, { color: '#16A34A' }]}>{d.generic}</Text>
                    <Text style={[styles.pharmAmt, { color: '#16A34A', fontFamily: interMedium }]}>{d.saving}</Text>
                </View>
            ))}
            <View style={styles.pharmSavingBanner}>
                <Icon type={Icons.Ionicons} name="leaf-outline" size={ms(14)} color="#16A34A" />
                <Text style={styles.pharmSavingText}>Switch to generics — save ₹730/month</Text>
            </View>
        </SectionCard>

    </ScrollView>
);

const AllBillsTab = () => {
    const [activeCat, setActiveCat] = useState('All');
    const filtered = activeCat === 'All' ? ALL_BILLS : ALL_BILLS.filter(b => b.category === activeCat);
    const total = filtered.reduce((sum, b) => {
        const n = parseFloat(b.amount.replace(/[₹,]/g, ''));
        return sum + n;
    }, 0);

    return (
        <View style={{ flex: 1 }}>
            {/* Filter Tabs */}
            <View style={styles.billTabBarWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.billTabBarInner}>
                    {BILL_CATS.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCat(cat)}
                            style={[styles.billTab, activeCat === cat ? styles.billTabActive : styles.billTabInactive]}
                            activeOpacity={0.75}
                        >
                            <Text style={[styles.billTabTxt, activeCat === cat ? styles.billTabTxtActive : styles.billTabTxtInactive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                {filtered.map(bill => (
                    <View key={bill.id} style={[styles.billCard, { borderLeftColor: bill.borderColor }]}>
                        <View style={styles.billTop}>
                            <View style={styles.billInfo}>
                                <Text style={styles.billName}>{bill.name}</Text>
                                <Text style={styles.billMeta}>{bill.category} • {bill.date}</Text>
                            </View>
                            <View>
                                <Text style={styles.billAmount}>{bill.amount}</Text>
                                <View style={[styles.billStatus, { backgroundColor: bill.statusColor + '20' }]}>
                                    <Text style={[styles.billStatusText, { color: bill.statusColor }]}>{bill.status}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Total */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total ({filtered.length} bills)</Text>
                    <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const TaxTab = () => {
    const taxMax = Math.max(...YR_80D.map(d => d.val));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>

            {/* Hero */}
            <LinearGradient
                colors={['#14532D', '#166534']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <Text style={styles.heroLabel}>Section 80D Tax Saved</Text>
                <Text style={styles.heroAmount}>₹7,500</Text>
                <View style={styles.heroRow}>
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Deduction</Text>
                        <Text style={styles.heroStatValue}>₹25,000</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Tax Slab</Text>
                        <Text style={styles.heroStatValue}>30%</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatLabel}>Limit Used</Text>
                        <Text style={styles.heroStatValue}>100%</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* 80D Meter */}
            <SectionCard>
                <SectionTitle title="80D Deduction Meter" />
                <View style={styles.meterWrap}>
                    <View style={styles.meterTrack}>
                        <View style={[styles.meterFill, { width: '100%' }]} />
                    </View>
                    <View style={styles.meterLabels}>
                        <Text style={styles.meterLabel}>₹0</Text>
                        <Text style={[styles.meterLabel, { color: primaryColor, fontFamily: interMedium }]}>₹25,000 / ₹25,000</Text>
                    </View>
                </View>
            </SectionCard>

            {/* Eligible Expenses */}
            <SectionCard>
                <SectionTitle title="Eligible Expenses" />
                {TAX_ELIGIBLE.map((t, i) => (
                    <View key={i} style={[styles.eligRow, i < TAX_ELIGIBLE.length - 1 && styles.listBorder]}>
                        <View style={styles.eligInfo}>
                            <Text style={styles.eligLabel}>{t.label}</Text>
                            {t.note && <Text style={styles.eligNote}>{t.note}</Text>}
                        </View>
                        <Text style={styles.eligAmt}>{t.amount}</Text>
                    </View>
                ))}
            </SectionCard>

            {/* Tax Savings Waterfall */}
            <SectionCard>
                <SectionTitle title="Tax Savings Breakdown" />
                {[
                    { label: 'Gross Deduction', val: '₹25,000', color: primaryColor },
                    { label: 'Tax @ 30%', val: '₹7,500', color: '#16A34A' },
                    { label: '4% Cess', val: '₹300', color: '#F59E0B' },
                    { label: 'Net Tax Saved', val: '₹7,800', color: '#1D4ED8', bold: true },
                ].map((r, i) => (
                    <View key={i} style={styles.waterfallRow}>
                        <Text style={[styles.waterfallLabel, r.bold && { fontFamily: interMedium }]}>{r.label}</Text>
                        <Text style={[styles.waterfallVal, { color: r.color }, r.bold && { fontFamily: interMedium }]}>{r.val}</Text>
                    </View>
                ))}
            </SectionCard>

            {/* Year-wise Chart */}
            <SectionCard>
                <SectionTitle title="Year-wise 80D Claim" />
                {YR_80D.map((d, i) => (
                    <View key={i} style={styles.yoyRow}>
                        <Text style={styles.yoyLabel}>{d.yr}</Text>
                        <View style={styles.yoyTrack}>
                            <View style={[styles.yoyFill, { width: `${Math.round((d.val / taxMax) * 100)}%`, backgroundColor: i === 2 ? primaryColor : '#A7D5CE' }]} />
                        </View>
                        <Text style={styles.yoyAmt}>₹{(d.val / 1000).toFixed(0)}K</Text>
                    </View>
                ))}
            </SectionCard>

            {/* ITR Checklist */}
            <SectionCard>
                <SectionTitle title="ITR Filing Checklist" />
                {ITR_CHECKLIST.map((c, i) => (
                    <View key={i} style={[styles.checkRow, i < ITR_CHECKLIST.length - 1 && styles.listBorder]}>
                        <View style={[styles.checkIcon, { backgroundColor: c.done ? '#DCFCE7' : '#F3F4F6' }]}>
                            <Icon
                                type={Icons.Ionicons}
                                name={c.done ? 'checkmark' : 'close'}
                                size={ms(12)}
                                color={c.done ? '#16A34A' : '#9CA3AF'}
                            />
                        </View>
                        <Text style={[styles.checkLabel, !c.done && { color: '#9CA3AF' }]}>{c.label}</Text>
                    </View>
                ))}
            </SectionCard>

            {/* Tax Insights */}
            <SectionCard>
                <SectionTitle title="Tax Insights" />
                {TAX_INSIGHTS.map((ins, i) => (
                    <InsightCard key={i} {...ins} />
                ))}
            </SectionCard>
        </ScrollView>
    );
};

const InsuranceTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>

        {/* Hero */}
        <LinearGradient
            colors={['#1E3A5F', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
        >
            <Text style={styles.heroLabel}>Total Coverage</Text>
            <Text style={styles.heroAmount}>₹5,00,000</Text>
            <View style={styles.heroRow}>
                <View style={styles.heroStat}>
                    <Text style={styles.heroStatLabel}>Insurer</Text>
                    <Text style={styles.heroStatValue}>HDFC ERGO</Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStat}>
                    <Text style={styles.heroStatLabel}>Premium</Text>
                    <Text style={styles.heroStatValue}>₹28,400/yr</Text>
                </View>
                <View style={styles.heroDivider} />
                <View style={styles.heroStat}>
                    <Text style={styles.heroStatLabel}>Claims</Text>
                    <Text style={styles.heroStatValue}>2 filed</Text>
                </View>
            </View>
        </LinearGradient>

        {/* Coverage Map */}
        <SectionCard>
            <SectionTitle title="Coverage Utilization" />
            <View style={styles.meterWrap}>
                <View style={styles.meterTrack}>
                    <View style={[styles.meterFill, { width: '4.4%', backgroundColor: '#3B82F6' }]} />
                </View>
                <View style={styles.meterLabels}>
                    <Text style={styles.meterLabel}>Claimed: ₹22,300</Text>
                    <Text style={styles.meterLabel}>Cover: ₹5,00,000</Text>
                </View>
            </View>
            <View style={styles.coverRow}>
                {[
                    { label: 'Claimed', val: '₹22,300', color: '#3B82F6' },
                    { label: 'Available', val: '₹4,77,700', color: '#16A34A' },
                    { label: 'Premium Paid', val: '₹28,400', color: '#F59E0B' },
                ].map((c, i) => (
                    <View key={i} style={styles.coverCard}>
                        <View style={[styles.dot, { backgroundColor: c.color, alignSelf: 'center', marginBottom: vs(4) }]} />
                        <Text style={[styles.coverVal, { color: c.color }]}>{c.val}</Text>
                        <Text style={styles.coverLabel}>{c.label}</Text>
                    </View>
                ))}
            </View>
        </SectionCard>

        {/* Claims Register */}
        <SectionCard>
            <SectionTitle title="Claims Register" />
            {CLAIMS.map((claim, i) => (
                <View key={i} style={[styles.claimCard, i < CLAIMS.length - 1 && { marginBottom: vs(12) }]}>
                    <View style={styles.claimTop}>
                        <View>
                            <Text style={styles.claimId}>{claim.id}</Text>
                            <Text style={styles.claimType}>{claim.type} • {claim.date}</Text>
                        </View>
                        <View>
                            <Text style={styles.claimAmt}>{claim.amount}</Text>
                            <View style={[styles.claimStatus, { backgroundColor: claim.statusBg }]}>
                                <Text style={[styles.claimStatusText, { color: claim.statusColor }]}>{claim.status}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </SectionCard>

        {/* Active Claim Timeline */}
        <SectionCard>
            <SectionTitle title="Active Claim Timeline" subtitle="SH/CL/2025/00192" />
            {TIMELINE_STEPS.map((step, i) => (
                <View key={i} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                        <View style={[styles.timelineDot, { backgroundColor: step.done ? primaryColor : '#E5E7EB' }]}>
                            {step.done && <Icon type={Icons.Ionicons} name="checkmark" size={ms(10)} color={whiteColor} />}
                        </View>
                        {i < TIMELINE_STEPS.length - 1 && (
                            <View style={[styles.timelineLine, { backgroundColor: step.done ? primaryColor : '#E5E7EB' }]} />
                        )}
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={[styles.timelineLabel, step.done && { color: blackColor }]}>{step.label}</Text>
                        <Text style={styles.timelineDate}>{step.date}</Text>
                    </View>
                </View>
            ))}
        </SectionCard>

        {/* Policy Optimisation */}
        <SectionCard>
            <SectionTitle title="Policy Optimisation" />
            {[
                { icon: 'shield-outline', color: '#3B82F6', bg: '#EFF6FF', text: 'Add top-up cover of ₹10L for only ₹6,000/yr — highly recommended.' },
                { icon: 'people-outline', color: '#8B5CF6', bg: '#F5F3FF', text: 'Add parents to floater — saves ₹4,200 vs separate policy.' },
                { icon: 'star-outline', color: '#F59E0B', bg: '#FFFBEB', text: 'No-claim bonus of ₹25,000 applicable if no claims this year.' },
            ].map((ins, i) => (
                <InsightCard key={i} {...ins} />
            ))}
        </SectionCard>
    </ScrollView>
);

const SavingsTab = () => {
    const projMax = Math.max(...PROJECTION_BARS.map(b => b.base));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>

            {/* KPI Cards */}
            <View style={styles.savingsKpiGrid}>
                {SAVINGS_KPIS.map((k, i) => (
                    <View key={i} style={[styles.savingsKpiCard, { backgroundColor: k.bg }]}>
                        <View style={[styles.kpiIcon, { backgroundColor: k.color + '30', marginBottom: vs(6) }]}>
                            <Icon type={Icons.Ionicons} name={k.icon} size={ms(18)} color={k.color} />
                        </View>
                        <Text style={[styles.savingsKpiVal, { color: k.color }]}>{k.value}</Text>
                        <Text style={styles.savingsKpiLabel}>{k.label}</Text>
                    </View>
                ))}
            </View>

            {/* 3-Year Projection */}
            <SectionCard>
                <SectionTitle title="3-Year Projection" subtitle="Base vs Optimized vs Generic" />
                <View style={styles.legendRow}>
                    {[
                        { label: 'Base Trend', color: '#94A3B8' },
                        { label: 'Optimized', color: primaryColor },
                        { label: 'Generic Switch', color: '#10B981' },
                    ].map((l, i) => (
                        <View key={i} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                            <Text style={styles.legendLabel}>{l.label}</Text>
                        </View>
                    ))}
                </View>
                {PROJECTION_BARS.map((b, i) => (
                    <View key={i} style={styles.projRow}>
                        <Text style={styles.projLabel}>{b.label}</Text>
                        <View style={styles.projBars}>
                            {[
                                { val: b.base, color: '#94A3B8' },
                                { val: b.optimized, color: primaryColor },
                                { val: b.generic, color: '#10B981' },
                            ].map((bar, j) => (
                                <View key={j} style={styles.projBarWrap}>
                                    <View style={styles.projTrack}>
                                        <View style={[styles.projFill, { width: `${Math.round((bar.val / projMax) * 100)}%`, backgroundColor: bar.color }]} />
                                    </View>
                                    <Text style={styles.projAmt}>₹{(bar.val / 1000).toFixed(0)}K</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </SectionCard>

            {/* Insurance Scenario */}
            <SectionCard>
                <SectionTitle title="Insurance Scenario Modelling" />
                {[
                    { scenario: 'Current Plan', cover: '₹5L', premium: '₹28,400', netExposure: '₹1,65,000' },
                    { scenario: '+ ₹10L Top-up', cover: '₹15L', premium: '₹34,400', netExposure: '₹85,000' },
                    { scenario: 'Family Floater ₹20L', cover: '₹20L', premium: '₹42,000', netExposure: '₹45,000' },
                ].map((s, i) => (
                    <View key={i} style={[styles.scenarioCard, i === 1 && styles.scenarioActive]}>
                        <Text style={[styles.scenarioTitle, i === 1 && { color: primaryColor }]}>{s.scenario}</Text>
                        <View style={styles.scenarioRow}>
                            <View style={styles.scenarioItem}>
                                <Text style={styles.scenarioLabel}>Cover</Text>
                                <Text style={styles.scenarioVal}>{s.cover}</Text>
                            </View>
                            <View style={styles.scenarioItem}>
                                <Text style={styles.scenarioLabel}>Premium</Text>
                                <Text style={styles.scenarioVal}>{s.premium}</Text>
                            </View>
                            <View style={styles.scenarioItem}>
                                <Text style={styles.scenarioLabel}>Net Exposure</Text>
                                <Text style={[styles.scenarioVal, { color: '#16A34A' }]}>{s.netExposure}</Text>
                            </View>
                        </View>
                        {i === 1 && (
                            <View style={styles.recommendedBadge}>
                                <Text style={styles.recommendedText}>Recommended</Text>
                            </View>
                        )}
                    </View>
                ))}
            </SectionCard>

            {/* Pharmacy Step-down */}
            <SectionCard>
                <SectionTitle title="Pharmacy Savings Plan" subtitle="Switch to generics progressively" />
                {[
                    { phase: 'Month 1-3', action: 'Switch Telmisartan to generic', saving: '₹855' },
                    { phase: 'Month 4-6', action: 'Switch Atorvastatin to generic', saving: '₹930' },
                    { phase: 'Month 7+', action: 'Full generic protocol', saving: '₹8,760/yr' },
                ].map((p, i) => (
                    <View key={i} style={[styles.stepRow, i < 2 && styles.listBorder]}>
                        <View style={[styles.stepBadge, { backgroundColor: primaryColor + '20' }]}>
                            <Text style={[styles.stepPhase, { color: primaryColor }]}>{p.phase}</Text>
                        </View>
                        <View style={styles.stepInfo}>
                            <Text style={styles.stepAction}>{p.action}</Text>
                        </View>
                        <Text style={styles.stepSaving}>{p.saving}</Text>
                    </View>
                ))}
            </SectionCard>

        </ScrollView>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const MedicalBillsAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState(0);

    const renderTab = () => {
        switch (activeTab) {
            case 0: return <SpendOverviewTab />;
            case 1: return <ByCategoryTab />;
            case 2: return <AllBillsTab />;
            case 3: return <TaxTab />;
            case 4: return <InsuranceTab />;
            case 5: return <SavingsTab />;
            default: return <SpendOverviewTab />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradientBg}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bills Analytics</Text>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBarWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                        {TABS.map((tab, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setActiveTab(i)}
                                style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
                                {activeTab === i && <View style={styles.tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {renderTab()}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backBtn: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: {
        fontFamily: heading,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
        flex: 1,
    },

    // Tab Bar
    tabBarWrap: {
        backgroundColor: whiteColor,
        marginHorizontal: ms(20),
        borderRadius: ms(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        marginBottom: vs(12),
    },
    tabBar: {
        paddingHorizontal: ms(4),
    },
    tabItem: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        alignItems: 'center',
        position: 'relative',
    },
    tabItemActive: {
        backgroundColor: primaryColor,
        borderRadius: ms(10),
        margin: ms(4),
    },
    tabText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    tabTextActive: {
        fontFamily: interMedium,
        color: whiteColor,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: ms(14),
        right: ms(14),
        height: vs(2),
        backgroundColor: primaryColor,
        borderRadius: ms(2),
    },

    // Content
    content: {
        flex: 1,
    },
    tabScroll: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
        paddingTop: vs(4),
    },

    // Section Card
    sectionCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    secTitleWrap: {
        marginBottom: vs(12),
    },
    secTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
    },
    secSubtitle: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Hero Card
    heroCard: {
        borderRadius: ms(16),
        padding: ms(20),
        marginBottom: vs(12),
    },
    heroLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: 'rgba(255,255,255,0.75)',
        marginBottom: vs(4),
    },
    heroAmount: {
        fontFamily: heading,
        fontSize: ms(30),
        color: whiteColor,
        marginBottom: vs(16),
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroStat: {
        flex: 1,
        alignItems: 'center',
    },
    heroStatLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: 'rgba(255,255,255,0.7)',
    },
    heroStatValue: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: whiteColor,
        marginTop: vs(2),
    },
    heroDivider: {
        width: 1,
        height: ms(28),
        backgroundColor: 'rgba(255,255,255,0.25)',
    },

    // KPI Grid
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
    },
    kpiCard: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: vs(10),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
    },
    kpiIcon: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    kpiValue: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
    },
    kpiLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Bar Chart
    barChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: vs(100),
        paddingBottom: vs(4),
    },
    barItem: {
        alignItems: 'center',
        marginRight: ms(6),
        width: ms(28),
    },
    barTrack: {
        width: ms(18),
        height: vs(80),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(4),
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        borderRadius: ms(4),
    },
    barLabel: {
        fontFamily: interRegular,
        fontSize: ms(8),
        color: '#9CA3AF',
        marginTop: vs(4),
    },

    // Composition Bars
    compRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    compLabel: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        width: ms(70),
    },
    compTrack: {
        flex: 1,
        height: vs(8),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(4),
        overflow: 'hidden',
        marginHorizontal: ms(8),
    },
    compFill: {
        height: '100%',
        borderRadius: ms(4),
    },
    compPct: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: blackColor,
        width: ms(35),
        textAlign: 'right',
    },
    dot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        marginRight: ms(6),
    },

    // YoY
    yoyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    yoyLabel: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        width: ms(65),
    },
    yoyTrack: {
        flex: 1,
        height: vs(10),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(5),
        overflow: 'hidden',
        marginHorizontal: ms(8),
    },
    yoyFill: {
        height: '100%',
        borderRadius: ms(5),
    },
    yoyAmt: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: blackColor,
        width: ms(36),
        textAlign: 'right',
    },
    yoyChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(6),
        gap: ms(4),
    },
    yoyChangeText: {
        fontFamily: interMedium,
        fontSize: ms(11),
    },

    // Insight Cards
    insightCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: ms(12),
        borderRadius: ms(10),
        marginBottom: vs(8),
        gap: ms(10),
    },
    insightText: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: blackColor,
        flex: 1,
        lineHeight: ms(18),
    },

    // List Rows
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    listBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    listIcon: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    listInfo: {
        flex: 1,
    },
    listName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    listSub: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },
    listAmount: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },

    // IPD Card
    ipdCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        padding: ms(12),
    },
    ipdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    ipdLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    ipdDate: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
    },
    ipdItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(4),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    ipdItemLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    ipdItemAmt: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
    },
    ipdTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: vs(8),
        marginTop: vs(4),
        borderTopWidth: 2,
        borderTopColor: primaryColor,
    },
    ipdTotalLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    ipdTotalAmt: {
        fontFamily: heading,
        fontSize: ms(14),
        color: primaryColor,
    },

    // Pharmacy
    pharmHeader: {
        flexDirection: 'row',
        paddingBottom: vs(8),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: vs(4),
    },
    pharmCol: {
        fontFamily: interMedium,
        fontSize: ms(10),
        color: '#6B7280',
        flex: 1,
        textAlign: 'center',
    },
    pharmRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(8),
    },
    pharmName: {
        fontFamily: interMedium,
        fontSize: ms(11),
        color: blackColor,
    },
    pharmCat: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },
    pharmAmt: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: blackColor,
        flex: 1,
        textAlign: 'center',
    },
    pharmSavingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        borderRadius: ms(8),
        padding: ms(10),
        marginTop: vs(8),
        gap: ms(6),
    },
    pharmSavingText: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: '#16A34A',
    },

    // Bill Filter Tabs (DiseaseIntelligence style)
    billTabBarWrap: {
        backgroundColor: whiteColor,
        paddingVertical: vs(9),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        elevation: 3,
        shadowColor: blackColor,
        shadowOpacity: 0.07,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    billTabBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        gap: ms(6),
    },
    billTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(11),
        paddingVertical: vs(7),
        borderRadius: ms(20),
    },
    billTabInactive: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    billTabActive: {
        backgroundColor: primaryColor,
        elevation: 3,
        shadowColor: primaryColor,
        shadowOpacity: 0.35,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    billTabTxt: {
        fontFamily: interMedium,
        fontSize: ms(11),
    },
    billTabTxtInactive: {
        color: '#6B7280',
    },
    billTabTxtActive: {
        color: whiteColor,
    },

    // Bill Cards
    billCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(10),
        borderLeftWidth: ms(4),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    billTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    billInfo: {
        flex: 1,
    },
    billName: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },
    billMeta: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },
    billAmount: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        textAlign: 'right',
    },
    billStatus: {
        borderRadius: ms(6),
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        marginTop: vs(4),
        alignSelf: 'flex-end',
    },
    billStatusText: {
        fontFamily: interMedium,
        fontSize: ms(10),
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(14),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    totalLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: '#6B7280',
    },
    totalValue: {
        fontFamily: heading,
        fontSize: ms(16),
        color: primaryColor,
    },

    // Meter
    meterWrap: {
        marginBottom: vs(8),
    },
    meterTrack: {
        height: vs(10),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(5),
        overflow: 'hidden',
    },
    meterFill: {
        height: '100%',
        backgroundColor: primaryColor,
        borderRadius: ms(5),
    },
    meterLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(4),
    },
    meterLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },

    // Eligible rows
    eligRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    eligInfo: { flex: 1 },
    eligLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: blackColor,
    },
    eligNote: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#16A34A',
        marginTop: vs(2),
    },
    eligAmt: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
    },

    // Waterfall
    waterfallRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vs(6),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    waterfallLabel: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    waterfallVal: {
        fontFamily: interRegular,
        fontSize: ms(12),
    },

    // Checklist
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    checkIcon: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    checkLabel: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Coverage
    coverRow: {
        flexDirection: 'row',
        marginTop: vs(12),
        gap: ms(8),
    },
    coverCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        padding: ms(10),
        alignItems: 'center',
    },
    coverVal: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
    },
    coverLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
        marginTop: vs(2),
        textAlign: 'center',
    },

    // Claims
    claimCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        padding: ms(12),
    },
    claimTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    claimId: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
    },
    claimType: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },
    claimAmt: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        textAlign: 'right',
    },
    claimStatus: {
        borderRadius: ms(6),
        paddingHorizontal: ms(8),
        paddingVertical: vs(2),
        marginTop: vs(4),
        alignSelf: 'flex-end',
    },
    claimStatusText: {
        fontFamily: interMedium,
        fontSize: ms(10),
    },

    // Timeline
    timelineRow: {
        flexDirection: 'row',
        marginBottom: vs(4),
    },
    timelineLeft: {
        width: ms(24),
        alignItems: 'center',
    },
    timelineDot: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        minHeight: vs(20),
        marginTop: vs(2),
    },
    timelineContent: {
        flex: 1,
        paddingLeft: ms(10),
        paddingBottom: vs(16),
    },
    timelineLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: '#9CA3AF',
    },
    timelineDate: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },

    // Savings KPI
    savingsKpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
        marginBottom: vs(12),
    },
    savingsKpiCard: {
        width: '47.5%',
        borderRadius: ms(14),
        padding: ms(14),
        alignItems: 'flex-start',
    },
    savingsKpiVal: {
        fontFamily: heading,
        fontSize: ms(18),
        marginBottom: vs(2),
    },
    savingsKpiLabel: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#6B7280',
    },

    // Legend
    legendRow: {
        flexDirection: 'row',
        gap: ms(16),
        marginBottom: vs(12),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
    },
    legendDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    legendLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },

    // Projection
    projRow: {
        marginBottom: vs(12),
    },
    projLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
        marginBottom: vs(4),
    },
    projBars: {
        gap: vs(3),
    },
    projBarWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    projTrack: {
        flex: 1,
        height: vs(8),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(4),
        overflow: 'hidden',
        marginRight: ms(8),
    },
    projFill: {
        height: '100%',
        borderRadius: ms(4),
    },
    projAmt: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
        width: ms(30),
        textAlign: 'right',
    },

    // Scenario
    scenarioCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(14),
        marginBottom: vs(8),
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    scenarioActive: {
        borderColor: primaryColor,
        backgroundColor: '#F0FDF4',
    },
    scenarioTitle: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(8),
    },
    scenarioRow: {
        flexDirection: 'row',
    },
    scenarioItem: {
        flex: 1,
    },
    scenarioLabel: {
        fontFamily: interRegular,
        fontSize: ms(10),
        color: '#6B7280',
    },
    scenarioVal: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: blackColor,
        marginTop: vs(2),
    },
    recommendedBadge: {
        backgroundColor: primaryColor,
        borderRadius: ms(6),
        paddingHorizontal: ms(8),
        paddingVertical: vs(3),
        alignSelf: 'flex-start',
        marginTop: vs(8),
    },
    recommendedText: {
        fontFamily: interMedium,
        fontSize: ms(10),
        color: whiteColor,
    },

    // Pharmacy Step-down
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        gap: ms(10),
    },
    stepBadge: {
        borderRadius: ms(6),
        paddingHorizontal: ms(8),
        paddingVertical: vs(4),
    },
    stepPhase: {
        fontFamily: interMedium,
        fontSize: ms(9),
    },
    stepInfo: {
        flex: 1,
    },
    stepAction: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: blackColor,
    },
    stepSaving: {
        fontFamily: interMedium,
        fontSize: ms(12),
        color: '#16A34A',
    },
});

export default MedicalBillsAnalyticsScreen;
