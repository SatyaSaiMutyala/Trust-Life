import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

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

const HomeHeader = () => {

    const navigation = useNavigation();

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

    return (
        <View style={styles.container}>
            {/* Header Title */}
            <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Quick Actions</Text>
                <Text style={styles.subtitleText}>Choose your preferred option</Text>
            </View>

            {/* Cards Container */}
            <View style={styles.cardsContainer}>

                {/* Book a Test via Call Card */}
                <TouchableOpacity
                    style={styles.cardWrapper}
                    onPress={handleBookCall}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#FF6B6B', '#FF8E53']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <Icon name="phone" size={wp(5)} color="#FF6B6B" />
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>Book a Test</Text>
                        <Text style={styles.cardSubtitle}>via Call</Text>
                        <Text style={styles.cardDescription}>
                            Speak with our experts{'\n'}for personalized guidance
                        </Text>

                        <View style={styles.actionContainer}>
                            <Icon name="arrow-forward" size={wp(4)} color="#fff" />
                        </View>

                        {/* Floating Elements for Visual Appeal */}
                        <View style={[styles.floatingElement, styles.floatingElement1]} />
                        <View style={[styles.floatingElement, styles.floatingElement2]} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Upload Prescription Card */}
                <TouchableOpacity
                    style={styles.cardWrapper}
                    onPress={handleUploadPrescription}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#4ECDC4', '#44A08D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <View style={styles.iconContainer}>
                            <View style={styles.iconCircle}>
                                <FontAwesome name="file-text-o" size={wp(5)} color="#4ECDC4" />
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>Upload</Text>
                        <Text style={styles.cardSubtitle}>Prescription</Text>
                        <Text style={styles.cardDescription}>
                            Upload your prescription{'\n'}for quick test booking 
                        </Text>
                        <View style={styles.actionContainer}>
                            <Icon name="arrow-forward" size={wp(4)} color="#fff" />
                        </View>
                        {/* Floating Elements for Visual Appeal */}
                        <View style={[styles.floatingElement, styles.floatingElement1]} />
                        <View style={[styles.floatingElement, styles.floatingElement2]} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: wp(5),
        paddingVertical: hp(1.5),
    },
    headerTextContainer: {
        marginBottom: hp(1.5),
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: wp(5),
        fontWeight: 'bold',
        color: '#1F2B7B',
        marginBottom: hp(0.5),
    },
    subtitleText: {
        fontSize: wp(2.5),
        color: '#666',
        textAlign: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(3),
    },
    cardWrapper: {
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    card: {
        borderRadius: wp(6),
        padding: wp(4),
        minHeight: hp(16),
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'space-between',
        height: hp(26),
    },
    iconContainer: {
        alignItems: 'flex-start',
        marginBottom: hp(0.3),
    },
    iconCircle: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: wp(2.5),
        borderRadius: wp(6),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: hp(0.2),
    },
    cardSubtitle: {
        fontSize: wp(3.8),
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: hp(0.5),
    },
    cardDescription: {
        fontSize: wp(2.8),
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: wp(3.8),
        marginBottom: hp(1),
    },
    actionContainer: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: wp(2.5),
        borderRadius: wp(6),
    },
    floatingElement: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: wp(10),
    },
    floatingElement1: {
        width: wp(10),
        height: wp(10),
        top: -wp(5),
        right: -wp(5),
    },
    floatingElement2: {
        width: wp(6),
        height: wp(6),
        bottom: -wp(3),
        left: -wp(3),
    },
});

export default HomeHeader;