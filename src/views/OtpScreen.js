

import { Dimensions, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from '../components/Icons'; // Assuming Icons and Icon component are defined elsewhere
import Loader from '../components/Loader'; // Assuming Loader is defined elsewhere
import { StatusBar2 } from '../components/StatusBar'; // Assuming StatusBar2 is defined elsewhere
import { api_url, bold, customer_login, fast, regular, text } from '../config/Constants'; // Assuming bold, regular are defined (e.g., as font names)
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors'; // Assuming these colors are defined
import { s, vs, ms } from 'react-native-size-matters';
import { Image } from 'react-native';
import { PricingButton } from 'react-native-elements/dist/pricing/PricingCard';
import PrimaryButton from '../utils/primaryButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import { connect, useDispatch } from 'react-redux';
import { CustomerLoginAction } from '../redux/actions/CustomerAuthActions';


const { width } = Dimensions.get('window');
const OTP_LENGTH = 4;
const RESEND_TIME_LIMIT = 30; // seconds

const OTPScreen = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState(route.params?.phone_with_code || '');
    const [otpCode, setOtpCode] = useState(new Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(RESEND_TIME_LIMIT);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const inputRefs = useRef([]);
    const source = route.params?.source; // Check if coming from Settings

    // --- Keyboard Visibility Logic ---
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    // -----------------------------------

    // --- Timer Logic ---
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);
    // -------------------

    const handleBackButtonClick = () => {
        navigation.goBack();
    }

    const handleOtpChange = (text, index) => {
        const newOtp = [...otpCode];
        newOtp[index] = text;
        setOtpCode(newOtp);

        // Auto-focus to the next input or dismiss keyboard
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1].focus();
        } else if (!text && index > 0) {
            // Allows backspacing to the previous field
            inputRefs.current[index - 1].focus();
        }
    };


    const login = async () => {
        console.log("Verify clicked...");

        const otp_value = otpCode.join("");

        if (otp_value.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit OTP");
            return;
        }

        Keyboard.dismiss();
        setLoading(true);

        // If coming from Settings (ChangeMobile flow), just verify OTP and navigate
        if (source === 'ChangeMobile') {
            // TODO: Verify OTP with API
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('ChangeMobileNumber');
            }, 1000);
            return;
        }

        try {
            const response = await dispatch(CustomerLoginAction(phoneNumber, global.fcm_token, otp_value));
            console.log("Login Response:", response);
            if (response.status == 1) {
                console.log('status code is 1---------');
                await saveData(response);
            } else {
                setLoading(false);
                Alert.alert("Login Failed", response.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            Alert.alert("Sorry something went wrong");
        }
    };


    const saveData = async (data) => {
        console.log('im in save function -----------');
        try {
            await AsyncStorage.setItem('id', data.result.id.toString());
            await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
            await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
            await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
            await AsyncStorage.setItem('email', data.result.email.toString());
            await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());
            console.log('im after local storage -----------');
            global.id = await data.result.id.toString();
            global.customer_name = await data.result.customer_name.toString();
            global.phone_number = await data.result.phone_number.toString();
            global.phone_with_code = await data.result.phone_with_code.toString();
            global.email = await data.result.email.toString();
            console.log('im after global storage ---------');
            await props.updateProfilePicture(data.result.profile_picture);
            console.log('Hey man im above Home Navigation----------');
            await navigate();
            console.log('Navigate to Home is done -------');
            // Loader will automatically disappear when navigating to Home screen
        } catch (e) {
            setLoading(false);
            Alert.alert("Error", "Something went wrong while saving data");
            console.log('Error in saveData:', e);
        }
    }

    const navigate = async () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }



    const handleResend = async () => {
        if (resendTimer > 0) return;

        setLoading(true);

        try {
            await axios.post(api_url + "check_phone", {
                phone_with_code: phoneNumber
            });

            setLoading(false);

            Alert.alert("Success", "New OTP sent!");

            setResendTimer(RESEND_TIME_LIMIT);
            setOtpCode(["", "", "", ""]);
            inputRefs.current[0]?.focus();

        } catch (error) {
            setLoading(false);
            console.log(error);
            Alert.alert("Something went wrong! Try again.");
        }
    };


    const isOtpComplete = otpCode.join('').length === OTP_LENGTH;
    const verifyButtonColors = isOtpComplete
        ? [primaryColor, '#108b76'] // Active gradient
        : ['#cccccc', '#aaaaaa'];   // Disabled/lighter gradient

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <Loader visible={loading} />

            {/* Main Background Gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header - Back Button */}
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleBackButtonClick}
                >
                    <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                </TouchableOpacity>

                {/* OTP Content Area */}
                <View style={styles.contentArea}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 4-digit verification code to your mobile number. Please enter it below to continue.
                    </Text>

                    {/* OTP Input Boxes */}
                    <View style={styles.otpContainer}>
                        {otpCode.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                style={[
                                    styles.otpInput,
                                    // Highlight border if input is active or filled
                                    { borderColor: digit ? primaryColor : '#e0e0e0' }
                                ]}
                                keyboardType="number-pad"
                                maxLength={1}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                value={digit}
                                autoFocus={index === 0}
                                // When backspacing, the onChangeText handles the navigation.
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
                                        inputRefs.current[index - 1].focus();
                                    }
                                }}
                            />
                        ))}
                    </View>

                    <View>
                        <PrimaryButton title='Verify' onPress={login} />
                    </View>

                    {/* Resend Timer Text */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                            Didn't get the code?
                        </Text>
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={resendTimer > 0}
                        >
                            <Text style={[
                                styles.resendLink,
                                resendTimer > 0 && styles.resendDisabled
                            ]}>
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {!isKeyboardVisible && (
                    <View style={{ marginBottom: ms(60) }}>
                        <Image source={text} resizeMode='contain' style={{ width: 'auto', height: vs(120) }} />
                    </View>
                )}
            </LinearGradient>
        </SafeAreaView>
    )
}

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
    headerButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(30),
    },
    contentArea: {
        flex: 1,
        paddingHorizontal: ms(5),
        paddingTop: vs(20),
    },
    title: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginBottom: ms(5),
    },
    subtitle: {
        // fontFamily: regular,
        fontSize: ms(11),
        color: 'gray',
        marginBottom: vs(20),
        lineHeight: ms(18),
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginBottom: vs(30),
    },
    otpInput: {
        width: width * 0.16,
        height: width * 0.16,
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        textAlign: 'center',
        fontSize: ms(24),
        fontFamily: bold,
        color: blackColor,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        padding: 0, // Ensure no extra padding interferes with text centering
    },
    verifyButton: {
        height: vs(45), // Height for a comfortable button size
        borderRadius: ms(10),
        overflow: 'hidden',
        marginTop: vs(10),
        // Shadow for the button
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    verifyButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(16),
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: vs(20),
        alignItems: 'center',
    },
    resendText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginRight: ms(5),
    },
    resendLink: {
        fontFamily: bold,
        fontSize: ms(13),
        color: primaryColor, // Blue/Green color for the link
    },
    resendDisabled: {
        color: 'gray', // Gray out the timer text
        opacity: 0.8,
    },
    footer: {
        position: 'absolute',
        bottom: vs(50),
        left: 0,
        right: 0,
        alignItems: 'flex-start',
        paddingHorizontal: ms(25),
    },
    fadedText: {
        fontFamily: bold,
        fontSize: ms(40),
        color: whiteColor,
        opacity: 0.5,
        lineHeight: ms(45),
        fontWeight: '900',
    },
    fadedSubText: {
        fontFamily: bold,
        fontSize: ms(16),
        color: whiteColor,
        opacity: 0.5,
        marginTop: ms(5),
        fontWeight: '800',
    },
});


function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);
