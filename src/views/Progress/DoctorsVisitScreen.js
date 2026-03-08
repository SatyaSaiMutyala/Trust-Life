import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const VISITS = [
    {
        hospital: 'Rama Hospital',
        doctor: 'Dr.sindhu',
        qualification: 'MBBS, MD',
        specialty: 'Cardiologist',
        date: '4 Feb 2026',
        time: '10:30 AM',
    },
    {
        hospital: 'Rama Hospital',
        doctor: 'Dr.Rakesh',
        qualification: 'MBBS, MD',
        specialty: 'Cardiologist',
        date: '4 Feb 2026',
        time: '10:30 AM',
    },
    {
        hospital: 'Rama Hospital',
        doctor: 'Dr.Sumanth',
        qualification: 'MBBS, MD',
        specialty: 'Cardiologist',
        date: '4 Feb 2026',
        time: '10:30 AM',
    },
    {
        hospital: 'Rama Hospital',
        doctor: 'Dr.sindhu',
        qualification: 'MBBS, MD',
        specialty: 'Cardiologist',
        date: '4 Feb 2026',
        time: '10:30 AM',
    },
    {
        hospital: 'Rama Hospital',
        doctor: 'Dr.sindhu',
        qualification: 'MBBS, MD',
        specialty: 'Cardiologist',
        date: '4 Feb 2026',
        time: '10:30 AM',
    },
];

const DoctorsVisitScreen = () => {
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
                    <Text style={styles.headerTitle}>Doctors Visit</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {VISITS.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.hospitalName}>{item.hospital}</Text>

                            <View style={styles.doctorRow}>
                                <View style={styles.avatarWrap}>
                                    <Icon type={Icons.Ionicons} name="person" size={ms(28)} color="#9CA3AF" />
                                </View>
                                <View style={styles.doctorInfo}>
                                    <Text style={styles.doctorName}>{item.doctor}</Text>
                                    <Text style={styles.doctorQualification}>{item.qualification}</Text>
                                </View>
                                <View style={styles.specialtyBadge}>
                                    <Text style={styles.specialtyText}>{item.specialty}</Text>
                                </View>
                            </View>

                            <View style={styles.dateRow}>
                                <Text style={styles.dateText}>{item.date}</Text>
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
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
    hospitalName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(12),
    },
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(14),
    },
    avatarWrap: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    doctorQualification: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(2),
    },
    specialtyBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: ms(8),
        paddingHorizontal: ms(12),
        paddingVertical: vs(6),
    },
    specialtyText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: blackColor,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    timeText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
});

export default DoctorsVisitScreen;
