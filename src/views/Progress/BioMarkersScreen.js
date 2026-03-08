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

const BIO_MARKERS = [
    {
        label: 'Blood Sugar', count: '3', icon: 'water',
        iconType: Icons.Ionicons,
        iconColor: '#EF4444', bgColor: '#FEE2E2',
        description: 'Glucose, HbA1c, and fasting sugar levels',
    },
    {
        label: 'Blood Pressure', count: '2', icon: 'heart',
        iconType: Icons.Ionicons,
        iconColor: '#EC4899', bgColor: '#FCE7F3',
        description: 'Systolic and diastolic blood pressure readings',
    },
    {
        label: 'Cholesterol', count: '4', icon: 'test-tube',
        iconType: Icons.MaterialCommunityIcons,
        iconColor: '#8B5CF6', bgColor: '#EDE9FE',
        description: 'Total cholesterol, LDL, HDL, and triglycerides',
    },
    {
        label: 'Heart Rate', count: '2', icon: 'pulse',
        iconType: Icons.Ionicons,
        iconColor: '#0EA5E9', bgColor: '#E0F2FE',
        description: 'Resting and active heart rate monitoring',
    },
    {
        label: 'Kidney Function', count: '3', icon: 'flask',
        iconType: Icons.Ionicons,
        iconColor: '#F59E0B', bgColor: '#FEF3C7',
        description: 'eGFR, creatinine, and BUN levels',
    },
    {
        label: 'Liver Function', count: '3', icon: 'beaker',
        iconType: Icons.MaterialCommunityIcons,
        iconColor: '#78350F', bgColor: '#FEF3C7',
        description: 'ALT, AST, and bilirubin levels',
    },
    {
        label: 'Thyroid', count: '3', icon: 'shield-checkmark',
        iconType: Icons.Ionicons,
        iconColor: '#10B981', bgColor: '#DCFCE7',
        description: 'TSH, T3, and T4 hormone levels',
    },
    {
        label: 'Blood Count', count: '4', icon: 'water-outline',
        iconType: Icons.Ionicons,
        iconColor: '#DC2626', bgColor: '#FEE2E2',
        description: 'RBC, WBC, hemoglobin, and platelet counts',
    },
];

const BioMarkersScreen = () => {
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Bio Markers</Text>
                        <Text style={styles.headerSubtitle}>Track all your bio marker readings</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {BIO_MARKERS.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('BioMarkerDetailScreen', { marker: item.label })}
                        >
                            <View style={styles.cardRow}>
                                <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                                    <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <Text style={styles.cardLabel}>{item.label}</Text>
                                    <Text style={styles.cardDesc}>{item.description}</Text>
                                </View>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{item.count}</Text>
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

    header: {
        flexDirection: 'row', alignItems: 'center', marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(10), flex: 1 },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },

    scrollContent: { paddingBottom: vs(40) },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(10),
    },
    cardRow: {
        flexDirection: 'row', alignItems: 'center',
    },
    iconWrap: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center',
    },
    cardTextWrap: { flex: 1, marginLeft: ms(12) },
    cardLabel: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    cardDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    countBadge: {
        width: ms(30), height: ms(30), borderRadius: ms(15),
        backgroundColor: blackColor, justifyContent: 'center', alignItems: 'center',
        marginRight: ms(8),
    },
    countText: { fontFamily: bold, fontSize: ms(13), color: whiteColor },
});

export default BioMarkersScreen;
