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

const ChangePassword = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleConfirm = () => {
        // TODO: Validate current password with API
        // Navigate to SetNewPassword screen
        navigation.navigate('SetNewPassword');
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
                    locations={[0, 0.24]}
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
                        Keep your account secure. Enter your current password and create a new one.
                    </Text>

                    {/* Current Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Current Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter current password"
                                placeholderTextColor="#9CA3AF"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    color="#9CA3AF"
                                    size={ms(20)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Confirm Button */}
                <View style={styles.buttonContainer}>
                    <PrimaryButton onPress={handleConfirm} title="Confirm" />
                </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    keyboardView: {
        flex: 1,
    },
    headerGradient: {
        flex:1,
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
        marginTop:ms(20)
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
    buttonContainer: {
        // paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
});
