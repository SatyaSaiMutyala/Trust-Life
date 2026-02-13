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
        id: 'conditions',
        title: 'Existing Medical Conditions',
    },
    {
        id: 'medications',
        title: 'Current Medications',
    },
    {
        id: 'surgeries',
        title: 'Past Surgeries & Hospitalizations',
    },
    {
        id: 'allergies',
        title: 'Allergies & Reactions',
    },
    {
        id: 'women',
        title: 'Women-Specific Details',
    },
    {
        id: 'vaccination',
        title: 'Vaccination Details',
    },
];

const MedicalHistory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);

    const isEdit = route.params?.isEdit ?? false;
    const [completedCategories, setCompletedCategories] = useState([]);

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
            case 'conditions':
                navigation.navigate('ExistingConditionsScreen', { ...route.params });
                break;
            case 'medications':
                navigation.navigate('CurrentMedicationsScreen', { ...route.params });
                break;
            case 'surgeries':
                navigation.navigate('PastSurgeriesScreen', { ...route.params });
                break;
            case 'allergies':
                navigation.navigate('AllergiesReactionsScreen', { ...route.params });
                break;
            case 'women':
                navigation.navigate('WomenSpecificScreen', { ...route.params });
                break;
            case 'vaccination':
                navigation.navigate('VaccinationDetailsScreen', { ...route.params });
                break;
            default:
                break;
        }
    };

    const handleNext = () => {
        navigation.navigate('AddFamilyScreen', {
            ...route.params,
            medicalHistory: completedCategories,
        });
    };

    const handleSkip = () => {
        navigation.navigate('AddFamilyScreen', {
            ...route.params,
            medicalHistory: [],
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
                        <Text style={styles.headerTitle}>Medical History</Text>
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stepper */}
                    {!isEdit && <SignUpStepper currentStep={2} />}

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {/* Title & Subtitle */}
                        <Text style={styles.title}>Medical History</Text>
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
                                    <Text style={styles.cardTitle}>{cat.title}</Text>
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
                                            name="chevron-right"
                                            color="#9CA3AF"
                                            size={ms(20)}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Next Button */}
                    <View style={styles.bottomContainer}>
                        <PrimaryButton title="Next" onPress={handleNext} />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
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
        backgroundColor: whiteColor,
        borderRadius: ms(20),
    },
    skipText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
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
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
        paddingVertical: vs(18),
        marginBottom: vs(12),
    },
    cardTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default MedicalHistory;
