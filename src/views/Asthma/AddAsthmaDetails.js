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

const BREATH_OPTIONS = [
    { label: 'Low', activeBg: primaryColor, inactiveBg: '#D1FAE5', activeText: whiteColor, inactiveText: '#065F46' },
    { label: 'Medium', activeBg: '#F59E0B', inactiveBg: '#FEF3C7', activeText: whiteColor, inactiveText: '#92400E' },
    { label: 'High', activeBg: '#EF4444', inactiveBg: '#FEE2E2', activeText: whiteColor, inactiveText: '#991B1B' },
];
const TRIGGERS = ['Dust', 'Cold Air', 'Exercise', 'Smoke', 'Pollen', 'Other'];
const SEVERITIES = ['None', 'Moderate', 'Mild', 'Severe'];

const AddAsthmaDetails = () => {
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [breathLevel, setBreathLevel] = useState('Low');
    const [inhalerCount, setInhalerCount] = useState(1);
    const [selectedTriggers, setSelectedTriggers] = useState(['Cold Air', 'Pollen']);
    const [severity, setSeverity] = useState('Moderate');

    const formatDate = (d) => {
        if (!d) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    };

    const toggleTrigger = (trigger) => {
        setSelectedTriggers((prev) =>
            prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
        );
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Asthma Details Added',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'AsthmaDashboard',
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
                    <Text style={styles.headerTitle}>Adding Asthma Details</Text>
                    <View style={{ width: ms(40) }} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Enter your details carefully. This information helps create accurate Asthma  details  and updates
                </Text>

                {/* Starting Date */}
                <Text style={styles.sectionTitle}>Starting Date</Text>
                <InputField
                    placeholder="Select Starting Date"
                    value={startDate ? formatDate(startDate) : ''}
                    onPressIn={() => setShowDatePicker(true)}
                    iconType={Icons.Feather}
                    iconName="calendar"
                />

                {/* Shortness of Breath */}
                <Text style={styles.sectionTitle}>Shortness of Breath</Text>
                <View style={styles.pillRow}>
                    {BREATH_OPTIONS.map((item) => {
                        const isActive = breathLevel === item.label;
                        return (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    styles.pill,
                                    { backgroundColor: isActive ? item.activeBg : item.inactiveBg },
                                ]}
                                onPress={() => setBreathLevel(item.label)}
                            >
                                <Text style={[
                                    styles.pillText,
                                    { color: isActive ? item.activeText : item.inactiveText },
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Times Inhaler Used */}
                <Text style={styles.sectionTitle}>Times Inhaler Used</Text>
                <View style={styles.counterRow}>
                    <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setInhalerCount(Math.max(0, inhalerCount - 1))}
                    >
                        <Icon type={Icons.Feather} name="minus" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{inhalerCount}</Text>
                    <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setInhalerCount(inhalerCount + 1)}
                    >
                        <Icon type={Icons.Feather} name="plus" color={blackColor} size={ms(18)} />
                    </TouchableOpacity>
                </View>

                {/* Trigger */}
                <Text style={styles.sectionTitle}>Trigger</Text>
                <View style={styles.triggerGrid}>
                    {TRIGGERS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.triggerChip,
                                selectedTriggers.includes(item) && styles.triggerChipActive,
                            ]}
                            onPress={() => toggleTrigger(item)}
                        >
                            <Text style={[
                                styles.triggerChipText,
                                selectedTriggers.includes(item) && styles.triggerChipTextActive,
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Asthma Attack Severity */}
                <Text style={styles.sectionTitle}>Asthma Attack Severity</Text>
                <View style={styles.severityRow}>
                    {SEVERITIES.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.severityChip,
                                severity === item && styles.severityChipActive,
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

            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton title="Save log" onPress={handleSave} />
            </View>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (d) setStartDate(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
};

export default AddAsthmaDetails;

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

    // Section Title
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: vs(12),
        marginTop: vs(10),
    },

    // Pill Row (Shortness of Breath)
    pillRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: vs(10),
    },
    pill: {
        flex: 1,
        paddingVertical: vs(8),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    pillActive: {
        backgroundColor: primaryColor,
    },
    pillText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#888',
    },
    pillTextActive: {
        color: whiteColor,
    },

    // Counter
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: ms(15),
        marginBottom: vs(10),
    },
    counterBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontSize: ms(18),
        fontWeight: '700',
        color: blackColor,
        minWidth: ms(24),
        textAlign: 'center',
    },

    // Trigger Grid
    triggerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
        marginBottom: vs(10),
    },
    triggerChip: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(8),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
    },
    triggerChipActive: {
        backgroundColor: '#EF4444',
    },
    triggerChipText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#888',
    },
    triggerChipTextActive: {
        color: whiteColor,
    },

    // Severity Row
    severityRow: {
        flexDirection: 'row',
        gap: ms(8),
        marginBottom: vs(20),
    },
    severityChip: {
        flex: 1,
        paddingVertical: vs(8),
        borderRadius: ms(25),
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    severityChipActive: {
        backgroundColor: primaryColor,
    },
    severityChipText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#888',
    },
    severityChipTextActive: {
        color: whiteColor,
    },

    // Button
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
