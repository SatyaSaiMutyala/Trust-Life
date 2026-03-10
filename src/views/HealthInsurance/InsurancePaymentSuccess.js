import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';

const InsurancePaymentSuccess = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const plan = route.params?.plan;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.center}>
                <View style={styles.iconCircle}>
                    <Icon type={Icons.Ionicons} name="checkmark" size={ms(44)} color="#fff" />
                </View>
                <Text style={styles.amount}>{plan?.premium || '₹450'}</Text>
                <Text style={styles.title}>Payment Successfully</Text>
            </View>
        </SafeAreaView>
    );
};

export default InsurancePaymentSuccess;

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
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        backgroundColor: '#43A047',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    amount: {
        fontSize: ms(32),
        fontFamily: bold,
        color: '#1B1B1B',
        marginBottom: vs(6),
    },
    title: {
        fontSize: ms(16),
        fontFamily: bold,
        color: '#1B1B1B',
    },
});
