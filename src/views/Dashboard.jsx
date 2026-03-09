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
import { blackColor, globalGradient, primaryColor, whiteColor, grayColor, globalGradient2 } from '../utils/globalColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSnack } from '../context/GlobalSnackBarContext';


import { s, vs, ms, mvs } from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';
import { TextInput } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, RadialGradient, Stop, Polyline, Polygon, Line } from 'react-native-svg';
// import CominSoon from "../assets/json/comingsoon.json";
// import ComingSoon from "../assets/coming.mp4";
// import LottieView from 'lottie-react-native';
// import Video from 'react-native-video';

// ── Score Ring helpers ─────────────────────────────────────────────────
const DASH_RING_SIZE = ms(105);
const DASH_RING_CX = DASH_RING_SIZE / 2;
const DASH_RING_CY = DASH_RING_SIZE / 2;
const DASH_RING_R = ms(36);
const DASH_RING_STROKE = ms(12);
const DASH_RING_ARC_DEG = 300;
const DASH_RING_START_DEG = 120;

const dashToRad = (deg) => (deg * Math.PI) / 180;
const dashPolar = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos(dashToRad(deg)),
    y: cy + r * Math.sin(dashToRad(deg)),
});

const DASH_RING_CIRC = 2 * Math.PI * DASH_RING_R;
const DASH_RING_ARC_LEN = (DASH_RING_ARC_DEG / 360) * DASH_RING_CIRC;

// Score value config
const DASH_SCORE_MIN = 300;
const DASH_SCORE_MAX = 900;
const DASH_SCORE_MID = 500; // Orange-to-green threshold
const DASH_SCORE_VALUE = 320;
const DASH_SCORE_FRACTION = (DASH_SCORE_VALUE - DASH_SCORE_MIN) / (DASH_SCORE_MAX - DASH_SCORE_MIN);
const DASH_RING_FILL_LEN = DASH_RING_ARC_LEN * DASH_SCORE_FRACTION;
// Orange zone covers 300-500 range
const DASH_ORANGE_FRACTION = (DASH_SCORE_MID - DASH_SCORE_MIN) / (DASH_SCORE_MAX - DASH_SCORE_MIN);
const DASH_ORANGE_ARC_LEN = DASH_RING_ARC_LEN * DASH_ORANGE_FRACTION;
// Fill color: orange if score <= 500, green if > 500
const DASH_FILL_COLOR = DASH_SCORE_VALUE <= DASH_SCORE_MID ? '#E8940A' : null;

const DashScoreRing = () => {
    const isOrangeZone = DASH_SCORE_VALUE <= DASH_SCORE_MID;
    // If in green zone, split into orange portion + green portion
    const greenFraction = isOrangeZone ? 0 : ((DASH_SCORE_VALUE - DASH_SCORE_MID) / (DASH_SCORE_MAX - DASH_SCORE_MIN));
    const greenArcLen = DASH_RING_ARC_LEN * greenFraction;
    const greenRotation = DASH_RING_START_DEG + (DASH_ORANGE_FRACTION * DASH_RING_ARC_DEG);

    return (
        <View style={{ width: DASH_RING_SIZE, height: DASH_RING_SIZE }}>
            <Svg width={DASH_RING_SIZE} height={DASH_RING_SIZE}>
                <Defs>
                    <SvgLinearGradient id="dRingGreen" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#094A3D" />
                        <Stop offset="30%" stopColor="#1A8A68" />
                        <Stop offset="50%" stopColor="#2CB888" />
                        <Stop offset="70%" stopColor="#1A8A68" />
                        <Stop offset="100%" stopColor="#094A3D" />
                    </SvgLinearGradient>
                    <SvgLinearGradient id="dRingOrange" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#C47A08" />
                        <Stop offset="50%" stopColor="#E8940A" />
                        <Stop offset="100%" stopColor="#C47A08" />
                    </SvgLinearGradient>
                    <RadialGradient id="dRingGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="68%" stopColor="#1A7E70" stopOpacity="0.18" />
                        <Stop offset="100%" stopColor="#1A7E70" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx={DASH_RING_CX} cy={DASH_RING_CY} r={DASH_RING_R + ms(8)} fill="url(#dRingGlow)" />
                {/* Gray background track */}
                <Circle
                    cx={DASH_RING_CX} cy={DASH_RING_CY}
                    r={DASH_RING_R}
                    fill="none" stroke="#E8E8E8"
                    strokeWidth={DASH_RING_STROKE}
                    strokeDasharray={`${DASH_RING_ARC_LEN} ${DASH_RING_CIRC}`}
                    strokeLinecap="round"
                    transform={`rotate(${DASH_RING_START_DEG}, ${DASH_RING_CX}, ${DASH_RING_CY})`}
                />
                {isOrangeZone ? (
                    /* Orange fill arc - score is <= 500 */
                    <Circle
                        cx={DASH_RING_CX} cy={DASH_RING_CY} r={DASH_RING_R}
                        fill="none" stroke="url(#dRingOrange)"
                        strokeWidth={DASH_RING_STROKE}
                        strokeDasharray={`${DASH_RING_FILL_LEN} ${DASH_RING_CIRC}`}
                        strokeLinecap="round"
                        transform={`rotate(${DASH_RING_START_DEG}, ${DASH_RING_CX}, ${DASH_RING_CY})`}
                    />
                ) : (
                    <>
                        {/* Orange arc - covers 300 to 500 */}
                        <Circle
                            cx={DASH_RING_CX} cy={DASH_RING_CY} r={DASH_RING_R}
                            fill="none" stroke="url(#dRingOrange)"
                            strokeWidth={DASH_RING_STROKE}
                            strokeDasharray={`${DASH_ORANGE_ARC_LEN} ${DASH_RING_CIRC}`}
                            strokeLinecap="round"
                            transform={`rotate(${DASH_RING_START_DEG}, ${DASH_RING_CX}, ${DASH_RING_CY})`}
                        />
                        {/* Green arc - covers 500 to score value */}
                        <Circle
                            cx={DASH_RING_CX} cy={DASH_RING_CY} r={DASH_RING_R}
                            fill="none" stroke="url(#dRingGreen)"
                            strokeWidth={DASH_RING_STROKE}
                            strokeDasharray={`${greenArcLen} ${DASH_RING_CIRC}`}
                            strokeLinecap="round"
                            transform={`rotate(${greenRotation}, ${DASH_RING_CX}, ${DASH_RING_CY})`}
                        />
                    </>
                )}
                {/* White inner circle */}
                <Circle
                    cx={DASH_RING_CX} cy={DASH_RING_CY}
                    r={DASH_RING_R - DASH_RING_STROKE / 2 - ms(2)}
                    fill="#FFFFFF"
                />
            </Svg>
            <View style={{ position: 'absolute', width: DASH_RING_SIZE, height: DASH_RING_SIZE, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: ms(17), fontWeight: 'bold', color: '#1A4E44', lineHeight: ms(20) }}>320</Text>
                <Text style={{ fontSize: ms(8), color: '#555', textAlign: 'center' }}>Out of 900</Text>
            </View>
            <Text style={{
                position: 'absolute', color: '#fff', fontSize: ms(9), fontWeight: '600',
                left: dashPolar(DASH_RING_CX, DASH_RING_CY, DASH_RING_R + DASH_RING_STROKE / 2 + ms(4), DASH_RING_START_DEG).x - ms(11),
                top: dashPolar(DASH_RING_CX, DASH_RING_CY, DASH_RING_R + DASH_RING_STROKE / 2 + ms(4), DASH_RING_START_DEG).y - ms(2),
            }}>300</Text>
            <Text style={{
                position: 'absolute', color: '#fff', fontSize: ms(9), fontWeight: '600',
                left: dashPolar(DASH_RING_CX, DASH_RING_CY, DASH_RING_R + DASH_RING_STROKE / 2 + ms(4), DASH_RING_START_DEG + DASH_RING_ARC_DEG).x - ms(2),
                top: dashPolar(DASH_RING_CX, DASH_RING_CY, DASH_RING_R + DASH_RING_STROKE / 2 + ms(4), DASH_RING_START_DEG + DASH_RING_ARC_DEG).y - ms(2),
            }}>900</Text>
        </View>
    );
};

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
    const [isSecondUser, setIsSecondUser] = useState(true);
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
                    colors={globalGradient2}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.16]}
                    style={{ flex: 1 }}
                >
                    <View style={{
                        paddingTop: ms(50),
                        paddingBottom: ms(10),
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

                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
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

                        {/* ── MY HEALTH SUMMARY — shown for ALL users ── */}
                        <View style={styles2.healthSummarySection}>
                            <Text style={styles2.hsSectionTitle}> Health Summary</Text>

                            <LinearGradient
                                colors={['#4DBBA3', '#339985']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles2.hsOuterWrapper}
                            >
                                <LinearGradient
                                    colors={['#2BAB97', '#1A7E70']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles2.hsInnerCard}
                                >
                                    {/* "Health Progression Score" pill */}
                                    <View style={styles2.hsPill}>
                                        <Text style={styles2.hsPillText}>Health Progression Score</Text>
                                    </View>

                                    {/* Chart (left) + Ring (right) */}
                                    <View style={styles2.hsBody}>

                                        {/* LEFT — Stable label + Y-axis + SVG chart */}
                                        <View style={styles2.hsChartCol}>
                                            <Text style={styles2.hsStableLabel}>Stable</Text>
                                            <View style={styles2.hsChartRow}>
                                                <View style={styles2.hsYAxis}>
                                                    {[800, 700, 600, 500, 400].map(v => (
                                                        <Text key={v} style={styles2.hsYLabel}>{v}</Text>
                                                    ))}
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Svg width="100%" height={ms(70)} viewBox="0 0 128 60" preserveAspectRatio="none">
                                                        <Polyline
                                                            points="0,48 26,34 52,44 78,28 104,42 128,30"
                                                            fill="none"
                                                            stroke="rgba(255,255,255,0.92)"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </Svg>
                                                </View>
                                            </View>
                                            <View style={styles2.hsXLine} />
                                            <View style={styles2.hsXLabels}>
                                                {['Oct 25', 'Oct 25', 'Oct 25', 'Oct 25', 'Oct 25'].map((l, i) => (
                                                    <Text key={i} style={styles2.hsXLabel}>{l}</Text>
                                                ))}
                                            </View>
                                        </View>

                                        {/* RIGHT — Arc Score Ring */}
                                        <View style={styles2.hsRingCol}>
                                            <DashScoreRing />

                                            {/* +12 This Month pill */}
                                            <TouchableOpacity style={styles2.hsTrendBtn}>
                                                <Icon type={Icons.Feather} name="arrow-up" size={ms(12)} color={whiteColor} />
                                                <Text style={styles2.hsTrendBtnText}>+12 This Month</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </LinearGradient>

                                {/* White "View Detailed" pill */}
                                <TouchableOpacity
                                    style={styles2.hsViewBtn}
                                    onPress={() => navigation.navigate('CheckHealthStatus', { fromDashboard: true })}
                                >
                                    <Text style={styles2.hsViewBtnText}>View Detailed Health Progression</Text>
                                    <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(16)} color={blackColor} />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        {/* ── SECOND USER COMPONENTS ── */}
                        {isSecondUser && <>

                            {/* ── CONTINUITY TRACKER ── */}
                            <View style={styles2.continuityTrackerSection}>
                                <View style={styles2.continuityCard}>

                                    <View style={styles2.continuityCardHeader}>
                                        <Text style={styles2.continuityCardTitle}>Continuity Tracker</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('ContinuityTracking')}>
                                            <Text style={styles2.continuityViewAll}>View all</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles2.medicationRow}>
                                        <Text style={styles2.medicationLabel}>Medication</Text>
                                        <Text style={styles2.medicationDate}>Last updated  Thu, Mar 02,2026</Text>
                                    </View>

                                    <View style={styles2.streakSection}>
                                        <View style={styles2.streakLeft}>
                                            <Text style={styles2.streakTitle}>Active Days Streak</Text>
                                            <Text style={styles2.streakMaintain}>3 more days to maintain your streak</Text>
                                        </View>
                                        <View style={styles2.streakRight}>
                                            <Text style={styles2.streakDaysNumber}>4/7</Text>
                                            <Text style={styles2.streakDaysLabel}> days</Text>
                                        </View>
                                    </View>

                                    <View style={styles2.progressBarTrack}>
                                        <View style={[styles2.progressBarFill, { width: `${(4 / 7) * 100}%` }]} />
                                    </View>

                                    <View style={styles2.daysRow}>
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles2.dayCircle,
                                                    index < 4 ? styles2.dayCircleActive : styles2.dayCircleInactive,
                                                ]}
                                            >
                                                <Text style={[
                                                    styles2.dayLabel,
                                                    index < 4 ? styles2.dayLabelActive : styles2.dayLabelInactive,
                                                ]}>
                                                    {day}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* ── TODAY'S HEALTH SIGNAL ── */}
                            <View style={styles2.healthSignalSection}>
                                <View style={styles2.healthSignalCard}>

                                    {/* Badge */}
                                    <View style={styles2.hsBadge}>
                                        <Text style={styles2.hsBadgeText}>Today's Health Signal</Text>
                                    </View>

                                    {/* Title */}
                                    <Text style={styles2.hsTitle}>Blood Pressure – Persistently Elevated</Text>

                                    {/* Chart */}
                                    <View style={styles2.hsChartWrapper}>
                                        <Svg width="100%" height={ms(110)} viewBox="0 0 300 100" preserveAspectRatio="none">
                                            <Defs>
                                                <SvgLinearGradient id="hsChartGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <Stop offset="0" stopColor="#FF6B35" stopOpacity="0.45" />
                                                    <Stop offset="1" stopColor="#FF6B35" stopOpacity="0.02" />
                                                </SvgLinearGradient>
                                            </Defs>
                                            {/* Area fill */}
                                            <Polygon
                                                points="0,100 0,76 60,60 120,46 180,33 240,20 300,8 300,100"
                                                fill="url(#hsChartGrad)"
                                            />
                                            {/* Line */}
                                            <Polyline
                                                points="0,76 60,60 120,46 180,33 240,20 300,8"
                                                fill="none"
                                                stroke="#FF6B35"
                                                strokeWidth="2.5"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            />
                                            {/* Vertical dashed marker at last point */}
                                            <Line x1="300" y1="2" x2="300" y2="100" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="4,3" />
                                            {/* Data point dots */}
                                            {[[0, 76], [60, 60], [120, 46], [180, 33], [240, 20], [300, 8]].map(([cx, cy], i) => (
                                                <Circle key={i} cx={cx} cy={cy} r="4" fill="#FF6B35" />
                                            ))}
                                        </Svg>
                                        {/* 180/20 callout — top-right above vertical line */}
                                        <View style={styles2.hsValueCallout}>
                                            <Text style={styles2.hsValueText}>180/20</Text>
                                        </View>
                                    </View>

                                    {/* X-axis labels */}
                                    <View style={styles2.hsXAxis}>
                                        {['12 Feb', '13 Mar', '25 Apr', '21 May', '12 June', '12 July'].map((lbl, i) => (
                                            <Text key={i} style={styles2.hsXLabel}>{lbl}</Text>
                                        ))}
                                    </View>

                                    {/* Pattern Explanation */}
                                    <Text style={styles2.hsSectionHeader}>Pattern Explanation</Text>
                                    <Text style={styles2.hsSectionBody}>
                                        Your blood pressure readings have been consistently above the healthy range for the past 5 months, indicating a persistent elevation trend that requires attention.
                                    </Text>

                                    {/* Health Impact */}
                                    <Text style={styles2.hsSectionHeader}>Health Impact</Text>
                                    <View style={styles2.hsBulletRow}>
                                        <View style={styles2.hsBulletDot} />
                                        <Text style={styles2.hsBulletText}>Increased risk of heart disease and stroke</Text>
                                    </View>
                                    <View style={styles2.hsBulletRow}>
                                        <View style={styles2.hsBulletDot} />
                                        <Text style={styles2.hsBulletText}>Potential kidney damage over time if left unmanaged</Text>
                                    </View>

                                    {/* Peer Comparison */}
                                    <View style={styles2.hsPeerRow}>
                                        <Icon type={Icons.MaterialIcons} name="people" size={ms(18)} color="#FF6B35" />
                                        <Text style={styles2.hsPeerText}>Blood Pressure: Higher Than Most Peers</Text>
                                    </View>
                                    <Text style={styles2.hsPeerDesc}>
                                        Your readings are higher than 78% of people in your age and health group.
                                    </Text>

                                    {/* Suggestion box */}
                                    <View style={styles2.hsSuggestionBox}>
                                        <Text style={styles2.hsSuggestionTitle}>Suggestion</Text>
                                        <Text style={styles2.hsSuggestionBody}>
                                            Consider reducing sodium intake, increasing physical activity, and consulting your doctor about medication options to bring your blood pressure to a healthier range.
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* ── MY ACTIVE CONDITION ── */}
                            <View style={styles2.macSection}>
                                <View style={styles2.macCard}>

                                    {/* Badge */}
                                    <View style={styles2.macBadgeRow}>
                                        <View style={styles2.macBadge}>
                                            <View style={styles2.macBadgeDot} />
                                            <Text style={styles2.macBadgeText}> Active Health Condition</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('ActiveConditionsScreen')}>
                                            <Text style={styles2.viewAllText}>View all</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Condition Cards - Horizontal Scroll */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles2.macScrollRow}>
                                        {[
                                            { label: 'Acute',           count: '4', icon: 'flash',            iconColor: '#EF4444', category: 'Acute' },
                                            { label: 'Chronic',        count: '4', icon: 'time',             iconColor: '#3B82F6', category: 'Chronic' },
                                            { label: 'Chronic Infec.', count: '4', icon: 'bug',              iconColor: '#8B5CF6', category: 'Chronic Infectious' },
                                            { label: 'Genetic',        count: '4', icon: 'git-branch',       iconColor: '#10B981', category: 'Genetic' },
                                            { label: 'Life Threats',   count: '4', icon: 'alert-circle',     iconColor: '#F59E0B', category: 'Life Threats' },
                                            { label: 'Preventive',     count: '4', icon: 'shield-checkmark', iconColor: '#0EA5E9', category: 'Preventive' },
                                        ].map((item, index) => (
                                            <TouchableOpacity key={index} style={styles2.macGridCell} activeOpacity={0.7}
                                                onPress={() => navigation.navigate('CategoryDiseasesScreen', { category: item.category })}>
                                                <View style={styles2.macGridCellTop}>
                                                    <Text style={styles2.macGridCellLabel} numberOfLines={1}>{item.label}</Text>
                                                    <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(13)} color={blackColor} />
                                                </View>
                                                <View style={styles2.macGridCellBottom}>
                                                    <View style={[styles2.macGridIconWrap, { backgroundColor: item.iconColor + '15' }]}>
                                                        <Icon type={Icons.Ionicons} name={item.icon} size={ms(18)} color={item.iconColor} />
                                                    </View>
                                                    <View style={styles2.macGridBadge}>
                                                        <Text style={styles2.macGridBadgeText}>{item.count}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>

                            {/* ── VITAL ORGAN SNAPSHOT ── */}
                            <View style={styles2.vosSection}>
                                <View style={styles2.sectionHeader}>
                                    <Text style={styles2.vosSectionTitle}>Vital Organ Snapshot</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('AnalysisCheck')}>
                                        <Text style={styles2.viewAllText}>View all</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View>
                                        <View style={styles2.vosRow}>
                                            {[
                                                { image: require('../assets/img/human-eye.png'), organ: 'Eye', status: 'Normal' },
                                                { image: require('../assets/img/human-brain.png'), organ: 'Brain', status: 'Active' },
                                                { image: require('../assets/img/human-skin.png'), organ: 'Skin', status: 'Healthy' },
                                                { image: require('../assets/img/human-reproductive.png'), organ: 'Reproductive', status: 'Normal' },
                                                { image: require('../assets/img/human-pancreas.png'), organ: 'Pancreas', status: 'Stable' },
                                                { image: require('../assets/img/human-gut.png'), organ: 'Gut', status: 'Balanced' },
                                                { image: require('../assets/img/human-vascular.png'), organ: 'Vascular System', status: 'Normal' },
                                            ].map((item, index) => (
                                                <TouchableOpacity key={index} style={styles2.vosCard} activeOpacity={0.7} onPress={() => navigation.navigate('AnalysisCheck')}>
                                                    <View style={styles2.vosIconWrap}>
                                                        <Image source={item.image} style={styles2.vosImage} />
                                                    </View>
                                                    <Text style={styles2.vosOrganName}>{item.organ}</Text>
                                                    <Text style={styles2.vosStatus}>{item.status}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <View style={styles2.vosRow}>
                                            {[
                                                { image: require('../assets/img/human-heart.png'), organ: 'Heart', status: 'Optimal' },
                                                { image: require('../assets/img/human-liver.png'), organ: 'Liver', status: 'Stable' },
                                                { image: require('../assets/img/human-kidneys.png'), organ: 'Kidney', status: 'Normal' },
                                                { image: require('../assets/img/human-lungs.png'), organ: 'Lungs', status: 'Efficient' },
                                                { image: require('../assets/img/human-muscle.png'), organ: 'Muscle', status: 'Strong' },
                                                { image: require('../assets/img/human-thyroid.png'), organ: 'Thyroid', status: 'Normal' },
                                                { image: require('../assets/img/human-thymus.png'), organ: 'Thymus', status: 'Active' },
                                            ].map((item, index) => (
                                                <TouchableOpacity key={index} style={styles2.vosCard} activeOpacity={0.7} onPress={() => navigation.navigate('AnalysisCheck')}>
                                                    <View style={styles2.vosIconWrap}>
                                                        <Image source={item.image} style={styles2.vosImage} />
                                                    </View>
                                                    <Text style={styles2.vosOrganName}>{item.organ}</Text>
                                                    <Text style={styles2.vosStatus}>{item.status}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>

                            {/* ── NOTIFICATIONS ── */}
                            <View style={styles2.notifCard}>
                                <View style={styles2.sectionHeader}>
                                    <Text style={styles2.notifTitle}>Notifications</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                                        <Text style={styles2.viewAllText}>View all</Text>
                                    </TouchableOpacity>
                                </View>
                                {[
                                    { iconType: Icons.MaterialIcons, iconName: 'biotech', iconBg: '#E8F5E9', iconColor: '#2E7D32', title: 'HbA1c Screening', subtitle: 'Due based on your metabolic trends.' },
                                    { iconType: Icons.Ionicons, iconName: 'water', iconBg: '#E3F2FD', iconColor: '#1565C0', title: 'Tablets refill', subtitle: 'Add New set of tablets Here' },
                                    { iconType: Icons.Ionicons, iconName: 'water', iconBg: '#E3F2FD', iconColor: '#1565C0', title: 'Increase Hydration', subtitle: 'Aim for 8 glasses to support liver function.' },
                                ].map((item, index, arr) => (
                                    <View key={index}>
                                        <View style={styles2.notifRow}>
                                            <View style={[styles2.notifIconWrap, { backgroundColor: item.iconBg }]}>
                                                <Icon type={item.iconType} name={item.iconName} size={ms(20)} color={item.iconColor} />
                                            </View>
                                            <View style={styles2.notifTextWrap}>
                                                <Text style={styles2.notifItemTitle}>{item.title}</Text>
                                                <Text style={styles2.notifItemSub}>{item.subtitle}</Text>
                                            </View>
                                            <TouchableOpacity style={styles2.notifClose}>
                                                <Icon type={Icons.Ionicons} name="close" size={ms(14)} color="#999999" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>

                        </>}
                        {/* ── END SECOND USER COMPONENTS ── */}

                        {/* ── FIRST USER COMPONENTS ── */}
                        {!isSecondUser && <>

                            {/* Track your Health journey */}
                            <View style={styles.healthJourneySection}>
                                <Text style={styles.healthJourneyHeading}> Health Continuum</Text>
                                <View style={styles.healthJourneyGrid}>
                                    <TouchableOpacity
                                        style={styles.healthJourneyCard}
                                        onPress={() => navigation.navigate('SleepTrackingDashboard')}
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
                                        onPress={() => navigation.navigate('ExerciseTrackingDashboard')}
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
                                        onPress={() => navigation.navigate('FoodTrackingDashboard')}
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
                                        onPress={() => navigation.navigate('MedicationTracking')}
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
                                <Text style={styles.medicalLogHeading}> Health Monitoring</Text>
                                <View style={styles.medicalLogGrid}>
                                    {[
                                        { name: 'Heart Rate', image: require('../assets/img/heartRate.png'), route: 'HeartRateLog' },
                                        { name: 'Blood Pressure', image: require('../assets/img/blood_pressure.png'), route: 'BloodPressureLog' },
                                        { name: 'Glucose', image: require('../assets/img/glucose.png'), route: 'GlucoseLog' },
                                        { name: 'Temperature', image: require('../assets/img/temprature.png'), route: 'TemperatureLog' },
                                        { name: 'Menstrual Cycle', image: require('../assets/img/menstrualcycle.png'), route: 'MenstrualCycleLog' },
                                        { name: 'Weight Management', image: require('../assets/img/weightmanagement.png'), route: 'WeightLog' },
                                        { name: 'Vaccination', image: require('../assets/img/Vaccination.png'), route: 'VaccinationLog' },
                                        { name: 'Migraine', image: require('../assets/img/migraine.png'), route: 'MigraineLog' },
                                        { name: 'Asthma', image: require('../assets/img/astama.png'), route: 'AsthmaIntroScreen' },
                                        { name: 'Musculo Skeletal', image: require('../assets/img/skeletal.png'), route: 'MusculoskeletalIntroScreen' },
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
                                                } else if (item.route === 'WeightLog') {
                                                    navigation.navigate('WeightManagementLog');
                                                } else if (item.route === 'VaccinationLog') {
                                                    navigation.navigate('VaccinationLog');
                                                } else if (item.route === 'MigraineLog') {
                                                    navigation.navigate('MigraineLog');
                                                } else if (item.route === 'AsthmaIntroScreen') {
                                                    navigation.navigate('AsthmaIntroScreen');
                                                } else if (item.route === 'MusculoskeletalIntroScreen') {
                                                    navigation.navigate('MusculoskeletalIntroScreen');
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

                        </>}
                        {/* ── END FIRST USER COMPONENTS ── */}

                        {/* Top Service Cards */}
                        <View style={styles.healthServiceSection}>
                            <Text style={styles.healthServiceHeading}> Health Service</Text>
                            <View style={styles.wellnessGrid}>
                                {[
                                    { image: require('../assets/img/c-lab.png'), label: 'Home Lab', onPress: () => navigateToTests('Home Lab') },
                                    { image: require('../assets/img/c-doctor.png'), label: 'Doctor', onPress: () => navigation.navigate('DoctorConsultation') },
                                    { image: require('../assets/img/c-medicines.png'), label: 'Medicines', onPress: () => navigation.navigate('CompanyMedicines') },
                                    { image: require('../assets/img/c-tele.png'), label: 'Tele Medicine', onPress: () => navigation.navigate('DoctorConsultation', { flow: 'tele' }) },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.wellnessCard}
                                        activeOpacity={0.7}
                                        onPress={item.onPress}
                                    >
                                        <Image source={item.image} style={styles.wellnessImage} />
                                        <Text style={styles.wellnessLabel} numberOfLines={2}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.wellnessGrid}>
                                {[
                                    { image: require('../assets/img/c-coach.png'), label: 'Coach', route: 'CoachScreen' },
                                    { image: require('../assets/img/c-counselling.png'), label: 'Counselling', route: 'CounsellingScreen' },
                                    { image: require('../assets/img/c-nurse.png'), label: 'Nurse', route: 'NurseScreen' },
                                    { image: require('../assets/img/c-physiotherapy.png'), label: 'Physiotherapy', route: 'PhysiotherapyScreen' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.wellnessCard}
                                        activeOpacity={0.7}
                                        onPress={() => navigation.navigate(item.route)}
                                    >
                                        <Image source={item.image} style={styles.wellnessImage} />
                                        <Text style={styles.wellnessLabel} numberOfLines={2}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.wellnessGrid}>
                                {[
                                    { image: require('../assets/img/c-hospital.png'), label: 'Hospital', route: 'HospitalScreen' },
                                    { image: require('../assets/img/c-wellness.png'), label: 'Wellness Center', route: 'WellnessCenterScreen' },
                                    { image: require('../assets/img/c-healthinsurance.png'), label: 'Health Insurance', route: 'HealthInsuranceScreen' },
                                    { image: require('../assets/img/c-ambulance.png'), label: 'Ambulance', route: 'AmbulanceScreen' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.wellnessCard}
                                        activeOpacity={0.7}
                                        onPress={() => navigation.navigate(item.route)}
                                    >
                                        <Image source={item.image} style={styles.wellnessImage} />
                                        <Text style={styles.wellnessLabel} numberOfLines={2}>{item.label}</Text>
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
    healthServiceSection: {
        marginHorizontal: ms(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(15),
        paddingVertical: ms(20),
    },
    healthServiceHeading: {
        fontSize: ms(16),
        fontWeight: '600',
        marginBottom: ms(10),
        textAlign: 'center',
        color: blackColor,
    },
    healthServiceGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: ms(5),
        paddingHorizontal: ms(10),
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

    // Wellness Services
    wellnessGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(10),
        marginTop: vs(10),
    },
    wellnessCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ms(10),
        paddingHorizontal: ms(4),
        width: (width - ms(70)) / 4,
        height: ms(80),
    },

    teleCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: ms(10),
        paddingHorizontal: ms(4),
        width: (width - ms(70)) / 4,
        height: ms(80),
    },
    teleIconWrap: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(12),
        backgroundColor: '#E8F5F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    wellnessIconWrap: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(12),
        backgroundColor: '#E8F5F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(6),
    },
    wellnessImage: {
        width: ms(40),
        height: ms(40),
        resizeMode: 'contain',
        marginBottom: vs(6),
    },
    wellnessLabel: {
        fontSize: ms(12),
        fontFamily: bold,
        color: blackColor,
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
        marginHorizontal: ms(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(15),
        paddingVertical: ms(15),
        paddingHorizontal: ms(10),
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
        marginRight: -ms(8),
        marginVertical: -vs(10),
    },
    healthRingCenterText: {
        position: 'absolute',
        width: ms(140),
        height: ms(140),
        justifyContent: 'center',
        alignItems: 'center',
    },
    healthRingScore: {
        fontSize: ms(28),
        fontWeight: 'bold',
        color: blackColor,
    },
    healthRingSubtext: {
        fontSize: ms(9),
        color: '#666',
        marginTop: vs(1),
    },
    healthRingLabel: {
        fontSize: ms(11),
        fontWeight: '700',
        color: whiteColor,
    },

    // Track your Health journey
    healthJourneySection: {
        marginHorizontal: ms(15),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(15),
        paddingVertical: ms(15),
        paddingHorizontal: ms(10),
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
        width: (width - ms(65)) / 2,
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
        marginHorizontal: ms(15),
        // backgroundColor: '#F1F5F9',
        borderRadius: ms(15),
        paddingVertical: ms(15),
        marginTop: ms(15),
        marginBottom: ms(10),
    },
    medicalLogHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(15),
        textAlign: 'center'
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
        marginHorizontal: ms(15),
        paddingVertical: ms(5)
    },
    membersSayHeading: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(12),
    },
    memberCard: {
        width: ms(180),
        backgroundColor: whiteColor,
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

// ── Health Summary + Continuity Tracker styles ─────────────────────────────
const styles2 = StyleSheet.create({

    // ── Health Summary Section ──────────────────────────────────────
    healthSummarySection: {
        marginTop: ms(5),
        marginBottom: ms(15),
        paddingHorizontal: ms(15),
    },
    hsSectionTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: ms(12),
    },
    hsOuterWrapper: {
        borderRadius: ms(22),
        padding: ms(12),
        shadowColor: '#000',
    },
    hsInnerCard: {
        borderRadius: ms(18),
        padding: ms(14),
        overflow: 'hidden',
        marginBottom: ms(12),
    },
    hsPill: {
        backgroundColor: 'rgba(0,0,0,0.22)',
        borderRadius: ms(20),
        paddingVertical: ms(8),
        paddingHorizontal: ms(16),
        alignSelf: 'center',
        marginBottom: ms(12),
    },
    hsPillText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: ms(14),
        textAlign: 'center',
    },
    hsBody: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    hsChartCol: {
        flex: 1,
        marginRight: ms(6),
    },
    hsStableLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: ms(13),
        marginBottom: ms(4),
        backgroundColor: 'rgba(255,255,255,0.20)',
        alignSelf: 'flex-end',
        paddingHorizontal: ms(12),
        paddingVertical: vs(3),
        borderRadius: ms(12),
        overflow: 'hidden',
    },
    hsChartRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    hsYAxis: {
        height: ms(70),
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: ms(3),
    },
    hsYLabel: {
        color: 'rgba(255,255,255,0.82)',
        fontSize: ms(8),
    },
    hsXLine: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.40)',
        marginTop: ms(2),
    },
    hsXLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: ms(3),
    },
    hsXLabel: {
        color: blackColor,
        fontSize: ms(7),
    },
    hsRingCol: {
        alignItems: 'center',
    },
    hsRingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hsMinMaxTxt: {
        color: '#fff',
        fontSize: ms(11),
        fontWeight: '600',
        marginHorizontal: ms(3),
    },
    hsRingWrap: {
        width: ms(90),
        height: ms(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    hsRingOverlay: {
        position: 'absolute',
        width: ms(90),
        height: ms(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    hsScoreNum: {
        fontSize: ms(22),
        fontWeight: 'bold',
        color: '#1A4E44',
        lineHeight: ms(25),
    },
    hsScoreOf: {
        fontSize: ms(9),
        color: '#555',
        textAlign: 'center',
    },
    hsTrendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.20)',
        borderRadius: ms(20),
        paddingVertical: ms(5),
        paddingHorizontal: ms(12),
        marginTop: ms(8),
    },
    hsTrendBtnText: {
        color: '#fff',
        fontSize: ms(11),
        fontWeight: '600',
        marginLeft: ms(4),
    },
    hsViewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: ms(30),
        paddingVertical: ms(14),
        paddingHorizontal: ms(16),
    },
    hsViewBtnText: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: '#000',
        marginRight: ms(4),
    },

    // ── Continuity Tracker ──────────────────────────────────────────
    continuityTrackerSection: {
        marginBottom: ms(12),
    },
    continuityCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: ms(14),
    },
    continuityCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(10),
    },
    continuityCardTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: '#000',
    },
    continuityViewAll: {
        fontSize: ms(12),
        fontFamily: bold,
        color: primaryColor,
    },
    medicationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(12),
    },
    medicationLabel: {
        fontSize: ms(13),
        fontWeight: '400',
        color: '#000',
    },
    medicationDate: {
        fontSize: ms(10),
        color: '#AAAAAA',
    },
    streakSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: ms(10),
    },
    streakLeft: {
        flex: 1,
        paddingRight: ms(8),
    },
    streakTitle: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(3),
    },
    streakMaintain: {
        fontSize: ms(10),
        color: '#AAAAAA',
    },
    streakRight: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    streakDaysNumber: {
        fontSize: ms(17),
        fontWeight: 'bold',
        color: '#000',
    },
    streakDaysLabel: {
        fontSize: ms(12),
        fontWeight: '400',
        color: '#AAAAAA',
    },
    progressBarTrack: {
        height: ms(9),
        backgroundColor: '#EBEBEB',
        borderRadius: ms(5),
        marginBottom: ms(12),
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2979FF',
        borderRadius: ms(5),
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayCircle: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCircleActive: {
        backgroundColor: '#2979FF',
    },
    dayCircleInactive: {
        backgroundColor: '#F0F0F0',
    },
    dayLabel: {
        fontSize: ms(10),
        fontWeight: '600',
    },
    dayLabelActive: {
        color: '#FFFFFF',
    },
    dayLabelInactive: {
        color: '#BBBBBB',
    },

    /* ── Today's Health Signal ── */
    healthSignalSection: {
        marginBottom: ms(14),
    },
    healthSignalCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: ms(16),
    },
    hsBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF0E8',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: ms(5),
        marginBottom: ms(10),
    },
    hsBadgeText: {
        fontSize: ms(11),
        fontWeight: '600',
        color: '#FF6B35',
    },
    hsTitle: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: ms(12),
        lineHeight: ms(22),
    },
    hsChartWrapper: {
        position: 'relative',
        marginBottom: ms(4),
    },
    hsValueCallout: {
        position: 'absolute',
        top: ms(2),
        right: ms(2),
        backgroundColor: '#FF6B35',
        borderRadius: ms(6),
        paddingHorizontal: ms(7),
        paddingVertical: ms(3),
    },
    hsValueText: {
        fontSize: ms(11),
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    hsXAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: ms(14),
        paddingHorizontal: ms(2),
    },
    hsXLabel: {
        fontSize: ms(9),
        color: whiteColor,
        textAlign: 'center',
    },
    hsSectionHeader: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: ms(5),
        marginTop: ms(4),
    },
    hsSectionBody: {
        fontSize: ms(12),
        color: '#555555',
        lineHeight: ms(18),
        marginBottom: ms(10),
    },
    hsBulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: ms(5),
    },
    hsBulletDot: {
        width: ms(6),
        height: ms(6),
        borderRadius: ms(3),
        backgroundColor: '#111111',
        marginTop: ms(5),
        marginRight: ms(8),
    },
    hsBulletText: {
        flex: 1,
        fontSize: ms(12),
        color: '#444444',
        lineHeight: ms(18),
    },
    hsPeerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: ms(12),
        marginBottom: ms(5),
        gap: ms(6),
    },
    hsPeerText: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    hsPeerDesc: {
        fontSize: ms(12),
        color: '#666666',
        lineHeight: ms(18),
        marginBottom: ms(12),
    },
    hsSuggestionBox: {
        backgroundColor: '#F8F8F8',
        borderRadius: ms(12),
        paddingHorizontal: ms(12),
        paddingVertical: ms(12),
    },
    hsSuggestionTitle: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: ms(5),
    },
    hsSuggestionBody: {
        fontSize: ms(12),
        color: '#555555',
        lineHeight: ms(18),
    },

    /* ── My Active Condition ── */
    macSection: {
        marginBottom: ms(14),
    },
    macCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: ms(12),
    },
    macBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    macBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A6B42',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(7),
        // marginBottom: ms(16),
        gap: ms(3),
    },
    macBadgeDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: '#FFFFFF',
    },
    macBadgeText: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#FFFFFF',
    },
    macScrollRow: {
        marginTop: vs(12),
    },
    macGridCell: {
        width: ms(130),
        backgroundColor: '#F3F4F6',
        borderRadius: ms(12),
        padding: ms(12),
        marginRight: ms(10),
        minHeight: vs(90),
        justifyContent: 'space-between',
    },
    macGridCellTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    macGridCellLabel: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
        flex: 1,
    },
    macGridCellBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: vs(10),
    },
    macGridIconWrap: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    macGridBadge: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: blackColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    macGridBadgeText: {
        color: whiteColor,
        fontSize: ms(14),
        fontWeight: 'bold',
    },

    /* ── Lifestyle Impact Summary ── */
    lisCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        marginHorizontal: ms(15),
        marginBottom: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: ms(16),
    },
    lisSectionTitle: {
        fontSize: ms(17),
        fontWeight: 'bold',
        color: '#111111',
    },
    lisRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ms(12),
        gap: ms(12),
    },
    lisLabel: {
        flex: 1,
        fontSize: ms(14),
        color: '#111111',
        fontWeight: '400',
    },
    lisBadgeStrong: {
        backgroundColor: '#E8F5E9',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(5),
    },
    lisBadgeTextStrong: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#2E7D32',
    },
    lisBadgeModerate: {
        backgroundColor: '#FFF4E5',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: ms(5),
    },
    lisBadgeTextModerate: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#E07B00',
    },
    lisDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },

    /* ── Notifications ── */
    notifCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        marginHorizontal: ms(15),
        marginBottom: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: ms(16),
    },
    notifTitle: {
        fontSize: ms(17),
        fontWeight: 'bold',
        color: '#111111',
    },
    notifRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ms(12),
        gap: ms(12),
    },
    notifIconWrap: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifTextWrap: {
        flex: 1,
    },
    notifItemTitle: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#111111',
        marginBottom: ms(3),
    },
    notifItemSub: {
        fontSize: ms(11),
        color: '#888888',
        lineHeight: ms(16),
    },
    notifClose: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(14),
        backgroundColor: '#F4F5F7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Vital Organ Snapshot ── */
    vosSection: {
        marginBottom: ms(14),
        marginHorizontal: ms(15),
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        padding: ms(16),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(12),
    },
    viewAllText: {
        fontSize: ms(12),
        fontFamily: bold,
        color: primaryColor,
    },
    vosSectionTitle: {
        fontSize: ms(17),
        fontWeight: 'bold',
        color: '#111111',
    },
    vosRow: {
        flexDirection: 'row',
        gap: ms(10),
        marginBottom: ms(10),
    },
    vosCard: {
        width: ms(120),
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(12),
        paddingVertical: ms(12),
        alignItems: 'center',
    },
    vosIconWrap: {
        // width: ms(48),
        // height: ms(48),
        borderRadius: ms(14),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(8),
    },
    vosImage: {
        width: ms(46),
        height: ms(46),
        resizeMode: 'contain',
    },
    vosOrganName: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
        marginBottom: ms(2),
        textAlign: 'center',
    },
    vosStatus: {
        fontSize: ms(13),
        fontWeight: 'bold',
        color: '#111111',
        textAlign: 'center',
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
