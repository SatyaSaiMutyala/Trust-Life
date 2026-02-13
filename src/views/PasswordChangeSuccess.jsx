import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import Icon, { Icons } from '../components/Icons'
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, customer_reset_password } from '../config/Constants';

import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

const {width, height,fontScale} = Dimensions.get('window');

const PasswordChangeSuccess = () => {
    
  const navigation = useNavigation();
    
      const navigate = async() => {
        
          navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "CheckPhone" }],
            })
          );
       
      }
    
    
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar />
    <TouchableOpacity onPress={navigate} style={{flexDirection:'row',margin:20,marginLeft:25}}>
              <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_black} style={{ fontSize:35 }} />
              <Text style={styles.head}>Change Password</Text>
      </TouchableOpacity>
        <View style={styles.data}>
        <View style={{alignItems:'center',marginVertical:40}}>
            <Image
            resizeMode = 'contain'
            source={{uri:'https://s3-alpha-sig.figma.com/img/3d30/849a/aee97ef8b171aff8d305563051da3794?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aJC1dnd99BtNdETN8mj8MSTH-qdZYtKkXqQqxz7QLjgB5TNGTHW56yl1xdIx-SH7xznhfspRJLSu9UA4uiWBjxfZvcUdLmWY~Ur3HJN9xDAw-ebU~~lANK1XC~v62fhT9Ek~9Tu8uFDV2sPI0sTU7OI2nSwkBewWrrIonZdjXCWpewlLzTO5vWwBWwBrrQV6kZuN9FWUs~d3B~AhK78eOsDI5ldxxB8OvnuDH8pFlOyxiahg-H~RdfQVrt5DM7VL5fEwkwR2YAT8PpSHDELwaQDReCT~u8NDjlOuTTAdhsAVfJINJdJNDZR6Ky8~CLErrqFfd1flhkTUO4M43KbMPg__'}}
              style={{height: 150,width:'60%',}} />
          </View>
            <Text style={styles.title}>Change password successfully!</Text>
            <Text style={styles.sub}>You have successfully change password.</Text>
            <Text style={styles.sub}> Please use the new password when Sign in.</Text>
        </View>   
      <TouchableOpacity onPress={navigate}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Change Password</Text>
        </TouchableOpacity>
      </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    data:{
        flexDirection:'column',
        justifyContent:'center',
        alignContent :'center',
       
        width:width
    },
    title:{
        color:colors.theme_color,
        fontSize:22,
        fontWeight:'500',
        marginVertical:20,
        textAlign: 'center',
    },
    head:{
        color:colors.theme_black,
        
        fontSize:28,
        fontWeight:'500',
      },
      sub:{
        color:colors.theme_black,
        fontSize:18,
        textAlign: 'center',
      },
      button: {
        margin:20,
        padding: 10,
        height:45,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:colors.theme_bg
      },
});
export default PasswordChangeSuccess