import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import * as colors from '../assets/css/Colors';
import { app_name, bold, api_url, img_url, get_payment_modes, normal } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { updatePaymentMode } from '../actions/AppointmentActions';
import { connect } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import Loader from '../components/Loader';
import { reset } from '../actions/PharmOrderActions';
import RBSheet from "react-native-raw-bottom-sheet";
import { labReset } from '../actions/LabOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paypalPaymentStatus } from '../actions/PaymentActions';
import { StatusBar } from '../components/StatusBar';
import { Paystack } from 'react-native-paystack-webview';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import axiosInstance from './AxiosInstance';
import WebView from 'react-native-webview';
import { Buffer } from 'buffer';


const PaymentMethods = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [payment_list, setPaymentList] = useState([]);
  const [is_error, setError] = useState(0);
  const wallet_ref = useRef(null);
  const [type, setType] = useState(route.params.type);
  const [from, setFrom] = useState(route.params.from);
  const [data, setData] = useState(route.params.data);
  const [resData, setResData] = useState(route.params.responseData);
  const [api_route, setApiRoute] = useState(route.params.route);
  const [amount, setAmount] = useState(route.params.amount);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paystack_id, setPaystackId] = useState(0);
  const [flutterwave_id, setFlutterwaveId] = useState(0);

  const [payuModalVisible, setPayuModalVisible] = useState(false);
  const [payuUrl, setPayuUrl] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (props.paypal_payment_status != 0) {
        move_action(props.paypal_payment_status)
      }
      console.log('route data ----------->', route.params.responseData);
      // payment_modes();
      setPaymentList([
        {
          id: "payu",
          slug: "payu",
          payment_name: "PayU Money",
          icon: "payu.png"
        }
      ]);
    });
    return unsubscribe;
  }, []);


  const handleOnRedirect = (data) => {
    setFlutterwaveId({ flutterwave_id: 0 });
    if (data.status == "successful") {
      move_action(id);
    } else {
      alert("Sorry, your payment declined");
    }
    //wallet_ref.current.open();
  }
  const close_flutterwave = () => {
    setFlutterwaveId({ flutterwave_id: 0 });
    wallet_ref.current.close();
  }

  const payment_modes = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + get_payment_modes,
      data: { type: type, customer_id: global.id }
    })
      .then(async response => {
        setLoading(false)
        setPaystackId(0)
        setFlutterwaveId(0);
        if (props.paypal_payment_status != 0) {
          move_action(props.paypal_payment_status)
        } else if (response.data.status == 1) {
          setPaymentList(response.data.result.payment_modes);
          setWallet(response.data.result.wallet_balance);
        } else {
          setError(1);
        }
      })
      .catch(error => {
        setLoading(false)
        alert('Sorry something went wrong');
      });
  }

  // https://www.mytrustlab.com/pay-U-succss
  // about:blank

  const payuWebView = async () => {
    const txnId = Date.now().toString();

    const sendData = {
      txnId: txnId,
      amount: amount.toString(),
      productName: "Appointment Payment",
      firstName: global.customer_name,
      email: global.email
    };

    try {
      // Call your backend to get hash
      const response = await axiosInstance.post('customer/payu_hash', sendData);
      const { hash, key } = response.data;
      const html = `
  <form id="payuForm" action="https://secure.payu.in/_payment" method="post">
    <input type="hidden" name="key" value="${key}" />
    <input type="hidden" name="txnid" value="${txnId}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="firstname" value="${global.customer_name}" />
    <input type="hidden" name="email" value="${global.email}" />
    <input type="hidden" name="productinfo" value="Appointment Payment" />
    <input type="hidden" name="surl" value="https://www.mytrustlab.com/pay-U-succss" />
    <input type="hidden" name="furl" value="about:blank" />
    <input type="hidden" name="hash" value="${hash}" />
  </form>
  <script>
    // submit the form
    document.getElementById('payuForm').submit();

    // listen for PayU redirect and send data to React Native
    window.addEventListener('load', function() {
      const params = {};
      if (document.forms[0]) {
        const form = document.forms[0];
        for (let i = 0; i < form.elements.length; i++) {
          const e = form.elements[i];
          params[e.name] = e.value;
        }
      }
      // send params to React Native
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(params));
    });
  </script>
`;


      const base64Html = Buffer.from(html, 'utf8').toString('base64');
      setPayuUrl(`data:text/html;base64,${base64Html}`);
      setPayuModalVisible(true);

    } catch (e) {
      console.log("PayU Hash Error", e);
      alert("Payment failed, please try again");
    }
  };



  const razorpay = async (id) => {
    var options = {
      description: 'Online Payment',
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: parseInt(100 * amount),
      name: app_name,
      prefill: {
        email: global.email,
        contact: global.phone_number,
        name: global.customer_name
      },
      theme: { color: colors.theme_bg }
    }
    await RazorpayCheckout.open(options).then((data) => {
      console.log('is is done ---->', data);
      console.log('this is id---->', id);
      console.log('response -->', resData.id);
      const paymentId = data.razorpay_payment_id;
      const orderId = resData.id;
      handlePayment(paymentId, orderId);

      // move_action(id);
    }).catch((error) => {
      // handle failure
      console.log(error)
      alert('Your Transaction is declined');
    });
  }

  const handlePayment = async (paymentId, orderId) => {
    setLoading(true);
    const data = {
      "customer_id": global.id,
      "order_id": orderId,
      "payment_mode": type,
      "payment_response": "Success",
      "transaction_id": paymentId
    }
    console.log("passing data-------->", data);
    try {
      const response = await axiosInstance.post('customer/payment', data)
      console.log('Payment Done --->', response.data);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } catch (e) {
      console.log('Error occured -->', e);
      console.log('Status:', e.response?.status);
      console.log('Body:', e.response?.data);
    } finally {
      setLoading(false)
    }
  }

  const pay_with_wallet = async (id) => {
    if (amount > wallet) {
      alert('Sorry insufficient wallet balance');
    } else {
      move_action(id);
      wallet_ref.current.close();
    }
  }

  // const move_to_room = (id, doctor_id) => {
  //   navigation.navigate('VideoCall', { id: id, doctor_id: doctor_id })
  // }

  const move_to_room = (id) => {
    navigation.navigate('Agora', { id: id })
  }

  const move_action = async (id) => {
    let form_data = await data;
    form_data.payment_mode = await id;
    if (from == "doctor_list") {
      console.log(api_url + api_route)
      console.log(form_data)
      setLoading(true)
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.result.consultation_type == 1 && response.data.status == 1) {
            move_to_room(response.data.result.id);
          } else if (response.data.result.consultation_type == 2 && response.data.status == 1) {
            alert('Your appointment created successfully');
            await navigate();
          } else {
            alert('Sorry something went wrong')
          }
        })
        .catch(error => {
          setLoading(false)
          console.log(error)
          alert('Sorry something went wrong');
        });
    } else if (from == 'appointment') {
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.status == 1) {
            alert('Your appointment created successfully');
            await navigate();
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(api_route)
          alert('Sorry something went wrong');
        });
    } else if (from == "pharm_cart") {
      console.log(form_data);
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          setLoading(false);
          if (response.data.status == 1) {
            alert('Order placed successfully')
            await reset_pharm_data();
            await props.reset();
            await navigate();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
    } else if (from == "lab_cart") {
      console.log(form_data);
      setLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_route,
        data: form_data
      })
        .then(async response => {
          console.log(response)
          setLoading(false);
          if (response.data.status == 1) {
            alert('Order placed successfully')
            await props.labReset();
            await navigate();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          alert('Sorry something went wrong');
        });
    }
  }

  const reset_pharm_data = async () => {
    try {
      await AsyncStorage.removeItem('cart_items');
      await AsyncStorage.removeItem('sub_total');
      await AsyncStorage.removeItem('pharm_id');
    } catch (e) {
      alert(e);
    }
  }

  const navigate = async () => {
    await props.paypalPaymentStatus(0);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  // const select_payment = async (data) => {
  //   setFlutterwaveId(0);
  //   await props.updatePaymentMode(data.id);
  //   if (data.slug == "razorpay") {
  //     await razorpay(data.id);
  //   } else if (data.slug == "paypal") {
  //     await navigate_paypal(data.id);
  //   } else if (data.slug == "paystack") {
  //     await setPaystackId(1);
  //   } else if (data.slug == "flutterwave") {
  //     await setFlutterwaveId(1);
  //   }
  //   else {
  //     await pay_with_wallet(data.id);
  //   }
  // }


  const select_payment = async (data) => {
    if (data.slug === "payu") {
      await payuWebView();
    } else {
      alert("Payment method not available");
    }
  };


  const navigate_paypal = (payment_id) => {
    navigation.navigate("Paypal", { payment_id: payment_id, type: type, amount: amount, data: data, route: api_route, from: from })
  }
  const renderItem = ({ item }) => (
    <View style={{ margin: 10 }}>
      <TouchableOpacity onPress={select_payment.bind(this, item)} style={styles.button}>
        <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center', padding: 15 }}>
          <View style={{ height: 25, width: 25 }}>
            <Image style={{ height: undefined, width: undefined, flex: 1 }} source={{ uri: img_url + item.icon }} />
          </View>
        </View>
        <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey, fontFamily: bold, }}>{item.payment_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <FlatList
          data={payment_list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>


      <Modal visible={payuModalVisible} animationType="slide" onRequestClose={() => setPayuModalVisible(false)}>
        <View style={{ flex: 1 }}>

          {/* Live Payment Code */}
          <WebView
            source={{ uri: payuUrl }}
            javaScriptEnabled
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              setPayuModalVisible(false);

              if (data.status === 'success') {
                handlePayment(data.mihpayid, resData.id); // real PayU response
              } else {
                alert('Payment Failed');
              }
            }}
          />


          {/* <WebView
            source={{ uri: payuUrl }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            startInLoadingState={true}
            onNavigationStateChange={(nav) => {
              if (nav.url.includes("success")) {
                setPayuModalVisible(false);
                handlePayment("PAYU_SUCCESS", resData.id);
              }
              if (nav.url.includes("failure")) {
                setPayuModalVisible(false);
                alert("Payment Failed");
              }
            }}
          /> */}
        </View>
      </Modal>


      {props.paypal_payment_status != 0 &&
        <TouchableOpacity activeOpacity={1} onPress={payment_modes} style={{ height: 40, position: 'absolute', bottom: 10, width: '100%', backgroundColor: colors.theme_bg, padding: 10, alignItems: 'center', justifyContent: 'center', width: '90%', marginLeft: '5%', borderRadius: 10 }}>
          <Text style={{ fontFamily: bold, color: colors.theme_fg_three, fontSize: 16 }}>
            Place Order
          </Text>
        </TouchableOpacity>
      }
      <View>
        {paystack_id == 1 &&
          <Paystack
            paystackKey={global.paystack_key}
            amount={amount}
            billingEmail="paystackwebview@something.com"
            activityIndicatorColor="green"
            onCancel={(e) => {
              console.log(e)
              // handle response here
            }}
            onSuccess={(res) => {
              console.log(e)
              // handle response here
            }}
            autoStart={true}
          />
        }

      </View>
      {flutterwave_id == 1 &&
        <View>
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: Date.now() + '-' + global.id,
              authorization: global.flutterwave_public_key,
              customer: {
                email: global.email
              },
              amount: amount,
              currency: 'NGN',
              payment_options: 'card'
            }}
          />
          <View style={{ margin: 10 }} />
          <Text style={{ fontFamily: normal, color: colors.theme_fg_two, alignSelf: 'center', fontSize: 16 }} onPress={close_flutterwave}>Cancel</Text>
        </View>
      }


    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: colors.theme_fg_three
  },
});

function mapStateToProps(state) {
  return {
    payment_mode: state.appointment.payment_mode,
    paypal_payment_status: state.payment.paypal_payment_status
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePaymentMode: (data) => dispatch(updatePaymentMode(data)),
  reset: () => dispatch(reset()),
  labReset: () => dispatch(labReset()),
  paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
