import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient,
    grayColor,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const PrescriptionDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        name = 'Suresh Kumar',
        date = 'Mon, 07 Feb, 2026, 12:44:35',
        gender = 'Male',
        age = '24 Years',
        address = '123, Main Street, Hyderabad, Telangana, 500001',
    } = route.params || {};

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.25]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.fullGradient}>
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
                        <Text style={styles.headerTitle}>{name}</Text>
                        <Text style={styles.headerDate}>{date}</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Patient Details Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Patient Details</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Patient</Text>
                            <Text style={styles.detailValue}>{name}</Text>
                            <Text style={styles.detailLabel}>{gender} | {age}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Home visit Address</Text>
                            <Text style={styles.detailValue}>{address}</Text>
                        </View>
                    </View>

                    {/* Attached Prescription */}
                    <Text style={styles.sectionTitle}>Attached Prescription</Text>
                    <View style={styles.prescriptionImageWrap}>
                        <Image
                            source={require('../../assets/img/prescription_sample.png')}
                            style={styles.prescriptionImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Share or Download */}
                    <Text style={styles.shareDownloadText}>
                        Share or Download Your Prescription
                    </Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <Icon
                                type={Icons.Feather}
                                name="download"
                                color={primaryColor}
                                size={ms(22)}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <Icon
                                type={Icons.Feather}
                                name="share-2"
                                color={primaryColor}
                                size={ms(22)}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: vs(10),
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
        flex: 1,
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
        opacity: 0.9,
    },

    // Scroll
    scrollContent: {
        paddingTop: vs(16),
        paddingBottom: vs(40),
    },

    // Patient Details Card
    card: {
        backgroundColor: grayColor,
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(20),
    },
    cardTitle: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
        marginBottom: vs(12),
    },
    detailRow: {
        marginBottom: vs(8),
    },
    detailLabel: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    detailValue: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginTop: vs(2),
    },

    // Attached Prescription
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
        marginBottom: vs(12),
    },
    prescriptionImageWrap: {
        width: '100%',
        height: vs(250),
        borderRadius: ms(14),
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
        marginBottom: vs(24),
        paddingVertical:ms(15)
    },
    prescriptionImage: {
        width: '100%',
        height: '100%',
    },

    // Share / Download
    shareDownloadText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: vs(12),
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: ms(20),
    },
    actionButton: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: '#E2FFFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PrescriptionDetail;
