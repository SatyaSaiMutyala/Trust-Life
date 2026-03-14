import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

// status: 'normal' | 'moderate' | 'critical'
const BIO_MARKERS = [
    {
        label: 'Blood Sugar', count: 3, icon: 'water', iconType: Icons.Ionicons,
        iconColor: '#EF4444', bgColor: '#FEE2E2', accentColor: '#EF4444',
        description: 'Glucose, HbA1c, and fasting sugar levels',
        status: 'moderate', tag: 'Moderate',
    },
    {
        label: 'Blood Pressure', count: 2, icon: 'heart', iconType: Icons.Ionicons,
        iconColor: '#EC4899', bgColor: '#FCE7F3', accentColor: '#EC4899',
        description: 'Systolic and diastolic blood pressure readings',
        status: 'critical', tag: 'Critical',
    },
    {
        label: 'Cholesterol', count: 4, icon: 'test-tube', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#8B5CF6', bgColor: '#EDE9FE', accentColor: '#8B5CF6',
        description: 'Total cholesterol, LDL, HDL, and triglycerides',
        status: 'moderate', tag: 'Moderate',
    },
    {
        label: 'Heart Rate', count: 2, icon: 'pulse', iconType: Icons.Ionicons,
        iconColor: '#0EA5E9', bgColor: '#E0F2FE', accentColor: '#0EA5E9',
        description: 'Resting and active heart rate monitoring',
        status: 'normal', tag: 'Normal',
    },
    {
        label: 'Kidney Function', count: 3, icon: 'flask', iconType: Icons.Ionicons,
        iconColor: '#F59E0B', bgColor: '#FEF3C7', accentColor: '#F59E0B',
        description: 'eGFR, creatinine, and BUN levels',
        status: 'moderate', tag: 'Moderate',
    },
    {
        label: 'Liver Function', count: 3, icon: 'beaker', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#78350F', bgColor: '#FEF3C7', accentColor: '#92400E',
        description: 'ALT, AST, and bilirubin levels',
        status: 'normal', tag: 'Normal',
    },
    {
        label: 'Thyroid', count: 3, icon: 'shield-checkmark', iconType: Icons.Ionicons,
        iconColor: '#10B981', bgColor: '#DCFCE7', accentColor: '#10B981',
        description: 'TSH, T3, and T4 hormone levels',
        status: 'critical', tag: 'Critical',
    },
    {
        label: 'Blood Count', count: 4, icon: 'water-outline', iconType: Icons.Ionicons,
        iconColor: '#DC2626', bgColor: '#FEE2E2', accentColor: '#DC2626',
        description: 'RBC, WBC, hemoglobin, and platelet counts',
        status: 'normal', tag: 'Normal',
    },
    {
        label: 'Bio-Markers Status', count: 3, icon: 'analytics', iconType: Icons.Ionicons,
        iconColor: '#1A7E70', bgColor: '#CCEFE9', accentColor: '#1A7E70',
        description: 'Overall biomarker status across key health indicators',
        status: 'moderate', tag: 'Moderate',
    },
    {
        label: 'Stability', count: 3, icon: 'shield-checkmark', iconType: Icons.Ionicons,
        iconColor: '#10B981', bgColor: '#DCFCE7', accentColor: '#10B981',
        description: 'BP, glucose, and heart rate stability indices',
        status: 'normal', tag: 'Stable',
    },
    {
        label: 'Trend Velocity', count: 3, icon: 'trending-up', iconType: Icons.Ionicons,
        iconColor: '#F59E0B', bgColor: '#FEF3C7', accentColor: '#F59E0B',
        description: 'Rate of change across LDL, HbA1c, and eGFR',
        status: 'normal', tag: 'Improving',
    },
];

const STATUS_CONFIG = {
    normal:   { color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-circle' },
    moderate: { color: '#D97706', bg: '#FEF3C7', icon: 'alert-circle' },
    critical: { color: '#DC2626', bg: '#FEE2E2', icon: 'warning' },
};

const BioMarkersScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const filter = route.params?.filter || null;
    const title = route.params?.title || 'Bio Markers';
    const subtitle = filter ? `${filter.length} metrics tracked` : 'Track all your bio marker readings';
    const displayMarkers = filter ? BIO_MARKERS.filter(m => filter.includes(m.label)) : BIO_MARKERS;

    const totalCount  = displayMarkers.reduce((s, m) => s + m.count, 0);
    const normalCount = displayMarkers.filter(m => m.status === 'normal').length;
    const criticalCount = displayMarkers.filter(m => m.status === 'critical').length;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>{subtitle}</Text>
                    </View>
                </View>

                {/* ── Summary Banner ── */}
                {!filter && (
                    <View style={styles.summaryBanner}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryNum}>{totalCount}</Text>
                            <Text style={styles.summaryLabel}>Total{'\n'}Markers</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryNum, { color: '#16A34A' }]}>{normalCount}</Text>
                            <Text style={styles.summaryLabel}>Normal{'\n'}Range</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryNum, { color: '#DC2626' }]}>{criticalCount}</Text>
                            <Text style={styles.summaryLabel}>Need{'\n'}Attention</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryNum, { color: '#D97706' }]}>
                                {displayMarkers.filter(m => m.status === 'moderate').length}
                            </Text>
                            <Text style={styles.summaryLabel}>Under{'\n'}Monitor</Text>
                        </View>
                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {displayMarkers.map((item, index) => {
                        const sc = STATUS_CONFIG[item.status];
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                activeOpacity={0.75}
                                onPress={() => navigation.navigate('BioMarkerDetailScreen', { marker: item.label })}
                            >
                                {/* Left accent bar */}
                                <View style={[styles.accentBar, { backgroundColor: item.accentColor }]} />

                                <View style={styles.cardInner}>
                                    {/* Top row */}
                                    <View style={styles.cardTopRow}>
                                        {/* Icon */}
                                        <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                                            <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                                        </View>

                                        {/* Label + desc */}
                                        <View style={styles.cardTextWrap}>
                                            <Text style={styles.cardLabel}>{item.label}</Text>
                                            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                        </View>

                                        {/* Chevron */}
                                        <View style={[styles.chevronCircle, { backgroundColor: item.bgColor }]}>
                                            <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(14)} color={item.iconColor} />
                                        </View>
                                    </View>

                                    {/* Bottom row */}
                                    <View style={styles.cardBottomRow}>
                                        {/* Markers count */}
                                        <View style={[styles.countChip, { backgroundColor: item.bgColor }]}>
                                            <Icon type={Icons.Ionicons} name="flask-outline" size={ms(11)} color={item.iconColor} />
                                            <Text style={[styles.countChipText, { color: item.iconColor }]}>
                                                {item.count} marker{item.count > 1 ? 's' : ''}
                                            </Text>
                                        </View>

                                        {/* Status badge */}
                                        <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                                            <Icon type={Icons.Ionicons} name={sc.icon} size={ms(11)} color={sc.color} />
                                            <Text style={[styles.statusText, { color: sc.color }]}>{item.tag}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    fullGradient: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(16), paddingTop: ms(50), paddingBottom: vs(14),
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(12), flex: 1 },
    headerTitle: { fontFamily: bold, fontSize: ms(19), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },

    // Summary Banner
    summaryBanner: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginHorizontal: ms(16), marginBottom: vs(14),
        paddingVertical: vs(14),
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 3,
    },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryNum: { fontFamily: bold, fontSize: ms(20), color: blackColor },
    summaryLabel: { fontFamily: regular, fontSize: ms(9.5), color: '#6B7280', textAlign: 'center', marginTop: vs(2), lineHeight: ms(13) },
    summaryDivider: { width: 1, height: vs(34), backgroundColor: '#E5E7EB' },

    // Scroll
    scrollContent: { paddingHorizontal: ms(16), paddingTop: vs(2), paddingBottom: vs(40) },

    // Card
    card: {
        flexDirection: 'row',
        backgroundColor: whiteColor, borderRadius: ms(16),
        marginBottom: vs(10), overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    accentBar: { width: ms(4) },
    cardInner: { flex: 1, padding: ms(14) },

    cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) },
    iconWrap: {
        width: ms(46), height: ms(46), borderRadius: ms(14),
        justifyContent: 'center', alignItems: 'center',
        marginRight: ms(12),
    },
    cardTextWrap: { flex: 1 },
    cardLabel: { fontFamily: bold, fontSize: ms(14), color: blackColor, marginBottom: vs(3) },
    cardDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(15) },
    chevronCircle: {
        width: ms(30), height: ms(30), borderRadius: ms(15),
        justifyContent: 'center', alignItems: 'center', marginLeft: ms(8),
    },

    cardBottomRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    countChip: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingHorizontal: ms(10), paddingVertical: vs(4),
        borderRadius: ms(20),
    },
    countChipText: { fontFamily: bold, fontSize: ms(10.5) },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingHorizontal: ms(10), paddingVertical: vs(4),
        borderRadius: ms(20),
    },
    statusText: { fontFamily: bold, fontSize: ms(10.5) },
});

export default BioMarkersScreen;
