import React, { useRef, useState, useCallback } from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Polygon, Polyline, Line, Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, primaryColor, whiteColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const SECTION_KEYS = ['keySignals', 'topDrivers', 'attention', 'action', 'momentum', 'medication', 'bpTrend'];

/* ── Reusable newspaper section header ── */
const SecHeader = ({ number, title, deck }) => (
    <View style={s.secHeader}>
        <View style={s.secHeaderRuleRow}>
            <View style={s.secHeaderRuleThick} />
            <View style={s.secHeaderRuleThin} />
        </View>
        <View style={s.secHeaderTitleRow}>
            <Text style={s.secHeaderNum}>{number}</Text>
            <View style={s.secHeaderDivider} />
            <Text style={s.secHeaderTitle}>{title}</Text>
        </View>
        {deck ? <Text style={s.secHeaderDeck}>{deck}</Text> : null}
    </View>
);

const HealthChronicleScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const targetSection = route.params?.section || null;

    const scrollRef = useRef(null);
    const sectionYRef = useRef({});
    const measuredCount = useRef(0);
    const didScroll = useRef(false);

    const [actionDone, setActionDone] = useState(false);

    const onSectionLayout = useCallback((key, event) => {
        sectionYRef.current[key] = event.nativeEvent.layout.y;
        measuredCount.current += 1;
        if (!didScroll.current && targetSection && measuredCount.current >= SECTION_KEYS.length) {
            didScroll.current = true;
            const y = sectionYRef.current[targetSection];
            if (y !== undefined) {
                setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 150);
            }
        }
    }, [targetSection]);

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
                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={s.headerTextWrap}>
                        <Text style={s.headerTitle}>My Health Chronicle</Text>
                        <Text style={s.headerSub}>Your complete daily health report</Text>
                    </View>
                </View>

                <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
                <View style={s.card}>

                    {/* ── Masthead ── */}
                    <View style={s.mastheadRule} />
                    <View style={s.mastheadRow}>
                        <Text style={s.mastheadTitle}>MY HEALTH CHRONICLE</Text>
                        <Text style={s.edition}>MON, MAR 16, 2026</Text>
                    </View>
                    <View style={s.mastheadThick} />
                    <View style={s.mastheadThin} />

                    {/* Greeting */}
                    {(() => {
                        const h = new Date().getHours();
                        const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
                        const name = (global.customer_name || '').split(' ')[0];
                        return (
                            <View style={s.greetRow}>
                                <Text style={s.greetText}>{greeting}{name ? `, ${name}` : ''}</Text>
                                <Text style={s.greetEmoji}>{h < 12 ? '🌤' : h < 17 ? '☀️' : '🌙'}</Text>
                            </View>
                        );
                    })()}

                    <Text style={s.headline}>Your actions from yesterday and{'\n'}how they support your health progress</Text>
                    <Text style={s.deck}>A full breakdown of today's signals, drivers, actions and health momentum</Text>

                    {/* ① KEY SIGNALS */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('keySignals', e)}>
                        <SecHeader
                            number="01"
                            title="KEY SIGNALS"
                            deck="Health indicators tracked today across your vitals and activity"
                        />

                        {/* Status summary */}
                        <View style={s.statusSummary}>
                            {[
                                { label: 'Good', count: 3, color: primaryColor },
                                { label: 'Warning', count: 0, color: '#F59E0B' },
                                { label: 'Critical', count: 0, color: '#EF4444' },
                            ].map((st, i) => (
                                <View key={i} style={s.statusItem}>
                                    <Text style={[s.statusCount, { color: st.color }]}>{st.count}</Text>
                                    <Text style={s.statusLabel}>{st.label}</Text>
                                </View>
                            ))}
                        </View>

                        {[
                            {
                                accent: primaryColor, iconBg: primaryColor + '18', icon: 'heart',
                                name: 'Heart Health Supported', status: 'Good', statusColor: primaryColor,
                                desc: "Yesterday's activity improved cardiovascular stability.",
                                detail: 'Resting HR 68 bpm · HRV 42 ms · 5 active days this week. Regular walking has contributed to improved heart rate variability.',
                                metrics: [{ l: 'Resting HR', v: '68 bpm' }, { l: 'HRV', v: '42 ms' }, { l: 'Active Days', v: '5 / 7' }],
                            },
                            {
                                accent: '#1A5A8A', iconBg: '#E6F0FA', icon: 'water',
                                name: 'Blood Sugar Stable', status: 'Stable', statusColor: '#1A5A8A',
                                desc: 'Meals and medication helped maintain balance.',
                                detail: 'Fasting glucose 98 mg/dL · Post-meal 132 mg/dL · HbA1c 5.8%. Consistent meal timing is the key contributor.',
                                metrics: [{ l: 'Fasting', v: '98 mg/dL' }, { l: 'Post-meal', v: '132 mg/dL' }, { l: 'HbA1c', v: '5.8%' }],
                            },
                            {
                                accent: '#5A3F9E', iconBg: '#EDE8FB', icon: 'moon',
                                name: 'Recovery Good', status: 'Good', statusColor: '#5A3F9E',
                                desc: 'Sleep duration supported overnight recovery.',
                                detail: '7h 12m sleep · 1h 48m deep sleep · Recovery score 82/100. Above average for your age group.',
                                metrics: [{ l: 'Sleep', v: '7h 12m' }, { l: 'Deep Sleep', v: '1h 48m' }, { l: 'Recovery', v: '82/100' }],
                            },
                        ].map((item, i) => (
                            <View key={i} style={s.signalCard}>
                                <View style={[s.signalAccentBar, { backgroundColor: item.accent }]} />
                                <View style={s.signalCardInner}>
                                    <View style={s.signalCardTop}>
                                        <View style={[s.signalIco, { backgroundColor: item.iconBg }]}>
                                            <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color={item.accent} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={s.signalName}>{item.name}</Text>
                                            <Text style={s.signalDesc}>{item.desc}</Text>
                                        </View>
                                        <View style={[s.statusBadge, { backgroundColor: item.iconBg }]}>
                                            <Text style={[s.statusBadgeText, { color: item.statusColor }]}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <View style={s.metricsRow}>
                                        {item.metrics.map((m, mi) => (
                                            <View key={mi} style={s.metricChip}>
                                                <Text style={[s.metricVal, { color: item.accent }]}>{m.v}</Text>
                                                <Text style={s.metricLbl}>{m.l}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <Text style={s.signalDetail}>{item.detail}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* ② TOP DRIVERS TODAY */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('topDrivers', e)}>
                        <SecHeader
                            number="02"
                            title="TOP DRIVERS TODAY"
                            deck="The three behaviours with the highest impact on your health score"
                        />

                        <View style={s.scoreImpactBanner}>
                            <Icon type={Icons.Ionicons} name="trending-up" size={ms(16)} color={primaryColor} />
                            <Text style={s.scoreImpactText}>Your actions added <Text style={s.scoreImpactBold}>+12 pts</Text> to your health score today</Text>
                        </View>

                        {[
                            { icon: 'walk', iconColor: primaryColor, iconBg: primaryColor + '18', name: 'Walking', pill: '28 min', progress: 0.65, goal: '45 min / day', impact: 'High', detail: 'Brisk walking improves circulation, reduces blood pressure and supports glucose metabolism.' },
                            { icon: 'medical', iconColor: '#1A5A8A', iconBg: '#E6F0FA', name: 'Medication Taken', pill: 'On time', progress: 1.0, goal: '1× daily', impact: 'High', detail: 'On-time medication maximises therapeutic benefit and prevents disease progression.' },
                            { icon: 'moon', iconColor: '#5A3F9E', iconBg: '#EDE8FB', name: 'Sleep Duration', pill: '7h 12m', progress: 0.86, goal: '8h / night', impact: 'Medium', detail: 'Adequate sleep supports hormone regulation, immune function and metabolic repair.' },
                        ].map((item, i, arr) => (
                            <View key={i} style={[s.driverCard, i < arr.length - 1 && s.driverCardBorder]}>
                                <View style={[s.driverIco, { backgroundColor: item.iconBg }]}>
                                    <Icon type={Icons.Ionicons} name={item.icon} size={ms(16)} color={item.iconColor} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={s.driverTopRow}>
                                        <Text style={s.driverName}>{item.name}</Text>
                                        <View style={[s.driverPill, { backgroundColor: item.iconBg }]}>
                                            <Text style={[s.driverPillText, { color: item.iconColor }]}>{item.pill}</Text>
                                        </View>
                                    </View>
                                    <View style={s.progressRow}>
                                        <View style={s.progressTrack}>
                                            <View style={[s.progressFill, { width: `${item.progress * 100}%`, backgroundColor: item.iconColor }]} />
                                        </View>
                                        <Text style={s.progressGoal}>{item.goal}</Text>
                                    </View>
                                    <Text style={s.driverDetail}>{item.detail}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* ③ ATTENTION AREA */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('attention', e)}>
                        <SecHeader
                            number="03"
                            title="ATTENTION AREA"
                            deck="One thing that needs your focus today"
                        />

                        <View style={s.attnCard}>
                            <View style={s.attnCardTop}>
                                <View style={s.attnIco}>
                                    <Icon type={Icons.Ionicons} name="warning" size={ms(18)} color="#A05C0A" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.attnTitle}>Hydration Slightly Low</Text>
                                    <Text style={s.attnSeverity}>Moderate concern</Text>
                                </View>
                            </View>
                            <Text style={s.attnDesc}>Increasing water intake may improve energy levels and kidney function. Dehydration can mask fatigue and affect blood pressure readings.</Text>
                            <View style={s.thinRuleAmber} />
                            <Text style={s.attnWhyTitle}>WHY IT MATTERS</Text>
                            <Text style={s.attnWhy}>Low hydration is linked to elevated blood viscosity, which increases the heart's workload. Given your BP trend, maintaining hydration is especially important.</Text>
                            <View style={s.attnTip}>
                                <Icon type={Icons.Ionicons} name="bulb-outline" size={ms(13)} color="#A05C0A" />
                                <Text style={s.attnTipText}>Tip: Carry a 500ml bottle and refill it twice before evening.</Text>
                            </View>
                        </View>
                    </View>

                    {/* ④ TODAY'S ACTION */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('action', e)}>
                        <SecHeader
                            number="04"
                            title="TODAY'S ACTION"
                            deck="One recommended step to take right now"
                        />

                        <View style={s.actionBox}>
                            <Text style={s.actionEye}>RECOMMENDED  ·  HIGH IMPACT</Text>
                            <Text style={s.actionText}>
                                "Drink two more glasses of water today to improve your hydration balance."
                            </Text>
                            <View style={s.actionMeta}>
                                <View style={s.actionMetaItem}>
                                    <Icon type={Icons.Ionicons} name="time-outline" size={ms(12)} color="rgba(255,255,255,0.5)" />
                                    <Text style={s.actionMetaText}>Takes 2 minutes</Text>
                                </View>
                                <View style={s.actionMetaItem}>
                                    <Icon type={Icons.Ionicons} name="flash-outline" size={ms(12)} color="rgba(255,255,255,0.5)" />
                                    <Text style={s.actionMetaText}>Immediate benefit</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[s.actionBtn, actionDone && s.actionBtnDone]}
                                activeOpacity={0.8}
                                onPress={() => setActionDone(true)}
                            >
                                <Text style={s.actionBtnText}>{actionDone ? '✓  Done' : 'Mark as done'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ⑤ HEALTH MOMENTUM */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('momentum', e)}>
                        <SecHeader
                            number="05"
                            title="HEALTH MOMENTUM"
                            deck="How your score has moved across the week"
                        />

                        <View style={s.momentumScoreBanner}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.momentumScoreLabel}>TODAY'S SCORE</Text>
                                <Text style={s.momentumScoreVal}>81</Text>
                                <Text style={s.momentumScoreSub}>Up from 52 on Monday — best this week</Text>
                            </View>
                            <View style={s.momentumBadge}>
                                <Icon type={Icons.Ionicons} name="trending-up" size={ms(14)} color={primaryColor} />
                                <Text style={s.momentumBadgeText}> +29 pts</Text>
                            </View>
                        </View>

                        <View style={s.sparkWrap}>
                            {[
                                { v: 52, l: 'Mon' }, { v: 61, l: 'Tue' }, { v: 58, l: 'Wed' },
                                { v: 67, l: 'Thu' }, { v: 72, l: 'Fri' }, { v: 75, l: 'Sat' }, { v: 81, l: 'Sun' },
                            ].map((item, i) => (
                                <View key={i} style={s.sparkCol}>
                                    <Text style={[s.sparkScore, i === 6 && { color: primaryColor, fontWeight: '800' }]}>{item.v}</Text>
                                    <View style={s.sparkBarWrap}>
                                        <View style={[s.sparkBar, {
                                            height: Math.round((item.v / 81) * ms(40)),
                                            backgroundColor: i === 6 ? primaryColor : primaryColor + '30',
                                        }]} />
                                    </View>
                                    <Text style={[s.sparkLabel, i === 6 && { color: primaryColor }]}>{item.l}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={s.momentumInsight}>Your consistency this week is improving metabolic stability. Maintaining current habits for 2 more days will set a strong baseline for next week.</Text>
                    </View>

                    {/* ⑥ MEDICATION STREAK */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('medication', e)}>
                        <SecHeader
                            number="06"
                            title="MEDICATION STREAK"
                            deck="Consistency tracking for your prescribed medication schedule"
                        />

                        <View style={s.streakTopRow}>
                            <View style={{ flex: 1 }}>
                                <View style={s.streakNumRow}>
                                    <Text style={s.streakNum}>4</Text>
                                    <Text style={s.streakSlash}>/7</Text>
                                    <Text style={s.streakUnit}> DAYS</Text>
                                </View>
                                <Text style={s.streakNote}>3 more days to complete your weekly streak</Text>
                                <View style={s.streakBar}>
                                    <View style={[s.streakFill, { width: `${(4 / 7) * 100}%` }]} />
                                </View>
                            </View>
                            <View style={s.adherenceBadge}>
                                <Text style={s.adherenceVal}>86%</Text>
                                <Text style={s.adherenceLbl}>Adherence</Text>
                            </View>
                        </View>

                        <View style={s.daysGrid}>
                            {[{ d: 'M', ok: true }, { d: 'T', ok: true }, { d: 'W', ok: true }, { d: 'T', ok: true }, { d: 'F', ok: false }, { d: 'S', ok: false }, { d: 'S', ok: false }].map((item, i) => (
                                <View key={i} style={s.dayItem}>
                                    <View style={[s.dayDot, item.ok ? s.dayDotOn : s.dayDotOff]}>
                                        {item.ok && <Icon type={Icons.Ionicons} name="checkmark" size={ms(7)} color={whiteColor} />}
                                    </View>
                                    <Text style={[s.dayTxt, item.ok ? s.dayTxtOn : s.dayTxtOff]}>{item.d}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={s.streakInsight}>
                            <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(14)} color={primaryColor} />
                            <Text style={s.streakInsightText}>Taking medication on time for 5+ consecutive days reduces side-effect risk and maximises therapeutic benefit.</Text>
                        </View>
                    </View>

                    {/* ⑦ HEALTH SIGNAL */}
                    <View style={s.sectionAnchor} onLayout={(e) => onSectionLayout('bpTrend', e)}>
                        <SecHeader
                            number="07"
                            title="HEALTH SIGNAL"
                            deck="A tracked vital that requires your ongoing attention"
                        />

                        <Text style={s.hsHeadline}>Blood Pressure Persistently Elevated</Text>
                        <Text style={s.hsSubtitle}>Your BP readings have stayed above the healthy range for 5+ months. Consistent elevation signals the need for lifestyle or medication review.</Text>

                        <View style={s.bpStatsRow}>
                            {[
                                { l: 'Latest', v: '145/92', color: '#FF6B35' },
                                { l: 'Target', v: '120/80', color: primaryColor },
                                { l: 'Trend', v: '↑ Rising', color: '#EF4444' },
                            ].map((st, i) => (
                                <View key={i} style={s.bpStat}>
                                    <Text style={[s.bpStatVal, { color: st.color }]}>{st.v}</Text>
                                    <Text style={s.bpStatLbl}>{st.l}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={s.chartWrap}>
                            <Svg width="100%" height={ms(110)} viewBox="0 0 300 100" preserveAspectRatio="none">
                                <Defs>
                                    <SvgGrad id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor="#FF6B35" stopOpacity="0.3" />
                                        <Stop offset="1" stopColor="#FF6B35" stopOpacity="0.02" />
                                    </SvgGrad>
                                </Defs>
                                <Polygon points="0,100 0,76 60,60 120,46 180,33 240,20 300,8 300,100" fill="url(#bpGrad)" />
                                <Polyline points="0,76 60,60 120,46 180,33 240,20 300,8" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinejoin="round" />
                                <Line x1="300" y1="2" x2="300" y2="100" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="3,3" />
                                {[[0, 76], [60, 60], [120, 46], [180, 33], [240, 20], [300, 8]].map(([cx, cy], i) => (
                                    <Circle key={i} cx={cx} cy={cy} r="3.5" fill="#FF6B35" />
                                ))}
                            </Svg>
                            <View style={s.callout}><Text style={s.calloutText}>145/92</Text></View>
                        </View>
                        <View style={s.xAxis}>
                            {['12 Feb', '13 Mar', '25 Apr', '21 May', '12 Jun', '12 Jul'].map((l, i) => (
                                <Text key={i} style={s.xLabel}>{l}</Text>
                            ))}
                        </View>

                        <View style={s.thinRule} />
                        <Text style={s.sectionCap}>PATTERN EXPLANATION</Text>
                        <Text style={s.bodyText}>Your blood pressure readings have been consistently above the healthy range for 5 months, indicating a persistent elevation trend. Left unaddressed, sustained high BP accelerates arterial wear and cardiovascular risk.</Text>

                        <View style={s.thinRule} />
                        <Text style={s.sectionCap}>HEALTH IMPACT</Text>
                        {[
                            'Increased risk of heart disease and stroke',
                            'Potential strain on kidneys and blood vessels',
                            'Possible need for medication adjustment',
                            'Higher fatigue and reduced exercise tolerance',
                        ].map((txt, i) => (
                            <View key={i} style={s.bulletRow}>
                                <Text style={s.bulletChar}>■</Text>
                                <Text style={s.bulletText}>{txt}</Text>
                            </View>
                        ))}

                        <View style={s.thinRule} />
                        <View style={s.pullQuote}>
                            <View style={s.pullBar} />
                            <Text style={s.pullText}>"Consistent small lifestyle changes — less salt, daily walking, stress management — can reduce systolic BP by 5–10 mmHg within weeks."</Text>
                        </View>
                    </View>

                </View>
                <View style={{ height: vs(30) }} />
            </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HealthChronicleScreen;

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    gradient: { flex: 1, paddingTop: ms(50), paddingHorizontal: ms(20) },

    header: {
        flexDirection: 'row', alignItems: 'center',
        gap: ms(12), marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { flex: 1 },
    headerTitle: { fontSize: ms(18), fontFamily: bold, color: whiteColor },
    headerSub: { fontSize: ms(11), fontFamily: regular, color: 'rgba(255,255,255,0.75)', marginTop: vs(2) },

    scroll: { paddingBottom: ms(14) },

    card: {
        backgroundColor: '#FAFAF6',
        borderRadius: ms(10),
        borderWidth: 1, borderColor: '#D8D0C0',
        padding: ms(14),
    },

    /* Masthead */
    mastheadRule: { height: 2, backgroundColor: '#1A1A1A', marginBottom: ms(4) },
    mastheadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ms(4) },
    mastheadTitle: { fontSize: ms(13), fontWeight: '900', color: '#1A1A1A', letterSpacing: 1.5 },
    edition: { fontSize: ms(9), color: '#888', letterSpacing: 0.5 },
    mastheadThick: { height: 3, backgroundColor: '#1A1A1A', marginBottom: ms(1.5) },
    mastheadThin: { height: 1, backgroundColor: '#1A1A1A', marginBottom: ms(10) },

    greetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F3F0E8', borderRadius: ms(6), paddingHorizontal: ms(10), paddingVertical: ms(7), marginBottom: ms(10) },
    greetText: { fontSize: ms(12), fontWeight: '700', color: '#1A1A1A', fontStyle: 'italic' },
    greetEmoji: { fontSize: ms(16) },

    headline: { fontSize: ms(18), fontWeight: '900', color: '#1A1A1A', lineHeight: ms(23), marginBottom: ms(5), letterSpacing: 0.3 },
    deck: { fontSize: ms(11), color: '#555', fontStyle: 'italic', lineHeight: ms(16), marginBottom: ms(4) },
    thinRule: { height: 1, backgroundColor: '#D8D0C0', marginVertical: ms(12) },

    sectionAnchor: { marginTop: ms(4) },

    /* ── Section header ── */
    secHeader: { marginBottom: ms(12) },
    secHeaderRuleRow: { marginBottom: ms(6) },
    secHeaderRuleThick: { height: 2.5, backgroundColor: '#1A1A1A', marginBottom: ms(1.5) },
    secHeaderRuleThin: { height: 1, backgroundColor: '#1A1A1A' },
    secHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginTop: ms(6) },
    secHeaderNum: { fontSize: ms(9), fontWeight: '900', color: '#AAAAAA', letterSpacing: 1 },
    secHeaderDivider: { width: 1, height: ms(11), backgroundColor: '#CCCCCC' },
    secHeaderTitle: { fontSize: ms(10), fontWeight: '900', color: '#1A1A1A', letterSpacing: 1.4, textTransform: 'uppercase', flex: 1 },
    secHeaderDeck: { fontSize: ms(10.5), color: '#666', fontStyle: 'italic', lineHeight: ms(15), marginTop: ms(4) },

    /* ① Key Signals */
    statusSummary: { flexDirection: 'row', backgroundColor: '#F3F0E8', borderRadius: ms(8), padding: ms(10), marginBottom: ms(10), borderWidth: 0.5, borderColor: '#E0DBD0' },
    statusItem: { flex: 1, alignItems: 'center' },
    statusCount: { fontSize: ms(20), fontWeight: '900' },
    statusLabel: { fontSize: ms(10), color: '#888', fontFamily: regular },

    signalCard: { flexDirection: 'row', backgroundColor: '#FDFCF8', borderRadius: ms(8), borderWidth: 0.5, borderColor: '#E8E4DA', overflow: 'hidden', marginBottom: ms(8) },
    signalAccentBar: { width: ms(3) },
    signalCardInner: { flex: 1, padding: ms(10) },
    signalCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), marginBottom: ms(8) },
    signalIco: { width: ms(34), height: ms(34), borderRadius: ms(9), justifyContent: 'center', alignItems: 'center' },
    signalName: { fontSize: ms(12), fontWeight: '700', color: '#1A1A1A', marginBottom: ms(2) },
    signalDesc: { fontSize: ms(10.5), color: '#5A5850', lineHeight: ms(15) },
    statusBadge: { borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: ms(2), alignSelf: 'flex-start' },
    statusBadgeText: { fontSize: ms(9.5), fontWeight: '700' },
    metricsRow: { flexDirection: 'row', backgroundColor: '#F3F0E8', borderRadius: ms(6), padding: ms(8), marginBottom: ms(6), gap: ms(4) },
    metricChip: { flex: 1, alignItems: 'center' },
    metricVal: { fontSize: ms(11.5), fontWeight: '800' },
    metricLbl: { fontSize: ms(9), color: '#888', marginTop: ms(1) },
    signalDetail: { fontSize: ms(10.5), color: '#5A5850', lineHeight: ms(15), fontStyle: 'italic' },

    /* ② Top Drivers */
    scoreImpactBanner: { flexDirection: 'row', alignItems: 'center', gap: ms(8), backgroundColor: primaryColor + '12', borderRadius: ms(6), padding: ms(10), marginBottom: ms(10), borderWidth: 0.5, borderColor: primaryColor + '25' },
    scoreImpactText: { flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(16) },
    scoreImpactBold: { fontWeight: '800', color: primaryColor },

    driverCard: { paddingVertical: ms(10), flexDirection: 'row', alignItems: 'flex-start', gap: ms(10) },
    driverCardBorder: { borderBottomWidth: 0.5, borderBottomColor: '#E8E4DA' },
    driverIco: { width: ms(32), height: ms(32), borderRadius: ms(8), justifyContent: 'center', alignItems: 'center', marginTop: ms(2) },
    driverTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: ms(6) },
    driverName: { flex: 1, fontSize: ms(12.5), fontWeight: '700', color: '#1A1A1A' },
    driverPill: { borderRadius: ms(20), paddingHorizontal: ms(8), paddingVertical: ms(2) },
    driverPillText: { fontSize: ms(10), fontWeight: '700' },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: ms(5) },
    progressTrack: { flex: 1, height: ms(5), backgroundColor: '#E8E4DA', borderRadius: ms(3), overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: ms(3) },
    progressGoal: { fontSize: ms(9.5), color: '#888' },
    driverDetail: { fontSize: ms(10.5), color: '#5A5850', lineHeight: ms(15) },

    /* ③ Attention */
    attnCard: { backgroundColor: '#FDF2E3', borderRadius: ms(8), padding: ms(12), borderWidth: 0.5, borderColor: '#F9D9A0' },
    attnCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), marginBottom: ms(8) },
    attnIco: { width: ms(36), height: ms(36), borderRadius: ms(9), backgroundColor: 'rgba(160,92,10,0.12)', justifyContent: 'center', alignItems: 'center' },
    attnTitle: { fontSize: ms(13), fontWeight: '800', color: '#A05C0A', marginBottom: ms(2) },
    attnSeverity: { fontSize: ms(10), color: '#A05C0A', opacity: 0.7 },
    attnDesc: { fontSize: ms(12), color: '#7A4508', lineHeight: ms(18), marginBottom: ms(10) },
    thinRuleAmber: { height: 1, backgroundColor: '#F9D9A0', marginBottom: ms(8) },
    attnWhyTitle: { fontSize: ms(9), fontWeight: '900', color: '#A05C0A', letterSpacing: 1, marginBottom: ms(4) },
    attnWhy: { fontSize: ms(11.5), color: '#7A4508', lineHeight: ms(17), marginBottom: ms(8) },
    attnTip: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(6), backgroundColor: 'rgba(160,92,10,0.08)', borderRadius: ms(6), padding: ms(8) },
    attnTipText: { flex: 1, fontSize: ms(11), color: '#A05C0A', lineHeight: ms(16) },

    /* ④ Today's Action */
    actionBox: { backgroundColor: '#1C1B17', borderRadius: ms(8), padding: ms(14) },
    actionEye: { fontSize: ms(9), fontWeight: '700', letterSpacing: 1.2, color: 'rgba(255,255,255,0.4)', marginBottom: ms(8) },
    actionText: { fontSize: ms(14), color: whiteColor, lineHeight: ms(21), fontStyle: 'italic', fontWeight: '300', marginBottom: ms(10) },
    actionMeta: { flexDirection: 'row', gap: ms(14), marginBottom: ms(12) },
    actionMetaItem: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
    actionMetaText: { fontSize: ms(10), color: 'rgba(255,255,255,0.5)' },
    actionBtn: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: ms(20), paddingHorizontal: ms(16), paddingVertical: ms(7) },
    actionBtnDone: { backgroundColor: 'rgba(77,191,160,0.25)', borderColor: 'rgba(77,191,160,0.45)' },
    actionBtnText: { fontSize: ms(11), fontWeight: '600', color: whiteColor },

    /* ⑤ Health Momentum */
    momentumScoreBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F0E8', borderRadius: ms(8), padding: ms(12), marginBottom: ms(12), borderWidth: 0.5, borderColor: '#E0DBD0' },
    momentumScoreLabel: { fontSize: ms(8), fontWeight: '900', color: '#AAA', letterSpacing: 1, marginBottom: ms(2) },
    momentumScoreVal: { fontSize: ms(36), fontWeight: '900', color: '#1A1A1A', lineHeight: ms(40) },
    momentumScoreSub: { fontSize: ms(10), color: '#888', marginTop: ms(2) },
    momentumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: primaryColor + '18', borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: ms(5) },
    momentumBadgeText: { fontSize: ms(12), fontWeight: '800', color: primaryColor },

    sparkWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: ms(4), marginBottom: ms(12), paddingHorizontal: ms(4) },
    sparkCol: { flex: 1, alignItems: 'center' },
    sparkScore: { fontSize: ms(8.5), color: '#AAA', marginBottom: ms(3) },
    sparkBarWrap: { height: ms(40), justifyContent: 'flex-end', width: '80%' },
    sparkBar: { width: '100%', borderRadius: ms(3) },
    sparkLabel: { fontSize: ms(8.5), color: '#AAA', marginTop: ms(3) },
    momentumInsight: { fontSize: ms(11.5), color: '#5A5850', lineHeight: ms(17), fontStyle: 'italic' },

    /* ⑥ Medication Streak */
    streakTopRow: { flexDirection: 'row', alignItems: 'center', gap: ms(14), marginBottom: ms(12) },
    streakNumRow: { flexDirection: 'row', alignItems: 'baseline' },
    streakNum: { fontSize: ms(34), fontWeight: '900', color: '#1A1A1A', lineHeight: ms(38) },
    streakSlash: { fontSize: ms(18), fontWeight: '600', color: '#888' },
    streakUnit: { fontSize: ms(9), fontWeight: '800', color: '#888', letterSpacing: 1 },
    streakNote: { fontSize: ms(10), color: '#888', marginBottom: ms(6), marginTop: ms(2) },
    streakBar: { width: '100%', height: ms(6), backgroundColor: '#E0E0E0', borderRadius: ms(3), overflow: 'hidden' },
    streakFill: { height: '100%', backgroundColor: primaryColor, borderRadius: ms(3) },
    adherenceBadge: { alignItems: 'center', backgroundColor: primaryColor + '12', borderRadius: ms(10), padding: ms(10), borderWidth: 0.5, borderColor: primaryColor + '25' },
    adherenceVal: { fontSize: ms(20), fontWeight: '900', color: primaryColor },
    adherenceLbl: { fontSize: ms(9), color: primaryColor, marginTop: ms(2) },

    daysGrid: { flexDirection: 'row', gap: ms(6), marginBottom: ms(10) },
    dayItem: { flex: 1, alignItems: 'center', gap: ms(3) },
    dayDot: { width: ms(22), height: ms(22), borderRadius: ms(11), justifyContent: 'center', alignItems: 'center' },
    dayDotOn: { backgroundColor: primaryColor },
    dayDotOff: { backgroundColor: '#E0E0E0' },
    dayTxt: { fontSize: ms(9), fontWeight: '700' },
    dayTxtOn: { color: primaryColor },
    dayTxtOff: { color: '#BBBBBB' },

    streakInsight: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(7), backgroundColor: primaryColor + '0D', borderRadius: ms(6), padding: ms(10), borderWidth: 0.5, borderColor: primaryColor + '20' },
    streakInsightText: { flex: 1, fontSize: ms(11), color: '#444', lineHeight: ms(16) },

    /* ⑦ Health Signal */
    hsHeadline: { fontSize: ms(15), fontWeight: '800', color: '#1A1A1A', lineHeight: ms(20), marginBottom: ms(4) },
    hsSubtitle: { fontSize: ms(11.5), color: '#666', lineHeight: ms(17), fontStyle: 'italic', marginBottom: ms(10) },
    bpStatsRow: { flexDirection: 'row', backgroundColor: '#FFF3EE', borderRadius: ms(8), padding: ms(10), marginBottom: ms(10), borderWidth: 0.5, borderColor: '#FFD5C2' },
    bpStat: { flex: 1, alignItems: 'center' },
    bpStatVal: { fontSize: ms(14), fontWeight: '900' },
    bpStatLbl: { fontSize: ms(9.5), color: '#888', marginTop: ms(2) },

    chartWrap: { position: 'relative', marginBottom: ms(4) },
    callout: { position: 'absolute', top: ms(2), right: 0, backgroundColor: '#FF6B35', borderRadius: ms(4), paddingHorizontal: ms(5), paddingVertical: ms(2) },
    calloutText: { fontSize: ms(9), fontWeight: '800', color: whiteColor },
    xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: ms(4) },
    xLabel: { fontSize: ms(8), color: '#AAAAAA' },

    sectionCap: { fontSize: ms(9), fontWeight: '900', color: '#1A1A1A', letterSpacing: 1.2, marginBottom: ms(5) },
    bodyText: { fontSize: ms(12), color: '#444', lineHeight: ms(18) },
    bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(6), marginBottom: ms(5) },
    bulletChar: { fontSize: ms(7), color: '#1A1A1A', marginTop: ms(4) },
    bulletText: { flex: 1, fontSize: ms(12), color: '#444', lineHeight: ms(17) },

    pullQuote: { flexDirection: 'row', gap: ms(10), paddingVertical: ms(8) },
    pullBar: { width: ms(3), backgroundColor: '#FF6B35', borderRadius: ms(2) },
    pullText: { flex: 1, fontSize: ms(12), color: '#555', fontStyle: 'italic', lineHeight: ms(18) },
});
