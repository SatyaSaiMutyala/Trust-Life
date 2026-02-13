import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { StatusBar2 } from '../../components/StatusBar';
import Loader from '../../components/Loader';
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
import {
    LoadCustomerProfileAction,
    UpdateCustomerProfileAction,
} from '../../redux/actions/CustomerProfileActions';

const PersonalDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const isEdit = route.params?.isEdit ?? false;

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surname, setSurname] = useState('');
    const [gender, setGender] = useState('');
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dob, setDob] = useState('');
    const [age, setAge] = useState('');
    const [showAgeTooltip, setShowAgeTooltip] = useState(false);

    // Family Doctor Details
    const [doctorName, setDoctorName] = useState('');
    const [doctorMobile, setDoctorMobile] = useState('');

    // Caretaker Details
    const [caretakerName, setCaretakerName] = useState('');
    const [caretakerMobile, setCaretakerMobile] = useState('');

    // Emergency Contact Details
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyMobile, setEmergencyMobile] = useState('');

    // Load existing profile data in edit mode
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            dispatch(LoadCustomerProfileAction(global.id))
                .then((response) => {
                    setLoading(false);
                    const result = response.result;
                    setFirstName(result.customer_name || '');
                    setSurname(result.surname || '');
                    setGender(result.gender ? result.gender.charAt(0).toUpperCase() + result.gender.slice(1) : '');
                    if (result.date_of_birth) {
                        setDob(result.date_of_birth);
                        if (result.date_of_birth.includes('/')) {
                            const [day, month, year] = result.date_of_birth.split('/');
                            const birthDate = new Date(year, month - 1, day);
                            setDefaultDate(birthDate);
                            setAge(calculateAge(birthDate));
                        }
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [isEdit]);

    const calculateAge = (birthDate) => {
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            years--;
        }
        return `${years} Years`;
    };

    const onChangeDate = (e, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
            setDob(formatted);
            setDefaultDate(selectedDate);
            setAge(calculateAge(selectedDate));
        }
    };

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, maxWidth: 500, maxHeight: 500 },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage || 'Image picker error');
                    return;
                }
                if (response.assets && response.assets.length > 0) {
                    setProfileImage(response.assets[0]);
                }
            },
        );
    };

    const handleContinue = () => {
        if (isEdit) {
            if (!firstName.trim()) {
                Alert.alert('Error', 'Please enter your name.');
                return;
            }
            setLoading(true);
            const updateData = {
                id: global.id,
                customer_name: firstName,
                surname: surname,
                gender: gender.toLowerCase(),
                date_of_birth: dob,
            };
            dispatch(UpdateCustomerProfileAction(updateData))
                .then((response) => {
                    setLoading(false);
                    if (response.status == 1) {
                        Alert.alert('Success', 'Profile updated successfully.', [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    } else {
                        Alert.alert('Error', response.message || 'Update failed.');
                    }
                })
                .catch(() => {
                    setLoading(false);
                    Alert.alert('Error', 'Something went wrong during update.');
                });
            return;
        }

        navigation.navigate('LifestyleInfo', {
            profileImage,
            firstName,
            middleName,
            surname,
            gender,
            dob,
            age,
            ...route.params,
        });
    };

    // --- Radio Button ---
    const RadioButton = ({ label, selected, onSelect }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
            <View
                style={[
                    styles.radioOuter,
                    { borderColor: selected ? primaryColor : '#C4C4C4' },
                ]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                <Loader visible={loading} />
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
                        <Text style={styles.headerTitle}>{isEdit ? 'Edit Profile' : 'Personal Details'}</Text>
                    </View>

                    {/* Stepper */}
                    {!isEdit && <SignUpStepper currentStep={0} />}

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {/* Upload Profile Image */}
                        {!isEdit && (
                            <TouchableOpacity
                                style={styles.uploadBox}
                                onPress={pickImage}
                                activeOpacity={0.7}>
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage.uri }}
                                        style={styles.profileImagePreview}
                                    />
                                ) : (
                                    <>
                                        <Icon
                                            type={Icons.Feather}
                                            name="upload"
                                            color="#9CA3AF"
                                            size={ms(24)}
                                        />
                                        <Text style={styles.uploadText}>Upload Profile Image</Text>
                                        <Text style={styles.uploadSubText}>PNG,JPG</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}

                        {/* First Name */}
                        <InputField
                            label="First Name"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        {/* Middle Name */}
                        <InputField
                            label="Middle Name"
                            placeholder="Enter Middle Name"
                            value={middleName}
                            onChangeText={setMiddleName}
                        />

                        {/* Surname */}
                        <InputField
                            label="Surname"
                            placeholder="Enter Surname"
                            value={surname}
                            onChangeText={setSurname}
                        />

                        {/* Gender */}
                        <Text style={styles.fieldLabel}>Gender</Text>
                        <View style={styles.genderRow}>
                            <RadioButton
                                label="Male"
                                selected={gender === 'Male'}
                                onSelect={() => setGender('Male')}
                            />
                            <RadioButton
                                label="Female"
                                selected={gender === 'Female'}
                                onSelect={() => setGender('Female')}
                            />
                            <RadioButton
                                label="Others"
                                selected={gender === 'Others'}
                                onSelect={() => setGender('Others')}
                            />
                        </View>

                        {/* Date of Birth */}
                        <InputField
                            label="Date of Birth"
                            placeholder="Select Date of Birth"
                            value={dob}
                            iconType={Icons.Feather}
                            iconName="calendar"
                            onPressIn={() => {
                                Keyboard.dismiss();
                                setShowDatePicker(true);
                            }}
                        />
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                value={defaultDate}
                                onChange={onChangeDate}
                                maximumDate={new Date()}
                            />
                        )}

                        {/* Age */}
                        <View style={styles.ageLabelRow}>
                            <Text style={styles.fieldLabel}>Age</Text>
                            <TouchableOpacity
                                onPress={() => setShowAgeTooltip(!showAgeTooltip)}
                                style={styles.infoIconContainer}>
                                <Icon
                                    type={Icons.Feather}
                                    name="info"
                                    color="#9CA3AF"
                                    size={ms(14)}
                                />
                            </TouchableOpacity>
                            {showAgeTooltip && (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>
                                        Age is automatically calculated from your Date of Birth.
                                    </Text>
                                </View>
                            )}
                        </View>
                        <InputField
                            placeholder="Auto-calculated"
                            value={age}
                            editable={false}
                            disabled={true}
                        />

                        {/* Family Doctor Details */}
                        <Text style={styles.sectionTitle}>Family Doctor Details</Text>
                        <InputField
                            label="Name"
                            placeholder="Enter Name"
                            value={doctorName}
                            onChangeText={setDoctorName}
                        />
                        <InputField
                            label="Mobile Number"
                            placeholder="Enter Mobile Number"
                            value={doctorMobile}
                            onChangeText={setDoctorMobile}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        {/* Caretaker Details */}
                        <Text style={styles.sectionTitle}>Caretaker Details</Text>
                        <InputField
                            label="Name"
                            placeholder="Enter Name"
                            value={caretakerName}
                            onChangeText={setCaretakerName}
                        />
                        <InputField
                            label="Mobile Number"
                            placeholder="Enter Mobile Number"
                            value={caretakerMobile}
                            onChangeText={setCaretakerMobile}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        {/* Emergency Contact Details */}
                        <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
                        <InputField
                            label="Name"
                            placeholder="Enter Name"
                            value={emergencyName}
                            onChangeText={setEmergencyName}
                        />
                        <InputField
                            label="Mobile Number"
                            placeholder="Enter Mobile Number"
                            value={emergencyMobile}
                            onChangeText={setEmergencyMobile}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        {/* Continue / Update Button */}
                        <PrimaryButton title={isEdit ? 'Update Profile' : 'Continue'} onPress={handleContinue} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: Platform.OS === 'ios' ? vs(10) : vs(15),
        paddingBottom: vs(12),
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
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
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },
    // --- Upload Box ---
    uploadBox: {
        borderWidth: ms(1.5),
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: ms(12),
        paddingVertical: vs(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(20),
        backgroundColor: '#FAFAFA',
    },
    uploadText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
        marginTop: vs(8),
    },
    uploadSubText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    profileImagePreview: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
    },
    // --- Section Title ---
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginTop: vs(10),
        marginBottom: vs(14),
    },
    // --- Form Fields ---
    fieldLabel: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(6),
    },
    // --- Gender ---
    genderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(16),
        gap: ms(24),
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        borderWidth: ms(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    radioInner: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: primaryColor,
    },
    radioLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    // --- Age ---
    ageLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    infoIconContainer: {
        marginLeft: ms(6),
        padding: ms(2),
    },
    tooltip: {
        position: 'absolute',
        left: ms(50),
        top: ms(-8),
        backgroundColor: whiteColor,
        borderRadius: ms(8),
        paddingHorizontal: ms(12),
        paddingVertical: vs(8),
        elevation: 4,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        width: ms(200),
        zIndex: 10,
    },
    tooltipText: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#374151',
        lineHeight: ms(16),
    },
});

export default PersonalDetails;
