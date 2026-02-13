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
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const AddBloodPressureReading = () => {
    const navigation = useNavigation();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const formatDate = (d) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]},${d.getFullYear()}`;
    };

    const formatTime = (t) => {
        let hours = t.getHours();
        const minutes = t.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Reading Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'BloodPressureDashboard',
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
                    <Text style={styles.headerTitle}>Add Blood Pressure Readings</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate blood pressure trends and insights.
                </Text>

                {/* Systolic Input */}
                <View style={styles.pickerButton}>
                    <TextInput
                        style={styles.bpInput}
                        placeholder="Eg, 120"
                        placeholderTextColor="#BDBDBD"
                        keyboardType="numeric"
                        value={systolic}
                        onChangeText={setSystolic}
                        maxLength={3}
                    />
                    <Text style={styles.inputLabel}>SYSTOLIC</Text>
                </View>

                {/* Diastolic Input */}
                <View style={styles.pickerButton}>
                    <TextInput
                        style={styles.bpInput}
                        placeholder="Eg, 80"
                        placeholderTextColor="#BDBDBD"
                        keyboardType="numeric"
                        value={diastolic}
                        onChangeText={setDiastolic}
                        maxLength={3}
                    />
                    <Text style={styles.inputLabel}>DIASTOLIC</Text>
                </View>

                {/* Date Picker */}
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Icon type={Icons.Ionicons} name="calendar-outline" color={primaryColor} size={ms(18)} />
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

                {/* Time Picker */}
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Icon type={Icons.Ionicons} name="time-outline" color={primaryColor} size={ms(18)} />
                    <Text style={styles.pickerText}>{formatTime(time)}</Text>
                    <Icon type={Icons.Ionicons} name="chevron-down" color={blackColor} size={ms(16)} />
                </TouchableOpacity>

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
                    title="Save Readings"
                    onPress={handleSave}
                    style={styles.saveButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddBloodPressureReading;

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

    // Input & Pickers (same pill style)
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
    bpInput: {
        flex: 1,
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        padding: 0,
    },
    inputLabel: {
        fontSize: ms(11),
        fontWeight: '700',
        color: primaryColor,
        letterSpacing: 0.5,
    },
    pickerText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
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
