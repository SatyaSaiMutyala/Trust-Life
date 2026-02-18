import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';
import DropdownField from '../../utils/DropdownField';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const PatientDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const doctor = route.params?.doctor || {};
    const existing = route.params?.patient;

    const [fullName, setFullName] = useState(existing?.fullName || '');
    const [gender, setGender] = useState(existing?.gender || '');
    const [dob, setDob] = useState(existing?.dob || '');
    const [dobDate, setDobDate] = useState(existing?.dobDate || new Date(1995, 0, 12));
    const [mobile, setMobile] = useState(existing?.mobile || '');
    const [emergency, setEmergency] = useState(existing?.emergency || '');
    const [showDobPicker, setShowDobPicker] = useState(false);

    const onDobChange = (event, date) => {
        setShowDobPicker(false);
        if (event.type === 'set' && date) {
            setDobDate(date);
            const d = date.getDate().toString().padStart(2, '0');
            const m = MONTHS[date.getMonth()];
            const y = date.getFullYear();
            setDob(`${d} ${m} ${y}`);
        }
    };

    const handleSave = () => {
        const patient = { fullName, gender, dob, dobDate, mobile, emergency };
        navigation.navigate('ReviewAppointmentScreen', { doctor, patient });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Patient Details</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.infoBanner}>
                    Kindly provide accurate information, as it will be reviewed by the doctor during consultation.
                </Text>

                <InputField
                    label="Full Name"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                <DropdownField
                    label="Gender"
                    placeholder="Select Gender"
                    value={gender}
                    options={GENDER_OPTIONS}
                    onSelect={setGender}
                />

                <InputField
                    label="Date Of Birth"
                    placeholder="Select Date of Birth"
                    value={dob}
                    onPressIn={() => setShowDobPicker(true)}
                    iconType={Icons.Ionicons}
                    iconName="calendar-outline"
                />

                <InputField
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                />

                <InputField
                    label="Emergency Number"
                    placeholder="Enter Emergency Number"
                    value={emergency}
                    onChangeText={setEmergency}
                    keyboardType="phone-pad"
                />

                <View style={{ height: vs(28) }} />

                <PrimaryButton title="Save Details" onPress={handleSave} style={{ marginTop: 0 }} />
                <Text style={styles.secureText}>Your data is secure and confidential.</Text>

                <View style={{ height: vs(30) }} />
            </ScrollView>

            {showDobPicker && (
                <DateTimePicker
                    value={dobDate}
                    mode="date"
                    display="default"
                    onChange={onDobChange}
                />
            )}
        </SafeAreaView>
    );
};

export default PatientDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingTop: ms(48),
        paddingBottom: ms(12),
        backgroundColor: whiteColor,
    },
    backBtn: {
        marginRight: ms(12),
    },
    headerTitle: {
        fontSize: ms(15),
        fontWeight: '700',
        color: blackColor,
    },
    scroll: {
        paddingHorizontal: ms(20),
        paddingTop: vs(16),
    },
    infoBanner: {
        fontSize: ms(12),
        color: '#666',
        lineHeight: ms(18),
        marginBottom: vs(20),
    },
    secureText: {
        textAlign: 'center',
        fontSize: ms(11),
        color: '#999',
        marginTop: vs(10),
    },
});
