import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const MedicalRecordsShimmer = ({ activeTab = 'Lab' }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const ReportItemShimmer = () => (
        <View style={styles.reportItem}>
            <Animated.View style={[styles.reportIcon, { opacity }]} />
            <View style={styles.reportTextContainer}>
                <Animated.View style={[styles.reportTitle, { opacity }]} />
                <Animated.View style={[styles.reportSubtitle, { opacity }]} />
            </View>
            <Animated.View style={[styles.viewButton, { opacity }]} />
        </View>
    );

    // Lab Reports Tab Shimmer
    const renderLabShimmer = () => (
        <View style={styles.labContainer}>
            {/* Search Bar Shimmer */}
            <Animated.View style={[styles.searchBar, { opacity }]} />

            {/* Recent Reports Title Shimmer */}
            <Animated.View style={[styles.sectionTitle, { opacity }]} />

            {/* Report Items Shimmer */}
            <ReportItemShimmer />
            <ReportItemShimmer />
            <ReportItemShimmer />
            <ReportItemShimmer />
            <ReportItemShimmer />
        </View>
    );

    // Upload Tab Shimmer
    const renderUploadShimmer = () => (
        <View style={styles.uploadContainer}>
            {/* Family Members Row Shimmer */}
            <View style={styles.membersRow}>
                <Animated.View style={[styles.addReportBtn, { opacity }]} />
                <Animated.View style={[styles.memberChip, { opacity }]} />
                <Animated.View style={[styles.memberChip, { opacity }]} />
                <Animated.View style={[styles.memberChip, { opacity }]} />
            </View>

            {/* Section Title Shimmer */}
            <Animated.View style={[styles.sectionTitle, { opacity }]} />

            {/* Report Items Shimmer */}
            <ReportItemShimmer />
            <ReportItemShimmer />
            <ReportItemShimmer />
            <ReportItemShimmer />
        </View>
    );

    return activeTab === 'Lab' ? renderLabShimmer() : renderUploadShimmer();
};

const styles = StyleSheet.create({
    labContainer: {
        flex: 1,
        paddingTop: vs(15),
    },
    uploadContainer: {
        flex: 1,
        paddingTop: vs(15),
    },
    searchBar: {
        height: vs(45),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(10),
        marginBottom: vs(20),
    },
    sectionTitle: {
        width: ms(120),
        height: vs(20),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(15),
    },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        padding: ms(15),
        marginBottom: vs(10),
    },
    reportIcon: {
        width: ms(40),
        height: ms(40),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(10),
    },
    reportTextContainer: {
        flex: 1,
        marginLeft: ms(15),
    },
    reportTitle: {
        width: '60%',
        height: vs(16),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
        marginBottom: vs(6),
    },
    reportSubtitle: {
        width: '80%',
        height: vs(12),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(4),
    },
    viewButton: {
        width: ms(60),
        height: vs(32),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(20),
        marginLeft: ms(10),
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(20),
    },
    addReportBtn: {
        width: ms(100),
        height: vs(38),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(20),
        marginRight: ms(10),
    },
    memberChip: {
        width: ms(70),
        height: vs(38),
        backgroundColor: '#e0e0e0',
        borderRadius: ms(20),
        marginRight: ms(8),
    },
});

export default MedicalRecordsShimmer;
