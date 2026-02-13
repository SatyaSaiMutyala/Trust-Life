import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, SafeAreaView, Dimensions, Text, ScrollView, TouchableOpacity, ImageBackground, Linking, FlatList, Pressable, Modal, Touchable } from 'react-native';
import * as colors from '../assets/css/Colors';
import { img_url, regular, bold, location, acne } from '../config/Constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateAddress } from '../actions/CurrentAddressActions';
import axios from 'axios';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LoadHomeDetailsAction } from '../redux/actions/HomeActions';
import DropShadow from "react-native-drop-shadow";
import Loader from '../components/Loader';
import DashboardShimmer from '../components/DashboardShimmer';
import Icon, { Icons } from '../components/Icons';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
const { width, height, fontScale } = Dimensions.get('window');
import imagesData from './ImgsList';
import SearchInput from '../components/SearchInput';
import FooterComponent from './FooterComponent';
import HomeHeader from './HomeHeader';
import Swiper from 'react-native-swiper';
import TestCategoriesGrid from './TestCategoriesGrid';
import { HealthChecksGrid, TopServiceComponent } from './TopServiceComponent';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, globalGradient, primaryColor, whiteColor, grayColor } from '../utils/globalColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSnack } from '../context/GlobalSnackBarContext';


import { s, vs, ms, mvs } from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';
import { TextInput } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
// import CominSoon from "../assets/json/comingsoon.json";
// import ComingSoon from "../assets/coming.mp4";
// import LottieView from 'lottie-react-native';
// import Video from 'react-native-video';

const Dashboard = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { showSnack } = useSnack();

    // Get home data from Redux store
    const { data: homeData, loading } = useSelector(state => state.home);
    const { banners, services, symptoms_first, symptoms_second, vendors, labs, hospitals, recommended_doctors, top_rated_doctors } = homeData;

    const [is_error, setError] = useState(0);
    const [locationModal, setLocationModal] = useState(false);
    const [savedLocation, setSavedLocation] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const LOCATION_KEY = 'SAVED_LOCATION';


    const doctor_categories = () => {
        navigation.navigate("DoctorCategories")
    }

    useEffect(() => {
        get_home_details();
        loadSavedLocation();
        loadProfilePic();
    }, []);

    const loadProfilePic = async () => {
        try {
            const savedProfilePic = await AsyncStorage.getItem('profile_picture');
            if (savedProfilePic) {
                setProfilePic(`${img_url}${savedProfilePic}`);
            }
        } catch (error) {
            console.log('Error loading profile pic:', error);
        }
    };

    // Reload location whenever the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadSavedLocation();
        }, [])
    );

    const loadSavedLocation = async () => {
        const data = await AsyncStorage.getItem('location');
        if (data) {
            const loc = JSON.parse(data);
            setSavedLocation(loc);
            console.log('location man --------->', loc);
            setLocationModal(false);
        }
    };


    const getInitialLocation = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                const region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                // 🔹 Get readable address
                const address = await onRegionChange(region);

                const locationData = {
                    latitude: region.latitude,
                    longitude: region.longitude,
                    address,
                };

                // ✅ Save locally
                await AsyncStorage.setItem(
                    LOCATION_KEY,
                    JSON.stringify(locationData)
                );

                // ✅ Save in redux (important for API calls)
                props.updateCurrentLat(region.latitude);
                props.updateCurrentLng(region.longitude);
                props.updateCurrentAddress(address);
                props.currentTag('current');

                // ✅ Update UI state
                setSavedLocation(locationData);
                setLocationModal(false);
            },
            (error) => {
                console.log(error);
                alert('Enable location permissions');
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };


    const AGE_CATEGORY_DATA = [
        { id: '1', name: 'Children', image: require('../assets/img/boy.png'), link: 'Male' },
        { id: '2', name: 'Men', image: require('../assets/img/man.png'), link: 'Male' },
        { id: '3', name: 'Women', image: require('../assets/img/woman.png'), link: 'Female' },
        { id: '4', name: 'Senior Men', image: require('../assets/img/old-man.png'), link: 'Female' },
        { id: '5', name: 'Senior Women', image: require('../assets/img/old-woman.png'), link: 'Female' },
    ];

    const get_home_details = async () => {
        console.log({ lat: props.current_lat, lng: props.current_lng })
        try {
            const response = await dispatch(LoadHomeDetailsAction(props.current_lat, props.current_lng));
            if (response.status == 1) {
                // Data is automatically stored in Redux
                setError(0);
            } else {
                setError(1);
            }
        } catch (error) {
            console.log('Error loading home details:', error);
            setError(1);
        }
    }

    const navigate = (route, param) => {
        navigation.navigate(route, { type: param });
    }

    const navigate_symptoms = (specialist, type) => {
        navigation.navigate('DoctorList', { specialist: specialist, type: type })
    }

    const navigate_vendors = (pharm_id, vendor_name) => {
        navigation.navigate("PharmCategories", { pharm_id: pharm_id, vendor_name: vendor_name });
    }


    const BANNER_WIDTH = width * 0.9;
    const BANNER_PADDING = (width - BANNER_WIDTH) / 2;

    const banners_list = () => {
        return banners.map((data, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('Offers')}
                    activeOpacity={1}
                    style={{
                        width: BANNER_WIDTH,
                        height: width * 0.30,
                        // borderRadius: 15,
                        marginRight: index === banners.length - 1 ? 0 : ms(10),
                        overflow: 'hidden',
                        // shadowColor: '#000',
                        // shadowOffset: { width: 0, height: 2 },
                        // shadowOpacity: 0.1,
                        // shadowRadius: 8,
                        // elevation: 3,
                    }}
                >
                    <ImageBackground
                        source={{ uri: img_url + data.url }}
                        resizeMode='cover'
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        imageStyle={{ borderRadius: 15 }}
                    />
                </TouchableOpacity>
            )
        });
    }

    const CIRCLE_SIZE = width * 0.20;
    const renderAgeCategoryItem = ({ item }, navigation) => {
        return (
            <TouchableOpacity
                // Adjust margin for spacing between items
                onPress={() => navigation.navigate('RelevanceDetails', { data: item, name: item.link })}
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginHorizontal: width * 0.02,
                    width: CIRCLE_SIZE,
                }}
            >
                {/* Image Container (The Grey Circle) */}
                <View
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                        borderRadius: CIRCLE_SIZE / 2,
                        backgroundColor: '#E0E0E0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {/* Image Component */}
                    <Image
                        source={item.image}
                        style={{
                            width: '60%',
                            height: '60%',
                            resizeMode: 'cover',
                        }}
                    />
                </View>
                {/* Text Label */}
                <View style={{ marginTop: ms(8) }}>
                    <Text
                        style={{
                            fontSize: width * 0.035,
                            fontWeight: 'bold',
                            color: '#000000',
                            textAlign: 'center',
                        }}
                    >
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const listOfTest = [{
        title: 'Home Collection', subTitle: 'Certified staff collects samples at your doorstep—safe & quick.',
        isSpecial: false, image: require('../assets/img/home.png'), action: 'booking'
    }, {
        title: 'Walk in', subTitle: 'Walk into our lab at your convenience and get accurate test results.',
        isSpecial: false, image: require('../assets/img/walk.png'), action: 'walk'
    }, {
        id: '3',
        title: 'Book a Test',
        specialText: '30 mins',
        subTitle: 'Speak with our experts for personalized guidance',
        image: require('../assets/img/personcall1.png'),
        isSpecial: true,
        action: 'call'
    },
    {
        id: '4',
        title: 'Upload Prescription',
        subTitle: 'Upload your prescription for quick test booking',
        image: require('../assets/img/prescription.png'),
        isSpecial: false,
        action: 'upload'
    },]


    const handleBookCall = () => {
        const phoneNumber = 7440075400;
        Linking.openURL(`tel:${phoneNumber}`);
        console.log('Book a Test via Call pressed');
    };

    const handleUploadPrescription = () => {
        console.log('Upload Prescription pressed');
        // Add your navigation or image picker logic here
        navigation.navigate('uploadPerscription');
    };


    const testCategory = () => {
        const cardWidth = (width - (4 * 8)) / 2;
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: ms(4),
                    marginTop: ms(5),
                    flexWrap: 'wrap',
                }}
            >
                {listOfTest.map((item, index) => (
                    <TouchableOpacity
                        key={item.title}
                        onPress={() => {
                            if (item.action === 'call') {
                                handleBookCall();
                            } else if (item.action === 'upload') {
                                handleUploadPrescription();
                            } else if (item.action === 'booking') {
                                navigateToTests('Home Lab');
                            } else if (item.action === 'walk') {
                                navigateToTests('Walk-in');
                            }
                        }}
                        style={{
                            width: cardWidth,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 15,
                            padding: ms(12),
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 5,
                            marginHorizontal: ms(5),
                            marginBottom: ms(10),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Left side text */}
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: ms(12),
                                    fontWeight: 'bold',
                                    color: '#000000',
                                    marginBottom: 8,
                                }}
                            >
                                {item.title}
                            </Text>

                            {item.isSpecial && (
                                <Text
                                    style={{
                                        fontSize: ms(12),
                                        fontWeight: 'bold',
                                        color: '#0194A5',
                                        marginBottom: 5,
                                    }}
                                >
                                    {item.specialText}
                                </Text>
                            )}

                            <Text
                                style={{
                                    fontSize: ms(10),
                                    color: '#666666',
                                }}
                                numberOfLines={3}
                            >
                                {item.subTitle}
                            </Text>
                        </View>

                        {/* Right side image */}
                        <View
                            style={{
                                width: cardWidth * 0.4,
                                alignItems: 'flex-end',
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: item.action == 'walk' ? cardWidth * 0.40 : cardWidth * 0.40,
                                    height: item.action == 'walk' ? cardWidth * 0.40 : cardWidth * 0.40,
                                    resizeMode: 'contain',

                                }}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };



    const open_linking = (url) => {
        if (url) {
            Linking.openURL(url);
        }
    }

    const navigateToTests = (text) => {
        console.log('type ------------>', text);
        // navigation.navigate("LabDetails", { lab_id: 1, lab_name: 'Newlab', name: text })
        navigation.navigate("CompanyLabTests")
    }

    const [searchText, setSearchText] = useState('');


    const handleSearch = (text) => {
        setSearchText(text);
        console.log('searchText', text)
    }

    const emptyHome = () => {
        console.log('searchText 77', searchText)
    }

    const onRegionChange = async (region) => {
        try {
            const res = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=YOUR_GOOGLE_KEY`
            );

            if (res.data.results.length > 0) {
                return res.data.results[0].formatted_address;
            }
            return 'Location detected';
        } catch (e) {
            console.log(e);
            return 'Location detected';
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            {loading ? (
                <DashboardShimmer />
            ) : (
                <LinearGradient
                    colors={globalGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.16]}
                    style={{ flex: 1 }}
                >
                <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{
                            paddingTop: ms(50),
                            paddingBottom: ms(20),
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 30,
                                    paddingHorizontal: ms(10),
                                }}
                            >
                                {/* LEFT SECTION */}
                                <TouchableOpacity
                                    onPress={() => setLocationModal(true)}
                                    style={styles.locationHeaderButton}
                                >
                                    <Icon
                                        type={Icons.MaterialIcons}
                                        name={savedLocation ? 'location-on' : 'location-off'}
                                        size={ms(18)}
                                        color={primaryColor}
                                    />
                                </TouchableOpacity>

                                <View style={{ flex: 1, marginRight: ms(8) }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: ms(15), fontWeight: 'bold' }}>
                                            Hello,
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            style={{
                                                color: '#fff',
                                                fontSize: ms(15),
                                                fontWeight: 'bold',
                                                marginLeft: 4,
                                                flexShrink: 1,
                                            }}
                                        >
                                            {global.customer_name}
                                        </Text>
                                    </View>

                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{
                                            color: '#fff',
                                            fontSize: ms(10),
                                        }}
                                    >
                                        {savedLocation?.address || 'Set your location'}
                                    </Text>
                                </View>

                                {/* RIGHT SECTION */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: ms(6),
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Notifications')}
                                        style={styles.headerButton}
                                    >
                                        <Icon
                                            type={Icons.Ionicons}
                                            name="notifications-outline"
                                            size={ms(18)}
                                            color={blackColor}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('LabCart')}
                                        style={styles.headerButton}
                                    >
                                        <Icon
                                            type={Icons.Ionicons}
                                            name="cart-outline"
                                            size={ms(18)}
                                            color={blackColor}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                        {profilePic ? (
                                            <Image
                                                source={{ uri: profilePic }}
                                                style={styles.profileImage}
                                            />
                                        ) : (
                                            <View style={[styles.profileImage, styles.defaultProfileIcon]}>
                                                <Icon type={Icons.MaterialIcons} name="person" size={ms(18)} color={blackColor} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>


                            {/* Search Input Area */}


                            <TouchableOpacity
                                style={styles.searchContainer}
                                onPress={() => navigation.navigate('SearchItems')}
                                activeOpacity={1}
                            >
                                <Icon type={Icons.Feather} name="search" color="#999" size={ms(20)} style={{ marginRight: s(4) }} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search"
                                    // value={search}
                                    // onChangeText={setSearch}
                                    placeholderTextColor="#999"
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>

                            {/* Top Service Cards */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: ms(15), paddingVertical: ms(5), flexGrow: 1, justifyContent: 'center' }}
                            >
                                <TouchableOpacity
                                    style={{ marginHorizontal: ms(2) }}
                                    onPress={() => navigateToTests('Home Lab')}
                                >
                                    <Image
                                        source={require('../assets/img/top-lab.png')}
                                        style={styles.topServiceImage}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ marginHorizontal: ms(2) }}
                                    onPress={() => showSnack('warning', 'Doctor Consultation is coming soon!')}
                                >
                                    <Image
                                        source={require('../assets/img/top-doctor.png')}
                                        style={styles.topServiceImage}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ marginHorizontal: ms(2) }}
                                    onPress={() => showSnack('warning', 'Medicine booking is coming soon!')}
                                >
                                    <Image
                                        source={require('../assets/img/top-medicienes.png')}
                                        style={styles.topServiceImage}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ marginHorizontal: ms(2) }}
                                    onPress={() => showSnack('warning', 'Ambulance is coming soon!')}
                                >
                                    <Image
                                        source={require('../assets/img/ambulance.png')}
                                        style={styles.topServiceImage}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                    {/* <View style={{ marginTop: ms(-80) }}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: BANNER_PADDING }}
                        >
                            {banners_list()}
                        </ScrollView>
                    </View> */}

                    {/* Track your Test Section */}
                    {/* <View style={styles.trackSection}>
                        <TouchableOpacity
                            style={[styles.trackItem, { backgroundColor: '#FFEDD5' }]}
                            onPress={() => navigation.navigate('LabOrders')}
                        >
                            <View style={styles.trackIconCircle}>
                                <Icon type={Icons.FontAwesome6} name="route" size={ms(22)} color={blackColor} />
                            </View>
                            <Text style={styles.trackText}>Track your{'\n'}Test</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.trackItem, { backgroundColor: '#DBEAFE' }]}
                            onPress={() => navigation.navigate('LabOrders')}
                        >
                            <View style={styles.trackIconCircle}>
                                <Icon type={Icons.MaterialCommunityIcons} name="check-circle-outline" size={ms(22)} color={blackColor} />
                            </View>
                            <Text style={styles.trackText}>Completed{'\n'}Tests</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.trackItem, { backgroundColor: '#FAE8FF' }]}
                            onPress={() => navigation.navigate('LabOrders')}
                        >
                            <View style={styles.trackIconCircle}>
                                <Icon type={Icons.MaterialCommunityIcons} name="calendar-clock" size={ms(22)} color={blackColor} />
                            </View>
                            <Text style={styles.trackText}>Upcoming{'\n'}Tests</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Recently Booked Tests */}
                    {/* <View style={styles.recentTestsSection}>
                        <Text style={styles.recentTestsHeading}>Recently Booked Tests</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: ms(5) }}
                        >
                            {[
                                { id: 1, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days' },
                                { id: 2, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days' },
                                { id: 3, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days' },
                                { id: 3, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', price: '20400.00', report_days: '3 days' },
                            ].map((item) => (
                                <View key={item.id} style={styles.recentTestCard}>

                                    <View style={styles.recentTestImageWrap}>
                                        <View style={styles.recentTestImageBg}>
                                            <Image
                                                source={require('../assets/img/cardImg.png')}
                                                style={styles.recentTestImage}
                                            />
                                        </View>
                                        <View style={styles.recentTestBadge}>
                                            <Text style={styles.recentTestBadgeText}>Reports in {item.report_days}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.recentTestName} numberOfLines={2}>{item.test_name}</Text>
                                    <Text style={styles.recentTestCovers}>{item.covers}</Text>
                                    <Text style={styles.recentTestPrice}>₹{item.price}</Text>

                                    <TouchableOpacity
                                        style={styles.recentTestAddBtn}
                                        onPress={() => navigateToTests('Home Lab')}
                                    >
                                        <Text style={styles.recentTestAddText}>ADD</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View> */}

                    {/* Tests you need today to keep healthy */}
                    {/* <View style={styles.needTestsSection}>
                        <Text style={styles.needTestsHeading}>Tests you need today to keep healthy</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: ms(5) }}
                        >
                            {[
                                {
                                    id: 1,
                                    test_name: 'Neuronal ( Paraneoplastic ) Autoantibodies',
                                    covers: 'Covers 8 Test',
                                    description: 'Helps detect immune-related nerve and brain conditions and supports early diagnosis and treatment.',
                                    report_days: '3 days',
                                    recommendation: `Trust MD Recommendation For ${global.customer_name || 'You'}`,
                                },
                                {
                                    id: 2,
                                    test_name: 'Neuronal ( Paraneoplastic ) Autoantibodies',
                                    covers: 'Covers 8 Test',
                                    description: 'Helps detect immune-related nerve and brain conditions and supports early diagnosis and treatment.',
                                    report_days: '3 days',
                                    recommendation: `Trust MD Recommendation For ${global.customer_name || 'You'}`,
                                },
                            ].map((item) => (
                                <View key={item.id} style={styles.needTestCard}>

                                    <View style={styles.needTestCardRow}>

                                        <View style={styles.needTestImageWrap}>
                                            <View style={styles.needTestImageBg}>
                                                <Image
                                                    source={require('../assets/img/cardImg.png')}
                                                    style={styles.needTestImage}
                                                />
                                            </View>
                                            <View style={styles.needTestBadge}>
                                                <Text style={styles.needTestBadgeText}>Reports in {item.report_days}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.needTestDetails}>
                                            <Text style={styles.needTestName} numberOfLines={2}>{item.test_name}</Text>
                                            <Text style={styles.needTestCovers}>{item.covers}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.needTestDescRow}>
                                        <View style={styles.needTestDescIcon}>
                                            <Icon type={Icons.MaterialCommunityIcons} name="heart-pulse" size={ms(18)} color="#E91E63" />
                                        </View>
                                        <Text style={styles.needTestDesc} numberOfLines={3}>{item.description}</Text>
                                    </View>

                                    <View style={styles.needTestRecBanner}>
                                        <Text style={styles.needTestRecText}>{item.recommendation}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View> */}

                    {/* Recently Viewed Tests */}
                    {/* <View style={styles.viewedTestsSection}>
                        <Text style={styles.viewedTestsHeading}>Recently Viewed Tests</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: ms(5) }}
                        >
                            {[
                                { id: 1, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', report_days: '3 days' },
                                { id: 2, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', report_days: '3 days' },
                                { id: 3, test_name: 'Neuronal ( Paraneoplastic )...', covers: 'Covers 1 Test', report_days: '3 days' },
                            ].map((item) => (
                                <View key={item.id} style={styles.viewedTestCard}>

                                    <TouchableOpacity
                                        style={styles.viewedTestPlusBtn}
                                        onPress={() => navigateToTests('Home Lab')}
                                    >
                                        <Icon type={Icons.AntDesign} name="pluscircle" size={ms(22)} color={primaryColor} />
                                    </TouchableOpacity>


                                    <View style={styles.viewedTestImageWrap}>
                                        <View style={styles.viewedTestImageBg}>
                                            <Image
                                                source={require('../assets/img/cardImg.png')}
                                                style={styles.viewedTestImage}
                                            />
                                        </View>
                                        <View style={styles.viewedTestBadge}>
                                            <Text style={styles.viewedTestBadgeText}>Reports in {item.report_days}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.viewedTestName} numberOfLines={2}>{item.test_name}</Text>
                                    <Text style={styles.viewedTestCovers}>{item.covers}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View> */}

                    {/* Popular Blood Test for Section */}
                    {/* <View style={styles.popularSection}>
                        <Text style={styles.popularHeading}>Popular Blood Test for</Text>
                        <View style={styles.popularGrid}>
                            {[
                                { name: 'Age', image: require('../assets/img/age.png') },
                                { name: 'Gender', image: require('../assets/img/gender.png') },
                                { name: 'Organs', image: require('../assets/img/organs.png') },
                                { name: 'Lifestyle', image: require('../assets/img/lifestyle.png') },
                                { name: 'Seasonal', image: require('../assets/img/seasonal.png') },
                                { name: 'Medical Condition', image: require('../assets/img/medical.png') },
                            ].map((item) => (
                                <TouchableOpacity
                                    key={item.name}
                                    style={styles.popularItem}
                                    onPress={() => navigation.navigate('CategoryBloodTest', { name: item.name })}
                                >
                                    <View style={styles.popularImageCircle}>
                                        <Image source={item.image} style={styles.popularImage} />
                                    </View>
                                    <Text style={styles.popularText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View> */}

                    {/* Your Health Status Section */}
                    <View style={styles.healthStatusSection}>
                        <Text style={styles.healthStatusHeading}>Your Health Status</Text>
                        <LinearGradient
                            colors={['#3A9E91', '#5AB8AC', '#3A9E91']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.healthCard}
                        >
                            <View style={styles.healthCardContent}>
                                {/* Left Side */}
                                <View style={styles.healthCardLeft}>
                                    <View style={styles.healthBadge}>
                                        <Icon type={Icons.MaterialCommunityIcons} name="heart-pulse" size={ms(14)} color="#fff" />
                                        <Text style={styles.healthBadgeText}>Vital Health Score</Text>
                                    </View>
                                    <Text style={styles.healthGoodText}>Good</Text>
                                    <Text style={styles.healthDescription}>
                                        Based Your test Score will Change,Based Your test Score will Change
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('AnalysisCheck')} style={{paddingVertical:ms(10), flexDirection:'row'}}>
                                        <Text style={{paddingVertical:ms(10), paddingHorizontal:ms(10), backgroundColor:whiteColor, borderRadius:ms(20), fontSize:ms(10), fontWeight:'bold', color:blackColor}}>Check Health Status</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right Side - Gauge */}
                                <View style={styles.healthGaugeContainer}>
                                    <Svg width={ms(120)} height={ms(85)} viewBox="0 0 150 105">
                                        <Defs>
                                            <SvgLinearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                                                <Stop offset="0" stopColor="#F44336" />
                                                <Stop offset="0.2" stopColor="#FF9800" />
                                                <Stop offset="0.4" stopColor="#FFC107" />
                                                <Stop offset="0.6" stopColor="#8BC34A" />
                                                <Stop offset="1" stopColor="#4CAF50" />
                                            </SvgLinearGradient>
                                        </Defs>
                                        {/* Background arc track */}
                                        <Path
                                            d="M 15 88 A 60 60 0 0 1 135 88"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.15)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                        {/* Colored gradient arc */}
                                        <Path
                                            d="M 15 88 A 60 60 0 0 1 135 88"
                                            fill="none"
                                            stroke="url(#gaugeGrad)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                        {/* White inner circle background */}
                                        <Circle cx="75" cy="88" r="38" fill="rgba(255,255,255,0.15)" />
                                        {/* Needle pointing at 87% (angle ~23.4° from right) */}
                                        <Line
                                            x1="75"
                                            y1="88"
                                            x2="110"
                                            y2="70"
                                            stroke="#fff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        {/* Needle center dot */}
                                        <Circle cx="75" cy="88" r="4" fill="#fff" />
                                        {/* Score number */}
                                        <SvgText x="75" y="78" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#fff">87</SvgText>
                                        {/* 0 and 100 labels */}
                                        <SvgText x="18" y="103" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.6)">0</SvgText>
                                        <SvgText x="132" y="103" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.6)">100</SvgText>
                                    </Svg>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Track your Health journey */}
                    <View style={styles.healthJourneySection}>
                        <Text style={styles.healthJourneyHeading}>Track your Health journey</Text>
                        <View style={styles.healthJourneyGrid}>
                            <TouchableOpacity
                                style={styles.healthJourneyCard}
                                onPress={() => navigation.navigate('HealthTrend', { type: 'sleep' })}
                            >
                                <LinearGradient
                                    colors={['#E2FFFB7D', '#208A7B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 18]}
                                    style={styles.healthJourneyGradient}
                                >
                                    <View style={styles.healthJourneyImageWrap}>
                                        <Image source={require('../assets/img/sleep-track.png')} style={styles.healthJourneyImage} />
                                    </View>
                                    <View style={styles.healthJourneyTextWrap}>
                                        <Text style={styles.healthJourneyTitle}>Sleep Tracking</Text>
                                        <Text style={styles.healthJourneySub}>Manage your Sleep through your app</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.healthJourneyCard}
                                onPress={() => navigation.navigate('HealthTrend', { type: 'exercise' })}
                            >
                                <LinearGradient
                                    colors={['#E2FFFB7D', '#208A7B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 18]}
                                    style={styles.healthJourneyGradient}
                                >
                                    <View style={styles.healthJourneyImageWrap}>
                                        <Image source={require('../assets/img/exercise-track.png')} style={styles.healthJourneyImage} />
                                    </View>
                                    <View style={styles.healthJourneyTextWrap}>
                                        <Text style={styles.healthJourneyTitle}>Exercise Tracking</Text>
                                        <Text style={styles.healthJourneySub}>Manage your Sleep through your app</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.healthJourneyCard}
                                onPress={() => navigation.navigate('HealthTrend', { type: 'food' })}
                            >
                                <LinearGradient
                                    colors={['#E2FFFB7D', '#208A7B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 18]}
                                    style={styles.healthJourneyGradient}
                                >
                                    <View style={styles.healthJourneyImageWrap}>
                                        <Image source={require('../assets/img/food-track.png')} style={styles.healthJourneyImage} />
                                    </View>
                                    <View style={styles.healthJourneyTextWrap}>
                                        <Text style={styles.healthJourneyTitle}>Food Tracking</Text>
                                        <Text style={styles.healthJourneySub}>Manage your Sleep through your app</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.healthJourneyCard}
                                onPress={() => navigation.navigate('HealthTrend', { type: 'medication' })}
                            >
                                <LinearGradient
                                    colors={['#E2FFFB7D', '#208A7B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    locations={[0, 18]}
                                    style={styles.healthJourneyGradient}
                                >
                                    <View style={styles.healthJourneyImageWrap}>
                                        <Image source={require('../assets/img/medical-track.png')} style={styles.healthJourneyImage} />
                                    </View>
                                    <View style={styles.healthJourneyTextWrap}>
                                        <Text style={styles.healthJourneyTitle}>Medication Tracking</Text>
                                        <Text style={styles.healthJourneySub}>Manage your Sleep through your app</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Medical Log Book */}
                    <View style={styles.medicalLogSection}>
                        <Text style={styles.medicalLogHeading}>Medical Log Book</Text>
                        <View style={styles.medicalLogGrid}>
                            {[
                                { name: 'Heart Rate', image: require('../assets/img/heartRate.png'), route: 'HeartRateLog' },
                                { name: 'Blood Pressure', image: require('../assets/img/blood_pressure.png'), route: 'BloodPressureLog' },
                                { name: 'Glucose', image: require('../assets/img/glucose.png'), route: 'GlucoseLog' },
                                { name: 'Temperature', image: require('../assets/img/temprature.png'), route: 'TemperatureLog' },
                                { name: 'Menstrual Cycle', image: require('../assets/img/menstrualcycle.png'), route: 'MenstrualCycleLog' },
                                { name: 'Weight Management', image: require('../assets/img/weightmanagement.png'), route: 'WeightLog' },
                                { name: 'Vaccination', image: require('../assets/img/Vaccination.png'), route: 'VaccinationLog' },
                            ].map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.medicalLogCard}
                                    onPress={() => {
                                        if (item.route === 'HeartRateLog') {
                                            navigation.navigate('HeartRateLog');
                                        } else if (item.route === 'BloodPressureLog') {
                                            navigation.navigate('BloodPressureLog');
                                        } else if (item.route === 'GlucoseLog') {
                                            navigation.navigate('GlucoseLog');
                                        } else if (item.route === 'TemperatureLog') {
                                            navigation.navigate('TemperatureLog');
                                        } else if (item.route === 'MenstrualCycleLog') {
                                            navigation.navigate('MenstrualCycleLog');
                                            navigation.navigate('TemperatureLog');
                                        } else if (item.route === 'WeightLog') {
                                            navigation.navigate('WeightManagementLog');
                                        } else if (item.route === 'VaccinationLog') {
                                            navigation.navigate('VaccinationLog');
                                        } else {
                                            showSnack('warning', `${item.name} log coming soon!`);
                                        }
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.medicalLogImageWrap}>
                                        {item.image ? (
                                            <Image source={item.image} style={styles.medicalLogImage} />
                                        ) : (
                                            <Icon type={Icons.MaterialCommunityIcons} name="needle" size={ms(40)} color={primaryColor} />
                                        )}
                                    </View>
                                    <Text style={styles.medicalLogText} numberOfLines={2}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* What members say */}
                    <View style={styles.membersSaySection}>
                        <Text style={styles.membersSayHeading}>What Members Say</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: ms(5) }}
                        >
                            {[
                                { name: 'Rajesh', rating: '4.5', review: 'Good experience, on time report Delivered , Great experience...' },
                                { name: 'Raghu', rating: '4.5', review: 'Good experience, on time report Delivered , Great experience...' },
                                { name: 'Vikram', rating: '4.5', review: 'Good experience, on time report Delivered , Great experience...' },
                            ].map((item, index) => (
                                <View key={index} style={styles.memberCard}>
                                    <View style={styles.memberCardTop}>
                                        <View style={styles.memberAvatar}>
                                            <Icon type={Icons.MaterialIcons} name="person" size={ms(22)} color={grayColor} />
                                        </View>
                                        <Text style={styles.memberName}>{item.name}</Text>
                                        <View style={styles.memberRatingBadge}>
                                            <Icon type={Icons.AntDesign} name="star" size={ms(10)} color="#fff" />
                                            <Text style={styles.memberRatingText}>{item.rating}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.memberReview} numberOfLines={3}>{item.review}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* <View>
                        {testCategory()}
                    </View> */}

                    {/* <View>
                        <TopServiceComponent />
                    </View> */}

                    {/* <View style={{ margin: 5 }} />
                    <View>
                        <HealthChecksGrid />
                    </View> */}

                    <View style={{ margin: 10 }} />
                    <View>
                        <FooterComponent />
                    </View>
                </ScrollView>
                </LinearGradient>
            )}

            {/* Bottom Sheet Modal */}
            <Modal
                visible={locationModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setLocationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setLocationModal(false)}
                    />
                    <View style={styles.bottomSheetContainer}>
                        {/* Pull Bar */}
                        <View style={styles.pullBar} />

                        {/* Current Location */}
                        <TouchableOpacity
                            style={styles.optionRow}
                            onPress={loadSavedLocation}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBox}>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name="gps-fixed"
                                    size={ms(20)}
                                    color="#1BA672"
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.title}>Current location</Text>
                                <Text style={styles.subTitle}>
                                    Allow location to get accurate delivery
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Select Different Location */}
                        <TouchableOpacity
                            style={styles.optionRow}
                            onPress={() => {
                                setLocationModal(false);
                                navigation.navigate('LocationSearch');
                            }}
                        >
                            <View style={styles.iconBox}>
                                <Icon
                                    type={Icons.MaterialIcons}
                                    name="location-on"
                                    size={ms(20)}
                                    color="#000"
                                />
                            </View>
                            <Text style={styles.title}>Select different location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.theme_bg_three,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: "bold"
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(18),
        paddingVertical: vs(10),
        marginHorizontal: ms(15),
        // marginTop: vs(10),
        marginBottom: vs(10),

    },
    searchInput: {
        flex: 1,
        fontSize: ms(16),
        color: '#000',
        paddingVertical: 0,
    },
    topServiceCard: {
        // backgroundColor: whiteColor,
        borderRadius: ms(12),
        // paddingVertical: ms(5),
        // paddingHorizontal: ms(5),
        marginRight: ms(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: ms(85),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    topServiceImage: {
        width: ms(80),
        height: ms(80),
        resizeMode: 'contain',
    },
    topServiceText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },

    // Track your Test Section
    trackSection: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingHorizontal: ms(10),
        marginVertical: ms(20),
    },
    trackItem: {
        alignItems: 'center',
        width: ms(100),
        borderRadius: ms(10),
        paddingVertical: ms(10)
    },
    trackIconCircle: {
        // width: ms(45),
        // height: ms(45),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(5),
    },
    trackText: {
        fontSize: ms(10),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        lineHeight: ms(15),
    },

    // Recently Booked Tests
    recentTestsSection: {
        paddingHorizontal: ms(15),
        marginBottom: ms(10),
    },
    recentTestsHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(12),
    },
    recentTestCard: {
        width: ms(150),
        backgroundColor: '#fff',
        borderRadius: ms(12),
        padding: ms(10),
        marginRight: ms(5),
    },
    recentTestImageWrap: {
        position: 'relative',
        marginBottom: ms(8),
    },
    recentTestImageBg: {
        width: '100%',
        height: ms(100),
        backgroundColor: '#EBFEFB',
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentTestImage: {
        width: ms(60),
        height: ms(60),
        resizeMode: 'contain',
    },
    recentTestBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1EAE55',
        borderBottomLeftRadius: ms(10),
        borderBottomRightRadius: ms(10),
        paddingVertical: ms(4),
        alignItems: 'center',
    },
    recentTestBadgeText: {
        fontSize: ms(8),
        fontWeight: '600',
        color: '#fff',
    },
    recentTestName: {
        fontSize: ms(12),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(2),
    },
    recentTestCovers: {
        fontSize: ms(10),
        color: '#666',
        marginBottom: ms(4),
    },
    recentTestPrice: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(8),
    },
    recentTestAddBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(8),
        paddingVertical: ms(8),
        alignItems: 'center',
    },
    recentTestAddText: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#fff',
    },

    // Tests you need today
    needTestsSection: {
        paddingHorizontal: ms(15),
        marginTop: ms(15),
        marginBottom: ms(10),
    },
    needTestsHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(12),
    },
    needTestCard: {
        width: width * 0.82,
        backgroundColor: grayColor,
        borderRadius: ms(14),
        overflow: 'hidden',
        marginRight: ms(10),
    },
    needTestCardRow: {
        flexDirection: 'row',
        padding: ms(12),
    },
    needTestImageWrap: {
        position: 'relative',
        width: ms(100),
        marginRight: ms(12),
    },
    needTestImageBg: {
        width: ms(100),
        height: ms(80),
        backgroundColor: '#EBFEFB',
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    needTestImage: {
        width: ms(55),
        height: ms(55),
        resizeMode: 'contain',
    },
    needTestBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1EAE55',
        borderBottomLeftRadius: ms(10),
        borderBottomRightRadius: ms(10),
        paddingVertical: ms(4),
        alignItems: 'center',

    },
    needTestBadgeText: {
        fontSize: ms(8),
        fontWeight: '600',
        color: '#fff',
    },
    needTestDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    needTestName: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(3),
    },
    needTestCovers: {
        fontSize: ms(11),
        color: primaryColor,
        fontWeight: '600',
        marginBottom: ms(6),
    },
    needTestDescRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: ms(12),
        paddingBottom: ms(12),
        gap: ms(10),
    },
    needTestDescIcon: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#FCE4EC',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: ms(2),
    },
    needTestDesc: {
        flex: 1,
        fontSize: ms(11),
        color: '#555',
        lineHeight: ms(16),
    },
    needTestRecBanner: {
        backgroundColor: '#FFF3CD',
        paddingVertical: ms(10),
        alignItems: 'center',
        borderBottomLeftRadius: ms(14),
        borderBottomRightRadius: ms(14),
    },
    needTestRecText: {
        fontSize: ms(11),
        fontWeight: 'bold',
        color: '#B8860B',
    },

    // Recently Viewed Tests
    viewedTestsSection: {
        paddingHorizontal: ms(15),
        marginTop: ms(15),
        marginBottom: ms(10),
    },
    viewedTestsHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(12),
    },
    viewedTestCard: {
        width: ms(140),
        backgroundColor: grayColor,
        borderRadius: ms(12),
        padding: ms(10),
        marginRight: ms(8),
        position: 'relative',
    },
    viewedTestPlusBtn: {
        position: 'absolute',
        top: ms(8),
        right: ms(8),
        zIndex: 1,
    },
    viewedTestImageWrap: {
        position: 'relative',
        marginBottom: ms(8),
    },
    viewedTestImageBg: {
        width: '100%',
        height: ms(90),
        backgroundColor: '#EBFEFB',
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewedTestImage: {
        width: ms(55),
        height: ms(55),
        resizeMode: 'contain',
    },
    viewedTestBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1EAE55',
        borderBottomLeftRadius: ms(10),
        borderBottomRightRadius: ms(10),
        paddingVertical: ms(4),
        alignItems: 'center',
    },
    viewedTestBadgeText: {
        fontSize: ms(8),
        fontWeight: '600',
        color: '#fff',
    },
    viewedTestName: {
        fontSize: ms(11),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(2),
    },
    viewedTestCovers: {
        fontSize: ms(10),
        color: '#666',
    },

    // Popular Blood Test Section
    popularSection: {
        paddingHorizontal: ms(15),
        marginTop: ms(10),
        marginBottom: ms(10),
    },
    popularHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(15),
    },
    popularGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        gap: ms(10)
    },
    popularItem: {
        alignItems: 'center',
        width: (width - ms(60)) / 3,
        // marginBottom: ms(15),
    },
    popularImageCircle: {
        width: ms(80),
        height: ms(80),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // marginBottom: ms(8),

    },
    popularImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    popularText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },

    // Health Status Section
    healthStatusSection: {
        paddingHorizontal: ms(15),
        marginTop: ms(10),
        marginBottom: ms(10),
    },
    healthStatusHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: ms(12),
    },
    healthCard: {
        borderRadius: ms(16),
        padding: ms(18),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    healthCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    healthCardLeft: {
        flex: 1,
        marginRight: ms(10),
    },
    healthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: ms(10),
        paddingVertical: ms(5),
        borderRadius: ms(20),
        alignSelf: 'flex-start',
        marginBottom: ms(8),
    },
    healthBadgeText: {
        color: '#fff',
        fontSize: ms(11),
        fontWeight: '600',
        marginLeft: ms(5),
    },
    healthGoodText: {
        color: '#fff',
        fontSize: ms(20),
        fontWeight: 'bold',
        marginBottom: ms(5),
    },
    healthDescription: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: ms(10),
        lineHeight: ms(15),
    },
    healthGaugeContainer: {
        alignItems: 'center',
    },

    // Track your Health journey
    healthJourneySection: {
        paddingHorizontal: ms(15),
        marginTop: ms(15),
        marginBottom: ms(10),
    },
    healthJourneyHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: ms(12),
    },
    healthJourneyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: ms(15),
    },
    healthJourneyCard: {
        width: (width - ms(50)) / 2,
        borderTopLeftRadius: ms(50),
        borderTopRightRadius: ms(50),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10),
        overflow: 'hidden',
    },
    healthJourneyGradient: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingVertical: ms(10)
    },
    healthJourneyImageWrap: {
        height: ms(130),
    },
    healthJourneyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10)
    },
    healthJourneyTextWrap: {
        paddingHorizontal: ms(10),
        paddingVertical: ms(8),
        // backgroundColor: '#fff',
    },
    healthJourneyTitle: {
        color: blackColor,
        fontSize: ms(12),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    healthJourneySub: {
        color: blackColor,
        fontSize: ms(9),
        marginTop: ms(2),
        textAlign: 'center'
    },

    // Medical Log Book
    medicalLogSection: {
        paddingHorizontal: ms(15),
        marginTop: ms(15),
        marginBottom: ms(10),
    },
    medicalLogHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(15),
    },
    medicalLogGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(10),
    },
    medicalLogCard: {
        width: (width - ms(54)) / 3,
        // backgroundColor: '#fff',
        borderRadius: ms(16),
        paddingVertical: ms(10),
        paddingHorizontal: ms(8),
        alignItems: 'center',
    },
    medicalLogImageWrap: {
        width: ms(65),
        height: ms(65),
        borderRadius: ms(16),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(5),
    },
    medicalLogImage: {
        width: ms(45),
        height: ms(45),
        resizeMode: 'contain',
    },
    medicalLogText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },

    // What members say
    membersSaySection: {
        marginTop: ms(15),
        marginBottom: ms(10),
        marginHorizontal:ms(15),
        paddingVertical:ms(5)
    },
    membersSayHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(12),
    },
    memberCard: {
        width: ms(180),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(12),
        padding: ms(12),
        marginRight: ms(10),
    },
    memberCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(8),
    },
    memberAvatar: {
        width: ms(38),
        height: ms(38),
        borderRadius: ms(20),
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(4),
    },
    memberName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
    },
    memberRatingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: ms(10),
        paddingHorizontal: ms(6),
        paddingVertical: ms(2),
        gap: ms(3),
    },
    memberRatingText: {
        color: '#fff',
        fontSize: ms(12),
        fontWeight: 'bold',
    },
    memberReview: {
        fontSize: ms(11),
        color: '#666',
        lineHeight: ms(14),
    },

    header: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#ccc',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    ban_style1: {
        flexDirection: 'row'
    },
    ban_style2: {
        borderRadius: 10
    },
    ban_style3: {
        height: 160,
        width: 200,
        borderRadius: 10
    },
    home_style1: {
        flexDirection: 'row'
    },
    home_style2: {
        borderRadius: 10
    },
    home_style3: {
        height: 140,
        width: 260,
        borderRadius: 10,
        marginRight: 10
    },
    headerButton: {
        backgroundColor: whiteColor,
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        borderWidth: 1.5,
        borderColor: whiteColor,
    },
    defaultProfileIcon: {
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationHeaderButton: {
        backgroundColor: whiteColor,
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },

    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    bottomSheetContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },

    pullBar: {
        width: 40,
        height: 4,
        backgroundColor: '#DADADA',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },

    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },

    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    title: {
        fontSize: ms(15),
        fontWeight: '600',
        color: '#000',
    },

    subTitle: {
        fontSize: ms(11),
        color: '#666',
        marginTop: 2,
    },

    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 2,
    },

});

function mapStateToProps(state) {
    return {
        current_lat: state.current_location.current_lat,
        current_lng: state.current_location.current_lng,
        current_address: state.current_location.current_address,
        current_tag: state.current_location.current_tag,
        address: state.current_location.address,
        sub_total: state.order.sub_total,
        cart_count: state.order.cart_count,
    };
}

const mapDispatchToProps = (dispatch) => ({
    updateAddress: (data) => dispatch(updateAddress(data)),
    updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
    updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
    updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
    currentTag: (data) => dispatch(currentTag(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
