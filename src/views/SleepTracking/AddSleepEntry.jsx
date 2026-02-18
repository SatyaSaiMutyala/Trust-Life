import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import InputField from '../../utils/InputField';
import PrimaryButton from '../../utils/primaryButton';

const QUALITY_OPTIONS = [
    { value: 1, label: 'Poor', color: '#EF5350' },
    { value: 2, label: 'Fair', color: '#FF9800' },
    { value: 3, label: 'Good', color: '#FFC107' },
    { value: 4, label: 'Great', color: '#66BB6A' },
    { value: 5, label: 'Excellent', color: '#26A69A' },
];

const formatDate = (d) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (t) =>
    t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const calcDuration = (bedtime, wakeTime) => {
    let diff = wakeTime - bedtime;
    if (diff < 0) diff += 24 * 60 * 60 * 1000; // next day wake up
    return Math.round(diff / 60000); // in minutes
};

const AddSleepEntry = () => {
    const navigation = useNavigation();

    const defaultBedtime = () => {
        const d = new Date();
        d.setHours(22, 0, 0, 0);
        return d;
    };
    const defaultWakeTime = () => {
        const d = new Date();
        d.setHours(6, 0, 0, 0);
        return d;
    };

    const [date, setDate] = useState(new Date());
    const [bedtime, setBedtime] = useState(defaultBedtime());
    const [wakeTime, setWakeTime] = useState(defaultWakeTime());
    const [quality, setQuality] = useState(3);
    const [notes, setNotes] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showBedtimePicker, setShowBedtimePicker] = useState(false);
    const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);

    const duration = calcDuration(bedtime, wakeTime);
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;

    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) setDate(selected);
    };
    const onBedtimeChange = (event, selected) => {
        setShowBedtimePicker(false);
        if (selected) setBedtime(selected);
    };
    const onWakeTimeChange = (event, selected) => {
        setShowWakeTimePicker(false);
        if (selected) setWakeTime(selected);
    };

    const handleSave = () => {
        const entryData = {
            date: formatDate(date),
            bedtime: formatTime(bedtime),
            wakeTime: formatTime(wakeTime),
            duration,
            quality,
            notes: notes.trim(),
        };

        navigation.navigate('SuccessScreen', {
            title: 'Sleep Logged',
            subtitle: 'Successfully',
            delay: 1500,
            targetScreen: 'SleepTrackingDashboard',
            targetParams: { addedEntry: entryData },
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
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Log Sleep</Text>
                        <Text style={styles.headerSubtitle}>Track your sleep session</Text>
                    </View>
                    <View style={{ width: ms(40) }} />
                </View>

                <Text style={styles.description}>
                    Enter your sleep details to understand your rest patterns and improve your sleep quality over time.
                </Text>

                <View style={styles.formSection}>

                    {/* Date */}
                    <InputField
                        label="Date"
                        placeholder="Select Date"
                        value={formatDate(date)}
                        onPressIn={() => setShowDatePicker(true)}
                        iconType={Icons.Ionicons}
                        iconName="calendar-outline"
                    />

                    {/* Bedtime & Wake Time */}
                    <View style={styles.timeRow}>
                        <View style={styles.timeField}>
                            <InputField
                                label="Bedtime"
                                placeholder="Select Bedtime"
                                value={formatTime(bedtime)}
                                onPressIn={() => setShowBedtimePicker(true)}
                                iconType={Icons.Ionicons}
                                iconName="moon-outline"
                            />
                        </View>
                        <View style={styles.timeField}>
                            <InputField
                                label="Wake Time"
                                placeholder="Select Wake Time"
                                value={formatTime(wakeTime)}
                                onPressIn={() => setShowWakeTimePicker(true)}
                                iconType={Icons.Ionicons}
                                iconName="sunny-outline"
                            />
                        </View>
                    </View>

                    {/* Duration Summary */}
                    <View style={styles.durationCard}>
                        <Icon type={Icons.Ionicons} name="time-outline" color={primaryColor} size={ms(18)} />
                        <Text style={styles.durationLabel}>Total Sleep Duration</Text>
                        <Text style={styles.durationValue}>
                            {hours}h {mins}m
                        </Text>
                    </View>

                    {/* Sleep Quality */}
                    <Text style={styles.qualityLabel}>Sleep Quality</Text>
                    <View style={styles.qualityRow}>
                        {QUALITY_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.qualityBtn,
                                    quality === opt.value && { backgroundColor: opt.color },
                                ]}
                                onPress={() => setQuality(opt.value)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.qualityBtnText,
                                    quality === opt.value && styles.qualityBtnTextActive,
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Notes */}
                    <Text style={styles.notesLabel}>Notes (optional)</Text>
                    <View style={styles.notesContainer}>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Any notes about your sleep (e.g. woke up during night, vivid dreams...)"
                            placeholderTextColor="#BBBBBB"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                </View>

                {/* Pickers */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}
                {showBedtimePicker && (
                    <DateTimePicker
                        value={bedtime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onBedtimeChange}
                    />
                )}
                {showWakeTimePicker && (
                    <DateTimePicker
                        value={wakeTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onWakeTimeChange}
                    />
                )}

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Save Sleep Entry"
                    onPress={handleSave}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddSleepEntry;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingBottom: vs(20),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(5),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    headerSubtitle: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },

    description: {
        fontSize: ms(12),
        color: '#888',
        lineHeight: ms(18),
        paddingHorizontal: ms(15),
        marginTop: vs(5),
        marginBottom: vs(15),
    },

    // Form
    formSection: {
        paddingHorizontal: ms(15),
    },
    timeRow: {
        flexDirection: 'row',
        gap: ms(12),
    },
    timeField: {
        flex: 1,
    },

    // Duration Card
    durationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF9F9',
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        marginBottom: vs(15),
        gap: ms(10),
    },
    durationLabel: {
        flex: 1,
        fontSize: ms(13),
        color: '#555',
        fontWeight: '500',
    },
    durationValue: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: primaryColor,
    },

    // Quality
    qualityLabel: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
    },
    qualityRow: {
        flexDirection: 'row',
        gap: ms(6),
        marginBottom: vs(20),
        flexWrap: 'wrap',
    },
    qualityBtn: {
        flex: 1,
        minWidth: ms(55),
        paddingVertical: vs(10),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qualityBtnText: {
        fontSize: ms(11),
        color: '#666',
        fontWeight: '600',
    },
    qualityBtnTextActive: {
        color: whiteColor,
    },

    // Notes
    notesLabel: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
    },
    notesContainer: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(12),
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
        minHeight: vs(80),
    },
    notesInput: {
        fontSize: ms(13),
        color: blackColor,
        lineHeight: ms(20),
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(10),
        backgroundColor: whiteColor,
    },
});
