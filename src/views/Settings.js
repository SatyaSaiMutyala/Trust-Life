import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

// Settings menu items
const SETTINGS_ITEMS = [
    {
        id: 1,
        title: 'Change Password',
        subtitle: 'Update your password to keep your account secure',
        icon: 'shield-checkmark-outline',
        iconType: Icons.Ionicons,
        screen: 'ChangePassword',
    },
    {
        id: 2,
        title: 'Change Mobile Number',
        subtitle: 'Update your mobile number to keep your account updated',
        icon: 'chatbubble-ellipses-outline',
        iconType: Icons.Ionicons,
        screen: 'ChangeMobile',
    },
    {
        id: 3,
        title: 'Fingerprint access',
        subtitle: 'Update your mobile number to keep your account secure',
        icon: 'finger-print-outline',
        iconType: Icons.Ionicons,
        screen: 'FingerprintSettings',
    },
];

const SettingsMore = () => {
    const navigation = useNavigation();

    const handleItemPress = (item) => {
        if (item.id === 2) {
            // Change Mobile Number - navigate to OTP screen with source parameter
            navigation.navigate('otpScreen', { source: 'ChangeMobile' });
        } else if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

    const SettingsItem = ({ item }) => (
        <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => handleItemPress(item)}
        >
            <View style={styles.iconWrapper}>
                <Icon
                    type={item.iconType}
                    name={item.icon}
                    color={blackColor}
                    size={ms(22)}
                />
            </View>
            <View style={styles.textContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.subtitle}
                </Text>
            </View>
            <Icon
                type={Icons.Ionicons}
                name="chevron-forward"
                color="#9CA3AF"
                size={ms(20)}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header with Gradient */}
            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.23]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {SETTINGS_ITEMS.map((item) => (
                    <SettingsItem key={item.id} item={item} />
                ))}
            </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default SettingsMore;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: whiteColor,
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
        marginTop:ms(25)
    },
    scrollContent: {
        // paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(30),
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(12),
        padding: ms(15),
        marginBottom: vs(12),
    },
    iconWrapper: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
    },
    textContent: {
        flex: 1,
    },
    itemTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(3),
    },
    itemSubtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
    },
});
