import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';

const FLOW_OPTIONS = [
    { id: 'spotting', label: 'Spotting', iconSize: ms(18) },
    { id: 'medium', label: 'Medium', iconSize: ms(22) },
    { id: 'high', label: 'Hight', iconSize: ms(26) },
    { id: 'clots', label: 'Clots', iconSize: ms(30) },
    { id: 'none', label: 'None', iconSize: ms(22), color: '#BDBDBD' },
];

const MOOD_OPTIONS = [
    { id: 'relaxed', label: 'Relaxed', emoji: '😊' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'normal', label: 'Normal', emoji: '🙂' },
    { id: 'worried', label: 'Worried', emoji: '😟' },
];

const SYMPTOM_OPTIONS = [
    { id: 'cramps', label: 'Cramps' },
    { id: 'headache', label: 'Headache' },
    { id: 'bloating', label: 'Bloating' },
    { id: 'backache', label: 'Backache' },
    { id: 'acne', label: 'Acene' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'tender_breast', label: 'Trender\nBreast' },
    { id: 'nausea', label: 'Nausea' },
    { id: 'constipation', label: 'Constipat\nion' },
    { id: 'diarrhea', label: 'Diarrheal' },
    { id: 'dizziness', label: 'Dizziness' },
];

const SEX_DRIVE_OPTIONS = [
    { id: 'protected', label: 'Protect Sex' },
    { id: 'unprotected', label: 'Unprotect Sex' },
    { id: 'masturbation', label: 'Masturbation' },
    { id: 'no_sex', label: 'No Sex' },
];

const DISCHARGE_OPTIONS = [
    { id: 'none', label: 'None' },
    { id: 'sticky', label: 'Sticky' },
    { id: 'creamy', label: 'Creamy' },
    { id: 'egg_white', label: 'Egg White' },
    { id: 'watery', label: 'Watery' },
];

const OVULATION_OPTIONS = [
    { id: 'positive', label: 'Positive' },
    { id: 'negative', label: 'Negative' },
    { id: 'method', label: 'Ovulation method' },
    { id: 'not_taken', label: "Didn't taken test" },
];

const PREGNANCY_OPTIONS = [
    { id: 'positive', label: 'Positive' },
    { id: 'negative', label: 'Negative' },
    { id: 'not_taken', label: 'Not taken' },
];

const BIRTH_CONTROL_OPTIONS = [
    { id: 'pill', label: 'Pill' },
    { id: 'iud', label: 'IUD' },
    { id: 'implant', label: 'Implant' },
    { id: 'patch', label: 'Patch' },
    { id: 'shot', label: 'Shot' },
    { id: 'condom', label: 'Condom' },
    { id: 'none', label: 'None' },
];

const ACTIVITY_OPTIONS = [
    { id: 'no_activity', label: 'No activity' },
    { id: 'light', label: 'Light workout' },
    { id: 'intense', label: 'Intense workout' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'walking', label: 'Walking' },
    { id: 'running', label: 'Running' },
];

const BREAST_OPTIONS = [
    { id: 'soreness', label: 'Soreness' },
    { id: 'swelling', label: 'Swelling' },
    { id: 'tenderness', label: 'Tenderness' },
    { id: 'nipple_pain', label: 'Nipple Pain' },
    { id: 'lumps', label: 'Lumps' },
    { id: 'none', label: 'No symptoms' },
];

const AddMenstrualCycle = () => {
    const navigation = useNavigation();

    // Date states
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Selection states
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [selectedSexDrive, setSelectedSexDrive] = useState(null);
    const [selectedDischarge, setSelectedDischarge] = useState(null);
    const [selectedOvulation, setSelectedOvulation] = useState(null);
    const [selectedPregnancy, setSelectedPregnancy] = useState(null);
    const [selectedBirthControl, setSelectedBirthControl] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState([]);
    const [selectedBreast, setSelectedBreast] = useState([]);

    const formatDate = (d) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]},${d.getFullYear()}`;
    };

    const toggleMulti = (arr, setter, val) => {
        if (arr.includes(val)) {
            setter(arr.filter(v => v !== val));
        } else {
            setter([...arr, val]);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Reading Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MenstrualCycleDashboard',
            useNavigate: true,
        });
    };

    // Render a drop icon option
    const renderDropOption = (opt, isSelected, onPress) => (
        <TouchableOpacity key={opt.id} style={styles.optionItem} onPress={onPress}>
            <View style={styles.optionCircle}>
                <Icon
                    type={Icons.Ionicons}
                    name="water"
                    color={opt.color || '#E53935'}
                    size={opt.iconSize || ms(26)}
                />
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(10)} />
                    </View>
                )}
            </View>
            <Text style={styles.optionLabel}>{opt.label}</Text>
        </TouchableOpacity>
    );

    // Render an emoji option
    const renderEmojiOption = (opt, isSelected, onPress) => (
        <TouchableOpacity key={opt.id} style={styles.optionItem} onPress={onPress}>
            <View style={[styles.optionCircle, { backgroundColor: '#FFF8E1' }]}>
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(10)} />
                    </View>
                )}
            </View>
            <Text style={styles.optionLabel}>{opt.label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Adding Menstrual Cycle</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate Period days, ovulation, fertility days trends
                </Text>

                {/* Date Pickers Row */}
                <View style={styles.dateRow}>
                    <View style={styles.dateCol}>
                        <Text style={styles.dateLabel}>Starting Date</Text>
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {startDate ? formatDate(startDate) : 'Select Date'}
                            </Text>
                            <Icon type={Icons.Ionicons} name="calendar-outline" color={blackColor} size={ms(16)} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dateCol}>
                        <Text style={styles.dateLabel}>Ending Date</Text>
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {endDate ? formatDate(endDate) : 'Select Date'}
                            </Text>
                            <Icon type={Icons.Ionicons} name="calendar-outline" color={blackColor} size={ms(16)} />
                        </TouchableOpacity>
                    </View>
                </View>

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(e, d) => {
                            setShowStartPicker(Platform.OS === 'ios');
                            if (d) setStartDate(d);
                        }}
                    />
                )}
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(e, d) => {
                            setShowEndPicker(Platform.OS === 'ios');
                            if (d) setEndDate(d);
                        }}
                    />
                )}

                {/* Flow Intensity */}
                <Text style={styles.sectionLabel}>Flow intensity</Text>
                <View style={styles.optionsGrid}>
                    {FLOW_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedFlow === opt.id, () => setSelectedFlow(opt.id))
                    )}
                </View>

                {/* Mood */}
                <Text style={styles.sectionLabel}>Mood</Text>
                <View style={styles.optionsGrid}>
                    {MOOD_OPTIONS.map((opt) =>
                        renderEmojiOption(opt, selectedMood === opt.id, () => setSelectedMood(opt.id))
                    )}
                </View>

                {/* Symptoms */}
                <Text style={styles.sectionLabel}>Symptoms</Text>
                <View style={styles.optionsGrid}>
                    {SYMPTOM_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedSymptoms.includes(opt.id), () => toggleMulti(selectedSymptoms, setSelectedSymptoms, opt.id))
                    )}
                </View>

                {/* Sex Drive */}
                <Text style={styles.sectionLabel}>Sex Drive</Text>
                <View style={styles.optionsGrid}>
                    {SEX_DRIVE_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedSexDrive === opt.id, () => setSelectedSexDrive(opt.id))
                    )}
                </View>

                {/* Vaginal Discharge */}
                <Text style={styles.sectionLabel}>Vaginal Discharge</Text>
                <View style={styles.optionsGrid}>
                    {DISCHARGE_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedDischarge === opt.id, () => setSelectedDischarge(opt.id))
                    )}
                </View>

                {/* Ovulation */}
                <Text style={styles.sectionLabel}>Ovulation</Text>
                <View style={styles.optionsGrid}>
                    {OVULATION_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedOvulation === opt.id, () => setSelectedOvulation(opt.id))
                    )}
                </View>

                {/* Pregnancy Test */}
                <Text style={styles.sectionLabel}>Pregnancy Test</Text>
                <View style={styles.optionsGrid}>
                    {PREGNANCY_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedPregnancy === opt.id, () => setSelectedPregnancy(opt.id))
                    )}
                </View>

                {/* Medical - Birth Control */}
                <Text style={styles.sectionLabel}>Medical - Birth Control</Text>
                <View style={styles.optionsGrid}>
                    {BIRTH_CONTROL_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedBirthControl.includes(opt.id), () => toggleMulti(selectedBirthControl, setSelectedBirthControl, opt.id))
                    )}
                </View>

                {/* Physical Activity */}
                <Text style={styles.sectionLabel}>Physical Activity</Text>
                <View style={styles.optionsGrid}>
                    {ACTIVITY_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedActivity.includes(opt.id), () => toggleMulti(selectedActivity, setSelectedActivity, opt.id))
                    )}
                </View>

                {/* Breast */}
                <Text style={styles.sectionLabel}>Breast</Text>
                <View style={styles.optionsGrid}>
                    {BREAST_OPTIONS.map((opt) =>
                        renderDropOption(opt, selectedBreast.includes(opt.id), () => toggleMulti(selectedBreast, setSelectedBreast, opt.id))
                    )}
                </View>

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Save Readings"
                    onPress={handleSave}
                    style={styles.saveButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddMenstrualCycle;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
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
        paddingHorizontal: ms(20),
        marginTop: vs(5),
        marginBottom: vs(20),
    },

    // Date Pickers
    dateRow: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        gap: ms(12),
        marginBottom: vs(20),
    },
    dateCol: {
        flex: 1,
    },
    dateLabel: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
        marginBottom: vs(6),
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
    },
    datePickerText: {
        fontSize: ms(12),
        color: '#888',
        fontWeight: '500',
    },

    // Section Labels
    sectionLabel: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        paddingHorizontal: ms(20),
        marginTop: vs(8),
        marginBottom: vs(12),
    },

    // Options Grid
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: ms(15),
        marginBottom: vs(5),
    },
    optionItem: {
        alignItems: 'center',
        width: '25%',
        marginBottom: vs(12),
    },
    optionCircle: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(28),
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    optionEmoji: {
        fontSize: ms(26),
    },
    checkBadge: {
        position: 'absolute',
        top: ms(0),
        right: ms(0),
        width: ms(18),
        height: ms(18),
        borderRadius: ms(9),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: whiteColor,
    },
    optionLabel: {
        fontSize: ms(10),
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: ms(14),
    },

    // Save Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
    saveButton: {
        marginTop: 0,
    },
});
