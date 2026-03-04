import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import { bold, regular } from '../../config/Constants';
import { blackColor, globalGradient, globalGradient2, whiteColor } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

const CONTINUUM_DATA = [
    {
        id: 'sleep',
        title: 'Sleep Tracking',
        subtitle: 'Manage your Sleep through your app',
        image: require('../../assets/img/sleep-track.png'),
        route: 'SleepTrackingDashboard',
    },
    {
        id: 'exercise',
        title: 'Exercise Tracking',
        subtitle: 'Manage your Exercise through your app',
        image: require('../../assets/img/exercise-track.png'),
        route: 'ExerciseTrackingDashboard',
    },
    {
        id: 'food',
        title: 'Food Tracking',
        subtitle: 'Manage your Food through your app',
        image: require('../../assets/img/food-track.png'),
        route: 'FoodTrackingDashboard',
    },
    {
        id: 'medication',
        title: 'Medication Tracking',
        subtitle: 'Manage your Medication through your app',
        image: require('../../assets/img/medical-track.png'),
        route: 'MedicationTracking',
    },
];

const MONITORING_DATA = [
    { name: 'Heart Rate', image: require('../../assets/img/heartRate.png'), route: 'HeartRateLog' },
    { name: 'Blood Pressure', image: require('../../assets/img/blood_pressure.png'), route: 'BloodPressureLog' },
    { name: 'Glucose', image: require('../../assets/img/glucose.png'), route: 'GlucoseLog' },
    { name: 'Temperature', image: require('../../assets/img/temprature.png'), route: 'TemperatureLog' },
    { name: 'Menstrual Cycle', image: require('../../assets/img/menstrualcycle.png'), route: 'MenstrualCycleLog' },
    { name: 'Weight Management', image: require('../../assets/img/weightmanagement.png'), route: 'WeightManagementLog' },
    { name: 'Vaccination', image: require('../../assets/img/Vaccination.png'), route: 'VaccinationLog' },
    { name: 'Migraine', image: require('../../assets/img/migraine.png'), route: 'MigraineLog' },
    { name: 'Asthma', image: require('../../assets/img/astama.png'), route: 'AsthmaIntroScreen' },
    { name: 'Musculo Skeletal', image: require('../../assets/img/skeletal.png'), route: 'MusculoskeletalIntroScreen' },
];

const Tracking = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <LinearGradient
                colors={globalGradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 3 }}
                locations={[0, 0.08]}
                style={styles.fullGradient}
            >
                {/* Header */}
                <Text style={styles.headerTitle}>Tracking</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* My Health Continuum */}
                    <View style={styles.continuumSection}>
                        <Text style={styles.sectionHeading}>My Health Continuum</Text>
                        <View style={styles.continuumGrid}>
                            {CONTINUUM_DATA.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.continuumCard}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate(item.route)}
                                >
                                    <LinearGradient
                                        colors={['#E2FFFB7D', '#208A7B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        locations={[0, 18]}
                                        style={styles.continuumGradient}
                                    >
                                        <View style={styles.continuumImageWrap}>
                                            <Image source={item.image} style={styles.continuumImage} />
                                        </View>
                                        <View style={styles.continuumTextWrap}>
                                            <Text style={styles.continuumTitle}>{item.title}</Text>
                                            {/* <Text style={styles.continuumSub}>{item.subtitle}</Text> */}
                                        </View>
                                    </LinearGradient>

                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* My Health Monitoring */}
                    <View style={styles.monitoringSection}>
                        <Text style={styles.sectionHeading}>My Health Monitoring</Text>
                        <View style={styles.monitoringGrid}>
                            {MONITORING_DATA.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.monitoringCard}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate(item.route)}
                                >
                                    <View style={styles.monitoringImageWrap}>
                                        <Image source={item.image} style={styles.monitoringImage} />
                                    </View>
                                    <Text style={styles.monitoringText} numberOfLines={2}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullGradient: {
        flex: 1,
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
    },
    headerTitle: {
        fontSize: ms(22),
        fontFamily: bold,
        color: whiteColor,
        marginBottom: vs(20),
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: vs(80),
    },

    // Section Heading
    sectionHeading: {
        fontSize: ms(16),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
        marginBottom: ms(12),
    },

    // My Health Continuum
    continuumSection: {
        borderRadius: ms(15),
        paddingVertical: ms(15),
        paddingHorizontal: ms(10),
        marginBottom: vs(15),
    },
    continuumGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: ms(15),
        rowGap: vs(10),
    },
    continuumCard: {
        width: (width - ms(80)) / 2,
        borderTopLeftRadius: ms(50),
        borderTopRightRadius: ms(50),
        borderBottomRightRadius: ms(10),
        borderBottomLeftRadius: ms(10),
        overflow: 'hidden',
    },
    continuumGradient: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingTop: ms(10),
    },
    continuumImageWrap: {
        height: ms(130),
        alignItems: 'center',
        justifyContent: 'center',
    },
    continuumImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: ms(40),
        borderTopRightRadius: ms(40),
        borderBottomRightRadius: ms(5),
        borderBottomLeftRadius: ms(5),
    },
    continuumTextWrap: {
        paddingHorizontal: ms(5),
        paddingVertical: ms(8),
    },
    continuumTitle: {
        color: whiteColor,
        fontSize: ms(12),
        fontFamily: bold,
        textAlign: 'center',
    },
    continuumSub: {
        color: whiteColor,
        fontSize: ms(9),
        fontFamily: regular,
        marginTop: ms(2),
        textAlign: 'center',
    },

    // My Health Monitoring
    monitoringSection: {
        backgroundColor: whiteColor,
        borderRadius: ms(15),
        paddingVertical: ms(15),
        paddingHorizontal: ms(10),
        marginBottom: vs(10),
    },
    monitoringGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: ms(10),
    },
    monitoringCard: {
        width: (width - ms(80)) / 3,
        borderRadius: ms(16),
        paddingVertical: ms(10),
        paddingHorizontal: ms(8),
        alignItems: 'center',
    },
    monitoringImageWrap: {
        width: ms(65),
        height: ms(65),
        borderRadius: ms(16),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(5),
    },
    monitoringImage: {
        width: ms(45),
        height: ms(45),
        resizeMode: 'contain',
    },
    monitoringText: {
        fontSize: ms(11),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
    },
});

export default Tracking;
