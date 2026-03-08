import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const PRESCRIPTIONS = [
    {
        doctor: 'Dr.Sindhu recommended',
        date: '14 Nov 2025, 9:30 AM',
        medicine: 'Paracetamol',
        dosage: '500mg',
        duration: '2 Weeks',
        timing: 'Morning',
        instruction: 'Before Food',
    },
    {
        doctor: 'Dr.Sindhu recommended',
        date: '14 Nov 2025, 9:30 AM',
        medicine: 'Amoxicillin',
        dosage: '250mg',
        duration: '1 Week',
        timing: 'Morning',
        instruction: 'After Food',
    },
    {
        doctor: 'Dr.Sindhu recommended',
        date: '14 Nov 2025, 9:30 AM',
        medicine: 'Cetirizine',
        dosage: '10mg',
        duration: '5 Days',
        timing: 'Night',
        instruction: 'After Food',
    },
];

const PrescriptionScreen = () => {
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Prescription</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {PRESCRIPTIONS.map((item, index) => (
                        <View key={index} style={styles.card}>
                            {/* Doctor recommended pill */}
                            <LinearGradient
                                colors={['#FBCFE8', whiteColor]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.doctorPill}
                            >
                                <Icon type={Icons.MaterialCommunityIcons} name="stethoscope" size={ms(14)} color={blackColor} />
                                <Text style={styles.doctorPillText}>{item.doctor}</Text>
                            </LinearGradient>

                            {/* Date */}
                            <Text style={styles.dateText}>{item.date}</Text>

                            {/* Medicine row */}
                            <View style={styles.medicineRow}>
                                <View style={styles.pillIconWrap}>
                                    <Icon type={Icons.MaterialCommunityIcons} name="pill" size={ms(20)} color="#6B7280" />
                                </View>
                                <View style={styles.medicineInfo}>
                                    <Text style={styles.medicineName}>{item.medicine}</Text>
                                    <Text style={styles.medicineDosage}>{item.dosage}</Text>
                                </View>
                                <View style={styles.durationBadge}>
                                    <Text style={styles.durationText}>{item.duration}</Text>
                                </View>
                            </View>

                            {/* Timing row */}
                            <View style={styles.timingRow}>
                                <Text style={styles.timingText}>{item.timing}</Text>
                                <Text style={styles.timingText}>{item.instruction}</Text>
                            </View>

                            {/* View more */}
                            {/* <TouchableOpacity>
                                <Text style={styles.viewMoreText}>View more</Text>
                            </TouchableOpacity> */}
                        </View>
                    ))}
                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(14),
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(40),
    },
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    doctorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCE4EC',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(8),
        alignSelf: 'flex-start',
        marginBottom: vs(12),
        gap: ms(8),
    },
    doctorPillText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#374151',
    },
    dateText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginBottom: vs(14),
    },
    medicineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(12),
    },
    pillIconWrap: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    medicineInfo: {
        flex: 1,
    },
    medicineName: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
    },
    medicineDosage: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginTop: vs(2),
    },
    durationBadge: {
        backgroundColor: '#DCFCE7',
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
    },
    durationText: {
        fontFamily: bold,
        fontSize: ms(12),
        color: '#16A34A',
    },
    timingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(20),
        marginBottom: vs(12),
    },
    timingText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#374151',
    },
    viewMoreText: {
        fontFamily: bold,
        fontSize: ms(13),
        color: primaryColor,
    },
});

export default PrescriptionScreen;
