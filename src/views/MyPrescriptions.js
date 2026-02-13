// import React, { useState, useEffect } from 'react';
// import {
//     StyleSheet,
//     View,
//     SafeAreaView,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     Platform,
//     Dimensions,
//     Image,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { connect } from 'react-redux';
// import { StatusBar2 } from '../components/StatusBar';
// import Loader from '../components/Loader';
// import Icon, { Icons } from '../components/Icons';
// import { bold, prescription, regular } from '../config/Constants';
// import { s,ms, vs } from 'react-native-size-matters';
// import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { height } = Dimensions.get('window');
// // const insets = useSafeAreaInsets();
// // const hasBottomOverlap = insets.bottom > 20;

// /* ---------------- Search Bar ---------------- */
// const CustomSearchBar = ({ placeholder, value, onChangeText, onCalendarPress }) => (
//     <View style={styles.searchBarContainer}>
//         <View style={styles.searchInputWrapper}>
//             <Icon type={Icons.Feather} name="search" size={ms(18)} color="#A0A0A0" />
//             <TextInput
//                 style={styles.searchInput}
//                 placeholder={placeholder}
//                 placeholderTextColor="#A0A0A0"
//                 onChangeText={onChangeText}
//                 value={value}
//             />
//         </View>
//         <TouchableOpacity style={styles.calendarIconWrapper} onPress={onCalendarPress}>
//             <Icon type={Icons.Feather} name="calendar" size={ms(20)} color="#A0A0A0" />
//         </TouchableOpacity>
//     </View>
// );

// /* ---------------- Screen ---------------- */
// const Prescriptions = () => {
//     const navigation = useNavigation();
//     const [loading, setLoading] = useState(false);
//     const [searchText, setSearchText] = useState('');
//     const [prescriptions] = useState([]);

//     const EmptyState = () => (
//         <View style={styles.emptyContainer}>
//             <View style={styles.emptyIconWrapper}>
//                 <Icon type={Icons.Feather} name="file-text" size={ms(40)} color={primaryColor} />
//             </View>
//             <Text style={styles.emptyTitle}>No Prescriptions uploaded</Text>
//             <Text style={styles.emptySubtitle}>
//                 Upload your prescription and we'll suggest the right tests for you.
//             </Text>
//         </View>
//     );

//     const PrescriptionList = () => (
//         <View style={styles.prescriptionContainer}>
//             <Text style={styles.sectionTitle}>Recently Prescription</Text>

//             {[1, 2, 3, 4, 5].map((_, index) => (
//                 <View key={index} style={styles.card}>
//                     <View style={styles.rxIcon}>
//                         <Image source={prescription} style={{ width: s(60), height: vs(60) }} />
//                     </View>

//                     <View style={styles.cardContent}>
//                         <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
//                             <Text style={styles.patientName} numberOfLines={1} ellipsizeMode='tail'>Ramesh Kumar</Text>
//                             <Text style={styles.dateText}>Uploaded 14 Nov 25</Text>
//                         </View>
//                         <Text style={styles.patientInfo}>Male | 24 Years</Text>

//                         <View style={styles.actionRow}>
//                             <TouchableOpacity style={styles.deleteBtn}>
//                                 <Icon type={Icons.Feather} name="trash-2" size={ms(14)} color={primaryColor} />
//                                 <Text style={{ fontSize: ms(10), marginLeft: ms(5) }}>Delete</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.viewBtn}>
//                                 <Icon type={Icons.Feather} name="file-text" size={ms(14)} color={primaryColor} />
//                                 <Text style={{ fontSize: ms(10), marginLeft: ms(5) }}>View Prescription</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                 </View>
//             ))}
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar2 />
//             <Loader visible={loading} />

//             {/* ✅ Gradient only wraps header + search */}
//             <LinearGradient colors={globalGradient} style={styles.gradientHeader}>
//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                         <Icon type={Icons.Feather} name="arrow-left" color={whiteColor} size={ms(22)} />
//                     </TouchableOpacity>
//                     <Text style={styles.headerTitle}>Prescriptions</Text>
//                 </View>

//                 <View style={styles.searchBarWrapper}>
//                     <CustomSearchBar
//                         placeholder="Search with name"
//                         value={searchText}
//                         onChangeText={setSearchText}
//                         onCalendarPress={() => { }}
//                     />
//                 </View>
//             </LinearGradient>

//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.scrollViewContent}
//             >
//                 {prescriptions.length === 1 ? <EmptyState /> : <PrescriptionList />}
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// /* ---------------- Styles ---------------- */
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: whiteColor,
//     },

//     gradientHeader: {
//         paddingHorizontal: ms(20),
//         paddingTop: ms(50),
//         paddingBottom: vs(20),
//     },

//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },

//     backButton: {
//         width: ms(35),
//         height: ms(35),
//         borderRadius: ms(17.5),
//         backgroundColor: 'rgba(255,255,255,0.3)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     headerTitle: {
//         color: whiteColor,
//         fontFamily: bold,
//         fontSize: ms(18),
//         marginLeft: ms(10),
//     },


//     searchBarWrapper: {
//         paddingHorizontal: ms(15),
//         marginTop: ms(20),
//         marginBottom: ms(10),
//         width: '100%',
//         zIndex: 2,
//     },
//     searchBarContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: whiteColor,
//         borderRadius: ms(10),
//         height: vs(45),
//         elevation: 5,
//         shadowColor: blackColor,
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.15,
//         shadowRadius: 3.84,
//     },
//     searchInputWrapper: {
//         flexDirection: 'row',
//         flex: 1,
//         alignItems: 'center',
//         paddingLeft: ms(15),
//     },
//     searchIcon: {
//         marginRight: ms(10),
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: ms(14),
//         color: blackColor,
//         paddingVertical: 0,
//         fontFamily: regular,
//         height: '100%',
//     },
//     calendarIconWrapper: {
//         paddingHorizontal: ms(15),
//         height: '100%',
//         justifyContent: 'center',
//         borderLeftWidth: ms(1),
//         borderColor: '#E5E5E5',
//     },

//     scrollViewContent: {
//         paddingHorizontal: ms(25),
//         paddingTop: vs(5),
//     },

//     emptyContainer: {
//         alignItems: 'center',
//         marginTop: vs(40),
//         paddingHorizontal: ms(40),
//     },

//     emptyIconWrapper: {
//         width: ms(80),
//         height: ms(80),
//         borderRadius: ms(40),
//         borderWidth: 1,
//         borderColor: primaryColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: vs(20),
//     },

//     emptyTitle: {
//         fontFamily: bold,
//         fontSize: ms(16),
//         marginBottom: ms(8),
//     },

//     emptySubtitle: {
//         fontFamily: regular,
//         fontSize: ms(12),
//         color: '#999',
//         textAlign: 'center',
//     },

//     /* --- Cards unchanged --- */
//     prescriptionContainer: {
//         marginBottom: ms(50),
//     },
//     sectionTitle: { fontFamily: bold, fontSize: ms(14), marginBottom: vs(20), color: blackColor },

//     card: {
//         flexDirection: 'row',
//         backgroundColor: whiteColor,
//         borderRadius: ms(12),
//         padding: ms(12),
//         marginBottom: vs(12),
//         elevation: 3,
//         alignItems: 'center',
//     },

//     rxIcon: {
//         width: ms(45),
//         height: ms(45),
//         borderRadius: ms(10),
//         borderWidth: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: ms(10),
//     },

//     rxText: { fontFamily: bold, fontSize: ms(16) },
//     cardContent: { flex: 1 },

//     patientName: { fontFamily: bold, fontSize: ms(14) },
//     patientInfo: { fontSize: ms(12), color: '#777' },

//     actionRow: { flexDirection: 'row', marginTop: vs(8) },

//     deleteBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderRadius: ms(20),
//         paddingHorizontal: ms(10),
//         paddingVertical: ms(5),
//         borderColor:primaryColor
//     },

//     viewBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: primaryColor,
//         borderRadius: ms(20),
//         paddingHorizontal: ms(10),
//         marginLeft: ms(8),
//         paddingVertical: ms(5)
//     },
//     dateText: { fontSize: ms(10), color: '#999', },
// });

// export default connect()(Prescriptions);










import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image,
    Modal, // 👈 Import Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { StatusBar2 } from '../components/StatusBar';
import Loader from '../components/Loader';
import Icon, { Icons } from '../components/Icons';
import { bold, noprescription, prescription, regular } from '../config/Constants';
import { s, ms, vs } from 'react-native-size-matters';
import { blackColor, globalGradient, primaryColor, whiteColor } from '../utils/globalColors';

const { height } = Dimensions.get('window');

const PRESCRIPTION_SAMPLE = require('.././assets/img/prescription_sample.png');

const CustomSearchBar = ({ placeholder, value, onChangeText, onCalendarPress }) => (
    <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
            <Icon type={Icons.Feather} name="search" size={ms(18)} color="#A0A0A0" />
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#A0A0A0"
                onChangeText={onChangeText}
                value={value}
            />
        </View>
        <TouchableOpacity style={styles.calendarIconWrapper} onPress={onCalendarPress}>
            <Icon type={Icons.Feather} name="calendar" size={ms(20)} color="#A0A0A0" />
        </TouchableOpacity>
    </View>
);

const PrescriptionModal = ({ isVisible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image
                        source={PRESCRIPTION_SAMPLE}
                        style={styles.prescriptionImage}
                        resizeMode="contain"
                    />

                    {/* Close Button matching the screenshot design */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <View style={styles.iconCircle}>
                            <Icon type={Icons.Feather} name="x" size={ms(24)} color={blackColor} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

/* ---------------- Screen ---------------- */
const Prescriptions = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [prescriptions] = useState([]);
    // State to manage modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleViewPrescription = () => {
        setIsModalVisible(true);
    };

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
                <Image source={noprescription} style={{ width: 100, height: 100 }} resizeMode='contain' />
            </View>
            <Text style={styles.emptyTitle}>No Prescriptions uploaded</Text>
            <Text style={styles.emptySubtitle}>
                Upload your prescription and we'll suggest the right tests for you.
            </Text>
        </View>
    );

    const PrescriptionList = () => (
        <View style={styles.prescriptionContainer}>
            <Text style={styles.sectionTitle}>Recently Prescription</Text>

            {[1, 2, 3, 4, 5].map((_, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.rxIcon}>
                        <Image source={prescription} style={{ width: s(60), height: vs(60) }} />
                    </View>

                    <View style={styles.cardContent}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.patientName} numberOfLines={1} ellipsizeMode='tail'>Ramesh Kumar</Text>
                            <Text style={styles.dateText}>Uploaded 14 Nov 25</Text>
                        </View>
                        <Text style={styles.patientInfo}>Male | 24 Years</Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.deleteBtn}>
                                <Icon type={Icons.Feather} name="trash-2" size={ms(14)} color={primaryColor} />
                                <Text style={{ fontSize: ms(10), marginLeft: ms(5) }}>Delete</Text>
                            </TouchableOpacity>

                            {/* Updated TouchableOpacity to open the modal */}
                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={handleViewPrescription}
                            >
                                <Icon type={Icons.Feather} name="file-text" size={ms(14)} color={primaryColor} />
                                <Text style={{ fontSize: ms(10), marginLeft: ms(5) }}>View Prescription</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />
            <Loader visible={loading} />

            <LinearGradient colors={globalGradient} style={styles.gradientHeader}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon type={Icons.Feather} name="arrow-left" color={whiteColor} size={ms(22)} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Prescriptions</Text>
                </View>

                <View style={styles.searchBarWrapper}>
                    <CustomSearchBar
                        placeholder="Search with name"
                        value={searchText}
                        onChangeText={setSearchText}
                        onCalendarPress={() => { }}
                    />
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {prescriptions.length === 0 ? <EmptyState /> : <PrescriptionList />}
            </ScrollView>

            {/* Prescription Modal Component */}
            <PrescriptionModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </SafeAreaView>
    );
};

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },

    gradientHeader: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(20),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(18),
        marginLeft: ms(10),
    },

    searchBarWrapper: {
        paddingHorizontal: ms(15),
        marginTop: ms(20),
        marginBottom: ms(10),
        width: '100%',
        zIndex: 2,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        height: vs(45),
        elevation: 5,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        paddingLeft: ms(15),
    },
    searchIcon: {
        marginRight: ms(10),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: 0,
        fontFamily: regular,
        height: '100%',
    },
    calendarIconWrapper: {
        paddingHorizontal: ms(15),
        height: '100%',
        justifyContent: 'center',
        borderLeftWidth: ms(1),
        borderColor: '#E5E5E5',
    },

    scrollViewContent: {
        paddingHorizontal: ms(25),
        paddingTop: vs(5),
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: vs(40),
        paddingHorizontal: ms(40),
    },

    emptyIconWrapper: {
        // width: ms(80),
        // height: ms(80),
        // borderRadius: ms(40),
        // borderWidth: 1,
        // borderColor: primaryColor,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginBottom: vs(20),
    },

    emptyTitle: {
        fontFamily: bold,
        fontSize: ms(16),
        marginBottom: ms(8),
    },

    emptySubtitle: {
        fontFamily: regular,
        fontSize: ms(12),
        color: '#999',
        textAlign: 'center',
    },

    /* --- Prescription Cards --- */
    prescriptionContainer: {
        marginBottom: ms(50),
    },
    sectionTitle: { fontFamily: bold, fontSize: ms(14), marginBottom: vs(20), color: blackColor },

    card: {
        flexDirection: 'row',
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        padding: ms(12),
        marginBottom: vs(12),
        elevation: 3,
        alignItems: 'center',
    },

    rxIcon: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(10),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(10),
    },

    rxText: { fontFamily: bold, fontSize: ms(16) },
    cardContent: { flex: 1 },

    patientName: { fontFamily: bold, fontSize: ms(14) },
    patientInfo: { fontSize: ms(12), color: '#777' },

    actionRow: { flexDirection: 'row', marginTop: vs(8) },

    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: ms(20),
        paddingHorizontal: ms(10),
        paddingVertical: ms(5),
        borderColor: primaryColor
    },

    viewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: primaryColor,
        borderRadius: ms(20),
        paddingHorizontal: ms(10),
        marginLeft: ms(8),
        paddingVertical: ms(5)
    },
    dateText: { fontSize: ms(10), color: '#999', },

    /* --- Modal Styles (New) --- */
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        width: '90%',
        height: '70%',
        borderRadius: ms(15),
        overflow: 'hidden',
    },
    prescriptionImage: {
        width: '100%',
        height: '100%',
        backgroundColor: whiteColor,
        borderRadius: ms(15),
    },
    closeButton: {
        position: 'absolute',
        top: -ms(5),
        left: '42%',
        // left:ms(10),
        width: ms(55),
        height: ms(55),
        borderRadius: ms(26.5),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        // backgroundColor:whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconCircle: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),     // perfectly circular
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',

        // optional polish
        elevation: 4,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

});

export default connect()(Prescriptions);