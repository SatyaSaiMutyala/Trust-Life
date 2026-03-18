// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
// import * as colors from '../assets/css/Colors';
// import { bold, regular, api_url, customer_lab_pending_orders, img_url, empty_list } from '../config/Constants';
// import { useNavigation } from '@react-navigation/native';
// import DropShadow from "react-native-drop-shadow";
// import axios from 'axios';
// import Loader  from '../components/Loader';
// import { StatusBar } from '../components/StatusBar';

// const LabOrders = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [pending_list, setPendingList] = useState([]);

//   const order_details = (order_id) =>{
//     navigation.navigate("LabOrderDetails",{order_id:order_id})
//   }

//   useEffect(() => {
//     get_pending_list();
//   },[]);

//   const get_pending_list = async() => {
//     setLoading(true);
//     await axios({
//       method: 'post',
//       url: api_url + customer_lab_pending_orders,
//       data:{ customer_id:global.id }
//     })
//     .then(async response => {
//       setLoading(false);
//       setPendingList(response.data.result);
//     })
//     .catch( async error => {
//       setLoading(false);
//       alert('Sorry something went wrong')
//     });
//   }

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.box} onPress={order_details.bind(this,item.id)} activeOpacity={1}>
//       <DropShadow
//                 style={{
//                   shadowColor: "#000",
//                   shadowOffset: {
//                     width: 0,
//                     height: 0,
//                     },
//                   shadowOpacity: 0.2,
//                   shadowRadius: 5,
//                 }}
//       >
//       <View style={{ borderRadius:10, backgroundColor:colors.theme_fg_three}}>
//         <View style={{ width:'100%', borderWidth:1,borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three, padding:10, borderRadius:10}}>
//           <View style={{ flexDirection:'row' }}>
//             <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
//               <View style={{ height: 50, width: 50 }} >
//                 <Image style={{ height: undefined, width: undefined, flex:1 }} source={{uri: img_url+item.lab_image }}/>
//               </View>
//             </View>
//             <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
//               <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{ item.lab_name }</Text>
//               <View style={{ margin:1 }} />
//               <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.address }</Text>
//               <View style={{ margin:3 }} />
//               <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>#Order ID -{ item.id }</Text>
//             </View>
//           </View>
//           <View style={{ margin:5 }} />
//           <View style={{ borderBottomWidth:1, borderColor:colors.light_grey}} />
//           <View style={{ margin:5 }} />
//           <View style={{ flexDirection:'row' }}>
//             <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>Patient Name :</Text>
//             <View style={{ margin:2 }} />
//             <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.patient_name }</Text>
//           </View>
//           <View style={{ margin:5 }} />
//           <View style={{ flexDirection:'row', width:'100%'}}>
//             <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>Collective Person :</Text>
//             <View style={{ margin:2 }} />
//             {item.collective_person == 0 ?
//               <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Person will be assigned soon.</Text>
//               :
//               <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{ item.collective_person_name }</Text>
//             }
//           </View>
//         </View>
//         <View style={{ width:'90%', flexDirection:'row', padding:5, marginLeft:'5%'}}>
//           <View style={ styles.button }>
//             <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold}}>{item.status_for_customer}</Text>
//           </View>
//           <View style={{ margin:'1%' }}/>
//         </View>
//         <View style={{ margin:5 }} />
//         </View>
//         </DropShadow>
//       <View style={{ margin:10 }} />
//     </TouchableOpacity>
// );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//     <Loader visible={loading}/>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={{ margin:10 }} />
//         {pending_list.length == 0 ?
//           <View style={{ alignSelf:'center', justifyContent:'center', backgroundColor:colors.theme_bg_three}}>
//             <View style={{ height: 300, width: 350 }} >
//               <Image style={{ height: undefined, width: undefined, flex:1 }} source={empty_list}/>
//             </View>
//             <Text style={{ fontFamily:bold, fontSize:14, textAlign:'center', marginTop:'20%'}}>Orders Not receiver yet...</Text>
//             </View>
//           :
//           <FlatList
//             data={pending_list}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//           />
//         }
//         <View style={{ margin:5 }} />
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent:'flex-start',
//     backgroundColor:colors.theme_fg_three
//   },
//   image_style:{
//     width:70,
//     height:70,
//     borderRadius:10,
//     borderWidth:1,
//     borderColor:colors.theme_fg
//   },
//   box: {
//     marginLeft:10,
//     marginRight:10,
//   },
//    pickup_location:{
//     fontSize:12,
//     color:colors.grey,
//     fontFamily:bold,
//     marginLeft:5
//   },
//   drop_location:{
//     fontSize:12,
//     color:colors.grey,
//     fontFamily:bold,
//     marginLeft:5
//   },
//   button: {
//     paddingTop: 10,
//     paddingBottom: 10,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor:colors.theme_bg,
//     width:'100%',
//     borderWidth:1
//   },
//    button1: {
//     paddingTop: 10,
//     paddingBottom: 10,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor:colors.theme_fg,
//     width:'49%',
//     borderWidth:1
//   },
// });


// export default LabOrders;



import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { heading, interMedium, interRegular, img_url, empty_list } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import DropShadow from "react-native-drop-shadow";
import { useDispatch } from 'react-redux';
import { LoadLabPendingOrdersAction } from '../redux/actions/LabPendingOrdersActions';
import LabOrdersShimmer from '../components/LabOrdersShimmer';
import { StatusBar2 } from '../components/StatusBar';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, globalGradient2, primaryColor, whiteColor } from '../utils/globalColors';
import Icon, { Icons } from '../components/Icons';

const CATEGORIES = [
  'Tele Medical', 'Lab', 'Doctor', 'Medicines',
  'Coach', 'Counselling', 'Nurse', 'Physiotherapy',
  'Hospital', 'Wellness Center', 'Health Insurance', 'Ambulance',
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'current', label: 'Current' },
  { key: 'complete', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const MOCK_BOOKINGS = [
  {
    id: '1', status: 'Confirmed', date: '17 Feb 2026,12:30',
    doctor: 'Dr. Anil Sharma', specialty: 'General Physician', rating: 4.5,
    appointmentDate: '11:30, Mon,17 Feb,2026', actionType: 'video',
  },
  {
    id: '2', status: 'Completed', date: '17 Feb 2026,12:30',
    doctor: 'Dr. Anil Sharma', specialty: 'General Physician', rating: 4.5,
    appointmentDate: '11:30, Mon,17 Feb,2026', actionType: 'reschedule',
  },
  {
    id: '3', status: 'Cancelled', date: '17 Feb 2026,12:30',
    doctor: 'Dr. Anil Sharma', specialty: 'General Physician', rating: 4.5,
    appointmentDate: '11:30, Mon,17 Feb,2026', actionType: 'retry',
  },
];

const LabOrders = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pending_list, setPendingList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tele Medical');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const order_details = (order_id) => {
    navigation.navigate("LabOrderDetails", { order_id: order_id })
  }

  useEffect(() => {
    get_pending_list(activeTab, 1, true);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Lab') {
      get_pending_list(activeTab, 1, true);
    }
  }, [selectedCategory]);

  const get_pending_list = async (filter = 'all', page = 1, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setIsInitialLoad(true);
    }
    try {
      const response = await dispatch(LoadLabPendingOrdersAction(global.id, filter, 10, page));
      const orders = response.result || [];

      if (page === 1) {
        setPendingList(orders);
      } else {
        setPendingList(prev => [...prev, ...orders]);
      }

      setCurrentPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      console.log('this is orders list ------------>', orders[0]);
    } catch (error) {
      console.log(error);
      alert('Sorry something went wrong')
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setPendingList([]);
      setCurrentPage(1);
      get_pending_list(tab, 1, true);
    }
  }

  const loadMoreData = () => {
    if (!loadingMore && currentPage < lastPage) {
      setLoadingMore(true);
      get_pending_list(activeTab, currentPage + 1, false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    get_pending_list(activeTab, 1, false);
  }

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={primaryColor} />
      </View>
    );
  };

  // Function to determine the badge text and color based on order status
  const getStatusStyle = (status) => {
    let text = status.toUpperCase();
    let color = colors.theme_color; // Default color
    let backgroundColor = colors.light_green; // Default background for light theme

    if (status.includes('successfully')) {
      color = colors.green; // Darker green for successful
      text = 'Booking Successfully';
    } else if (status.includes('progress')) {
      color = colors.theme_fg_two; // Primary dark color for in progress
      text = 'In Progress';
    } else if (status.includes('pending')) {
      color = colors.orange;
      text = 'Pending';
    }
    return { text, color, backgroundColor };
  };


  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';

    const date = new Date(dateStr.replace(' ', 'T'));

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${yyyy}-${mm}-${dd}, ${hours}:${minutes}${ampm}`;
  };



  const renderItem = ({ item }) => {
    // Debug: Log booking_type to see what values are coming
    console.log('Booking Type for ID', item.id, ':', item.booking_type, typeof item.booking_type);

    // Determine the type of test based on booking_type
    // booking_type: 1 = Home Lab, 2 = Walk-in
    const testType = item.booking_type == 1 ? 'Home Lab' : item.booking_type == 2 ? 'Walk-in' : 'Walk-in';

    // Determine the status text and color
    const statusInfo = getStatusStyle(item.status_for_customer || 'Pending');

    return (
      <DropShadow
        style={styles.shadowContainer}
      >
        <TouchableOpacity style={styles.card} onPress={order_details.bind(this, item.id)} activeOpacity={0.8}>
          {/* Top Row: Type Badge and Status */}
          <View style={styles.cardHeader}>
            <View style={[styles.testTypeBadge, { backgroundColor: testType === 'Home Lab' ? primaryColor : primaryColor }]}>
              <Text style={[styles.testTypeLabel, { color: testType === 'Home Lab' ? whiteColor : whiteColor }]}>
                {testType}
              </Text>
            </View>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
          {/* Booking Details */}
          <View style={styles.detailRow}>
            <Text style={styles.idText}>ID: {item.id}</Text>
            <Text style={styles.dateText}>{formatDateTime(item.updated_at)}</Text>
          </View>
          {/* Test/Lab Name (Using Lab Name as a placeholder for the large test name) */}
          <Text style={styles.testNameText} numberOfLines={2} ellipsizeMode='tail'>{item.item_list[0].item_name}</Text>
          {/* Amount Paid */}
          <View style={styles.amountRow}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Image
                source={require('.././assets/img/check_green.png')}
                style={styles.checkIcon}
                resizeMode="contain"
              />
              <Text style={styles.amountLabel}>Amount Paid</Text>
            </View>
            <Text style={styles.amountValue}>₹{item.total_amount || '0'}</Text>
          </View>

          {/* View Details Button */}
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={order_details.bind(this, item.id)}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </DropShadow>
    );
  };

  const getBookingStatusConfig = (status) => {
    switch (status) {
      case 'Confirmed': return { color: '#065F46', bg: '#DCFCE7' };
      case 'Completed': return { color: '#92400E', bg: '#FEF3C7' };
      case 'Cancelled': return { color: '#991B1B', bg: '#FEE2E2' };
      default: return { color: '#374151', bg: '#F3F4F6' };
    }
  };

  const renderBookingCard = ({ item }) => {
    const sc = getBookingStatusConfig(item.status);
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingTopRow}>
          <View style={[styles.bookingBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.bookingBadgeText, { color: sc.color }]}>{item.status}</Text>
          </View>
          <Text style={styles.bookingDate}>{item.date}</Text>
        </View>
        <View style={styles.doctorRow}>
          <Text style={styles.doctorName}>{item.doctor}</Text>
          <View style={styles.ratingRow}>
            <Icon type={Icons.Ionicons} name="star" size={ms(14)} color="#FBBF24" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.specialtyText}>{item.specialty}</Text>
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentLabel}>Appointment Date & Time</Text>
          <Text style={styles.appointmentValue}>{item.appointmentDate}</Text>
        </View>
        {item.actionType === 'video' && (
          <>
            <TouchableOpacity style={styles.videoBtn} onPress={() => navigation.navigate('BookingDetailScreen', { booking: item })}>
              <Icon type={Icons.Ionicons} name="videocam-outline" size={ms(18)} color={whiteColor} />
              <Text style={styles.videoBtnText}>Start a Video call</Text>
            </TouchableOpacity>
            <Text style={styles.noteText}>Note : Please check your internet connection before joining the video call with the doctor</Text>
          </>
        )}
        {item.actionType === 'reschedule' && (
          <TouchableOpacity style={styles.rescheduleBtn} onPress={() => navigation.navigate('BookingDetailScreen', { booking: item })}>
            <Text style={styles.rescheduleBtnText}>Reschedule</Text>
          </TouchableOpacity>
        )}
        {item.actionType === 'retry' && (
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.navigate('BookingDetailScreen', { booking: item })}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const isHomeLab = selectedCategory === 'Lab';
  const isTeleMedical = selectedCategory === 'Tele Medical';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      <LinearGradient
        colors={globalGradient2}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.08]}
        style={styles.fullGradient}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Bookings</Text>
          </View>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
            <Text style={styles.dropdownText} numberOfLines={1}>{selectedCategory}</Text>
            <Icon type={Icons.Ionicons} name="chevron-down" size={ms(14)} color={blackColor} />
          </TouchableOpacity>
        </View>


        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tabIndicatorRow}>
          {TABS.map((tab) => (
            <View key={tab.key} style={[styles.tabIndicator, activeTab === tab.key && styles.tabIndicatorActive]} />
          ))}
        </View>

        {/* Content */}
        {loading && isInitialLoad ? (
          <LabOrdersShimmer />
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContent}
            data={isHomeLab ? pending_list : isTeleMedical ? MOCK_BOOKINGS : []}
            renderItem={isHomeLab ? renderItem : renderBookingCard}
            keyExtractor={(item) => item.id?.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={isHomeLab ? loadMoreData : undefined}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isHomeLab ? renderFooter : null}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyImageWrapper}>
                  <Image style={styles.emptyImage} source={empty_list} />
                </View>
                <Text style={styles.emptyText}>No bookings found...</Text>
              </View>
            }
          />
        )}

        {/* Category Dropdown Modal */}
        <Modal visible={dropdownVisible} transparent animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.modalItem, selectedCategory === cat && styles.modalItemActive]}
                    onPress={() => { setSelectedCategory(cat); setDropdownVisible(false); }}
                  >
                    <Text style={[styles.modalItemText, selectedCategory === cat && styles.modalItemTextActive]}>{cat}</Text>
                    {selectedCategory === cat && <Icon type={Icons.Ionicons} name="checkmark" size={ms(18)} color={primaryColor} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  fullGradient: { flex: 1, paddingTop: ms(50) },
  flatListContent: { paddingHorizontal: ms(16), paddingTop: vs(8), paddingBottom: vs(20) },

  // Header
  headerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: ms(20), marginBottom: vs(20),
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: ms(38), height: ms(38), borderRadius: ms(19),
    backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
    marginRight: ms(10),
  },
  headerTitle: { fontFamily: heading, fontSize: ms(22), color: whiteColor },
  dropdown: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: whiteColor, borderRadius: ms(20),
    paddingHorizontal: ms(14), paddingVertical: vs(8), gap: ms(6),
  },
  dropdownText: { fontFamily: interRegular, fontSize: ms(12), color: blackColor, maxWidth: ms(100) },

  // Tabs
  tabRow: { flexDirection: 'row', paddingHorizontal: ms(20), marginBottom: vs(2) },
  tab: { flex: 1, alignItems: 'center', paddingVertical: vs(10) },
  tabText: { fontFamily: interRegular, fontSize: ms(13), color: blackColor },
  tabTextActive: { fontFamily: interMedium, fontSize: ms(13), color: whiteColor },
  tabIndicatorRow: { flexDirection: 'row', paddingHorizontal: ms(20), marginBottom: vs(12) },
  tabIndicator: { flex: 1, height: ms(3), backgroundColor: '#E5E7EB', borderRadius: ms(2) },
  tabIndicatorActive: { backgroundColor: primaryColor },

  // Home Lab Card (existing API cards)
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.1, shadowRadius: ms(4),
    elevation: ms(5), marginBottom: vs(20),
  },
  card: {
    backgroundColor: '#F9FAFB', borderRadius: ms(16),
    padding: ms(15), overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: vs(10),
  },
  testTypeBadge: { paddingVertical: vs(4), paddingHorizontal: ms(10), borderRadius: ms(5) },
  testTypeLabel: { fontFamily: interRegular, fontSize: ms(10) },
  statusText: { fontFamily: interMedium, fontSize: ms(12) },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(5) },
  idText: { fontFamily: interRegular, fontSize: ms(12), color: colors.grey },
  dateText: { fontFamily: interRegular, fontSize: ms(12), color: colors.grey },
  testNameText: { fontFamily: interMedium, fontSize: ms(14), color: colors.theme_fg_two, marginBottom: vs(10) },
  amountRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(10),
  },
  checkIcon: { width: ms(16), height: ms(16), marginRight: ms(5) },
  amountLabel: { fontFamily: interRegular, fontSize: ms(12), color: colors.theme_fg_two, marginRight: ms(5) },
  amountValue: { fontFamily: interMedium, fontSize: ms(16), color: colors.theme_fg_two },
  viewDetailsButton: {
    paddingVertical: ms(12), marginHorizontal: ms(10),
    borderRadius: ms(40), backgroundColor: '#F3F4F6',
  },
  viewDetailsText: { fontFamily: interMedium, fontSize: ms(14), color: blackColor, textAlign: 'center' },

  // Tele Medical Booking Card
  bookingCard: {
    backgroundColor: whiteColor, borderRadius: ms(16),
    padding: ms(16), marginBottom: vs(14),
  },
  bookingTopRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  bookingBadge: { borderRadius: ms(20), paddingHorizontal: ms(14), paddingVertical: vs(5) },
  bookingBadgeText: { fontFamily: interMedium, fontSize: ms(12) },
  bookingDate: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280' },
  doctorRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: vs(2),
  },
  doctorName: { fontFamily: interMedium, fontSize: ms(14), color: blackColor },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: ms(4) },
  ratingText: { fontFamily: interMedium, fontSize: ms(13), color: blackColor },
  specialtyText: { fontFamily: interRegular, fontSize: ms(12), color: '#6B7280', marginBottom: vs(14) },
  appointmentRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  appointmentLabel: { fontFamily: interMedium, fontSize: ms(12), color: blackColor },
  appointmentValue: { fontFamily: interRegular, fontSize: ms(12), color: '#374151' },
  videoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: primaryColor, borderRadius: ms(25),
    paddingVertical: vs(12), gap: ms(8), marginBottom: vs(8),
  },
  videoBtnText: { fontFamily: interMedium, fontSize: ms(13), color: whiteColor },
  noteText: { fontFamily: interRegular, fontSize: ms(11), color: '#6B7280', lineHeight: ms(16) },
  rescheduleBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEF3C7', borderRadius: ms(25), paddingVertical: vs(12),
  },
  rescheduleBtnText: { fontFamily: interMedium, fontSize: ms(13), color: '#92400E' },
  retryBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: primaryColor, borderRadius: ms(25), paddingVertical: vs(12),
  },
  retryBtnText: { fontFamily: interMedium, fontSize: ms(13), color: whiteColor },

  // Dropdown Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: whiteColor, borderRadius: ms(16),
    width: '80%', maxHeight: '60%', padding: ms(20),
  },
  modalTitle: { fontFamily: interMedium, fontSize: ms(16), color: blackColor, marginBottom: vs(14) },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: vs(12), borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalItemActive: {
    backgroundColor: '#F0FDF4', marginHorizontal: ms(-8),
    paddingHorizontal: ms(8), borderRadius: ms(8),
  },
  modalItemText: { fontFamily: interRegular, fontSize: ms(14), color: '#374151' },
  modalItemTextActive: { fontFamily: interMedium, color: primaryColor },

  // Empty & Footer
  emptyContainer: {
    alignSelf: 'center', justifyContent: 'center',
    paddingHorizontal: ms(20), paddingVertical: vs(50),
  },
  emptyImageWrapper: { height: vs(250), width: ms(300), alignSelf: 'center' },
  emptyImage: { height: '100%', width: '100%' },
  emptyText: { fontFamily: interMedium, fontSize: ms(14), textAlign: 'center', marginTop: vs(20) },
  footerLoader: { paddingVertical: vs(20), alignItems: 'center' },
});


export default LabOrders;
