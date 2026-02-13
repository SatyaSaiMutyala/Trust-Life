import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import { whiteColor, blackColor, primaryColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const TurnOnBluetooth = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <View style={styles.content}>
                {/* Bluetooth Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/img/bluetooth.png')}
                        style={styles.btImage}
                    />
                </View>

                {/* Title */}
                <Text style={styles.title}>Turn On Bluetooth</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Turn on Bluetooth to find and connect nearby devices for syncing your heart rate data automatically.
                </Text>

                {/* Search Nearby Devices Button */}
                <PrimaryButton
                    title="Search Nearby Devices"
                    onPress={() => navigation.navigate('SearchNearbyDevices')}
                    style={styles.searchButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default TurnOnBluetooth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(30),
    },
    imageContainer: {
        width: ms(80),
        height: ms(80),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(25),
    },
    btImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(12),
    },
    description: {
        fontSize: ms(13),
        color: '#888',
        textAlign: 'center',
        lineHeight: ms(20),
        paddingHorizontal: ms(10),
        marginBottom: vs(10),
    },
    searchButton: {
        width: '100%',
        marginTop: vs(20),
    },
});
