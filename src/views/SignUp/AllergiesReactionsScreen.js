import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import {
    blackColor,
    primaryColor,
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';
import PrimaryButton from '../../utils/primaryButton';
import InputField from '../../utils/InputField';

const emptyEntry = () => ({
    id: Date.now() + Math.random(),
    name: '',
});

const AllergiesReactionsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [medicineAllergies, setMedicineAllergies] = useState([emptyEntry()]);
    const [foodAllergies, setFoodAllergies] = useState([emptyEntry()]);
    const [environmentalAllergies, setEnvironmentalAllergies] = useState([emptyEntry()]);
    const [reactionTypes, setReactionTypes] = useState([emptyEntry()]);

    const addEntry = (setter) => {
        setter((prev) => [...prev, emptyEntry()]);
    };

    const removeEntry = (setter, index) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const updateEntry = (setter, index, value) => {
        setter((prev) =>
            prev.map((item, i) => (i === index ? { ...item, name: value } : item)),
        );
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Allergies Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                allergiesData: {
                    medicineAllergies,
                    foodAllergies,
                    environmentalAllergies,
                    reactionTypes,
                },
                completedCategory: 'allergies',
            },
            useNavigate: true,
        });
    };

    const renderSection = (title, data, setter, placeholder) => (
        <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>{title}</Text>
                <TouchableOpacity onPress={() => addEntry(setter)}>
                    <Icon
                        type={Icons.Feather}
                        name="plus-circle"
                        color={primaryColor}
                        size={ms(22)}
                    />
                </TouchableOpacity>
            </View>
            {data.map((item, index) => (
                <View key={item.id} style={styles.entryRow}>
                    <View style={styles.inputWrapper}>
                        <InputField
                            label="Name"
                            placeholder={placeholder}
                            value={item.name}
                            onChangeText={(text) => updateEntry(setter, index, text)}
                            containerStyle={styles.whiteInput}
                        />
                    </View>
                    {data.length > 1 && (
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeEntry(setter, index)}>
                            <Icon
                                type={Icons.Feather}
                                name="minus-circle"
                                color="#EF4444"
                                size={ms(20)}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.18]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle} numberOfLines={1}>Allergies & Reactions</Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.closeButton}>
                        <Icon
                            type={Icons.Feather}
                            name="x"
                            color={blackColor}
                            size={ms(18)}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    {renderSection('Medicine Allergies', medicineAllergies, setMedicineAllergies, 'Enter Name')}
                    {renderSection('Food Allergies', foodAllergies, setFoodAllergies, 'Enter Name')}
                    {renderSection('Environmental Allergies', environmentalAllergies, setEnvironmentalAllergies, 'Enter Name')}
                    {renderSection('Reaction Type', reactionTypes, setReactionTypes, 'Enter Name')}
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Save" onPress={handleSave} />
                </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(12),
    },
    headerTitle: {
        flex: 1,
        fontFamily: bold,
        fontSize: ms(20),
        color: whiteColor,
        marginRight: ms(12),
    },
    closeButton: {
        width: ms(30),
        height: ms(30),
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
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
        paddingTop: vs(16),
    },
    sectionCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(16),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(8),
    },
    cardHeaderTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
    },
    removeButton: {
        marginLeft: ms(10),
        marginBottom: vs(10),
    },
    whiteInput: {
        backgroundColor: whiteColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default AllergiesReactionsScreen;
