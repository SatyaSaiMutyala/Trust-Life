import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { StatusBar2 } from '../../components/StatusBar';

const PaymentSuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { doctor, selectedSlot, selectedDate, patient } = route.params || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('AppointmentConfirmedScreen', {
                doctor,
                selectedSlot,
                selectedDate,
                patient,
            });
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <View style={styles.center}>
                <View style={styles.iconCircle}>
                    <Icon type={Icons.MaterialIcons} name="check" size={ms(52)} color="#fff" />
                </View>
                <Text style={styles.amount}>₹620</Text>
                <Text style={styles.title}>Payment Successfully</Text>
                <Text style={styles.subtitle}>
                    Your Booking Will Be Confirmed Shortly, And Our Team Is Preparing For Your Test.
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(36),
    },
    iconCircle: {
        width: ms(90),
        height: ms(90),
        borderRadius: ms(45),
        backgroundColor: '#43A047',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(24),
    },
    amount: {
        fontSize: ms(32),
        fontWeight: '800',
        color: '#1B1B1B',
        marginBottom: vs(6),
    },
    title: {
        fontSize: ms(18),
        fontWeight: '700',
        color: '#1B1B1B',
        marginBottom: vs(10),
    },
    subtitle: {
        fontSize: ms(13),
        color: '#666',
        textAlign: 'center',
        lineHeight: ms(20),
    },
});
