import React from 'react';
import {
    SafeAreaView, StyleSheet, View, Text,
    ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { bold, regular } from '../../config/Constants';

const ORGANS = [
    {
        label: 'Heart', icon: 'heart', iconType: Icons.Ionicons,
        iconColor: '#EF4444', bgColor: '#FEE2E2', status: 'Watch', statusType: 'moderate',
        description: 'Pumps blood throughout the body',
    },
    {
        label: 'Kidney', icon: 'water', iconType: Icons.Ionicons,
        iconColor: '#DC2626', bgColor: '#FEE2E2', status: 'Stable', statusType: 'strong',
        description: 'Filters waste and regulates fluid balance',
    },
    {
        label: 'Liver', icon: 'flask', iconType: Icons.Ionicons,
        iconColor: '#78350F', bgColor: '#FEF3C7', status: 'Stable', statusType: 'strong',
        description: 'Processes nutrients and detoxifies blood',
    },
    {
        label: 'Pancreas', icon: 'stomach', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#10B981', bgColor: '#DCFCE7', status: 'Watch', statusType: 'moderate',
        description: 'Produces insulin and digestive enzymes',
    },
    {
        label: 'Lungs', icon: 'lungs', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#0EA5E9', bgColor: '#E0F2FE', status: 'Efficient', statusType: 'strong',
        description: 'Handles breathing and oxygen exchange',
    },
    {
        label: 'Brain', icon: 'brain', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#EC4899', bgColor: '#FCE7F3', status: 'Active', statusType: 'strong',
        description: 'Controls body functions and cognition',
    },
    {
        label: 'Eye', icon: 'eye-outline', iconType: Icons.Ionicons,
        iconColor: '#6366F1', bgColor: '#EDE9FE', status: 'Normal', statusType: 'strong',
        description: 'Provides vision and light perception',
    },
    {
        label: 'Skin', icon: 'body-outline', iconType: Icons.Ionicons,
        iconColor: '#F59E0B', bgColor: '#FEF3C7', status: 'Healthy', statusType: 'strong',
        description: 'Protects body and regulates temperature',
    },
    {
        label: 'Gut', icon: 'nutrition-outline', iconType: Icons.Ionicons,
        iconColor: '#F97316', bgColor: '#FFEDD5', status: 'Balanced', statusType: 'strong',
        description: 'Digests food and absorbs nutrients',
    },
    {
        label: 'Muscle', icon: 'barbell-outline', iconType: Icons.Ionicons,
        iconColor: '#D946EF', bgColor: '#FAE8FF', status: 'Strong', statusType: 'strong',
        description: 'Supports movement and posture',
    },
    {
        label: 'Musculo Skeletal', icon: 'bone', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#A16207', bgColor: '#FEF3C7', status: 'Stable', statusType: 'strong',
        description: 'Bones and joints supporting body structure',
    },
    {
        label: 'Vascular System', icon: 'water-outline', iconType: Icons.Ionicons,
        iconColor: '#DC2626', bgColor: '#FEE2E2', status: 'Normal', statusType: 'strong',
        description: 'Blood vessels circulating blood throughout body',
    },
    {
        label: 'Reproductive', icon: 'human-male-female', iconType: Icons.MaterialCommunityIcons,
        iconColor: '#8B5CF6', bgColor: '#EDE9FE', status: 'Normal', statusType: 'strong',
        description: 'Reproductive organs and hormonal health',
    },
];

const OrgansHealthScreen = () => {
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
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Organs Health</Text>
                        <Text style={styles.headerSubtitle}>Monitor all your organ health status</Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {ORGANS.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('AnalysisCheck')}
                        >
                            <View style={styles.cardRow}>
                                <View style={[styles.iconWrap, { backgroundColor: item.bgColor }]}>
                                    <Icon type={item.iconType} name={item.icon} size={ms(22)} color={item.iconColor} />
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <Text style={styles.cardLabel}>{item.label}</Text>
                                    <Text style={styles.cardDesc}>{item.description}</Text>
                                </View>
                                <View style={item.statusType === 'strong' ? styles.statusBadgeStrong : styles.statusBadgeModerate}>
                                    <Text style={item.statusType === 'strong' ? styles.statusTextStrong : styles.statusTextModerate}>
                                        {item.status}
                                    </Text>
                                </View>
                                <Icon type={Icons.Ionicons} name="chevron-forward" size={ms(18)} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={{ height: vs(40) }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },
    fullGradient: { flex: 1, paddingHorizontal: ms(14), paddingTop: ms(50) },

    header: {
        flexDirection: 'row', alignItems: 'center', marginBottom: ms(16),
    },
    backBtn: {
        width: ms(35), height: ms(35), borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTextWrap: { marginLeft: ms(10), flex: 1 },
    headerTitle: { fontFamily: bold, fontSize: ms(18), color: whiteColor },
    headerSubtitle: { fontFamily: regular, fontSize: ms(11), color: 'rgba(255,255,255,0.8)', marginTop: vs(2) },

    scrollContent: { paddingBottom: vs(40) },

    card: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(16), marginBottom: vs(10),
    },
    cardRow: {
        flexDirection: 'row', alignItems: 'center',
    },
    iconWrap: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        justifyContent: 'center', alignItems: 'center',
    },
    cardTextWrap: { flex: 1, marginLeft: ms(12) },
    cardLabel: { fontFamily: bold, fontSize: ms(14), color: blackColor },
    cardDesc: { fontFamily: regular, fontSize: ms(11), color: '#6B7280', marginTop: vs(2) },
    statusBadgeStrong: {
        backgroundColor: '#E8F5E9', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(4), marginRight: ms(6),
    },
    statusTextStrong: { fontFamily: bold, fontSize: ms(11), color: '#2E7D32' },
    statusBadgeModerate: {
        backgroundColor: '#FFF4E5', borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(4), marginRight: ms(6),
    },
    statusTextModerate: { fontFamily: bold, fontSize: ms(11), color: '#E07B00' },
});

export default OrgansHealthScreen;
