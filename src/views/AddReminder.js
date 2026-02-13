import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
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

const TIMING_OPTIONS = ['At Time', 'Before 10 Mins', 'Before 15 Mins'];
const FREQUENCY_OPTIONS = ['Daily', 'Weekdays', 'Custom'];

const AddReminder = ({ navigation, route }) => {
    const currentStep = 3;
    const medicines = route?.params?.medicines || [
        { id: 1, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM' },
        { id: 2, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM' },
    ];

    const [medicineReminders, setMedicineReminders] = useState(
        medicines.map(med => ({
            ...med,
            pushNotification: true,
            smsReminder: true,
            reminderTiming: 'At Time',
            frequency: 'Daily',
            expanded: med.id === 1
        }))
    );

    const toggleExpand = (id) => {
        setMedicineReminders(medicineReminders.map(med => ({
            ...med,
            expanded: med.id === id ? !med.expanded : med.expanded
        })));
    };

    const updateReminder = (id, field, value) => {
        setMedicineReminders(medicineReminders.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

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

    const renderReminderCard = (medicine, index) => (
        <View key={medicine.id} style={styles.reminderCard}>
            {/* Card Header */}
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(medicine.id)}
                activeOpacity={0.7}
            >
                <View>
                    <Text style={styles.medicineName}>{medicine.name || 'Paracetamol'}</Text>
                    {medicine.expanded && (
                        <Text style={styles.medicineDetails}>
                            {medicine.dosage || '500 Mg'} | {medicine.time || '8.00 AM'}
                        </Text>
                    )}
                </View>
                <Text style={styles.medicineCount}>{String(index + 1).padStart(2, '0')} Medicine</Text>
            </TouchableOpacity>

            {/* Expanded Content */}
            {medicine.expanded && (
                <View style={styles.expandedContent}>
                    {/* Push Notification Toggle */}
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleLeft}>
                            <Icon type={Icons.Ionicons} name="notifications-outline" color={blackColor} size={ms(20)} />
                            <Text style={styles.toggleLabel}>Push Notification</Text>
                        </View>
                        <Switch
                            value={medicine.pushNotification}
                            onValueChange={(value) => updateReminder(medicine.id, 'pushNotification', value)}
                            trackColor={{ false: '#E5E5E5', true: primaryColor }}
                            thumbColor={whiteColor}
                        />
                    </View>

                    {/* SMS Reminder Toggle */}
                    <View style={styles.toggleRow}>
                        <View style={styles.toggleLeft}>
                            <Icon type={Icons.Ionicons} name="chatbubble-outline" color={blackColor} size={ms(20)} />
                            <Text style={styles.toggleLabel}>SMS Remainder</Text>
                        </View>
                        <Switch
                            value={medicine.smsReminder}
                            onValueChange={(value) => updateReminder(medicine.id, 'smsReminder', value)}
                            trackColor={{ false: '#E5E5E5', true: primaryColor }}
                            thumbColor={whiteColor}
                        />
                    </View>

                    {/* Reminder Timing */}
                    <Text style={styles.sectionLabel}>Remainder Timing</Text>
                    <View style={styles.chipContainer}>
                        {TIMING_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.chip,
                                    medicine.reminderTiming === option && styles.chipActive
                                ]}
                                onPress={() => updateReminder(medicine.id, 'reminderTiming', option)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    medicine.reminderTiming === option && styles.chipTextActive
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Frequency */}
                    <Text style={styles.sectionLabel}>Frequently</Text>
                    <View style={styles.chipContainer}>
                        {FREQUENCY_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.chip,
                                    medicine.frequency === option && styles.chipActive
                                ]}
                                onPress={() => updateReminder(medicine.id, 'frequency', option)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    medicine.frequency === option && styles.chipTextActive
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
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
                <Text style={styles.headerTitle}>Add Remainder</Text>
            </View>

            {/* Stepper */}
            {renderStepper()}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.descriptionText}>
                Customize when and how you get alerts for your medication.
            </Text>

            {/* Reminder Cards */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {medicineReminders.map((medicine, index) => renderReminderCard(medicine, index))}
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={() => navigation.navigate('MarkMedicines', { medicines: medicineReminders })} title="Save Remainder" />
            </View>
        </SafeAreaView>
    );
};

export default AddReminder;

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
    // Reminder Card Styles
    reminderCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(15),
        padding: ms(15),
        marginBottom: vs(15),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    medicineName: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    medicineDetails: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
        marginTop: vs(2),
    },
    medicineCount: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    expandedContent: {
        marginTop: vs(15),
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        marginLeft: ms(12),
    },
    sectionLabel: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        marginTop: vs(10),
        marginBottom: vs(10),
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
    },
    chip: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: whiteColor,
    },
    chipActive: {
        borderColor: primaryColor,
        backgroundColor: whiteColor,
    },
    chipText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
    },
    chipTextActive: {
        color: blackColor,
        fontFamily: bold,
    },
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: ms(30),
        paddingTop: ms(10),
    },
});
