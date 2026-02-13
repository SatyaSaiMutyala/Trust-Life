import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from '../components/Icons'; // Assuming Icons and Icon component are defined elsewhere
import Loader from '../components/Loader'; // Assuming Loader is defined elsewhere
import { StatusBar2 } from '../components/StatusBar'; // Assuming StatusBar2 is defined elsewhere
import { bold, regular } from '../config/Constants'; // Assuming bold, regular are defined (e.g., as font names)
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors'; // Assuming these colors are defined
import { s, vs, ms } from 'react-native-size-matters';
import PrimaryButton from '../utils/primaryButton';

const OtpOptionScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    // State to manage the selected option: 'otp' or 'fingerprint'
    const [selectedOption, setSelectedOption] = useState('otp'); 

    const handleBackButtonClick = () => {
        navigation.goBack();
    }

    const handleSkip = () => {
        Alert.alert('Skipped', 'Skipping secure login setup.');
        // navigation.navigate('Dashboard');
    }

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Selection Confirmed', `You chose: ${selectedOption === 'otp' ? 'OTP Verification' : 'Fingerprint'}`);
            // navigation.navigate('NextSetupStep'); 
        }, 1000);
    }

    // Helper component for the radio button options
    const RadioOption = ({ title, subtitle, value, onSelect }) => {
        const isSelected = selectedOption === value;
        return (
            <TouchableOpacity 
                style={styles.optionContainer}
                activeOpacity={0.8}
                onPress={() => onSelect(value)}
            >
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    <Text style={styles.optionSubtitle}>{subtitle}</Text>
                </View>
                {/* Custom Radio Button */}
                <View style={[
                    styles.radioCircle,
                    { borderColor: isSelected ? primaryColor : '#d0d0d0' }
                ]}>
                    {isSelected && <View style={styles.radioDot} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <Loader visible={loading} />

            {/* Main Background Gradient */}
            <LinearGradient
                colors={globalGradient} 
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }} // Extended end point for a large faded effect
                locations={[0, 0.1]}
                style={styles.fullGradient}
            >
                {/* Header: Back and Skip Buttons */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.headerButton}
                        onPress={handleBackButtonClick}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View style={styles.contentArea}>
                    {/* Secure Icon (Shield with Checkmark) */}
                    <View style={styles.iconBackground}>
                        <Icon type={Icons.Ionicons} name="shield-checkmark" color={whiteColor} size={ms(40)} />
                    </View>

                    {/* Title and Description */}
                    <Text style={styles.mainTitle}>Secure Your Login with</Text>
                    <Text style={styles.mainTitleBold}>Fingerprint or OTP Verification</Text>
                    <Text style={styles.description}>
                        Choose your preferred login method — use your fingerprint for instant access or OTP verification for an added layer of security.
                    </Text>

                    {/* --- Options --- */}
                    <RadioOption
                        title="OTP Verification"
                        subtitle="Enable Otp verification Login for Quick & Secure Access"
                        value="otp"
                        onSelect={setSelectedOption}
                    />
                    <RadioOption
                        title="Fingerprint"
                        subtitle="Enable Fingerprint Login for Quick & Secure Access"
                        value="fingerprint"
                        onSelect={setSelectedOption}
                    />
                </View>

                {/* Confirm Button */}
                {/* <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[primaryColor, '#108b76']} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.confirmButtonGradient}
                    >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </LinearGradient>
                </TouchableOpacity> */}
                <View style={{marginVertical:ms(60)}}>
                <PrimaryButton title='Confirm' />
                </View>

            </LinearGradient>
        </SafeAreaView>
    )
}

export default OtpOptionScreen

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50), 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    headerButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: whiteColor,
    },
    contentArea: {
        paddingHorizontal: ms(5),
        alignItems: 'center',
        flex: 1, // Allows content to push the button to the bottom
    },
    iconBackground: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(30),
        // Add shadow/elevation to the icon for depth
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    mainTitle: {
        fontFamily: regular,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: ms(2),
    },
    mainTitleBold: {
        fontFamily: regular,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: vs(15),
    },
    description: {
        // fontFamily: regular,
        fontSize: ms(12),
        color: 'gray',
        textAlign: 'center',
        marginBottom: vs(40),
        paddingHorizontal: ms(10),
        lineHeight: ms(18),
    },
    // --- Option Styles ---
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        padding: ms(15),
        width: '100%',
        marginBottom: ms(15),
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionTextContainer: {
        flex: 1,
        marginRight: ms(10),
    },
    optionTitle: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
        marginBottom: ms(2),
    },
    optionSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: 'gray',
    },
    radioCircle: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    radioDot: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: primaryColor,
    },
    confirmButton: {
        height: vs(45), 
        borderRadius: ms(10),
        overflow: 'hidden',
        width: '100%',
        marginBottom: vs(20), 
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    confirmButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(16),
    },
});