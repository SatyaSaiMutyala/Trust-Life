import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import SignUpStepper from '../../components/SignUpStepper';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    primaryColor,
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const FAMILY_MEMBERS = [
    {
        id: 'father',
        title: 'Father',
        image: require('../../assets/img/father.png'),
    },
    {
        id: 'mother',
        title: 'Mother',
        image: require('../../assets/img/mother.png'),
    },
    {
        id: 'son',
        title: 'Son',
        image: require('../../assets/img/son.png'),
    },
    {
        id: 'daughter',
        title: 'Daughter',
        image: require('../../assets/img/daugther.png'),
    },
    {
        id: 'other',
        title: 'Other Family Members',
        image: require('../../assets/img/other.png'),
    },
];

const AddFamilyScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const isEdit = route.params?.isEdit ?? false;
    const [expandedId, setExpandedId] = useState(null);
    const [familyData, setFamilyData] = useState({});

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            if (!familyData[id]) {
                setFamilyData((prev) => ({
                    ...prev,
                    [id]: { name: '', mobile: '' },
                }));
            }
        }
    };

    const updateField = (id, field, value) => {
        setFamilyData((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const removeMember = (id) => {
        setExpandedId(null);
        setFamilyData((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const handleNext = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Registration',
            subtitle: 'Completed Successfully',
            delay: 2000,
            targetScreen: 'SubscriptionPlans',
            targetParams: {
                ...route.params,
                familyMembers: familyData,
            },
        });
    };

    const handleSkip = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Registration',
            subtitle: 'Completed Successfully',
            delay: 2000,
            targetScreen: 'Home',
            targetParams: {
                ...route.params,
                familyMembers: {},
            },
        });
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex1}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}>
                            <Icon
                                type={Icons.Ionicons}
                                name="arrow-back"
                                color={blackColor}
                                size={ms(20)}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Family Members</Text>
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stepper */}
                    {!isEdit && <SignUpStepper currentStep={3} />}

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {/* Title & Subtitle */}
                        <Text style={styles.title}>Add Family Members</Text>
                        <Text style={styles.subtitle}>
                            Add your family member's name and mobile number to manage their health records and bookings in one place.
                        </Text>

                        {/* Family Member Cards */}
                        {FAMILY_MEMBERS.map((member) => {
                            const isExpanded = expandedId === member.id;
                            const hasData = familyData[member.id];

                            return (
                                <View
                                    key={member.id}
                                    style={[
                                        styles.memberCard,
                                        isExpanded && styles.memberCardExpanded,
                                    ]}>
                                    {/* Member Row */}
                                    <View style={styles.memberRow}>
                                        <Image
                                            source={member.image}
                                            style={styles.avatar}
                                        />
                                        <Text style={styles.memberName}>{member.title}</Text>
                                        {isExpanded ? (
                                            <TouchableOpacity onPress={() => removeMember(member.id)}>
                                                <Icon
                                                    type={Icons.Feather}
                                                    name="minus-circle"
                                                    color="#EF4444"
                                                    size={ms(22)}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => toggleExpand(member.id)}>
                                                <Icon
                                                    type={Icons.Feather}
                                                    name="plus-circle"
                                                    color={primaryColor}
                                                    size={ms(22)}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Expanded Fields */}
                                    {isExpanded && (
                                        <View style={styles.expandedFields}>
                                            <InputField
                                                label={`${member.title} Name`}
                                                placeholder={`Enter ${member.title} Name`}
                                                value={hasData?.name || ''}
                                                onChangeText={(text) => updateField(member.id, 'name', text)}
                                                iconType={Icons.Feather}
                                                iconName="user"
                                                containerStyle={styles.whiteInput}
                                            />
                                            <InputField
                                                label="Mobile Number"
                                                placeholder="Mobile Number"
                                                value={hasData?.mobile || ''}
                                                onChangeText={(text) => updateField(member.id, 'mobile', text)}
                                                keyboardType="phone-pad"
                                                maxLength={10}
                                                iconType={Icons.Feather}
                                                iconName="phone"
                                                containerStyle={styles.whiteInput}
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Bottom */}
                    <View style={styles.bottomContainer}>
                        <PrimaryButton title="Next" onPress={handleNext} />
                        <Text style={styles.otpNote}>
                            OTP will be sent to verify the family member and enable subscription access.
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
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
    headerTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },
    skipButton: {
        paddingHorizontal: ms(15),
        paddingVertical: vs(6),
        backgroundColor: whiteColor,
        borderRadius: ms(20),
    },
    skipText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    title: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(8),
    },
    subtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(18),
        paddingHorizontal: ms(10),
        marginBottom: vs(20),
    },
    // Member Card
    memberCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        marginBottom: vs(10),
    },
    memberCardExpanded: {
        paddingBottom: vs(16),
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(12),
        resizeMode: 'cover',
    },
    memberName: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginLeft: ms(12),
    },
    expandedFields: {
        marginTop: vs(14),
    },
    whiteInput: {
        backgroundColor: whiteColor,
    },
    // Bottom
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(16),
    },
    otpNote: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        textAlign: 'center',
        marginTop: vs(10),
        lineHeight: ms(16),
    },
});

export default AddFamilyScreen;
