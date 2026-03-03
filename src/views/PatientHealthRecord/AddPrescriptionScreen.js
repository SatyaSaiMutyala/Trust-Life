import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import InputField from '../../utils/InputField';
import DropdownField from '../../utils/DropdownField';
import PrimaryButton from '../../utils/primaryButton';
import { bold, regular } from '../../config/Constants';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const DOSAGE_OPTIONS = [
    '50mg', '100mg', '150mg', '200mg', '250mg', '300mg',
    '400mg', '500mg', '650mg', '750mg', '1000mg',
];

const AddPrescriptionScreen = () => {
    const navigation = useNavigation();

    const [medicineName, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('');
    const [durationMode, setDurationMode] = useState('Days');
    const [durationCount, setDurationCount] = useState(1);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const incrementDuration = () => {
        setDurationCount((prev) => prev + 1);
    };

    const decrementDuration = () => {
        setDurationCount((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Successfully uploaded',
            subtitle: 'Your prescription has been added',
            delay: 2000,
            targetScreen: 'MedicationPrescription',
            useNavigate: true,
        });
    };

    const isFormValid = medicineName.trim() !== '' && dosage !== '';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>Add Prescription</Text>
                            <Text style={styles.headerDate}>{formattedDate}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        Enter your prescription details carefully. This helps keep your medication organized and easy to access.
                    </Text>

                    {/* Medicine Name */}
                    <InputField
                        label="Medicine Name"
                        placeholder="Search medicine name"
                        value={medicineName}
                        onChangeText={setMedicineName}
                        iconType={Icons.Feather}
                        iconName="search"
                    />

                    {/* Dosage */}
                    <DropdownField
                        label="Dosage"
                        placeholder="Select Dosage"
                        value={dosage}
                        options={DOSAGE_OPTIONS}
                        onSelect={setDosage}
                    />

                    {/* Duration */}
                    <Text style={styles.label}>Duration</Text>
                    <View style={styles.durationToggle}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, durationMode === 'Days' && styles.toggleBtnActive]}
                            onPress={() => setDurationMode('Days')}
                        >
                            <Text style={[styles.toggleBtnText, durationMode === 'Days' && styles.toggleBtnTextActive]}>
                                Days
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, durationMode === 'Weeks' && styles.toggleBtnActive]}
                            onPress={() => setDurationMode('Weeks')}
                        >
                            <Text style={[styles.toggleBtnText, durationMode === 'Weeks' && styles.toggleBtnTextActive]}>
                                Weeks
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Counter */}
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={styles.counterBtn}
                            onPress={decrementDuration}
                            activeOpacity={0.7}
                        >
                            <Icon type={Icons.Feather} name="minus" color={blackColor} size={ms(18)} />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>
                            {durationCount} {durationMode}
                        </Text>
                        <TouchableOpacity
                            style={styles.counterBtn}
                            onPress={incrementDuration}
                            activeOpacity={0.7}
                        >
                            <Icon type={Icons.Feather} name="plus" color={blackColor} size={ms(18)} />
                        </TouchableOpacity>
                    </View>

                    {/* Save Button */}
                    <PrimaryButton
                        title="Save"
                        onPress={handleSave}
                        disabled={!isFormValid}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },

    // Header
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
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
    },
    headerDate: {
        fontSize: ms(12),
        fontFamily: regular,
        color: '#888',
        marginTop: vs(2),
    },
    description: {
        fontSize: ms(13),
        color: '#888',
        fontFamily: regular,
        lineHeight: ms(20),
        marginTop: vs(10),
        marginBottom: vs(20),
    },

    // Label
    label: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(6),
    },

    // Duration Toggle
    durationToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(10),
        padding: ms(4),
        marginBottom: vs(15),
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: vs(10),
        alignItems: 'center',
        borderRadius: ms(8),
    },
    toggleBtnActive: {
        backgroundColor: primaryColor,
    },
    toggleBtnText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: '#6B7280',
    },
    toggleBtnTextActive: {
        color: whiteColor,
    },

    // Counter
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(20),
        marginBottom: vs(10),
    },
    counterBtn: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        minWidth: ms(100),
        textAlign: 'center',
    },
});

export default AddPrescriptionScreen;
