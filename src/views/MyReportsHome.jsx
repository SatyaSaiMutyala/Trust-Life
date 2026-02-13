// import { Alert, Dimensions, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import * as colors from '../assets/css/Colors';
// import { StatusBar } from '../components/StatusBar';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon, { Icons } from '../components/Icons';
// import { api_url, bold, List, regular } from '../config/Constants';
// import { TextInput } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Loader from '../components/Loader';
// import axios from 'axios';

// const { width, height, fontScale } = Dimensions.get('window');

// const MyReportsHome = (props) => {
//   const navigation = useNavigation();
//   const route = useRoute()
//   const [date, setDate] = useState(new Date());
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [dateGap, setDateGap] = useState('');
//   const [from, setFrom] = useState(false);
//   const [To, setTo] = useState(false);
//   const [show, setShow] = useState(false);

//   const [type, setType] = useState(route.params?.type || 'individual');
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState(true);
//   const [reportsData, setReportsData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       await handleGetReportsDocuments();
//     }
//     fetchData();
//   }, []);


//   const handleGetReportsDocuments = async () => {
//     const data = {
//       'customer_id': global.id
//     }
//     try {
//       const response = await axios.post(`${api_url}vendor/document_details`, data)
//       console.log('Response man ..............!');
//       console.log(response.data.result);
//       const list = response.data.result ?? [];
//       setReportsData(list);
//     } catch (e) {
//       console.log('Error Occured :', e);
//     }
//   }



//   const handleBackButtonClick = () => {
//     navigation.goBack()
//   }

//   function getDateDifference(date1, date2) {
//     // Create Date objects
//     // let startDate = date1;
//     // startDate.setDate(date1)

//     //const endDate = date2;
//     // endDate.setDate(date2)
//     const startDate = new Date(date1.split('/').reverse().join('-'));
//     const endDate = new Date(date2.split('/').reverse().join('-'));


//     if (startDate < endDate) {
//       console.log(`${date1} is lesser (earlier) than ${date2}`);
//     } else if (startDate > endDate) {
//       console.log(`${date1} is greater (later) than ${date2}`);
//     } else {
//       console.log(`${date1} is equal to ${date2}`);
//     }
//     // Calculate the difference in milliseconds
//     const differenceInMilliseconds = endDate - startDate;

//     // Calculate the difference in days
//     const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
//     console.log('differenceInDays', differenceInDays)

//     // Calculate the difference in weeks
//     const differenceInWeeks = differenceInDays / 7;
//     //console.log('differenceInMonths', differenceInWeeks|0)
//     const differenceInMonths = differenceInDays / 30;
//     //console.log('differenceInMonths', differenceInMonths|0)
//     const months = Math.floor(differenceInDays / 30); // Approximate months
//     const weeks = Math.floor((differenceInDays % 30) / 7); // Weeks from remaining days
//     const days = differenceInDays % 30;
//     let gap = '';
//     // Remaining days

//     console.log(`Difference: ${months} months, ${weeks} weeks, ${days} days`);

//     // Adjust output to show weeks and days only if applicable
//     if (months === 0 && weeks === 0 && days > 0) {
//       console.log(`${days} days`);
//       gap = `${days} days`
//     } else if (months === 0 && weeks > 0) {
//       if (7 - days > 0) {
//         console.log(`${weeks} weeks, ${7 - days} days`);

//       }
//       else {
//         console.log(`${weeks} weeks`);
//       }
//       gap = `${weeks} weeks ago`
//     } else if (months > 0) {
//       if (weeks > 0) {
//         const days = differenceInDays % 7;

//         if (7 - days > 0) {
//           console.log(`${months} months,${weeks} weeks1, ${7 - days} days`);
//         }
//         else {
//           console.log(` ${months} months,${weeks} weeks`);
//         }

//         //console.log(`${months} months,${weeks} weeks, ${7-days} days`);
//       } else {
//         const days = differenceInDays % 30;
//         if (days > 0) {
//           console.log(`${months} months, ${days} days`);
//         } else {
//           console.log(`${months} months,`)

//         }
//       }
//       gap = `${months} months ago`
//     }

//     return gap; // Math.abs(differenceInDays); // Return the absolute value to avoid negative days
//   }
//   const getReport = () => {
//     if (fromDate != '' || toDate != '') {
//       setLoading(true)
//       let gap = getDateDifference(fromDate, toDate)
//       console.log('gap', gap)
//       setDateGap(gap)
//       setTimeout(() => {
//         setLoading(false)
//         setReport(true)


//       }, 1000);
//     } else {
//       Alert.alert('Select date range')
//     }


//   }
//   const analysis = () => {
//     if (type == 'group') {

//       navigation.navigate('AnalysisChart', {
//         type: {
//           testName: "Calcium Total, Serum",
//           messureUnit: "mg/dl",
//           messureName: '(TSH)-Ultrasensit',
//           condition: 'Critical',
//           date: dateGap,
//         },
//       })
//     }
//     else {
//       navigation.navigate('Analysis', { type: type })
//     }
//   }

//   const reportList = ({ item }) => {
//     return (

//       <TouchableOpacity style={{ width: width * 0.9, marginBottom: 10, paddingVertical: 10, borderWidth: 2, justifyContent: 'center', borderRadius: 10, }} onPress={analysis}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}  >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <View>
//               <Icon type={Icons.AntDesign} name="pdffile1" color={colors.theme_black} style={{ fontSize: 35 }} />
//             </View>

//             <View style={{ flexDirection: 'column', marginLeft: 10 }}>
//               <Text style={{ color: colors.theme_black, fontSize: 15, }}>{item.document_name}</Text>
//               <Text style={{ color: colors.theme_black, fontSize: 14, }}>{`${item.created_at}`}</Text>

//             </View>

//           </View>

//           <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
//             <Icon type={Icons.Feather} name={type != 'group' ? 'eye' : 'download'} color={colors.theme_black} style={{ fontSize: 25, marginLeft: 'auto' }} />
//           </View>

//         </View>
//       </TouchableOpacity>

//     );
//   }



//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//       <Loader visible={loading} />
//       <View>
//         <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} >
//           <View style={{ alignItems: 'center', paddingVertical: 10, justifyContent: 'flex-end', flexDirection: 'row' }}>
//             <View style={styles.header}>
//               <TouchableOpacity onPress={handleBackButtonClick}>
//                 {/* <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize: 35, marginLeft: 5 }} /> */}
//               </TouchableOpacity>
//               <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 24, }}>My Reports </Text>

//             </View>
//           </View>
//         </LinearGradient>

//         <View style={{ width: width * 0.9, height: height * 0.3, justifyContent: 'space-around', alignItems: 'center', marginHorizontal: width * 0.05 }}>

//           <TouchableOpacity style={{ width: '100%', borderWidth: 2, borderRadius: 10, flexDirection: 'row', marginTop: 10, alignItems: 'center' }}
//             onPressIn={() => {
//               setTimeout(() => {
//                 Keyboard.dismiss()
//               }, 100);
//               setShow(true)
//               setFrom(true)
//             }}>

//             <TextInput
//               style={styles.types}
//               value={` From Date :${fromDate}`}
//               placeholder="From Date"
//               placeholderTextColor={colors.grey}
//               underlineColorAndroid='transparent'
//               editable={false}
//             />
//             <Icon type={Icons.Feather} name="calendar" color={colors.theme_black} style={{ fontSize: 30 }} />


//           </TouchableOpacity>



//           <TouchableOpacity style={{ width: '100%', borderWidth: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}
//             onPressIn={() => {
//               setShow(true)
//               setTo(true)
//             }}>
//             <TextInput
//               style={styles.types}
//               value={` To Date :${toDate}`}
//               placeholder="To Date"
//               placeholderTextColor={colors.grey}
//               underlineColorAndroid='transparent'
//               editable={false}
//             />
//             <Icon type={Icons.Feather} name="calendar" color={colors.theme_black} style={{ fontSize: 30 }} />
//           </TouchableOpacity>

//           <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={[styles.button, {}]} >
//             <TouchableOpacity style={styles.button}  >
//               <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 20 }}>Search </Text>
//             </TouchableOpacity>
//           </LinearGradient>

//         </View>
//         <Text style={{ color: colors.theme_color, fontFamily: bold, fontSize: 20, marginLeft: width * 0.05, margin: 10 }}> Last {dateGap} Reports </Text>
//         <View style={{ width: width, height: height * 0.55, alignItems: 'center' }}>


//           {reportsData &&
//             <FlatList
//               showsVerticalScrollIndicator={false}
//               data={reportsData}
//               renderItem={reportList}
//               keyExtractor={item => item.id}
//               style={{}}
//             />
//           }



//           <View style={{ margin: 50 }} />



//         </View>
//       </View>


//       {show &&
//         <DateTimePicker
//           mode='date'
//           is24Hour={true}
//           value={date}
//           maximumDate={date}
//           onChange={(e, dates) => {
//             let datesFormate = `${dates.getDate().toString().padStart(2, 0)}/${(dates.getMonth() + 1).toString().padStart(2, 0)}/${dates.getFullYear()}`
//             console.log('first', datesFormate)
//             setShow(false)
//             if (from) {
//               const startDate = new Date(datesFormate.split('/').reverse().join('-'));
//               const endDate = new Date(toDate.split('/').reverse().join('-'));


//               if (startDate < endDate) {
//                 setFrom(false)
//                 setFromDate(datesFormate)
//                 console.log(`${startDate} is lesser (earlier) than ${endDate}`);
//               } else if (startDate > endDate) {
//                 console.log(`${startDate} is greater (later) than ${endDate}`);
//               } else {
//                 if (toDate == '') {
//                   setFrom(false)
//                   setFromDate(datesFormate)
//                 }
//                 else {
//                   setFrom(false)
//                   setFromDate(datesFormate)
//                   console.log(`${startDate} is equal to ${endDate}`);
//                 }
//               }

//             }
//             else {

//               const startDate = new Date(datesFormate.split('/').reverse().join('-'));
//               const endDate = new Date(toDate.split('/').reverse().join('-'));


//               if (startDate < endDate) {

//                 console.log(`${startDate} is lesser (earlier) than ${endDate}`);
//               } else if (startDate > endDate) {
//                 setTo(false)
//                 setToDate(datesFormate)
//                 console.log(`${startDate} is greater (later) than ${endDate}`);
//               } else {
//                 if (fromDate == '') {
//                   setTo(false)
//                   setToDate(datesFormate)
//                 }
//                 else {
//                   setTo(false)
//                   setToDate(datesFormate)
//                   console.log(`${startDate} is equal to ${endDate}`);
//                 }
//               }


//             }
//           }}
//         />
//       }



//     </SafeAreaView>

//   )
// }

// export default MyReportsHome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.theme_bg_three,
//     justifyContent: 'flex-start'
//   },
//   header: {
//     //flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',

//     width: '100%',

//   },
//   types: {
//     borderRadius: 5,
//     height: 45,
//     width: '90%',
//     fontFamily: regular,
//     fontSize: 14,
//     color: colors.theme_fg_two,
//   },
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     // backgroundColor:colors.theme_color,
//     width: width * 0.5,
//     height: 50,
//     borderRadius: 25,
//     flexDirection: 'row'
//   },

// })














import { Dimensions, FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../components/Loader';
import { Alert } from 'react-native';

import { StatusBar, StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, List, api_url } from '../config/Constants';
import { blackColor, globalGradient, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const MyReports = (props) => {
  const navigation = useNavigation();
  const route = useRoute()
  const [date, setDate] = useState(new Date());

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateGap, setDateGap] = useState('');
  const [from, setFrom] = useState(false);
  const [To, setTo] = useState(false);
  const [show, setShow] = useState(false);

  const [type, setType] = useState(route.params?.type || 'individual');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(true);
  const [reportsData, setReportsData] = useState([]);

  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('hey suresh your learning api integration................')
      hadlGetReportsData();
      return () => {
        // Optional cleanup function
      };
    }, [])
  );

  const hadlGetReportsData = async () => {
      try{
        setLoading(true);
        const response = await axios.get(`${api_url}customer/get_customer_reports/${global.id}`)
        console.log('---------------->',response.data.result);
        const data = response.data.result;
        setReportsData(data);
      } catch(e){
        console.log('Error occured in My reports Screen--------->', e);
      } finally {
        setLoading(false);
      }
  }

  function getDateDifference(date1, date2) {
    const startDate = new Date(date1.split('/').reverse().join('-'));
    const endDate = new Date(date2.split('/').reverse().join('-'));
    const differenceInMilliseconds = endDate - startDate;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    const months = Math.floor(differenceInDays / 30);
    const weeks = Math.floor((differenceInDays % 30) / 7);
    const days = differenceInDays % 30;
    let gap = '';

    if (months === 0 && weeks === 0 && days > 0) {
      gap = `${days} days`
    } else if (months === 0 && weeks > 0) {
      gap = `${weeks} weeks ago`
    } else if (months > 0) {
      gap = `${months} months ago`
    }
    return gap;
  }

  const getReport = () => {
    if (fromDate != '' || toDate != '') {
      setLoading(true)
      let gap = getDateDifference(fromDate, toDate)
      setDateGap(gap)
      setTimeout(() => {
        setLoading(false)
        setReport(true)
      }, 1000);
    } else {
      Alert.alert('Select date range')
    }
  }

  const analysis = () => {
    navigation.navigate('MyReport', { type: 'individual' });
  }

  const reportList = ({ item }) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemContent}>
          <Icon type={Icons.AntDesign} name="pdffile1" color={whiteColor} style={styles.listIcon} />

          <View style={styles.listTextContainer}>
            <Text style={styles.listTitle}>{item.patient_name}</Text>
            <Text style={styles.listSubtitle}>{item.report_date || 'Mon, Nov 10, 2025, 12:44:35'}</Text>
          </View>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={analysis}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />
      <Loader visible={loading} />
      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.1]}
        style={styles.fullGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.mainContent}>
          {!global.id ?
            <>
              <View style={styles.notLoggedInContainer}>
                <View style={styles.iconCircle}>
                  <Icon type={Icons.MaterialCommunityIcons} name="file-document-outline" color={primaryColor} style={styles.notLoggedInIcon} />
                </View>
                <Text style={styles.notLoggedInTitle}>Login Required</Text>
                <Text style={styles.notLoggedInSubtext}>Please login to access your medical reports and test results</Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("CheckPhone")}
                >
                  <Icon type={Icons.MaterialIcons} name="login" color={whiteColor} style={styles.loginButtonIcon} />
                  <Text style={styles.loginButtonText}>Login Now</Text>
                </TouchableOpacity>
              </View>
            </>
            :
            <>
              <View style={styles.searchContainer}>
                <Icon type={Icons.Feather} name="search" color={'gray'} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search with name"
                  placeholderTextColor={'gray'}
                />
                <TouchableOpacity onPress={() => setShow(true)} style={styles.calendarIcon}>
                  <Icon type={Icons.Feather} name="calendar" color={'gray'} size={24} />
                </TouchableOpacity>
              </View>
              <Text style={styles.recentReportsText}>Recent Reports</Text>
              <View style={styles.listWrapper}>
                {reportsData && reportsData.length > 0 ?
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={reportsData}
                    renderItem={reportList}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  :
                  <View style={styles.noDataContainer}>
                    <View style={styles.iconCircle}>
                      <Icon type={Icons.MaterialCommunityIcons} name="file-document-outline" color={primaryColor} style={styles.noDataIcon} />
                    </View>
                    <Text style={styles.noDataTitle}>No Reports Found</Text>
                    <Text style={styles.noDataSubtext}>You don't have any medical reports yet. Your test results will appear here once available.</Text>
                  </View>
                }
              </View>
            </>
          }
        </View>

        {show &&
          <DateTimePicker
            mode='date'
            is24Hour={true}
            value={date}
            maximumDate={new Date()}
            onChange={(e, dates) => {
              let datesFormate = `${dates.getDate().toString().padStart(2, 0)}/${(dates.getMonth() + 1).toString().padStart(2, 0)}/${dates.getFullYear()}`
              setShow(false)
              if (from) {
                const startDate = new Date(datesFormate.split('/').reverse().join('-'));
                const endDate = new Date(toDate.split('/').reverse().join('-'));
                if (startDate < endDate || toDate == '' || (startDate == endDate)) {
                  setFrom(false)
                  setFromDate(datesFormate)
                } else {
                  Alert.alert('Error', 'From Date cannot be later than To Date.')
                  setFrom(false)
                }
              }
              else if (To) {
                const startDate = new Date(fromDate.split('/').reverse().join('-'));
                const endDate = new Date(datesFormate.split('/').reverse().join('-'));
                if (endDate > startDate || fromDate == '' || (startDate == endDate)) {
                  setTo(false)
                  setToDate(datesFormate)
                } else {
                  Alert.alert('Error', 'To Date cannot be earlier than From Date.')
                  setTo(false)
                }
              }
            }}
          />
        }
      </LinearGradient>
    </SafeAreaView>
  )
}

export default MyReports

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: ms(50),
    // paddingTop : height * 0.06,
    justifyContent: 'flex-start'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    marginBottom: ms(30)
  },
  headerTitle: {
    color: whiteColor,
    fontFamily: bold,
    fontSize: ms(20),
    marginLeft: ms(8)
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: ms(5),
    // marginTop: ms(-30),
  },
  searchContainer: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(15),
    height: vs(35),
    marginBottom: ms(20),
    shadowColor: blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: ms(18),
    marginRight: ms(10),
  },
  searchInput: {
    flex: 1,
    fontFamily: regular,
    fontSize: ms(15),
    color: blackColor,
    paddingVertical: 0,
  },
  calendarIcon: {
    marginLeft: ms(10),
    padding: ms(5),
  },
  recentReportsText: {
    fontFamily: bold,
    fontSize: ms(18),
    color: blackColor,
    marginBottom: ms(10),
  },
  listWrapper: {
    flex: 1,
  },
  listItemContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: ms(10),
    elevation: 0,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(15),
  },
  listIcon: {
    fontSize: ms(22),
    marginRight: 15,
    color: primaryColor,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    // fontFamily: bold,
    fontSize: ms(15),
    color: blackColor,
    fontWeight:'800'
  },
  listSubtitle: {
    fontFamily: regular,
    fontSize: ms(11),
    color: 'gray',
  },
  viewButton: {
    paddingHorizontal: ms(15),
    paddingVertical: ms(8),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: primaryColor,
    backgroundColor: whiteColor,
    marginLeft: ms(10),
  },
  viewButtonText: {
    color: primaryColor,
    fontFamily: bold,
    fontSize: ms(12),
  },
  headerButton: {
    backgroundColor: whiteColor,
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(30),
  },
  iconCircle: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(25),
    borderWidth: 3,
    borderColor: '#E0F2FE',
  },
  notLoggedInIcon: {
    fontSize: ms(60),
  },
  notLoggedInTitle: {
    fontFamily: bold,
    fontSize: ms(26),
    color: blackColor,
    marginBottom: ms(12),
    letterSpacing: 0.5,
  },
  notLoggedInSubtext: {
    fontFamily: regular,
    fontSize: ms(13),
    color: blackColor,
    textAlign: 'center',
    marginBottom: ms(35),
    lineHeight: ms(22),
    paddingHorizontal: ms(10),
  },
  loginButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: ms(35),
    paddingVertical: ms(14),
    borderRadius: 30,
    elevation: 4,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  loginButtonIcon: {
    fontSize: ms(20),
  },
  loginButtonText: {
    color: whiteColor,
    fontFamily: bold,
    fontSize: ms(16),
    letterSpacing: 0.5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(30),
    marginTop: height * 0.1,
  },
  noDataIcon: {
    fontSize: ms(60),
  },
  noDataTitle: {
    fontFamily: bold,
    fontSize: ms(22),
    color: blackColor,
    marginBottom: ms(12),
    letterSpacing: 0.5,
  },
  noDataSubtext: {
    fontFamily: regular,
    fontSize: ms(14),
    color: 'gray',
    textAlign: 'center',
    lineHeight: ms(22),
    paddingHorizontal: ms(10),
  },
});
