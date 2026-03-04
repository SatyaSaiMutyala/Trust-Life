import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2, StatusBar3 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { bold, regular } from '../../config/Constants';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQ_DATA = [
    {
        question: 'How do I book a lab test?',
        answer: 'Go to the Home screen and tap on "Book Lab Test". Select your preferred test, choose a date and time, and confirm your booking. You can also search for specific tests using the search bar.',
    },
    {
        question: 'How can I track my health progress?',
        answer: 'Navigate to the Tracking tab to monitor your health metrics like heart rate, blood pressure, glucose levels, and more. You can also view your Health Progression Story from the Progress section.',
    },
    {
        question: 'How do I add a family member?',
        answer: 'Go to More > Add Members. Fill in the family member\'s details and save. Once added, you can book tests and manage health records for your family members.',
    },
    {
        question: 'How do I use my wallet balance?',
        answer: 'Your wallet balance is automatically applied during test bookings. You can view your current balance on the More screen. Wallet credits are earned through referrals and promotional offers.',
    },
    {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at support@trustlife.com or call us at 1800-XXX-XXXX. Our support team is available Monday to Saturday, 9 AM to 6 PM.',
    },
];

const AccordionItem = ({ item, isOpen, onToggle, isLast }) => (
    <View style={[styles.faqItem, !isLast && styles.faqItemBorder]}>
        <TouchableOpacity
            style={styles.faqQuestion}
            onPress={onToggle}
            activeOpacity={0.6}
        >
            <Text style={styles.faqQuestionText}>{item.question}</Text>
            <Icon
                type={Icons.Ionicons}
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={ms(18)}
                color={primaryColor}
            />
        </TouchableOpacity>
        {isOpen && (
            <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{item.answer}</Text>
            </View>
        )}
    </View>
);

const SupportScreen = () => {
    const navigation = useNavigation();
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar3 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support</Text>
                <View style={{ width: ms(36) }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.subtitle}>Frequently Asked Questions</Text>

                <View style={styles.faqCard}>
                    {FAQ_DATA.map((item, index) => (
                        <AccordionItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                            isLast={index === FAQ_DATA.length - 1}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SupportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: ms(16),
    },
    backBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: ms(18),
        fontFamily: bold,
        color: blackColor,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(10),
        paddingBottom: vs(40),
    },
    subtitle: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#6B7280',
        marginBottom: vs(15),
    },
    faqCard: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        paddingHorizontal: ms(16),
    },
    faqItem: {
        paddingVertical: vs(14),
    },
    faqItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    faqQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQuestionText: {
        flex: 1,
        fontSize: ms(14),
        fontFamily: bold,
        color: blackColor,
        marginRight: ms(10),
    },
    faqAnswer: {
        marginTop: vs(10),
        paddingTop: vs(10),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    faqAnswerText: {
        fontSize: ms(13),
        fontFamily: regular,
        color: '#6B7280',
        lineHeight: ms(20),
    },
});
