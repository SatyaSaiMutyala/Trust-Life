
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, Image, Dimensions, Keyboard, FlatList, TouchableHighlight, BackHandler, Alert, Modal } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular, light, api_url, other_charges, offer_img, location, user_details_img, customer_lab_place_order, customer_get_profile } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { updateLabAddToCart, updateLabSubTotal, updateLabCalculateTotal, updateLabTotal, updateLabDiscount, updateLabTaxList, updateLabTax, updateLabPatientAge } from '../actions/LabOrderActions';
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateAddress } from '../actions/CurrentAddressActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LoadLabCartItemsAction } from '../redux/actions/LabCartItemsActions';
import { LoadPatientsAction, DeletePatientAction } from '../redux/actions/PatientsActions';
import { LoadLastAddressAction } from '../redux/actions/LastAddressActions';
import { LoadLabsListAction } from '../redux/actions/LabsListActions';
import { AddPatientAction } from '../redux/actions/AddPatientActions';
import { EditPatientAction } from '../redux/actions/EditPatientActions';
import { PlaceLabOrderAction } from '../redux/actions/PlaceLabOrderActions';
import { LoadTaxListAction } from '../redux/actions/TaxListActions';
import { LoadCustomerProfileAction } from '../redux/actions/CustomerProfileActions';
import { DeleteCartItemAction } from '../redux/actions/DeleteCartItemActions';
import { ApplyCouponAction } from '../redux/actions/ApplyCouponActions';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from './AxiosInstance';
import { Button } from 'react-native-elements';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { blackColor, grayColor, primaryColor, whiteColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import { scale, verticalScale, moderateScale, s } from 'react-native-size-matters';
import { useSnack } from '../context/GlobalSnackBarContext';
import EmptyCart from './EmptyCart';
import CartShimmer from '../components/CartShimmer';
import { ms, vs } from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';

const { width, height, fontScale } = Dimensions.get('window');

const LabCart = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Get data from Redux store
    const { data: labCartData, loading: cartLoading } = useSelector(state => state.lab_cart_items);
    const { data: patientsRedux, loading: patientsLoading } = useSelector(state => state.patients);
    const { data: lastAddress, loading: addressLoading } = useSelector(state => state.last_address);
    const { data: labsListData, loading: labsListLoading } = useSelector(state => state.labs_list);
    const { loading: addPatientLoading } = useSelector(state => state.add_patient);
    const { loading: editPatientLoading } = useSelector(state => state.edit_patient);
    const { loading: placeLabOrderLoading } = useSelector(state => state.place_lab_order);
    const { data: taxListData, loading: taxListLoading } = useSelector(state => state.tax_list);
    const { loading: customerProfileLoading } = useSelector(state => state.customer_profile);
    const { loading: deleteCartItemLoading } = useSelector(state => state.delete_cart_item);
    const { loading: applyCouponLoading } = useSelector(state => state.apply_coupon);

    // Combined loading state - only include critical initial load operations
    // Don't block UI for add/edit/delete/apply coupon operations
    const loading = cartLoading || patientsLoading || addressLoading || labsListLoading;

    const [special_instruction, setSpecialInstruction] = useState('');
    const [booking_type, setBookingType] = useState(1);
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [dob, setDob] = useState(new Date());
    const [centerList, setCenterList] = useState('');
    const [bookDate, setBookDate] = useState('');
    const [bookTime, setBookTime] = useState('');
    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showList, setShowList] = useState(false);
    const [press, setPress] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [addPatientList, setAddPatientList] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [patientsData, setPatientsData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(null);
    const [cartIds, setCartIds] = useState([]);
    const [address, setAddress] = useState([]);
    const [currentLat, setCurrentLat] = useState();
    const [currentLng, setCurrentLng] = useState();
    const [nearstLabData, setNearstLabData] = useState([]);
    const [recomendedLab, setRecomendedLab] = useState([]);
    const [labId, setLabId] = useState();
    const [selectedLabName, setSelectedLabName] = useState('');
    const [labAddress, setLabAddress] = useState([]);
    const [showListModel, setShowListModel] = useState(false);
    const [showPatientModel, setPatientModeal] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [couponId, setCouponId] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);


    const [patientId, setPatientId] = useState(0);
    const [patientName, setPatientName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [patientGender, setPatientGender] = useState(null);
    const [patientRelation, setPatientRelation] = useState(null);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showRelationDropdown, setShowRelationDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { showSnack } = useSnack();

    const DATA = [
        {
            id: 1,
            title: 'Profile',
            icon: 'person-outline',
            type: Icons.Ionicons
        },
        {
            id: 2,
            title: 'My Booking',
            icon: 'reader-outline',
            type: Icons.Ionicons
        },
        {
            id: 3,
            title: 'Add Family Members',
            icon: 'heart-outline',
            type: Icons.Ionicons
        },
        {
            id: 4,
            title: 'Privacy Policies',
            icon: 'lock-closed-outline',
            type: Icons.Ionicons
        },
        {
            id: 5,
            title: 'Settings ',
            icon: 'settings-outline',
            type: Icons.Ionicons
        },
        {
            id: 6,
            title: 'Help',
            icon: 'question',
            type: Icons.AntDesign
        },
        {
            id: 7,
            title: 'Logout',
            icon: 'log-out-outline',
            type: Icons.Ionicons
        },
    ];

    const CARD_MARGIN = ms(16);
    const CARD_PADDING = ms(10);
    const CARD_WIDTH = width - (2 * CARD_MARGIN);
    const IMAGE_SIZE = ms(80);
    const genders = ['Male', 'Female'];
    const relations = ['Self', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];

    // Sync Redux data with local state
    useEffect(() => {
        if (labCartData.cart_items) {
            const items = labCartData.cart_items ?? [];
            setCartData(items);
            handleSumPrice(items);
        }
    }, [labCartData]);

    useEffect(() => {
        if (patientsRedux) {
            setPatientsData(patientsRedux ?? []);
        }
    }, [patientsRedux]);

    useEffect(() => {
        if (lastAddress) {
            setAddress(lastAddress ?? []);
        }
    }, [lastAddress]);

    useEffect(() => {
        if (labsListData) {
            const lab = labsListData.nearest ?? [];
            const lab2 = labsListData.recommended ?? [];
            setNearstLabData(lab);
            setRecomendedLab(lab2);
        }
    }, [labsListData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setCurrentLat(props.current_lat);
            setCurrentLng(props.current_lng);
            console.log('Lat and long ---->', props.current_lat, "lng", props.current_lng);

            // Run all API calls in PARALLEL for MUCH FASTER loading (< 2 seconds)
            // All APIs will execute simultaneously instead of waiting for each other
            try {
                await Promise.all([
                    getCardData(),
                    handleGetPatientsData(),
                    handleGetAddress(),
                    handleGetLabs(),
                    patientList()
                ]);
            } catch (error) {
                console.log('Error loading data:', error);
            }
        });
        return unsubscribe;
    }, []);

    const getCardData = async () => {
        try {
            await dispatch(LoadLabCartItemsAction(global.id));
            const items = labCartData.cart_items ?? [];
            console.log('ALL CARTS DATA : ', items);
            setCartData(items);
            handleSumPrice(items);
        } catch (e) {
            console.log('ERROR OCCURED 2 :', e);
        }
    }

    const handleSumPrice = (data) => {
        const totalPrice = data.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const formattedTotal = totalPrice.toFixed(2);
        console.log('Total Price:', formattedTotal);
        setTotalPrice(formattedTotal);
        const ids = data.map((item) => item.id);
        setCartIds(ids);
    };

    const handleGetPatientsData = async () => {
        try {
            await dispatch(LoadPatientsAction(global.id));
            const patients = patientsRedux ?? [];
            console.log('Response of Patients get ---->', patients);
            setPatientsData(patients);
        } catch (e) {
            console.log('Error occured ---> in Patients', e);
        }
    }

    const handleGetAddress = async () => {
        try {
            await dispatch(LoadLastAddressAction(global.id));
            console.log('GET Address --->', lastAddress);
            const address = lastAddress ?? [];
            setAddress(address);
        } catch (e) {
            console.log('Error occured -->', e);
        }
    }

    const handleGetLabs = async () => {
        console.log('lat --->', currentLat, "--->", currentLng);
        try {
            await dispatch(LoadLabsListAction(props.current_lat, props.current_lng, ""));
            console.log('I got near labs man ----->', labsListData.nearest);
            const lab = labsListData.nearest ?? [];
            const lab2 = labsListData.recommended ?? [];
            setNearstLabData(lab);
            setRecomendedLab(lab2);
        } catch (e) {
            console.log('Error Occured :', e);
        }
    }

    const handleAddPatient = async () => {
        console.log('im in -------------');
        if (patientName == '' || patientRelation == '' || dateOfBirth == null) {
            // Alert.alert("Please fill the all details")
            showSnack('error', "Please fill the all details");
        } else if (patientGender == '') {
            // Alert.alert('Please Reselect the Gender');
            showSnack('error', "Please Reselect the Gender");
        } else {
            try {
                const response = await dispatch(AddPatientAction(global.id, patientName, dateOfBirth, patientGender, patientRelation));
                console.log('Response --->', response);
                // handleBackButtonClick();
                await handleGetPatientsData();
                setPatientName('');
                setDateOfBirth('');
                setPatientGender('');
                setPatientRelation('');
                setPatientModeal(false);
            } catch (e) {
                console.log("❌ AXIOS ERROR FULL:", e);
                if (e.response) {
                    console.log("📌 STATUS:", e.response.status);
                    console.log("📌 ERROR DATA:", e.response.data);
                    console.log("📌 ERROR MESSAGE:", e.response.data.message);
                } else if (e.request) {
                    console.log("📌 NO RESPONSE RECEIVED:", e.request);
                } else {
                    console.log("📌 ERROR MESSAGE:", e.message);
                }
                Alert.alert('Something went wrong, please check console');
            }
        }
    }

    const handlePatientEdit = async () => {
        console.log('im in Edit function-------------');
        if (patientName == '' || patientRelation == '' || dateOfBirth == null) {
            Alert.alert("Please fill the all details")
        } else if (patientGender == '') {
            Alert.alert('Please Reselect the Gender');
        } else {
            try {
                const response = await dispatch(EditPatientAction(patientId, global.id, patientName, dateOfBirth, patientGender, patientRelation));
                console.log('Response --->', response);
                // handleBackButtonClick();
                await handleGetPatientsData();
                setPatientName('');
                setDateOfBirth('');
                setPatientGender('');
                setPatientRelation('');
                setPatientModeal(false);
            } catch (e) {
                console.log('Error occured : ', e);
                Alert.alert('Somthing went Please check ');
            }
        }
    }

    const handleEditPatient = (item) => {
        setPatientId(item.id);
        setPatientName(item.name);
        setDateOfBirth(item.date_of_birth);
        setPatientGender(item.gender);
        setPatientRelation(item.relation);
        setPatientModeal(true);
        setIsEdit(true);
    }

    const handleClear = () => {
        // Reset fields
        setPatientName('');
        setDateOfBirth('');
        setPatientGender('');
        setPatientRelation('');
        setPatientModeal(false);
        setIsEdit(false);
    };

    const handleDateChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            setDateOfBirth(formattedDate);
        }
    };

    const handleDatePicker = () => {
        setShowDatePicker(true);
    };


    // const onChange = (event, selected) => {
    //   setShow(Platform.OS === 'ios');
    //   if (selected) {
    //     const formatted = selected.toISOString().split('T')[0]; // e.g., "2025-05-14"
    //     setBookDate(formatted);
    //     console.log("Date selected -->",formatted);
    //   }
    // };

    const validateForm = () => {
        const errors = [];
        // Check if logged in
        if (global.id == 0) {
            errors.push({ icon: 'person-outline', message: 'Please login to continue' });
        }
        // Check if lab is selected
        if (!labId || !selectedLabName) {
            errors.push({ icon: 'business-outline', message: 'Please select a TRUSTlab center' });
        }
        // Check if date is selected
        if (!bookDate) {
            errors.push({ icon: 'calendar-outline', message: 'Please select booking date' });
        }
        // Check if time is selected
        if (!bookTime) {
            errors.push({ icon: 'time-outline', message: 'Please select booking time' });
        }
        // Check if patient details added
        if (!patientsData || patientsData.length === 0) {
            errors.push({ icon: 'medkit-outline', message: 'Please add patient details' });
        }
        // Check if address is selected
        if (!address || !address.id) {
            errors.push({ icon: 'location-outline', message: 'Please select patient address' });
        }
        return errors;
    };

    const handleSubmitData = async () => {
        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            setValidationErrors(errors);
            setShowValidationModal(true);
            return;
        }
        // Proceed with submission
        const cartIds = cartData.map(item => item.id);
        console.log('cartIds --->', cartIds);
        const patientIds = patientsData.map((item) => item.id);
        console.log('patientIds -->', patientIds);
        console.log(patientsData[0].name);
        console.log(patientsData[0].date_of_birth, '---------------------', global.id);
        const itemData = cartData.map((item) => ({
            item_id: item.package_details.id,
            item_name: item.package_details.test_name,
            price: item.price,
        }));

        console.log('items data man ----->', JSON.stringify(itemData));
        const genderId = patientsData[0].gender == 'Male' ? 1 : 2;

        // Calculate final total after discount
        const finalTotal = parseFloat(totalPrice || 0) - parseFloat(discountAmount || 0);

        const data = {
            "customer_id": parseInt(global.id),
            "patient_name": patientsData[0].name,
            "patient_dob": patientsData[0].date_of_birth,
            "patient_gender": genderId,
            "lab_id": labId,
            "address_id": address?.id,
            "promo_id" : 1,
            "coupon_id": couponId || 0,
            "discount": parseFloat(discountAmount || 0),
            "tax": 0,
            "total": parseFloat(finalTotal.toFixed(2)),
            "sub_total": parseInt(totalPrice),
            "payment_mode": 2,
            "items": JSON.stringify(itemData),
            "cart_ids": cartIds,
            "booking_type": booking_type,
            "booking_date": bookDate,
            "booking_time": bookTime,
        }
        console.log('DATA :', data);
        try {
            const response = await dispatch(PlaceLabOrderAction(data));
            console.log('This is place the order ---->', response);
            console.log('data --------->', data, '---------->', customer_lab_place_order);
            navigation.navigate("PaymentMethods", { data: data, from: "lab_cart", type: 2, route: customer_lab_place_order, amount: finalTotal.toFixed(2), responseData: response })
        } catch (e) {
            console.log('Error Occured :', e.response?.data || e.message);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        }
    }

    const handleDelectPatient = async (id) => {
        try {
            await dispatch(DeletePatientAction(global.id, id));
            console.log('Patient deleted successfully');
            await handleGetPatientsData();
        } catch (e) {
            console.log('Error occured -->', e);
        }
    }

    const handleBackButtonClick = () => {
        navigation.goBack()
    }
    const patientList = async () => {
        let members = await AsyncStorage.getItem('AddPatientList');
        let list = JSON.parse(members)
        setAddPatientList([...list])
    }

    const getTaxList = async () => {
        try {
            const response = await dispatch(LoadTaxListAction(4));
            await props.updateLabTaxList(response.result);
            props.updateLabCalculateTotal();
        } catch (error) {
            console.log(error)
            alert('Sorry something went wrong');
        }
    }

    const patient_details = () => {
        navigation.navigate("PatientDetails", { name: global.customer_name, gender: gender, dob: dob, age: age })
        //navigation.navigate("PatientDetails")
    }

    const AddPatient_details = () => {
        // navigation.navigate("PatientDetails",{name:global.customer_name,gender:gender,dob:dob,age:age})
        navigation.navigate('ListFamilyMembers')
        //navigation.navigate("PatientDetails")
    }

    const promo_code = () => {
        navigation.navigate("PromoCode", { from: 'lab' });
    }

    const add_test = () => {
        navigation.navigate('home');
    }

    const change_address = () => {
        navigation.navigate("AddressList", { from: "lab_cart" })
    }

    const change_booking_type = (type) => {
        setBookingType(type);
    }

    const view_profile = async () => {
        try {
            const response = await dispatch(LoadCustomerProfileAction(global.id));
            console.log('first', response.result)
            // if(response.result.gender = 1){
            //   setGender('Male');
            // }else if (response.result.gender =2){
            //   setGender('Female');
            // }else{
            //   setGender('Other');
            // }
        } catch (error) {
            console.log('error', error)
            Alert.alert('Sorry something went wrong')
        }
    }

    const navigate = () => {
        if (props.patient_gender_id == undefined || props.patient_name == undefined || props.patient_dob == undefined) {
            patient_details();
        } else if (props.current_address == undefined) {
            alert('Please select your address.')
        } else if (global.id == 0) {
            navigation.navigate("CheckPhone");
        } else {
            let data = {
                customer_id: global.id,
                patient_name: props.patient_name,
                patient_dob: props.patient_dob,
                patient_gender: props.patient_gender_id,
                lab_id: props.lab_id,
                // address_id:props.address.id,
                address_id: props.current_address,
                promo_id: props.promo ? props.promo.id : 0,
                discount: props.discount,
                booking_type: booking_type,
                tax: props.tax,
                sub_total: props.sub_total,
                total: props.total,
                special_instruction: special_instruction,
                items: JSON.stringify(Object.values(props.cart_items)),
                payment_mode: props.payment_mode,
            }
            navigation.navigate("PaymentMethods", { data: data, from: "lab_cart", type: 2, route: customer_lab_place_order, amount: props.total, })
        }
    }




    const handleBackButton = () => {
        console.log('showList', showList)
        if (!showList) {
            handleBackButtonClick()
        }
        setShowList(false)
        return true;
    }

    const addAppExitConfirmation = () => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }

    const removeAppExitConfirmation = () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }

    useFocusEffect(
        useCallback(() => {
            addAppExitConfirmation();
            return () => {
                removeAppExitConfirmation();
            }
        }, [])
    );
    const selectList = (id, title) => {
        console.log('name of the lab --->', title);
        setShowList(false)
        console.log('item', title)
        setCenterList(title)
    }
    const renderCenterList = ({ item }) => {
        return (
            <TouchableHighlight onPress={selectList.bind(this, item.id, item.lab_name)
            } style={{ width: '100%', height: 50, backgroundColor: colors.theme_fg_three, borderWidth: 3, borderRadius: 10, borderColor: colors.theme_color, marginBottom: 10, justifyContent: 'flex-start' }} underlayColor={'#00ccff'} >
                <Text style={{ color: press ? colors.theme_bg_three : colors.theme_color, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>{item.title}</Text>
            </TouchableHighlight>
        );
    }
    const selectLab = (id) => {
        const updatedPatients = DATA.map((item) => {
            // Check if the current item's ID matches the one being checked
            if (item.id === id) {

                setCenterList(item.title); // Set the gender state

                return { ...item }; // Mark this item as checked
            } else {
                return { ...item }; // Uncheck all other items
            }
        });

    }

    const [CartItems, SetUpdatedCartItems] = useState(props.cart_items);


    const DeleteItem = async (id) => {
        console.log('Deleting item with id:', id);
        try {
            const response = await dispatch(DeleteCartItemAction(global.id, id));
            console.log(response);
            getCardData();
        } catch (e) {
            console.log('Error Occured :  ------------->', e);
        }
        SetUpdatedCartItems(updatedCartItems);
    };

    const handlePasteCoupon = async () => {
        try {
            const text = await Clipboard.getString();
            if (text) {
                setCouponCode(text);
                console.log('Pasted coupon code:', text);
            }
        } catch (error) {
            console.log('Error pasting coupon code:', error);
        }
    }

    const calculateDiscount = (couponData, totalPrice) => {
        const amount = parseFloat(couponData.amount);
        const total = parseFloat(totalPrice);

        if (couponData.type === 'discount') {
            // Percentage discount
            return (total * amount) / 100;
        } else if (couponData.type === 'fixed') {
            // Fixed amount discount
            return amount;
        }
        return 0;
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        setCouponId(0);
        showSnack('info', 'Coupon removed');
    }

    const handleApplyCoupon = async () => {
        if (couponCode.trim() === '') {
            showSnack('error', 'Please enter a coupon code');
            return;
        }

        if (global.id == 0) {
            showSnack('error', 'Please login to apply coupon');
            return;
        }

        try {
            const response = await dispatch(ApplyCouponAction(couponCode.trim(), global.id));
            console.log('Coupon API Response:', response);

            if (response.status) {
                const couponData = response.data;
                console.log('Coupon Data:', couponData);

                // Calculate discount based on coupon type
                const discount = calculateDiscount(couponData, totalPrice);
                console.log('Calculated Discount:', discount);

                // Store coupon data and discount
                setAppliedCoupon(couponData);
                setDiscountAmount(discount);
                setCouponId(couponData.coupon_id);

                showSnack('success', response.message || 'Coupon applied successfully');
            } else {
                showSnack('error', response.message || 'Failed to apply coupon');
            }
        } catch (error) {
            console.log('Error applying coupon:', error);

            if (error.response) {
                // Server responded with error status
                const message = error.response.data?.message || 'Failed to apply coupon';
                showSnack('error', message);
            } else if (error.request) {
                // Request was made but no response received
                showSnack('error', 'Network error. Please check your connection');
            } else {
                // Something else happened
                showSnack('error', 'Something went wrong. Please try again');
            }
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <View style={styles.secondHeader}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cart</Text>
                </View>
                {loading ? (
                    <CartShimmer />
                ) : cartData.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <ScrollView style={{ marginBottom: 10 }} showsVerticalScrollIndicator={false}>
                        <View style={{ borderWidth: 1, borderColor: primaryColor, marginHorizontal: ms(15), marginVertical: 5, paddingVertical: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#fff' }}>
                            <Icon type={Icons.AntDesign} name="plus" color={primaryColor} size={24} />
                            <TouchableOpacity
                                onPress={() => navigation.navigate("LabDetails", { lab_id: 1, lab_name: 'Newlab', name: 'Home' })}
                            >
                                <Text style={{ fontSize: 16, fontWeight: 900, color: primaryColor, marginLeft: 10 }}>ADD MORE TESTS</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginVertical: 20, marginHorizontal: ms(15), flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingVertical: 10 }}>
                            {cartData.map((row, index) => (
                                <TouchableOpacity
                                    style={{
                                        width: CARD_WIDTH,
                                        backgroundColor: '#F8FAFC',
                                        borderRadius: 15,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: CARD_PADDING,
                                        marginBottom: 10,
                                        paddingVertical: CARD_PADDING + 20,
                                    }}
                                >
                                    <View style={{ marginRight: 15, position: 'relative' }}>
                                        <View
                                            style={{
                                                width: IMAGE_SIZE,
                                                height: IMAGE_SIZE,
                                                backgroundColor: '#F3F5FC',
                                                borderRadius: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                source={require('../assets/img/cardImg.png')}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    resizeMode: 'contain',
                                                }}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: IMAGE_SIZE * 0.3,
                                                backgroundColor: '#1EAE55',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingHorizontal: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: ms(9),
                                                    fontWeight: '600',
                                                    color: '#FFFFFF'
                                                }}
                                            >
                                                Reports in {(row?.package_details?.report_tat || "").split("by")[0].trim()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, height: IMAGE_SIZE, justifyContent: 'space-between' }}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: ms(13),
                                                    fontWeight: 'bold',
                                                    color: '#000000',
                                                    lineHeight: ms(16),
                                                }}
                                                numberOfLines={2}
                                            >
                                                {row.package_details?.test_name}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: ms(12),
                                                    color: '#666666',
                                                    marginTop: 3
                                                }}
                                            >
                                                Read Test Preparation
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                            <Text style={{
                                                fontSize: ms(14),
                                                fontWeight: 'bold',
                                                color: '#000000',
                                            }}>
                                                ₹{row.price}
                                            </Text>
                                            <TouchableOpacity onPress={() => DeleteItem(row.id) } style={{
                                                backgroundColor: '#FFF5F4',
                                                borderRadius: 20,
                                                paddingHorizontal: 25,
                                                paddingVertical: 10,
                                                justifyContent: 'center',
                                                marginLeft: 10,
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                                    <Icon type={Icons.Feather} name='x' size={16} color='#FF725E' />
                                                    <Text style={{ marginLeft: 10, fontSize: 13, fontWeight: 900, color: '#FF725E' }}>Remove</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>


                        <View style={{ marginHorizontal: ms(15), backgroundColor: '#F8FAFC', paddingVertical: 15, marginBottom: 5, paddingHorizontal: 20, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image
                                    source={require('../assets/img/offerImg.png')}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: 'contain',
                                    }}
                                />
                                <Text style={{ color: '#86878B', fontSize: ms(12), marginLeft: ms(5) }}>
                                    {appliedCoupon ? 'Coupon Applied' : 'Apply Coupons'}
                                </Text>
                            </View>

                            {/* Coupon Applied Success */}
                            {appliedCoupon && discountAmount > 0 ? (
                                <View style={{ backgroundColor: '#E8F5E9', borderRadius: 8, padding: ms(12), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: ms(15), fontWeight: '700', color: '#0D8B7A', marginBottom: 2 }}>
                                            {appliedCoupon.title}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: '#666' }}>
                                            You saved {global.currency}{discountAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={handleRemoveCoupon} style={{ padding: 5 }}>
                                        <Icon type={Icons.Ionicons} name="close-circle" color="#FF6B6B" size={24} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                /* Coupon Input Field */
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#F9F9F9' }}>
                                        <TextInput
                                            style={{ flex: 1, fontSize: ms(12), color: '#000', paddingVertical: ms(8) }}
                                            placeholder="Enter coupon code"
                                            placeholderTextColor="#999"
                                            value={couponCode}
                                            onChangeText={setCouponCode}
                                            autoCapitalize="characters"
                                        />
                                        <TouchableOpacity onPress={handlePasteCoupon} style={{ padding: ms(5) }}>
                                            <Icon type={Icons.Ionicons} name="clipboard-outline" color={primaryColor} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleApplyCoupon}
                                        style={{ backgroundColor: primaryColor, paddingHorizontal: ms(20), paddingVertical: ms(10), borderRadius: ms(8) }}>
                                        <Text style={{ fontSize: ms(13), fontWeight: '900', color: '#fff' }}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={{ backgroundColor: '#F8FAFC', borderRadius: 15, padding: ms(15), margin: ms(15) }}>
                            <Text style={{ fontSize: ms(16), color: colors.theme_fg_two, fontFamily: bold, marginBottom: ms(10) }}>Booking Type</Text>

                            {/* Booking Type Toggle */}
                            <View style={{ flexDirection: 'row', backgroundColor: primaryColor, borderRadius: 12, padding: ms(5), paddingVertical: ms(10), justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={change_booking_type.bind(this, 1)}
                                    activeOpacity={1}
                                    style={{
                                        flex: 1,
                                        backgroundColor: booking_type == 1 ? '#fff' : 'transparent',
                                        borderRadius: 10,
                                        paddingVertical: ms(8),
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}>
                                    <Icon type={Icons.Ionicons} name="home-outline" color={booking_type == 1 ? primaryColor : '#fff'} size={ms(18)} style={{ marginRight: ms(4) }} />
                                    <Text style={{ color: booking_type == 1 ? primaryColor : '#fff', fontSize: ms(12), fontWeight: '600' }}>Collect From Home</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={change_booking_type.bind(this, 2)}
                                    activeOpacity={1}
                                    style={{
                                        flex: 1,
                                        backgroundColor: booking_type == 2 ? '#fff' : 'transparent',
                                        borderRadius: 10,
                                        paddingVertical: ms(8),
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}>
                                    <Icon type={Icons.Feather} name="map" color={booking_type == 2 ? primaryColor : '#fff'} size={ms(18)} style={{ marginRight: ms(4) }} />
                                    <Text style={{ color: booking_type == 2 ? primaryColor : '#fff', fontSize: ms(12), fontWeight: '600' }}>Direct Appointment</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Select Lab */}
                            <View style={{ marginTop: ms(18) }}>
                                <TouchableOpacity
                                    onPress={() => { setShowListModel(true) }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        borderRadius: 10,
                                        padding: ms(12),
                                        justifyContent: 'space-between',
                                        marginBottom: ms(12),
                                    }}>
                                    <Text style={{ color: selectedLabName ? '#000' : colors.grey, fontSize: ms(13) }}>
                                        {selectedLabName || 'Select your nearest Trustlab Centers'}
                                    </Text>
                                    <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_black} style={{ fontSize: ms(20) }} />
                                </TouchableOpacity>
                            </View>

                            <Modal
                                visible={showListModel}
                                transparent
                                animationType="slide"
                                onRequestClose={() => setShowList(false)}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPressOut={() => setShowList(false)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            maxHeight: '60%',
                                            paddingVertical: ms(20),
                                            paddingHorizontal: ms(15),
                                        }}>
                                        <View style={{ alignItems: 'center', marginBottom: ms(10) }}>
                                            <View style={{ width: s(40), height: 4, backgroundColor: '#ccc', borderRadius: 2 }} />
                                        </View>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontSize: ms(15), fontWeight: '600', color: '#000', marginBottom: ms(8) }}>Select TRUSTlab Center</Text>
                                            <TouchableOpacity onPress={() => setShowListModel(false)}>
                                                <Icon type={Icons.AntDesign} name="close" size={18} color='#000' />
                                            </TouchableOpacity>
                                        </View>

                                        <FlatList
                                            data={nearstLabData}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: ms(12),
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#eee',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => {
                                                        setSelectedValue(item.id);
                                                        setSelectedLabName(item.lab_name);
                                                        setLabAddress(item.address || props.current_address);
                                                        selectLab(item.id);
                                                        setLabId(item.id);
                                                        setShowListModel(false);
                                                    }}>
                                                    <Icon type={Icons.Feather} name="map-pin" color={colors.theme_color} style={{ fontSize: ms(16), marginRight: ms(10) }} />
                                                    <Text style={{ fontSize: ms(12), color: '#000' }}>{item.lab_name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Modal>

                            {/* Select Date */}
                            <TouchableOpacity
                                onPress={() => { setShow(true) }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 10,
                                    padding: ms(12),
                                    justifyContent: 'space-between',
                                    marginBottom: ms(12),
                                }}>
                                <Text style={{ color: bookDate ? '#000' : colors.grey, fontSize: ms(13) }}>
                                    {bookDate || 'Select Slot Booking Date'}
                                </Text>
                                <Icon type={Icons.Feather} name="calendar" color={colors.theme_black} style={{ fontSize: ms(20) }} />
                            </TouchableOpacity>

                            {/* Select Time */}
                            <TouchableOpacity
                                onPress={() => { setShowTime(true) }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 10,
                                    padding: ms(12),
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={{ color: bookTime ? '#000' : colors.grey, fontSize: ms(13) }}>
                                    {bookTime || 'Select Slot Booking time'}
                                </Text>
                                <Icon type={Icons.Feather} name="chevron-down" color={colors.theme_black} style={{ fontSize: ms(20) }} />
                            </TouchableOpacity>

                            <View>
                                {booking_type == 1 ?
                                    <>
                                        <View style={{ marginTop: ms(18), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#000', fontWeight: 900, fontSize:ms(13) }}>Patient Address</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                                                <Text style={{ color: primaryColor }}>Change</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingVertical: ms(18), paddingHorizontal: ms(10) }}>
                                            <View style={{ paddingRight: ms(10) }}>
                                                <Image style={{ height: 25, width: 25 }} source={location} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={2} style={{ fontFamily: regular, fontSize: ms(12), color: '#635F5F' }}>{address?.address}</Text>
                                            </View>
                                        </View>
                                    </>
                                    :
                                    <>
                                        <View style={{ marginTop: ms(18), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#000', fontWeight: 900, fontSize:ms(13) }}>Patient Address</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                                                <Text style={{ color: '#1F2B7B' }}>Change</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingVertical: ms(18), paddingHorizontal: ms(10) }}>
                                            <View style={{ paddingRight: ms(10) }}>
                                                <Image style={{ height: 25, width: 25 }} source={location} />
                                            </View>
                                            <View>
                                                <Text numberOfLines={2} style={{ fontFamily: regular, fontSize: ms(12), color: '#635F5F' }}>{address?.address}</Text>
                                            </View>
                                        </View>
                                    </>
                                }

                            </View>
                        </View>

                        <View>
                            <View style={{
                                borderRadius: 8,
                                padding: ms(10),
                                margin: ms(15),
                                backgroundColor: '#F8FAFC',
                            }}>
                                {/* Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ms(10) }}>
                                    <Text style={{ fontSize: ms(13), fontWeight: 'bold', color: colors.theme_fg_two }}>Add Patient Details</Text>
                                    <TouchableOpacity
                                        // onPress={() => navigation.navigate('ViewAllPatients')}
                                        onPress={() => setPatientModeal(true)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: primaryColor,
                                            borderRadius: ms(20),
                                            paddingHorizontal: ms(10),
                                            paddingVertical: ms(4)
                                        }}>
                                        <Text style={{ color: primaryColor, fontSize: ms(13), fontWeight: '500' }}>+ Add Patient</Text>
                                    </TouchableOpacity>
                                </View>

                                <Modal
                                    visible={showPatientModel}
                                    transparent
                                    animationType="slide"
                                    onRequestClose={handleClear}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPressOut={handleClear}
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            justifyContent: 'flex-end',
                                        }}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => { }}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderTopLeftRadius: moderateScale(24),
                                                borderTopRightRadius: moderateScale(24),
                                                maxHeight: '80%',
                                                paddingTop: verticalScale(16),
                                            }}>
                                            {/* Handle Bar */}
                                            <View style={{ alignItems: 'center', marginBottom: verticalScale(16) }}>
                                                <View
                                                    style={{
                                                        width: scale(40),
                                                        height: verticalScale(4),
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: moderateScale(2),
                                                    }}
                                                />
                                            </View>

                                            {/* Header */}
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingHorizontal: scale(24),
                                                    marginBottom: verticalScale(8),
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: moderateScale(18),
                                                        fontWeight: '700',
                                                        color: '#000',
                                                    }}>
                                                    Add Patient Details
                                                </Text>
                                                <TouchableOpacity onPress={handleClear}>
                                                    <Icon type={Icons.AntDesign} name="close" size={moderateScale(24)} color="#000" />
                                                </TouchableOpacity>
                                            </View>

                                            <ScrollView
                                                showsVerticalScrollIndicator={false}
                                                contentContainerStyle={{
                                                    paddingHorizontal: scale(24),
                                                    paddingBottom: verticalScale(20),
                                                }}>
                                                {/* Date of Birth */}
                                                <TouchableOpacity
                                                    onPress={handleDatePicker}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        borderWidth: 1,
                                                        borderColor: '#E8E8E8',
                                                        borderRadius: moderateScale(12),
                                                        paddingVertical: verticalScale(10),
                                                        paddingHorizontal: scale(16),
                                                        marginTop: verticalScale(16),
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: moderateScale(12),
                                                            fontWeight: '400',
                                                            color: dateOfBirth ? '#000' : '#9E9E9E',
                                                        }}>
                                                        {dateOfBirth || 'Date of birth'}
                                                    </Text>
                                                    <Icon
                                                        type={Icons.MaterialCommunityIcons}
                                                        name="calendar-blank-outline"
                                                        size={moderateScale(20)}
                                                        color="#757575"
                                                    />
                                                </TouchableOpacity>

                                                {/* DateTimePicker */}
                                                {showDatePicker && (
                                                    <DateTimePicker
                                                        value={selectedDate}
                                                        mode="date"
                                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                        onChange={handleDateChange}
                                                        maximumDate={new Date()}
                                                    />
                                                )}


                                                {/* Patient Name */}
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        borderWidth: 1,
                                                        borderColor: '#E8E8E8',
                                                        borderRadius: moderateScale(12),
                                                        paddingVertical: verticalScale(10),
                                                        paddingHorizontal: scale(16),
                                                        marginTop: verticalScale(12),
                                                    }}>
                                                    <TextInput
                                                        placeholder="Enter Patient name"
                                                        placeholderTextColor="#9E9E9E"
                                                        value={patientName}
                                                        onChangeText={setPatientName}
                                                        style={{
                                                            flex: 1,
                                                            fontSize: moderateScale(12),
                                                            fontWeight: '400',
                                                            color: '#000',
                                                            padding: 0,
                                                        }}
                                                    />
                                                    <Icon
                                                        type={Icons.Feather}
                                                        name="user"
                                                        size={moderateScale(20)}
                                                        color="#757575"
                                                    />
                                                </View>


                                                {/* Select Gender */}
                                                <View style={{ marginTop: verticalScale(12) }}>
                                                    <TouchableOpacity
                                                        onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            borderWidth: 1,
                                                            borderColor: '#E8E8E8',
                                                            borderRadius: moderateScale(12),
                                                            paddingVertical: verticalScale(10),
                                                            paddingHorizontal: scale(16),
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: moderateScale(12),
                                                                fontWeight: '400',
                                                                color: patientGender ? '#000' : '#9E9E9E',
                                                            }}>
                                                            {patientGender || 'Select Gender'}
                                                        </Text>
                                                        <Icon
                                                            type={Icons.Feather}
                                                            name="chevron-down"
                                                            size={moderateScale(20)}
                                                            color="#757575"
                                                        />
                                                    </TouchableOpacity>

                                                    {showGenderDropdown && (
                                                        <View
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: '#E8E8E8',
                                                                borderRadius: moderateScale(12),
                                                                marginTop: verticalScale(8),
                                                                backgroundColor: '#fff',
                                                            }}>
                                                            {genders.map((gender) => (
                                                                <TouchableOpacity
                                                                    key={gender}
                                                                    onPress={() => {
                                                                        setPatientGender(gender);
                                                                        setShowGenderDropdown(false);
                                                                    }}
                                                                    style={{
                                                                        paddingVertical: verticalScale(10),
                                                                        paddingHorizontal: scale(16),
                                                                        borderBottomWidth: 1,
                                                                        borderBottomColor: '#F5F5F5',
                                                                    }}>
                                                                    <Text style={{ fontSize: moderateScale(12), color: '#000' }}>
                                                                        {gender}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    )}
                                                </View>

                                                {/* Select Relation */}
                                                <View style={{ marginTop: verticalScale(12) }}>
                                                    <TouchableOpacity
                                                        onPress={() => setShowRelationDropdown(!showRelationDropdown)}
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            borderWidth: 1,
                                                            borderColor: '#E8E8E8',
                                                            borderRadius: moderateScale(12),
                                                            paddingVertical: verticalScale(10),
                                                            paddingHorizontal: scale(16),
                                                        }}>
                                                        <Text
                                                            style={{
                                                                fontSize: moderateScale(12),
                                                                fontWeight: '400',
                                                                color: patientRelation ? '#000' : '#9E9E9E',
                                                            }}>
                                                            {patientRelation || 'Select relation'}
                                                        </Text>
                                                        <Icon
                                                            type={Icons.Feather}
                                                            name="chevron-down"
                                                            size={moderateScale(20)}
                                                            color="#757575"
                                                        />
                                                    </TouchableOpacity>

                                                    {showRelationDropdown && (
                                                        <View
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: '#E8E8E8',
                                                                borderRadius: moderateScale(12),
                                                                marginTop: verticalScale(8),
                                                                backgroundColor: '#fff',
                                                                maxHeight: verticalScale(200),
                                                                overflow: 'hidden',
                                                            }}>
                                                            <ScrollView nestedScrollEnabled={true}>
                                                                {relations.map((relation) => (
                                                                    <TouchableOpacity
                                                                        key={relation}
                                                                        onPress={() => {
                                                                            setPatientRelation(relation);
                                                                            setShowRelationDropdown(false);
                                                                        }}
                                                                        style={{
                                                                            paddingVertical: verticalScale(12),
                                                                            paddingHorizontal: scale(16),
                                                                            borderBottomWidth: 1,
                                                                            borderBottomColor: '#F5F5F5',
                                                                        }}>
                                                                        <Text style={{ fontSize: moderateScale(12), color: '#000' }}>
                                                                            {relation}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    )}
                                                </View>

                                                {/* Save Button */}
                                                <View style={{ marginTop: verticalScale(10) }}>
                                                    <PrimaryButton onPress={isEdit ? handlePatientEdit : handleAddPatient} title={isEdit ? 'Save' : 'Add Patient'} />
                                                </View>
                                            </ScrollView>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </Modal>
                                {/* Patients List */}
                                {patientsData && patientsData.length > 0 ? (
                                    patientsData.map((item, index) => (
                                        <View key={index} style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            padding: ms(10),
                                            marginBottom: ms(10)
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <View style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 18,
                                                    backgroundColor: '#EAF0FA',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: ms(10)
                                                }}>
                                                    <Icon type={Icons.AntDesign} name='user' size={20} color={primaryColor} />
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: ms(13), fontWeight: 'bold', color: colors.theme_fg_two }}>
                                                        {item.first_name || item.name}, {item.age} Yrs
                                                    </Text>
                                                    <Text style={{ fontSize: ms(12), color: '#888' }}>{item.gender}</Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    onPress={() => handleDelectPatient(item.id)}
                                                    style={{
                                                        width: ms(30),
                                                        height: ms(30),
                                                        borderWidth: 1,
                                                        borderColor: '#ddd',
                                                        borderRadius: ms(15),
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                    <Icon type={Icons.Feather} name="x" size={ms(16)} color={primaryColor} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => handleEditPatient(item)}
                                                    style={{
                                                        width: ms(30),
                                                        height: ms(30),
                                                        borderWidth: 1,
                                                        borderColor: '#ddd',
                                                        borderRadius: ms(15),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginLeft: ms(8)
                                                    }}>
                                                    <FontAwesome5Icon name="pen" size={ms(12)} color={primaryColor} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                                        <Text style={{ color: '#777' }}>No Patient Added</Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ margin: '1%' }} />

                        </View>

                        <View style={{
                            marginHorizontal: ms(15), paddingHorizontal: ms(20), paddingVertical: ms(20), borderRadius: 10,
                            backgroundColor: '#F8FAFC',
                        }}>
                            <View style={{ paddingVertical: ms(5) }} >
                                <Text style={{ fontSize: ms(15), color: colors.theme_fg_two, fontFamily: bold }}>Bill Details</Text>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                    <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: ms(12), color: colors.grey, fontFamily: regular, }}>Item Total</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: ms(13), color: '#4E4D50', fontWeight: 900 }}>{global.currency}
                                            {totalPrice}
                                        </Text>
                                    </View>
                                </View>

                                {/* Coupon Discount */}
                                {appliedCoupon && discountAmount > 0 && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: ms(8), alignItems: 'center' }}>
                                        <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: ms(12), color: '#0D8B7A', fontFamily: regular }}>
                                                Coupon ({appliedCoupon.type === 'discount' ? `${appliedCoupon.amount}%` : `₹${appliedCoupon.amount}`})
                                            </Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <Text style={{ fontSize: ms(12), color: '#0D8B7A', fontFamily: regular, marginRight: ms(8) }}>
                                                - {global.currency}{discountAmount.toFixed(2)}
                                            </Text>
                                            <TouchableOpacity onPress={handleRemoveCoupon}>
                                                <Icon type={Icons.Ionicons} name="close-circle" color="#FF6B6B" size={18} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {props.promo != undefined &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                        <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: 14, color: colors.grey, fontFamily: regular }}>Promo - ({props.promo.promo_code})</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'flex-end', color: colors.theme_fg_two }}>
                                            <Text style={{ fontSize: 14, color: colors.grey, fontFamily: regular }}>- {global.currency}{props.discount}</Text>
                                        </View>
                                    </View>
                                }
                                <View style={{ margin: 5 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                    <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: ms(12), color: colors.grey, fontFamily: regular, }}>Taxes</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: ms(12), color: '#4E4D50', fontWeight: 900 }}>{global.currency}{props.tax}</Text>
                                    </View>
                                </View>
                                <View style={{ margin: ms(8) }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                    <View style={{ width: '50%', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: ms(15), color: colors.theme_fg_two, fontFamily: bold, }}>Grand Total</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: ms(15), color: colors.theme_fg_two, fontFamily: bold }}>{global.currency}
                                            {(parseFloat(totalPrice || 0) - parseFloat(discountAmount || 0)).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ margin: ms(8) }} />

                        <View style={{ marginBottom: ms(50), marginHorizontal: ms(15) }}>
                            <PrimaryButton title='Continue' onPress={() => handleSubmitData()} />
                        </View>
                        {show &&
                            <DateTimePicker
                                mode='date'
                                timeZoneOffsetInMinutes={330}
                                value={new Date()}
                                minimumDate={new Date()}
                                onChange={(e, date) => {
                                    if (date) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');

                                        const formattedDate = `${year}-${month}-${day}`;
                                        console.log('Selected Date:', formattedDate);

                                        setShow(false);
                                        setBookDate(formattedDate);
                                        Keyboard.dismiss();
                                    }
                                }}
                            />

                        }
                        {showTime &&
                            <DateTimePicker
                                mode="time"
                                is24Hour={true}
                                value={new Date()}
                                onChange={(e, date) => {
                                    if (date) {
                                        const hours = String(date.getHours()).padStart(2, '0');
                                        const minutes = String(date.getMinutes()).padStart(2, '0');

                                        const formattedTime = `${hours}:${minutes}`;
                                        setShowTime(false);
                                        setBookTime(formattedTime);
                                        Keyboard.dismiss();
                                    }
                                }}
                            />

                        }
                        {showList &&
                            <View style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0000007c',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onPress={() => setShowList(false)}   >

                                <FlatList
                                    data={nearstLabData}
                                    renderItem={renderCenterList}
                                    keyExtractor={item => item.id}
                                    style={{ width: '80%', marginVertical: '50%', backgroundColor: colors.theme_bg_three }}
                                />
                            </View>
                        }

                        {/* Validation Modal */}
                        <Modal
                            visible={showValidationModal}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setShowValidationModal(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.validationModal}>
                                    {/* Header */}
                                    <View style={styles.modalHeader}>
                                        <View style={styles.errorIconContainer}>
                                            <Icon type={Icons.Ionicons} name="alert-circle" size={ms(40)} color="#FF6B6B" />
                                        </View>
                                        <Text style={styles.modalTitle}>Required Information</Text>
                                        <Text style={styles.modalSubtitle}>Please complete the following:</Text>
                                    </View>

                                    {/* Error List */}
                                    <ScrollView style={styles.errorListContainer} showsVerticalScrollIndicator={false}>
                                        {validationErrors.map((error, index) => (
                                            <View key={index} style={styles.errorItem}>
                                                <View style={styles.errorIconWrapper}>
                                                    <Icon type={Icons.Ionicons} name={error.icon} size={ms(20)} color={primaryColor} />
                                                </View>
                                                <Text style={styles.errorText}>{error.message}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>

                                    {/* Close Button */}
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setShowValidationModal(false)}
                                        activeOpacity={0.8}>
                                        <Text style={styles.modalCloseButtonText}>Got it</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'flex-start',
        backgroundColor: colors.theme_fg_three,
    },
    secondHeader: {
        flex: 1,
        paddingTop: ms(50),

    },
    headerButton: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(19),
        backgroundColor: whiteColor,
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
    border_style1: {
        borderBottomWidth: 10,
        borderColor: colors.light_blue,
    },
    button1: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:colors.theme_bg,
        width: '100%',
        height: 50,
        //borderWidth:1
    },
    border_style: {
        borderBottomWidth: 1,
        borderColor: colors.light_blue,
    },
    textField: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        height: 45,
        backgroundColor: colors.light_blue,
        fontFamily: regular,
        fontSize: 14,
        color: colors.theme_fg_two,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
    }
    , type: {
        borderRadius: 5,
        // height: 45,
        width: '90%',
        fontFamily: regular,
        fontSize: 14,
        color: colors.theme_fg_two,
    },

    booking_type_active_bg: {
        width: '48%',
        borderRadius: 5,
        borderColor: colors.theme_fg,
        // backgroundColor:colors.theme_bg,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    booking_type_active_fg: {
        fontSize: 14,
        color: colors.theme_fg_three,
        fontFamily: bold,
        padding: 10
    },
    booking_type_inactive_bg: {
        width: '48%',
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: colors.theme_fg_three,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    booking_type_inactive_fg: {
        fontSize: 14,
        color: colors.theme_fg_two,
        fontFamily: regular,
        padding: 10
    },
    header: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50
    },

    patientContainer: {
        backgroundColor: '#ccc',
        flexDirection: 'row',
        elevation: 1,
        borderRadius: 8,
        justifyContent: 'space-between',
        alignContent: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    // Validation Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: ms(20),
    },
    validationModal: {
        backgroundColor: '#fff',
        borderRadius: ms(20),
        width: '100%',
        maxWidth: ms(400),
        maxHeight: vs(500),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        alignItems: 'center',
        paddingTop: vs(30),
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    errorIconContainer: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(40),
        backgroundColor: '#FFE5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    modalTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: vs(6),
        fontFamily: bold,
    },
    modalSubtitle: {
        fontSize: ms(12),
        color: '#666',
        fontFamily: regular,
    },
    errorListContainer: {
        maxHeight: vs(250),
        paddingHorizontal: ms(20),
    },
    errorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingVertical: vs(12),
        paddingHorizontal: ms(15),
        borderRadius: ms(12),
        marginBottom: vs(12),
        borderLeftWidth: 3,
        borderLeftColor: primaryColor,
    },
    errorIconWrapper: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(12),
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    errorText: {
        flex: 1,
        fontSize: ms(14),
        color: '#333',
        fontFamily: regular,
        lineHeight: ms(20),
    },
    modalCloseButton: {
        backgroundColor: primaryColor,
        marginHorizontal: ms(30),
        marginVertical: vs(20),
        paddingVertical: vs(12),
        borderRadius: ms(12),
        alignItems: 'center',
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: ms(16),
        fontWeight: 'bold',
        fontFamily: bold,
    },
});

function mapStateToProps(state) {
    return {
        promo: state.lab_order.promo,
        sub_total: state.lab_order.sub_total,
        cart_items: state.lab_order.cart_items,
        cart_count: state.lab_order.cart_count,
        total: state.lab_order.total,
        discount: state.lab_order.discount,
        tax: state.lab_order.tax,
        patient_age: state.lab_order.patient_age,
        patient_name: state.lab_order.patient_name,
        patient_dob: state.lab_order.patient_dob,
        patient_gender_id: state.lab_order.patient_gender_id,
        patient_gender_name: state.lab_order.patient_gender_name,
        address: state.lab_order.address,
        lab_id: state.lab_order.lab_id,
        current_address: state.current_location.current_address,
        current_lat: state.current_location.current_lat,
        current_lng: state.current_location.current_lng,

    };
}

const mapDispatchToProps = (dispatch) => ({
    updateLabAddToCart: (data) => dispatch(updateLabAddToCart(data)),
    updateLabSubTotal: (data) => dispatch(updateLabSubTotal(data)),
    updateLabCalculateTotal: (data) => dispatch(updateLabCalculateTotal(data)),
    updateLabTotal: (data) => dispatch(updateLabTotal(data)),
    updateLabDiscount: (data) => dispatch(updateLabDiscount(data)),
    updateLabTaxList: (data) => dispatch(updateLabTaxList(data)),
    updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
    updateLabPatientAge: (data) => dispatch(updateLabPatientAge(data))

});

export default connect(mapStateToProps, mapDispatchToProps)(LabCart);
