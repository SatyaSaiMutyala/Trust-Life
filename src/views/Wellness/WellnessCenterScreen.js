import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { img_url } from '../../config/Constants';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import StandaloneBottomBar from '../../components/BottomNavBar/StandaloneBottomBar';
import DoctorAppointmentsContent from '../Doctor/DoctorAppointmentsContent';

const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
}).replace(/ /g, ' ');

const WELLNESS_CENTERS = [
    {
        id: '1',
        name: 'Sushma Wellness Center',
        location: 'Madhapur',
        rating: 4.5,
        reviews: '86k',
        image: require('../../assets/img/counselling-one.png'),
    },
    {
        id: '2',
        name: 'Varsha Wellness Center',
        location: 'Madhapur',
        rating: 4.5,
        reviews: '86k',
        image: require('../../assets/img/counselling-two.png'),
    },
    {
        id: '3',
        name: 'MindBody Fitness Studio',
        location: 'Banjara Hills',
        rating: 4.3,
        reviews: '54k',
        image: require('../../assets/img/counselling-three.png'),
    },
    {
        id: '4',
        name: 'Serenity Yoga & Wellness',
        location: 'Jubilee Hills',
        rating: 4.6,
        reviews: '72k',
        image: require('../../assets/img/counselling-four.png'),
    },
];

const WellnessCenterScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const flow = route.params?.flow;
    const [profilePic, setProfilePic] = useState(null);
    const [bottomTab, setBottomTab] = useState('wellness');

    useEffect(() => {
        AsyncStorage.getItem('profile_picture').then((saved) => {
            if (saved) setProfilePic(`${img_url}${saved}`);
        }).catch(() => {});
    }, []);

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DoctorSpecialistList', { specialtyName: item.name, flow })}
        >
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardInfo}>
                <View style={styles.cardInfoLeft}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <View style={styles.locationRow}>
                        <Icon type={Icons.Ionicons} name="location-outline" size={ms(13)} color="#888" />
                        <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                </View>
                <View style={styles.ratingWrap}>
                    <View style={styles.ratingRow}>
                        <Icon type={Icons.Ionicons} name="star" size={ms(13)} color="#F59E0B" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.reviewsText}>{item.reviews} Reviews</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {bottomTab === 'wellness' ? (
                <LinearGradient
                    colors={[primaryColor, '#F1F5F9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.18]}
                    style={styles.gradientWrapper}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {flow && (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarCircle}>
                                {profilePic ? (
                                    <Image source={{ uri: profilePic }} style={styles.avatarImage} />
                                ) : (
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(22)} color={primaryColor} />
                                )}
                            </TouchableOpacity>
                            <View style={styles.headerTextWrap}>
                                <Text style={styles.headerName} numberOfLines={1}>
                                    {global.customer_name || 'User'}
                                </Text>
                                <Text style={styles.headerDate}>{todayDate}</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
                                <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
                                <Icon type={Icons.Ionicons} name="headset-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity
                        style={styles.searchBar}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('DoctorSearchScreen')}
                    >
                        <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                        <Text style={styles.searchPlaceholder}>Search for Specialized Doctors</Text>
                    </TouchableOpacity>

                    {/* List */}
                    <FlatList
                        data={WELLNESS_CENTERS}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={
                            <Text style={styles.titleText}>What kind of support are you{'\n'}looking for?</Text>
                        }
                    />
                </LinearGradient>
            ) : (
                <DoctorAppointmentsContent />
            )}

            {!flow && (
                <StandaloneBottomBar
                    activeTab={bottomTab}
                    onTabChange={setBottomTab}
                    tab2Label="Wellness"
                    tab2Icon="spa"
                    tab2IconType={Icons.MaterialIcons}
                />
            )}
        </SafeAreaView>
    );
};

export default WellnessCenterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    gradientWrapper: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(12),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
        flex: 1,
    },
    backBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarCircle: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
    },
    headerTextWrap: {
        flex: 1,
    },
    headerName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: whiteColor,
    },
    headerDate: {
        fontSize: ms(11),
        color: 'rgba(255,255,255,0.8)',
        marginTop: vs(2),
    },
    headerRight: {
        flexDirection: 'row',
        gap: ms(8),
    },
    iconBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        gap: ms(8),
        marginBottom: vs(14),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: ms(13),
        color: '#AAAAAA',
    },

    // Title
    titleText: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        lineHeight: ms(23),
        marginBottom: vs(14),
        paddingHorizontal: ms(4),
    },

    // List
    listContent: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },

    // Card
    card: {
        backgroundColor: whiteColor,
        borderRadius: ms(16),
        marginBottom: vs(12),
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardImage: {
        width: '100%',
        height: vs(110),
        backgroundColor: '#E5E7EB',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
    },
    cardInfoLeft: {
        flex: 1,
        gap: vs(4),
    },
    cardName: {
        fontSize: ms(14),
        fontWeight: '700',
        color: blackColor,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(3),
    },
    locationText: {
        fontSize: ms(12),
        color: '#888',
    },
    ratingWrap: {
        alignItems: 'flex-end',
        gap: vs(2),
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(3),
    },
    ratingText: {
        fontSize: ms(13),
        fontWeight: '700',
        color: blackColor,
    },
    reviewsText: {
        fontSize: ms(11),
        color: '#888',
    },
});
