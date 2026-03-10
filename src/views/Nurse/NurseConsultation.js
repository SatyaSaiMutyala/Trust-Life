import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { img_url } from '../../config/Constants';
import LinearGradient from 'react-native-linear-gradient';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import { blackColor, whiteColor, primaryColor } from '../../utils/globalColors';
import StandaloneBottomBar from '../../components/BottomNavBar/StandaloneBottomBar';
import NurseAppointmentsContent from './NurseAppointmentsContent';

const { width } = Dimensions.get('window');
const CARD_GAP = ms(12);
const CARD_WIDTH = (width - ms(15) * 2 - CARD_GAP) / 2;

const NURSE_TYPES = [
    { id: '1', name: 'Pediatric Nurse',  image: require('../../assets/img/nurse-one.png')   },
    { id: '2', name: 'ICU Nurse',        image: require('../../assets/img/nurse-two.png')   },
    { id: '3', name: 'Oncology Nurse',   image: require('../../assets/img/nurse-three.png') },
    { id: '4', name: 'Cardiac Nurse',    image: require('../../assets/img/nurse-four.png')  },
    { id: '5', name: 'Home Care Nurse',  image: require('../../assets/img/nurse-five.png')  },
    { id: '6', name: 'General Nurse',    image: require('../../assets/img/nurse-six.png')   },
];

const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
}).replace(/ /g, ' ');

const NurseConsultation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const flow = route.params?.flow;
    const [search] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [bottomTab, setBottomTab] = useState('doctors');

    useEffect(() => {
        AsyncStorage.getItem('profile_picture').then((saved) => {
            if (saved) setProfilePic(`${img_url}${saved}`);
        }).catch(() => {});
    }, []);

    const filtered = search.trim()
        ? NURSE_TYPES.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
        : NURSE_TYPES;

    const renderCard = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.card,
                index % 2 === 0 ? { marginRight: CARD_GAP / 2 } : { marginLeft: CARD_GAP / 2 },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('NurseSpecialistList', { specialtyName: item.name, flow: flow || 'nurse' })}
        >
            <View style={styles.cardImageWrap}>
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.cardPill}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Icon type={Icons.MaterialIcons} name="north-east" color={'#555'} size={ms(14)} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {bottomTab === 'doctors' ? (
                <LinearGradient
                    colors={[primaryColor, '#F1F5F9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 3 }}
                    locations={[0, 0.18]}
                    style={styles.gradientWrapper}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarCircle}>
                                {profilePic ? (
                                    <Image source={{ uri: profilePic }} style={styles.avatarImage} />
                                ) : (
                                    <Icon type={Icons.MaterialIcons} name="person" size={ms(22)} color={primaryColor} />
                                )}
                            </TouchableOpacity>
                            <View style={styles.headerTextWrap}>
                                <Text style={styles.headerName} numberOfLines={1}>
                                    {global.customer_name || 'User'}
                                </Text>
                                <Text style={styles.headerDate}>{todayDate}</Text>
                            </View>
                        </View>

                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
                                <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
                                <Icon type={Icons.Ionicons} name="headset-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity
                        style={styles.searchBar}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('DoctorSearchScreen')}
                    >
                        <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                        <Text style={styles.searchPlaceholder}>Search for Specialized Nurse</Text>
                        <Icon type={Icons.Ionicons} name="options-outline" color={primaryColor} size={ms(20)} />
                    </TouchableOpacity>

                    {/* Grid */}
                    <FlatList
                        data={filtered}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.grid}
                        ListHeaderComponent={
                            <Text style={styles.titleText}>
                                Find the Right Nurse for Your Care Needs
                            </Text>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyWrap}>
                                <Icon type={Icons.Ionicons} name="search-outline" color="#CCC" size={ms(40)} />
                                <Text style={styles.emptyText}>No nurses found</Text>
                            </View>
                        }
                    />
                </LinearGradient>
            ) : (
                <NurseAppointmentsContent />
            )}

            <StandaloneBottomBar
                activeTab={bottomTab}
                onTabChange={setBottomTab}
                tab2Label="Nurses"
                tab2Icon="medical-services"
                tab2IconType={Icons.MaterialIcons}
                tab2Screen="NurseScreen"
            />
        </SafeAreaView>
    );
};

export default NurseConsultation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    gradientWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        paddingTop: ms(50),
        paddingBottom: ms(12),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
        flex: 1,
    },
    avatarCircle: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(21),
    },
    headerTextWrap: {
        flex: 1,
    },
    headerName: {
        fontSize: ms(15),
        fontWeight: 'bold',
        color: whiteColor,
    },
    headerDate: {
        fontSize: ms(11),
        color: 'rgba(255,255,255,0.8)',
        marginTop: vs(2),
    },
    headerRight: {
        flexDirection: 'row',
        gap: ms(8),
    },
    iconBtn: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(25),
        marginHorizontal: ms(15),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        gap: ms(8),
        marginBottom: vs(14),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: ms(13),
        color: '#AAAAAA',
    },
    titleText: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(22),
        marginBottom: vs(14),
        paddingHorizontal: ms(20),
    },
    grid: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        marginBottom: ms(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    cardImageWrap: {
        padding: ms(6),
    },
    cardImage: {
        width: '100%',
        height: ms(90),
        borderRadius: ms(12),
        backgroundColor: '#F1F5F9',
    },
    cardFooter: {
        alignItems: 'center',
        paddingVertical: vs(10),
    },
    cardPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
        backgroundColor: '#EFEFEF',
        borderRadius: ms(20),
        paddingHorizontal: ms(12),
        paddingVertical: vs(5),
    },
    cardName: {
        fontSize: ms(12),
        fontWeight: '600',
        color: blackColor,
    },
    emptyWrap: {
        alignItems: 'center',
        paddingTop: vs(60),
        gap: vs(10),
    },
    emptyText: {
        fontSize: ms(14),
        color: '#999',
    },
});
