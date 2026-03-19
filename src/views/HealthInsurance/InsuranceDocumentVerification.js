import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { interMedium, interRegular } from '../../config/Constants';

const DOCUMENTS = [
    {
        id: 'identity',
        title: 'Identity Proof (Aadhar/PAN)',
        subtitle: 'PNG, JPG',
    },
    {
        id: 'address',
        title: 'Address Proof',
        subtitle: 'PNG, JPG',
    },
];

const InsuranceDocumentVerification = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const plan = route.params?.plan;
    const [uploaded, setUploaded] = useState({});

    const handleUpload = (id) => {
        setUploaded((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Document Verification</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.infoText}>
                    Please provide the following documents to process your health insurance application. Supported formats:{' '}
                    <Text style={styles.infoTextBold}>PDF, PNG, JPG (Max 5MB).</Text>
                </Text>

                {DOCUMENTS.map((doc) => (
                    <TouchableOpacity
                        key={doc.id}
                        style={[styles.uploadCard, uploaded[doc.id] && styles.uploadCardDone]}
                        activeOpacity={0.8}
                        onPress={() => handleUpload(doc.id)}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name={uploaded[doc.id] ? 'checkmark-circle' : 'cloud-upload-outline'}
                            size={ms(28)}
                            color={uploaded[doc.id] ? '#16A34A' : '#9CA3AF'}
                        />
                        <Text style={[styles.uploadTitle, uploaded[doc.id] && styles.uploadTitleDone]}>
                            {doc.title}
                        </Text>
                        <Text style={styles.uploadSubtitle}>{doc.subtitle}</Text>
                    </TouchableOpacity>
                ))}

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.reviewBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('InsurancePaymentSuccess', { plan })}
                >
                    <Text style={styles.reviewBtnText}>Review & Pay</Text>
                </TouchableOpacity>
                <Text style={styles.secureText}>Your data is secure and confidential.</Text>
            </View>
        </SafeAreaView>
    );
};

export default InsuranceDocumentVerification;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(50),
        paddingBottom: ms(16),
        gap: ms(12),
        backgroundColor: whiteColor,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        width: ms(36), height: ms(36), borderRadius: ms(18),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: {
        fontFamily: interMedium,
        fontSize: ms(17),
        color: blackColor,
    },

    scroll: {
        paddingHorizontal: ms(20),
        paddingTop: vs(18),
    },

    infoText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: '#6B7280',
        lineHeight: ms(21),
        marginBottom: vs(24),
    },
    infoTextBold: {
        fontFamily: interMedium,
        color: blackColor,
    },

    uploadCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(16),
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingVertical: vs(30),
        paddingHorizontal: ms(20),
        marginBottom: vs(16),
        gap: vs(8),
    },
    uploadCardDone: {
        borderColor: '#86EFAC',
        backgroundColor: '#F0FDF4',
        borderStyle: 'solid',
    },
    uploadTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        textAlign: 'center',
    },
    uploadTitleDone: {
        color: '#16A34A',
    },
    uploadSubtitle: {
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#9CA3AF',
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: whiteColor,
        paddingHorizontal: ms(20),
        paddingTop: vs(14),
        paddingBottom: vs(24),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -3 },
        alignItems: 'center',
    },
    reviewBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(30),
        paddingVertical: vs(14),
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    reviewBtnText: {
        fontFamily: interMedium,
        fontSize: ms(15),
        color: whiteColor,
    },
    secureText: {
        fontFamily: interRegular,
        fontSize: ms(11),
        color: '#9CA3AF',
    },
});
