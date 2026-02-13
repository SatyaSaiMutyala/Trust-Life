
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, Linking, TextInput } from 'react-native';
import { ms, vs } from 'react-native-size-matters';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, logo_with_name, customer_lab_detail, api_url, img_url, white_logo, secondBaseUrl, BaseUrl } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoadLabDetailsAction } from '../redux/actions/LabDetailsActions';
import { LoadProfilesAction } from '../redux/actions/ProfilesActions';
import { LoadPackagesAction } from '../redux/actions/PackagesActions';
import { LoadTestsAction } from '../redux/actions/TestsActions';
import DropShadow from "react-native-drop-shadow";
import axios from 'axios';
import LabDetailsShimmer from '../components/LabDetailsShimmer';
import { connect } from 'react-redux';
import { updatePromo } from '../actions/LabOrderActions';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
import SearchInput from '../components/SearchInput';
import { blackColor, globalGradient, grayColor, primaryColor, whiteColor } from '../utils/globalColors';

const { width, height, fontScale } = Dimensions.get('window');


const LabDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    // Redux selectors
    const { data: labDetailsData, loading: labDetailsLoading } = useSelector(state => state.lab_details);
    const { data: profilesData, loading: profilesLoading } = useSelector(state => state.profiles);
    const { data: packagesData, loading: packagesLoading } = useSelector(state => state.packages);
    const { data: testsData, loading: testsLoading } = useSelector(state => state.tests);

    const [loading, setLoading] = useState(false);
    const [relevances, setRelevances] = useState([]);
    const [popular_packages, setPopularPackages] = useState([]);
    const [common_packages, setCommonPackages] = useState([]);
    const [common_packages_list, setCommonPackagesList] = useState([]);
    const [active_common_package, setActiveCommonPackage] = useState(0);
    const [lab_id, setLabId] = useState(route.params.lab_id);
    const [lab_name, setLabName] = useState(route.params.lab_name);
    const [screenName, setScreenName] = useState(route.params.name);
    const [searchText, setSearchText] = useState('');
    const [testType, setTestType] = useState('');


    // Category Vise data
    const [packageData, setPackageData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [profileData, setProfileData] = useState([]);
    const [totalData, setTotalData] = useState([]);


    const view_all_packages = (id, name) => {
        console.log('lab  packages', lab_id, id)
    }

    const package_details = (id, package_name, row) => {
    }

    useEffect(() => {
        console.log('-------------> this is LabDetails Screen')
        const init = async () => {
            setLoading(true);
            await Promise.all([
                get_lab_details(),
                getProfileData(),
                getPackageData(),
                getTestData()
            ]);
            setLoading(false);
        };

        init();
    }, []);

    // Auto-sync lab details data from Redux
    useEffect(() => {
        if (labDetailsData?.result) {
            setPopularPackages(labDetailsData.result.popular_packages || []);
            setCommonPackages(labDetailsData.result.common_packages || []);
            setRelevances(labDetailsData.result.relevances || []);
            if (labDetailsData.result.common_packages && labDetailsData.result.common_packages.length > 0) {
                setCommonPackagesList(labDetailsData.result.common_packages[0].data || []);
                setActiveCommonPackage(labDetailsData.result.common_packages[0].id);
            }
        }
    }, [labDetailsData]);

    // Auto-sync profiles data from Redux
    useEffect(() => {
        if (profilesData && Array.isArray(profilesData)) {
            setProfileData(profilesData);
        }
    }, [profilesData]);

    // Auto-sync packages data from Redux
    useEffect(() => {
        if (packagesData && Array.isArray(packagesData)) {
            setPackageData(packagesData);
        }
    }, [packagesData]);

    // Auto-sync tests data from Redux
    useEffect(() => {
        if (testsData && Array.isArray(testsData)) {
            setTestData(testsData);
        }
    }, [testsData]);

    const getTypeParam = () => {
        return screenName === 'Home Lab' ? 'home_collection' : 'walk_in';
    };


    const getProfileData = async () => {
        const type = getTypeParam();
        try {
            await dispatch(LoadProfilesAction(type));
        } catch (e) {
            console.log('Error Occured in profile --------> :', e);
        }
    }

    const getPackageData = async () => {
        try {
            await dispatch(LoadPackagesAction(testType));
        } catch (e) {
            console.log('Error occured in packages ---------> : ', e);
        }
    }

    const getTestData = async () => {
        try {
            await dispatch(LoadTestsAction());
        } catch (e) {
            console.log('Error Occured test -----------> :', e);
        }
    }

    // Here api function is there for category data
    const getAllCategoryData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${secondBaseUrl}/viewall/profile`);
            setTotalData(response.data);

            console.log('Profiles:', response.data.profiles);
            console.log('Packages:', response.data.packages);
            console.log('Tests:', response.data.tests);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    };


    const get_lab_details = async () => {
        try {
            await dispatch(LoadLabDetailsAction(lab_id));
        } catch (error) {
            console.log('Error loading lab details:', error);
            alert('Sorry something went wrong');
        }
    }

    const find_active_common_package = async () => {
        if (common_packages.length) {
            setActiveCommonPackage(common_packages[0].id);
        }
    }

    const show_common_packages_list = async (row) => {
        setActiveCommonPackage(row.id);
        setCommonPackagesList(row.data);
    }

    const handleBackButtonClick = () => {
        navigation.goBack()
    }
    const handleSearch = async (text) => {
        setSearchText(text);
        console.log('searchText', text)
    }

    const emptyHome = () => {
        console.log('searchText ', searchText)
    }

    const handleBookCall = () => {
        const phoneNumber = 7440075400;
        Linking.openURL(`tel:${phoneNumber}`);
        console.log('Book a Test via Call pressed');
    };

    const handleRelevancePress = (relevance) => {
        const keyword = relevance.relevance_name.toLowerCase();
        const filterByDisease = (data) =>
            data.filter(item =>
                item.diseases?.toLowerCase().includes(keyword)
            );
        const filteredPackages = filterByDisease(packageData);
        const filteredTests = filterByDisease(testData);
        const filteredProfiles = filterByDisease(profileData);

        const filteredResult = {
            relevance_name: relevance.relevance_name,
            profiles: filteredProfiles
        };
        console.log('this is indivudal data ----------->', filteredResult);
        navigation.navigate('RelevanceDetails', { data: filteredResult, name: 'Relevance' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            {loading ? (
                <LabDetailsShimmer />
            ) : (
                <ScrollView>
                    <LinearGradient
                        colors={globalGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        locations={[0, 1]}
                        style={styles.gradientBg}
                    >
                        <View style={styles.headerWrapper}>
                            {/* Back Button & Title */}
                            <TouchableOpacity onPress={handleBackButtonClick} activeOpacity={1}>
                                <View style={styles.backButtonRow}>
                                    <View style={styles.backButtonCircle}>
                                        <Icon type={Icons.Ionicons} name="arrow-back" style={styles.backIcon} />
                                    </View>
                                    <Text style={styles.headerTitle}>{screenName}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Search Bar */}
                            <TouchableOpacity
                                style={styles.searchContainer}
                                onPress={() => navigation.navigate('SearchItems')}
                                activeOpacity={1}
                            >
                                <Icon type={Icons.Feather} name="search" color="#999" size={ms(20)} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search"
                                    placeholderTextColor="#999"
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>

                            {/* Book a Test & Upload Prescription */}
                            <View style={styles.bookTestRow}>
                                <TouchableOpacity onPress={handleBookCall} style={styles.bookTestCard}>
                                    <View style={styles.bookTestTextWrapper}>
                                        <Text style={styles.bookTestTitle}>Book a Test</Text>
                                        <Text style={styles.bookTestTime}>30 mins</Text>
                                        <Text style={styles.bookTestDesc}>Speak with our experts for personalized guidance</Text>
                                    </View>
                                    <View style={styles.bookTestImgWrapper}>
                                        <Image source={require('../assets/img/personcall1.png')} style={styles.bookTestImage} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('uploadPerscription')} style={styles.uploadCard}>
                                    <Image source={require('../assets/img/prescription.png')} style={styles.uploadImage} />
                                    <Text style={styles.uploadText}>Upload Prescription</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Relevances */}
                            <View style={styles.relevancesContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {relevances.map((row, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleRelevancePress(row)} activeOpacity={1} style={styles.relevanceItem}>
                                            <View style={styles.relevanceImgWrapper}>
                                                <Image style={styles.relevanceImg} source={{ uri: img_url + row.relevance_icon }} />
                                            </View>
                                            <Text style={styles.relevanceName}>{row.relevance_name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Popular Packages */}
                    {popular_packages.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Popular Packages</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollView}>
                                {popular_packages.map((row, index) => (
                                    <TouchableOpacity key={index} activeOpacity={1} onPress={package_details.bind(this, row.id, row.package_name)} style={styles.cardTouchable}>
                                        <DropShadow style={styles.dropShadow}>
                                            <View style={styles.cardOuter}>
                                                <View style={styles.listContainer}>
                                                    <View style={styles.popularImageContainer}>
                                                        <Image
                                                            style={styles.popularImage}
                                                            source={{ uri: img_url + row.package_image }}
                                                        />
                                                    </View>
                                                    <View style={styles.cardInfoRow}>
                                                        <View style={styles.cardInfoWrapper}>
                                                            <Text numberOfLines={1} style={styles.cardName}>{row.package_name}</Text>
                                                            <Text numberOfLines={1} style={styles.cardDescription}>{row.short_description}</Text>
                                                            <Text numberOfLines={1} style={styles.cardPrice}>{global.currency}{row.price}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </DropShadow>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Profiles */}
                    {profileData.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitleBold}>Profiles</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('RelevanceDetails', { data: profileData, name: 'Profiles' })} style={styles.viewAllBtn}>
                                    <Text style={styles.viewAllText}>View All </Text>
                                    <Icon type={Icons.FontAwesome5} name="arrow-circle-right" style={styles.viewAllIcon} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollView}>
                                {profileData.map((row, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={1}
                                        onPress={() => navigation.navigate("SelectedTest", { data: row, name: 'Profiles' })}
                                        style={styles.cardTouchable}
                                    >
                                        <DropShadow style={styles.dropShadow}>
                                            <View style={styles.detailCardInner}>
                                                <View style={styles.detailCardImageBg}>
                                                    <Image
                                                        source={require('../assets/img/cardImg.png')}
                                                        style={styles.detailCardImage}
                                                    />
                                                    <View style={styles.reportBadge}>
                                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.reportBadgeText}>
                                                            Reports in {(row.report_tat || "").split("by")[0].trim()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text numberOfLines={1} style={styles.detailCardName}>{row.test_name}</Text>
                                                <Text numberOfLines={2} style={styles.detailCardSample}>{row.sample_container}</Text>
                                                <Text numberOfLines={1} style={styles.detailCardPrice}>{global.currency}{row.mrp}</Text>
                                            </View>
                                        </DropShadow>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Packages */}
                    {packageData.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitleBold}>Packages</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('RelevanceDetails', { data: packageData, name: 'Packages' })} style={styles.viewAllBtn}>
                                    <Text style={styles.viewAllText}>View All </Text>
                                    <Icon type={Icons.FontAwesome5} name="arrow-circle-right" style={styles.viewAllIcon} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollView}>
                                {packageData.map((row, index) => (
                                    <TouchableOpacity key={index} activeOpacity={1} onPress={() => navigation.navigate("SelectedTest", { data: row, name: 'Packages' })} style={styles.cardTouchable}>

                                            <View style={styles.detailCardInner}>
                                                <View style={styles.detailCardImageBg}>
                                                    <Image
                                                        source={require('../assets/img/cardImg.png')}
                                                        style={styles.detailCardImage}
                                                    />
                                                    <View style={styles.reportBadge}>
                                                        <Text style={styles.reportBadgeText}>
                                                            Reports in {(row.report_tat || "").split("by")[0].trim()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text numberOfLines={1} style={styles.detailCardName}>{row.test_name}</Text>
                                                <Text numberOfLines={2} style={styles.detailCardSample}>{row.sample_container}</Text>
                                                <Text numberOfLines={1} style={styles.detailCardPrice}>{global.currency}{row.mrp}</Text>
                                            </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Tests */}
                    {testData.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <LinearGradient colors={[colors.theme_color, colors.theme_color_One]} style={styles.testsHeader}>
                                <Text style={styles.testsHeaderTitle}>Tests</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('RelevanceDetails', { data: testData, name: 'Tests' })} style={styles.viewAllBtn}>
                                    <Text style={styles.viewAllTextWhite}>View All </Text>
                                    <Icon type={Icons.Ionicons} name="arrow-forward" style={styles.viewAllIconWhite} />
                                </TouchableOpacity>
                            </LinearGradient>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testCardScrollView}>
                                {testData.map((row, index) => (
                                    <TouchableOpacity key={index} activeOpacity={1} onPress={() => navigation.navigate("SelectedTest", { data: row, name: 'Tests' })} style={styles.cardTouchable}>
                                        <DropShadow style={styles.dropShadow}>
                                            <View style={styles.cardOuter}>
                                                <View style={styles.listContainer}>
                                                    <View style={styles.testCardInfo}>
                                                        <View style={styles.cardInfoWrapper}>
                                                            <Text numberOfLines={3} style={styles.testCardName}>{row.test_name}</Text>
                                                            <Text numberOfLines={1} style={styles.cardDescription}>{row.sample_container}</Text>
                                                            <Text numberOfLines={1} style={styles.cardPrice}>{global.currency}{row.mrp}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </DropShadow>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_grey,
    },
    gradientBg: {
        flex: 1,
    },
    headerWrapper: {
        paddingTop: vs(50),
        padding: ms(10),
    },
    backButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonCircle: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: ms(16),
        color: whiteColor,
    },
    headerTitle: {
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(10),
        fontWeight: '800',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        paddingHorizontal: ms(18),
        paddingVertical: vs(10),
        // marginHorizontal: ms(15),
        marginVertical: vs(15),

    },
    searchIcon: {
        marginRight: ms(4),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(16),
        color: '#000',
        paddingVertical: 0,
    },
    bookTestRow: {
        flexDirection: 'row',
        gap: ms(10),
    },
    bookTestCard: {
        flex: 2,
        backgroundColor: '#fff',
        borderRadius: ms(10),
        flexDirection: 'row',
        padding: ms(10),
        justifyContent: 'space-between',
    },
    bookTestTextWrapper: {
        flex: 1.5,
    },
    bookTestTitle: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
    },
    bookTestTime: {
        fontSize: ms(16),
        fontWeight: '700',
        color: 'green',
    },
    bookTestDesc: {
        fontSize: ms(12),
        fontWeight: '300',
        color: '#ccc',
    },
    bookTestImgWrapper: {
        flex: 1,
    },
    bookTestImage: {
        width: ms(50),
        height: vs(70),
    },
    uploadCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: ms(10),
        padding: ms(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadImage: {
        width: ms(60),
        height: ms(60),
    },
    uploadText: {
        fontWeight: '700',
        color: '#000',
        fontSize: ms(15),
        textAlign: 'left',
    },
    relevancesContainer: {
        marginVertical: vs(10),
        alignItems:'center',
        justifyContent:'center'
    },
    relevanceItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: ms(10),
        marginVertical: vs(10),
    },
    relevanceImgWrapper: {
        height: ms(60),
        width: ms(60),
    },
    relevanceImg: {
        flex: 1,
        height: ms(60),
        width: ms(60),
        borderRadius: ms(30),
    },
    relevanceName: {
        fontSize: ms(12),
        color: blackColor,
        fontFamily: bold,
        marginTop: vs(4),
    },
    sectionContainer: {
        backgroundColor: colors.theme_bg_three,
        paddingHorizontal: ms(15),
        paddingBottom:ms(10)
    },
    sectionTitle: {
        color: colors.theme_fg_two,
        fontFamily: bold,
        fontSize: ms(18),
    },
    sectionTitleBold: {
        color: '#000',
        fontFamily: bold,
        fontSize: ms(18),
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        borderRadius: ms(10),
    },
    viewAllBtn: {
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    viewAllText: {
        color: primaryColor,
        fontFamily: bold,
        fontSize: ms(12),
    },
    viewAllIcon: {
        fontSize: ms(14),
        color: primaryColor,
        marginLeft: ms(5),
    },
    viewAllTextWhite: {
        color: '#FFFFFF',
        fontFamily: bold,
        fontSize: ms(12),
    },
    viewAllIconWhite: {
        fontSize: ms(14),
        color: '#FFFFFF',
    },
    cardScrollView: {
        marginTop: vs(5),
        // backgroundColor:'#F8FAFC'
    },
    testCardScrollView: {
        marginTop: vs(10),
    },
    // dropShadow: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 0 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 5,
    // },
    cardTouchable: {
        width: ms(130),
        margin: ms(8),
    },
    cardOuter: {
        borderRadius: ms(10),
        // backgroundColor: colors.theme_fg_three,
    },
    listContainer: {
        borderRadius: ms(10),
        overflow: 'hidden',
    },
    popularImageContainer: {
        width: ms(130),
    },
    popularImage: {
        flex: 1,
        height: undefined,
        width: undefined,
        borderTopLeftRadius: ms(10),
        borderTopRightRadius: ms(10),
    },
    cardInfoRow: {
        flexDirection: 'row',
        padding: ms(8),
        // backgroundColor: colors.theme_fg_three,
        borderRadius: ms(10),
    },
    cardInfoWrapper: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    cardName: {
        color: colors.theme_fg_two,
        fontFamily: bold,
        fontSize: ms(11),
    },
    cardDescription: {
        color: colors.grey,
        fontFamily: regular,
        fontSize: ms(9),
        marginTop: vs(2),
    },
    cardPrice: {
        color: colors.theme_fg,
        fontFamily: bold,
        fontSize: ms(11),
        marginTop: vs(2),
    },
    detailCardInner: {
        flexDirection: 'column',
        padding: ms(8),
        backgroundColor: '#F8FAFC',
        borderRadius: ms(10),
        minHeight: vs(180),
        justifyContent: 'flex-start',
    },
    detailCardImageBg: {
        alignItems: 'center',
        backgroundColor: '#EBFEFB',
        borderRadius: ms(5),
        overflow: 'hidden',
    },
    detailCardImage: {
        width: ms(60),
        height: ms(60),
        marginVertical: vs(8),
    },
    reportBadge: {
        backgroundColor: '#388E3C',
        paddingHorizontal: ms(8),
        paddingVertical: vs(3),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reportBadgeText: {
        color: colors.theme_fg_three,
        fontFamily: regular,
        fontSize: ms(10),
        fontWeight: '600',
    },
    detailCardName: {
        color: colors.theme_fg_two,
        fontFamily: bold,
        fontSize: ms(13),
        fontWeight: 'bold',
        marginTop: vs(6),
    },
    detailCardSample: {
        color: colors.grey,
        fontFamily: regular,
        fontSize: ms(11),
        marginTop: vs(3),
    },
    detailCardPrice: {
        color: colors.theme_bg_two,
        fontFamily: bold,
        fontSize: ms(13),
        fontWeight: 'bold',
        marginTop: vs(6),
    },
    testsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        borderRadius: ms(10),
    },
    testsHeaderTitle: {
        color: '#FFFFFF',
        fontFamily: bold,
        fontSize: ms(18),
    },
    testCardInfo: {
        flexDirection: 'row',
        padding: ms(8),
        backgroundColor: colors.theme_fg_three,
        borderRadius: ms(10),
        height: vs(120),
    },
    testCardName: {
        color: colors.theme_fg_two,
        fontFamily: bold,
        fontSize: ms(12),
    },
    button: {
        padding: ms(3),
        borderRadius: ms(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: vs(40),
        marginTop: vs(4),
    },
    active_badge: {
        marginRight: ms(5),
        marginLeft: ms(5),
        backgroundColor: colors.badge_bg,
        borderRadius: ms(10),
    },
    inactive_badge: {
        marginRight: ms(5),
        marginLeft: ms(5),
        backgroundColor: colors.theme_bg_three,
        borderRadius: ms(10),
    },
    active_tag: {
        fontSize: ms(12),
        color: colors.theme_fg_three,
        fontFamily: bold,
        borderWidth: 0.5,
        padding: ms(10),
        borderRadius: ms(10),
        borderColor: colors.grey,
    },
    inactive_tag: {
        fontSize: ms(12),
        color: colors.theme_fg_two,
        fontFamily: bold,
        borderWidth: 0.5,
        padding: ms(10),
        borderRadius: ms(10),
        borderColor: colors.grey,
    },
});

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => ({
    updatePromo: (data) => dispatch(updatePromo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LabDetails);
