import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView, View, PermissionsAndroid, Image } from 'react-native';
import { api_url, get_prescription, bold, e_prescription, background_img, regular, img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { Badge } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updatePrescriptionDetails, updatePrescriptionId  } from '../actions/PrescriptionOrderActions';
import { connect } from 'react-redux'; 
import RNFetchBlob from 'rn-fetch-blob';
import { StatusBar } from '../components/StatusBar';

const ViewPrescription = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState(route.params.data); 
  const [data, setData] = useState([]); 
  const image_path = api_url+e_prescription+props.prescription_id
console.log(image_path)
  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      show_prescriptions();
    });
    return unsubscribe;
  },[]); 

  const make_order = () => {
    navigation.navigate('Pharmacies');
  }

  const show_prescriptions = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_prescription,
      data:{ booking_id:booking.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        props.updatePrescriptionDetails(response.data.result.items);
        props.updatePrescriptionId(response.data.result.prescription_id);
        setData(response.data.result.items)
      }else{
        alert("Please wait doctor will upload your prescription.")
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry, something went wrong');
    });
  }

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();

    // Image URL which we want to download
    let image_URL = image_path;    
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <StatusBar />
      <ScrollView style={{ padding:10 }}>
        <View>
          <View style={{ height: 170, width: '100%', borderRadius:20  }}>
            <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={ background_img } />
            <View style={{ position:'absolute', top:0, width:'100%', flexDirection:'row' }}>
              <View style={{ width:'60%', padding:20 }}>
                <Text style={{ fontSize:20, color:colors.theme_fg_three, fontFamily:bold, marginTop:5}}>Dr.{booking.doctor_name}</Text>
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>Specialist -General Sergen</Text>
                <View style={{ margin:15 }} />
                <View style={{ borderWidth:1, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, alignItems:'center', justifyContent:'center', borderRadius:10, width:'70%' }}>
                  <Text style={{ fontSize:14, color:colors.theme_fg, fontFamily:bold }}>Prescriped By</Text>
                </View> 
              </View> 
              <View style={{ width:'40%',  alignItems:'center', justifyContent:'center' }}> 
                <View style={{ height:100, width:100 }}>
                  <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{uri: img_url+booking.profile_image}} /> 
                </View> 
              </View> 
            </View>   
          </View> 
          <FlatList
            data={data}
            renderItem={({ item,index }) => (
              <View style={{flexDirection:'row', paddingTop:10}}>
                <View style={{alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                  <Text style={{fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.medicine_name}</Text>
                </View>
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'center', width:'49%'}}>
                  <View style={styles.prescription_style8}>
                    {item.morning == 1 ? 
                      <Badge status="success" value="M" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="M" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style8} />
                    {item.afternoon == 1 ? 
                      <Badge status="success" value="A" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="A" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style9} />
                    {item.evening == 1 ? 
                      <Badge status="success" value="E" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="E" badgeStyle={{width:35, height:20}}/>
                    }
                    <View style={styles.prescription_style10} />
                    {item.night == 1 ? 
                      <Badge status="success" value="N" badgeStyle={{width:35, height:20}}/>
                    :
                      <Badge status="error" value="N" badgeStyle={{width:35, height:20}}/>
                    }
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.question}
          />
        </View>
      </ScrollView>
      {data.length != 0 && props.prescription_id != 0 &&
        <View>
          <TouchableOpacity activeOpacity={1} onPress={make_order} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Make Prescription Order</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={checkPermission} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Download Prescription</Text>
          </TouchableOpacity>
        </View>
      }
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

function mapStateToProps(state){
	return{
		prescription_details : state.prescription_order.prescription_details,
    prescription_id : state.prescription_order.prescription_id, 
  
	};
  }
  
  const mapDispatchToProps = (dispatch) => ({
	updatePrescriptionDetails: (data) => dispatch(updatePrescriptionDetails(data)),
  updatePrescriptionId: (data) => dispatch(updatePrescriptionId(data)), 
  });
  
export default connect(mapStateToProps,mapDispatchToProps)(ViewPrescription);

const styles = StyleSheet.create({
prescription_style2: { justifyContent:'flex-end', alignItems:'flex-end'},
prescription_style3: {color:colors.theme_fg_two},
prescription_style6: { fontSize:25, color:colors.theme_fg_two,  fontFamily: bold},
prescription_style7: {color:colors.theme_fg_five, marginTop:5},
prescription_style8:{margin:2, flexDirection:'row'},
prescription_style9:{margin:2, flexDirection:'row'},
prescription_style10:{margin:2, flexDirection:'row'},
prescription_style11: { color:colors.theme_fg_two, fontSize:30},
container: {
  flex: 1,
  backgroundColor:colors.theme_fg_three,
},
button: {
  padding:10,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:colors.theme_bg,
  width:'94%',
  marginLeft:'3%',
  marginRight:'3%',
  marginBottom:'5%',
},
});
