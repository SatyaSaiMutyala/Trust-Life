import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, Switch, TouchableHighlight } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, customer_registration, regular } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux';
import { StatusBar } from '../components/StatusBar';
import { Dimensions } from 'react-native';
//import { CheckBox } from 'react-native-elements';
import { CheckBox } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

const { width, height, fontScale } = Dimensions.get('window');

const RegisterTwo = (props) => {

  const navigation = useNavigation();
  const route = useRoute();

  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const [customer_name, setCustomerName] = useState(route.params.customer_name);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [password, setPassword] = useState(route.params.password);
  const [fcm, setFcm] = useState(route.params.fcm_token);
  const [email, setEmail] = useState(route.params.email);
  const [date, setDate] = useState(route.params.DOB);
  const [gender, setGender] = useState("");
  const [yourWeight, setYourWeight] = useState("");
  const [yourHeight, setYourHeight] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);



  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  useEffect(() => {
    console.log('this is use effect -----> ', date);
  }, []);


  const check_validation = async () => {
    if (isEnabled) {
      if (!yourWeight || !yourHeight) {
        setValidation(false);
        alert('Please fill all the details.')
      } else {
        setValidation(true);

        register();
      }
    }
  }

  // const register = async() => {
  //     Keyboard.dismiss();
  //    console.log('this is phn number with code -------->', {phone_with_code_value} ,'--------->', phone_number_value);
  //    console.log('this is phn number with code -------->', date ,'--------->', yourHeight,'-------->', yourWeight);
  //     setLoading(true);
  //     await axios({
  //       method: 'post', 
  //       url: api_url + customer_registration,
  //       data:{ customer_name: customer_name, phone_with_code: phone_number_value, phone_number: phone_number_value, password: password, fcm_token: fcm, email:email,
  //       gender:gender,'Date_of_birth':date,'height':yourHeight,'weight':yourWeight }
  //     })
  //     .then(async response => {

  //       console.log(JSON.stringify(response.data.result))
  //       setLoading(false);
  //       if(response.data.status == 0){
  //         alert(response.data.message)
  //       }else{
  //         saveData(response.data)
  //       }

  //     })
  //     .catch(error => {
  //       console.error('error',error  )
  //       setLoading(false);
  //       alert('Sorry something went wrong')
  //     });
  //   }


  const register = async () => {
    Keyboard.dismiss();
    console.log('Phone with code:', phone_with_code_value, 'Phone number:', phone_number_value);
    console.log('DOB:', date, 'Height:', yourHeight, 'Weight:', yourWeight);

    setLoading(true);
    try {
      const response = await axios.post(api_url + customer_registration, {
        customer_name: customer_name,
        phone_with_code: phone_number_value,
        phone_number: phone_number_value,
        password: password,
        fcm_token: fcm,
        email: email,
        gender: gender,
        'Date_of_birth': date,
        'height': yourHeight,
        'weight': yourWeight
      });

      console.log('Response data:', response.data);
      setLoading(false);

      if (response.data.status == 0) {
        alert(response.data.message);
      } else {
        saveData(response.data);
      }

    } catch (error) {
      setLoading(false);

      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        alert(`Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('No response from server');
      } else {
        // Something happened while setting up the request
        console.error('Error message:', error.message);
        alert('Error: ' + error.message);
      }

      console.error('Full error config:', error.config);
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
      alert(e);
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

  const select_gender = (value) => {
    setGender(value)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <TouchableOpacity onPress={handleBackButtonClick} style={{ flexDirection: 'row', margin: 20, marginLeft: 25 }}>
        <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize: 35 }} />
        <Text style={styles.head}>Sign Up</Text>
      </TouchableOpacity>
      <ScrollView style={styles.login} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Loader visible={loading} />
        <View style={{}}>
          <View>
            <Text style={styles.main}>Welcome to us,</Text>
            <Text style={styles.sub}>Hello there, create new account </Text>

          </View>

          <View style={styles.register}>

            <View style={styles.textFieldcontainer}>
              <Icon type={Icons.FontAwesome} name="group" color={colors.grey} style={{ fontSize: 25 }} />
              <Picker
                selectedValue={gender}
                style={styles.textField}
                dropdownIconColor={colors.theme_fg}
                onValueChange={(itemValue, itemIndex) => select_gender(itemValue)}
              >
                <Picker.Item style={{ fontSize: 12, color: colors.theme_fg, fontFamily: regular }} value={0} label="Select Gender" />
                <Picker.Item style={{ fontSize: 12, color: colors.theme_fg, fontFamily: regular }} value={1} label="Male" />
                <Picker.Item style={{ fontSize: 12, color: colors.theme_fg, fontFamily: regular }} value={2} label="Female" />
              </Picker>
            </View>
            <View style={{ margin: 10 }} />

            <View style={{ width: width, flexDirection: 'row', }}>
              <View style={styles.phoneFieldcontainer}>
                <Icon type={Icons.MaterialIcons} name="monitor-weight" color={colors.grey} style={{ fontSize: 30 }} />
                <TextInput
                  style={styles.textField}
                  placeholder="Your weight"
                  placeholderTextColor={colors.grey}
                  underlineColorAndroid="transparent"
                  onChangeText={text => setYourWeight(text)}
                />
              </View>

              <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={{ height: 50, width: 50, borderRadius: 10, justifyContent: 'space-around', alignItems: 'center', }} >

                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '900', color: colors.theme_bg_three }}>KG</Text>
              </LinearGradient>
            </View>

            <View style={{ margin: 10 }} />

            <View style={{ width: width, flexDirection: 'row', }}>

              <View style={styles.phoneFieldcontainer}>
                <Icon type={Icons.Ionicons} name="swap-vertical" color={colors.grey} style={{ fontSize: 30 }} />


                <TextInput
                  style={styles.textField}
                  placeholder="Your Height"
                  placeholderTextColor={colors.grey}
                  underlineColorAndroid="transparent"

                  onChangeText={text => setYourHeight(text)}
                />
              </View>
              <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={{ height: 50, width: 50, borderRadius: 10, justifyContent: 'space-around', alignItems: 'center', }}  >


                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '900', color: colors.theme_bg_three }}>cm</Text>

              </LinearGradient>
            </View>


          </View>


          <View style={styles.check_validation}>
            <View>
              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: width * 0.7 }}>
                <CheckBox
                  center
                  title={''}
                  checked={isEnabled}
                  onPress={toggleSwitch}
                />
                <TouchableOpacity  >
                  <Text style={styles.bot}>By creating an account your agree to our
                    <Text style={styles.link}> Term and Conditions</Text></Text>
                </TouchableOpacity>


              </View>
              <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={[styles.button, { opacity: isEnabled ? 1 : 0.5 }]}>
                <TouchableOpacity onPress={check_validation} style={[styles.button,]}  >
                  <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Sign Up</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <TouchableOpacity onPress={handleBackButtonClick}  >

              <Text style={styles.bot}>Have an account?  <Text style={styles.link}>Sign In </Text></Text>

            </TouchableOpacity>
          </View>

        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_color,
  },
  login: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    flex: 1,
    width: width,
    height: height * 0.9,
    marginTop: height * 0.10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // justifyContent:'space-between',
  },
  main: {
    color: colors.theme_color,
    marginLeft: 20,
    marginTop: 20,
    fontSize: 28,
    fontWeight: '600',
  },

  head: {
    color: colors.theme_bg_three,
    fontSize: 23,
    fontWeight: '500',
  },
  sub: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343434',
    marginLeft: 20
  },
  bot: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343434',

  },
  link: {
    fontSize: 16,
    fontWeight: '500',
    color: 'blue',

  },
  textFieldcontainer: {
    marginHorizontal: 10,

    flexDirection: 'row',

    height: 50,
    borderColor: colors.light_grey,
    borderWidth: 3,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',


  },


  textField: {
    flex: 1,
    paddingLeft: 12,
    borderRadius: 10,
    height: 44,
    backgroundColor: colors.theme_bg_three,
    fontSize: 14,
    color: colors.theme_fg_two,

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',

    width: width * 0.8,
    height: 50,
    borderRadius: 15,

  },
  phoneFieldcontainer: {

    flexDirection: 'row',
    marginHorizontal: 10,
    height: 50,
    borderColor: colors.light_grey,
    borderWidth: 3,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: width * 0.8,
  },

  register: {
    marginVertical: 20,
    height: height * 0.2,
    // justifyContent:'center'
    marginTop: 20

  },
  term: {
    color: colors.theme_bg_two,
    fontSize: 16,

  },
  check_validation: {
    //backgroundColor:'yellow',
    width: width,
    height: height * 0.4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 20,


  }
});

export default RegisterTwo