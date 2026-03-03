import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from '../../components/Icons';
import { whiteColor } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const PaymentSuccessScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('MedicineOrderPlacedScreen');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#1A7E70', '#2AA390', '#3CC4AB']}
            style={styles.container}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Checkmark Circle */}
            <View style={styles.checkCircle}>
                <Icon
                    type={Icons.Ionicons}
                    name="checkmark"
                    size={ms(48)}
                    color={whiteColor}
                />
            </View>

            {/* Amount */}
            <Text style={styles.amount}>₹620</Text>

            {/* Title */}
            <Text style={styles.title}>Payment Successfully</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Your Payment Has Been Completed Successfully
            </Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(40),
    },
    checkCircle: {
        width: ms(90),
        height: ms(90),
        borderRadius: ms(45),
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(24),
    },
    amount: {
        fontFamily: bold,
        fontSize: ms(36),
        color: whiteColor,
        marginBottom: vs(10),
    },
    title: {
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginBottom: vs(8),
    },
    subtitle: {
        fontFamily: regular,
        fontSize: ms(13),
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: ms(20),
    },
});

export default PaymentSuccessScreen;
