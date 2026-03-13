import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const ENGAGEMENTS = [
    {
        label: 'Appointment Adherence',
        icon: 'calendar', iconType: Icons.Ionicons,
        iconColor: '#1A7E70', bgColor: '#E6F4F2',
        status: 'Moderate', statusType: 'moderate',
        prevScore: '72/100', currScore: '73/100',
        desc: 'PDC Score: 0.83 • Adherence Rate: 83.3%',
        screen: 'AppointmentAdherenceScreen',
    },
    {
        label: 'Medication Adherence',
        icon: 'medkit', iconType: Icons.Ionicons,
        iconColor: '#1565C0', bgColor: '#DBEAFE',
        status: 'Good', statusType: 'strong',
        prevScore: '82/100', currScore: '88/100',
        desc: 'PDC Score: 0.93 • Adherence Rate: 92.9%',
        screen: 'MedicationAdherenceScreen',
    },
    {
        label: 'Diagnostic Compliance',
        icon: 'flask', iconType: Icons.Ionicons,
        iconColor: '#7B61FF', bgColor: '#EDE9FE',
        status: 'Active', statusType: 'strong',
        prevScore: '22/25', currScore: '22/25',
        desc: 'Your score has slightly decreased since the last check.',
        screen: 'DiagnosticComplianceScreen',
    },
    {
        label: 'Self Monitoring',
        icon: 'pulse', iconType: Icons.Ionicons,
        iconColor: '#10B981', bgColor: '#DCFCE7',
        status: 'Active', statusType: 'strong',
        prevScore: '22/25', currScore: '22/25',
        desc: 'Your score has slightly decreased since the last check.',
        screen: 'SelfMonitoringScreen',
    },
];

const MedicalEngagementScreen = () => {
    const navigation = useNavigation();

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
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Medical Engagement</Text>
                        <Text style={styles.headerSubtitle}>Track your medical adherence & compliance</Text>
                    </View>
                </View>

                {/* Summary Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerItem}>
                        <Text style={styles.bannerNum}>22</Text>
                        <Text style={styles.bannerLbl}>Total Score</Text>
                    </View>
                    <View style={styles.bannerDivider} />
                    <View style={styles.bannerItem}>
                        <Text style={styles.bannerNum}>3</Text>
                        <Text style={styles.bannerLbl}>Active</Text>
                    </View>
                    <View style={styles.bannerDivider} />
                    <View style={styles.bannerItem}>
                        <Text style={styles.bannerNum}>1</Text>
                        <Text style={styles.bannerLbl}>Moderate</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {ENGAGEMENTS.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <View style={styles.cardRow}>
                                <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                                    <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <View style={styles.cardTopRow}>
                                        <Text style={styles.cardLabel}>{item.label}</Text>
                                        <View style={[
                                            styles.badge,
                                            item.statusType === 'strong'
                                                ? { backgroundColor: '#DCFCE7' }
                                                : { backgroundColor: '#FEF3C7' },
                                        ]}>
                                            <Text style={[
                                                styles.badgeText,
                                                item.statusType === 'strong'
                                                    ? { color: '#16A34A' }
                                                    : { color: '#D97706' },
                                            ]}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.scoreRow}>
                                        <Text style={styles.scoreVal}>{item.prevScore}</Text>
                                        <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(12)} color="#9CA3AF" style={{ marginHorizontal: ms(4) }} />
                                        <Text style={[styles.scoreVal, { color: primaryColor }]}>{item.currScore}</Text>
                                    </View>
                                    <Text style={styles.cardDesc}>{item.desc}</Text>
                                </View>
                                <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1, paddingHorizontal: ms(14), paddingTop: ms(50) },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: ms(14) },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(10), flex: 1 },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },

    banner: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: ms(14), paddingVertical: vs(12), marginBottom: vs(14),
        justifyContent: 'space-around', alignItems: 'center',
    },
    bannerItem: { alignItems: 'center' },
    bannerNum: { fontFamily: bold, fontSize: ms(20), color: whiteColor },
    bannerLbl: { fontFamily: regular, fontSize: ms(10), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },
    bannerDivider: { width: 1, height: vs(32), backgroundColor: 'rgba(255,255,255,0.3)' },

    scrollContent: { paddingBottom: vs(40) },
    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(14), marginBottom: vs(10),
        shadowColor: '#1A7E70', shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 3,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    iconWrap: { width: ms(44), height: ms(44), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center' },
    cardTextWrap: { flex: 1, marginLeft: ms(12) },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(4) },
    cardLabel: { fontFamily: bold, fontSize: ms(13), color: blackColor, flex: 1, marginRight: ms(6) },
    badge: { borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    badgeText: { fontFamily: bold, fontSize: ms(10) },
    scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(3) },
    scoreVal: { fontFamily: bold, fontSize: ms(12), color: '#374151' },
    cardDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280' },
});

export default MedicalEngagementScreen;
