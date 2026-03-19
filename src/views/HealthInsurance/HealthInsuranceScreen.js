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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { img_url, heading, interMedium, interRegular } from '../../config/Constants';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
}).replace(/ /g, ' ');

const INSURANCE_PLANS = [
    {
        id: '1',
        name: 'Star Health Insurance',
        description: 'Comprehensive health coverage for hospital treatments and emergencies.',
        premium: '₹500',
        coverage: '₹5,00,000',
        benefits: ['65,000+ Network Hospitals', 'Cashless Treatment', 'No Room Rent Limit'],
        image: require('../../assets/img/hospital-one.png'),
    },
    {
        id: '2',
        name: 'HDFC ERGO Health Plan',
        description: 'Wide coverage with lifetime renewability and no co-payment clause.',
        premium: '₹750',
        coverage: '₹10,00,000',
        benefits: ['13,000+ Network Hospitals', 'Day Care Procedures', 'Mental Health Cover'],
        image: require('../../assets/img/hospital-two.png'),
    },
    {
        id: '3',
        name: 'Niva Bupa ReAssure',
        description: 'Unlimited reinstatement of sum insured with live healthy rewards.',
        premium: '₹999',
        coverage: '₹20,00,000',
        benefits: ['8,000+ Network Hospitals', 'Annual Health Check-up', 'OPD Cover'],
        image: require('../../assets/img/hospital-one.png'),
    },
];

const HealthInsuranceScreen = () => {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('profile_picture').then((saved) => {
            if (saved) setProfilePic(`${img_url}${saved}`);
        }).catch(() => {});
    }, []);

    const renderCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => navigation.navigate('InsurancePlanDetailScreen', { plan: item })}>
                {/* Image with premium badge */}
                <View>
                    <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>Premium  {item.premium}</Text>
                    </View>
                </View>

                {/* Card Body */}
                <View style={styles.cardBody}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDesc}>{item.description}</Text>

                    {/* Coverage Row */}
                    <View style={styles.coverageRow}>
                        <Text style={styles.coverageLabel}>Coverage</Text>
                        <Text style={styles.coverageValue}>{item.coverage}</Text>
                    </View>

                    {/* Key Benefits */}
                    <Text style={styles.benefitsTitle}>Key Benefits</Text>
                    {item.benefits.slice(0, 1).map((b, i) => (
                        <View key={i} style={styles.benefitRow}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.benefitText}>{b}</Text>
                        </View>
                    ))}

                    <TouchableOpacity onPress={() => navigation.navigate('InsurancePlanDetailScreen', { plan: item })}>
                        <Text style={styles.viewMore}>View more</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                        </TouchableOpacity>
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
                <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
                    <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                    <Text style={styles.searchPlaceholder}>Search for health insurance</Text>
                </TouchableOpacity>

                {/* List */}
                <FlatList
                    data={INSURANCE_PLANS}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <Text style={styles.titleText}>Our Health Coverage, Made Simple</Text>
                    }
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default HealthInsuranceScreen;

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
    headerTextWrap: { flex: 1 },
    headerName: {
        fontSize: ms(15),
        fontFamily: interMedium,
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
        fontFamily: interMedium,
        color: blackColor,
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
        marginBottom: vs(14),
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: vs(140),
        backgroundColor: '#E5E7EB',
    },
    premiumBadge: {
        position: 'absolute',
        bottom: ms(10),
        left: ms(10),
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: ms(5),
    },
    premiumText: {
        fontSize: ms(12),
        fontFamily: interMedium,
        color: blackColor,
    },

    // Card Body
    cardBody: {
        paddingHorizontal: ms(14),
        paddingVertical: vs(12),
    },
    cardName: {
        fontSize: ms(15),
        fontFamily: interMedium,
        color: blackColor,
        marginBottom: vs(4),
    },
    cardDesc: {
        fontSize: ms(12),
        color: '#666',
        lineHeight: ms(18),
        marginBottom: vs(10),
    },
    coverageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    coverageLabel: {
        fontSize: ms(13),
        color: '#888',
    },
    coverageValue: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: blackColor,
    },
    benefitsTitle: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: blackColor,
        marginBottom: vs(5),
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: ms(6),
        marginBottom: vs(3),
    },
    bullet: {
        fontSize: ms(13),
        color: blackColor,
        lineHeight: ms(20),
    },
    benefitText: {
        fontSize: ms(12),
        color: '#444',
        lineHeight: ms(20),
        flex: 1,
    },
    viewMore: {
        fontSize: ms(13),
        fontFamily: interMedium,
        color: primaryColor,
        marginTop: vs(8),
    },
});
