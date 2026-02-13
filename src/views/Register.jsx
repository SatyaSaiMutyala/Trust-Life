


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Keyboard,
//   Dimensions,
//   Platform,
//   KeyboardAvoidingView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
// import { connect } from 'react-redux';
// import { updateProfilePicture } from '../actions/CurrentAddressActions';
// import { StatusBar } from '../components/StatusBar';
// import Loader from '../components/Loader';
// import Icon, { Icons } from '../components/Icons';
// import * as colors from '../assets/css/Colors';
// import { bold, api_url, customer_registration, regular } from '../config/Constants';
// import { blackColor, globalColors, globalGradient } from '../utils/globalColors';
// import { PricingButton } from 'react-native-elements/dist/pricing/PricingCard';
// import PrimaryButton from '../utils/primaryButton';

// const { width, height } = Dimensions.get('window');


// const InputField = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType = 'default',
//   isSecure = false,
//   iconType,
//   iconName,
//   onPressIn,
//   maxLength,
// }) => {
//   const [secure, setSecure] = useState(isSecure);

//   const handleIconPress = () => {
//     if (isSecure) {
//       setSecure((prev) => !prev);
//     } else if (onPressIn) {
//       onPressIn();
//     }
//   };

//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#E5E5E5',
//         borderRadius: 10,
//         height: 50,
//         paddingHorizontal: 15,
//         marginBottom: 20,
//       }}
//     >
//       <TextInput
//         style={{
//           flex: 1,
//           fontSize: 16,
//           color: '#000',
//           paddingVertical: 0,
//         }}
//         placeholder={placeholder}
//         placeholderTextColor="#A0A0A0"
//         underlineColorAndroid="transparent"
//         onChangeText={onChangeText}
//         value={value}
//         keyboardType={keyboardType}
//         secureTextEntry={secure}
//         editable={!onPressIn}
//         onPressIn={onPressIn}
//         maxLength={maxLength}
//       />

//       {iconType && (
//         <TouchableOpacity onPress={handleIconPress} activeOpacity={0.7}>
//           <Icon
//             type={iconType}
//             name={
//               isSecure
//                 ? secure
//                   ? 'eye-off'
//                   : 'eye'
//                 : iconName
//             }
//             size={20}
//             color="#A0A0A0"
//           />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };


// // --- End InputField Component ---


// // --- Main Register Component ---
// const Register = (props) => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   // State Initialization
//   const [loading, setLoading] = useState(false);
//   const [customer_name, setCustomerName] = useState('');
//   const [phone_with_code_value, setPhoneWithCodeValue] = useState(route?.params?.phone_with_code_value ?? '');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [defaultDate, setDefaultDate] = useState(new Date());
//   const [show, setShow] = useState(false);
//   const [date, setDate] = useState('');

//   // Constants for layout
//   // Adjusted gradient height ratio based on visual estimation in the image (it's slightly more than 25%)
//   const GRADIENT_BASE_HEIGHT = height * 0.30;
//   const CARD_TOP_OVERLAP = 50;
//   const CARD_TOP_POSITION = GRADIENT_BASE_HEIGHT - CARD_TOP_OVERLAP;

//   // Effect to set initial phone number (kept from original)
//   useEffect(() => {
//     if (route.params?.phone_number_value) {
//       setPhoneWithCodeValue(route.params.phone_number_value);
//     }
//   }, [route.params]);

//   // Handlers (kept original logic)
//   const handleBackButtonClick = () => {
//     navigation.goBack();
//   };

//   const onChangeDate = (e, selectedDate) => {
//     setShow(false);
//     if (selectedDate) {
//       const formatted = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
//       setDate(formatted);
//       setDefaultDate(selectedDate);
//     }
//   };

//   const check_validation = async () => {
//     const phoneDigits = (phone_with_code_value || '').replace(/\D/g, '');
//     const fullPhone = '+91' + phoneDigits;

//     if (!customer_name || !password || !email || !date || !phone_with_code_value) {
//       alert('Please fill all the details.');
//       return;
//     }
//     if (phoneDigits.length !== 10) {
//       alert('Please enter a valid 10-digit phone number.');
//       return;
//     }

//     navigation.navigate('RegisterTwo', {
//       phone_with_code_value: fullPhone,
//       phone_number_value: phoneDigits,
//       customer_name,
//       password,
//       fcm_token: global.fcm_token,
//       email,
//       DOB: date,
//     });
//   };

//   // ... (register, saveData, navigateHome functions kept but hidden for brevity)

//   return (
//     // 1. Wrap the entire screen in LinearGradient
//     <LinearGradient
//       colors={globalGradient}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       locations={[0, 0.2]}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
//         <StatusBar />
//         <Loader visible={loading} />
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >

//           <TouchableOpacity
//             onPress={handleBackButtonClick}
//             style={{
//               top: Platform.OS === 'ios' ? 10 : 20,
//               left: 25,
//               width: 40,
//               height: 40,
//               borderRadius: 20,
//               backgroundColor: '#fff',
//               justifyContent: 'center',
//               alignItems: 'center',
//               elevation: 3,
//               zIndex: 10,
//               marginVertical: 40
//             }}
//           >
//             <Icon type={Icons.Feather} name="arrow-left" color="#000" size={22} />
//           </TouchableOpacity>

//           <ScrollView
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 50 }}
//             style={{ flex: 1 }}
//           >
//             <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
//               {/* Header Area: Welcome to Trust Lab */}
//               <View style={{ marginTop: 10, marginBottom: 30 }}>
//                 <Text
//                   style={{
//                     fontSize: 28,
//                     color: '#000',
//                     fontWeight: '700',
//                     marginBottom: 8,
//                   }}
//                 >
//                   Welcome to Trust Lab
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     color: '#555',
//                     lineHeight: 20,
//                   }}
//                 >
//                   Create your account to start booking lab tests — it’s simple, fast, and secure with Trust Lab
//                 </Text>
//               </View>

//               {/* Inputs */}
//               <View>
//                 <InputField
//                   placeholder="Name"
//                   value={customer_name}
//                   onChangeText={setCustomerName}
//                   iconType={Icons.Feather}
//                   iconName="user"
//                 />

//                 {show && (
//                   <DateTimePicker
//                     mode="date"
//                     value={defaultDate}
//                     onChange={onChangeDate}
//                     maximumDate={new Date()}
//                   />
//                 )}
//                 <InputField
//                   placeholder="Date of Birth"
//                   value={date}
//                   onPressIn={() => { Keyboard.dismiss(); setShow(true); }}
//                   iconType={Icons.Feather}
//                   iconName="calendar"
//                 />

//                 <InputField
//                   placeholder="Phone Number"
//                   value={phone_with_code_value}
//                   onChangeText={setPhoneWithCodeValue}
//                   keyboardType="number-pad"
//                   maxLength={10}
//                   iconType={Icons.Feather}
//                   iconName="smartphone"
//                 />

//                 <InputField
//                   placeholder="Email Address"
//                   value={email}
//                   onChangeText={setEmail}
//                   keyboardType="email-address"
//                   iconType={Icons.Feather}
//                   iconName="mail"
//                 />

//                 <InputField
//                   placeholder="Password"
//                   value={password}
//                   onChangeText={setPassword}
//                   isSecure={true}
//                   iconType={Icons.Feather}
//                 />
//               </View>
//               <PrimaryButton title='Signup' onPress={check_validation} />
//               {/* Login Link */}
//               <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     color: blackColor,
//                   }}
//                 >
//                   Already have an account?
//                   <Text
//                     onPress={() => navigation.navigate('CheckPhone')}
//                     style={{
//                       color: '#006D5D',
//                       fontWeight: '700',
//                     }}
//                   >
//                     {' '}
//                     Login
//                   </Text>
//                 </Text>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// // --- Redux Connection (Kept original) ---
// function mapStateToProps(state) {
//   return {
//     profile_picture: state.current_location.profile_picture,
//   };
// }

// const mapDispatchToProps = (dispatch) => ({
//   updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Register);








import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
// Assuming updateProfilePicture, StatusBar, Loader, Icon, Icons are correctly imported or defined in your project structure
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import Loader from '../components/Loader';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, primaryColor, whiteColor, globalGradient } from '../utils/globalColors'; // Added whiteColor, primaryColor for styling
// Import size-matters for responsive design
import { ms, vs } from 'react-native-size-matters';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerRegisterAction } from '../redux/actions/CustomerAuthActions';

const { width, height } = Dimensions.get('window');

// Placeholder for PrimaryButton (as it's used but not defined in the provided code)
const PrimaryButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.primaryButton}>
    <LinearGradient
      colors={[primaryColor, '#108b76']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.primaryButtonGradient}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// --- InputField Component (Updated to use ms/vs) ---
const InputField = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  isSecure = false,
  iconType,
  iconName,
  onPressIn,
  maxLength,
  suffixText, // New prop for KG/CM
}) => {
  const [secure, setSecure] = useState(isSecure);

  const handleIconPress = () => {
    if (isSecure) {
      setSecure((prev) => !prev);
    } else if (onPressIn) {
      onPressIn();
    }
  };

  return (
    <View style={styles.inputFieldContainer}>
      <TextInput
        style={styles.inputFieldTextInput}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        underlineColorAndroid="transparent"
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        editable={!onPressIn}
        onPressIn={onPressIn}
        maxLength={maxLength}
      />

      {suffixText && (
        <Text style={styles.inputSuffixText}>{suffixText}</Text>
      )}

      {iconType && (
        <TouchableOpacity
          onPress={handleIconPress}
          activeOpacity={0.7}
          disabled={!isSecure && !onPressIn}
        >
          <Icon
            type={iconType}
            name={
              isSecure
                ? secure
                  ? 'eye-off'
                  : 'eye'
                : iconName
            }
            size={ms(20)}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- Radio Button Component ---
const RadioButton = ({ label, selected, onSelect }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
    <View style={[
      styles.radioOuter,
      { borderColor: selected ? primaryColor : '#A0A0A0' }
    ]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Register Component ---
const Register = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // State Initialization
  const [loading, setLoading] = useState(false);
  const [customer_name, setCustomerName] = useState('');
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route?.params?.phone_with_code_value ?? '');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState('');
  // New States from Image
  const [gender, setGender] = useState('Male'); // Default selection
  const [weight, setWeight] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('Diabetes, BP, Thyroid'); // Placeholder value
  const [lifestyle, setLifestyle] = useState('Smoking / Alcohol'); // Placeholder value
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [healthConditions, setHealthConditions] = useState([]); // Multi-select
  const [habbitsValue, setHabbitsValue] = useState(''); // Single select
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showHabbitModal, setShowHabbitModal] = useState(false);


  const HEALTH_OPTIONS = [
    "Diabetes",
    "BP",
    "Thyroid",
    "Heart Issue",
    "Other",
  ];

  const HABBITS_OPTIONS = [
    "Drinking",
    "Smoking",
    "Both",
    "No Habit"
  ];



  // Handlers
  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const onChangeDate = (e, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setDate(formatted);
      setDefaultDate(selectedDate);
    }
  };

  const register = async () => {
    const phoneDigits = (phone_with_code_value || '').replace(/\D/g, '');

    if (!customer_name || !email || !date || !phone_with_code_value) {
      Alert.alert('Error', 'Please fill all required fields in Personal Details.');
      return;
    }
    if (phoneDigits.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Error', 'You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    const fullPhone = '+91' + phoneDigits;

    // Convert date from DD/MM/YYYY to YYYY-MM-DD format for the API
    const dateParts = date.split('/');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await dispatch(CustomerRegisterAction({
        customer_name: customer_name,
        phone_with_code: fullPhone,
        phone_number: phoneDigits,
        fcm_token: global.fcm_token,
        email: email,
        gender: gender,
        date_of_birth: formattedDate,
        height: heightValue,
        weight: weight,
        health_condition: healthConditions.join(','),
        habbits: habbitsValue
      }));

      console.log('Response:', response);
      setLoading(false);

      if (response.status == 0) {
        Alert.alert(response.message);
      } else {
        saveData(response);
      }

    } catch (error) {
      setLoading(false);

      if (error.response) {
        Alert.alert("Server Error: " + error.response.status);
        console.log("ERROR:", error.response.data);
      } else if (error.request) {
        Alert.alert("No response from server");
      } else {
        Alert.alert("Error: " + error.message);
      }
    }
  };


  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('id', data.result.id.toString());
      await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
      await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
      await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
      await AsyncStorage.setItem('email', data.result.email.toString());
      await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());

      global.id = await data.result.id.toString();
      global.customer_name = await data.result.customer_name.toString();
      global.phone_number = await data.result.phone_number.toString();
      global.phone_with_code = await data.result.phone_with_code.toString();
      global.email = await data.result.email.toString();

      await navigate();
    } catch (e) {
      Alert.alert(e);
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


  {/* ---------- Health Condition Multi-Select Modal ---------- */ }
  {
    showHealthModal && (
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Select Medical Conditions</Text>

          {HEALTH_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalRow}
              onPress={() => {
                if (healthConditions.includes(item)) {
                  setHealthConditions(healthConditions.filter(x => x !== item));
                } else {
                  setHealthConditions([...healthConditions, item]);
                }
              }}
            >
              <Text style={styles.modalItem}>{item}</Text>
              <Icon
                type={Icons.Feather}
                name={healthConditions.includes(item) ? "check-square" : "square"}
                size={20}
                color={primaryColor}
              />
            </TouchableOpacity>
          ))}

          <PrimaryButton title="Done" onPress={() => setShowHealthModal(false)} />
        </View>
      </View>
    )
  }

  {/* ---------- Habits Single-Select Modal ---------- */ }
  {
    showHabbitModal && (
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Select Habit</Text>

          {HABBITS_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalRow}
              onPress={() => {
                setHabbitsValue(item);
                setShowHabbitModal(false);
              }}
            >
              <Text style={styles.modalItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }



  return (
    <LinearGradient
      colors={globalGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.2]}
      style={styles.fullGradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar2 />
        <Loader visible={loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {/* Back Button positioned based on the image */}
          <TouchableOpacity
            onPress={handleBackButtonClick}
            style={styles.backButton}
          >
            <Icon type={Icons.Feather} name="arrow-left" color={primaryColor} size={ms(22)} />
          </TouchableOpacity>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.mainContentPadding}>
              {/* Header Area: Welcome to Trust Lab */}
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeTitle}>
                  Welcome to Trust lab
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Create your account to start booking lab tests — it’s simple, fast, and secure with Trust Lab
                </Text>
              </View>

              {/* --- Personal Details Section --- */}
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View>
                <InputField
                  placeholder="Name"
                  value={customer_name}
                  onChangeText={setCustomerName}
                  iconType={Icons.Feather}
                  iconName="user"
                />

                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={defaultDate}
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
                <InputField
                  placeholder="Date of Birth"
                  value={date}
                  onPressIn={() => { Keyboard.dismiss(); setShowDatePicker(true); }}
                  iconType={Icons.Feather}
                  iconName="calendar"
                />

                {/* --- Gender Radio Buttons --- */}
                <Text style={styles.genderTitle}>Gender</Text>
                <View style={styles.genderContainer}>
                  <RadioButton label="Male" selected={gender === 'male'} onSelect={() => setGender('male')} />
                  <RadioButton label="Female" selected={gender === 'female'} onSelect={() => setGender('female')} />
                  <RadioButton label="Others" selected={gender === 'others'} onSelect={() => setGender('others')} />
                </View>
                <InputField
                  placeholder="Phone Number"
                  value={phone_with_code_value}
                  onChangeText={setPhoneWithCodeValue}
                  keyboardType="number-pad"
                  maxLength={10}
                  iconType={Icons.Feather}
                  iconName="smartphone"
                />
                <InputField
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  iconType={Icons.Feather}
                  iconName="mail"
                />
                <InputField
                  placeholder="weight"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  maxLength={3}
                  suffixText="KG"
                />
                <InputField
                  placeholder="Height"
                  value={heightValue}
                  onChangeText={setHeightValue}
                  keyboardType="numeric"
                  maxLength={3}
                  suffixText="CM"
                />
              </View>

              {/* --- Medical Details Section --- */}
              <Text style={styles.sectionTitle}>Medical Details</Text>
              <TouchableOpacity
                onPress={() => setShowHealthModal(true)}
                activeOpacity={0.8}
              >
                <InputField
                  placeholder="Existing Medical Conditions"
                  value={healthConditions.join(', ')}
                  iconType={Icons.Feather}
                  iconName="chevron-down"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {/* Habits Dropdown */}
              <TouchableOpacity
                onPress={() => setShowHabbitModal(true)}
                activeOpacity={0.8}
              >
                <InputField
                  placeholder="Lifestyle / Smoking / Alcohol"
                  value={habbitsValue}
                  iconType={Icons.Feather}
                  iconName="chevron-down"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>


              {/* --- Terms & Conditions Checkbox --- */}
              <View style={styles.termsContainer}>
                <TouchableOpacity onPress={() => setAgreedToTerms(prev => !prev)} style={styles.checkboxTouchArea}>
                  <View style={[
                    styles.checkbox,
                    { backgroundColor: agreedToTerms ? primaryColor : whiteColor }
                  ]}>
                    {agreedToTerms && <Icon type={Icons.Feather} name="check" size={ms(12)} color={whiteColor} />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  By continuing, you agree to our
                  <Text style={styles.termsLink} onPress={() => Alert.alert('Navigation', 'Go to Terms & Conditions')}> Terms & Conditions</Text>
                  and
                  <Text style={styles.termsLink} onPress={() => Alert.alert('Navigation', 'Go to Privacy Policy')}> Privacy Policy.</Text>
                </Text>
              </View>

              <PrimaryButton title='Signup' onPress={register} />

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginText}>
                  Already I have an account ?
                  <Text
                    onPress={() => navigation.navigate('CheckPhone')}
                    style={styles.loginLink}
                  >
                    {' '}
                    Login
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* ---------- Health Condition Multi-Select Modal ---------- */}
      {
        showHealthModal && (
          <View style={styles.modalWrapper}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Medical Conditions</Text>

              {HEALTH_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalRow}
                  onPress={() => {
                    if (healthConditions.includes(item)) {
                      setHealthConditions(healthConditions.filter(x => x !== item));
                    } else {
                      setHealthConditions([...healthConditions, item]);
                    }
                  }}
                >
                  <Text style={styles.modalItem}>{item}</Text>
                  <Icon
                    type={Icons.Feather}
                    name={healthConditions.includes(item) ? "check-square" : "square"}
                    size={20}
                    color={primaryColor}
                  />
                </TouchableOpacity>
              ))}

              <PrimaryButton title="Done" onPress={() => setShowHealthModal(false)} />
            </View>
          </View>
        )
      }

      {/* ---------- Habits Single-Select Modal ---------- */}
      {
        showHabbitModal && (
          <View style={styles.modalWrapper}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Habit</Text>

              {HABBITS_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalRow}
                  onPress={() => {
                    setHabbitsValue(item);
                    setShowHabbitModal(false);
                  }}
                >
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      }
    </LinearGradient>
  );
};

// --- Stylesheet using react-native-size-matters ---
const styles = StyleSheet.create({
  fullGradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    // position: 'absolute',
    top: Platform.OS === 'ios' ? ms(10) : ms(20),
    left: ms(25),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 10,
    marginVertical: ms(40),
  },
  scrollViewContent: {
    paddingBottom: vs(50),
  },
  mainContentPadding: {
    paddingHorizontal: ms(25),
  },
  headerTextContainer: {
    marginTop: vs(10),
    marginBottom: vs(30),
  },
  welcomeTitle: {
    fontSize: ms(22),
    color: blackColor,
    fontFamily: bold,
    marginBottom: ms(6),
  },
  welcomeSubtitle: {
    fontSize: ms(12),
    color: '#555',
    lineHeight: ms(18),
  },
  sectionTitle: {
    fontSize: ms(16),
    color: blackColor,
    fontFamily: bold,
    marginBottom: vs(8),
  },
  // --- InputField Styles ---
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderWidth: ms(1),
    borderColor: '#E5E5E5',
    borderRadius: ms(10),
    height: vs(40),
    paddingHorizontal: ms(15),
    marginBottom: vs(10),
  },
  inputFieldTextInput: {
    flex: 1,
    fontSize: ms(14),
    color: blackColor,
    paddingVertical: 0,
    fontFamily: regular,
  },
  inputSuffixText: {
    fontSize: ms(14),
    color: '#A0A0A0',
    fontFamily: bold,
    marginRight: ms(5),
  },
  // --- Gender Radio Styles ---
  genderTitle: {
    fontSize: ms(14),
    color: '#A0A0A0',
    fontFamily: regular,
    marginBottom: vs(10),
    marginLeft: ms(5),
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(20),
    paddingHorizontal: ms(5),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(5),
  },
  radioOuter: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    borderWidth: ms(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  radioInner: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: primaryColor,
  },
  radioLabel: {
    fontSize: ms(14),
    color: blackColor,
    fontFamily: regular,
  },
  // --- Terms & Conditions Styles ---
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(30),
    marginTop: vs(10),
  },
  checkboxTouchArea: {
    paddingTop: vs(2),
    paddingRight: ms(10),
  },
  checkbox: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(4),
    borderWidth: ms(1),
    borderColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: ms(12),
    color: blackColor,
    fontFamily: regular,
    lineHeight: ms(16),
  },
  termsLink: {
    color: primaryColor,
    fontFamily: bold,
  },
  // --- Primary Button Styles (Placeholder) ---
  primaryButton: {
    borderRadius: ms(10),
    overflow: 'hidden',
    marginTop: vs(10),
    height: vs(45),
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: whiteColor,
    fontFamily: bold,
    fontSize: ms(16),
  },
  // --- Login Link Styles ---
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: vs(20),
    marginBottom: vs(20)
  },
  loginText: {
    fontSize: ms(14),
    color: blackColor,
    fontFamily: regular,
  },
  modalWrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: ms(16),
    fontFamily: bold,
    marginBottom: 15,
    color: blackColor,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  modalItem: {
    fontSize: ms(14),
    color: blackColor,
    fontFamily: regular,
  },
  loginLink: {
    color: primaryColor,
    fontFamily: bold,
  },
});

// --- Redux Connection (Kept original) ---
function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
