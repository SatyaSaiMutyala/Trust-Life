import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../utils/globalColors';
import {
    requestBlePermissions,
    scanForHeartRateDevices,
    connectAndMonitorHeartRate,
} from '../utils/BleHeartRateService';

const SearchNearbyDevices = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [devices, setDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [connectingId, setConnectingId] = useState(null);
    const stopScanRef = useRef(null);

    useEffect(() => {
        startScan();
        return () => {
            if (stopScanRef.current) {
                stopScanRef.current();
            }
        };
    }, []);

    const startScan = async () => {
        const granted = await requestBlePermissions();
        if (!granted) {
            Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan for devices.');
            return;
        }

        setDevices([]);
        setIsScanning(true);

        stopScanRef.current = scanForHeartRateDevices(
            (device) => {
                setDevices((prev) => {
                    if (prev.find((d) => d.id === device.id)) return prev;
                    return [...prev, device];
                });
            },
            (error) => {
                console.warn('BLE scan error:', error);
                setIsScanning(false);
            },
        );

        // Stop scanning after 15 seconds
        setTimeout(() => {
            if (stopScanRef.current) {
                stopScanRef.current();
                stopScanRef.current = null;
            }
            setIsScanning(false);
        }, 15000);
    };

    const handleConnect = async (device) => {
        // Stop scanning first
        if (stopScanRef.current) {
            stopScanRef.current();
            stopScanRef.current = null;
            setIsScanning(false);
        }

        setConnectingId(device.id);

        const result = await connectAndMonitorHeartRate(
            device.id,
            (bpm) => {
                // Navigate back to dashboard with connected device info
                navigation.navigate('HeartRateDashboard', {
                    connectedDevice: {
                        id: device.id,
                        name: device.name,
                    },
                    initialBpm: bpm,
                });
            },
            () => {
                Alert.alert('Disconnected', `${device.name} has been disconnected.`);
            },
            (error) => {
                console.warn('BLE connect error:', error);
                if (error?.message === 'NO_HEART_RATE_SERVICE') {
                    console.log('[BLE] Services found on device:', error.services);
                    Alert.alert(
                        'Heart Rate Not Supported',
                        `${device.name} connected successfully but does not expose the standard Heart Rate Service. This device may use a proprietary protocol.\n\nCompatible devices: Polar H10, Polar OH1, Garmin HRM, or any device with standard BLE Heart Rate profile.`,
                    );
                } else {
                    Alert.alert('Connection Failed', `Could not connect to ${device.name}. Make sure the device is nearby and try again.`);
                }
                setConnectingId(null);
            },
        );

        if (!result) {
            setConnectingId(null);
        }
    };

    const filteredDevices = devices.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderDevice = ({ item }) => (
        <View style={styles.deviceCard}>
            <Image source={require('../assets/img/smartwatch.png')} style={styles.deviceImage} />
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceModel}>Signal: {item.rssi} dBm</Text>
            </View>
            {connectingId === item.id ? (
                <ActivityIndicator size="small" color={primaryColor} />
            ) : (
                <TouchableOpacity
                    style={[styles.badge, styles.badgeDefault]}
                    onPress={() => handleConnect(item)}
                >
                    <Text style={styles.badgeText}>Connect</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search Nearby Devices</Text>
                <TouchableOpacity onPress={startScan} disabled={isScanning}>
                    <Icon type={Icons.Ionicons} name="refresh" color={isScanning ? '#CCC' : primaryColor} size={ms(22)} />
                </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.description}>
                {isScanning
                    ? 'Scanning for nearby Bluetooth devices...'
                    : `Found ${devices.length} device${devices.length !== 1 ? 's' : ''}. Tap a device to connect.`
                }
            </Text>

            {/* Scanning Indicator */}
            {isScanning && (
                <View style={styles.scanningRow}>
                    <ActivityIndicator size="small" color={primaryColor} />
                    <Text style={styles.scanningText}>Scanning...</Text>
                </View>
            )}

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(18)} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search devices"
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Device List */}
            <FlatList
                data={filteredDevices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    !isScanning && (
                        <View style={styles.emptyContainer}>
                            <Icon type={Icons.Ionicons} name="bluetooth-outline" color="#CCC" size={ms(40)} />
                            <Text style={styles.emptyText}>No devices found</Text>
                            <TouchableOpacity onPress={startScan}>
                                <Text style={styles.retryText}>Tap to scan again</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
};

export default SearchNearbyDevices;

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
    description: {
        fontSize: ms(13),
        color: '#888',
        lineHeight: ms(20),
        paddingHorizontal: ms(20),
        marginTop: vs(5),
        marginBottom: vs(10),
        textAlign: 'center',
    },
    scanningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ms(8),
        marginBottom: vs(10),
    },
    scanningText: {
        fontSize: ms(12),
        color: primaryColor,
        fontWeight: '600',
    },

    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(25),
        marginHorizontal: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        marginBottom: vs(20),
        gap: ms(8),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        padding: 0,
    },

    // Device List
    listContainer: {
        paddingHorizontal: ms(20),
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    deviceImage: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        resizeMode: 'contain',
    },
    deviceInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    deviceName: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    deviceModel: {
        fontSize: ms(11),
        color: '#888',
        marginTop: vs(2),
    },
    badge: {
        paddingHorizontal: ms(16),
        paddingVertical: vs(6),
        borderRadius: ms(20),
    },
    badgePaired: {
        backgroundColor: primaryColor,
    },
    badgeDefault: {
        backgroundColor: '#F1F5F9',
    },
    badgeText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#888',
    },
    badgeTextPaired: {
        color: whiteColor,
    },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(60),
        gap: vs(10),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
    retryText: {
        fontSize: ms(13),
        color: primaryColor,
        fontWeight: '600',
    },
});
