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

const AddDoctorNoteScreen = () => {
    const navigation = useNavigation();
    const [hsCodes, setHsCodes] = useState('');
    const [medicalCondition, setMedicalCondition] = useState('');
    const [note, setNote] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Doctor Note</Text>
                <Text style={styles.headerDate}>4 Feb 2026, 10:30 AM</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Hospital Section */}
                <View style={styles.hospitalSection}>
                    <View style={{marginBottom:ms(20)}}>
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

                {/* Visit Notes */}
                <View style={styles.visitNotesHeader}>
                    <Text style={styles.visitNotesTitle}>Visit Notes</Text>
                    <TouchableOpacity style={styles.addCircle}>
                        <Icon type={Icons.Ionicons} name="add-circle-outline" size={ms(26)} color={primaryColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    {/* HS Codes & Medical Condition */}
                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <InputField
                                label="HS Codes"
                                placeholder="Select HS Codes"
                                value={hsCodes}
                                onPressIn={() => {}}
                                iconType={Icons.Ionicons}
                                iconName="chevron-down"
                            />
                        </View>
                        <View style={styles.formCol}>
                            <InputField
                                label="Medical Condition"
                                placeholder="Add Medical condition"
                                value={medicalCondition}
                                onChangeText={setMedicalCondition}
                            />
                        </View>
                    </View>

                    {/* Note */}
                    <InputField
                        label="Note"
                        placeholder="Add Note"
                        value={note}
                        onChangeText={setNote}
                        multiline
                        containerStyle={styles.noteInput}
                    />
                </View>

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Save Data"
                    onPress={() => navigation.navigate('SuccessScreen', {
                        title: 'Doctor Note',
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

export default AddDoctorNoteScreen;

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
    // hospitalIcon: {
    //     width: ms(52),
    //     height: ms(52),
    //     borderRadius: ms(26),
    //     backgroundColor: primaryColor,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginBottom: vs(12),
    // },
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
        backgroundColor:'#F1F5F9',
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

    // Visit Notes
    visitNotesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
        marginTop: vs(4),
    },
    visitNotesTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    addCircle: {},

    // Form
    formRow: {
        flexDirection: 'row',
        gap: ms(12),
        marginBottom: vs(14),
    },
    formCol: {
        flex: 1,
    },
    formLabel: {
        fontSize: ms(12),
        fontWeight: '500',
        color: blackColor,
        marginBottom: vs(6),
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(8),
        paddingHorizontal: ms(10),
        paddingVertical: vs(10),
        backgroundColor: whiteColor,
    },
    selectText: {
        fontSize: ms(11),
        color: '#AAA',
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(8),
        paddingHorizontal: ms(10),
        paddingVertical: vs(10),
        fontSize: ms(11),
        color: blackColor,
        backgroundColor: whiteColor,
    },
    noteInput: {
        minHeight: vs(80),
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
        backgroundColor:'#F1F5F9'
    },
});
