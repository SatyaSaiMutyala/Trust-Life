

// import React, { useState, useEffect, useRef  } from 'react';
// import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput, Keyboard, Alert } from 'react-native';
// import * as colors from '../assets/css/Colors';
// import { regular, bold, height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location, api_url, vendor_details, customer_add_address, customer_get_address } from '../config/Constants';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import Loader from '../components/Loader';
// import { StatusBar } from '../components/StatusBar';
// import LinearGradient from 'react-native-linear-gradient';
// import axiosInstance from './AxiosInstance';

// const AddAddress = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [loading, setLoading] = useState('false');
//   const [mapRegion, setmapRegion] = useState(null);
//   const mapRef = useRef(null);
//   const [address, setAddress] = useState('Please select your location...');
//   const [pin_code, setPinCode] = useState('');
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);
//   const [landmark, setLandmark] = useState(undefined);
//   const [validation, setValidation] = useState(false);
//   const [location_value, setLocationValue] = useState('');
//   const [address_status, setAddressStatus] = useState(0);

//   const handleBackButtonClick = () => {
//     navigation.goBack()
//   }

//   const ref_variable = async () => {
//     await setTimeout(() => {
//       mapRef.current.focus();
//     }, 200);
//   }

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', async () => {
//       await requestLocationPermission()
//       // await get_address();
//       await getCurrentAddress();
//     });
//     return unsubscribe;
//   }, []);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === "android") {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Access Required',
//             message: `${global.app_name} needs to access your location for tracking`,
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           await findType();
//         } else {
//           alert("Location permission denied: " + granted);
//         }
//       } catch (err) {
//         console.error("Error requesting location permission:", err);
//         await handleBackButtonClick();
//       }
//     } else {
//       await getInitialLocation();
//     }
//   };


//   const findType = async () => {
//     // get_address();
//     getCurrentAddress();
//   }

//   const getInitialLocation = async () => {
//     await Geolocation.getCurrentPosition(async (position) => {
//       let region = {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA
//       }
//       setmapRegion(region)

//     }, error => console.log(error),
//       { enableHighAccuracy: false, timeout: 10000 });
//   }


//   const onRegionChange = async (value) => {
//     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
//       .then((response) => response.json())
//       .then(async (responseJson) => {
//         if (responseJson.results[0].formatted_address != undefined) {
//           let address = responseJson.results[0].address_components;
//           let pin_code = address[address.length - 1].long_name;
//           setPinCode(pin_code);
//           setAddress(responseJson.results[0].formatted_address);
//           setLatitude(value.latitude);
//           setLongitude(value.longitude);
//           console.log('this is adress ---->', pin_code, value.latitu, responseJson.results[0].formatted_address)
//         } else {
//           setAddress('Sorry something went wrong1');
//         }
//       })
//   }


//   const address_validation = async () => {
//     if (landmark == undefined) {
//       alert('Please enter the landmark')
//       await setValidation(false);
//     } else {
//       await setValidation(true);
//       // add_address();
//       handeleAddAddress();
//     }
//   }

//   const handeleAddAddress = async () => {
//     const data = {
//       "customer_id": global.id,
//       "address": address,
//       "landmark": landmark,
//       "lat": latitude,
//       "lng": longitude,
//     }
//     try {
//       const response = await axiosInstance.post('customer/add_address', data)
//       console.log('Yeah address added man --->', response.data);
//       navigation.navigate('LabCart');
//     } catch (e) {
//       console.log('Error occured -->', e);
//     }
//   }

//   const getCurrentAddress = async () => {
//     setLoading(true);
//     const data = {
//       'customer_id': parseInt(global.id),
//     }
//     console.log('Id : -->', data)
//     try {
//       const response = await axiosInstance.post('customer/get_last_active_address', data)
//       console.log('GET Address --->', response.data?.result);
//       const address = response.data?.result;
//       if (address && address.lat && address.lng) {
//         setAddress(address.address);
//         setLandmark(address.landmark);
//         setLatitude(address.lat);
//         setLongitude(address.lng);
//         setmapRegion({
//           latitude: parseFloat(address.lat),
//           longitude: parseFloat(address.lng),
//           latitudeDelta: LATITUDE_DELTA,
//           longitudeDelta: LONGITUDE_DELTA
//         });
//       } else {
//         await getInitialLocation();
//       }
//     } catch (e) {
//       console.log('Error occured -->', e);
//     } finally{
//       setLoading(false)
//     }
//   }

//   const add_address = async () => {
//     console.log({ id: global.id, address: address.toString(), address: landmark, lat: latitude, lng: longitude })
//     Keyboard.dismiss();
//     setLoading(true);
//     await axios({
//       method: 'post',
//       url: api_url + customer_add_address,
//       data: { id: global.id, address: address.toString(), address: landmark, lat: latitude, lng: longitude }
//     })
//       .then(async response => {
//         setLoading(false);
//         if (response.data.status == 1) {
//           handleBackButtonClick();
//         }
//       })
//       .catch(error => {
//         setLoading(false);
//         alert('Sorry something went wrong2')
//         console.log('this is error --->', error)
//       });
//   }

//   const get_address = async () => {
//     Keyboard.dismiss();
//     setLoading(true);
//     await axios({
//       method: 'post',
//       url: api_url + customer_get_address,
//       data: { id: global.id }
//     })
//       .then(async response => {
//         setLoading(false);
//         console.log('this is status code ---->', response.data.status)
//         if (response.data.status == 1) {
//           let result = response.data.result;
//           console.log('this is data --->', result.lat, result.lng)
//           setAddressStatus(result.address_update_status);
//           if (result.address_update_status == 1) {
//             setLandmark(result.address);
//             setAddress(result.address);
//             setLatitude(result.lat);
//             setLongitude(result.lng);
//             setLocation(response.data.result);
//           } else {
//             getInitialLocation();
//           }
//         }
//       })
//       .catch(error => {
//         setLoading(false);
//         Alert.alert('Sorry something went wrong3')
//         console.log('this is the error ---->', error)
//       });
//   }

//   const setLocation = (data) => {
//     let region = {
//       latitude: parseFloat(data.lat),
//       longitude: parseFloat(data.lng),
//       latitudeDelta: LATITUDE_DELTA,
//       longitudeDelta: LONGITUDE_DELTA
//     }
//     setmapRegion(region);
//   }


//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//       <Loader visible={loading} />
//       <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false} >
//         <Loader visible={loading} />
//         <View style={{ alignItems: 'center', justifyContent: 'center' }} >
//           <MapView
//             provider={PROVIDER_GOOGLE}
//             ref={mapRef}
//             style={{ width: '100%', height: height_50 }}
//             initialRegion={mapRegion}
//             onRegionChangeComplete={(region) => onRegionChange(region)}
//             showsUserLocation={true}
//             showsMyLocationButton={true}
//           />
//           <View style={{ position: 'absolute', }}>
//             <View style={{ height: 30, width: 25, top: -15 }} >
//               <Image
//                 style={{ flex: 1, width: undefined, height: undefined }}
//                 source={location}
//               />
//             </View>
//           </View>
//           <View style={{ position: 'absolute', }}>
//             <View style={{ height: 30, width: 25, top: -15 }} >
//               <Image
//                 style={{ flex: 1, width: undefined, height: undefined }}
//                 source={location}
//               />
//             </View>
//           </View>
//         </View>
//         <View style={{ marginTop: 20 }} />
//         <View style={{ flexDirection: 'row' }} >
//           <Text style={styles.landmark_label} >LandMark</Text>
//         </View>
//         <View
//           style={styles.textFieldcontainer}>
//           <TextInput
//             style={styles.textField}
//             placeholder="Enter your landmark"
//             placeholderTextColor={colors.theme_fg_two}
//             underlineColorAndroid="grey"
//             onChangeText={text => setLandmark(text)}
//             value={landmark}
//           />
//         </View>
//         <View style={{ flexDirection: 'row' }} >
//           <Text style={{ fontSize: 15, fontFamily: bold, color: colors.theme_fg_two }} >Address</Text>
//         </View>
//         <View style={{ flexDirection: 'row' }} >
//           <Text style={{ fontSize: 15, marginTop: 5, fontFamily: regular, color: colors.theme_fg_two }} >
//             {address}
//           </Text>
//         </View>
//         <View style={{ margin: 30, }} />
//         <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={{ borderRadius: 10, marginBottom: 30 }}>
//           <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//             <TouchableOpacity onPress={address_validation.bind(this)} style={styles.button}>
//               <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Add Address</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.theme_bg_three,
//     flex: 1
//   },
//   button: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '94%',
//     marginLeft: '3%',
//     marginRight: '3%',
//     height: 45,
//   },
//   textFieldcontainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginBottom: 5,
//     height: 45
//   },
//   textField: {
//     flex: 1,
//     padding: 1,
//     borderRadius: 10,
//     height: 45,
//     backgroundColor: colors.theme_bg_three,
//     fontSize: 14,
//     color: colors.grey,
//     fontFamily: regular
//   },
//   landmark_label: {
//     fontSize: 15,
//     fontFamily: bold,
//     color: colors.theme_fg_two
//   },
// });

// export default AddAddress;




import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput, Keyboard, Alert, Dimensions } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location, api_url, customer_add_address } from '../config/Constants';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import Loader from '../components/Loader';
import { StatusBar } from '../components/StatusBar';
import { useDispatch } from 'react-redux';
import { AddAddressAction, GetLastActiveAddressAction } from '../redux/actions/AllAddressActions';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../components/Icons';
import { blackColor, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// New constants for the new UI
// const ADDRESS_LABELS = ['Home', 'Work', 'Other'];

const ADDRESS_LABELS = [
  { label: 'Home', icon: 'home-outline' },
  { label: 'Work', icon: 'briefcase-outline' },
  { label: 'Other', icon: 'location-outline' },
];


const AddAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [mapRegion, setmapRegion] = useState(null);
  const mapRef = useRef(null);
  const [address, setAddress] = useState('Please select your location...');
  const [pin_code, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isHouseNoEdited, setIsHouseNoEdited] = useState(false);
  const [isBuildingBlockEdited, setIsBuildingBlockEdited] = useState(false);
  const [isLandmarkEdited, setIsLandmarkEdited] = useState(false);

  // New state variables for detailed address form fields
  const [addressLabel, setAddressLabel] = useState(ADDRESS_LABELS[0].label);
  const [houseNo, setHouseNo] = useState('');
  const [buildingBlock, setBuildingBlock] = useState('');
  const [landmark, setLandmark] = useState('');
  const insets = useSafeAreaInsets();
  const hasBottomOverlap = insets.bottom > 20;

  // Flag to prevent map callback from triggering during programmatic updates
  const [isProgrammaticUpdate, setIsProgrammaticUpdate] = useState(false);


  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  const ref_variable = async () => {
    await setTimeout(() => {
      mapRef.current.focus();
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Check if returning from LocationSearch with selected location
      if (route.params?.selectedLocation) {
        // Just request permission without loading address
        await requestLocationPermission(false);
        // Handle the selected location from search
        await handleLocationFromSearch(route.params.selectedLocation);
        // Clear the params to prevent re-triggering
        navigation.setParams({ selectedLocation: undefined });
      } else {
        // Request permission and load current address
        await requestLocationPermission(true);
      }
    });
    return unsubscribe;
  }, [navigation, route.params]);

  const requestLocationPermission = async (shouldLoadAddress = true) => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: `${global.app_name} needs to access your location for tracking`,
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (shouldLoadAddress) {
            await getCurrentAddress();
          }
        } else {
          Alert.alert("Permission Denied", "Location permission is required to select an address.");
          await handleBackButtonClick();
        }
      } catch (err) {
        console.error("Error requesting location permission:", err);
        await handleBackButtonClick();
      }
    } else {
      if (shouldLoadAddress) {
        await getInitialLocation();
      }
    }
  };

  const getInitialLocation = async () => {
    await Geolocation.getCurrentPosition(async (position) => {
      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setmapRegion(region);
      onRegionChange(region); // Call to get address details immediately
    }, error => console.log(error),
      { enableHighAccuracy: false, timeout: 10000 });
  }

  // const onRegionChange = async (value) => {
  //   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${value.latitude},${value.longitude}&key=${GOOGLE_KEY}`)
  //     .then((response) => response.json())
  //     .then(async (responseJson) => {
  //       if (responseJson.results.length > 0 && responseJson.results[0].formatted_address) {
  //         const result = responseJson.results[0];
  //         setAddress(result.formatted_address);
  //         setLatitude(value.latitude);
  //         setLongitude(value.longitude);
  //         // setHouseNo(value.)

  //         // Extract Pin Code, City, and State from address components
  //         let tempPinCode = '';
  //         let tempCity = '';
  //         let tempState = '';
  //         let tempHouseNo = '';
  //         let tempBuildingBlock = '';
  //         let tempLandmark = '';

  //         // Loop through address components to extract data
  //         for (const component of result.address_components) {
  //           const componentName = component.long_name;
  //           const componentTypes = component.types;

  //           // Extract Pin Code
  //           if (componentTypes.includes('postal_code')) {
  //             tempPinCode = componentName;
  //           }
  //           // Extract City
  //           else if (componentTypes.includes('locality') || componentTypes.includes('administrative_area_level_2')) {
  //             if (!tempCity) tempCity = componentName;
  //           }
  //           // Extract State
  //           else if (componentTypes.includes('administrative_area_level_1')) {
  //             tempState = componentName;
  //           }
  //           // Extract Street Number/House No (usually "premise" or "street_number")
  //           else if (componentTypes.includes('street_number') || componentTypes.includes('premise')) {
  //             tempHouseNo = componentName;
  //           }
  //           // Extract Route/Street Name (could be used for building/block)
  //           else if (componentTypes.includes('route')) {
  //             tempBuildingBlock = componentName;
  //           }
  //           // Extract Neighborhood/Locality (could be used as landmark)
  //           else if (componentTypes.includes('neighborhood') || componentTypes.includes('sublocality_level_1')) {
  //             if (!tempLandmark) tempLandmark = componentName;
  //           }
  //         }

  //         // If we don't have house number from street_number/premise,
  //         // try to extract from formatted address
  //         if (!tempHouseNo && result.formatted_address) {
  //           // Try to get the first part of the address (before first comma)
  //           const firstPart = result.formatted_address.split(',')[0].trim();
  //           if (firstPart && !firstPart.includes('Unnamed')) {
  //             tempHouseNo = firstPart;
  //           }
  //         }

  //         // If we don't have building/block from route, try sublocality
  //         if (!tempBuildingBlock) {
  //           for (const component of result.address_components) {
  //             if (component.types.includes('sublocality_level_2') ||
  //               component.types.includes('sublocality_level_3')) {
  //               tempBuildingBlock = component.long_name;
  //               break;
  //             }
  //           }
  //         }

  //         // If we don't have landmark from neighborhood, use sublocality
  //         if (!tempLandmark) {
  //           for (const component of result.address_components) {
  //             if (component.types.includes('sublocality_level_1')) {
  //               tempLandmark = component.long_name;
  //               break;
  //             }
  //           }
  //         }

  //         if (!pin_code) setPinCode(tempPinCode);
  //         if (!city) setCity(tempCity);
  //         if (!state) setState(tempState);

  //         // Auto-fill the form fields if they're empty
  //         if (!houseNo && tempHouseNo) setHouseNo(tempHouseNo);
  //         if (!buildingBlock && tempBuildingBlock) setBuildingBlock(tempBuildingBlock);
  //         if (!landmark && tempLandmark) setLandmark(tempLandmark);
  //       } else {
  //         setAddress('Sorry, failed to find address for this location.');
  //       }
  //     })
  //     .catch(error => {
  //       console.error("Geocoding Error:", error);
  //       setAddress('Geocoding failed. Try adjusting the map marker.');
  //     });
  // }


  const onRegionChange = async (value) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${value.latitude},${value.longitude}&key=${GOOGLE_KEY}`)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.results.length > 0 && responseJson.results[0].formatted_address) {
          const result = responseJson.results[0];
          setAddress(result.formatted_address);
          setLatitude(value.latitude);
          setLongitude(value.longitude);

          // Extract Pin Code, City, and State from address components
          let tempPinCode = '';
          let tempCity = '';
          let tempState = '';
          let tempHouseNo = '';
          let tempBuildingBlock = '';
          let tempLandmark = '';

          // Loop through address components to extract data
          for (const component of result.address_components) {
            const componentName = component.long_name;
            const componentTypes = component.types;

            // Extract Pin Code
            if (componentTypes.includes('postal_code')) {
              tempPinCode = componentName;
            }
            // Extract City
            else if (componentTypes.includes('locality') || componentTypes.includes('administrative_area_level_2')) {
              if (!tempCity) tempCity = componentName;
            }
            // Extract State
            else if (componentTypes.includes('administrative_area_level_1')) {
              tempState = componentName;
            }
            // Extract Street Number/House No (usually "premise" or "street_number")
            else if (componentTypes.includes('street_number') || componentTypes.includes('premise')) {
              tempHouseNo = componentName;
            }
            // Extract Route/Street Name (could be used for building/block)
            else if (componentTypes.includes('route')) {
              tempBuildingBlock = componentName;
            }
            // Extract Neighborhood/Locality (could be used as landmark)
            else if (componentTypes.includes('neighborhood') || componentTypes.includes('sublocality_level_1')) {
              if (!tempLandmark) tempLandmark = componentName;
            }
          }

          // If we don't have house number from street_number/premise,
          // try to extract from formatted address
          if (!tempHouseNo && result.formatted_address) {
            // Try to get the first part of the address (before first comma)
            const firstPart = result.formatted_address.split(',')[0].trim();
            if (firstPart && !firstPart.includes('Unnamed')) {
              tempHouseNo = firstPart;
            }
          }

          // If we don't have building/block from route, try sublocality
          if (!tempBuildingBlock) {
            for (const component of result.address_components) {
              if (component.types.includes('sublocality_level_2') ||
                component.types.includes('sublocality_level_3')) {
                tempBuildingBlock = component.long_name;
                break;
              }
            }
          }

          // If we don't have landmark from neighborhood, use sublocality
          if (!tempLandmark) {
            for (const component of result.address_components) {
              if (component.types.includes('sublocality_level_1')) {
                tempLandmark = component.long_name;
                break;
              }
            }
          }

          // Always update pin_code, city, and state when location changes
          setPinCode(tempPinCode);
          setCity(tempCity);
          setState(tempState);

          // For houseNo, buildingBlock, and landmark:
          // Only auto-update if the user hasn't manually edited them
          // We'll track this with additional state variables
          if (!isHouseNoEdited) setHouseNo(tempHouseNo);
          if (!isBuildingBlockEdited) setBuildingBlock(tempBuildingBlock);
          if (!isLandmarkEdited) setLandmark(tempLandmark);

        } else {
          setAddress('Sorry, failed to find address for this location.');
        }
      })
      .catch(error => {
        console.error("Geocoding Error:", error);
        setAddress('Geocoding failed. Try adjusting the map marker.');
      });
  }

  const validation = () => {
    if (!houseNo.trim()) {
      Alert.alert('Validation', 'Please enter House No & Floor.');
      return false;
    }
    if (!buildingBlock.trim()) {
      Alert.alert('Validation', 'Please enter Building & Block No.');
      return false;
    }
    if (!landmark.trim()) {
      Alert.alert('Validation', 'Please enter Land Mark & Area Name.');
      return false;
    }
    if (!pin_code.trim() || !city.trim() || !state.trim()) {
      Alert.alert('Validation', 'Pincode, City, or State is missing. Please confirm your location on the map.');
      return false;
    }
    return true;
  }

  const handleConfirmAddress = async () => {
    console.log('yes im in --------');
    if (!validation()) return;

    setLoading(true);
    const data = {
      "customer_id": global.id,
      "address": `${houseNo}, ${buildingBlock}, ${address}`,
      "landmark": landmark,
      "lat": latitude,
      "lng": longitude,
      "house_no": houseNo,
      "building": buildingBlock,
      "address_label": addressLabel,
      "pincode": pin_code,
      "city": city,
      "state": state,
    }

    console.log('this is address data -------->', data);

    try {
      const response = await dispatch(AddAddressAction(data));
      console.log('Address added successfully:', response);
      navigation.goBack();
    } catch (e) {
      console.log('Error occured during add address:', e);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getCurrentAddress = async () => {
    setLoading(true);
    try {
      const response = await dispatch(GetLastActiveAddressAction(global.id));
      const lastAddress = response?.result;

      if (lastAddress && lastAddress.lat && lastAddress.lng) {
        // Populate fields from last address if available
        setLatitude(lastAddress.lat);
        setLongitude(lastAddress.lng);
        setAddress(lastAddress.address || 'Address not available');
        setLandmark(lastAddress.landmark || '');

        setIsHouseNoEdited(false);
        setIsBuildingBlockEdited(false);
        setIsLandmarkEdited(false);

        // Populate all fields from last address
        // setHouseNo(lastAddress.house_no || '');
        // setBuildingBlock(lastAddress.building_block || '');
        // setPinCode(lastAddress.pincode || '');
        // setCity(lastAddress.city || '');
        // setState(lastAddress.state || '');
        // setAddressLabel(lastAddress.address_label || ADDRESS_LABELS[0]);

        setmapRegion({
          latitude: parseFloat(lastAddress.lat),
          longitude: parseFloat(lastAddress.lng),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        });
      } else {
        await getInitialLocation();
      }
    } catch (e) {
      console.log('Error occured fetching last address:', e);
      await getInitialLocation(); // Fallback to current location if API fails
    } finally {
      setLoading(false)
    }
  }

  // Function to handle manual update of map-derived fields
  const updateLocationFields = (field, value) => {
    switch (field) {
      case 'pin_code':
        setPinCode(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'state':
        setState(value);
        break;
      default:
        break;
    }
  }

  // Handle location selected from LocationSearch screen
  const handleLocationFromSearch = async (locationData) => {
    console.log('Received location from search:', locationData);

    // Use Google Places Details API to get lat/lng from place_id
    if (locationData.id) {
      try {
        setLoading(true);
        setIsProgrammaticUpdate(true); // Prevent map callback from triggering

        // Clear old data immediately to prevent showing stale information
        setAddress(locationData.address);
        setHouseNo('');
        setBuildingBlock('');
        setLandmark('');
        setPinCode('');
        setCity('');
        setState('');

        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${locationData.id}&key=${GOOGLE_KEY}`;
        const response = await fetch(detailsUrl);
        const json = await response.json();

        if (json.status === 'OK' && json.result) {
          const place = json.result;
          const lat = place.geometry.location.lat;
          const lng = place.geometry.location.lng;

          // Update map region
          const newRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };

          // Update all location states immediately
          setLatitude(lat);
          setLongitude(lng);
          setmapRegion(newRegion);
          setAddress(locationData.address || place.formatted_address);

          // Reset the manual edit flags so geocoding can populate fields
          setIsHouseNoEdited(false);
          setIsBuildingBlockEdited(false);
          setIsLandmarkEdited(false);

          // Trigger geocoding to populate other fields
          await onRegionChange(newRegion);

          // Re-enable map callback after a delay to allow map animation to complete
          setTimeout(() => {
            setIsProgrammaticUpdate(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        Alert.alert('Error', 'Failed to get location details');
        setIsProgrammaticUpdate(false); // Re-enable on error
      } finally {
        setLoading(false);
      }
    }
  }

  // Function to render the map address block
  const renderMapAddressBlock = () => (
    <View style={styles.addressDisplayContainer}>
      <View style={{ flex: 1, marginRight: ms(10) }}>
        {/* Full Address derived from map */}
        <Text style={styles.mainAddressText} numberOfLines={2}>
          {address}
        </Text>
        {/* Detailed parts, mostly placeholder or map-derived */}
        <Text style={styles.subAddressText}>
          {city ? `${pin_code}, ${city}, ${state}` : 'Pin, City, State'}
        </Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Loader visible={loading} />
      <View style={styles.secondHeader}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBackButtonClick}
        >
          <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBarContainer}
        onPress={() => navigation.navigate('LocationSearch', { returnTo: 'AddressList' })}
        activeOpacity={0.7}
      >
        <Icon type={Icons.Ionicons} name="search-outline" size={ms(18)} color="#8E8E93" />
        <Text style={styles.searchPlaceholder}>Search for your location...</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Map Section */}
        <View style={styles.mapWrapper}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.mapStyle}
            initialRegion={mapRegion}
            region={mapRegion}
            onRegionChangeComplete={(region) => {
              // Only trigger geocoding if this is a manual map drag, not a programmatic update
              if (!isProgrammaticUpdate) {
                setmapRegion(region);
                onRegionChange(region);
              }
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
          />
          {/* Centered Map Marker */}
          <View style={styles.markerFixed}>
            <Image
              style={styles.markerIcon}
              source={location}
            />
          </View>
        </View>

        {/* Address Display Block */}
        {renderMapAddressBlock()}

        <View style={styles.formContainer}>

          {/* Address Label Selection */}
          <Text style={styles.sectionHeader}>Add Address Label</Text>
          <View style={styles.labelContainer}>
            {/* {ADDRESS_LABELS.map((label, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.labelButton,
                  addressLabel === label && styles.labelButtonActive,
                ]}
                onPress={() => setAddressLabel(label)}
              >
                <Text style={[
                  styles.labelText,
                  addressLabel === label && styles.labelTextActive,
                ]}>{label}</Text>
              </TouchableOpacity>
            ))} */}
            {ADDRESS_LABELS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.labelButton,
                  addressLabel === item.label && styles.labelButtonActive,
                ]}
                onPress={() => setAddressLabel(item.label)}
              >
                <Icon
                  type={Icons.Ionicons}
                  name={item.icon}
                  size={18}
                  color={addressLabel === item.label ? 'white' : 'gray'}
                  style={{ marginRight: 6 }}
                />

                <Text
                  style={[
                    styles.labelText,
                    addressLabel === item.label && styles.labelTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={styles.label}>House No & Floor <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 101, 4thfloor"
                placeholderTextColor='#ccc'
                value={houseNo}
                onChangeText={(value) => { setHouseNo(value), setIsHouseNoEdited(true); }}
                keyboardType="default"
              />
            </View>
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text style={styles.label}>Building & Block No <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Deepika telecom, B5"
                placeholderTextColor='#ccc'
                value={buildingBlock}
                onChangeText={(value) => { setBuildingBlock(value), setIsBuildingBlockEdited(true); }}
                keyboardType="default"
              />
            </View>
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text style={styles.label}>Land Mark & Area Name <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Madhapur Police station"
                placeholderTextColor='#ccc'
                value={landmark}
                onChangeText={(value) => { setLandmark(value), setIsLandmarkEdited(true); }}
                keyboardType="default"
              />
            </View>
          </View>

          {/* Pincode and City (Map-derived but user can edit) */}
          <View style={styles.row}>
            {/* Pincode */}
            <View style={{ flex: 1, marginRight: ms(10) }}>
              <Text style={styles.label}>Pincode</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="500012"
                  placeholderTextColor={blackColor}
                  value={pin_code}
                  onChangeText={(value) => updateLocationFields('pin_code', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {/* City */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Hyderabad"
                  placeholderTextColor={blackColor}
                  value={city}
                  onChangeText={(value) => updateLocationFields('city', value)}
                />
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 8 }}>
            <Text style={styles.label}>State <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="TELANGANA"
                placeholderTextColor={blackColor}
                value={state}
                onChangeText={(value) => updateLocationFields('state', value)}
                keyboardType="default"
              />
            </View>
          </View>

        </View>
        <View style={{ marginHorizontal: vs(10), marginBottom: hasBottomOverlap ? insets.bottom + ms(10) : ms(25), }}>
          <PrimaryButton onPress={handleConfirmAddress} title='Confirm address' />
        </View>

        <View style={{ marginBottom: vs(20) }} />
      </ScrollView>
      {/* Confirm Button (Fixed at Bottom) */}
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
    flex: 1
  },
  secondHeader :{
    flex: 1,
    paddingTop: ms(50),

  },
  headerButton: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:ms(15)
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  headerTitle: {
    fontFamily: bold,
    fontSize: ms(18),
    color: blackColor,
    marginLeft: ms(10),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: ms(10),
    paddingHorizontal: ms(12),
    paddingVertical: vs(10),
    marginHorizontal: ms(15),
    marginBottom: vs(10),
  },
  searchPlaceholder: {
    fontSize: ms(14),
    color: '#8E8E93',
    marginLeft: ms(8),
    fontFamily: regular,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: ms(15),
  },
  // --- Map Styles ---
  mapWrapper: {
    width: '100%',
    height: vs(180), // Responsive map height
    marginVertical: vs(15),
    borderRadius: ms(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: ms(-12.5), // half of marker width (ms(25))
    marginTop: ms(-25), // half of marker height (ms(50))
  },
  markerIcon: {
    height: ms(20), // Responsive marker height
    width: ms(20), // Responsive marker width
    resizeMode: 'contain',
    tintColor: 'red'
  },
  // --- Address Display Block Styles ---
  addressDisplayContainer: {
    backgroundColor: whiteColor,
    borderRadius: ms(10),
    padding: ms(15),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 3,
    marginHorizontal: ms(5)
  },
  mainAddressText: {
    fontSize: ms(13),
    fontFamily: regular,
    color: blackColor,
    marginBottom: vs(2)
  },
  subAddressText: {
    fontSize: ms(11),
    fontFamily: regular,
    color: blackColor
  },
  editButton: {
    padding: ms(8),
  },
  // --- Form Styles ---
  formContainer: {
    paddingBottom: vs(20)
  },
  sectionHeader: {
    fontSize: ms(14),
    fontFamily: bold,
    color: blackColor,
    marginBottom: vs(10),
    marginTop: vs(5)
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: vs(20),
    alignItems: 'center',
  },
  labelButton: {
    paddingHorizontal: ms(15),
    paddingVertical: vs(8),
    borderRadius: ms(8),
    marginRight: ms(10),
    borderWidth: ms(1),
    borderColor: grayColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelButtonActive: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  labelText: {
    fontSize: ms(12),
    color: blackColor,
    fontFamily: regular
  },
  labelTextActive: {
    color: whiteColor,
    fontFamily: bold
  },
  label: {
    fontSize: ms(12),
    fontFamily: bold,
    color: blackColor,
    marginBottom: vs(5)
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: ms(8),
    paddingHorizontal: ms(10),
    height: vs(40), // Responsive input height
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: ms(13),
    color: blackColor,
    padding: 0, // Reset default padding
    margin: 0,
    height: '100%',
  },
  disabledInput: {
    color: colors.text_gray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: vs(15),
    marginVertical: 8
  },
  infoText: {
    fontSize: ms(10),
    color: colors.text_gray,
    marginTop: vs(10),
  },
  // --- Bottom Button Styles ---
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: ms(20),
    paddingVertical: vs(15),
    backgroundColor: colors.white,
    borderTopWidth: ms(1),
    borderTopColor: colors.light_gray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: ms(-2) },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: colors.theme_fg_two,
    borderRadius: ms(10),
    height: vs(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontFamily: bold,
    fontSize: ms(14)
  }
});

export default AddAddress;
