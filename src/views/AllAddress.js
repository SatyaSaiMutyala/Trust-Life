import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, FlatList, Alert, SafeAreaView } from "react-native";
import { View } from "react-native-animatable";
import { ms, vs } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';

// --- Assuming these imports exist and are correct in your project ---
import * as colors from '../assets/css/Colors';
import { regular, bold } from '../config/Constants';
import AllAddressShimmer from '../components/AllAddressShimmer';
import { useNavigation } from "@react-navigation/native";
import Icon, { Icons } from '../components/Icons';
import { blackColor, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import { StatusBar } from '../components/StatusBar';
import PrimaryButton from "../utils/primaryButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadAllAddressesAction, SetActiveAddressAction } from '../redux/actions/AllAddressActions';
// --------------------------------------------------------------------

const ADDRESS_LABEL_ICONS = {
    Home: 'home',
    Work: 'briefcase',
    Other: 'map-pin',
};

const AllAddress = () => {
    const [allAddressData, setAllAddressData] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const hasBottomOverlap = insets.bottom > 20;

    useEffect(() => {
        // Fetch addresses when the screen is focused
        const unsubscribe = navigation.addListener('focus', () => {
            handleGetAllAddress();
        });
        return unsubscribe;
    }, [navigation]);

    const handleGetAllAddress = async () => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            }
            const response = await dispatch(LoadAllAddressesAction(global.id));
            const list = response.result ?? [];

            // Set the first address as selected by default if list is not empty
            if (list.length > 0) {
                // Find the address that is marked as active in the DB, or default to the first one
                const activeAddress = list.find(addr => addr.status === 1) || list[0];
                setSelectedAddressId(activeAddress.id);
            } else {
                setSelectedAddressId(null);
            }
            setAllAddressData(list);

        } catch (e) {
            console.log('Error Occurred --->', e);
            Alert.alert('Error', 'Failed to fetch addresses. Please try again.');
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    const handleAddressSelection = (id) => {
        setSelectedAddressId(id);
    };

    // Navigate to AddAddress screen for new address creation
    const handleAddNewAddress = () => {
        // Passing isCheckout param so AddAddress knows where to navigate back to
        navigation.navigate('AddAddress', { isCheckout: true });
    };

    // Navigate to a dedicated edit screen or AddAddress screen in edit mode
    const handleEditAddress = (addressItem) => {
        // Implement logic to navigate to AddAddress screen pre-filled with item data for editing
        Alert.alert('Action', `Editing address: ${addressItem.address_label}`);
        // navigation.navigate('EditAddress', { addressData: addressItem }); // Example
    };


    const handleSelect = async () => {
        if (selectedAddressId === null) {
            Alert.alert('Selection Required', 'Please select an address to proceed.');
            return;
        }

        try {
            setLoading(true);
            // API call to set the selected address as the last active address
            const res = await dispatch(SetActiveAddressAction(global.id, selectedAddressId));
            console.log("Selection successful:-------->", res);

            // Go back to the previous screen (likely checkout/cart)
            navigation.goBack();
        } catch (err) {
            console.log("Selection error:", err);
            Alert.alert('Error', 'Failed to set active address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const AddressCard = ({ item }) => {
        const isSelected = selectedAddressId === item.id;
        const iconName = ADDRESS_LABEL_ICONS[item.address_label] || ADDRESS_LABEL_ICONS['Other'];

        // Combine address details for the main text
        const fullAddress = `${item.address || 'Address not available'} ${item.pincode ? item.pincode : ''}`;

        return (
            <TouchableOpacity
                onPress={() => handleAddressSelection(item.id)}
                style={[styles.cardContainer, isSelected && styles.selectedCardContainer]}
            >
                {/* Left Side: Icon and Text */}
                <View style={styles.contentWrapper}>
                    {/* Icon and Label */}
                    <View style={styles.iconLabelRow}>
                        <Icon
                            type={Icons.FontAwesome}
                            name={iconName}
                            size={ms(16)}
                            color={isSelected ? primaryColor : blackColor}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.addressLabelText}>
                            {item.address_label}
                        </Text>
                    </View>

                    {/* Full Address */}
                    <Text
                        style={styles.addressText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {fullAddress}
                    </Text>
                </View>

                {/* Right Side: Three-dot menu */}
                <TouchableOpacity onPress={() => handleEditAddress(item)} style={styles.menuButton}>
                    <Icon
                        type={Icons.Ionicons}
                        name="ellipsis-vertical"
                        size={ms(20)}
                        color={grayColor}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon type={Icons.Ionicons} name="arrow-back" size={ms(24)} color={blackColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Address Details</Text>
        </View>
    );

    const handleBackButtonClick = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.continer}>
            <StatusBar />
            <View style={styles.secondHeader}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={whiteColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Address</Text>
                </View>

                {loading && isInitialLoad ? (
                    <AllAddressShimmer />
                ) : (
                    <>
                        <View style={{ flex: 1, paddingHorizontal: ms(15), paddingTop: vs(15) }}>

                            {/* Add New Address Button */}
                            <TouchableOpacity onPress={() => navigation.navigate('AddressList')} style={styles.addNewButton}>
                                <Icon type={Icons.Feather} name="plus" size={ms(20)} color={primaryColor} />
                                <Text style={styles.addNewButtonText}>Add New address</Text>
                                <Icon type={Icons.AntDesign} name="right" size={ms(16)} color={primaryColor} />
                            </TouchableOpacity>

                            <Text style={styles.savedAddressHeader}>Saved Address</Text>

                            {allAddressData && allAddressData.length > 0 ? (
                                <FlatList
                                    data={allAddressData}
                                    renderItem={AddressCard}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: vs(100) }}
                                />
                            ) : (
                                <View style={styles.noAddressContainer}>
                                    <Text style={styles.noAddressText}>No saved addresses found.</Text>
                                    <Text style={styles.noAddressSubText}>Tap 'Add New address' to create one.</Text>
                                </View>
                            )}
                        </View>

                        {allAddressData.length > 0 && (
                            <View style={{
                                marginVertical: ms(25), marginHorizontal: ms(20),
                                marginBottom: hasBottomOverlap ? insets.bottom + ms(10) : ms(25),
                            }}>
                                <PrimaryButton onPress={handleSelect} title="Confirm Selection" />
                            </View>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AllAddress;

const styles = StyleSheet.create({
    continer: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    secondHeader: {
        flex: 1,
        paddingTop: ms(50),
    },
    headerButton: {
        width: ms(30),
        height: ms(30),
        borderRadius: ms(17.5),
        backgroundColor: primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ms(15)
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(10),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        marginLeft: ms(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
        borderBottomWidth: ms(1),
        borderBottomColor: colors.light_gray,
    },
    backButton: {
        padding: ms(5),
    },
    headerTitle: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginLeft: ms(10)
    },
    // --- Add New Button Style (Matching the image) ---
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vs(15),
        paddingHorizontal: ms(15),
        marginBottom: vs(20),
        borderRadius: ms(8),
        backgroundColor: whiteColor,
        borderWidth: ms(1),
        borderColor: primaryColor, // Use primary color for the border
    },
    addNewButtonText: {
        flex: 1,
        marginLeft: ms(10),
        fontSize: ms(14),
        fontFamily: regular,
        color: primaryColor,
    },
    // --- Saved Address Header ---
    savedAddressHeader: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(15),
    },
    // --- Address Card Styles (Matching the image) ---
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: whiteColor,
        borderRadius: ms(8),
        padding: ms(15),
        marginBottom: vs(15),
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: ms(1) },
        shadowOpacity: 0.1,
        shadowRadius: ms(2),
        borderWidth: ms(1),
        borderColor: whiteColor, // Default to white
    },
    selectedCardContainer: {
        borderColor: primaryColor, // Highlight border for selected card
    },
    contentWrapper: {
        flex: 1,
        marginRight: ms(10),
    },
    iconLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(5),
    },
    cardIcon: {
        marginRight: ms(8),
    },
    addressLabelText: {
        fontSize: ms(14),
        fontFamily: bold,
        color: blackColor,
    },
    addressText: {
        fontSize: ms(12),
        fontFamily: regular,
        color: blackColor,
    },
    menuButton: {
        padding: ms(5),
    },
    // --- Bottom Button Styles ---
    selectButtonWrapper: {
        paddingHorizontal: ms(15),
        paddingVertical: vs(10),
        backgroundColor: whiteColor,
        borderTopWidth: ms(1),
        borderTopColor: colors.light_gray,
    },
    selectButton: {
        borderRadius: ms(8),
        overflow: 'hidden',
    },
    selectButtonGradient: {
        paddingVertical: vs(12),
        alignItems: 'center',
    },
    selectButtonText: {
        color: whiteColor,
        fontSize: ms(16),
        fontFamily: bold,
    },
    // --- Empty State ---
    noAddressContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(50),
    },
    noAddressText: {
        fontSize: ms(16),
        color: blackColor,
        fontFamily: bold,
        marginBottom: vs(5),
    },
    noAddressSubText: {
        fontSize: ms(12),
        color: grayColor,
        fontFamily: regular,
    }
});
