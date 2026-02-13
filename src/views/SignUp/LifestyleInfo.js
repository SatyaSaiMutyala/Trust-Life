import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Loader from '../../components/Loader';
import Icon, { Icons } from '../../components/Icons';
import SignUpStepper from '../../components/SignUpStepper';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    primaryColor,
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../../utils/primaryButton';

const CATEGORIES = [
    {
        id: 'habits',
        title: 'Habits',
        subtitle: 'Add Smoking Status, Alcohol Consumption,...',
        image: require('../../assets/img/habbit.png'),
    },
    {
        id: 'diet',
        title: 'Diet & Nutrition',
        subtitle: 'Add Diet Type, Daily Water Intake, Caffeine...',
        image: require('../../assets/img/dite.png'),
    },
    {
        id: 'activity',
        title: 'Physical Activity',
        subtitle: 'Add Exercise Frequency, Exercise Type, Av...',
        image: require('../../assets/img/physicalactivites.png'),
    },
    {
        id: 'work',
        title: 'Work & Stress',
        subtitle: 'Add Work Type , Stress Level',
        image: require('../../assets/img/workstress.png'),
    },
    {
        id: 'sleep',
        title: 'Sleep Pattern',
        subtitle: 'Add Average Sleep Duration , Sleep Quality',
        image: require('../../assets/img/sleep.png'),
    },
];

const LifestyleInfo = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const isEdit = route.params?.isEdit ?? false;
    const [completedCategories, setCompletedCategories] = useState([]);

    // Mark category as completed when returning from sub-screen
    React.useEffect(() => {
        if (route.params?.completedCategory) {
            setCompletedCategories((prev) => {
                const catId = route.params.completedCategory;
                if (!prev.includes(catId)) {
                    return [...prev, catId];
                }
                return prev;
            });
        }
    }, [route.params?.completedCategory]);

    const handleCategoryPress = (id) => {
        switch (id) {
            case 'habits':
                navigation.navigate('HabitsScreen', { ...route.params });
                break;
            case 'diet':
                navigation.navigate('DietNutritionScreen', { ...route.params });
                break;
            case 'activity':
                navigation.navigate('PhysicalActivityScreen', { ...route.params });
                break;
            case 'work':
                navigation.navigate('WorkStressScreen', { ...route.params });
                break;
            case 'sleep':
                navigation.navigate('SleepPatternScreen', { ...route.params });
                break;
            default:
                break;
        }
    };

    const handleNext = () => {
        navigation.navigate('MedicalHistory', {
            ...route.params,
            lifestyle: completedCategories,
        });
    };

    const handleSkip = () => {
        navigation.navigate('MedicalHistory', {
            ...route.params,
            lifestyle: [],
        });
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                <Loader visible={loading} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex1}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}>
                            <Icon
                                type={Icons.Ionicons}
                                name="arrow-back"
                                color={blackColor}
                                size={ms(20)}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Lifestyle Information</Text>
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stepper */}
                    {!isEdit && <SignUpStepper currentStep={1} />}

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {/* Title & Subtitle */}
                        <Text style={styles.title}>Lifestyle Information</Text>
                        <Text style={styles.subtitle}>
                            Share your habits and lifestyle to get accurate health insights and personalized care.
                        </Text>

                        {/* Category Cards */}
                        {CATEGORIES.map((cat) => {
                            const isDone = completedCategories.includes(cat.id);
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.card}
                                    activeOpacity={0.7}
                                    onPress={() => handleCategoryPress(cat.id)}>
                                    <Image source={cat.image} style={styles.cardImage} />
                                    <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>{cat.title}</Text>
                                        <Text style={styles.cardSubtitle} numberOfLines={1}>
                                            {cat.subtitle}
                                        </Text>
                                    </View>
                                    {isDone ? (
                                        <Icon
                                            type={Icons.MaterialCommunityIcons}
                                            name="check-circle"
                                            color={primaryColor}
                                            size={ms(22)}
                                        />
                                    ) : (
                                        <Icon
                                            type={Icons.Feather}
                                            name="plus-circle"
                                            color={blackColor}
                                            size={ms(20)}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {/* Next Button */}
                        <PrimaryButton title="Next" onPress={handleNext} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
        marginLeft: ms(12),
    },
    skipButton: {
        paddingHorizontal: ms(15),
        paddingVertical: vs(6),
        backgroundColor:whiteColor,
        borderRadius:ms(20)
    },
    skipText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(40),
    },
    // --- Title ---
    title: {
        fontFamily: bold,
        fontSize: ms(18),
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(8),
    },
    subtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(18),
        paddingHorizontal: ms(10),
        marginBottom: vs(20),
    },
    // --- Cards ---
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(14),
        marginBottom: vs(12),
    },
    cardImage: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(12),
        resizeMode: 'contain',
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: ms(12),
    },
    cardTitle: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(2),
    },
    cardSubtitle: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#9CA3AF',
    },
});

export default LifestyleInfo;
