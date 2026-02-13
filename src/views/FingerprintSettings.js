import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { vs, ms } from 'react-native-size-matters';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, whiteColor, globalGradient, primaryColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';

const FingerprintSettings = () => {
    const navigation = useNavigation();
    const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

    const handleConfirm = () => {
        // TODO: Save fingerprint preference to backend
        console.log('Fingerprint enabled:', isFingerprintEnabled);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header with Gradient */}
                <LinearGradient
                    colors={globalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.24]}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Fingerprint access</Text>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Fingerprint Toggle Card */}
                        <View style={styles.fingerprintCard}>
                            <View style={styles.iconWrapper}>
                                <Icon
                                    type={Icons.Ionicons}
                                    name="finger-print-outline"
                                    color={blackColor}
                                    size={ms(24)}
                                />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={styles.cardTitle}>Fingerprint access</Text>
                                <Text style={styles.cardSubtitle} numberOfLines={1}>
                                    Update your mobile number to keep yo...
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#D1D5DB', true: primaryColor }}
                                thumbColor={whiteColor}
                                ios_backgroundColor="#D1D5DB"
                                onValueChange={setIsFingerprintEnabled}
                                value={isFingerprintEnabled}
                                style={styles.switch}
                            />
                        </View>
                    </ScrollView>

                    {/* Confirm Button */}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={handleConfirm} title="Confirm" />
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default FingerprintSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    keyboardView: {
        flex: 1,
    },
    headerGradient: {
        flex: 1,
        paddingTop: ms(50),
        paddingBottom: vs(25),
        paddingHorizontal: ms(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(15),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(20),
        color: whiteColor,
    },
    scrollView: {
        flex: 1,
        marginTop: ms(20),
    },
    scrollContent: {
        paddingTop: vs(25),
        paddingBottom: vs(30),
    },
    fingerprintCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(15),
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconWrapper: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(22.5),
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    textContent: {
        flex: 1,
    },
    cardTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(3),
    },
    cardSubtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    buttonContainer: {
        paddingBottom: vs(30),
    },
});
