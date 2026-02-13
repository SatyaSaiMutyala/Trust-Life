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
import Svg, { Circle } from 'react-native-svg';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor, grayColor } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const STEPS = [
    { id: 1, label: 'Medicines' },
    { id: 2, label: 'Date & Time' },
    { id: 3, label: 'Remainder' },
    { id: 4, label: 'Mark' },
];

const MarkMedicines = ({ navigation, route }) => {
    const currentStep = 4;
    const medicines = route?.params?.medicines || [
        { id: 1, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast' },
        { id: 2, name: 'Paracetamol', dosage: '500 Mg', time: '8.00 AM', schedule: 'Before Breakfast' },
    ];

    const [medicineMarks, setMedicineMarks] = useState(
        medicines.map(med => ({
            ...med,
            status: null, // null, 'taken', 'skipped'
            dateTime: '01:20 PM, 25/01/2026'
        }))
    );

    const totalMedicines = medicineMarks.length;
    const markedCount = medicineMarks.filter(m => m.status !== null).length;
    const percentage = totalMedicines > 0 ? Math.round((markedCount / totalMedicines) * 100) : 0;

    const markMedicine = (id, status) => {
        setMedicineMarks(medicineMarks.map(med =>
            med.id === id ? { ...med, status } : med
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

    const renderProgressCircle = () => {
        const size = ms(140);
        const strokeWidth = ms(8);
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <View style={styles.progressContainer}>
                <Svg width={size} height={size}>
                    {/* Background Circle */}
                    <Circle
                        stroke="#E5E5E5"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress Circle */}
                    <Circle
                        stroke={primaryColor}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressPercentage}>{percentage}%</Text>
                    <Text style={styles.progressLabel}>Done</Text>
                </View>
            </View>
        );
    };

    const renderMedicineCard = (medicine, index) => (
        <View key={medicine.id} style={styles.medicineCard}>
            {/* DateTime Header */}
            <Text style={styles.dateTimeText}>{medicine.dateTime}</Text>

            {/* Schedule */}
            <Text style={styles.scheduleText}>{medicine.schedule || 'Before Breakfast'}</Text>

            {/* Medicine Info Row */}
            <View style={styles.medicineInfoRow}>
                <View>
                    <Text style={styles.medicineName}>{medicine.name || 'Paracetamol'}</Text>
                    <Text style={styles.medicineDetails}>
                        {medicine.dosage || '500 Mg'} | {medicine.time || '8.00 AM'}
                    </Text>
                </View>
                <Text style={styles.medicineCount}>{String(index + 1).padStart(2, '0')} Medicine</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <View style={styles.markCheckContainer}>
                    <TouchableOpacity
                        style={[
                            styles.checkCircle,
                            medicine.status === 'taken' && styles.checkCircleActive
                        ]}
                        onPress={() => markMedicine(medicine.id, medicine.status === 'taken' ? null : 'taken')}
                    >
                        {medicine.status === 'taken' && (
                            <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.markText}>Mark</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.skipButton,
                            medicine.status === 'skipped' && styles.skipButtonActive
                        ]}
                        onPress={() => markMedicine(medicine.id, 'skipped')}
                    >
                        <Text style={[
                            styles.skipButtonText,
                            medicine.status === 'skipped' && styles.skipButtonTextActive
                        ]}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.takenButton,
                            medicine.status === 'taken' && styles.takenButtonActive
                        ]}
                        onPress={() => markMedicine(medicine.id, 'taken')}
                    >
                        <Text style={styles.takenButtonText}>Mark as Taken</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const handleDone = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Successfully',
            subtitle: 'Medication Added',
            navigateTo: 'MedicationTracking',
            delay: 2000
        });
    };

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
                <TouchableOpacity onPress={handleDone}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            {/* Stepper */}
            {renderStepper()}

            {/* Progress Circle */}
            {renderProgressCircle()}

            {/* Medicine Count */}
            <Text style={styles.medicineCountText}>
                {String(totalMedicines).padStart(2, '0')}  Medicines Added
            </Text>

            {/* Medicine Cards */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {medicineMarks.map((medicine, index) => renderMedicineCard(medicine, index))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default MarkMedicines;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    headerTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
    },
    doneText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: primaryColor,
    },
    // Stepper Styles
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: ms(20),
        marginBottom: vs(20),
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
    // Progress Circle Styles
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: vs(20),
    },
    progressTextContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: ms(32),
        fontFamily: bold,
        color: blackColor,
    },
    progressLabel: {
        fontSize: ms(14),
        fontFamily: regular,
        color: grayColor,
    },
    medicineCountText: {
        fontSize: ms(16),
        fontFamily: regular,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(15),
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
    // Medicine Card Styles
    medicineCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: ms(15),
        padding: ms(15),
        marginBottom: vs(15),
    },
    dateTimeText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(5),
    },
    scheduleText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(12),
    },
    medicineInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: vs(15),
    },
    medicineName: {
        fontSize: ms(15),
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
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    markCheckContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        borderWidth: 2,
        borderColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    checkCircleActive: {
        backgroundColor: primaryColor,
    },
    markText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    skipButton: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        backgroundColor: '#E5E5E5',
    },
    skipButtonActive: {
        backgroundColor: grayColor,
    },
    skipButtonText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
    },
    skipButtonTextActive: {
        color: whiteColor,
    },
    takenButton: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        borderRadius: ms(8),
        backgroundColor: primaryColor,
    },
    takenButtonActive: {
        backgroundColor: primaryColor,
    },
    takenButtonText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: whiteColor,
    },
});
