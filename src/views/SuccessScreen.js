import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import { ms, vs } from 'react-native-size-matters';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, whiteColor } from '../utils/globalColors';

const SuccessScreen = ({ navigation, route }) => {
    // Get params with defaults
    const {
        title = 'Successfully',
        subtitle = 'Completed',
        delay = 2000,
        targetScreen = 'Home',
        targetParams = {},
        useNavigate = false,
        type = 'success',
    } = route?.params || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            if (useNavigate) {
                navigation.navigate(targetScreen, targetParams);
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: targetScreen, params: targetParams }],
                });
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [navigation, delay, targetScreen, targetParams, useNavigate]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <View style={styles.content}>
                {/* Icon */}
                {type === 'cancel' ? (
                    <View style={styles.cancelIcon}>
                        <Icon
                            type={Icons.Ionicons}
                            name="close"
                            color={whiteColor}
                            size={ms(32)}
                        />
                    </View>
                ) : (
                    <Image
                        source={require('../assets/img/checkMark.png')}
                        style={styles.successImage}
                        resizeMode="contain"
                    />
                )}

                {/* Success Text */}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </SafeAreaView>
    );
};

export default SuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(20),
    },
    successImage: {
        width: ms(80),
        height: ms(80),
        marginBottom: vs(5),
    },
    cancelIcon: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(35),
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    title: {
        fontSize: ms(22),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: ms(22),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        marginTop: vs(2),
    },
});
