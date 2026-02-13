// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
// import * as colors from '../assets/css/Colors';
// import { bold, regular, api_url, customer_lab_order_details, img_url, call } from '../config/Constants';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import Loader from '../components/Loader';
// import Moment from 'moment';
// import { StatusBar } from '../components/StatusBar';

// const LabOrderDetails = () => {


//   const navigation = useNavigation();

//   const route = useRoute();
//   const { PriceFromSelectedTest } = route.params || null;

//   const [loading, setLoading] = useState(false);
//   const [order_details, setOrderDetails] = useState('');
//   const [item_list, setItemList] = useState([]);
//   const [order_id, setOrderId] = useState(route.params.order_id);
//   console.log("Order Id = ", order_id);

//   const [gender, setGender] = useState('');

//   useEffect(() => {
//     get_order_details();
//   },[]);

//   const get_order_details = async() => {
//     setLoading(true);
//     await axios({
//       method: 'post',
//       url: api_url + customer_lab_order_details,
//       data:{ order_id:order_id }
//     })
//     .then(async response => {
//       setLoading(false);
//       setOrderDetails(response.data.result);
//       check_gender(response.data.result.patient_gender);
//       setItemList(response.data.result.item_list);
//       console.log('this is lab details api response ---------->', response.data.result);
//     })
//     .catch( async error => {
//       setLoading(false);
//       alert('Sorry something went wrong')
//     });
//   }

//   const check_gender = (gender_id) =>{
//     if(gender_id == 1 ){
//       setGender('Male');
//     }else if(gender_id == 2){
//       setGender('Female');
//     }else if(gender_id == 3){
//       setGender('Others')
//     }
//   }

//   const contact = async(number) =>{
//     let phoneNumber = '';
//     if (Platform.OS === 'android'){
//       phoneNumber = await `tel:${number}`;
//     }else{
//       phoneNumber = await `telprompt:${number}`;
//     }
//     await Linking.openURL(phoneNumber);
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//         <Loader visible={loading}/>
//         <StatusBar />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:15, }}>
//           <View style={{ flexDirection:'row' }}>
//             <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//               <View style={{ height: 50, width: 50 }} >
//                 <Image style={{ height: undefined, width: undefined, flex:1 }} source={{ uri: img_url+order_details.lab_image }}/>
//               </View>
//             </View>
//             <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{order_details.lab_name}</Text>
//               <View style={{ margin:2 }} />
//               <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{order_details.lab_address}</Text>
//               <View style={{ margin:2 }} />
//               {order_details.booking_type == 1 ?
//                 <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg}}>Collect From Home</Text>
//               :
//               <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg}}>Direct Appointment</Text>
//               }

//             </View>
//             <TouchableOpacity onPress={contact.bind(this,order_details.lab_phone_number)} style={{ width:'10%', alignItems:'flex-end', justifyContent:'center'}}>
//             <View style={{ height: 30, width: 30 }} >
//               <Image style={{ height: undefined, width: undefined, flex:1 }} source={call}/>
//             </View>
//           </TouchableOpacity>
//           </View>
//         </View>
//         <View style={{ margin:2 }} />
//         <View style={{ borderBottomWidth:1, borderColor:colors.light_grey}} />
//         <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
//           <View style={{ flexDirection:'row' }}>
//             <View style={{ width:'90%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Patient Details</Text>
//               <View style={{ margin:5 }} />
//               <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center', padding:10,}}>
//               <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>{order_details.patient_name}</Text>
//               <View style={{ margin:2 }}/>
//               <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{Moment(order_details.patient_dob).format('MMM DD, YYYY')} ,{gender}</Text>
//               <View style={{ margin:2 }}/>
//               <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{order_details.address}</Text>
//             </View>
//             </View>
//           </View>
//         </View>
//         <View style={{ margin:2 }} />
//         <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
//           <Text style={{ fontFamily:bold, fontSize:15, color:colors.theme_fg_two}}>Package Details</Text>
//           <View style={{ margin:5 }} />
//         {item_list.map((row, index) => (
//           <View style={{ backgroundColor:colors.theme_fg_three }}>
//             <View style={{ width:'100%', flexDirection:'row', padding:10, }}>
//               <View style={{ width:'20%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
//                 <View style={{ height:50, width:50, borderRadius:10 }} >
//                   <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10 }} source={{ uri:img_url+row.package_image}} />
//                 </View>
//               </View>
//               <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}}>
//                 <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:16}}>{row.item_name}</Text>
//                 <View style={{ margin:2 }}/>
//                 <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12}}>{row.short_description}</Text>
//               </View>
//               <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center'}}>
//                 <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:18}}>{global.currency}{PriceFromSelectedTest === null ? row.price : PriceFromSelectedTest}</Text>
//               </View>
//             </View>
//           </View>
//         ))}
//         </View>
//         <View style={{ margin:2 }} />
//         <View style={{ borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:5, }}>
//           <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>Order Summary</Text>
//           <View style={{ margin:5 }} />
//           <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
//             <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Sub Total</Text>
//             </View>
//             <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.sub_total}</Text>
//             </View>
//           </View>
//           <View style={{ margin:5 }} />
//           <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
//             <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Tax</Text>
//             </View>
//             <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.tax}</Text>
//             </View>
//           </View>
//           <View style={{ margin:5 }} />
//           <View style={{ width:'100%', flexDirection:'row', paddingLeft:10,}}>
//             <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>Discount</Text>
//             </View>
//             <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontSize:13, color:colors.grey, fontFamily:regular }}>{global.currency}{order_details.discount}</Text>
//             </View>
//           </View>
//         </View>
//         <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.light_blue, padding:20 }}>
//           <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
//             <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>Grand Total</Text>
//           </View>
//           <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//             <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold }}>{global.currency}{order_details.total}</Text>
//           </View>
//         </View>
//       </ScrollView>
//       {order_details.special_instruction &&
//         <View style={{ width:'100%', flexDirection:'row', backgroundColor:colors.theme_fg_three, paddingLeft:15, paddingTop: 20, paddingBottom: 20, }}>
//           <View style={{ width:'40%', alignItems:'flex-start', justifyContent:'center'}}>
//             <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold }}>Special Instruction - </Text>
//           </View>
//           <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}}>
//             <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold }}>{order_details.special_instruction}</Text>
//           </View>
//         </View>
//       }
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent:'flex-start',
//     backgroundColor:colors.light_grey
//   },
//   button: {
//     paddingTop: 10,
//     paddingBottom: 10,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor:colors.theme_bg,
//     width:'49%',
//     borderWidth:1
//   },
//    button1: {
//     paddingTop: 15,
//     paddingBottom: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor:colors.theme_fg,
//     width:'100%',
//     borderWidth:1
//   },
// });


// export default LabOrderDetails;












import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, img_url, call, theme_color, currency, text } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { LoadLabOrderDetailsAction } from '../redux/actions/LabOrderDetailsActions';
import LabOrderDetailsShimmer from '../components/LabOrderDetailsShimmer';
import Moment from 'moment';
import { StatusBar } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons'; // Assuming you have an Icon component
import { ms, vs } from 'react-native-size-matters'; // Import size-matters
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';

const LabOrderDetails = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Destructure route params safely
  const { PriceFromSelectedTest, order_id: routeOrderId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [order_details, setOrderDetails] = useState(null);
  const [item_list, setItemList] = useState([]);
  const [order_id, setOrderId] = useState(routeOrderId);

  const [genderText, setGenderText] = useState('');

  useEffect(() => {
    if (order_id) {
      get_order_details();
    } else {
      // Handle case where order_id is missing
      alert("Order ID not found.");
      navigation.goBack();
    }
  }, [order_id]);

  const get_order_details = async () => {
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      const response = await dispatch(LoadLabOrderDetailsAction(order_id));
      const result = response.result;
      setOrderDetails(result);
      check_gender(result.patient_gender);
      setItemList(result.item_list || []);
    } catch (error) {
      console.log("Order Details Error:", error);
      alert('Sorry something went wrong fetching order details.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const check_gender = (gender_id) => {
    if (gender_id == 1) {
      setGenderText('Male');
    } else if (gender_id == 2) {
      setGenderText('Female');
    } else if (gender_id == 3) {
      setGenderText('Others')
    }
  }

  const contact = async (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    await Linking.openURL(phoneNumber);
  }

  // Helper for rendering key-value rows
  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const BillRow = ({ label, value }) => (
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>{label}</Text>
      <Text style={styles.billValue}>{value}</Text>
    </View>
  );

  // Helper for rendering Test Status Timeline steps
  // const renderStatusStep = (stepName, date, isCompleted) => (
  //   <View style={styles.statusStep}>
  //     <Icon
  //       type={Icons.Feather}
  //       name="check-circle"
  //       color={isCompleted ? colors.green : colors.light_grey}
  //       size={ms(20)}
  //       style={styles.statusIcon}
  //     />
  //     <View style={styles.statusContent}>
  //       <Text style={styles.statusName}>{stepName}</Text>
  //       {date && <Text style={styles.statusDate}>{date}</Text>}
  //     </View>
  //   </View>
  // );

  const renderStatusStep = (stepName, date, isCompleted, isLast = false) => (
    <View style={styles.statusStepRow}>
      {/* Left Timeline */}
      <View style={styles.timelineColumn}>
        <Icon
          type={Icons.Octicons}
          name="check-circle-fill"
          color={isCompleted ? colors.green : colors.light_grey}
          size={ms(20)}
          style={{ zIndex: 1, }}
        />

        {/* Vertical line */}
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: isCompleted ? colors.green : colors.light_grey },
            ]}
          />
        )}
      </View>

      {/* Right Content */}
      <View style={styles.statusContent}>
        <Text style={styles.statusName}>{stepName}</Text>
        {date && <Text style={styles.statusDate}>{date}</Text>}
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.fullGradient}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ID: LAB{order_id}</Text>
        </View>

        {loading && isInitialLoad ? (
          <LabOrderDetailsShimmer />
        ) : order_details ? (
          <ScrollView showsVerticalScrollIndicator={false}>

          {/* --- 1. Booking Status Header --- */}
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderText}>{order_details.status_for_customer || 'Booking Pending'}</Text>
          </View>

          {/* --- 2. Amount Paid Section --- */}
          <View style={styles.amountSection}>
            <Image
              source={require('.././assets/img/check_green.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
            <Text style={styles.amountPaidLabel}>Amount Paid</Text>
            <Text style={styles.amountPaidValue}>₹{order_details.total}</Text>
          </View>

          {/* --- 3. Order ID and Date/Time --- */}
          <View style={styles.orderIdDateRow}>
            <Text style={styles.orderIdText}>ID: LAB{order_details.id}</Text>
            <Text style={styles.orderDateText}>
              {Moment(order_details.created_at).format('DD MMM YYYY, h:mm A')}
            </Text>
          </View>

          {/* --- 4. Test Details --- */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Test Details</Text>

            <DetailRow
              label="Booking Type"
              value={order_details.booking_type == 1 ? 'Collect from Home' : 'Walk-in'}
            />

            <DetailRow
              label="Test Name"
              value={item_list.map(item => item.item_name).join(', ') || 'N/A'}
            />

            <DetailRow
              label="Nearest Trust lab center"
              value={order_details.lab_address || 'N/A'}
            />

            <DetailRow
              label="Slot Booking Date & Time"
              value={`${Moment(order_details.created_at).format('ddd,DD-MM-YYYY')}, ${Moment(order_details.created_at).format('h:mm A')}`}
            />
          </View>

          {/* --- 5. Patient Details --- */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Patient Details</Text>

            <DetailRow
              label="Patient Address"
              value={order_details.address || 'N/A'}
            />

            <DetailRow
              label="Date of Birth"
              value={Moment(order_details.patient_dob).format('DD-MM-YYYY') || 'N/A'}
            />

            <DetailRow
              label="Patient Name"
              value={order_details.patient_name || 'N/A'}
            />

            <DetailRow
              label="Age"
              // Simple age calculation (approximate)
              value={Moment().diff(Moment(order_details.patient_dob), 'years') || 'N/A'}
            />

            <DetailRow
              label="Gender"
              value={genderText || 'N/A'}
            />

            <DetailRow
              label="Relation"
              value={order_details.collective_person_name || 'Friend'} // Placeholder for relation data
            />
          </View>

          {/* --- 6. Test Status Timeline --- */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Test Status</Text>
            <Text style={styles.statusDescription}>
              All your booked test samples are updated in the reports and Analysis section. Please check your reports.
            </Text>

            {/* Placeholder Timeline - assuming a fixed set of steps */}
            {renderStatusStep("Booking Successfully", Moment(order_details.created_at).format('ddd,DD-MM-YYYY, h:mm A'), true)}
            {renderStatusStep("Booking Confirmed", Moment(order_details.created_at).format('ddd,DD-MM-YYYY, h:mm A'), true)}
            {renderStatusStep("Phlebotomist Partner", Moment(order_details.created_at).format('ddd,DD-MM-YYYY, h:mm A'), order_details.collective_person > 0)}
            {renderStatusStep("Collected sample", Moment(order_details.created_at).format('ddd,DD-MM-YYYY, h:mm A'), order_details.status === 'Sample submitted to lab')}
            {/* {renderStatusStep("Reports Updated", Moment(order_details.created_at).format('ddd,DD-MM-YYYY, h:mm A'), true)} */}
            {renderStatusStep(
              "Reports Updated",
              null,
              false,
              true
            )}
          </View>

          {/* --- 7. Bill Details --- */}
          <View style={[styles.card, { marginBottom: vs(20) }]}>
            <Text style={styles.cardTitle}>Bill Details</Text>

            <BillRow
              label="Item total"
              value={`₹${order_details.sub_total}`}
            />

            <BillRow
              label="Prom ( APPLT34 )"
              value={`-₹${order_details.discount}`}
            />

            <BillRow
              label="GST Taxes"
              value={`₹${order_details.tax}`}
            />

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{order_details.total}</Text>
            </View>
          </View>


          <View style={{ marginBottom: ms(60), }}>
            <Image source={text} resizeMode='contain' style={{ width: 'auto', height: vs(120) }} />
          </View>

        </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor
  },
  fullGradient: {
    flex: 1,
    paddingHorizontal: ms(10),
    paddingTop: ms(50),
  },

  headerButton: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: ms(15)
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  headerTitle: {
    fontFamily: bold,
    fontSize: ms(16),
    color: blackColor,
    marginLeft: ms(10),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(15),
    paddingVertical: vs(15),
    backgroundColor: colors.theme_fg_three,
    borderBottomWidth: 1,
    borderColor: colors.light_grey,
  },
  backButton: {
    paddingRight: ms(10),
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ms(10),
  },
  helpText: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.theme_fg_two,
    marginLeft: ms(5),
  },

  // --- 1. Status Header ---
  statusHeader: {
    backgroundColor: '#DCFCE7', // Light green background from image
    paddingVertical: vs(10),
    paddingHorizontal: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: ms(20),
    borderRadius: ms(15),
    marginTop: ms(10)
  },
  statusHeaderText: {
    fontFamily: bold,
    fontSize: ms(14),
    color: colors.green, // Darker green text
  },

  // --- 2. Amount Paid Section ---
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(10),
    paddingHorizontal: ms(15),
    backgroundColor: colors.theme_fg_three,
  },
  amountPaidLabel: {
    flex: 1,
    fontFamily: regular,
    fontSize: ms(14),
    color: 'green',
    marginLeft: ms(6),
  },
  amountPaidValue: {
    fontFamily: bold,
    fontSize: ms(18),
    color: colors.theme_fg_two,
  },

  // --- 3. Order ID and Date/Time ---
  orderIdDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(15),
    paddingVertical: vs(8),
    backgroundColor: colors.theme_fg_three,
  },
  orderIdText: {
    fontFamily: bold,
    fontSize: ms(14),
    color: blackColor,
  },
  orderDateText: {
    fontFamily: regular,
    fontSize: ms(11),
    color: colors.grey,
  },

  // --- Shared Card Style ---
  card: {
    // backgroundColor: colors.theme_fg_three,
    paddingHorizontal: ms(15),
    paddingVertical: ms(10)
    // marginTop: vs(8),
  },
  cardTitle: {
    fontFamily: bold,
    fontSize: ms(16),
    color: colors.theme_fg_two,
    marginBottom: vs(4),
  },

  // --- Key-Value Rows ---
  detailRow: {
    flexDirection: 'cloumn',
    marginBottom: vs(8),
  },
  detailLabel: {
    fontSize: ms(12),
    color: '#4B5563',
    marginVertical: ms(2)
  },
  detailValue: {
    fontFamily: regular,
    fontSize: ms(12),
    color: blackColor,
  },

  billRow: {
    flexDirection: 'row',
    marginBottom: vs(8),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  billLabel: {
    fontSize: ms(12),
    color: '#4B5563',
    marginVertical: ms(2)
  },
  billValue: {
    fontFamily: bold,
    fontSize: ms(14),
    color: blackColor,
  },

  // --- Test Status Timeline ---
  statusDescription: {
    // fontFamily: regular,
    fontSize: ms(11),
    color: '#374151',
    marginBottom: vs(15),
  },
  statusStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(20),
  },

  timelineColumn: {
    width: ms(30),
    alignItems: 'center',
    position: 'relative',
    marginRight: ms(15)
  },

  timelineLine: {
    position: 'absolute',
    top: ms(22),
    width: ms(2),
    height: '100%',
    alignSelf: 'center',
  },

  statusContent: {
    flex: 1,
    paddingLeft: ms(10),
  },

  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(15),
  },
  statusIcon: {
    marginRight: ms(10),
    marginTop: vs(2),

  },
  statusContent: {
    flex: 1,
  },
  statusName: {
    fontFamily: bold,
    fontSize: ms(14),
    color: colors.theme_fg_two,
  },
  statusDate: {
    // fontFamily: regular,s
    fontSize: ms(11),
    color: colors.grey,
  },

  // --- Bill Details ---
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
    paddingTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: colors.light_grey,
  },
  grandTotalLabel: {
    fontFamily: bold,
    fontSize: ms(14),
    color: colors.theme_fg_two,
  },
  grandTotalValue: {
    fontFamily: bold,
    fontSize: ms(16),
    color: colors.theme_fg_two,
  },
});

export default LabOrderDetails;
