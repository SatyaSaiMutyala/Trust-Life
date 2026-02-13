import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const SEVERITIES = ['Low', 'Medium', 'High'];
const SEVERITY_COLORS = {
    Low: '#22C55E',
    Medium: '#F59E0B',
    High: '#EF4444',
};

const PAIN_LOCATIONS = [
    { id: 'frontal', label: 'Frontal Region', color: '#22C55E', image: require('../../assets/img/left.png') },
    { id: 'temporal', label: 'Temporal Region', color: '#F59E0B', image: require('../../assets/img/rs.png') },
    { id: 'periorbital', label: 'Periorbital Region', color: '#EF4444', image: require('../../assets/img/ls.png') },
    { id: 'parietal', label: 'Parietal Region', color: '#888', image: require('../../assets/img/right.png') },
];

const MOODS = [
    { id: 'relaxed', label: 'Relaxed', emoji: '\u{1F60A}' },
    { id: 'calm', label: 'Calm', emoji: '\u{1F970}' },
    { id: 'normal', label: 'Normal', emoji: '\u{1F610}' },
    { id: 'worried', label: 'Worried', emoji: '\u{1F61F}' },
];

const AddMigraine = () => {
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [severity, setSeverity] = useState('Low');
    const [painLocation, setPainLocation] = useState('frontal');
    const [mood, setMood] = useState('calm');

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const formatDate = (d) => {
        if (!d) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };

    const formatTime = (d) => {
        if (!d) return '';
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Migraine Details Added',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MigraineDashboard',
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
                    <Text style={styles.headerTitle}>Adding Migraine Details</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate vaccination details and updates
                </Text>

                {/* Date & Time Row - Starting */}
                <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeCol}>
                        <InputField
                            label="Starting Date"
                            placeholder="Select Date"
                            value={startDate ? formatDate(startDate) : ''}
                            onPressIn={() => setShowStartDatePicker(true)}
                            iconType={Icons.Feather}
                            iconName="calendar"
                        />
                    </View>
                    <View style={styles.dateTimeCol}>
                        <InputField
                            label="Starting Time"
                            placeholder="Select Time"
                            value={startTime ? formatTime(startTime) : ''}
                            onPressIn={() => setShowStartTimePicker(true)}
                            iconType={Icons.Ionicons}
                            iconName="time-outline"
                        />
                    </View>
                </View>

                {/* Date & Time Row - Ending */}
                <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeCol}>
                        <InputField
                            label="Ending Date"
                            placeholder="Select Date"
                            value={endDate ? formatDate(endDate) : ''}
                            onPressIn={() => setShowEndDatePicker(true)}
                            iconType={Icons.Feather}
                            iconName="calendar"
                        />
                    </View>
                    <View style={styles.dateTimeCol}>
                        <InputField
                            label="Ending Time"
                            placeholder="Select Time"
                            value={endTime ? formatTime(endTime) : ''}
                            onPressIn={() => setShowEndTimePicker(true)}
                            iconType={Icons.Ionicons}
                            iconName="time-outline"
                        />
                    </View>
                </View>

                {/* Pain Severity */}
                <Text style={styles.sectionTitle}>Pain Severity</Text>
                <View style={styles.severityRow}>
                    {SEVERITIES.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.severityChip,
                                severity === item && { backgroundColor: SEVERITY_COLORS[item] },
                            ]}
                            onPress={() => setSeverity(item)}
                        >
                            <Text style={[
                                styles.severityChipText,
                                severity === item && styles.severityChipTextActive,
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pain Location */}
                <Text style={styles.sectionTitle}>Pain location</Text>
                <View style={styles.painLocationRow}>
                    {PAIN_LOCATIONS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.painLocationItem}
                            onPress={() => setPainLocation(item.id)}
                        >
                            <View style={styles.painLocationImageWrap}>
                                <Image
                                    source={item.image}
                                    style={styles.painLocationImage}
                                />
                                {painLocation === item.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.painLocationLabel,
                                painLocation === item.id && styles.painLocationLabelActive,
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Mood */}
                <Text style={styles.sectionTitle}>Mood</Text>
                <View style={styles.moodRow}>
                    {MOODS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.moodItem}
                            onPress={() => setMood(item.id)}
                        >
                            <View style={styles.emojiWrap}>
                                <Text style={styles.emoji}>{item.emoji}</Text>
                                {mood === item.id && (
                                    <View style={styles.checkBadgeEmoji}>
                                        <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.moodLabel,
                                mood === item.id && styles.moodLabelActive,
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Save Details"
                    onPress={handleSave}
                />
            </View>

            {/* Date/Time Pickers */}
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowStartDatePicker(Platform.OS === 'ios');
                        if (d) setStartDate(d);
                    }}
                />
            )}
            {showStartTimePicker && (
                <DateTimePicker
                    value={startTime || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowStartTimePicker(Platform.OS === 'ios');
                        if (d) setStartTime(d);
                    }}
                />
            )}
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowEndDatePicker(Platform.OS === 'ios');
                        if (d) setEndDate(d);
                    }}
                />
            )}
            {showEndTimePicker && (
                <DateTimePicker
                    value={endTime || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowEndTimePicker(Platform.OS === 'ios');
                        if (d) setEndTime(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
};

export default AddMigraine;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ms(50),
        paddingBottom: ms(10),
        marginHorizontal: ms(-5),
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
        marginTop: vs(10),
        marginBottom: vs(20),
    },

    // Date Time Row
    dateTimeRow: {
        flexDirection: 'row',
        gap: ms(12),
    },
    dateTimeCol: {
        flex: 1,
    },

    // Section Title
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(15),
        marginTop: vs(10),
    },

    // Severity
    severityRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: vs(10),
    },
    severityChip: {
        flex: 1,
        paddingVertical: vs(10),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    severityChipText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#888',
    },
    severityChipTextActive: {
        color: whiteColor,
    },

    // Pain Location
    painLocationRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginBottom: vs(10),
    },
    painLocationItem: {
        flex: 1,
        alignItems: 'center',
    },
    painLocationImageWrap: {
        width: ms(65),
        height: ms(65),
        borderRadius: ms(32),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    painLocationImage: {
        width: ms(45),
        height: ms(45),
        resizeMode: 'contain',
    },
    checkBadge: {
        position: 'absolute',
        top: -ms(2),
        right: -ms(2),
        backgroundColor: whiteColor,
        borderRadius: ms(10),
    },
    painLocationLabel: {
        fontSize: ms(10),
        color: '#888',
        fontWeight: '500',
        textAlign: 'center',
    },
    painLocationLabelActive: {
        color: blackColor,
        fontWeight: '700',
    },

    // Mood
    moodRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginBottom: vs(20),
    },
    moodItem: {
        flex: 1,
        alignItems: 'center',
    },
    emojiWrap: {
        width: ms(55),
        height: ms(55),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    emoji: {
        fontSize: ms(36),
    },
    checkBadgeEmoji: {
        position: 'absolute',
        top: -ms(2),
        right: -ms(4),
        backgroundColor: whiteColor,
        borderRadius: ms(10),
    },
    moodLabel: {
        fontSize: ms(11),
        color: '#888',
        fontWeight: '500',
        textAlign: 'center',
    },
    moodLabelActive: {
        color: blackColor,
        fontWeight: '700',
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
