import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { vs, ms } from 'react-native-size-matters';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, globalGradient } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

// Password requirements
const PASSWORD_REQUIREMENTS = [
    'At least 8 characters',
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one number (0-9)',
    'At least one special character (! @ # $ % & *)',
];

const SetNewPassword = () => {
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = () => {
        // TODO: Implement password validation and API call
        // Navigate to success screen
        navigation.navigate('SuccessScreen', {
            title: 'Successfully',
            subtitle: 'Password Updated',
            delay: 2000,
            targetScreen: 'More',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header with Gradient */}
                <LinearGradient
                    colors={globalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.23]}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Change Password</Text>
                    </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Description */}
                    <Text style={styles.description}>
                        Change your password to keep your account safe.{'\n'}Enter your current password and create a new one.
                    </Text>

                    {/* New Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter New  password"
                                placeholderTextColor="#9CA3AF"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                                    color="#9CA3AF"
                                    size={ms(20)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter confirm  password"
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    color="#9CA3AF"
                                    size={ms(20)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Characteristics */}
                    <View style={styles.characteristicsContainer}>
                        <Text style={styles.characteristicsTitle}>Password characteristics:</Text>
                        {PASSWORD_REQUIREMENTS.map((requirement, index) => (
                            <View key={index} style={styles.requirementRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.requirementText}>{requirement}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <PrimaryButton onPress={handleSave} title="Save" />
                </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SetNewPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    keyboardView: {
        flex: 1,
    },
    headerGradient: {
        flex: 1,
        paddingTop: ms(50),
        paddingBottom: vs(25),
        paddingHorizontal: ms(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(15),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(20),
        color: whiteColor,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        // paddingHorizontal: ms(20),
        paddingTop: vs(25),
        paddingBottom: vs(30),
    },
    description: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        lineHeight: ms(22),
        marginBottom: vs(30),
    },
    inputContainer: {
        marginBottom: vs(20),
    },
    inputLabel: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(10),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textInput: {
        flex: 1,
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
    },
    eyeButton: {
        paddingHorizontal: ms(15),
    },
    characteristicsContainer: {
        marginTop: vs(10),
    },
    characteristicsTitle: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(12),
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: vs(8),
    },
    bullet: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        marginRight: ms(10),
        marginLeft: ms(5),
    },
    requirementText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
        flex: 1,
    },
    buttonContainer: {
        // paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
