import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, Dimensions, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, api_url, customer_login, customer_forget_password, logo_with_name } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import { connect } from 'react-redux';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAvoidingView } from 'react-native';

const { width, height, fontScale } = Dimensions.get('window');

const Password = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState('false');
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [validation, setValidation] = useState(false);

  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  const login_validation = async () => {
    if (password == "") {
      alert('Please enter Password.')
      await setValidation(false);
    } else {
      await setValidation(true);
      login();
    }
  }

  const login = async () => {
    console.log({ phone_with_code: phone_with_code_value, fcm_token: global.fcm_token, password: password })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_login,
      data: { phone_with_code: phone_with_code_value, fcm_token: global.fcm_token, password: password }
    })
      .then(async response => {
        console.log('first', response.data)

        setLoading(false);
        if (response.data.status == 1) {
          saveData(response.data)
        } else if (response.data.status == 0) {
          alert('Please enter correct Password')
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error)
        alert('Sorry something went wrong');
      });
  }

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
      await props.updateProfilePicture(data.result.profile_picture);

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

  const forgot_password = async () => {
    navigation.navigate('ForgotPassword')
    /*  setLoading(true);
     await axios({
       method: 'post', 
       url: api_url + customer_forget_password,
       data:{ phone_with_code: phone_with_code_value }
     })
     .then(async response => {
      
       setLoading(false);
       if(response.data.status == 1){
         navigation.navigate('Otp',{ data :  response.data.result.otp , type: 2, id : response.data.result.id  })
       }else{
         alert(response.data.message)
       }
     })
     .catch(error => {
       setLoading(false);
       alert('Sorry something went wrong');
     }); */
  }

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity onPress={handleBackButtonClick} style={{ flexDirection: 'row', margin: 20, marginLeft: 25 }}>
          {/* <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:35 }} /> */}
          <Text style={styles.head}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.login}>
          <View>
            <Text style={styles.main}>Welcome Back</Text>
            <Text style={styles.sub}>Hello there, sign in to continue </Text>
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
              <Image
                resizeMode='contain'
                source={logo_with_name}
                style={{ height: height * 0.25, width: '70%', }} />
            </View>
          </View>

          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Enter your password"
              placeholderTextColor={colors.theme_bg_two}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={forgot_password} style={styles.forgot}>
              <Text style={{ color: colors.theme_fg, fontFamily: regular, alignSelf: 'center', fontSize: 14, marginTop: 5 }}>Forgot Your Password ?  </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.check_validation}>
            <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={[styles.button2, { flexDirection: 'row', marginBottom: 25 }]} >
              <TouchableOpacity onPress={login_validation} style={[styles.button, { flexDirection: 'row', }]}>
                <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 20 }}>Continue</Text>
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.bot}>Don’t have an account? <Text style={styles.link}>Sign Up </Text> </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
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
    fontSize: 28,
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
    fontSize: 15,
    fontWeight: '500',
    color: 'blue',

  },
  textFieldcontainer: {

    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.04,
    width: width,
    marginTop: 15,
    marginBottom: 5,

  },
  textFieldIcon: {
    padding: 5
  },
  textField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,

    height: height * 0.07,
    color: colors.theme_bg_two,
    backgroundColor: colors.theme_bg_three,
    borderColor: colors.light_grey,
    borderWidth: 5,
    borderRadius: 15
  },
  forgot: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    width: width * 0.9,

  },
  button: {

    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:colors.theme_color,
    width: width * 0.9,
    height: height * 0.05,
    borderRadius: 15,
  },
  button2: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    padding: 22,
    height: height * 0.05,
    borderRadius: 15,
  },
  check_validation: {
    //backgroundColor:'yellow',
    width: width,
    height: height * 0.4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'


  }
});

function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Password);