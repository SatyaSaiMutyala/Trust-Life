import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
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

const ACTIVITIES = [
    { id: 'rest', label: 'Rest', image: require('../../assets/img/sleep-track.png') },
    { id: 'walking', label: 'Walking', image: require('../../assets/img/walk.png') },
    { id: 'exercise', label: 'Exercise', image: require('../../assets/img/exercise-track.png') },
    { id: 'sleeping', label: 'Sleeping', image: require('../../assets/img/sleep.png') },
];

const MOODS = [
    { id: 'relaxed', label: 'Relaxed', emoji: '\u{1F60A}' },
    { id: 'calm', label: 'Calm', emoji: '\u{1F60C}' },
    { id: 'normal', label: 'Normal', emoji: '\u{1F610}' },
    { id: 'worried', label: 'Worried', emoji: '\u{1F61F}' },
];

const AddHeartRateReading = () => {
    const navigation = useNavigation();
    const [bpm, setBpm] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState('rest');
    const [selectedMood, setSelectedMood] = useState('calm');

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
            targetScreen: 'HeartRateDashboard',
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
                    <Text style={styles.headerTitle}>Add Heart rate Readings</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate heart rate trends and insights.
                </Text>

                {/* BPM Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.bpmInput}
                        placeholder="Eg,72 BMP"
                        placeholderTextColor="#BDBDBD"
                        keyboardType="numeric"
                        value={bpm}
                        onChangeText={setBpm}
                        maxLength={3}
                    />
                </View>

                {/* Date Picker */}
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
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

                {/* Activities */}
                <Text style={styles.sectionTitle}>Activities</Text>
                <View style={styles.optionsRow}>
                    {ACTIVITIES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.optionItem}
                            onPress={() => setSelectedActivity(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.optionImageWrap}>
                                <Image source={item.image} style={styles.optionImage} />
                                {selectedActivity === item.id && (
                                    <View style={styles.checkBadge}>
                                        <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.optionLabel,
                                selectedActivity === item.id && styles.optionLabelActive,
                            ]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Mood */}
                <Text style={styles.sectionTitle}>Mood</Text>
                <View style={styles.optionsRow}>
                    {MOODS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.optionItem}
                            onPress={() => setSelectedMood(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.emojiWrap}>
                                <Text style={styles.emoji}>{item.emoji}</Text>
                                {selectedMood === item.id && (
                                    <View style={styles.checkBadgeEmoji}>
                                        <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                                    </View>
                                )}
                            </View>
                            <Text style={[
                                styles.optionLabel,
                                selectedMood === item.id && styles.optionLabelActive,
                            ]}>{item.label}</Text>
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

export default AddHeartRateReading;

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
        marginBottom: vs(20),
    },

    // BPM Input
    inputContainer: {
        paddingHorizontal: ms(20),
        marginBottom: vs(20),
    },
    bpmInput: {
        fontSize: ms(22),
        color: blackColor,
        fontWeight: '600',
        borderBottomWidth: 2,
        borderBottomColor: primaryColor,
        paddingVertical: vs(10),
        paddingHorizontal: ms(2),
    },

    // Date Picker
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(20),
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        marginHorizontal: ms(20),
        marginBottom: vs(30),
        gap: ms(6),
    },
    dateText: {
        fontSize: ms(13),
        color: blackColor,
        fontWeight: '500',
    },

    // Section Title
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        paddingHorizontal: ms(20),
        marginBottom: vs(15),
    },

    // Options Row
    optionsRow: {
        flexDirection: 'row',
        paddingHorizontal: ms(15),
        marginBottom: vs(25),
        gap: ms(8),
    },
    optionItem: {
        flex: 1,
        alignItems: 'center',
    },
    optionImageWrap: {
        width: ms(65),
        height: ms(65),
        borderRadius: ms(32),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    optionImage: {
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
    optionLabel: {
        fontSize: ms(11),
        color: '#888',
        fontWeight: '500',
        textAlign: 'center',
    },
    optionLabelActive: {
        color: blackColor,
        fontWeight: '700',
    },

    // Emoji / Mood
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

    // Save Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
    saveButton: {
        marginTop: 0,
    },
});
