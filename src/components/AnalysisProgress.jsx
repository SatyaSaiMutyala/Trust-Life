import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';
import { grayColor } from '../utils/globalColors';


const AnalysisProgress = (props) => {
  return (
    <View>
     <Progress.Circle size={props.size || 200} color={props.ringColor} indeterminate={false} borderWidth={0} unfilledColor={grayColor} progress={props.percentage/100}  direction={'counter-clockwise'} thickness={props.thickness || 10} >
       
     </Progress.Circle>

    </View>
  )
}

export default AnalysisProgress

const styles = StyleSheet.create({})