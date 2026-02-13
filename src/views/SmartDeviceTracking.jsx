import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const { width } = Dimensions.get('window');

const SmartDeviceTracking = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Smartwatch Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/img/smartwatch.png')}
                        style={styles.watchImage}
                    />
                </View>

                {/* Title */}
                <Text style={styles.title}>Smart Device</Text>
                <Text style={styles.titleBold}>Heart Rate Tracking</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Pair your smartwatch or fitness band to capture and store heart rate data seamlessly.
                </Text>
            </View>

            {/* Link to Device Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Link to Device"
                    onPress={() => navigation.navigate('TurnOnBluetooth')}
                    style={styles.linkButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default SmartDeviceTracking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(10),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(30),
    },
    imageContainer: {
        width: width * 0.55,
        height: width * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(30),
    },
    watchImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: ms(20),
        color: blackColor,
        textAlign: 'center',
        fontWeight: '500',
    },
    titleBold: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(15),
    },
    description: {
        fontSize: ms(13),
        color: '#888',
        textAlign: 'center',
        lineHeight: ms(20),
        paddingHorizontal: ms(10),
    },
    buttonContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(30),
    },
    linkButton: {
        marginTop: 0,
    },
});
