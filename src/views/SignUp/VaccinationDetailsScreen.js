import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const DOSE_OPTIONS = ['1 Dose', '2 Doses', '3 Doses', '4 Doses', '5 Doses'];

const emptyVaccination = () => ({
    id: Date.now() + Math.random(),
    name: '',
    doses: '',
    vaccinationDate: '',
    batchNo: '',
    manufactureName: '',
});

const VaccinationDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [vaccinations, setVaccinations] = useState([emptyVaccination()]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeDateIndex, setActiveDateIndex] = useState(0);
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [showDoseDropdown, setShowDoseDropdown] = useState(null);

    const addVaccination = () => {
        setVaccinations((prev) => [...prev, emptyVaccination()]);
    };

    const removeVaccination = (index) => {
        setVaccinations((prev) => prev.filter((_, i) => i !== index));
    };

    const updateVaccination = (index, field, value) => {
        setVaccinations((prev) =>
            prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
        );
    };

    const openDatePicker = (index) => {
        setActiveDateIndex(index);
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDefaultDate(selectedDate);
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            updateVaccination(activeDateIndex, 'vaccinationDate', `${day}/${month}/${year}`);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Vaccination Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                vaccinationData: vaccinations,
                completedCategory: 'vaccination',
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
                    <Text style={styles.headerTitle}>Vaccination Details</Text>
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
                    {/* Vaccination Cards */}
                    {vaccinations.map((vaccination, index) => (
                        <View key={vaccination.id} style={styles.vaccinationCard}>
                            {/* Card Header */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardHeaderTitle}>Vaccination</Text>
                                {index === 0 ? (
                                    <TouchableOpacity onPress={addVaccination}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="plus-circle"
                                            color={primaryColor}
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => removeVaccination(index)}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="minus-circle"
                                            color="#EF4444"
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Upload Image */}
                            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
                                <Icon
                                    type={Icons.Feather}
                                    name="upload"
                                    color="#9CA3AF"
                                    size={ms(22)}
                                />
                                <Text style={styles.uploadText}>Upload Vaccination bottle Image</Text>
                                <Text style={styles.uploadFormat}>PNG,JPG</Text>
                            </TouchableOpacity>

                            {/* Name */}
                            <InputField
                                label="Name"
                                placeholder="Enter Surgery Name"
                                value={vaccination.name}
                                onChangeText={(text) => updateVaccination(index, 'name', text)}
                                containerStyle={styles.whiteInput}
                            />

                            {/* Doses */}
                            <View style={styles.fieldWrapper}>
                                <Text style={styles.fieldLabel}>Doses</Text>
                                <TouchableOpacity
                                    style={styles.dropdownField}
                                    activeOpacity={0.7}
                                    onPress={() => setShowDoseDropdown(showDoseDropdown === index ? null : index)}>
                                    <Text style={[styles.dropdownText, !vaccination.doses && styles.placeholderText]}>
                                        {vaccination.doses || '2 Doses'}
                                    </Text>
                                    <Icon
                                        type={Icons.Feather}
                                        name="chevron-down"
                                        color="#9CA3AF"
                                        size={ms(18)}
                                    />
                                </TouchableOpacity>
                                {showDoseDropdown === index && (
                                    <View style={styles.dropdownList}>
                                        {DOSE_OPTIONS.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    updateVaccination(index, 'doses', option);
                                                    setShowDoseDropdown(null);
                                                }}>
                                                <Text style={styles.dropdownItemText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Vaccination Date */}
                            <InputField
                                label="Vaccination  Date"
                                placeholder="Select Vaccination  Date"
                                value={vaccination.vaccinationDate}
                                onPressIn={() => openDatePicker(index)}
                                iconType={Icons.Feather}
                                iconName="calendar"
                                containerStyle={styles.whiteInput}
                            />

                            {/* Batch No */}
                            <InputField
                                label="Batch No"
                                placeholder="Enter Batch No"
                                value={vaccination.batchNo}
                                onChangeText={(text) => updateVaccination(index, 'batchNo', text)}
                                iconType={Icons.Feather}
                                iconName="calendar"
                                containerStyle={styles.whiteInput}
                            />

                            {/* Manufacture Name */}
                            <InputField
                                label="Manufacture Name"
                                placeholder="Enter Manufacture Name"
                                value={vaccination.manufactureName}
                                onChangeText={(text) => updateVaccination(index, 'manufactureName', text)}
                                iconType={Icons.Feather}
                                iconName="calendar"
                                containerStyle={styles.whiteInput}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Save" onPress={handleSave} />
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                    <DateTimePicker
                        value={defaultDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        maximumDate={new Date()}
                        onChange={onDateChange}
                    />
                )}
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
        flex: 1,
        fontFamily: bold,
        fontSize: ms(20),
        color: whiteColor,
        marginRight: ms(12),
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
        paddingTop: vs(16),
    },
    vaccinationCard: {
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

    // Upload Box
    uploadBox: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: ms(12),
        backgroundColor: whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: vs(20),
        marginBottom: vs(12),
    },
    uploadText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        marginTop: vs(8),
    },
    uploadFormat: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
        marginTop: vs(2),
    },

    whiteInput: {
        backgroundColor: whiteColor,
    },

    // Doses Dropdown
    fieldWrapper: {
        marginBottom: vs(10),
    },
    fieldLabel: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(6),
    },
    dropdownField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        height: vs(40),
        paddingHorizontal: ms(15),
    },
    dropdownText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },
    placeholderText: {
        color: '#A0A0A0',
    },
    dropdownList: {
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        marginTop: vs(4),
        elevation: 3,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        paddingHorizontal: ms(15),
        paddingVertical: vs(12),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F1F5F9',
    },
    dropdownItemText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },

    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default VaccinationDetailsScreen;
