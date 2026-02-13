import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, List, regular } from '../config/Constants';

const {width, height,fontScale} = Dimensions.get('window');

const Settings = () => {
    const navigation = useNavigation();

    const handleBackButtonClick= () => {
        navigation.goBack()
      }


  return (
    <SafeAreaView style={styles.container}>
    <StatusBar />
        <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} >
        <View style={{ alignItems: 'center',height:height*0.08,justifyContent:'flex-end', marginBottom: 10,flexDirection:'row' }}>
            <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButtonClick}>
                <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:35 ,marginLeft:15 }}  />
            </TouchableOpacity> 
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 24,marginLeft:-15 }}>Settings </Text>
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 24 }}></Text>

            </View>          
        </View>
        </LinearGradient> 
        <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.light_grey,padding: 15 ,}}
        onPress={()=>{
            console.log('global.id', global.id)
            navigation.navigate("CreatePassword", { id:global.id, from:"profile" })
        }}

        >
        <View style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Icon type={Icons.Ionicons} name={'key-outline'} color={'#b0dae0'} style={{ fontSize: 25,margin: 5,transform: [{rotateY:'180deg'}] }}   />
          
        </View>
        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={{ fontFamily: regular, fontSize: 16, color: colors.theme_fg_two }}>password Manager</Text>
        </View>
        
        <View style={{ width: '5%', justifyContent: 'center', alignItems: 'flex-end' }}>
        
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={'#b0dae0'}   style={{ fontSize: 25 }} />
          
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.theme_bg_three,
        justifyContent:'flex-start'
    },
    header: {
        //flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width:'100%',
        
      },
})