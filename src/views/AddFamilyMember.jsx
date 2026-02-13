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
import { member } from '../assets/json/analysis';
//import { Dropdown } from 'react-native-element-dropdown';

const {width, height,fontScale} = Dimensions.get('window');

const AddFamilyMember = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState('');
  const [genderId, setGenderId] = useState('');
  const [relationId, setRelationId] = useState(0);



  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relation, setRelation] = useState("");
  const [email, setEmail] = useState("");

  const [defaultDate, setDefaultDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [date, setDate] = useState('');
  const [age, setAge] = useState('');
  const [FamilyMembers, setFamilyMembers] = useState(member);
  
  const [patient, setPatient] = useState([
    {
      id: 1,
      title: 'Male',
      ischecked: false,
    },
    {
      id: 2,
      title: 'Female',
      ischecked: false,
    },
    {
      id: 3,
      title: 'Others',
      ischecked: false,
    },
  ]
);

  const [relationList, setRelationList] = useState([
    {
      id: 1,
      title: 'Bother',
    
    },
    {
      id: 2,
      title: 'Mother',
    
    },
    {
      id: 3,
      title: 'Father',
    
    },
    {
      id: 4,
      title: 'Daughter/son',
    
    },
  ]
  );

  useEffect(() => {
    GetFamilyMembers()
  }, []);

  const GetFamilyMembers = async() => {
    let members =  await AsyncStorage.getItem('FamilyMembers');
      
      let list =  JSON.parse(members)
      setFamilyMembers([...list])
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

    return `${age} Yrs`;
  };


  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const checkPatientsValidation= (id,name) => {
    let details = patient;
    const updatedPatients = patient.map((item) => {
      if (item.id === id) {
       
        setGender(item.title); 
        setGenderId(`${item.id}`); 
        return { ...item, ischecked: true }; 
      } else {
        return { ...item, ischecked: false }; 
      }
    });
  

      setPatient(updatedPatients)
     
  }

  const checkRelationValidation= (id) => {
    const updatedPatients = relationList.map((item) => {
      // Check if the current item's ID matches the one being checked
      if (item.id === id) {
       
        setRelation(item.title); // Set the gender state
    
        return { ...item}; // Mark this item as checked
      } else {
        return { ...item}; // Uncheck all other items
      }
    });
  


  }

  const AddDetails= async() => {

    if (gender == '' || firstName == '' ||  lastName == ''||relation == ''|| date == '' || age == ''){
      Alert.alert('please enter the details')
    }
    else if (age == 0){
      Alert.alert('Enter Correct date of birth')
    }
    else {
      let data = {gender:gender,genderId:genderId,fullName:`${firstName} ${lastName}`,DOB:date,relation:relation,age:age}
    
      if (FamilyMembers.length <= 6) {
            let allFamilyMembers  = [...FamilyMembers,data]
           
          // await AsyncStorage.setItem('FamilyMembers', JSON.stringify(allFamilyMembers));
          Alert.alert('List reached the limit')
          
         
      }
      else{
        Alert.alert('List reached the limit')
      }
     

    }
   
   
  }

  const GenderList = () => {
    return patient.map((Item) => {
      return (
        <LinearGradient key={Item.id} colors={[ colors.theme_color,colors.theme_color_One, ]} style={[styles.button,{opacity:Item.ischecked ? 0.5:1}]} >
          <TouchableOpacity  onPress={checkPatientsValidation.bind(this,Item.id, Item.title)}  style={styles.button} >
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:16,marginHorizontal:10}}>{Item.title} </Text>
           


          </TouchableOpacity>
          </LinearGradient>
      );
    });
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_color} style={{ fontSize:30 , }}  />
        </TouchableOpacity> 

        <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20, }}>Add Family Members</Text>
        <Text style={{ color: 'red', fontFamily: bold, fontSize: 20, }}>Help</Text>

      </View> 
      
      <ScrollView style={{  }} showsVerticalScrollIndicator={false}> 

        <View style = {styles.ViewSubTitle}>
                  
          <Text style={[styles.subtitle ]}> Important: You will not be able to edit
          these details once you have saved them!</Text>
        </View> 

        <View style={{width:width*0.9,marginHorizontal:width*0.05,}}>
          
            <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20, }}>Full Name :</Text>
            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.textField}
                placeholder="First name"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setFirstName(text)}
              />
              
            </View>

            <View style={styles.textFieldContainer}>
              
              <TextInput
                style={styles.textField}
                placeholder="Last name"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setLastName(text)}
              />
            </View>

            <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20,marginTop:10 }}>Date of Birth</Text>
            <View style={styles.DOBFieldContainer}>
                {show &&
                <DateTimePicker
                    mode='date' 
                  
                    timeZoneOffsetInMinutes = {330}
                    value={new Date()}
                    maximumDate={defaultDate}
                    onChange={(e,date)=>{
                      let datesformat = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
                    
                      setShow(false)
                      let ageData = calculateAge(datesformat)
                    
                      setDate(datesformat)
                      setAge(ageData)
                      
                    
                      }}
                />
                }

                <TextInput
                  style={styles.textField}
                  placeholder="Date of Birth"
                  placeholderTextColor={colors.grey}
                  underlineColorAndroid="transparent"
                  //onChangeText={text => setDefaultDate(text)}
                  value={date}
                  
                  onPressIn={()=>setShow(true)}

                /> 
            </View>

            <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20,marginTop:5 }}>Gender :</Text>

            <View style={{flexDirection:'row',width:width*0.9,justifyContent:'space-between',paddingVertical:15}}>
              <GenderList/>
          

            </View>


            <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20,marginTop:5 }}>Relation</Text>
          
            <View style={styles.textFieldContainer}>
              
              <Picker
                selectedValue={relationId}
                style={styles.textField}
                dropdownIconColor={colors.theme_color_One}
                mode='dropdown'
                placeholder=''
                onValueChange={(itemValue, itemIndex) => {
                 // console.log('itemValue :>> ', itemValue);
                  setRelationId(itemValue)
                  checkRelationValidation(itemValue)}}
              >
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular,backgroundColor:colors.theme_bg_three }} value={0} label="Who is this to you" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular,backgroundColor:colors.theme_bg_three }} value={1} label="Bother" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular,backgroundColor:colors.theme_bg_three }} value={2} label="Mother" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular,backgroundColor:colors.theme_bg_three }} value={3} label="Father" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular ,backgroundColor:colors.theme_bg_three}} value={4} label="Daughter/son" />
              </Picker>

            </View>
          
            <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20, }}>Email Address</Text>
            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.textField}
                placeholder="name@email.com"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setEmail(text)}
              />
              
            </View>


        </View> 

        <View style={[styles.buttons,{}]}>
              <TouchableOpacity  onPress={handleBackButtonClick}  style={styles.buttonsCancel} >
                <Text style={{ color:colors.theme_color, fontFamily:bold, fontSize:16,}}>Cancel </Text>
              


              </TouchableOpacity>
          <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={[styles.buttonIn,{}]} >
              <TouchableOpacity  onPress={AddDetails}  style={styles.buttons} >
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:16,}}>save</Text>
              


              </TouchableOpacity>
          </LinearGradient>
        </View>

      </ScrollView>
    </SafeAreaView> 
  )
}

export default AddFamilyMember

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:colors.theme_fg_three
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  header: {
    //flex: 1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    width:'100%',
    height:50,
    paddingHorizontal:10,
    backgroundColor:colors.theme_bg_three,
    elevation:10
    
  },
  textFieldContainer: {
    marginHorizontal: 10,
    height: 50,
    borderColor:colors.theme_color_One,
    borderBottomWidth:3,
    marginVertical:10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
   // backgroundColor:colors.theme_color,
   
    height:50,
    borderRadius:15,
    flexDirection:'row'
  },
  buttonsCancel:{
    alignItems: 'center',
    justifyContent: 'center',
    height:50,
    width:'40%',
    borderRadius:15,
    flexDirection:'row',
    borderWidth: 3,
    borderColor:colors.theme_color
   

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
  subtitle: {
    color: colors.theme_color,
    fontSize: 16,
    textAlign:'center',
  },
  ViewSubTitle:{
    width:width*0.8,
    marginHorizontal:width*0.1,
    marginVertical:10,
    alignItems:'center',
  },
  textField: {
    flex: 1,
   
    height: 44,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two,
    
  },
  DOBFieldContainer: {
    marginHorizontal: 10,
    height: 45,
    borderColor:colors.theme_color_One,
    borderBottomWidth:3,
    marginVertical:10,
    
  },
})