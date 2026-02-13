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

const FAHRENHEIT_COLOR = '#E53935';
const CELSIUS_COLOR = '#1E88E5';

const METHODS = [
    { id: 'mouth', label: 'Mouth', emoji: '👄', bg: '#FFEBEE' },
    { id: 'forehead', label: 'Forehead', emoji: '🤚', bg: '#E3F2FD' },
    { id: 'ear', label: 'Ear', emoji: '👂', bg: '#FFF8E1' },
    { id: 'underarm', label: 'Underarm', emoji: '💪', bg: '#F3E5F5' },
    { id: 'rectal', label: 'Rectal', emoji: '🌡️', bg: '#E8F5E9' },
];

const AddTemperatureReading = () => {
    const navigation = useNavigation();
    const [fahrenheit, setFahrenheit] = useState('');
    const [celsius, setCelsius] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('mouth');

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

    const onFahrenheitChange = (val) => {
        setFahrenheit(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setCelsius(((num - 32) * 5 / 9).toFixed(1));
        } else {
            setCelsius('');
        }
    };

    const onCelsiusChange = (val) => {
        setCelsius(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setFahrenheit((num * 9 / 5 + 32).toFixed(1));
        } else {
            setFahrenheit('');
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Reading Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'TemperatureDashboard',
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
                    <Text style={styles.headerTitle}>Body Temperature</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate Body temperature trends and insights.
                </Text>

                {/* Temperature Input Grid */}
                <View style={styles.tempGrid}>
                    {/* Column Headers */}
                    <View style={styles.tempGridRow}>
                        <View style={styles.tempColHeader}>
                            <View style={[styles.colDot, { backgroundColor: FAHRENHEIT_COLOR }]} />
                            <Text style={styles.colHeaderText}>Fahrenheit</Text>
                        </View>
                        <View style={styles.tempColHeader}>
                            <View style={[styles.colDot, { backgroundColor: CELSIUS_COLOR }]} />
                            <Text style={styles.colHeaderText}>Celsius</Text>
                        </View>
                    </View>

                    {/* Reference row - low */}
                    <View style={styles.tempGridRow}>
                        <Text style={styles.tempRefText}>97.6°F</Text>
                        <Text style={styles.tempRefText}>36.4°C</Text>
                    </View>

                    {/* Input Row - main values */}
                    <View style={styles.tempGridRow}>
                        <View style={styles.tempInputWrap}>
                            <TextInput
                                style={styles.tempInput}
                                placeholder="98.6"
                                placeholderTextColor="#BDBDBD"
                                keyboardType="decimal-pad"
                                value={fahrenheit}
                                onChangeText={onFahrenheitChange}
                                maxLength={5}
                            />
                            <Text style={styles.tempUnit}>°F</Text>
                        </View>
                        <View style={styles.tempInputWrap}>
                            <TextInput
                                style={styles.tempInput}
                                placeholder="37.0"
                                placeholderTextColor="#BDBDBD"
                                keyboardType="decimal-pad"
                                value={celsius}
                                onChangeText={onCelsiusChange}
                                maxLength={5}
                            />
                            <Text style={styles.tempUnit}>°C</Text>
                        </View>
                    </View>

                    {/* Reference row - high */}
                    <View style={styles.tempGridRow}>
                        <Text style={styles.tempRefText}>99.6°F</Text>
                        <Text style={styles.tempRefText}>37.6°C</Text>
                    </View>
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

                {/* Measurement Method / Location */}
                <Text style={styles.sectionLabel}>Measurement Method / Location</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.methodsRow}
                >
                    {METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.methodItem}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View style={[styles.methodCircle, { backgroundColor: method.bg }]}>
                                <Text style={styles.methodEmoji}>{method.emoji}</Text>
                                {selectedMethod === method.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(10)} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.methodLabel}>{method.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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

export default AddTemperatureReading;

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

    // Temperature Input Grid
    tempGrid: {
        marginHorizontal: ms(20),
        marginBottom: vs(20),
    },
    tempGridRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    tempColHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
        flex: 1,
        justifyContent: 'center',
    },
    colDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    colHeaderText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },
    tempRefText: {
        flex: 1,
        textAlign: 'center',
        fontSize: ms(13),
        color: '#999',
    },
    tempInputWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tempInput: {
        fontSize: ms(22),
        fontWeight: 'bold',
        color: blackColor,
        textAlign: 'right',
        padding: 0,
        minWidth: ms(60),
    },
    tempUnit: {
        fontSize: ms(22),
        fontWeight: 'bold',
        color: blackColor,
    },

    // Date Picker
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(16),
        paddingVertical: vs(10),
        marginHorizontal: ms(20),
        marginBottom: vs(20),
        gap: ms(8),
    },
    pickerText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
        flex: 1,
    },

    // Measurement Method
    sectionLabel: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: blackColor,
        paddingHorizontal: ms(20),
        marginBottom: vs(15),
    },
    methodsRow: {
        paddingHorizontal: ms(15),
        gap: ms(12),
        paddingBottom: vs(10),
    },
    methodItem: {
        alignItems: 'center',
        width: ms(70),
    },
    methodCircle: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    methodEmoji: {
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
    methodLabel: {
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
