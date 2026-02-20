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

const VISITED_NOTES = [
    {
        hsCode: 'HS-101',
        condition: 'Acute Viral Fever',
        description: 'Patient reports recurrent migraine episodes triggered by stress. Prescribed preventive medication and advised lifestyle modifications."',
    },
    {
        hsCode: 'HS-101',
        condition: 'Acute Viral Fever',
        description: 'Patient reports recurrent migraine episodes triggered by stress. Prescribed preventive medication and advised lifestyle modifications."',
    },
    {
        hsCode: 'HS-101',
        condition: 'Acute Viral Fever',
        description: 'Patient reports recurrent migraine episodes triggered by stress. Prescribed preventive medication and advised lifestyle modifications."',
    },
];

const DoctorNoteDetailScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Doctor Note</Text>
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

                {/* Visited Notes */}
                <Text style={styles.visitedNotesTitle}>Visited Notes</Text>

                {VISITED_NOTES.map((item, idx) => (
                    <View key={idx} style={styles.noteCard}>
                        <View style={styles.noteHeaderRow}>
                            <View style={styles.hsCodeBadge}>
                                <Text style={styles.hsCodeText}>{item.hsCode}</Text>
                            </View>
                            <Text style={styles.conditionText}>{item.condition}</Text>
                        </View>
                        <Text style={styles.noteDescription}>{item.description}</Text>
                    </View>
                ))}

                <View style={{ height: vs(30) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoctorNoteDetailScreen;

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

    // Visited Notes
    visitedNotesTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(10),
        marginTop: vs(4),
    },

    // Note Card
    noteCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(12),
    },
    noteHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    hsCodeBadge: {
        backgroundColor: '#334155',
        borderRadius: ms(14),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
        marginRight: ms(10),
    },
    hsCodeText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: whiteColor,
    },
    conditionText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    noteDescription: {
        fontSize: ms(12),
        color: '#666',
        lineHeight: ms(18),
    },
});
