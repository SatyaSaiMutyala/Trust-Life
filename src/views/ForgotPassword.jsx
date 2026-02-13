import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, api_url, customer_check_phone  } from '../config/Constants';
import CodeInput from 'react-native-confirmation-code-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import PhoneInput from 'react-native-phone-input';
const {width, height,fontScale} = Dimensions.get('window');

import axios from 'axios';
import Loader from '../components/Loader';

export default function ForgotPassword() {
    const navigation = useNavigation();
    const route = useRoute();
    const phone_ref = useRef(null);
    const [loading, setLoading] = useState(false);
    const [validation,setValidation] = useState(false);


    const handleBackButtonClick= () => {
        navigation.goBack()
      } 


     
    
      const check_validation = async() => {
        console.log('first')
        Keyboard.dismiss();
        if('+'+phone_ref.current.getCountryCode() == phone_ref.current.getValue()){
           setValidation(false);
          alert('Please enter your phone number')
        }else if(!phone_ref.current.isValidNumber()){
           setValidation(false);
          alert('Please enter valid phone number')
        }else{
           setValidation(true);
          //otp();
          check_phone_number( phone_ref.current.getValue() )
        }
      }
    
      const check_phone_number = async(phone_with_code) => {
        console.log({ phone_with_code : phone_with_code})
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + customer_check_phone,
          data:{ phone_with_code : phone_with_code}
        })
        .then(async response => {
           // console.log('first', response.data.result)
          setLoading(false);
          
          
            let phone_number = phone_ref.current.getValue();
            phone_number = phone_number.replace("+"+phone_ref.current.getCountryCode(), "");
            navigation.navigate('Otp',{ data : response.data.result.otp, type: 2, phone_with_code : phone_with_code, phone_number : phone_number })
         
        })
        .catch(error => {
            console.log('first', error)
          setLoading(false);
          alert('Sorry something went wrong');
        });
      }
    
    
    return(
        <SafeAreaView style={[styles.container,]}>
      <StatusBar />
      <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{flexDirection:'row',margin:20,marginLeft: width * 0.01}}>
                  <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_black} style={{ fontSize:35 }} />
                  
                  <Text style={styles.head}> Forgot Password</Text>
          </TouchableOpacity>
        
        <View  style={styles.card}>
        <View style={{marginLeft:20,marginTop:20}} >
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular ,marginLeft:10,fontWeight:'bold'}}>Type your phone number  </Text>
        <View style={{ margin:10 }}/>
          <View style={styles.textFieldcontainer}>
              <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_color }} 
              flagStyle={styles.flag_style}  
              initialCountry="in" 
              offset={10} 
              textStyle={styles.country_text}
              textProps={{ placeholder: "Enter your phone number", 
              placeholderTextColor : colors.grey }} />
            </View>

    
    
            <View style={styles.text}>
              <Text style={{fontSize:15,color:colors.grey,}}>We will send you a code to verify your phone number  </Text>
    
    
            </View>
    
    
              <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={styles.buttons} >
    
                <TouchableOpacity  onPress={check_validation}   style={styles.buttons}>
              
                  <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Next</Text>
                </TouchableOpacity>
              </LinearGradient>
              <View style={{ margin:10 }}/>
            </View>
            </View> 
      </View>
      
    </SafeAreaView>
  
      );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
      },
      link:{
        fontSize:16,
        fontWeight:'500',
        color:'blue',
        marginLeft:20
    
      },
      text:{
    
    
        justifyContent:'space-around',
        alignItems:'center',
        // height:height*0.
        // marginBottom:
        marginTop: 10, 
        marginBottom: 10, 
        //width:'70%',
       // backgroundColor:'yellow',
        
        
      },
      card:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        
        width:width*0.9,
        height:height*0.3,
        
    
        // marginHorizontal:width*0.05,
        borderRadius:30,
        backgroundColor: '#ffffff', 
        elevation: 10
        
        
      },
      textFieldcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 0,
        width:width*0.8,
        // marginHorizontal: 5,
        height: 45,
       
        borderColor:colors.light_grey,
        borderWidth:3,
        borderRadius:15
       
      },
      
      textFieldIcon: {
        padding:5
      },
     
      flag_style:{
        width: 38, 
        height: 24
      },
      country_text:{
        flex: 1,
        padding: 12,
        borderRadius: 10,
        height: 45,
        backgroundColor:colors.theme_bg_three,
        fontFamily:regular,
        fontSize: 12,
        color: colors.theme_fg_two
      },
      
      button: {
        
        alignItems: 'center',
        justifyContent: 'center',
       // backgroundColor:colors.theme_color,
        width: 100,
        height:50,
        borderRadius:15,
      },
      buttons: {
        
        alignItems: 'center',
        justifyContent: 'center',
       // backgroundColor:colors.theme_color,
        width:width*0.8,
        height:50,
        borderRadius:15,
      },
      head:{
        color:colors.theme_black,
        fontSize:23,
        fontWeight:'500',
      },
})