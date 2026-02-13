import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const { width } = Dimensions.get('window');

const STEPS = [
    { id: 1, label: 'Medicines' },
    { id: 2, label: 'Date & Time' },
    { id: 3, label: 'Remainder' },
    { id: 4, label: 'Mark' },
];

const AddDateTime = ({ navigation, route }) => {
    const currentStep = 2;
    const medicines = route?.params?.medicines || [
        { id: 1, name: 'Paracetamol', type: 'Tablet', dosage: '500mg' },
        { id: 2, name: 'Paracetamol', type: 'Tablet', dosage: '500mg' },
    ];

    const [medicineSchedules, setMedicineSchedules] = useState(
        medicines.map(med => ({
            ...med,
            time: '',
            startDate: '',
            endDate: '',
            schedule: ''
        }))
    );

    const renderStepper = () => (
        <View style={styles.stepperContainer}>
            {STEPS.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                    <View style={styles.stepRow}>
                        {/* Step Circle */}
                        <View style={[
                            styles.stepCircle,
                            currentStep >= step.id && styles.stepCircleActive
                        ]}>
                            <Text style={[
                                styles.stepNumber,
                                currentStep >= step.id && styles.stepNumberActive
                            ]}>
                                {step.id}
                            </Text>
                        </View>
                        {/* Connector Line */}
                        {index < STEPS.length - 1 && (
                            <View style={[
                                styles.stepLine,
                                currentStep > step.id && styles.stepLineActive
                            ]} />
                        )}
                    </View>
                    <Text style={[
                        styles.stepLabel,
                        currentStep >= step.id && styles.stepLabelActive
                    ]}>
                        {step.label}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderScheduleCard = (medicine, index) => (
        <View key={medicine.id} style={styles.scheduleCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.medicineName}>{medicine.name || 'Paracetamol'}</Text>
                <Text style={styles.medicineCount}>{String(index + 1).padStart(2, '0')} Medicine</Text>
            </View>

            {/* Time Field */}
            <Text style={styles.inputLabel}>Time</Text>
            <TouchableOpacity style={styles.selectInput}>
                <Text style={medicine.time ? styles.selectText : styles.selectPlaceholder}>
                    {medicine.time || 'Select time'}
                </Text>
                <Icon type={Icons.Feather} name="clock" color={blackColor} size={ms(18)} />
            </TouchableOpacity>

            {/* Start & End Date Field */}
            <Text style={styles.inputLabel}>Start & End Date</Text>
            <TouchableOpacity style={styles.selectInput}>
                <Text style={medicine.startDate ? styles.selectText : styles.selectPlaceholder}>
                    {medicine.startDate ? `${medicine.startDate} - ${medicine.endDate}` : 'Select Start & End Date'}
                </Text>
                <Icon type={Icons.Feather} name="calendar" color={blackColor} size={ms(18)} />
            </TouchableOpacity>

            {/* Schedule Field */}
            <Text style={styles.inputLabel}>Schedule</Text>
            <TouchableOpacity style={styles.selectInput}>
                <Text style={medicine.schedule ? styles.selectText : styles.selectPlaceholder}>
                    {medicine.schedule || 'Select Schedule'}
                </Text>
                <Icon type={Icons.Feather} name="chevron-down" color={blackColor} size={ms(18)} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Date & Time</Text>
            </View>

            {/* Stepper */}
            {renderStepper()}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.descriptionText}>
                Set start & end dates and times for each medicine.{'\n'}You can schedule different times for each.
            </Text>

            {/* Schedule Cards */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {medicineSchedules.map((medicine, index) => renderScheduleCard(medicine, index))}
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={() => navigation.navigate('AddReminder', { medicines: medicineSchedules })} title="Save Schedule" />
            </View>
        </SafeAreaView>
    );
};

export default AddDateTime;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: ms(20),
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(15),
    },
    headerTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
    },
    // Stepper Styles
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: ms(20),
        marginBottom: vs(15),
    },
    stepItem: {
        alignItems: 'center',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleActive: {
        backgroundColor: primaryColor,
    },
    stepNumber: {
        fontSize: ms(14),
        fontFamily: bold,
        color: blackColor,
    },
    stepNumberActive: {
        color: whiteColor,
    },
    stepLine: {
        width: ms(60),
        height: ms(2),
        backgroundColor: '#E5E5E5',
    },
    stepLineActive: {
        backgroundColor: primaryColor,
    },
    stepLabel: {
        fontSize: ms(10),
        fontFamily: regular,
        color: grayColor,
        marginTop: vs(5),
        textAlign: 'center',
    },
    stepLabelActive: {
        color: blackColor,
        fontFamily: bold,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginHorizontal: ms(20),
        marginBottom: vs(15),
    },
    descriptionText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        paddingHorizontal: ms(20),
        marginBottom: vs(15),
        lineHeight: ms(20),
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    // Schedule Card Styles
    scheduleCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(15),
        padding: ms(15),
        marginBottom: vs(15),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    medicineName: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    medicineCount: {
        fontSize: ms(13),
        fontFamily: regular,
        color: grayColor,
    },
    inputLabel: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(8),
    },
    selectInput: {
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        paddingHorizontal: ms(15),
        height: vs(45),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: vs(15),
    },
    selectText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    selectPlaceholder: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#4B5563',
    },
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: ms(30),
        paddingTop: ms(10),
    },
});
