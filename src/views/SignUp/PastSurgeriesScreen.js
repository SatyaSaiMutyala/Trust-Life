import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const emptySurgery = () => ({
    id: Date.now() + Math.random(),
    name: '',
    date: '',
    reason: '',
});

const PastSurgeriesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [surgeries, setSurgeries] = useState([emptySurgery()]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeDateIndex, setActiveDateIndex] = useState(0);
    const [defaultDate, setDefaultDate] = useState(new Date());

    const addSurgery = () => {
        setSurgeries((prev) => [...prev, emptySurgery()]);
    };

    const removeSurgery = (index) => {
        setSurgeries((prev) => prev.filter((_, i) => i !== index));
    };

    const updateSurgery = (index, field, value) => {
        setSurgeries((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        );
    };

    const openDatePicker = (index) => {
        setActiveDateIndex(index);
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDefaultDate(selectedDate);
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            updateSurgery(activeDateIndex, 'date', `${day}/${month}/${year}`);
        }
    };

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Surgeries Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                surgeriesData: surgeries,
                completedCategory: 'surgeries',
            },
            useNavigate: true,
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle} numberOfLines={1}>Past Surgeries & Hospitalizations</Text>
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
                    {/* Surgery Cards */}
                    {surgeries.map((surgery, index) => (
                        <View key={surgery.id} style={styles.surgeryCard}>
                            {/* Card Header */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardHeaderTitle}>Surgeries</Text>
                                {index === 0 ? (
                                    <TouchableOpacity onPress={addSurgery}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="plus-circle"
                                            color={primaryColor}
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => removeSurgery(index)}>
                                        <Icon
                                            type={Icons.Feather}
                                            name="minus-circle"
                                            color="#EF4444"
                                            size={ms(22)}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Surgery Name */}
                            <InputField
                                label="Surgery Name"
                                placeholder="Enter Surgery Name"
                                value={surgery.name}
                                onChangeText={(text) => updateSurgery(index, 'name', text)}
                                containerStyle={styles.whiteInput}
                            />

                            {/* Surgery Date */}
                            <InputField
                                label="Surgery Date"
                                placeholder="Select Surgery Date"
                                value={surgery.date}
                                onPressIn={() => openDatePicker(index)}
                                iconType={Icons.Feather}
                                iconName="calendar"
                                containerStyle={styles.whiteInput}
                            />

                            {/* Reason for Surgery */}
                            <InputField
                                label="Reason for Surgery"
                                placeholder="Write a Reason for Surgery"
                                value={surgery.reason}
                                onChangeText={(text) => updateSurgery(index, 'reason', text)}
                                containerStyle={styles.whiteInput}
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomContainer}>
                    <PrimaryButton title="Save" onPress={handleSave} />
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                    <DateTimePicker
                        value={defaultDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        maximumDate={new Date()}
                        onChange={onDateChange}
                    />
                )}
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
    surgeryCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: ms(14),
        padding: ms(16),
        marginBottom: vs(16),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
    },
    cardHeaderTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        color: blackColor,
    },
    whiteInput: {
        backgroundColor: whiteColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default PastSurgeriesScreen;
