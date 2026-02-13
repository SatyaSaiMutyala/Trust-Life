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

const WomenSpecificScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [pregnancyStatus, setPregnancyStatus] = useState('');
    const [menstrualHistory, setMenstrualHistory] = useState('');
    const [pcosStatus, setPcosStatus] = useState('');
    const [menopauseStatus, setMenopauseStatus] = useState('');

    const RadioButton = ({ label, selected, onSelect }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
            <View
                style={[
                    styles.radioOuter,
                    selected && styles.radioOuterActive,
                ]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Details Saved',
            subtitle: 'Successfully',
            delay: 2000,
            targetScreen: 'MedicalHistory',
            targetParams: {
                ...route.params,
                womenData: {
                    pregnancyStatus,
                    menstrualHistory,
                    pcosStatus,
                    menopauseStatus,
                },
                completedCategory: 'women',
            },
            useNavigate: true,
        });
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.14]}
            style={styles.flex1}>
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle} numberOfLines={1}>Women-Specific Details</Text>
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

                    {/* Pregnancy Status */}
                    <View style={styles.sectionTitleBar}>
                        <View style={[styles.titleBarAccent, { backgroundColor: '#DBEAFE' }]} />
                        <Text style={styles.sectionTitleText}>Pregnancy Status</Text>
                    </View>
                    <Text style={styles.questionText}>Are you currently pregnant?</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Yes" selected={pregnancyStatus === 'Yes'} onSelect={() => setPregnancyStatus('Yes')} />
                        <RadioButton label="No" selected={pregnancyStatus === 'No'} onSelect={() => setPregnancyStatus('No')} />
                        <RadioButton label="Planning Pregnancy" selected={pregnancyStatus === 'Planning Pregnancy'} onSelect={() => setPregnancyStatus('Planning Pregnancy')} />
                    </View>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Prefer not to say" selected={pregnancyStatus === 'Prefer not to say'} onSelect={() => setPregnancyStatus('Prefer not to say')} />
                    </View>

                    {/* Menstrual History */}
                    <View style={styles.sectionTitleBar}>
                        <View style={[styles.titleBarAccent, { backgroundColor: '#FEE2E2' }]} />
                        <Text style={styles.sectionTitleText}>Menstrual History</Text>
                    </View>
                    <Text style={styles.questionText}>Are your periods regular?</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Regular" selected={menstrualHistory === 'Regular'} onSelect={() => setMenstrualHistory('Regular')} />
                        <RadioButton label="Irregular" selected={menstrualHistory === 'Irregular'} onSelect={() => setMenstrualHistory('Irregular')} />
                        <RadioButton label="Missed periods" selected={menstrualHistory === 'Missed periods'} onSelect={() => setMenstrualHistory('Missed periods')} />
                    </View>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Heavy / Painful periods" selected={menstrualHistory === 'Heavy / Painful periods'} onSelect={() => setMenstrualHistory('Heavy / Painful periods')} />
                    </View>

                    {/* PCOS / Hormonal Issues */}
                    <View style={styles.sectionTitleBar}>
                        <View style={[styles.titleBarAccent, { backgroundColor: '#FFEDD5' }]} />
                        <Text style={styles.sectionTitleText}>PCOS / Hormonal Issues</Text>
                    </View>
                    <Text style={styles.questionText}>Have you ever been diagnosed with PCOS or hormonal imbalance?</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Yes" selected={pcosStatus === 'Yes'} onSelect={() => setPcosStatus('Yes')} />
                        <RadioButton label="No" selected={pcosStatus === 'No'} onSelect={() => setPcosStatus('No')} />
                        <RadioButton label="Not sure" selected={pcosStatus === 'Not sure'} onSelect={() => setPcosStatus('Not sure')} />
                    </View>

                    {/* Menopause Status */}
                    <View style={styles.sectionTitleBar}>
                        <View style={[styles.titleBarAccent, { backgroundColor: '#D9F99D' }]} />
                        <Text style={styles.sectionTitleText}>Menopause Status</Text>
                    </View>
                    <Text style={styles.questionText}>Have your periods stopped permanently (Menopause)?</Text>
                    <View style={styles.optionsRow}>
                        <RadioButton label="Yes" selected={menopauseStatus === 'Yes'} onSelect={() => setMenopauseStatus('Yes')} />
                        <RadioButton label="No" selected={menopauseStatus === 'No'} onSelect={() => setMenopauseStatus('No')} />
                        <RadioButton label="Not sure" selected={menopauseStatus === 'Not sure'} onSelect={() => setMenopauseStatus('Not sure')} />
                    </View>
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
        paddingTop: vs(12),
    },
    // Section Title Bar
    sectionTitleBar: {
        marginTop: vs(10),
        marginBottom: vs(12),
        overflow: 'hidden',
        borderRadius: ms(8),
    },
    titleBarAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        borderRadius: ms(8),
    },
    sectionTitleText: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: vs(10),
        paddingHorizontal: ms(14),
    },
    questionText: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(12),
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: ms(20),
        marginBottom: vs(4),
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    radioOuter: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        borderWidth: ms(1),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
        backgroundColor: '#F3F4F6',
    },
    radioOuterActive: {
        borderColor: primaryColor,
        backgroundColor: whiteColor,
    },
    radioInner: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: primaryColor,
    },
    radioLabel: {
        fontFamily: regular,
        fontSize: ms(13),
        color: blackColor,
    },
    bottomContainer: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
    },
});

export default WomenSpecificScreen;
