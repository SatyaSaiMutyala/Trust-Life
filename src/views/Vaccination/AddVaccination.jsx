import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';
import DropdownField from '../../utils/DropdownField';

const DOSE_OPTIONS = ['Dose 1', 'Dose 2', 'Dose 3', 'Dose 4', 'Dose 5'];
const TOTAL_DOSE_OPTIONS = ['1 Dose', '2 Doses', '3 Doses', '4 Doses', '5 Doses'];

const AddVaccination = () => {
    const navigation = useNavigation();
    const [vaccineName, setVaccineName] = useState('');
    const [currentDose, setCurrentDose] = useState('');
    const [dateTaken, setDateTaken] = useState(null);
    const [nextDueDate, setNextDueDate] = useState(null);
    const [batchNumber, setBatchNumber] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [totalDoses, setTotalDoses] = useState('');

    const [showDateTakenPicker, setShowDateTakenPicker] = useState(false);
    const [showNextDuePicker, setShowNextDuePicker] = useState(false);

    const formatDate = (d) => {
        if (!d) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };

    const onDateTakenChange = (event, selectedDate) => {
        setShowDateTakenPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateTaken(selectedDate);
        }
    };

    const onNextDueChange = (event, selectedDate) => {
        setShowNextDuePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setNextDueDate(selectedDate);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Vaccination Details',
            subtitle: 'Saved Successfully',
            delay: 2000,
            targetScreen: 'VaccinationDashboard',
            useNavigate: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Adding Vaccination Details</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate vaccination details and updates
                </Text>

                {/* Vaccine Name */}
                <InputField
                    label="Vaccine Name"
                    placeholder="Enter Vaccine Name"
                    value={vaccineName}
                    onChangeText={setVaccineName}
                />

                {/* Current Dose */}
                <DropdownField
                    label="Current Dose"
                    placeholder="Select Current Dose"
                    value={currentDose}
                    options={DOSE_OPTIONS}
                    onSelect={setCurrentDose}
                />

                {/* Date Taken */}
                <InputField
                    label="Date Taken"
                    placeholder="Select Date Taken"
                    value={dateTaken ? formatDate(dateTaken) : ''}
                    onPressIn={() => setShowDateTakenPicker(true)}
                    iconType={Icons.Feather}
                    iconName="calendar"
                />

                {/* Next Due Date */}
                <InputField
                    label="Next Due Date"
                    placeholder="Select Next Due Date"
                    value={nextDueDate ? formatDate(nextDueDate) : ''}
                    onPressIn={() => setShowNextDuePicker(true)}
                    iconType={Icons.Feather}
                    iconName="calendar"
                />

                {/* Batch Number */}
                <InputField
                    label="Batch Number"
                    placeholder="Enter Batch Number"
                    value={batchNumber}
                    onChangeText={setBatchNumber}
                />

                {/* Manufacturer */}
                <InputField
                    label="Manufacturer"
                    placeholder="Enter Manufacturer"
                    value={manufacturer}
                    onChangeText={setManufacturer}
                />

                {/* Total Number of Doses */}
                <DropdownField
                    label="Total Number of Doses"
                    placeholder="Select Total Number of Doses"
                    value={totalDoses}
                    options={TOTAL_DOSE_OPTIONS}
                    onSelect={setTotalDoses}
                />

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Save Details"
                    onPress={handleSave}
                />
            </View>

            {showDateTakenPicker && (
                <DateTimePicker
                    value={dateTaken || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateTakenChange}
                />
            )}

            {showNextDuePicker && (
                <DateTimePicker
                    value={nextDueDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onNextDueChange}
                />
            )}
        </SafeAreaView>
    );
};

export default AddVaccination;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ms(50),
        paddingBottom: ms(10),
        marginHorizontal: ms(-5),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    description: {
        fontSize: ms(13),
        color: '#888',
        lineHeight: ms(20),
        marginTop: vs(10),
        marginBottom: vs(20),
    },
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
