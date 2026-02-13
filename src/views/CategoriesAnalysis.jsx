//import liraries
import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image, Dimensions, Keyboard, FlatList, TouchableHighlight, BackHandler, Alert} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import { bold, regular, } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from '../components/StatusBar';
import { Picker } from '@react-native-picker/picker';
const {width, height,fontScale} = Dimensions.get('window');

// create a component
const CategoriesAnalysis = () => {

    const navigation = useNavigation();
    const route = useRoute()
    const [categories, setCategories] = useState(route.params.type);
    const [bgColor, setBgColor] = useState('green');
    const [open, setOpen] = useState('green');
    const [data,setData] = useState([ 
      { id:1,
      title:'Impact on overall health?',
      subtitle:' Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases,overactive thyroid gland, parathyroid disease, kidney or liver diseases.',
      openData :false,
    },
    { id:2,
      title:'How to improve health conditions?',
      subtitle:' For low calcium levels, a diet with calcium rich foods is recommended. See a doctor and discuss the need for calcium supplements.',
      openData :false,
    },
    { id:3,
      title:'Recommended Diet Plan',
      subtitle:' Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases,overactive thyroid gland, parathyroid disease, kidney or liver diseases.',
      openData :false,
    },
    { id:4,
      title:'Impact on overall health?',
      subtitle:' Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases,overactive thyroid gland, parathyroid disease, kidney or liver diseases.',
      openData :false,
    },
    { id:5,
      title:'Impact on overall health?',
      subtitle:' Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases,overactive thyroid gland, parathyroid disease, kidney or liver diseases.',
      openData :false,
    },
    
    ]);

    const  List = () => {
      return data.map((data,index) => {
        return (
          <View key={index} style={[styles.openView]}>
            <View style={styles.textFieldcontainer}>

                <View style={{height:'100%',justifyContent:'flex-end'}} >
                    <Text  style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold',marginVertical:10}} >{data.title}</Text>
                </View>
                <TouchableOpacity onPress={handleOpenClick.bind(this,data.id,data)}>
                  {!data.openData ?
                  <Icon type={Icons.Feather} name="chevron-up" color={colors.theme_black} style={{ fontSize:25 }} />:
                  <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_black} style={{ fontSize:25  }} />
                  }
                </TouchableOpacity>
                
                
            </View>

            {!data.openData ? <></> :
                <View style={{width:'95%',alignItems:'center',justifyContent:'center'}}>

                    <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'normal',marginVertical:10}} >{data.subtitle}</Text>
                </View>
            }
          </View>
        );
      });
    }

    const handleBackButtonClick= () => {
        console.log('categories :>> ', categories); 
     
        navigation.goBack()
      }
      const handleOpenClick= (id,action) => {
       //setOpen(!open)
       const updatedPatients = data.map((item) => {
        if (item.id === id) {
         
       
       if (item.openData ){
        return { ...item,openData:false};
       }else{
        return { ...item,openData:true};
       }
        } else {
         return { ...item}; 
        }
      });
      setData(updatedPatients)

      }

      useEffect(() => {
        const color = categories.condition == 'Normal'  ? 'green' : (categories.condition == 'Critical')? 'red' :colors.light_yellow
        setBgColor(color)
        
      }, []);
    return (
        <SafeAreaView style={styles.container}>
          <StatusBar />
            <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} >
              <View style={{ height:height*0.3,flexDirection:'column' ,justifyContent:'space-between'}}>
              
                  <TouchableOpacity onPress={handleBackButtonClick}>
                      <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:35 ,marginLeft:15 }}  />
                  </TouchableOpacity> 
                  
                  <View style={{ alignItems: 'center',height:height*0.25,flexDirection:'row',width:'100%' ,justifyContent:'center'}}>
                      <View style={{ height:'90%',flexDirection:'column',width:'90%' ,backgroundColor:'#E8F4ED',borderRadius:40,justifyContent:'space-evenly',padding:10}}>
                        <View  style={{width:'100%',height:'100%',justifyContent:'space-around', }} >
                          <View style={{flexDirection:'row',justifyContent:'space-evenly',height:'40%'}}>
                              <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'bold',width:'70%',height:'80%'}}> {categories.testName} </Text>
                              <Image resizeMode='contain' style={styles.tinyLogo} source={categories.url}/>
                          </View>
                          
                          <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',alignItems:'center'}}>
                            <View style={{flexDirection:'column',flexDirection:'column' ,paddingHorizontal :10}}>
                              <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold'}}>your result value </Text>
                              <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                                <Text style={{color:bgColor,fontSize:30,fontWeight:'bold'}}> 8.3 </Text>
                                <Text style={{color:'#10152C',fontSize:14,fontWeight:'bold',}}>{categories.messureUnit}  </Text>
                              </View>
                              <Text style={{color:'#10152C',fontSize:12,fontWeight:'500'}}>Normal Value : 8.8-10.6 mg/dl</Text>

                              
                            </View>

                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                              <Text style={{color:colors.theme_bg_three,fontSize:14,fontWeight:'bold',backgroundColor:categories.condition == 'Normal'  ? 'green' : (categories.condition == 'Critical')? 'red' :colors.light_yellow,padding: 10,borderRadius: 30,}}>{categories.condition} </Text>
                            </View>
                          </View>  

                          
                        </View>
                    </View>  

                  </View>


                      
              </View>
            </LinearGradient> 
            <ScrollView style={{ marginBottom:20}} showsVerticalScrollIndicator={false}>
              <View style={{width:'90%',justifyContent:'center',alignItems:'center',marginHorizontal:'5%'}}>

                <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'normal',marginVertical:10}} >Total serum calcium is a blood test done to measure the free and bound forms of calcium.</Text>
                <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'normal',marginVertical:10}} >It is often a part of screening test to detect abnormally high and low levels of calcium, as both can affect the health.</Text>
              

                <List/>
   
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
    tinyLogo:{
      width:'20%',
      height:'100%',
    },
    textField: {        
      height: 44,
      backgroundColor:colors.theme_bg_three,
      fontSize:14,
      color:colors.theme_fg_two,
      
    },
    textFieldcontainer: {
     
      height: 50,
      alignItems:'flex-end',
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
     
    },
    openView:{
      marginHorizontal: 10,
      width:'100%',
     // backgroundColor:'red'

    }
});

//make this component available to the app
export default CategoriesAnalysis;
