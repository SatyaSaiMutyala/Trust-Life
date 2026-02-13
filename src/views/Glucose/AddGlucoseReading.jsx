import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
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

const READING_TYPES = [
    { id: 'fasting', label: 'Fasting', emoji: '🧘', bg: '#FFEBEE' },
    { id: 'before_meal', label: 'Before Meal', emoji: '🍽️', bg: '#E3F2FD' },
    { id: 'after_meal', label: 'After Meal', emoji: '😋', bg: '#FFF8E1' },
    { id: 'bedtime', label: 'Bedtime', emoji: '😴', bg: '#F3E5F5' },
];

const MOODS = [
    { id: 'relaxed', label: 'Relaxed', emoji: '😊', bg: '#FFF8E1' },
    { id: 'calm', label: 'Calm', emoji: '😌', bg: '#FFEBEE' },
    { id: 'normal', label: 'Normal', emoji: '🙂', bg: '#FFF8E1' },
    { id: 'worried', label: 'Worried', emoji: '😟', bg: '#FFEBEE' },
];

const AddGlucoseReading = () => {
    const navigation = useNavigation();
    const [glucoseValue, setGlucoseValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedType, setSelectedType] = useState('fasting');
    const [selectedMood, setSelectedMood] = useState(null);

    const formatDate = (d) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]},${d.getFullYear()}`;
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Reading Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'GlucoseDashboard',
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
                    <Text style={styles.headerTitle}>Add Glucose Readings</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate glucose trends and insights.
                </Text>

                {/* Glucose Value Input */}
                <View style={styles.pickerButton}>
                    <TextInput
                        style={styles.valueInput}
                        placeholder="Eg,72 mg/dL"
                        placeholderTextColor="#BDBDBD"
                        keyboardType="numeric"
                        value={glucoseValue}
                        onChangeText={setGlucoseValue}
                        maxLength={4}
                    />
                </View>

                {/* Date Picker */}
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.pickerText}>{formatDate(date)}</Text>
                    <Icon type={Icons.Ionicons} name="chevron-down" color={blackColor} size={ms(16)} />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                    />
                )}

                {/* Reading Type */}
                <Text style={styles.sectionLabel}>Reading Type</Text>
                <View style={styles.optionsRow}>
                    {READING_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={styles.optionItem}
                            onPress={() => setSelectedType(type.id)}
                        >
                            <View style={[styles.optionCircle, { backgroundColor: type.bg }]}>
                                <Text style={styles.optionEmoji}>{type.emoji}</Text>
                                {selectedType === type.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(10)} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.optionLabel}>{type.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Mood */}
                <Text style={styles.sectionLabel}>Mood</Text>
                <View style={styles.optionsRow}>
                    {MOODS.map((mood) => (
                        <TouchableOpacity
                            key={mood.id}
                            style={styles.optionItem}
                            onPress={() => setSelectedMood(mood.id)}
                        >
                            <View style={[styles.optionCircle, { backgroundColor: mood.bg }]}>
                                <Text style={styles.optionEmoji}>{mood.emoji}</Text>
                                {selectedMood === mood.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(10)} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.optionLabel}>{mood.label}</Text>
                        </TouchableOpacity>
                    ))}
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

export default AddGlucoseReading;

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
        marginTop: vs(10),
        marginBottom: vs(25),
    },

    // Input & Pickers
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        marginHorizontal: ms(20),
        marginBottom: vs(15),
        gap: ms(8),
    },
    valueInput: {
        flex: 1,
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        padding: 0,
    },
    pickerText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
    },

    // Reading Type & Mood sections
    sectionLabel: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        paddingHorizontal: ms(20),
        marginTop: vs(10),
        marginBottom: vs(15),
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: ms(15),
        marginBottom: vs(10),
    },
    optionItem: {
        alignItems: 'center',
        width: ms(70),
    },
    optionCircle: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    optionEmoji: {
        fontSize: ms(28),
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
        fontSize: ms(11),
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
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
