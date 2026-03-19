import React, { useState } from 'react';
import {
    SafeAreaView, StyleSheet, Text, View,
    ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import { interMedium, interRegular } from '../../config/Constants';

const RELATIONSHIPS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

const InsuranceNomineeDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const plan = route.params?.plan;

    const [fullName, setFullName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [dob, setDob] = useState('');
    const [mobile, setMobile] = useState('');
    const [showRelPicker, setShowRelPicker] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar4 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nominee Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.infoText}>
                    The nominee is the person who will receive the insurance benefit in your absence.
                </Text>

                {/* Full Name */}
                <Text style={styles.label}>Nominee Full Name</Text>
                <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Full Name"
                        placeholderTextColor="#BDBDBD"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                {/* Relationship */}
                <Text style={styles.label}>Relationship</Text>
                <TouchableOpacity style={styles.inputWrap} onPress={() => setShowRelPicker(!showRelPicker)} activeOpacity={0.8}>
                    <Text style={[styles.input, !relationship && { color: '#BDBDBD' }]}>
                        {relationship || 'Select Relationship'}
                    </Text>
                    <Icon type={Icons.Ionicons} name="chevron-down" size={ms(18)} color="#BDBDBD" />
                </TouchableOpacity>
                {showRelPicker && (
                    <View style={styles.picker}>
                        {RELATIONSHIPS.map((rel) => (
                            <TouchableOpacity
                                key={rel}
                                style={styles.pickerItem}
                                onPress={() => { setRelationship(rel); setShowRelPicker(false); }}
                            >
                                <Text style={[styles.pickerItemText, relationship === rel && { color: primaryColor, fontFamily: interMedium }]}>
                                    {rel}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Date of Birth */}
                <Text style={styles.label}>Date Of Birth</Text>
                <View style={styles.inputWrap}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Select Date of Birth"
                        placeholderTextColor="#BDBDBD"
                        value={dob}
                        onChangeText={setDob}
                        keyboardType="numeric"
                    />
                    <Icon type={Icons.Ionicons} name="calendar-outline" size={ms(18)} color="#BDBDBD" />
                </View>

                {/* Mobile Number */}
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Mobile Number"
                        placeholderTextColor="#BDBDBD"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>

                <View style={{ height: vs(100) }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.confirmBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('InsuranceDocumentVerification', { plan })}
                >
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>
                <Text style={styles.secureText}>Your data is secure and confidential.</Text>
            </View>
        </SafeAreaView>
    );
};

export default InsuranceNomineeDetails;

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
        lineHeight: ms(20),
        marginBottom: vs(24),
    },

    label: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(6),
    },

    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: ms(10),
        paddingHorizontal: ms(14),
        paddingVertical: vs(13),
        marginBottom: vs(18),
    },
    input: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
        padding: 0,
    },

    picker: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        marginTop: -vs(14),
        marginBottom: vs(18),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    pickerItem: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pickerItemText: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
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
    confirmBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(30),
        paddingVertical: vs(14),
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    confirmBtnText: {
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
