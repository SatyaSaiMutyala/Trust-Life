//import liraries
import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image, Dimensions, Keyboard, FlatList, TouchableHighlight, BackHandler, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import { bold, regular, light,api_url,other_charges, offer_img, location, user_details_img, customer_lab_place_order, customer_get_profile } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Data, member } from '../assets/json/analysis';
import { Divider } from 'react-native-elements';

const {width, height,fontScale} = Dimensions.get('window');

const RingComponent = ({ size, innerRadius, outerRadius, color, strokeWidth, rotation }) => {
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: outerRadius * 2,
          height: outerRadius * 2,
          borderRadius: outerRadius,
          backgroundColor: 'transparent',
          borderWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: `${rotation}deg` }],
        }} />
        <View style={{
          width: '100%',
          height:  '100%',
          //borderRadius: innerRadius,
          backgroundColor: 'yellow',
          //borderWidth: strokeWidth,
          borderColor: color,
        }} />
        <Text tsyle={{
          width: '100%',
          height:  '100%',
          //borderRadius: innerRadius,
          color:'red',
          backgroundColor: 'yellow',
          //borderWidth: strokeWidth,
          borderColor: color,
        }}>hdfhjfg</Text>
      </View>
    );
  };
  
const ListFamilyMembers = () => {

    const navigation = useNavigation();
    const [FamilyMembers, setFamilyMembers] = useState([]);
    const [count, setCount] = useState(0);


    useEffect(() => {
      checkPatientsValidation()
    }, []);

    const handleBackButtonClick= () => {
        navigation.goBack()
    }

    const ButtonClickPluse = async(action) => {
      ;
      let actionData = {gender:action.gender,first_name:`${action.first_name} `,date_of_birth:action.date_of_birth,age:calculateAge(action.date_of_birth),id:action.id,selected:true}
     
    
      let PatientList =  await AsyncStorage.getItem('AddPatientList');
      if (PatientList.length >0){
     
          let jsonPatientList =  JSON.parse(PatientList)
          let AddPatientList = [...jsonPatientList,actionData]
          setCount(AddPatientList.length)
          await AsyncStorage.setItem('AddPatientList', JSON.stringify(AddPatientList));
      }
      else{
        let jsonPatientList = [actionData]
        setCount(jsonPatientList.length)

        await AsyncStorage.setItem('AddPatientList', JSON.stringify(jsonPatientList));
      }checkPatientsValidation()
     // handleBackButtonClick()
         
    
  }
  const ButtonClickMinus = async(action) => {
    let PatientList =  await AsyncStorage.getItem('AddPatientList');
    let list =  JSON.parse(PatientList)
    if (list.length>0){
      const updatedPatients = list.map((item) => {
        if (item.id === action.id) {
         
         
          return null; 
        } else {
          return { ...item }; 
        }
      }).filter(item => item !== null);
      setCount(updatedPatients.length)

      await AsyncStorage.setItem('AddPatientList', JSON.stringify(updatedPatients));
      const updatedMembers = FamilyMembers.map((item) => {
        if (item.id === action.id) {
         
         
          return {...item,selected:false} ; 
        } else {
          return { ...item }; 
        }
      });
  
      setFamilyMembers(updatedMembers)
     // handleBackButtonClick()
    }
  }

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth.split('/').reverse().join('-'));
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };

  const checkPatientsValidation= async() => {
    let members =  await AsyncStorage.getItem('AddPatientList');
    let list =  JSON.parse(members)
    if (list.length>0){
      const mapArrayTwo = new Map(list.map(item => [item.id, item]));

      const mergedArray = member.map(item => {
        if (mapArrayTwo.has(item.id)) {
          return { ...mapArrayTwo.get(item.id) }; 
        }
        return { ...item }; 
      });
      
     
      mapArrayTwo.forEach(item => {
        if (!mapArrayTwo.has(item.id)) {
          mergedArray.push(item);
        }
      });
      
      console.log(mergedArray);
    
   

     setFamilyMembers(mergedArray)
  }
  else{
    setFamilyMembers(member)
  }
  }
    
    const FamilyList = ()=> {
      return FamilyMembers.map((data,index) => {
        return (
          <View  key={index}  style={{ width: '100%',}}>
          <Divider style={{ backgroundColor: colors.theme_color, height: 1, width: '100%',}} />
          <View style={{flexDirection:'row',marginHorizontal:10,width:'90%',justifyContent:'space-between',marginVertical:10,paddingVertical:5}}>
            <Text style={{color:'#2A2A2A',fontSize:18,fontWeight:'bold',fontWeight:'bold',width:'60%'}}>{data.first_name}</Text>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>

            <Text style={{color:colors.theme_black,fontSize:15,fontWeight:'bold',fontWeight:'bold',marginRight:15}}>{data.gender},{calculateAge(data.date_of_birth)}</Text>
            {data.selected ? 
            <TouchableOpacity onPress={ButtonClickMinus.bind(this,data)}>
              <Icon type={Icons.AntDesign} name="minuscircleo" color={'#5F909D'} style={{ fontSize:30 , }}  />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={ButtonClickPluse.bind(this,data)}>
              <Icon type={Icons.AntDesign} name="pluscircleo" color={'#5F909D'} style={{ fontSize:30 , }}  />
            </TouchableOpacity>
              }
            </View>
        </View>
        <Divider style={{ backgroundColor: colors.theme_color, height: 1, width: '100%',marginBottom:20}} />
        </View>
        )
      });

    }

   
     
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={handleBackButtonClick}>
                <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_color} style={{ fontSize:30 , }}  />
                </TouchableOpacity> 

                <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20, }}> Family Members</Text>
                <Text style={{ color: 'red', fontFamily: bold, fontSize: 20, }}></Text>

            </View> 
            <Divider style={{ backgroundColor: colors.theme_color, height: 1, width: '100%', }} />
            <ScrollView>
            <View style={{flexDirection:'column',marginHorizontal:width*0.05,width:'90%',justifyContent:'space-evenly'}}>

              <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginBottom:20, marginTop: 10}}>
                <Text style={{color:'#2A2A2A',fontSize:18,fontWeight:'bold'}}>Your Cart (1 Items)</Text>
                <TouchableOpacity>
                  <Text style={{color:'#5F909D',fontSize:18,fontWeight:'bold'}}> + Add Tests</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection:'row',marginHorizontal:10,width:'100%',justifyContent:'space-between',borderColor:colors.theme_color_One,borderWidth: 2,marginBottom:10,borderRadius: 10,padding:10}}>
                <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold',fontWeight:'bold'}}>TRUSTlab Thyroid Profile</Text>
                <TouchableOpacity>
                  <Text style={{color:'#5F909D',fontSize:18,fontWeight:'bold'}}> View/Modify</Text>
                </TouchableOpacity>
              </View>
              <Divider style={{ backgroundColor: colors.theme_color, height: 1, width: width,marginLeft:-width*0.05 }} />
             


              <View style={{flexDirection:'row',marginHorizontal:10,width:'90%',justifyContent:'space-between',marginVertical:10}}>
                <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold',fontWeight:'bold'}}>Select Patient</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('AddFamilyMember')}}>
                  <Text style={{color:'#5F909D',fontSize:18,fontWeight:'bold'}}> + Add Members</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection:'row',width:'100%',alignItems:'center',marginVertical:10,flexShrink:10}}>
                <Text style={{color:colors.theme_black,fontSize:18,fontWeight:'normal'}}>You can add selected tests for upto 6 patients</Text>
              </View>

              <View style={{flexDirection:'column',marginHorizontal:10,width:'90%',alignItems:'center',marginVertical:10}}>
               
                   <FamilyList/> 
                   
             



              </View>

              

              <View style={{flexDirection:'row',marginHorizontal:10,width:'90%',justifyContent:'space-between',borderColor:colors.theme_color_One,borderWidth: 2,marginBottom:30,borderRadius: 10,padding:10}}>
                <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold',fontWeight:'bold'}}>You can add Tests/Packages for more than one Patient</Text>
                
              </View>
              <View style={[styles.buttons,{}]}>
                <View   style={styles.count} >
                <Text style={{ color:colors.theme_color, fontWeight:'bold', fontSize:16,}}>{count.toString().padStart(2, '0')} </Text>

                  <Text style={{ color:colors.theme_color, fontWeight:'bold', fontSize:16,}}>Patient </Text>
                </View>
                
                <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={[styles.buttonIn,{}]} >
                    <TouchableOpacity  onPress={handleBackButtonClick}  style={styles.buttons} >
                      <Text style={{ color:colors.theme_fg_three, fontWeight:'bold', fontSize:16,}}>Review Cart</Text>
                    </TouchableOpacity>
                </LinearGradient>
        </View>



            </View>
            </ScrollView>


        </SafeAreaView> 
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.theme_bg_three,
    },
    header: {
        //flex: 1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        width:'100%',
        height:50,
        paddingHorizontal:10,
        //backgroundColor:colors.theme_color_One,
       //elevation:10
        
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
       // backgroundColor:colors.theme_color,
       
        height:60,
        borderRadius:15,
        flexDirection:'row'
      },
      count:{
        alignItems: 'center',
        justifyContent: 'center',
        height:60,
        width:'40%',
        borderRadius:15,
        flexDirection:'column',
       
       
    
      },
      buttons: {
        alignItems: 'center',
        justifyContent: 'space-around',
       // backgroundColor:colors.theme_color,
       width:'100%',
        height:50,
        marginVertical:10,flexDirection:'row'
       
      },
      buttonIn: {
        alignItems: 'center',
        justifyContent: 'center',
      
       width:'40%',
        height:50,
        borderRadius:15,
       
      },
     
});

//make this component available to the app
export default ListFamilyMembers;
