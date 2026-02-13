import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { Text, View } from "react-native-animatable";
import { api_url } from "../config/Constants";
import Loader from "../components/Loader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { grey } from "../assets/css/Colors";
import axiosInstance from "./AxiosInstance";
import { useFocusEffect } from "@react-navigation/native";

const ViewAllPatients = () => {
    const [patientsData, setPatientsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState();

    // useEffect(() => {
    //     getAllPatientsData();
    // }, []);

    useFocusEffect(
        useCallback(() => {
            getAllPatientsData();
        }, [])
    );

    const getAllPatientsData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api_url}customer/family-members?customer_id=${global.id}`);
            const patients = response.data?.members ?? [];
            setPatientsData(patients);
        } catch (e) {
            console.log('Error occurred --->', e);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (member) => {
        setSelectedMember(member);
        setShowModal(true);
    }

    const handleUpdatePatient = async (data) => {
        setShowModal(false);
        const id = data?.id;
        const details = {
            'customer_id': global.id,
            'member_ids': [id]
        }
        if (data?.status == 0) {
            try {
                const response = await axiosInstance.post('customer/patients', details);
                console.log('Yes man you got it --------->', response.data);
                await getAllPatientsData();
            } catch (e) {
                console.log('Error Occured  --->', e)
            }
        } else {
            try {
                const response = await axios.delete(`${api_url}customer/patients?customer_id=${global.id}&patient_id=${id}`)
                console.log('DELECTED MAN -->', response.data);
                await getAllPatientsData();
            } catch (e) {
                console.log('Error Occured --->', e);
            }
        }
    }


    const renderPatientItem = ({ item }) => (
        <View style={styles.innerContainer}>
            <View style={styles.nameContainer}>
                <FontAwesome name="users" size={20} color={grey} />
                <View style={{ marginLeft: 8 }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
                        {item.name}
                    </Text>
                </View>
            </View>
            <View style={styles.ageContainer}>
                <Text style={styles.ageText}>{item.age} years</Text>
            </View>
            <TouchableOpacity onPress={() => { handleShowModal(item) }}>
                <View style={styles.iconContainer}>
                    <FontAwesome
                        name={item.status == 1 ? "check-circle" : "times-circle"}
                        size={30}
                        color={item.status == 1 ? 'green' : 'red'}
                    />
                </View>
            </TouchableOpacity>

            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedMember?.status == 0 ?
                            <Text style={styles.modalText}>Are you sure you want to add {selectedMember?.name} as a Patient ?</Text> :
                            <Text style={styles.modalText}>Are you sure you want to Remove {selectedMember?.name} as a Patient ?</Text>}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdatePatient(selectedMember)} style={styles.okButton}>
                                <Text style={styles.closeText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );

    const handleAddPatient = () => {
        console.log("Add Patient Clicked");
    };

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            {!loading && (
                patientsData.length > 0 ? (
                    <FlatList
                        data={patientsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderPatientItem}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No patients found</Text>
                    </View>
                )
            )}
        </View>
    );
};

export default ViewAllPatients;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
    },
    list: {
        paddingVertical: 16,
    },
    innerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 3,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    ageText: {
        fontSize: 16,
        color: '#666',
    },
    noDataContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    noDataIcon: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    noDataText: {
        fontSize: 18,
        color: '#999',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    nameContainer: {
        flex: 2,
        paddingRight: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },

    ageContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },

    iconContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },

    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },

    ageText: {
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
    },
    okButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 8,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
    }
});
