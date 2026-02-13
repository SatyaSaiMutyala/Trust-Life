import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableOpacity, Linking, Dimensions } from "react-native";
import { blackColor, whiteColor, primaryColor } from "../utils/globalColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms, scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from "@react-navigation/native";
import Icon, { Icons } from "../components/Icons";
import { StatusBar, StatusBar2 } from "../components/StatusBar";
import SearchInput from "../components/SearchInput";
import { bold } from "../config/Constants";
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Responsive functions
const wp = (percentage) => {
    const value = (percentage * width) / 100;
    return Math.round(value);
};

const hp = (percentage) => {
    const value = (percentage * height) / 100;
    return Math.round(value);
};

const FullBodyCheckUpScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    // Static data for packages
    const packages = [
        {
            id: 1,
            name: "Neuronal (Paraneoplastic )...",
            testsCount: "Covers 64 Test",
            originalPrice: "₹24,599",
            discountedPrice: "₹20,499",
            bgColor: "#E0F5F0"
        },
        {
            id: 2,
            name: "Neuronal (Paraneoplastic )...",
            testsCount: "Covers 64 Test",
            originalPrice: "₹24,599",
            discountedPrice: "₹20,499",
            bgColor: "#E0F5F0"
        },
        {
            id: 3,
            name: "Neuronal (Paraneoplastic )...",
            testsCount: "Covers 64 Test",
            originalPrice: "₹24,599",
            discountedPrice: "₹20,499",
            bgColor: "#E0F5F0"
        },
        {
            id: 4,
            name: "Neuronal (Paraneoplastic )...",
            testsCount: "Covers 64 Test",
            originalPrice: "₹24,599",
            discountedPrice: "₹20,499",
            bgColor: "#E0F5F0"
        }
    ];

    const statsData = [
        {
            icon: 'science',
            number: '10M',
            description: 'Quality annual\ndiagnostic tests',
        },
        {
            icon: 'local-hospital',
            number: '140+',
            description: 'Labs across\nthe country',
        },
        {
            icon: 'verified',
            number: '40 Years',
            description: "TrustLab's healthcare\nlegacy",
        },
        {
            icon: 'location-on',
            number: '2000+',
            description: 'Collection centres\nacross 80+ cities',
        },
    ];

    const certifications = [
        {
            name: 'NABL',
            imageUrl: 'https://calibrationservices.home.blog/wp-content/uploads/2023/12/nabl-500x500-1.png'
        },
        {
            name: 'ICMR',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_54W_3RznzBXvVfgf6wRSd1_HaTYUHPi4Dc1FCEdMfTJvpr5XU4WlYmO77SDtVVpYwM&usqp=CAU'
        },
    ];

    const handleBookCall = () => {
        const phoneNumber = 7440075400;
        Linking.openURL(`tel:${phoneNumber}`);
        console.log('Book a Test via Call pressed');
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Full Body checkups</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('LabCart')}>
                            <Icon type={Icons.Ionicons} name="cart-outline" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Icon type={Icons.Ionicons} name="share-social-outline" color={blackColor} size={ms(20)} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                    style={styles.searchContainer}
                    onPress={() => navigation.navigate('SearchItems')}
                    activeOpacity={1}
                >
                    <Icon type={Icons.Ionicons} name="search" color="#999" size={ms(20)} style={{ marginRight: s(10) }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search test..."
                        // value={search}
                        // onChangeText={setSearch}
                        placeholderTextColor="#999"
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                    {/* Banner Section */}
                    <View style={styles.bannerContainer}>
                        <Image
                            source={require('../assets/img/dummy-banner.png')}
                            style={styles.bannerFullImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Book a Test & Upload Prescription */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity onPress={handleBookCall} style={styles.bookTestCard}>
                            <View style={{ flex: 1.5 }}>
                                <Text style={{ fontSize: moderateScale(16), fontWeight: '700', color: 'black' }}>Book a Test</Text>
                                <Text style={{ fontSize: moderateScale(16), fontWeight: '700', color: 'green' }}>30 mins</Text>
                                <Text style={{ fontSize: moderateScale(12), fontWeight: '300', color: '#ccc' }}>Speak with our experts for personalized guidance</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Image source={require('../assets/img/personcall1.png')} style={{ width: scale(50), height: scale(70) }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('uploadPerscription')} style={styles.uploadCard}>
                            <View>
                                <Image source={require('../assets/img/prescription.png')} style={{ width: scale(60), height: scale(60) }} />
                            </View>
                            <View>
                                <Text style={{ fontWeight: '700', color: '#000', fontSize: moderateScale(15), textAlign: 'start' }}>Upload Prescription</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Full Body checkup Packages */}
                    <Text style={styles.sectionTitle}>Full Body checkup Packages</Text>

                    <View style={styles.packagesGrid}>
                        {packages.map((pkg) => (
                            <View key={pkg.id} style={[styles.packageCard, { backgroundColor: pkg.bgColor }]}>
                                <Text style={styles.packageName}>{pkg.name}</Text>
                                <Text style={styles.packageTests}>{pkg.testsCount}</Text>

                                <View style={styles.packagePriceRow}>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
                                        <Text style={styles.discountedPrice}>{pkg.discountedPrice}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.arrowButton}>
                                        <Icon type={Icons.Entypo} name="chevron-with-circle-right" color={blackColor} size={ms(20)} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Stats Section */}
                    <View>
                        <View style={{paddingTop:ms(25)}}>
                            <Text style={{fontFamily:bold, color:blackColor, fontSize:moderateScale(16), textAlign:'center'}}>Why to choose us</Text>
                        </View>
                        <View style={styles.statsContainer}>
                            {statsData.map((stat, index) => (
                                <View key={index} style={styles.statItem}>
                                    <View style={styles.iconContainer}>
                                        <Icon2 name={stat.icon} size={wp(4)} color="#1F2B7B" />
                                    </View>
                                    <Text style={styles.statNumber}>{stat.number}</Text>
                                    <Text style={styles.statDescription}>{stat.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Quality Assurance Section */}
                    <View style={styles.qualitySection}>
                        <View style={styles.qualityIconContainer}>
                            <Icon2 name="security" size={wp(6)} color="#1F2B7B" />
                        </View>
                        <Text style={styles.qualityTitle}>
                            Certified safety and quality fulfilled by
                        </Text>
                        <Text style={styles.qualitySubtitle}>Trust Lab Diagnostics</Text>

                        {/* Certifications */}
                        <View style={styles.certificationsContainer}>
                            {certifications.map((cert, index) => (
                                <View key={index} style={styles.certificationItem}>
                                    <Image
                                        source={{ uri: cert.imageUrl }}
                                        style={styles.certificationImage}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.certificationText}>{cert.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(15),
        paddingVertical: vs(15),
        backgroundColor: whiteColor,
    },
    headerButton: {
        width: s(35),
        height: s(35),
        borderRadius: s(17.5),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(18),
        fontWeight: '600',
        color: blackColor,
        marginLeft: s(15),
    },
    headerActions: {
        flexDirection: 'row',
        gap: s(10),
    },
    iconButton: {
        width: s(35),
        height: s(35),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: s(15),
        paddingBottom: vs(30),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        paddingVertical: vs(8),
        // marginHorizontal: ms(15),
        marginTop: vs(10),
        marginBottom: vs(10),
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: '#000',
        paddingVertical: 0,
    },
    bannerContainer: {
        marginVertical: vs(10),
    },
    bannerFullImage: {
        width: '100%',
        height: vs(120),
        borderRadius: ms(15),
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: vs(20),
        gap: s(15),
    },
    bookTestCard: {
        flex: 2,
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        flexDirection: 'row',
        padding: s(10),
        justifyContent: 'space-between',
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        // Android Shadow
        elevation: 5,
    },
    uploadCard: {
        flex: 1,
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        flexDirection: 'column',
        padding: s(10),
        alignItems: 'center',
        justifyContent: 'center',
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        // Android Shadow
        elevation: 5,
    },
    actionCard: {
        flex: 1,
        backgroundColor: whiteColor,
        borderRadius: ms(15),
        padding: s(15),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        minHeight: vs(140),
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
    },
    actionTime: {
        fontSize: ms(13),
        fontWeight: '600',
        color: '#4CAF50',
        marginTop: vs(5),
    },
    actionDescription: {
        fontSize: ms(11),
        color: '#666',
        marginTop: vs(5),
        lineHeight: vs(16),
    },
    actionImageContainer: {
        alignSelf: 'flex-end',
        marginTop: vs(10),
    },
    expertEmoji: {
        fontSize: ms(50),
    },
    actionImageContainer2: {
        alignSelf: 'center',
        marginBottom: vs(10),
    },
    prescriptionEmoji: {
        fontSize: ms(50),
    },
    uploadTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: blackColor,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: ms(18),
        fontWeight: '700',
        color: blackColor,
        marginTop: vs(25),
        marginBottom: vs(15),
    },
    packagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: s(15),
    },
    packageCard: {
        width: '47%',
        borderRadius: ms(15),
        padding: s(15),
        // minHeight: vs(160),
    },
    packageName: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(8),
    },
    packageTests: {
        fontSize: ms(11),
        color: '#666',
        marginBottom: vs(15),
    },
    packagePriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: whiteColor,
        paddingHorizontal: s(10),
        paddingVertical: vs(10),
        borderRadius: ms(10),
        marginTop: vs(10),
    },
    priceContainer: {
        flex: 1,
    },
    originalPrice: {
        fontSize: ms(11),
        color: '#999',
        textDecorationLine: 'line-through',
        marginBottom: vs(2),
    },
    discountedPrice: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
    },
    arrowButton: {
        width: s(32),
        height: s(32),
        borderRadius: s(16),
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: s(1),
        paddingVertical: hp(2),
    },
    statItem: {
        width: (width - wp(12)) / 2,
        backgroundColor: '#fff',
        borderRadius: ms(12),
        padding: s(12),
        marginBottom: vs(15),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        backgroundColor: '#e3f2fd',
        padding: s(10),
        borderRadius: ms(24),
        marginBottom: vs(10),
    },
    statNumber: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: '#1F2B7B',
        marginBottom: vs(5),
        textAlign: 'center',
    },
    statDescription: {
        fontSize: ms(10),
        color: '#666',
        textAlign: 'center',
        lineHeight: vs(16),
    },
    qualitySection: {
        backgroundColor: '#fff',
        marginHorizontal: s(4),
        borderRadius: ms(16),
        padding: s(16),
        alignItems: 'center',
        marginBottom: vs(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qualityIconContainer: {
        backgroundColor: '#e3f2fd',
        padding: s(12),
        borderRadius: ms(24),
        marginBottom: vs(15),
    },
    qualityTitle: {
        fontSize: ms(14),
        color: '#333',
        textAlign: 'center',
        marginBottom: vs(3),
    },
    qualitySubtitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: '#1F2B7B',
        textAlign: 'center',
        marginBottom: vs(15),
    },
    certificationsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    certificationItem: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: s(10),
        borderRadius: ms(8),
        flex: 0.45,
        minHeight: vs(80),
    },
    certificationImage: {
        width: s(40),
        height: s(40),
        marginBottom: vs(5),
    },
    certificationText: {
        fontSize: ms(12),
        color: '#1F2B7B',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default FullBodyCheckUpScreen;
