import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, customer_lab_packages, api_url, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropShadow from "react-native-drop-shadow";
import axios from 'axios';
import Loader from '../components/Loader';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';

const Packages = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [lab_id, setLabId] = useState(route.params.lab_id);
  const [relevance_id, setRelevanceId] = useState(route.params.relevance_id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const package_detail = (package_id, package_name) => {
    navigation.navigate("PackageDetail", { package_id: package_id, package_name: package_name, lab_id: lab_id })
  }

  useEffect(() => {
    get_lab_packages();
  }, []);

  const cart = () => {
    navigation.navigate("LabCart")
  }

  const get_lab_packages = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_lab_packages,
      data: { lab_id: lab_id, relevance_id: relevance_id }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.status == 1) {
          setData(response.data.result)
        }
      })
      .catch(async error => {
        setLoading(false);
        alert('Sorry something went wrong')
      });
  }

  const renderItem = ({ item }) => (
    <View style={styles.box}>
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
        <View style={{borderRadius:10, backgroundColor:colors.theme_fg_three}}>

        <TouchableOpacity onPress={package_detail.bind(this, item.id, item.package_name)}>
          <View style={{ padding:10, width:'100%', flexDirection:'row' }}>
            <View style={{ width:'30%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start' }}>
              <View style={styles.image} >
                <Image style= {{ height: undefined,width: undefined,flex: 1, borderRadius:10 }} source={{ uri:img_url + item.package_image }} />
              </View>  
            </View>
            <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:23}}>{ item.package_name }</Text>
              <View style={{ margin:5 }}/>
              <Text numberOfLines={2} style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{ item.short_description }</Text>
              <View style={{ margin:5 }}/>
              <View style={{ flexDirection:'row', width:'100%' }}>
                <View style={{ width:'100%', alignItems:'flex-start', flexDirection:'row' }}>
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14}}>{global.currency}{ item.price }</Text>
                  <Text style={{ color:colors.theme_fg_two,textDecorationLine: 'line-through',marginLeft: 10, fontFamily:bold, fontSize:14}}>
                    {global.currency}1800
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ justifyContent:'center',flexDirection:'row' }}>

            {/* <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={ styles.button2 }>

              <TouchableOpacity onPress={package_detail.bind(this, item.id, item.package_name)} style={ styles.button }>
                 <Icon type={Icons.Ionicons} name="add" color={colors.theme_fg_three} style={{ fontSize:18, fontFamily:bold }} /> 
                <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>View Details</Text>
              </TouchableOpacity>

            </LinearGradient>
             */}

            {/* <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={ styles.button2 }>

              <TouchableOpacity onPress={cart} style={ styles.button }>
                {/* <Icon type={Icons.Ionicons} name="add" color={colors.theme_fg_three} style={{ fontSize:18, fontFamily:bold }} /> */}
                {/* {Item.addCart ?
                  <TouchableOpacity  style={ {alignItems:'center',paddingHorizontal:20} } onPress={addToCart.bind(this,Item.id,Item)}>
                    <Icon type={Icons.AntDesign} name="delete" color={colors.theme_bg_three} style={{ fontSize:30 , }}  />
                  </TouchableOpacity>:
                  <TouchableOpacity  style={ {alignItems:'center',paddingHorizontal:20}  } onPress={addToCart.bind(this,Item.id,Item)}>
                      <Text style={{ fontSize:16, color:colors.theme_bg_three, fontFamily:'bold'}}>Add</Text>
                  </TouchableOpacity>
                } */}
                {/* <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add to Cart</Text>
              </TouchableOpacity>

            </LinearGradient> */} 
        </View>
        </View>
        </DropShadow>
    </View>
    // <View style={styles.container}>
    //   <View style={styles.inner_container}>
    //     <View style={styles.searchContainer}>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Search"
    //         value={search}
    //         onChangeText={setSearch}
    //       />
    //     </View>
    //     <View style={styles.cancelContainer}>
    //       <TouchableOpacity onPress={() => setSearch('')}>
    //         <Text style={styles.cancelText}>Cancel</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>

    //   <View style={styles.recomendedView}>
    //     <Text style={styles.recomendedText}>RECOMMENDED FOR THYROID TESTS</Text>
    //   </View>

    //   <View style={styles.cardView}>
    //     <View style={styles.imageView}>
    //         <Image style={styles.imageTag} source={{ uri:img_url + item.package_image }}  />
    //     </View>
    //     <View style={styles.contentView}>

    //     </View>
    //   </View>
    // </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  inner_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4F9FC',
    backgroundColor: '#bcced3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: '#000000',
  },
  cancelContainer: {
    marginLeft: 10,
  },
  cancelText: {
    color: 'green',
    fontSize: 16,
    fontWeight: bold,
  },
  recomendedView :{
    paddingHorizontal:20,
    paddingVertical:5
  },
  recomendedText : {
    color:'green',
    fontSize:10,
  },
  cardView : {
    flex : 1,
    flexDirection : 'row',
    borderWidth:2,
    borderColor:'red',
    marginHorizontal:10,
    marginVertical: 5,
  },
  imageView:{
    borderWidth:1,
    borderColor:'green',
    flex:1.5
  },
  contentView :{
    flex:3.5,
    borderWidth:1,
    borderColor:'yellow'
  },
  imageTag:{
    width:30,
    },



  image_style: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.theme_fg
  },
  button2: {
    padding: 3,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10
  },
  box: {
    margin: 5,
  },
  pickup_location: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: bold,
    marginLeft: 5
  },
  drop_location: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: bold,
    marginLeft: 5
  },
  image: {
    height: 95,
    width: 95,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.light_grey
  },
  button: {
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
});


export default Packages;
