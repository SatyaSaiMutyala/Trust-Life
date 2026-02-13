import React from 'react'
import { Text, StyleSheet  } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import * as colors from '../assets/css/Colors';
import { primaryColor } from '../utils/globalColors';
import { bold } from '../config/Constants';

export default function Loader(props) {
  return <AnimatedLoader
        visible={props.visible}
        overlayColor="rgba(255,255,255,0.8)"
        source={require('.././assets/json/AnimationLoading.json')}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text style={{color:primaryColor, fontFamily:bold}}>Please wait...</Text>
      </AnimatedLoader>
  
}

const styles = StyleSheet.create({
  lottie: {
    width: 80,
    height: 80
  }
});