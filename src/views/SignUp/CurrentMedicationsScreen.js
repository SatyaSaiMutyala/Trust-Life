import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
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
import DropdownField from '../../utils/DropdownField';

const DOSAGE_OPTIONS = ['250 mg', '500 mg', '750 mg', '1000 mg'];
const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed'];
const DURATION_OPTIONS = ['1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months', '6 Months', '1 Year', 'Ongoing'];

const emptyMedication = () => ({
    id: Date.now() + Math.random(),
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
});

const CurrentMedicationsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [prescriptionImage, setPrescriptionImage] = useState(null);
    const [medications, setMedications] = useState([emptyMedication()]);

    const handleUploadPrescription = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8 },
            (response) => {
                if (!response.didCancel && !response.errorCode && response.assets?.length) {
                    setPrescriptionImage(response.assets[0]);
                }
            },
        );
    };

    const addMedication = () => {
        setMedications((prev) => [...prev, emptyMedication()]);
    };

    const removeMedication = (index) => {
        setMedications((prev) => prev.filter((_, i) => i !== index));
    };

    const updateMedication = (index, field, value) => {
        setMedications((prev) =>
            prev.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
        );
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Medications Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                medicationsData: {
                    prescriptionImage,
                    medications,
                },
                completedCategory: 'medications',
            },
            useNavigate: true,
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Current Medications</Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.closeButton}>
                        <Icon
                            type={Icons.Feather}
                            name="x"
                            color={blackColor}
                            size={ms(18)}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    {/* Upload Prescription */}
                    <TouchableOpacity
                        style={styles.uploadContainer}
                        activeOpacity={0.7}
                        onPress={handleUploadPrescription}>
                        {prescriptionImage ? (
                            <Text style={styles.uploadedText} numberOfLines={1}>
                                {prescriptionImage.fileName || 'Image Selected'}
                            </Text>
                        ) : (
                            <>
                                <Icon
                                    type={Icons.Feather}
                                    name="upload"
                                    color="#9CA3AF"
                                    size={ms(22)}
                                />
                                <Text style={styles.uploadTitle}>Upload Prescription Image</Text>
                                <Text style={styles.uploadSubtitle}>PNG.JPG</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Medication Cards */}
                    {medications.map((med, index) => (
                        <View key={med.id} style={styles.medicationCard}>
                            {/* Card Header */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardHeaderTitle}>Medication</Text>
                                {index === 0 ? (
                                    <TouchableOpacity onPress={addMedication}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="plus-circle"
                                            color={primaryColor}
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => removeMedication(index)}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="minus-circle"
                                            color="#EF4444"
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Medicine Name */}
                            <InputField
                                label="Medicine Name"
                                placeholder="Enter Medicine Name"
                                value={med.name}
                                onChangeText={(text) => updateMedication(index, 'name', text)}
                                containerStyle={styles.whiteInput}
                            />

                            {/* Dosage */}
                            <DropdownField
                                label="Dosage"
                                placeholder="Select Dosage, eg 500 mg"
                                value={med.dosage}
                                options={DOSAGE_OPTIONS}
                                onSelect={(val) => updateMedication(index, 'dosage', val)}
                                containerStyle={styles.whiteInput}
                            />

                            {/* Frequency */}
                            <DropdownField
                                label="Frequency"
                                placeholder="Select Frequency, eg, Once daily, Twice daily"
                                value={med.frequency}
                                options={FREQUENCY_OPTIONS}
                                onSelect={(val) => updateMedication(index, 'frequency', val)}
                                containerStyle={styles.whiteInput}
                            />

                            {/* Duration */}
                            <DropdownField
                                label="Duration"
                                placeholder="Select Duration"
                                value={med.duration}
                                options={DURATION_OPTIONS}
                                onSelect={(val) => updateMedication(index, 'duration', val)}
                                containerStyle={styles.whiteInput}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Save" onPress={handleSave} />
                </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(22),
        color: whiteColor,
    },
    closeButton: {
        width: ms(30),
        height: ms(30),
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
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    // Upload
    uploadContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: ms(14),
        paddingVertical: vs(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(16),
        marginBottom: vs(20),
        backgroundColor: '#F1F5F9',
    },
    uploadTitle: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginTop: vs(8),
    },
    uploadSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },
    uploadedText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: primaryColor,
        paddingHorizontal: ms(20),
    },
    // Medication Card
    medicationCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(16),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    cardHeaderTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    whiteInput: {
        backgroundColor: whiteColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default CurrentMedicationsScreen;
