import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    Linking,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import { whiteColor, blackColor, primaryColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import { isBluetoothOn, onBluetoothStateChange, requestBlePermissions } from '../utils/BleHeartRateService';

const TurnOnBluetooth = () => {
    const navigation = useNavigation();
    const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Check initial Bluetooth state
        isBluetoothOn().then((on) => {
            setBluetoothEnabled(on);
            setChecking(false);
        });

        // Listen for Bluetooth state changes
        const unsubscribe = onBluetoothStateChange((on) => {
            setBluetoothEnabled(on);
            setChecking(false);
        });

        return unsubscribe;
    }, []);

    const handlePress = async () => {
        if (bluetoothEnabled) {
            // Bluetooth is ON — request permissions then go to scan
            const granted = await requestBlePermissions();
            if (granted) {
                navigation.navigate('SearchNearbyDevices');
            } else {
                Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan for devices.');
            }
        } else {
            // Bluetooth is OFF — prompt to open settings
            Alert.alert(
                'Bluetooth is Off',
                'Please turn on Bluetooth from your device settings to scan for nearby devices.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            if (Platform.OS === 'android') {
                                Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
                            } else {
                                Linking.openURL('App-Prefs:Bluetooth');
                            }
                        },
                    },
                ],
            );
        }
    };

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

                {/* Status */}
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: bluetoothEnabled ? '#4CAF50' : '#FF5252' }]} />
                    <Text style={[styles.statusText, { color: bluetoothEnabled ? '#4CAF50' : '#FF5252' }]}>
                        {checking ? 'Checking...' : bluetoothEnabled ? 'Bluetooth is ON' : 'Bluetooth is OFF'}
                    </Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    {bluetoothEnabled
                        ? 'Bluetooth is enabled. Tap the button below to search for nearby heart rate devices.'
                        : 'Turn on Bluetooth to find and connect nearby devices for syncing your heart rate data automatically.'
                    }
                </Text>

                {/* Button */}
                <PrimaryButton
                    title={bluetoothEnabled ? 'Search Nearby Devices' : 'Turn On Bluetooth'}
                    onPress={handlePress}
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
        marginBottom: vs(8),
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(12),
        gap: ms(6),
    },
    statusDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
    },
    statusText: {
        fontSize: ms(13),
        fontWeight: '600',
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
