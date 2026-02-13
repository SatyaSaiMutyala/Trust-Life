import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';
import LinearGradient from 'react-native-linear-gradient';
import { ms } from 'react-native-size-matters';

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

const FooterComponent = () => {
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
            number: '5 Years',
            description: "TrustLab's healthcare\nlegacy",
        },
        {
            icon: 'location-on',
            number: '10+',
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

    const socialIcons = [
        { name: 'facebook', library: 'FontAwesome' },
        { name: 'twitter', library: 'FontAwesome' },
        { name: 'instagram', library: 'FontAwesome' },
        { name: 'linkedin', library: 'FontAwesome' },
    ];

    const socialUrls = {
        facebook: 'https://www.facebook.com/TRUSTlabDiagnostics',
        twitter: 'https://x.com/TRUSTlabPvtLtd',
        instagram: 'https://www.instagram.com/trustlab_official/',
        linkedin: 'https://www.linkedin.com/company/trustlabdiagnostics',
    };

    const renderIcon = (iconName, library = 'MaterialIcons', size = 24, color = '#1F2B7B') => {
        switch (library) {
            case 'FontAwesome':
                return <FontAwesome name={iconName} size={size} color={color} />;
            case 'Ionicons':
                return <Ionicons name={iconName} size={size} color={color} />;
            default:
                return <Icon name={iconName} size={size} color={color} />;
        }
    };

    return (
        // <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

            {/* Stats Section */}
            <LinearGradient
                colors={[primaryColor, '#FFF07485',]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.7]}
                style={styles.statsGradient}
            >
                <Text style={styles.statsTitle}>Why Indian's Trust Us</Text>
                <View style={styles.statsGrid}>
                    {statsData.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statNumber}>{stat.number}</Text>
                            <Text style={styles.statDescription}>{stat.description}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>

                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, marginVertical:ms(10) }}>
                    <Text style={styles.footerCopyright}>
                        Powdered by
                    </Text>
                    <Image source={require('../assets/img/3dlogo.png')} style={{ width: 150, height: 60, resizeMode: 'contain' }} />
                </View>

            {/* Quality Assurance Section */}
            <View style={styles.qualitySection}>
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

            {/* Footer Section */}
            {/* <View style={styles.footer}>
                <Text style={styles.footerTitle}>Connect With Us</Text>
                <View style={styles.socialContainer}>
                    {socialIcons.map((social, index) => (
                        <TouchableOpacity key={index} style={styles.socialIcon} onPress={() => Linking.openURL(socialUrls[social.name])}>
                            {renderIcon(social.name, social.library, wp(5), blackColor)}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>📞 7440075400</Text>
                    <Text style={styles.footerText}>📧 customercare@mytrustlab.com</Text>

                    <TouchableOpacity onPress={() => Linking.openURL('https://www.mytrustlab.com')}>
                        <Text style={[styles.footerText, { color: blackColor, }]}>
                            🌐 https://www.mytrustlab.com
                        </Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
        marginBottom:ms(60)
    },
    headerSection: {
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
        alignItems: 'center',
        // borderBottomLeftRadius: wp(6),
        // borderBottomRightRadius: wp(6),
    },
    brandName: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: hp(0.5),
    },
    tagline: {
        fontSize: wp(3.5),
        color: blackColor,
        textAlign: 'center',
    },
    statsGradient: {
        marginHorizontal: wp(4),
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: hp(2),
    },
    statsTitle: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: whiteColor,
        textAlign: 'center',
        marginBottom: ms(16),
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: ms(20),
    },
    statItem: {
        width: (width - wp(20) - ms(10)) / 2,
        backgroundColor: '#fff',
        borderRadius: ms(14),
        paddingVertical: ms(14),
        paddingHorizontal: ms(10),
        alignItems: 'center',
    },
    statNumber: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: ms(4),
        textAlign: 'center',
    },
    statDescription: {
        fontSize: ms(10),
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(14),
    },
    qualitySection: {
        backgroundColor: '#F1F5F9',
        marginHorizontal: wp(4),
        borderRadius: wp(4),
        padding: wp(4),
        alignItems: 'center',
        marginBottom: hp(2),
    },
    qualityIconContainer: {
        backgroundColor: '#e3f2fd',
        padding: wp(3),
        borderRadius: wp(6),
        marginBottom: hp(1.5),
    },
    qualityTitle: {
        fontSize: wp(3.5),
        color: '#333',
        textAlign: 'center',
        marginBottom: hp(0.3),
    },
    qualitySubtitle: {
        fontSize: wp(3.5),
        fontWeight: 'bold',
        color: '#1F2B7B',
        textAlign: 'center',
        marginBottom: hp(1.5),
    },
    certificationsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    certificationItem: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: wp(2.5),
        borderRadius: wp(2),
        flex: 0.45,
        minHeight: hp(8),
    },
    certificationImage: {
        width: wp(10),
        height: wp(10),
        marginBottom: hp(0.5),
    },
    certificationText: {
        fontSize: wp(3),
        color: '#1F2B7B',
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        backgroundColor: whiteColor,
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
        alignItems: 'center',
    },
    footerTitle: {
        fontSize: wp(4),
        fontWeight: 'bold',
        color: blackColor,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: hp(1),
    },
    socialIcon: {
        padding: wp(2.5),
        borderRadius: wp(5),
        marginHorizontal: wp(1),
    },
    footerInfo: {
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    footerText: {
        color: blackColor,
        fontSize: wp(3.5),
        marginBottom: hp(0.8),
        textAlign: 'center',
    },
    footerCopyright: {
        color: blackColor,
        fontSize: wp(3.5),
        textAlign: 'center',
        fontWeight:'bold',

    },
});

export default FooterComponent;
