import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import { bold } from '../../config/Constants';
import { blackColor, globalGradient, whiteColor } from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const CARD_DATA = [
    {
        id: 'medical_records',
        title: 'Medical Records',
        image: require('../../assets/img/mr.png'),
        route: 'MedicalRecords',
    },
    {
        id: 'diagnostic_reports',
        title: 'Diagnostic Reports',
        image: require('../../assets/img/dir.png'),
        route: 'MedicalRecordsVault',
    },
    {
        id: 'medication_prescription',
        title: 'Medication Prescription',
        image: require('../../assets/img/mp.png'),
        route: 'MedicationPrescription',
    },
    {
        id: 'medical_bills',
        title: 'Medical Bills',
        image: require('../../assets/img/mb.png'),
        route: 'MedicalRecordsVault',
    },
    {
        id: 'patient_note',
        title: 'Patient Note',
        image: require('../../assets/img/pn.png'),
        route: 'PatientNote',
    },
    {
        id: 'lifestyle_record',
        title: 'Lifestyle Record',
        image: require('../../assets/img/lr.png'),
        route: 'MedicalRecordsVault',
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
                colors={globalGradient}
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
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('PatientMedicalSummary')}
                    >
                        <LinearGradient
                            colors={['#E2FFFB7D', '#208A7B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            locations={[0, 18]}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerImageWrap}>
                                <Image
                                    source={require('../../assets/img/pm.png')}
                                    style={styles.bannerImage}
                                />
                            </View>
                            <View style={styles.bannerTextWrap}>
                                <Text style={styles.bannerTitle}>Patient & Medical  Summary</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Grid Cards */}
                    <View style={styles.grid}>
                        {CARD_DATA.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.gridCard}
                                activeOpacity={0.8}
                                onPress={() => handleCardPress(item)}
                            >
                                <LinearGradient
                                    colors={['#E2FFFB7D', '#208A7B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 18]}
                                    style={styles.gridGradient}
                                >
                                    <View style={styles.gridImageWrap}>
                                        <Image
                                            source={item.image}
                                            style={styles.gridImage}
                                        />
                                    </View>
                                    <View style={styles.gridTextWrap}>
                                        <Text style={styles.gridTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: whiteColor,
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
        paddingBottom: vs(30),
    },

    // Banner Card
    bannerCard: {
        borderTopLeftRadius: ms(50),
        borderTopRightRadius: ms(50),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10),
        overflow: 'hidden',
        marginBottom: vs(15),
    },
    bannerGradient: {
        paddingHorizontal: ms(15),
        paddingTop: ms(8),
    },
    bannerImageWrap: {
        height: ms(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10),
    },
    bannerTextWrap: {
        paddingVertical: ms(6),
        alignItems: 'center',
    },
    bannerTitle: {
        color: whiteColor,
        fontSize: ms(14),
        fontFamily: bold,
        textAlign: 'center',
    },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: vs(10),
    },

    // Grid Card
    gridCard: {
        width: (width - ms(60)) / 2,
        borderTopLeftRadius: ms(50),
        borderTopRightRadius: ms(50),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10),
        overflow: 'hidden',
    },
    gridGradient: {
        paddingHorizontal: ms(15),
        paddingTop: ms(8),
    },
    gridImageWrap: {
        height: ms(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        borderBottomRightRadius: ms(5),
        borderBottomLeftRadius: ms(5),
    },
    gridTextWrap: {
        // paddingHorizontal: ms(10),
        paddingVertical: ms(8),
    },
    gridTitle: {
        color: whiteColor,
        fontSize: ms(12),
        fontFamily: bold,
        textAlign: 'center',
    },
});

export default PatientHealthRecords;
