import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import InputField from '../../utils/InputField';
import { blackColor, whiteColor, primaryColor, globalGradient } from '../../utils/globalColors';
import { interMedium, interRegular } from '../../config/Constants';

const DURATION_OPTIONS = ['5 mins', '10 mins', '20 mins'];
const ACCESS_FOR_OPTIONS = ['Medical Reports', 'Medication', 'TrustMD'];

const CheckBox = ({ checked, onPress, label }) => (
    <TouchableOpacity style={styles.checkRow} activeOpacity={0.7} onPress={onPress}>
        <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
            {checked && <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color={whiteColor} />}
        </View>
        <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
);

const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity style={styles.radioRow} activeOpacity={0.7} onPress={onPress}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
);

const AddConsentManagerScreen = () => {
    const navigation = useNavigation();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [accessView, setAccessView] = useState(true);
    const [accessDownload, setAccessDownload] = useState(false);
    const [accessDate, setAccessDate] = useState('');
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState('5 mins');
    const [accessFor, setAccessFor] = useState({ 'Medical Reports': true, Medication: false, TrustMD: false });
    const [agreed, setAgreed] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const onChangeDate = (e, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
            setAccessDate(formatted);
            setDefaultDate(selectedDate);
        }
    };

    const handleSubmit = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigation.goBack();
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.gradientBg}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Consent Manager</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                {/* Personal Information */}
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <InputField
                    label="Name"
                    placeholder="Enter Name"
                    value={name}
                    onChangeText={setName}
                />
                <InputField
                    label="Email Address"
                    placeholder="Enter Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <InputField
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <InputField
                    label="Relationship"
                    placeholder="Enter Relationship"
                    value={relationship}
                    onChangeText={setRelationship}
                />

                {/* Access Details */}
                <Text style={styles.sectionTitle}>Access Details</Text>
                <View style={styles.checkGroup}>
                    <CheckBox
                        checked={accessView}
                        onPress={() => setAccessView(!accessView)}
                        label="View"
                    />
                    <CheckBox
                        checked={accessDownload}
                        onPress={() => setAccessDownload(!accessDownload)}
                        label="Download"
                    />
                </View>

                {/* Access Upto */}
                <InputField
                    label="Access upto"
                    placeholder="Select Date"
                    value={accessDate}
                    iconType={Icons.Ionicons}
                    iconName="calendar-outline"
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
                        minimumDate={new Date()}
                    />
                )}

                {/* Duration */}
                <Text style={styles.fieldLabel}>Duration</Text>
                <View style={styles.radioGroup}>
                    {DURATION_OPTIONS.map((opt) => (
                        <RadioButton
                            key={opt}
                            selected={selectedDuration === opt}
                            onPress={() => setSelectedDuration(opt)}
                            label={opt}
                        />
                    ))}
                </View>

                {/* Access For */}
                <Text style={styles.fieldLabel}>Access for</Text>
                <View style={styles.checkGroup}>
                    {ACCESS_FOR_OPTIONS.map((opt) => (
                        <CheckBox
                            key={opt}
                            checked={accessFor[opt]}
                            onPress={() => setAccessFor((prev) => ({ ...prev, [opt]: !prev[opt] }))}
                            label={opt}
                        />
                    ))}
                </View>

                {/* Agreement */}
                <TouchableOpacity
                    style={styles.agreementRow}
                    activeOpacity={0.7}
                    onPress={() => setAgreed(!agreed)}
                >
                    <View style={[styles.checkBox, agreed && styles.checkBoxChecked]}>
                        {agreed && <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color={whiteColor} />}
                    </View>
                    <Text style={styles.agreementText}>
                        I agree to share my medical reports with this person.
                    </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    style={styles.submitBtnWrap}
                >
                    <LinearGradient
                        colors={['#006D5D', '#50A89C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.submitBtn}
                    >
                        <Text style={styles.submitBtnText}>Give Access</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Success Modal */}
            <Modal transparent visible={showSuccess} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.successCircle}>
                            <Icon type={Icons.Ionicons} name="checkmark" size={ms(40)} color={whiteColor} />
                        </View>
                        <Text style={styles.successTitle}>Successfully</Text>
                        <Text style={styles.successSubtitle}>Consent Manager Added</Text>
                    </View>
                </View>
            </Modal>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center',
        elevation: 2, shadowColor: blackColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    headerTitle: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: whiteColor,
        marginLeft: ms(12),
    },

    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Section
    sectionTitle: {
        fontFamily: interMedium,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(14),
        marginTop: vs(6),
    },

    // Field label
    fieldLabel: {
        fontFamily: interMedium,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(10),
    },

    // Checkbox
    checkGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(20),
        marginBottom: vs(14),
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(6),
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    checkBoxChecked: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    checkLabel: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Radio
    radioGroup: {
        flexDirection: 'row',
        gap: ms(20),
        marginBottom: vs(14),
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    radioOuterSelected: {
        borderColor: primaryColor,
    },
    radioInner: {
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
        backgroundColor: primaryColor,
    },
    radioLabel: {
        fontFamily: interRegular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Agreement
    agreementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(10),
        marginBottom: vs(20),
    },
    agreementText: {
        flex: 1,
        fontFamily: interRegular,
        fontSize: ms(12),
        color: '#6B7280',
    },

    // Submit
    submitBtnWrap: {
        borderRadius: ms(12),
        overflow: 'hidden',
        marginBottom: vs(20),
    },
    submitBtn: {
        borderRadius: ms(12),
        paddingVertical: vs(14),
        alignItems: 'center',
    },
    submitBtnText: {
        fontFamily: interMedium,
        fontSize: ms(15),
        color: whiteColor,
    },

    // Success Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        padding: ms(40),
        alignItems: 'center',
        marginHorizontal: ms(40),
    },
    successCircle: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    successTitle: {
        fontFamily: interMedium,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: vs(4),
    },
    successSubtitle: {
        fontFamily: interMedium,
        fontSize: ms(16),
        color: blackColor,
    },
});

export default AddConsentManagerScreen;
