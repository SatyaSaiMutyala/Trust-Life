import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const PRESCRIPTIONS = [
    { name: 'Paracetamol', strength: '500mg', duration: '2 Weeks', time: 'Morning', instruction: 'Before Food' },
    { name: 'Paracetamol', strength: '500mg', duration: '2 Weeks', time: 'Morning', instruction: 'Before Food' },
    { name: 'Paracetamol', strength: '500mg', duration: '2 Weeks', time: 'Morning', instruction: 'Before Food' },
];

const ViewPrescriptionScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Doctor Prescription</Text>
                <Text style={styles.headerDate}>4 Feb 2026, 10:30 AM</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Hospital Section */}
                <View style={styles.hospitalSection}>
                    <View style={{ marginBottom: ms(20) }}>
                        <Image source={require('../../assets/img/pluse.png')} style={{ width: ms(68), height: ms(68) }} resizeMode="contain" />
                    </View>
                    <Text style={styles.hospitalName}>Rama Hospital</Text>
                    <Text style={styles.hospitalAddress}>
                        9-126,Prakash Nagar, Hyderabad, Telangana, 5013356
                    </Text>
                    <Text style={styles.hospitalContact}>
                        +918375456  RamaHospital @gmail.com
                    </Text>
                </View>

                {/* Doctor Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Doctor Information</Text>
                    <View style={styles.doctorRow}>
                        <View style={styles.doctorAvatar}>
                            <Icon type={Icons.MaterialIcons} name="person" size={ms(32)} color="#BDBDBD" />
                        </View>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr.sindhu</Text>
                            <Text style={styles.doctorDegree}>MBBS, MD</Text>
                        </View>
                        <View style={styles.specialtyBadge}>
                            <Text style={styles.specialtyText}>Cardiologist</Text>
                        </View>
                    </View>
                </View>

                {/* Patient Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Patient Information</Text>
                    <View style={styles.patientRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.patientName}>Rahul Kumar</Text>
                            <Text style={styles.patientGender}>Male</Text>
                            <View style={styles.bloodBadge}>
                                <Text style={styles.bloodText}>Blood O⁺</Text>
                            </View>
                        </View>
                        <Text style={styles.patientAge}>27y, 3m, 6d</Text>
                    </View>
                </View>

                {/* Prescription Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Prescription</Text>
                </View>

                {/* Prescription Cards */}
                {PRESCRIPTIONS.map((item, idx) => (
                    <View key={idx} style={styles.prescriptionCard}>
                        <View style={styles.prescriptionTopRow}>
                            <Text style={styles.medicineName}>{item.name}</Text>
                            <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>{item.duration}</Text>
                            </View>
                        </View>
                        <Text style={styles.strengthText}>{item.strength}</Text>
                        <View style={styles.prescriptionBottomRow}>
                            <Text style={styles.timeText}>{item.time}</Text>
                            <Text style={styles.instructionText}>{item.instruction}</Text>
                        </View>
                    </View>
                ))}

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewPrescriptionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
    },
    backBtn: {
        marginRight: ms(10),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
        flex: 1,
    },
    headerDate: {
        fontSize: ms(11),
        color: '#666',
        fontWeight: '500',
    },
    scroll: {
        paddingHorizontal: ms(16),
        paddingTop: vs(10),
    },

    // Hospital
    hospitalSection: {
        alignItems: 'center',
        paddingVertical: vs(20),
    },
    hospitalName: {
        fontSize: ms(18),
        fontWeight: '700',
        color: blackColor,
        marginBottom: vs(6),
    },
    hospitalAddress: {
        fontSize: ms(11),
        color: '#666',
        textAlign: 'center',
        lineHeight: ms(16),
        marginBottom: vs(2),
    },
    hospitalContact: {
        fontSize: ms(11),
        color: '#666',
        textAlign: 'center',
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    cardTitle: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(12),
    },

    // Doctor
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorAvatar: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    doctorDegree: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    specialtyBadge: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(16),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    specialtyText: {
        fontSize: ms(11),
        color: '#555',
        fontWeight: '500',
    },

    // Patient
    patientRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    patientName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    patientGender: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    bloodBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: ms(10),
        paddingVertical: vs(3),
        borderRadius: ms(12),
        marginTop: vs(6),
    },
    bloodText: {
        fontSize: ms(10),
        fontWeight: '600',
        color: '#EF4444',
    },
    patientAge: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },

    // Section Header
    sectionHeader: {
        marginBottom: vs(10),
        marginTop: vs(4),
    },
    sectionTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Prescription Card
    prescriptionCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    prescriptionTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(4),
    },
    medicineName: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    durationBadge: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(16),
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
    },
    durationText: {
        fontSize: ms(11),
        fontWeight: '500',
        color: '#555',
    },
    strengthText: {
        fontSize: ms(12),
        color: '#888',
        marginBottom: vs(10),
    },
    prescriptionBottomRow: {
        flexDirection: 'row',
        gap: ms(30),
    },
    timeText: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },
    instructionText: {
        fontSize: ms(12),
        color: '#555',
        fontWeight: '500',
    },
});
