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

const ChangeMobileNumber = () => {
    const navigation = useNavigation();
    const [mobileNumber, setMobileNumber] = useState('');

    const handleSave = () => {
        // TODO: Implement API call to update mobile number
        // Navigate to success screen
        navigation.navigate('SuccessScreen', {
            title: 'Successfully',
            subtitle: 'Mobile Number Updated',
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
                            Add your new mobile number to get OTP verification
                        </Text>

                        {/* New Mobile Number Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>New Mobile Number</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter New  Number"
                                    placeholderTextColor="#9CA3AF"
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
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

export default ChangeMobileNumber;

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
        marginTop: ms(20),
    },
    scrollContent: {
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
    buttonContainer: {
        paddingBottom: vs(30),
    },
});
