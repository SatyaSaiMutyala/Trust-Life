// //import liraries
// import React, {useCallback, useEffect, useState} from 'react';
// import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image, Dimensions, Keyboard, FlatList, TouchableHighlight, BackHandler, Alert} from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import * as colors from '../assets/css/Colors';
// import { bold, regular, } from '../config/Constants';
// import Icon, { Icons } from '../components/Icons';
// import LinearGradient from 'react-native-linear-gradient';
// import { StatusBar } from '../components/StatusBar';
// import { Picker } from '@react-native-picker/picker';
// // import { LineChart } from "react-native-gifted-charts";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart
// } from "react-native-chart-kit";
// import { GradientView } from '../components/LinearCompounent';

// const {width, height,fontScale} = Dimensions.get('window');

// const AnalysisChart = () => {
//     const navigation = useNavigation();
//     const route = useRoute()
//     const [categories, setCategories] = useState(route.params.type);
//     const [bgColor, setBgColor] = useState('green');
//     const [openName, setOpenName] = useState(true);
//     const [open, setOpen] = useState(true);

//    const Sata= {
//     labels: [,'January', 'February', 'March',   'December'],
//     datasets: [
//       {
//         data:
//  [7,9.0,7.5,8.8],  

//         color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
//         strokeWidth: 4,
//         fillShadowGradientFromOffset:0.5,
//         fillShadowGradientFromOpacity:'#de908e',
//         fillShadowGradientTo:'#de908e'
//       },
//       {
//         data: [8,8,8,8],
//         color: (opacity = 1) => `rgba(0,0, 255, ${opacity})`,
//         strokeWidth: 1,
//       },
//     ],
//   };
//   const chartConfig = {
//     backgroundColor: '#fff',
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//    // decimalPlaces: 2,
//     useShadowColorFromDataset: true ,
//     color: (opacity = 1) => `rgba(0, 0, 0, ${1})`,  

//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${1})`,
//     style: {
//       borderRadius: 16,
//     },
//     props:  
//  {
//       verticalLines: {
//         style: {
//           stroke: 'rgba(245, 0, 0, 1)',
//           strokeWidth: 7,
//         },
//         position: 'between', // Replace with 'start', 'end', or 'center' as needed
//       },
//     },
//   };



//     const handleBackButtonClick= () => {
//       navigation.goBack()
//     }
//     const navigate= () => {
//       navigation.navigate('Dashboard')
//     }


//     useEffect(() => {
//       //console.log('categories', categories)

//       const color = categories.condition == 'Normal'  ? 'green' : (categories.condition == 'Critical')? 'red' :colors.light_yellow

//       setBgColor(color)

//     }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar />
//       <ScrollView style={{ marginBottom:20,}} showsVerticalScrollIndicator={false}>
//       <View style={{height:height*0.75,width:width,}}>
//       <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} >
//         <View style={{ height:height*0.3,flexDirection:'column' ,justifyContent:'space-between'}}>

//             <TouchableOpacity onPress={handleBackButtonClick}>
//               <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:35 ,marginLeft:15 }}  />
//             </TouchableOpacity>

//             <View style={[styles.buttons,{}]}>

//               <TouchableOpacity  onPress={handleBackButtonClick}  style={[styles.buttonsCancel,{backgroundColor:'#E8F4ED'}]} >
//                 <Text style={{ color:colors.theme_color, fontFamily:'bold', fontSize:16,}}>{categories.testName} </Text>
//                 <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_color} style={{ fontSize:20  }} />
//               </TouchableOpacity>

//               <TouchableOpacity    style={[styles.buttonIn,{backgroundColor:'#E8F4ED'}]} >
//                 <Text style={{ color:colors.theme_color, fontFamily:'bold', fontSize:16,}}>Last {categories.date}</Text>
//                 <Icon type={Icons.AntDesign} name="calendar" color={colors.theme_color} style={{ fontSize:20  }} />
//               </TouchableOpacity>

//             </View>

//             <View style={{width:'100%',alignItems:'center'}}>
//              <View style={{flexDirection:'column',width:'90%',alignItems:'center',height: height*0.6,overflow:'visible',backgroundColor:'#E8F4ED',borderRadius:40,justifyContent:'space-evenly',padding:10}}>

//                 <View style={{ alignItems: 'center',height:height*0.20,justifyContent:'center',padding:10}}>
//                     <View style={{ height:'100%',flexDirection:'column',width:'100%' ,}}>
//                     <View  style={{width:'100%',justifyContent:'space-around', }} >
//                         <View style={{flexDirection:'row',justifyContent:'space-evenly',height:50}}>
//                             <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'bold',width:'100%',height:'80%'}}> {categories.testName} </Text>

//                         </View>

//                         <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',alignItems:'center'}}>
//                         <View style={{flexDirection:'column',flexDirection:'column' ,paddingHorizontal :10}}>
//                             <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold'}}>your result value </Text>
//                             <View style={{flexDirection:'row',alignItems:'flex-end'}}>
//                             <Text style={{color:bgColor,fontSize:30,fontWeight:'bold'}}> 8.3 </Text>
//                             <Text style={{color:'#10152C',fontSize:14,fontWeight:'bold',}}>{categories.messureUnit}  </Text>
//                             </View>
//                             <Text style={{color:'#10152C',fontSize:12,fontWeight:'500'}}>Normal Value : 8.8-10.6 mg/dl</Text>


//                         </View>

//                         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
//                             <Text style={{color:colors.theme_bg_three,fontSize:14,fontWeight:'bold',backgroundColor:categories.condition == 'Normal'  ? 'green' : (categories.condition == 'Critical')? 'red' :colors.light_yellow,padding: 10,borderRadius: 30,}}>{categories.condition} </Text>
//                         </View>
//                         </View>


//                     </View>
//                 </View>

//                 </View>

//                 <View style={{height:height*0.35,width:'100%'}}>
//                   {/* <LineChart data={data}/> */}
//                   <LineChart
//                     data={{
//                       labels: [,,23],
//                       datasets: [
//                         {
//                           data: [
//                           7.75,8.75,8.25,

//                           ],
//                           color: (opacity = 1) => `rgba(0,255,0, ${0.5})`,

//                         },
//                         {data:[8.5,8.5,8.5],
//                           color: (opacity = 1) => `rgba(255,0,0, ${0})`,
//                           withDots:false,

//                         },



//                       ]
//                     }}
//                      width={Dimensions.get("window").width*0.85} // from react-native
//                     height={height*0.3}
//                     yAxisLabel=""
//                     yAxisSuffix=""
//                     withInnerLines={false}
//                     fromZero={false}
//                    yAxisInterval={0.25} // optional, defaults to 1
//                       chartConfig={{
//                        backgroundColor: '#E8F4ED',
//                         backgroundGradientFrom:'#E8F4ED',
//                          backgroundGradientTo:'#E8F4ED',
//                          fillShadowGradient:'#FF0000',
//                           fillShadowGradientFrom:'#FF0000',
//                           fillShadowGradientTo:'#FF0000',
//                           fillShadowGradientFromOffset:1,
//                          // useShadowColorFromDataset:true,

//                       // decimalPlaces: 2, // optional, defaults to 2dp
//                         color: (opacity = 1) => `rgba(0, 0, 0, ${1})`,
//                         labelColor: (opacity = 1) => `rgba(0, 0, 0, ${1})`,
//                         style: {
//                           borderRadius: 16,
//                         },
//                         props:  
//                      {
//                           verticalLines: {
//                             style: {
//                               stroke: 'rgba(0, 0, 0, 0.2)',
//                               strokeWidth: 1,
//                             },
//                             position: 'between', // Replace with 'start', 'end', or 'center' as needed
//                           },





//                         },

//                         propsForDots: {
//                          r: "3",
//                          strokeWidth: "2",
//                           //stroke: "#ffa726"
//                         }
//                       }}
//                     // bezier
//                       style={{
//                       // marginVertical: 8,
//                         //borderRadius: 16
//                       }}
//                     />

//                 </View>
//               </View>
//             </View>

//         </View>
//       </LinearGradient>
//       </View>

//             <View style={{width:'90%',justifyContent:'center',alignItems:'center',marginHorizontal:'5%'}}>

//                 <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'normal',marginVertical:10}} >Total serum calcium is a blood test done to measure the free and bound forms of calcium.</Text>
//                 <Text  style={{color:'#2A2A2A',fontSize:18,fontWeight:'normal',marginVertical:10}} >It is often a part of screening test to detect abnormally high and low levels of calcium, as both can affect the health.</Text>

//             </View>

//             <View style={{width:'90%',justifyContent:'center',alignItems:'center',marginHorizontal:'5%'}}>
//                 <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]} style={[styles.button,{}]} >
//                             <TouchableOpacity   style={styles.button}  onPress={navigate}>
//                                 <Text style={{ color:colors.theme_fg_three, fontFamily:'bold', fontSize:20}}>Go To Home </Text>
//                             </TouchableOpacity>
//                 </LinearGradient>
//             </View>

//         </ScrollView>
// </SafeAreaView>
//   )
// }

// export default AnalysisChart

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.theme_bg_three,
//         justifyContent:'space-between'
//     },
//     tinyLogo:{
//         width:'20%',
//         height:'100%',
//       },
//       button: {
//         alignItems: 'center',
//         justifyContent: 'center',
//        // backgroundColor:colors.theme_color,
//         width:width*0.5,
//         height:50,
//         borderRadius:25,
//         flexDirection:'row'
//       },

//       buttonsCancel:{
//         alignItems: 'center',
//         justifyContent: 'center',
//         height:50,
//         width:'50%',
//         borderRadius:25,
//         flexDirection:'row',
//         borderWidth: 3,
//         borderColor:colors.theme_color


//       },
//       buttons: {
//         alignItems: 'center',
//         justifyContent: 'space-around',
//        // backgroundColor:colors.theme_color,
//        width:'100%',
//         height:50,
//         marginVertical:10,flexDirection:'row'

//       },
//       buttonIn: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection:'row',

//        width:'40%',
//         height:50,
//         borderRadius:25,

//       },
// })















import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { LineChart } from 'react-native-chart-kit';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, vs } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const AnalysisChart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState(route.params ? route.params.type : {});
  const [bgColor, setBgColor] = useState('red');

  const [impactOpen, setImpactOpen] = useState(true);
  const [improveOpen, setImproveOpen] = useState(true);
  const [dietOpen, setDietOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
    const insets = useSafeAreaInsets();
    const hasBottomOverlap = insets.bottom > 20;

  const chartData = {
    labels: ["", "25", "", "15", "", "22", ""],
    datasets: [
      {
        data: [7.85, 8.25, 8.2, 7.70, 7.85, 8.05, 8.0],
        color: (opacity = 1) => `rgba(50, 100, 90, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    backgroundGradientFrom: '#ffffff00',
    backgroundGradientTo: '#ffffff00',
    fillShadowGradient: '#ffffff00',
    fillShadowGradientOpacity: 0,
    color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: primaryColor,
      fill: '#fff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.1)',
    },
  };



  const handleBackButtonClick = () => navigation.goBack();

  const navigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  const toggleSection = (setter, state) => setter(!state);

  useEffect(() => {
    setBgColor('red');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar2 />
      <LinearGradient
        colors={globalGradient}
        style={styles.topGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.06]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ✅ Header Section (fixed overlapping) */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButtonClick} style={styles.headerButton}>
              <Icon
                type={Icons.Feather}
                name="arrow-left"
                color={blackColor}
                style={styles.headerIcon}
              />
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon type={Icons.Feather} name="share-2" color={blackColor} style={styles.headerIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Icon type={Icons.Feather} name="download" color={blackColor} style={styles.headerIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ✅ Chart Section (transparent background) */}
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width * 0.9}
              height={height * 0.3}
              yAxisLabel=""
              yAxisSuffix=""
              withInnerLines={true}
              withVerticalLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              fromZero={false}
              chartConfig={chartConfig}
              bezier
              style={styles.chartStyle}
            />
          </View>

          {/* Rest of UI same as before */}
          <View style={styles.detailsSection}>
            <View style={styles.valueRow}>
              <Text style={styles.testNameText}>Calcium Total, serum</Text>
              <View style={[styles.conditionBadge, { backgroundColor: '#FFD3C4' }]}>
                <Text style={[styles.conditionText, { color: '#E53935' }]}>Critical</Text>
              </View>
            </View>

            <View style={styles.resultRow}>
              <Text style={[styles.resultValue, { color: '#2A2A2A' }]}>
                8.3
                <Text style={styles.unitText}> Mg/dl</Text>
              </Text>
              <Text style={styles.resultLabel}>Your Result Value</Text>
            </View>

            <Text style={styles.normalValueText}>Normal Value : 8.8- 10.6 mg/dl</Text>
            <Text style={styles.descriptionText}>
              Total serum calcium is a blood test done to measure the free and bound forms of calcium.
            </Text>
            <Text style={styles.descriptionText}>
              It is often a part of screening test to detect abnormally high and low levels of calcium, as both can affect the health.
            </Text>
          </View>

          {/* Expandable Sections */}
          <View style={styles.expandableSection}>
            {[
              {
                title: 'Impact on overall health?',
                open: impactOpen,
                setter: setImpactOpen,
                content:
                  'Abnormal levels of calcium can occur due to problems in calcium absorption, bone diseases, overactive thyroid gland, parathyroid disease, kidney or liver diseases.',
              },
              {
                title: 'How to improve health conditions?',
                open: improveOpen,
                setter: setImproveOpen,
                content:
                  'For low calcium levels, a diet with calcium rich foods is recommended. See a doctor and discuss the need for calcium supplements.',
              },
              {
                title: 'Recommended Diet Plan ?',
                open: dietOpen,
                setter: setDietOpen,
                content: '[Diet plan details here]',
              },
              {
                title: 'Connect health expert for lifestyle recommendations',
                open: connectOpen,
                setter: setConnectOpen,
                content: '[Connection options details here]',
              },
            ].map((section, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={styles.expandableHeader}
                  onPress={() => toggleSection(section.setter, section.open)}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Icon
                    type={Icons.Feather}
                    name={section.open ? 'chevron-up' : 'chevron-down'}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
                {section.open && <Text style={styles.sectionContent}>{section.content}</Text>}
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 30,  marginBottom: hasBottomOverlap ? insets.bottom + ms(10) : ms(25), }}>
            <PrimaryButton onPress={navigate} title="Go to Home" />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AnalysisChart;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topGradient: { width: '100%', flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: height * 0.06,
    marginBottom: 10,
  },
  headerButton: {
    backgroundColor: whiteColor,
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: { fontSize: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: 'transparent', // ✅ No white background
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  testNameText: {
    flexShrink: 1,
    color: '#2A2A2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  conditionBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  conditionText: { fontSize: 14, fontWeight: 'bold' },
  resultRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10 },
  resultValue: { fontSize: 30, fontWeight: 'bold', marginRight: 10 },
  unitText: { fontSize: 16, fontWeight: 'bold' },
  resultLabel: { fontSize: 14, fontWeight: '400', color: '#666', marginTop: -5 },
  normalValueText: { color: '#666', fontSize: 14, fontWeight: '500', marginTop: 5, marginBottom: 20 },
  descriptionText: { color: '#2A2A2A', fontSize: 14, lineHeight: 22, marginBottom: 10 },
  expandableSection: { paddingHorizontal: 20 },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  sectionTitle: { flex: 1, color: '#2A2A2A', fontSize: 16, fontWeight: 'bold' },
  sectionContent: { color: '#2A2A2A', fontSize: 14, lineHeight: 20, paddingBottom: 10 },
  arrowIcon: { fontSize: 20, color: '#2A2A2A', marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 0 },
});
