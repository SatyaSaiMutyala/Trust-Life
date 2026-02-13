import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { img_url } from './src/config/Constants';
import * as Animatable from 'react-native-animatable';
import { regular } from './src/config/Constants';
import SelectedTest from './src/views/SelectedTest';

// import Vector from './src/assets/svg/Vector.svg';
// import Vector2 from './src/assets/svg/Vector2.svg';
// import Vector3 from './src/assets/svg/Vector3.svg';
// import Vector4 from './src/assets/svg/Vector4.svg';

/* Screens */
import Splash from './src/views/Splash';
import Dashboard from './src/views/Dashboard';
import LoginHome from './src/views/LoginHome';
import Faq from './src/views/Faq';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import Otp from './src/views/Otp';
import DoctorList from './src/views/DoctorList';
import Hospital from './src/views/Hospital';
import CheckPhone from './src/views/CheckPhone';
import CreatePassword from './src/views/CreatePassword';
import Password from './src/views/Password';
import DoctorCategories from './src/views/DoctorCategories';
import MyOrders from './src/views/MyOrders';
import TermsAndConditions from './src/views/TermsAndConditions';
import More from './src/views/More';
import CreateAppointment from './src/views/CreateAppointment';
import PharmCart from './src/views/PharmCart';
import Register from './src/views/Register';
import LocationEnable from './src/views/LocationEnable';
import AppointmentDetails from './src/views/AppointmentDetails';
import MyAppointments from './src/views/MyAppointments';
import PaymentMethods from './src/views/PaymentMethods';
import SelectCurrentLocation from './src/views/SelectCurrentLocation';
import CurrentLocation from './src/views/CurrentLocation';
import AddressList from './src/views/AddressList';
import AddAddress from './src/views/AddAddress';
import Profile from './src/views/Profile';
import LabOrders from './src/views/LabOrders';
import MyOnlineConsultations from './src/views/MyOnlineConsultations';
import MyOrderHistories from './src/views/MyOrderHistories';
import PromoCode from './src/views/PromoCode';
import Pharmacies from './src/views/Pharmacies';
import PharmCategories from './src/views/PharmCategories';
import CategoriesAnalysis from './src/views/CategoriesAnalysis';

import PharmProducts from './src/views/PharmProducts';
import PharmProductDetails from './src/views/PharmProductDetails';
import DoctorSearch from './src/views/DoctorSearch';
import HospitalSearch from './src/views/HospitalSearch';
import PharmacySearch from './src/views/PharmacySearch';
import OrderRating from './src/views/OrderRating';
import ConsultationRating from './src/views/ConsultationRating';
import AppointmentRating from './src/views/AppointmentRating';
import Lab from './src/views/Lab';
import LabDetails from './src/views/LabDetails';
import Analysis from './src/views/Analysis';

import PackageDetail from './src/views/PackageDetail';
import Packages from './src/views/Packages';
import PatientDetails from './src/views/PatientDetails';
import LabCart from './src/views/LabCart';
import LabOrderDetails from './src/views/LabOrderDetails';
import UploadPrescription from './src/views/UploadPrescription';
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Blog from './src/views/Blog';
import AnalysisChart from './src/views/AnalysisChart';
import ListFamilyMembers from './src/views/ListFamilyMembers';
import AddFamilyMember from './src/views/AddFamilyMember';
import Settings from './src/views/Settings';
import RegisterTwo from './src/views/RegisterTwo';

import ForgotPassword from './src/views/ForgotPassword';

import BlogDetails from './src/views/BlogDetails';
import ViewPrescription from './src/views/ViewPrescription';
import HospitalDetails from './src/views/HospitalDetails';
import Chat from './src/views/Chat';
import TodayReminder from './src/views/TodayReminder';
import ConfirmReminder from './src/views/ConfirmReminder';
import LabSearch from './src/views/LabSearch';
import DoctorProfile from './src/views/DoctorProfile';
import ViewList from './src/views/ViewList';
import UploadDoctorPrescription from './src/views/UploadDoctorPrescription';
import DoctorChat from './src/views/DoctorChat';
import Paypal from './src/views/Paypal';
import Agora from './src/views/Agora/';
import HealthAnalysis from './src/views/HealthAnalysis';
import MyReports from './src/views/MyReports';
import Offers from './src/views/Offers';
import MyReportsHome from './src/views/MyReportsHome';
import Dummy from './src/views/Dummy';
import RelevanceDetailsScreen from './src/views/RelevanceDetailsScreen';
import ViewAllPatients from './src/views/ViewAllPatients';
import AllAddress from './src/views/AllAddress';
import OrderScreen from './src/views/OrderScreen';
import OrderTracking from './src/views/OrderTrackingScreen';
import { primaryColor } from './src/utils/globalColors';
import CustomBottomTabBar from './src/components/BottomNavBar/CustomBottomTabBar';
import OTPScreen from './src/views/OtpScreen';
import OtpOptionScreen from './src/views/OtpOptionScreen';
import { s, vs, ms } from 'react-native-size-matters';
import { SnackProvider } from './src/context/GlobalSnackBarContext';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import EmptyCart from './src/views/EmptyCart';
import MyPrescriptions from './src/views/MyPrescriptions';
import LocationSearch from './src/views/LocationSearch';
import PreviewPrescription from './src/views/PreviewPrescription';
import SubmitPrescription from './src/views/SubmitPrescription';
import FullBodyCheckUpScreen from './src/views/FullBodyCheckUpScreen';
import VitaminScreen from './src/views/VitaminScreen';
import SearchItems from './src/views/SearchItems';
import MedicalRecordsVault from './src/views/MedicalRecordsVault';
import UploadHealthReport from './src/views/UploadHealthReport';
import MedicationTracking from './src/views/MedicationTracking';
import AddMedicines from './src/views/AddMedicines';
import AddDateTime from './src/views/AddDateTime';
import AddReminder from './src/views/AddReminder';
import MarkMedicines from './src/views/MarkMedicines';
import SuccessScreen from './src/views/SuccessScreen';
import HealthTrend from './src/views/HealthTrend';
import HealthStatusScreen from './src/views/HealthStatusScreen';
import HealthAnalysisScreen from './src/views/HealthAnalysisScreen';
import InviteFriends from './src/views/InviteFriends';
import ReferralEarnings from './src/views/ReferralEarnings';
import SettingsMore from './src/views/Settings';
import ChangePassword from './src/views/ChangePassword';
import SetNewPassword from './src/views/SetNewPassword';
import ChangeMobileNumber from './src/views/ChangeMobileNumber';
import FingerprintSettings from './src/views/FingerprintSettings';
import PDFViewer from './src/views/PDFViewer';
import CategoryBloodTest from './src/views/CategoryBloodTest';
import SubscriptionPlans from './src/views/SubscriptionPlans';
import CompareSubscriptionPlans from './src/views/CompareSubscriptionPlans';
import ChoosePreferredOption from './src/views/ChoosePreferredOption';
import PersonalDetails from './src/views/SignUp/PersonalDetails';
import LifestyleInfo from './src/views/SignUp/LifestyleInfo';
import HabitsScreen from './src/views/SignUp/HabitsScreen';
import DietNutritionScreen from './src/views/SignUp/DietNutritionScreen';
import PhysicalActivityScreen from './src/views/SignUp/PhysicalActivityScreen';
import WorkStressScreen from './src/views/SignUp/WorkStressScreen';
import SleepPatternScreen from './src/views/SignUp/SleepPatternScreen';
import MedicalHistory from './src/views/SignUp/MedicalHistory';
import ExistingConditionsScreen from './src/views/SignUp/ExistingConditionsScreen';
import CurrentMedicationsScreen from './src/views/SignUp/CurrentMedicationsScreen';
import PastSurgeriesScreen from './src/views/SignUp/PastSurgeriesScreen';
import AllergiesReactionsScreen from './src/views/SignUp/AllergiesReactionsScreen';
import WomenSpecificScreen from './src/views/SignUp/WomenSpecificScreen';
import VaccinationDetailsScreen from './src/views/SignUp/VaccinationDetailsScreen';
import AddFamilyScreen from './src/views/SignUp/AddFamilyScreen';
import PatientHealthRecords from './src/views/PatientHealthRecord/PatientHealthRecors';
import PatientMedicalSummary from './src/views/PatientHealthRecord/PatientMedicalSummary';
import DoctorNotes from './src/views/PatientHealthRecord/DoctorNotes';
import LabReports from './src/views/PatientHealthRecord/LabReports';
import MedicationPrescription from './src/views/PatientHealthRecord/MedicationPrescription';
import PrescriptionDetail from './src/views/PatientHealthRecord/PrescriptionDetail';
import PatientNote from './src/views/PatientHealthRecord/PatientNote';
import NoteDetail from './src/views/PatientHealthRecord/NoteDetail';
import AddPatientNote from './src/views/PatientHealthRecord/AddPatientNote';
import MedicalRecords from './src/views/PatientHealthRecord/MedicalRecords';
import HeartRateLog from './src/views/HeartRate/HeartRateLog';
import HeartRateDashboard from './src/views/HeartRate/HeartRateDashboard';
import AddHeartRateReading from './src/views/HeartRate/AddHeartRateReading';
import HeartRateReadings from './src/views/HeartRate/HeartRateReadings';
import BloodPressureLog from './src/views/BloodPressure/BloodPressureLog';
import BloodPressureDashboard from './src/views/BloodPressure/BloodPressureDashboard';
import AddBloodPressureReading from './src/views/BloodPressure/AddBloodPressureReading';
import BloodPressureReadings from './src/views/BloodPressure/BloodPressureReadings';
import GlucoseLog from './src/views/Glucose/GlucoseLog';
import GlucoseDashboard from './src/views/Glucose/GlucoseDashboard';
import AddGlucoseReading from './src/views/Glucose/AddGlucoseReading';
import GlucoseReadings from './src/views/Glucose/GlucoseReadings';
import TemperatureLog from './src/views/Temperature/TemperatureLog';
import TemperatureDashboard from './src/views/Temperature/TemperatureDashboard';
import AddTemperatureReading from './src/views/Temperature/AddTemperatureReading';
import TemperatureReadings from './src/views/Temperature/TemperatureReadings';
import MenstrualCycleLog from './src/views/MenstrualCycle/MenstrualCycleLog';
import MenstrualCycleDashboard from './src/views/MenstrualCycle/MenstrualCycleDashboard';
import AddMenstrualCycle from './src/views/MenstrualCycle/AddMenstrualCycle';
import MenstrualCycleReadings from './src/views/MenstrualCycle/MenstrualCycleReadings';
import SmartDeviceTracking from './src/views/SmartDeviceTracking';
import TurnOnBluetooth from './src/views/TurnOnBluetooth';
import SearchNearbyDevices from './src/views/SearchNearbyDevices';
import WeightManagementLog from './src/views/WeightManagement/WeightManagemantLog';
import WeightManagementDashboard from './src/views/WeightManagement/WeightManagementDashboard';
import WeightManagementReadings from './src/views/WeightManagement/WeightManagementReadings';
import AddWeightManagemant from './src/views/WeightManagement/AddWeightManagemant';
import CompanyLabTests from './src/views/CompanyLabs/CompanyLabTests';
import TestSearchResultsScreen from './src/views/CompanyLabs/TestSearchResults';
import LabFilterScreen from './src/views/CompanyLabs/LabFilterScreen';
import IndivudalCompanyTests from './src/views/CompanyLabs/IndivudalCompanyTests';
import VaccinationLog from './src/views/Vaccination/VaccinationLog';
import VaccinationDashboard from './src/views/Vaccination/VaccinationDashboard';
import AddVaccination from './src/views/Vaccination/AddVaccination';
import VaccinationReadings from './src/views/Vaccination/VaccinationReadings';
import MigraineLog from './src/views/Migraine/MigraineLog';
import MigraineDashboard from './src/views/Migraine/MigraineDashboard';
import AddMigraine from './src/views/Migraine/AddMigraine';
import MigraineReadings from './src/views/Migraine/MigraineReadings';


const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};
// const TabArr = [
//   { route: 'Reports', label: 'Lab Reports', type: Icons.Feather, icon: 'file-text', component: MyReportsHome, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   // { route: 'Reports', label: 'Lab Reports', type: Icons.Feather, icon: 'clipboard', component: LabOrderDetails, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   { route: 'Offers', label: 'Offers', type: Icons.Feather, icon: 'gift', component: Offers, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   { route: 'Home', label: 'Home', type: Icons.Feather, icon: 'home', component: Dashboard, color: colors.theme_fg, alphaClr: colors.theme_bg_three, },
//   // { route: 'MyOrders', label: 'MyOrders', type: Icons.Feather, icon: 'file-text', component: MyOrders, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   // { route: 'Blog', label: 'Blog', type: Icons.Feather, icon: 'list', component: Blog, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   { route: 'Analysis', label: 'Analysis', type: Icons.Ionicons, icon: 'cellular-outline', component: HealthAnalysis, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
//   { route: 'Cart', label: 'LabCart', type: Icons.Feather, icon: 'shopping-cart', component: LabCart, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
// ];



const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    component: Dashboard,
  },
  {
    route: 'Reports',
    label: 'Medical\nRecords',
    component: PatientHealthRecords,
  },
  {
    route: 'TrustMD',
    label: 'Trust\nMD',
    component: Dashboard,
  },
  {
    route: 'HealthTrend',
    label: 'Health\nTrend',
    component: HealthTrend,
  },
  {
    route: 'More',
    label: 'More',
    component: More,
  },
];

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window');


// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           const item = TabArr.find((tab) => tab.route === route.name);
//           return (
//             <View
//               style={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginBottom: focused ? 10 : 0,
//               }}
//             >
//               <View
//                 style={{
//                   width: width * 0.13,
//                   height: width * 0.14,
//                   // borderRadius: width * 0.1,
//                   // backgroundColor: focused ? '#1F2B7B' : null,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   // borderBottomWidth: 4,
//                   // borderBottomColor: '#fff',
//                 }}
//               >
//                 <Icon
//                   type={item.type}
//                   name={item.icon}
//                   style={{
//                     fontSize: focused ? width * 0.08 : width * 0.07,
//                     fontWeight: 'bold',
//                     color: focused ? '#1F2B7B' : colors.grey,
//                   }}
//                 />
//               </View>
//             </View>
//           );
//         },
//         tabBarActiveTintColor: colors.theme_fg,
//         tabBarLabelStyle: {
//           fontSize: 13,
//           fontWeight: 'bold',
//         },
//         headerShown: false,
//         tabBarStyle: {
//           height: 70,
//           position: 'absolute',
//           bottom: 5,
//           left: 5,
//           right: 5,
//           borderRadius: 10,
//         },
//       })}
//     >
//       {TabArr.map((item) => (
//         <Tab.Screen key={item.route} name={item.route} component={item.component} />
//       ))}
//     </Tab.Navigator>
//   );
// }


// function TabNavigator() {
//   const insets = useSafeAreaInsets()
//   // const hasBottomOverlap = insets.bottom > 20;
//   const bottomPadding =
//     insets.bottom > 0 ? insets.bottom : 8;

//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           height: vs(65),
//           paddingBottom: bottomPadding,
//           borderTopEndRadius: 10,
//           borderTopStartRadius: 10,
//           backgroundColor: '#fff',
//           elevation: 5,
//         },
//         tabBarActiveTintColor: primaryColor,
//         tabBarInactiveTintColor: '#999',
//         tabBarIcon: ({ focused }) => {
//           const item = TabArr.find(tab => tab.route === route.name);
//           return (
//             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//               <Image
//                 source={focused ? item.activeImg : item.inactiveImg}
//                 resizeMode="contain"
//                 style={{
//                   width: width * 0.07,
//                   height: width * 0.07,
//                 }}
//               />
//             </View>
//           );
//         },
//         tabBarLabel: ({ focused }) => {
//           const item = TabArr.find(tab => tab.route === route.name);
//           return (
//             <Text
//               style={{
//                 fontSize: 12,
//                 fontWeight: focused ? '800' : '500',
//                 color: focused ? primaryColor : '#999',
//                 marginTop: -3,
//                 marginBottom: 10,
//               }}
//             >
//               {item.label}
//             </Text>
//           );
//         },
//       })}
//     >
//       {TabArr.map(item => (
//         <Tab.Screen
//           key={item.route}
//           name={item.route}
//           component={item.component}
//         />
//       ))}
//     </Tab.Navigator>
//   );
// }


function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TabArr.map(item => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
        />
      ))}
    </Tab.Navigator>
  );
}


const Stack = createStackNavigator();


function App() {
  return (
    <>
      <SafeAreaProvider>
        <PaperProvider>
        <SnackProvider>
          <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#F1F5F9' } }}>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }} >
              <Stack.Screen name="SelectedTest" component={SelectedTest} options={{ headerShown: false }} />
              <Stack.Screen name='RelevanceDetails' component={RelevanceDetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MyReport" component={MyReports} options={{ headerShown: false }} />
              <Stack.Screen name="MyReportsHome" component={MyReportsHome} options={{ headerShown: false }} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
              <Stack.Screen name='otpScreen' component={OTPScreen} options={{ headerShown: false }} />
              <Stack.Screen name='otpOptionScreen' component={OtpOptionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AnalysisChart" component={AnalysisChart} options={{ headerShown: false }} />
              <Stack.Screen name="AnalysisCheck" component={Analysis} options={{ headerShown: false }} />
              <Stack.Screen name="MyOrder" component={MyOrders} options={{ headerShown: true }} />
              <Stack.Screen name="ListFamilyMembers" component={ListFamilyMembers} options={{ headerShown: false }} />
              <Stack.Screen name="AddFamilyMember" component={AddFamilyMember} options={{ headerShown: false }} />
              <Stack.Screen name="Offers" component={Offers} options={{ headerShown: false }} />

              <Stack.Screen name="Agora" component={Agora} options={{ headerShown: false }} />
              <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{ title: 'Select Payment Mode' }} />
              <Stack.Screen name="OrderRating" component={OrderRating} options={{ headerShown: false }} />
              <Stack.Screen name="HospitalDetails" component={HospitalDetails} options={{ title: 'Hospital Details' }} />
              <Stack.Screen name="ViewList" component={ViewList} options={({ route }) => ({ title: route.params.title })} />
              <Stack.Screen name="ConsultationRating" component={ConsultationRating} options={{ headerShown: false }} />
              <Stack.Screen name="AppointmentRating" component={AppointmentRating} options={{ headerShown: false }} />
              <Stack.Screen name="LabCart" component={LabCart} options={{ headerShown:false }} />
              <Stack.Screen name="PharmacySearch" component={PharmacySearch} options={{ headerShown: false }} />
              <Stack.Screen name="HospitalSearch" component={HospitalSearch} options={{ headerShown: false }} />
              <Stack.Screen name="FaqDetails" component={FaqDetails} options={{ title: 'Faq Details' }} />
              <Stack.Screen name="DoctorSearch" component={DoctorSearch} options={{ headerShown: false }} />
              <Stack.Screen name="LabSearch" component={LabSearch} options={{ headerShown: false }} />
              <Stack.Screen name="Hospital" component={Hospital} options={{ title: 'Hospitals' }} />
              <Stack.Screen name="Pharmacies" component={Pharmacies} options={{ title: 'Nearest Pharmacies' }} />
              <Stack.Screen name="PharmCategories" component={PharmCategories} options={({ route }) => ({ title: route.params.vendor_name })} />
              <Stack.Screen name="PharmProducts" component={PharmProducts} options={({ route }) => ({ title: route.params.sub_category_name })} />
              <Stack.Screen name="PharmProductDetails" component={PharmProductDetails} options={{ headerShown: false }} />
              <Stack.Screen name="FaqCategories" component={FaqCategories} options={{ title: 'Faq Categories' }} />
              <Stack.Screen name="Faq" component={Faq} options={{ title: 'Faq' }} />
              <Stack.Screen name="MyAppointments" component={MyAppointments} options={{ title: 'My Appointments' }} />
              <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="More" component={More} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterTwo" component={RegisterTwo} options={{ headerShown: false }} />

              <Stack.Screen name="LoginHome" component={LoginHome} options={{ headerShown: false }} />
              <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
              <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
              <Stack.Screen name="DoctorList" component={DoctorList} options={{ title: 'Find your doctor' }} />
              <Stack.Screen name="CheckPhone" component={CheckPhone} options={{ headerShown: false }} />
              <Stack.Screen name="CreatePassword" component={CreatePassword} options={{ headerShown: false }} />
              <Stack.Screen name="Password" component={Password} options={{ headerShown: false }} />
              <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{ title: 'Privacy Policies' }} />
              <Stack.Screen name="DoctorCategories" component={DoctorCategories} options={{ title: 'Common Symptoms' }} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ title: 'Terms and Conditions' }} />
              <Stack.Screen name="CreateAppointment" component={CreateAppointment} options={{ title: 'Create Appointment' }} />
              <Stack.Screen name="PharmCart" component={PharmCart} options={{ title: 'Cart' }} />
              <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="LocationEnable" component={LocationEnable} options={{ title: 'Location Enable' }} />
              <Stack.Screen name="SelectCurrentLocation" component={SelectCurrentLocation} options={{ title: 'Pick your Location' }} />
              <Stack.Screen name="CurrentLocation" component={CurrentLocation} options={{ headerShown: false }} />
              <Stack.Screen name="AddressList" component={AddressList} options={{ headerShown:false }} />
              <Stack.Screen name="AddAddress" component={AddAddress} options={{ title: 'Add Address' }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown:false }} />
              <Stack.Screen name="LabOrders" component={LabOrders} options={{ headerShown : false}} />
              <Stack.Screen name="MyOnlineConsultations" component={MyOnlineConsultations} options={{ title: 'My Consultations' }} />
              <Stack.Screen name="MyOrderHistories" component={MyOrderHistories} options={{ title: 'My Orders' }} />
              <Stack.Screen name="PromoCode" component={PromoCode} options={{ title: 'Apply Promo Code' }} />
              <Stack.Screen name="Lab" component={Lab} options={{ title: 'Laboratories' }} />
              <Stack.Screen name="LabDetails" component={LabDetails} options={{ headerShown: false }} />
              <Stack.Screen name="PackageDetail" component={PackageDetail} options={({ route }) => ({ title: route.params.package_name })} />
              <Stack.Screen name="Packages" component={Packages} options={({ route }) => ({
                title: route.params?.relevance_name || 'Select what you need...'
              })} />
              <Stack.Screen name="PatientDetails" component={PatientDetails} />
              <Stack.Screen name="LabOrderDetails" component={LabOrderDetails} options={{ headerShown:false }} />
              <Stack.Screen name="UploadPrescription" component={UploadPrescription} options={{ title: 'Upload Prescription' }} />
              <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
              <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{ title: '' }} />
              <Stack.Screen name="BlogDetails" component={BlogDetails} options={{ title: '' }} />
              <Stack.Screen name="ViewPrescription" component={ViewPrescription} options={{ title: 'View Prescription' }} />
              <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
              <Stack.Screen name="TodayReminder" component={TodayReminder} options={{ title: 'Today Reminders' }} />
              <Stack.Screen name="ConfirmReminder" component={ConfirmReminder} options={{ title: 'Confirm Reminder' }} />
              <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: 'Doctor Profile' }} />
              <Stack.Screen name="UploadDoctorPrescription" component={UploadDoctorPrescription} options={{ title: 'Upload Doctor Prescription' }} />
              <Stack.Screen name="DoctorChat" component={DoctorChat} options={{ title: 'Chat with doctor' }} />
              <Stack.Screen name="Paypal" component={Paypal} options={{ title: 'Pay with PayPal' }} />
              <Stack.Screen name='Dummy' component={Dummy} />
              <Stack.Screen name='Orders' component={OrderScreen} options={{ title: 'Orders' }} />
              <Stack.Screen name='OrderTracking' component={OrderTracking} options={{ title: 'Order Tracking' }} />
              <Stack.Screen name='uploadPerscription' component={UploadPrescription} options={{ headerShown: false }} />
              <Stack.Screen name='emptyCart' component={EmptyCart} options={{headerShown:false}} />
              <Stack.Screen name='LocationSearch' component={LocationSearch} options={{headerShown:false}} />
              <Stack.Screen name="PreviewPrescription" component={PreviewPrescription} options={{headerShown:false}}/>
              <Stack.Screen name="SubmitPrescription" component={SubmitPrescription} options={{headerShown:false}}/>
              <Stack.Screen name='FullBodyScreen' component={FullBodyCheckUpScreen} options={{headerShown: false}} />
              <Stack.Screen name='VitaminScreen' component={VitaminScreen} options={{headerShown:false}} />
              <Stack.Screen name='SearchItems' component={SearchItems} options={{headerShown:false}}/>
              <Stack.Screen name='MedicalRecordsVault' component={MedicalRecordsVault} options={{headerShown:false}}/>
              <Stack.Screen name='UploadHealthReport' component={UploadHealthReport} options={{headerShown:false}}/>
              <Stack.Screen name='MedicationTracking' component={MedicationTracking} options={{headerShown:false}}/>
              <Stack.Screen name='AddMedicines' component={AddMedicines} options={{headerShown:false}}/>
              <Stack.Screen name='AddDateTime' component={AddDateTime} options={{headerShown:false}}/>
              <Stack.Screen name='AddReminder' component={AddReminder} options={{headerShown:false}}/>
              <Stack.Screen name='MarkMedicines' component={MarkMedicines} options={{headerShown:false}}/>
              <Stack.Screen name='SuccessScreen' component={SuccessScreen} options={{headerShown:false}}/>
              <Stack.Screen name='HealthStatusScreen' component={HealthStatusScreen} options={{headerShown:false}}/>
              <Stack.Screen name='HealthAnalysisScreen' component={HealthAnalysisScreen} options={{headerShown:false}}/>
              <Stack.Screen name='InviteFriends' component={InviteFriends} options={{headerShown:false}}/>
              <Stack.Screen name='ReferralEarnings' component={ReferralEarnings} options={{headerShown:false}}/>
              <Stack.Screen name='settingsmore' component={SettingsMore} options={{headerShown:false}}/>
              <Stack.Screen name='ChangePassword' component={ChangePassword} options={{headerShown:false}}/>
              <Stack.Screen name='SetNewPassword' component={SetNewPassword} options={{headerShown:false}}/>
              <Stack.Screen name='ChangeMobileNumber' component={ChangeMobileNumber} options={{headerShown:false}}/>
              <Stack.Screen name='FingerprintSettings' component={FingerprintSettings} options={{headerShown:false}}/>
              <Stack.Screen name='PDFViewer' component={PDFViewer} options={{headerShown:false}}/>
              <Stack.Screen name='CategoryBloodTest' component={CategoryBloodTest} options={{headerShown:false}}/>
              <Stack.Screen name='SubscriptionPlans' component={SubscriptionPlans} options={{headerShown:false}}/>
              <Stack.Screen name='CompareSubscriptionPlans' component={CompareSubscriptionPlans} options={{headerShown:false}}/>
              <Stack.Screen name='ChoosePreferredOption' component={ChoosePreferredOption} options={{headerShown:false}}/>
              <Stack.Screen name='PersonalDetails' component={PersonalDetails} options={{headerShown:false}}/>
              <Stack.Screen name='LifestyleInfo' component={LifestyleInfo} options={{headerShown:false}}/>
              <Stack.Screen name='HabitsScreen' component={HabitsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='DietNutritionScreen' component={DietNutritionScreen} options={{headerShown:false}}/>
              <Stack.Screen name='PhysicalActivityScreen' component={PhysicalActivityScreen} options={{headerShown:false}}/>
              <Stack.Screen name='WorkStressScreen' component={WorkStressScreen} options={{headerShown:false}}/>
              <Stack.Screen name='SleepPatternScreen' component={SleepPatternScreen} options={{headerShown:false}}/>
              <Stack.Screen name='MedicalHistory' component={MedicalHistory} options={{headerShown:false}}/>
              <Stack.Screen name='ExistingConditionsScreen' component={ExistingConditionsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='CurrentMedicationsScreen' component={CurrentMedicationsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='PastSurgeriesScreen' component={PastSurgeriesScreen} options={{headerShown:false}}/>
              <Stack.Screen name='AllergiesReactionsScreen' component={AllergiesReactionsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='WomenSpecificScreen' component={WomenSpecificScreen} options={{headerShown:false}}/>
              <Stack.Screen name='VaccinationDetailsScreen' component={VaccinationDetailsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='AddFamilyScreen' component={AddFamilyScreen} options={{headerShown:false}}/>
              <Stack.Screen name='PatientMedicalSummary' component={PatientMedicalSummary} options={{headerShown:false}}/>
              <Stack.Screen name='DoctorNotes' component={DoctorNotes} options={{headerShown:false}}/>
              <Stack.Screen name='LabReports' component={LabReports} options={{headerShown:false}}/>
              <Stack.Screen name='MedicationPrescription' component={MedicationPrescription} options={{headerShown:false}}/>
              <Stack.Screen name='PrescriptionDetail' component={PrescriptionDetail} options={{headerShown:false}}/>
              <Stack.Screen name='PatientNote' component={PatientNote} options={{headerShown:false}}/>
              <Stack.Screen name='NoteDetail' component={NoteDetail} options={{headerShown:false}}/>
              <Stack.Screen name='AddPatientNote' component={AddPatientNote} options={{headerShown:false}}/>
              <Stack.Screen name='MedicalRecords' component={MedicalRecords} options={{headerShown:false}}/>
              <Stack.Screen name='HeartRateLog' component={HeartRateLog} options={{headerShown:false}}/>
              <Stack.Screen name='HeartRateDashboard' component={HeartRateDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddHeartRateReading' component={AddHeartRateReading} options={{headerShown:false}}/>
              <Stack.Screen name='SmartDeviceTracking' component={SmartDeviceTracking} options={{headerShown:false}}/>
              <Stack.Screen name='TurnOnBluetooth' component={TurnOnBluetooth} options={{headerShown:false}}/>
              <Stack.Screen name='SearchNearbyDevices' component={SearchNearbyDevices} options={{headerShown:false}}/>
              <Stack.Screen name='HeartRateReadings' component={HeartRateReadings} options={{headerShown:false}}/>
              <Stack.Screen name='BloodPressureLog' component={BloodPressureLog} options={{headerShown:false}}/>
              <Stack.Screen name='BloodPressureDashboard' component={BloodPressureDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddBloodPressureReading' component={AddBloodPressureReading} options={{headerShown:false}}/>
              <Stack.Screen name='BloodPressureReadings' component={BloodPressureReadings} options={{headerShown:false}}/>
              <Stack.Screen name='GlucoseLog' component={GlucoseLog} options={{headerShown:false}}/>
              <Stack.Screen name='GlucoseDashboard' component={GlucoseDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddGlucoseReading' component={AddGlucoseReading} options={{headerShown:false}}/>
              <Stack.Screen name='GlucoseReadings' component={GlucoseReadings} options={{headerShown:false}}/>
              <Stack.Screen name='TemperatureLog' component={TemperatureLog} options={{headerShown:false}}/>
              <Stack.Screen name='TemperatureDashboard' component={TemperatureDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddTemperatureReading' component={AddTemperatureReading} options={{headerShown:false}}/>
              <Stack.Screen name='TemperatureReadings' component={TemperatureReadings} options={{headerShown:false}}/>
              <Stack.Screen name='MenstrualCycleLog' component={MenstrualCycleLog} options={{headerShown:false}}/>
              <Stack.Screen name='MenstrualCycleDashboard' component={MenstrualCycleDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddMenstrualCycle' component={AddMenstrualCycle} options={{headerShown:false}}/>
              <Stack.Screen name='MenstrualCycleReadings' component={MenstrualCycleReadings} options={{headerShown:false}}/>
              <Stack.Screen name='WeightManagementLog' component={WeightManagementLog} options={{headerShown:false}}/>
              <Stack.Screen name='WeightManagementDashboard' component={WeightManagementDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='WeightManagementReadings' component={WeightManagementReadings} options={{headerShown:false}}/>
              <Stack.Screen name='AddWeightManagemant' component={AddWeightManagemant} options={{headerShown:false}}/>
              <Stack.Screen name='CompanyLabTests' component={CompanyLabTests} options={{headerShown:false}}/>
              <Stack.Screen name='TestSearchResultsScreen' component={TestSearchResultsScreen} options={{headerShown:false}}/>
              <Stack.Screen name='LabFilterScreen' component={LabFilterScreen} options={{headerShown:false}}/>
              <Stack.Screen name='IndivudalCompanyTests' component={IndivudalCompanyTests} options={{headerShown:false}}/>
              <Stack.Screen name='VaccinationLog' component={VaccinationLog} options={{headerShown:false}}/>
              <Stack.Screen name='VaccinationDashboard' component={VaccinationDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddVaccination' component={AddVaccination} options={{headerShown:false}}/>
              <Stack.Screen name='VaccinationReadings' component={VaccinationReadings} options={{headerShown:false}}/>
              <Stack.Screen name='MigraineLog' component={MigraineLog} options={{headerShown:false}}/>
              <Stack.Screen name='MigraineDashboard' component={MigraineDashboard} options={{headerShown:false}}/>
              <Stack.Screen name='AddMigraine' component={AddMigraine} options={{headerShown:false}}/>
              <Stack.Screen name='MigraineReadings' component={MigraineReadings} options={{headerShown:false}}/>
              <Stack.Screen
                name="ViewAllPatients"
                component={ViewAllPatients}
                options={({ navigation }) => ({
                  title: 'Family Members',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('PatientDetails')}>
                      <Text style={{
                        padding: 10,
                        backgroundColor: 'green',
                        borderWidth: 1,
                        borderColor: 'green',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: 10,
                        fontSize: 12,
                        marginRight: 10
                      }}>
                        Add Patient
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              />
              <Stack.Screen name='Address' component={AllAddress} options={{ headerShown: false}} />
              <Stack.Screen name='MyPrescriptions' component={MyPrescriptions} options={{ headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>
        </SnackProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  }
})

export default App;
