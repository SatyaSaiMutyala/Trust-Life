import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, pharmacy_order_list, api_url, img_url, mpesa, payment_status_update, payment_loader } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import Moment from 'moment';
import { connect } from 'react-redux';
import { updatePharmId, addToCart, updateSubtotal, reset } from '../actions/PharmOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from '../components/StatusBar';
import messaging from '@react-native-firebase/messaging';
import LottieView from 'lottie-react-native';

const MyOrdersHistories = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [order_list, setOrderList] = useState([]);
  const [mpesa_loading, setMpesaLoading] = useState(false);
  const [mpesa_id, setMpesaId] = useState(0);
  const [order_id, setOrderId] = useState(0);
  const [payment_mode_id, setPaymentModeId] = useState(1);

  const myorder_details = () => {
    navigation.navigate("MyOrderDetails")
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      grt_order_list();
    });

    const unsub = messaging().onMessage(async remoteMessage => {
      const { data } = remoteMessage;
      if (data != undefined) {
        const { status } = data;
        console.log('status' + status)
        if (status == 1) {
          setMpesaLoading(true);
          call_payment_status_update(2);
        } else if (status == 0) {
          alert("Sorry your payment request has been rejucted, please try again.")
          setMpesaLoading(false);
          navigation.goBack()
        }
      }
    });

    return (
      unsubscribe,
      unsub
    );
  }, []);

  const call_payment_status_update = async (payment_mode) => {
    console.log({ payment_mode: payment_mode, id: order_id })
    setMpesaLoading(true)
    await axios({
      method: 'post',
      url: api_url + payment_status_update,
      data: { id: order_id, payment_mode: payment_mode }
    })
      .then(async response => {
        setMpesaLoading(false)
        //navigation.goBack()
        grt_order_list();
      })
      .catch(error => {
        setMpesaLoading(false)
        alert(error);
      });
  }

  const call_booking_status_update = async (booking_type, payment_mode, id) => {
    console.log({ id: id, booking_type: booking_type, payment_mode: payment_mode })
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + payment_status_update,
      data: { id: id, booking_type: booking_type, payment_mode: payment_mode }
    })
      .then(async response => {
        setLoading(false)
        //navigation.goBack()
        grt_order_list();
      })
      .catch(error => {
        setLoading(false)
        alert(error);
      });
  }

  const call_mpesa = async (amount, id) => {
    console.log(api_url + mpesa + global.id + '/' + amount)
    setMpesaLoading(true)
    setOrderId(id);
    await axios({
      method: 'get',
      url: api_url + mpesa + global.id + '/' + amount,
    })
      .then(async response => {
        //setOrderId(id)
      })
      .catch(error => {
        alert('Sorry something went wrong1');
      });
  }

  const re_order = async (cart_items, sub_total, pharm_id) => {
    Alert.alert(
      "Confirm !",
      "Are you sure, You want to re-order this products?",
      [
        {
          text: "Cancel",
          onPress: () => { return false; },
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            await props.reset();
            add_to_cart(cart_items, sub_total, pharm_id);
            return true;
          }
        }
      ],
      { cancelable: false }
    );
  }

  const add_to_cart = async (cart_items, sub_total, pharm_id) => {
    await props.reset();
    await store_data(cart_items, sub_total.toFixed(2), pharm_id);
    await props.addToCart(cart_items);
    await props.updateSubtotal(sub_total.toFixed(2));
    await props.updatePharmId(pharm_id);
    await view_cart();
  }

  const view_cart = () => {
    navigation.navigate("PharmCart");
  }

  const store_data = async (cart_items, sub_total, pharm_id) => {
    try {
      await AsyncStorage.setItem('cart_items', JSON.stringify(cart_items));
      await AsyncStorage.setItem('sub_total', sub_total.toString());
      await AsyncStorage.setItem('pharm_id', pharm_id.toString());
    } catch (e) {
      alert(e);
    }
  }

  const grt_order_list = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + pharmacy_order_list,
      data: { customer_id: global.id }
    })
      .then(async response => {
        setLoading(false)
        // console.log(response.data.result[6])
        setOrderList(response.data.result)
      })
      .catch(error => {
        setLoading(false)
        alert("Sorry something went wrong");
      });
  }

  const show_products = (items) => {
    if (items) {
      const list = JSON.parse(items);
      return list.map((data) => {
        return (
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', padding: 5 }} >
            <View style={{ width: '10%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <View style={{ height: 25, width: 25, borderWidth: 1, borderColor: colors.theme_fg_three, borderRadius: 5 }} >
                <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 5 }} source={{ uri: img_url + data.image }} />
              </View>
            </View>
            <View style={{ width: '70%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, letterSpacing: 1 }}>{data.product_name}</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, letterSpacing: 1 }}>x{data.qty}</Text>
            </View>
          </View>
        )
      })
    } else {
      return (
        <Text style={{ fontFamily: bold, fontSize: 12, color: colors.grey }}>Please wait vendor will add your prescription products shortly</Text>
      )
    }
  }

  const move_rating = (data) => {
    navigation.navigate("OrderRating", { data: data });
  }

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 20, margin: 5 }} >
      <TouchableOpacity activeOpacity={1}>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}
        >
          <View style={{ padding: 0, borderRadius: 10, backgroundColor: colors.theme_fg_three }}>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={{ width: '100%', alignItems: 'center', backgroundColor: colors.theme_fg, borderColor: colors.theme_fg, borderWidth: 1, padding: 10, flexDirection: 'row', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} >
                <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: '70%', }}>
                  <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: bold }}>{item.status}</Text>
                </View>
              </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', backgroundColor: colors.theme_fg_three, padding: 15, borderRadius: 10 }} >
              <View style={{ width: '25%', alignItems: 'flex-start', justifyContent: 'center' }} >
                <View style={styles.pre_style8} >
                  <Image
                    style={styles.pre_style9}
                    source={{ uri: img_url + item.store_image }}
                  />
                </View>
              </View>
              <View style={{ width: '55%', alignItems: 'flex-start', justifyContent: 'center' }} >
                <View style={{ flexDirection: 'row' }} >
                  <Text style={{ fontSize: 14, color: colors.theme_fg, fontFamily: bold, textAlign: 'center', letterSpacing: 1 }}>{item.store_name}</Text>
                </View>
                <View style={{ margin: 3 }} />
                <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row' }}>
                  <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row' }}>
                    <Icon type={Icons.MaterialCommunityIcons} name="clipboard-list" style={{ fontSize: 15, color: colors.grey }} />
                    <View style={{ margin: 3 }} />
                    <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>#{item.id}</Text>
                  </View>
                  <View style={{ margin: 3 }} />
                  <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row' }}>
                    <Icon type={Icons.AntDesign} name="clockcircle" style={{ fontSize: 15, color: colors.grey }} />
                    <View style={{ margin: 3 }} />
                    <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{Moment(item.created_at).format('DD MMM-YY')}</Text>
                  </View>
                </View>
                <View style={{ margin: 3 }} />
                <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row' }}>
                  <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row' }}>
                    <Icon type={Icons.MaterialIcons} name="payments" style={{ fontSize: 15, color: colors.grey }} />
                    <View style={{ margin: 3 }} />
                    {item.payment_mode == 1 ?
                      <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Cash</Text>
                      :
                      <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Online</Text>
                    }
                  </View>
                  <View style={{ margin: 3 }} />
                  <View style={{ alignItems: 'center', width: '50%', flexDirection: 'row' }}>
                    <Icon type={Icons.MaterialCommunityIcons} name="truck-delivery" style={{ fontSize: 15, color: colors.grey }} />
                    <View style={{ margin: 3 }} />
                    {item.booking_type == 1 ?
                      <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Door Step</Text>
                      :
                      <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Take Away</Text>
                    }
                  </View>
                </View>
              </View>
            </View>
            <View style={{ width: '100%', borderTopWidth: 1, borderColor: colors.theme_fg, padding: 15, borderStyle: 'dashed' }} >
              <View style={{ flexDirection: 'row' }} >
                <Text style={{ fontSize: 14, color: colors.grey, fontFamily: bold }}>Ordered Items</Text>
                <View style={{ margin: 3 }} />
                <Icon type={Icons.FontAwesome5} name="shopping-bag" style={{ fontSize: 15, color: colors.grey }} />
              </View>
              <View style={{ margin: 5 }} />
              {item.items != null ?
                <View>
                  {show_products(item.items)}
                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.theme_fg_two, fontFamily: regular, fontSize: 12 }}>Please wait your products will be added by the {item.store_name} Store.</Text>
                </View>
              }
              <View style={{ margin: 5 }} />
            </View>
            <View style={{ width: '100%', flexDirection: 'row', borderTopWidth: 1, borderColor: colors.theme_fg, padding: 15, borderStyle: 'dashed' }} >
              <View style={{ width: '30%', alignItems: 'flex-start', justifyContent: 'center', }} >
                <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, letterSpacing: 1 }}>Total</Text>
              </View>
              {item.status_id == 6 ?
                <TouchableOpacity onPress={re_order.bind(this, JSON.parse(item.items), item.sub_total, item.vendor_id)} style={{ width: '30%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, borderRadius: 5, padding: 5 }} >
                  <Text style={{ fontSize: 12, color: colors.theme_fg_three, fontFamily: bold, letterSpacing: 1 }}>Re-order</Text>
                </TouchableOpacity>
                :
                <View style={{ width: '30%' }} />
              }
              <View style={{ width: '40%', alignItems: 'flex-end', justifyContent: 'center', }} >
                <Text style={{ fontSize: 14, color: colors.theme_fg_two, fontFamily: bold }}>{global.currency}{item.total}</Text>
              </View>
            </View>
            {item.rating == 0 && item.status_id == 6 &&
              <TouchableOpacity onPress={move_rating.bind(this, item)} style={{ marginBottom: 10, borderWidth: 1, borderRadius: 10, backgroundColor: colors.theme_bg, padding: 10, alignItems: 'center', justifyContent: 'center', width: '90%', marginLeft: '5%', marginRight: '5%' }}>
                <Text style={{ fontSize: 12, color: colors.theme_fg_three, fontFamily: bold }}>Add Rating</Text>
              </TouchableOpacity>
            }
            {item.status_id == 1 && item.total != 0 &&
              <View style={{ width: '100%', flexDirection: "row" }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%',}}>
                  {item.booking_type != 2 &&
                    <TouchableOpacity activeOpacity={1} onPress={call_booking_status_update.bind(this, 2, item.payment_mode, item.id)} style={{  borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg }}>
                      <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: regular, padding: 5, }}>Take Away</Text>
                    </TouchableOpacity>
                  }
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center',width: '50%', }}>
                {item.payment_mode != 2 &&
                  <TouchableOpacity activeOpacity={1} onPress={call_mpesa.bind(this, item.total, item.id)} style={{  borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg }}>
                    <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: regular, padding: 5, }}>Pay Online</Text>
                  </TouchableOpacity>
                }
              </View>
              </View>
            }
          <View style={{ margin: 5 }} />
        </View>
      </DropShadow>
    </TouchableOpacity>
    </View >
  );

return (
  <SafeAreaView style={styles.container}>
    <StatusBar />
    <Loader visible={loading} />
    {mpesa_loading == true &&
      <View style={{ height: '100%' }}>
        <LottieView style={{ flex: 1 }} source={payment_loader} autoPlay loop />
      </View>
    }
    <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
      <FlatList
        data={order_list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={{ margin: 50 }} />
    </ScrollView>
  </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.light_blue,
  },
  pre_style8: {
    height: 70,
    width: 70
  },
  pre_style9: {
    flex: 1,
    width: undefined,
    height: undefined,
    borderRadius: 10
  },
  active_door_step: { alignItems: 'center', justifyContent: 'center', width: '50%', padding: 5, borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg },
  inactive_door_step: { alignItems: 'center', justifyContent: 'center', width: '50%', padding: 5, borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg_three },
  active_payment_mode: { alignItems: 'center', justifyContent: 'center', width: '50%', padding: 5, borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg },
  inactive_payment_mode: { alignItems: 'center', justifyContent: 'center', width: '50%', padding: 5, borderWidth: 1, borderColor: colors.theme_bg, borderRadius: 5, backgroundColor: colors.theme_bg_three },
  active_delivery_label: { fontSize: 14, color: colors.theme_fg_three, fontFamily: regular },
  inactive_delivery_label: { fontSize: 14, color: colors.theme_fg_two, fontFamily: regular },
  active_payment_label: { fontSize: 14, color: colors.theme_fg_three, fontFamily: regular },
  inactive_payment_label: { fontSize: 14, color: colors.theme_fg_two, fontFamily: regular }
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
  reset: () => dispatch(reset()),
});

export default connect(null, mapDispatchToProps)(MyOrdersHistories);
