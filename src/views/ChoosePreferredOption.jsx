import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, StatusBar2 } from '../components/StatusBar';
import { blackColor, primaryColor, whiteColor } from '../utils/globalColors';
import { s, vs, ms } from 'react-native-size-matters';

const TOGGLE_ACTIVE = primaryColor;

const sectionsData = [
    {
        id: 1,
        title: 'Vital Organs Care Bundles',
        description: 'This package covers all vital organs, including the heart, liver, kidneys.',
        items: [
            { id: 1, organ: 'Heart', save: '₹1200', title: '3X Quarterly', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
            { id: 2, organ: 'Thyroid', save: '₹1200', title: '3X Quarterly', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
        ],
    },
    {
        id: 2,
        title: 'Health Packages',
        description: 'This package covers all vital organs, including the heart, liver, kidneys.',
        items: [
            { id: 1, organ: 'Heart', save: '₹1200', title: 'Basic Health care', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
            { id: 2, organ: 'Thyroid', save: '₹1200', title: 'Basic Health care', desc: 'Lipid Profile, ECG, 2D Echo & Troponin tests together help assess heart health', image: require('../assets/img/cardImg.png') },
        ],
    },
    {
        id: 3,
        title: 'Individual Tests',
        description: 'This package covers all vital organs, including the heart, liver, kidneys,including the heart,',
        items: [],
    },
];

const ChoosePreferredOption = () => {
    const navigation = useNavigation();
    const [sectionToggles, setSectionToggles] = useState({});
    const [itemToggles, setItemToggles] = useState({});
    const [expandedSections, setExpandedSections] = useState({ 1: true, 2: true, 3: true });

    const toggleSection = (sectionId) => {
        const newValue = !sectionToggles[sectionId];
        setSectionToggles(prev => ({ ...prev, [sectionId]: newValue }));

        // Toggle all child items along with the section
        const section = sectionsData.find(s => s.id === sectionId);
        if (section && section.items.length > 0) {
            const updatedItems = { ...itemToggles };
            section.items.forEach(item => {
                updatedItems[`${sectionId}-${item.id}`] = newValue;
            });
            setItemToggles(updatedItems);
        }
    };

    const toggleItem = (sectionId, itemId) => {
        const key = `${sectionId}-${itemId}`;
        setItemToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleExpand = (sectionId) => {
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Choose Preferred Option</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon type={Icons.Ionicons} name="close" color={blackColor} size={ms(20)} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {sectionsData.map((section) => {
                    const isExpanded = expandedSections[section.id];
                    const isSectionOn = sectionToggles[section.id] || false;

                    return (
                        <View key={section.id} style={styles.sectionCard}>
                            {/* Section Header */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <TouchableOpacity
                                    style={[styles.checkbox, isSectionOn && styles.checkboxActive]}
                                    onPress={() => toggleSection(section.id)}
                                    activeOpacity={0.7}
                                >
                                    {isSectionOn && (
                                        <Icon type={Icons.Ionicons} name="checkmark" color={whiteColor} size={ms(14)} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Description + View less/more */}
                            <Text style={styles.sectionDesc}>
                                {section.description}
                                {'  '}
                                <Text
                                    style={styles.viewToggle}
                                    onPress={() => toggleExpand(section.id)}
                                >
                                    {isExpanded ? 'View less' : 'View more'}
                                    {' '}
                                </Text>
                                <Icon
                                    type={Icons.Ionicons}
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    color={TOGGLE_ACTIVE}
                                    size={ms(12)}
                                />
                            </Text>

                            {/* Sub Items */}
                            {isExpanded && section.items.length > 0 && (
                                <View style={styles.itemsContainer}>
                                    {section.items.map((item) => {
                                        const itemKey = `${section.id}-${item.id}`;
                                        const isItemOn = itemToggles[itemKey] || false;

                                        return (
                                            <View key={item.id} style={styles.itemCard}>
                                                <View style={styles.itemRow}>
                                                    {/* Organ Image */}
                                                    <View style={styles.organCol}>
                                                        <View style={styles.organImageBg}>
                                                            <Image
                                                                source={item.image}
                                                                style={styles.organImage}
                                                            />
                                                        </View>
                                                        <Text style={styles.organName}>{item.organ}</Text>
                                                    </View>

                                                    {/* Info */}
                                                    <View style={styles.itemInfo}>
                                                        <Text style={styles.saveText}>Save {item.save}</Text>
                                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                                        <Text style={styles.itemDesc}>{item.desc}</Text>
                                                    </View>

                                                    {/* Toggle */}
                                                    <Switch
                                                        value={isItemOn}
                                                        onValueChange={() => toggleItem(section.id, item.id)}
                                                        trackColor={{ false: '#D1D5DB', true: TOGGLE_ACTIVE }}
                                                        thumbColor={whiteColor}
                                                        style={styles.itemSwitch}
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Bottom Continue */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.continueButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('SuccessScreen', {
                        title: 'Subscription',
                        subtitle: 'Activated Successfully!',
                        targetScreen: 'Home',
                        delay: 2000,
                    })}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(15),
    },
    headerTitle: {
        fontSize: ms(18),
        fontWeight: 'bold',
        color: blackColor,
    },
    closeButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        borderWidth: ms(1),
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },

    // Section Card
    sectionCard: {
        borderRadius: ms(16),
        padding: ms(16),
        marginBottom: vs(20),
        backgroundColor:'#F8FAFC'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    sectionTitle: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: blackColor,
        flex: 1,
    },
    sectionDesc: {
        fontSize: ms(12),
        color: '#666',
        lineHeight: ms(18),
    },
    viewToggle: {
        fontSize: ms(12),
        color: TOGGLE_ACTIVE,
        fontWeight: '600',
    },

    // Items
    itemsContainer: {
        marginTop: vs(12),
    },
    itemCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        padding: ms(14),
        marginBottom: vs(10),
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    organCol: {
        alignItems: 'center',
        marginRight: ms(12),
        width: ms(55),
    },
    organImageBg: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    organImage: {
        width: ms(35),
        height: ms(35),
        resizeMode: 'contain',
    },
    organName: {
        fontSize: ms(10),
        color: blackColor,
        fontWeight: '600',
        marginTop: vs(4),
        textAlign: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    saveText: {
        fontSize: ms(11),
        color: primaryColor,
        fontWeight: 'bold',
    },
    itemTitle: {
        fontSize: ms(14),
        fontWeight: 'bold',
        color: blackColor,
        marginTop: vs(2),
    },
    itemDesc: {
        fontSize: ms(11),
        color: '#666',
        lineHeight: ms(16),
        marginTop: vs(3),
    },
    itemSwitch: {
        marginLeft: ms(8),
    },

    // Checkbox
    checkbox: {
        width: ms(24),
        height: ms(24),
        borderRadius: ms(6),
        borderWidth: ms(1.5),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: TOGGLE_ACTIVE,
        borderColor: TOGGLE_ACTIVE,
    },

    // Bottom
    bottomSection: {
        paddingHorizontal: ms(20),
        paddingBottom: vs(20),
        paddingTop: vs(10),
    },
    continueButton: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        paddingVertical: vs(14),
        alignItems: 'center',
    },
    continueText: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: whiteColor,
    },
});

export default ChoosePreferredOption;
