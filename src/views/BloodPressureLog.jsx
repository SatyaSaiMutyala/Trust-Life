import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor } from '../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../utils/primaryButton';
import { TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const BloodPressureLog = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Blood Pressure (BP)</Text>
                <View style={{ width: ms(40) }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Illustration */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/img/pressurewomen.png')}
                        style={styles.image}
                    />
                </View>

                {/* Title */}
                <Text style={styles.title}>Manage</Text>
                <Text style={styles.titleBold}>Your Blood Pressure</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Monitor your blood pressure manually or through connected devices and easily track your health trends over time.
                </Text>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Continue"
                    onPress={() => navigation.navigate('BloodPressureDashboard')}
                    style={styles.continueButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default BloodPressureLog;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitle: {
        flex: 1,
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(30),
    },
    imageContainer: {
        width: width * 0.7,
        height: width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(30),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: ms(20),
        color: blackColor,
        textAlign: 'center',
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
    continueButton: {
        marginTop: 0,
    },
});
