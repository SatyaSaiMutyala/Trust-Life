import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
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
    whiteColor,
    globalGradient,
} from '../../utils/globalColors';
import { ms, vs } from 'react-native-size-matters';

const LAB_REPORTS = [
    { id: '1', name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
    { id: '2', name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
    { id: '3', name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
    { id: '4', name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
    { id: '5', name: 'Suresh Kumar', date: 'Mon, Nov 10, 2025, 12:44:35' },
];

const LabReports = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const date = route.params?.date || '';

    const renderItem = ({ item }) => (
        <View style={styles.reportCard}>
            <View style={styles.docIconWrap}>
                <Icon
                    type={Icons.Ionicons}
                    name="document-text-outline"
                    color="#9CA3AF"
                    size={ms(26)}
                />
            </View>
            <View style={styles.reportInfo}>
                <Text style={styles.reportName}>{item.name}</Text>
                <Text style={styles.reportDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
                <Icon
                    type={Icons.Feather}
                    name="download"
                    color="#6B7280"
                    size={ms(20)}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.15]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name="arrow-back"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>Lab Reports</Text>
                        <Text style={styles.headerDate}>{date}</Text>
                    </View>
                </View>

                {/* Report List */}
                <FlatList
                    data={LAB_REPORTS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },

    // Header
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
    headerTextWrap: {
        marginLeft: ms(12),
    },
    headerTitle: {
        fontFamily: bold,
        fontSize: ms(18),
        color: whiteColor,
    },
    headerDate: {
        fontFamily: regular,
        fontSize: ms(12),
        color: whiteColor,
        marginTop: vs(2),
    },

    // List
    listContent: {
        paddingHorizontal: ms(20),
        paddingTop: vs(20),
        paddingBottom: vs(30),
    },

    // Report Card
    reportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: ms(14),
        paddingHorizontal: ms(14),
        paddingVertical: vs(10),
        marginBottom: vs(12),
    },
    docIconWrap: {
        width: ms(44),
        height: ms(44),
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    reportName: {
        fontFamily: bold,
        fontSize: ms(14),
        color: blackColor,
    },
    reportDate: {
        fontFamily: regular,
        fontSize: ms(11),
        color: '#6B7280',
        marginTop: vs(3),
    },
    downloadButton: {
        width: ms(36),
        height: ms(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LabReports;
