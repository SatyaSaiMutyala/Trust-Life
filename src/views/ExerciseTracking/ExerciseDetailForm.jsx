import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import InputField from '../../utils/InputField';
import PrimaryButton from '../../utils/primaryButton';

const INTENSITY_OPTIONS = ['Low', 'Moderate', 'High'];

const ExerciseDetailForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const exerciseName = route.params?.exerciseName || 'Exercise';
    const category = route.params?.category || '';
    const caloriesPerMin = route.params?.caloriesPerMin || 5;

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');
    const [pose, setPose] = useState('');
    const [variationName, setVariationName] = useState('');
    const [sets, setSets] = useState('');
    const [restTime, setRestTime] = useState('');
    const [reps, setReps] = useState('');
    const [intensity, setIntensity] = useState('Moderate');

    const isCardio = category === 'Cardio Exercises';
    const isStrength = category === 'Strength Exercises';
    const isFlexibility = category === 'Flexibility Exercises';

    const formatDate = (d) => {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (t) => {
        return t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) setTime(selectedTime);
    };

    const handleSave = () => {
        const durationNum = parseInt(duration) || 0;
        const intensityMultiplier = intensity === 'High' ? 1.3 : intensity === 'Low' ? 0.7 : 1.0;
        const calories = Math.round(durationNum * caloriesPerMin * intensityMultiplier);

        const exerciseData = {
            exerciseName,
            category,
            date: formatDate(date),
            time: formatTime(time),
            intensity,
            calories,
        };

        if (isCardio) {
            exerciseData.duration = duration || '0';
            exerciseData.distance = distance || '0';
            exerciseData.steps = exerciseName === 'Walking' ? durationNum * 100 :
                exerciseName === 'Running' ? durationNum * 150 :
                exerciseName === 'Jogging' ? durationNum * 120 : 0;
        } else if (isStrength) {
            exerciseData.variationName = variationName;
            exerciseData.sets = sets || '0';
            exerciseData.restTime = restTime || '0';
            exerciseData.reps = reps || '0';
            exerciseData.duration = sets && restTime ? String(parseInt(sets) * 2 + parseInt(sets) * (parseInt(restTime) / 60)) : '0';
        } else if (isFlexibility) {
            exerciseData.duration = duration || '0';
            exerciseData.pose = pose;
        }

        navigation.navigate('SuccessScreen', {
            title: 'Exercise Added',
            subtitle: 'Successfully',
            delay: 1500,
            targetScreen: 'ExerciseTrackingDashboard',
            targetParams: { addedExercise: exerciseData },
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
                        <Text style={styles.headerTitle}>{exerciseName}</Text>
                        <Text style={styles.headerSubtitle}>{category}</Text>
                    </View>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Log your workout details to track performance and understand your fitness progress clearly.
                </Text>

                {/* Date & Time Row */}
                <View style={styles.formSection}>
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeField}>
                            <InputField
                                label="Date"
                                placeholder="Select Date"
                                value={formatDate(date)}
                                onPressIn={() => setShowDatePicker(true)}
                                iconType={Icons.Ionicons}
                                iconName="calendar-outline"
                            />
                        </View>
                        <View style={styles.dateTimeField}>
                            <InputField
                                label="Time"
                                placeholder="Select Time"
                                value={formatTime(time)}
                                onPressIn={() => setShowTimePicker(true)}
                                iconType={Icons.Ionicons}
                                iconName="time-outline"
                            />
                        </View>
                    </View>

                    {/* Cardio Fields */}
                    {isCardio && (
                        <>
                            <InputField
                                label="Duration"
                                placeholder="Enter Duration"
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                                suffixText="mins"
                            />
                            <InputField
                                label="Distance Covered"
                                placeholder="Enter Distance Covered"
                                value={distance}
                                onChangeText={setDistance}
                                keyboardType="numeric"
                                suffixText="km"
                            />
                        </>
                    )}

                    {/* Strength Fields */}
                    {isStrength && (
                        <>
                            <InputField
                                label="Variation Name"
                                placeholder="Enter Variation Name"
                                value={variationName}
                                onChangeText={setVariationName}
                            />
                            <InputField
                                label="No.of Sets"
                                placeholder="Enter No.of Sets"
                                value={sets}
                                onChangeText={setSets}
                                keyboardType="numeric"
                            />
                            <InputField
                                label="Rest time between sets"
                                placeholder="Enter No.of Repetition"
                                value={restTime}
                                onChangeText={setRestTime}
                                keyboardType="numeric"
                            />
                            <InputField
                                label="Repetitions (Reps)"
                                placeholder="Enter No.of Repetition"
                                value={reps}
                                onChangeText={setReps}
                                keyboardType="numeric"
                            />
                        </>
                    )}

                    {/* Flexibility Fields */}
                    {isFlexibility && (
                        <>
                            <InputField
                                label="Duration"
                                placeholder="Enter Duration"
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                                suffixText="mins"
                            />
                            <InputField
                                label="Pose"
                                placeholder="Enter Pose"
                                value={pose}
                                onChangeText={setPose}
                            />
                        </>
                    )}

                    {/* Intensity Level */}
                    <Text style={styles.intensityLabel}>Intensity Level</Text>
                    <View style={styles.intensityRow}>
                        {INTENSITY_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.intensityBtn,
                                    intensity === option && styles.intensityBtnActive,
                                ]}
                                onPress={() => setIntensity(option)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.intensityBtnText,
                                    intensity === option && styles.intensityBtnTextActive,
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Date/Time Pickers */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                    />
                )}

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Save Details"
                    onPress={handleSave}
                    style={{ marginTop: 0 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default ExerciseDetailForm;

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
    dateTimeRow: {
        flexDirection: 'row',
        gap: ms(12),
    },
    dateTimeField: {
        flex: 1,
    },

    // Intensity
    intensityLabel: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(8),
        marginTop: vs(5),
    },
    intensityRow: {
        flexDirection: 'row',
        gap: ms(10),
    },
    intensityBtn: {
        flex: 1,
        paddingVertical: vs(12),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    intensityBtnActive: {
        backgroundColor: primaryColor,
    },
    intensityBtnText: {
        fontSize: ms(13),
        color: '#666',
        fontWeight: '600',
    },
    intensityBtnTextActive: {
        color: whiteColor,
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(25),
        paddingTop: vs(10),
        backgroundColor: whiteColor,
    },
});
