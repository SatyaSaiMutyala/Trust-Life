import React from 'react';
import { StatusBar as Sb } from 'react-native';
import * as colors from '../assets/css/Colors';
import { primaryColor } from '../utils/globalColors';

export function StatusBar(props){
	return <Sb
	    barStyle = "dark-content"
	    hidden = {false}
	    backgroundColor = "#E9F6FE"
	    translucent = {false}
	    networkActivityIndicatorVisible = {true}
	 />
}

export function StatusBar2(){
	return <Sb
	    barStyle = "light-content"
	    hidden = {false}
	    backgroundColor = {primaryColor}
	    translucent = {false}
	    networkActivityIndicatorVisible = {true}
	 />
}
