import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold } from '../config/Constants';
import CodeInput from 'react-native-confirmation-code-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';


const {width, height,fontScale} = Dimensions.get('window');

const Otp = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [otp_value, setOtpValue] = useState(route.params.data);
  const [type, setType] = useState(route.params.type);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number);
  const [phone_numbers, setPhoneNumbers] = useState(route.params.phone_number);
  const [id, setid] = useState(route.params.id); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  console.log(otp_value)
  useEffect(() => {
    let number = `${phone_with_code_value } `
    console.log('number', number)
    setPhoneNumbers(number)
    if(global.mode == 'DEMO'){
      setTimeout(() => {
        //check_otp(otp_value);
      }, 1000)
    }
  },[]);

  const check_otp = async(code) => {
    if (code != otp_value) {
      alert('Please enter valid OTP')
    }else if(type == 1) {
      navigation.navigate("Register", { phone_with_code_value:phone_with_code_value, phone_number_value:phone_number_value, })
    }else if(type == 2) {
      navigation.navigate("CreatePassword", { id:id, from:"otp" })
    }
  }

  const Screen = ()=>{
    return(
      <SafeAreaView style={[styles.container,{backgroundColor:colors.theme_color}]}>
    <StatusBar />
    <TouchableOpacity onPress={handleBackButtonClick} style={{flexDirection:'row',margin:20,marginLeft:25}}>
              <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:35 }} />
              
              <Text style={styles.headed}> sign</Text>
              
      </TouchableOpacity>
    {/* <ScrollView style={{padding:20}} showsVerticalScrollIndicator={false}>
      <View>
        
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter OTP</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Enter the 4 digit code that was sent to your phone number</Text>
        <View style={{ margin:10 }}/>
        <View style={styles.code}>
          <CodeInput
            useRef="codeInputRef2"
            keyboardType="numeric"
            codeLength={4}
            className='border-circle'
            autoFocus={false}
            codeInputStyle={{ fontWeight: '800' }}
            activeColor={colors.theme_bg}
            inactiveColor={colors.theme_bg}
            onFulfill={(isValid) => check_otp(isValid)}
          />
        </View>
        <View style={{ margin:20 }}/>
      </View>
    </ScrollView> */}
    <View  style={styles.login }>
       <View>
          <Text style={styles.main}>Welcome Back</Text>
          <Text style={styles.sub}>Hello there, sign in to continue </Text>
        </View>
          <View style={{alignItems:'center'}}>

          
            <View style={[styles.carded,{marginVertical:20}]}>
              <View style={{marginLeft:20,marginTop:20}} >
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular ,marginLeft:10}}>Type a code </Text>
                
                <View style={styles.textFieldcontainer}>
                  <TextInput
                    style={styles.textField}
                    placeholder="code"
                    placeholderTextColor={colors.theme_bg_two}
                    
                  
                    //onChangeText={text => { text.length == 4 && setOtpValue(text)}}
                    value={`${otp_value}`}
                  />
                  <LinearGradient colors={[colors.theme_color,colors.theme_color_One, ]} style={styles.button} >
                
                  <TouchableOpacity onPress={()=>{}} style={{flexDirection:'row',}}>
                      <Text style={{color: "#fff"}}>Resend code </Text>
                  </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>


              <View style={styles.text}>
                <Text style={{fontSize:18,color:"#fff",}}>We texted you a code to verify your phone number <Text style={{color:colors.theme_color}}>{phone_numbers}</Text> </Text>
                <Text style={{fontSize:18,color:colors.light_grey,}}>This code will expired 10 minutes after this message. If you don't get a message.</Text>


              </View>
              <Text style={styles.link}>Change phone number </Text>
              <View style={{ margin:10 }}/>
            </View>
<View style={{marginTop:150}}/>
              <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={styles.buttons} >

                <TouchableOpacity  onPress={()=>check_otp(otp_value)}   style={styles.buttons}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}> Verify OTP</Text> 
                </TouchableOpacity>

              </LinearGradient>
              <View style={{ margin:10 }}/>
           </View>   
        
        
    </View>
    
  </SafeAreaView>

    );
  }
  const ScreenOne = ()=>{
    return(
      <SafeAreaView style={[styles.container,]}>
    <StatusBar />
    <TouchableOpacity onPress={handleBackButtonClick} style={{flexDirection:'row',margin:20,marginLeft:25}}>
              <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_black} style={{ fontSize:35 }} />
              
              <Text style={styles.head}> Forgot Password</Text>
      </TouchableOpacity>
    
    <View  style={styles.card}>
     
        <View style={{marginLeft:20,marginTop:20}} >
          <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular ,marginLeft:10}}>Type a code </Text>
          
          <View style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="    code"
              placeholderTextColor={colors.theme_bg_two}
              underlineColorAndroid="transparent"
            
              onChangeText={text => setOtpValue(text)}
              value={`${otp_value}`}
            />
            <LinearGradient colors={[colors.theme_color,colors.theme_color_One,  ]} style={styles.button} >
           
            <TouchableOpacity onPress={()=>{}} style={{flexDirection:'row',}}>
                <Text>Resend code </Text>
            </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>


        <View style={styles.text}>
          <Text style={{fontSize:18,color:colors.light_grey,}}>We texted you a code to verify your phone number <Text style={styles.link}> {phone_numbers}</Text> </Text>
          <Text style={{fontSize:18,color:colors.light_grey,}}>This code will expired 10 minutes after this message. If you don't get a message.</Text>


        </View>

       
        
        <View style={{marginLeft:20}}>
        <TouchableOpacity  onPress={handleBackButtonClick}   >
          <Text style={styles.link}>Change phone number </Text>
        </TouchableOpacity>
          <View style={{ margin:10 }}/>

          <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={styles.buttons} >

            <TouchableOpacity  onPress={()=>check_otp(otp_value)}   style={styles.buttons}>
           
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Change Password</Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={{ margin:10 }}/>
        </View>
        
      </View>
    
  </SafeAreaView>

    );
  }
return(
  <>
  {type ==1 ?
  <Screen/>:
  <ScreenOne/>}
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  link:{
    fontSize:16,
    fontWeight:'500',
    color:'blue',
    marginLeft:20

  },
  login:{
    position:'absolute',
    backgroundColor:'#FFFFFF',
    flex:1,
    width:width,
    height:height*0.9,
    marginTop:height*0.10,
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    
  },
  text:{
    
    
    justifyContent:'space-around',
    alignItems:'center',
    height:height*0.2,
    padding: 10,
    //width:'70%',
   // backgroundColor:'yellow',
    
    
  },
  card:{
    flexDirection: 'column',
    justifyContent: 'space-between',
    
    width:width*0.9,
    height:height*0.5,
    

    marginHorizontal:width*0.05,
    borderRadius:30,
    backgroundColor: '#ffffff', elevation: 10
    
    
  },
  carded:{
    flexDirection: 'column',
    justifyContent: 'space-between',
    
    width:width*0.9,
    height:height*0.4,
    

    marginHorizontal:width*0.05,
    borderRadius:30,
    backgroundColor: '#ffffff', elevation: 10
    
    
  },
  main:{
    color:colors.theme_color,
    marginLeft:20,
    marginTop:20,
    fontSize:32,
    fontWeight:'600',
   
    

  },

  head:{
    color:colors.theme_black,
    fontSize:23,
    fontWeight:'500',
  },
  sub:{
    fontSize:16,
    fontWeight:'500',
    color:'#343434',
    marginLeft:20
  },
  headed:{
    color:colors.theme_bg_three,
    fontSize:28,
    fontWeight:'500',
  },
  textFieldcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
   
    //width:width*0.9,
    marginTop: 5,
    marginBottom: 5,
   
  },
  
  textField: {
    
    width:width*0.5,
    
    height: 45,
    color:colors.theme_bg_two,
    backgroundColor:colors.theme_bg_three,
    borderColor:colors.light_grey,
    borderWidth:3,
    borderRadius:15,
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
});

export default Otp;