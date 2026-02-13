import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon, { Icons } from '../components/Icons';
import { StatusBar } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import { ms, vs, scale, verticalScale, moderateScale } from 'react-native-size-matters';

const genders = ['Male', 'Female'];
const relations = ['Self', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];

const SubmitPrescription = ({ route }) => {
    const navigation = useNavigation();
    const uploadedImages = route.params?.uploadedImages || [];

    const [patientsData, setPatientsData] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [address, setAddress] = useState(null);

    // Bottom sheet state
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [patientGender, setPatientGender] = useState(null);
    const [patientRelation, setPatientRelation] = useState(null);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showRelationDropdown, setShowRelationDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleClear = () => {
        setPatientName('');
        setDateOfBirth(null);
        setPatientGender(null);
        setPatientRelation(null);
        setShowPatientModal(false);
        setShowGenderDropdown(false);
        setShowRelationDropdown(false);
    };

    const handleDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            setDateOfBirth(`${year}-${month}-${day}`);
        }
    };

    const handleAddPatient = () => {
        if (!patientName || !patientRelation || !dateOfBirth) {
            Alert.alert('Error', 'Please fill all the details');
            return;
        }
        if (!patientGender) {
            Alert.alert('Error', 'Please select the gender');
            return;
        }
        const newPatient = {
            id: Date.now(),
            name: patientName,
            date_of_birth: dateOfBirth,
            gender: patientGender,
            relation: patientRelation,
        };
        setPatientsData((prev) => [...prev, newPatient]);
        setSelectedPatient(newPatient);
        handleClear();
    };

    const handleSubmit = () => {
        if (!selectedPatient) {
            Alert.alert('Error', 'Please select a patient');
            return;
        }
        navigation.navigate('SuccessScreen', {
            title: 'Prescription Submitted',
            subtitle: 'Successfully',
            targetScreen: 'Home',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />

            <View style={styles.secondHeader}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Submit Prescription</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Patient Details Section */}
                    <Text style={styles.sectionTitle}>Patient Details</Text>

                    {/* Patient Row */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailLeft}>
                            <Text style={styles.detailLabel}>Patient</Text>
                            {selectedPatient ? (
                                <Text style={styles.detailValue}>
                                    {selectedPatient.first_name || selectedPatient.name}
                                </Text>
                            ) : (
                                <Text style={styles.detailValueRed}>Patient not selected</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setShowPatientModal(true)}
                        >
                            <Icon type={Icons.Feather} name="plus" color={blackColor} size={ms(16)} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Selected Patients List */}
                    {patientsData.length > 0 && (
                        <View style={styles.patientsList}>
                            {patientsData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.patientChip,
                                        selectedPatient?.id === item.id && styles.patientChipSelected,
                                    ]}
                                    onPress={() => setSelectedPatient(item)}
                                >
                                    <View style={styles.patientAvatar}>
                                        <Icon type={Icons.AntDesign} name="user" size={ms(14)} color={primaryColor} />
                                    </View>
                                    <Text style={[
                                        styles.patientChipText,
                                        selectedPatient?.id === item.id && styles.patientChipTextSelected,
                                    ]}>
                                        {item.first_name || item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Address Row */}
                    <View style={[styles.detailRow, { marginTop: vs(20) }]}>
                        <View style={styles.detailLeft}>
                            <Text style={styles.detailLabel}>Home Address</Text>
                            <Text style={styles.detailValueGray} numberOfLines={2}>
                                {address?.address || 'No address available'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('Address')}
                        >
                            <Icon type={Icons.Feather} name="plus" color={blackColor} size={ms(16)} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.bottomButton}>
                    <PrimaryButton title="Submit" onPress={handleSubmit} />
                </View>
            </View>

            {/* Add Patient Bottom Sheet Modal */}
            <Modal
                visible={showPatientModal}
                transparent
                animationType="slide"
                onRequestClose={handleClear}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={handleClear}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }}
                        style={styles.modalContent}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBarWrap}>
                            <View style={styles.handleBar} />
                        </View>

                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Patient Details</Text>
                            <TouchableOpacity onPress={handleClear}>
                                <Icon type={Icons.AntDesign} name="close" size={moderateScale(24)} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScroll}
                        >
                            {/* Date of Birth */}
                            <TouchableOpacity onPress={handleDatePicker} style={styles.inputRow}>
                                <Text style={[styles.inputText, { color: dateOfBirth ? '#000' : '#9E9E9E' }]}>
                                    {dateOfBirth || 'Date of birth'}
                                </Text>
                                <Icon
                                    type={Icons.MaterialCommunityIcons}
                                    name="calendar-blank-outline"
                                    size={moderateScale(20)}
                                    color="#757575"
                                />
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                />
                            )}

                            {/* Patient Name */}
                            <View style={[styles.inputRow, { marginTop: verticalScale(12) }]}>
                                <TextInput
                                    placeholder="Enter Patient name"
                                    placeholderTextColor="#9E9E9E"
                                    value={patientName}
                                    onChangeText={setPatientName}
                                    style={styles.textInput}
                                />
                                <Icon type={Icons.Feather} name="user" size={moderateScale(20)} color="#757575" />
                            </View>

                            {/* Select Gender */}
                            <View style={{ marginTop: verticalScale(12) }}>
                                <TouchableOpacity
                                    onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                                    style={styles.inputRow}
                                >
                                    <Text style={[styles.inputText, { color: patientGender ? '#000' : '#9E9E9E' }]}>
                                        {patientGender || 'Select Gender'}
                                    </Text>
                                    <Icon type={Icons.Feather} name="chevron-down" size={moderateScale(20)} color="#757575" />
                                </TouchableOpacity>

                                {showGenderDropdown && (
                                    <View style={styles.dropdownContainer}>
                                        {genders.map((g) => (
                                            <TouchableOpacity
                                                key={g}
                                                onPress={() => {
                                                    setPatientGender(g);
                                                    setShowGenderDropdown(false);
                                                }}
                                                style={styles.dropdownItem}
                                            >
                                                <Text style={styles.dropdownText}>{g}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Select Relation */}
                            <View style={{ marginTop: verticalScale(12) }}>
                                <TouchableOpacity
                                    onPress={() => setShowRelationDropdown(!showRelationDropdown)}
                                    style={styles.inputRow}
                                >
                                    <Text style={[styles.inputText, { color: patientRelation ? '#000' : '#9E9E9E' }]}>
                                        {patientRelation || 'Select relation'}
                                    </Text>
                                    <Icon type={Icons.Feather} name="chevron-down" size={moderateScale(20)} color="#757575" />
                                </TouchableOpacity>

                                {showRelationDropdown && (
                                    <View style={[styles.dropdownContainer, { maxHeight: verticalScale(200) }]}>
                                        <ScrollView nestedScrollEnabled>
                                            {relations.map((r) => (
                                                <TouchableOpacity
                                                    key={r}
                                                    onPress={() => {
                                                        setPatientRelation(r);
                                                        setShowRelationDropdown(false);
                                                    }}
                                                    style={styles.dropdownItem}
                                                >
                                                    <Text style={styles.dropdownText}>{r}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Add Patient Button */}
                            <View style={{ marginTop: verticalScale(10) }}>
                                <PrimaryButton onPress={handleAddPatient} title="Add Patient" />
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default SubmitPrescription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    secondHeader: {
        flex: 1,
        paddingTop: ms(50),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(10),
    },
    headerButton: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ms(10),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginLeft: ms(5),
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(30),
    },

    // Section
    sectionTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
        marginBottom: vs(20),
    },

    // Detail Row
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLeft: {
        flex: 1,
        marginRight: ms(10),
    },
    detailLabel: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(4),
    },
    detailValue: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    detailValueRed: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#EF4444',
    },
    detailValueGray: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
    },

    // Add Button
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: ms(8),
        paddingHorizontal: ms(14),
        paddingVertical: vs(6),
        gap: ms(4),
        backgroundColor:'#E2FFFB'
    },
    addButtonText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },

    // Patients List
    patientsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
        marginTop: vs(14),
    },
    patientChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: vs(6),
        gap: ms(6),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    patientChipSelected: {
        borderColor: primaryColor,
        backgroundColor: '#E8F5F2',
    },
    patientAvatar: {
        width: ms(26),
        height: ms(26),
        borderRadius: ms(13),
        backgroundColor: '#EAF0FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientChipText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },
    patientChipTextSelected: {
        fontFamily: bold,
        color: primaryColor,
    },

    // Bottom Button
    bottomButton: {
        paddingHorizontal: ms(20),
        paddingBottom: ms(25),
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        maxHeight: '80%',
        paddingTop: verticalScale(16),
    },
    handleBarWrap: {
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    handleBar: {
        width: scale(40),
        height: verticalScale(4),
        backgroundColor: '#E0E0E0',
        borderRadius: moderateScale(2),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(24),
        marginBottom: verticalScale(8),
    },
    modalTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#000',
    },
    modalScroll: {
        paddingHorizontal: scale(24),
        paddingBottom: verticalScale(20),
    },

    // Input Row
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: moderateScale(12),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(16),
        marginTop: verticalScale(16),
    },
    inputText: {
        fontSize: moderateScale(12),
        fontWeight: '400',
    },
    textInput: {
        flex: 1,
        fontSize: moderateScale(12),
        fontWeight: '400',
        color: '#000',
        padding: 0,
    },

    // Dropdown
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: moderateScale(12),
        marginTop: verticalScale(8),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownText: {
        fontSize: moderateScale(12),
        color: '#000',
    },
});
