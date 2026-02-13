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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular, doctor } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const DoctorNotes = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const date = route.params?.date || '';

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Doctor Notes</Text>
                        <Text style={styles.headerDate}>{date}</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Doctor Details */}
                    <Text style={styles.sectionTitle}>Doctor Details</Text>
                    <View style={styles.doctorRow}>
                        <Image
                            source={doctor}
                            style={styles.doctorImage}
                            resizeMode="cover"
                        />
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr. Rajesh Kumar</Text>
                            <Text style={styles.doctorQualification}>MBBS</Text>
                        </View>
                    </View>

                    {/* Doctor's Findings */}
                    <Text style={styles.sectionTitle}>Doctor's Findings</Text>
                    <Text style={styles.findingsText}>
                        The doctor diagnosed Seasonal Viral Fever based on symptoms like fever, sore throat, body pain, and fatigue, with stable vital signs and no serious infection detected. The patient is advised to stay hydrated, eat light nutritious food, and avoid cold and oily items for quicker recovery.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const DOCTOR_IMAGE_SIZE = ms(50);

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTextWrap: {
        marginLeft: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
    },
    headerDate: {
        fontFamily: regular,
        fontSize: ms(12),
        color: whiteColor,
        marginTop: vs(2),
    },

    // Content
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },

    // Section Title
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginTop: vs(20),
        marginBottom: vs(14),
    },

    // Doctor Row
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorImage: {
        width: DOCTOR_IMAGE_SIZE,
        height: DOCTOR_IMAGE_SIZE,
        borderRadius: DOCTOR_IMAGE_SIZE / 2,
        borderWidth: ms(2),
        borderColor: '#E5E7EB',
    },
    doctorInfo: {
        marginLeft: ms(12),
    },
    doctorName: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
    },
    doctorQualification: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Findings
    findingsText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        lineHeight: ms(22),
    },
});

export default DoctorNotes;
