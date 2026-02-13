import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, tablet, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux';
import UIStepper from 'react-native-ui-stepper';
import { updatePharmId, reset, addToCart, updateSubtotal  } from '../actions/PharmOrderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PharmProductDetails = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState(route.params.data);
  const [view_value, setViewValue] = useState(true);
  const [pharm_id, setPharmId] = useState(route.params.pharm_id);

  const handleBackButtonClick = () => {
    navigation.goBack();
  };

  const check_vendor = async() =>{
    if(props.pharm_id == pharm_id || props.pharm_id == undefined){
      setViewValue(true);
      return true;
    }else{
      setViewValue(false);
      Alert.alert(
        "Reset !",
        "You are select products from another pharmacies. Can we remove existing items from cart?",
        [
          {
            text: "Cancel",
            onPress: () => { return false; },
            style: "cancel"
          },
          { text: "OK", onPress: async() => { 
            await props.reset();
            props.updatePharmId(pharm_id);
            this.setState({ view_value : false });
            alert('Now you can add products');
            return true;
          } }
        ],
        { cancelable: false }
      );
      
    }
  }

  const add_to_cart = async (qty,item_id,item_name,price,item_image,unit) => {
    if(check_vendor()){
      let cart_items = await props.cart_items;
      let old_item_details = await cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
      let sub_total = await parseFloat(props.sub_total);
      let total_price = await parseFloat(qty * price);
      if(old_item_details != undefined && total_price > 0){
        let final_price = await parseFloat(total_price) - parseFloat(old_item_details.price);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }else if(total_price > 0){
        let final_price = await parseFloat(qty * price);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }
      if(qty > 0){
        let item = await {
          product_id: item_id,
          product_name: item_name,
          unit:unit,
          qty: qty,
          price_per_item: parseFloat(price),
          price:parseFloat(qty * price),
          image:item_image
        }
        if(old_item_details != undefined){
          cart_items[props.cart_items.findIndex(x => x.product_id == item_id)] = await item;
        }else{
          await cart_items.push(item);
        }
        
        const st_items = cart_items.filter(el => Object.keys(el).length);
        await store_data(st_items,sub_total.toFixed(2),pharm_id)
        await props.addToCart(st_items);
        await props.updateSubtotal(sub_total.toFixed(2));
        await props.updatePharmId(pharm_id);
       }else{
          delete cart_items[props.cart_items.findIndex(x => x.product_id == item_id)];
          const st_items = cart_items.filter(el => Object.keys(el).length);
          sub_total = parseFloat(sub_total) - parseFloat(price);
          await store_data(st_items,sub_total.toFixed(2),pharm_id)
          await props.addToCart(st_items);
          await props.updateSubtotal(sub_total);
       }   
    }
    
  }

  const store_data = async(cart_items,sub_total,pharm_id) =>{
    try{
        await AsyncStorage.setItem('cart_items', JSON.stringify(cart_items));
        await AsyncStorage.setItem('sub_total', sub_total.toString());
        await AsyncStorage.setItem('pharm_id', pharm_id.toString());
    }catch (e) {
        alert(e);
    }
  }

  const view_cart = () =>{
    if(global.id == 0){
      navigation.navigate("CheckPhone")
    }else{
      navigation.navigate("PharmCart");
    }
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding:10}} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={handleBackButtonClick.bind(this)} style={{ width:'100%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_three} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <View style={{ alignItems:'center', justifyContent:'center'}} >
          <View style={{ height:230, width:230}} >
            <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={tablet} />
          </View>
        </View>
        <View style={{ margin:10 }}/>
        <View style={{borderWidth:0.5, borderColor:colors.theme_fg_three, width:'100%', backgroundColor:colors.theme_bg_three, borderRadius:30, padding:30}} >
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:'90%' , justifyContent:'center', alignItems:'flex-start' }}>
              <Text style={{ color:colors.black, fontFamily:bold, fontSize:20}}>{data.product_name}</Text>
            </View>
          </View>
          <View style={{ margin:10}}/>
          <View style={{ flexDirection:'row', width:'100%' }}>
            <View style={{ width:'30%' }}>
              <Text style={{ color:colors.black, fontFamily:regular, fontSize:12}}>Unit - {data.unit}</Text>
            </View>
            <View style={{ width:'70%', alignItems:'flex-end' }}>
              <View style={{ width:90, borderWidth:1, borderColor:colors.theme_fg, borderRadius:10, padding:4 }}>
                <UIStepper
                  displayValue={view_value}
                  tintColor={colors.theme_fg}
                  width={80}
                  height={20}
                  imageWidth={10}
                  fontFamily={bold}
                  textColor={colors.theme_fg}
                  borderColor={colors.theme_fg_three}
                  fontSize={14}
                  initialValue={props.cart_items[props.cart_items.findIndex(x => x.product_id == data.id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == data.id)].qty : 0 }
                  value={props.cart_items[props.cart_items.findIndex(x => x.product_id == data.id)] ? props.cart_items[props.cart_items.findIndex(x => x.product_id == data.id)].qty : 0 }
                  onValueChange={(value) => { add_to_cart(value,data.id,data.product_name,data.price,data.image,data.unit) }}
                />
              </View>
            </View>
          </View>
          <View style={{ margin:10 }}/>
          <Text style={{ color:colors.black, fontFamily:bold, fontSize:16}}>Product Detail</Text>
          <View style={{ margin:5 }}/>
          <Text style={{ color:colors.black, fontFamily:regular, fontSize:12}}>{data.description}</Text>
          <View style={{ margin:5 }}/>
          <Text style={{ color:colors.black, fontFamily:bold, fontSize:18}}>{global.currency}{data.price}</Text>
          <View style={{ margin:10 }}/>
          <View style={{ width:'100%', flexDirection:'row'}}>
            <View style={{ width:'20%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{ width:'80%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_yellow, borderRadius:15, padding:5, height:40}}>
                <Icon type={Icons.Ionicons} name="cart-sharp" color={colors.theme_fg_three} style={{ fontSize:20 }} />
                {props.cart_count != undefined &&
                  <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:16, backgroundColor:'red', borderRadius:10, justifyContent:'center', textAlign:'center', position:'absolute', top:-12, left:35, width:20 }}>{props.cart_count}</Text>
                }
              </View>
            </View>
            <View style={{ width:'80%', alignItems:'flex-end', justifyContent:'center'}}>
              <TouchableOpacity onPress={view_cart.bind(this)} style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.regular_blue, borderRadius:15, padding:5, height:40}}>
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>View Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ margin:10 }}/>
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.yellow,
  },
   
});

function mapStateToProps(state){
  return{
    pharm_id : state.order.pharm_id,
    cart_items : state.order.cart_items,
    cart_count : state.order.cart_count,
    sub_total : state.order.sub_total,
    delivery_charge : state.order.delivery_charge,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updatePharmId: (data) => dispatch(updatePharmId(data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(PharmProductDetails);
