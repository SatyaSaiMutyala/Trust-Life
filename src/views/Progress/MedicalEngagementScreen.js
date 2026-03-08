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
        label: 'Doctor Visits', icon: 'calendar', iconType: Icons.Ionicons,
        iconColor: '#2E7D32', bgColor: '#E8F5E9', status: 'Regular', statusType: 'strong',
        description: 'Scheduled consultations with your physician',
    },
    {
        label: 'Prescriptions', icon: 'medkit', iconType: Icons.Ionicons,
        iconColor: '#1565C0', bgColor: '#DBEAFE', status: 'Active', statusType: 'strong',
        description: 'Current medications and dosage tracking',
    },
    {
        label: 'Lab Tests', icon: 'clipboard-check', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#7B61FF', bgColor: '#EDE9FE', status: 'Up to date', statusType: 'strong',
        description: 'Blood work and diagnostic test results',
    },
    {
        label: 'Follow-ups', icon: 'chatbubbles', iconType: Icons.Ionicons,
        iconColor: '#F59E0B', bgColor: '#FEF3C7', status: 'Pending', statusType: 'moderate',
        description: 'Pending follow-up appointments',
    },
    {
        label: 'Specialist Referrals', icon: 'people', iconType: Icons.Ionicons,
        iconColor: '#EC4899', bgColor: '#FCE7F3', status: 'Active', statusType: 'strong',
        description: 'Referrals to specialist doctors',
    },
    {
        label: 'Vaccinations', icon: 'shield-checkmark', iconType: Icons.Ionicons,
        iconColor: '#10B981', bgColor: '#DCFCE7', status: 'Up to date', statusType: 'strong',
        description: 'Immunization records and schedules',
    },
    {
        label: 'Health Insurance', icon: 'card', iconType: Icons.Ionicons,
        iconColor: '#0EA5E9', bgColor: '#E0F2FE', status: 'Active', statusType: 'strong',
        description: 'Insurance coverage and claims status',
    },
    {
        label: 'Emergency Contacts', icon: 'call', iconType: Icons.Ionicons,
        iconColor: '#EF4444', bgColor: '#FEE2E2', status: 'Updated', statusType: 'strong',
        description: 'Emergency contact information on file',
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
                        <Text style={styles.headerSubtitle}>Your medical activities and records</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {ENGAGEMENTS.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7} onPress={() => {
                            if (item.label === 'Doctor Visits') navigation.navigate('DoctorsVisitScreen');
                            if (item.label === 'Prescriptions') navigation.navigate('PrescriptionScreen');
                            if (item.label === 'Lab Tests') navigation.navigate('LabTestsScreen');
                        }}>
                            <View style={styles.cardRow}>
                                <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                                    <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <Text style={styles.cardLabel}>{item.label}</Text>
                                    <Text style={styles.cardDesc}>{item.description}</Text>
                                </View>
                                <View style={item.statusType === 'strong' ? styles.badgeStrong : styles.badgeModerate}>
                                    <Text style={item.statusType === 'strong' ? styles.badgeTextStrong : styles.badgeTextModerate}>
                                        {item.status}
                                    </Text>
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
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: ms(16) },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(10), flex: 1 },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },
    scrollContent: { paddingBottom: vs(40) },
    card: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(10) },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    iconWrap: { width: ms(42), height: ms(42), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center' },
    cardTextWrap: { flex: 1, marginLeft: ms(12) },
    cardLabel: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    cardDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    badgeStrong: { backgroundColor: '#E8F5E9', borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(4), marginRight: ms(6) },
    badgeTextStrong: { fontFamily: bold, fontSize: ms(11), color: '#2E7D32' },
    badgeModerate: { backgroundColor: '#FFF4E5', borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(4), marginRight: ms(6) },
    badgeTextModerate: { fontFamily: bold, fontSize: ms(11), color: '#E07B00' },
});

export default MedicalEngagementScreen;
