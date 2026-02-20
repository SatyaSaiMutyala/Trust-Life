import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Circle } from 'react-native-svg';
import * as Progress from 'react-native-progress';
import { StatusBar2, StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

// ── Circular Progress ────────────────────────────────────────────────────────
const CircularProgress = ({ percentage = 30, size = ms(100), strokeWidth = ms(8) }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="#E8F5E9" strokeWidth={strokeWidth} fill="none"
                />
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="#4CAF50" strokeWidth={strokeWidth} fill="none"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={{ fontSize: ms(20), fontWeight: '700', color: blackColor }}>{percentage}%</Text>
                <Text style={{ fontSize: ms(10), color: '#888' }}>Low risk</Text>
            </View>
        </View>
    );
};

// ── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, onViewAll }) => (
    <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
        {onViewAll && (
            <TouchableOpacity onPress={onViewAll}>
                <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
        )}
    </View>
);

// ── Bar Chart Data ───────────────────────────────────────────────────────────
const CHART_DATA = [
    { day: 'MON', value: 40 },
    { day: 'TUE', value: 65 },
    { day: 'WED', value: 50 },
    { day: 'THU', value: 75 },
    { day: 'FRI', value: 45 },
    { day: 'SAT', value: 70 },
    { day: 'SUN', value: 35 },
];

// ── Timeline Data ────────────────────────────────────────────────────────────
const TIMELINE_DATA = [
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
    { date: '24 Feb, 2019', title: 'Hypothyroidism Diagnosed', subtitle: 'Dr. Sarah Smith • Routine Check' },
];

// ── Main Screen ──────────────────────────────────────────────────────────────
const TrustMDPatientDetails = () => {
    const navigation = useNavigation();
    const [expandedSections, setExpandedSections] = useState({ metabolic: true });
    const [selectedMeds, setSelectedMeds] = useState([]);

    const toggleMed = (idx) => {
        setSelectedMeds((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Patient Details</Text>
                    <Text style={styles.headerSubtitle}>Last Updated: 4hours ago</Text>
                </View>

                {/* ── Patient Card ── */}
                <View style={styles.card}>
                    <View style={styles.patientRow}>
                        <View style={styles.patientAvatar}>
                            <Icon type={Icons.MaterialIcons} name="person" size={ms(32)} color="#90CAF9" />
                        </View>
                        <View style={styles.patientInfo}>
                            <Text style={styles.patientName}>Rahul Kumar</Text>
                            <Text style={styles.patientGender}>Male</Text>
                            <View style={styles.bloodBadge}>
                                <Text style={styles.bloodText}>Blood O⁺</Text>
                            </View>
                        </View>
                        <Text style={styles.patientAge}>27y, 3m, 6d</Text>
                    </View>
                </View>

                {/* ── Visit Summary ── */}
                <View style={{padding:ms(10)}}>
                    <Text style={styles.cardTitle}>Visit Summary</Text>
                    <View style={styles.visitRow}>
                        {[
                            { image: require('../../assets/img/mdvs1.png'), screen: 'AddDoctorNoteScreen' },
                            { image: require('../../assets/img/mdvs2.png')},
                            { image: require('../../assets/img/mdvs3.png'), screen:'DoctorPrescriptionScreen'},
                        ].map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.visitItem} activeOpacity={0.7} onPress={() => item.screen && navigation.navigate(item.screen)}>
                                <View style={styles.visitIconWrap}>
                                    <Image source={item.image} style={styles.visitImage} resizeMode="contain" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── TrustMD Summary ── */}
                <View style={styles.trustMDCard}>
                    <View style={styles.trustMDBadge}>
                        <Icon type={Icons.MaterialIcons} name="auto-awesome" size={ms(16)} color={whiteColor} />
                        <Text style={styles.trustMDBadgeText}>TrustMD Summary</Text>
                    </View>
                    <Text style={styles.summaryText}>
                        Hi John, your vitals are stable and within the target range. Your adherence to Metformin has improved by 15% this week. Keep maintaining your hydration and 8-hour sleep cycle for optimal recovery.
                    </Text>
                </View>

                {/* ── Health Risk ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Health Risk</Text>
                    <View style={styles.healthRiskRow}>
                        <View style={styles.healthRiskLeft}>
                            <Text style={styles.healthRiskText}>
                                Hi John, your vitals are stable and within the target range. Your adherence to Metformin has improved by
                            </Text>
                        </View>
                        <CircularProgress percentage={30} />
                    </View>
                    <View style={styles.riskBarsRow}>
                        <View style={[styles.riskBar, { backgroundColor: '#4CAF50' }]} />
                        <View style={[styles.riskBar, { backgroundColor: '#8BC34A' }]} />
                        <View style={[styles.riskBar, { backgroundColor: '#FFC107' }]} />
                        <View style={[styles.riskBar, { backgroundColor: '#FF9800' }]} />
                    </View>
                </View>

                {/* ──  ── */}
                <View style={{backgroundColor:whiteColor, padding:ms(10), marginBottom:ms(10), borderRadius:ms(10)}}>
                <SectionHeader title="Condition Cluster" onViewAll={() => {}} />
                <View style={styles.conditionCard}>
                    <TouchableOpacity
                        style={styles.conditionHeader}
                        onPress={() => toggleSection('metabolic')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.conditionTitle}>Metabolic Conditions</Text>
                        <Icon
                            type={Icons.Ionicons}
                            name={expandedSections.metabolic ? 'chevron-up' : 'chevron-down'}
                            size={ms(18)} color="#555"
                        />
                    </TouchableOpacity>
                    {expandedSections.metabolic && (
                        <View style={styles.conditionBody}>
                            <View style={styles.conditionItem}>
                                <Text style={styles.conditionName}>Type 2 Diabetes</Text>
                                <Text style={[styles.conditionStatus, { color: primaryColor, paddingVertical:ms(2), paddingHorizontal:ms(6), backgroundColor:'#E2FFFB', borderRadius:ms(4) }]}>CONTROLLED</Text>
                            </View>
                            <View style={styles.conditionItem}>
                                <Text style={styles.conditionName}>Hypertension</Text>
                                <Text style={[styles.conditionStatus, { color: primaryColor }]}>ACTIVE</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.conditionCard}>
                    <TouchableOpacity
                        style={styles.conditionHeader}
                        onPress={() => toggleSection('respiratory')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.conditionTitle}>Respiratory Conditions</Text>
                        <Icon
                            type={Icons.Ionicons}
                            name={expandedSections.respiratory ? 'chevron-up' : 'chevron-down'}
                            size={ms(18)} color="#555"
                        />
                    </TouchableOpacity>
                    {expandedSections.respiratory && (
                        <View style={styles.conditionBody}>
                            <View style={styles.conditionItem}>
                                <Text style={styles.conditionName}>Asthma</Text>
                                <Text style={[styles.conditionStatus, { color: '#FF9800' }]}>MONITORING</Text>
                            </View>
                        </View>
                    )}
                </View>
                </View>

                {/* ── Diagnosed Diseases ── */}
                <View style={{backgroundColor:whiteColor, padding:ms(10), marginBottom:ms(10), borderRadius:ms(10)}}>
                <SectionHeader title="Diagnosed Diseases" onViewAll={() => {}} />
                <View style={styles.conditionCard}>
                    <View style={styles.diseaseRow}>
                        <Text style={styles.diseaseName}>Hypertension</Text>
                        <Text style={styles.diseaseDuration}>3 Years</Text>
                    </View>
                    <Text style={styles.diseaseSubtitle}>Moderate Severity • Daily Monitoring</Text>
                    <Progress.Bar
                        progress={0.65}
                        width={null}
                        height={ms(15)}
                        borderRadius={ms(10)}
                        color="#FDBA74"
                        unfilledColor="#E0E7EF"
                        borderWidth={0}
                    />
                </View>
                </View>

                {/* ── Active Medication ── */}
                <View style={{backgroundColor:whiteColor, padding:ms(10), marginBottom:ms(10), borderRadius:ms(10)}}>
                <SectionHeader title="Active Medication" onViewAll={() => {}} />
                <View style={styles.conditionCard}>
                    {['Metformin', 'Amlodipine'].map((med, idx) => (
                        <TouchableOpacity key={idx} activeOpacity={0.7} onPress={() => toggleMed(idx)} style={[styles.medicationRow, idx > 0 && { marginTop: vs(14) }]}>
                            <Image source={require('../../assets/img/mdt.png')} style={styles.medicationIcon} resizeMode="contain" />
                            <View style={styles.medicationInfo}>
                                <Text style={styles.medicationName}>{med}</Text>
                                <Text style={styles.medicationDose}>500mg • once Daily ( Morning )</Text>
                            </View>
                            {selectedMeds.includes(idx) ? (
                                <Icon type={Icons.MaterialIcons} name="check-circle" size={ms(26)} color="#4CAF50" />
                            ) : (
                                <Icon type={Icons.MaterialIcons} name="radio-button-unchecked" size={ms(26)} color="#D1D5DB" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
                </View>

                {/* ── Weekly Bar Chart ── */}
                <View style={styles.card}>
                    <View style={styles.chartContainer}>
                        <View style={styles.yAxis}>
                            {[100, 75, 50, 25, 0].map((v) => (
                                <Text key={v} style={styles.yLabel}>{v}</Text>
                            ))}
                        </View>
                        <View style={styles.barsWrap}>
                            {CHART_DATA.map((item) => (
                                <View key={item.day} style={styles.barCol}>
                                    <View style={styles.barTrack}>
                                        <View style={[styles.barFill, { height: `${item.value}%` }]} />
                                    </View>
                                    <Text style={styles.xLabel}>{item.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ── Lifestyle ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Lifestyle</Text>
                    <View style={styles.lifestyleRow}>
                        {[
                            { image: require('../../assets/img/mdsl9.png'), value: '8h', label: 'Sleep' },
                            { image: require('../../assets/img/mdsl-3.png'), value: '2,00', label: 'Calories' },
                            { image: require('../../assets/img/mdsl-2.png'), value: '8h', label: 'Exercise' },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.lifestyleItem}>
                                <Image source={item.image} style={styles.lifestyleImage} resizeMode="contain" />
                                <Text style={styles.lifestyleValue}>{item.value}</Text>
                                <Text style={styles.lifestyleLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Symptom ── */}
                <View style={{backgroundColor:whiteColor, padding:ms(10), marginBottom:ms(10), borderRadius:ms(10)}}>
                <SectionHeader title="Symptom" onViewAll={() => {}} />
                {[
                    { name: 'Headache', score: 3, total: 10, progress: 0.3, color: '#FB923C' },
                    { name: 'Fatigue', score: 5, total: 10, progress: 0.5, color: '#FB923C' },
                ].map((item, idx) => (
                    <View key={idx} style={[styles.conditionCard, idx > 0 && { marginTop: 0 }]}>
                        <View style={styles.symptomHeaderRow}>
                            <Text style={styles.symptomName}>{item.name}</Text>
                            <Text style={styles.symptomScore}>{item.score}/{item.total}</Text>
                        </View>
                        <Progress.Bar
                            progress={item.progress}
                            width={null}
                            height={ms(30)}
                            borderRadius={ms(5)}
                            color={item.color}
                            unfilledColor="#FFEBEE"
                            borderWidth={0}
                        />
                        <View style={styles.symptomLabelRow}>
                            <Text style={styles.symptomLabel}>MILD</Text>
                            <Text style={styles.symptomLabel}>SEVERE</Text>
                        </View>
                    </View>
                ))}
                </View>

                {/* ── Medical Timeline ── */}
                <SectionHeader title="Medical Timeline" onViewAll={() => navigation.navigate('MedicalTimelineScreen')} />
                <View style={styles.card}>
                    {TIMELINE_DATA.map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.timelineRow} activeOpacity={0.7} onPress={() => navigation.navigate('MedicalSummaryScreen')}>
                            {/* Dot + Line */}
                            <View style={styles.timelineDotCol}>
                                <View style={styles.timelineDot} />
                                {idx < TIMELINE_DATA.length - 1 && <View style={styles.timelineLine} />}
                            </View>
                            {/* Content */}
                            <View style={styles.timelineContent}>
                                <Text style={styles.timelineDate}>{item.date}</Text>
                                <Text style={styles.timelineTitle}>{item.title}</Text>
                                <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color="#CCC" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrustMDPatientDetails;

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingBottom: vs(20),
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: ms(50),
        paddingBottom: vs(14),
    },
    headerTitle: {
        fontSize: ms(17),
        fontWeight: '700',
        color: blackColor,
    },
    headerSubtitle: {
        fontSize: ms(11),
        color: '#999',
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(14),
        marginBottom: vs(10),
    },
    cardTitle: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(10),
    },

    // Patient
    patientRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    patientAvatar: {
        width: ms(52),
        height: ms(52),
        borderRadius: ms(26),
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    patientGender: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(1),
    },
    bloodBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: ms(10),
        paddingVertical: vs(2),
        borderRadius: ms(12),
        marginTop: vs(4),
    },
    bloodText: {
        fontSize: ms(10),
        fontWeight: '600',
        color: blackColor,
    },
    patientAge: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },

    // Visit Summary
    visitRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    visitItem: {
        alignItems: 'center',
        width: ms(100),
    },
    visitIconWrap: {
        marginBottom: vs(6),
    },
    visitImage: {
        width: ms(90),
        height: ms(90),
        borderRadius: ms(12),
    },
    visitPlusBadge: {
        position: 'absolute',
        top: -ms(2),
        right: -ms(2),
        width: ms(18),
        height: ms(18),
        borderRadius: ms(9),
        backgroundColor: '#42A5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    visitLabel: {
        fontSize: ms(10),
        color: '#555',
        textAlign: 'center',
        lineHeight: ms(14),
    },

    // TrustMD Summary
    trustMDCard: {
        backgroundColor: '#E2FFFB',
        borderRadius: ms(14),
        padding: ms(14),
        marginBottom: vs(10),
    },
    trustMDBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: primaryColor,
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        borderRadius: ms(20),
        gap: ms(6),
        marginBottom: vs(10),
    },
    trustMDBadgeText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: whiteColor,
    },
    summaryText: {
        fontSize: ms(13),
        color: '#444',
        lineHeight: ms(20),
    },

    // Health Risk
    healthRiskRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    healthRiskLeft: {
        flex: 1,
        paddingRight: ms(12),
    },
    healthRiskText: {
        fontSize: ms(12),
        color: '#555',
        lineHeight: ms(18),
    },
    riskBarsRow: {
        flexDirection: 'row',
        gap: ms(4),
        marginTop: vs(12),
    },
    riskBar: {
        flex: 1,
        height: ms(6),
        borderRadius: ms(3),
    },

    // Section Header
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
        marginTop: vs(6),
    },
    sectionHeaderTitle: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    viewAllText: {
        fontSize: ms(12),
        color: primaryColor,
        fontWeight: '500',
    },

    // Condition Cluster
    conditionCard: {
        // backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        padding: ms(14),
        // marginBottom: vs(10),
    },
    conditionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conditionTitle: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    conditionBody: {
        marginTop: vs(10),
    },
    conditionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    conditionDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    conditionName: {
        fontSize: ms(13),
        color: '#444',
        fontWeight: '500',
    },
    conditionStatus: {
        fontSize: ms(11),
        fontWeight: '700',
    },

    // Diagnosed Diseases
    diseaseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(4),
    },
    diseaseName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    diseaseDuration: {
        fontSize: ms(13),
        color: '#555',
        fontWeight: '500',
    },
    diseaseSubtitle: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(8),
    },
    diseaseBarBg: {
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: '#E0E7EF',
        overflow: 'hidden',
    },
    diseaseBarFill: {
        height: '100%',
        borderRadius: ms(4),
        backgroundColor: primaryColor,
    },

    // Active Medication
    medicationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    medicationIconBg: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(10),
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },
    medicationIcon: {
        width: ms(38),
        height: ms(38),
        marginRight: ms(10),
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    medicationDose: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    medicationCheck: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    medicationCheckActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },

    // Bar Chart
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: vs(140),
    },
    yAxis: {
        justifyContent: 'space-between',
        height: vs(120),
        marginRight: ms(8),
        paddingBottom: vs(2),
    },
    yLabel: {
        fontSize: ms(10),
        color: '#AAA',
        width: ms(22),
        textAlign: 'right',
    },
    barsWrap: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: vs(120),
    },
    barCol: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        width: ms(24),
        height: vs(120),
        justifyContent: 'flex-end',
    },
    barFill: {
        width: '100%',
        backgroundColor: primaryColor,
        borderTopLeftRadius: ms(6),
        borderTopRightRadius: ms(6),
    },
    xLabel: {
        fontSize: ms(9),
        color: '#888',
        marginTop: vs(6),
        fontWeight: '500',
    },

    // Lifestyle
    lifestyleRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    lifestyleItem: {
        alignItems: 'center',
    },
    lifestyleIconBg: {
        width: ms(56),
        height: ms(56),
        borderRadius: ms(14),
        backgroundColor: '#F0FBF8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    lifestyleImage: {
        width: ms(75),
        height: ms(75),
        // marginBottom: vs(6),
    },
    lifestyleValue: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    lifestyleLabel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(1),
    },

    // Symptom
    symptomBlock: {},
    symptomHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    symptomName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    symptomScore: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    symptomBarBg: {
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: '#FFEBEE',
        overflow: 'hidden',
    },
    symptomBarFill: {
        height: '100%',
        borderRadius: ms(5),
        backgroundColor: '#EF5350',
    },
    symptomLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(4),
    },
    symptomLabel: {
        fontSize: ms(9),
        color: '#AAA',
        fontWeight: '500',
    },

    // Medical Timeline
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: vs(70),
    },
    timelineDotCol: {
        alignItems: 'center',
        width: ms(20),
        marginRight: ms(10),
    },
    timelineDot: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: primaryColor,
        marginTop: vs(4),
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#C8E6C9',
        marginTop: vs(4),
    },
    timelineContent: {
        flex: 1,
        paddingBottom: vs(14),
    },
    timelineDate: {
        fontSize: ms(11),
        color: '#999',
        marginBottom: vs(2),
    },
    timelineTitle: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(2),
    },
    timelineSubtitle: {
        fontSize: ms(11),
        color: '#888',
    },
});
