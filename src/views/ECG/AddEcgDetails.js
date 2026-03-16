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
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const RHYTHM_OPTIONS = [
    'Normal Sinus', 'Sinus Tachycardia', 'Sinus Bradycardia',
    'Atrial Fibrillation', 'Atrial Flutter', 'Other',
];

const INTERPRETATIONS = ['Normal', 'Borderline', 'Abnormal'];

const INTERP_COLORS = {
    Normal: { activeBg: primaryColor, inactiveBg: '#D1FAE5', activeText: whiteColor, inactiveText: '#065F46' },
    Borderline: { activeBg: '#F59E0B', inactiveBg: '#FEF3C7', activeText: whiteColor, inactiveText: '#92400E' },
    Abnormal: { activeBg: '#EF4444', inactiveBg: '#FEE2E2', activeText: whiteColor, inactiveText: '#991B1B' },
};

const AddEcgDetails = () => {
    const navigation = useNavigation();

    const [recordedDate, setRecordedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [heartRate, setHeartRate] = useState('');
    const [qrs, setQrs] = useState('');
    const [pr, setPr] = useState('');
    const [qtc, setQtc] = useState('');
    const [rhythm, setRhythm] = useState('Normal Sinus');
    const [interpretation, setInterpretation] = useState('Normal');

    const formatDate = (d) => {
        if (!d) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'ECG Details Added',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'EcgDashboard',
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
                    <Text style={styles.headerTitle}>Adding ECG Details</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your ECG details carefully. This information helps track your heart rhythm and cardiac interval patterns over time.
                </Text>

                {/* Recorded Date */}
                <Text style={styles.sectionTitle}>Recorded Date</Text>
                <InputField
                    placeholder="Select Recorded Date"
                    value={recordedDate ? formatDate(recordedDate) : ''}
                    onPressIn={() => setShowDatePicker(true)}
                    iconType={Icons.Feather}
                    iconName="calendar"
                />

                {/* Heart Rate */}
                <Text style={styles.sectionTitle}>Heart Rate (bpm)</Text>
                <InputField
                    placeholder="e.g. 72"
                    value={heartRate}
                    onChangeText={setHeartRate}
                    keyboardType="numeric"
                    iconType={Icons.Ionicons}
                    iconName="heart-outline"
                />

                {/* Rhythm Type */}
                <Text style={styles.sectionTitle}>Rhythm Type</Text>
                <View style={styles.rhythmGrid}>
                    {RHYTHM_OPTIONS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.rhythmChip, rhythm === item && styles.rhythmChipActive]}
                            onPress={() => setRhythm(item)}
                        >
                            <Text style={[styles.rhythmChipText, rhythm === item && styles.rhythmChipTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Intervals */}
                <Text style={styles.sectionTitle}>QRS Duration (ms)</Text>
                <InputField
                    placeholder="e.g. 88"
                    value={qrs}
                    onChangeText={setQrs}
                    keyboardType="numeric"
                    iconType={Icons.Feather}
                    iconName="activity"
                />

                <Text style={styles.sectionTitle}>PR Interval (ms)</Text>
                <InputField
                    placeholder="e.g. 160"
                    value={pr}
                    onChangeText={setPr}
                    keyboardType="numeric"
                    iconType={Icons.Feather}
                    iconName="activity"
                />

                <Text style={styles.sectionTitle}>QTc Interval (ms)</Text>
                <InputField
                    placeholder="e.g. 410"
                    value={qtc}
                    onChangeText={setQtc}
                    keyboardType="numeric"
                    iconType={Icons.Feather}
                    iconName="activity"
                />

                {/* Interpretation */}
                <Text style={styles.sectionTitle}>Interpretation</Text>
                <View style={styles.pillRow}>
                    {INTERPRETATIONS.map((item) => {
                        const ic = INTERP_COLORS[item];
                        const isActive = interpretation === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[styles.pill, { backgroundColor: isActive ? ic.activeBg : ic.inactiveBg }]}
                                onPress={() => setInterpretation(item)}
                            >
                                <Text style={[styles.pillText, { color: isActive ? ic.activeText : ic.inactiveText }]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton title="Save log" onPress={handleSave} />
            </View>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={recordedDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (d) setRecordedDate(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
};

export default AddEcgDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    scrollContent: { paddingHorizontal: ms(20), paddingBottom: vs(20) },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: ms(50), paddingBottom: ms(10), marginHorizontal: ms(-5),
    },
    backButton: { width: ms(40), height: ms(40), justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: { flex: 1, fontSize: ms(16), fontWeight: 'bold', color: blackColor },
    description: { fontSize: ms(13), color: '#888', lineHeight: ms(20), marginTop: vs(10), marginBottom: vs(20) },

    sectionTitle: { fontSize: ms(16), fontWeight: 'bold', color: blackColor, marginBottom: vs(12), marginTop: vs(10) },

    // Rhythm grid
    rhythmGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginBottom: vs(10) },
    rhythmChip: {
        paddingHorizontal: ms(16), paddingVertical: vs(8),
        borderRadius: ms(25), backgroundColor: '#F1F5F9',
    },
    rhythmChipActive: { backgroundColor: primaryColor },
    rhythmChipText: { fontSize: ms(13), fontWeight: '600', color: '#888' },
    rhythmChipTextActive: { color: whiteColor },

    // Interpretation pills
    pillRow: { flexDirection: 'row', gap: ms(10), marginBottom: vs(20) },
    pill: { flex: 1, paddingVertical: vs(8), borderRadius: ms(25), alignItems: 'center' },
    pillText: { fontSize: ms(13), fontWeight: '600' },

    // Button
    buttonContainer: { paddingHorizontal: ms(20), paddingBottom: vs(30) },
});
