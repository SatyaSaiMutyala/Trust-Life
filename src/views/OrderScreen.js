import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, Dimensions
} from 'react-native';
import { api_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');


const OrderScreen = () => {
    const [selectedTab, setSelectedTab] = useState('current');
    const [orders, setOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [status, setStatus] = useState([]);
    const navigation = useNavigation();

    const translateX = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        async function fetchData() {
            await handleGetOrders();
            await handleGetPendingOrders();
            await handleGetStatus();
        }
        fetchData();
    }, [selectedTab]);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        Animated.timing(translateX, {
            toValue: tab === 'current' ? 0 : width / 2,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const formatDate = (date) => {
        return date.split(' ')[0];
    }

    const handleGetOrders = async () => {
        try {
            const response = await axios.get(`${api_url}customer/get-orders/${global.id}`)
            console.log(global.id);
            console.log('completed -------------');
            console.log(response.data.results);
            const list = response.data.results;
            setCompletedOrders(list);
        } catch (e) {
            console.log('Error occured :', e);
        }
    }

    const handleGetPendingOrders = async () => {
        try {
            const response = await axios.get(`${api_url}customer/get-pending-orders/${global.id}`)
            console.log('Pending data -------------');
            console.log(response.data.results);
            const list = response.data.results;
            setOrders(list);
        } catch (e) {
            console.log('Error occured :', e);
        }
    }

    const handleGetStatus = async () => {
        try {
            const response = await axios.get(`${api_url}customer/status`)
            console.log('status ---------------');
            const list = response.data.data;
            setStatus(list);

        } catch (e) {
            console.log('Error occured :', e);
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate('OrderTracking',{ id: item.id, data: item }) } >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical:4 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#000000' }}>Lab :</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ color: 'grey' }}>{item.lab_name}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 4 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#000000' }}>Delivery Boy :</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ color: 'grey' }}>{item.delivery_boy_name ?? 'Not Yet Assigned'}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 4 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#000000' }}>Date :</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ color: 'grey' }}>{formatDate(item.created_at)}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 4, backgroundColor: item.status >= 6 ? colors.success_background : colors.warning_background,}}>
                <View style={{ flex: 1, paddingHorizontal:5 }}>
                    <Text style={{ color: item.status >= 6 ? colors.success : colors.warning, fontWeight:'bold' }}>Status :</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={{ color: item.status >= 6 ? colors.success : colors.warning, fontWeight:'bold' }}>{item.order_status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <View style={styles.tabButtons}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => handleTabPress('current')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'current' && styles.activeText
                        ]}>
                            Pending Orders
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => handleTabPress('all')}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'all' && styles.activeText
                        ]}>
                            All Orders
                        </Text>
                    </TouchableOpacity>
                </View>

                <Animated.View
                    style={[
                        styles.animatedLine,
                        {
                            transform: [{ translateX }],
                            width: width / 2
                        }
                    ]}
                />
            </View>

            {
                selectedTab == 'all' ? (
                    completedOrders.length === 0 ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#000000' }}>NO DATA FOUND</Text></View>)
                        : (
                            <FlatList
                                data={completedOrders}
                                keyExtractor={item => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={{ paddingVertical: 20 }}
                            />
                        )
                ) : (
                    orders.length === 0 ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#000000' }}>NO DATA FOUND</Text></View>) :
                        (<FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingVertical: 20 }}
                        />)
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor:'#ffffff'
    },
    tabContainer: {
        height: 50,
        marginBottom: 16,
    },
    tabButtons: {
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    tabText: {
        fontSize: 16,
        color: '#777',
    },
    activeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    animatedLine: {
        height: 3,
        backgroundColor: '#4CAF50',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    orderItem: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        backgroundColor: '#ffffffff',
        elevation: 2,
        borderRadius: 8
    }
});

export default OrderScreen;
