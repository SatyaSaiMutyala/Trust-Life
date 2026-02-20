import React, { useState } from 'react';
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
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const FREQUENCY_OPTIONS = [
    { label: '1 -0-0', sub: 'Morning' },
    { label: '0 -1- 0', sub: 'Luch time' },
    { label: '0 -0 - 1', sub: 'Night' },
    { label: 'Custom', sub: '' },
];

const createPrescription = () => ({
    medicineName: '',
    strength: '',
    selectedFrequency: 0,
    durationType: 'Days',
    durationCount: 3,
    instructions: '',
});

const DoctorPrescriptionScreen = () => {
    const navigation = useNavigation();
    const [prescriptions, setPrescriptions] = useState([createPrescription()]);

    const updatePrescription = (index, field, value) => {
        setPrescriptions(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addPrescription = () => {
        setPrescriptions(prev => [...prev, createPrescription()]);
    };

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

                {/* Add Prescription Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}> Prescription</Text>
                </View>

                {prescriptions.map((item, pIdx) => (
                    <View key={pIdx} style={styles.card}>
                        {/* Medicine Name */}
                        <InputField
                            label="Medicine Name"
                            placeholder="Search Medicine Name"
                            value={item.medicineName}
                            onChangeText={(val) => updatePrescription(pIdx, 'medicineName', val)}
                        />

                        {/* Strength */}
                        <InputField
                            label="Strength"
                            placeholder="Select Strength"
                            value={item.strength}
                            onPressIn={() => {}}
                            iconType={Icons.Ionicons}
                            iconName="chevron-down"
                        />

                        {/* Frequency */}
                        <Text style={styles.fieldLabel}>Frequency</Text>
                        <View style={styles.frequencyRow}>
                            {FREQUENCY_OPTIONS.map((freq, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.frequencyItem,
                                        item.selectedFrequency === idx && styles.frequencyItemActive,
                                    ]}
                                    onPress={() => updatePrescription(pIdx, 'selectedFrequency', idx)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.frequencyLabel,
                                        item.selectedFrequency === idx && styles.frequencyLabelActive,
                                    ]}>{freq.label}</Text>
                                    {freq.sub !== '' && (
                                        <Text style={[
                                            styles.frequencySub,
                                            item.selectedFrequency === idx && styles.frequencySubActive,
                                        ]}>{freq.sub}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Duration */}
                        <Text style={styles.fieldLabel}>Duration</Text>
                        <View style={styles.durationRow}>
                            <View style={styles.durationToggle}>
                                <TouchableOpacity
                                    style={[
                                        styles.durationOption,
                                        item.durationType === 'Days' && styles.durationOptionActive,
                                    ]}
                                    onPress={() => updatePrescription(pIdx, 'durationType', 'Days')}
                                >
                                    <Text style={[
                                        styles.durationOptionText,
                                        item.durationType === 'Days' && styles.durationOptionTextActive,
                                    ]}>Days</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.durationOption,
                                        item.durationType === 'Weeks' && styles.durationOptionActive,
                                    ]}
                                    onPress={() => updatePrescription(pIdx, 'durationType', 'Weeks')}
                                >
                                    <Text style={[
                                        styles.durationOptionText,
                                        item.durationType === 'Weeks' && styles.durationOptionTextActive,
                                    ]}>Weeks</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.counterRow}>
                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() => updatePrescription(pIdx, 'durationCount', Math.max(1, item.durationCount - 1))}
                                >
                                    <Text style={styles.counterBtnText}>—</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{item.durationCount} {item.durationType}</Text>
                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() => updatePrescription(pIdx, 'durationCount', item.durationCount + 1)}
                                >
                                    <Text style={styles.counterBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Instructions */}
                        <InputField
                            label="Instructions"
                            placeholder="Eg; Before food, After food, With food"
                            value={item.instructions}
                            onPressIn={() => {}}
                            iconType={Icons.Ionicons}
                            iconName="chevron-down"
                        />
                    </View>
                ))}

                {/* Add Another Medicines */}
                <TouchableOpacity style={styles.addAnotherBtn} activeOpacity={0.7} onPress={addPrescription}>
                    <Text style={styles.addAnotherIcon}>+</Text>
                    <Text style={styles.addAnotherText}>Add another Medicines</Text>
                </TouchableOpacity>

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Save Data"
                    onPress={() => navigation.navigate('SuccessScreen', {
                        title: 'Doctor Prescription',
                        subtitle: 'Saved Successfully',
                        targetScreen: 'TrustMD',
                        useNavigate: true,
                    })}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default DoctorPrescriptionScreen;

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
        marginTop: vs(4),
    },
    sectionTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },

    // Field Label
    fieldLabel: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(8),
    },

    // Frequency
    frequencyRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginBottom: vs(14),
    },
    frequencyItem: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: ms(10),
        paddingVertical: vs(8),
        alignItems: 'center',
    },
    frequencyItemActive: {
        backgroundColor: primaryColor,
    },
    frequencyLabel: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },
    frequencyLabelActive: {
        color: whiteColor,
    },
    frequencySub: {
        fontSize: ms(9),
        color: '#888',
        marginTop: vs(2),
    },
    frequencySubActive: {
        color: whiteColor,
    },

    // Duration
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(14),
        gap: ms(16),
    },
    durationToggle: {
        flexDirection: 'row',
        gap: ms(8),
    },
    durationOption: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
    },
    durationOptionActive: {
        backgroundColor: primaryColor,
    },
    durationOptionText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },
    durationOptionTextActive: {
        color: whiteColor,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    counterBtn: {
        width: ms(28),
        height: ms(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterBtnText: {
        fontSize: ms(18),
        fontWeight: '600',
        color: blackColor,
    },
    counterValue: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },

    // Add Another
    addAnotherBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: primaryColor,
        borderStyle: 'dashed',
        borderRadius: ms(25),
        paddingVertical: vs(12),
        marginBottom: vs(10),
    },
    addAnotherIcon: {
        fontSize: ms(16),
        fontWeight: '600',
        color: primaryColor,
        marginRight: ms(6),
    },
    addAnotherText: {
        fontSize: ms(13),
        fontWeight: '500',
        color: blackColor,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: ms(16),
        paddingBottom: vs(25),
        paddingTop: vs(10),
        backgroundColor: '#F1F5F9',
    },
});
