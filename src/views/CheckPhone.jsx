// import React, { useState, useRef } from 'react';
// import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
// import * as colors from '../assets/css/Colors';
// import { regular, bold, api_url, customer_check_phone } from '../config/Constants';
// import PhoneInput from 'react-native-phone-input';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { StatusBar } from '../components/StatusBar';
// import LinearGradient from 'react-native-linear-gradient';

// const CheckPhone = () => {

//   const navigation = useNavigation();
//   const phone_ref = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [validation, setValidation] = useState(false);

//   const otp = () => {
//     navigation.navigate("Password")
//   }
//   const terms_and_conditions = () => {
//     navigation.navigate("TermsAndConditions")
//   }
//   const onPressFlag = () => {
//     countryPicker.openModal()
//   }
//   const phone_reference = async () => {
//     await setTimeout(() => {
//       phone_ref.current.focus();
//     }, 200);
//   }
//   const check_validation = async () => {
//     Keyboard.dismiss();
//     if ('+' + phone_ref.current.getCountryCode() == phone_ref.current.getValue()) {
//       await setValidation(false);
//       alert('Please enter your phone number')
//     } else if (!phone_ref.current.isValidNumber()) {
//       await setValidation(false);
//       alert('Please enter valid phone number')
//     } else {
//       await setValidation(true);
//       //otp();
//       check_phone_number(phone_ref.current.getValue())
//     }
//   }
//   const check_phone_number = async (phone_with_code) => {
//     console.log({ phone_number: phone_with_code })
//     setLoading(true);
//     await axios({
//       method: 'post',
//       url: api_url + customer_check_phone,
//       data: { phone_with_code: phone_with_code }
//     })
//       .then(async response => {
//         setLoading(false);
//         if (response.data.result.is_available == 1) {
//           navigation.navigate('Password', { phone_with_code: phone_with_code })
//         } else {
//           // let phone_number = phone_ref.current.getValue();
//           // phone_number = phone_number.replace("+" + phone_ref.current.getCountryCode(), "");
//           // navigation.navigate('Otp', { data: response.data.result.otp, type: 1, phone_with_code: phone_with_code, phone_number: phone_number })
//           navigation.navigate('Password', { phone_with_code: phone_with_code })
//         }
//       })
//       .catch(error => {
//         setLoading(false);
//         console.log('this is error in login --------->', error);
//         alert('Sorry something went wrong');
//       });
//   }
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//       <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
//         {/* <View style={{ margin:20 }}/>
//       <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter your phone number</Text> */}
//         <View style={{ margin: 10 }} />
//         <View style={styles.textFieldcontainer}>
//           <PhoneInput ref={phone_ref} style={{ borderColor: colors.theme_fg_two }} flagStyle={styles.flag_style} initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor: colors.grey }} />
//         </View>
//         <View style={{ margin: 10 }} />
//         <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//           <Text style={styles.bot}>Don’t have an account? <Text style={styles.link}>Sign Up </Text> </Text>
//         </TouchableOpacity>
//         <View style={{ margin: 10 }} />
//         <Text style={{ fontSize: 14, color: colors.grey, fontFamily: regular }}>By continuing, you agree to our</Text>
//         <View style={{ margin: 2 }} />
//         <TouchableOpacity onPress={terms_and_conditions} style={{ borderBottomWidth: 0.3, borderColor: colors.theme_fg_two, width: '40%' }} >
//           <Text style={{ color: colors.theme_fg_two, fontFamily: regular, fontSize: 13, letterSpacing: 0.2 }}>Terms & Conditions</Text>
//         </TouchableOpacity>
//         <View style={{ margin: 20 }} />
//         <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={styles.button2}>
//           <TouchableOpacity onPress={check_validation} style={styles.button}>
//             <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Continue</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//         <View style={{ margin: 10 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   textFieldIcon: {
//     padding: 5
//   },
//   textField: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 10,
//     height: 45,
//     backgroundColor: colors.theme_bg_three
//   },
//   button: {
//     paddingTop: 10,
//     paddingBottom: 10,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     // backgroundColor:colors.theme_bg
//   },
//   bot:{
//     fontSize:16,
//     fontWeight:'500',
//     color:'#343434',
//   },
//   link:{
//     fontSize:15,
//     fontWeight:'500',
//     color:'blue',
//   },
//   button2: {
//     borderRadius: 10
//   },
//   flag_style: {
//     width: 38,
//     height: 24
//   },
//   country_text: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 10,
//     height: 45,
//     backgroundColor: colors.theme_bg_three,
//     fontFamily: regular,
//     fontSize: 12,
//     color: colors.theme_fg_two
//   },
//   textFieldcontainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginTop: 5,
//     marginBottom: 5,
//     height: 45
//   },
// });
// export default CheckPhone;


import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { CheckPhoneAction } from '../redux/actions/CustomerAuthActions';
import { blackColor, globalGradient, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import { StatusBar } from '../components/StatusBar';
import * as colors from '../assets/css/Colors';
import { loginIcon, regular } from '../config/Constants';
import PrimaryButton from '../utils/primaryButton';
import { Image } from 'react-native';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import Snackbar from '../utils/SnackBar';

const CheckPhone = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const checkPhone = async () => {
    if (phone.trim().length < 10) {
      alert('Please enter valid phone number');
      return;
    }
    const phone_with_code = `+91${phone}`;
    setLoading(true);
    try {
      const response = await dispatch(CheckPhoneAction(phone_with_code));
      console.log('this is login responsee man -----------> ', response);
      setLoading(false);
      // navigation.navigate('Password', { phone_with_code });
      navigation.navigate('otpScreen', { phone_with_code });
    } catch (error) {
      setLoading(false);
      // alert('Something went wrong');
      console.log('Error occured -------->', error.message);
      Snackbar('Something went Wrong', 'fail')
    }
  };

  const terms_and_conditions = () => navigation.navigate('TermsAndConditions');

  const naviteHome = async () => {
    console.log('im clicked man ------------')
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.mainContainer}>
            <TouchableOpacity style={{
               marginLeft: 'auto',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 30,
              padding: 6,
              paddingHorizontal:ms(20),
              marginBottom:ms(15)
            }} onPress={naviteHome}>
              <Text style={{ fontSize: ms(14), fontFamily: regular, color: whiteColor }}>Skip</Text>
            </TouchableOpacity>
            <View style={{ marginBottom: ms(40), alignItems: 'center' }}>
              <Image source={loginIcon} style={{ width: s(280), height: vs(300) }} />
            </View>
            {/* Bottom login area */}
            <View style={styles.bottomContainer}>
              <Text style={styles.title}>Login with Mobile Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>+91</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#aaa"
                  style={styles.textInput}
                />
              </View>

              {/* <TouchableOpacity style={styles.button} onPress={checkPhone}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity> */}

              <PrimaryButton title='Continue' onPress={checkPhone} />
              <TouchableOpacity
                onPress={() => navigation.navigate('PersonalDetails')}
                style={{ marginTop: 10 }}
              >
                <Text style={styles.signupText}>
                  I don’t have an account?{' '}
                  <Text style={{ color: primaryColor, fontWeight: '600' }}>Signup</Text>
                </Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text
                  onPress={terms_and_conditions}
                  style={styles.linkText}
                >
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CheckPhone;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  bottomContainer: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: blackColor,
    marginBottom: 15,
    textAlign: 'start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: grayColor,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : 4,
    borderWidth: 2,
    borderColor: grayColor
  },
  prefixBox: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: 10,
    marginRight: 10,
  },
  prefixText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    textAlign: 'center',
    color: blackColor,
    fontSize: 15,
  },
  termsText: {
    fontSize: 12,
    color: blackColor,
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 18,
  },
  linkText: {
    color: primaryColor,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
