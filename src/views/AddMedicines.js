import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
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

const AddMedicines = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [medicines, setMedicines] = useState([
        { id: 1, name: '', type: '', dosage: '' },
        { id: 2, name: '', type: '', dosage: '' },
    ]);

    const addMedicine = () => {
        const newId = medicines.length + 1;
        setMedicines([...medicines, { id: newId, name: '', type: '', dosage: '' }]);
    };

    const removeMedicine = (id) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter(med => med.id !== id));
        }
    };

    const updateMedicine = (id, field, value) => {
        setMedicines(medicines.map(med =>
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

    const renderMedicineCard = (medicine, index) => (
        <View key={medicine.id} style={styles.medicineCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                    {String(index + 1).padStart(2, '0')} Medicine
                </Text>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        index === 0 ? styles.addButton : styles.removeButton
                    ]}
                    onPress={() => index === 0 ? addMedicine() : removeMedicine(medicine.id)}
                >
                    <Icon
                        type={Icons.Feather}
                        name={index === 0 ? "plus" : "minus"}
                        color={whiteColor}
                        size={ms(16)}
                    />
                </TouchableOpacity>
            </View>

            {/* Medicine Name */}
            <Text style={styles.inputLabel}>Medicine Name</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter Medicine Name"
                placeholderTextColor='#4B5563'
                value={medicine.name}
                onChangeText={(text) => updateMedicine(medicine.id, 'name', text)}
            />

            {/* Type and Dosage Row */}
            <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Type</Text>
                    <TouchableOpacity style={styles.selectInput}>
                        <Text style={medicine.type ? styles.selectText : styles.selectPlaceholder}>
                            {medicine.type || 'Select type'}
                        </Text>
                        <Icon type={Icons.Feather} name="chevron-down" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                </View>
                <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Dosage</Text>
                    <TouchableOpacity style={styles.selectInput}>
                        <Text style={medicine.dosage ? styles.selectText : styles.selectPlaceholder}>
                            {medicine.dosage || 'Select Dosage'}
                        </Text>
                        <Icon type={Icons.Feather} name="chevron-down" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                </View>
            </View>
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
                <Text style={styles.headerTitle}>Add Medicines</Text>
            </View>

            {/* Stepper */}
            {renderStepper()}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <Text style={styles.descriptionText}>
                Add the medicines prescribed by your doctor to start getting timely reminders.
            </Text>

            {/* Medicine Cards */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {medicines.map((medicine, index) => renderMedicineCard(medicine, index))}
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={() => navigation.navigate('AddDateTime', { medicines })} title="Save Medicines" />
            </View>
        </SafeAreaView>
    );
};

export default AddMedicines;

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
    // Medicine Card Styles
    medicineCard: {
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
    cardTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    actionButton: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: primaryColor,
    },
    removeButton: {
        backgroundColor: '#EF4444',
    },
    inputLabel: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(8),
    },
    textInput: {
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        paddingHorizontal: ms(15),
        height: vs(45),
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(15),
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
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
