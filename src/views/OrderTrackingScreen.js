import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { api_url } from "../config/Constants";
import { useRoute } from "@react-navigation/native";
import Loader from "../components/Loader";
import { Icon } from "react-native-elements";
import { Icons } from "../components/Icons";
// import { Ionicons } from "@expo/vector-icons"; // Added for icons

const OrderTracking = () => {

    const [steps, setSteps] = useState([]);
    const routes = useRoute();
    const { id, data } = routes.params;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await handleGetStatus();
        }
        fetchData();
    }, []);

    const handleGetStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api_url}customer/status`)
            console.log(response.data.data);
            const list = response.data.data;
            const filterSteps = list.map((item) => item.status_for_customer);
            console.log(filterSteps);
            setSteps(filterSteps);
        } catch (e) {
            console.log('Error Occured : ', e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader visiable={loading} />
    }

    const currentStepIndex = steps.findIndex(s => s === data.order_status);
    const items = JSON.parse(data.items);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <View style={{ elevation: 3, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, marginBottom: 20, marginTop: 20 }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000000' }}>Lab Info :</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}>Lab Name :</Text>
                        <Text style={{ color: '#000000' }}>{data.lab_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}>Lab Address :</Text>
                        <Text style={{ color: '#000000' }}>{data.lab_address}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}>Lab Phone Number :</Text>
                        <Text style={{ color: '#000000' }}>{data.lab_number}</Text>
                    </View>
                </View>

                <View style={{ elevation: 3, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, marginBottom: 20 }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000000' }}>Delivery Boy Info :</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}> Name :</Text>
                        <Text style={{ color: '#000000' }}>{data.delivery_boy_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}> Phone Number :</Text>
                        <Text style={{ color: '#000000' }}>{data.delivery_boy_number}</Text>
                    </View>
                </View>

                <View style={{ elevation: 3, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, marginBottom: 20 }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000000' }}>Order Info :</Text>
                    </View>
                    {items.map((item, index) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={{ color: '#000000', marginRight: 10 }}> Item {index + 1} :</Text>
                            <View key={index} style={{ marginRight: 10 }}>
                                <Text style={{ color: '#000000' }}>{item.item_name}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 5 }}>
                        <Text style={{ color: '#000000', marginRight: 10 }}> #Order Id :</Text>
                        <Text style={{ color: '#000000' }}>{data.id}</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isActive = index === currentStepIndex;

                        return (
                            <View key={index} style={styles.stepContainer}>
                                <View style={styles.row}>
                                    <View style={[
                                        styles.circle,
                                        { backgroundColor: isCompleted || isActive ? '#4CAF50' : '#ccc', borderWidth: isActive ? 2 : 0 }
                                    ]}>
                                        {isCompleted ? (
                                            // <Ionicons name="checkmark" size={16} color="#fff" />
                                            <Icon type={Icons.Ionicons} name="check" size={16} color="#fff" />
                                        ) : (
                                            <Text style={styles.stepNumber}>{index + 1}</Text>
                                        )}
                                    </View>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.stepText, isCompleted && { color: '#4CAF50' }]}>
                                        {step}
                                    </Text>
                                </View>

                                {index !== steps.length - 1 && (
                                    <View style={[styles.line, { backgroundColor: isCompleted ? '#4CAF50' : '#ccc' }]} />
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderTracking;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flex: 1
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    stepContainer: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stepNumber: {
        color: '#fff',
        fontWeight: 'bold',
    },
    stepText: {
        fontSize: 16,
        color: '#000',
        flexShrink: 1,
    },
    line: {
        height: 30,
        width: 2,
        marginLeft: 14,
    },
});
