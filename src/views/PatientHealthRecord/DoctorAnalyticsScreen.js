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

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
    teal:    primaryColor,
    purple:  '#7C3AED',
    blue:    '#1D4ED8',
    amber:   '#D97706',
    red:     '#DC2626',
    green:   '#16A34A',
    orange:  '#EA580C',
    cyan:    '#0891B2',
    indigo:  '#4338CA',
    gray:    '#94A3B8',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const MO_24 = ["Apr'23",'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',"Jan'24",'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',"Jan'25",'Feb','Mar'];
const SPEND_VALS = [400,800,400,600,400,800,400,400,600,400,800,400,800,400,400,400,400,800,400,400,1200,800,4000,800];
const MAX_SPEND  = 4000;

const SPECIALTIES = [
    { name: 'Endocrinology',  color: C.teal,   total: 9800 },
    { name: 'Cardiology',     color: C.purple, total: 5200 },
    { name: 'General Phys.',  color: C.amber,  total: 3000 },
    { name: 'Ophthalmology',  color: C.blue,   total: 2400 },
    { name: 'Physiotherapy',  color: C.orange, total: 1500 },
    { name: 'Dentistry',      color: C.cyan,   total: 500  },
];

const DOCTORS = [
    { init:'PN', bg:'#CCFBF1', tx:C.teal,   name:'Dr. Priya Nair',           sp:'Endocrinologist',   visits:14, total:9800,  loyalty:100, kept:14, totalFu:14, streakLbl:'2+ years', note:'Primary care anchor – never changed' },
    { init:'SR', bg:'#EDE9FE', tx:C.purple, name:'Dr. Suresh Reddy',         sp:'Cardiologist',      visits:6,  total:5200,  loyalty:85,  kept:4,  totalFu:6,  streakLbl:'1 year',   note:'All cardiac visits to same doctor' },
    { init:'KI', bg:'#FEF3C7', tx:C.amber,  name:'Dr. Kavitha Iyer',         sp:'General Physician', visits:6,  total:3000,  loyalty:100, kept:6,  totalFu:6,  streakLbl:'3 years',  note:'Consistent GP for all sick visits' },
    { init:'AK', bg:'#EFF6FF', tx:C.blue,   name:'Dr. Anand Krishnamurthy',  sp:'Ophthalmologist',   visits:4,  total:2400,  loyalty:100, kept:4,  totalFu:4,  streakLbl:'2 years',  note:'Annual eye exams, same specialist' },
    { init:'RS', bg:'#FFF7ED', tx:C.orange, name:'Dr. Ramya Srinivas',       sp:'Physiotherapist',   visits:3,  total:1500,  loyalty:75,  kept:3,  totalFu:4,  streakLbl:'1 course', note:'Physiotherapy course – partially complete' },
];

// ── Shared UI helpers ─────────────────────────────────────────────────────────
const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

const SecTitle = ({ title, sub }) => (
    <View style={s.secTitleWrap}>
        <Text style={s.secTitle}>{title}</Text>
        {sub ? <Text style={s.secSub}>{sub}</Text> : null}
    </View>
);

const Bar = ({ pct, color, h = 5 }) => (
    <View style={[s.barBg, { height: h }]}>
        <View style={[s.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color, height: h }]} />
    </View>
);

const Pill = ({ label, color, bg }) => (
    <View style={[s.pill, { backgroundColor: bg || color + '20' }]}>
        <Text style={[s.pillTxt, { color }]}>{label}</Text>
    </View>
);

const Avatar = ({ init, bg, tx }) => (
    <View style={[s.avatar, { backgroundColor: bg }]}>
        <Text style={[s.avatarTxt, { color: tx }]}>{init}</Text>
    </View>
);

// ── Visit Frequency Stacked bars helper ───────────────────────────────────────
const VISIT_FREQ = [
    { endo:[1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1], cardio:[0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,2,0], other:[0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1,0] },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SPEND ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const SpendTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.tabContent}>

        {/* ── Hero ── */}
        <LinearGradient colors={[primaryColor, '#0D5C52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
            <View style={s.heroMainRow}>
                <View style={s.heroLeft}>
                    <Text style={s.heroNum}>₹22.4<Text style={s.heroUnit}>K</Text></Text>
                    <Text style={s.heroLbl}>Total consultation spend (all time)</Text>
                </View>
            </View>
            <View style={s.heroKpis}>
                {[
                    { n:'34',    l:'Total visits' },
                    { n:'₹659',  l:'Avg fee per visit' },
                    { n:'₹8,600',l:'Spend in 2025 YTD' },
                    { n:'9',     l:'Unique doctors' },
                    { n:'6',     l:'Specialties seen' },
                ].map((k,i) => (
                    <View key={i} style={s.heroKpi}>
                        <Text style={s.heroKpiN}>{k.n}</Text>
                        <Text style={s.heroKpiL}>{k.l}</Text>
                    </View>
                ))}
            </View>
            <View style={s.heroChips}>
                {[
                    { txt:'↑ 38% more visits in 2025 vs 2024 (new cardiac dx)',         bg:'rgba(220,38,38,0.22)',  tx:'#FCA5A5' },
                    { txt:'Endocrinology = 41% of all visits',                           bg:'rgba(13,148,136,0.22)', tx:'#5EEAD4' },
                    { txt:'₹3,800 insurance-covered (Yashoda Feb 2025)',                 bg:'rgba(29,78,216,0.22)', tx:'#93C5FD' },
                    { txt:'Cardiology costliest specialty at ₹867/visit avg',            bg:'rgba(124,58,237,0.22)',tx:'#C4B5FD' },
                ].map((c,i) => (
                    <View key={i} style={[s.heroChip, { backgroundColor: c.bg }]}>
                        <Text style={[s.heroChipTxt, { color: c.tx }]}>{c.txt}</Text>
                    </View>
                ))}
            </View>
        </LinearGradient>

        {/* ── Stat Strip ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.stripScroll}>
            {[
                { lbl:'2025 YTD',            val:'₹8,600', sub:'6 visits (Q1)',           color:C.teal   },
                { lbl:'Full Year 2024',       val:'₹7,950', sub:'14 visits',               color:C.purple },
                { lbl:'Full Year 2023',       val:'₹5,850', sub:'14 visits',               color:C.blue   },
                { lbl:'Highest Single Bill',  val:'₹3,800', sub:'Yashoda Feb 2025',        color:C.amber  },
                { lbl:'Avg per Specialty',    val:'₹3,733', sub:'annual per specialty',    color:C.green  },
            ].map((s2,i) => (
                <View key={i} style={[s.statStrip, { borderTopColor: s2.color }]}>
                    <Text style={s.stripLbl}>{s2.lbl}</Text>
                    <Text style={[s.stripVal, { color: s2.color }]}>{s2.val}</Text>
                    <Text style={s.stripSub}>{s2.sub}</Text>
                </View>
            ))}
        </ScrollView>

        {/* ── Monthly Consultation Spend ── */}
        <Card>
            <SecTitle title="Monthly Consultation Spend" sub="24-month fee payments across all doctors" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[s.barChartWrap, { alignItems:'flex-end' }]}>
                    {SPEND_VALS.map((val, i) => {
                        const barH = Math.max(4, Math.round((val / MAX_SPEND) * vs(80)));
                        const isRecent = i >= 21;
                        return (
                            <View key={i} style={s.barCol}>
                                <Text style={s.barAmt}>₹{val >= 1000 ? (val/1000).toFixed(1)+'k' : val}</Text>
                                <View style={{ height:vs(80), width:ms(14), backgroundColor:'#F1F5F9', borderRadius:ms(3), justifyContent:'flex-end', overflow:'hidden' }}>
                                    <View style={{ height:barH, width:'100%', backgroundColor: isRecent ? C.teal : C.teal+'55', borderRadius:ms(3) }} />
                                </View>
                                <Text style={s.barLbl}>{MO_24[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </Card>

        {/* ── Year-over-Year Quarterly ── */}
        <Card>
            <SecTitle title="Year-over-Year Quarterly Spend" sub="2023 vs 2024 vs 2025" />
            <View style={{ flexDirection:'row', gap:ms(10) }}>
                {['Q1','Q2','Q3','Q4'].map((q, qi) => {
                    const data2023 = [1200,1400,1800,2400];
                    const data2024 = [2000,1600,2000,2350];
                    const data2025 = [8600,0,0,0];
                    const maxY = 8600;
                    return (
                        <View key={qi} style={{ flex:1, alignItems:'center' }}>
                            <View style={{ height:vs(90), width:'100%', justifyContent:'flex-end', gap:vs(2) }}>
                                {[{v:data2025[qi],c:C.teal+'CC'},{v:data2024[qi],c:C.teal+'66'},{v:data2023[qi],c:C.gray+'55'}].map((b,bi) => (
                                    b.v > 0 ? (
                                        <View key={bi} style={{ width:'80%', alignSelf:'center', height: Math.max(4, Math.round((b.v/maxY)*vs(80))), backgroundColor:b.c, borderRadius:ms(4) }} />
                                    ) : null
                                ))}
                            </View>
                            <Text style={s.barLbl}>{q}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={s.legendRow}>
                <View style={[s.legendDot,{backgroundColor:C.teal+'CC'}]}/><Text style={s.legendTxt}>2025</Text>
                <View style={[s.legendDot,{backgroundColor:C.teal+'66',marginLeft:ms(10)}]}/><Text style={s.legendTxt}>2024</Text>
                <View style={[s.legendDot,{backgroundColor:C.gray+'55',marginLeft:ms(10)}]}/><Text style={s.legendTxt}>2023</Text>
            </View>
        </Card>

        {/* ── Cumulative Spend ── */}
        <Card>
            <SecTitle title="Cumulative Consultation Spend" sub="Running total – the true cost of healthcare over time" />
            {(() => {
                const cumul = SPEND_VALS.reduce((a,v,i) => { a.push((a[i-1]||0)+v); return a; }, []);
                const maxC = cumul[cumul.length-1];
                return (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={[s.barChartWrap,{alignItems:'flex-end'}]}>
                            {cumul.map((val,i) => {
                                const barH = Math.max(4, Math.round((val/maxC)*vs(75)));
                                return (
                                    <View key={i} style={s.barCol}>
                                        <Text style={s.barAmt}>₹{(val/1000).toFixed(0)}k</Text>
                                        <View style={{height:vs(75),width:ms(14),backgroundColor:'#F1F5F9',borderRadius:ms(3),justifyContent:'flex-end',overflow:'hidden'}}>
                                            <View style={{height:barH,width:'100%',backgroundColor:C.teal,borderRadius:ms(3),opacity:0.35+(i/cumul.length)*0.65}} />
                                        </View>
                                        <Text style={s.barLbl}>{MO_24[i]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                );
            })()}
        </Card>

        {/* ── Spend by Specialty ── */}
        <Card>
            <SecTitle title="Spend by Specialty" sub="Total fees paid per medical specialty · ₹22,400 total" />
            {SPECIALTIES.map((sp,i) => (
                <View key={i} style={s.drugRow}>
                    <View style={[s.dot,{backgroundColor:sp.color}]} />
                    <Text style={[s.condName,{color:sp.color}]} numberOfLines={1}>{sp.name}</Text>
                    <View style={{flex:1, marginHorizontal:ms(8)}}>
                        <Bar pct={Math.round((sp.total/9800)*100)} color={sp.color} h={8} />
                    </View>
                    <Text style={[s.condAmt,{color:sp.color}]}>₹{sp.total.toLocaleString()}</Text>
                </View>
            ))}
        </Card>

        {/* ── Spend by Visit Type ── */}
        <Card>
            <SecTitle title="Spend by Visit Type" sub="How visit purpose affects cost" />
            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end'}}>
                {[
                    {lbl:'Follow-up',   avg:750,  color:C.teal},
                    {lbl:'Consultation',avg:1400, color:C.purple},
                    {lbl:'Annual Check',avg:1100, color:C.blue},
                    {lbl:'Sick Visit',  avg:600,  color:C.amber},
                ].map((t,i) => {
                    const barH = Math.round((t.avg/1400)*vs(75));
                    return (
                        <View key={i} style={{alignItems:'center',flex:1}}>
                            <Text style={[s.barAmt,{fontFamily:interMedium,color:t.color}]}>₹{t.avg}</Text>
                            <View style={{height:vs(75),width:ms(32),backgroundColor:'#F1F5F9',borderRadius:ms(6),justifyContent:'flex-end',overflow:'hidden'}}>
                                <View style={{height:barH,width:'100%',backgroundColor:t.color+'BB',borderRadius:ms(6)}} />
                            </View>
                            <Text style={[s.barLbl,{textAlign:'center',marginTop:vs(4)}]}>{t.lbl}</Text>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── Avg Fee Per Visit Over Time ── */}
        <Card>
            <SecTitle title="Average Fee Per Visit Over Time" sub="Is your per-visit cost rising?" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[s.barChartWrap,{alignItems:'flex-end'}]}>
                    {[
                        {lbl:'2022',    avg:400},
                        {lbl:"Q1'23",   avg:450},
                        {lbl:'Q2',      avg:467},
                        {lbl:'Q3',      avg:533},
                        {lbl:'Q4',      avg:560},
                        {lbl:"Q1'24",   avg:571},
                        {lbl:'Q2',      avg:533},
                        {lbl:'Q3',      avg:533},
                        {lbl:'Q4',      avg:588},
                        {lbl:"Q1'25",   avg:1433},
                    ].map((p,i) => {
                        const barH = Math.max(4, Math.round((p.avg/1433)*vs(80)));
                        const isSpike = p.avg > 800;
                        return (
                            <View key={i} style={[s.barCol,{minWidth:ms(40)}]}>
                                <Text style={[s.barAmt,{color:isSpike?C.purple:C.gray}]}>₹{p.avg}</Text>
                                <View style={{height:vs(80),width:ms(22),backgroundColor:'#F1F5F9',borderRadius:ms(4),justifyContent:'flex-end',overflow:'hidden'}}>
                                    <View style={{height:barH,width:'100%',backgroundColor:isSpike?C.purple+'BB':C.purple+'44',borderRadius:ms(4)}} />
                                </View>
                                <Text style={s.barLbl}>{p.lbl}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </Card>

        {/* ── Doctor Fee Ranking ── */}
        <Card>
            <SecTitle title="Doctor Fee Ranking" sub="Total paid to each doctor – all time" />
            {DOCTORS.map((d,i) => (
                <View key={i} style={s.rankRow}>
                    <Text style={s.rankNum}>#{i+1}</Text>
                    <Avatar init={d.init} bg={d.bg} tx={d.tx} />
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.rankName}>{d.name}</Text>
                        <Text style={s.rankMeta}>{d.sp} · {d.visits} visits</Text>
                        <Bar pct={Math.round((d.total/9800)*100)} color={d.tx} h={4} />
                    </View>
                    <Text style={[s.rankVal,{color:d.tx}]}>₹{d.total.toLocaleString()}</Text>
                </View>
            ))}
        </Card>

        {/* ── Hospital / Clinic Spend ── */}
        <Card>
            <SecTitle title="Hospital / Clinic Spend" sub="Total consultation fees by facility" />
            {[
                {name:'Apollo Hospitals, Hyderabad',        visits:14, total:11200, color:C.teal},
                {name:'Yashoda Hospitals, Secunderabad',    visits:6,  total:5200,  color:C.purple},
                {name:'Care Clinic, Banjara Hills',         visits:6,  total:3000,  color:C.amber},
                {name:'LV Prasad Eye Institute',            visits:4,  total:1600,  color:C.blue},
                {name:'ActiveLife Physiotherapy',           visits:3,  total:1500,  color:C.orange},
            ].map((f,i) => (
                <View key={i} style={s.rankRow}>
                    <Text style={s.rankNum}>#{i+1}</Text>
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.rankName} numberOfLines={1}>{f.name}</Text>
                        <Text style={s.rankMeta}>{f.visits} visits</Text>
                        <Bar pct={Math.round((f.total/11200)*100)} color={f.color} h={4} />
                    </View>
                    <Text style={[s.rankVal,{color:f.color}]}>₹{f.total.toLocaleString()}</Text>
                </View>
            ))}
        </Card>

        {/* ── Cost per Clinical Outcome ── */}
        <Card>
            <SecTitle title="Cost per Clinical Outcome" sub="What each diagnosis discovery cost in consultations" />
            {[
                {dx:'Type 2 Diabetes (confirmed Sep 2023)',           visits:3, cost:1200, color:C.teal},
                {dx:'Hypercholesterolaemia (confirmed Feb 2025)',      visits:2, cost:5200, color:C.purple},
                {dx:'Vitamin D Deficiency (confirmed Nov 2024)',       visits:1, cost:800,  color:C.blue},
                {dx:'Viral Pharyngitis (Jan 2025)',                   visits:1, cost:500,  color:C.amber},
                {dx:'Myopia progression (Nov 2024)',                  visits:1, cost:700,  color:C.orange},
            ].map((c,i) => (
                <View key={i} style={s.cpoRow}>
                    <View style={[s.dot,{backgroundColor:c.color,marginTop:vs(3)}]} />
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.cpoName}>{c.dx}</Text>
                        <Text style={s.cpoMeta}>{c.visits} visit{c.visits>1?'s':''} to diagnosis</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                        <Text style={[s.cpoAmt,{color:c.color}]}>₹{c.cost.toLocaleString()}</Text>
                        <Text style={s.cpoCostLbl}>consult cost</Text>
                    </View>
                </View>
            ))}
        </Card>

        {/* ── Spend vs Visit Frequency (bubble representation) ── */}
        <Card>
            <SecTitle title="Spend vs Visit Frequency" sub="Specialists with most visits vs highest cost" />
            <View style={s.bubbleWrap}>
                {SPECIALTIES.map((sp,i) => {
                    const size = Math.max(ms(30), Math.round((sp.total/9800)*ms(80)));
                    return (
                        <View key={i} style={[s.bubble,{width:size,height:size,borderRadius:size/2,backgroundColor:sp.color+'33',borderColor:sp.color,borderWidth:1.5}]}>
                            <Text style={[s.bubbleName,{color:sp.color,fontSize:ms(8)}]} numberOfLines={1}>{sp.name.split(' ')[0]}</Text>
                            <Text style={[s.bubbleAmt,{color:sp.color}]}>₹{(sp.total/1000).toFixed(1)}k</Text>
                        </View>
                    );
                })}
            </View>
            <View style={s.legendRow}>
                {SPECIALTIES.map((sp,i) => (
                    <View key={i} style={[s.legendItem,{marginRight:ms(8)}]}>
                        <View style={[s.legendDot,{backgroundColor:sp.color}]}/>
                        <Text style={s.legendTxt}>{sp.name}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* ── Insurance Coverage ── */}
        <Card>
            <SecTitle title="Insurance Coverage Analysis" sub="How much of your doctor spend is covered" />
            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end'}}>
                {['2023','2024','2025 YTD'].map((yr,yi) => {
                    const oop   = [5850,7950,4800][yi];
                    const insur = [0,0,3800][yi];
                    const total = oop + insur;
                    const maxT  = 8600;
                    const oopH   = Math.max(4, Math.round((oop/maxT)*vs(80)));
                    const insurH = Math.max(0, Math.round((insur/maxT)*vs(80)));
                    return (
                        <View key={yi} style={{alignItems:'center',flex:1}}>
                            <Text style={[s.barAmt,{color:blackColor,fontFamily:interMedium}]}>₹{(total/1000).toFixed(1)}k</Text>
                            <View style={{height:vs(80),width:ms(36),justifyContent:'flex-end',borderRadius:ms(4),overflow:'hidden'}}>
                                {insurH > 0 && <View style={{height:insurH,width:'100%',backgroundColor:C.blue+'BB'}} />}
                                <View style={{height:oopH,width:'100%',backgroundColor:C.teal+'BB'}} />
                            </View>
                            <Text style={s.barLbl}>{yr}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={s.legendRow}>
                <View style={[s.legendDot,{backgroundColor:C.teal+'BB'}]}/><Text style={s.legendTxt}>Out-of-pocket</Text>
                <View style={[s.legendDot,{backgroundColor:C.blue+'BB',marginLeft:ms(10)}]}/><Text style={s.legendTxt}>Insurance covered</Text>
            </View>
            <View style={s.insightBox}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color={C.indigo} />
                <Text style={s.insightTxt}>Only <Text style={{fontFamily:interMedium}}>₹3,800 of ₹22,400</Text> (17%) was insurance-covered. OPD consultation fees are typically not reimbursed under standard policies – only inpatient/day-care gets covered. <Text style={{fontFamily:interMedium}}>Enquire about adding an OPD rider</Text> to your Star Health plan.</Text>
            </View>
        </Card>

        {/* ── Benchmarking ── */}
        <Card>
            <SecTitle title="Benchmarking" sub="You vs similar patients" />
            <View style={s.benchGrid}>
                {[
                    {lbl:'Your annual spend',   val:'₹13.8K', sub:'2025 annualised',               bg:C.teal+'18',   color:C.teal},
                    {lbl:'Peer average',         val:'₹11,200',sub:'Similar chronic conditions',   bg:'#F1F5F9',      color:blackColor},
                    {lbl:'You spend more',       val:'23%',    sub:'above median – more specialists',bg:C.amber+'18', color:C.amber},
                    {lbl:'Cost per diagnosis',   val:'₹2,800', sub:'across 8 confirmed conditions', bg:C.blue+'18',   color:C.blue},
                ].map((b,i) => (
                    <View key={i} style={[s.benchCard,{backgroundColor:b.bg}]}>
                        <Text style={[s.benchLbl,{color:b.color}]}>{b.lbl}</Text>
                        <Text style={[s.benchVal,{color:b.color}]}>{b.val}</Text>
                        <Text style={[s.secSub,{color:b.color,marginTop:vs(2)}]}>{b.sub}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* ── Spend Insights ── */}
        <Card style={{backgroundColor:'#F0FDFA',borderColor:'rgba(13,148,136,0.2)'}}>
            <SecTitle title="Spend Insights" />
            {[
                {icon:'🏥', bold:'Apollo Hospitals', rest:' charges ₹800/visit for endocrinology – 15% above Yashoda\'s average for the same specialty type.'},
                {icon:'📋', bold:'Bundling a GP visit', rest:' before a specialist referral costs ₹400–600 more per episode – ask for direct specialist referrals where possible.'},
                {icon:'💡', bold:'The Feb 2025 cardiac workup', rest:' (consult + ECG + Echo = ₹3,800) is your single biggest visit. A targeted workup at a standalone diagnostic centre could cost ₹1,200–1,800 less.'},
                {icon:'📈', bold:'Your visit spend will cross ₹30,000', rest:' this year if the Apr, Jun follow-ups proceed – plan accordingly.'},
            ].map((ins,i) => (
                <View key={i} style={s.insightBullet}>
                    <Text style={s.insightBulletIcon}>{ins.icon}</Text>
                    <Text style={[s.insightTxt,{color:C.teal}]}>
                        <Text style={{fontFamily:interMedium}}>{ins.bold}</Text>{ins.rest}
                    </Text>
                </View>
            ))}
        </Card>

        <View style={{height:vs(30)}}/>
    </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  BEHAVIOUR ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════
const BehaviourTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.tabContent}>

        {/* ── Hero ── */}
        <LinearGradient colors={[primaryColor, '#0D5C52']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.hero}>
            <View style={s.heroMainRow}>
                <View style={s.heroLeft}>
                    <Text style={s.heroNum}>32<Text style={s.heroUnit}>days</Text></Text>
                    <Text style={s.heroLbl}>Avg gap between visits</Text>
                </View>
            </View>
            <View style={s.heroKpis}>
                {[
                    {n:'94%',     l:'Follow-up compliance'},
                    {n:'2',       l:'Missed appointments'},
                    {n:'4.2 days',l:'Avg booking lead time'},
                    {n:'Tuesday', l:'Most common visit day'},
                    {n:'2',       l:'Self-initiated (no referral)'},
                ].map((k,i) => (
                    <View key={i} style={s.heroKpi}>
                        <Text style={s.heroKpiN}>{k.n}</Text>
                        <Text style={s.heroKpiL}>{k.l}</Text>
                    </View>
                ))}
            </View>
            <View style={s.heroChips}>
                {[
                    {txt:'94% follow-up compliance – highly engaged patient',          bg:'rgba(13,148,136,0.22)', tx:'#5EEAD4'},
                    {txt:'2 missed cardiology follow-ups in 2024',                      bg:'rgba(220,38,38,0.22)',  tx:'#FCA5A5'},
                    {txt:'Weekend visits avoided – all weekday appointments',           bg:'rgba(217,119,6,0.22)',  tx:'#FCD34D'},
                    {txt:'Visit frequency spiked 38% after new cardiac diagnosis',      bg:'rgba(124,58,237,0.22)',tx:'#C4B5FD'},
                ].map((c,i) => (
                    <View key={i} style={[s.heroChip,{backgroundColor:c.bg}]}>
                        <Text style={[s.heroChipTxt,{color:c.tx}]}>{c.txt}</Text>
                    </View>
                ))}
            </View>
        </LinearGradient>

        {/* ── Stat Strip ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.stripScroll}>
            {[
                {lbl:'Follow-up Rate', val:'94%',  sub:'32 of 34 kept',        color:C.green},
                {lbl:'Avg Gap (days)', val:'32',   sub:'between visits',        color:C.teal},
                {lbl:'Missed Appts',   val:'2',    sub:'both cardiology',       color:C.red},
                {lbl:'Self-Initiated', val:'2',    sub:'proactive visits',      color:C.blue},
                {lbl:'Avg Booking Lead',val:'4.2d',sub:'before appointment',   color:C.purple},
            ].map((s2,i) => (
                <View key={i} style={[s.statStrip,{borderTopColor:s2.color}]}>
                    <Text style={s.stripLbl}>{s2.lbl}</Text>
                    <Text style={[s.stripVal,{color:s2.color}]}>{s2.val}</Text>
                    <Text style={s.stripSub}>{s2.sub}</Text>
                </View>
            ))}
        </ScrollView>

        {/* ── Visit Frequency Over Time (Stacked) ── */}
        <Card>
            <SecTitle title="Visit Frequency Over Time" sub="Monthly visit count – 24 months" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[s.barChartWrap,{alignItems:'flex-end'}]}>
                    {MO_24.map((_,i) => {
                        const endo   = VISIT_FREQ[0].endo[i]   || 0;
                        const cardio = VISIT_FREQ[0].cardio[i] || 0;
                        const other  = VISIT_FREQ[0].other[i]  || 0;
                        const total  = endo + cardio + other;
                        if(total === 0) return (
                            <View key={i} style={s.barCol}>
                                <View style={{height:vs(60),width:ms(14),backgroundColor:'transparent'}} />
                                <Text style={s.barLbl}>{MO_24[i]}</Text>
                            </View>
                        );
                        const unitH = vs(60) / 3;
                        return (
                            <View key={i} style={s.barCol}>
                                <View style={{height:vs(60),width:ms(14),justifyContent:'flex-end',borderRadius:ms(3),overflow:'hidden'}}>
                                    {endo>0   && <View style={{height:endo*unitH,  backgroundColor:C.teal+'BB'}} />}
                                    {cardio>0 && <View style={{height:cardio*unitH,backgroundColor:C.purple+'BB'}} />}
                                    {other>0  && <View style={{height:other*unitH, backgroundColor:C.amber+'BB'}} />}
                                </View>
                                <Text style={s.barLbl}>{MO_24[i]}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={s.legendRow}>
                <View style={[s.legendDot,{backgroundColor:C.teal}]}/><Text style={s.legendTxt}>Endocrinology</Text>
                <View style={[s.legendDot,{backgroundColor:C.purple,marginLeft:ms(10)}]}/><Text style={s.legendTxt}>Cardiology</Text>
                <View style={[s.legendDot,{backgroundColor:C.amber,marginLeft:ms(10)}]}/><Text style={s.legendTxt}>Other</Text>
            </View>
        </Card>

        {/* ── Visit Gap Distribution ── */}
        <Card>
            <SecTitle title="Visit Gap Distribution" sub="Days between consecutive doctor visits" />
            <View style={[s.barChartWrap,{alignItems:'flex-end',justifyContent:'space-around'}]}>
                {[
                    {lbl:'1–7d',  val:2},
                    {lbl:'8–14d', val:4},
                    {lbl:'15–21d',val:8},
                    {lbl:'22–30d',val:9},
                    {lbl:'31–45d',val:6},
                    {lbl:'46–60d',val:3},
                    {lbl:'60d+',  val:2},
                ].map((g,i) => {
                    const barH = Math.max(4, Math.round((g.val/9)*vs(70)));
                    const isPeak = i === 3;
                    return (
                        <View key={i} style={{alignItems:'center',flex:1}}>
                            <Text style={[s.barAmt,{color:isPeak?C.teal:C.gray}]}>{g.val}</Text>
                            <View style={{height:vs(70),width:ms(20),backgroundColor:'#F1F5F9',borderRadius:ms(4),justifyContent:'flex-end',overflow:'hidden',alignSelf:'center'}}>
                                <View style={{height:barH,width:'100%',backgroundColor:isPeak?C.teal+'CC':C.teal+'55',borderRadius:ms(4)}} />
                            </View>
                            <Text style={s.barLbl}>{g.lbl}</Text>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── Follow-up Compliance by Doctor ── */}
        <Card>
            <SecTitle title="Follow-up Compliance by Doctor" sub="% of recommended follow-ups actually attended" />
            {DOCTORS.map((d,i) => {
                const pct = Math.round((d.kept/d.totalFu)*100);
                const color = pct===100 ? C.green : pct>=75 ? C.amber : C.red;
                const label = pct===100 ? 'Perfect' : pct>=75 ? 'Good' : 'Low';
                return (
                    <View key={i} style={s.adhRow}>
                        <Avatar init={d.init} bg={d.bg} tx={d.tx} />
                        <View style={s.adhInfo}>
                            <Text style={s.adhName} numberOfLines={1}>{d.name}</Text>
                            <Text style={s.adhMeta}>{d.kept} of {d.totalFu} follow-ups kept</Text>
                        </View>
                        <View style={s.adhBarWrap}>
                            <View style={{flexDirection:'row',justifyContent:'flex-end',marginBottom:vs(2)}}>
                                <Text style={[s.barAmt,{color,fontFamily:interMedium}]}>{pct}%</Text>
                            </View>
                            <Bar pct={pct} color={color} h={5} />
                        </View>
                        <Pill label={label} color={color} />
                    </View>
                );
            })}
        </Card>

        {/* ── Visit Type Mix Over Time ── */}
        <Card>
            <SecTitle title="Visit Type Mix Over Time" sub="How visit purpose has shifted year to year" />
            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end'}}>
                {[
                    {yr:'2022', fu:6,  con:2, ck:2, sick:1},
                    {yr:'2023', fu:8,  con:3, ck:2, sick:1},
                    {yr:'2024', fu:10, con:2, ck:1, sick:1},
                    {yr:'2025', fu:4,  con:1, ck:1, sick:0},
                ].map((yr,yi) => {
                    const total = yr.fu+yr.con+yr.ck+yr.sick;
                    const maxT  = 14;
                    return (
                        <View key={yi} style={{alignItems:'center',flex:1}}>
                            <View style={{height:vs(80),width:ms(28),justifyContent:'flex-end',borderRadius:ms(4),overflow:'hidden'}}>
                                {yr.fu>0   && <View style={{height:(yr.fu/maxT)*vs(80),  backgroundColor:C.teal+'BB'}} />}
                                {yr.con>0  && <View style={{height:(yr.con/maxT)*vs(80), backgroundColor:C.purple+'BB'}} />}
                                {yr.ck>0   && <View style={{height:(yr.ck/maxT)*vs(80),  backgroundColor:C.blue+'BB'}} />}
                                {yr.sick>0 && <View style={{height:(yr.sick/maxT)*vs(80),backgroundColor:C.amber+'BB'}} />}
                            </View>
                            <Text style={s.barLbl}>{yr.yr}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={s.legendRow}>
                {[{c:C.teal,l:'Follow-up'},{c:C.purple,l:'Consultation'},{c:C.blue,l:'Annual Check'},{c:C.amber,l:'Sick Visit'}].map((x,i) => (
                    <View key={i} style={[s.legendItem,{marginRight:ms(8)}]}>
                        <View style={[s.legendDot,{backgroundColor:x.c}]}/><Text style={s.legendTxt}>{x.l}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* ── Visit History Calendar ── */}
        <Card>
            <SecTitle title="Visit History Calendar" sub="All 34 visits plotted – colour by specialty" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection:'row',gap:ms(6),marginTop:vs(6)}}>
                    {[
                        {mo:"Apr'23",sp:[0,0]},{mo:'May',sp:[0]},{mo:'Jun',sp:[2]},{mo:'Jul',sp:[1]},
                        {mo:'Aug',sp:[0]},{mo:'Sep',sp:[0,2]},{mo:'Oct',sp:[0]},{mo:'Nov',sp:[1]},
                        {mo:'Dec',sp:[0,3]},{mo:"Jan'24",sp:[0]},{mo:'Feb',sp:[0,1]},{mo:'Mar',sp:[0]},
                        {mo:"Apr'24",sp:[0,1]},{mo:'May',sp:[0]},{mo:'Jun',sp:[0,2]},{mo:'Jul',sp:[3,4]},
                        {mo:'Aug',sp:[0]},{mo:"Sep'24",sp:[0,2]},{mo:'Oct',sp:[0]},{mo:'Nov',sp:[4,2]},
                        {mo:'Dec',sp:[0,1]},{mo:"Jan'25",sp:[0]},{mo:'Feb',sp:[0,1,0]},{mo:'Mar',sp:[0,5]},
                    ].map((m,mi) => {
                        const SPEC_COLORS = [C.teal,C.purple,C.amber,C.blue,C.orange,C.cyan];
                        return (
                            <View key={mi} style={{alignItems:'center',minWidth:ms(28)}}>
                                <Text style={[s.barLbl,{marginBottom:vs(3),fontSize:ms(7)}]}>{m.mo}</Text>
                                {m.sp.map((sp,si) => (
                                    <View key={si} style={{width:ms(22),height:ms(18),borderRadius:ms(3),backgroundColor:SPEC_COLORS[sp],marginBottom:ms(2)}} />
                                ))}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={[s.legendRow,{marginTop:vs(8)}]}>
                {[
                    {c:C.teal,l:'Endo'},{c:C.purple,l:'Cardio'},{c:C.amber,l:'GP'},
                    {c:C.blue,l:'Eye'},{c:C.orange,l:'Physio'},{c:C.cyan,l:'Dental'},
                ].map((x,i) => (
                    <View key={i} style={[s.legendItem,{marginRight:ms(8)}]}>
                        <View style={[s.legendDot,{backgroundColor:x.c,borderRadius:ms(2),width:ms(10),height:ms(10)}]}/><Text style={s.legendTxt}>{x.l}</Text>
                    </View>
                ))}
            </View>
        </Card>

        {/* ── Day-of-Week Visit Pattern ── */}
        <Card>
            <SecTitle title="Day-of-Week Visit Pattern" sub="Which days you prefer to visit doctors" />
            <View style={[s.barChartWrap,{alignItems:'flex-end',justifyContent:'space-around'}]}>
                {[{d:'Mon',v:5},{d:'Tue',v:9},{d:'Wed',v:8},{d:'Thu',v:7},{d:'Fri',v:5},{d:'Sat',v:0},{d:'Sun',v:0}].map((x,i) => {
                    const barH = Math.max(0, Math.round((x.v/9)*vs(65)));
                    const isWeekend = i>=5;
                    return (
                        <View key={i} style={{alignItems:'center',flex:1}}>
                            <Text style={[s.barAmt,{color:isWeekend?'#CBD5E1':C.teal}]}>{x.v}</Text>
                            <View style={{height:vs(65),width:ms(20),backgroundColor:'#F1F5F9',borderRadius:ms(4),justifyContent:'flex-end',overflow:'hidden',alignSelf:'center'}}>
                                {barH > 0 && <View style={{height:barH,width:'100%',backgroundColor:isWeekend?C.gray+'33':C.teal+'BB',borderRadius:ms(4)}} />}
                            </View>
                            <Text style={[s.barLbl,{color:isWeekend?'#CBD5E1':undefined}]}>{x.d}</Text>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── Visit Trigger Analysis ── */}
        <Card>
            <SecTitle title="Visit Trigger Analysis" sub="What drives each visit – scheduled vs reactive" />
            {[
                {lbl:'Scheduled follow-up',             val:22, color:C.teal,   pct:65},
                {lbl:'Referred by doctor',              val:8,  color:C.purple, pct:23},
                {lbl:'Self-initiated (proactive)',       val:2,  color:C.blue,   pct:6},
                {lbl:'Reactive (symptom)',               val:2,  color:C.amber,  pct:6},
            ].map((t,i) => (
                <View key={i} style={s.drugRow}>
                    <View style={[s.dot,{backgroundColor:t.color}]} />
                    <Text style={[s.condName,{width:ms(140)}]} numberOfLines={1}>{t.lbl}</Text>
                    <View style={{flex:1,marginHorizontal:ms(6)}}>
                        <Bar pct={t.pct} color={t.color} h={7} />
                    </View>
                    <Text style={[s.condAmt,{color:t.color}]}>{t.val}</Text>
                </View>
            ))}
        </Card>

        {/* ── Diagnostic Yield by Specialty ── */}
        <Card>
            <SecTitle title="Diagnostic Yield by Specialty" sub="New diagnoses discovered per specialty visit" />
            <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end'}}>
                {[
                    {sp:'Endocrinology',  yield:2, color:C.teal},
                    {sp:'Cardiology',     yield:2, color:C.purple},
                    {sp:'General Phys.',  yield:1, color:C.amber},
                    {sp:'Ophthalmology',  yield:1, color:C.blue},
                    {sp:'Physiotherapy',  yield:1, color:C.orange},
                ].map((x,i) => {
                    const barH = Math.round((x.yield/2)*vs(60));
                    return (
                        <View key={i} style={{alignItems:'center',flex:1}}>
                            <Text style={[s.barAmt,{fontFamily:interMedium,color:x.color}]}>{x.yield}</Text>
                            <View style={{height:vs(60),width:ms(28),backgroundColor:'#F1F5F9',borderRadius:ms(6),justifyContent:'flex-end',overflow:'hidden'}}>
                                <View style={{height:barH,width:'100%',backgroundColor:x.color+'BB',borderRadius:ms(6)}} />
                            </View>
                            <Text style={[s.barLbl,{textAlign:'center',marginTop:vs(4)}]} numberOfLines={2}>{x.sp}</Text>
                        </View>
                    );
                })}
            </View>
        </Card>

        {/* ── Doctor Loyalty Score ── */}
        <Card>
            <SecTitle title="Doctor Loyalty Score" sub="How consistently you return to the same doctor" />
            {DOCTORS.map((d,i) => {
                const loyaltyColor = d.loyalty===100 ? C.green : d.loyalty>=80 ? C.amber : C.orange;
                const loyaltyLabel = d.loyalty===100 ? 'Loyal' : d.loyalty>=80 ? 'Consistent' : 'Mixed';
                return (
                    <View key={i} style={s.adhRow}>
                        <View style={{flex:1,minWidth:0}}>
                            <Text style={s.adhName}>{d.name}</Text>
                            <Text style={s.adhMeta}>{d.visits} visits · {d.streakLbl} · {d.note}</Text>
                        </View>
                        <View style={{width:ms(80),marginHorizontal:ms(8)}}>
                            <View style={{flexDirection:'row',justifyContent:'flex-end',marginBottom:vs(2)}}>
                                <Text style={[s.barAmt,{color:loyaltyColor,fontFamily:interMedium}]}>{d.loyalty}%</Text>
                            </View>
                            <Bar pct={d.loyalty} color={loyaltyColor} h={5} />
                        </View>
                        <Pill label={loyaltyLabel} color={loyaltyColor} />
                    </View>
                );
            })}
        </Card>

        {/* ── Missed & Overdue ── */}
        <Card>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:vs(10)}}>
                <View>
                    <Text style={s.secTitle}>Missed & Overdue Appointments</Text>
                    <Text style={s.secSub}>Scheduled but not attended</Text>
                </View>
                <Pill label="2 missed" color={C.red} />
            </View>
            {[
                {doc:'Dr. Suresh Reddy',sp:'Cardiology · Yashoda',scheduled:'Oct 14, 2024',reason:'Travel conflict – rescheduled then missed again'},
                {doc:'Dr. Suresh Reddy',sp:'Cardiology · Yashoda',scheduled:'Dec 08, 2024',reason:'No reason recorded – did not reschedule'},
            ].map((m,i) => (
                <View key={i} style={s.missedRow}>
                    <View style={[s.missedIcon,{backgroundColor:'#FEF2F2'}]}>
                        <Icon type={Icons.Ionicons} name="close-circle-outline" size={ms(15)} color={C.red} />
                    </View>
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.adhName}>{m.doc}</Text>
                        <Text style={s.adhMeta}>{m.sp} · Scheduled {m.scheduled}</Text>
                        <Text style={s.adhMeta}>{m.reason}</Text>
                    </View>
                    <Pill label="Missed" color={C.red} />
                </View>
            ))}
            <View style={s.insightBox}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color={C.indigo} />
                <Text style={s.insightTxt}>Both missed visits were cardiology follow-ups. Dr. Suresh Reddy's <Text style={{fontFamily:interMedium}}>Apr 18 appointment</Text> is critical – the first lipid panel post-Rosuvastatin must be reviewed in person.</Text>
            </View>
        </Card>

        {/* ── Upcoming Appointments ── */}
        <Card>
            <SecTitle title="Upcoming Appointments" sub="Scheduled and recommended next visits" />
            {[
                {doc:'Dr. Priya Nair',        sp:'Endocrinology · Apollo',   dt:'Apr 3, 2025',  type:'Follow-up',      color:C.teal,   urgency:'Confirmed'},
                {doc:'Lipid Profile (Lab)',    sp:"Dr. Lal Pathlabs",         dt:'Apr 5, 2025',  type:'Test',           color:C.blue,   urgency:'Pre-visit test'},
                {doc:'Dr. Suresh Reddy',       sp:'Cardiology · Yashoda',    dt:'Apr 18, 2025', type:'Consultation',   color:C.purple, urgency:'Critical – post-statin review'},
                {doc:'Dr. Priya Nair',        sp:'Endocrinology · Apollo',   dt:'Jun 2025',     type:'6-Month Review', color:C.teal,   urgency:'Scheduled'},
            ].map((u,i) => (
                <View key={i} style={s.fuRow}>
                    <View style={[s.fuDot,{backgroundColor:u.color}]} />
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.adhName}>{u.doc}</Text>
                        <Text style={s.adhMeta}>{u.sp} · {u.type}</Text>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                        <Text style={[s.barAmt,{color:u.color,fontFamily:interMedium,fontSize:ms(11)}]}>{u.dt}</Text>
                        <Text style={s.adhMeta}>{u.urgency}</Text>
                    </View>
                </View>
            ))}
        </Card>

        {/* ── Visit Seasonality ── */}
        <Card>
            <SecTitle title="Visit Seasonality" sub="Which quarters you visit most" />
            <View style={{flexDirection:'row',gap:ms(8)}}>
                {[
                    {q:'Q1 Jan–Mar',icon:'🌸',visits:7,  spend:'₹6,100', bg:'#F0FDFA', border:'rgba(13,148,136,0.15)',  color:C.teal},
                    {q:'Q2 Apr–Jun',icon:'☀️',visits:6,  spend:'₹4,200', bg:'#F8FAFC', border:'rgba(0,0,0,0.06)',       color:C.gray},
                    {q:'Q3 Jul–Sep',icon:'🌧️',visits:8,  spend:'₹5,800', bg:'#F8FAFC', border:'rgba(0,0,0,0.06)',       color:C.gray},
                    {q:'Q4 Oct–Dec',icon:'❄️',visits:13, spend:'₹9,200', bg:'#EDE9FE', border:'rgba(124,58,237,0.12)', color:C.purple},
                ].map((q,i) => (
                    <View key={i} style={[s.seasonCard,{backgroundColor:q.bg,borderColor:q.border}]}>
                        <Text style={[s.seasonName,{color:q.color}]}>{q.q}</Text>
                        <Text style={s.seasonIcon}>{q.icon}</Text>
                        <Text style={[s.seasonCount,{color:q.color}]}>{q.visits}</Text>
                        <Text style={s.seasonSub}>visits · {q.spend}</Text>
                    </View>
                ))}
            </View>
            <View style={s.insightBox}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color={C.indigo} />
                <Text style={s.insightTxt}>Q4 is your heaviest quarter – <Text style={{fontFamily:interMedium}}>13 visits (38%)</Text>. Nov/Dec aligns with your 6-month review cycle. Q3 spikes due to festive-season illness patterns. Consider spreading Q4 visits into January to avoid holiday scheduling conflicts.</Text>
            </View>
        </Card>

        {/* ── Referral Network ── */}
        <Card>
            <SecTitle title="Referral Network" sub="Which doctors referred you to other specialists" />
            {[
                {from:'Dr. Priya Nair',     to:'Dr. Suresh Reddy',          reason:'High LDL detected in Nov 2024 lipid panel', date:'Jan 2025', color:C.teal},
                {from:'Dr. Kavitha Iyer',   to:'Dr. Ramya Srinivas',        reason:'Back pain complaint Jan 2025',               date:'Jan 2025', color:C.amber},
                {from:'Self',               to:'Dr. Anand Krishnamurthy',   reason:'Self-booked annual eye exam',                date:'Nov 2024', color:C.gray},
                {from:'Self',               to:'Thyrocare',                  reason:'Self-ordered full-body check',               date:'Feb 2024', color:C.gray},
            ].map((r,i) => (
                <View key={i} style={s.refRow}>
                    <View style={[s.fuDot,{backgroundColor:r.color}]} />
                    <View style={{flex:1,minWidth:0}}>
                        <Text style={s.adhName}>{r.from} <Text style={{color:C.gray,fontFamily:interRegular}}>→</Text> {r.to}</Text>
                        <Text style={s.adhMeta}>{r.reason}</Text>
                    </View>
                    <Text style={[s.barAmt,{color:C.gray,fontSize:ms(10),fontFamily:interMedium}]}>{r.date}</Text>
                </View>
            ))}
        </Card>

        {/* ── Behavioural Patterns & Insights ── */}
        <Card>
            <SecTitle title="Behavioural Patterns & Insights" sub="Patterns detected across 34 visits and 24 months" />
            {[
                {icon:'📅', title:'Scheduling Pattern', bg:'#F0FDFA', border:'rgba(13,148,136,0.2)',  color:C.teal,   body:'You book appointments 4.2 days in advance on average – a reasonably planned healthcare consumer. You never walk in without booking, and 100% of visits are weekday (Tue–Thu cluster). No emergency walk-ins in 24 months.'},
                {icon:'🔄', title:'Follow-up Pattern',  bg:'#EDE9FE', border:'rgba(124,58,237,0.2)', color:C.purple, body:'You maintain 94% follow-up compliance – well above the typical 70% for chronic disease patients. Both misses were cardiology (specialist reluctance pattern). Your endocrinology compliance is 100% across 14 visits.'},
                {icon:'⚡', title:'Reactive vs Proactive',bg:'#FEF3C7',border:'rgba(217,119,6,0.2)',  color:C.amber,  body:'Only 2 of 34 visits were self-initiated (annual eye exam, full body check). The rest were doctor-directed follow-ups. This is slightly passive – consider adding one proactive GP review per quarter to catch emerging issues earlier.'},
            ].map((ins,i) => (
                <View key={i} style={[s.trioCard,{backgroundColor:ins.bg,borderColor:ins.border,marginBottom:vs(10)}]}>
                    <Text style={s.trioIcon}>{ins.icon}</Text>
                    <Text style={[s.trioTitle,{color:ins.color}]}>{ins.title}</Text>
                    <Text style={[s.trioBdy,{color:ins.color}]}>{ins.body}</Text>
                </View>
            ))}
        </Card>

        <View style={{height:vs(30)}}/>
    </ScrollView>
);

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const DoctorAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Spend');

    return (
        <LinearGradient colors={globalGradient2} start={{x:0,y:0}} end={{x:0,y:1}} locations={[0,0.18]} style={s.flex1}>
            <SafeAreaView style={s.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <View style={{flex:1}}>
                        <Text style={s.headerTitle}>Doctor Analytics </Text>
                        <Text style={s.headerSub}>Spend · Behaviour · Visit Patterns</Text>
                    </View>
                </View>

                {/* Tab Bar */}
                <View style={s.tabBar}>
                    {[
                        {key:'Spend',     label:'Spend Analytics',    icon:'cash-outline'},
                        {key:'Behaviour', label:'Behaviour Analytics', icon:'people-outline'},
                    ].map(tab => (
                        <TouchableOpacity key={tab.key}
                            style={[s.tab, activeTab===tab.key && s.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(14)} color={activeTab===tab.key ? whiteColor : '#94A3B8'} />
                            <Text style={[s.tabTxt, activeTab===tab.key && s.tabTxtActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'Spend' ? <SpendTab /> : <BehaviourTab />}
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DoctorAnalyticsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    flex1: { flex:1 },

    header:      { flexDirection:'row', alignItems:'center', paddingHorizontal:ms(20), paddingTop:ms(50), paddingBottom:vs(14), backgroundColor:'transparent' },
    backBtn:     { width:ms(35), height:ms(35), borderRadius:ms(17.5), backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center', marginRight:ms(12) },
    headerTitle: { fontFamily:heading, fontSize:ms(18), color:whiteColor },
    headerSub:   { fontFamily:interRegular, fontSize:ms(11), color:'#64748B'},

    tabBar:      { flexDirection:'row', marginHorizontal:ms(20), backgroundColor:whiteColor, borderRadius:ms(12), padding:ms(4), marginBottom:vs(8), shadowColor:'#000', shadowOpacity:0.07, shadowRadius:4, elevation:2 },
    tab:         { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:ms(4), paddingVertical:vs(8), borderRadius:ms(9) },
    tabActive:   { backgroundColor: primaryColor },
    tabTxt:      { fontFamily:interMedium, fontSize:ms(12), color:'#94A3B8' },
    tabTxtActive:{ color:whiteColor },

    tabContent: { paddingHorizontal:ms(16), paddingTop:vs(4) },

    // Hero
    hero:        { borderRadius:ms(16), padding:ms(16), marginBottom:vs(12) },
    heroMainRow: { marginBottom:vs(12) },
    heroLeft:    {},
    heroNum:     { fontFamily:heading, fontSize:ms(42), color:whiteColor, lineHeight:ms(48) },
    heroUnit:    { fontSize:ms(18), opacity:0.65 },
    heroLbl:     { fontFamily:interRegular, fontSize:ms(10), color:'rgba(255,255,255,0.55)', marginTop:vs(2) },
    heroKpis:    { flexDirection:'row', flexWrap:'wrap', marginBottom:vs(12) },
    heroKpi:     { width:'33%', paddingVertical:vs(4), paddingRight:ms(6) },
    heroKpiN:    { fontFamily:heading, fontSize:ms(15), color:whiteColor },
    heroKpiL:    { fontFamily:interRegular, fontSize:ms(9), color:'rgba(255,255,255,0.5)', marginTop:vs(1) },
    heroChips:   { flexDirection:'row', flexWrap:'wrap', gap:ms(6) },
    heroChip:    { paddingHorizontal:ms(9), paddingVertical:vs(4), borderRadius:ms(20) },
    heroChipTxt: { fontFamily:interMedium, fontSize:ms(10) },

    // Stat strip
    stripScroll: { marginBottom:vs(12) },
    statStrip:   { backgroundColor:whiteColor, borderRadius:ms(10), padding:ms(12), marginRight:ms(8), minWidth:ms(120), borderTopWidth:2.5, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:3, elevation:2 },
    stripLbl:    { fontFamily:interRegular, fontSize:ms(9), color:'#94A3B8', textTransform:'uppercase', letterSpacing:0.5, marginBottom:vs(3) },
    stripVal:    { fontFamily:heading, fontSize:ms(18), marginBottom:vs(2) },
    stripSub:    { fontFamily:interRegular, fontSize:ms(10), color:primaryColor },

    card:        { backgroundColor:whiteColor, borderRadius:ms(14), padding:ms(14), marginBottom:vs(12), shadowColor:'#000', shadowOpacity:0.06, shadowRadius:4, elevation:2 },
    secTitleWrap:{ marginBottom:vs(10) },
    secTitle:    { fontFamily:interMedium, fontSize:ms(13), color:blackColor },
    secSub:      { fontFamily:interRegular, fontSize:ms(10), color:'#94A3B8', marginTop:vs(1) },

    barChartWrap:{ flexDirection:'row', gap:ms(4), alignItems:'flex-end' },
    barCol:      { alignItems:'center', minWidth:ms(22) },
    barAmt:      { fontFamily:interRegular, fontSize:ms(8), color:'#64748B', marginBottom:vs(2) },
    barLbl:      { fontFamily:interRegular, fontSize:ms(8), color:'#94A3B8', marginTop:vs(3) },

    barBg:       { backgroundColor:'#F1F5F9', borderRadius:ms(3), overflow:'hidden' },
    barFill:     { borderRadius:ms(3) },

    legendRow:   { flexDirection:'row', flexWrap:'wrap', gap:ms(4), marginTop:vs(8), alignItems:'center' },
    legendItem:  { flexDirection:'row', alignItems:'center', gap:ms(4) },
    legendDot:   { width:ms(8), height:ms(8), borderRadius:ms(4) },
    legendTxt:   { fontFamily:interRegular, fontSize:ms(10), color:'#64748B' },

    drugRow:     { flexDirection:'row', alignItems:'center', marginBottom:vs(8) },
    dot:         { width:ms(8), height:ms(8), borderRadius:ms(4), marginRight:ms(6) },
    condName:    { fontFamily:interRegular, fontSize:ms(11), color:'#64748B', width:ms(90) },
    condAmt:     { fontFamily:interMedium, fontSize:ms(11), minWidth:ms(50), textAlign:'right' },

    pill:        { paddingHorizontal:ms(7), paddingVertical:vs(2), borderRadius:ms(4) },
    pillTxt:     { fontFamily:interMedium, fontSize:ms(9), letterSpacing:0.2 },

    avatar:      { width:ms(34), height:ms(34), borderRadius:ms(17), justifyContent:'center', alignItems:'center', flexShrink:0 },
    avatarTxt:   { fontFamily:interMedium, fontSize:ms(11) },

    rankRow:     { flexDirection:'row', alignItems:'center', gap:ms(8), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F1F5F9' },
    rankNum:     { fontFamily:interMedium, fontSize:ms(11), color:'#94A3B8', width:ms(18) },
    rankName:    { fontFamily:interMedium, fontSize:ms(12), color:blackColor },
    rankMeta:    { fontFamily:interRegular, fontSize:ms(10), color:'#94A3B8', marginBottom:vs(3) },
    rankVal:     { fontFamily:heading, fontSize:ms(13), minWidth:ms(55), textAlign:'right' },

    cpoRow:      { flexDirection:'row', alignItems:'flex-start', gap:ms(8), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F8FAFC' },
    cpoName:     { fontFamily:interMedium, fontSize:ms(12), color:blackColor },
    cpoMeta:     { fontFamily:interRegular, fontSize:ms(10), color:'#94A3B8', marginTop:vs(1) },
    cpoAmt:      { fontFamily:heading, fontSize:ms(14) },
    cpoCostLbl:  { fontFamily:interRegular, fontSize:ms(9), color:'#94A3B8' },

    bubbleWrap:  { flexDirection:'row', flexWrap:'wrap', gap:ms(10), justifyContent:'center', alignItems:'center', paddingVertical:vs(10) },
    bubble:      { justifyContent:'center', alignItems:'center' },
    bubbleName:  { fontFamily:interMedium, textAlign:'center' },
    bubbleAmt:   { fontFamily:interMedium, fontSize:ms(9), textAlign:'center' },

    benchGrid:   { flexDirection:'row', flexWrap:'wrap', gap:ms(8) },
    benchCard:   { width:'47%', borderRadius:ms(10), padding:ms(10) },
    benchLbl:    { fontFamily:interMedium, fontSize:ms(9), textTransform:'uppercase', letterSpacing:0.5, marginBottom:vs(4) },
    benchVal:    { fontFamily:heading, fontSize:ms(20) },

    insightBox:  { flexDirection:'row', gap:ms(8), backgroundColor:'#EEF2FF', borderRadius:ms(10), padding:ms(10), marginTop:vs(10), alignItems:'flex-start' },
    insightTxt:  { fontFamily:interRegular, fontSize:ms(11), color:'#5B21B6', flex:1, lineHeight:ms(16) },
    insightBullet:{ flexDirection:'row', gap:ms(8), marginBottom:vs(8), alignItems:'flex-start' },
    insightBulletIcon:{ fontSize:ms(14), marginTop:vs(1) },

    adhRow:      { flexDirection:'row', alignItems:'center', gap:ms(8), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F8FAFC' },
    adhInfo:     { width:ms(110) },
    adhName:     { fontFamily:interMedium, fontSize:ms(12), color:blackColor },
    adhMeta:     { fontFamily:interRegular, fontSize:ms(10), color:'#94A3B8', marginTop:vs(1), lineHeight:ms(14) },
    adhBarWrap:  { flex:1 },

    missedRow:   { flexDirection:'row', alignItems:'flex-start', gap:ms(10), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F8FAFC' },
    missedIcon:  { width:ms(30), height:ms(30), borderRadius:ms(8), justifyContent:'center', alignItems:'center' },

    fuRow:       { flexDirection:'row', alignItems:'flex-start', gap:ms(10), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F8FAFC' },
    fuDot:       { width:ms(9), height:ms(9), borderRadius:ms(5), marginTop:vs(4) },

    refRow:      { flexDirection:'row', alignItems:'flex-start', gap:ms(10), paddingVertical:vs(8), borderBottomWidth:0.5, borderBottomColor:'#F8FAFC' },

    seasonCard:  { flex:1, borderRadius:ms(10), padding:ms(8), alignItems:'center', borderWidth:1 },
    seasonName:  { fontFamily:interMedium, fontSize:ms(9), textTransform:'uppercase', letterSpacing:0.5, marginBottom:vs(3), textAlign:'center' },
    seasonIcon:  { fontSize:ms(18), marginVertical:vs(3) },
    seasonCount: { fontFamily:heading, fontSize:ms(20) },
    seasonSub:   { fontFamily:interRegular, fontSize:ms(9), color:'#94A3B8', textAlign:'center', marginTop:vs(2) },

    trioCard:    { borderRadius:ms(12), padding:ms(14), borderWidth:1 },
    trioIcon:    { fontSize:ms(18), marginBottom:vs(5) },
    trioTitle:   { fontFamily:interMedium, fontSize:ms(12), marginBottom:vs(5) },
    trioBdy:     { fontFamily:interRegular, fontSize:ms(11), lineHeight:ms(16) },
});
