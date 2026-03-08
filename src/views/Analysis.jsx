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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import AnalysisList from '../components/AnalysisList';
import AnalysisProgress from '../components/AnalysisProgress';
import { blackColor, globalGradient, globalGradient2, primaryColor, whiteColor } from '../utils/globalColors';
import { bold, regular } from '../config/Constants';
import { s, vs, ms } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import { useSnack } from '../context/GlobalSnackBarContext';
const { width, height } = Dimensions.get('window');

const ORGANS = [
  { label: 'Heart', icon: 'heart', iconType: Icons.Ionicons, iconColor: '#EF4444', bgColor: '#FEE2E2', status: 'Watch', statusType: 'moderate', description: 'Pumps blood throughout the body' },
  { label: 'Kidney', icon: 'water', iconType: Icons.Ionicons, iconColor: '#DC2626', bgColor: '#FEE2E2', status: 'Stable', statusType: 'strong', description: 'Filters waste and regulates fluid balance' },
  { label: 'Liver', icon: 'flask', iconType: Icons.Ionicons, iconColor: '#78350F', bgColor: '#FEF3C7', status: 'Stable', statusType: 'strong', description: 'Processes nutrients and detoxifies blood' },
  { label: 'Pancreas', icon: 'stomach', iconType: Icons.MaterialCommunityIcons, iconColor: '#10B981', bgColor: '#DCFCE7', status: 'Watch', statusType: 'moderate', description: 'Produces insulin and digestive enzymes' },
  { label: 'Lungs', icon: 'lungs', iconType: Icons.MaterialCommunityIcons, iconColor: '#0EA5E9', bgColor: '#E0F2FE', status: 'Efficient', statusType: 'strong', description: 'Handles breathing and oxygen exchange' },
  { label: 'Brain', icon: 'brain', iconType: Icons.MaterialCommunityIcons, iconColor: '#EC4899', bgColor: '#FCE7F3', status: 'Active', statusType: 'strong', description: 'Controls body functions and cognition' },
  { label: 'Eye', icon: 'eye-outline', iconType: Icons.Ionicons, iconColor: '#6366F1', bgColor: '#EDE9FE', status: 'Normal', statusType: 'strong', description: 'Provides vision and light perception' },
  { label: 'Thymus', icon: 'shield-checkmark-outline', iconType: Icons.Ionicons, iconColor: '#14B8A6', bgColor: '#CCFBF1', status: 'Active', statusType: 'strong', description: 'Supports immune system development' },
  { label: 'Skin', icon: 'body-outline', iconType: Icons.Ionicons, iconColor: '#F59E0B', bgColor: '#FEF3C7', status: 'Healthy', statusType: 'strong', description: 'Protects body and regulates temperature' },
  { label: 'Gut', icon: 'nutrition-outline', iconType: Icons.Ionicons, iconColor: '#F97316', bgColor: '#FFEDD5', status: 'Balanced', statusType: 'strong', description: 'Digests food and absorbs nutrients' },
  { label: 'Muscle', icon: 'barbell-outline', iconType: Icons.Ionicons, iconColor: '#D946EF', bgColor: '#FAE8FF', status: 'Strong', statusType: 'strong', description: 'Supports movement and posture' },
  { label: 'Thyroid', icon: 'shield-outline', iconType: Icons.Ionicons, iconColor: '#0891B2', bgColor: '#CFFAFE', status: 'Normal', statusType: 'strong', description: 'Regulates metabolism and energy balance' },
  { label: 'Vascular System', icon: 'water-outline', iconType: Icons.Ionicons, iconColor: '#DC2626', bgColor: '#FEE2E2', status: 'Normal', statusType: 'strong', description: 'Blood vessels circulating blood throughout body' },
  { label: 'Reproductive', icon: 'human-male-female', iconType: Icons.MaterialCommunityIcons, iconColor: '#8B5CF6', bgColor: '#EDE9FE', status: 'Normal', statusType: 'strong', description: 'Reproductive organs and hormonal health' },
];

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

  const navigateOrgan = (organ) => {
    navigation.navigate('OrganDetailScreen', { organ });
  };

  const totalParameters = 10;

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar2 />
      <LinearGradient colors={globalGradient2} style={styles.gradientBackground}
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
          {/* <View style={styles.Analysis}>
            <RingComponent size={140} outerRadius={70} percentage={progress} />
            <Text style={styles.healthScoreTitle}>Health Score</Text>
            <Text style={styles.calculatedFromReport}>Calculated from test report</Text>
          </View> */}

          {/* Human Body Image with organ tap zones */}
          <View style={styles.humanBodyContainer}>
            <View style={styles.humanBodyWrapper}>
              <Image
                source={require('../assets/img/human-body.png')}
                style={styles.humanBodyImage}
                resizeMode="contain"
              />
              {/* Organ tap overlays */}
              <TouchableOpacity style={[styles.organTap, { top: '3%', left: '36%', width: '20%', height: '7%' }]} onPress={() => navigateOrgan('Eye')} />
              <TouchableOpacity style={[styles.organTap, { top: '3%', right: '17%', width: '20%', height: '8%' }]} onPress={() => navigateOrgan('Brain')} />
              <TouchableOpacity style={[styles.organTap, { top: '10%', left: '12%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Thymus')} />
              <TouchableOpacity style={[styles.organTap, { top: '14%', right: '8%', width: '20%', height: '9%' }]} onPress={() => navigateOrgan('Thyroid')} />
              <TouchableOpacity style={[styles.organTap, { top: '28%', left: '4%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Lungs')} />
              <TouchableOpacity style={[styles.organTap, { top: '60%', left: '4%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Pancreas')} />
              <TouchableOpacity style={[styles.organTap, { top: '29%', right: '6%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Liver')} />
              <TouchableOpacity style={[styles.organTap, { top: '43%', right: '3%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Gut')} />
              <TouchableOpacity style={[styles.organTap, { top: '57%', right: '3%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Skin')} />
              <TouchableOpacity style={[styles.organTap, { top: '45%', left: '0%', width: '22%', height: '12%' }]} onPress={() => navigateOrgan('Heart')} />
              <TouchableOpacity style={[styles.organTap, { top: '76%', left: '10%', width: '22%', height: '10%' }]} onPress={() => navigateOrgan('Muscle')} />
              <TouchableOpacity style={[styles.organTap, { top: '65%', right: '24%', width: '18%', height: '10%' }]} onPress={() => navigateOrgan('Kidneys')} />
              <TouchableOpacity style={[styles.organTap, { top: '88%', left: '46%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Reproductive')} />
              <TouchableOpacity style={[styles.organTap, { bottom: '13%', right: '14%', width: '20%', height: '10%' }]} onPress={() => navigateOrgan('Vascular System')} />
            </View>
          </View>

          {/* Organ Cards */}
          <View style={styles.organCardsWrap}>
            {ORGANS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.organCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('OrganDetailScreen', { organ: item.label })}
              >
                <View style={styles.organCardTopRow}>
                  <View style={[styles.organIconWrap, { backgroundColor: item.bgColor }]}>
                    <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                  </View>
                  <Text style={styles.organCardLabel}>{item.label}</Text>
                </View>
                <View style={styles.organStatusRow}>
                  <Text style={styles.organStatusLabel}>Status :</Text>
                  <View style={item.statusType === 'strong' ? styles.organBadgeStrong : styles.organBadgeModerate}>
                    <Text style={item.statusType === 'strong' ? styles.organBadgeTextStrong : styles.organBadgeTextModerate}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

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
    marginVertical: ms(20),
  },
  humanBodyWrapper: {
    width: ms(320),
    height: ms(320 * (2167 / 1114)),
    position: 'relative',
    backgroundColor: whiteColor,
    borderRadius: ms(16),
    elevation: 4,
    shadowColor: blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: ms(10),
  },
  humanBodyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  organTap: {
    position: 'absolute',
    zIndex: 10,
  },
  organCardsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: ms(14),
  },
  organCard: {
    backgroundColor: whiteColor,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(12),
    width: '48.5%',
  },
  organCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  organIconWrap: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10),
  },
  organCardLabel: { fontFamily: bold, fontSize: ms(14), color: blackColor, flex: 1 },
  organStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organStatusLabel: { fontFamily: bold, fontSize: ms(12), color: blackColor, marginRight: ms(10) },
  organBadgeStrong: {
    backgroundColor: '#DCFCE7', borderRadius: ms(20),
    paddingHorizontal: ms(14), paddingVertical: vs(5),
  },
  organBadgeTextStrong: { fontFamily: bold, fontSize: ms(11), color: '#065F46' },
  organBadgeModerate: {
    backgroundColor: '#FEF9C3', borderRadius: ms(20),
    paddingHorizontal: ms(14), paddingVertical: vs(5),
  },
  organBadgeTextModerate: { fontFamily: bold, fontSize: ms(11), color: '#92400E' },
});
