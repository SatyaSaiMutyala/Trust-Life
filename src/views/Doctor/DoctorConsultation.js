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
import DoctorAppointmentsContent from './DoctorAppointmentsContent';

const { width } = Dimensions.get('window');
const CARD_GAP = ms(12);
const CARD_WIDTH = (width - ms(15) * 2 - CARD_GAP) / 2;

const ORGANS = [
    { id: '1',  name: 'Heart',        image: require('../../assets/img/human-heart.png'),        color: '#FFEDED' },
    { id: '2',  name: 'Brain',        image: require('../../assets/img/human-brain.png'),        color: '#EDE9FF' },
    { id: '3',  name: 'Kidneys',      image: require('../../assets/img/human-kidneys.png'),      color: '#E9F3FF' },
    { id: '4',  name: 'Liver',        image: require('../../assets/img/human-liver.png'),        color: '#FFF4E6' },
    { id: '5',  name: 'Lungs',        image: require('../../assets/img/human-lungs.png'),        color: '#E6F7FF' },
    { id: '6',  name: 'Pancreas',     image: require('../../assets/img/human-pancreas.png'),     color: '#FFF0E6' },
    { id: '7',  name: 'Gut',          image: require('../../assets/img/human-gut.png'),          color: '#F0FFF4' },
    { id: '8',  name: 'Skin',         image: require('../../assets/img/human-skin.png'),         color: '#FFF8E6' },
    { id: '9',  name: 'Eyes',         image: require('../../assets/img/human-eye.png'),          color: '#F3EDFF' },
    { id: '10', name: 'Muscle',       image: require('../../assets/img/human-muscle.png'),       color: '#EDFFED' },
    { id: '11', name: 'Thyroid',      image: require('../../assets/img/human-thyroid.png'),      color: '#FFF3ED' },
    { id: '12', name: 'Thymus',       image: require('../../assets/img/human-thymus.png'),       color: '#EDFAFF' },
    { id: '13', name: 'Vascular',     image: require('../../assets/img/human-vascular.png'),     color: '#FFEDEE' },
    { id: '14', name: 'Reproductive', image: require('../../assets/img/human-reproductive.png'), color: '#FFEDFA' },
];

const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
}).replace(/ /g, ' ');


const DoctorConsultation = () => {
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
        ? ORGANS.filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase()),
          )
        : ORGANS;

    const renderCard = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.card,
                index % 2 === 0 ? { marginRight: CARD_GAP / 2 } : { marginLeft: CARD_GAP / 2 },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DoctorSpecialistList', { specialtyName: item.name, flow })}
        >
            <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
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
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {flow && (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: ms(8), width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                                </TouchableOpacity>
                            )}
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
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <Icon type={Icons.Ionicons} name="notifications-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <Icon type={Icons.Ionicons} name="headset-outline" size={ms(20)} color={blackColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── Search Bar ── */}
                    <TouchableOpacity
                        style={styles.searchBar}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('DoctorSearchScreen')}
                    >
                        <Icon type={Icons.Feather} name="search" color="#999" size={ms(18)} />
                        <Text style={styles.searchPlaceholder}>Search by organ or specialist</Text>
                        <Icon type={Icons.Ionicons} name="options-outline" color={primaryColor} size={ms(20)} />
                    </TouchableOpacity>

                    {/* ── Grid ── */}
                    <FlatList
                        data={filtered}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.grid}
                        ListHeaderComponent={
                            <Text style={styles.titleText}>
                                Find specialists based on the organ
                            </Text>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyWrap}>
                                <Icon type={Icons.Ionicons} name="search-outline" color="#CCC" size={ms(40)} />
                                <Text style={styles.emptyText}>No organs found</Text>
                            </View>
                        }
                    />
                </LinearGradient>
            ) : (
                <DoctorAppointmentsContent />
            )}

            {!flow && <StandaloneBottomBar activeTab={bottomTab} onTabChange={setBottomTab} />}
        </SafeAreaView>
    );
};

export default DoctorConsultation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    gradientWrapper: {
        flex: 1,
    },

    // ── Header ──
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

    // ── Search ──
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
    searchInput: {
        flex: 1,
        fontSize: ms(13),
        color: blackColor,
        padding: 0,
    },

    // ── Title ──
    titleText: {
        fontSize: ms(16),
        fontWeight: '700',
        color: blackColor,
        textAlign: 'center',
        lineHeight: ms(22),
        marginBottom: vs(14),
        paddingHorizontal: ms(20),
    },

    // ── Grid ──
    grid: {
        paddingHorizontal: ms(15),
        paddingBottom: vs(20),
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        marginBottom: ms(12),
        paddingTop: ms(18),
        paddingBottom: ms(14),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardImage: {
        width: '60%',
        height: ms(80),
        alignSelf: 'center',
        borderRadius: ms(12),
        backgroundColor: '#F1F5F9',
    },
    cardFooter: {
        alignItems: 'center',
        marginTop: vs(10),
    },
    cardPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(4),
        backgroundColor: '#EFEFEF',
        borderRadius: ms(20),
        paddingHorizontal: ms(14),
        paddingVertical: vs(5),
    },
    cardName: {
        fontSize: ms(13),
        fontWeight: '600',
        color: blackColor,
    },

    // ── Empty ──
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
