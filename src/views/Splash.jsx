import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
} from "react-native";
import {
  bold,
  white_logo,
  api_url,
  customer_app_settings,
  app_name,
  GOOGLE_KEY,
  logo_with_name,
  heartGif,
  bike,
  fast,
} from "../config/Constants";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import * as colors from "../assets/css/Colors";
//import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";
import LinearGradient from 'react-native-linear-gradient';
import { connect } from "react-redux";
import { updatePharmId, addToCart, updateSubtotal, updateDeliveryCharge } from '../actions/PharmOrderActions';
import {
  updateCurrentAddress,
  updateCurrentLat,
  updateCurrentLng,
  currentTag,
  updateProfilePicture,
  updateAddress,
} from "../actions/CurrentAddressActions";
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { blackColor } from "../utils/globalColors";
import { s, vs, ms } from 'react-native-size-matters';

const Splash = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      app_settings();
    });
    return unsubscribe;
  }, []);


  const channel_create = () => {
    PushNotification.createChannel(
      {
        channelId: "medical_application", // (required)
        channelName: "Booking", // (required)
        channelDescription: "Medical Booking Solution", // (optional) default: undefined.
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'` + '1') // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token.token + '2');
        global.fcm_token = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification + '3');

        // process the notification
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action + '4');
        console.log("NOTIFICATION:", notification + '5');

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err + '6');
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const app_settings = async () => {
    console.log('im in app setting method');
    axios({
      method: "get",
      url: api_url + customer_app_settings,
    })
      .then(async (response) => {
        configure();
        channel_create();
        await props.updateDeliveryCharge(response.data.result.pharm_delivery_charge);
        await saveData(response.data.result);
      })
      .catch((error) => {
        console.log('--- Axios full error ---');
        console.log('Message :', error.message);
        console.log('Code    :', error.code);
        console.log('Config  :', error.config);
        console.log('Request :', error.request);
        console.log('Raw     :', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      });
  };

  const saveData = async (data) => {
    const id = await AsyncStorage.getItem("id");
    const customer_name = await AsyncStorage.getItem("customer_name");
    const phone_number = await AsyncStorage.getItem("phone_number");
    const phone_with_code = await AsyncStorage.getItem("phone_with_code");
    const email = await AsyncStorage.getItem("email");
    const profile_picture = await AsyncStorage.getItem("profile_picture");
    const cart_items = await AsyncStorage.getItem("cart_items");
    const sub_total = await AsyncStorage.getItem("sub_total");
    const pharm_id = await AsyncStorage.getItem("pharm_id");
    global.app_name = data.app_name;
    global.currency = data.default_currency;
    global.currency_short_code = data.currency_short_code;
    global.user_type = data.user_type;
    global.admin_contact_number = data.contact_number;
    global.razorpay_key = data.razorpay_key;
    global.mode = data.mode;
    global.admin_phone_number = data.admin_phone_number;
    global.paystack_key = data.paystack_key;
    global.flutterwave_public_key = data.flutterwave_public_key;
    await props.updateProfilePicture(profile_picture);
    if (sub_total) {
      await props.addToCart(JSON.parse(cart_items));
      await props.updateSubtotal(parseFloat(sub_total).toFixed(2));
      await props.updatePharmId(parseInt(pharm_id));
    }
    if (id !== null) {
      global.id = await id;
      global.customer_name = await customer_name;
      global.phone_number = await phone_number;
      global.phone_with_code = await phone_with_code;
      global.email = await email;
      check_location();
    } else {
      global.id = 0;
      check_location();
    }
  };

  const check_location = async () => {
    await getInitialLocation();
    /*if (Platform.OS === "android") {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(async (data) => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Access Required",
                message:
                  app_name +
                  " needs to Access your location for show nearest restaurant",
              }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              await getInitialLocation();
            } else {
              alert("Sorry unable to fetch your location");
              navigation.navigate("LocationEnable");
            }
          } catch (err) {
            navigation.navigate("LocationEnable");
          }
        })
        .catch((err) => {
          navigation.navigate("LocationEnable");
        });
    } else {
      await getInitialLocation();
    }*/
  };

  const getInitialLocation = async () => {
    await Geolocation.getCurrentPosition(
      async (position) => {
        onRegionChange(position.coords);
      },
      (error) => navigation.navigate("LocationEnable"),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const onRegionChange = async (value) => {
    console.log('yeah im coming to maps function-----------');
    //props.addCurrentAddress('Please wait...')
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      value.latitude +
      "," +
      value.longitude +
      "&key=" +
      GOOGLE_KEY
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.results[0].formatted_address != undefined) {
          let address = await responseJson.results[0].formatted_address;
          await props.updateCurrentAddress(address);
          await props.updateCurrentLat(value.latitude);
          await props.updateCurrentLng(value.longitude);
          await props.currentTag("Current Address");
          // ✅ Save to AsyncStorage, inside try/catch
          const locationData = {
            latitude: value.latitude,
            longitude: value.longitude,
            address,
          };

          console.log('saving locationData =>', locationData);
          await AsyncStorage.setItem('location', JSON.stringify(locationData));
          console.log('location saved, navigating…');
          navigate_app();
          console.log('yeah im navigating-----------');
        } else {
          alert("Sorry something went wrong");
        }
      });
  };

  const navigate_app = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  return (
    <LinearGradient
      colors={['#1A7E70',  '#FFFFFF', '#B2DFDB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <StatusBar2 />
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.welcomeText}>to</Text>
      </View>

      <View style={styles.logoSection}>
        <Image
          source={require('../assets/img/splashLogo.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.taglineSection}>
        <Text style={styles.tagline}>
          The Health Companion you can{'\n'}Trust for Life
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.poweredText}>Powered by</Text>
        <View style={styles.bottomLogos}>
          <Image
            source={require('../assets/img/app3dlogo.png')}
            style={styles.bottomLogo}
          />
          <Image
            source={require('../assets/img/trustmdlogo.png')}
            style={styles.bottomLogo}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(60),
  },
  topSection: {
    alignItems: 'center',
    // marginTop: vs(40),
  },
  welcomeText: {
    fontSize: ms(30),
    fontWeight: 'bold',
    color: blackColor,
    textAlign: 'center',
    lineHeight: ms(36),
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: ms(280),
    height: ms(150),
    resizeMode: "contain",
  },
  taglineSection: {
    alignItems: 'center',
    marginBottom:ms(20),
  },
  tagline: {
    fontSize: ms(18),
    textAlign: 'center',
    color: blackColor,
    lineHeight: ms(26),
    fontWeight:'600'
  },
  bottomSection: {
    alignItems: 'center',
    marginTop:ms(50)
  },
  poweredText: {
    fontSize: ms(14),
    color: blackColor,
    marginBottom: vs(12),
    fontWeight:'600'
  },
  bottomLogos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(20),
  },
  bottomLogo: {
    width: ms(100),
    height: ms(40),
    resizeMode: 'contain',
  },
});

function mapStateToProps(state) {
  return {
    current_address: state.current_location.current_address,
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_tag: state.current_location.current_tag,
    profile_picture: state.current_location.profile_picture,
    address: state.current_location.address,
    delivery_charge: state.order.delivery_charge,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateTaxList: (data) => dispatch(updateTaxList(data)),
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),
  updateDeliveryCharge: (data) => dispatch(updateDeliveryCharge(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
