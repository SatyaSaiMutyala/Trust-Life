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



import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, img_url, empty_list, theme_color } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import DropShadow from "react-native-drop-shadow";
import { useDispatch } from 'react-redux';
import { LoadLabPendingOrdersAction } from '../redux/actions/LabPendingOrdersActions';
import LabOrdersShimmer from '../components/LabOrdersShimmer';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import Icon, { Icons } from '../components/Icons';

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

  const order_details = (order_id) => {
    navigation.navigate("LabOrderDetails", { order_id: order_id })
  }

  useEffect(() => {
    get_pending_list(activeTab, 1, true);
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />

      <LinearGradient
        colors={globalGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.06]}
        style={styles.fullGradient}
      >
        {/* Header - Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Test Bookings</Text>
        </View>

        {loading && isInitialLoad ? (
          <LabOrdersShimmer />
        ) : (
          <>
            {/* Filter buttons */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeTab === 'all' && styles.filterButtonActive,
                ]}
                onPress={() => handleTabChange('all')}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeTab === 'all' && styles.filterTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeTab === 'inprogress' && styles.filterButtonActive,
                ]}
                onPress={() => handleTabChange('inprogress')}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeTab === 'inprogress' && styles.filterTextActive,
                  ]}
                >
                  In Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeTab === 'complete' && styles.filterButtonActive,
                ]}
                onPress={() => handleTabChange('complete')}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeTab === 'complete' && styles.filterTextActive,
                  ]}
                >
                  Completed
                </Text>
              </TouchableOpacity>
            </View>

            {pending_list.length == 0 ?
              <View style={styles.emptyContainer}>
                <View style={styles.emptyImageWrapper} >
                  <Image style={styles.emptyImage} source={empty_list} />
                </View>
                <Text style={styles.emptyText}>No orders found...</Text>
              </View>
              :
              <FlatList
                contentContainerStyle={styles.flatListContent}
                data={pending_list}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            <View style={{ margin: vs(10) }} />
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_fg_three,
  },
  flatListContent: {
    paddingHorizontal: ms(15),
    paddingVertical: vs(10),
  },
  fullGradient: {
    flex: 1,
    // paddingHorizontal: ms(20),
    paddingTop: ms(50),
  },
  headerButton: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(20),
    marginHorizontal: ms(15)
  },
  headerTitle: {
    fontFamily: bold,
    fontSize: ms(18),
    color: colors.theme_fg_three,
    marginLeft: ms(10),
  },

  // --- Filter Styles (Matching Image 160) ---
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: ms(15),
    marginBottom: vs(10),
  },
  filterButton: {
    paddingVertical: vs(8),
    paddingHorizontal: ms(15),
    borderRadius: ms(20),
    marginRight: ms(10),
    backgroundColor: colors.theme_fg_three,
  },
  filterButtonActive: {
    paddingVertical: vs(8),
    paddingHorizontal: ms(15),
    borderRadius: ms(20),
    backgroundColor: primaryColor,
    marginRight: ms(10),
  },
  filterText: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.theme_fg_two,
  },
  filterTextActive: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.theme_fg_three, // White text
  },

  // --- Card Styles (Matching Image 160) ---
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: ms(5),
    marginBottom: vs(20),
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: ms(16),
    padding: ms(15),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  testTypeBadge: {
    paddingVertical: vs(4),
    paddingHorizontal: ms(10),
    borderRadius: ms(5),
    // Color handled dynamically in renderItem
  },
  testTypeLabel: {
    fontFamily: regular,
    fontSize: ms(10),
    // Color handled dynamically in renderItem
  },
  statusText: {
    fontFamily: bold,
    fontSize: ms(12),
    // Color handled dynamically in renderItem
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  idText: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.grey,
  },
  dateText: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.grey,
  },
  testNameText: {
    fontFamily: bold,
    fontSize: ms(14),
    color: colors.theme_fg_two,
    marginBottom: vs(10),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  checkIcon: {
    width: ms(16),
    height: ms(16),
    marginRight: ms(5),
    // tintColor: colors.green,
  },
  amountLabel: {
    fontFamily: regular,
    fontSize: ms(12),
    color: colors.theme_fg_two,
    marginRight: ms(5),
  },
  amountValue: {
    fontFamily: bold,
    fontSize: ms(16),
    color: colors.theme_fg_two,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light_grey,
    marginBottom: vs(10),
  },
  viewDetailsButton: {
    // borderWidth:1,
    // borderColor:'#D1D5DB',
    paddingVertical: ms(12),
    marginHorizontal: ms(10),
    borderRadius: ms(40),
    backgroundColor: '#F3F4F6'
  },
  viewDetailsText: {
    fontFamily: bold,
    fontSize: ms(14),
    color: blackColor,
    textAlign: 'center'
  },

  // --- Empty State Styles ---
  emptyContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_fg_three,
    paddingHorizontal: ms(20),
    paddingVertical: vs(50),
  },
  emptyImageWrapper: {
    height: vs(250),
    width: ms(300),
    alignSelf: 'center',
  },
  emptyImage: {
    height: '100%',
    width: '100%',
  },
  emptyText: {
    fontFamily: bold,
    fontSize: ms(14),
    textAlign: 'center',
    marginTop: vs(20)
  },
  footerLoader: {
    paddingVertical: vs(20),
    alignItems: 'center',
  },
});


export default LabOrders;
