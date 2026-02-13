// //import liraries
// import React, {useCallback, useEffect, useState} from 'react';
// import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image, Dimensions, Keyboard, FlatList, TouchableHighlight, BackHandler, Alert} from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import * as colors from '../assets/css/Colors';
// import { bold, regular, light,api_url,other_charges, offer_img, location, user_details_img, customer_lab_place_order, customer_get_profile } from '../config/Constants';
// import Icon, { Icons } from '../components/Icons';
// import LinearGradient from 'react-native-linear-gradient';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const {width, height,fontScale} = Dimensions.get('window');
// import { Animated } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import AnalysisList from '../components/AnalysisList';
// import { Data } from '../assets/json/analysis';
// import AnalysisProgress from '../components/AnalysisProgress';




// const RingComponent = ({ size, innerRadius, outerRadius, color, strokeWidth, percentage }) => {
//     const rotation = percentage * 3.6; // Calculate rotation based on percentage

//     return (
//       <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center',width:width }}>


//         <View style={{
//           width: outerRadius * 2,
//           height: outerRadius * 2,
//           borderRadius: outerRadius,
//          // backgroundColor: 'red',
//           //borderWidth: strokeWidth,
//           borderColor: '2A2A2A',
//           flexDirection:'column',
//           justifyContent: 'center', alignItems: 'center',
//           position:'absolute',
//          // transform: [{ rotate: `${rotation}deg` }],
//         }} >
//         <Text style={{ color: colors.theme_fg_three,fontWeight:'bold' , fontSize: 40, }}> {percentage}</Text>

//         <Text style={{ color: colors.theme_fg_three,fontWeight:'bold' , fontSize: 20, }}>Out of 100</Text>
//         </View>
//         <AnalysisProgress percentage={percentage}/>
//       </View>
//     );
//   };


//   const RingProgressLoader = ({ progress, size = 100, strokeWidth = 10, color = 'red', backgroundColor = '#F2F2F2', labelStyle }) => {
//     const animatedProgress = new Animated.Value(0);

//     useEffect(() => {
//       Animated.timing(animatedProgress, {
//         toValue: progress,
//         duration: 1000, // Adjust the animation duration as needed
//         useNativeDriver: true,
//       }).start();
//     }, [progress]);

//     const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2);
//     // const strokeDashoffset = Animated.interpolate(animatedProgress, {
//     //   inputRange: [0, 1],
//     //   outputRange: [circumference, 0],
//     // });

//     const circleStyle = {
//       width: size,
//       height: size,
//       borderRadius: size / 2,
//       borderWidth: strokeWidth,
//       borderColor: backgroundColor,
//       borderStyle: 'solid',
//       backgroundColor: backgroundColor,
//       position: 'relative',
//     };

//     const progressCircleStyle = {
//       width: size,
//       height: size,
//       borderRadius: size / 2,
//       borderWidth: strokeWidth,
//       borderColor: color,
//       borderStyle: 'solid',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       transform: [{ rotate: `-${75}rad` }],
//     };

//     return (
//       <Animatable.View animation="fadeIn" duration={1000} style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <View style={circleStyle}>
//           <View style={progressCircleStyle} />
//         </View>
//         {labelStyle && (
//           <Text style={labelStyle}>{progress.toFixed(0)}%</Text>
//         )}
//       </Animatable.View>
//     );
//   };





// //make this component available to the app

// const Analysis = () => {
//     const navigation = useNavigation();
//     const route = useRoute()
//     const [progress, setProgress] = useState(60);
//     const [open, setOpen] = useState(false);
//     const [type, setType] = useState(route.params.type);


//     useEffect(() => {
//       const interval = setInterval(() => {
//         setProgress((prevProgress) => {
//           if (prevProgress >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return
//    prevProgress + 10; // Adjust the increment as needed
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }, []);
//     const handleBackButtonClick= () => {
//         navigation.goBack()
//       }
//     const handleOpenClick= () => {
//        setOpen(!open)
//       }

//     return (
//         <SafeAreaView style={styles.container}>
//              <LinearGradient colors={[ colors.theme_color,colors.theme_color_One, ]}  style={{width:width,height:height*0.4,borderBottomRightRadius:50,borderBottomLeftRadius:50}}>
//                 <View style={styles.header}>

//                     <TouchableOpacity onPress={handleBackButtonClick}>
//                     <Icon type={Icons.Feather} name="chevron-left" color={colors.theme_bg_three} style={{ fontSize:30 , }}  />
//                     </TouchableOpacity>



//                 </View>
//                 <View style={[styles.Analysis]}>
//                 <Text style={{ color: colors.theme_fg_three,fontWeight:'bold' , fontSize: 20,marginBottom:20 }}>  Your Health Score</Text>
//                 <RingComponent size={200} innerRadius={10} outerRadius={100} color="blue" percentage={60} />
//                 <Text style={{ color: colors.theme_fg_three,fontWeight:'bold' , fontSize: 20,marginTop:20 }}>*Calculated from test report</Text>

//                 </View>
//                 <View>
//       {/* <RingProgressLoader progress={progress} size={200} /> */}
//     </View>


//             </LinearGradient>
//             <View style={{flexDirection:'row',marginHorizontal:20,justifyContent:'space-between',marginVertical:10}} >
//             <View style={{flexDirection:'row',width:'50%'}}>
//               <Text style={{color:'#2A2A2A',fontSize:16,fontWeight:'bold' ,}}>Vital Parameters</Text>
//               </View>
//                  <TouchableOpacity onPress={handleOpenClick}>
//               <View style={{flexDirection:'row'}}>
//                  <Text style={{color:colors.theme_color,fontSize:14,fontWeight:'400'}}>Show All({Data.length})</Text>
//                  {!open ?
//                   <Icon type={Icons.Feather} name="chevron-up" color={colors.theme_color} style={{ fontSize:20 }} />:
//                   <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_color} style={{ fontSize:20  }} />
//                   }
//               </View>
//                   </TouchableOpacity>
//             </View>
//             {open ?
//             <AnalysisList type={type}/>:<></>}


//         </SafeAreaView>
//     );
// }

// export default Analysis

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,

//         backgroundColor: colors.theme_bg_three,
//     },
//     header: {
//         //flex: 1,
//         flexDirection:'row',
//         justifyContent:'space-between',
//         alignItems: 'center',
//         width:'100%',
//         height:50,
//         paddingHorizontal:10,
//        // backgroundColor:colors.theme_bg_three,

//       },
//       Analysis:{
//         alignItems:'center',
//         width:'100%'
//       }
// });







import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import AnalysisList from '../components/AnalysisList';
import AnalysisProgress from '../components/AnalysisProgress';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import { useSnack } from '../context/GlobalSnackBarContext';
const { width, height } = Dimensions.get('window');

const getOrganFromTap = (xPercent, yPercent) => {
  // Left side organ icons
  if (xPercent < 25) {
    if (yPercent < 20) return 'Thymus';
    if (yPercent < 37) return 'Lungs';
    if (yPercent < 55) return 'Heart';
    if (yPercent < 75) return 'Pancreas';
  }
  // Right side organ icons
  if (xPercent > 75) {
    if (yPercent < 20) return 'Thyroid';
    if (yPercent < 37) return 'Liver';
    if (yPercent < 55) return 'Gut';
    if (yPercent < 75) return 'Kidneys';
  }
  // Body center zones
  if (yPercent < 15) return 'Thyroid';
  if (yPercent < 28) return 'Lungs';
  if (yPercent < 38) return xPercent < 50 ? 'Heart' : 'Liver';
  if (yPercent < 50) return 'Gut';
  if (yPercent < 62) return xPercent < 50 ? 'Pancreas' : 'Kidneys';
  return null;
};

const RingComponent = ({ size, outerRadius, percentage }) => {
  return (
    <View style={{ width: width, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: outerRadius * 2,
          height: outerRadius * 2,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <Text style={styles.scoreText}>{percentage}</Text>
        <Text style={styles.scoreSubText}>Out of 100</Text>
      </View>
      <AnalysisProgress percentage={percentage} ringColor={primaryColor} size={size} thickness={8} />
    </View>
  );
};

const Analysis = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showSnack } = useSnack();
  const [progress] = useState(80);
  const [open, setOpen] = useState(true);
  const [type] = useState(route.params ? route.params.type : 'default');

  const handleBackButtonClick = () => navigation.goBack();
  const handleOpenClick = () => setOpen(!open);

  const handleBodyTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const imageWidth = ms(350);
    const imageHeight = ms(550);
    const xPercent = (locationX / imageWidth) * 100;
    const yPercent = (locationY / imageHeight) * 100;
    const organ = getOrganFromTap(xPercent, yPercent);
    if (organ) {
      showSnack('success', `You tapped on ${organ}`);
    }
  };

  const totalParameters = 10;

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar2 />
      <LinearGradient colors={globalGradient} style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 3 }}
        locations={[0, 0.1]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={styles.headerButton}>
            <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon type={Icons.Ionicons} name="share-social-outline" color={blackColor} size={ms(20)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon type={Icons.Ionicons} name="download-outline" color={blackColor} size={ms(20)} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(30) }}>
          {/* Health Score Ring */}
          <View style={styles.Analysis}>
            <RingComponent size={140} outerRadius={70} percentage={progress} />
            <Text style={styles.healthScoreTitle}>Health Score</Text>
            <Text style={styles.calculatedFromReport}>Calculated from test report</Text>
          </View>

          {/* Human Body Image */}
          <View style={styles.humanBodyContainer}>
            <Pressable onPress={handleBodyTap}>
              <Image
                source={require('../assets/img/humanBody.png')}
                style={styles.humanBodyImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Vital Parameters Header */}
          <View style={styles.vitalParametersHeader}>
            <Text style={styles.vitalParametersTitle}>Vital Parameters</Text>
            <TouchableOpacity onPress={handleOpenClick} style={styles.viewAllTouch}>
              <View style={styles.viewAllContainer}>
                <Text style={styles.viewAllText}>{ open ? 'Hide' : 'View all' } ( {totalParameters} )</Text>
                {open ? (
                  <Icon type={Icons.Feather} name="chevron-up" color={colors.theme_color} style={{ fontSize: 20 }} />
                ) : (
                  <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_color} style={{ fontSize: 20 }} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Conditional List */}
          {open && <AnalysisList type={type} />}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Analysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg,
  },
  gradientBackground: {
    flex: 1,
    width: width,
    minHeight: height,
  },
  // scrollViewContent: {
  //   paddingBottom: 50,
  // },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: ms(15),
    paddingTop: ms(50),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  headerButton: {
    backgroundColor: whiteColor,
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
  Analysis: {
    alignItems: 'center',
    width: '100%',
    marginTop: vs(20),
  },
  scoreText: {
    color: primaryColor,
    fontWeight: 'bold',
    fontSize: ms(26),
  },
  scoreSubText: {
    color: blackColor,
    fontWeight: '600',
    fontSize: ms(10),
  },
  healthScoreTitle: {
    color: blackColor,
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 20,
  },
  calculatedFromReport: {
    color: blackColor,
    fontSize: 14,
    marginTop: 5,
    opacity: 0.8,
  },
  vitalParametersHeader: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 12,
    padding: 10,
  },
  vitalParametersTitle: {
    color: '#2A2A2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllTouch: {
    paddingVertical: 5,
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 2,
  },
  humanBodyContainer: {
    alignItems: 'center',
    // marginVertical: vs(20),
  },
  humanBodyImage: {
    width: ms(350),
    height: ms(550),
    resizeMode:'contain'
  },
});
