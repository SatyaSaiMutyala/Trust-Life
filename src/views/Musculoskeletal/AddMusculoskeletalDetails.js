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
import Slider from '@react-native-community/slider';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const PAIN_LOCATIONS = [
    { id: 'neck', label: 'Neck', image: require('../../assets/img/neck.png') },
    { id: 'shoulder', label: 'Shoulder', image: require('../../assets/img/shoulder.png') },
    { id: 'back', label: 'Back', image: require('../../assets/img/back.png') },
    { id: 'knee', label: 'Knee', image: require('../../assets/img/knee.png') },
    { id: 'ankle', label: 'Ankle', image: require('../../assets/img/ankle.png') },
    { id: 'others', label: 'Others', image: require('../../assets/img/others.png') },
];

const PAIN_TYPES = ['Sharp', 'Dul', 'Burning', 'Stiff'];
const TRIGGERS = ['Exercise', 'Injury', 'Posture', 'Overuse', 'Unknown'];

const AddMusculoskeletalDetails = () => {
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [painLevel, setPainLevel] = useState(8);
    const [selectedLocation, setSelectedLocation] = useState('neck');
    const [painType, setPainType] = useState('Dul');
    const [selectedTriggers, setSelectedTriggers] = useState(['Posture']);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);

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

    const toggleTrigger = (trigger) => {
        setSelectedTriggers((prev) =>
            prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
        );
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Musculoskeletal Details Added',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MusculoskeletalDashboard',
            useNavigate: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Adding musculoskeletal</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Log your pain and daily impact to manage better
                </Text>
                <Text style={styles.descriptionGreen}>
                    Recording consistent data helps your  healthcare provider tailor your treatment.
                </Text>

                {/* Starting Date & Time */}
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

                {/* Ending Date & Time */}
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

                {/* Pain Level */}
                <View style={styles.painLevelHeader}>
                    <Text style={styles.sectionTitle}>Pain Level ( 0 - 10 )</Text>
                    <Text style={styles.painValue}>{painLevel}</Text>
                </View>
                <View
                    style={styles.sliderWrap}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderTerminationRequest={() => false}
                    onTouchStart={() => setScrollEnabled(false)}
                    onTouchEnd={() => setScrollEnabled(true)}
                    onTouchCancel={() => setScrollEnabled(true)}
                >
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={10}
                        step={1}
                        value={painLevel}
                        onValueChange={(val) => setPainLevel(val)}
                        minimumTrackTintColor={primaryColor}
                        maximumTrackTintColor="#E0E0E0"
                        thumbTintColor={primaryColor}
                    />
                </View>
                <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabel}>No Pain</Text>
                    <Text style={styles.sliderLabel}>Server Pain</Text>
                </View>

                {/* Pain Location */}
                <Text style={styles.sectionTitle}>Pain location</Text>
                <View style={styles.locationGrid}>
                    {PAIN_LOCATIONS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.locationItem}
                            onPress={() => setSelectedLocation(item.id)}
                        >
                            <View style={styles.locationImageWrap}>
                                <Image source={item.image} style={styles.locationImage} />
                                {selectedLocation === item.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.locationLabel,
                                selectedLocation === item.id && styles.locationLabelActive,
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pain Type */}
                <Text style={styles.sectionTitle}>Pain type</Text>
                <View style={styles.chipRow}>
                    {PAIN_TYPES.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.chip,
                                painType === item && styles.chipActive,
                            ]}
                            onPress={() => setPainType(item)}
                        >
                            <Text style={[
                                styles.chipText,
                                painType === item && styles.chipTextActive,
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Triggers */}
                <Text style={styles.sectionTitle}>Triggers</Text>
                <View style={styles.triggerGrid}>
                    {TRIGGERS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.chip,
                                selectedTriggers.includes(item) && styles.chipActive,
                            ]}
                            onPress={() => toggleTrigger(item)}
                        >
                            <Text style={[
                                styles.chipText,
                                selectedTriggers.includes(item) && styles.chipTextActive,
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton title="Save log" onPress={handleSave} />
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

export default AddMusculoskeletalDetails;

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
        fontSize: ms(14),
        color: blackColor,
        fontWeight: '500',
        marginTop: vs(10),
        marginBottom: vs(4),
    },
    descriptionGreen: {
        fontSize: ms(12),
        color: primaryColor,
        lineHeight: ms(18),
        marginBottom: vs(15),
    },

    // Date Time
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
        marginBottom: vs(12),
        marginTop: vs(10),
    },

    // Pain Level
    painLevelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(10),
        marginBottom: vs(5),
    },
    painValue: {
        fontSize: ms(22),
        fontWeight: 'bold',
        color: blackColor,
    },
    sliderWrap: {
        width: '100%',
        height: ms(50),
        justifyContent: 'center',
    },
    slider: {
        width: '100%',
        height: ms(40),
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    sliderLabel: {
        fontSize: ms(11),
        color: '#888',
    },

    // Pain Location
    locationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(15),
        marginBottom: vs(10),
    },
    locationItem: {
        alignItems: 'center',
        width: (ms(280) - ms(45)) / 4,
    },
    locationImageWrap: {
        width: ms(65),
        height: ms(65),
        borderRadius: ms(29),
        // backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    locationImage: {
        width: ms(40),
        height: ms(40),
        resizeMode: 'contain',
    },
    checkBadge: {
        position: 'absolute',
        top: -ms(2),
        right: -ms(2),
        backgroundColor: whiteColor,
        borderRadius: ms(10),
    },
    locationLabel: {
        fontSize: ms(11),
        color: '#888',
        fontWeight: '500',
        textAlign: 'center',
    },
    locationLabelActive: {
        color: blackColor,
        fontWeight: '700',
    },

    // Chip (Pain Type & Triggers)
    chipRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: vs(10),
    },
    triggerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
        marginBottom: vs(20),
    },
    chip: {
        paddingHorizontal: ms(18),
        paddingVertical: vs(6),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
    },
    chipActive: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    chipText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#555',
    },
    chipTextActive: {
        color: whiteColor,
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
