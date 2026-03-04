import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import { bold, regular } from '../../config/Constants';
import { blackColor, globalGradient, globalGradient2, primaryColor, whiteColor } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const BANNER_IMAGES = [
    require('../../assets/img/pr-medical.png'),
    require('../../assets/img/pr-diagnostic.png'),
    require('../../assets/img/pr-lifestyle.png'),
    require('../../assets/img/pr-patientnote.png'),
    require('../../assets/img/pr-medicalbills.png'),
];

const CARD_DATA = [
    {
        id: 'medical_records',
        title: 'Medical Records',
        image: require('../../assets/img/pr-medical.png'),
        route: 'MedicalRecords',
        badgeLabel: 'Total Records',
        badgeCount: '120',
    },
    {
        id: 'diagnostic_reports',
        title: 'Diagnostic Reports',
        image: require('../../assets/img/pr-diagnostic.png'),
        route: 'MedicalRecordsVault',
        badgeLabel: 'Total Reports',
        badgeCount: '120',
    },
    {
        id: 'medication_prescription',
        title: 'Medication Prescription',
        image: require('../../assets/img/pr-medication.png'),
        route: 'MedicationPrescription',
        badgeLabel: 'Total Prescriptions',
        badgeCount: '120',
    },
    {
        id: 'lifestyle_record',
        title: 'Lifestyle Record',
        image: require('../../assets/img/pr-lifestyle.png'),
        route: 'MedicalRecordsVault',
        badgeLabel: 'Total Prescriptions',
        badgeCount: '120',
    },
    {
        id: 'patient_note',
        title: 'Patient Note',
        image: require('../../assets/img/pr-patientnote.png'),
        route: 'PatientNote',
        badgeLabel: 'Total Notes',
        badgeCount: '120',
    },
    {
        id: 'medical_bills',
        title: 'Medical Bills',
        image: require('../../assets/img/pr-medicalbills.png'),
        route: 'MedicalBills',
        badgeLabel: 'Total Medical Bills',
        badgeCount: '120',
    },
];

const PatientHealthRecords = () => {
    const navigation = useNavigation();

    const handleCardPress = (item) => {
        navigation.navigate(item.route);
    };

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
                <Text style={styles.headerTitle}>Patient Health Records</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Banner Card - Patient & Medical Summary */}
                    <TouchableOpacity
                        style={styles.bannerCard}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('PatientMedicalSummary')}
                    >
                        <View style={styles.bannerImagesRow}>
                            <View style={[styles.bannerImgWrap, styles.bannerImgSm, { marginTop: ms(20) }]}>
                                <Image source={BANNER_IMAGES[0]} style={styles.bannerImage} />
                            </View>
                            <View style={[styles.bannerImgWrap, styles.bannerImgMd, { marginTop: ms(0) }]}>
                                <Image source={BANNER_IMAGES[1]} style={styles.bannerImage} />
                            </View>
                            <View style={[styles.bannerImgWrap, styles.bannerImgLg, { marginTop: ms(8) }]}>
                                <Image source={BANNER_IMAGES[2]} style={styles.bannerImage} />
                            </View>
                            <View style={[styles.bannerImgWrap, styles.bannerImgMd, { marginTop: ms(0) }]}>
                                <Image source={BANNER_IMAGES[3]} style={styles.bannerImage} />
                            </View>
                            <View style={[styles.bannerImgWrap, styles.bannerImgSm, { marginTop: ms(20) }]}>
                                <Image source={BANNER_IMAGES[4]} style={styles.bannerImage} />
                            </View>
                        </View>
                        <Text style={styles.bannerTitle}>Patient & Medical Summary</Text>
                        <Text style={styles.bannerSubtitle}>
                            Last update :  Feb 28,2026,12:30 PM
                        </Text>
                    </TouchableOpacity>

                    {/* List Cards */}
                    {CARD_DATA.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.listCard}
                            activeOpacity={0.7}
                            onPress={() => handleCardPress(item)}
                        >
                            <Image source={item.image} style={styles.listCardImage} />
                            <View style={styles.listCardInfo}>
                                <Text style={styles.listCardTitle}>{item.title}</Text>
                                <Text style={styles.listCardSubtitle}>
                                    Last update :  Feb 28,2026,12:30 PM
                                </Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeLabel}>
                                        {item.badgeLabel}  </Text>
                                    <Text style={styles.badgeCount}>{item.badgeCount}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    headerTitle: {
        fontSize: ms(22),
        fontFamily: bold,
        color: whiteColor,
        marginBottom: vs(20),
    },
    scrollContent: {
        paddingBottom: vs(80),
    },

    // Banner Card
    bannerCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(18),
        paddingVertical: ms(18),
        paddingHorizontal: ms(16),
        marginBottom: vs(12),
    },
    bannerImagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: ms(14),
    },
    bannerImgWrap: {
        borderRadius: ms(10),
        overflow: 'hidden',
    },
    bannerImgSm: {
        width: ms(42),
        height: ms(42),
    },
    bannerImgMd: {
        width: ms(52),
        height: ms(52),
    },
    bannerImgLg: {
        width: ms(65),
        height: ms(65),
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerTitle: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
        marginBottom: ms(4),
    },
    bannerSubtitle: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#888',
    },

    // List Card
    listCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(12),
        marginBottom: vs(10)
    },
    listCardImage: {
        width: ms(85),
        height: ms(85),
        borderRadius: ms(14),
        resizeMode: 'cover',
        backgroundColor: '#F1F5F9',
    },
    listCardInfo: {
        flex: 1,
        marginLeft: ms(14),
    },
    listCardTitle: {
        fontSize: ms(14),
        fontFamily: bold,
        color: blackColor,
        marginBottom: ms(3),
    },
    listCardSubtitle: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#888',
        marginBottom: ms(8),
    },

    // Badge
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor:'#E2FFFB',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: ms(5),
    },
    badgeLabel: {
        fontSize: ms(11),
        fontFamily: regular,
        color: blackColor,
    },
    badgeCount: {
        fontSize: ms(12),
        fontFamily: bold,
        color: blackColor,
    },
});

export default PatientHealthRecords;
