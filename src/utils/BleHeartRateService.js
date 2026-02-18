import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

// Standard BLE UUIDs for Heart Rate
const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_MEASUREMENT = '00002a37-0000-1000-8000-00805f9b34fb';

let manager = null;

export function getBleManager() {
    if (!manager) {
        try {
            manager = new BleManager();
        } catch (e) {
            console.warn('BleManager init failed:', e.message);
            return null;
        }
    }
    return manager;
}

/**
 * Request Bluetooth permissions on Android
 * Returns true if all permissions granted
 */
export async function requestBlePermissions() {
    if (Platform.OS === 'android') {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
            // Android 12+
            const results = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
            return (
                results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
                results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted' &&
                results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted'
            );
        } else {
            // Android 11 and below
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return result === 'granted';
        }
    }
    return true;
}

/**
 * Scan for BLE devices that have the Heart Rate service
 * @param {function} onDeviceFound - callback({id, name, rssi})
 * @param {function} onError - callback(error)
 * @returns {function} stopScan - call to stop scanning
 */
export function scanForHeartRateDevices(onDeviceFound, onError) {
    const bleManager = getBleManager();
    if (!bleManager) {
        onError?.('BLE not available');
        return () => {};
    }
    const foundIds = new Set();

    bleManager.startDeviceScan(
        null, // scan all services (filter after)
        { allowDuplicates: false },
        (error, device) => {
            if (error) {
                onError?.(error);
                return;
            }

            if (device && device.name && !foundIds.has(device.id)) {
                foundIds.add(device.id);
                onDeviceFound({
                    id: device.id,
                    name: device.name || 'Unknown Device',
                    rssi: device.rssi,
                });
            }
        },
    );

    return () => {
        bleManager.stopDeviceScan();
    };
}

/**
 * Connect to a BLE device and subscribe to heart rate measurements
 * @param {string} deviceId - the BLE device ID
 * @param {function} onHeartRate - callback(bpm: number)
 * @param {function} onDisconnect - callback()
 * @param {function} onError - callback(error)
 * @returns {Promise<{device, subscription, disconnect}>}
 */
export async function connectAndMonitorHeartRate(deviceId, onHeartRate, onDisconnect, onError) {
    const bleManager = getBleManager();
    if (!bleManager) {
        onError?.('BLE not available');
        return null;
    }

    try {
        // Connect
        const device = await bleManager.connectToDevice(deviceId, {
            requestMTU: 512,
        });

        // Discover services and characteristics
        await device.discoverAllServicesAndCharacteristics();

        // Check if device has Heart Rate Service
        const services = await device.services();
        const serviceUuids = services.map((s) => s.uuid.toLowerCase());
        console.log(`[BLE] Device services (${services.length}):`, serviceUuids);

        const hasHeartRate = serviceUuids.includes(HEART_RATE_SERVICE);

        if (!hasHeartRate) {
            // Device doesn't support heart rate — disconnect and report
            try { await device.cancelConnection(); } catch (e) { /* ignore */ }
            onError?.({ message: 'NO_HEART_RATE_SERVICE', services: serviceUuids });
            return null;
        }

        // Monitor disconnection
        const disconnectSub = device.onDisconnected(() => {
            onDisconnect?.();
        });

        // Subscribe to heart rate notifications
        const subscription = device.monitorCharacteristicForService(
            HEART_RATE_SERVICE,
            HEART_RATE_MEASUREMENT,
            (error, characteristic) => {
                if (error) {
                    onError?.(error);
                    return;
                }

                if (characteristic?.value) {
                    const bpm = parseHeartRate(characteristic.value);
                    if (bpm > 0) {
                        onHeartRate(bpm);
                    }
                }
            },
        );

        return {
            device,
            subscription,
            disconnect: async () => {
                subscription.remove();
                disconnectSub.remove();
                try {
                    const isConnected = await device.isConnected();
                    if (isConnected) {
                        await device.cancelConnection();
                    }
                } catch (e) {
                    // Already disconnected
                }
            },
        };
    } catch (error) {
        onError?.(error);
        return null;
    }
}

/**
 * Parse the raw BLE heart rate measurement data
 * Byte 0: Flags (bit 0 = format: 0=UINT8, 1=UINT16)
 * Byte 1 (or 1-2): Heart rate value
 */
function parseHeartRate(base64Value) {
    try {
        const rawData = Buffer.from(base64Value, 'base64');
        const flags = rawData[0];
        const is16Bit = flags & 0x01;

        if (is16Bit) {
            return rawData[1] | (rawData[2] << 8);
        } else {
            return rawData[1];
        }
    } catch {
        return 0;
    }
}

/**
 * Check if Bluetooth is powered on
 */
export async function isBluetoothOn() {
    const bleManager = getBleManager();
    if (!bleManager) return false;
    try {
        const state = await bleManager.state();
        return state === 'PoweredOn';
    } catch {
        return false;
    }
}

/**
 * Listen for Bluetooth state changes
 */
export function onBluetoothStateChange(callback) {
    const bleManager = getBleManager();
    if (!bleManager) {
        callback(false);
        return () => {};
    }
    const subscription = bleManager.onStateChange((state) => {
        callback(state === 'PoweredOn');
    }, true);
    return () => subscription.remove();
}

/**
 * Destroy the BLE manager (call on app exit)
 */
export function destroyBleManager() {
    if (manager) {
        manager.destroy();
        manager = null;
    }
}
