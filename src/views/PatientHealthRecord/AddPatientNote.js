import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../../utils/primaryButton';

const SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Cold', 'Body Pain', 'Fatigue', 'Nausea', 'Sore Throat'];
const WHEN_OPTIONS = ['Today', 'Yesterday', '2 Days ago', '3 Days ago', '1 Week ago'];
const SEVERITY_OPTIONS = ['Low', 'Normal', 'High'];
const FREQUENCY_OPTIONS = ['Constant', 'Comes & Goes'];
const FEELINGS = [
    { emoji: '\uD83D\uDE10', label: 'Tired' },
    { emoji: '\uD83D\uDE04', label: 'Unwell' },
    { emoji: '\uD83D\uDE0A', label: 'Relaxed' },
    { emoji: '\uD83D\uDE14', label: 'Sad' },
];

const AddPatientNote = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fromFab = false } = route.params || {};

    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
    const [whenStarted, setWhenStarted] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateText, setDateText] = useState(null);
    const [severity, setSeverity] = useState('Normal');
    const [frequency, setFrequency] = useState('Constant');
    const [additionalSymptoms, setAdditionalSymptoms] = useState([]);
    const [showAddSymptomDropdown, setShowAddSymptomDropdown] = useState(false);
    const [reliefTaken, setReliefTaken] = useState('');
    const [feeling, setFeeling] = useState(null);
    const [notes, setNotes] = useState('');

    // Animated scales for each feeling emoji
    const feelingScales = useRef(
        FEELINGS.reduce((acc, item) => {
            acc[item.label] = new Animated.Value(1);
            return acc;
        }, {})
    ).current;

    const handleFeelingPress = useCallback((label) => {
        setFeeling(label);
        const scaleAnim = feelingScales[label];
        scaleAnim.setValue(0.5);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 150,
            useNativeDriver: true,
        }).start();
    }, [feelingScales]);

    const handleDateChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            setDateText(`${day}/${month}/${year}`);
        }
    };

    const handleRemoveSymptom = (index) => {
        setAdditionalSymptoms((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddSymptom = (symptom) => {
        if (!additionalSymptoms.includes(symptom)) {
            setAdditionalSymptoms((prev) => [...prev, symptom]);
        }
        setShowAddSymptomDropdown(false);
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Note Saved',
            subtitle: 'Successfully',
            targetScreen: 'PatientNote',
            useNavigate: true,
        });
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.16]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name={fromFab ? "close" : "arrow-back"}
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.pageTitle}>Add a problem/Symptom Note</Text>
                <Text style={styles.pageSubtitle}>
                    Detailed notes help your doctor Provide more{'\n'}accurate care and tracking
                </Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Symptom/Problem */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Symptom/Problem</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            activeOpacity={0.7}
                            onPress={() => setShowSymptomDropdown(!showSymptomDropdown)}
                        >
                            <Text style={[styles.dropdownText, !selectedSymptom && styles.placeholderText]}>
                                {selectedSymptom || 'Select Symptom/Problem'}
                            </Text>
                            <Icon
                                type={Icons.Feather}
                                name="chevron-down"
                                color="#9CA3AF"
                                size={ms(18)}
                            />
                        </TouchableOpacity>
                        {showSymptomDropdown && (
                            <View style={styles.dropdownList}>
                                {SYMPTOMS.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedSymptom(item);
                                            setShowSymptomDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* When it Started */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>When it Started</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                            {WHEN_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.chip, whenStarted === option && styles.chipSelected]}
                                    onPress={() => setWhenStarted(option)}
                                >
                                    <Text style={[styles.chipText, whenStarted === option && styles.chipTextSelected]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[styles.dateInputText, !dateText && styles.placeholderText]}>
                                {dateText || 'Select Date'}
                            </Text>
                            <Icon
                                type={Icons.Feather}
                                name="calendar"
                                color="#9CA3AF"
                                size={ms(18)}
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
                    </View>

                    {/* Severity level */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Severity level</Text>
                        <View style={styles.chipsRow}>
                            {SEVERITY_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.chip, severity === option && styles.chipSelected]}
                                    onPress={() => setSeverity(option)}
                                >
                                    {severity === option && (
                                        <Icon
                                            type={Icons.Feather}
                                            name="check"
                                            color={whiteColor}
                                            size={ms(14)}
                                        />
                                    )}
                                    <Text style={[styles.chipText, severity === option && styles.chipTextSelected]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Frequency */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Frequency</Text>
                        <View style={styles.chipsRow}>
                            {FREQUENCY_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.chip, frequency === option && styles.chipSelected]}
                                    onPress={() => setFrequency(option)}
                                >
                                    {frequency === option && (
                                        <Icon
                                            type={Icons.Feather}
                                            name="check"
                                            color={whiteColor}
                                            size={ms(14)}
                                        />
                                    )}
                                    <Text style={[styles.chipText, frequency === option && styles.chipTextSelected]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Additional Symptoms */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Additional Symptoms</Text>
                        <View style={styles.symptomsWrap}>
                            <TouchableOpacity
                                style={styles.addMoreChip}
                                onPress={() => setShowAddSymptomDropdown(!showAddSymptomDropdown)}
                            >
                                <Icon
                                    type={Icons.Feather}
                                    name="plus"
                                    color="#6B7280"
                                    size={ms(14)}
                                />
                                <Text style={styles.addMoreText}>Add more</Text>
                            </TouchableOpacity>
                            {additionalSymptoms.map((symptom, index) => (
                                <View key={index} style={styles.symptomTag}>
                                    <Text style={styles.symptomTagText}>{symptom}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveSymptom(index)}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="x"
                                            color={blackColor}
                                            size={ms(14)}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        {showAddSymptomDropdown && (
                            <View style={styles.dropdownList}>
                                {SYMPTOMS.filter((s) => !additionalSymptoms.includes(s)).map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.dropdownItem}
                                        onPress={() => handleAddSymptom(item)}
                                    >
                                        <Text style={styles.dropdownItemText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Relief Taken */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Relief Taken</Text>
                        <View style={styles.textInputWrap}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Eg, Rest"
                                placeholderTextColor="#9CA3AF"
                                value={reliefTaken}
                                onChangeText={setReliefTaken}
                            />
                        </View>
                    </View>

                    {/* How are you feeling now? */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>How are you feeling now?</Text>
                        <View style={styles.feelingsRow}>
                            {FEELINGS.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={[styles.feelingItem, feeling === item.label && styles.feelingItemSelected]}
                                    onPress={() => handleFeelingPress(item.label)}
                                >
                                    <Animated.Text style={[styles.feelingEmoji, { transform: [{ scale: feelingScales[item.label] }] }]}>
                                        {item.emoji}
                                    </Animated.Text>
                                    <Text style={[styles.feelingLabel, feeling === item.label && styles.feelingLabelSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Notes */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Notes</Text>
                        <View style={styles.notesInputWrap}>
                            <TextInput
                                style={styles.notesInput}
                                placeholder="Describe How you feel in our own words"
                                placeholderTextColor="#9CA3AF"
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Add another note */}
                    <TouchableOpacity style={styles.addAnotherRow} activeOpacity={0.7}>
                        <Icon
                            type={Icons.Feather}
                            name="plus-circle"
                            color="#9CA3AF"
                            size={ms(20)}
                        />
                        <Text style={styles.addAnotherText}>Add another note</Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <PrimaryButton title="Save" onPress={handleSave} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(5),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
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

    // Title
    pageTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        textAlign: 'center',
        marginTop: vs(10),
    },
    pageSubtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(18),
        marginTop: vs(6),
        marginBottom: vs(10),
    },

    // Scroll
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Section
    section: {
        marginBottom: vs(20),
    },
    sectionLabel: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(10),
    },

    // Dropdown
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
    },
    dropdownText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    dropdownList: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        marginTop: vs(4),
        elevation: 3,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(12),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F1F5F9',
    },
    dropdownItemText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Chips
    chipsRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: vs(10),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
    },
    chipSelected: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    chipText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    chipTextSelected: {
        fontFamily: bold,
        color: whiteColor,
    },

    // Date Input
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        paddingVertical: vs(14),
    },
    dateInputText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },

    // Additional Symptoms
    symptomsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
    },
    addMoreChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(5),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        backgroundColor: whiteColor,
    },
    addMoreText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    symptomTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
    },
    symptomTagText: {
        fontFamily: regular,
        fontSize: ms(12),
        color: blackColor,
    },

    // Text Input
    textInputWrap: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        paddingVertical: vs(4),
    },
    textInput: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        paddingVertical: vs(10),
    },

    // Feelings
    feelingsRow: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        gap: ms(16),
    },
    feelingItem: {
        alignItems: 'center',
        padding:ms(15),
        gap: vs(5),
        opacity: 0.4,
        backgroundColor:'#F8FAFC'
    },
    feelingItemSelected: {
        opacity: 1,
    },
    feelingEmoji: {
        fontSize: ms(40),
        includeFontPadding: false,
    },
    feelingLabel: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
    },
    feelingLabelSelected: {
        fontFamily: bold,
        color: blackColor,
    },

    // Notes
    notesInputWrap: {
        backgroundColor: '#F8FAFC',
        borderRadius: ms(12),
        paddingHorizontal: ms(16),
        minHeight: vs(100),
    },
    notesInput: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        paddingVertical: vs(12),
    },

    // Add another note
    addAnotherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(8),
        paddingVertical: vs(14),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: ms(12),
        marginBottom: vs(5),
    },
    addAnotherText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: '#6B7280',
    },
});

export default AddPatientNote;
